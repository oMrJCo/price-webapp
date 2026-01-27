document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("categoriesGrid");
  
  try {
    const res = await fetch(`categories.json?v=${Date.now()}`);
    const data = await res.json();
    
    // อัปเดตหัวข้อเว็บจาก JSON
    document.getElementById("siteTitle").textContent = data.siteTitle || "LEEPLUS";
    document.getElementById("siteSubtitle").textContent = data.siteSubtitle || "";

    const items = data.categories || [];
    
    grid.innerHTML = items.map(item => {
      // ส่งชื่อตัวแปรไปหน้าถัดไปในชื่อ "pdf"
      const link = `price.html?title=${encodeURIComponent(item.titleTH)}&pdf=${encodeURIComponent(item.pdf)}`;
      
      return `
        <a href="${link}" class="card">
          <div class="thumb">
            ${item.image ? `<img src="${item.image}" onerror="this.style.display='none'">` : ''}
            <div class="placeholder">LEEPLUS</div>
          </div>
          <div class="content">
            <p class="title">${item.titleEN}</p>
            <p class="sub">${item.titleTH}</p>
          </div>
        </a>
      `;
    }).join("");

  } catch (err) {
    grid.innerHTML = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
    console.error(err);
  }
});