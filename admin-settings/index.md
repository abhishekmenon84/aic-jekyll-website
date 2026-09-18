---
layout: default
title: Admin Settings
description: "AIC admin settings — moderator credential management."
permalink: /admin-settings/
extra_head: '<meta name="robots" content="noindex, nofollow" />'
---

<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">Admin Only</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Admin Settings
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      Manage the moderator account.
    </p>
  </div>
</div>

<section class="py-16 px-6">
  <div class="max-w-md mx-auto">

    <div id="as-login" class="bg-white border border-stone-200 rounded-3xl p-8 shadow-xl text-center reveal">
      <h2 class="text-lg font-bold mb-2" style="font-family:'Playfair Display',serif;">Admin Login Required</h2>
      <p class="text-stone-500 text-sm mb-5">Log in with your GitHub admin account to continue.</p>
      <a href="https://aic-cms-oauth.egressiq.workers.dev/admin/auth" class="btn-saffron w-full inline-block">Login with GitHub →</a>
    </div>

    <div id="as-settings" class="hidden bg-white border border-stone-200 rounded-3xl p-8 shadow-xl reveal">
      <h2 class="text-lg font-bold mb-2 text-center" style="font-family:'Playfair Display',serif;">Change Moderator Credentials</h2>
      <p class="text-stone-500 text-sm mb-5 text-center">
        This sets the username and password the moderator uses to log in at
        <a href="{{ '/team-login/' | relative_url }}" style="color:var(--saffron-dark);">/team-login/</a>.
        For security, this page cannot apply the change automatically — it
        generates the exact commands to run in a terminal (or hand to a
        developer) to finish applying it.
      </p>

      <form id="as-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">New Username</label>
          <input type="text" id="as-username" required class="form-input" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">New Password</label>
          <input type="password" id="as-password" required minlength="8" class="form-input" />
          <p class="text-xs text-stone-400 mt-1">At least 8 characters.</p>
        </div>
        <button type="submit" class="w-full btn-saffron py-3 rounded-lg text-sm font-semibold tracking-wide">
          Generate Update Commands
        </button>
        <div id="as-error" class="hidden mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center"></div>
      </form>

      <div id="as-success" class="hidden mt-6">
        <p class="text-green-700 bg-green-50 border border-green-200 rounded-lg text-sm text-center p-3 mb-4">
          ✓ Commands generated. Run these two in a terminal with access to this project (or send them to a developer) to finish applying the change. Nothing is live until both commands run.
        </p>
        <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">1. Set new username</label>
        <textarea id="as-cmd-username" readonly rows="2" class="form-input mb-3" style="font-family:monospace; font-size:0.78rem;" onclick="this.select()"></textarea>
        <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">2. Set new password hash</label>
        <textarea id="as-cmd-password" readonly rows="2" class="form-input" style="font-family:monospace; font-size:0.78rem;" onclick="this.select()"></textarea>
        <p class="text-xs text-stone-400 mt-2">Run both from the <code>cms-oauth-worker/</code> directory. Each will prompt you to paste the value shown, then press Enter.</p>
      </div>
    </div>

  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const WORKER_BASE = 'https://aic-cms-oauth.egressiq.workers.dev';

  // On redirect back from GitHub login, the Worker hands the token via the
  // URL fragment (never sent to any server) — pick it up once, store it,
  // then scrub it from the visible URL.
  if (window.location.hash.startsWith('#token=')) {
    const token = window.location.hash.slice('#token='.length);
    sessionStorage.setItem('aic_admin_token', token);
    history.replaceState(null, '', window.location.pathname);
  }

  const token = sessionStorage.getItem('aic_admin_token');
  const loginEl = document.getElementById('as-login');
  const settingsEl = document.getElementById('as-settings');

  if (token) {
    loginEl.classList.add('hidden');
    settingsEl.classList.remove('hidden');
  }

  document.getElementById('as-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const successEl = document.getElementById('as-success');
    const errorEl = document.getElementById('as-error');
    successEl.classList.add('hidden');
    errorEl.classList.add('hidden');

    const username = document.getElementById('as-username').value.trim();
    const password = document.getElementById('as-password').value;

    try {
      const res = await fetch(`${WORKER_BASE}/admin/set-moderator-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');

      document.getElementById('as-cmd-username').value =
        `printf '${data.username}' | npx wrangler secret put MODERATOR_USERNAME`;
      document.getElementById('as-cmd-password').value =
        `printf '${data.password_hash}' | npx wrangler secret put MODERATOR_PASSWORD_HASH`;
      successEl.classList.remove('hidden');
      document.getElementById('as-form').reset();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  });
});
</script>
