/* ========================================================= CHECKOUT.JS DesainCV.TOP MODEL PER-STEP ========================================================= */
document.addEventListener("DOMContentLoaded",function(){
/* ===================================================== PENGATURAN ===================================================== */
const prices={regular:25000,premium:50000,ats:20000,platinum:70000};
const packageNames={regular:"Paket Regular",premium:"Paket Premium",ats:"ATS Friendly",platinum:"Paket Platinum"};
/* GANTI NOMOR WHATSAPP ADMIN */
const adminWhatsApp="6285850551566";
/* ===================================================== AMBIL TEMPLATE TERPILIH ===================================================== */
const savedTemplate=localStorage.getItem("selectedTemplate");
if(!savedTemplate){
    alert("Silakan pilih template terlebih dahulu.");
    window.location.href="template.html";
    return;
}
let template;
try{
    template=JSON.parse(savedTemplate);
}catch(error){
    localStorage.removeItem("selectedTemplate");
    window.location.href="template.html";
    return;
}
const category=String(template.category||"").toLowerCase();
const packageName=packageNames[category]||"Paket CV";
const price=prices[category]||0;
/* ===================================================== FORMAT RUPIAH ===================================================== */
function rupiah(value){
    return "Rp"+Number(value).toLocaleString("id-ID");
}
/* ===================================================== HELPER TEXT ===================================================== */
function setText(id,value){
    const element=document.getElementById(id);
    if(element){
        element.textContent=value;
    }
}
/* ===================================================== TAMPILKAN DATA TEMPLATE ===================================================== */
setText("summaryPackage",packageName);
setText("summaryTemplate",template.name);
setText("summaryPrice",rupiah(price));
setText("paymentTotal",rupiah(price));
setText("paymentPackage",packageName);
setText("paymentTemplate",template.name);
setText("paymentAmount",rupiah(price));
setText("proofPackage",packageName);
setText("proofTotal",rupiah(price));
setText("successPackage",packageName);
setText("successTemplate",template.name);
setText("successTotal",rupiah(price));
/* ===================================================== STEP ELEMENT ===================================================== */
const steps={
    1:document.getElementById("stepCustomer"),
    2:document.getElementById("stepPayment"),
    3:document.getElementById("stepProof"),
    4:document.getElementById("stepSuccess")
};
const progresses={
    1:document.getElementById("progress1"),
    2:document.getElementById("progress2"),
    3:document.getElementById("progress3"),
    4:document.getElementById("progress4")
};
const progressLines=document.querySelectorAll(".progress-line");
/* ===================================================== DATA CUSTOMER ===================================================== */
let customer={name:"",phone:"",email:"",note:""};
/* ===================================================== LOAD CUSTOMER ===================================================== */
const savedCustomer=localStorage.getItem("checkoutCustomer");
if(savedCustomer){
    try{
        customer=JSON.parse(savedCustomer);
        document.getElementById("customerName").value=customer.name||"";
        document.getElementById("customerPhone").value=customer.phone||"";
        document.getElementById("customerEmail").value=customer.email||"";
        document.getElementById("customerNote").value=customer.note||"";
        setText("paymentCustomer",customer.name);
        setText("proofCustomer",customer.name);
        setText("successCustomer",customer.name);
    }catch(error){
        console.log("Data customer tidak valid.");
    }
}
/* ===================================================== FUNGSI GANTI STEP ===================================================== */
function showStep(number){
    /* SEMBUNYIKAN SEMUA */
    Object.values(steps).forEach(function(step){
        step.classList.remove("active");
    });
    /* RESET PROGRESS */
    Object.values(progresses).forEach(function(item){
        item.classList.remove("active");
        item.classList.remove("done");
    });
    /* AKTIFKAN STEP */
    if(steps[number]){
        steps[number].classList.add("active");
    }
    /* PROGRESS */
    for(let i=1;i<=4;i++){
        if(i<number){
            progresses[i].classList.add("done");
        }
        if(i===number){
            progresses[i].classList.add("active");
        }
    }
    /* GARIS */
    progressLines.forEach(function(line,index){
        line.classList.toggle("active",index<number-1);
    });
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}
/* ===================================================== STEP 1 DATA CUSTOMER ===================================================== */
const customerForm=document.getElementById("customerForm");
customerForm.addEventListener("submit",function(event){
    event.preventDefault();
    customer={
        name:document.getElementById("customerName").value.trim(),
        phone:document.getElementById("customerPhone").value.trim(),
        email:document.getElementById("customerEmail").value.trim(),
        note:document.getElementById("customerNote").value.trim()
    };
    localStorage.setItem("checkoutCustomer",JSON.stringify(customer));
    setText("paymentCustomer",customer.name);
    setText("proofCustomer",customer.name);
    setText("successCustomer",customer.name);
    showStep(2);
});
/* ===================================================== STEP 2 BACK ===================================================== */
document.getElementById("backCustomerBtn").addEventListener("click",function(){
    showStep(1);
});
/* ===================================================== STEP 2 SUDAH TRANSFER ===================================================== */
document.getElementById("paymentDoneBtn").addEventListener("click",function(){
    showStep(3);
});
/* ===================================================== COPY REKENING ===================================================== */
document.getElementById("copyBankBtn").addEventListener("click",async function(){
    const number=document.getElementById("bankNumber").textContent.trim();
    try{
        await navigator.clipboard.writeText(number);
        this.textContent="Tersalin ✓";
        setTimeout(()=>{
            this.textContent="Salin";
        },1500);
    }catch(error){
        alert("Nomor rekening: "+number);
    }
});
/* ===================================================== STEP 3 BACK ===================================================== */
document.getElementById("backPaymentBtn").addEventListener("click",function(){
    showStep(2);
});
/* ===================================================== UPLOAD BUKTI ===================================================== */
const paymentProof=document.getElementById("paymentProof");
const fileName=document.getElementById("fileName");
const proofPreview=document.getElementById("proofPreview");
let selectedFile=null;
paymentProof.addEventListener("change",function(){
    const file=this.files[0];
    if(!file){
        return;
    }
    /* MAX 5 MB */
    if(file.size>5*1024*1024){
        alert("Ukuran file maksimal 5 MB.");
        this.value="";
        return;
    }
    /* FORMAT */
    const allowedTypes=["image/jpeg","image/png","image/webp"];
    if(!allowedTypes.includes(file.type)){
        alert("Format harus JPG, PNG, atau WEBP.");
        this.value="";
        return;
    }
    selectedFile=file;
    fileName.textContent=file.name;
    proofPreview.innerHTML="";
    const reader=new FileReader();
    reader.onload=function(event){
        const image=document.createElement("img");
        image.src=event.target.result;
        image.alt="Preview bukti pembayaran";
        proofPreview.appendChild(image);
    };
    reader.readAsDataURL(file);
});
/* ===================================================== KIRIM KE WHATSAPP ===================================================== */
document.getElementById("sendProofBtn").addEventListener("click",function(){
    if(!selectedFile){
        alert("Silakan pilih bukti pembayaran terlebih dahulu.");
        return;
    }
    const message=`Halo Admin DesainCV.TOP 👋
Saya sudah melakukan pembayaran.
━━━━━━━━━━━━━━━━
DETAIL PESANAN
━━━━━━━━━━━━━━━━
Nama     : ${customer.name}
WhatsApp : ${customer.phone}
Email    : ${customer.email}
Paket    : ${packageName}
Template : ${template.name}
Total    : ${rupiah(price)}
Catatan  : ${customer.note||"-"}
Saya sudah menyiapkan bukti pembayaran.
Terima kasih.`;
    const whatsappURL="https://wa.me/"+adminWhatsApp+"?text="+encodeURIComponent(message);
    document.getElementById("whatsappButton").href=whatsappURL;
    /* STEP 4 */
    showStep(4);
    /* BUKA WA */
    setTimeout(function(){
        window.open(whatsappURL,"_blank");
    },300);
});
/* ===================================================== SIMPAN IMAGE TEMPLATE ===================================================== */
localStorage.setItem("checkoutTemplateImage",template.image||"");
/* ===================================================== MULAI DARI STEP 1 ===================================================== */
showStep(1);
});
(function(){
    const savedTheme=localStorage.getItem("theme");
    if(savedTheme==="dark"){
        document.documentElement.setAttribute("data-theme","dark");
    }else{
        document.documentElement.removeAttribute("data-theme");
    }
})();