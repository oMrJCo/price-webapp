document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("categoriesGrid");
    if (!grid) return;

    // ดึงข้อมูลพร้อมกัน Cache เพื่อความสดใหม่
    const url = `categories.json?v=${Date.now()}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        const data = await res.json();

        // --- ส่วนที่ 1: กู้คืน Cover ของพี่ ---
        const coverImg = document.getElementById("coverImage");
        const coverHead = document.getElementById("coverHeadline");
        const coverSub = document.getElementById("coverSubtext");

        if (coverImg && data.coverImage) coverImg.src = data.coverImage;
        if (coverHead && data.coverHeadline) coverHead.textContent = data.coverHeadline;
        if (coverSub && data.coverSubtext) coverSub.textContent = data.coverSubtext;

        // อัปเดตหัวข้อเว็บ
        if (data.siteTitle) document.getElementById("siteTitle").textContent = data.siteTitle;
        if (data.siteSubtitle) document.getElementById("siteSubtitle").textContent = data.siteSubtitle;

        // --- ส่วนที่ 2: สร้างการ์ดสินค้า (สัมพันธ์กับหน้าราคา) ---
        const items = data.categories || [];
        grid.innerHTML = items.map(item => {
            const title = item.titleEN || item.titleTH || "Category";
            const sub = item.titleTH || "";
            const pdf = item.pdf || ""; // ส่งค่า 'pdf' ไปตามที่หน้าสองรอรับ
            const img = item.image || "";

            const href = `price.html?title=${encodeURIComponent(title)}&pdf=${encodeURIComponent(pdf)}`;
            
            return `
                <a class="card" href="${href}">
                    <div class="thumb">
                        ${img ? `<img src="${img}" alt="${title}" onerror="this.style.display='none';">` : ''}
                        <div class="placeholder">LEEPLUS</div>
                    </div>
                    <div class="content">
                        <p class="title">${title}</p>
                        <p class="sub">${sub}</p>
                    </div>
                </a>
            `;
        }).join("");

    } catch (err) {
        console.error(err);
        grid.innerHTML = "<p>เกิดข้อผิดพลาดในการเชื่อมต่อข้อมูล</p>";
    }
});