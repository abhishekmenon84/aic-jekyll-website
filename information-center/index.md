---
layout: default
title: Information Center
description: "A community-maintained directory of local businesses and essential services in Fredericton, NB — built for newcomers by AIC Fredericton."
permalink: /information-center/
---

<!-- Page Hero -->
<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">For Newcomers</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Information Center
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      Local businesses and essential services in Fredericton, Oromocto & Woodstock — all in one place.
    </p>
  </div>
</div>

<section class="py-16 px-6">
  <div class="max-w-6xl mx-auto">

    <!-- Disclaimer -->
    <div class="p-6 bg-stone-50 border border-stone-200 rounded-2xl mb-14 reveal">
      <h3 class="font-bold text-sm uppercase tracking-wider text-stone-500 mb-2">⚠ Disclaimer</h3>
      <p class="text-stone-500 text-xs leading-relaxed">
        The Information Center is provided as a free community service by the Association of Indo-Canadians of Fredericton (AIC) for informational purposes only. Listings are submitted by community members or compiled from publicly available sources and reviewed on a best-effort basis before publication. AIC does not own, operate, endorse, warrant, or guarantee the accuracy, quality, licensing, or legitimacy of any business, service, or individual listed here, and is not responsible for any transaction, interaction, dispute, loss, or damage arising from your use of, or reliance on, this information. Contact details may change without notice — please verify directly with the business or agency before relying on any listing. Use of this directory is entirely at your own risk. Inclusion of a listing does not constitute a recommendation or partnership with AIC. AIC reserves the right to edit, decline, or remove any listing at its sole discretion at any time, without notice or liability.
      </p>
    </div>

    <!-- Newcomer Resources -->
    <div class="mb-16">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Getting Started</span>
        <h2 class="section-title" style="font-size:clamp(1.6rem,3.4vw,2.4rem);">Newcomer Resources</h2>
        <div class="divider mx-auto"></div>
        <p class="text-stone-500 text-sm max-w-2xl mx-auto leading-relaxed">
          Settlement support, healthcare, government ID, schools, transit, and emergency contacts —
          the essentials for getting set up in Fredericton.
        </p>
      </div>

      {% for topic in site.data.newcomer_resources %}
      <div class="mb-10 reveal">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-2xl">{{ topic.icon }}</span>
          <h3 class="text-lg font-bold" style="font-family:'Playfair Display',serif; color:var(--charcoal);">{{ topic.topic }}</h3>
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          {% for item in topic.items %}
          <div class="value-card">
            <h4 class="text-base font-semibold mb-1.5">{{ item.name }}</h4>
            <p class="text-stone-500 text-sm leading-relaxed mb-3">{{ item.description }}</p>
            {% if item.address and item.address != "" %}
            <div class="flex items-start gap-2 text-stone-500 text-sm mb-1">
              <span style="color:var(--saffron);">📍</span><span>{{ item.address }}</span>
            </div>
            {% endif %}
            {% if item.phone and item.phone != "" %}
            <div class="flex items-start gap-2 text-stone-500 text-sm mb-1">
              <span style="color:var(--saffron);">📞</span>
              <a href="tel:{{ item.phone | remove: ' ' }}" style="text-decoration:none;color:inherit;">{{ item.phone }}</a>
            </div>
            {% endif %}
            {% if item.url and item.url != "" %}
            <a href="{{ item.url }}" target="_blank" rel="noopener" class="text-sm font-semibold mt-2 inline-block" style="color:var(--saffron-dark);">
              Learn more →
            </a>
            {% endif %}
          </div>
          {% endfor %}
        </div>
      </div>
      {% endfor %}
    </div>

    <!-- Submit a Business -->
    <div class="bg-white border border-stone-200 rounded-3xl p-8 shadow-xl mb-16 reveal">
      <div class="text-center mb-6">
        <span class="section-label">Own a Business?</span>
        <h2 class="section-title" style="font-size:clamp(1.5rem,3vw,2rem);">Add Your Business to the Directory</h2>
        <div class="divider mx-auto"></div>
        <p class="text-stone-500 text-sm max-w-xl mx-auto leading-relaxed">
          Submit your details below. New listings are <strong>not published automatically</strong> —
          a community representative will review your submission and approve it before it appears
          publicly. This usually takes a few days.
        </p>
      </div>

      <!--
        TODO: Replace the src below with your published Google Form's embed URL
        once created (Form → Send → Embed <> → copy the src). Suggested fields
        to include on the Google Form, in this order:
          1. Owner's Name (short answer, required)
          2. Business Name (short answer, required)
          3. Business Description (paragraph, required)
          4. Phone Number (short answer, required)
          5. WhatsApp Number (short answer, optional)
          6. HST/GST Number, if applicable (short answer, optional)
          7. Category (dropdown, required) — pre-fill with the options below
             so submissions map cleanly onto the site's existing categories:
             Auto Repair & Auto Detailing · Auto Sales · Cakes & Bakery ·
             Children's Tutoring Service · Driving Instructor ·
             Event Organizers / Decorations · Food Packaging Supplies ·
             Gym Personal Trainer & Dietitian · Heena (Mehandi) ·
             Home Cleaning · Home Security & Cameras · Homeopathy Specialist ·
             Immigration Service Providers · Indian Artificial Jewellery ·
             Indian Convenience Stores · Indian Food Tiffin Service ·
             Indian Pizza Stores · Indian Restaurant · Laptop / Desktop Repair ·
             Lawn Mowing & Landscaping · Medical Appointments (Work Permit) ·
             Notary & Commissioner of Oaths · Packers and Movers ·
             Photography & Content Creation · Printing (Banners/Signs/Labels) ·
             Realtors · Renovation / Handyman / Paint / Plumber / Electrician ·
             Salon / Barber (Kids, Men & Women) · Software Solutions ·
             Stitching and Alterations · Tax, Finance, Insurance & Accounting ·
             US Visa Appointment · Web App / Website Design & Development ·
             Other (please specify in description)
      -->
      <div style="width:100%;min-height:900px;">
        <iframe src="https://docs.google.com/forms/d/e/PLACEHOLDER_FORM_ID/viewform?embedded=true" width="100%" height="900" frameborder="0" marginheight="0" marginwidth="0" style="border-radius:12px;">Loading…</iframe>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white rounded-2xl shadow-lg p-5 mb-10 flex flex-wrap gap-3 items-center reveal" style="position:sticky; top:8px; z-index:20; border:1px solid #ede8db;">
      <div class="relative flex-1" style="min-width:240px;">
        <input type="text" id="ic-search" class="form-input" style="padding-left:42px;" placeholder="Search business name, phone, or category…" />
        <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--saffron); font-size:1rem;">🔍</span>
      </div>
      <select id="ic-category" class="form-input" style="flex:0 1 320px; cursor:pointer;">
        <option value="">All Categories</option>
      </select>
    </div>

    <div class="text-stone-400 text-sm mb-6 reveal" id="ic-count"></div>

    <div id="ic-results"></div>

  </div>
