// =====================
// ตั้งค่าเดียวที่ต้องใส่
// =====================
const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";

// =====================
// Helper
// =====================
function getParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name) || "";
}

function csvUrlForSheet(sheetName) {
  const base = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
  const params = new URLSearchParams({
    tqx: "out:csv",
    sheet: sheetName,
  });
  return `${base}?${params.toString()}`;
}

// ✅ ทำให้ image_url "ทน" ต่อการกรอกผิด
// - ถ้าเป็นลิงก์เต็ม (http/https) ใช้ได้เลย
// - ถ้าเป็น path สั้น เช่น /price-webapp/... จะเติมโดเมน GitHub Pages ให้
function normalizeImageUrl(url) {
  const s = (url || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return "https://omrjco.github.io" + s;
  return s; // เผื่อใส่โดเมนอื่นแบบไม่ขึ้น http (ไม่แนะนำ แต่กันพัง)
}

function parseCSV(text) {
  const rows = [];
  let row = [],
    cur = "",
    inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i],
      next = text[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && ch === ",") {
      row.push(cur);
      cur = "";
      continue;
    }
    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (cur.length || row.length) {
        row.push(cur);
        rows.push(row);
      }
      row = [];
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => (c || "").trim() !== ""));
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function el(id) {
  return document.getElementById(id);
}

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(p) {
  const raw = String(p ?? "").trim();
  const n = Number(raw.replace(/[^\d.]/g, ""));
  if (Number.isFinite(n) && raw !== "") return `${n.toLocaleString("th-TH")} บาท`;
  // ถ้าเป็นค่าว่าง ให้โชว์ "-"
  if (!raw) return "-";
  // ถ้าเป็นข้อความแปลกๆ ให้โชว์ตามนั้น (กันพัง)
  return `${escapeHTML(raw)} บาท`;
}

function renderTabs(brands, activeBrand, onClick) {
  const tabs = el("tabs");
  tabs.innerHTML = brands
    .map(
      (b) =>
        `<button class="tab ${b === activeBrand ? "active" : ""}" data-brand="${escapeHTML(
          b
        )}">${escapeHTML(b)}</button>`
    )
    .join("");

  tabs.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => onClick(btn.dataset.brand));
  });
}

function renderTable(rows) {
  const tbody = el("tbody");
  const empty = el("empty");

  tbody.innerHTML = rows
    .map((r) => {
      const img = normalizeImageUrl(r.image_url);
      return `
        <tr>
          <td>
            <div class="row">
              <div class="thumb">
                ${
                  img
                    ? `<img src="${escapeHTML(img)}" alt="" loading="lazy" onerror="this.remove()">`
                    : ``
                }
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
      `;
    })
    .join("");

  empty.style.display = rows.length ? "none" : "block";
}

async function loadSheet(sheetName) {
  const url = csvUrlForSheet(sheetName);
  const res = await fetch(`${url}&v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("โหลดชีตไม่สำเร็จ (เช็ก public/publish + ชื่อแท็บ)");

  const text = await res.text();
  const rows = parseCSV(text);
  const headers = rows[0].map((h) => (h || "").trim());

  return rows.slice(1).map((cols) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    return obj;
  });
}

(async function init() {
  const tab = getParam("tab") || "Battery";
  el("crumb").textContent = `Sheet › ${tab}`;
  el("pageTitle").textContent = tab;

  const all = await loadSheet(tab);

  // updated: เอาค่า updated ตัวแรกที่มี
  const upd = all.find((r) => (r.updated || "").trim())?.updated || "-";
  el("updateText").textContent = `อัปเดต: ${upd}`;

  const brands = uniq(all.map((r) => (r.brand || "").trim())).filter(Boolean);
  let activeBrand = brands[0] || "";
  let query = "";

  function apply() {
    let rows = all;

    if (activeBrand) rows = rows.filter((r) => (r.brand || "").trim() === activeBrand);
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => (r.model || "").toLowerCase().includes(q));
    }

    rows = rows
      .slice()
      .sort((a, b) => (a.model || "").localeCompare(b.model || "", "en"));

    renderTable(rows);
  }

  renderTabs(brands, activeBrand, (b) => {
    activeBrand = b;
    // re-render active state
    renderTabs(brands, activeBrand, arguments.callee);
    apply();
  });

  el("search").addEventListener("input", (e) => {
    query = e.target.value.trim();
    apply();
  });

  apply();
})().catch((err) => {
  console.error(err);
  el("tbody").innerHTML = "";
  el("empty").style.display = "block";
  el("empty").textContent =
    "โหลดข้อมูลจาก Google Sheet ไม่สำเร็จ (เช็ก SPREADSHEET_ID / public / ชื่อแท็บ)";
});
