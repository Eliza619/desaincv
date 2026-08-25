/* =========================================================
   DESAINCV.TOP - OPTIMIZED MAIN SCRIPT
   Fokus:
   - Mobile Performance
   - Kurangi JavaScript yang berjalan terus
   - Hindari duplicate function
   - Testimoni hanya 1 autoplay
   - Promo countdown hanya saat dibutuhkan
========================================================= */

(function () {
    "use strict";

    /* =====================================================
       DARK / LIGHT MODE
    ===================================================== */

    function initTheme() {
        const saved = localStorage.getItem("theme");
        const systemDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        applyTheme(
            saved || (systemDark ? "dark" : "light"),
            false
        );
    }

    function applyTheme(theme, save = true) {

        if (theme === "dark") {
            document.documentElement.setAttribute(
                "data-theme",
                "dark"
            );
        } else {
            document.documentElement.removeAttribute(
                "data-theme"
            );
        }

        const icon = document.getElementById("themeIcon");

        if (icon) {
            icon.textContent =
                theme === "dark" ? "☀️" : "🌙";
        }

        if (save) {
            localStorage.setItem("theme", theme);
        }
    }

    window.toggleTheme = function () {

        const isDark =
            document.documentElement.getAttribute(
                "data-theme"
            ) === "dark";

        applyTheme(
            isDark ? "light" : "dark"
        );
    };


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    window.toggleMenu = function () {

        const navLinks =
            document.getElementById("navLinks");

        if (!navLinks) return;

        navLinks.classList.toggle("open");
    };


    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    function initFooterYear() {

        const footerYear =
            document.getElementById("footerYear");

        if (footerYear) {
            footerYear.textContent =
                new Date().getFullYear();
        }
    }


    /* =====================================================
       PACKAGE TAB
    ===================================================== */

    window.showPkg = function (id, btn) {

        document
            .querySelectorAll(".pkg-panel")
            .forEach(panel => {
                panel.classList.remove("active");
            });

        document
            .querySelectorAll(".pkg-tab")
            .forEach(tab => {
                tab.classList.remove("active");
            });

        const target =
            document.getElementById("pkg-" + id);

        if (target) {
            target.classList.add("active");
        }

        if (btn) {
            btn.classList.add("active");
        }
    };


    /* =====================================================
       PORTFOLIO FILTER
    ===================================================== */

    window.filterPortfolio = function (cat, btn) {

        document
            .querySelectorAll(".portfolio-tab")
            .forEach(tab => {
                tab.classList.remove("active");
            });

        if (btn) {
            btn.classList.add("active");
        }

        const items =
            document.querySelectorAll(
                ".portfolio-item"
            );

        let visibleCount = 0;

        items.forEach(item => {

            const show =
                cat === "semua" ||
                item.dataset.cat === cat;

            item.hidden = !show;

            if (show) {
                visibleCount++;
            }
        });

        const empty =
            document.getElementById(
                "portfolioEmpty"
            );

        if (empty) {
            empty.hidden =
                visibleCount !== 0;
        }
    };


    /* =====================================================
       FAQ
    ===================================================== */

    window.toggleFaq = function (btn) {

        if (!btn) return;

        const item =
            btn.parentElement;

        if (!item) return;

        const isOpen =
            item.classList.toggle("open");

        btn.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    };


    /* =====================================================
       TEMPLATE PREVIEW
    ===================================================== */

    let pkgPreviewSrc = "";
    let pkgPreviewLabel = "Template CV";


    window.openPkgModal = function (label, element) {

        const modal =
            document.getElementById(
                "pkgModalOverlay"
            );

        const title =
            document.getElementById(
                "pkgModalTitle"
            );

        const previewImage =
            document.getElementById(
                "pkgPreviewImage"
            );

        if (!modal || !previewImage) {
            return;
        }

        pkgPreviewLabel =
            label || "Template CV";

        if (title) {
            title.textContent =
                pkgPreviewLabel;
        }

        const card =
            element
                ? element.closest(".pkg-preview-card")
                : null;

        if (card) {

            const img =
                card.querySelector("img");

            if (img) {

                pkgPreviewSrc =
                    img.currentSrc ||
                    img.src;

                previewImage.src =
                    pkgPreviewSrc;

                previewImage.alt =
                    pkgPreviewLabel;
            }
        }

        modal.classList.add("open");

        document.body.style.overflow =
            "hidden";
    };


    window.closePkgModal = function () {

        const modal =
            document.getElementById(
                "pkgModalOverlay"
            );

        if (!modal) return;

        modal.classList.remove("open");

        document.body.style.overflow = "";
    };


    /* =====================================================
       WHATSAPP PROOF PREVIEW
    ===================================================== */

    window.openWaProof = function (itemEl) {

        if (!itemEl) return;

        const img =
            itemEl.querySelector("img");

        if (!img) return;

        pkgPreviewSrc =
            img.currentSrc ||
            img.src;

        pkgPreviewLabel =
            img.alt ||
            "Bukti Chat WhatsApp";

        const previewImg =
            document.getElementById(
                "previewImage"
            );

        const previewTitle =
            document.getElementById(
                "previewTitle"
            );

        const overlay =
            document.getElementById(
                "pkgPreviewOverlay"
            );

        if (previewImg) {

            previewImg.src =
                pkgPreviewSrc;

            previewImg.alt =
                pkgPreviewLabel;
        }

        if (previewTitle) {
            previewTitle.textContent =
                pkgPreviewLabel;
        }

        if (overlay) {
            overlay.classList.add("open");
        }

        document.body.style.overflow =
            "hidden";
    };


    window.closePkgPreview = function () {

        const overlay =
            document.getElementById(
                "pkgPreviewOverlay"
            );

        if (overlay) {
            overlay.classList.remove("open");
        }

        document.body.style.overflow = "";
    };


    /* =====================================================
       PROMO POPUP
       SATU VERSI SAJA
    ===================================================== */

    let promoCountdownInterval = null;


    function updatePromoCountdown() {

        const countdown =
            document.getElementById(
                "promoCountdown"
            );

        if (!countdown) {
            return false;
        }

        const now = new Date();

        const end = new Date();

        end.setHours(
            23,
            59,
            0,
            0
        );

        const remaining =
            end.getTime() -
            now.getTime();

        if (remaining <= 0) {

            countdown.textContent =
                "00:00:00";

            return false;
        }

        const hours =
            Math.floor(
                remaining / 3600000
            );

        const minutes =
            Math.floor(
                (remaining % 3600000) /
                60000
            );

        const seconds =
            Math.floor(
                (remaining % 60000) /
                1000
            );

        countdown.textContent =
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

        return true;
    }


    function startPromoCountdown() {

        if (promoCountdownInterval) {
            return;
        }

        updatePromoCountdown();

        promoCountdownInterval =
            setInterval(() => {

                const active =
                    updatePromoCountdown();

                if (!active) {
                    stopPromoCountdown();
                }

            }, 1000);
    }


    function stopPromoCountdown() {

        if (!promoCountdownInterval) {
            return;
        }

        clearInterval(
            promoCountdownInterval
        );

        promoCountdownInterval =
            null;
    }


    window.openPromoModal = function () {

        const modal =
            document.getElementById(
                "promoModalOverlay"
            );

        if (!modal) return;

        modal.classList.add("open");

        document.body.style.overflow =
            "hidden";

        startPromoCountdown();
    };


    window.closePromoModal = function () {

        const modal =
            document.getElementById(
                "promoModalOverlay"
            );

        if (!modal) return;

        modal.classList.remove("open");

        document.body.style.overflow = "";

        stopPromoCountdown();
    };


    /* =====================================================
       PROMO AUTO OPEN
       TUNGGU HALAMAN SELESAI
    ===================================================== */

    function initPromo() {

        const modal =
            document.getElementById(
                "promoModalOverlay"
            );

        if (!modal) return;

        setTimeout(() => {

            openPromoModal();

        }, 1500);
    }


    /* =====================================================
       TESTIMONI AUTOPLAY
       HANYA SATU SISTEM
    ===================================================== */

    function initTestimonials() {

        const track =
            document.getElementById(
                "testiTrack"
            );

        if (!track) {
            return;
        }

        const cards =
            [...track.querySelectorAll(
                ".testi-card"
            )];

        if (cards.length < 3) {
            return;
        }

        let sliding = false;
        let timer = null;

        const GAP = 28;
        const DELAY = 3500;
        const SPEED = 600;


        function setActive() {

            const currentCards =
                track.querySelectorAll(
                    ".testi-card"
                );

            currentCards.forEach(card => {
                card.classList.remove(
                    "active"
                );
            });

            if (currentCards[1]) {
                currentCards[1]
                    .classList.add("active");
            }
        }


        function nextSlide() {

            if (sliding) {
                return;
            }

            /*
               Jangan animasikan kalau tab
               sedang tidak terlihat.
            */

            if (
                document.hidden ||
                !isElementVisible(track)
            ) {
                return;
            }

            const first =
                track.firstElementChild;

            if (!first) return;

            sliding = true;

            const width =
                first.offsetWidth +
                GAP;

            track.style.transition =
                `transform ${SPEED}ms ease`;

            track.style.transform =
                `translateX(-${width}px)`;


            const handler = () => {

                track.removeEventListener(
                    "transitionend",
                    handler
                );

                track.appendChild(first);

                track.style.transition =
                    "none";

                track.style.transform =
                    "translateX(0)";

                setActive();

                sliding = false;
            };


            track.addEventListener(
                "transitionend",
                handler
            );
        }


        function start() {

            if (timer) return;

            timer =
                setInterval(
                    nextSlide,
                    DELAY
                );
        }


        function stop() {

            if (!timer) return;

            clearInterval(timer);

            timer = null;
        }


        track.addEventListener(
            "mouseenter",
            stop
        );

        track.addEventListener(
            "mouseleave",
            start
        );


        document.addEventListener(
            "visibilitychange",
            () => {

                if (document.hidden) {
                    stop();
                } else {
                    start();
                }

            }
        );


        setActive();

        start();
    }


    /* =====================================================
       HELPER
    ===================================================== */

    function isElementVisible(element) {

        if (!element) {
            return false;
        }

        const rect =
            element.getBoundingClientRect();

        return (
            rect.bottom > 0 &&
            rect.top <
                window.innerHeight
        );
    }


    /* =====================================================
       NAVBAR ACTIVE
       PAKAI REQUESTANIMATIONFRAME
       AGAR TIDAK HITUNG TERUS-MENERUS
    ===================================================== */

    function initNavbar() {

        const navLinks =
            document.querySelectorAll(
                '.nav-links a[href^="#"]'
            );

        const sections =
            document.querySelectorAll(
                "section[id]"
            );

        if (!navLinks.length) {
            return;
        }


        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                function () {

                    navLinks.forEach(item => {
                        item.classList.remove(
                            "active"
                        );
                    });

                    this.classList.add(
                        "active"
                    );

                    const navMenu =
                        document.getElementById(
                            "navLinks"
                        );

                    if (
                        navMenu &&
                        navMenu.classList.contains(
                            "open"
                        )
                    ) {
                        navMenu.classList.remove(
                            "open"
                        );
                    }
                }
            );
        });


        let ticking = false;


        function updateActiveMenu() {

            const scrollY =
                window.scrollY;

            let current = "";


            sections.forEach(section => {

                const top =
                    section.offsetTop - 120;

                const bottom =
                    top +
                    section.offsetHeight;

                if (
                    scrollY >= top &&
                    scrollY < bottom
                ) {
                    current =
                        section.id;
                }
            });


            navLinks.forEach(link => {

                link.classList.remove(
                    "active"
                );

                if (
                    link.getAttribute("href") ===
                    "#" + current
                ) {
                    link.classList.add(
                        "active"
                    );
                }
            });

            ticking = false;
        }


        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    window.requestAnimationFrame(
                        updateActiveMenu
                    );

                    ticking = true;
                }

            },
            {
                passive: true
            }
        );


        updateActiveMenu();
    }


    /* =====================================================
       CHECKOUT
    ===================================================== */

    window.goCheckout = function (
        name,
        price
    ) {

        localStorage.setItem(
            "cartItems",
            JSON.stringify([
                {
                    name: name,
                    price: price
                }
            ])
        );

        window.location.href =
            "checkout.html";
    };


    window.selectPackage = function (
        packageName,
        packagePrice
    ) {

        let paket = "";

        const name =
            packageName.toLowerCase();


        if (
            name.includes("regular")
        ) {

            paket = "regular";

        } else if (
            name.includes("premium")
        ) {

            paket = "premium";

        } else if (
            name.includes("platinum")
        ) {

            paket = "platinum";
        }


        localStorage.setItem(
            "selectedPackage",
            JSON.stringify({
                name: packageName,
                price: packagePrice
            })
        );


        window.location.href =
            "template.html?paket=" +
            encodeURIComponent(paket);
    };


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    function initEscapeKey() {

        document.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Escape") {
                    return;
                }

                closePkgPreview();
                closePkgModal();
                closePromoModal();

                if (
                    typeof window.closeTestiPreview ===
                    "function"
                ) {
                    window.closeTestiPreview();
                }
            }
        );
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    initTheme();

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            initFooterYear();
            initNavbar();
            initTestimonials();
            initPromo();
            initEscapeKey();

        }
    );

})();