// app.js — LEEPLUS Price Webapp (GitHub Pages Ready)

const BASE_PATH = (() => {
  // GitHub Pages แบบ Project: /price-webapp/...
  const seg = location.pathname.split("/").filter(Boolean);
  if (seg.length > 0) return `/${seg[0]}/`;
  return "/";
})();

function normalizeList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.categories)) return json.categories;
  if (json && json.data && Array.isArray(json.data.categories)) return json.data.categories;
  return [];
}

function normalizeRelPath(p) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p; // url เต็ม ไม่แตะ
  // ตัด ./ และ / หน้าออก
  p = p.replace(/^\.\//, "").replace(/^\//, "");
  return BASE_PATH + p; // ใส่ /price-webapp/ ให้เอง
}

function makeTitle(item) {
  const en = (item.titleEN || "").trim();
  const th = (item.titleTH || "").trim();
  if (en && th) return `${en} (${th})`;
  return en || th || "Category";
}

async function loadCategories() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  const url = `${BASE_PATH}categories.json?v=${Date.now()}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    const items = normalizeList(json);

    if (!items.length) {
      grid.innerHTML = `<div class="empty">ไม่พบข้อมูลใน categories.json</div>`;
      return;
    }

    grid.innerHTML = items.map((item) => {
      const titleFull = makeTitle(item);
      const titleEN = (item.titleEN || "").trim();
      const titleTH = (item.titleTH || "").trim();

      const pdf = normalizeRelPath(item.pdf || "");
      const img = normalizeRelPath(item.image || "");

      // ให้ลิงก์ไป price.html อยู่ใต้ /price-webapp/ เสมอ
      const href = `${BASE_PATH}price.html?title=${encodeURIComponent(titleFull)}&pdf=${encodeURIComponent(pdf)}`;

      return `
        <a class="card" href="${href}">
          <div class="thumb ${img ? "" : "noimg"}">
            ${img ? `<img src="${img}" alt="${titleFull}" loading="lazy">` : `<div class="ph">LEEPLUS</div>`}
          </div>
          <div class="content">
            <p class="title">${titleEN || titleTH || "Category"}</p>
            <p class="sub">${titleTH || ""}</p>
          </div>
        </a>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div class="empty">โหลดหมวดสินค้าไม่สำเร็จ<br><small>${String(err.message || err)}</small></div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadCategories);
