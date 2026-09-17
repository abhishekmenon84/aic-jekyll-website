/**
 * 1. GitHub OAuth proxy for Decap CMS.
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
 */

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_USERS: string; // comma-separated GitHub usernames, case-insensitive
  GITHUB_REPO_TOKEN: string; // fine-grained PAT, Contents: Read & write, this repo only
  GITHUB_REPO: string; // "owner/repo"
}

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";
const ALLOWED_ORIGIN = "https://aicfred.org";

interface BusinessSubmission {
  owner_name: string;
  name: string;
  description: string;
  phone: string;
  whatsapp: string;
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

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function randomState(): string {
  return crypto.randomUUID();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/submit-business") {
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders() });
      }
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
      }
      return handleSubmitBusiness(request, env);
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
      const cookieState = cookie.match(/oauth_state=([^;]+)/)?.[1];

      if (!code || !state || !cookieState || state !== cookieState) {
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
        return new Response(
          renderPostMessage({
            error: "not_authorized",
            error_description:
              "This GitHub account is not on the AIC admin allowlist.",
          }),
          { headers: { "Content-Type": "text/html" } }
        );
      }

      return new Response(
        renderPostMessage({ token: tokenData.access_token, provider: "github" }),
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleSubmitBusiness(request: Request, env: Env): Promise<Response> {
  let body: BusinessSubmission;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders() });
  }

  const required: (keyof BusinessSubmission)[] = ["owner_name", "name", "description", "phone", "category"];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      return new Response(`Missing required field: ${field}`, { status: 400, headers: corsHeaders() });
    }
  }

  // Basic length caps so a malicious payload can't blow up the repo/commit.
  const cap = (s: string, max: number) => s.slice(0, max).trim();
  const owner_name = cap(body.owner_name, 100);
  const name = cap(body.name, 100);
  const description = cap(body.description, 1000);
  const phone = cap(body.phone, 60);
  const whatsapp = cap(body.whatsapp || "", 20).replace(/[^0-9]/g, "");
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
    `owner_name: ${yamlString(owner_name)}`,
    `description: ${yamlString(description)}`,
    `hst_number: ${yamlString(hst_number)}`,
    `status: pending`,
    `submitted_at: ${yamlString(submitted_at)}`,
    "---",
    "",
  ].join("\n");

  const apiUrl = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`;
  const commitRes = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${env.GITHUB_REPO_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "aic-cms-oauth-worker",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `New pending business submission: ${name}`,
      content: btoa(unescape(encodeURIComponent(frontMatter))),
      branch: "dev",
    }),
  });

  if (!commitRes.ok) {
    const errText = await commitRes.text();
    return new Response(`Failed to submit: ${errText}`, { status: 502, headers: corsHeaders() });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
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
