
(function(){
  if(document.getElementById("dynamicContactFrontStyle"))return;
  const st=document.createElement("style");st.id="dynamicContactFrontStyle";st.textContent=`
    .dynamic-contact-icon{overflow:hidden;border:1px solid rgba(255,255,255,.12)}
    .dynamic-contact-icon img{width:72%;height:72%;object-fit:contain;display:block}
    .dynamic-contact-card{transition:transform .18s ease,filter .18s ease}
    .dynamic-contact-card:hover{transform:translateY(-2px);filter:brightness(1.08)}
    #contactBar{grid-template-columns:repeat(var(--contact-count,4),minmax(0,1fr))!important;gap:10px!important}
    #contactBar .contact-intro,#contactBar .contact-card{min-width:0!important}
    #contactBar .contact-copy{min-width:0}
    #contactBar .contact-copy b,#contactBar .contact-copy small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    @media(max-width:760px){
      #contactBar{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      #contactBar .contact-intro{grid-column:span 2}
    }
  `;document.head.appendChild(st);
})();

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("categoriesGrid");

  const API_URL =
    "https://script.google.com/macros/s/AKfycbxqUpwXOo05dZ1iv9BP29pVR273Qj1d8fXwYZnn29A9cpNfrAtE0IKL7uqO-DXopIgUYA/exec";

  const FALLBACK_CATEGORIES_URL =
    "https://raw.githubusercontent.com/omrjco/price-webapp/main/categories.json";

  const GH_BASE = "/";

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
    const el = document.getElementById(id);
    if (el && text !== undefined && text !== null) {
      el.textContent = text;
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
      dealerEnabled: item.dealerEnabled ?? item.dealer_enabled ?? "TRUE",
    };
  }

  async function loadMeta() {
    const res = await fetch(`${API_URL}?action=meta&t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Meta API load failed");

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.message || "Meta API success false");
    }

    return json.data || {};
  }

  async function loadCategories() {
    const res = await fetch(`${API_URL}?action=categories&t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Categories API load failed");

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.message || "Categories API success false");
    }

    return (json.data || []).map(normalizeCategory);
  }

  async function loadFallbackJson() {
    const res = await fetch(`${FALLBACK_CATEGORIES_URL}?v=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Fallback categories.json failed");

    return await res.json();
  }

  try {
    let data;

    try {
      const [meta, categories] = await Promise.all([
        loadMeta(),
        loadCategories(),
      ]);

      const siteMeta = meta.site || meta || {};
      let coverSlides = [];
      try {
        coverSlides = Array.isArray(siteMeta.coverSlides)
          ? siteMeta.coverSlides
          : JSON.parse(siteMeta.coverSlides || "[]");
      } catch (_) {
        coverSlides = [];
      }

      data = {
        siteTitle: siteMeta.siteTitle || meta.siteTitle || "LEEPLUS",
        siteSubtitle:
          siteMeta.siteSubtitle ||
          meta.siteSubtitle ||
          "ศูนย์รวมอะไหล่มือถือ แบตเตอรี่ หน้าจอ ฟิล์ม และอุปกรณ์มือถือ",
        lineUrl: siteMeta.lineUrl || meta.lineUrl || "https://line.me/R/ti/p/@leeplus",
        lineStickyEnabled:
          String(siteMeta.lineStickyEnabled || meta.lineStickyEnabled || "true").toLowerCase() !== "false",
        lineCtaText:
          siteMeta.lineCtaText || meta.lineCtaText || "💬 แอดไลน์เช็คราคา / เช็คสต็อกทันที",
        coverHeadline: siteMeta.coverHeadline || meta.coverHeadline || "LEEPLUS PRICE LIST",
        coverSubtext:
          siteMeta.coverSubtext ||
          meta.coverSubtext ||
          "เช็คราคา เช็คสต็อก และดาวน์โหลดไฟล์ PDF ได้ทันที",
        coverSlides,
        coverInterval: siteMeta.coverInterval || meta.coverInterval || 3,
        lineUrl: siteMeta.lineUrl || "",
        lineEnabled: String(siteMeta.lineEnabled || "TRUE").toUpperCase() !== "FALSE",
        facebookUrl: siteMeta.facebookUrl || "",
        facebookEnabled: String(siteMeta.facebookEnabled || "TRUE").toUpperCase() !== "FALSE",
        phone: siteMeta.phone || "",
        phoneEnabled: String(siteMeta.phoneEnabled || "TRUE").toUpperCase() !== "FALSE",
        contacts:(()=>{
          try{
            const raw=siteMeta.contacts;
            const a=Array.isArray(raw)?raw:(raw?JSON.parse(raw):[]);
            return Array.isArray(a)?a:[];
          }catch(_){return []}
        })(),
        logoUrl: siteMeta.logoUrl || "",
        categories,
      };

      console.log("Loaded meta/categories from Google Sheet API");
    } catch (apiErr) {
      console.warn("Sheet API failed, fallback to categories.json", apiErr);
      data = await loadFallbackJson();
    }

    setText("siteTitle", data.siteTitle || "LEEPLUS");
    setText(
      "siteSubtitle",
      data.siteSubtitle ||
        "ศูนย์รวมอะไหล่มือถือ แบตเตอรี่ หน้าจอ ฟิล์ม และอุปกรณ์มือถือ"
    );

    const siteLogo=document.getElementById("siteLogo");
    if(siteLogo){
      const logoUrl=String(data.logoUrl||"").trim();
      if(logoUrl){siteLogo.src=logoUrl;siteLogo.style.display="block";siteLogo.onerror=()=>{siteLogo.style.display="none";siteLogo.removeAttribute("src")}}
      else{siteLogo.style.display="none";siteLogo.removeAttribute("src")}
    }


    const contactBar=document.getElementById("contactBar");
    const normalizeContactHref=(c)=>{
      const raw=String(c?.url||"").trim();
      if(!raw)return "";
      if(String(c?.actionType||"URL").toUpperCase()==="TEL"){
        return "tel:"+raw.replace(/[^0-9+]/g,"");
      }
      return raw;
    };
    const legacyContacts=()=>{
      const a=[];
      if(data.lineEnabled&&data.lineUrl)a.push({name:"LINE",subtext:"สอบถามผ่านแชท",url:data.lineUrl,actionType:"URL",accent:"#06C755",enabled:true,showCard:true,showBottom:true,sort:1});
      if(data.facebookEnabled&&data.facebookUrl)a.push({name:"Facebook",subtext:"ติดตามข่าวสาร",url:data.facebookUrl,actionType:"URL",accent:"#1877F2",enabled:true,showCard:true,showBottom:false,sort:2});
      if(data.phoneEnabled&&data.phone)a.push({name:"โทร "+data.phone,subtext:"แตะเพื่อโทรออก",url:data.phone,actionType:"TEL",accent:"#F3C900",enabled:true,showCard:true,showBottom:false,sort:3});
      return a;
    };
    const contacts=(Array.isArray(data.contacts)&&data.contacts.length?data.contacts:legacyContacts())
      .map((c,i)=>({...c,sort:Number(c.sort||i+1)}))
      .filter(c=>String(c.enabled??"TRUE").toUpperCase()!=="FALSE")
      .sort((a,b)=>a.sort-b.sort);

    if(contactBar){
      const cards=[];
      cards.push(`<div class="contact-intro"><span class="contact-icon support-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1v-6Z"/><path d="M20 13h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1"/><path d="M19 20c0 1-1 2-3 2h-2"/></svg></span><span><b>ติดต่อเรา</b><small>พร้อมดูแลคุณ</small></span></div>`);

      contacts.filter(c=>String(c.showCard??"TRUE").toUpperCase()!=="FALSE").forEach(c=>{
        const href=normalizeContactHref(c);if(!href)return;
        const accent=/^#[0-9a-f]{6}$/i.test(String(c.accent||""))?c.accent:"#F3C900";
        const icon=String(c.icon||"").trim();
        const iconHtml=icon?`<span class="contact-icon dynamic-contact-icon" style="border-color:${accent}33;background:${accent}14"><img src="${icon}" alt="" onerror="this.closest('.contact-icon').remove()"></span>`:"";
        cards.push(`<a class="contact-card dynamic-contact-card" style="border-color:${accent}66;background:linear-gradient(135deg,${accent}18,transparent 58%),#101720" href="${href}" ${String(c.actionType||"URL").toUpperCase()==="TEL"?"":'target="_blank" rel="noopener"'}>${iconHtml}<span class="contact-copy"><b>${String(c.name||"")}</b><small>${String(c.subtext||"")}</small></span><span class="contact-arrow" style="color:${accent}">›</span></a>`);
      });
      contactBar.innerHTML=cards.join("");
      contactBar.style.setProperty("--contact-count", String(Math.max(1,cards.length)));
      contactBar.style.display=cards.length>1?"grid":"none";
    }

    const coverHeadlineEl = document.getElementById("coverHeadline");
    const coverSubtextEl = document.getElementById("coverSubtext");
    const sliderEl = document.getElementById("coverSlider");
    const dotsEl = document.getElementById("coverDots");
    const prevBtn = document.getElementById("coverPrev");
    const nextBtn = document.getElementById("coverNext");

    const singleCover = data.coverImage
      ? [
          {
            image: data.coverImage,
            headline: data.coverHeadline || "",
            subtext: data.coverSubtext || "",
            link: data.coverLink || "",
          },
        ]
      : [];

    const slidesRaw = Array.isArray(data.coverSlides)
      ? data.coverSlides
      : Array.isArray(data.coverImages)
      ? data.coverImages
      : [];

    const slides = (slidesRaw.length ? slidesRaw : singleCover)
      .map((s) => ({
        image: s && (s.image || s.src || s.url) ? s.image || s.src || s.url : "",
        headline:
          s && (s.headline || s.title || s.text)
            ? s.headline || s.title || s.text
            : "",
        subtext:
          s && (s.subtext || s.subtitle || s.desc)
            ? s.subtext || s.subtitle || s.desc
            : "",
        link: s && (s.link || s.href) ? s.link || s.href : "",
      }))
      .filter((s) => !!String(s.image || "").trim());

    const coverIntervalSecRaw = Number(data.coverInterval);
    const coverIntervalSec = Number.isFinite(coverIntervalSecRaw)
      ? Math.min(10, Math.max(2, coverIntervalSecRaw))
      : 3;
    const coverIntervalMs = Math.round(coverIntervalSec * 1000);

    function setCoverText(i) {
      const s = slides[i] || {};
      const hasCustomSlides = slidesRaw.length > 0;
      const headline = hasCustomSlides ? (s.headline || "") : (s.headline || data.coverHeadline || "LEEPLUS PRICE LIST");
      const subtext = hasCustomSlides ? (s.subtext || "") : (s.subtext || data.coverSubtext || "เช็คราคา เช็คสต็อก และดาวน์โหลดไฟล์ PDF ได้ทันที");

      if (coverHeadlineEl) coverHeadlineEl.textContent = headline;
      if (coverSubtextEl) coverSubtextEl.textContent = subtext;

      const textBox = coverHeadlineEl?.closest(".cover-txt");
      if (textBox) textBox.classList.toggle("is-empty", !headline && !subtext);
    }

    function renderSlider() {
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

    function updateUI() {
      if (!sliderEl) return;
      sliderEl.style.transform = `translateX(${-active * 100}%)`;
      if (dotsEl) {
        [...dotsEl.children].forEach((el, i) =>
          el.classList.toggle("active", i === active)
        );
      }
      setCoverText(active);
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (slides.length <= 1) return;
      timer = setInterval(() => go(active + 1), coverIntervalMs);
    }

    function go(i, userAction = false) {
      if (!slides.length) return;
      active = (i + slides.length) % slides.length;
      updateUI();
      if (userAction) startAuto();
    }

    renderSlider();

    if (!slides.length) {
      if (coverHeadlineEl) {
        coverHeadlineEl.textContent =
          data.coverHeadline || "LEEPLUS PRICE LIST";
      }
      if (coverSubtextEl) {
        coverSubtextEl.textContent =
          data.coverSubtext ||
          "เช็คราคา เช็คสต็อก และดาวน์โหลดไฟล์ PDF ได้ทันที";
      }
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      if (dotsEl) dotsEl.style.display = "none";
    } else {
      updateUI();
      startAuto();

      if (prevBtn) {
        prevBtn.addEventListener("click", () => go(active - 1, true));
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", () => go(active + 1, true));
      }

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
        });

        const endDrag = () => {
          if (!isDragging) return;
          isDragging = false;
          const threshold = 42;
          if (dx > threshold) go(active - 1, true);
          else if (dx < -threshold) go(active + 1, true);
          else startAuto();
          dx = 0;
        };

        coverBox.addEventListener("pointerup", endDrag);
        coverBox.addEventListener("pointercancel", endDrag);
        coverBox.addEventListener("pointerleave", endDrag);

        coverBox.addEventListener("touchstart", () => stopAuto(), {
          passive: true,
        });
        coverBox.addEventListener("touchend", () => startAuto(), {
          passive: true,
        });
      }

      sliderEl?.parentElement?.addEventListener("mouseenter", stopAuto);
      sliderEl?.parentElement?.addEventListener("mouseleave", startAuto);
    }

    const lineSticky = document.getElementById("lineSticky");
    if(lineSticky){
      const bottom=contacts.find(c=>String(c.showBottom??"FALSE").toUpperCase()==="TRUE");
      if(!bottom){
        lineSticky.style.display="none";
      }else{
        const href=normalizeContactHref(bottom);
        const accent=/^#[0-9a-f]{6}$/i.test(String(bottom.accent||""))?bottom.accent:"#06C755";
        const icon=String(bottom.icon||"").trim();
        lineSticky.innerHTML=`${icon?`<img src="${icon}" alt="" style="width:20px;height:20px;object-fit:contain;border-radius:5px" onerror="this.remove()">`:""}<span>${String(bottom.name||"")}${bottom.subtext?" · "+String(bottom.subtext):""}</span>`;
        lineSticky.href=href||"#";
        lineSticky.style.display=href?"flex":"none";
        lineSticky.style.background=accent;
        lineSticky.style.alignItems="center";
        lineSticky.style.justifyContent="center";
        lineSticky.style.gap="8px";
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

        const pdf = item.pdf || item.pdf_file || "";
        const pdfHref = `${GH_BASE}price.html?title=${encodeURIComponent(
          title
        )}&pdf=${encodeURIComponent(pdf)}`;

        return renderCard({ title, item, href: pdfHref });
      })
      .join("");

    function renderCard({ title, item, href }) {
      const imgHtml = item.image
        ? `<img src="${item.image}" alt="${title}" loading="lazy" onerror="this.remove();">`
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
