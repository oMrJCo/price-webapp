// price.js — PDF Viewer (pdf.js) สำหรับ LEEPLUS
// ต้นฉบับ: เน้น Retina + Lazy Loading (พี่วางโครงไว้ดีมาก)
// ส่วนแก้ไข: เติมระบบปิด QR Box เมื่อคลิกที่ว่าง (น้องยิ้มเพิ่มเติมให้ค่ะ)

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
   * 1. ส่วนแก้ไข: LINE floating (รวมร่างใหม่ ไม่รื้อโครงเดิม)
   */
  const lineFab = $("lineFab");
  const qrBox = $("qrBox");
  if (lineFab) {
    lineFab.addEventListener("click", (e) => {
      e.stopPropagation(); // กันเหตุการณ์ส่งต่อไปยัง document
      if (qrBox) qrBox.classList.toggle("show");
    });
  }

  // เติมส่วนแก้ไข: คลิกที่ว่างให้ปิด QR
  document.addEventListener("click", (e) => {
    if (qrBox && qrBox.classList.contains("show")) {
      // ถ้าจุดที่คลิกไม่ใช่ตัว QR Box และไม่ใช่ปุ่มเขียว ให้ปิดทันที
      if (!qrBox.contains(e.target) && e.target !== lineFab) {
        qrBox.classList.remove("show");
      }
    }
  });

  /**
   * 2. ต้นฉบับ: การดึงค่าและจัดการ Path (คงไว้ตามที่พี่วงสีแดงว่าสำคัญ)
   */
  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "ราคา";
  let pdfParam = params.get("pdf") || ""; // ต้องใช้ชื่อ 'pdf' ตามที่หน้าแรกส่งมา

  if (pageTitle) pageTitle.textContent = title;

  backBtn?.addEventListener("click", () => {
    const base = new URL(".", location.href);
    window.location.href = new URL("index.html", base).toString();
  });

  function resolvePdfUrl(p) {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith("/")) return p;
    const basePath = location.pathname.replace(/\/[^\/]*$/, "/");
    return basePath + p.replace(/^\.\//, "");
  }

  const pdfUrl = resolvePdfUrl(pdfParam);
  if (pdfPathBadge) pdfPathBadge.textContent = `PDF: ${pdfUrl || "-"}`;

  openPdfBtn?.addEventListener("click", () => {
    if (pdfUrl) window.open(pdfUrl, "_blank");
  });

  /**
   * 3. ต้นฉบับ: ระบบแสดงผล PDF (Retina + Intersection Observer)
   * ส่วนนี้คือโครงสร้างหลักที่พี่ทำไว้ น้องยิ้มไม่แตะต้องเลยค่ะ
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

  function clearHost() {
    pdfHost.innerHTML = "";
    pagesMeta = [];
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function updateZoomButtons() {
    if (zoomOutBtn) zoomOutBtn.disabled = renderScale <= 0.6;
    if (zoomInBtn) zoomInBtn.disabled = renderScale >= 2.2;
  }

  function calcFitScale(page) {
    const hostWidth = pdfHost.clientWidth || viewer.clientWidth || window.innerWidth;
    const viewport = page.getViewport({ scale: 1 });
    const padding = 22; 
    return (hostWidth - padding) / viewport.width;
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

      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
      });

      await renderTask.promise;
      if (token !== renderToken) return;

      meta.rendered = true;
    } catch (e) {
      console.error(e);
    } finally {
      meta.rendering = false;
    }
  }

  function setupIntersectionObserver(token) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const it of entries) {
          if (it.isIntersecting) {
            const meta = pagesMeta.find((m) => m.wrapper === it.target);
            if (meta) renderPageLazy(meta, token);
          }
        }
      },
      { root: null, rootMargin: "600px 0px", threshold: 0.01 }
    );

    pagesMeta.forEach((m) => io.observe(m.wrapper));
    return io;
  }

  async function loadPdf() {
    if (!window.pdfjsLib || !pdfUrl) return;

    clearHost();
    setStatus("กำลังโหลดไฟล์ PDF...");
    const token = ++renderToken;

    try {
      const urlNoCache = pdfUrl + (pdfUrl.includes("?") ? "&" : "?") + "v=" + Date.now();
      const loadingTask = pdfjsLib.getDocument({
        url: urlNoCache,
        disableRange: false,
        disableStream: false,
      });

      pdfDoc = await loadingTask.promise;
      if (token !== renderToken) return;

      setStatus(`ทั้งหมด ${pdfDoc.numPages} หน้า • พร้อมใช้งาน`);

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const wrapper = document.createElement("div");
        const canvas = document.createElement("canvas");
        wrapper.appendChild(canvas);
        pdfHost.appendChild(wrapper);
        pagesMeta.push({
          pageNumber: i,
          wrapper,
          canvas,
          rendered: false,
          rendering: false,
        });
      }

      const firstPage = await pdfDoc.getPage(1);
      if (token !== renderToken) return;
      fitScale = clamp(calcFitScale(firstPage), 0.6, 2.2);

      setupIntersectionObserver(token);
      await renderPageLazy(pagesMeta[0], token);
      updateZoomButtons();

    } catch (e) {
      console.error(e);
    }
  }

  // Zoom controls
  function rerenderAll() {
    const t = ++renderToken;
    setStatus("กำลังปรับซูม...");
    pagesMeta.forEach((m) => (m.rendered = false));
    renderPageLazy(pagesMeta[0], t).then(() => setStatus("พร้อมใช้งาน"));
    updateZoomButtons();
  }

  zoomInBtn?.addEventListener("click", () => { renderScale = clamp(renderScale + 0.1, 0.6, 2.2); rerenderAll(); });
  zoomOutBtn?.addEventListener("click", () => { renderScale = clamp(renderScale - 0.1, 0.6, 2.2); rerenderAll(); });
  fitBtn?.addEventListener("click", () => { renderScale = 1; rerenderAll(); });

  document.addEventListener("DOMContentLoaded", loadPdf);
})();