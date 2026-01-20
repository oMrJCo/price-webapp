// app.js — LEEPLUS Price Webapp
// รองรับ categories.json ได้ทั้งแบบ Array และแบบ { categories: [...] }
// + กัน cache เพื่อให้แก้จาก CMS แล้วหน้าเว็บอัปเดตทันที

function normalizeList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.categories)) return json.categories;

  // เผื่ออนาคต / กันพลาด
  if (json && json.data && Array.isArray(json.data.categories)) return json.data.categories;
  return [];
}

function normalizePath(p) {
  if (!p) return "";

  // ถ้าเป็น URL เต็ม
  if (/^https?:\/\//i.test(p)) return p;

  // กันเผื่อมี "./assets/xx"
  if (p.startsWith("./")) return p.slice(2);

  // ถ้าเริ่มด้วย "/" ถือว่าเป็น absolute ของเว็บ
  if (p.startsWith("/")) return p;

  // ค่าเริ่มต้นเป็น relative
  return p;
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

  // กัน cache ของ Netlify/Browser
  const url = `categories.json?v=${Date.now()}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const json = await res.json();
    const items = normalizeList(json);

    if (!items.length) {
      grid.innerHTML = `
        <div class="empty">
          ไม่พบข้อมูลหมวดสินค้าใน <b>categories.json</b><br/>
          ลองเข้า CMS แล้วกด Save อีกครั้ง หรือเช็กว่าไฟล์มี key <code>categories</code>
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
          ? `<img src="${img}" alt="${title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.classList.add('noimg');">`
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
