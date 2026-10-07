---
layout: default
title: Contact Us
description: "Get in touch with the Association of Indo-Canadians — Fredericton, New Brunswick."
permalink: /contact/
---

<!-- Page Hero -->
<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">Reach Out</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Contact Us
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      We'd love to hear from you. Reach out with questions, ideas, or to get involved.
    </p>
  </div>
</div>

<section class="py-20 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <div class="reveal">
        <span class="section-label">Get in Touch</span>
        <h2 class="section-title">Contact Information</h2>
        <div class="divider"></div>
        <div class="space-y-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style="background:#FFF3E0;">📍</div>
            <div><div class="font-semibold mb-0.5">Location</div><div class="text-stone-500 text-sm">{{ site.org.location }}</div></div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style="background:#E8F5E9;">📧</div>
            <div><div class="font-semibold mb-0.5">Email</div>
            <a href="mailto:{{ site.email }}" class="text-stone-500 text-sm hover:text-saffron" style="--tw-text-opacity:1;">{{ site.email }}</a></div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style="background:#E3F2FD;">🌐</div>
            <div><div class="font-semibold mb-0.5">Website</div>
            <a href="{{ site.url }}" class="text-sm" style="color:var(--green);">{{ site.url }}</a></div>
          </div>
        </div>
        <div class="flex gap-3 mt-8">
          {% if site.org.social.facebook != "" %}<a href="{{ site.org.social.facebook }}" target="_blank" rel="noopener" class="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center text-sm font-bold text-stone-400 hover:border-orange-400 hover:text-orange-500 transition-all"><img src="{{ '/assets/images/f-logo.png' | relative_url }}" alt="Facebook Logo" /></a>{% endif %}
          {% if site.org.social.instagram != "" %}<a href="{{ site.org.social.instagram }}" target="_blank" rel="noopener" class="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-400 hover:border-orange-400 hover:text-orange-500 transition-all"><img src="{{ '/assets/images/i-logo.png' | relative_url }}" alt="Instagram Logo" /></a>{% endif %}
        </div>
      </div>

      <div class="reveal">
        <div style="background:linear-gradient(135deg,var(--saffron),var(--green));border-radius:24px;padding:3px;">
          <div class="bg-white rounded-3xl p-10 text-center">
            <img src="{{ '/assets/images/logo.jpeg' | relative_url }}" alt="AIC Logo"
                 class="w-28 h-28 rounded-full object-cover mx-auto mb-5 shadow-lg" />
            <h3 class="text-2xl font-bold mb-2" style="font-family:'Playfair Display',serif;">{{ site.org.short_name }}</h3>
            <p class="text-stone-400 text-sm mb-5">{{ site.org.name }}<br>New Brunswick Chapter</p>
            <div class="text-3xl mb-4">🇮🇳 🤝 🇨🇦</div>
            <p class="text-xs text-stone-300 italic">"Two flags, one community, infinite possibilities."</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
