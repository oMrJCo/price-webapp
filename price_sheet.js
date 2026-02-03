/* =========================
   LEEPLUS Price Sheet POC (FINAL)
   - Data source: Google Sheet (GViz JSON) ✅ (เลิกใช้ CSV)
   - Meta rows in sheet:
     1) brand="__META__", model="__CATEGORY_IMAGE__"  => image_url = category image
     2) model="__BRAND_IMAGE__" (brand = brand name)  => image_url = brand image
   - Features: Tabs (brand + All), All grouped by brand, preserve sheet order,
               search across brands, modal image, PDF button from categories.json
   ========================= */

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

/* ===== Search helpers ===== */
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

/* ===== Modal ===== */
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

/* ===== Meta matching (หลวม) ===== */
function metaNorm(s) {
  return String(s || "")
    .replace(/\u00A0/g, " ")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/_+/g, "_");
}
function metaNormLoose(s) { return metaNorm(s).replaceAll("_", ""); }
function isMetaBrand(brand) { return metaNormLoose(brand) === "META"; }
function isCategoryImageModel(model) { return metaNormLoose(model) === "CATEGORYIMAGE"; }
function isBrandImageModel(model) { return metaNormLoose(model) === "BRANDIMAGE"; }

/* =========================
   ✅ GViz JSON loader (แทน CSV)
   ========================= */
function gvizJsonUrl(sheetName) {
  // tqx=out:json จะได้ response แบบ: google.visualization.Query.setResponse({...});
  const base = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
  const params = new URLSearchParams({ tqx: "out:json", sheet: sheetName });
  return `${base}?${params.toString()}`;
}

function parseGvizResponse(text) {
  // ตัด wrapper "google.visualization.Query.setResponse(" ... ");"
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0 || end <= start) throw new Error("Invalid GViz response");
  return JSON.parse(text.slice(start, end + 1));
}

function colLabel(c) {
  // บางที label ว่าง จะมี id แทน
  return String(c.label || c.id || "").trim();
}

function cellValue(v) {
  if (!v) return "";
  // gviz cell object: {v:..., f:...}
  if (typeof v.f === "string" && v.f.trim() !== "") return v.f;
  if (v.v == null) return "";
  return String(v.v);
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

  const labels = cols.map(colLabel).map(s => s.toLowerCase());
  const idx = {
    brand: labels.indexOf("brand"),
    model: labels.indexOf("model"),
    price: labels.indexOf("price"),
    image_url: labels.indexOf("image_url"),
    updated: labels.indexOf("updated"),
  };

  // fallback ถ้า label หาย
  const anyMissing = Object.values(idx).some(v => v === -1);
  if (anyMissing) {
    idx.brand = 0; idx.model = 1; idx.price = 2; idx.image_url = 3; idx.updated = 4;
  }

  if (DEBUG) {
    console.log("[DEBUG] gviz cols:", cols.map(c => ({ label: c.label, id: c.id, type: c.type })));
    console.log("[DEBUG] idx:", idx);
  }

  const raw = rows.map(r => {
    const c = Array.isArray(r.c) ? r.c : [];
    return {
      brand: cellValue(c[idx.brand]).trim(),
      model: cellValue(c[idx.model]).trim(),
      price: cellValue(c[idx.price]).trim(),
      image_url: cellValue(c[idx.image_url]).trim(),
      updated: cellValue(c[idx.updated]).trim(),
    };
  }).filter(r => (r.brand || r.model || r.price || r.image_url || r.updated).trim?.() !== "" || true);

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

/* ===== Render ===== */
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
      tr.innerHTML = `<td colspan="2"><span class="brandHeader">${icon}${escapeHTML(b)}</span></td>`;
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
        <div style="display:flex; align-items:flex-start; gap:10px;">
          ${thumbHtml}
          <div><div class="model">${escapeHTML(r.model)}</div></div>
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
  el("crumb") && (el("crumb").textContent = `Sheet › ${tab}`);
  el("pageTitle") && (el("pageTitle").textContent = tab);

  setupPdfDownloadButton(tab);

  const { rows: all, categoryImageUrl, brandImageMap } = await loadSheetWithMeta(tab);

  // รูปหมวด
  if (el("catThumb") && el("catThumbImg")) {
    if (categoryImageUrl) {
      const imgEl = el("catThumbImg");
      imgEl.onload = () => { el("catThumb").style.display = "block"; };
      imgEl.onerror = () => { el("catThumb").style.display = "none"; };
      imgEl.src = categoryImageUrl;
      el("catThumb").style.display = "block";
    } else {
      el("catThumb").style.display = "none";
    }
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
})().catch(err => {
  console.error(err);
  if (el("tbody")) el("tbody").innerHTML = "";
  if (el("empty")) {
    el("empty").style.display = "block";
    el("empty").textContent = "โหลดข้อมูลไม่สำเร็จ (เช็ก public / ชื่อแท็บ / SPREADSHEET_ID)";
  }
});
