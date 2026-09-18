/**
 * 1. GitHub OAuth proxy for Decap CMS (admin login).
 *
 * Decap CMS (the /admin/ editor on aicfred.org) needs a GitHub access token
 * to read/write repo files as the logged-in user. GitHub's OAuth flow
 * requires a server-side step to exchange the auth code for a token using
 * a client secret — a static site can't do that itself, hence this Worker.
 *
 * Flow (Decap's expected protocol — do not change the message shape):
 *   1. GET  /auth            -> redirect to GitHub's authorize screen
 *   2. GET  /callback?code=… -> exchange code for token, postMessage back
 *      to the opener window in the exact format Decap's github backend
 *      listens for.
 *
 * 2. Public business submission endpoint.
 *
 * The Information Center's "add your business" form has no login — it
 * POSTs here, and this Worker uses a repo-scoped GitHub PAT (never exposed
 * to the browser) to commit a new file under _businesses/ with
 * status: pending. Executives then approve/reject it from the CMS.
 *
 * 3. Moderator login (username/password, no self-signup).
 *
 * A single fixed moderator account (no signup flow anywhere) can log in at
 * /team-login/ with a username + password, then add/delete businesses
 * directly from /moderator/ without needing a GitHub account. Credentials
 * are verified against a salted PBKDF2 hash stored as a Worker secret —
 * the plaintext password is never stored anywhere. A successful login
 * returns a short-lived, HMAC-signed bearer token (not a cookie, since the
 * moderator page and this Worker are different origins and third-party
 * cookies are unreliable) that the moderator page holds in sessionStorage
 * and sends as `Authorization: Bearer <token>` on every request.
 *
 * 4. Admin settings (change moderator credentials).
 *
 * A parallel GitHub OAuth entry point (/admin/auth, /admin/callback) — not
 * the Decap-specific /auth, /callback above — lets an allowlisted admin get
 * a bearer token (same signing scheme as the moderator token, role: admin)
 * for the /admin-settings/ page, where they can set a new moderator
 * username/password without asking a developer to run a CLI command.
 */

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_USERS: string; // comma-separated GitHub usernames, case-insensitive
  GITHUB_REPO_TOKEN: string; // fine-grained PAT, Contents: Read & write, this repo only
  GITHUB_REPO: string; // "owner/repo"
  MODERATOR_USERNAME: string;
  MODERATOR_PASSWORD_HASH: string; // "<saltHex>:<hashHex>", PBKDF2-SHA256, 100000 iterations
  SESSION_SECRET: string; // HMAC signing key for bearer tokens
}

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";
const ALLOWED_ORIGIN = "https://aicfred.org";
const CONTENT_BRANCH = "main";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

