---
layout: default
title: Moderator Dashboard
description: "AIC business directory moderation."
permalink: /moderator/
extra_head: '<meta name="robots" content="noindex, nofollow" />'
---

<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">Moderator</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Business Directory
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      Add or remove community business listings.
    </p>
  </div>
</div>

<section class="py-16 px-6">
  <div class="max-w-6xl mx-auto">

    <div id="mod-loading" class="text-center text-stone-400 py-10">Loading…</div>

    <div id="mod-app" class="hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-8 reveal">
        <div class="text-stone-500 text-sm" id="mod-count"></div>
        <div class="flex gap-3">
          <button id="mod-add-btn" class="btn-saffron text-sm px-5 py-2.5">+ Add Business</button>
          <button id="mod-logout-btn" class="btn-outline-white text-sm px-5 py-2.5" style="border-color:#ccc;color:#555;">Log Out</button>
        </div>
      </div>

      <!-- Add Business Form (hidden until toggled) -->
      <div id="mod-add-form-wrap" class="hidden bg-white border border-stone-200 rounded-3xl p-8 shadow-xl mb-10 reveal">
        <h2 class="text-lg font-bold mb-5" style="font-family:'Playfair Display',serif;">Add a Business</h2>
        <form id="mod-add-form" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">Business Name</label>
              <input type="text" id="ma-name" required class="form-input" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">Category</label>
              <select id="ma-category" required class="form-input" style="cursor:pointer;">
                <option value="" disabled selected>Select a category…</option>
                <option>Auto Repair &amp; Auto Detailing</option>
                <option>Auto Sales</option>
                <option>Cakes &amp; Bakery</option>
                <option>Children's Tutoring Service</option>
                <option>Driving Instructor</option>
                <option>Event Organizers / Decorations</option>
                <option>Food Packaging Supplies</option>
                <option>Gym Personal Trainer &amp; Dietitian</option>
                <option>Heena (Mehandi)</option>
                <option>Home Cleaning</option>
                <option>Home Security &amp; Cameras</option>
                <option>Homeopathy Specialist</option>
                <option>Immigration Service Providers</option>
                <option>Indian Artificial Jewellery</option>
                <option>Indian Convenience Stores</option>
                <option>Indian Food Tiffin Service</option>
                <option>Indian Pizza Stores</option>
                <option>Indian Restaurant</option>
                <option>Laptop / Desktop Repair</option>
                <option>Lawn Mowing &amp; Landscaping</option>
                <option>Medical Appointments (Work Permit)</option>
                <option>Notary &amp; Commissioner of Oaths</option>
                <option>Packers and Movers</option>
                <option>Photography &amp; Content Creation</option>
                <option>Printing (Banners/Signs/Labels)</option>
                <option>Realtors</option>
                <option>Renovation / Handyman / Paint / Plumber / Electrician</option>
                <option>Salon / Barber (Kids, Men &amp; Women)</option>
                <option>Software Solutions</option>
                <option>Stitching and Alterations</option>
                <option>Tax, Finance, Insurance &amp; Accounting</option>
                <option>US Visa Appointment</option>
                <option>Web App / Website Design &amp; Development</option>
                <option>Grocery &amp; Retail</option>
                <option>Government Services</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">Description</label>
            <textarea id="ma-description" rows="2" class="form-input"></textarea>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">Owner's Name</label>
              <input type="text" id="ma-owner" class="form-input" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">Phone</label>
              <input type="tel" id="ma-phone" class="form-input" />
            </div>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">WhatsApp Number</label>
              <input type="tel" id="ma-whatsapp" class="form-input" placeholder="15061234567" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">Website</label>
              <input type="url" id="ma-website" class="form-input" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-500 uppercase mb-1">HST/GST Number</label>
            <input type="text" id="ma-hst" class="form-input" />
          </div>
          <div class="flex gap-3">
            <button type="submit" class="btn-saffron px-6 py-2.5 text-sm">Add Business</button>
            <button type="button" id="mod-cancel-add" class="text-sm text-stone-500 underline">Cancel</button>
          </div>
          <div id="ma-error" class="hidden p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"></div>
        </form>
      </div>

      <div id="mod-list"></div>
    </div>

  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const WORKER_BASE = 'https://aic-cms-oauth.egressiq.workers.dev';
  const token = sessionStorage.getItem('aic_moderator_token');
  const expiresAt = parseInt(sessionStorage.getItem('aic_moderator_token_expires') || '0', 10);

  if (!token || Date.now() / 1000 > expiresAt) {
    sessionStorage.removeItem('aic_moderator_token');
    sessionStorage.removeItem('aic_moderator_token_expires');
    window.location.href = '{{ "/team-login/" | relative_url }}';
    return;
  }

  const loadingEl = document.getElementById('mod-loading');
  const appEl = document.getElementById('mod-app');
  const listEl = document.getElementById('mod-list');
  const countEl = document.getElementById('mod-count');

  async function api(method, path, body) {
    const res = await fetch(`${WORKER_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  function rowHTML(b) {
    return `<div class="value-card flex items-center justify-between gap-4" style="padding:16px 20px;">
      <div class="min-w-0 flex-1">
        <div class="font-semibold text-sm">${b.name || '(unnamed)'}</div>
        <div class="text-stone-400 text-xs">${b.category || ''} · <span class="uppercase font-semibold" style="color:${b.status === 'approved' ? 'var(--green)' : 'var(--saffron-dark)'};">${b.status || 'unknown'}</span></div>
      </div>
      <button class="mod-delete-btn text-xs font-semibold text-red-600 hover:text-red-800 flex-shrink-0" data-path="${b.path}" data-name="${(b.name || '').replace(/"/g, '&quot;')}">Delete</button>
    </div>`;
  }

  async function loadList() {
    const data = await api('GET', '/moderator/businesses');
    const businesses = data.businesses.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    countEl.textContent = `${businesses.length} businesses`;
    listEl.innerHTML = `<div class="space-y-2">${businesses.map(rowHTML).join('')}</div>`;

    listEl.querySelectorAll('.mod-delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm(`Delete "${btn.dataset.name}"? This cannot be undone.`)) return;
        btn.disabled = true;
        btn.textContent = 'Deleting…';
        try {
          await api('DELETE', '/moderator/businesses', { path: btn.dataset.path });
          await loadList();
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
          btn.textContent = 'Delete';
        }
      });
    });
  }

  document.getElementById('mod-logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('aic_moderator_token');
    sessionStorage.removeItem('aic_moderator_token_expires');
    window.location.href = '{{ "/team-login/" | relative_url }}';
  });

  const addFormWrap = document.getElementById('mod-add-form-wrap');
  document.getElementById('mod-add-btn').addEventListener('click', () => addFormWrap.classList.remove('hidden'));
  document.getElementById('mod-cancel-add').addEventListener('click', () => addFormWrap.classList.add('hidden'));

  document.getElementById('mod-add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('ma-error');
    errorEl.classList.add('hidden');

    const payload = {
      name: document.getElementById('ma-name').value.trim(),
      category: document.getElementById('ma-category').value,
      description: document.getElementById('ma-description').value.trim(),
      owner_name: document.getElementById('ma-owner').value.trim(),
      phone: document.getElementById('ma-phone').value.trim(),
      whatsapp: document.getElementById('ma-whatsapp').value.trim(),
      website: document.getElementById('ma-website').value.trim(),
      hst_number: document.getElementById('ma-hst').value.trim(),
    };

    try {
      await api('POST', '/moderator/businesses', payload);
      document.getElementById('mod-add-form').reset();
      addFormWrap.classList.add('hidden');
      await loadList();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  });

  loadList()
    .then(() => {
      loadingEl.classList.add('hidden');
      appEl.classList.remove('hidden');
    })
    .catch((err) => {
      loadingEl.textContent = `Failed to load: ${err.message}`;
    });
});
</script>
