// app.js - ฉบับสมบูรณ์สำหรับเริ่มใหม่
document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("categoriesGrid");
    if (!grid) return;

    // ดึงข้อมูลพร้อมกัน cache เพื่อให้เวลาพี่แก้ราคามันเปลี่ยนทันที
    const url = `categories.json?v=${Date.now()}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("โหลดไฟล์ categories.json ไม่สำเร็จ");
        const data = await res.json();

        // อัปเดตหัวข้อเว็บ
        if (data.siteTitle) document.getElementById("siteTitle").textContent = data.siteTitle;
        if (data.siteSubtitle) document.getElementById("siteSubtitle").textContent = data.siteSubtitle;

        const items = data.categories || [];

        if (items.length === 0) {
            grid.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>ไม่พบข้อมูลสินค้า</p>";
            return;
        }

        // สร้าง HTML สำหรับแต่ละหมวดหมู่
        grid.innerHTML = items.map(item => {
            const titleEN = (item.titleEN || "").trim();
            const titleTH = (item.titleTH || "").trim();
            const pdf = item.pdf || "";
            const img = item.image || "";

            // ส่งค่าไปหน้าแสดงผล PDF
            const href = `price.html?title=${encodeURIComponent(titleEN || titleTH)}&pdf=${encodeURIComponent(pdf)}`;
            
            return `
                <a class="card" href="${href}">
                    <div class="thumb">
                        ${img ? `<img src="${img}" alt="${titleTH}" onerror="this.style.display='none';">` : ''}
                        <div class="placeholder">LEEPLUS</div>
                    </div>
                    <div class="content">
                        <p class="title">${titleEN || titleTH}</p>
                        <p class="sub">${titleTH ? titleTH : ""}</p>
                    </div>
                </a>
            `;
        }).join("");

    } catch (err) {
        console.error(err);
        grid.innerHTML = "<p>เกิดข้อผิดพลาดในการเชื่อมต่อข้อมูล</p>";
    }
});