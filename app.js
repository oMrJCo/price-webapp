document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("categoriesGrid");
    if (!grid) return;

    try {
        // ดึงข้อมูลจาก categories.json
        const res = await fetch(`categories.json?v=${Date.now()}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        // แสดงรายการสินค้า
        const items = data.categories || [];
        if (items.length === 0) {
            grid.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>ไม่พบข้อมูลสินค้า</p>";
            return;
        }

        grid.innerHTML = items.map(item => {
            // สร้างลิงก์ส่งไปหน้า price.html
            const href = `price.html?title=${encodeURIComponent(item.titleTH)}&pdf=${encodeURIComponent(item.pdf)}`;
            
            return `
                <a class="card" href="${href}">
                    <div class="thumb">
                        ${item.image ? `<img src="${item.image}" onerror="this.style.display='none'">` : ''}
                        <div class="placeholder">LEEPLUS</div>
                    </div>
                    <div class="content">
                        <p class="title">${item.titleEN || 'Category'}</p>
                        <p class="sub">${item.titleTH || ''}</p>
                    </div>
                </a>
            `;
        }).join("");

    } catch (err) {
        console.error("Error loading categories:", err);
        grid.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
    }
});