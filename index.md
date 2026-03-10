---
layout: default
title: Home
description: "AIC Fredericton — Fostering a vibrant, inclusive, and engaged Indo-Canadian community in New Brunswick."
---

<!-- ═══════════════════════════════════════════════════════════
     HERO
══════════════════════════════════════════════════════════════ -->
<section id="hero">
  <div class="flag-bar flag-saffron"></div>
  <div class="flag-bar flag-white"></div>
  <div class="flag-bar flag-green"></div>

  <!-- Decorative rings -->
  <div class="hero-ring" style="width:600px;height:600px;"></div>
  <div class="hero-ring" style="width:400px;height:400px;animation-direction:reverse;animation-duration:50s;"></div>
  <div class="hero-ring" style="width:250px;height:250px;border-style:dashed;opacity:0.06;"></div>

  <!-- Particles -->
  <div id="hero-particles" class="absolute inset-0 overflow-hidden pointer-events-none"></div>

  <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
    <div class="anim-1 mb-8">
      <img src="{{ '/assets/images/logo.jpeg' | relative_url }}" alt="{{ site.org.short_name }} Logo"
           class="w-32 h-32 rounded-full object-cover mx-auto"
           style="box-shadow: 0 0 60px rgba(255,153,51,0.35), 0 0 120px rgba(19,136,8,0.2); border: 3px solid rgba(255,153,51,0.4);" />
    </div>

    <div class="anim-2 inline-block border border-saffron/30 text-saffron-light px-5 py-1.5 rounded-full text-xs tracking-widest uppercase mb-6"
         style="color: #FFB866; border-color: rgba(255,153,51,0.35);">
      🍁 Fredericton, New Brunswick
    </div>

    <h1 class="anim-3 text-white font-black leading-none mb-6"
        style="font-family:'Playfair Display',serif; font-size:clamp(2.6rem,7vw,5.5rem);">
      Association of<br>
      <span style="color:var(--saffron)">Indo</span>-<span style="color:#7edd6e;">Canadians</span>
    </h1>

    <p class="anim-4 text-white/65 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
      {{ site.description }}
    </p>

    <div class="anim-5 flex flex-wrap gap-4 justify-center">
      <a href="/events/" class="btn-saffron">Explore Events</a>
      <a href="#about" class="btn-outline-white">Our Story</a>
    </div>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs">
      <span>Scroll</span>
      <div style="width:1px;height:32px;background:rgba(255,255,255,0.2);animation:pulse 2s infinite;"></div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     STATS BAND
══════════════════════════════════════════════════════════════ -->
<section style="background: linear-gradient(135deg, var(--saffron) 0%, #d97200 100%);">
  <div class="max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center reveal">
    <div><div class="stat-num">500+</div><div class="text-white/75 text-sm mt-1 font-medium">Community Members</div></div>
    <div><div class="stat-num">20+</div><div class="text-white/75 text-sm mt-1 font-medium">Annual Events</div></div>
    <div><div class="stat-num">15+</div><div class="text-white/75 text-sm mt-1 font-medium">Years of Heritage</div></div>
    <div><div class="stat-num">10+</div><div class="text-white/75 text-sm mt-1 font-medium">Partner Organizations</div></div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     ABOUT
══════════════════════════════════════════════════════════════ -->
<section id="about" class="py-24 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <div class="reveal">
        <span class="section-label">Who We Are</span>
        <h2 class="section-title">Building Bridges,<br>Celebrating Heritage</h2>
        <div class="divider"></div>
        <p class="text-stone-600 leading-relaxed mb-5">
          AIC Fredericton is dedicated to fostering a <strong>vibrant, inclusive, and engaged</strong> community. Our mission is to serve the community by promoting cultural heritage, supporting community members, and creating opportunities for education, understanding, and connection.
        </p>
        <p class="text-stone-600 leading-relaxed mb-8">
          Guided by values of <strong>integrity</strong>, <strong>inclusivity</strong>, and <strong>accountability</strong>, we strive to preserve cultural traditions while supporting the growth and well-being of present and future generations of Indo-Canadians in New Brunswick.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="/executives/" class="btn-saffron">Meet Our Team</a>
          <a href="/volunteer/" class="btn-green">Get Involved</a>
        </div>
      </div>
      <div class="grid gap-4 reveal">
        <div class="value-card">
          <div class="text-3xl mb-3">🌏</div>
          <h3 class="text-lg font-semibold mb-1">Cultural Heritage</h3>
          <p class="text-stone-500 text-sm leading-relaxed">Preserving and celebrating the rich traditions of India while proudly embracing our Canadian identity.</p>
        </div>
        <div class="value-card">
          <div class="text-3xl mb-3">🤝</div>
          <h3 class="text-lg font-semibold mb-1">Community Support</h3>
          <p class="text-stone-500 text-sm leading-relaxed">Helping newcomers settle, grow, and thrive through mentorship, resources, and a welcoming network.</p>
        </div>
        <div class="value-card">
          <div class="text-3xl mb-3">📚</div>
          <h3 class="text-lg font-semibold mb-1">Education & Understanding</h3>
          <p class="text-stone-500 text-sm leading-relaxed">Promoting cross-cultural learning and lifelong education for all ages in our diverse community.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     UPCOMING EVENTS PREVIEW (homepage – shows featured only)
══════════════════════════════════════════════════════════════ -->
<section id="events-preview" class="py-24 px-6" style="background:#f7f4ed;">
  <div class="max-w-7xl mx-auto">
    {% include section_header.html label="What's On" title="Featured Upcoming Events" subtitle="Celebrate, connect, and grow with your community. See what's coming up!" %}

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {% assign featured = site.data.upcoming_events | where: "featured", true %}
      {% for ev in featured limit:3 %}
        {% include event_card.html event=ev %}
      {% endfor %}
    </div>

    <div class="text-center mt-10 reveal">
      <a href="/events/" class="btn-saffron">View All Events →</a>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     EXECUTIVES PREVIEW (homepage – shows first 4)