interface BusinessSubmission {
  owner_name: string;
  name: string;
  description: string;
  phone: string;
  whatsapp: string;
  website: string;
  hst_number: string;
  category: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function yamlString(value: string): string {
  // Single-quoted YAML scalar; escape embedded single quotes by doubling them.
  return `'${value.replace(/'/g, "''")}'`;
}

// Origin is reflected from a fixed allowlist rather than hardcoded, so local
// Jekyll dev servers can exercise the real Worker during testing. This is
// not a security boundary — CORS only affects browser fetches; actual
// authorization is enforced by the bearer-token checks in each handler.
const ALLOWED_ORIGINS = [ALLOWED_ORIGIN, "http://localhost:4000"];

function corsHeaders(methods: string, request?: Request): HeadersInit {
  const requestOrigin = request?.headers.get("Origin");
  const allowOrigin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": `${methods}, OPTIONS`,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

function randomState(): string {
  return crypto.randomUUID();
}

/* ── Crypto helpers (Web Crypto only — no external deps) ── */

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeString(s: string): string {
  return base64UrlEncode(new TextEncoder().encode(s));
}

function base64UrlDecodeToString(s: string): string {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + ((4 - (s.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function pbkdf2Hex(password: string, saltHex: string, iterations = 100000): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(saltHex), iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;
  const computed = await pbkdf2Hex(password, saltHex);
  return timingSafeEqual(computed, hashHex);
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64UrlEncode(new Uint8Array(sig));
}

interface SessionPayload {
  role: "moderator" | "admin";
  exp: number;
}

async function createToken(payload: SessionPayload, secret: string): Promise<string> {
  const payloadB64 = base64UrlEncodeString(JSON.stringify(payload));
  const sig = await hmacSign(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

async function verifyToken(token: string, secret: string): Promise<SessionPayload | null> {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  const expectedSig = await hmacSign(payloadB64, secret);
  if (!timingSafeEqual(sig, expectedSig)) return null;
  try {
    const payload: SessionPayload = JSON.parse(base64UrlDecodeToString(payloadB64));
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

async function requireRole(request: Request, env: Env, role: "moderator" | "admin"): Promise<SessionPayload | null> {
  const auth = request.headers.get("Authorization") || "";
  const match = auth.match(/^Bearer (.+)$/);
  if (!match) return null;
  const payload = await verifyToken(match[1], env.SESSION_SECRET);
  if (!payload) return null;
  // Admins are allowed to do anything moderators can do; moderators cannot use admin-only routes.
  if (role === "moderator" && (payload.role === "moderator" || payload.role === "admin")) return payload;
  if (role === "admin" && payload.role === "admin") return payload;
  return null;
}

/* ── GitHub Contents API helpers ── */

async function githubGet(path: string, env: Env): Promise<Response> {
  return fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}?ref=${CONTENT_BRANCH}`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_REPO_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "aic-cms-oauth-worker",
    },
  });
}

async function githubPut(path: string, content: string, message: string, env: Env, sha?: string): Promise<Response> {
  return fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${env.GITHUB_REPO_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "aic-cms-oauth-worker",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: CONTENT_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
}

async function githubDelete(path: string, sha: string, message: string, env: Env): Promise<Response> {
  return fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${env.GITHUB_REPO_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "aic-cms-oauth-worker",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sha, branch: CONTENT_BRANCH }),
  });
}

/* ── Minimal YAML front-matter parse/build for _businesses/*.md ── */

function parseFrontMatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  const fields: Record<string, string> = {};
  if (!match) return fields;
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[m[1]] = value;
  }
  return fields;
}

function buildFrontMatter(fields: Record<string, string>): string {
  const lines = ["---"];
  for (const [key, value] of Object.entries(fields)) {
    lines.push(`${key}: ${yamlString(value)}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/submit-business") {
      if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders("POST", request) });
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders("POST", request) });
      return handleSubmitBusiness(request, env);
    }

    if (url.pathname === "/moderator/login") {
      if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders("POST", request) });
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders("POST", request) });
      return handleModeratorLogin(request, env);
    }

    if (url.pathname === "/moderator/businesses") {
      if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
      if (request.method === "GET") return handleListBusinesses(request, env);
      if (request.method === "POST") return handleAddBusiness(request, env);
      if (request.method === "PATCH") return handleUpdateBusinessStatus(request, env);
      if (request.method === "DELETE") return handleDeleteBusiness(request, env);
      return new Response("Method not allowed", { status: 405, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
    }

    if (url.pathname === "/admin/set-moderator-credentials") {
      if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders("POST", request) });
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders("POST", request) });
      return handleSetModeratorCredentials(request, env);
    }

    // Admin settings login — parallel to Decap's /auth flow below, but
    // issues a bearer token + redirect instead of a postMessage handshake.
    //
    // Important: this reuses the SAME /callback endpoint as Decap's flow
    // below (not a separate /admin/callback) because the GitHub OAuth App
    // only has one registered callback URL. Apps created after 2026-08-03
    // default to exact-match redirect_uri validation (no subpath/wildcard
    // matching), so a distinct /admin/callback would be rejected by GitHub
    // with "redirect_uri is not associated with this application." The two
    // flows are distinguished by which state cookie is present when
    // /callback runs — see below.
    if (url.pathname === "/admin/auth") {
      const state = randomState();
      const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
      authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set("scope", "read:user");
      authorizeUrl.searchParams.set("state", state);

      const headers = new Headers({ Location: authorizeUrl.toString() });
      headers.append("Set-Cookie", `admin_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
      return new Response(null, { status: 302, headers });
    }

    if (url.pathname === "/auth") {
      const state = randomState();
      const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
      authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set("scope", "repo,user");
      authorizeUrl.searchParams.set("state", state);

      const response = Response.redirect(authorizeUrl.toString(), 302);
      const headers = new Headers(response.headers);
      headers.append(
        "Set-Cookie",
        `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
      );
      return new Response(null, { status: 302, headers });
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const cookie = request.headers.get("Cookie") || "";
      const decapCookieState = cookie.match(/(?:^|;\s*)oauth_state=([^;]+)/)?.[1];
      const adminCookieState = cookie.match(/(?:^|;\s*)admin_oauth_state=([^;]+)/)?.[1];

      // Which flow triggered this callback? Checked against each flow's own
      // cookie so one flow's state can't be replayed against the other.
      const isAdminSettingsFlow = !!adminCookieState && adminCookieState === state;
      const isDecapFlow = !!decapCookieState && decapCookieState === state;

      if (!code || !state || (!isAdminSettingsFlow && !isDecapFlow)) {
        return new Response("Invalid OAuth state", { status: 400 });
      }

      const tokenRes = await fetch(GITHUB_TOKEN_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData: { access_token?: string; error?: string } = await tokenRes.json();

      if (!tokenData.access_token) {
        if (isAdminSettingsFlow) {
          return new Response(`GitHub login failed: ${tokenData.error || "token_exchange_failed"}`, { status: 401 });
        }
        return new Response(
          renderPostMessage({ error: tokenData.error || "token_exchange_failed" }),
          { headers: { "Content-Type": "text/html" } }
        );
      }

      // Enforce the admin allowlist here — a valid GitHub login is not
      // enough on its own; the user must also be an approved executive.
      const userRes = await fetch(GITHUB_USER_URL, {
        headers: {
          Authorization: `token ${tokenData.access_token}`,
          "User-Agent": "aic-cms-oauth-worker",
        },
      });
      const user: { login?: string } = await userRes.json();
      const allowed = env.ALLOWED_USERS.split(",")
        .map((u) => u.trim().toLowerCase())
        .filter(Boolean);

      if (!user.login || !allowed.includes(user.login.toLowerCase())) {
        if (isAdminSettingsFlow) {
          return new Response("This GitHub account is not on the AIC admin allowlist.", { status: 403 });
        }
        return new Response(
          renderPostMessage({
            error: "not_authorized",
            error_description:
              "This GitHub account is not on the AIC admin allowlist.",
          }),
          { headers: { "Content-Type": "text/html" } }
        );
      }

      if (isAdminSettingsFlow) {
        const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
        const adminToken = await createToken({ role: "admin", exp }, env.SESSION_SECRET);
        // Hand the token to the settings page via a same-origin-safe
        // redirect: the page reads it out of the URL fragment (never sent
        // to any server) and stores it in sessionStorage.
        return Response.redirect(`https://aicfred.org/admin-settings/#token=${adminToken}`, 302);
      }

      return new Response(
        renderPostMessage({ token: tokenData.access_token, provider: "github" }),
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleModeratorLogin(request: Request, env: Env): Promise<Response> {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders("POST", request) });
  }

  if (!body.username || !body.password) {
    return new Response(JSON.stringify({ error: "Missing username or password" }), { status: 400, headers: corsHeaders("POST", request) });
  }

  const usernameMatches = timingSafeEqual(body.username, env.MODERATOR_USERNAME);
  const passwordMatches = await verifyPassword(body.password, env.MODERATOR_PASSWORD_HASH);

  if (!usernameMatches || !passwordMatches) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: corsHeaders("POST", request) });
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = await createToken({ role: "moderator", exp }, env.SESSION_SECRET);

  return new Response(JSON.stringify({ token, expires_at: exp }), {
    status: 200,
    headers: { ...corsHeaders("POST", request), "Content-Type": "application/json" },
  });
}

