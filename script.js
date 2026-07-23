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
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
function openPkgModal(label) {
  document.getElementById('pkgModalTitle').textContent = label;
  document.getElementById('pkgModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePkgModal() {
  document.getElementById('pkgModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePkgModal();
});
