document.addEventListener("DOMContentLoaded",function(){
    const grid=document.getElementById("templateGrid");
    const tabs=document.querySelectorAll(".template-tab");
    const title=document.getElementById("categoryTitle");
    const count=document.getElementById("templateCount");
    const empty=document.getElementById("emptyTemplate");

    /* ===================================================== KATEGORI ===================================================== */

    const categories=[
        {key:"regular",name:"Regular",label:"Paket Regular",folder:"regular",prefix:"regular-",total:5},
        {key:"premium",name:"Premium",label:"Paket Premium",folder:"premium",prefix:"premium-",total:9},
        {key:"ats",name:"ATS",label:"ATS Friendly",folder:"ats",prefix:"ATS_",total:5},
        {key:"platinum",name:"Platinum",label:"Paket Platinum",folder:"platinum",prefix:"platinum-",total:40}
    ];

    /* ===================================================== BUAT SEMUA TEMPLATE ===================================================== */

    const templates=[];

    categories.forEach(function(category){
        for(let number=1;number<=category.total;number++){
            templates.push({
                name:`Template CV ${category.name} ${number}`,
                category:category.key,
                categoryName:category.label,
                folder:category.folder,
                prefix:category.prefix,
                number:number
            });
        }
    });

    /* ===================================================== CARI JPG / JPEG / PNG OTOMATIS ===================================================== */

    function findImage(template){
        return new Promise(function(resolve){
            const extensions=["jpg","jpeg","png"];
            let index=0;

            function check(){
                if(index>=extensions.length){
                    resolve(null);
                    return;
                }

                const path=`img/${template.folder}/${template.prefix}${template.number}.${extensions[index]}`;
                const image=new Image();

                image.onload=function(){
                    resolve(path);
                };

                image.onerror=function(){
                    index++;
                    check();
                };

                image.src=path;
            }

            check();
        });
    }

    /* ===================================================== RENDER ===================================================== */

    async function render(filter="all"){
        grid.innerHTML="";
        empty.style.display="none";

        const list=filter==="all"?templates:templates.filter(function(template){
            return template.category===filter;
        });

        let shown=0;

        for(const template of list){
            const imagePath=await findImage(template);

            if(!imagePath){
                continue;
            }

            shown++;

            const card=document.createElement("article");
            card.className="template-card";

            card.innerHTML=`
                <div class="template-image">
                    <span class="template-badge">${template.categoryName}</span>
                    <img src="${imagePath}" alt="${template.name}" loading="lazy">
                </div>
                <div class="template-info">
                    <h3>${template.name}</h3>
                    <p class="template-category">${template.categoryName}</p>
                    <button type="button" class="choose-template">Pilih Template</button>
                </div>
            `;

            /* ================================================= KLIK PILIH TEMPLATE ================================================= */

            const button=card.querySelector(".choose-template");

            button.addEventListener("click",function(){
                const selectedTemplate={
                    name:template.name,
                    category:template.category,
                    categoryName:template.categoryName,
                    image:imagePath
                };

                /* Simpan template yang dipilih */

                localStorage.setItem("selectedTemplate",JSON.stringify(selectedTemplate));

                /* Simpan informasi terpisah */

                localStorage.setItem("selectedTemplateName",selectedTemplate.name);
                localStorage.setItem("selectedTemplateCategory",selectedTemplate.category);
                localStorage.setItem("selectedTemplateImage",selectedTemplate.image);

                /* ================================================= LANGSUNG KE CHECKOUT ================================================= */

                window.location.href="checkout.html";
            });

            grid.appendChild(card);
        }

        title.textContent=filter==="all"?"Semua Template":categories.find(category=>category.key===filter).label;
        count.textContent=`${shown} Template`;

        if(shown===0){
            empty.style.display="block";
        }
    }

    /* ===================================================== TAB ===================================================== */

    tabs.forEach(function(tab){
        tab.addEventListener("click",function(){
            tabs.forEach(function(item){
                item.classList.remove("active");
            });

            this.classList.add("active");
            render(this.dataset.filter);
        });
    });

    /* ===================================================== LOAD SEMUA TEMPLATE ===================================================== */

    render("all");
});

/* Ambil mode tema yang dipilih di website */

const savedTheme=localStorage.getItem("theme");

if(savedTheme==="dark"){
    document.documentElement.classList.add("dark");
}