async function handleListBusinesses(request: Request, env: Env): Promise<Response> {
  const session = await requireRole(request, env, "moderator");
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });

  // Fetching each of ~100+ files individually via the REST Contents API blows
  // past the Worker's per-invocation subrequest limit. The GraphQL API can
  // return an entire directory's filenames AND raw file contents in a single
  // HTTP call, so we use that here instead.
  const [owner, repo] = env.GITHUB_REPO.split("/");
  const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        object(expression: "${CONTENT_BRANCH}:_businesses") {
          ... on Tree {
            entries {
              name
              object {
                ... on Blob { text }
              }
            }
          }
        }
      }
    }
  `;

  const gqlRes = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_REPO_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "aic-cms-oauth-worker",
    },
    body: JSON.stringify({ query }),
  });

  if (!gqlRes.ok) {
    return new Response(JSON.stringify({ error: "Failed to list businesses" }), { status: 502, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  const gqlData: {
    data?: { repository?: { object?: { entries?: { name: string; object?: { text?: string } }[] } } };
    errors?: unknown;
  } = await gqlRes.json();

  const entries = gqlData.data?.repository?.object?.entries || [];
  const businesses = entries
    .filter((e) => e.name.endsWith(".md") && e.object?.text)
    .map((e) => ({ path: `_businesses/${e.name}`, ...parseFrontMatter(e.object!.text!) }));

  return new Response(JSON.stringify({ businesses }), {
    status: 200,
    headers: { ...corsHeaders("GET, POST, PATCH, DELETE", request), "Content-Type": "application/json" },
  });
}

async function handleAddBusiness(request: Request, env: Env): Promise<Response> {
  const session = await requireRole(request, env, "moderator");
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });

  let body: Partial<BusinessSubmission>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  if (!body.name || !body.category) {
    return new Response(JSON.stringify({ error: "Missing required field: name or category" }), { status: 400, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  const cap = (s: string | undefined, max: number) => (s || "").slice(0, max).trim();
  const fields: Record<string, string> = {
    name: cap(body.name, 100),
    category: cap(body.category, 100),
    phone: cap(body.phone, 60),
    whatsapp: cap(body.whatsapp, 20).replace(/[^0-9]/g, ""),
    address: "",
    website: cap(body.website, 200),
    owner_name: cap(body.owner_name, 100),
    description: cap(body.description, 1000),
    hst_number: cap(body.hst_number, 30),
    status: "approved",
    submitted_at: new Date().toISOString().slice(0, 10),
  };

  const slug = `${slugify(fields.name) || "business"}-${Date.now().toString(36)}`;
  const path = `_businesses/${slug}.md`;

  const putRes = await githubPut(path, buildFrontMatter(fields), `Moderator added business: ${fields.name}`, env);
  if (!putRes.ok) {
    const err = await putRes.text();
    return new Response(JSON.stringify({ error: `Failed to add business: ${err}` }), { status: 502, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  return new Response(JSON.stringify({ ok: true, path }), {
    status: 201,
    headers: { ...corsHeaders("GET, POST, PATCH, DELETE", request), "Content-Type": "application/json" },
  });
}

async function handleDeleteBusiness(request: Request, env: Env): Promise<Response> {
  const session = await requireRole(request, env, "moderator");
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });

  let body: { path?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  if (!body.path || !body.path.startsWith("_businesses/") || !body.path.endsWith(".md")) {
    return new Response(JSON.stringify({ error: "Invalid path" }), { status: 400, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  const getRes = await githubGet(body.path, env);
  if (!getRes.ok) {
    return new Response(JSON.stringify({ error: "Business not found" }), { status: 404, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }
  const fileData: { sha: string } = await getRes.json();

  const delRes = await githubDelete(body.path, fileData.sha, `Moderator removed business: ${body.path}`, env);
  if (!delRes.ok) {
    const err = await delRes.text();
    return new Response(JSON.stringify({ error: `Failed to delete business: ${err}` }), { status: 502, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders("GET, POST, PATCH, DELETE", request), "Content-Type": "application/json" },
  });
}

async function handleUpdateBusinessStatus(request: Request, env: Env): Promise<Response> {
  const session = await requireRole(request, env, "moderator");
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });

  let body: { path?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  if (!body.path || !body.path.startsWith("_businesses/") || !body.path.endsWith(".md")) {
    return new Response(JSON.stringify({ error: "Invalid path" }), { status: 400, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }
  if (body.status !== "approved" && body.status !== "pending") {
    return new Response(JSON.stringify({ error: "Status must be 'approved' or 'pending'" }), { status: 400, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  const getRes = await githubGet(body.path, env);
  if (!getRes.ok) {
    return new Response(JSON.stringify({ error: "Business not found" }), { status: 404, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }
  const fileData: { sha: string; content: string } = await getRes.json();
  const currentContent = decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, ""))));
  const fields = parseFrontMatter(currentContent);
  fields.status = body.status;

  const putRes = await githubPut(
    body.path,
    buildFrontMatter(fields),
    `Moderator ${body.status === "approved" ? "approved" : "unapproved"} business: ${fields.name || body.path}`,
    env,
    fileData.sha
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    return new Response(JSON.stringify({ error: `Failed to update status: ${err}` }), { status: 502, headers: corsHeaders("GET, POST, PATCH, DELETE", request) });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders("GET, POST, PATCH, DELETE", request), "Content-Type": "application/json" },
  });
}

async function handleSetModeratorCredentials(request: Request, env: Env): Promise<Response> {
  const session = await requireRole(request, env, "admin");
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders("POST", request) });

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders("POST", request) });
  }

  if (!body.username || !body.password || body.password.length < 8) {
    return new Response(JSON.stringify({ error: "Username and a password of at least 8 characters are required" }), { status: 400, headers: corsHeaders("POST", request) });
  }

  // NOTE: this endpoint computes the new hash but cannot itself persist a
  // Worker secret (Cloudflare secrets are set via wrangler/dashboard, not a
  // runtime API). It returns the values needed so the change can be applied.
  // See /admin-settings/ page copy for the operator-facing explanation.
  const saltHex = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
  const hashHex = await pbkdf2Hex(body.password, saltHex);

  return new Response(
    JSON.stringify({
      ok: true,
      username: body.username,
      password_hash: `${saltHex}:${hashHex}`,
    }),
    { status: 200, headers: { ...corsHeaders("POST", request), "Content-Type": "application/json" } }
  );
}

async function handleSubmitBusiness(request: Request, env: Env): Promise<Response> {
  let body: BusinessSubmission;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders("POST", request) });
  }

  const required: (keyof BusinessSubmission)[] = ["owner_name", "name", "description", "phone", "category"];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      return new Response(`Missing required field: ${field}`, { status: 400, headers: corsHeaders("POST", request) });
    }
  }

  // Basic length caps so a malicious payload can't blow up the repo/commit.
  const cap = (s: string, max: number) => s.slice(0, max).trim();
  const owner_name = cap(body.owner_name, 100);
  const name = cap(body.name, 100);
  const description = cap(body.description, 1000);
  const phone = cap(body.phone, 60);
  const whatsapp = cap(body.whatsapp || "", 20).replace(/[^0-9]/g, "");
  const website = cap(body.website || "", 200);
  const hst_number = cap(body.hst_number || "", 30);
  const category = cap(body.category, 100);

  const baseSlug = slugify(name) || "business";
  const uniqueSuffix = Date.now().toString(36);
  const slug = `${baseSlug}-${uniqueSuffix}`;
  const path = `_businesses/${slug}.md`;
  const submitted_at = new Date().toISOString().slice(0, 10);

  const frontMatter = [
    "---",
    `name: ${yamlString(name)}`,
    `category: ${yamlString(category)}`,
    `phone: ${yamlString(phone)}`,
    `whatsapp: ${yamlString(whatsapp)}`,
    `address: ''`,
    `website: ${yamlString(website)}`,
    `owner_name: ${yamlString(owner_name)}`,
    `description: ${yamlString(description)}`,
    `hst_number: ${yamlString(hst_number)}`,
    `status: pending`,
    `submitted_at: ${yamlString(submitted_at)}`,
    "---",
    "",
  ].join("\n");

  const commitRes = await githubPut(path, frontMatter, `New pending business submission: ${name}`, env);

  if (!commitRes.ok) {
    const errText = await commitRes.text();
    return new Response(`Failed to submit: ${errText}`, { status: 502, headers: corsHeaders("POST", request) });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { ...corsHeaders("POST", request), "Content-Type": "application/json" },
  });
}

function renderPostMessage(result: { token?: string; provider?: string; error?: string; error_description?: string }): string {
  const state = result.token ? "success" : "error";
  const content = result.token
    ? { token: result.token, provider: "github" }
    : { message: result.error_description || result.error };

  // Exact message format Decap CMS's github backend expects:
  // "authorization:github:success:{...}" or "authorization:github:error:{...}"
  const message = `authorization:github:${state}:${JSON.stringify(content)}`;

  return `<!DOCTYPE html><html><body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      ${JSON.stringify(message)},
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body></html>`;
}
