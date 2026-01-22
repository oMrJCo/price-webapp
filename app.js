// app.js — LEEPLUS Price Webapp (GitHub Pages Ready)

const BASE_PATH = (() => {
  // ถ้า URL เป็น /price-webapp/... ให้ base เป็น /price-webapp/
  // ถ้าเป็น root (เช่น local) ให้ base เป็น /
  const seg = location.pathname.split("/").filter(Boolean);
  // Project pages: /{repo}/...
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
  if (/^https?:\/\//i.test(p)) return p; // url เต็มไม่ต้องแตะ
  // ตัด ./ และ /
  p = p.replace(/^\.\//, "").replace(/^\//, "");
  // ทำให้เป็น path ใต้ repo เสมอ
  return BASE_PATH + p;
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
      grid.innerHTML = `<div class="empty">ไม่พบข้อมูลหมวดสินค้าใน <b>categories.json</b></div>`;
      return;
    }

    grid.innerHTML = items.map((item) => {
      const titleFull = makeTitle(item);
      const titleEN = (item.titleEN || "").trim();
      const titleTH = (item.titleTH || "").trim();

      const pdf = normalizeRelPath(item.pdf || "");
      const img = normalizeRelPath(item.image || "");

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
