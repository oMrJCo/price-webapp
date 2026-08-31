
(function ensureCustomMobileFullWidthFix(){
  if(document.getElementById("customMobileFullWidthFix"))return;
  const st=document.createElement("style");
  st.id="customMobileFullWidthFix";
  st.textContent=`
    @media(max-width:720px){
      #tbody .compat-host-row,
      #tbody .vc-host-row{
        display:block!important;
        width:100%!important;
        max-width:100%!important;
        margin:0!important;
        border:0!important;
        background:transparent!important;
        overflow:visible!important;
      }
      #tbody .compat-host-cell,
      #tbody .vc-host-cell{
        display:block!important;
        width:100%!important;
        max-width:100%!important;
        min-width:0!important;
        flex:0 0 100%!important;
        padding-left:0!important;
        padding-right:0!important;
        text-align:left!important;
      }
      #tbody .compat-group,
      #tbody .compat-row,
      #tbody .vc-group,
      #tbody .vc-content,
      #tbody .vc-list{
        width:100%!important;
        max-width:100%!important;
        min-width:0!important;
      }
      #tbody .compat-models{
        min-width:0!important;
        width:auto!important;
        overflow-wrap:anywhere!important;
        word-break:normal!important;
      }
    }
  `;
  document.head.appendChild(st);
})();

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

  // IMPORTANT:
  // Force Google GViz to treat exactly the first row as the header.
  // Without headers=1, GViz guesses the header count and can incorrectly
  // consume the first many Compatibility rows (e.g. MATTE/PRIVACY).
  const params = new URLSearchParams({
    tqx: "out:json",
    sheet: sheetName,
    headers: "1"
  });

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
  }).filter(r => {
    if (!(r.code || r.brand || r.models)) return false;
    // Google GViz may expose the first visible header row with an empty `type`
    // cell. Treat code/brand/models as a header regardless of the type value.
    const code = String(r.code).trim().toLowerCase();
    const brand = String(r.brand).trim().toLowerCase();
    const models = String(r.models).trim().toLowerCase();
    const type = String(r.type).trim().toLowerCase();

    const isHeader =
      code === "code" &&
      brand === "brand" &&
      ["models","model"].includes(models) &&
      (type === "" || type === "type");

    return !isHeader;
  });
}

