/* DEALER PRICE SHEET VERSION: 2026-05-15a
   - Dealer zone
   - Read categories/pdf from Google Sheet API
   - Read meta category/brand images from API
   - Use dealer_price first, fallback to price
*/

const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";
const API_URL = "https://script.google.com/macros/s/AKfycbxqUpwXOo05dZ1iv9BP29pVR273Qj1d8fXwYZnn29A9cpNfrAtE0IKL7uqO-DXopIgUYA/exec";
const GH_BASE = "/dealer/";
const IS_DEALER_ZONE = true;

const ALL_BRAND_KEY = "__ALL__";
const ALL_BRAND_LABEL = "All";

function el(id) { return document.getElementById(id); }
function getParam(name) { return new URL(window.location.href).searchParams.get(name) || ""; }
const DEBUG = getParam("debug") === "1";

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function isHttpUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url.trim());
}

function normalizeImageUrl(url) {
  const s = String(url || "").trim();
  if (!s) return "";
  if (isHttpUrl(s)) return s;
  if (s.startsWith("/")) return `https://omrjco.github.io${s}`;
  return s;
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

async function loadMetaConfig() {
  try {
    const res = await fetch(`${API_URL}?action=meta&t=${Date.now()}`, {
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Meta API failed");

    const json = await res.json();
    if (!json.success) throw new Error("Meta API success false");

    return json.data || {};
  } catch (e) {
    console.warn("loadMetaConfig failed:", e);
    return { site: {}, category: {}, brand: {} };
  }
}

async function setupPdfDownloadButton(tabName) {
  const btn = el("openPdfBtn");
  const hint = el("pdfHint");
  if (!btn) return;

  btn.style.display = "none";
  if (hint) hint.style.display = "none";

  try {
    const res = await fetch(`${API_URL}?action=categories&t=${Date.now()}`, {
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Categories API failed");

    const json = await res.json();
    if (!json.success) throw new Error("Categories API success false");

    const cats = Array.isArray(json.data) ? json.data : [];

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

    const pdf =
      match.dealer_pdf_url ||
      match.dealer_pdf ||
      match.dealerPdf ||
      "";

    const pdfUrl = normalizeMaybeRelativeUrl(pdf);
    if (!pdfUrl) return;

    btn.href = pdfUrl;
    btn.textContent = "เปิด PDF";
    btn.title = "เปิดไฟล์ PDF";
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.removeAttribute("download");
    btn.style.display = "inline-flex";

    if (hint) hint.style.display = "inline-flex";
  } catch (e) {
    console.warn("setupPdfDownloadButton from API failed:", e);
  }
}

/* ===== helpers ===== */
function uniq(arr) {
  const set = new Set();
  const out = [];
  for (const x of arr) {
    const k = String(x);
    if (!set.has(k)) {
      set.add(k);
      out.push(x);
    }
  }
  return out;
}

function groupByBrandPreserveSheetOrder(rows) {
  const brandOrder = [];
  const map = new Map();

  for (const r of rows) {
    const b = (r.brand || "").trim() || "Unknown";
    if (!map.has(b)) {
      map.set(b, []);
      brandOrder.push(b);
    }
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

function formatModelHTML(model) {
  const raw = String(model || "");

  let isNew = false;
  let cleaned = raw.replace(/\(\s*NEW\s*\)|\bNEW\b\s*!*/gi, () => {
    isNew = true;
    return "";
  });

  cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
  const safe = escapeHTML(cleaned);

  return isNew ? `${safe}<span class="badgeNew">NEW</span>` : safe;
}

/* ===== modal ===== */
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
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) hide();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });

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

/* ===== old META row helpers ===== */
function metaKey(s) {
  return String(s || "")
    .replace(/\u00A0/g, " ")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "");
}

function extractFirstUrlFromRow(values) {
  for (const v of values) {
    const s = String(v || "").trim();
    const u = normalizeImageUrl(s);
    if (u && isHttpUrl(u)) return u;
  }
  return "";
}

function isProbablyNumber(s) {
  const t = String(s || "").trim();
  if (!t) return false;
  return /^-?\d+(\.\d+)?$/.test(t);
}

function pickBrandNameFromRow(values) {
  const candidates = [];
  for (const v of values) {
    const s = String(v || "").trim();
    if (!s) continue;
    if (isHttpUrl(normalizeImageUrl(s))) continue;
    const k = metaKey(s);
    if (k === "META" || k === "CATEGORYIMAGE" || k === "BRANDIMAGE") continue;
    if (isProbablyNumber(s)) continue;
    candidates.push(s);
  }

  if (!candidates.length) return "";

  candidates.sort((a, b) =>
    (a.length + (a.match(/\s/g)?.length || 0) * 5) -
    (b.length + (b.match(/\s/g)?.length || 0) * 5)
  );

  return candidates[0].trim();
}

/* ===== GViz ===== */
function gvizJsonUrl(sheetName) {
  const base = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
  const params = new URLSearchParams({ tqx: "out:json", sheet: sheetName });
  return `${base}?${params.toString()}`;
}

function parseGvizResponse(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("Invalid GViz response");
  }
  return JSON.parse(text.slice(start, end + 1));
}

function colLabel(c) {
  return String(c.label || c.id || "").trim();
}

function cellValue(v) {
  if (!v) return "";
  if (typeof v.f === "string" && v.f.trim() !== "") return v.f;
  if (v.v == null) return "";
  return String(v.v);
}

function normColName(s) {
  return String(s || "")
    .replace(/\u00A0/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function pickIndex(cols, candidates) {
  const names = cols.map(c => normColName(colLabel(c)));
  for (const cand of candidates) {
    const i = names.indexOf(normColName(cand));
    if (i !== -1) return i;
  }
  return -1;
}

async function loadSheetWithMeta(tab) {
  const url = gvizJsonUrl(tab);
  const res = await fetch(`${url}&v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch GViz JSON");

  const text = await res.text();
  const json = parseGvizResponse(text);
  const table = json?.table;
  const cols = Array.isArray(table?.cols) ? table.cols : [];
  const rows = Array.isArray(table?.rows) ? table.rows : [];

  let idx = {
    brand: pickIndex(cols, ["brand", "Brand"]),
    model: pickIndex(cols, ["model", "Model"]),
    price: pickIndex(cols, ["price", "Price"]),
    dealer_price: pickIndex(cols, ["dealer_price", "dealer price", "price_dealer", "dealerPrice", "Dealer Price"]),
    image_url: pickIndex(cols, ["image_url", "image url", "imageurl", "img", "imgurl"]),
    updated: pickIndex(cols, ["updated", "update", "lastupdate", "last updated"]),
  };

  if (
    idx.brand === -1 ||
    idx.model === -1 ||
    idx.price === -1 ||
    idx.image_url === -1 ||
    idx.updated === -1
  ) {
    idx = {
      brand: 0,
      model: 1,
      price: 2,
      dealer_price: 3,
      image_url: 4,
      updated: 5
    };
  }

  const raw = rows.map(r => {
    const c = Array.isArray(r.c) ? r.c : [];
    const allValues = c.map(cellValue).map(s => String(s || "").trim());

    const dealerPrice =
      idx.dealer_price >= 0 ? String(cellValue(c[idx.dealer_price]) || "").trim() : "";

    const normalPrice =
      idx.price >= 0 ? String(cellValue(c[idx.price]) || "").trim() : "";

    return {
      brand: String(cellValue(c[idx.brand]) || "").trim(),
      model: String(cellValue(c[idx.model]) || "").trim(),
      price: dealerPrice || normalPrice,
      image_url: String(cellValue(c[idx.image_url]) || "").trim(),
      updated: String(cellValue(c[idx.updated]) || "").trim(),
      __all: allValues
    };
  });

  let categoryImageUrl = "";
  const brandImageMap = new Map();

  for (const r of raw) {
    const rowKeys = r.__all.map(metaKey);

    const hasMETA = rowKeys.includes("META") || metaKey(r.brand) === "META";
    const hasCATEGORY = rowKeys.includes("CATEGORYIMAGE") || metaKey(r.model) === "CATEGORYIMAGE";
    const hasBRAND =
      rowKeys.includes("BRANDIMAGE") ||
      metaKey(r.model) === "BRANDIMAGE" ||
      metaKey(r.brand) === "BRANDIMAGE";

    const url = normalizeImageUrl(r.image_url) || extractFirstUrlFromRow(r.__all);

    if (!categoryImageUrl && hasMETA && hasCATEGORY && url) {
      categoryImageUrl = url;
    }

    if (hasBRAND && url) {
      const b =
        metaKey(r.brand) !== "BRANDIMAGE" &&
        metaKey(r.brand) !== "META" &&
        r.brand
          ? r.brand
          : pickBrandNameFromRow(r.__all);

      if (b) brandImageMap.set(b, url);
    }
  }

  const products = raw
    .filter(r => {
      const rowKeys = r.__all.map(metaKey);

      const hasMETA = rowKeys.includes("META") || metaKey(r.brand) === "META";
      const hasCATEGORY = rowKeys.includes("CATEGORYIMAGE") || metaKey(r.model) === "CATEGORYIMAGE";
      const hasBRAND =
        rowKeys.includes("BRANDIMAGE") ||
        metaKey(r.model) === "BRANDIMAGE" ||
        metaKey(r.brand) === "BRANDIMAGE";

      return !((hasMETA && hasCATEGORY) || hasBRAND);
    })
    .map(({ __all, ...rest }) => rest);

  if (DEBUG) {
    console.log("[DEALER DEBUG] idx:", idx);
    console.log("[DEALER DEBUG] old categoryImageUrl:", categoryImageUrl);
    console.log("[DEALER DEBUG] old brandImageMap:", Array.from(brandImageMap.entries()));
  }

  return { rows: products, categoryImageUrl, brandImageMap };
}


async function loadCompatibilitySheet(tab) {
  const url = gvizJsonUrl(tab);
  const res = await fetch(`${url}&v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch Compatibility GViz JSON");
  const text = await res.text();
  const json = parseGvizResponse(text);
  const table = json?.table;
  const cols = Array.isArray(table?.cols) ? table.cols : [];
  const rows = Array.isArray(table?.rows) ? table.rows : [];

  // GViz can return column IDs (A/B/C...) instead of the visible header labels.
  // Prefer labels when present, but fall back to the fixed Compatibility schema.
  const findCol = (names, fallback) => {
    const wanted = names.map(v => String(v).trim().toLowerCase());
    const i = cols.findIndex(col => {
      const label = String(col?.label || "").trim().toLowerCase();
      const id = String(col?.id || "").trim().toLowerCase();
      return wanted.includes(label) || wanted.includes(id);
    });
    return i >= 0 ? i : fallback;
  };

  const idx = {
    type: findCol(["type"], 0),
    code: findCol(["code"], 1),
    brand: findCol(["brand"], 2),
    models: findCol(["models", "model"], 3),
    image_url: findCol(["image_url", "image url", "imageurl", "img", "imgurl"], 4),
    updated: findCol(["updated", "update", "lastupdate", "last updated"], 5)
  };

  return rows.map(r => {
    const c = Array.isArray(r.c) ? r.c : [];
    return {
      type: String(cellValue(c[idx.type]) || "").trim(),
      code: String(cellValue(c[idx.code]) || "").trim(),
      brand: String(cellValue(c[idx.brand]) || "").trim(),
      models: String(cellValue(c[idx.models]) || "").trim(),
      image_url: String(cellValue(c[idx.image_url]) || "").trim(),
      updated: String(cellValue(c[idx.updated]) || "").trim()
    };
  }).filter(r => r.code || r.brand || r.models);
}

function ensureCompatibilityStyles() {
  if (document.getElementById("compatibilityStyles")) return;
  const style = document.createElement("style");
  style.id = "compatibilityStyles";
  style.textContent = `
    .compat-wrap{display:grid;gap:10px;width:100%}
    .compat-group{border:1px solid rgba(255,255,255,.08);border-radius:14px;background:#0e131b;overflow:hidden}
    .compat-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 14px;background:#121923;border-bottom:1px solid rgba(255,255,255,.07)}
    .compat-code{display:flex;align-items:center;gap:8px;font-weight:950;color:#fff;font-size:14px}
    .compat-code::before{content:"";width:18px;height:4px;border-radius:999px;background:#f3c900}
    .compat-type{font-size:10px;font-weight:800;color:#8d96a3;letter-spacing:.25px}
    .compat-body{display:grid}
    .compat-row{display:grid;grid-template-columns:150px minmax(0,1fr);gap:0;border-bottom:1px solid rgba(255,255,255,.055)}
    .compat-row:last-child{border-bottom:0}
    .compat-brand{padding:10px 12px;font-size:11px;font-weight:900;color:#f3c900;background:rgba(255,255,255,.015);border-right:1px solid rgba(255,255,255,.055)}
    .compat-models{padding:10px 14px;font-size:12px;line-height:1.65;color:#d5dae1;overflow-wrap:anywhere}
    .compat-image{width:48px;height:48px;border-radius:10px;background:#fff;overflow:hidden;flex:0 0 48px;border:1px solid rgba(255,255,255,.08)}
    .compat-image img{width:100%;height:100%;object-fit:contain;display:block}
    .compat-head-main{display:flex;align-items:center;gap:10px;min-width:0}
    .compat-empty{padding:22px;text-align:center;color:#7f8895;border:1px dashed rgba(255,255,255,.09);border-radius:13px;background:#0d1117}
    .compat-summary{font-size:9px;color:#6f7884;white-space:nowrap}
    @media(max-width:720px){
      .compat-group{border-radius:12px}
      .compat-head{padding:10px 11px}
      .compat-code{font-size:13px}
      .compat-row{grid-template-columns:92px minmax(0,1fr)}
      .compat-brand{padding:9px 9px;font-size:10px}
      .compat-models{padding:9px 10px;font-size:11px;line-height:1.55}
      .compat-summary{display:none}
      .compat-image{width:42px;height:42px;flex-basis:42px}
    }
  `;
  document.head.appendChild(style);
}

function groupCompatibilityRows(rows) {
  const map = new Map();
  for (const r of rows) {
    const key = String(r.code || "-").trim() || "-";
    if (!map.has(key)) map.set(key, {
      code:key,
      type:String(r.type || "").trim(),
      image_url:String(r.image_url || "").trim(),
      rows:[]
    });
    const g = map.get(key);
    if (!g.type && r.type) g.type=String(r.type).trim();
    if (!g.image_url && r.image_url) g.image_url=String(r.image_url).trim();
    g.rows.push(r);
  }
  return [...map.values()];
}

function renderCompatibility(rows) {
  ensureCompatibilityStyles();
  const tbody = el("tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!rows.length) {
    if (el("empty")) {
      el("empty").style.display = "block";
      el("empty").textContent = "ไม่พบรุ่นที่รองรับ";
    }
    return;
  }
  if (el("empty")) el("empty").style.display = "none";

  const groups = groupCompatibilityRows(rows);

  for (const g of groups) {
    const tr = document.createElement("tr");
    tr.style.display = "table-row";
    tr.style.background = "transparent";
    tr.style.border = "0";
    tr.style.boxShadow = "none";

    const td = document.createElement("td");
    td.colSpan = 2;
    td.style.padding = "0 0 10px";
    td.style.border = "0";

    const imageUrl = normalizeImageUrl(g.image_url);
    const imageHtml = imageUrl
      ? `<div class="compat-image"><img src="${escapeHTML(imageUrl)}" alt="" loading="lazy"></div>`
      : "";

    const brandRows = g.rows.map(r => `
      <div class="compat-row">
        <div class="compat-brand">${escapeHTML(r.brand || "-")}</div>
        <div class="compat-models">${escapeHTML(r.models || "-")}</div>
      </div>
    `).join("");

    td.innerHTML = `
      <div class="compat-group">
        <div class="compat-head">
          <div class="compat-head-main">
            ${imageHtml}
            <div>
              <div class="compat-code">${escapeHTML(g.code)}</div>
              ${g.type ? `<div class="compat-type">${escapeHTML(g.type)}</div>` : ""}
            </div>
          </div>
          <div class="compat-summary">${g.rows.length} BRAND${g.rows.length>1?"S":""}</div>
        </div>
        <div class="compat-body">${brandRows}</div>
      </div>`;

    const img = td.querySelector(".compat-image img");
    if (img) img.addEventListener("error",()=>img.closest(".compat-image")?.remove(),{once:true});

    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

function filterCompatibilityRows(all, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return all;

  const compact = normalizeSearchCompact(q);
  const tokens = normalizeSearchTokens(q);
  const groups = groupCompatibilityRows(all);
  const result = [];

  for (const g of groups) {
    const groupHay = `${g.code} ${g.type}`.toLowerCase();
    const groupCompact = normalizeSearchCompact(groupHay);
    const groupMatch =
      (compact && groupCompact.includes(compact)) ||
      (tokens.length && tokens.every(t => groupHay.includes(t)));

    if (groupMatch) {
      result.push(...g.rows);
      continue;
    }

    for (const r of g.rows) {
      const hay = `${r.brand || ""} ${r.models || ""}`.toLowerCase();
      const hayCompact = normalizeSearchCompact(hay);
      const rowMatch =
        (compact && hayCompact.includes(compact)) ||
        (tokens.length && tokens.every(t => hay.includes(t)));
      if (rowMatch) result.push(r);
    }
  }
  return result;
}


/* ===== render ===== */
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
        wrap.className = "tabIcon";
        wrap.innerHTML = `<img src="${escapeHTML(img)}" alt="" class="tabIconImg">`;
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

      let iconHtml = `<span class="dot"></span>`;
      if (bimg) {
        iconHtml = `
          <span class="brandIcon"><img src="${escapeHTML(bimg)}" alt="" class="brandIconImg"></span>`;
      }

      const tr = document.createElement("tr");
      tr.className = "brandHeaderRow";
      tr.innerHTML = `<td colspan="2"><span class="brandHeader">${iconHtml}${escapeHTML(b)}</span></td>`;
      tbody.appendChild(tr);
      continue;
    }

    const productImg = normalizeImageUrl(r.image_url);
    const thumbHtml = productImg
      ? `<div class="thumb" tabindex="0" role="button"
              data-full="${escapeHTML(productImg)}" data-title="${escapeHTML(r.model)}">
            <img src="${escapeHTML(productImg)}" alt="${escapeHTML(r.model)}" loading="lazy" />
         </div>`
      : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:flex-start; gap:10px; min-width:0;">
          ${thumbHtml}
          <div class="model">${formatModelHTML(r.model)}</div>
        </div>
      </td>
      <td class="price"><span class="priceValue">${escapeHTML(r.price)}</span> <span class="priceUnit">บาท</span></td>
    `;

    tbody.appendChild(tr);
  }
}


async function loadCategoryByTab(tab) {
  try {
    const r = await fetch(`${API_URL}?action=categories&t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`categories api ${r.status}`);
    const j = await r.json();
    const items = Array.isArray(j.data) ? j.data : [];
    const target = String(tab || "").trim().toLowerCase();

    return items.find(item =>
      String(item.sheetTab || item.sheet_tab || "").trim().toLowerCase() === target
    ) || null;
  } catch (err) {
    if (DEBUG) console.warn("loadCategoryByTab failed", err);
    return null;
  }
}

/* ===== category thumb ===== */
function applyCategoryThumb(categoryImageUrl) {
  const thumb = el("catThumb");
  const img = el("catThumbImg");
  if (!thumb || !img) return;

  if (categoryImageUrl) {
    img.onload = () => { thumb.style.display = "block"; };
    img.onerror = () => { thumb.style.display = "none"; };
    img.src = categoryImageUrl;
    thumb.style.display = "block";
  } else {
    thumb.style.display = "none";
  }
}

(async function init() {
  setupImageModal();

  const tab = getParam("tab") || "Battery";

  if (el("crumb")) el("crumb").textContent = `Sheet › ${tab}`;
  if (el("pageTitle")) el("pageTitle").textContent = tab;

  setupPdfDownloadButton(tab);

  const meta = await loadMetaConfig();
  const categoryRecord = await loadCategoryByTab(tab);
  const categoryType = String(categoryRecord?.categoryType || "PRICE").trim().toUpperCase();

  if (categoryType === "COMPATIBILITY") {
    const all = await loadCompatibilitySheet(tab);
    applyCategoryThumb(normalizeImageUrl(categoryRecord?.image || categoryRecord?.image_url || ""));
    const upd = all.find(r => r.updated)?.updated || "-";
    el("updateText") && (el("updateText").textContent = `อัปเดต: ${upd}`);

    // Compatibility uses a smart search:
    // code/type match = show whole group, brand/model match = show only matching rows.
    const tabsRoot = el("tabs");
    if (tabsRoot) tabsRoot.style.display = "none";

    const search = el("search");
    if (search) search.placeholder = "ค้นหารุ่น เช่น Y27 / iPhone 15 Pro / Redmi Note 13 / LP16";
    const applyCompatibility = () => {
      renderCompatibility(filterCompatibilityRows(all, search?.value || ""));
    };
    search?.addEventListener("input", applyCompatibility);
    renderCompatibility(all);
    return;
  }

  const {
    rows: all,
    categoryImageUrl: oldCategoryImageUrl,
    brandImageMap: oldBrandImageMap
  } = await loadSheetWithMeta(tab);

  const categoryImageUrl =
    normalizeImageUrl(
      categoryRecord?.image ||
      categoryRecord?.image_url ||
      categoryRecord?.categoryImage ||
      ""
    ) ||
    meta?.category?.[tab] ||
    meta?.category?.[String(tab).trim()] ||
    oldCategoryImageUrl ||
    "";

  const brandImageMap = new Map(oldBrandImageMap);

  Object.entries(meta?.brand || {}).forEach(([k, v]) => {
    const key = String(k || "").trim();
    const value = String(v || "").trim();
    if (key && value) {
      brandImageMap.set(key, value);
    }
  });

  if (DEBUG) {
    console.log("[DEALER DEBUG] meta:", meta);
    console.log("[DEALER DEBUG] final categoryImageUrl:", categoryImageUrl);
    console.log("[DEALER DEBUG] final brandImageMap:", Array.from(brandImageMap.entries()));
  }

  applyCategoryThumb(categoryImageUrl);

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
  if (el("empty")) {
    el("empty").style.display = "block";
    el("empty").textContent = "โหลดข้อมูลไม่สำเร็จ";
  }
});
