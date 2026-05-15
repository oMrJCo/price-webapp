document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("categoriesGrid");

  const API_URL =
    "https://script.google.com/macros/s/AKfycbxqUpwXOo05dZ1iv9BP29pVR273Qj1d8fXwYZnn29A9cpNfrAtE0IKL7uqO-DXopIgUYA/exec";

  const GH_BASE = "/dealer/";

  function resolveAssetPath(p) {
    const s = String(p || "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s) || s.startsWith("data:")) return s;
    if (s.startsWith("/price-webapp/")) return s.replace("/price-webapp", "");
    if (s.startsWith("/")) return s;
    return "/" + s.replace(/^\.\/?/, "");
  }

  function buildPriceSheetUrlFromTab(tabName) {
    return `${GH_BASE}price_sheet.html?tab=${encodeURIComponent(tabName)}`;
  }

  function normalizeMaybeRelativeUrl(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith("/")) return u;
    return `${GH_BASE}${u}`;
  }

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node && text !== undefined && text !== null) {
      node.textContent = text;
    }
  }

  function normalizeCategory(item) {
    return {
      titleEN: item.titleEN || "",
      titleTH: item.titleTH || "",
      image: item.image || "",
      sheetTab: item.sheetTab || "",
      price_url: item.price_url || "",
      pdf: item.pdf || "",
      dealer_pdf: item.dealer_pdf || "",
      sort: item.sort || "",
      status: item.status || "",
    };
  }

  async function loadMeta() {
    const res = await fetch(`${API_URL}?action=meta&t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Meta API failed");

    const json = await res.json();
    if (!json.success) throw new Error("Meta API success false");

    return json.data || {};
  }

  async function loadCategories() {
    const res = await fetch(`${API_URL}?action=categories&t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Categories API failed");

    const json = await res.json();
    if (!json.success) throw new Error("Categories API success false");

    return (json.data || []).map(normalizeCategory);
  }

  try {
    const [metaRaw, categories] = await Promise.all([
      loadMeta(),
      loadCategories(),
    ]);

    const meta = metaRaw.site || {};

    const data = {
      siteTitle: meta.siteTitle || "LEEPLUS",
      siteSubtitle:
        meta.siteSubtitle ||
        "ศูนย์รวมอะไหล่มือถือ แบตเตอรี่ หน้าจอ ฟิล์ม และอุปกรณ์มือถือ",
      lineUrl: meta.lineUrl || "",
      lineStickyEnabled:
        String(meta.lineStickyEnabled || "true").toLowerCase() !== "false",
      lineCtaText:
        meta.lineCtaText || "💬 แอดไลน์เช็คราคา / เช็คสต็อกทันที",
      coverHeadline: meta.coverHeadline || "LEEPLUS DEALER PRICE",
      coverSubtext:
        meta.coverSubtext ||
        "ราคาตัวแทนจำหน่าย สำหรับสมาชิก Dealer เท่านั้น",
      coverSlides: [],
      categories,
    };

    setText("siteTitle", data.siteTitle || "LEEPLUS");
    setText(
      "siteSubtitle",
      data.siteSubtitle ||
        "ศูนย์รวมอะไหล่มือถือ แบตเตอรี่ หน้าจอ ฟิล์ม และอุปกรณ์มือถือ"
    );

    const coverHeadlineEl = document.getElementById("coverHeadline");
    const coverSubtextEl = document.getElementById("coverSubtext");
    const sliderEl = document.getElementById("coverSlider");
    const dotsEl = document.getElementById("coverDots");
    const prevBtn = document.getElementById("coverPrev");
    const nextBtn = document.getElementById("coverNext");

    const slides = [];

    if (coverHeadlineEl) {
      coverHeadlineEl.textContent = data.coverHeadline;
    }
    if (coverSubtextEl) {
      coverSubtextEl.textContent = data.coverSubtext;
    }
    if (sliderEl) sliderEl.innerHTML = "";
    if (dotsEl) dotsEl.style.display = "none";
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";

    const lineSticky = document.getElementById("lineSticky");
    if (lineSticky) {
      if (!data.lineStickyEnabled) {
        lineSticky.style.display = "none";
      } else {
        lineSticky.textContent = data.lineCtaText;
        if (data.lineUrl) lineSticky.href = data.lineUrl;
      }
    }

    const items = Array.isArray(data.categories) ? data.categories : [];

    if (!items.length) {
      grid.innerHTML = `<div style="padding:16px;">ยังไม่มีหมวดสินค้าที่เปิดใช้งาน</div>`;
      return;
    }

    grid.innerHTML = items
      .map((item) => {
        const title = item.titleEN || item.titleTH || "Category";

        const sheetTab = String(item.sheetTab || "").trim();
        if (sheetTab) {
          const href = buildPriceSheetUrlFromTab(sheetTab);
          return renderCard({ title, item, href });
        }

        const priceUrl = normalizeMaybeRelativeUrl(item.price_url);
        if (priceUrl) {
          return renderCard({ title, item, href: priceUrl });
        }

        const pdf = item.dealer_pdf || item.pdf || item.pdf_file || "";
        const pdfHref = `${GH_BASE}price.html?title=${encodeURIComponent(
          title
        )}&pdf=${encodeURIComponent(pdf)}`;

        return renderCard({ title, item, href: pdfHref });
      })
      .join("");

    function renderCard({ title, item, href }) {
      const imgHtml = item.image
        ? `<img src="${resolveAssetPath(
            item.image
          )}" alt="${title}" loading="lazy" onerror="this.remove();">`
        : `<div class="placeholder">LEEPLUS</div>`;

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
