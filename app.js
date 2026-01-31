document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("categoriesGrid");

  // 🔐 Source of Truth: GitHub Raw
  const CATEGORIES_URL =
    "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";

  try {
    // กัน cache ด้วย timestamp
    const res = await fetch(`${CATEGORIES_URL}?v=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to load categories.json");

    const data = await res.json();

    // ===== Header / Cover =====
    if (data.siteTitle) document.getElementById("siteTitle").textContent = data.siteTitle;
    if (data.siteSubtitle) document.getElementById("siteSubtitle").textContent = data.siteSubtitle;
    if (data.coverImage) document.getElementById("coverImage").src = data.coverImage;
    if (data.coverHeadline) document.getElementById("coverHeadline").textContent = data.coverHeadline;
    if (data.coverSubtext) document.getElementById("coverSubtext").textContent = data.coverSubtext;

    // ===== Categories =====
    const items = data.categories || [];
    grid.innerHTML = items
      .map((item) => {
        const pdf = item.pdf || "";
        const title = item.titleEN || item.titleTH || "Category";
        const href = `price.html?title=${encodeURIComponent(title)}&pdf=${encodeURIComponent(pdf)}`;

        // ✅ ไม่มี placeholder "LEEPLUS" อีกต่อไป
        // ✅ ถ้ารูปโหลดพลาด -> ลบ <img> ออก เหลือพื้นหลัง thumb เฉยๆ (ดูโปร)
        const imgHtml = item.image
          ? `<img src="${item.image}" alt="${title}" loading="lazy"
                onerror="this.remove();">`
          : "";

        return `
          <a class="card" href="${href}">
            <div class="thumb">
              ${imgHtml}
            </div>
            <div class="content">
              <p class="title">${title}</p>
              <p class="sub">${item.titleTH || ""}</p>
            </div>
          </a>
        `;
      })
      .join("");

    // ===== LINE FAB =====
    const fab = document.getElementById("lineFab");
    const qr = document.getElementById("qrBox");
    if (fab && qr) {
      fab.addEventListener("click", (e) => {
        e.stopPropagation();
        qr.style.display = qr.style.display === "block" ? "none" : "block";
      });
      document.addEventListener("click", () => {
        qr.style.display = "none";
      });
    }
  } catch (err) {
    console.error("Error loading categories:", err);
  }
});
