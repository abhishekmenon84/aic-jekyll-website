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

/* ── Executive Modal ── */
function initExecutiveModal() {
  const modal = document.getElementById('exec-modal');
  if (!modal) return;

  const cards = document.querySelectorAll('.exec-card[data-name]');
  cards.forEach(card => {
    card.classList.add('cursor-pointer');
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-name');
      const role = card.getAttribute('data-role');
      const photo = card.getAttribute('data-photo');
      const bio = card.getAttribute('data-bio');
      const email = card.getAttribute('data-email');
      const linkedin = card.getAttribute('data-linkedin');
      const term = card.getAttribute('data-term');

      const nameEl = document.getElementById('modal-name');
      const roleEl = document.getElementById('modal-role');
      const termEl = document.getElementById('modal-term');
      const bioEl = document.getElementById('modal-bio');
      
      if (nameEl) nameEl.textContent = name;
      if (roleEl) roleEl.textContent = role;
      if (termEl) termEl.textContent = `Term: ${term}`;
      if (bioEl) bioEl.textContent = bio || 'No biography available.';

      const img = document.getElementById('modal-photo');
      const initials = document.getElementById('modal-initials');
      const imgLink = document.getElementById('modal-photo-link');
      if (photo && photo !== '') {
        if (img) {
          img.src = photo;
          img.alt = name;
          img.classList.remove('hidden');
        }
        if (imgLink) {
          imgLink.href = photo;
          imgLink.style.display = 'block';
        }
        if (initials) initials.classList.add('hidden');
      } else {
        if (img) img.classList.add('hidden');
        if (imgLink) imgLink.style.display = 'none';
        if (initials) {
          const initialsText = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          initials.textContent = initialsText;
          initials.classList.remove('hidden');
        }
      }

      const emailBtn = document.getElementById('modal-email');
      if (emailBtn) {
        if (email && email !== '' && email !== 'NA') {
          emailBtn.href = `mailto:${email}`;
          emailBtn.style.display = 'inline-flex';
        } else {
          emailBtn.style.display = 'none';
        }
      }

      const linkedinBtn = document.getElementById('modal-linkedin');
      if (linkedinBtn) {
        if (linkedin && linkedin !== '') {
          linkedinBtn.href = linkedin;
          linkedinBtn.style.display = 'inline-flex';
        } else {
          linkedinBtn.style.display = 'none';
        }
      }

      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.add('open');
      }, 10);
      document.body.style.overflow = 'hidden';
    });
  });
}

function closeExecutiveModal(e) {
  const modal = document.getElementById('exec-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}
window.closeExecutiveModal = closeExecutiveModal;

/* ── Gallery Lightbox ── */
let _galleryImages  = [];
let _galleryIndex   = 0;
let _galleryTitle   = '';

function openGalleryModal(images, startIndex, title) {
  _galleryImages = images;
  _galleryIndex  = startIndex || 0;
  _galleryTitle  = title || '';
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;

  _galleryRender();
  _galleryBuildThumbs();
  modal.classList.remove('hidden');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // keyboard navigation
  document.addEventListener('keydown', _galleryKeyHandler);
}
window.openGalleryModal = openGalleryModal;

function _galleryRender() {
  const img     = document.getElementById('gallery-img');
  const counter = document.getElementById('gallery-counter');
  const title   = document.getElementById('gallery-title');
  const prev    = document.getElementById('gallery-prev');
  const next    = document.getElementById('gallery-next');

  if (img) {
    img.classList.add('fade');
    setTimeout(() => {
      img.src = _galleryImages[_galleryIndex];
      img.alt = _galleryTitle + ' photo ' + (_galleryIndex + 1);
      img.classList.remove('fade');
    }, 160);
  }
  if (counter) counter.textContent = `${_galleryIndex + 1} / ${_galleryImages.length}`;
  if (title)   title.textContent   = _galleryTitle;

  // hide arrows when only 1 image
  const single = _galleryImages.length <= 1;
  if (prev) prev.style.display = single ? 'none' : '';
  if (next) next.style.display = single ? 'none' : '';

  // update active thumb
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === _galleryIndex);
  });
}

function _galleryBuildThumbs() {
  const strip = document.getElementById('gallery-thumbs');
  if (!strip) return;
  strip.innerHTML = '';
  _galleryImages.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'gallery-thumb' + (i === _galleryIndex ? ' active' : '');
    img.onclick = () => { _galleryIndex = i; _galleryRender(); };
    strip.appendChild(img);
  });
}

function galleryNav(dir) {
  _galleryIndex = (_galleryIndex + dir + _galleryImages.length) % _galleryImages.length;
  _galleryRender();
  // scroll active thumb into view
  const thumbs = document.querySelectorAll('.gallery-thumb');
  if (thumbs[_galleryIndex]) {
    thumbs[_galleryIndex].scrollIntoView({ inline: 'center', behavior: 'smooth' });
  }
}
window.galleryNav = galleryNav;

function _galleryKeyHandler(e) {
  if (e.key === 'ArrowLeft')  galleryNav(-1);
  if (e.key === 'ArrowRight') galleryNav(1);
  if (e.key === 'Escape')     closeGalleryModal();
}

function closeGalleryModal(e) {
  if (e && e.target !== document.getElementById('gallery-modal')) return;
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', _galleryKeyHandler);
}
window.closeGalleryModal = closeGalleryModal;

function initGalleryModal() {
  // Wire up "📸 Photos" buttons
  document.querySelectorAll('[data-gallery]').forEach(card => {
    let images = [];
    try { images = JSON.parse(card.getAttribute('data-gallery')); } catch(e) {}
    if (!images.length) return;

    const title = card.getAttribute('data-gallery-title') || '';
    const btn   = card.querySelector('.gallery-btn');
    const cover = card.querySelector('.gallery-cover');

    if (btn)   btn.addEventListener('click',   (e) => { e.stopPropagation(); openGalleryModal(images, 0, title); });
    if (cover) cover.addEventListener('click', ()  => { openGalleryModal(images, 0, title); });
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
  initExecutiveModal();
  initGalleryModal();
});
