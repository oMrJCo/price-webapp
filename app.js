document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("categoriesGrid");

  const CATEGORIES_URL =
    "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";

  // base สำหรับ GitHub Pages (เพื่อทำ relative path ให้ชัวร์)
  const GH_BASE = "/price-webapp/";

  function buildPriceSheetUrlFromTab(tabName) {
    // ใช้ relative จะได้ทำงานทั้งบน GH Pages และกรณีมี custom domain ในอนาคต
    return `${GH_BASE}price_sheet.html?tab=${encodeURIComponent(tabName)}`;
  }

  function isLikelyHttpUrl(url) {
    return typeof url === "string" && /^https?:\/\//i.test(url.trim());
  }

  function normalizeMaybeRelativeUrl(url) {
    if (!url) return "";
    const u = String(url).trim();
    if (!u) return "";
    // ถ้าเป็น http(s) ให้ใช้ได้เลย
    if (isLikelyHttpUrl(u)) return u;
    // ถ้าเป็น relative แล้วไม่ขึ้นต้นด้วย / ให้เติม base
    if (!u.startsWith("/")) return GH_BASE + u;
    return u; // เช่น /price-webapp/price_sheet.html?tab=Battery
  }

  try {
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

    // ===== LINE =====
    const lineFab = document.getElementById("lineFab");
    const lineBox = document.getElementById("lineBox");

    if (data.lineUrl && lineFab) lineFab.href = data.lineUrl;

    if (data.lineIcon) {
      const el = document.getElementById("lineIcon");
      if (el) el.src = data.lineIcon;
    }

    if (data.lineQr) {
      const el = document.getElementById("lineQr");
      if (el) el.src = data.lineQr;
    }

    const qrToggle = document.getElementById("qrToggle");
    if (qrToggle && lineBox) {
      qrToggle.addEventListener("click", () => {
        lineBox.classList.toggle("show");
      });
    }

    // ===== Categories =====
    const items = data.categories || [];

    grid.innerHTML = items
      .map((item) => {
        const title = item.titleEN || item.titleTH || "Category";

        // ✅ Priority 1: SheetTab (แนะนำ)
        const sheetTab = (item.sheetTab || "").trim();
        if (sheetTab) {
          const href = buildPriceSheetUrlFromTab(sheetTab);
          return renderCard({ title, item, href });
        }

        // ✅ Priority 2: Price Page Link (เช่น ลิงก์ price_sheet POC แบบเต็ม)
        const priceUrl = normalizeMaybeRelativeUrl(item.price_url);
        if (priceUrl) {
          return renderCard({ title, item, href: priceUrl });
        }

        // ✅ Priority 3: PDF fallback (เดิม)
        const pdf = item.pdf || item.pdf_file || "";
        const pdfHref = `${GH_BASE}price.html?title=${encodeURIComponent(title)}&pdf=${encodeURIComponent(pdf)}`;
        return renderCard({ title, item, href: pdfHref });
      })
      .join("");

    function renderCard({ title, item, href }) {
      const imgHtml = item.image
        ? `<img src="${item.image}" alt="${title}" loading="lazy" onerror="this.remove();">`
        : "";

      return `
        <a class="card" href="${href}">
          <div class="thumb">${imgHtml}</div>
          <div class="label">
            <div class="title-en">${item.titleEN || ""}</div>
            <div class="title-th">${item.titleTH || ""}</div>
          </div>
        </a>
      `;
    }
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div style="padding:16px;">โหลดข้อมูลหมวดหมู่ไม่สำเร็จ</div>`;
  }
});
