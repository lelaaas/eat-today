/* ============ EAT TODAY — script ============ */

/* ---------- Navbar ---------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

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

/* ---------- Demo screens ---------- */
const screens = [...document.querySelectorAll('.demo-screen')];
const dots = [...document.querySelectorAll('.demo-dot')];
const progressBar = document.getElementById('demoProgress');
const demoStage = document.getElementById('demoStage');
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
  progressBar.style.width = ((current + 1) / screens.length * 100) + '%';
  resetAuto();
}

document.getElementById('demoNext').addEventListener('click', () => goTo((current + 1) % screens.length));
document.getElementById('demoPrev').addEventListener('click', () => goTo((current - 1 + screens.length) % screens.length));
dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.screen)));

/* Auto-advance every 7s, paused on hover/touch */
function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo((current + 1) % screens.length), 7000);
}
const demoShell = document.getElementById('demoShell');
demoShell.addEventListener('mouseenter', () => clearInterval(autoTimer));
demoShell.addEventListener('mouseleave', resetAuto);
resetAuto();

/* Swipe support */
let touchStartX = 0;
demoStage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
demoStage.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? goTo((current + 1) % screens.length) : goTo((current - 1 + screens.length) % screens.length);
}, { passive: true });

/* Screen 1: scan button triggers beam, then advances */
const scanBtn = document.getElementById('scanBtn');
const fridge = document.querySelector('.fridge');
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

/* Keyboard navigation for demo */
document.addEventListener('keydown', e => {
  const demoVisible = demoStage.getBoundingClientRect().top < window.innerHeight && demoStage.getBoundingClientRect().bottom > 0;
  if (!demoVisible) return;
  if (e.key === 'ArrowRight') goTo((current + 1) % screens.length);
  if (e.key === 'ArrowLeft') goTo((current - 1 + screens.length) % screens.length);
});

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

/* Nutrition ring animation when demo screen 6 activates (handled via CSS class)
   and macro bars animate via CSS when .active is applied. */

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

/* Shopping list check animation */
document.querySelectorAll('.shop-item input').forEach(cb => {
  cb.addEventListener('change', () => cb.closest('.shop-item').style.opacity = cb.checked ? '.55' : '1');
});
