/* ─────────────────────────────────────────────────────────────────────────────
   AIC FREDERICTON — MAIN JAVASCRIPT
   ───────────────────────────────────────────────────────────────────────────── */

/* ── Navbar scroll effect ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 70);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ── Mobile menu ── */
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}
window.toggleMenu = toggleMenu;

/* ── Scroll reveal ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.10 });
  els.forEach(el => obs.observe(el));
}

/* ── Event filter tabs ── */
function initEventFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      let visible = 0;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      const noMsg = document.getElementById('no-events-msg');
      if (noMsg) noMsg.style.display = visible === 0 ? 'block' : 'none';
    });
  });
}

/* ── Volunteer form submission ── */
function initVolunteerForm() {
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formUrl = form.dataset.formUrl;
    const name    = document.getElementById('v-name')?.value.trim();
    const email   = document.getElementById('v-email')?.value.trim();
    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }
    // Show success
    document.getElementById('form-success')?.classList.remove('hidden');
    form.reset();
    // Redirect to Google Form after 1.2s
    if (formUrl && formUrl !== '') {
      setTimeout(() => window.open(formUrl, '_blank'), 1200);
    }
  });
}

/* ── Newsletter subscribe ── */
function initNewsletter() {
  const btn = document.getElementById('nl-submit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const email = document.getElementById('nl-email')?.value.trim();
    if (!email) return;
    document.getElementById('nl-success')?.classList.remove('hidden');
    if (document.getElementById('nl-email')) document.getElementById('nl-email').value = '';
  });
}

/* ── Particle background (hero only) ── */
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const symbols = ['🍁', '✦', '◆', '·', '✿'];
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('span');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      position:absolute; pointer-events:none; user-select:none;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      font-size:${Math.random()*12+7}px;
      opacity:${Math.random()*0.14+0.03};
      color:${Math.random()>0.5?'#FF9933':'#138808'};
      animation: floatP ${Math.random()*9+7}s ease-in-out infinite alternate;
      animation-delay:${Math.random()*6}s;`;
    container.appendChild(el);
  }
  // Inject keyframe if not present
  if (!document.getElementById('particle-style')) {
    const s = document.createElement('style');
    s.id = 'particle-style';
    s.textContent = `@keyframes floatP { from{transform:translateY(0) rotate(0deg)} to{transform:translateY(-28px) rotate(18deg)} }`;
    document.head.appendChild(s);
  }
}

/* ── Smooth scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        document.getElementById('mobile-menu')?.classList.remove('open');
      }
    });
  });
}

/* ── Init all ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initEventFilter();
  initVolunteerForm();
  initNewsletter();
  initParticles();
  initSmoothScroll();
});
