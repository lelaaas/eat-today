/* ============ EAT TODAY — script ============ */

/* ---------- Navbar ---------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- Interactive demo (homepage only) ---------- */
const demoStage = document.getElementById('demoStage');
if (demoStage) {
  const screens = [...document.querySelectorAll('.demo-screen')];
  const dots = [...document.querySelectorAll('.demo-dot')];
  const progressBar = document.getElementById('demoProgress');
  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    if (index < 0 || index >= screens.length || index === current) return;
    screens[current].classList.add('leaving');
    screens[current].classList.remove('active');
    setTimeout(() => screens[current].classList.remove('leaving'), 500);
    current = index;
    screens[current].classList.add('active');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current);
    });
    if (progressBar) progressBar.style.width = ((current + 1) / screens.length * 100) + '%';
    resetAuto();
  }

  const nextBtn = document.getElementById('demoNext');
  const prevBtn = document.getElementById('demoPrev');
  if (nextBtn) nextBtn.addEventListener('click', () => goTo((current + 1) % screens.length));
  if (prevBtn) prevBtn.addEventListener('click', () => goTo((current - 1 + screens.length) % screens.length));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.screen)));

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo((current + 1) % screens.length), 7000);
  }
  const demoShell = document.getElementById('demoShell');
  if (demoShell) {
    demoShell.addEventListener('mouseenter', () => clearInterval(autoTimer));
    demoShell.addEventListener('mouseleave', resetAuto);
  }
  resetAuto();

  let touchStartX = 0;
  demoStage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  demoStage.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? goTo((current + 1) % screens.length) : goTo((current - 1 + screens.length) % screens.length);
  }, { passive: true });

  document.addEventListener('keydown', e => {
    const r = demoStage.getBoundingClientRect();
    const visible = r.top < window.innerHeight && r.bottom > 0;
    if (!visible) return;
    if (e.key === 'ArrowRight') goTo((current + 1) % screens.length);
    if (e.key === 'ArrowLeft') goTo((current - 1 + screens.length) % screens.length);
  });

  const scanBtn = document.getElementById('scanBtn');
  const fridge = document.querySelector('.fridge');
  if (scanBtn && fridge) {
    scanBtn.addEventListener('click', () => {
      if (fridge.classList.contains('scanning')) return;
      fridge.classList.add('scanning');
      scanBtn.textContent = '⏳ Skeniranje u toku…';
      setTimeout(() => {
        fridge.classList.remove('scanning');
        scanBtn.textContent = '📷 Skeniraj moj frižider';
        goTo(1);
      }, 2200);
    });
  }
}

/* ---------- Problem cards: tap-to-flip on touch devices ---------- */
document.querySelectorAll('.problem-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flip'));
});

/* ---------- Animated counters ---------- */
function animateCounter(el) {
  const target = +el.dataset.target;
  const dur = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('sr-RS');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

/* ---------- App preview tabs ---------- */
const previewTabs = [...document.querySelectorAll('.preview-tab')];
const appViews = [...document.querySelectorAll('.app-view')];

previewTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    previewTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    appViews.forEach(v => v.classList.toggle('active', v.dataset.app === tab.dataset.app));
  });
});

/* ---------- Shopping list check ---------- */
document.querySelectorAll('.shop-item input').forEach(cb => {
  cb.addEventListener('change', () => cb.closest('.shop-item').style.opacity = cb.checked ? '.55' : '1');
});

/* ---------- Early access form (premium page) ---------- */
const earlyForm = document.getElementById('earlyForm');
if (earlyForm) {
  earlyForm.addEventListener('submit', e => {
    e.preventDefault();
    earlyForm.style.display = 'none';
    const msg = document.getElementById('formSuccess');
    if (msg) msg.style.display = 'inline-block';
  });
}
