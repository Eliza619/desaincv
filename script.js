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

/* ── PREVIEW TEMPLATE CV ───────────────────────── */
let pkgPreviewSrc = '';
let pkgPreviewLabel = 'Template CV';
function openPkgModal(label) {
    const modal = document.getElementById('pkgModalOverlay');
    const title = document.getElementById('pkgModalTitle');
    const previewImage = document.getElementById('pkgPreviewImage');
    if (!modal || !previewImage) return;
    pkgPreviewLabel = label || 'Template CV';
    // Judul template
    if (title) {
        title.textContent = pkgPreviewLabel;
    }
    // Ambil kartu template yang diklik
    const card = event.target.closest('.pkg-preview-card');
    if (card) {
        // Ambil gambar otomatis
        const img = card.querySelector('img');
        if (img) {
            pkgPreviewSrc = img.currentSrc || img.src;
            // LANGSUNG TAMPILKAN GAMBAR
            previewImage.src = pkgPreviewSrc;
            previewImage.alt = pkgPreviewLabel;
        }
    }
    // Buka modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closePkgModal() {
    const modal = document.getElementById('pkgModalOverlay');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}
/* ── PREVIEW BUKTI WHATSAPP ───────────────────────── */
function openWaProof(itemEl) {
    const img = itemEl.querySelector('img');
    if (!img) return;
    pkgPreviewSrc = img.currentSrc || img.src;
    pkgPreviewLabel = img.alt || 'Bukti Chat WhatsApp';
    const previewImg = document.getElementById('previewImage');
    const previewTitle = document.getElementById('previewTitle');
    const overlay = document.getElementById('pkgPreviewOverlay');
    if (previewImg) {
        previewImg.src = pkgPreviewSrc;
        previewImg.alt = pkgPreviewLabel;
    }
    if (previewTitle) {
        previewTitle.textContent = pkgPreviewLabel;
    }
    if (overlay) {
        overlay.classList.add('open');
    }
    document.body.style.overflow = 'hidden';
}
function closePkgPreview() {
    const overlay = document.getElementById('pkgPreviewOverlay');
    if (overlay) {
        overlay.classList.remove('open');
    }
    document.body.style.overflow = '';
}
/* ── ESC ───────────────────────── */
document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    closePkgPreview();
    closePkgModal();
    closePromoModal();
    if (typeof closeTestiPreview === 'function') {
        closeTestiPreview();
    }
});
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

const track = document.getElementById("testiTrack");
let cards = [...track.querySelectorAll(".testi-card")];
const GAP = 28;
const SPEED = 650;
const DELAY = 2500;
let sliding = false;

/* Card tengah aktif */
function setActive() {
    cards = [...track.querySelectorAll(".testi-card")];
    cards.forEach(card => card.classList.remove("active"));
    if (cards[1]) {
        cards[1].classList.add("active");
    }
}

setActive();
function nextSlide() {
    if (sliding) return;
    sliding = true;
    const first = track.firstElementChild;
    const width = first.offsetWidth + GAP;
    track.style.transition = `transform ${SPEED}ms ease`;
    track.style.transform = `translateX(-${width}px)`;
    track.addEventListener("transitionend", function handler() {
        track.removeEventListener("transitionend", handler);
        // pindahkan card pertama ke belakang
        track.appendChild(first);
        // reset tanpa animasi
        track.style.transition = "none";
        track.style.transform = "translateX(0)";
        // paksa browser render ulang
        track.offsetHeight;
        setActive();
        sliding = false;
    });
}
setInterval(nextSlide, DELAY);

// ── NAVBAR ──────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // Klik menu
  navLinks.forEach(link => {
    link.addEventListener("click", function () {

      navLinks.forEach(item => item.classList.remove("active"));
      this.classList.add("active");

      // Tutup menu di mobile
      const navMenu = document.getElementById("navLinks");
      if (navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
      }

    });
  });

  // Saat scroll halaman
  function setActiveMenu() {

    let current = "";

    sections.forEach(section => {

      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }

    });

    navLinks.forEach(link => {

      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }

    });

  }

  window.addEventListener("scroll", setActiveMenu);

  // Jalankan saat pertama kali halaman dibuka
  setActiveMenu();

});

// ── PROMO POP UP OTOMATIS ──────────────────────────────────
window.addEventListener("load", () => {
    setTimeout(() => {
        openPromoModal();
    }, 1000);

});



// ── BUKA POP UP PROMO ──────────────────────────────────
function openPromoModal() {
    const modal = document.getElementById("promoModalOverlay");
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}

// ── TUTUP POP UP PROMO ──────────────────────────────────
function closePromoModal() {
    const modal = document.getElementById("promoModalOverlay");
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
}



/* =========================================================
   PROMO COUNTDOWN
   BERAKHIR SETIAP HARI PUKUL 23:59:00
========================================================= */

let promoCountdownInterval = null;


function startPromoCountdown(){

    const countdown =
        document.getElementById(
            "promoCountdown"
        );

    if(!countdown) return;


    function updateCountdown(){

        const now = new Date();

        const end = new Date();

        end.setHours(
            23,
            59,
            0,
            0
        );


        let remaining =
            end.getTime() -
            now.getTime();


        /* SUDAH LEWAT 23:59 */

        if(remaining <= 0){

            countdown.textContent =
                "00:00:00";

            return;

        }


        const hours =
            Math.floor(
                remaining /
                (1000 * 60 * 60)
            );


        const minutes =
            Math.floor(
                (
                    remaining %
                    (1000 * 60 * 60)
                ) /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (
                    remaining %
                    (1000 * 60)
                ) /
                1000
            );


        countdown.textContent =

            String(hours)
                .padStart(2,"0")

            + ":" +

            String(minutes)
                .padStart(2,"0")

            + ":" +

            String(seconds)
                .padStart(2,"0");

    }


    updateCountdown();


    if(promoCountdownInterval){

        clearInterval(
            promoCountdownInterval
        );

    }


    promoCountdownInterval =
        setInterval(
            updateCountdown,
            1000
        );

}


/* =========================================================
   BUKA PROMO
========================================================= */

function openPromoModal(){

    const modal =
        document.getElementById(
            "promoModalOverlay"
        );

    if(!modal) return;


    modal.classList.add("open");


    /* KUNCI SCROLL HALAMAN */

    document.body.style.overflow =
        "hidden";


    /* MULAI COUNTDOWN */

    startPromoCountdown();

}


/* =========================================================
   TUTUP PROMO
========================================================= */

function closePromoModal(){

    const modal =
        document.getElementById(
            "promoModalOverlay"
        );

    if(!modal) return;


    modal.classList.remove("open");


    /* BUKA KEMBALI SCROLL */

    document.body.style.overflow =
        "";


    if(promoCountdownInterval){

        clearInterval(
            promoCountdownInterval
        );

        promoCountdownInterval =
            null;

    }

}


/* =========================================================
   START COUNTDOWN SAAT HALAMAN SIAP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        startPromoCountdown();

    }
);


// ── DAFTAR HARGA ──────────────────────────────────
function goCheckout(name,price){
    localStorage.setItem("cartItems",JSON.stringify([{
        name:name,
        price:price
    }]));

    window.location.href="checkout.html";
}


function selectPackage(packageName, packagePrice){

    localStorage.setItem(
        "selectedPackage",
        JSON.stringify({
            name: packageName,
            price: packagePrice
        })
    );

    window.location.href =
        "template.html?package=" +
        encodeURIComponent(packageName) +
        "&price=" +
        encodeURIComponent(packagePrice);
}