══════════════════════════════════════════════════════════════ -->
<section id="team-preview" class="py-24 px-6">
  <div class="max-w-7xl mx-auto">
    {% include section_header.html label="Leadership" title="Meet Our Executive Team" subtitle="Dedicated community leaders who make AIC Fredericton's vision come alive." %}

    <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
      {% assign active_execs = site.data.executives | where: "active", true %}
      {% for exec in active_execs limit:4 %}
      <div class="exec-card reveal">
        {% if exec.photo and exec.photo != "" %}
          <img src="{{ exec.photo | relative_url }}" alt="{{ exec.name }}" class="exec-avatar" />
        {% else %}
          <div class="exec-initials">{{ exec.name | split: " " | map: "first" | join: "" | upcase | truncate: 2, "" }}</div>
        {% endif %}
        <h3 class="font-bold text-base mb-0.5">{{ exec.name }}</h3>
        <p class="text-sm font-medium mb-2" style="color:var(--saffron)">{{ exec.role }}</p>
        <p class="text-stone-400 text-xs">Term: {{ exec.term }}</p>
      </div>
      {% endfor %}
    </div>

    <div class="text-center mt-10 reveal">
      <a href="/executives/" class="btn-green">See Full Team →</a>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     CULTURAL HERITAGE
══════════════════════════════════════════════════════════════ -->
<section id="heritage" class="py-24 px-6" style="background:#f7f4ed;">
  <div class="max-w-7xl mx-auto">
    {% include section_header.html label="Our Roots" title="Cultural Heritage" %}

    <div class="grid md:grid-cols-2 gap-5 reveal">
      <div class="heritage-item">
        <span class="text-4xl">🎵</span>
        <div><h3 class="font-semibold text-lg mb-1">Music & Dance</h3>
        <p class="text-stone-500 text-sm leading-relaxed">Bharatanatyam, Kathak, Bhangra, Garba — we keep performing arts alive through workshops and performances.</p></div>
      </div>
      <div class="heritage-item">
        <span class="text-4xl">🍛</span>
        <div><h3 class="font-semibold text-lg mb-1">Cuisine & Food Culture</h3>
        <p class="text-stone-500 text-sm leading-relaxed">Our potlucks, cooking demos, and food festivals bring the flavours of India to Fredericton's table.</p></div>
      </div>
      <div class="heritage-item">
        <span class="text-4xl">🪔</span>
        <div><h3 class="font-semibold text-lg mb-1">Festivals & Celebrations</h3>
        <p class="text-stone-500 text-sm leading-relaxed">Diwali, Holi, Navratri, Onam and more — celebrating India's diversity with all of Fredericton.</p></div>
      </div>
      <div class="heritage-item">
        <span class="text-4xl">🧵</span>
        <div><h3 class="font-semibold text-lg mb-1">Language & Literature</h3>
        <p class="text-stone-500 text-sm leading-relaxed">We support Hindi, Tamil, Punjabi, and other language initiatives to connect future generations to their roots.</p></div>
      </div>
      <div class="heritage-item">
        <span class="text-4xl">🎨</span>
        <div><h3 class="font-semibold text-lg mb-1">Arts & Crafts</h3>
        <p class="text-stone-500 text-sm leading-relaxed">Rangoli, Mehndi, pottery, and textiles — India's rich artistic heritage through exhibitions and workshops.</p></div>
      </div>
      <div class="heritage-item">
        <span class="text-4xl">📖</span>
        <div><h3 class="font-semibold text-lg mb-1">Oral History & Stories</h3>
        <p class="text-stone-500 text-sm leading-relaxed">We document and celebrate the journeys of Indo-Canadian families who built a home in New Brunswick.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     VOLUNTEER CTA BAND
══════════════════════════════════════════════════════════════ -->
<section class="py-20 px-6" style="background: linear-gradient(135deg, #001400 0%, #1a0a00 50%, #0a0010 100%);">
  <div class="max-w-3xl mx-auto text-center reveal">
    <div class="text-5xl mb-6">🤲</div>
    <h2 class="text-white text-3xl md:text-4xl font-bold mb-4" style="font-family:'Playfair Display',serif;">
      Make a Difference in Your Community
    </h2>
    <p class="text-white/55 mb-8 leading-relaxed max-w-xl mx-auto">
      Whether you're a newcomer or long-time Fredericton resident, your skills and passion are needed. Join our volunteer family today!
    </p>
    <a href="/volunteer/" class="btn-saffron text-base">Explore Volunteer Roles →</a>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     CONTACT
══════════════════════════════════════════════════════════════ -->
<section id="contact" class="py-24 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="grid md:grid-cols-2 gap-16 items-center">
      <div class="reveal">
        <span class="section-label">Reach Out</span>
        <h2 class="section-title">Contact Us</h2>
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
          {% if site.org.social.facebook != "" %}<a href="{{ site.org.social.facebook }}" target="_blank" rel="noopener" class="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center text-sm font-bold text-stone-400 hover:border-orange-400 hover:text-orange-500 transition-all">f</a>{% endif %}
          {% if site.org.social.instagram != "" %}<a href="{{ site.org.social.instagram }}" target="_blank" rel="noopener" class="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-400 hover:border-orange-400 hover:text-orange-500 transition-all">ig</a>{% endif %}
          {% if site.org.social.twitter != "" %}<a href="{{ site.org.social.twitter }}" target="_blank" rel="noopener" class="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-400 hover:border-orange-400 hover:text-orange-500 transition-all">tw</a>{% endif %}
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
