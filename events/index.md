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

<!-- Event Tab Selector (Upcoming vs Past) -->
<div class="flex justify-center mt-12 mb-6">
  <div class="inline-flex rounded-full p-1 bg-stone-100 border border-stone-200 shadow-inner">
    <button class="event-type-tab px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 active" 
            id="tab-upcoming" onclick="switchEventTab('upcoming')">
      Upcoming Events
    </button>
    <button class="event-type-tab px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 text-stone-600 hover:text-stone-900" 
            id="tab-past" onclick="switchEventTab('past')">
      Past Events
    </button>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     UPCOMING EVENTS SECTION
══════════════════════════════════════════════════════════════ -->
<div id="upcoming-events-sec">
  <section class="py-14 px-6">
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
</div>

<!-- ═══════════════════════════════════════════════════════════
     PAST EVENTS SECTION
══════════════════════════════════════════════════════════════ -->
<div id="past-events-sec" style="display:none;">
  <section class="py-14 px-6">
    <div class="max-w-7xl mx-auto">
      {% include section_header.html label="Our History" title="Past Events" subtitle="Explore highlights and memories from our previous gatherings." %}

      {% if site.data.past_events.size > 0 %}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {% assign sorted_past = site.data.past_events | sort: "date" | reverse %}
        {% for ev in sorted_past %}
          {% comment %} Build JSON array of gallery images {% endcomment %}
          {% if ev.gallery and ev.gallery.size > 0 %}
            {% assign gallery_json = "[" %}
            {% for img_path in ev.gallery %}
              {% assign escaped = img_path | relative_url | prepend: '"' | append: '"' %}
              {% assign gallery_json = gallery_json | append: escaped %}
              {% unless forloop.last %}{% assign gallery_json = gallery_json | append: "," %}{% endunless %}
            {% endfor %}
            {% assign gallery_json = gallery_json | append: "]" %}
          {% else %}
            {% assign gallery_json = "[]" %}
          {% endif %}
        <div class="past-card reveal overflow-hidden"
             {% if ev.gallery and ev.gallery.size > 0 %}
             data-gallery="{{ gallery_json | escape }}"
             data-gallery-title="{{ ev.title | escape }}"
             {% endif %}>
          {% if ev.image and ev.image != "" %}
          <div class="h-48 -mx-6 -mt-6 mb-5 overflow-hidden relative{% if ev.gallery and ev.gallery.size > 0 %} gallery-cover cursor-pointer{% endif %}">
            <img src="{{ ev.image | relative_url }}" alt="{{ ev.title }}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            {% if ev.gallery and ev.gallery.size > 0 %}
            <div class="absolute inset-0 bg-black/20 flex items-end justify-start p-3 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <span class="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-full">📸 Click to view photos</span>
            </div>
            {% endif %}
          </div>
          {% endif %}
          <div class="flex items-start justify-between mb-3">
            <span class="text-4xl">{{ ev.emoji | default: "📅" }}</span>
            <div class="flex items-center gap-2 flex-shrink-0 ml-2">
              {% if ev.gallery and ev.gallery.size > 0 %}
              <button class="gallery-btn" type="button">
                📸 {{ ev.gallery.size }} Photo{% if ev.gallery.size != 1 %}s{% endif %}
              </button>
              {% endif %}
              <span class="event-cat cat-{{ ev.category }} inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">{{ ev.category }}</span>
            </div>
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
</div>

<!-- CTA -->
<section class="py-16 px-6 text-center">
  <div class="max-w-xl mx-auto reveal">
    <h2 class="text-2xl font-bold mb-3" style="font-family:'Playfair Display',serif;">Want to host or suggest an event?</h2>
    <p class="text-stone-500 mb-6">We love hearing ideas from our community members. Reach out and let's make something special happen!</p>
    <a href="mailto:{{ site.email }}" class="btn-saffron">Contact Us →</a>
  </div>
</section>

<!-- Tab Toggling Script -->
<script>
function switchEventTab(tab) {
  const upcomingSec = document.getElementById('upcoming-events-sec');
  const pastSec = document.getElementById('past-events-sec');
  const tabUpcoming = document.getElementById('tab-upcoming');
  const tabPast = document.getElementById('tab-past');
  
  if (tab === 'upcoming') {
    upcomingSec.style.display = 'block';
    pastSec.style.display = 'none';
    tabUpcoming.classList.add('active');
    tabUpcoming.classList.remove('text-stone-600', 'hover:text-stone-900');
    tabPast.classList.remove('active');
    tabPast.classList.add('text-stone-600', 'hover:text-stone-900');
  } else {
    upcomingSec.style.display = 'none';
    pastSec.style.display = 'block';
    tabPast.classList.add('active');
    tabPast.classList.remove('text-stone-600', 'hover:text-stone-900');
    tabUpcoming.classList.remove('active');
    tabUpcoming.classList.add('text-stone-600', 'hover:text-stone-900');
    
    // Trigger reveals for past events
    if (typeof initReveal === 'function') {
      setTimeout(initReveal, 100);
    }
  }
}
</script>