</section>

<script id="ic-data" type="application/json">
{
  "essentials": {{ site.data.essential_services | jsonify }},
  "businesses": {{ site.data.community_businesses | jsonify }}
}
</script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const dataEl = document.getElementById('ic-data');
  if (!dataEl) return;
  const { essentials, businesses } = JSON.parse(dataEl.textContent);
  const all = [...essentials, ...businesses];

  const searchEl   = document.getElementById('ic-search');
  const categoryEl = document.getElementById('ic-category');
  const resultsEl  = document.getElementById('ic-results');
  const countEl    = document.getElementById('ic-count');

  [...new Set(all.map(b => b.category))].sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat;
    categoryEl.appendChild(opt);
  });

  function getWhatsAppLink(b) {
    if (b.whatsapp && b.whatsapp.trim()) return `https://wa.me/${b.whatsapp.trim()}`;
    return '';
  }

  function cardHTML(b) {
    const telDigits = (b.phone || '').split('/')[0].replace(/[^0-9+]/g, '');
    const phoneHTML = b.phone
      ? `<div class="flex items-start gap-2 text-stone-500 text-sm"><span style="color:var(--saffron);">📞</span><a href="tel:${telDigits}" class="hover:text-saffron-dark" style="text-decoration:none;color:inherit;">${b.phone}</a></div>`
      : `<div class="flex items-start gap-2 text-stone-400 text-sm italic"><span style="color:var(--saffron);">📞</span>Contact not listed</div>`;
    const addrHTML = b.address
      ? `<div class="flex items-start gap-2 text-stone-500 text-sm mt-1"><span style="color:var(--saffron);">📍</span>${b.address}</div>` : '';
    const waLink = getWhatsAppLink(b);
    const waHTML = waLink
      ? `<a href="${waLink}" target="_blank" rel="noopener" class="btn-green" style="padding:8px 16px;font-size:0.8rem;margin-top:12px;display:inline-block;">WhatsApp</a>` : '';
    return `<div class="value-card">
      <h3 class="text-base font-semibold mb-2">${b.name}</h3>
      ${phoneHTML}${addrHTML}
      ${waHTML}
    </div>`;
  }

  function render() {
    const term = searchEl.value.trim().toLowerCase();
    const cat = categoryEl.value;
    const results = all.filter(b => {
      const matchesCat = !cat || b.category === cat;
      const matchesTerm = !term ||
        (b.name || '').toLowerCase().includes(term) ||
        (b.phone || '').toLowerCase().includes(term) ||
        (b.category || '').toLowerCase().includes(term) ||
        (b.address || '').toLowerCase().includes(term);
      return matchesCat && matchesTerm;
    });

    countEl.textContent = results.length + (results.length === 1 ? ' listing found' : ' listings found');

    if (!results.length) {
      resultsEl.innerHTML = '<div class="text-center py-16 text-stone-400">No listings match your search.</div>';
      return;
    }

    const groups = {};
    results.forEach(b => { (groups[b.category] = groups[b.category] || []).push(b); });

    let html = '';
    Object.keys(groups).sort().forEach(catName => {
      const cards = groups[catName].map(cardHTML).join('');
      html += `<div class="mb-12 reveal">
        <div class="flex items-center gap-3 mb-4">
          <h3 class="text-lg font-bold" style="font-family:'Playfair Display',serif; color:var(--charcoal);">${catName}</h3>
          <span class="text-xs font-semibold px-3 py-1 rounded-full" style="background:#FFF3E0;color:var(--saffron-dark);">${groups[catName].length}</span>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</div>
      </div>`;
    });
    resultsEl.innerHTML = html;
    if (typeof initReveal === 'function') initReveal();
  }

  searchEl.addEventListener('input', render);
  categoryEl.addEventListener('change', render);
  render();
});
</script>
