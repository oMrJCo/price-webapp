document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("categoriesGrid");
    if (!grid) return;

    // ดึงข้อมูลจากไฟล์ JSON โดยกัน Cache เพื่อความสดใหม่
    const url = `categories.json?v=${Date.now()}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("ไม่สามารถโหลดไฟล์ categories.json ได้");
        const json = await res.json();

        // แกะข้อมูลจาก Key ที่ชื่อ "categories"
        const items = json.categories || [];

        if (items.length === 0) {
            grid.innerHTML = "<p style='grid-column:1/-1; text-align:center; padding:40px; color:#64748b;'>-- ไม่พบข้อมูลหมวดหมู่สินค้า --</p>";
            return;
        }

        // สร้าง HTML สำหรับการ์ดสินค้าแต่ละใบ
        grid.innerHTML = items.map(item => {
            const title = item.titleEN || item.titleTH || "Category";
            const sub = item.titleTH || "";
            const pdf = item.pdf || "";
            const img = item.image || "";

            // ส่งข้อมูลไปยังหน้า price.html
            const href = `price.html?title=${encodeURIComponent(title)}&pdf=${encodeURIComponent(pdf)}`;
            
            return `
                <a class="card" href="${href}">
                    <div class="thumb">
                        ${img ? `<img src="${img}" alt="${title}" onerror="this.style.display='none'">` : ''}
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
        console.error("Error:", err);
        grid.innerHTML = `<div class="empty">เกิดข้อผิดพลาด: ${err.message}</div>`;
    }
});