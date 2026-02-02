/* =========================
   LEEPLUS Price Sheet POC (FINAL)
   - All tab (group by brand) + preserve sheet order
   - Search: flexible (iphone15 / iphone 15 / 15 pro / pro max / ip15)
   - Search ignores brand filter (search across all brands in this tab)
   - Tabs: render once, toggle active (fix: no double click needed)
   - Image popup modal
   ========================= */

const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";
const ALL_BRAND_KEY = "__ALL__";
const ALL_BRAND_LABEL = "All";

function el(id) { return document.getElementById(id); }

function getParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name) || "";
}

function csvUrlForSheet(sheetName) {
  const base = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
  const params = new URLSearchParams({ tqx: "out:csv", sheet: sheetName });
  return `${base}?${params.toString()}`;
}

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function normalizeImageUrl(url) {
  const s = (url || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return "https://omrjco.github.io" + s;
  return s;
}

// Compact search + alias ip -> iphone
function normalizeSearchCompact(s) {
  const str = String(s || "").toLowerCase();
  let compact;
  try {
    compact = str.replace(/[^\p{L}\p{N}]+/gu, "");
  } catch {
    compact = str.replace(/[^a-z0-9]+/g, "");
  }
  if (compact.startsWith("ip") && !compact.startsWith("iphone")) {
    compact = "iphone" + compact.slice(2);
  }
  return compact;
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

function formatPrice(p) {
  const raw = String(p ?? "").trim();
  const n = Number(raw.replace(/[^\d.]/g, ""));
  if (Number.isFinite(n) && raw !== "") return `${n.toLocaleString("th-TH")} บาท`;
  if (!raw) return "-";
  return `${escapeHTML(raw)} บาท`;
}

/**
 * All mode grouping:
 * - brand order = first appearance in sheet
 * - items inside brand = original sheet order (no sort)
 */
function groupByBrandPreserveSheetOrder(rows) {
  const groups = new Map();
  const brandOrder = [];

  for (const r of rows) {
    const b = (r.brand || "").trim() || "Other";
    if (!groups.has(b)) {
      groups.set(b, []);
      brandOrder.push(b);
    }
    groups.get(b).push(r);
  }

  const out = [];
  for (const b of brandOrder) {
    out.push({ __type: "brandHeader", brand: b });
    out.push(...groups.get(b));
  }
  return out;
}

/**
 * Tabs: render once + set active by toggling class
 * (Fix: no re-render on click => no double click issue)
 */
function renderTabs(brands, activeKey, onSelect) {
  const tabs = el("tabs");

  tabs.innerHTML = brands.map(b => `
    <button class="tab" data-key="${escapeHTML(b.key)}">${escapeHTML(b.label)}</button>
  `).join("");

  function setActive(key) {
    tabs.querySelectorAll(".tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.key === key);
    });
  }

  setActive(activeKey);

  tabs.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      setActive(key);
      onSelect(key);
    });
  });

  return setActive;
}

function renderTable(rows) {
  const tbody = el("tbody");
  const empty = el("empty");

  tbody.innerHTML = rows.map(r => {
    if (r && r.__type === "brandHeader") {
      return `
        <tr class="brand-row">
          <td colspan="2">
            <span class="brand-pill">
              <span class="brand-dot"></span>
              ${escapeHTML(r.brand || "")}
            </span>
          </td>
        </tr>
      `;
    }

    const img = normalizeImageUrl(r.image_url);
    const hasImg = !!img;

    const dataAttrs = hasImg
      ? `data-img="${escapeHTML(img)}" data-title="${escapeHTML(r.model || "รูปสินค้า")}"`
      : "";

    return `
      <tr>
        <td>
          <div class="row">
            <div class="thumb ${hasImg ? "" : "no-img"}" ${dataAttrs} role="button" tabindex="0" aria-label="ดูรูปสินค้า">
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

  const hasRealRows = rows.some(x => !(x && x.__type === "brandHeader"));
  empty.style.display = hasRealRows ? "none" : "block";
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

  if (!modal || !modalImg || !modalTitle || !closeBtn) return;

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

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  closeBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // event delegation: click thumbnail
  document.addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return;
    const src = thumb.getAttribute("data-img") || "";
    const title = thumb.getAttribute("data-title") || "รูปสินค้า";
    if (!src) return;
    openModal(src, title);
  });

  // keyboard: Enter/Space on focused thumb
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const a = document.activeElement;
    if (!a || !a.classList || !a.classList.contains("thumb")) return;
    const src = a.getAttribute("data-img") || "";
    const title = a.getAttribute("data-title") || "รูปสินค้า";
    if (!src) return;
    e.preventDefault();
    openModal(src, title);
  });
}

/* =========================
   Init
   ========================= */
(async function init() {
  setupImageModal();

  const tab = getParam("tab") || "Battery";
  el("crumb").textContent = `Sheet › ${tab}`;
  el("pageTitle").textContent = tab;

  const all = await loadSheet(tab);

  const upd = all.find(r => (r.updated || "").trim())?.updated || "-";
  el("updateText").textContent = `อัปเดต: ${upd}`;

  const brandNames = uniq(all.map(r => (r.brand || "").trim())).filter(Boolean);
  const brands = [
    { key: ALL_BRAND_KEY, label: ALL_BRAND_LABEL },
    ...brandNames.map(b => ({ key: b, label: b }))
  ];

  let activeBrand = ALL_BRAND_KEY;
  let query = "";

  function apply() {
    let rows = all;

    // If searching: search across all brands in this sheet tab
    if (query) {
      const qLower = query.toLowerCase().trim();
      const qCompact = normalizeSearchCompact(qLower);
      const qTokens = qLower.split(/\s+/).filter(Boolean);

      rows = rows.filter(r => {
        const brand = String(r.brand || "");
        const model = String(r.model || "");
        const hay = `${brand} ${model}`.toLowerCase();

        const hayCompact = normalizeSearchCompact(hay);
        if (qCompact && hayCompact.includes(qCompact)) return true;

        if (qTokens.length) return qTokens.every(t => hay.includes(t));
        return false;
      });

      // preserve sheet order
      renderTable(rows);
      return;
    }

    // No search:
    if (activeBrand && activeBrand !== ALL_BRAND_KEY) {
      rows = rows.filter(r => (r.brand || "").trim() === activeBrand);
      renderTable(rows);
      return;
    }

    // All: group by brand, preserve sheet order
    renderTable(groupByBrandPreserveSheetOrder(rows));
  }

  // Tabs (render once) => fixes "must click twice"
  renderTabs(brands, activeBrand, (b) => {
    activeBrand = b;
    apply();
  });

  // Search
  el("search").addEventListener("input", (e) => {
    query = e.target.value.trim();
    apply();
  });

  apply();
})().catch(err => {
  console.error(err);
  if (el("tbody")) el("tbody").innerHTML = "";
  if (el("empty")) {
    el("empty").style.display = "block";
    el("empty").textContent = "โหลดข้อมูลจาก Google Sheet ไม่สำเร็จ (เช็ก public / ชื่อแท็บ / SPREADSHEET_ID)";
  }
});
