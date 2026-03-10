---
layout: default
title: Volunteer with AIC
description: "Join the AIC Fredericton volunteer family — explore open roles and sign up to make a difference in your community."
permalink: /volunteer/
---

<!-- Page Hero -->
<div class="page-hero">
  <div class="relative z-10">
    <span class="section-label" style="color:var(--saffron-light);">Get Involved</span>
    <h1 class="text-white text-4xl md:text-5xl font-black mt-2 mb-4" style="font-family:'Playfair Display',serif;">
      Volunteer with AIC
    </h1>
    <p class="text-white/55 max-w-xl mx-auto text-lg">
      Your time, skills, and passion help keep our community vibrant. Find the perfect role and make a real difference!
    </p>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     VOLUNTEER ROLES
══════════════════════════════════════════════════════════════ -->
<section class="py-20 px-6">
  <div class="max-w-7xl mx-auto">
    {% include section_header.html label="Open Roles" title="Ways to Volunteer" subtitle="Every role matters. Choose what fits your schedule and passion." %}

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {% for role in site.data.volunteers %}
      <div class="volunteer-card reveal">
        <div class="text-4xl mb-3">{{ role.emoji }}</div>
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-bold text-xl" style="font-family:'Playfair Display',serif;">{{ role.title }}</h3>
          {% if role.spots_available %}
          <span class="text-xs font-semibold px-3 py-1 rounded-full ml-2 flex-shrink-0"
                style="background:#FFF3E0;color:var(--saffron-dark);">
            {{ role.spots_available }} spots
          </span>
          {% else %}
          <span class="text-xs font-semibold px-3 py-1 rounded-full ml-2 flex-shrink-0"
                style="background:#E8F5E9;color:var(--green);">
            Open
          </span>
          {% endif %}
        </div>
        <p class="text-stone-500 text-sm leading-relaxed mb-4">{{ role.description }}</p>

        <div class="mb-3">
          <span class="text-xs font-semibold text-stone-400 uppercase tracking-wider">⏱ Commitment</span>
          <p class="text-sm text-stone-600 mt-0.5">{{ role.commitment }}</p>
        </div>

        {% if role.skills_needed %}
        <div class="mb-4">
          <span class="text-xs font-semibold text-stone-400 uppercase tracking-wider">Skills Helpful</span>
          <ul class="mt-1 space-y-0.5">
            {% for skill in role.skills_needed %}
            <li class="text-sm text-stone-500 flex items-center gap-1.5">
              <span style="color:var(--saffron);font-size:0.6rem;">●</span> {{ skill }}
            </li>
            {% endfor %}
          </ul>
        </div>
        {% endif %}

        <a href="#volunteer-form" class="btn-saffron inline-block text-sm px-5 py-2.5 mt-1">
          Apply for This Role →
        </a>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════════
     VOLUNTEER SIGN-UP FORM
══════════════════════════════════════════════════════════════ -->
<section id="volunteer-form-section" class="py-20 px-6" style="background: linear-gradient(135deg, #0a0010 0%, #1a0a00 50%, #001400 100%);">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-10 reveal">
      <span class="section-label" style="color:var(--saffron-light);">Sign Up</span>
      <h2 class="text-white text-3xl md:text-4xl font-bold mt-2 mb-3" style="font-family:'Playfair Display',serif;">
        Ready to Get Involved?
      </h2>
      <p class="text-white/50 leading-relaxed">
        Fill out the form below and our volunteer coordinator will be in touch within 3 business days.
      </p>
    </div>

    <div class="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 md:p-12 reveal">
      <form id="volunteer-form" data-form-url="{{ site.volunteer_form_url }}">
        <div class="grid md:grid-cols-2 gap-5">
          <div>
            <label class="block text-white/60 text-sm mb-2 font-medium">Full Name *</label>
            <input type="text" id="v-name" class="form-input" placeholder="Your full name" required />
          </div>
          <div>
            <label class="block text-white/60 text-sm mb-2 font-medium">Email *</label>
            <input type="email" id="v-email" class="form-input" placeholder="you@example.com" required />
          </div>
          <div>
            <label class="block text-white/60 text-sm mb-2 font-medium">Phone</label>
            <input type="tel" id="v-phone" class="form-input" placeholder="+1 (506) 000-0000" />
          </div>
          <div>
            <label class="block text-white/60 text-sm mb-2 font-medium">Preferred Role</label>
            <select id="v-role" class="form-input">
              <option value="">Select a role...</option>
              {% for role in site.data.volunteers %}
              <option value="{{ role.title }}">{{ role.emoji }} {{ role.title }}</option>
              {% endfor %}
              <option value="Any / Surprise Me">🎲 Any / Surprise Me!</option>
            </select>
          </div>
          <div>
            <label class="block text-white/60 text-sm mb-2 font-medium">Availability</label>
            <select id="v-availability" class="form-input">
              <option value="">Select...</option>
              <option>Weekends only</option>
              <option>Weekdays only</option>
              <option>Flexible / Both</option>
              <option>Event-based only</option>
            </select>
          </div>
          <div>
            <label class="block text-white/60 text-sm mb-2 font-medium">Languages Spoken</label>
            <input type="text" id="v-languages" class="form-input" placeholder="e.g. English, Hindi, Tamil" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-white/60 text-sm mb-2 font-medium">Tell Us About Yourself</label>
            <textarea id="v-message" class="form-input" rows="4"
              placeholder="Why do you want to volunteer? Any skills or experiences you'd like to share?"></textarea>
          </div>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-4 items-center">
          <button type="submit" class="btn-saffron w-full sm:w-auto text-base">
            Submit Application 🍁
          </button>
          <a href="{{ site.volunteer_form_url }}" target="_blank" rel="noopener"
             class="text-white/40 text-sm hover:text-white transition-colors">
            Or fill out Google Form directly →
          </a>
        </div>

        <div id="form-success" class="hidden mt-5 p-4 rounded-xl text-sm font-medium"
             style="background:rgba(19,136,8,0.15);color:#7edd6e;border:1px solid rgba(19,136,8,0.3);">
          ✅ Thank you for applying! We'll be in touch within 3 business days.
        </div>
      </form>
    </div>
  </div>
</section>

<!-- Why Volunteer -->
<section class="py-20 px-6">
  <div class="max-w-5xl mx-auto">
    {% include section_header.html label="Why Volunteer?" title="The Rewards of Service" %}
    <div class="grid md:grid-cols-3 gap-6">
      <div class="value-card text-center reveal">
        <div class="text-4xl mb-3">🌐</div>
        <h3 class="font-bold text-lg mb-2">Build Your Network</h3>
        <p class="text-stone-500 text-sm leading-relaxed">Connect with hundreds of community members, local professionals, and leaders across New Brunswick.</p>
      </div>
      <div class="value-card text-center reveal">
        <div class="text-4xl mb-3">🏅</div>
        <h3 class="font-bold text-lg mb-2">Recognition & References</h3>
        <p class="text-stone-500 text-sm leading-relaxed">Receive volunteer hours letters, recognition certificates, and professional references from AIC leadership.</p>
      </div>
      <div class="value-card text-center reveal">
        <div class="text-4xl mb-3">❤️</div>
        <h3 class="font-bold text-lg mb-2">Give Back</h3>
        <p class="text-stone-500 text-sm leading-relaxed">Make a lasting difference in the lives of newcomers and community members in your own backyard.</p>
      </div>
    </div>
  </div>
</section>
