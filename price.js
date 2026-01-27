// price.js — PDF Viewer (pdf.js) สำหรับ GitHub Pages
// เป้าหมาย: เปิดแล้ว “เห็นทันที” บนมือถือ + ชัด (retina) + ไม่ reload วน

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

  // ---- [จุดที่น้องยิ้มแก้ไข 1/2]: ปรับปรุง LINE floating ให้ปิดง่ายขึ้น ----
  const lineFab = $("lineFab");
  const qrBox = $("qrBox");
  if (lineFab) {
    lineFab.addEventListener("click", (e) => {
      e.stopPropagation(); // กันไม่ให้เหตุการณ์วิ่งไปที่ document
      if (qrBox) qrBox.classList.toggle("show");
    });
  }

  // เพิ่มส่วนแก้ไข: คลิกที่ว่างให้ปิด QR ทันที
  document.addEventListener("click", (e) => {
    if (qrBox && qrBox.classList.contains("show")) {
      if (!qrBox.contains(e.target) && e.target !== lineFab) {
        qrBox.classList.remove("show");
      }
    }
  });

  // อ่าน query params (รักษาชื่อตัวแปร 'pdf' ตามที่พี่วงสีแดงไว้)
  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "ราคา";
  let pdfParam = params.get("pdf") || "";

  pageTitle.textContent = title;

  backBtn?.addEventListener("click", () => {
    const base = new URL(".", location.href); 
    window.location.href = new URL("index.html", base).toString();
  });

  // Resolve path ให้ทำงานบน GitHub Pages
  function resolvePdfUrl(p) {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith("/")) return p;
    const basePath = location.pathname.replace(/\/[^\/]*$/, "/");
    return basePath + p.replace(/^\.\//, "");
  }

  const pdfUrl = resolvePdfUrl(pdfParam);
  pdfPathBadge.textContent = `PDF: ${pdfUrl || "-"}`;

  openPdfBtn?.addEventListener("click", () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank");
  });

  // ---- [ต้นฉบับพี่]: pdf.js rendering (Retina + Lazy Load) ----
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
    zoomOutBtn.disabled = renderScale <= 0.6;
    zoomInBtn.disabled = renderScale >= 2.2;
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

  function showError(msg, directUrl) {
    setStatus("แสดงผลไม่สำเร็จ");
    clearHost();
    pdfHost.innerHTML = `
      <div class="err">
        <div style="font-weight:900;font-size:18px;margin-bottom:10px">เปิด PDF ไม่ได้</div>
        <div style="opacity:.85">${msg || "ไม่ทราบสาเหตุ"}</div>
        ${directUrl ? `<div style="margin-top:14px"><a href="${directUrl}" target="_blank" rel="noreferrer">ลิงก์: กดเปิด PDF โดยตรง</a></div>` : ""}
      </div>
    `;
  }

  async function loadPdf() {
    if (!window.pdfjsLib) {
      showError("โหลด pdf.js ไม่สำเร็จ (CDN)", pdfUrl);
      return;
    }
    if (!pdfUrl) {
      showError("ไม่มีพาธ PDF ในลิงก์", "");
      return;
    }

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

      // [ต้นฉบับพี่]: Resize handling
      let resizeTimer = null;
      window.addEventListener("resize", () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(async () => {
          if (!pdfDoc) return;
          const t = ++renderToken;
          setStatus("ปรับขนาดหน้าจอ...");
          const p1 = await pdfDoc.getPage(1);
          fitScale = clamp(calcFitScale(p1), 0.6, 2.2);
          pagesMeta.forEach((m) => (m.rendered = false));
          await renderPageLazy(pagesMeta[0], t);
          setStatus("พร้อมใช้งาน");
        }, 250);
      }, { passive: true });

    } catch (e) {
      console.error(e);
      showError(e?.message || String(e), pdfUrl);
    }
  }

  // [ต้นฉบับพี่]: Zoom controls
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