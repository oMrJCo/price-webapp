/* =========================
   LEEPLUS Price Sheet POC (FINAL)
   + Category image (meta row in sheet)
   + Brand image (meta row in sheet)
   + Product image (same as before)
   + Fallback: product -> brand -> none
   + Keep: All tab group by brand, sheet order, search, modal, PDF button
   ========================= */

const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";
const CATEGORIES_URL = "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";
const GH_BASE = "/price-webapp/";

const ALL_BRAND_KEY = "__ALL__";
const ALL_BRAND_LABEL = "All";

/* ✅ Meta keys (in sheet rows) — ยืดหยุ่น */
const META_BRAND_ACCEPT = new Set(["__META__", "__META"]);
const META_CATEGORY_IMAGE = "__CATEGORY_IMAGE__";
const META_BRAND_IMAGE = "__BRAND_IMAGE__";

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
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return `https://omrjco.github.io${s}`;
  return s;
}

function isHttpUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url.trim());
}

function normalizeMaybeRelativeUrl(url) {
  const u = String(url || "").trim();
  if (!u) return "";
  if (isHttpUrl(u)) return u;
  if (u.startsWith("/")) return u;
  return GH_BASE + u;
}

function tryGetTabFromPriceUrl(priceUrl) {
  const s = String(priceUrl || "").trim();
  if (!s) return "";
  try {
    const u = new URL(s, window.location.origin);
    return u.searchParams.get("tab") || "";
  } catch {
    return "";
  }
}

