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
    {% include section_header.html label="Current Board" title="2025–2027 Executive Team" subtitle="Our current board of directors, elected by the AIC Fredericton membership." %}

    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {% for exec in active_execs %}
      <div class="exec-card reveal flex flex-col justify-between">
        <div>
          {% if exec.photo and exec.photo != "" %}
            {% assign photo_filename = exec.photo | split: "/" | last %}
            {% assign profile_path = "/assets/images/team/team-profile/Profile-" | append: photo_filename %}
            
            {% assign has_profile = false %}
            {% for static_file in site.static_files %}
              {% if static_file.path == profile_path %}
                {% assign has_profile = true %}
                {% break %}
              {% endif %}
            {% endfor %}

            {% if has_profile %}
              <a href="{{ profile_path | relative_url }}" target="_blank" title="View Profile" class="group block relative w-20 h-20 mx-auto mb-4 cursor-pointer overflow-hidden rounded-full">
                <img src="{{ exec.photo | relative_url }}" alt="{{ exec.name }}" class="exec-avatar m-0 transition-transform duration-300 group-hover:scale-110" style="margin: 0; width: 100%; height: 100%;" />
                <div class="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span class="text-white text-[10px] font-bold tracking-wider uppercase">Profile</span>
                </div>
              </a>
            {% else %}
              <img src="{{ exec.photo | relative_url }}" alt="{{ exec.name }}" class="exec-avatar" />
            {% endif %}
          {% else %}
            <div class="exec-initials">{{ exec.name | split: " " | map: "first" | join: "" | upcase | truncate: 2, "" }}</div>
          {% endif %}
          <h3 class="font-bold text-lg mb-1">{{ exec.name }}</h3>
          <p class="text-sm font-semibold mb-2" style="color:var(--saffron);">{{ exec.role }}</p>
          <p class="text-stone-400 text-xs mb-3">Term: {{ exec.term }}</p>
          {% if exec.bio %}
          <p class="text-stone-500 text-xs leading-relaxed mb-3 line-clamp-3">{{ exec.bio }}</p>
          {% endif %}
        </div>

        <div class="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-stone-100">
          {% if exec.email and exec.email != "" and exec.email != "NA" %}
          <a href="mailto:{{ exec.email }}"
             class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 text-stone-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all"
             title="Email {{ exec.name }}">
            <span class="text-base" style="line-height: 1;">✉</span>
          </a>
          {% endif %}
          {% if exec.linkedin and exec.linkedin != "" %}
          <a href="{{ exec.linkedin }}" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 text-stone-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
             title="LinkedIn Profile">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          {% endif %}
        </div>
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
