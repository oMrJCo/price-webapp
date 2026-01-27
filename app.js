// app.js — LEEPLUS Catalog (GitHub Pages & Luxury UI Friendly)

/**
 * 1. ฟังก์ชันช่วยจัดการข้อมูลและ Path
 */
function normalizeList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.categories)) return json.categories;
  return [];
}

function normalizePath(p) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("./")) return p.slice(2);
  return p;
}

/**
 * 2. ฟังก์ชันหลักในการโหลดข้อมูลหมวดหมู่
 */
async function loadCategories() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  // ใส่ v=Date.now เพื่อให้ browser โหลดไฟล์ใหม่เสมอเวลาพี่อัปเดตราคา
  const url = `categories.json?v=${Date.now()}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`ไม่สามารถโหลดไฟล์ข้อมูลได้: ${res.status}`);
    const json = await res.json();

    // ดึงรายการสินค้าออกมา
    const items = normalizeList(json);

    if (items.length === 0) {
      grid.innerHTML = `<div class="empty">ขออภัย ไม่พบข้อมูลหมวดสินค้าในระบบ</div>`;
      return;
    }

    // สร้างการ์ดสินค้าแต่ละใบลงในหน้าเว็บ
    grid.innerHTML = items.map((item) => {
      const titleEN = (item.titleEN || "").trim();
      const titleTH = (item.titleTH || "").trim();
      const pdf = normalizePath(item.pdf || "");
      const img = normalizePath(item.image || "");

      // ส่งชื่อและลิงก์ PDF ไปที่หน้า price.html
      const href = `price.html?title=${encodeURIComponent(titleEN || titleTH)}&pdf=${encodeURIComponent(pdf)}`;

      return `
        <a class="card" href="${href}">
          <div class="thumb ${img ? "" : "noimg"}">
            ${img ? `<img src="${img}" alt="${titleTH}" loading="lazy" onerror="this.parentElement.classList.add('noimg'); this.style.display='none';">` : ""}
            <div class="placeholder">LEEPLUS</div>
          </div>
          <div class="content">
            <p class="title">${titleEN || titleTH}</p>
            <p class="subtext">${titleTH ? titleTH : ""}</p>
          </div>
        </a>
      `;
    }).join("");

    // จัดการปุ่ม LINE Floating หลังโหลดข้อมูลเสร็จ
    setupLineFloating();

  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div class="empty">เกิดข้อผิดพลาดในการเชื่อมต่อข้อมูล</div>`;
  }
}

/**
 * 3. ฟังก์ชันควบคุมปุ่ม LINE และ QR Code
 */
function setupLineFloating() {
  const fab = document.querySelector(".fab");
  const qrBox = document.getElementById("qrBox");

  if (fab && qrBox) {
    // คลิกที่ปุ่มเขียว เพื่อ เปิด/ปิด QR Code
    fab.addEventListener("click", (e) => {
      e.stopPropagation(); // กันบั๊ก
      qrBox.classList.toggle("show");
    });

    // คลิกที่ตัว QR Code เอง เพื่อปิด (เวลาลูกค้าดูเสร็จแล้ว)
    qrBox.addEventListener("click", () => {
      qrBox.classList.remove("show");
    });

    // คลิกที่อื่นในหน้าเว็บ เพื่อปิด QR Code
    document.addEventListener("click", () => {
      qrBox.classList.remove("show");
    });
  }
}

// เริ่มทำงานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener("DOMContentLoaded", loadCategories);