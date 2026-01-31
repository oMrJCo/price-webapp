const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";

function getParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name) || "";
}

function csvUrlForSheet(sheetName) {
  const base = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
  const params = new URLSearchParams({ tqx: "out:csv", sheet: sheetName });
  return `${base}?${params.toString()}`;
}

function normalizeImageUrl(url) {
  const s = (url || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return "https://omrjco.github.io" + s;
  return s;
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

function el(id) {
  return document.getElementById(id);
}

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function formatPrice(p) {
  const raw = String(p ?? "").trim();
  const n = Number(raw.replace(/[^\d.]/g, ""));
  if (Number.isFinite(n) && raw !== "") return `${n.toLocaleString("th-TH")} บาท`;
  if (!raw) return "-";
  return `${escapeHTML(raw)} บาท`;
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

  tbody.innerHTML = rows.map(r => {
    const img = normalizeImageUrl(r.image_url);
    const hasImg = !!img;

    // ใส่ data- เพื่อใช้เปิด popup
    const dataAttrs = hasImg
      ? `data-img="${escapeHTML(img)}" data-title="${escapeHTML(r.model || "รูปสินค้า")}"`
      : "";

    return `
      <tr>
        <td>
          <div class="row">
            <div class="thumb ${hasImg ? "" : "no-img"}" ${dataAttrs} role="button" tabindex="0" aria-label="ดูรูป">
              ${
                hasImg
                  ? `<img src="${escapeHTML(img)}" alt="" loading="lazy"
                        onerror="this.closest('.thumb').classList.add('no-img'); this.remove();">`
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
  }).join("");

  empty.style.display = rows.length ? "none" : "block";
}

async function loadSheet(sheetName) {
  const url = csvUrlForSheet(sheetName);
  const res = await fetch(`${url}&v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("โหลดชีตไม่สำเร็จ (เช็ก public/publish + ชื่อแท็บ)");

  const text = await res.text();
  const rows = parseCSV(text);
  const headers = rows[0].map(h => (h || "").trim());

  return rows.slice(1).map(cols => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = (cols[i] ?? "").trim());
    return obj;
  });
}

/* =========================
   Popup (Image Modal)
   ========================= */
function setupImageModal() {
  const modal = el("imgModal");
  const modalImg = el("modalImg");
  const modalTitle = el("modalTitle");
  const closeBtn = el("modalClose");

  function openModal(src, title) {
    if (!src) return;
    modalImg.src = src;
    modalTitle.textContent = title || "รูปสินค้า";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    document.body.style.overflow = "";
  }

  // ปิดเมื่อคลิกพื้นหลัง (นอกการ์ด)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  closeBtn.addEventListener("click", closeModal);

  // ปิดด้วย Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // เปิดเมื่อคลิกที่ thumb (ใช้ event delegation)
  document.addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return;
    const src = thumb.getAttribute("data-img") || "";
    const title = thumb.getAttribute("data-title") || "รูปสินค้า";
    if (!src) return;
    openModal(src, title);
  });

  // เปิดด้วย Enter/Space เมื่อโฟกัส thumb
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const active = document.activeElement;
    if (!active || !active.classList || !active.classList.contains("thumb")) return;
    const src = active.getAttribute("data-img") || "";
    const title = active.getAttribute("data-title") || "รูปสินค้า";
    if (!src) return;
    e.preventDefault();
    openModal(src, title);
  });
}

(async function init() {
  setupImageModal();

  const tab = getParam("tab") || "Battery";
  el("crumb").textContent = `Sheet › ${tab}`;
  el("pageTitle").textContent = tab;

  const all = await loadSheet(tab);

  const upd = all.find(r => (r.updated || "").trim())?.updated || "-";
  el("updateText").textContent = `อัปเดต: ${upd}`;

  const brands = uniq(all.map(r => (r.brand || "").trim())).filter(Boolean);
  let activeBrand = brands[0] || "";
  let query = "";

  function apply() {
    let rows = all;

    if (activeBrand) rows = rows.filter(r => (r.brand || "").trim() === activeBrand);
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
