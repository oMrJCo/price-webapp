document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("categoriesGrid");
    const url = `categories.json?v=${Date.now()}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        // ดึงข้อมูล Cover และหัวข้อเว็บ
        if(data.siteTitle) document.getElementById("siteTitle").textContent = data.siteTitle;
        if(data.siteSubtitle) document.getElementById("siteSubtitle").textContent = data.siteSubtitle;
        if(data.coverImage) document.getElementById("coverImage").src = data.coverImage;
        if(data.coverHeadline) document.getElementById("coverHeadline").textContent = data.coverHeadline;
        if(data.coverSubtext) document.getElementById("coverSubtext").textContent = data.coverSubtext;

        // สร้างการ์ดสินค้า
        const items = data.categories || [];
        grid.innerHTML = items.map(item => {
            const pdf = item.pdf || "";
            const title = item.titleEN || item.titleTH || "Category";
            const href = `price.html?title=${encodeURIComponent(title)}&pdf=${encodeURIComponent(pdf)}`;
            
            return `
                <a class="card" href="${href}">
                    <div class="thumb">
                        ${item.image ? `<img src="${item.image}" onerror="this.style.display='none'">` : ''}
                        <div class="placeholder">LEEPLUS</div>
                    </div>
                    <div class="content">
                        <p class="title">${title}</p>
                        <p class="sub">${item.titleTH || ""}</p>
                    </div>
                </a>
            `;
        }).join("");

        // ระบบปุ่ม LINE หน้าแรก
        const fab = document.getElementById("lineFab");
        const qr = document.getElementById("qrBox");
        if (fab && qr) {
            fab.addEventListener("click", (e) => {
                e.stopPropagation();
                qr.style.display = (qr.style.display === "block") ? "none" : "block";
            });
            document.addEventListener("click", () => { qr.style.display = "none"; });
        }

    } catch (err) { console.error("Error:", err); }
});