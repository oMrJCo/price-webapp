/* =========================
   LEEPLUS Price Sheet POC (FINAL)
   - All tab (group by brand) + preserve sheet order
   - Search: flexible (iphone15 / iphone 15 / 15 pro / pro max / ip15)
   - Search ignores brand filter (search across all brands in this tab)
   - Tabs: render once, toggle active (fix: no double click needed)
   - Image popup modal
   - PDF button: auto show from categories.json (match tab) -> OPEN PDF (not forced download)
   ========================= */

const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";

// categories.json (for optional PDF button on price_sheet page)
const CATEGORIES_URL = "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";
const GH_BASE = "/price-webapp/";

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

    // match by sheetTab OR price_url contains ?tab=
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

    // ✅ UX: เปิดอ่าน PDF (แท็บใหม่) ไม่บังคับดาวน์โหลด
    btn.href = pdfUrl;
    btn.textContent = "เปิด PDF";
    btn.title = "เปิดไฟล์ PDF";
    btn.target = "_blank";
    btn.rel = "noopener";

    // ✅ สำคัญ: เอา download ออก (มือถือจะไม่เด้ง UI ดาวน์โหลดแบบน่าเกลียด)
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

    if (ch === '"' && inQuotes && next === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      row.push(cur);
      cur = "";
      continue;
    }
    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cur);
      cur = "";
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
  return String(s || "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function setupImageModal() {
  const modal = el("imgModal");
  const img = el("modalImg");
  const title = el("modalTitle");
  const close = el("modalClose");

  function hide() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    img.src = "";
  }
  function show(src, t) {
    title.textContent = t || "รูปสินค้า";
    img.src = src;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  close.addEventListener("click", hide);
  modal.addEventListener("click", (e) => {
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

async function loadSheet(tab) {
  const url = csvUrlForSheet(tab);
  const res = await fetch(`${url}&v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch CSV");
  const text = await res.text();

  const rows = parseCSV(text);
  if (!rows.length) return [];

  const header = rows[0].map(h => String(h || "").trim());
  const body = rows.slice(1);

  const out = body
    .filter(r => r.some(c => String(c || "").trim() !== ""))
    .map((r) => {
      const obj = {};
      for (let i = 0; i < header.length; i++) obj[header[i]] = r[i] ?? "";
      return {
        brand: obj.brand || "",
        model: obj.model || "",
        price: obj.price || "",
        image_url: obj.image_url || "",
        updated: obj.updated || "",
      };
    });

  return out;
}

function renderTabs(brands, activeKey, onSelect) {
  const root = el("tabs");
  root.innerHTML = "";

  for (const b of brands) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill";
    btn.textContent = b.label;
    btn.dataset.key = b.key;
    if (b.key === activeKey) btn.classList.add("active");

    btn.addEventListener("click", () => {
      root.querySelectorAll(".pill").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      onSelect(b.key);
    });

    root.appendChild(btn);
  }
}

function renderTable(rows) {
  const tbody = el("tbody");
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
      const tr = document.createElement("tr");
      tr.className = "brandHeaderRow";
      tr.innerHTML = `
        <td colspan="2">
          <span class="brandHeader"><span class="dot"></span>${escapeHTML(r.brand)}</span>
        </td>
      `;
      tbody.appendChild(tr);
      continue;
    }

    const img = normalizeImageUrl(r.image_url);
    const thumbHtml = img
      ? `<div class="thumb" tabindex="0" role="button" aria-label="ดูรูป ${escapeHTML(r.model)}"
              data-full="${escapeHTML(img)}" data-title="${escapeHTML(r.model)}">
            <img src="${escapeHTML(img)}" alt="${escapeHTML(r.model)}" loading="lazy" />
         </div>`
      : `<div class="thumb" style="cursor:default; opacity:.35"></div>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:flex-start; gap:10px;">
          ${thumbHtml}
          <div>
            <div class="model">${escapeHTML(r.model)}</div>
            <div class="sub">
              <span class="tag">${escapeHTML(r.brand || "")}</span>
            </div>
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
  el("crumb").textContent = `Sheet › ${tab}`;
  el("pageTitle").textContent = tab;

  // PDF action button (auto show if this tab has PDF attached in categories.json)
  setupPdfDownloadButton(tab);

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

      renderTable(rows);
      return;
    }

    if (activeBrand !== ALL_BRAND_KEY) {
      rows = all.filter(r => (r.brand || "").trim() === activeBrand);
      renderTable(rows);
    } else {
      renderTable(groupByBrandPreserveSheetOrder(rows));
    }
  }

  renderTabs(brands, activeBrand, (b) => {
    activeBrand = b;
    apply();
  });

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