function ensureCompatibilityStyles() {
  if (document.getElementById("compatibilityStyles")) return;
  const style = document.createElement("style");
  style.id = "compatibilityStyles";
  style.textContent = `
    .compat-wrap{display:grid;gap:10px;width:100%}
    .compat-group{border:1px solid rgba(255,255,255,.08);border-radius:14px;background:#0e131b;overflow:hidden}
    .compat-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 14px;background:#121923;border-bottom:1px solid rgba(255,255,255,.07)}
    .compat-code{display:flex;align-items:center;gap:8px;font-weight:950;color:#fff;font-size:15px}
    .compat-code::before{content:"";width:18px;height:4px;border-radius:999px;background:#f3c900}
    .compat-type{display:inline-flex;align-items:center;padding:3px 8px;border-radius:7px;background:rgba(243,201,0,.10);border:1px solid rgba(243,201,0,.22);font-size:10px;font-weight:900;color:#f3c900;letter-spacing:.25px}
    .compat-body{display:grid}
    .compat-row{display:grid;grid-template-columns:150px minmax(0,1fr);gap:0;border-bottom:1px solid rgba(255,255,255,.055)}
    .compat-row:last-child{border-bottom:0}
    .compat-brand{padding:10px 12px;font-size:13px;font-weight:950;color:#f3c900;background:rgba(255,255,255,.015);border-right:1px solid rgba(255,255,255,.055)}
    .compat-models{padding:11px 14px;font-size:15px;line-height:1.65;color:#e2e6eb;overflow-wrap:anywhere;text-align:left!important}
    .compat-image{width:48px;height:48px;border-radius:10px;background:#fff;overflow:hidden;flex:0 0 48px;border:1px solid rgba(255,255,255,.08)}
    .compat-image img{width:100%;height:100%;object-fit:contain;display:block}
    .compat-head-main{display:flex;align-items:center;gap:10px;min-width:0}
    .compat-empty{padding:22px;text-align:center;color:#7f8895;border:1px dashed rgba(255,255,255,.09);border-radius:13px;background:#0d1117}
    .search-hit{background:rgba(243,201,0,.22);color:#ffe45e;border-radius:4px;padding:0 2px;font-weight:950}
    .autoTagBadge{display:inline-flex;align-items:center;margin-left:7px;padding:3px 7px;border-radius:999px;background:rgba(243,201,0,.10);border:1px solid rgba(243,201,0,.28);color:#f3c900;font-size:10px;font-weight:950;vertical-align:middle}
    .compat-summary{display:none!important}
    @media(max-width:720px){
      .compat-group{border-radius:12px}
      .compat-head{padding:10px 11px}
      .compat-code{font-size:13px}
      .compat-row{grid-template-columns:92px minmax(0,1fr)}
      .compat-brand{padding:9px 9px;font-size:12px}
      .compat-models{padding:10px 10px;font-size:14px;line-height:1.6;text-align:left!important}
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

function renderCompatibility(rows, query = "") {
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
    tr.className = "compat-host-row";
    tr.style.background = "transparent";
    tr.style.border = "0";
    tr.style.boxShadow = "none";

    const td = document.createElement("td");
    td.className = "compat-host-cell";
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
        <div class="compat-models">${highlightHTML(r.models || "-", query)}</div>
      </div>
    `).join("");

    td.innerHTML = `
      <div class="compat-group">
        <div class="compat-head">
          <div class="compat-head-main">
            ${imageHtml}
            <div class="compat-code">${escapeHTML(g.code)}${g.type ? `<span class="compat-type">${escapeHTML(g.type)}</span>` : ""}</div>
          </div>
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



async function loadVisualCatalogSheet(tab) {
  const url = gvizJsonUrl(tab);
  const res = await fetch(`${url}&v=${Date.now()}`, { cache:"no-store" });
  if (!res.ok) throw new Error("Failed to fetch Visual Catalog GViz JSON");
  const json = parseGvizResponse(await res.text());
  const table=json?.table||{}, cols=Array.isArray(table.cols)?table.cols:[], rows=Array.isArray(table.rows)?table.rows:[];

  const findCol=(names,fallback)=>{
    const wanted=names.map(v=>String(v).trim().toLowerCase());
    const i=cols.findIndex(col=>wanted.includes(String(col?.label||"").trim().toLowerCase())||wanted.includes(String(col?.id||"").trim().toLowerCase()));
    return i>=0?i:fallback;
  };
  const idx={
    group:findCol(["group","type","category"],0),
    code:findCol(["code","sku"],1),
    model:findCol(["model"],2),
    variant:findCol(["variant","style","product type"],3),
    color:findCol(["color","colour"],4),
    image_url:findCol(["image_url","image url","imageurl","img","imgurl"],5),
    updated:findCol(["updated","update","last updated"],6)
  };

  let inheritedImage="";
  let inheritedKey="";
  const data=[];
  for(const r of rows){
    const c=Array.isArray(r.c)?r.c:[];
    const item={
      group:String(cellValue(c[idx.group])||"").trim(),
      code:String(cellValue(c[idx.code])||"").trim(),
      model:String(cellValue(c[idx.model])||"").trim(),
      variant:String(cellValue(c[idx.variant])||"").trim(),
      color:String(cellValue(c[idx.color])||"").trim(),
      image_url:String(cellValue(c[idx.image_url])||"").trim(),
      updated:String(cellValue(c[idx.updated])||"").trim()
    };
    const low=[item.group,item.code,item.model,item.variant,item.color].map(v=>v.toLowerCase());
    if(low[0]==="group"&&low[1]==="code"&&low[2]==="model") continue;
    if(!(item.group||item.code||item.model||item.variant||item.color)) continue;

    // Image inheritance is intentionally scoped to the same group/code/model/variant.
    const key=[item.group,item.code,item.model,item.variant].map(v=>v.toLowerCase()).join("|");
    if(item.image_url){
      inheritedImage=item.image_url;
      inheritedKey=key;
    }else if(inheritedKey===key){
      item.image_url=inheritedImage;
    }else{
      inheritedImage="";
      inheritedKey=key;
    }
    data.push(item);
  }
  return data;
}

function ensureVisualCatalogStyles(){
  if(document.getElementById("visualCatalogStyles"))return;
  const style=document.createElement("style");
  style.id="visualCatalogStyles";
  style.textContent=`
    .vc-wrap{display:grid;gap:14px;width:100%}
    .vc-group{border:1px solid rgba(243,201,0,.28);border-radius:16px;background:#0e131b;overflow:hidden}
    .vc-title{padding:12px 15px;background:#121923;border-bottom:1px solid rgba(255,255,255,.07);font-size:15px;font-weight:950;color:#fff;display:flex;align-items:center;gap:9px}
    .vc-title:before{content:"";width:18px;height:4px;border-radius:99px;background:#f3c900}
    .vc-content{display:grid;grid-template-columns:210px minmax(0,1fr);gap:0}
    .vc-gallery{padding:14px;border-right:1px solid rgba(255,255,255,.07);display:grid;gap:10px;align-content:start}
    .vc-gallery-item{background:#fff;border-radius:12px;overflow:hidden;aspect-ratio:1/1;display:grid;place-items:center}
    .vc-gallery-item img{width:100%;height:100%;object-fit:contain;display:block}
    .vc-list{display:grid;align-content:start}
    .vc-model{display:grid;grid-template-columns:220px minmax(0,1fr);border-bottom:1px solid rgba(255,255,255,.06)}
    .vc-model:last-child{border-bottom:0}
    .vc-model-name{padding:14px 14px;color:#f3c900;font-weight:950;border-right:1px solid rgba(255,255,255,.06);white-space:nowrap;display:flex;align-items:center;justify-content:center;text-align:center}
    .vc-model-info{padding:11px 14px;display:grid;gap:7px}
    .vc-variant{font-size:11px;color:#8993a2;font-weight:800}
    .vc-colors{display:flex;flex-wrap:wrap;gap:7px}
    .vc-color{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border-radius:999px;background:#111822;border:1px solid rgba(255,255,255,.09);font-size:12px;color:#e8ebef}\n    .vc-swatch{width:20px;height:20px;border-radius:50%;display:inline-block;flex:0 0 20px;border:1px solid rgba(255,255,255,.6);box-shadow:0 0 0 1px rgba(0,0,0,.22) inset}
    .vc-empty{padding:24px;text-align:center;color:#7f8895}
    @media(max-width:760px){
      .vc-content{grid-template-columns:1fr}
      .vc-gallery{grid-template-columns:repeat(3,1fr);border-right:0;border-bottom:1px solid rgba(255,255,255,.07);padding:10px}
      .vc-model{grid-template-columns:145px minmax(0,1fr)}
      .vc-model-name{padding:11px 8px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .vc-model-info{padding:9px 10px}
      .vc-color{font-size:11px;padding:5px 7px}
    }
  `;
  document.head.appendChild(style);
}

function groupVisualCatalogRows(rows){
  const groups=new Map();
  for(const r of rows){
    const gkey=String(r.group||r.variant||"สินค้า").trim()||"สินค้า";
    if(!groups.has(gkey))groups.set(gkey,{name:gkey,rows:[]});
    groups.get(gkey).rows.push(r);
  }
  return [...groups.values()];
}


function visualExtractEnglishColor(colorText){
  const raw=String(colorText||"").trim();
  const matches=[...raw.matchAll(/\(([^()]*)\)/g)];
  if(matches.length){
    const last=String(matches[matches.length-1][1]||"").trim().toLowerCase();
    if(last)return last;
  }
  return raw.toLowerCase();
}

function visualColorSwatchStyle(colorText){
  const key=visualExtractEnglishColor(colorText)
    .replace(/\s+/g," ")
    .trim();

  // Exact / specific product colors first.
  const exact={
    "black":"#0b0d10",
    "space black":"#15181c",
    "black graphite":"#41454a",
    "graphite":"#53575c",
    "midnight":"#1d2934",
    "midnight green":"#3f5b52",

    "white":"#f5f5f2",
    "cloud white":"#f5f5f0",
    "starlight":"#d9d2c4",
    "white silver":"linear-gradient(135deg,#ffffff 0%,#e7eaed 48%,#b8bec4 100%)",
    "silver":"linear-gradient(135deg,#f5f6f7 0%,#cbd0d4 48%,#969ca2 100%)",

    "yellow":"#e7c958",
    "gold":"#d9b45c",
    "light gold":"#e7cd99",
    "rose gold":"#d9a7a0",

    "red":"#d65353",
    "product red":"#c84f55",
    "(product)red":"#c84f55",
    "coral":"#e98568",
    "orange":"#e9782e",
    "cosmic orange":"#ef6c1c",

    "green":"#6c9b72",
    "alpine green":"#5e796b",
    "sage":"#94a78d",

    "blue":"#668ab4",
    "pacific blue":"#6f8796",
    "sierra blue":"#90aabd",
    "sky blue":"#78b8df",
    "mist blue":"#91b1bf",
    "mistblue":"#91b1bf",
    "deep blue":"#1e3d68",

    "purple":"#9b82cf",
    "deep purple":"#65547c",
    "lavender":"#ab91d5",

    "pink":"#e4a6b5"
  };

  if(exact[key])return exact[key];

  // Thai-only fallback when there is no English name in parentheses.
  const raw=String(colorText||"").toLowerCase();
  const thai=[
    ["ดำกราไฟต์","#41454a"],
    ["ดำ","#0b0d10"],
    ["เงิน","linear-gradient(135deg,#f5f6f7 0%,#cbd0d4 48%,#969ca2 100%)"],
    ["ขาว","#f5f5f2"],
    ["เหลือง","#e7c958"],
    ["ทอง","#d9b45c"],
    ["แดง","#d65353"],
    ["ส้ม","#e9782e"],
    ["เขียว","#6c9b72"],
    ["น้ำเงิน","#668ab4"],
    ["ฟ้า","#78b8df"],
    ["ม่วง","#9b82cf"],
    ["ชมพู","#e4a6b5"],
    ["เทา","#777d83"]
  ];
  for(const [name,value] of thai){
    if(raw.includes(name))return value;
  }

  return "linear-gradient(135deg,#858b92,#c5cad0)";
}

function renderVisualCatalog(rows,query=""){
  ensureVisualCatalogStyles();
  const tbody=el("tbody"); if(!tbody)return;
  tbody.innerHTML="";
  if(el("empty"))el("empty").style.display=rows.length?"none":"block";
  if(!rows.length){if(el("empty"))el("empty").textContent="ไม่พบรายการสินค้า";return;}

  for(const group of groupVisualCatalogRows(rows)){
    const modelMap=new Map(), images=[];
    for(const r of group.rows){
      const key=[r.code,r.model,r.variant].join("|");
      if(!modelMap.has(key))modelMap.set(key,{code:r.code,model:r.model,variant:r.variant,colors:[],image_url:r.image_url});
      const m=modelMap.get(key);
      if(r.color&&!m.colors.includes(r.color))m.colors.push(r.color);
      if(!m.image_url&&r.image_url)m.image_url=r.image_url;
      if(r.image_url&&!images.includes(r.image_url))images.push(r.image_url);
    }
    const tr=document.createElement("tr"),td=document.createElement("td");
    tr.className="vc-host-row";
    td.className="vc-host-cell";
    td.colSpan=2;td.style.padding="0 0 14px";td.style.border="0";
    const gallery=images.slice(0,6).map(u=>`<div class="vc-gallery-item"><img src="${escapeHTML(normalizeImageUrl(u))}" alt="" loading="lazy"></div>`).join("");
    const models=[...modelMap.values()].map(m=>`
      <div class="vc-model">
        <div class="vc-model-name">${highlightHTML(m.model||m.code||"-",query)}</div>
        <div class="vc-model-info">
          ${m.variant?`<div class="vc-variant">${highlightHTML(m.variant,query)}</div>`:""}
          <div class="vc-colors">${m.colors.length?m.colors.map(c=>`<span class="vc-color"><i class="vc-swatch" style="background:${visualColorSwatchStyle(c)}"></i><span>${highlightHTML(c,query)}</span></span>`).join(""):'<span class="vc-color">-</span>'}</div>
        </div>
      </div>`).join("");
    td.innerHTML=`<div class="vc-group"><div class="vc-title">${highlightHTML(group.name,query)}</div><div class="vc-content">${gallery?`<div class="vc-gallery">${gallery}</div>`:""}<div class="vc-list">${models}</div></div></div>`;
    td.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>img.closest(".vc-gallery-item")?.remove(),{once:true}));
    tr.appendChild(td);tbody.appendChild(tr);
  }
}

function filterVisualCatalogRows(all,query){
  const q=String(query||"").trim().toLowerCase(); if(!q)return all;
  const compact=normalizeSearchCompact(q),tokens=normalizeSearchTokens(q);
  return all.filter(r=>{
    const hay=[r.group,r.code,r.model,r.variant,r.color].join(" ").toLowerCase();
    const hc=normalizeSearchCompact(hay);
    return (compact&&hc.includes(compact))||(tokens.length&&tokens.every(t=>hay.includes(t)));
  });
}


/* ===== render ===== */


function ensureSmartModelStyles() {
  if (document.getElementById("smartModelStyles")) return;
  const style=document.createElement("style");
  style.id="smartModelStyles";
  style.textContent=`
    .autoTagBadge{display:inline-flex;align-items:center;margin-left:7px;padding:3px 7px;border-radius:999px;background:rgba(243,201,0,.10);border:1px solid rgba(243,201,0,.28);color:#f3c900;font-size:10px;font-weight:950;vertical-align:middle}
    .search-hit{background:rgba(243,201,0,.22);color:#ffe45e;border-radius:4px;padding:0 2px;font-weight:950}
  `;
  document.head.appendChild(style);
}

function escapeRegExp(s) {
  return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightHTML(text, query) {
  const raw = String(text ?? "");
  const q = String(query || "").trim();
  if (!q) return escapeHTML(raw);

  const tokens = q.split(/\s+/).filter(Boolean).sort((a,b)=>b.length-a.length);
  if (!tokens.length) return escapeHTML(raw);

  const re = new RegExp("(" + tokens.map(escapeRegExp).join("|") + ")", "ig");
  return escapeHTML(raw).replace(re, '<mark class="search-hit">$1</mark>');
}

function isTechnicalParenthesisTag(text) {
  const t = String(text || "").trim();

  // Technical capacity values should stay as normal model text.
  // Examples:
  // (3,349 mAh up to 3,640 mAh)
  // (3,630 mAh)
  return /^[\d,.]+\s*mAh(?:\s*up\s*to\s*[\d,.]+\s*mAh)?$/i.test(t);
}

function formatModelWithAutoBadge(model) {
  let raw = String(model || "").trim();
  if (!raw) return "";

  // NEW is a dedicated badge and may appear anywhere in the model text.
  let isNew = false;
  raw = raw.replace(/\(\s*NEW\s*\)|\bNEW\b\s*!*/gi, () => {
    isNew = true;
    return "";
  }).replace(/\s{2,}/g, " ").trim();

  const parts = [];
  let lastIndex = 0;
  const re = /\(([^()]+)\)/g;
  let m;

  while ((m = re.exec(raw)) !== null) {
    const before = raw.slice(lastIndex, m.index);
    if (before) parts.push(escapeHTML(before));

    const tag = String(m[1] || "").trim();
    if (tag) {
      if (isTechnicalParenthesisTag(tag)) {
        // Keep technical capacity parenthesis as plain text.
        parts.push(`(${escapeHTML(tag)})`);
      } else {
        // Any other parenthesis group is an automatic badge,
        // regardless of whether it is at the end or in the middle.
        parts.push(`<span class="autoTagBadge">${escapeHTML(tag)}</span>`);
      }
    }

    lastIndex = re.lastIndex;
  }

  const after = raw.slice(lastIndex);
  if (after) parts.push(escapeHTML(after));

  let html = parts.join("").replace(/\s{2,}/g, " ").trim();
  if (!html) html = escapeHTML(raw);

  if (isNew) html += `<span class="badgeNew">NEW</span>`;
  return html;
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
          <div class="model">${formatModelWithAutoBadge(r.model)}</div>
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
  ensureSmartModelStyles();
  setupImageModal();

  const tab = getParam("tab") || "Battery";

  if (el("crumb")) el("crumb").textContent = `Sheet › ${tab}`;
  if (el("pageTitle")) el("pageTitle").textContent = tab;

  setupPdfDownloadButton(tab);

  const meta = await loadMetaConfig();
  const categoryRecord = await loadCategoryByTab(tab);
  const categoryType = String(categoryRecord?.categoryType || "PRICE").trim().toUpperCase();

  if (categoryType === "VISUAL_CATALOG") {
    const all = await loadVisualCatalogSheet(tab);
    applyCategoryThumb(normalizeImageUrl(categoryRecord?.image || categoryRecord?.image_url || ""));
    const upd = all.find(r => r.updated)?.updated || "-";
    el("updateText") && (el("updateText").textContent = `อัปเดต: ${upd}`);
    const tabsRoot=el("tabs"); if(tabsRoot)tabsRoot.style.display="none";
    const search=el("search");
    if(search)search.placeholder="ค้นหา เช่น i17 / i17 Air / Black / Deep Blue / Aluminum";
    const applyVisual=()=>renderVisualCatalog(filterVisualCatalogRows(all,search?.value||""),search?.value||"");
    search?.addEventListener("input",applyVisual);
    renderVisualCatalog(all,"");
    return;
  }

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
      renderCompatibility(filterCompatibilityRows(all, search?.value || ""), search?.value || "");
    };
    search?.addEventListener("input", applyCompatibility);
    renderCompatibility(all, "");
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
