// ── DARK / LIGHT MODE ──────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(theme);
})();

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light' : 'dark');
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
const footerYearEl = document.getElementById('footerYear');
if (footerYearEl) footerYearEl.textContent = new Date().getFullYear();
function showPkg(id) {
  document.querySelectorAll('.pkg-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.pkg-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('pkg-' + id).classList.add('active');
  event.target.classList.add('active');
}
function filterPortfolio(cat, btn) {
  document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const items = document.querySelectorAll('.portfolio-item');
  let visibleCount = 0;
  items.forEach(item => {
    const show = cat === 'semua' || item.getAttribute('data-cat') === cat;
    item.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  const empty = document.getElementById('portfolioEmpty');
  if (empty) empty.style.display = visibleCount === 0 ? '' : 'none';
}

function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
let pkgPreviewSrc = '';
let pkgPreviewLabel = 'Template CV';

function openPkgModal(label, showPreview) {
  if (showPreview === undefined) showPreview = true;
  pkgPreviewLabel = label;
  document.getElementById('pkgModalTitle').textContent = label;

  // Ambil gambar template dari kartu yang baru saja diklik (kalau ada)
  const card = event && event.target ? event.target.closest('.pkg-preview-card') : null;
  const img = card ? card.querySelector('img') : null;
  pkgPreviewSrc = img ? img.getAttribute('src') : '';

  const previewBtn = document.getElementById('pkgPreviewBtn');
  if (previewBtn) previewBtn.style.display = (showPreview && pkgPreviewSrc) ? '' : 'none';

  // Pre-fill pesan WhatsApp sesuai paket/template yang dipilih
  const waBtn = document.getElementById('pkgModalWaBtn');
  if (waBtn) {
    const msg = 'Halo, saya mau tanya/pesan ' + label + ' 🙂';
    waBtn.setAttribute('href', 'https://wa.me/6285850551566?text=' + encodeURIComponent(msg));
  }

  document.getElementById('pkgModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePkgModal() {
  document.getElementById('pkgModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function openPkgPreview() {
  const previewImg = document.getElementById('pkgPreviewImg');
  const previewTitle = document.getElementById('pkgPreviewTitle');
  previewImg.src = pkgPreviewSrc;
  previewImg.alt = 'Preview ' + pkgPreviewLabel;
  previewTitle.textContent = pkgPreviewLabel;
  document.getElementById('pkgPreviewOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePkgPreview() {
  document.getElementById('pkgPreviewOverlay').classList.remove('open');
  // Balik ke modal pilihan kalau modal itu masih terbuka di belakang
  const pkgModalOpen = document.getElementById('pkgModalOverlay').classList.contains('open');
  document.body.style.overflow = pkgModalOpen ? 'hidden' : '';
}

function openWaProof(itemEl) {
  const img = itemEl.querySelector('img');
  if (!img) return;
  pkgPreviewSrc = img.getAttribute('src');
  pkgPreviewLabel = img.getAttribute('alt') || 'Bukti Chat WhatsApp';
  openPkgPreview();
}

function openPromoModal() {
  document.getElementById('promoModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePromoModal() {
  document.getElementById('promoModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  try { sessionStorage.setItem('promoModalShown', '1'); } catch (e) {}
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closePkgPreview();
  closePkgModal();
  closePromoModal();
  closeTestiPreview();
});

// Tampilkan popup promo bulanan otomatis saat web dibuka (sekali per sesi browser)
window.addEventListener('load', () => {
  let alreadyShown = false;
  try { alreadyShown = sessionStorage.getItem('promoModalShown') === '1'; } catch (e) {}
  if (!alreadyShown) {
    setTimeout(openPromoModal, 1000);
  }
});

function testiStepAmount(grid) {
  const card = grid.querySelector('.testi-card');
  return card ? card.getBoundingClientRect().width + 20 : 300;
}

function scrollTesti(dir) {
  const grid = document.getElementById('testiGrid');
  if (!grid) return;
  grid.scrollBy({ left: dir * testiStepAmount(grid), behavior: 'smooth' });
}

let testiAutoPaused = false;

// ── AUTO GESER TESTIMONI (langsung pindah, bukan geser perlahan) ──
(function initTestiAutoplay() {
  const grid = document.getElementById('testiGrid');
  if (!grid) return;

  let timer = null;

  function advance() {
    if (testiAutoPaused) return;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const nextLeft = grid.scrollLeft + testiStepAmount(grid);
    if (nextLeft >= maxScroll - 10) {
      grid.scrollTo({ left: 0, behavior: 'auto' });
    } else {
      grid.scrollTo({ left: nextLeft, behavior: 'auto' });
    }
  }

  function start() {
    stop();
    timer = setInterval(advance, 2800);
  }
  function stop() {
    if (timer) clearInterval(timer);
  }

  grid.addEventListener('mouseenter', () => { testiAutoPaused = true; });
  grid.addEventListener('mouseleave', () => { testiAutoPaused = false; });
  grid.addEventListener('touchstart', () => { testiAutoPaused = true; }, { passive: true });
  grid.addEventListener('touchend', () => {
    setTimeout(() => { testiAutoPaused = false; }, 2500);
  });

  start();
})();

// ── KLIK TESTIMONI = LANGSUNG LIHAT PREVIEW BESAR ──────
function openTestiPreview(cardEl) {
  const stars = cardEl.querySelector('.testi-stars');
  const text = cardEl.querySelector('.testi-text');
  const avatar = cardEl.querySelector('.testi-avatar');
  const name = cardEl.querySelector('.testi-name');
  const role = cardEl.querySelector('.testi-role');

  document.getElementById('testiPreviewStars').textContent = stars ? stars.textContent : '';
  document.getElementById('testiPreviewText').textContent = text ? text.textContent : '';
  document.getElementById('testiPreviewAvatar').textContent = avatar ? avatar.textContent : '';
  document.getElementById('testiPreviewName').textContent = name ? name.textContent : '';
  document.getElementById('testiPreviewRole').textContent = role ? role.textContent : '';

  testiAutoPaused = true;
  document.getElementById('testiPreviewOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeTestiPreview() {
  document.getElementById('testiPreviewOverlay').classList.remove('open');
  document.body.style.overflow = '';
  testiAutoPaused = false;
}
