// price.js — PDF Viewer (pdf.js) สำหรับ LEEPLUS
// เป้าหมาย: ชัดระดับ Retina + โหลดเฉพาะหน้าที่เห็น (Lazy Loading) + ปิดปุ่ม LINE ง่าย

(function () {
  const $ = (id) => document.getElementById(id);

  const backBtn = $("backBtn");
  const openPdfBtn = $("openPdfBtn");
  const pageTitle = $("pageTitle");
  const pdfPathBadge = $("pdfPathBadge");
  const statusText = $("statusText");
  const pdfHost = $("pdfHost");
  const viewer = $("viewer");
  const zoomInBtn = $("zoomInBtn");
  const zoomOutBtn = $("zoomOutBtn");
  const fitBtn = $("fitBtn");

  /**
   * 1. การจัดการปุ่ม LINE Floating (ส่วนที่น้องยิ้มปรับแก้ให้ค่ะ)
   */
  const lineFab = $("lineFab");
  const qrBox = $("qrBox");
  if (lineFab && qrBox) {
    lineFab.addEventListener("click", (e) => {
      e.stopPropagation(); // กันบั๊กเหตุการณ์ซ้อนทับ
      qrBox.classList.toggle("show");
    });

    // เมื่อคลิกที่ส่วนอื่นๆ ของหน้าจอ ให้ปิดหน้าต่าง QR ทันที
    document.addEventListener("click", () => {
      qrBox.classList.remove("show");
    });
  }

  // อ่านค่าจาก URL
  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "ราคา";
  let pdfParam = params.get("pdf") || "";

  if (pageTitle) pageTitle.textContent = title;

  backBtn?.addEventListener("click", () => {
    const base = new URL(".", location.href);
    window.location.href = new URL("index.html", base).toString();
  });

  // Resolve path สำหรับ GitHub Pages
  function resolvePdfUrl(p) {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith("/")) return p;
    const basePath = location.pathname.replace(/\/[^\/]*$/, "/");
    return basePath + p.replace(/^\.\//, "");
  }

  const pdfUrl = resolvePdfUrl(pdfParam);
  if (pdfPathBadge) pdfPathBadge.textContent = `PDF: ${pdfUrl.split('/').pop() || "-"}`;

  openPdfBtn?.addEventListener("click", () => {
    if (pdfUrl) window.open(pdfUrl, "_blank");
  });

  /**
   * 2. ระบบ PDF Rendering (คมชัดและประหยัดทรัพยากร)
   */
  let pdfDoc = null;
  let renderScale = 1;         
  let fitScale = 1;            
  let renderToken = 0;         
  let pagesMeta = [];          
  const dpr = Math.min(window.devicePixelRatio || 1, 2); 

  function setStatus(msg) {
    if (statusText) statusText.textContent = msg;
  }

  function updateZoomButtons() {
    if (zoomOutBtn) zoomOutBtn.disabled = renderScale <= 0.6;
    if (zoomInBtn) zoomInBtn.disabled = renderScale >= 2.2;
  }

  async function renderPageLazy(meta, token) {
    if (!pdfDoc || meta.rendered || meta.rendering) return;
    meta.rendering = true;

    try {
      const page = await pdfDoc.getPage(meta.pageNumber);
      if (token !== renderToken) return;

      const scale = fitScale * renderScale;
      const viewport = page.getViewport({ scale });

      meta.canvas.width = Math.floor(viewport.width * dpr);
      meta.canvas.height = Math.floor(viewport.height * dpr);
      meta.canvas.style.width = Math.floor(viewport.width) + "px";
      meta.canvas.style.height = Math.floor(viewport.height) + "px";

      const ctx = meta.canvas.getContext("2d", { alpha: false });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      await page.render({ canvasContext: ctx, viewport }).promise;
      if (token !== renderToken) return;
      meta.rendered = true;
    } catch (e) {
      console.error(e);
    } finally {
      meta.rendering = false;
    }
  }

  function setupIntersectionObserver(token) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(it => {
        if (it.isIntersecting) {
          const meta = pagesMeta.find(m => m.wrapper === it.target);
          if (meta) renderPageLazy(meta, token);
        }
      });
    }, { rootMargin: "600px 0px" });
    pagesMeta.forEach(m => io.observe(m.wrapper));
  }

  async function loadPdf() {
    if (!window.pdfjsLib || !pdfUrl) return;
    const token = ++renderToken;
    setStatus("กำลังโหลดข้อมูล...");

    try {
      const urlNoCache = pdfUrl + (pdfUrl.includes("?") ? "&" : "?") + "v=" + Date.now();
      pdfDoc = await pdfjsLib.getDocument(urlNoCache).promise;
      if (token !== renderToken) return;

      setStatus(`ทั้งหมด ${pdfDoc.numPages} หน้า`);
      pdfHost.innerHTML = "";
      pagesMeta = [];

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const wrapper = document.createElement("div");
        const canvas = document.createElement("canvas");
        wrapper.appendChild(canvas);
        pdfHost.appendChild(wrapper);
        pagesMeta.push({ pageNumber: i, wrapper, canvas, rendered: false });
      }

      const firstPage = await pdfDoc.getPage(1);
      const hostWidth = pdfHost.clientWidth || window.innerWidth;
      fitScale = (hostWidth - 24) / firstPage.getViewport({ scale: 1 }).width;

      setupIntersectionObserver(token);
      await renderPageLazy(pagesMeta[0], token);
      updateZoomButtons();

    } catch (e) {
      setStatus("เกิดข้อผิดพลาดในการโหลด");
      console.error(e);
    }
  }

  // ระบบ Zoom
  zoomInBtn?.addEventListener("click", () => { renderScale += 0.2; loadPdf(); });
  zoomOutBtn?.addEventListener("click", () => { renderScale -= 0.2; loadPdf(); });
  fitBtn?.addEventListener("click", () => { renderScale = 1; loadPdf(); });

  document.addEventListener("DOMContentLoaded", loadPdf);
})();