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

  // LINE floating
  const lineFab = $("lineFab");
  const qrBox = $("qrBox");
  if (lineFab) {
    lineFab.addEventListener("click", () => qrBox && qrBox.classList.toggle("show"));
  }

  // อ่าน query params
  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "ราคา";
  let pdfParam = params.get("pdf") || "";

  pageTitle.textContent = title;

  backBtn?.addEventListener("click", () => {
    // กลับไปหน้า index ในโฟลเดอร์เดียวกัน (GitHub Pages)
    const base = new URL(".", location.href); // .../price.html -> .../
    window.location.href = new URL("index.html", base).toString();
  });

  // Resolve path ให้ทำงานทั้ง:
  // - "pdf/battery.pdf" (จาก CMS)
  // - "/price-webapp/pdf/battery.pdf" (จากลิงก์เดิม)
  // - "https://..." (ไฟล์จากที่อื่น)
  function resolvePdfUrl(p) {
    if (!p) return "";
    // URL เต็ม
    if (/^https?:\/\//i.test(p)) return p;

    // ถ้าเป็น absolute (ขึ้นต้นด้วย /) ให้ใช้ตามนั้น (เหมาะกับ GitHub Pages: /price-webapp/...)
    if (p.startsWith("/")) return p;

    // ถ้าเป็น relative ให้ผูกกับ base path ของ repo (…/price-webapp/)
    const basePath = location.pathname.replace(/\/[^\/]*$/, "/"); // ตัดชื่อไฟล์ออก
    return basePath + p.replace(/^\.\//, "");
  }

  const pdfUrl = resolvePdfUrl(pdfParam);
  pdfPathBadge.textContent = `PDF: ${pdfUrl || "-"}`;

  openPdfBtn?.addEventListener("click", () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank");
  });

  // ---- pdf.js rendering ----
  let pdfDoc = null;
  let renderScale = 1;         // scale ที่ผู้ใช้ปรับ (zoom)
  let fitScale = 1;            // scale สำหรับ "พอดีจอ"
  let renderToken = 0;         // กัน render ซ้ำตอน resize/scroll
  let pagesMeta = [];          // เก็บ placeholder ของแต่ละหน้า

  const dpr = Math.min(window.devicePixelRatio || 1, 2); // จำกัด 2 เพื่อกันเครื่องช้า

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
    // ให้พอดีกว้างของ container (pdfHost)
    const hostWidth = pdfHost.clientWidth || viewer.clientWidth || window.innerWidth;
    const viewport = page.getViewport({ scale: 1 });
    const padding = 22; // กันขอบ
    return (hostWidth - padding) / viewport.width;
  }

  async function renderPageLazy(meta, token) {
    if (!pdfDoc || meta.rendered || meta.rendering) return;
    meta.rendering = true;

    try {
      const page = await pdfDoc.getPage(meta.pageNumber);
      if (token !== renderToken) return;

      // คิด scale ที่ใช้จริง = fitScale * renderScale
      const scale = fitScale * renderScale;
      const viewport = page.getViewport({ scale });

      // ขนาด canvas จริง (retina)
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
      // แสดง error บางหน้าไม่ render ก็ยังเลื่อนดูหน้าอื่นได้
    } finally {
      meta.rendering = false;
    }
  }

  function setupIntersectionObserver(token) {
    // Render เฉพาะหน้าที่เห็น/ใกล้เห็น (มือถือเร็วขึ้น)
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
      // GitHub Pages อาจ cache แรง: กันด้วย query v=
      const urlNoCache = pdfUrl + (pdfUrl.includes("?") ? "&" : "?") + "v=" + Date.now();

      const loadingTask = pdfjsLib.getDocument({
        url: urlNoCache,
        // ช่วยลดปัญหา CORS/Range บางเครื่อง
        disableRange: false,
        disableStream: false,
        // บางมือถือมีปัญหา font: ปล่อยค่า default
      });

      pdfDoc = await loadingTask.promise;
      if (token !== renderToken) return;

      setStatus(`ทั้งหมด ${pdfDoc.numPages} หน้า • กำลังเตรียมหน้าจอ...`);

      // สร้าง placeholder ของทุกหน้า
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

      // คำนวณ fitScale จากหน้าแรก
      const firstPage = await pdfDoc.getPage(1);
      if (token !== renderToken) return;
      fitScale = clamp(calcFitScale(firstPage), 0.6, 2.2);

      // เริ่ม render แบบ lazy
      const io = setupIntersectionObserver(token);

      // สั่ง render หน้าแรกทันที (ให้ “เห็นทันที” บนอุปกรณ์อื่น)
      await renderPageLazy(pagesMeta[0], token);

      if (token !== renderToken) return;
      setStatus("พร้อมใช้งาน");

      // Resize: คำนวณ fitScale ใหม่ แล้วรีเซ็ตหน้าที่ render ไปแล้วให้ render ใหม่ (กันเบลอ)
      let resizeTimer = null;
      const onResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(async () => {
          if (!pdfDoc) return;
          const t = ++renderToken; // invalidate render เก่า
          setStatus("ปรับขนาดหน้าจอ...");

          const p1 = await pdfDoc.getPage(1);
          fitScale = clamp(calcFitScale(p1), 0.6, 2.2);

          // reset ทุกหน้า (จะ render ใหม่แบบ lazy)
          pagesMeta.forEach((m) => (m.rendered = false));
          // render หน้าแรกก่อน
          await renderPageLazy(pagesMeta[0], t);
          setStatus("พร้อมใช้งาน");
        }, 250);
      };
      window.addEventListener("resize", onResize, { passive: true });

      // Zoom controls
      function rerenderAll() {
        const t = ++renderToken;
        setStatus("กำลังปรับซูม...");
        pagesMeta.forEach((m) => (m.rendered = false));
        // render หน้าแรกทันที แล้วที่เหลือจะ lazy เอง
        renderPageLazy(pagesMeta[0], t).then(() => setStatus("พร้อมใช้งาน"));
        updateZoomButtons();
      }

      zoomInBtn?.addEventListener("click", () => {
        renderScale = clamp(renderScale + 0.1, 0.6, 2.2);
        rerenderAll();
      });
      zoomOutBtn?.addEventListener("click", () => {
        renderScale = clamp(renderScale - 0.1, 0.6, 2.2);
        rerenderAll();
      });
      fitBtn?.addEventListener("click", () => {
        renderScale = 1;
        rerenderAll();
      });
      updateZoomButtons();
    } catch (e) {
      console.error(e);
      showError(e?.message || String(e), pdfUrl);
    }
  }

  document.addEventListener("DOMContentLoaded", loadPdf);
})();