async function setupPdfDownloadButton(tabName) {
  const btn = el("openPdfBtn");
  if (!btn) return;
  btn.style.display = "none";

  try {
    const res = await fetch(`${CATEGORIES_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return;

    const data = await res.json();
    const cats = Array.isArray(data.categories) ? data.categories : [];

    const tab = String(tabName || "").trim();
    if (!tab) return;
    const tabLower = tab.toLowerCase();

    const match = cats.find((c) => {
      const st = String(c.sheetTab || "").trim();
      if (st && st.toLowerCase() === tabLower) return true;

      const purl = String(c.price_url || "").trim();
      const t = tryGetTabFromPriceUrl(purl);
      if (t && String(t).trim().toLowerCase() === tabLower) return true;

      return false;
    });

    if (!match) return;

    const pdf = match.pdf || match.pdf_file || "";
    const pdfUrl = normalizeMaybeRelativeUrl(pdf);
    if (!pdfUrl) return;

    btn.href = pdfUrl;
    btn.textContent = "เปิด PDF";
    btn.title = "เปิดไฟล์ PDF";
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.removeAttribute("download");

    btn.style.display = "inline-flex";
  } catch (e) {
    console.warn("setupPdfDownloadButton failed:", e);
  }
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && inQuotes && next === '"') { cur += '"'; i++; continue; }
    if (ch === '"') { inQuotes = !inQuotes; continue; }

    if (ch === "," && !inQuotes) { row.push(cur); cur = ""; continue; }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cur); cur = "";
      if (row.some(c => c !== "")) rows.push(row);
      row = [];
      continue;
    }
    cur += ch;
  }
  row.push(cur);
  if (row.some(c => c !== "")) rows.push(row);
  return rows;
}

function uniq(arr) {
  const set = new Set();
  const out = [];
  for (const x of arr) {
    const k = String(x);
    if (!set.has(k)) { set.add(k); out.push(x); }
  }
  return out;
}

function groupByBrandPreserveSheetOrder(rows) {
  const brandOrder = [];
  const map = new Map();

  for (const r of rows) {
    const b = (r.brand || "").trim() || "Unknown";
    if (!map.has(b)) { map.set(b, []); brandOrder.push(b); }
    map.get(b).push(r);
  }

  const out = [];
  for (const b of brandOrder) {
    out.push({ __type: "brandHeader", brand: b });
    out.push(...map.get(b));
  }
  return out;
}

function normalizeSearchCompact(s) {
  const raw = String(s || "").toLowerCase().trim();
  if (!raw) return "";
  if (raw.startsWith("ip") && !raw.startsWith("iphone")) {
    const rest = raw.slice(2);
    return ("iphone" + rest).replace(/[^a-z0-9]+/g, "");
  }
  return raw.replace(/[^a-z0-9]+/g, "");
}

function normalizeSearchTokens(s) {
  return String(s || "").toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function setupImageModal() {
  const modal = el("imgModal");
  const img = el("modalImg");
  const title = el("modalTitle");
  const close = el("modalClose");

  function hide() {
    modal?.classList.remove("show");
    modal?.setAttribute("aria-hidden", "true");
    if (img) img.src = "";
  }
  function show(src, t) {
    if (title) title.textContent = t || "รูปสินค้า";
    if (img) img.src = src;
    modal?.classList.add("show");
    modal?.setAttribute("aria-hidden", "false");
  }

  close?.addEventListener("click", hide);
  modal?.addEventListener("click", (e) => { if (e.target === modal) hide(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });

  document.addEventListener("click", (e) => {
    const t = e.target.closest(".thumb");
    if (!t) return;
    const src = t.getAttribute("data-full") || "";
    const name = t.getAttribute("data-title") || "";
    if (src) show(src, name);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = e.target.closest(".thumb");
    if (!t) return;
    e.preventDefault();
    const src = t.getAttribute("data-full") || "";
    const name = t.getAttribute("data-title") || "";
    if (src) show(src, name);
  });
}

/* ✅ ลบ BOM/ช่องว่างพิเศษใน header */
function cleanHeader(s) {
  return String(s || "")
    .replace(/^\uFEFF/, "") // BOM
    .replace(/\u00A0/g, " ") // nbsp
    .trim()
    .toLowerCase();
}

/* ✅ หา index จาก header, ถ้าไม่เจอ -> fallback ตามตำแหน่ง (0..4) */
function buildHeaderIndex(headerRow) {
  const norm = headerRow.map(cleanHeader);

  const idx = {
    brand: norm.indexOf("brand"),
    model: norm.indexOf("model"),
    price: norm.indexOf("price"),
    image_url: norm.indexOf("image_url"),
    updated: norm.indexOf("updated"),
  };

  // fallback alias
  if (idx.image_url === -1) idx.image_url = norm.indexOf("image url");
  if (idx.image_url === -1) idx.image_url = norm.indexOf("image");

  const anyMissing = Object.values(idx).some(v => v === -1);

  // ✅ ถ้ายังหาไม่ได้ ให้ fallback แบบ “ตำแหน่งมาตรฐาน” ตามที่พี่จัดแล้ว
  if (anyMissing) {
    return {
      brand: 0,
      model: 1,
      price: 2,
      image_url: 3,
      updated: 4,
    };
  }

  return idx;
}

function getCell(row, i) {
  if (i == null || i < 0) return "";
  return row[i] ?? "";
}

/* Load sheet and extract meta + data */
async function loadSheetWithMeta(tab) {
  const url = csvUrlForSheet(tab);
  const res = await fetch(`${url}&v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch CSV");
  const text = await res.text();

  const rows = parseCSV(text);
  if (!rows.length) return { rows: [], categoryImageUrl: "", brandImageMap: new Map() };

  const header = rows[0];
  const idx = buildHeaderIndex(header);
  const body = rows.slice(1);

  const raw = body
    .filter(r => r.some(c => String(c || "").trim() !== ""))
    .map((r) => ({
      brand: String(getCell(r, idx.brand) || "").trim(),
      model: String(getCell(r, idx.model) || "").trim(),
      price: String(getCell(r, idx.price) || "").trim(),
      image_url: String(getCell(r, idx.image_url) || "").trim(),
      updated: String(getCell(r, idx.updated) || "").trim(),
    }));

  let categoryImageUrl = "";
  const brandImageMap = new Map();

  // meta extraction
  for (const r of raw) {
    const b = (r.brand || "").trim();
    const m = (r.model || "").trim();
    const img = normalizeImageUrl(r.image_url);

    if (META_BRAND_ACCEPT.has(b) && m === META_CATEGORY_IMAGE && img) {
      categoryImageUrl = img;
      continue;
    }
    if (m === META_BRAND_IMAGE && b && img) {
      brandImageMap.set(b, img);
      continue;
    }
  }

  // filter out meta rows
  const products = raw.filter(r => {
    const b = (r.brand || "").trim();
    const m = (r.model || "").trim();
    if (META_BRAND_ACCEPT.has(b) && m === META_CATEGORY_IMAGE) return false;
    if (m === META_BRAND_IMAGE) return false;
    return true;
  });

  return { rows: products, categoryImageUrl, brandImageMap };
}

function renderTabs(brands, activeKey, onSelect, brandImageMap) {
  const root = el("tabs");
  if (!root) return;
  root.innerHTML = "";

  for (const b of brands) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill";
    btn.dataset.key = b.key;

    if (b.key !== ALL_BRAND_KEY) {
      const img = brandImageMap.get(b.key);
      if (img) {
        const wrap = document.createElement("span");
        wrap.className = "pillImg";
        wrap.innerHTML = `<img src="${escapeHTML(img)}" alt="">`;
        btn.appendChild(wrap);
      }
    }

    const label = document.createElement("span");
    label.textContent = b.label;
    btn.appendChild(label);

    if (b.key === activeKey) btn.classList.add("active");

    btn.addEventListener("click", () => {
      root.querySelectorAll(".pill").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      onSelect(b.key);
    });

    root.appendChild(btn);
  }
}

function renderTable(rows, brandImageMap) {
  const tbody = el("tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!rows.length) {
    if (el("empty")) {
      el("empty").style.display = "block";
      el("empty").textContent = "ไม่พบข้อมูล";
    }
    return;
  }
  if (el("empty")) el("empty").style.display = "none";

  for (const r of rows) {
    if (r.__type === "brandHeader") {
      const b = String(r.brand || "").trim();
      const bimg = brandImageMap.get(b) || "";

      const icon = bimg
        ? `<span class="brandImg"><img src="${escapeHTML(bimg)}" alt=""></span>`
        : `<span class="dot"></span>`;

      const tr = document.createElement("tr");
      tr.className = "brandHeaderRow";
      tr.innerHTML = `
        <td colspan="2">
          <span class="brandHeader">${icon}${escapeHTML(b)}</span>
        </td>
      `;
      tbody.appendChild(tr);
      continue;
    }

    const productImg = normalizeImageUrl(r.image_url);

    const thumbHtml = productImg
      ? `<div class="thumb" tabindex="0" role="button" aria-label="ดูรูป ${escapeHTML(r.model)}"
              data-full="${escapeHTML(productImg)}" data-title="${escapeHTML(r.model)}">
            <img src="${escapeHTML(productImg)}" alt="${escapeHTML(r.model)}" loading="lazy" />
         </div>`
      : ``;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:flex-start; gap:10px;">
          ${thumbHtml}
          <div>
            <div class="model">${escapeHTML(r.model)}</div>
          </div>
        </div>
      </td>
      <td class="price">${escapeHTML(r.price)} บาท</td>
    `;
    tbody.appendChild(tr);
  }
}

(async function init() {
  setupImageModal();

  const tab = getParam("tab") || "Battery";
  if (el("crumb")) el("crumb").textContent = `Sheet › ${tab}`;
  if (el("pageTitle")) el("pageTitle").textContent = tab;

  setupPdfDownloadButton(tab);

  const { rows: all, categoryImageUrl, brandImageMap } = await loadSheetWithMeta(tab);

  if (categoryImageUrl && el("catThumb") && el("catThumbImg")) {
    el("catThumbImg").src = categoryImageUrl;
    el("catThumb").style.display = "block";
  }

  const upd = all.find(r => (r.updated || "").trim())?.updated || "-";
  if (el("updateText")) el("updateText").textContent = `อัปเดต: ${upd}`;

  const brandNames = uniq(all.map(r => (r.brand || "").trim())).filter(Boolean);
  const brands = [
    { key: ALL_BRAND_KEY, label: ALL_BRAND_LABEL },
    ...brandNames.map(b => ({ key: b, label: b }))
  ];

  let activeBrand = ALL_BRAND_KEY;
  let query = "";

  function apply() {
    const qCompact = normalizeSearchCompact(query);
    const qTokens = normalizeSearchTokens(query);
    const isSearching = !!qCompact || qTokens.length > 0;

    let rows = all;

    if (isSearching) {
      rows = all.filter(r => {
        const hay = `${r.brand || ""} ${r.model || ""}`.toLowerCase();
        const hayCompact = normalizeSearchCompact(hay);

        if (qCompact && hayCompact.includes(qCompact)) return true;
        if (qTokens.length) return qTokens.every(t => hay.includes(t));
        return false;
      });

      renderTable(rows, brandImageMap);
      return;
    }

    if (activeBrand !== ALL_BRAND_KEY) {
      rows = all.filter(r => (r.brand || "").trim() === activeBrand);
      renderTable(rows, brandImageMap);
    } else {
      renderTable(groupByBrandPreserveSheetOrder(rows), brandImageMap);
    }
  }

  renderTabs(brands, activeBrand, (b) => {
    activeBrand = b;
    apply();
  }, brandImageMap);

  el("search")?.addEventListener("input", (e) => {
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
