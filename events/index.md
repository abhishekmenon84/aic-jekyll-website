---
layout: default
title: Events
description: "Upcoming and past events from AIC Fredericton — cultural celebrations, community gatherings, workshops, and more."
permalink: /events/
---

<!-- Page Hero -->
<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">AIC Events</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Events & Celebrations
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      From cultural festivals to community workshops — there's always something meaningful happening at AIC Fredericton.
    </p>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     UPCOMING EVENTS
══════════════════════════════════════════════════════════════ -->
<section class="py-20 px-6">
  <div class="max-w-7xl mx-auto">

    {% include section_header.html label="Coming Up" title="Upcoming Events" subtitle="Register early — our events fill up fast!" %}

    <!-- Filter tabs -->
    <div class="flex flex-wrap gap-2 justify-center mb-10 reveal">
      <button class="filter-tab active" data-filter="all">All</button>
      <button class="filter-tab" data-filter="Cultural">Cultural</button>
      <button class="filter-tab" data-filter="Community">Community</button>
      <button class="filter-tab" data-filter="Gala">Gala</button>
      <button class="filter-tab" data-filter="Arts">Arts</button>
      <button class="filter-tab" data-filter="Education">Education</button>
    </div>

    {% if site.data.upcoming_events.size > 0 %}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="events-grid">
      {% assign sorted_events = site.data.upcoming_events | sort: "date" %}
      {% for ev in sorted_events %}
      <div data-category="{{ ev.category }}">
        {% include event_card.html event=ev %}
      </div>
      {% endfor %}
    </div>
    <p id="no-events-msg" class="text-center text-stone-400 mt-6 text-sm hidden">No events in this category right now.</p>
    {% else %}
    <div class="text-center py-16 reveal">
      <div class="text-5xl mb-4">📅</div>
      <p class="text-stone-500">No upcoming events scheduled yet. Check back soon!</p>
    </div>
    {% endif %}
  </div>
</section>

<!-- CTA -->
<section class="py-16 px-6 text-center">
  <div class="max-w-xl mx-auto reveal">
    <h2 class="text-2xl font-bold mb-3" style="font-family:'Playfair Display',serif;">Want to host or suggest an event?</h2>
    <p class="text-stone-500 mb-6">We love hearing ideas from our community members. Reach out and let's make something special happen!</p>
    <a href="mailto:{{ site.email }}" class="btn-saffron">Contact Us →</a>
  </div>
</section>
