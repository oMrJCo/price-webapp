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

  // ปรับปรุง LINE floating (ดึง Class 'show' มาใช้ตาม CSS ของพี่)
  const lineFab = $("lineFab");
  const qrBox = $("qrBox");
  if (lineFab) {
    lineFab.addEventListener("click", (e) => {
      e.stopPropagation();
      if (qrBox) qrBox.classList.toggle("show");
    });
  }
  document.addEventListener("click", (e) => {
    if (qrBox && qrBox.classList.contains("show")) {
      if (!qrBox.contains(e.target) && e.target !== lineFab) {
        qrBox.classList.remove("show");
      }
    }
  });

  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "ราคา";
  let pdfParam = params.get("pdf") || "";

  if(pageTitle) pageTitle.textContent = title;

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
  if(pdfPathBadge) pdfPathBadge.textContent = `PDF: ${pdfUrl || "-"}`;

  openPdfBtn?.addEventListener("click", () => {
    if (pdfUrl) window.open(pdfUrl, "_blank");
  });

  // ระบบ Rendering PDF (ลอจิกเดิมของพี่ทั้งหมด)
  let pdfDoc = null;
  let renderScale = 1;         
  let fitScale = 1;            
  let renderToken = 0;         
  let pagesMeta = [];          
  const dpr = Math.min(window.devicePixelRatio || 1, 2); 

  function setStatus(msg) { if (statusText) statusText.textContent = msg; }
  function clearHost() { pdfHost.innerHTML = ""; pagesMeta = []; }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function updateZoomButtons() {
    if(zoomOutBtn) zoomOutBtn.disabled = renderScale <= 0.6;
    if(zoomInBtn) zoomInBtn.disabled = renderScale >= 2.2;
  }

  function calcFitScale(page) {
    const hostWidth = pdfHost.clientWidth || viewer.clientWidth || window.innerWidth;
    const viewport = page.getViewport({ scale: 1 });
    return (hostWidth - 22) / viewport.width;
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
    } finally { meta.rendering = false; }
  }

  function setupIntersectionObserver(token) {
    const io = new IntersectionObserver((entries) => {
      for (const it of entries) {
        if (it.isIntersecting) {
          const meta = pagesMeta.find((m) => m.wrapper === it.target);
          if (meta) renderPageLazy(meta, token);
        }
      }
    }, { rootMargin: "600px 0px", threshold: 0.01 });
    pagesMeta.forEach((m) => io.observe(m.wrapper));
  }

  async function loadPdf() {
    if (!window.pdfjsLib || !pdfUrl) return;
    clearHost();
    setStatus("กำลังโหลดไฟล์ PDF...");
    const token = ++renderToken;
    try {
      const urlNoCache = pdfUrl + (pdfUrl.includes("?") ? "&" : "?") + "v=" + Date.now();
      pdfDoc = await pdfjsLib.getDocument(urlNoCache).promise;
      if (token !== renderToken) return;
      setStatus(`ทั้งหมด ${pdfDoc.numPages} หน้า`);
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const wrapper = document.createElement("div");
        const canvas = document.createElement("canvas");
        wrapper.appendChild(canvas);
        pdfHost.appendChild(wrapper);
        pagesMeta.push({ pageNumber: i, wrapper, canvas, rendered: false });
      }
      const firstPage = await pdfDoc.getPage(1);
      fitScale = clamp(calcFitScale(firstPage), 0.6, 2.2);
      setupIntersectionObserver(token);
      await renderPageLazy(pagesMeta[0], token);
      updateZoomButtons();
    } catch (e) { console.error(e); }
  }

  function rerenderAll() {
    const t = ++renderToken;
    pagesMeta.forEach((m) => (m.rendered = false));
    renderPageLazy(pagesMeta[0], t);
    updateZoomButtons();
  }

  zoomInBtn?.addEventListener("click", () => { renderScale = clamp(renderScale + 0.1, 0.6, 2.2); rerenderAll(); });
  zoomOutBtn?.addEventListener("click", () => { renderScale = clamp(renderScale - 0.1, 0.6, 2.2); rerenderAll(); });
  fitBtn?.addEventListener("click", () => { renderScale = 1; rerenderAll(); });

  document.addEventListener("DOMContentLoaded", loadPdf);
})();