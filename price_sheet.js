const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";
const CATEGORIES_URL = "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";
const GH_BASE = "/price-webapp/";

const ALL_BRAND_KEY = "__ALL__";
const ALL_BRAND_LABEL = "All";

function el(id) { return document.getElementById(id); }
function getParam(name) { return new URL(window.location.href).searchParams.get(name) || ""; }
const DEBUG = getParam("debug") === "1";

function csvUrlForSheet(sheetName) {
  const base = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
  const params = new URLSearchParams({ tqx: "out:csv", sheet: sheetName });
  return `${base}?${params.toString()}`;
}

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function normalizeImageUrl(url) {
  const s = (url || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return `https://omrjco.github.io${s}`;
  return s;
}

function isHttpUrl(url) { return typeof url === "string" && /^https?:\/\//i.test(url.trim()); }
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
  try { return new URL(s, window.location.origin).searchParams.get("tab") || ""; } catch { return ""; }
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
function normalizeSearchTokens(s) { return String(s || "").toLowerCase().trim().split(/\s+/).filter(Boolean); }

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
}

function cleanHeader(s) {
  return String(s || "").replace(/^\uFEFF/, "").replace(/\u00A0/g, " ").trim().toLowerCase();
}
function buildHeaderIndex(headerRow) {
  const norm = headerRow.map(cleanHeader);
  const idx = {
    brand: norm.indexOf("brand"),
    model: norm.indexOf("model"),
    price: norm.indexOf("price"),
    image_url: norm.indexOf("image_url"),
    updated: norm.indexOf("updated"),
  };
  if (idx.image_url === -1) idx.image_url = norm.indexOf("image url");
  if (idx.image_url === -1) idx.image_url = norm.indexOf("image");

  const anyMissing = Object.values(idx).some(v => v === -1);
  if (anyMissing) return { brand: 0, model: 1, price: 2, image_url: 3, updated: 4 };
  return idx;
}
function getCell(row, i) { return (i == null || i < 0) ? "" : (row[i] ?? ""); }

/* meta matching หลวม */
function metaNorm(s) {
  return String(s || "").replace(/\u00A0/g, " ").trim().toUpperCase().replace(/\s+/g, "").replace(/_+/g, "_");
}
function metaNormLoose(s) { return metaNorm(s).replaceAll("_", ""); }
function isMetaBrand(brand) { return metaNormLoose(brand) === "META"; }
function isCategoryImageModel(model) { return metaNormLoose(model) === "CATEGORYIMAGE"; }
function isBrandImageModel(model) { return metaNormLoose(model) === "BRANDIMAGE"; }

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

  if (DEBUG) {
    console.log("[DEBUG] header raw:", header);
    console.log("[DEBUG] header idx:", idx);
  }

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

  for (const r of raw) {
    const b = (r.brand || "").trim();
    const m = (r.model || "").trim();
    const img = normalizeImageUrl(r.image_url);

    if (isMetaBrand(b) && isCategoryImageModel(m) && img) categoryImageUrl = img;
    if (isBrandImageModel(m) && b && img) brandImageMap.set(b, img);
  }

  const products = raw.filter(r => {
    const b = (r.brand || "").trim();
    const m = (r.model || "").trim();
    if (isMetaBrand(b) && isCategoryImageModel(m)) return false;
    if (isBrandImageModel(m)) return false;
    return true;
  });

  if (DEBUG) {
    console.log("[DEBUG] categoryImageUrl:", categoryImageUrl);
    console.log("[DEBUG] brandImageMap:", Array.from(brandImageMap.entries()));
    console.log("[DEBUG] first 5 rows:", products.slice(0, 5));
  }

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
    if (el("empty")) { el("empty").style.display = "block"; el("empty").textContent = "ไม่พบข้อมูล"; }
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
      tr.innerHTML = `<td colspan="2"><span class="brandHeader">${icon}${escapeHTML(b)}</span></td>`;
      tbody.appendChild(tr);
      continue;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><div class="model">${escapeHTML(r.model)}</div></td>
      <td class="price">${escapeHTML(r.price)} บาท</td>
    `;
    tbody.appendChild(tr);
  }
}

(async function init() {
  setupImageModal();

  const tab = getParam("tab") || "Battery";
  el("crumb") && (el("crumb").textContent = `Sheet › ${tab}`);
  el("pageTitle") && (el("pageTitle").textContent = tab);

  setupPdfDownloadButton(tab);

  const { rows: all, categoryImageUrl, brandImageMap } = await loadSheetWithMeta(tab);

  // show category thumb
  if (categoryImageUrl && el("catThumb") && el("catThumbImg")) {
    const imgEl = el("catThumbImg");
    imgEl.onload = () => { el("catThumb").style.display = "block"; };
    imgEl.onerror = () => { el("catThumb").style.display = "none"; };
    imgEl.src = categoryImageUrl;
    el("catThumb").style.display = "block";
  }

  const upd = all.find(r => (r.updated || "").trim())?.updated || "-";
  el("updateText") && (el("updateText").textContent = `อัปเดต: ${upd}`);

  const brandNames = uniq(all.map(r => (r.brand || "").trim())).filter(Boolean);
  const brands = [{ key: ALL_BRAND_KEY, label: ALL_BRAND_LABEL }, ...brandNames.map(b => ({ key: b, label: b }))];

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

  renderTabs(brands, activeBrand, (b) => { activeBrand = b; apply(); }, brandImageMap);
  el("search")?.addEventListener("input", (e) => { query = e.target.value.trim(); apply(); });
  apply();
})().catch(err => console.error(err));
