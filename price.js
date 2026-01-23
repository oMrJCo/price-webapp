// price.js — PDF viewer (pdf.js) for GitHub Pages / Mobile retina
(function () {
  const $ = (id) => document.getElementById(id);

  const backBtn = $("backBtn");
  const openPdfBtn = $("openPdfBtn");
  const pageTitle = $("pageTitle");
  const pdfPathText = $("pdfPathText");
  const statusText = $("statusText");
  const pdfHost = $("pdfHost");
  const fallbackMsg = $("fallbackMsg");

  // ------- helpers -------
  function getParam(name) {
    const u = new URL(location.href);
    return u.searchParams.get(name) || "";
  }

  function safeDecode(s) {
    try { return decodeURIComponent(s); } catch { return s; }
  }

  function resolveUrl(path) {
    // รองรับ:
    // - https://...
    // - /price-webapp/pdf/battery.pdf  (เหมาะกับ GitHub Pages)
    // - pdf/battery.pdf               (เหมาะกับ local)
    try {
      return new URL(path, location.href).toString();
    } catch {
      return path;
    }
  }

  function setStatus(text) {
    statusText.textContent = text;
  }

  function showFallback(html) {
    fallbackMsg.style.display = "block";
    fallbackMsg.innerHTML = html;
  }

  // ------- init title + buttons -------
  const titleParam = getParam("title");
  const pdfParam = getParam("pdf");

  const titleText = titleParam ? safeDecode(titleParam) : "รายการราคา";
  const pdfPath = pdfParam ? safeDecode(pdfParam) : "";

  pageTitle.textContent = titleText;
  pdfPathText.textContent = pdfPath || "-";

  backBtn.addEventListener("click", () => {
    // กลับหน้า index (อยู่ repo เดียวกัน)
    location.href = "index.html";
  });

  openPdfBtn.addEventListener("click", () => {
    if (!pdfPath) return;
    window.open(resolveUrl(pdfPath), "_blank", "noopener");
  });

  // ------- render with PDF.js -------
  async function waitPdfjs() {
    // รอให้ pdfjsLib โหลดจาก CDN
    const t0 = Date.now();
    while (!window.pdfjsLib) {
      await new Promise((r) => setTimeout(r, 50));
      if (Date.now() - t0 > 8000) throw new Error("pdfjsLib โหลดไม่สำเร็จ");
    }
    return window.pdfjsLib;
  }

  // กัน “รีโหลดซ้ำ” บนมือถือ: ไม่ re-render ทุกครั้งที่ resize
  let resizeTimer = null;
  function onStableResize(cb) {
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(cb, 350);
    });
  }

  function clearPages() {
    // ลบเฉพาะ .page เพื่อไม่ลบ fallback
    [...pdfHost.querySelectorAll(".page")].forEach((n) => n.remove());
  }

  function getContainerWidth() {
    // เวลามือถือ landscape / บางเบราว์เซอร์ width เพี้ยน ให้ยึดจาก panel จริง
    const rect = pdfHost.getBoundingClientRect();
    return Math.max(320, rect.width || window.innerWidth);
  }

  async function renderPdf() {
    if (!pdfPath) {
      setStatus("ไม่พบพาธ PDF");
      showFallback(`ไม่พบพาธไฟล์ PDF ในลิงก์นี้`);
      return;
    }

    const pdfUrl = resolveUrl(pdfPath);

    try {
      setStatus("กำลังโหลดไฟล์ PDF...");
      const pdfjsLib = await waitPdfjs();

      // ต้องตั้ง worker ให้ตรง (สำคัญมาก โดยเฉพาะมือถือ)
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.js";

      // โหลดเอกสาร
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        // ลดปัญหาบางเครื่อง
        disableAutoFetch: false,
        disableStream: false,
      });

      const pdf = await loadingTask.promise;

      setStatus(`กำลังเรนเดอร์... (ทั้งหมด ${pdf.numPages} หน้า)`);

      clearPages();

      // เรนเดอร์แบบ “ชัด” โดยคูณ devicePixelRatio
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const containerWidth = getContainerWidth();

      // เรนเดอร์ทีละหน้า (วันนี้เอาชัวร์ก่อน)
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // คำนวณ scale ให้พอดีกับความกว้างหน้าจอ
        const viewport1 = page.getViewport({ scale: 1 });
        const maxWidth = containerWidth * 0.96; // ให้เหลือขอบ
        const scale = maxWidth / viewport1.width;

        const viewport = page.getViewport({ scale });

        const pageWrap = document.createElement("div");
        pageWrap.className = "page";

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });

        // Retina: เพิ่ม resolution จริง แต่คงขนาดแสดงผลเดิม
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        pageWrap.appendChild(canvas);
        pdfHost.appendChild(pageWrap);

        const renderContext = {
          canvasContext: ctx,
          viewport: page.getViewport({ scale: scale * dpr }),
        };

        await page.render(renderContext).promise;

        // อัปเดตสถานะเป็นช่วง ๆ
        if (pageNum === 1) setStatus("แสดงผลหน้า 1 แล้ว ✅");
        if (pageNum === pdf.numPages) setStatus("แสดงผลครบทุกหน้า ✅");
      }
    } catch (err) {
      console.error(err);
      setStatus("แสดงผลไม่สำเร็จ");
      showFallback(
        `เปิด PDF ไม่ได้<br><br>
         <b>ลิงก์:</b> <a href="${resolveUrl(pdfPath)}" target="_blank" rel="noopener" style="color:#93c5fd">กดเปิด PDF โดยตรง</a><br>
         <small style="color:#94a3b8">สาเหตุที่พบได้บ่อย: path PDF ไม่ตรง / worker ไม่โหลด / ไฟล์ไม่ขึ้น GitHub Pages</small>`
      );
    }
  }

  // render ครั้งแรก
  renderPdf();

  // ถ้าหมุนจอ/เปลี่ยนขนาด ให้ re-render แบบนิ่ง ๆ (ไม่วน)
  onStableResize(() => {
    // ไม่ต้อง re-render ถ้าไม่อยากให้กระพริบ:
    // แต่ถ้าพี่อยากให้พอดีจอเวลา rotate จริง ๆ ให้เปิดไว้แบบนี้
    renderPdf();
  });
})();
