/* =========================================================
   CHECKOUT.JS
   DesainCV.TOP
   CHECKOUT + SUPABASE STORAGE + DATABASE + WHATSAPP
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PENGATURAN
       ===================================================== */

    const prices = {
        regular: 25000,
        premium: 50000,
        ats: 20000,
        platinum: 70000
    };

    const packageNames = {
        regular: "Paket Regular",
        premium: "Paket Premium",
        ats: "ATS Friendly",
        platinum: "Paket Platinum"
    };

    const adminWhatsApp = "6285850551566";


    /* =====================================================
       CEK SUPABASE
       ===================================================== */

    if (
        typeof window.supabaseClient === "undefined" ||
        !window.supabaseClient
    ) {
        console.error("❌ Supabase belum terhubung.");

        alert(
            "Supabase belum terhubung.\n\n" +
            "Pastikan checkout.html memuat:\n" +
            "1. Supabase JS\n" +
            "2. js/supabase-config.js\n" +
            "3. js/checkout.js"
        );

        return;
    }

    const supabaseClient = window.supabaseClient;

    console.log("✅ Checkout terhubung ke Supabase");


    /* =====================================================
       AMBIL TEMPLATE
       ===================================================== */

    const savedTemplate =
        localStorage.getItem("selectedTemplate");

    if (!savedTemplate) {

        alert(
            "Silakan pilih template terlebih dahulu."
        );

        window.location.href =
            "template.html";

        return;
    }

    let template;

    try {

        template =
            JSON.parse(savedTemplate);

    } catch (error) {

        console.error(
            "❌ Data template tidak valid:",
            error
        );

        localStorage.removeItem(
            "selectedTemplate"
        );

        window.location.href =
            "template.html";

        return;
    }


    /* =====================================================
       DATA PAKET
       ===================================================== */

    const category =
        String(
            template.category || ""
        ).toLowerCase();

    const packageName =
        packageNames[category] ||
        "Paket CV";

    const price =
        prices[category] || 0;


    /* =====================================================
       FORMAT RUPIAH
       ===================================================== */

    function rupiah(value) {

        return (
            "Rp" +
            Number(value)
                .toLocaleString("id-ID")
        );

    }


    /* =====================================================
       HELPER TEXT
       ===================================================== */

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                value;

        }

    }


    /* =====================================================
       TAMPILKAN DATA TEMPLATE
       ===================================================== */

    setText(
        "summaryPackage",
        packageName
    );

    setText(
        "summaryTemplate",
        template.name || "-"
    );

    setText(
        "summaryPrice",
        rupiah(price)
    );

    setText(
        "paymentTotal",
        rupiah(price)
    );

    setText(
        "paymentPackage",
        packageName
    );

    setText(
        "paymentTemplate",
        template.name || "-"
    );

    setText(
        "paymentAmount",
        rupiah(price)
    );

    setText(
        "proofPackage",
        packageName
    );

    setText(
        "proofTotal",
        rupiah(price)
    );

    setText(
        "successPackage",
        packageName
    );

    setText(
        "successTemplate",
        template.name || "-"
    );

    setText(
        "successTotal",
        rupiah(price)
    );


    /* =====================================================
       STEP
       ===================================================== */

    const steps = {

        1:
            document.getElementById(
                "stepCustomer"
            ),

        2:
            document.getElementById(
                "stepPayment"
            ),

        3:
            document.getElementById(
                "stepProof"
            ),

        4:
            document.getElementById(
                "stepSuccess"
            )

    };


    const progresses = {

        1:
            document.getElementById(
                "progress1"
            ),

        2:
            document.getElementById(
                "progress2"
            ),

        3:
            document.getElementById(
                "progress3"
            ),

        4:
            document.getElementById(
                "progress4"
            )

    };


    const progressLines =
        document.querySelectorAll(
            ".progress-line"
        );


    /* =====================================================
       DATA CUSTOMER
       ===================================================== */

    let customer = {

        name: "",
        phone: "",
        email: "",
        note: ""

    };


    /* =====================================================
       LOAD CUSTOMER
       ===================================================== */

    const savedCustomer =
        localStorage.getItem(
            "checkoutCustomer"
        );

    if (savedCustomer) {

        try {

            customer =
                JSON.parse(
                    savedCustomer
                );

            const nameInput =
                document.getElementById(
                    "customerName"
                );

            const phoneInput =
                document.getElementById(
                    "customerPhone"
                );

            const emailInput =
                document.getElementById(
                    "customerEmail"
                );

            const noteInput =
                document.getElementById(
                    "customerNote"
                );


            if (nameInput) {

                nameInput.value =
                    customer.name || "";

            }


            if (phoneInput) {

                phoneInput.value =
                    customer.phone || "";

            }


            if (emailInput) {

                emailInput.value =
                    customer.email || "";

            }


            if (noteInput) {

                noteInput.value =
                    customer.note || "";

            }


            setText(
                "paymentCustomer",
                customer.name || ""
            );

            setText(
                "proofCustomer",
                customer.name || ""
            );

            setText(
                "successCustomer",
                customer.name || ""
            );

        } catch (error) {

            console.warn(
                "Data customer tidak valid."
            );

        }

    }


    /* =====================================================
       GANTI STEP
       ===================================================== */

    function showStep(number) {

        Object.values(steps)
            .forEach(function (step) {

                if (step) {

                    step.classList.remove(
                        "active"
                    );

                }

            });


        Object.values(progresses)
            .forEach(function (item) {

                if (item) {

                    item.classList.remove(
                        "active"
                    );

                    item.classList.remove(
                        "done"
                    );

                }

            });


        if (steps[number]) {

            steps[number]
                .classList.add(
                    "active"
                );

        }


        for (
            let i = 1;
            i <= 4;
            i++
        ) {

            if (
                i < number &&
                progresses[i]
            ) {

                progresses[i]
                    .classList.add(
                        "done"
                    );

            }


            if (
                i === number &&
                progresses[i]
            ) {

                progresses[i]
                    .classList.add(
                        "active"
                    );

            }

        }


        progressLines
            .forEach(
                function (line, index) {

                    line.classList.toggle(
                        "active",
                        index < number - 1
                    );

                }
            );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* =====================================================
       STEP 1
       CUSTOMER FORM
       ===================================================== */

    const customerForm =
        document.getElementById(
            "customerForm"
        );

    if (customerForm) {

        customerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nameElement =
                    document.getElementById(
                        "customerName"
                    );

                const phoneElement =
                    document.getElementById(
                        "customerPhone"
                    );

                const emailElement =
                    document.getElementById(
                        "customerEmail"
                    );

                const noteElement =
                    document.getElementById(
                        "customerNote"
                    );


                customer = {

                    name:
                        nameElement
                            ? nameElement.value.trim()
                            : "",

                    phone:
                        phoneElement
                            ? phoneElement.value.trim()
                            : "",

                    email:
                        emailElement
                            ? emailElement.value.trim()
                            : "",

                    note:
                        noteElement
                            ? noteElement.value.trim()
                            : ""

                };


                if (
                    !customer.name ||
                    !customer.phone
                ) {

                    alert(
                        "Nama dan WhatsApp wajib diisi."
                    );

                    return;

                }


                localStorage.setItem(

                    "checkoutCustomer",

                    JSON.stringify(
                        customer
                    )

                );


                setText(
                    "paymentCustomer",
                    customer.name
                );

                setText(
                    "proofCustomer",
                    customer.name
                );

                setText(
                    "successCustomer",
                    customer.name
                );


                showStep(2);

            }
        );

    }


    /* =====================================================
       STEP 2 BACK
       ===================================================== */

    const backCustomerBtn =
        document.getElementById(
            "backCustomerBtn"
        );

    if (backCustomerBtn) {

        backCustomerBtn.addEventListener(
            "click",
            function () {

                showStep(1);

            }
        );

    }


    /* =====================================================
       STEP 2 SUDAH TRANSFER
       ===================================================== */

    const paymentDoneBtn =
        document.getElementById(
            "paymentDoneBtn"
        );

    if (paymentDoneBtn) {

        paymentDoneBtn.addEventListener(
            "click",
            function () {

                showStep(3);

            }
        );

    }


    /* =====================================================
       COPY REKENING
       ===================================================== */

    const copyBankBtn =
        document.getElementById(
            "copyBankBtn"
        );

    if (copyBankBtn) {

        copyBankBtn.addEventListener(
            "click",
            async function () {

                const bankElement =
                    document.getElementById(
                        "bankNumber"
                    );

                if (!bankElement) {

                    return;

                }


                const number =
                    bankElement
                        .textContent
                        .trim();


                try {

                    await navigator
                        .clipboard
                        .writeText(
                            number
                        );


                    this.textContent =
                        "Tersalin ✓";


                    setTimeout(
                        () => {

                            this.textContent =
                                "Salin";

                        },
                        1500
                    );


                } catch (error) {

                    alert(
                        "Nomor rekening: " +
                        number
                    );

                }

            }
        );

    }


    /* =====================================================
       STEP 3 BACK
       ===================================================== */

    const backPaymentBtn =
        document.getElementById(
            "backPaymentBtn"
        );

    if (backPaymentBtn) {

        backPaymentBtn.addEventListener(
            "click",
            function () {

                showStep(2);

            }
        );

    }


    /* =====================================================
       UPLOAD BUKTI
       ===================================================== */

    const paymentProof =
        document.getElementById(
            "paymentProof"
        );

    const fileName =
        document.getElementById(
            "fileName"
        );

    const proofPreview =
        document.getElementById(
            "proofPreview"
        );


    let selectedFile = null;


    if (paymentProof) {

        paymentProof.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];


                if (!file) {

                    selectedFile = null;

                    if (fileName) {

                        fileName.textContent =
                            "Belum ada file";

                    }

                    return;

                }


                /* MAX 5 MB */

                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "Ukuran file maksimal 5 MB."
                    );

                    this.value = "";

                    selectedFile = null;

                    return;

                }


                /* FORMAT */

                const allowedTypes = [

                    "image/jpeg",
                    "image/png",
                    "image/webp"

                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    alert(
                        "Format harus JPG, PNG, atau WEBP."
                    );

                    this.value = "";

                    selectedFile = null;

                    return;

                }


                selectedFile = file;


                if (fileName) {

                    fileName.textContent =
                        file.name;

                }


                if (proofPreview) {

                    proofPreview.innerHTML =
                        "";


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const image =
                                document
                                    .createElement(
                                        "img"
                                    );


                            image.src =
                                event.target.result;


                            image.alt =
                                "Preview bukti pembayaran";


                            proofPreview
                                .appendChild(
                                    image
                                );

                        };


                    reader.readAsDataURL(
                        file
                    );

                }

            }
        );

    }


    /* =====================================================
       GENERATE ORDER CODE
       ===================================================== */

    function generateOrderCode() {

        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                now.getDate()
            ).padStart(
                2,
                "0"
            );


        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        return (
            "DCV-" +
            year +
            month +
            day +
            "-" +
            random
        );

    }


    /* =====================================================
       SANITIZE FILE NAME
       ===================================================== */

    function sanitizeFileName(name) {

        return name
            .toLowerCase()
            .replace(
                /[^a-z0-9._-]/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );

    }


    /* =====================================================
       UPLOAD BUKTI TRANSFER
       ===================================================== */

    async function uploadPaymentProof(
        orderCode,
        file
    ) {

        const safeFileName =
            sanitizeFileName(
                file.name
            );


        const filePath =
            orderCode +
            "/" +
            Date.now() +
            "-" +
            safeFileName;


        console.log(
            "📤 Upload bukti transfer:",
            filePath
        );


        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(
                    "payment-proofs"
                )
                .upload(
                    filePath,
                    file,
                    {
                        cacheControl:
                            "3600",

                        contentType:
                            file.type,

                        upsert:
                            false
                    }
                );


        if (error) {

            console.error(
                "❌ Upload bukti gagal:",
                error
            );


            throw new Error(
                "Upload bukti transfer gagal: " +
                error.message
            );

        }


        console.log(
            "✅ Bukti transfer berhasil:",
            data.path
        );


        return data.path;

    }


    /* =====================================================
       SIMPAN ORDER KE DATABASE
       
       PENTING:
       JANGAN PAKAI .select().single()
       
       Karena kita hanya memberikan izin INSERT
       kepada user frontend.
       ===================================================== */

    async function saveOrder(
        orderCode,
        proofPath
    ) {

        console.log(
            "💾 Menyimpan order:",
            orderCode
        );


        const orderData = {

            order_code:
                orderCode,

            customer_name:
                customer.name,

            whatsapp:
                customer.phone,

            email:
                customer.email || null,

            package_name:
                packageName,

            template_name:
                template.name || null,

            template_id:
                template.id
                    ? String(
                        template.id
                    )
                    : null,

            template_image:
                template.image || null,

            price:
                Number(price),

            note:
                customer.note || null,

            payment_proof:
                proofPath,

            payment_status:
                "Menunggu",

            order_status:
                "Baru"

        };


        /*
         * JANGAN:
         *
         * .insert(orderData)
         * .select()
         * .single()
         *
         * Karena .select() membutuhkan policy SELECT.
         */

        const {
            error
        } =
            await supabaseClient
                .from("orders")
                .insert(
                    orderData
                );


        if (error) {

            console.error(
                "❌ Gagal menyimpan order:",
                error
            );


            throw new Error(
                "Data order gagal disimpan: " +
                error.message
            );

        }


        console.log(
            "✅ Order berhasil disimpan ke database:",
            orderCode
        );


        /*
         * Tidak perlu mengambil ulang row.
         *
         * INSERT sudah berhasil.
         */

        return true;

    }


    /* =====================================================
       HAPUS FILE JIKA DATABASE GAGAL
       ===================================================== */

    async function deleteUploadedProof(
        proofPath
    ) {

        if (!proofPath) {

            return;

        }


        try {

            const {
                error
            } =
                await supabaseClient
                    .storage
                    .from(
                        "payment-proofs"
                    )
                    .remove([
                        proofPath
                    ]);


            if (error) {

                console.warn(
                    "⚠️ File gagal dihapus:",
                    error
                );

                return;

            }


            console.log(
                "🗑️ File bukti berhasil dihapus."
            );


        } catch (error) {

            console.warn(
                "⚠️ File gagal dihapus:",
                error
            );

        }

    }


    /* =====================================================
       BUAT PESAN WHATSAPP
       ===================================================== */

    function createWhatsAppURL(
        orderCode
    ) {

        const message =
`Halo Admin DesainCV.TOP 👋

Saya sudah melakukan pembayaran.

━━━━━━━━━━━━━━━━
DETAIL PESANAN
━━━━━━━━━━━━━━━━

Kode Order : ${orderCode}
Nama       : ${customer.name}
WhatsApp   : ${customer.phone}
Email      : ${customer.email || "-"}
Paket      : ${packageName}
Template   : ${template.name || "-"}
Total      : ${rupiah(price)}
Catatan    : ${customer.note || "-"}

Saya sudah mengupload bukti pembayaran melalui website.

Mohon dicek ya.
Terima kasih 🙏`;


        return (
            "https://wa.me/" +
            adminWhatsApp +
            "?text=" +
            encodeURIComponent(
                message
            )
        );

    }


    /* =====================================================
       KIRIM BUKTI PEMBAYARAN
       ===================================================== */

    const sendProofBtn =
        document.getElementById(
            "sendProofBtn"
        );


    if (sendProofBtn) {

        sendProofBtn.addEventListener(
            "click",
            async function () {

                /* =========================================
                   CEK FILE
                   ========================================= */

                if (!selectedFile) {

                    alert(
                        "Silakan pilih bukti pembayaran terlebih dahulu."
                    );

                    return;

                }


                /* =========================================
                   CEK CUSTOMER
                   ========================================= */

                if (
                    !customer.name ||
                    !customer.phone
                ) {

                    alert(
                        "Data pemesan belum lengkap."
                    );

                    showStep(1);

                    return;

                }


                /* =========================================
                   CEGAH DOUBLE CLICK
                   ========================================= */

                if (
                    sendProofBtn.dataset
                        .sending === "true"
                ) {

                    return;

                }


                sendProofBtn.dataset.sending =
                    "true";


                const originalButtonText =
                    sendProofBtn.textContent;


                sendProofBtn.disabled =
                    true;


                sendProofBtn.textContent =
                    "Mengirim...";


                let proofPath = null;


                try {

                    /* =====================================
                       1. BUAT ORDER CODE
                       ===================================== */

                    const orderCode =
                        generateOrderCode();


                    console.log(
                        "🧾 Order code:",
                        orderCode
                    );


                    /* =====================================
                       2. UPLOAD BUKTI
                       ===================================== */

                    proofPath =
                        await uploadPaymentProof(
                            orderCode,
                            selectedFile
                        );


                    /* =====================================
                       3. SIMPAN DATABASE
                       ===================================== */

                    await saveOrder(
                        orderCode,
                        proofPath
                    );


                    console.log(
                        "🎉 ORDER BERHASIL DISIMPAN"
                    );


                    /* =====================================
                       4. BUAT WHATSAPP
                       ===================================== */

                    const whatsappURL =
                        createWhatsAppURL(
                            orderCode
                        );


                    /* =====================================
                       5. PASANG LINK TOMBOL WHATSAPP
                       ===================================== */

                    const whatsappButton =
                        document.getElementById(
                            "whatsappButton"
                        );


                    if (whatsappButton) {

                        whatsappButton.href =
                            whatsappURL;

                        whatsappButton.target =
                            "_blank";

                        whatsappButton.rel =
                            "noopener";

                    }


                    /* =====================================
                       6. TAMPILKAN KODE ORDER
                       ===================================== */

                    setText(
                        "successOrderCode",
                        orderCode
                    );


                    /* =====================================
                       7. TAMPILKAN STEP SUCCESS
                       ===================================== */

                    showStep(4);


                    console.log(
                        "✅ Checkout berhasil."
                    );


                    /* =====================================
                       8. LANGSUNG KE WHATSAPP
                       
                       Pakai location.href supaya
                       tidak diblokir popup browser.
                       ===================================== */

                    setTimeout(
                        function () {

                            window.location.href =
                                whatsappURL;

                        },
                        500
                    );


                } catch (error) {

                    console.error(
                        "❌ CHECKOUT GAGAL:",
                        error
                    );


                    /*
                     * Kalau upload berhasil tetapi
                     * database gagal, hapus file.
                     */

                    if (proofPath) {

                        await deleteUploadedProof(
                            proofPath
                        );

                    }


                    alert(
                        "Pesanan belum berhasil dikirim.\n\n" +
                        error.message +
                        "\n\n" +
                        "Silakan coba lagi."
                    );


                } finally {

                    sendProofBtn.dataset.sending =
                        "false";


                    sendProofBtn.disabled =
                        false;


                    sendProofBtn.textContent =
                        originalButtonText;

                }

            }
        );

    }


    /* =====================================================
       SIMPAN IMAGE TEMPLATE
       ===================================================== */

    localStorage.setItem(
        "checkoutTemplateImage",
        template.image || ""
    );


    /* =====================================================
       MULAI STEP 1
       ===================================================== */

    showStep(1);

});


/* =========================================================
   DARK MODE
   ========================================================= */

(function () {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.documentElement
            .setAttribute(
                "data-theme",
                "dark"
            );

    } else {

        document.documentElement
            .removeAttribute(
                "data-theme"
            );

    }

})();