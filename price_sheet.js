// =====================
// ตั้งค่าเดียวที่ต้องใส่
// =====================
// ใช้ Spreadsheet ID จากลิงก์ Google Sheet:
// https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid=...
const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";

// =====================
// Helper
// =====================
function getParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name) || "";
}

function csvUrlForSheet(sheetName) {
  // ใช้ gviz endpoint ที่เลือก sheet ด้วย "ชื่อแท็บ" ได้ตรง ๆ
  // ต้อง public หรือ publish แล้ว
  const base = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
  const params = new URLSearchParams({
    tqx: "out:csv",
    sheet: sheetName
  });
  return `${base}?${params.toString()}`;
}

function parseCSV(text) {
  const rows = [];
  let row = [], cur = "", inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];

    if (ch === '"' && inQuotes && next === '"') { cur += '"'; i++; continue; }
    if (ch === '"') { inQuotes = !inQuotes; continue; }

    if (!inQuotes && ch === ",") { row.push(cur); cur = ""; continue; }
    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (cur.length || row.length) { row.push(cur); rows.push(row); }
      row = []; cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }

  return rows.filter(r => r.some(c => (c || "").trim() !== ""));
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function el(id) { return document.getElementById(id); }

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function formatPrice(p) {
  const n = Number(String(p).replace(/[^\d.]/g, ""));
  if (Number.isFinite(n)) return `${n.toLocaleString("th-TH")} บาท`;
  return (p || "").trim() ? `${escapeHTML(p)} บาท` : "-";
}

function renderTabs(brands, activeBrand, onClick) {
  const tabs = el("tabs");
  tabs.innerHTML = brands.map(b => `
    <button class="tab ${b === activeBrand ? "active" : ""}" data-brand="${escapeHTML(b)}">${escapeHTML(b)}</button>
  `).join("");

  tabs.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => onClick(btn.dataset.brand));
  });
}

function renderTable(rows) {
  const tbody = el("tbody");
  const empty = el("empty");

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>
        <div class="row">
          <div class="thumb">
            ${r.image_url ? `<img src="${escapeHTML(r.image_url)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
          </div>
          <div>
            <div class="model">${escapeHTML(r.model || "")}</div>
            <div style="margin-top:4px;">
              <span class="brandBadge">${escapeHTML(r.brand || "")}</span>
            </div>
          </div>
        </div>
      </td>
      <td class="price">${formatPrice(r.price)}</td>
    </tr>
  `).join("");

  empty.style.display = rows.length ? "none" : "block";
}

async function loadSheet(sheetName) {
  const url = csvUrlForSheet(sheetName);
  const res = await fetch(`${url}&v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("โหลดชีตไม่สำเร็จ (ตรวจ public/publish + ชื่อแท็บ)");

  const text = await res.text();
  const rows = parseCSV(text);
  const headers = rows[0].map(h => (h || "").trim());

  return rows.slice(1).map(cols => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = (cols[i] ?? "").trim());
    return obj;
  });
}

(async function init() {
  const tab = getParam("tab") || "Battery"; // ชื่อแท็บตรง ๆ
  el("crumb").textContent = `Sheet › ${tab}`;
  el("pageTitle").textContent = tab;

  const all = await loadSheet(tab);

  // คาดหวังคอลัมน์: brand, model, price, image_url, updated
  const brands = uniq(all.map(r => r.brand));
  let activeBrand = brands[0] || "";
  let query = "";

  // อัปเดตล่าสุด: เอาค่า updated ตัวแรกที่มี
  const upd = all.find(r => r.updated)?.updated || "-";
  el("updateText").textContent = `อัปเดต: ${upd}`;

  function apply() {
    let rows = all;

    if (activeBrand) rows = rows.filter(r => (r.brand || "") === activeBrand);
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(r => (r.model || "").toLowerCase().includes(q));
    }

    rows = rows.slice().sort((a,b) => (a.model||"").localeCompare(b.model||"", "en"));
    renderTable(rows);
  }

  renderTabs(brands, activeBrand, (b) => {
    activeBrand = b;
    renderTabs(brands, activeBrand, arguments.callee);
    apply();
  });

  el("search").addEventListener("input", (e) => {
    query = e.target.value.trim();
    apply();
  });

  apply();
})().catch(err => {
  console.error(err);
  el("tbody").innerHTML = "";
  el("empty").style.display = "block";
  el("empty").textContent = "โหลดข้อมูลจาก Google Sheet ไม่สำเร็จ (เช็ก SPREADSHEET_ID / public / ชื่อแท็บ)";
});
