document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("templateGrid");
    const tabs = document.querySelectorAll(".template-tab");
    const count = document.getElementById("templateCount");
    const empty = document.getElementById("emptyTemplate");

    if (!grid) return;

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

    const templates = categories.flatMap(category =>
        Array.from({ length: category.total }, (_, i) => {
            const number = i + 1;

            return {
                id: `${category.key}-${number}`,
                name: `Template CV ${category.name} ${number}`,
                category: category.key,
                categoryName: category.label,
                image: `img/${category.folder}/${category.prefix}${number}.webp`
            };
        })
    );

    function normalizeFilter(value) {
        const aliases = {
            all: "all",
            semua: "all",
            "semua-template": "all",

            regular: "regular",
            reg: "regular",
            "paket-regular": "regular",

            premium: "premium",
            "paket-premium": "premium",

            ats: "ats",
            "ats-friendly": "ats",

            platinum: "platinum",
            "paket-platinum": "platinum"
        };

        return aliases[String(value || "all").toLowerCase().trim()] || "all";
    }

    function createCard(template) {
        const card = document.createElement("article");

        card.className = "template-card";
        card.dataset.templateId = template.id;
        card.dataset.category = template.category;

        card.innerHTML = `
            <div class="template-image">
                <span class="template-badge">
                    ${template.categoryName}
                </span>

                <img
                    src="${template.image}"
                    alt="${template.name}"
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="800"
                >
            </div>

            <div class="template-info">
                <h3>${template.name}</h3>

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

        card.querySelector(".choose-template")
            .addEventListener("click", () => {
                selectTemplate(template);
            });

        return card;
    }

    function selectTemplate(template) {
        const selectedTemplate = {
            id: template.id,
            name: template.name,
            category: template.category,
            categoryName: template.categoryName,
            image: template.image
        };

        localStorage.setItem(
            "selectedTemplate",
            JSON.stringify(selectedTemplate)
        );

        localStorage.setItem(
            "selectedTemplateId",
            template.id
        );

        localStorage.setItem(
            "selectedTemplateName",
            template.name
        );

        localStorage.setItem(
            "selectedTemplateCategory",
            template.category
        );

        localStorage.setItem(
            "selectedTemplateImage",
            template.image
        );

        localStorage.setItem(
            "checkoutSource",
            "template"
        );

        window.location.href = "checkout.html";
    }

    function render(filter = "all") {
        filter = normalizeFilter(filter);

        const list = filter === "all"
            ? templates
            : templates.filter(
                template => template.category === filter
            );

        grid.innerHTML = "";

        const fragment = document.createDocumentFragment();

        list.forEach(template => {
            fragment.appendChild(createCard(template));
        });

        grid.appendChild(fragment);

        if (count) {
            count.textContent = `${list.length} Template`;
        }

        if (empty) {
            empty.style.display =
                list.length ? "none" : "block";
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const filter = normalizeFilter(
                tab.dataset.filter
            );

            tabs.forEach(item =>
                item.classList.remove("active")
            );

            tab.classList.add("active");

            render(filter);

            try {
                const url = new URL(window.location.href);

                if (filter === "all") {
                    url.searchParams.delete("paket");
                } else {
                    url.searchParams.set("paket", filter);
                }

                history.replaceState({}, "", url);
            } catch {}
        });
    });

    const params =
        new URLSearchParams(window.location.search);

    const initialFilter =
        normalizeFilter(params.get("paket"));

    tabs.forEach(tab => {
        tab.classList.toggle(
            "active",
            normalizeFilter(tab.dataset.filter) === initialFilter
        );
    });

    render(initialFilter);
});

(() => {
    document.documentElement.classList.toggle(
        "dark",
        localStorage.getItem("theme") === "dark"
    );
})();