const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";

// ใช้คีย์พิเศษสำหรับแท็บ All
const ALL_BRAND_KEY = "__ALL__";
const ALL_BRAND_LABEL = "All";

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

/**
 * ทำข้อความให้เหมาะกับการค้นหาแบบ "ไม่ติดช่องว่าง/สัญลักษณ์"
 * + alias: ip -> iphone (ip15 => iphone15)
 */
function normalizeSearchCompact(s) {
  const str = String(s || "").toLowerCase();

  let compact;
  try {
    compact = str.replace(/[^\p{L}\p{N}]+/gu, "");
  } catch {
    compact = str.replace(/[\s\-_.()\/\\]+/g, "");
  }

  // alias: ip15 -> iphone15
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

/**
 * brands = [{ key, label }]
 */
function renderTabs(brands, activeKey, onClick) {
  const tabs = el("tabs");
  tabs.innerHTML = brands.map(b => `
    <button class="tab ${b.key === activeKey ? "active" : ""}" data-brand="${escapeHTML(b.key)}">
      ${escapeHTML(b.label)}
    </button>
  `).join("");

  tabs.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => onClick(btn.dataset.brand));
  });
}

/**
 * ✅ โหมด All: จัดกลุ่มตาม brand แต่ "คงลำดับแถวใน sheet" ภายในแต่ละ brand
 * - แบรนด์จะเรียงตาม "ลำดับที่เจอครั้งแรก" ในชีต
 * - ภายในแบรนด์: เรียงตามแถวเดิมในชีต (ไม่มี sort)
 */
function groupByBrandPreserveSheetOrder(rows) {
  const groups = new Map(); // brand -> array
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
    // ใส่แถวหัวกลุ่ม
    out.push({ __type: "brandHeader", brand: b });
    // ตามด้วยรายการในแบรนด์นั้น (ลำดับเดิม)
    out.push(...groups.get(b));
  }
  return out;
}

function renderTable(rows) {
  const tbody = el("tbody");
  const empty = el("empty");

  tbody.innerHTML = rows.map(r => {
    // ✅ แถวหัวกลุ่มแบรนด์ (เฉพาะโหมด All)
    if (r && r.__type === "brandHeader") {
      return `
        <tr>
          <td colspan="2" style="
            padding:10px 12px;
            color: rgba(255,255,255,.70);
            font-weight: 800;
            letter-spacing: .2px;
            background: rgba(255,255,255,.04);
            border-bottom: 1px solid rgba(255,255,255,.06);
          ">
            ${escapeHTML(r.brand || "")}
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

  // ถ้าหลัง filter แล้วเหลือแต่ header (กรณีผิดพลาด) ให้ถือว่าว่าง
  const hasRealRows = rows.some(r => !(r && r.__type === "brandHeader"));
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

  document.addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return;
    const src = thumb.getAttribute("data-img") || "";
    const title = thumb.getAttribute("data-title") || "รูปสินค้า";
    if (!src) return;
    openModal(src, title);
  });

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

  // ✅ สร้างรายการแท็บแบรนด์ + เพิ่ม All ไว้หน้าแรก
  const brandNames = uniq(all.map(r => (r.brand || "").trim())).filter(Boolean);
  const brands = [
    { key: ALL_BRAND_KEY, label: ALL_BRAND_LABEL },
    ...brandNames.map(b => ({ key: b, label: b }))
  ];

  // เริ่มต้นให้เป็น All (ใช้งานสะดวกสุด)
  let activeBrand = ALL_BRAND_KEY;
  let query = "";

  function apply() {
    let rows = all;

    // ✅ ถ้า "ไม่ค้นหา" และไม่ได้เลือก All -> กรองตามแบรนด์ (คงลำดับ sheet)
    if (!query && activeBrand && activeBrand !== ALL_BRAND_KEY) {
      rows = rows.filter(r => (r.brand || "").trim() === activeBrand);
      renderTable(rows);
      return;
    }

    // ✅ ถ้า "ไม่ค้นหา" และเลือก All -> จัดกลุ่มตามแบรนด์ แต่คงลำดับ sheet
    if (!query && activeBrand === ALL_BRAND_KEY) {
      const grouped = groupByBrandPreserveSheetOrder(rows);
      renderTable(grouped);
      return;
    }

    // ✅ ถ้า "ค้นหา" -> ค้นทั้งหมวด (ข้ามแบรนด์) และไม่จัดกลุ่ม (คงลำดับ sheet)
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

      renderTable(rows);
      return;
    }

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
