// ========= Helpers =========
function getParam(name, fallback = "") {
  const params = new URLSearchParams(location.search);
  return params.get(name) || fallback;
}

// ========= Read params from index.html =========
const pdfPathRaw = getParam("pdf", "");
const title = getParam("title", "ราคาสินค้า");

const pageTitleEl = document.getElementById("pageTitle");
const statusEl = document.getElementById("status");
const viewerEl = document.getElementById("viewer");

const qEl = document.getElementById("q");
const findBtn = document.getElementById("findBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const openBtn = document.getElementById("openBtn");

const resultsBox = document.getElementById("resultsBox");
const resultsSummary = document.getElementById("resultsSummary");
const resultsQuery = document.getElementById("resultsQuery");
const resultList = document.getElementById("resultList");

pageTitleEl.textContent = title;

// ถ้าเข้าหน้าโดยไม่มี pdf param ให้แจ้งชัด ๆ
if (!pdfPathRaw) {
  statusEl.textContent = "ไม่พบไฟล์ PDF (กลับไปเลือกหมวดใหม่)";
  downloadBtn.href = "#";
  openBtn.href = "#";
}

// ตั้งปุ่มลิงก์
downloadBtn.href = pdfPathRaw || "#";
openBtn.href = pdfPathRaw || "#";

// ========= PDF.js setup =========
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

// กันแคชเวลาอัปเดตไฟล์ pdf
const pdfUrl = pdfPathRaw
  ? pdfPathRaw + (pdfPathRaw.includes("?") ? "&" : "?") + "v=" + Date.now()
  : "";

// เก็บข้อมูลหน้าไว้สำหรับกระโดดไปหน้า
let pageBoxes = [];      // [HTMLElement]
let pageTexts = [];      // [string]
let pdfRef = null;

function hideResults() {
  resultsBox.style.display = "none";
  resultList.innerHTML = "";
}

function showResults(query, pages) {
  resultsBox.style.display = "block";
  resultsQuery.textContent = `คำค้นหา: ${query}`;
  resultsSummary.textContent = pages.length
    ? `พบ ${pages.length} หน้า`
    : "ไม่พบผลลัพธ์";

  resultList.innerHTML = "";

  if (!pages.length) return;

  // ทำปุ่มเป็นหน้า (Page 1, 2, 3...) ให้กดกระโดดไปหน้าได้
  pages.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "resultBtn";
    btn.textContent = `หน้า ${p}`;
    btn.addEventListener("click", () => {
      const box = pageBoxes[p - 1];
      if (box) box.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    resultList.appendChild(btn);
  });
}

async function renderAllPages(pdf) {
  viewerEl.innerHTML = "";
  pageBoxes = [];
  pageTexts = [];
  pdfRef = pdf;

  const wrapWidth = Math.min(1100, viewerEl.clientWidth || window.innerWidth) - 24;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    statusEl.textContent = `กำลังโหลดหน้า ${pageNum}/${pdf.numPages}…`;

    const page = await pdf.getPage(pageNum);

    const viewport1 = page.getViewport({ scale: 1 });
    const scale = wrapWidth / viewport1.width;
    const viewport = page.getViewport({ scale });

    const pageBox = document.createElement("div");
    pageBox.className = "page";

    const inner = document.createElement("div");
    inner.className = "pageInner";
    inner.style.width = Math.floor(viewport.width) + "px";
    inner.style.height = Math.floor(viewport.height) + "px";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    inner.appendChild(canvas);
    pageBox.appendChild(inner);
    viewerEl.appendChild(pageBox);

    // Render ภาพ PDF (สวย/นิ่ง ไม่มีตัวซ้อน)
    await page.render({ canvasContext: ctx, viewport }).promise;

    // ดึงข้อความของหน้านี้ไว้สำหรับค้นหา (ไม่ต้องแสดง)
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(it => it.str).join(" ").toLowerCase();

    pageBoxes.push(pageBox);
    pageTexts.push(pageText);
  }

  statusEl.textContent = "โหลดเสร็จแล้ว (ค้นหาได้เลย)";
}

async function loadPdf() {
  if (!pdfUrl) return;

  try {
    statusEl.textContent = "กำลังโหลดไฟล์ PDF…";
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    await renderAllPages(pdf);
    hideResults();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "โหลด PDF ไม่สำเร็จ (เช็กชื่อไฟล์/ตำแหน่งไฟล์)";
  }
}

function doSearch() {
  const queryRaw = (qEl.value || "").trim();
  const query = queryRaw.toLowerCase();

  if (!query) {
    statusEl.textContent = "พิมพ์คำค้นหาได้เลย";
    hideResults();
    return;
  }

  // ค้นหาแบบง่าย/เร็ว: เช็กว่าหน้าไหนมีคำค้น (case-insensitive)
  const matchedPages = [];
  for (let i = 0; i < pageTexts.length; i++) {
    if (pageTexts[i].includes(query)) matchedPages.push(i + 1);
  }

  if (!matchedPages.length) {
    statusEl.textContent = `ไม่พบคำว่า “${queryRaw}”`;
    showResults(queryRaw, []);
    return;
  }

  statusEl.textContent = `พบใน ${matchedPages.length} หน้า`;
  showResults(queryRaw, matchedPages);

  // กระโดดไปหน้าที่เจอครั้งแรก
  const firstBox = pageBoxes[matchedPages[0] - 1];
  if (firstBox) firstBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearSearch() {
  qEl.value = "";
  hideResults();
  statusEl.textContent = "พร้อมค้นหา";
}

// Events
findBtn.addEventListener("click", doSearch);
clearBtn.addEventListener("click", clearSearch);
qEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doSearch();
});

// Start
loadPdf();
