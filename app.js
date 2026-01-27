// app.js — LEEPLUS Catalog (GitHub Pages friendly)
// โหลดข้อมูลจาก categories.json
// - รองรับทั้งแบบ { categories:[...] } และ Array ตรงๆ
// - กัน cache เพื่อให้แก้แล้วหน้าเว็บอัปเดตเร็ว
// - ใช้ path แบบ "relative" เพื่อไม่ชน /price-webapp/ ของ GitHub Pages

function normalizeList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.categories)) return json.categories;
  if (json && json.data && Array.isArray(json.data.categories)) return json.data.categories;
  return [];
}

function normalizePath(p) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;       // URL เต็ม
  if (p.startsWith("./")) return p.slice(2);   // ./assets/xx -> assets/xx
  return p;                                    // สำคัญ: ไม่เติม "/" นำหน้า
}

function makeTitle(item) {
  const en = (item.titleEN || "").trim();
  const th = (item.titleTH || "").trim();
  if (en && th) return `${en} (${th})`;
  return en || th || "Category";
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el && typeof val === "string" && val.trim()) el.textContent = val.trim();
}

function setImg(id, path) {
  const el = document.getElementById(id);
  if (!el) return;
  const p = normalizePath(path);
  if (p) el.src = p;
}

async function loadCategories() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  const url = `categories.json?v=${Date.now()}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();

    // optional settings ที่เก็บไว้ใน categories.json
    setText("siteTitle", json.siteTitle);
    setText("siteSubtitle", json.siteSubtitle);
    setText("coverHeadline", json.coverHeadline);
    setText("coverSubtext", json.coverSubtext);
    setImg("coverImage", json.coverImage);
    setImg("lineIcon", json.lineIcon);
    setImg("lineQr", json.lineQr);

    const items = normalizeList(json);

    if (!items.length) {
      grid.innerHTML = `
        <div class="empty">
          ไม่พบข้อมูลหมวดสินค้าใน <b>categories.json</b><br/>
          ตรวจว่าไฟล์มี key <code>categories</code> และเป็น Array
        </div>
      `;
      return;
    }

    grid.innerHTML = items
      .map((item) => {
        const title = makeTitle(item);
        const titleEN = (item.titleEN || "").trim();
        const titleTH = (item.titleTH || "").trim();
        const pdf = normalizePath(item.pdf || "");
        const img = normalizePath(item.image || "");

        const thumbHtml = img
          ? `<img src="${img}" alt="${title}" loading="lazy"
                onerror="this.style.display='none'; this.parentElement.classList.add('noimg');">`
          : ``;

        const href = `price.html?title=${encodeURIComponent(title)}&pdf=${encodeURIComponent(pdf)}`;

        return `
          <a class="card" href="${href}">
            <div class="thumb ${img ? "" : "noimg"}">
              ${thumbHtml}
              ${img ? "" : `<div class="ph">LEEPLUS</div>`}
            </div>
            <div class="content">
              <p class="title">${titleEN || titleTH || "Category"}</p>
              <p class="sub">${titleTH ? titleTH : ""}</p>
            </div>
          </a>
        `;
      })
      .join("");

    // Floating LINE
    const lineUrl = (json.lineUrl || "").trim();
    const fab = document.getElementById("lineFab");
    const qrBox = document.getElementById("qrBox");

    if (fab) {
      fab.addEventListener("click", () => {
        // คลิกครั้งแรก = toggle QR
        if (qrBox) qrBox.classList.toggle("show");
        // กดค้าง/กดซ้ำก็ได้ — ถ้าต้องการให้คลิกแล้วไป LINE ให้เปิดบรรทัดนี้
        // if (lineUrl) window.open(lineUrl, "_blank");
      });

      // Double click ไป LINE (กันพลาดสำหรับคนที่อยากกดไปเลย)
      fab.addEventListener("dblclick", () => {
        if (lineUrl) window.open(lineUrl, "_blank");
      });
    }
  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <div class="empty">
        โหลดข้อมูลหมวดสินค้าไม่สำเร็จ<br/>
        <small>${String(err.message || err)}</small>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadCategories);
