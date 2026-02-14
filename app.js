document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("categoriesGrid");

  const CATEGORIES_URL =
    "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";

  // base สำหรับ GitHub Pages (เพื่อทำ relative path ให้ชัวร์)
  const GH_BASE = "/price-webapp/";

  function buildPriceSheetUrlFromTab(tabName) {
    // ใช้ relative จะได้ทำงานทั้งบน GH Pages และกรณีมี custom domain ในอนาคต
    return `${GH_BASE}price_sheet.html?tab=${encodeURIComponent(tabName)}`;
  }

  function isLikelyHttpUrl(url) {
    return typeof url === "string" && /^https?:\/\//i.test(url.trim());
  }

  function normalizeMaybeRelativeUrl(url) {
    if (!url) return "";
    const u = String(url).trim();
    if (!u) return "";
    // ถ้าเป็น http(s) ให้ใช้ได้เลย
    if (isLikelyHttpUrl(u)) return u;
    // ถ้าเป็น relative แล้วไม่ขึ้นต้นด้วย / ให้เติม base
    if (!u.startsWith("/")) return GH_BASE + u;
    return u; // เช่น /price-webapp/price_sheet.html?tab=Battery
  }

  try {
    const res = await fetch(`${CATEGORIES_URL}?v=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load categories.json");

    const data = await res.json();

    // ===== Header / Cover =====
    if (data.siteTitle) document.getElementById("siteTitle").textContent = data.siteTitle;
    if (data.siteSubtitle) document.getElementById("siteSubtitle").textContent = data.siteSubtitle;

    // Cover: รองรับทั้งแบบรูปเดียว (coverImage) และแบบสไลด์ (coverSlides/coverImages)
    const coverHeadlineEl = document.getElementById("coverHeadline");
    const coverSubtextEl = document.getElementById("coverSubtext");
    const sliderEl = document.getElementById("coverSlider");
    const dotsEl = document.getElementById("coverDots");
    const prevBtn = document.getElementById("coverPrev");
    const nextBtn = document.getElementById("coverNext");

    const singleCover = data.coverImage ? [{
      image: data.coverImage,
      headline: data.coverHeadline || "",
      subtext: data.coverSubtext || "",
      link: data.coverLink || ""
    }] : [];

    const slidesRaw = Array.isArray(data.coverSlides) ? data.coverSlides
                    : Array.isArray(data.coverImages) ? data.coverImages
                    : [];

    const slides = (slidesRaw.length ? slidesRaw : singleCover)
      .map(s => ({
        image: (s && (s.image || s.src || s.url)) ? (s.image || s.src || s.url) : "",
        headline: (s && (s.headline || s.title || s.text)) ? (s.headline || s.title || s.text) : "",
        subtext: (s && (s.subtext || s.subtitle || s.desc)) ? (s.subtext || s.subtitle || s.desc) : "",
        link: (s && (s.link || s.href)) ? (s.link || s.href) : ""
      }))
      .filter(s => !!String(s.image || "").trim());

    function setCoverText(i){
      const s = slides[i] || {};
      if (coverHeadlineEl) coverHeadlineEl.textContent = s.headline || "";
      if (coverSubtextEl) coverSubtextEl.textContent = s.subtext || "";
    }

    function renderSlider(){
      if (!sliderEl) return;
      sliderEl.innerHTML = "";
      if (dotsEl) dotsEl.innerHTML = "";

      slides.forEach((s, idx) => {
        const slide = document.createElement("div");
        slide.className = "cover-slide";

        const inner = document.createElement(s.link ? "a" : "div");
        if (s.link) {
          inner.href = s.link;
          inner.target = "_blank";
          inner.rel = "noopener";
        }

        const img = document.createElement("img");
        img.src = s.image;
        img.alt = s.headline || "cover";
        img.loading = "eager";

        inner.appendChild(img);
        slide.appendChild(inner);
        sliderEl.appendChild(slide);

        if (dotsEl) {
          const d = document.createElement("button");
          d.type = "button";
          d.className = "cover-dot";
          d.setAttribute("aria-label", `ไปยังสไลด์ที่ ${idx + 1}`);
          d.addEventListener("click", () => go(idx, true));
          dotsEl.appendChild(d);
        }
      });
    }

    let active = 0;
    let timer = null;
    let isDragging = false;
    let startX = 0;
    let dx = 0;

    function updateUI(){
      if (!sliderEl) return;
      sliderEl.style.transform = `translateX(${-active * 100}%)`;
      if (dotsEl) {
        [...dotsEl.children].forEach((el, i) => el.classList.toggle("active", i === active));
      }
      setCoverText(active);
    }

    function stopAuto(){
      if (timer) { clearInterval(timer); timer = null; }
    }
    function startAuto(){
      stopAuto();
      if (slides.length <= 1) return;
      timer = setInterval(() => go(active + 1), 4200);
    }

    function go(i, userAction=false){
      if (!slides.length) return;
      active = (i + slides.length) % slides.length;
      updateUI();
      if (userAction) {
        // user interacted -> restart auto
        startAuto();
      }
    }

    renderSlider();
    // ถ้าไม่มีสไลด์ ให้ fallback เป็นข้อความเดิม
    if (!slides.length) {
      if (coverHeadlineEl) coverHeadlineEl.textContent = data.coverHeadline || "";
      if (coverSubtextEl) coverSubtextEl.textContent = data.coverSubtext || "";
    } else {
      updateUI();
      startAuto();

      // Swipe support
      const coverBox = sliderEl?.parentElement;
      if (coverBox && slides.length > 1) {
        coverBox.addEventListener("pointerdown", (e) => {
          isDragging = true;
          startX = e.clientX;
          dx = 0;
          stopAuto();
          coverBox.setPointerCapture?.(e.pointerId);
        });

        coverBox.addEventListener("pointermove", (e) => {
          if (!isDragging) return;
          dx = e.clientX - startX;
          // small resistance; do not actually drag transform to keep it simple & stable
        });

        const endDrag = () => {
          if (!isDragging) return;
          isDragging = false;
          const threshold = 42; // px
          if (dx > threshold) go(active - 1, true);
          else if (dx < -threshold) go(active + 1, true);
          else startAuto();
          dx = 0;
        };

        coverBox.addEventListener("pointerup", endDrag);
        coverBox.addEventListener("pointercancel", endDrag);
        coverBox.addEventListener("pointerleave", endDrag);

        // Pause autoplay when user holds finger
        coverBox.addEventListener("touchstart", () => stopAuto(), { passive: true });
        coverBox.addEventListener("touchend", () => startAuto(), { passive: true });
      }

      // Pause on hover (desktop)
      sliderEl?.parentElement?.addEventListener("mouseenter", stopAuto);
      sliderEl?.parentElement?.addEventListener("mouseleave", startAuto);
    }

    // ===== LINE =====
    const lineFab = document.getElementById("lineFab");
    const lineBox = document.getElementById("lineBox");

    if (data.lineUrl && lineFab) lineFab.href = data.lineUrl;

    if (data.lineIcon) {
      const el = document.getElementById("lineIcon");
      if (el) el.src = data.lineIcon;
    }

    if (data.lineQr) {
      const el = document.getElementById("lineQr");
      if (el) el.src = data.lineQr;
    }

    const qrToggle = document.getElementById("qrToggle");
    if (qrToggle && lineBox) {
      qrToggle.addEventListener("click", () => {
        lineBox.classList.toggle("show");
      });
    }

    // ===== Categories =====
    const items = data.categories || [];

    grid.innerHTML = items
      .map((item) => {
        const title = item.titleEN || item.titleTH || "Category";

        // ✅ Priority 1: SheetTab (แนะนำ)
        const sheetTab = (item.sheetTab || "").trim();
        if (sheetTab) {
          const href = buildPriceSheetUrlFromTab(sheetTab);
          return renderCard({ title, item, href });
        }

        // ✅ Priority 2: Price Page Link (เช่น ลิงก์ price_sheet POC แบบเต็ม)
        const priceUrl = normalizeMaybeRelativeUrl(item.price_url);
        if (priceUrl) {
          return renderCard({ title, item, href: priceUrl });
        }

        // ✅ Priority 3: PDF fallback (เดิม)
        const pdf = item.pdf || item.pdf_file || "";
        const pdfHref = `${GH_BASE}price.html?title=${encodeURIComponent(title)}&pdf=${encodeURIComponent(pdf)}`;
        return renderCard({ title, item, href: pdfHref });
      })
      .join("");

    function renderCard({ title, item, href }) {
      const imgHtml = item.image
        ? `<img src="${item.image}" alt="${title}" loading="lazy" onerror="this.remove();">`
        : "";

      return `
        <a class="card" href="${href}">
          <div class="thumb">${imgHtml}</div>
          <div class="label">
            <div class="title-en">${item.titleEN || ""}</div>
            <div class="title-th">${item.titleTH || ""}</div>
          </div>
        </a>
      `;
    }
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div style="padding:16px;">โหลดข้อมูลหมวดหมู่ไม่สำเร็จ</div>`;
  }
});
