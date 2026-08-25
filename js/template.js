/* =========================================================
   ANTI SCRIPT DUPLICATE
   Kalau template.js tidak sengaja dipanggil 2x,
   render hanya akan dijalankan sekali.
========================================================= */

if (window.__DESAINCV_TEMPLATE_SCRIPT_LOADED__) {

    console.warn(
        "DesainCV.TOP: template.js sudah dimuat sebelumnya."
    );

} else {

    window.__DESAINCV_TEMPLATE_SCRIPT_LOADED__ = true;


    /* =====================================================
       DOM READY
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {


            /* =================================================
               ELEMENT
            ================================================= */

            const grid =
                document.getElementById("templateGrid");

            const tabs =
                document.querySelectorAll(".template-tab");

            const count =
                document.getElementById("templateCount");

            const empty =
                document.getElementById("emptyTemplate");


            /*
             * Kalau grid tidak ditemukan,
             * hentikan script.
             */

            if (!grid) {

                console.warn(
                    "DesainCV.TOP: #templateGrid tidak ditemukan."
                );

                return;

            }


            /* =================================================
               KATEGORI PAKET
            ================================================= */

            const categories = [

                {
                    key: "regular",
                    name: "Regular",
                    label: "Paket Regular",
                    folder: "regular",
                    prefix: "regular-",
                    total: 5
                },

                {
                    key: "premium",
                    name: "Premium",
                    label: "Paket Premium",
                    folder: "premium",
                    prefix: "premium-",
                    total: 9
                },

                {
                    key: "ats",
                    name: "ATS",
                    label: "ATS Friendly",
                    folder: "ats",
                    prefix: "ATS_",
                    total: 5
                },

                {
                    key: "platinum",
                    name: "Platinum",
                    label: "Paket Platinum",
                    folder: "platinum",
                    prefix: "platinum-",
                    total: 40
                }

            ];


            /* =================================================
               BUAT DATA SEMUA TEMPLATE
            ================================================= */

            const templates = [];


            categories.forEach(function (category) {

                for (
                    let number = 1;
                    number <= category.total;
                    number++
                ) {

                    templates.push({

                        id:
                            `${category.key}-${number}`,

                        name:
                            `Template CV ${category.name} ${number}`,

                        category:
                            category.key,

                        categoryName:
                            category.label,

                        folder:
                            category.folder,

                        prefix:
                            category.prefix,

                        number:
                            number

                    });

                }

            });


            /* =================================================
               NORMALISASI FILTER
            ================================================= */

            function normalizeFilter(value) {

                if (!value) {

                    return "all";

                }


                value =
                    String(value)
                        .toLowerCase()
                        .trim();


                const aliases = {

                    "all":
                        "all",

                    "semua":
                        "all",

                    "semua-template":
                        "all",

                    "regular":
                        "regular",

                    "reg":
                        "regular",

                    "paket-regular":
                        "regular",

                    "paketregular":
                        "regular",

                    "premium":
                        "premium",

                    "paket-premium":
                        "premium",

                    "paketpremium":
                        "premium",

                    "ats":
                        "ats",

                    "ats-friendly":
                        "ats",

                    "atsfriendly":
                        "ats",

                    "paket-ats":
                        "ats",

                    "platinum":
                        "platinum",

                    "paket-platinum":
                        "platinum",

                    "paketplatinum":
                        "platinum"

                };


                return aliases[value] || "all";

            }


            /* =================================================
               CARI GAMBAR
            ================================================= */

            function findImage(template) {

                return new Promise(
                    function (resolve) {

                        const extensions = [
                            "jpg",
                            "jpeg",
                            "png",
                            "webp"
                        ];


                        let index = 0;


                        function checkNext() {

                            if (
                                index >=
                                extensions.length
                            ) {

                                resolve(null);

                                return;

                            }


                            const extension =
                                extensions[index];


                            const path =
                                `img/${template.folder}/${template.prefix}${template.number}.${extension}`;


                            const image =
                                new Image();


                            image.onload =
                                function () {

                                    resolve(path);

                                };


                            image.onerror =
                                function () {

                                    index++;

                                    checkNext();

                                };


                            image.src = path;

                        }


                        checkNext();

                    }
                );

            }


            /* =================================================
               BUAT CARD
            ================================================= */

            function createCard(
                template,
                imagePath
            ) {

                const card =
                    document.createElement("article");


                card.className =
                    "template-card";


                /*
                 * Simpan ID template di element.
                 * Berguna untuk mencegah duplicate.
                 */

                card.dataset.templateId =
                    template.id;


                card.dataset.category =
                    template.category;


                card.innerHTML = `

                    <div class="template-image">

                        <span class="template-badge">
                            ${template.categoryName}
                        </span>

                        <img
                            src="${imagePath}"
                            alt="${template.name}"
                            loading="lazy"
                            decoding="async"
                        >

                    </div>


                    <div class="template-info">

                        <h3>
                            ${template.name}
                        </h3>

                        <p class="template-category">
                            ${template.categoryName}
                        </p>

                        <button
                            type="button"
                            class="choose-template"
                        >
                            Pilih Template
                        </button>

                    </div>

                `;


                /* =================================================
                   BUTTON PILIH TEMPLATE
                ================================================= */

                const button =
                    card.querySelector(
                        ".choose-template"
                    );


                if (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            selectTemplate(
                                template,
                                imagePath
                            );

                        }
                    );

                }


                return card;

            }


            /* =================================================
               PILIH TEMPLATE
            ================================================= */

            function selectTemplate(
                template,
                imagePath
            ) {

                const selectedTemplate = {

                    id:
                        template.id,

                    name:
                        template.name,

                    category:
                        template.category,

                    categoryName:
                        template.categoryName,

                    image:
                        imagePath

                };


                /* =============================================
                   SIMPAN OBJECT UTAMA
                ============================================= */

                localStorage.setItem(
                    "selectedTemplate",
                    JSON.stringify(
                        selectedTemplate
                    )
                );


                /* =============================================
                   SIMPAN DATA TERPISAH
                ============================================= */

                localStorage.setItem(
                    "selectedTemplateId",
                    selectedTemplate.id
                );


                localStorage.setItem(
                    "selectedTemplateName",
                    selectedTemplate.name
                );


                localStorage.setItem(
                    "selectedTemplateCategory",
                    selectedTemplate.category
                );


                localStorage.setItem(
                    "selectedTemplateImage",
                    selectedTemplate.image
                );


                /* =============================================
                   SUMBER CHECKOUT
                ============================================= */

                localStorage.setItem(
                    "checkoutSource",
                    "template"
                );


                /* =============================================
                   REDIRECT
                ============================================= */

                window.location.href =
                    "checkout.html";

            }


            /* =================================================
               TOKEN RENDER
               
               Ini penting.
               Kalau user klik tab berkali-kali dengan cepat,
               render sebelumnya akan dianggap tidak berlaku.
            ================================================= */

            let renderToken = 0;


            /* =================================================
               RENDER TEMPLATE
            ================================================= */

            async function render(
                filter = "all"
            ) {

                /*
                 * Buat token baru.
                 */

                const currentToken =
                    ++renderToken;


                /*
                 * Normalisasi filter.
                 */

                filter =
                    normalizeFilter(filter);


                /* =============================================
                   KOSONGKAN GRID
                ============================================= */

                grid.innerHTML = "";


                /* =============================================
                   EMPTY STATE
                ============================================= */

                if (empty) {

                    empty.style.display =
                        "none";

                }


                /* =============================================
                   FILTER DATA
                ============================================= */

                let list;


                if (filter === "all") {

                    /*
                     * Semua kategori.
                     */

                    list =
                        templates.slice();

                } else {

                    /*
                     * PENTING:
                     *
                     * HANYA kategori yang dipilih.
                     *
                     * Regular = Regular saja
                     * Premium = Premium saja
                     * ATS = ATS saja
                     * Platinum = Platinum saja
                     */

                    list =
                        templates.filter(
                            function (template) {

                                return (
                                    template.category ===
                                    filter
                                );

                            }
                        );

                }


                /* =============================================
                   SET UNTUK ANTI DUPLICATE
                ============================================= */

                const renderedTemplateIds =
                    new Set();


                const renderedImages =
                    new Set();


                let shown = 0;


                /* =============================================
                   RENDER
                ============================================= */

                for (
                    const template of list
                ) {

                    /*
                     * Kalau sudah ada render baru,
                     * hentikan render lama.
                     */

                    if (
                        currentToken !==
                        renderToken
                    ) {

                        return;

                    }


                    /*
                     * Anti duplicate berdasarkan ID.
                     */

                    if (
                        renderedTemplateIds.has(
                            template.id
                        )
                    ) {

                        continue;

                    }


                    const imagePath =
                        await findImage(
                            template
                        );


                    /*
                     * Kalau render baru sudah dimulai,
                     * render lama dibatalkan.
                     */

                    if (
                        currentToken !==
                        renderToken
                    ) {

                        return;

                    }


                    /*
                     * Gambar tidak ditemukan.
                     */

                    if (!imagePath) {

                        continue;

                    }


                    /*
                     * Anti duplicate berdasarkan
                     * path gambar.
                     */

                    if (
                        renderedImages.has(
                            imagePath
                        )
                    ) {

                        continue;

                    }


                    /*
                     * Tandai sudah digunakan.
                     */

                    renderedTemplateIds.add(
                        template.id
                    );


                    renderedImages.add(
                        imagePath
                    );


                    /* =========================================
                       BUAT CARD
                    ========================================= */

                    const card =
                        createCard(
                            template,
                            imagePath
                        );


                    grid.appendChild(
                        card
                    );


                    shown++;

                }


                /* =============================================
                   UPDATE COUNT
                ============================================= */

                if (count) {

                    count.textContent =
                        `${shown} Template`;

                }


                /* =============================================
                   EMPTY STATE
                ============================================= */

                if (
                    shown === 0 &&
                    empty
                ) {

                    empty.style.display =
                        "block";

                }

            }


            /* =================================================
               FILTER TAB
            ================================================= */

            tabs.forEach(
                function (tab) {

                    /*
                     * Hindari event listener ganda
                     * pada element yang sama.
                     */

                    if (
                        tab.dataset.templateListener ===
                        "true"
                    ) {

                        return;

                    }


                    tab.dataset.templateListener =
                        "true";


                    tab.addEventListener(
                        "click",
                        function () {


                            /* =================================
                               FILTER
                            ================================= */

                            const filter =
                                normalizeFilter(
                                    this.dataset.filter
                                );


                            /* =================================
                               ACTIVE TAB
                            ================================= */

                            tabs.forEach(
                                function (item) {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                            this.classList.add(
                                "active"
                            );


                            /* =================================
                               RENDER
                            ================================= */

                            render(
                                filter
                            );


                            /* =================================
                               UPDATE URL
                            ================================= */

                            try {

                                const url =
                                    new URL(
                                        window.location.href
                                    );


                                if (
                                    filter ===
                                    "all"
                                ) {

                                    url.searchParams.delete(
                                        "paket"
                                    );

                                } else {

                                    url.searchParams.set(
                                        "paket",
                                        filter
                                    );

                                }


                                window.history.replaceState(
                                    {},
                                    "",
                                    url
                                );

                            } catch (error) {

                                console.warn(
                                    "URL tidak dapat diperbarui:",
                                    error
                                );

                            }

                        }
                    );

                }
            );


            /* =================================================
               AMBIL PAKET DARI URL
            ================================================= */

            const urlParams =
                new URLSearchParams(
                    window.location.search
                );


            const paketURL =
                urlParams.get(
                    "paket"
                );


            /* =================================================
               FILTER AWAL
            ================================================= */

            const initialFilter =
                normalizeFilter(
                    paketURL
                );


            /* =================================================
               ACTIVE TAB AWAL
            ================================================= */

            tabs.forEach(
                function (tab) {

                    const tabFilter =
                        normalizeFilter(
                            tab.dataset.filter
                        );


                    tab.classList.toggle(
                        "active",
                        tabFilter ===
                        initialFilter
                    );

                }
            );


            /* =================================================
               RENDER AWAL
            ================================================= */

            render(
                initialFilter
            );


        }
    );


    /* =========================================================
       DARK MODE
    ========================================================= */

    (function () {

        const savedTheme =
            localStorage.getItem(
                "theme"
            );


        if (
            savedTheme ===
            "dark"
        ) {

            document.documentElement.classList.add(
                "dark"
            );

        } else {

            document.documentElement.classList.remove(
                "dark"
            );

        }

    })();

}