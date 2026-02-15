/* GVIZ_JSON_VERSION: 2026-02-03g (LEEPLUS) ✅
   - NEW badge: replace "(NEW)" with small badge <span class="badgeNew">NEW</span>
   - Keep all existing logic: tabs, all grouping, search, pdf button, meta images
*/

const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";
const CATEGORIES_URL = "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";
const GH_BASE = "/price-webapp/";

const ALL_BRAND_KEY = "__ALL__";
const ALL_BRAND_LABEL = "All";

function el(id) { return document.getElementById(id); }
function getParam(name) { return new URL(window.location.href).searchParams.get(name) || ""; }
const DEBUG = getParam("debug") === "1";

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
function isHttpUrl(url) { return typeof url === "string" && /^https?:\/\//i.test(url.trim()); }

function normalizeImageUrl(url) {
  const s = (url || "").trim();
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

async function setupPdfDownloadButton(tabName) {
  const btn = el("openPdfBtn");
  const hint = el("pdfHint");
  if (!btn) return;
  btn.style.display = "none";
  if (hint) hint.style.display = "none";

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
    if (hint) hint.style.display = "inline-flex";
  } catch (e) {
    console.warn("setupPdfDownloadButton failed:", e);
  }
}

/* ===== helpers ===== */
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

/* ✅ NEW badge: turn "(NEW)" into a small badge NEW (case-insensitive) */
function formatModelHTML(model) {
  const raw = String(model || "");

  // Detect NEW in multiple formats:
  // (NEW)  |  NEW  |  NEW! / NEW!! / NEW!!!
  // and remove the token from the displayed model text.
  let isNew = false;
  let cleaned = raw.replace(/\(\s*NEW\s*\)|\bNEW\b\s*!*/gi, (m) => {
    isNew = true;
    return "";
  });

  // Clean leftover whitespace
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

/* ===== META ===== */
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
  candidates.sort((a,b) => (a.length + (a.match(/\s/g)?.length||0)*5) - (b.length + (b.match(/\s/g)?.length||0)*5));
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
  if (start < 0 || end < 0 || end <= start) throw new Error("Invalid GViz response");
  return JSON.parse(text.slice(start, end + 1));
}
function colLabel(c) { return String(c.label || c.id || "").trim(); }
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
    image_url: pickIndex(cols, ["image_url", "image url", "imageurl", "img", "imgurl"]),
    updated: pickIndex(cols, ["updated", "update", "lastupdate", "last updated"]),
  };
  if (Object.values(idx).some(v => v === -1)) idx = { brand: 0, model: 1, price: 2, image_url: 3, updated: 4 };

  const raw = rows.map(r => {
    const c = Array.isArray(r.c) ? r.c : [];
    const allValues = c.map(cellValue).map(s => String(s || "").trim());
    return {
      brand: String(cellValue(c[idx.brand]) || "").trim(),
      model: String(cellValue(c[idx.model]) || "").trim(),
      price: String(cellValue(c[idx.price]) || "").trim(),
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
    const hasBRAND = rowKeys.includes("BRANDIMAGE") || metaKey(r.model) === "BRANDIMAGE" || metaKey(r.brand) === "BRANDIMAGE";

    const url = normalizeImageUrl(r.image_url) || extractFirstUrlFromRow(r.__all);

    if (!categoryImageUrl && hasMETA && hasCATEGORY && url) categoryImageUrl = url;

    if (hasBRAND && url) {
      const b = (metaKey(r.brand) !== "BRANDIMAGE" && metaKey(r.brand) !== "META" && r.brand) ? r.brand : pickBrandNameFromRow(r.__all);
      if (b) brandImageMap.set(b, url);
    }
  }

  const products = raw.filter(r => {
    const rowKeys = r.__all.map(metaKey);
    const hasMETA = rowKeys.includes("META") || metaKey(r.brand) === "META";
    const hasCATEGORY = rowKeys.includes("CATEGORYIMAGE") || metaKey(r.model) === "CATEGORYIMAGE";
    const hasBRAND = rowKeys.includes("BRANDIMAGE") || metaKey(r.model) === "BRANDIMAGE" || metaKey(r.brand) === "BRANDIMAGE";
    return !((hasMETA && hasCATEGORY) || hasBRAND);
  }).map(({ __all, ...rest }) => rest);

  if (DEBUG) {
    console.log("[DEBUG] GVIZ_JSON_VERSION:", "2026-02-03g");
    console.log("[DEBUG] idx:", idx);
    console.log("[DEBUG] categoryImageUrl:", categoryImageUrl);
    console.log("[DEBUG] brandImageMap:", Array.from(brandImageMap.entries()));
  }

  return { rows: products, categoryImageUrl, brandImageMap };
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
    if (el("empty")) { el("empty").style.display = "block"; el("empty").textContent = "ไม่พบข้อมูล"; }
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
      : ``;

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
  el("crumb") && (el("crumb").textContent = `Sheet › ${tab}`);
  el("pageTitle") && (el("pageTitle").textContent = tab);

  setupPdfDownloadButton(tab);

  const { rows: all, categoryImageUrl, brandImageMap } = await loadSheetWithMeta(tab);
  applyCategoryThumb(categoryImageUrl);

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
})().catch(err => {
  console.error(err);
  if (el("empty")) { el("empty").style.display = "block"; el("empty").textContent = "โหลดข้อมูลไม่สำเร็จ"; }
});
