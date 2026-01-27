document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("categoriesGrid");
    if (!grid) return;

    // ดึงข้อมูลพร้อมกัน Cache เพื่อให้หน้าเว็บอัปเดตทันทีที่พี่แก้ไฟล์
    const url = `categories.json?v=${Date.now()}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        const json = await res.json();

        // แกะข้อมูลจากตัวแปร categories
        const items = json.categories || [];

        if (items.length === 0) {
            grid.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>-- ไม่พบข้อมูลสินค้า --</p>";
            return;
        }

        // วนลูปสร้างการ์ดสินค้าแต่ละใบ
        grid.innerHTML = items.map(item => {
            const titleEN = (item.titleEN || "").trim();
            const titleTH = (item.titleTH || "").trim();
            const pdf = item.pdf || "";
            const img = item.image || "";

            // ส่งข้อมูลไปหน้า price.html
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