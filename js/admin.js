/* =========================================================
   ADMIN.JS — DESAINCV.TOP
   ADMIN DASHBOARD + SUPABASE
   ========================================================= */

document.addEventListener("DOMContentLoaded", async function () {
    "use strict";

    const supabaseClient = window.supabaseClient;

    if (!supabaseClient) {
        alert("Supabase belum terhubung.");
        return;
    }

    /* =====================================================
       ELEMENT
    ===================================================== */

    const loginPage = document.getElementById("loginPage");
    const dashboard = document.getElementById("dashboard");
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const refreshButton = document.getElementById("refreshButton");
    const ordersBody = document.getElementById("ordersBody");
    const searchInput = document.getElementById("searchInput");
    const paymentFilter = document.getElementById("paymentFilter");
    const orderFilter = document.getElementById("orderFilter");

    const detailModal = document.getElementById("detailModal");
    const closeModal = document.getElementById("closeModal");
    const orderDetail = document.getElementById("orderDetail");

    const proofLoading = document.getElementById("proofLoading");
    const proofContainer = document.getElementById("proofContainer");

    const detailPaymentStatus =
        document.getElementById("detailPaymentStatus");

    const detailOrderStatus =
        document.getElementById("detailOrderStatus");

    const detailAdminNote =
        document.getElementById("detailAdminNote");

    const saveOrderButton =
        document.getElementById("saveOrderButton");

    const deleteOrderButton =
        document.getElementById("deleteOrderButton");

    const themeButton =
        document.getElementById("themeButton");

    const exportButton =
        document.getElementById("exportButton");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const sidebar =
        document.querySelector(".sidebar");

    const toast =
        document.getElementById("toast");

    /* =====================================================
       DATA
    ===================================================== */

    let allOrders = [];
    let selectedOrder = null;

    /* =====================================================
       RUPIAH
    ===================================================== */

    function rupiah(value) {
        return "Rp" +
            Number(value || 0).toLocaleString("id-ID");
    }

    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    /* =====================================================
       PAYMENT BADGE
    ===================================================== */

    function paymentBadge(status) {
        let className = "pending";

        if (status === "Diterima") {
            className = "accepted";
        }

        if (status === "Ditolak") {
            className = "rejected";
        }

        return `
            <span class="badge ${className}">
                ${escapeHTML(status || "Menunggu")}
            </span>
        `;
    }

    /* =====================================================
       ORDER BADGE
    ===================================================== */

    function orderBadge(status) {
        let className = "new";

        if (status === "Diproses") {
            className = "processing";
        }

        if (status === "Selesai") {
            className = "done";
        }

        if (status === "Dibatalkan") {
            className = "cancelled";
        }

        return `
            <span class="badge ${className}">
                ${escapeHTML(status || "Baru")}
            </span>
        `;
    }

    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }

    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                if (loginError) {
                    loginError.textContent = "";
                }

                if (loginButton) {
                    loginButton.disabled = true;
                    loginButton.textContent = "Memproses...";
                }

                const emailElement =
                    document.getElementById("loginEmail");

                const passwordElement =
                    document.getElementById("loginPassword");

                const email =
                    emailElement
                        ? emailElement.value.trim()
                        : "";

                const password =
                    passwordElement
                        ? passwordElement.value
                        : "";

                try {

                    const result =
                        await supabaseClient.auth.signInWithPassword({
                            email: email,
                            password: password
                        });

                    if (result.error) {

                        console.error(
                            "LOGIN ERROR:",
                            result.error
                        );

                        if (loginError) {
                            loginError.textContent =
                                result.error.message;
                        }

                        return;
                    }

                    await showDashboard();

                } catch (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );

                    if (loginError) {
                        loginError.textContent =
                            "Terjadi kesalahan saat login.";
                    }

                } finally {

                    if (loginButton) {
                        loginButton.disabled = false;
                        loginButton.textContent = "Masuk";
                    }
                }
            }
        );
    }

    /* =====================================================
       CEK SESSION
    ===================================================== */

    const sessionResult =
        await supabaseClient.auth.getSession();

    if (
        sessionResult.data &&
        sessionResult.data.session
    ) {

        await showDashboard();

    } else {

        showLogin();
    }

    /* =====================================================
       SHOW LOGIN
    ===================================================== */

    function showLogin() {

        if (loginPage) {
            loginPage.classList.remove("hidden");
        }

        if (dashboard) {
            dashboard.classList.add("hidden");
        }
    }

    /* =====================================================
       SHOW DASHBOARD
    ===================================================== */

    async function showDashboard() {

        if (loginPage) {
            loginPage.classList.add("hidden");
        }

        if (dashboard) {
            dashboard.classList.remove("hidden");
        }

        await loadOrders();
    }

    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

                await supabaseClient.auth.signOut();

                showLogin();
            }
        );
    }

    /* =====================================================
       LOAD ORDERS
    ===================================================== */

    async function loadOrders() {

        if (!ordersBody) {
            return;
        }

        ordersBody.innerHTML = `
            <tr>
                <td colspan="9" class="loading">
                    Memuat pesanan...
                </td>
            </tr>
        `;

        try {

            const result =
                await supabaseClient
                    .from("orders")
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );

            if (result.error) {

                console.error(
                    "LOAD ORDERS ERROR:",
                    result.error
                );

                ordersBody.innerHTML = `
                    <tr>
                        <td colspan="9" class="loading">
                            Gagal memuat pesanan.
                        </td>
                    </tr>
                `;

                showToast(
                    "Gagal memuat pesanan."
                );

                return;
            }

            allOrders =
                result.data || [];

            updateStats();
            renderOrders();

        } catch (error) {

            console.error(
                "LOAD ORDERS ERROR:",
                error
            );

            showToast(
                "Terjadi kesalahan saat memuat data."
            );
        }
    }

    /* =====================================================
       STATISTICS
    ===================================================== */

    function updateStats() {

        const total =
            allOrders.length;

        const pending =
            allOrders.filter(
                order =>
                    order.payment_status === "Menunggu"
            ).length;

        const paid =
            allOrders.filter(
                order =>
                    order.payment_status === "Diterima"
            ).length;

        const revenue =
            allOrders
                .filter(
                    order =>
                        order.payment_status === "Diterima"
                )
                .reduce(
                    (sum, order) =>
                        sum + Number(order.price || 0),
                    0
                );

        const totalOrders =
            document.getElementById("totalOrders");

        const pendingOrders =
            document.getElementById("pendingOrders");

        const paidOrders =
            document.getElementById("paidOrders");

        const totalRevenue =
            document.getElementById("totalRevenue");

        if (totalOrders) {
            totalOrders.textContent = total;
        }

        if (pendingOrders) {
            pendingOrders.textContent = pending;
        }

        if (paidOrders) {
            paidOrders.textContent = paid;
        }

        if (totalRevenue) {
            totalRevenue.textContent =
                rupiah(revenue);
        }
    }

    /* =====================================================
       RENDER ORDERS
    ===================================================== */

    function renderOrders() {

        if (!ordersBody) {
            return;
        }

        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";

        const payment =
            paymentFilter
                ? paymentFilter.value
                : "all";

        const orderStatus =
            orderFilter
                ? orderFilter.value
                : "all";

        const filtered =
            allOrders.filter(function (order) {

                const text = (

                    (order.order_code || "") + " " +
                    (order.customer_name || "") + " " +
                    (order.whatsapp || "") + " " +
                    (order.email || "") + " " +
                    (order.template_name || "") + " " +
                    (order.package_name || "")

                ).toLowerCase();

                const matchSearch =
                    !search ||
                    text.includes(search);

                const matchPayment =
                    payment === "all" ||
                    order.payment_status === payment;

                const matchOrder =
                    orderStatus === "all" ||
                    order.order_status === orderStatus;

                return (
                    matchSearch &&
                    matchPayment &&
                    matchOrder
                );
            });

        if (!filtered.length) {

            ordersBody.innerHTML = `
                <tr>
                    <td colspan="9" class="loading">
                        Belum ada pesanan.
                    </td>
                </tr>
            `;

            return;
        }

        ordersBody.innerHTML =
            filtered.map(function (order) {

                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    order.order_code
                                )}
                            </strong>
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    order.customer_name
                                )}
                            </strong>

                            <br>

                            <span class="muted">
                                ${escapeHTML(
                                    order.whatsapp
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHTML(
                                order.package_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                order.template_name
                            )}
                        </td>

                        <td>
                            <strong>
                                ${rupiah(
                                    order.price
                                )}
                            </strong>
                        </td>

                        <td>
                            ${paymentBadge(
                                order.payment_status
                            )}
                        </td>

                        <td>
                            ${orderBadge(
                                order.order_status
                            )}
                        </td>

                        <td>

                            <button
                                class="view-button"
                                data-id="${escapeHTML(
                                    order.id
                                )}"
                            >
                                👁 Lihat
                            </button>

                        </td>

                        <td>
                            ${formatDate(
                                order.created_at
                            )}
                        </td>

                    </tr>
                `;

            }).join("");

        document
            .querySelectorAll(".view-button")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openOrder(
                            this.dataset.id
                        );

                    }
                );

            });
    }

    /* =====================================================
       OPEN ORDER
    ===================================================== */

    async function openOrder(id) {

        selectedOrder =
            allOrders.find(
                order =>
                    String(order.id) ===
                    String(id)
            );

        if (!selectedOrder) {
            return;
        }

        if (detailModal) {
            detailModal.classList.add("show");
        }

        if (orderDetail) {

            orderDetail.innerHTML = `

                <div class="detail-grid">

                    <div class="detail-item">
                        <span>Kode Order</span>
                        <strong>
                            ${escapeHTML(
                                selectedOrder.order_code
                            )}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Tanggal</span>
                        <strong>
                            ${formatDate(
                                selectedOrder.created_at
                            )}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Nama</span>
                        <strong>
                            ${escapeHTML(
                                selectedOrder.customer_name
                            )}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>WhatsApp</span>
                        <strong>
                            ${escapeHTML(
                                selectedOrder.whatsapp
                            )}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Email</span>
                        <strong>
                            ${escapeHTML(
                                selectedOrder.email || "-"
                            )}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Paket</span>
                        <strong>
                            ${escapeHTML(
                                selectedOrder.package_name
                            )}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Template</span>
                        <strong>
                            ${escapeHTML(
                                selectedOrder.template_name
                            )}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Total</span>
                        <strong>
                            ${rupiah(
                                selectedOrder.price
                            )}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Catatan Customer</span>
                        <strong>
                            ${escapeHTML(
                                selectedOrder.note || "-"
                            )}
                        </strong>
                    </div>

                </div>

            `;
        }

        if (detailPaymentStatus) {
            detailPaymentStatus.value =
                selectedOrder.payment_status ||
                "Menunggu";
        }

        if (detailOrderStatus) {
            detailOrderStatus.value =
                selectedOrder.order_status ||
                "Baru";
        }

        if (detailAdminNote) {
            detailAdminNote.value =
                selectedOrder.admin_note ||
                "";
        }

        await loadProof(selectedOrder);
    }

    /* =====================================================
       PAYMENT PROOF PATH
       ===================================================== */

    
function getProofPath(value) {
    if (!value) return null;

    let path = String(value).trim();

    if (!path) return null;

    // Jika URL lengkap, ambil path setelah nama bucket
    if (/^https?:\/\//i.test(path)) {
        try {
            const url = new URL(path);
            const marker = "/payment-proofs/";

            const index = url.pathname.indexOf(marker);

            if (index !== -1) {
                path = url.pathname.substring(
                    index + marker.length
                );
            } else {
                return null;
            }
        } catch (error) {
            console.error("URL bukti tidak valid:", error);
            return null;
        }
    }

    // Decode URL dan bersihkan path
    try {
        path = decodeURIComponent(path);
    } catch (error) {
        console.warn("Path tidak dapat di-decode:", error);
    }

    // Hapus nama bucket jika tersimpan
    if (path.startsWith("payment-proofs/")) {
        path = path.substring("payment-proofs/".length);
    }

    // Hapus slash di awal dan query
    path = path.replace(/^\/+/, "").split("?")[0].trim();

    console.log("STORAGE PATH FINAL:", path);

    return path || null;
}

    /* =====================================================
       LOAD PAYMENT PROOF
    ===================================================== */

    async function loadProof(order) {

        if (!proofContainer) {
            return;
        }

        if (proofLoading) {
            proofLoading.style.display =
                "block";
        }

        proofContainer.innerHTML = "";

        /*
         * Kolom database yang digunakan:
         *
         * payment_proof
         */

        const paymentProof =
            order.payment_proof;

        console.log(
            "================================="
        );

        console.log(
            "ORDER:",
            order
        );

        console.log(
            "PAYMENT PROOF DATABASE:",
            paymentProof
        );

        console.log(
            "================================="
        );

        /*
         * Tidak ada bukti
         */

        if (!paymentProof) {

            if (proofLoading) {
                proofLoading.style.display =
                    "none";
            }

            proofContainer.innerHTML = `
                <div class="proof-empty">
                    <p class="muted">
                        Tidak ada bukti transfer.
                    </p>
                </div>
            `;

            return;
        }

        /*
         * Ambil path
         */

        const path =
            getProofPath(paymentProof);

        if (!path) {

            if (proofLoading) {
                proofLoading.style.display =
                    "none";
            }

            proofContainer.innerHTML = `
                <div class="proof-error">
                    <p class="muted">
                        Path bukti transfer tidak valid.
                    </p>

                    <small
                        style="
                            display:block;
                            margin-top:8px;
                            word-break:break-word;
                        "
                    >
                        ${escapeHTML(
                            paymentProof
                        )}
                    </small>
                </div>
            `;

            return;
        }

        /*
         * ==========================================
         * BUAT SIGNED URL
         * ==========================================
         */

        console.log(
            "Mencoba file:",
            path
        );

        let signedUrl = null;

        try {

            const result =
                await supabaseClient
                    .storage
                    .from("payment-proofs")
                    .createSignedUrl(
                        path,
                        3600
                    );

            console.log(
                "SIGNED URL RESULT:",
                result
            );

            if (
                !result.error &&
                result.data &&
                result.data.signedUrl
            ) {

                signedUrl =
                    result.data.signedUrl;

            } else {

                console.error(
                    "SIGNED URL ERROR:",
                    result.error
                );
            }

        } catch (error) {

            console.error(
                "STORAGE ERROR:",
                error
            );
        }

        if (proofLoading) {
            proofLoading.style.display =
                "none";
        }

        /*
         * ==========================================
         * GAGAL MEMBUAT URL
         * ==========================================
         */

        if (!signedUrl) {

            proofContainer.innerHTML = `

                <div class="proof-error">

                    <p>
                        ❌ Foto bukti transfer tidak dapat dibuka.
                    </p>

                    <small
                        style="
                            display:block;
                            margin-top:8px;
                            opacity:.7;
                            word-break:break-word;
                        "
                    >
                        Path:
                        ${escapeHTML(path)}
                    </small>

                </div>

            `;

            return;
        }

        /*
         * ==========================================
         * FOTO
         * ==========================================
         */

        console.log(
            "SIGNED URL BERHASIL:",
            signedUrl
        );

        proofContainer.innerHTML = `

            <div
                class="proof-preview"
                style="
                    width:100%;
                    text-align:center;
                "
            >

                <img
                    src="${escapeHTML(
                        signedUrl
                    )}"
                    alt="Bukti Transfer"
                    class="proof-image"
                    id="proofImage"
                    style="
                        display:block;
                        width:100%;
                        max-width:500px;
                        max-height:600px;
                        object-fit:contain;
                        margin:0 auto;
                        border-radius:14px;
                        background:#f5f5f5;
                    "
                >

                <div
                    id="proofImageError"
                    style="
                        display:none;
                        padding:20px;
                    "
                >

                    <p>
                        File ditemukan,
                        tetapi foto tidak dapat ditampilkan.
                    </p>

                    <a
                        href="${escapeHTML(
                            signedUrl
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🔗 Buka Foto
                    </a>

                </div>

            </div>

        `;

        /*
         * ==========================================
         * CEK FOTO
         * ==========================================
         */

        const proofImage =
            document.getElementById(
                "proofImage"
            );

        const proofImageError =
            document.getElementById(
                "proofImageError"
            );

        if (proofImage) {

            proofImage.onload =
                function () {

                    console.log(
                        "✅ FOTO BUKTI TRANSFER BERHASIL MUNCUL"
                    );

                };

            proofImage.onerror =
                function () {

                    console.error(
                        "❌ FOTO GAGAL DITAMPILKAN"
                    );

                    proofImage.style.display =
                        "none";

                    if (proofImageError) {

                        proofImageError.style.display =
                            "block";
                    }
                };
        }
    }

    /* =====================================================
       SAVE ORDER
    ===================================================== */

    if (saveOrderButton) {

        saveOrderButton.addEventListener(
            "click",
            async function () {

                if (!selectedOrder) {
                    return;
                }

                saveOrderButton.disabled =
                    true;

                saveOrderButton.textContent =
                    "Menyimpan...";

                try {

                    const result =
                        await supabaseClient
                            .from("orders")
                            .update({

                                payment_status:
                                    detailPaymentStatus
                                        ? detailPaymentStatus.value
                                        : selectedOrder.payment_status,

                                order_status:
                                    detailOrderStatus
                                        ? detailOrderStatus.value
                                        : selectedOrder.order_status,

                                admin_note:
                                    detailAdminNote
                                        ? detailAdminNote.value.trim()
                                        : selectedOrder.admin_note

                            })
                            .eq(
                                "id",
                                selectedOrder.id
                            );

                    if (result.error) {

                        console.error(
                            "SAVE ORDER ERROR:",
                            result.error
                        );

                        showToast(
                            "Gagal menyimpan perubahan."
                        );

                    } else {

                        showToast(
                            "Perubahan berhasil disimpan."
                        );

                        closeDetail();

                        await loadOrders();
                    }

                } catch (error) {

                    console.error(
                        "SAVE ERROR:",
                        error
                    );

                    showToast(
                        "Terjadi kesalahan saat menyimpan."
                    );

                } finally {

                    saveOrderButton.disabled =
                        false;

                    saveOrderButton.textContent =
                        "💾 Simpan Perubahan";
                }
            }
        );
    }

    /* =====================================================
       DELETE ORDER
    ===================================================== */

    if (deleteOrderButton) {

        deleteOrderButton.addEventListener(
            "click",
            async function () {

                if (!selectedOrder) {
                    return;
                }

                const confirmDelete =
                    confirm(
                        "Yakin ingin menghapus pesanan ini?"
                    );

                if (!confirmDelete) {
                    return;
                }

                deleteOrderButton.disabled =
                    true;

                try {

                    const paymentProof =
                        selectedOrder.payment_proof;

                    /*
                     * Hapus order
                     */

                    const result =
                        await supabaseClient
                            .from("orders")
                            .delete()
                            .eq(
                                "id",
                                selectedOrder.id
                            );

                    if (result.error) {

                        console.error(
                            "DELETE ORDER ERROR:",
                            result.error
                        );

                        showToast(
                            "Pesanan gagal dihapus."
                        );

                        return;
                    }

                    /*
                     * Hapus foto dari Storage
                     */

                    if (paymentProof) {

                        const path =
                            getProofPath(
                                paymentProof
                            );

                        if (path) {

                            const removeResult =
                                await supabaseClient
                                    .storage
                                    .from(
                                        "payment-proofs"
                                    )
                                    .remove([
                                        path
                                    ]);

                            if (
                                removeResult.error
                            ) {

                                console.warn(
                                    "Foto tidak berhasil dihapus dari Storage:",
                                    removeResult.error
                                );

                            } else {

                                console.log(
                                    "Foto bukti berhasil dihapus:",
                                    path
                                );
                            }
                        }
                    }

                    showToast(
                        "Pesanan berhasil dihapus."
                    );

                    closeDetail();

                    await loadOrders();

                } catch (error) {

                    console.error(
                        "DELETE ERROR:",
                        error
                    );

                    showToast(
                        "Terjadi kesalahan saat menghapus."
                    );

                } finally {

                    deleteOrderButton.disabled =
                        false;
                }
            }
        );
    }

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeDetail() {

        if (detailModal) {
            detailModal.classList.remove("show");
        }

        selectedOrder = null;

        if (proofContainer) {
            proofContainer.innerHTML = "";
        }

        if (proofLoading) {
            proofLoading.style.display =
                "none";
        }
    }

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeDetail
        );
    }

    if (detailModal) {

        detailModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    detailModal
                ) {

                    closeDetail();
                }
            }
        );
    }

    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderOrders
        );
    }

    /* =====================================================
       FILTER PAYMENT
    ===================================================== */

    if (paymentFilter) {

        paymentFilter.addEventListener(
            "change",
            renderOrders
        );
    }

    /* =====================================================
       FILTER ORDER
    ===================================================== */

    if (orderFilter) {

        orderFilter.addEventListener(
            "change",
            renderOrders
        );
    }

    /* =====================================================
       REFRESH
    ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async function () {

                await loadOrders();

                showToast(
                    "Data berhasil diperbarui."
                );
            }
        );
    }

    /* =====================================================
       NAVIGATION
    ===================================================== */

    document
        .querySelectorAll(".nav-item")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(".nav-item")
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );

                    this.classList.add(
                        "active"
                    );

                    const page =
                        this.dataset.page;

                    if (
                        page === "pending"
                    ) {

                        if (paymentFilter) {
                            paymentFilter.value =
                                "Menunggu";
                        }

                        if (orderFilter) {
                            orderFilter.value =
                                "all";
                        }

                    } else if (
                        page === "paid"
                    ) {

                        if (paymentFilter) {
                            paymentFilter.value =
                                "Diterima";
                        }

                        if (orderFilter) {
                            orderFilter.value =
                                "all";
                        }

                    } else {

                        if (paymentFilter) {
                            paymentFilter.value =
                                "all";
                        }

                        if (orderFilter) {
                            orderFilter.value =
                                "all";
                        }
                    }

                    renderOrders();

                    if (sidebar) {
                        sidebar.classList.remove(
                            "open"
                        );
                    }
                }
            );
        });

    /* =====================================================
       THEME
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "adminTheme"
        );

    if (
        savedTheme === "dark"
    ) {

        document.documentElement.setAttribute(
            "data-theme",
            "dark"
        );
    }

    if (themeButton) {

        themeButton.addEventListener(
            "click",
            function () {

                const isDark =
                    document.documentElement
                        .getAttribute(
                            "data-theme"
                        ) === "dark";

                if (isDark) {

                    document.documentElement
                        .removeAttribute(
                            "data-theme"
                        );

                    localStorage.setItem(
                        "adminTheme",
                        "light"
                    );

                } else {

                    document.documentElement
                        .setAttribute(
                            "data-theme",
                            "dark"
                        );

                    localStorage.setItem(
                        "adminTheme",
                        "dark"
                    );
                }
            }
        );
    }

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            function () {

                if (sidebar) {

                    sidebar.classList.toggle(
                        "open"
                    );
                }
            }
        );
    }

    /* =====================================================
       EXPORT CSV
    ===================================================== */

    if (exportButton) {

        exportButton.addEventListener(
            "click",
            function () {

                if (!allOrders.length) {

                    showToast(
                        "Belum ada data untuk diekspor."
                    );

                    return;
                }

                const header = [
                    "Kode Order",
                    "Nama",
                    "WhatsApp",
                    "Email",
                    "Paket",
                    "Template",
                    "Harga",
                    "Pembayaran",
                    "Status Pesanan",
                    "Catatan",
                    "Tanggal"
                ];

                const rows =
                    allOrders.map(
                        order => [

                            order.order_code,
                            order.customer_name,
                            order.whatsapp,
                            order.email || "",
                            order.package_name,
                            order.template_name,
                            order.price,
                            order.payment_status,
                            order.order_status,
                            order.admin_note || "",
                            order.created_at

                        ]
                    );

                const csv = [
                    header,
                    ...rows
                ]
                    .map(
                        row =>
                            row
                                .map(
                                    value =>
                                        `"${String(
                                            value ?? ""
                                        ).replace(
                                            /"/g,
                                            '""'
                                        )}"`
                                )
                                .join(",")
                    )
                    .join("\n");

                const blob =
                    new Blob(
                        [
                            "\ufeff" + csv
                        ],
                        {
                            type:
                                "text/csv;charset=utf-8;"
                        }
                    );

                const url =
                    URL.createObjectURL(
                        blob
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href = url;

                link.download =
                    "pesanan-desaincv-" +
                    Date.now() +
                    ".csv";

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

                URL.revokeObjectURL(url);
            }
        );
    }

    /* =====================================================
       SUPABASE REALTIME
       ===================================================== */

    try {

        supabaseClient
            .channel("orders-admin")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders"
                },
                async function () {

                    console.log(
                        "Orders berubah → refresh dashboard"
                    );

                    await loadOrders();
                }
            )
            .subscribe();

    } catch (error) {

        console.warn(
            "Realtime tidak aktif:",
            error
        );
    }

});