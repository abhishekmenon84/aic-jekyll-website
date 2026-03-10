---
layout: default
title: Our Executive Team
description: "Meet the dedicated leaders of AIC Fredericton — the executive board driving our mission forward."
permalink: /executives/
---

<!-- Page Hero -->
<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">Leadership</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Executive Team
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      Meet the passionate community leaders who give their time and talent to make AIC Fredericton thrive.
    </p>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     EXECUTIVES GRID
══════════════════════════════════════════════════════════════ -->
<section class="py-20 px-6">
  <div class="max-w-7xl mx-auto">

    {% assign active_execs = site.data.executives | where: "active", true %}
    {% assign inactive_execs = site.data.executives | where: "active", false %}

    {% if active_execs.size > 0 %}
    {% include section_header.html label="Current Board" title="2024–2026 Executive Team" subtitle="Our current board of directors, elected by the AIC Fredericton membership." %}

    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {% for exec in active_execs %}
      <div class="exec-card reveal">
        {% if exec.photo and exec.photo != "" %}
          <img src="{{ exec.photo | relative_url }}" alt="{{ exec.name }}" class="exec-avatar" />
        {% else %}
          <div class="exec-initials">{{ exec.name | split: " " | map: "first" | join: "" | upcase | truncate: 2, "" }}</div>
        {% endif %}
        <h3 class="font-bold text-lg mb-1">{{ exec.name }}</h3>
        <p class="text-sm font-semibold mb-2" style="color:var(--saffron);">{{ exec.role }}</p>
        <p class="text-stone-400 text-xs mb-3">Term: {{ exec.term }}</p>
        {% if exec.bio %}
        <p class="text-stone-500 text-xs leading-relaxed mb-3 line-clamp-3">{{ exec.bio }}</p>
        {% endif %}
        {% if exec.email %}
        <a href="mailto:{{ exec.email }}"
           class="inline-block text-xs px-4 py-2 rounded-full border border-stone-200 text-stone-500 hover:border-orange-400 hover:text-orange-500 transition-all">
          ✉ Contact
        </a>
        {% endif %}
      </div>
      {% endfor %}
    </div>
    {% endif %}

    {% if inactive_execs.size > 0 %}
    <div class="mt-20">
      {% include section_header.html label="Alumni" title="Past Executives" subtitle="We honour the dedicated leaders who served AIC Fredericton in previous terms." %}
      <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
        {% for exec in inactive_execs %}
        <div class="past-card reveal text-center">
          <div class="exec-initials mx-auto" style="opacity:0.6;width:56px;height:56px;font-size:1.1rem;">{{ exec.name | split: " " | map: "first" | join: "" | upcase | truncate: 2, "" }}</div>
          <h4 class="font-semibold mt-3">{{ exec.name }}</h4>
          <p class="text-xs text-stone-400 mt-1">{{ exec.role }} · {{ exec.term }}</p>
        </div>
        {% endfor %}
      </div>
    </div>
    {% endif %}

  </div>
</section>

<!-- Interested in joining the board? -->
<section class="py-16 px-6" style="background:#f7f4ed;">
  <div class="max-w-3xl mx-auto text-center reveal">
    <div class="text-5xl mb-5">🏛️</div>
    <h2 class="text-2xl md:text-3xl font-bold mb-3" style="font-family:'Playfair Display',serif;">
      Interested in Joining the Board?
    </h2>
    <p class="text-stone-500 mb-6 leading-relaxed">
      AIC Fredericton holds elections every two years. If you're passionate about the Indo-Canadian community and want to make a meaningful impact, we'd love to hear from you.
    </p>
    <a href="mailto:{{ site.email }}" class="btn-saffron">Express Your Interest →</a>
  </div>
</section>
