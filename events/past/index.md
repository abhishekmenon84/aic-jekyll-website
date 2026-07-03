---
layout: default
title: Past Events
description: "A look back at the unforgettable moments we've shared as a community."
permalink: /events/past/
---

<!-- Page Hero -->
<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">AIC History</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Past Events & Memories
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      A look back at the cultural celebrations, community gatherings, and workshops we have shared.
    </p>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     PAST EVENTS
══════════════════════════════════════════════════════════════ -->
<section class="py-20 px-6">
  <div class="max-w-7xl mx-auto">
    {% include section_header.html label="Our History" title="Past Events" subtitle="Explore highlights and memories from our previous gatherings." %}

    {% if site.data.past_events.size > 0 %}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {% assign sorted_past = site.data.past_events | sort: "date" | reverse %}
      {% for ev in sorted_past %}
      <div class="past-card reveal overflow-hidden">
        {% if ev.image and ev.image != "" %}
        <div class="h-48 -mx-6 -mt-6 mb-5 overflow-hidden">
          <img src="{{ ev.image | relative_url }}" alt="{{ ev.title }}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
        {% endif %}
        <div class="flex items-start justify-between mb-3">
          <span class="text-4xl">{{ ev.emoji | default: "📅" }}</span>
          <span class="event-cat cat-{{ ev.category }} inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">{{ ev.category }}</span>
        </div>
        <h3 class="font-bold text-xl mb-1" style="font-family:'Playfair Display',serif;">{{ ev.title }}</h3>
        <p class="text-stone-400 text-sm mb-3">{{ ev.date | date: "%B %-d, %Y" }} · {{ ev.location }}</p>
        {% if ev.attendees %}
        <p class="text-sm text-stone-500 mb-3">👥 ~{{ ev.attendees }} attendees</p>
        {% endif %}
        {% if ev.highlights %}
        <ul class="space-y-1">
          {% for h in ev.highlights %}
          <li class="text-sm text-stone-500 flex items-start gap-2">
            <span style="color:var(--saffron);margin-top:2px;">✦</span> {{ h }}
          </li>
          {% endfor %}
        </ul>
        {% endif %}
      </div>
      {% endfor %}
    </div>
    {% else %}
    <div class="text-center py-16 reveal">
      <div class="text-5xl mb-4">🕰️</div>
      <p class="text-stone-500">Past events will appear here as our community grows!</p>
    </div>
    {% endif %}
  </div>
</section>

<!-- CTA -->
<section class="py-16 px-6 text-center" style="background:#f7f4ed;">
  <div class="max-w-xl mx-auto reveal">
    <h2 class="text-2xl font-bold mb-3" style="font-family:'Playfair Display',serif;">Want to suggest an event?</h2>
    <p class="text-stone-500 mb-6">We love hearing ideas from our community members. Reach out and let's make something special happen!</p>
    <a href="mailto:{{ site.email }}" class="btn-saffron">Contact Us →</a>
  </div>
</section>
