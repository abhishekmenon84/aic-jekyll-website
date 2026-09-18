---
layout: default
title: Team Login
description: "AIC executive and moderator access."
permalink: /team-login/
extra_head: '<meta name="robots" content="noindex, nofollow" />'
---

<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">Executives Only</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Team Login
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      Access for AIC admins and moderators only. If you don't have credentials, this page isn't for you.
    </p>
  </div>
</div>

<section class="py-16 px-6">
  <div class="max-w-md mx-auto">

    <div class="bg-white border border-stone-200 rounded-3xl p-8 shadow-xl mb-8 text-center reveal">
      <h2 class="text-lg font-bold mb-2" style="font-family:'Playfair Display',serif;">AIC Admin</h2>
      <p class="text-stone-500 text-sm mb-5">Full business directory management via GitHub login.</p>
      <a href="{{ '/admin/' | relative_url }}" class="btn-saffron w-full inline-block">Continue to Admin →</a>
    </div>

    <div class="bg-white border border-stone-200 rounded-3xl p-8 shadow-xl reveal">
      <h2 class="text-lg font-bold mb-2 text-center" style="font-family:'Playfair Display',serif;">AIC Moderator</h2>
      <p class="text-stone-500 text-sm mb-5 text-center">Add or remove businesses from the directory.</p>

      <form id="mod-login-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">Username</label>
          <input type="text" id="ml-username" required autocomplete="username" class="form-input" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">Password</label>
          <input type="password" id="ml-password" required autocomplete="current-password" class="form-input" />
        </div>
        <button type="submit" class="w-full btn-green py-3 rounded-lg text-sm font-semibold tracking-wide">
          Log In
        </button>
        <div id="ml-error" class="hidden mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center"></div>
      </form>
    </div>

  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const WORKER_BASE = 'https://aic-cms-oauth.egressiq.workers.dev';
  const form = document.getElementById('mod-login-form');
  const errorEl = document.getElementById('ml-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.add('hidden');
    const username = document.getElementById('ml-username').value.trim();
    const password = document.getElementById('ml-password').value;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Logging in…';

    try {
      const res = await fetch(`${WORKER_BASE}/moderator/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      sessionStorage.setItem('aic_moderator_token', data.token);
      sessionStorage.setItem('aic_moderator_token_expires', data.expires_at);
      window.location.href = '{{ "/moderator/" | relative_url }}';
    } catch (err) {
      errorEl.textContent = err.message || 'Invalid username or password.';
      errorEl.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Log In';
    }
  });
});
</script>
