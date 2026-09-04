(function(){if(document.getElementById("contactPolish041"))return;const st=document.createElement("style");st.id="contactPolish041";st.textContent=`
.contact-flags{display:flex!important;align-items:center!important;gap:18px!important;flex-wrap:nowrap!important;white-space:nowrap!important}
.contact-flags label{display:inline-flex!important;align-items:center!important;gap:6px!important;font-size:11px!important;font-weight:800!important;line-height:1.2!important;white-space:nowrap!important}
.contact-flags input[type="checkbox"]{width:15px!important;height:15px!important;flex:0 0 15px!important}
.contact-admin-grid label>span{white-space:nowrap!important}
@media(max-width:1100px){.contact-flags{flex-wrap:wrap!important}}
`;document.head.appendChild(st)})();

(function(){
  if(document.getElementById("backofficeSmartUI"))return;
  const st=document.createElement("style");
  st.id="backofficeSmartUI";
  st.textContent=`
    :root{--bo-yellow:#f3c900;--bo-ink:#111318;--bo-muted:#7c8490;--bo-line:#e8e9ec;--bo-bg:#f4f5f7}
    body{background:var(--bo-bg)!important}
    #content{max-width:1480px;margin:0 auto;padding-bottom:90px}
    .panel{border:1px solid var(--bo-line)!important;border-radius:16px!important;box-shadow:0 5px 18px rgba(15,20,30,.04)!important;background:#fff!important}
    .cards{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important}
    .card{border-radius:15px!important;border:1px solid var(--bo-line)!important;padding:16px!important;background:#fff!important;box-shadow:none!important}
    .card strong{font-size:28px!important;line-height:1!important}
    .card .muted,.muted{color:var(--bo-muted)!important}
    .dashboard-health-grid{display:grid;grid-template-columns:1.35fr .9fr;gap:14px;margin-top:14px}
    .smart-list{display:grid;gap:8px}
    .smart-item{display:grid;grid-template-columns:minmax(180px,1fr) auto;gap:12px;align-items:center;padding:11px 12px;border:1px solid #eceef1;border-radius:12px;background:#fbfcfd}
    .smart-item-main{min-width:0}.smart-item-main b{display:block;font-size:13px}.smart-item-main small{display:block;color:#8b929b;margin-top:2px}
    .smart-badges{display:flex;gap:6px;align-items:center;justify-content:flex-end;flex-wrap:wrap}
    .smart-badge{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:#f0f2f5;color:#59616c;font-size:10px;font-weight:850}
    .smart-badge.ok{background:#e9f8ef;color:#16814b}.smart-badge.warn{background:#fff5d4;color:#8b6800}.smart-badge.bad{background:#ffe9e7;color:#b42318}
    .health-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee}.health-row:last-child{border-bottom:0}
    .health-dot{width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:7px}.health-dot.ok{background:#22b573}.health-dot.warn{background:#f3c900}.health-dot.bad{background:#d92d20}
    .dashboard-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
    .dashboard-actions button{min-height:38px}
    .settings-grid{grid-template-columns:1fr!important}
    .settings-card{padding:18px!important}
    .dynamic-contact-panel{overflow:hidden}
    #contactManagerRows{overflow:auto;border:1px solid #eceef1;border-radius:14px}
    .contact-admin-item{display:grid!important;grid-template-columns:52px 1fr!important;padding:12px 14px!important;margin:0!important;border:0!important;border-bottom:1px solid #eceef1!important;border-radius:0!important;background:#fff!important}
    .contact-admin-item:last-child{border-bottom:0!important}
    .contact-admin-top{grid-column:1;grid-row:1;margin:0!important;display:block!important}
    .contact-admin-icon-preview{width:42px!important;height:42px!important}
    .contact-admin-title{display:none!important}.contact-admin-top .danger{display:block!important;width:42px!important;margin-top:6px!important;padding:5px!important;font-size:9px!important}
    .contact-admin-grid{grid-column:2;grid-row:1;display:grid!important;grid-template-columns:1.05fr 1.1fr .72fr .88fr 90px 74px 1.45fr!important;gap:8px!important;align-items:end}
    .contact-admin-grid input,.contact-admin-grid select{width:100%;min-width:0}
    .contact-admin-grid label>span{font-size:9px!important;color:#777!important}
    .contact-icon-field{grid-column:auto!important}
    .contact-icon-field .upload-field{display:flex;gap:5px}.contact-icon-field .upload-field input{min-width:70px}
    .contact-flags{grid-column:1/-1!important;padding-top:6px;border-top:1px dashed #eceef1}
    .contact-flags label{font-size:10px!important}
    .contact-admin-item{position:relative}
    
    .settings-save{position:sticky!important;bottom:12px!important;z-index:40;background:rgba(255,255,255,.94)!important;backdrop-filter:blur(10px);border:1px solid #e6e7ea;border-radius:14px;padding:10px 12px!important;box-shadow:0 12px 35px rgba(0,0,0,.12)}
    .cat-toolbar{position:sticky;top:0;z-index:20;background:rgba(244,245,247,.94);backdrop-filter:blur(10px);padding:8px 0}
    .dashboard-store-wrap{margin-bottom:14px}
    .dashboard-store-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
    .dashboard-store-head h2{margin:0}
    .dashboard-store-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .dashboard-store-stat{border:1px solid #eceef1;border-radius:14px;padding:14px;background:#fbfcfd}
    .dashboard-store-stat span{display:block;color:#7c8490;font-size:11px;font-weight:800}
    .dashboard-store-stat strong{display:block;font-size:26px;line-height:1;margin-top:7px}
    .dashboard-store-stat small{display:block;margin-top:6px;color:#8b929b;font-size:10px;line-height:1.45}
    .dashboard-store-latest{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
    .dashboard-store-box{border:1px solid #eceef1;border-radius:14px;padding:13px;background:#fff}
    .dashboard-store-box .label{font-size:10px;color:#7c8490;font-weight:850;margin-bottom:6px}
    .dashboard-store-box b{display:block;font-size:13px}
    .dashboard-store-box small{display:block;margin-top:4px;color:#7c8490;line-height:1.5}
    .dashboard-store-empty{color:#8b929b;font-size:12px;padding:6px 0}
    @media(max-width:1100px){
      .cards{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .dashboard-health-grid{grid-template-columns:1fr}
      .dashboard-store-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .contact-admin-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    }
    @media(max-width:700px){
      .cards{grid-template-columns:1fr!important}
      .dashboard-store-grid,.dashboard-store-latest{grid-template-columns:1fr}
      .contact-admin-item{grid-template-columns:44px 1fr!important;padding:10px!important}
      .contact-admin-grid{grid-template-columns:1fr!important}
    }
  `;
  document.head.appendChild(st);
})();

const ADMIN_CODE="451520210", AUTH_KEY="leeplus_admin_until";
function authOK(){return Number(sessionStorage.getItem(AUTH_KEY)||0)>Date.now()}
function showGate(){const g=document.querySelector("#loginGate");if(g)g.classList.remove("hidden");setTimeout(()=>document.querySelector("#adminCode")?.focus(),50)}
function hideGate(){document.querySelector("#loginGate")?.classList.add("hidden")}
const loginForm=document.querySelector("#loginForm");
if(loginForm){
  loginForm.onsubmit=function(e){
    e.preventDefault();
    const el=document.querySelector("#adminCode"),err=document.querySelector("#loginError");
    if(err)err.textContent="";
    if(el && el.value===ADMIN_CODE){
      sessionStorage.setItem(AUTH_KEY,String(Date.now()+12*60*60*1000));
      el.value="";
      hideGate();
    }else{
      if(err)err.textContent="รหัสไม่ถูกต้อง";
      if(el){el.value="";el.focus()}
    }
  };
}
document.querySelector("#logoutBtn")?.addEventListener("click",()=>{sessionStorage.removeItem(AUTH_KEY);showGate()});
if(authOK())hideGate();else showGate();

const SHEET_API="https://script.google.com/macros/s/AKfycbxqUpwXOo05dZ1iv9BP29pVR273Qj1d8fXwYZnn29A9cpNfrAtE0IKL7uqO-DXopIgUYA/exec";
let sheetTabs=[], sheetLoadState="idle";

let categoryApiData=[];

async function apiGet(params){
  const q=new URLSearchParams({...params,t:String(Date.now())});
  const r=await fetch(`${SHEET_API}?${q.toString()}`,{cache:"no-store"});
  if(!r.ok) throw new Error(`HTTP ${r.status}`);
  const j=await r.json();
  if(j && j.success===false) throw new Error(j.message||"API error");
  return j;
}
async function loadCategoryApi(){
  try{
    const j=await apiGet({action:"categoriesAdmin"});
    categoryApiData=Array.isArray(j.data)?j.data:[];
  }catch(e){
    console.warn("categoriesAdmin not ready:",e);
    categoryApiData=[];
  }
}
let mediaFiles=[], mediaState="idle";
async function loadMediaLibrary(){mediaState="loading";try{const j=await apiGet({action:"media",kind:"image"});mediaFiles=Array.isArray(j.data)?j.data:[];mediaState="ok"}catch(e){console.warn(e);mediaFiles=[];mediaState="error"}}
function mediaUsage(url){return cats().filter(c=>String(c.image||"")===String(url||""))}
function mediaCards(){if(mediaState==="loading")return '<div class="empty">กำลังโหลดรูป...</div>';if(mediaState==="error")return '<div class="api-needed"><b>ยังอ่าน Media Library ไม่ได้</b><div>ตรวจสอบว่า Deploy Code.gs ของ Phase 4A แล้ว</div></div>';if(!mediaFiles.length)return '<div class="empty">ยังไม่มีรูปใน Media Library</div>';return `<div class="media-grid">${mediaFiles.map(f=>{const used=mediaUsage(f.url);return `<div class="media-card"><div class="media-image"><img src="${esc(f.url)}"></div><div class="media-body"><b title="${esc(f.name)}">${esc(f.name)}</b><div class="muted">${used.length?`ใช้อยู่: ${used.map(x=>esc(x.titleTH||x.titleEN)).join(", ")}`:"ยังไม่ถูกใช้กับหมวด"}</div><div class="media-actions"><button class="secondary media-copy" data-url="${esc(f.url)}">คัดลอก URL</button><a class="media-open" href="${esc(f.url)}" target="_blank">เปิดรูป</a></div></div></div>`}).join("")}</div>`}
function bindMediaActions(){document.querySelectorAll(".media-copy").forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.url);const o=b.textContent;b.textContent="คัดลอกแล้ว";setTimeout(()=>b.textContent=o,1200)}catch(e){prompt("คัดลอก URL นี้",b.dataset.url)}})}
async function uploadFromMedia(file){if(!file)return;const msg=document.querySelector("#mediaMsg"),btn=document.querySelector("#mediaUploadBtn"),old=btn.textContent;btn.disabled=true;btn.textContent="กำลังอัปโหลด...";try{await uploadFile(file,"image");await renderMediaView()}catch(e){msg.className="media-msg error";msg.textContent="อัปโหลดไม่สำเร็จ: "+e.message}finally{btn.disabled=false;btn.textContent=old}}
async function renderMediaView(){
  title.textContent='รูปและสื่อ';
  subtitle.textContent='จัดการสื่อหน้าแรก โลโก้แบรนด์ และคลังรูปในจุดเดียว';
  await Promise.all([loadSheetTabs(),loadCategoryApi()]);
  const heroHtml=await renderHeroManager();
  const brandHtml=await renderBrandManager();
  content.innerHTML=`${heroHtml}${brandHtml}
  <div id="libraryPicker" class="picker-modal hidden">
    <div class="picker-card">
      <div class="modal-head"><div><h2 id="pickerTitle">เลือกจากคลัง</h2><div class="muted" id="pickerSubtitle"></div></div><button type="button" id="closePicker" class="icon-btn">×</button></div>
      <div id="pickerBody" class="picker-body"><div class="empty">กำลังโหลด...</div></div>
    </div>
  </div>
  <div class="media-toolbar">
    <div><button class="primary" id="mediaUploadBtn">+ อัปโหลดรูปเข้าคลัง</button><input id="mediaFile" class="file-hidden" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></div>
    <button class="secondary" id="mediaRefresh">รีเฟรชคลังรูป</button>
  </div>
  <div id="mediaMsg" class="media-msg"></div>
  <div class="panel"><div class="media-panel-head"><h2>คลังรูปทั้งหมด</h2><span class="muted" id="mediaCount"></span></div><div id="mediaLibrary"><div class="empty">กำลังโหลดรูป...</div></div></div>`;

  document.querySelector("#closePicker")?.addEventListener("click",closeLibraryPicker);
  document.querySelector("#libraryPicker")?.addEventListener("click",e=>{if(e.target.id==="libraryPicker")closeLibraryPicker()});

  await loadMediaLibrary();
  document.querySelector("#mediaLibrary").innerHTML=mediaCards();
  document.querySelector("#mediaCount").textContent=`${mediaFiles.length} ไฟล์`;
  document.querySelector("#mediaUploadBtn").onclick=()=>document.querySelector("#mediaFile").click();
  document.querySelector("#mediaFile").onchange=e=>uploadFromMedia(e.target.files[0]);
  document.querySelector("#mediaRefresh").onclick=()=>renderMediaView();
  bindMediaActions();
  bindHeroRows();
  document.querySelector("#addHeroSlide").onclick=()=>{
    document.querySelector("#heroSlides").insertAdjacentHTML("beforeend",heroSlideRow({},document.querySelectorAll(".hero-slide-row").length));
    bindHeroRows();
  };
  document.querySelector("#saveHero").onclick=async()=>{
    const msg=document.querySelector("#heroMsg");msg.textContent="กำลังบันทึก...";
    try{await saveSiteMedia();msg.className="media-msg success";msg.textContent="บันทึกสื่อหน้าแรกแล้ว"}
    catch(e){msg.className="media-msg error";msg.textContent="บันทึกไม่สำเร็จ: "+e.message}
  };
  document.querySelector("#brandTabSelect")?.addEventListener("change",async e=>{
    activeBrandTab=e.target.value;
    await loadBrandsForTab(activeBrandTab);
    document.querySelector("#brandLogoArea").innerHTML=brandLogoCards();
    bindBrandLogoCards();
  });
  bindBrandLogoCards();
}

let pdfFiles=[], pdfState="idle";

async function loadPdfLibrary(){
  pdfState="loading";
  try{
    const j=await apiGet({action:"media",kind:"pdf"});
    pdfFiles=Array.isArray(j.data)?j.data:[];
    pdfState="ok";
  }catch(e){
    console.warn("PDF API error:",e);
    pdfFiles=[];
    pdfState="error";
  }
}

function pdfUsage(url){return liveCats().filter(c=>String(c.pdf_url||"")===String(url||""))}
function formatBytes(n){n=Number(n||0);if(n<1024)return n+" B";if(n<1048576)return (n/1024).toFixed(1)+" KB";return (n/1048576).toFixed(1)+" MB"}
function pdfCards(){
  if(pdfState==="loading")return '<div class="empty">กำลังโหลด PDF...</div>';
  if(pdfState==="error")return '<div class="api-needed"><b>ยังอ่าน PDF Library ไม่ได้</b><div>ตรวจสอบ Apps Script ที่ใช้อยู่</div></div>';
  if(!pdfFiles.length)return '<div class="empty">ยังไม่มีไฟล์ PDF</div>';
  return `<div class="pdf-list">${pdfFiles.map(f=>{
    const used=pdfUsage(f.url);
    return `<div class="pdf-item"><div class="pdf-icon">PDF</div><div class="pdf-info grow"><b>${esc(f.name||"PDF")}</b><div class="muted">${formatBytes(f.size)} · ${used.length?`ใช้อยู่: ${used.map(x=>esc(x.titleTH||x.titleEN)).join(", ")}`:"ยังไม่ถูกใช้กับหมวด"}</div></div><div class="pdf-actions"><button class="secondary pdf-copy" data-url="${esc(f.url)}">คัดลอก URL</button><a class="media-open" href="${esc(f.url)}" target="_blank">เปิด PDF</a></div></div>`;
  }).join("")}</div>`;
}
async function uploadFromPdfLibrary(file){
  if(!file)return;
  const msg=document.querySelector("#pdfMsg"),btn=document.querySelector("#pdfUploadBtn");
  const old=btn.textContent;btn.disabled=true;btn.textContent="กำลังอัปโหลด...";msg.textContent="";
  try{
    await uploadFile(file,"pdf");
    await loadPdfLibrary();
    msg.className="media-msg success";msg.textContent="อัปโหลดสำเร็จ";
    document.querySelector("#pdfLibrary").innerHTML=pdfCards();
    document.querySelector("#pdfCount").textContent=`${pdfFiles.length} ไฟล์`;
    bindPdfActions();
  }catch(e){msg.className="media-msg error";msg.textContent="อัปโหลดไม่สำเร็จ: "+e.message}
  finally{btn.disabled=false;btn.textContent=old}
}
function bindPdfActions(){
  document.querySelectorAll(".pdf-copy").forEach(b=>b.onclick=async()=>{
    try{await navigator.clipboard.writeText(b.dataset.url);const old=b.textContent;b.textContent="คัดลอกแล้ว";setTimeout(()=>b.textContent=old,1200)}
    catch(e){prompt("คัดลอก URL นี้",b.dataset.url)}
  });
}
async function renderPdfView(){
  title.textContent='ไฟล์ PDF';
  subtitle.textContent='จัดการเอกสาร PDF ที่ใช้ในเว็บใบราคา';
  content.innerHTML=`<div class="media-toolbar"><div><button class="primary" id="pdfUploadBtn">+ อัปโหลด PDF</button><input id="pdfLibraryFile" class="file-hidden" type="file" accept="application/pdf"></div><button class="secondary" id="pdfRefresh">รีเฟรช</button></div><div id="pdfMsg" class="media-msg"></div><div class="panel"><div class="media-panel-head"><h2>PDF ทั้งหมด</h2><span class="muted" id="pdfCount"></span></div><div id="pdfLibrary"><div class="empty">กำลังโหลด PDF...</div></div></div>`;
  await loadPdfLibrary();
  document.querySelector("#pdfLibrary").innerHTML=pdfCards();
  document.querySelector("#pdfCount").textContent=`${pdfFiles.length} ไฟล์`;
  document.querySelector("#pdfUploadBtn").onclick=()=>document.querySelector("#pdfLibraryFile").click();
  document.querySelector("#pdfLibraryFile").onchange=e=>uploadFromPdfLibrary(e.target.files[0]);
  document.querySelector("#pdfRefresh").onclick=()=>renderPdfView();
  bindPdfActions();
}


let siteMediaConfig={coverSlides:[],coverInterval:3};
let brandLogoRows=[];
let activeBrandTab="";

async function loadSiteMedia(){
  try{
    const j=await apiGet({action:"siteMedia"});
    siteMediaConfig={
      coverSlides:Array.isArray(j.coverSlides)?j.coverSlides:[],
      coverInterval:Number(j.coverInterval||3)||3
    };
  }catch(e){
    console.warn("siteMedia load failed",e);
    siteMediaConfig={coverSlides:[],coverInterval:3};
  }
}
async function saveSiteMedia(){
  const slides=[...document.querySelectorAll(".hero-slide-row")].map(row=>({
    image:row.querySelector("[data-field=image]")?.value.trim()||"",
    headline:row.querySelector("[data-field=headline]")?.value.trim()||"",
    subtext:row.querySelector("[data-field=subtext]")?.value.trim()||"",
    link:row.querySelector("[data-field=link]")?.value.trim()||""
  })).filter(x=>x.image);
  const interval=Math.max(2,Math.min(10,Number(document.querySelector("#heroInterval")?.value||3)));
  const r=await apiGet({action:"saveSiteMedia",coverSlides:JSON.stringify(slides),coverInterval:String(interval)});
  siteMediaConfig={coverSlides:slides,coverInterval:interval};
  return r;
}
function heroSlideRow(s={},i=0){
  return `<div class="hero-slide-row">
    <div class="hero-preview">${s.image?`<img src="${esc(s.image)}" alt="">`:'<span>1600 × 500 px</span>'}</div>
    <div class="hero-fields">
      <label>รูป Banner <div class="upload-field"><input data-field="image" value="${esc(s.image||"")}" placeholder="เลือกรูป 1600 × 500 px"><button type="button" class="library-btn hero-pick">เลือกจากคลัง</button></div></label>
      <label>หัวข้อ <input data-field="headline" value="${esc(s.headline||"")}" placeholder="เว้นว่างได้"></label>
      <label>ข้อความรอง <input data-field="subtext" value="${esc(s.subtext||"")}" placeholder="เว้นว่างได้"></label>
      <label>ลิงก์เมื่อคลิก <input data-field="link" value="${esc(s.link||"")}" placeholder="https://... (ไม่บังคับ)"></label>
    </div>
    <button type="button" class="danger hero-remove">ลบ</button>
  </div>`;
}
function bindHeroRows(){
  document.querySelectorAll(".hero-pick").forEach(btn=>btn.onclick=async()=>{
    const row=btn.closest(".hero-slide-row");
    await openMediaPickerForTarget("image",url=>{
      row.querySelector("[data-field=image]").value=url;
      const box=row.querySelector(".hero-preview");
      box.innerHTML=`<img src="${esc(url)}" alt="">`;
    });
  });
  document.querySelectorAll(".hero-remove").forEach(btn=>btn.onclick=()=>{
    btn.closest(".hero-slide-row").remove();
  });
}
async function renderHeroManager(){
  await loadSiteMedia();
  const slides=siteMediaConfig.coverSlides||[];
  return `<div class="panel media-section">
    <div class="section-head">
      <div><h2>สื่อหน้าแรก / Hero Banner</h2><div class="spec-note"><b>ขนาดแนะนำ 1600 × 500 px (16:5)</b> · Safe Area กลางประมาณ 1400 × 420 px · หน้าเว็บใช้ object-fit: cover</div></div>
      <button class="primary" id="addHeroSlide">+ เพิ่ม Banner</button>
    </div>
    <div class="hero-settings"><label>เวลาเปลี่ยนสไลด์ <input id="heroInterval" type="number" min="2" max="10" value="${esc(siteMediaConfig.coverInterval||3)}"> วินาที</label></div>
    <div id="heroSlides">${slides.length?slides.map(heroSlideRow).join(""):heroSlideRow({},0)}</div>
    <div class="section-save"><button class="primary" id="saveHero">บันทึกสื่อหน้าแรก</button><span id="heroMsg" class="media-msg"></span></div>
  </div>`;
}
async function loadBrandsForTab(tab){
  if(!tab){brandLogoRows=[];return}
  try{
    const j=await apiGet({action:"brands",tab});
    brandLogoRows=Array.isArray(j.data)?j.data:[];
  }catch(e){brandLogoRows=[];console.warn(e)}
}
function brandLogoCards(){
  if(!activeBrandTab)return '<div class="empty">เลือกหมวดสินค้าเพื่อดูรายชื่อแบรนด์</div>';
  if(!brandLogoRows.length)return '<div class="empty">ยังไม่พบแบรนด์ใน Tab นี้</div>';
  return `<div class="brand-logo-grid">${brandLogoRows.map(b=>`
    <div class="brand-logo-card" data-brand="${esc(b.brand)}">
      <div class="brand-logo-preview">${b.logo?`<img src="${esc(b.logo)}" alt="">`:'<span>ไม่มีรูป</span>'}</div>
      <div class="brand-logo-name"><b>${esc(b.brand)}</b><small>256 × 256 px (1:1)</small></div>
      <div class="brand-logo-actions">
        <button type="button" class="secondary brand-pick">เลือกจากคลัง</button>
        <button type="button" class="upload-btn brand-upload">อัปโหลด</button>
        <input class="file-hidden brand-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif">
      </div>
    </div>`).join("")}</div>`;
}
async function selectBrandLogo(card,url){
  const brand=card.dataset.brand;
  const msg=document.querySelector("#brandMsg");
  msg.textContent="กำลังบันทึก...";
  try{
    await apiGet({action:"saveBrandLogo",brand,url});
    card.querySelector(".brand-logo-preview").innerHTML=`<img src="${esc(url)}" alt="">`;
    msg.className="media-msg success";msg.textContent=`บันทึกโลโก้ ${brand} แล้ว`;
  }catch(e){
    msg.className="media-msg error";msg.textContent="บันทึกไม่สำเร็จ: "+e.message;
  }
}
function bindBrandLogoCards(){
  document.querySelectorAll(".brand-logo-card").forEach(card=>{
    card.querySelector(".brand-pick").onclick=()=>openMediaPickerForTarget("image",url=>selectBrandLogo(card,url));
    const fileInput=card.querySelector(".brand-file");
    card.querySelector(".brand-upload").onclick=()=>fileInput.click();
    fileInput.onchange=async e=>{
      const file=e.target.files[0]; if(!file)return;
      const msg=document.querySelector("#brandMsg");msg.textContent="กำลังอัปโหลด...";
      try{
        const j=await uploadFile(file,"image");
        await selectBrandLogo(card,j.url);
      }catch(err){msg.className="media-msg error";msg.textContent="อัปโหลดไม่สำเร็จ: "+err.message}
    };
  });
}
async function openMediaPickerForTarget(kind,onSelect){
  const modal=document.querySelector("#libraryPicker");
  const body=document.querySelector("#pickerBody");
  if(!modal || !body) throw new Error("ไม่พบหน้าต่างเลือกไฟล์ กรุณารีเฟรชหน้า Backoffice");
  document.querySelector("#pickerTitle").textContent=kind==="image"?"เลือกรูปจากคลัง":"เลือก PDF จากคลัง";
  document.querySelector("#pickerSubtitle").textContent=kind==="image"?"เลือกรูปที่ต้องการใช้งาน":"เลือก PDF ที่ต้องการใช้งาน";
  modal.classList.remove("hidden");
  body.innerHTML='<div class="empty">กำลังโหลด...</div>';
  if(kind==="image"){
    await loadMediaLibrary();
    body.innerHTML=mediaFiles.length?`<div class="picker-grid">${mediaFiles.map(f=>`
      <button type="button" class="picker-image-item target-picker" data-url="${esc(f.url)}">
        <span class="picker-thumb"><img src="${esc(f.url)}" alt=""></span>
        <span class="picker-name">${esc(f.name||"รูป")}</span>
      </button>`).join("")}</div>`:'<div class="empty">ยังไม่มีรูปในคลัง</div>';
  }else{
    await loadPdfLibrary();
    body.innerHTML=pdfFiles.length?`<div class="picker-pdf-list">${pdfFiles.map(f=>`
      <button type="button" class="picker-pdf-item target-picker" data-url="${esc(f.url)}">
        <span class="picker-pdf-icon">PDF</span><span class="picker-pdf-text"><b>${esc(f.name||"PDF")}</b><small>${formatBytes(f.size)}</small></span><span class="picker-select">เลือก</span>
      </button>`).join("")}</div>`:'<div class="empty">ยังไม่มี PDF ในคลัง</div>';
  }
  body.querySelectorAll(".target-picker").forEach(b=>b.onclick=()=>{onSelect(b.dataset.url);closeLibraryPicker()});
}
async function renderBrandManager(){
  const mappedCats=liveCats().filter(c=>catTab(c));
  const seen=new Set();
  const items=mappedCats.map(c=>({
    tab:catTab(c),
    label:c.titleTH||c.titleEN||catTab(c)
  })).filter(x=>{
    const k=String(x.tab).toLowerCase();
    if(!x.tab || seen.has(k))return false;
    seen.add(k);return true;
  });

  if(!items.some(x=>x.tab===activeBrandTab)){
    activeBrandTab=items.length?items[0].tab:"";
  }

  await loadBrandsForTab(activeBrandTab);

  return `<div class="panel media-section">
    <div class="section-head"><div><h2>โลโก้แบรนด์</h2><div class="spec-note"><b>ขนาดแนะนำ 256 × 256 px (1:1)</b> · PNG/WebP พื้นหลังโปร่งใส · รายชื่อแบรนด์อ่านจากข้อมูลสินค้าใน Sheet จริง</div></div></div>
    <div class="brand-toolbar"><label>หมวดสินค้า <select id="brandTabSelect">${items.map(x=>`<option value="${esc(x.tab)}" ${x.tab===activeBrandTab?"selected":""}>${esc(x.label)} — ${esc(x.tab)}</option>`).join("")}</select></label><span id="brandMsg" class="media-msg"></span></div>
    <div id="brandLogoArea">${items.length?brandLogoCards():'<div class="empty">ยังไม่มีหมวดที่เชื่อมกับ Google Sheet</div>'}</div>
  </div>`;
}


let siteSettings={};
async function loadSiteSettings(){
  try{const j=await apiGet({action:"adminSettings"});siteSettings=j.data||{}}
  catch(e){console.warn("adminSettings failed",e);siteSettings={}}
}
async function saveSiteSettings(){
  return await apiGet({
    action:"saveSettings",
    facebookUrl:document.querySelector("#settingFacebook")?.value.trim()||"",
    facebookEnabled:document.querySelector("#settingFacebookEnabled")?.checked?"TRUE":"FALSE",
    lineUrl:document.querySelector("#settingLine")?.value.trim()||"",
    lineEnabled:document.querySelector("#settingLineEnabled")?.checked?"TRUE":"FALSE",
    phone:document.querySelector("#settingPhone")?.value.trim()||"",
    phoneEnabled:document.querySelector("#settingPhoneEnabled")?.checked?"TRUE":"FALSE",
    dealerCode:document.querySelector("#settingDealerCode")?.value.trim()||"",
    logoUrl:document.querySelector("#settingLogoUrl")?.value.trim()||"",
    promoEnabled:document.querySelector("#promoEnabled")?.checked?"TRUE":"FALSE",
    promoImage:document.querySelector("#promoImage")?.value.trim()||"",
    promoStart:document.querySelector("#promoStart")?.value||"",
    promoEnd:document.querySelector("#promoEnd")?.value||"",
    promoAudience:document.querySelector("#promoAudience")?.value||"BOTH",
    promoFrequency:document.querySelector("#promoFrequency")?.value||"DAILY",
    contacts:JSON.stringify(collectContactRows())
  });
}

function defaultContactItems(s){
  if(Array.isArray(s?.contacts) && s.contacts.length) return s.contacts.map((x,i)=>({
    id:String(x.id||("contact_"+Date.now()+"_"+i)),
    name:String(x.name||""),
    subtext:String(x.subtext||""),
    url:String(x.url||""),
    actionType:String(x.actionType||"URL").toUpperCase()==="TEL"?"TEL":"URL",
    icon:String(x.icon||""),
    accent:String(x.accent||"#F3C900"),
    enabled:String(x.enabled??"TRUE").toUpperCase()!=="FALSE",
    showCard:String(x.showCard??"TRUE").toUpperCase()!=="FALSE",
    showBottom:String(x.showBottom??"FALSE").toUpperCase()==="TRUE",
    sort:Number(x.sort||i+1)
  })).sort((a,b)=>a.sort-b.sort);

  const legacy=[];
  if(s?.lineUrl) legacy.push({id:"line",name:"LINE",subtext:"สอบถามผ่านแชท",url:s.lineUrl,actionType:"URL",icon:"",accent:"#06C755",enabled:String(s.lineEnabled??"TRUE").toUpperCase()!=="FALSE",showCard:true,showBottom:true,sort:1});
  if(s?.facebookUrl) legacy.push({id:"facebook",name:"Facebook",subtext:"ติดตามข่าวสาร",url:s.facebookUrl,actionType:"URL",icon:"",accent:"#1877F2",enabled:String(s.facebookEnabled??"TRUE").toUpperCase()!=="FALSE",showCard:true,showBottom:false,sort:2});
  if(s?.phone) legacy.push({id:"phone",name:"โทร "+s.phone,subtext:"แตะเพื่อโทรออก",url:s.phone,actionType:"TEL",icon:"",accent:"#F3C900",enabled:String(s.phoneEnabled??"TRUE").toUpperCase()!=="FALSE",showCard:true,showBottom:false,sort:3});
  return legacy;
}
let contactItems=[];

function contactRowHtml(c,index){
  return `<div class="contact-admin-item" data-contact-index="${index}">
    <div class="contact-admin-top">
      <div class="contact-admin-icon-preview">${c.icon?`<img src="${esc(c.icon)}" onerror="this.remove()">`:`<span>${index+1}</span>`}</div>
      <div class="contact-admin-title"><b>${esc(c.name||"ช่องทางใหม่")}</b><small>ลำดับ ${index+1}</small></div>
      <button type="button" class="danger contact-remove" data-index="${index}">ลบ</button>
    </div>
    <div class="contact-admin-grid">
      <label><span>ชื่อช่องทาง</span><input class="contact-name" value="${esc(c.name||"")}" placeholder="LINE / Facebook / โทร / WhatsApp"></label>
      <label><span>ข้อความรอง</span><input class="contact-subtext" value="${esc(c.subtext||"")}" placeholder="สอบถามผ่านแชท"></label>
      <label><span>ประเภท Action</span><select class="contact-action"><option value="URL" ${c.actionType!=="TEL"?"selected":""}>เปิดลิงก์</option><option value="TEL" ${c.actionType==="TEL"?"selected":""}>โทรศัพท์</option></select></label>
      <label><span>ลิงก์ / เบอร์โทร</span><input class="contact-url" value="${esc(c.url||"")}" placeholder="https://... หรือ 097..."></label>
      <label><span>สี Accent</span><input class="contact-accent" type="color" value="${/^#[0-9a-f]{6}$/i.test(c.accent||"")?esc(c.accent):"#F3C900"}"></label>
      <label><span>ลำดับ</span><input class="contact-sort" type="number" min="1" value="${Number(c.sort||index+1)}"></label>
      <label class="contact-icon-field"><span>Icon</span><div class="upload-field"><input class="contact-icon-url" value="${esc(c.icon||"")}" placeholder="URL รูป Icon"><button type="button" class="secondary contact-icon-upload" data-index="${index}">อัปโหลด Icon</button><input class="contact-icon-file file-hidden" data-index="${index}" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"></div></label>
      <div class="contact-flags">
        <label><input class="contact-enabled" type="checkbox" ${c.enabled!==false?"checked":""}> เปิดใช้งาน</label>
        <label><input class="contact-show-card" type="checkbox" ${c.showCard!==false?"checked":""}> แสดง Contact Card</label>
        <label><input class="contact-show-bottom" type="checkbox" ${c.showBottom===true?"checked":""}> แสดงแถบด้านล่าง</label>
      </div>
    </div>
  </div>`;
}
function renderContactManager(){
  const box=document.querySelector("#contactManagerRows");
  if(!box)return;
  contactItems.sort((a,b)=>Number(a.sort||999)-Number(b.sort||999));
  box.innerHTML=contactItems.length?contactItems.map(contactRowHtml).join(""):'<div class="empty">ยังไม่มีช่องทางติดต่อ</div>';
  bindContactManager();
}
function collectContactRows(){
  const rows=[...document.querySelectorAll(".contact-admin-item")];
  return rows.map((row,i)=>({
    id:contactItems[i]?.id||("contact_"+Date.now()+"_"+i),
    name:row.querySelector(".contact-name")?.value.trim()||"",
    subtext:row.querySelector(".contact-subtext")?.value.trim()||"",
    actionType:row.querySelector(".contact-action")?.value||"URL",
    url:row.querySelector(".contact-url")?.value.trim()||"",
    icon:row.querySelector(".contact-icon-url")?.value.trim()||"",
    accent:row.querySelector(".contact-accent")?.value||"#F3C900",
    enabled:!!row.querySelector(".contact-enabled")?.checked,
    showCard:!!row.querySelector(".contact-show-card")?.checked,
    showBottom:!!row.querySelector(".contact-show-bottom")?.checked,
    sort:Number(row.querySelector(".contact-sort")?.value||i+1)
  })).filter(x=>x.name);
}
function syncContactItemsFromDom(){contactItems=collectContactRows()}
function bindContactManager(){
  document.querySelectorAll(".contact-remove").forEach(b=>b.onclick=()=>{
    syncContactItemsFromDom();contactItems.splice(Number(b.dataset.index),1);contactItems.forEach((x,i)=>x.sort=i+1);renderContactManager();
  });
  document.querySelectorAll(".contact-icon-upload").forEach(b=>b.onclick=()=>document.querySelector(`.contact-icon-file[data-index="${b.dataset.index}"]`)?.click());
  document.querySelectorAll(".contact-icon-file").forEach(inp=>inp.onchange=async e=>{
    const file=e.target.files?.[0];if(!file)return;
    const idx=Number(inp.dataset.index),btn=document.querySelector(`.contact-icon-upload[data-index="${idx}"]`);
    if(btn)btn.disabled=true;
    try{
      const r=await uploadFile(file,"image");
      const row=document.querySelector(`.contact-admin-item[data-contact-index="${idx}"]`);
      if(row){row.querySelector(".contact-icon-url").value=r.url;const pv=row.querySelector(".contact-admin-icon-preview");pv.innerHTML=`<img src="${esc(r.url)}">`;}
    }catch(err){alert("อัปโหลด Icon ไม่สำเร็จ: "+err.message)}
    finally{if(btn)btn.disabled=false;e.target.value=""}
  });
}


(function(){
  if(document.getElementById("dynamicContactAdminStyle"))return;
  const st=document.createElement("style");st.id="dynamicContactAdminStyle";st.textContent=`
    .contact-manager-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px}
    .contact-admin-item{border:1px solid #e4e4e4;border-radius:14px;padding:14px;margin:10px 0;background:#fafafa}
    .contact-admin-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}
    .contact-admin-icon-preview{width:44px;height:44px;border-radius:12px;background:#111;display:grid;place-items:center;overflow:hidden;color:#f3c900;font-weight:900}
    .contact-admin-icon-preview img{width:100%;height:100%;object-fit:contain}
    .contact-admin-title{display:flex;flex-direction:column;flex:1}.contact-admin-title small{color:#888}
    .contact-admin-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .contact-admin-grid label>span{display:block;font-size:11px;font-weight:800;margin-bottom:5px}
    .contact-icon-field{grid-column:span 2}.contact-flags{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
    .contact-flags label{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:800}
    @media(max-width:900px){.contact-admin-grid{grid-template-columns:1fr}.contact-icon-field{grid-column:auto}.contact-manager-head{flex-direction:column}}
  `;document.head.appendChild(st);
})();


(function ensureAnalyticsAdminStyles(){
  if(document.getElementById("analyticsAdminStyle"))return;
  const st=document.createElement("style");
  st.id="analyticsAdminStyle";
  st.textContent=`
    .analytics-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
    .analytics-toolbar .left{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .analytics-toolbar select{min-width:120px}
    .analytics-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}
    .analytics-stat{background:#fff;border:1px solid #e9e9e9;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:6px;min-height:112px}
    .analytics-stat span{font-size:11px;color:#777;font-weight:800}
    .analytics-stat strong{font-size:28px;line-height:1;color:#111}
    .analytics-stat small{font-size:11px;color:#888}
    .analytics-layout{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(320px,.8fr);gap:14px}
    .analytics-list{display:grid;gap:8px}
    .analytics-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #eee}
    .analytics-row:last-child{border-bottom:0}
    .analytics-row b{font-size:13px}
    .analytics-row span{font-size:12px;color:#666;font-weight:800}
    .analytics-bars{display:grid;gap:9px}
    .analytics-bar-row{display:grid;grid-template-columns:88px minmax(0,1fr) 44px;gap:9px;align-items:center}
    .analytics-bar-label{font-size:11px;color:#666;white-space:nowrap}
    .analytics-bar-track{height:9px;background:#eee;border-radius:999px;overflow:hidden}
    .analytics-bar-fill{height:100%;background:#111;border-radius:999px}
    .analytics-bar-value{text-align:right;font-size:11px;font-weight:900}
    .analytics-empty{padding:18px;text-align:center;color:#888;border:1px dashed #ddd;border-radius:12px}
    .analytics-note{font-size:11px;color:#888}
    .analytics-chart-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:4px 0 12px}
    .analytics-chart-summary span{background:#f7f7f8;border:1px solid #ececee;border-radius:12px;padding:9px 10px;display:flex;align-items:baseline;gap:7px}
    .analytics-chart-summary b{font-size:17px;color:#111}.analytics-chart-summary small{font-size:10px;color:#777}
    .analytics-chart-scroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
    .analytics-line-chart{display:block;width:100%;min-width:620px;height:auto;max-height:260px}
    .analytics-chart-grid{stroke:#e9eaec;stroke-width:1}
    .analytics-chart-y{font-size:10px;fill:#888;text-anchor:end}
    .analytics-chart-x{font-size:10px;fill:#777;text-anchor:middle}
    .analytics-chart-area{fill:rgba(17,17,17,.055)}
    .analytics-chart-line{fill:none;stroke:#111;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
    .analytics-chart-dot{fill:#fff;stroke:#111;stroke-width:2.5}
    .analytics-province-list{display:grid}
    .analytics-province-head,.analytics-province-row{display:grid;grid-template-columns:30px minmax(0,1fr);gap:10px;align-items:center}
    .analytics-province-head{padding:0 0 8px;color:#888;font-size:10px;font-weight:800;border-bottom:1px solid #eee}
    .analytics-province-head span:nth-child(n+2){text-align:right}.analytics-province-rank{width:26px;height:26px;border-radius:8px;background:#f3f4f5;display:grid;place-items:center;font-size:11px;font-weight:900;color:#555}
    .analytics-province-row{padding:10px 0;border-bottom:1px solid #f0f0f0}
    .analytics-province-row:last-child{border-bottom:0}
    .analytics-province-name b{font-size:12px}
    .analytics-province-track{height:4px;background:#efefef;border-radius:999px;overflow:hidden;margin-top:6px}
    .analytics-province-track i{display:block;height:100%;background:#111;border-radius:999px}
    .analytics-province-meta{font-size:10px;color:#777;margin-top:2px;font-weight:700}
    @media(max-width:1100px){.analytics-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.analytics-layout{grid-template-columns:1fr}}
    @media(max-width:650px){
      .analytics-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .analytics-stat{min-height:96px;padding:12px}.analytics-stat strong{font-size:23px}
      .analytics-chart-summary{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      .analytics-chart-summary span{padding:7px;display:block}.analytics-chart-summary b{font-size:15px;display:block}.analytics-chart-summary small{font-size:9px}
      .analytics-line-chart{min-width:560px}
      .analytics-province-head,.analytics-province-row{grid-template-columns:28px minmax(0,1fr)}
    }
  `;
  document.head.appendChild(st);
})();


(function ensureStoreAccessAdminStyles(){
  if(document.getElementById("storeAccessAdminStyle"))return;
  const st=document.createElement("style");
  st.id="storeAccessAdminStyle";
  st.textContent=`
    .store-toolbar{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
    .store-filters{display:flex;gap:7px;flex-wrap:wrap}
    .store-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px}
    .store-summary .panel{padding:14px}.store-summary strong{display:block;font-size:25px;margin-top:5px}
    .store-list{display:grid;gap:9px}.store-row{border:1px solid #e8e9ec;border-radius:14px;padding:13px;background:#fff}
    .store-row-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:start}
    .store-name{font-size:14px;font-weight:900}.store-meta{font-size:11px;color:#777;margin-top:4px;line-height:1.65}
    .store-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;align-items:center}
    .store-status{display:inline-flex;padding:4px 8px;border-radius:999px;font-size:10px;font-weight:900}
    .store-status.pending{background:#fff4cc;color:#7a5b00}.store-status.approved{background:#e7f7ed;color:#147a45}
    .store-status.rejected,.store-status.revoked{background:#ffe9e7;color:#b42318}
    .store-duplicate{display:inline-flex;margin-left:6px;padding:3px 7px;border-radius:999px;background:#fff0d5;color:#9a5c00;font-size:9px;font-weight:900}
    .store-empty{padding:26px;text-align:center;color:#888;border:1px dashed #ddd;border-radius:14px}
    .store-activity{margin-top:10px;padding-top:9px;border-top:1px dashed #eceef1;display:flex;gap:7px;flex-wrap:wrap;align-items:center}
    .store-activity-chip{display:inline-flex;padding:4px 7px;border-radius:999px;background:#f3f5f7;color:#5e6672;font-size:9px;font-weight:850}
    .store-activity-chip.live{background:#e9f8ef;color:#16814b}
    .store-tabs-line{margin-top:6px;color:#7c8490;font-size:10px}
    @media(max-width:800px){.store-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.store-row-top{grid-template-columns:1fr}.store-actions{justify-content:flex-start}}
  `;
  document.head.appendChild(st);
})();

async function renderSettingsView(){
  title.textContent='ตั้งค่าเว็บไซต์';
  subtitle.textContent='ช่องทางติดต่อและการเข้าถึงราคาตัวแทนจำหน่าย';
  content.innerHTML='<div class="panel"><div class="empty">กำลังโหลดการตั้งค่า...</div></div>';
  await loadSiteSettings();
  const s=siteSettings||{};
  contactItems=defaultContactItems(s);
  content.innerHTML=`
    <div class="settings-grid">
      <div class="panel settings-card">
        <h2>โลโก้เว็บไซต์</h2>
        <div class="settings-note"><b>ขนาดแนะนำ 512 × 512 px (1:1)</b> · PNG/WebP พื้นหลังโปร่งใส · ใช้ทั้งหน้าปกติและหน้าตัวแทน</div>
        <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:14px">
          <div id="siteLogoPreview" style="width:120px;height:64px;border:1px solid #ddd;border-radius:10px;background:#111;display:grid;place-items:center;overflow:hidden">${s.logoUrl?`<img src="${esc(s.logoUrl)}" style="max-width:100%;max-height:100%;object-fit:contain">`:'<span style="color:#888;font-size:11px">ยังไม่ได้ตั้งโลโก้</span>'}</div>
          <div style="flex:1;min-width:260px">
            <input id="settingLogoUrl" value="${esc(s.logoUrl||"")}" placeholder="URL โลโก้" style="width:100%;margin-bottom:8px">
            <button type="button" class="secondary" id="uploadSiteLogoBtn">อัปโหลดโลโก้</button>
            <input id="siteLogoFile" class="file-hidden" type="file" accept="image/png,image/jpeg,image/webp">
            <span id="siteLogoMsg" class="media-msg"></span>
          </div>
        </div>
      </div>
      <div class="panel settings-card dynamic-contact-panel">
        <div class="contact-manager-head">
          <div><h2>ช่องทางการติดต่อ</h2><div class="settings-note">เพิ่ม/ลบช่องทางเองได้ · Icon อัปโหลดเอง · ใช้ข้อมูลชุดเดียวกับ Contact Cards และแถบด้านล่าง</div></div>
          <button type="button" class="primary" id="addContactBtn">+ เพิ่มช่องทาง</button>
        </div>
        <div id="contactManagerRows"></div>
      </div>
      <div class="panel settings-card promo-settings-card">
        <h2>Promotion Popup</h2>
        <div class="settings-note"><b>Artwork 1:1 แนะนำ 1080 × 1080 px</b> · ไม่มี CTA · แสดงกลางจอและปิดได้ด้วย X/คลิกพื้นที่ด้านนอก</div>
        <div class="promo-admin-grid">
          <label class="promo-toggle"><input id="promoEnabled" type="checkbox" ${String(s.promoEnabled||"FALSE").toUpperCase()==="TRUE"?"checked":""}> <b>เปิดใช้งาน Popup</b></label>
          <label><span>แสดงที่</span><select id="promoAudience"><option value="BOTH" ${String(s.promoAudience||"BOTH")==="BOTH"?"selected":""}>Retail + Dealer</option><option value="RETAIL" ${String(s.promoAudience)==="RETAIL"?"selected":""}>Retail เท่านั้น</option><option value="DEALER" ${String(s.promoAudience)==="DEALER"?"selected":""}>Dealer เท่านั้น</option></select></label>
          <label><span>ความถี่</span><select id="promoFrequency"><option value="ALWAYS" ${String(s.promoFrequency)==="ALWAYS"?"selected":""}>ทุกครั้งที่เข้าเว็บ</option><option value="DAILY" ${String(s.promoFrequency||"DAILY")==="DAILY"?"selected":""}>วันละครั้ง</option><option value="ONCE" ${String(s.promoFrequency)==="ONCE"?"selected":""}>ครั้งเดียว</option></select></label>
          <label><span>วันเริ่ม</span><input id="promoStart" type="date" value="${esc(s.promoStart||"")}"></label>
          <label><span>วันสิ้นสุด</span><input id="promoEnd" type="date" value="${esc(s.promoEnd||"")}"></label>
        </div>
        <div class="promo-image-admin">
          <div id="promoPreview" class="promo-preview">${s.promoImage?`<img src="${esc(s.promoImage)}">`:'<span>ยังไม่มี Artwork</span>'}</div>
          <div class="promo-image-actions">
            <input id="promoImage" value="${esc(s.promoImage||"")}" placeholder="URL รูปโปรโมชั่น">
            <div><button type="button" class="secondary" id="promoUploadBtn">อัปโหลดรูป</button> <button type="button" class="secondary" id="promoLibraryBtn">เลือกจาก Media Library</button></div>
            <input id="promoFile" class="file-hidden" type="file" accept="image/png,image/jpeg,image/webp">
            <span id="promoMsg" class="media-msg"></span>
          </div>
        </div>
      </div>
      <div class="panel settings-card">
        <h2>ราคาตัวแทนจำหน่าย</h2>
        <div class="settings-note">ปุ่มราคาตัวแทนหน้าเว็บจะให้กรอกรหัสก่อนเข้าเหมือนระบบเดิม</div>
        <label class="setting-block"><b>ตั้ง/เปลี่ยนรหัสตัวแทน</b><input id="settingDealerCode" type="password" placeholder="${s.hasDealerCode?"มีรหัสใช้งานอยู่แล้ว — เว้นว่างถ้าไม่เปลี่ยน":"กรอกรหัสตัวแทน"}"><small>เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสเดิม</small></label>
      </div>
    </div>
    <div class="settings-save"><button class="primary" id="saveSettingsBtn">บันทึกการตั้งค่า</button><span id="settingsMsg" class="media-msg"></span></div>`;
  renderContactManager();
  document.querySelector("#addContactBtn")?.addEventListener("click",()=>{
    syncContactItemsFromDom();
    contactItems.push({id:"contact_"+Date.now(),name:"",subtext:"",url:"",actionType:"URL",icon:"",accent:"#F3C900",enabled:true,showCard:true,showBottom:false,sort:contactItems.length+1});
    renderContactManager();
  });
  document.querySelector("#uploadSiteLogoBtn")?.addEventListener("click",()=>document.querySelector("#siteLogoFile")?.click());
  document.querySelector("#siteLogoFile")?.addEventListener("change",async e=>{
    const file=e.target.files?.[0]; if(!file)return;
    const btn=document.querySelector("#uploadSiteLogoBtn"),msg=document.querySelector("#siteLogoMsg");
    btn.disabled=true; msg.textContent="กำลังอัปโหลด...";
    try{const r=await uploadFile(file,"image");document.querySelector("#settingLogoUrl").value=r.url;document.querySelector("#siteLogoPreview").innerHTML=`<img src="${esc(r.url)}" style="max-width:100%;max-height:100%;object-fit:contain">`;msg.className="media-msg success";msg.textContent="อัปโหลดแล้ว — กดบันทึกการตั้งค่า"}
    catch(err){msg.className="media-msg error";msg.textContent="อัปโหลดไม่สำเร็จ: "+err.message}
    finally{btn.disabled=false;e.target.value=""}
  });

  const updatePromoPreview=(url)=>{
    const p=document.querySelector("#promoPreview");
    if(p)p.innerHTML=url?`<img src="${esc(url)}">`:'<span>ยังไม่มี Artwork</span>';
  };
  document.querySelector("#promoImage")?.addEventListener("input",e=>updatePromoPreview(e.target.value.trim()));
  document.querySelector("#promoUploadBtn")?.addEventListener("click",()=>document.querySelector("#promoFile")?.click());
  document.querySelector("#promoFile")?.addEventListener("change",async e=>{
    const file=e.target.files?.[0];if(!file)return;
    const btn=document.querySelector("#promoUploadBtn"),msg=document.querySelector("#promoMsg");
    btn.disabled=true;msg.textContent="กำลังอัปโหลด...";
    try{
      const r=await uploadFile(file,"image");
      document.querySelector("#promoImage").value=r.url;updatePromoPreview(r.url);
      msg.className="media-msg success";msg.textContent="อัปโหลดแล้ว — กดบันทึกการตั้งค่า";
    }catch(err){msg.className="media-msg error";msg.textContent="อัปโหลดไม่สำเร็จ: "+err.message}
    finally{btn.disabled=false;e.target.value=""}
  });
  document.querySelector("#promoLibraryBtn")?.addEventListener("click",async()=>{
    const msg=document.querySelector("#promoMsg");msg.textContent="กำลังเปิด Media Library...";
    try{
      await loadMediaLibrary();
      if(!mediaFiles.length){msg.textContent="ยังไม่มีรูปใน Media Library";return}
      const overlay=document.createElement("div");overlay.className="promo-picker-overlay";
      overlay.innerHTML=`<div class="promo-picker-box"><div class="promo-picker-head"><b>เลือก Artwork โปรโมชั่น</b><button type="button" class="secondary promo-picker-close">ปิด</button></div><div class="promo-picker-grid">${mediaFiles.map(f=>`<button type="button" class="promo-picker-item" data-url="${esc(f.url)}"><img src="${esc(f.url)}"><span>${esc(f.name||"รูป")}</span></button>`).join("")}</div></div>`;
      document.body.appendChild(overlay);
      const close=()=>overlay.remove();
      overlay.querySelector(".promo-picker-close").onclick=close;
      overlay.onclick=e=>{if(e.target===overlay)close()};
      overlay.querySelectorAll(".promo-picker-item").forEach(b=>b.onclick=()=>{
        document.querySelector("#promoImage").value=b.dataset.url;updatePromoPreview(b.dataset.url);msg.textContent="เลือกรูปแล้ว — กดบันทึกการตั้งค่า";close();
      });
    }catch(err){msg.className="media-msg error";msg.textContent="โหลด Media Library ไม่สำเร็จ: "+err.message}
  });

  document.querySelector("#saveSettingsBtn").onclick=async()=>{
    const btn=document.querySelector("#saveSettingsBtn"),msg=document.querySelector("#settingsMsg");
    btn.disabled=true;msg.textContent="กำลังบันทึก...";
    try{await saveSiteSettings();document.querySelector("#settingDealerCode").value="";msg.className="media-msg success";msg.textContent="บันทึกการตั้งค่าแล้ว"}
    catch(e){msg.className="media-msg error";msg.textContent="บันทึกไม่สำเร็จ: "+e.message}
    finally{btn.disabled=false}
  };
}


let storeAccessRows=[];
let storeAccessFilter="PENDING";
let storeAnalyticsMap={};

function storeStatus(v){return String(v||"PENDING").trim().toUpperCase()}
function storeDate(v){
  if(!v)return "—";
  const d=new Date(v); if(Number.isNaN(d.getTime()))return String(v);
  return d.toLocaleString("th-TH",{dateStyle:"short",timeStyle:"short"});
}
function storeDuplicate(r){return r?.duplicate_name===true||String(r?.duplicate_name||"").toUpperCase()==="TRUE"}

async function loadStoreAccessRows(){
  const [storesJ,analyticsJ]=await Promise.all([
    apiGet({action:"storesAdmin"}),
    apiGet({action:"storeAnalyticsSummary",days:"30"}).catch(()=>({data:[]}))
  ]);
  storeAccessRows=(Array.isArray(storesJ?.data)?storesJ.data:[]).map(r=>({...r,__status:storeStatus(r.status)}));
  storeAnalyticsMap={};
  (Array.isArray(analyticsJ?.data)?analyticsJ.data:[]).forEach(x=>{if(x?.store_id)storeAnalyticsMap[x.store_id]=x});
}
function storeCount(status){return storeAccessRows.filter(r=>r.__status===status).length}

function storeRowHtml(r){
  const status=r.__status, id=r.store_id||"", phone=r.phone||"";
  const buttons=status==="PENDING"
    ? `<button class="primary store-action" data-id="${esc(id)}" data-action="APPROVED">อนุมัติ</button><button class="danger store-action" data-id="${esc(id)}" data-action="REJECTED">ปฏิเสธ</button>`
    : status==="APPROVED"
      ? `<button class="danger store-action" data-id="${esc(id)}" data-action="REVOKED">ระงับสิทธิ์</button>`
      : `<button class="secondary store-action" data-id="${esc(id)}" data-action="APPROVED">อนุมัติ</button>`;
  return `<div class="store-row">
    <div class="store-row-top">
      <div>
        <div><span class="store-name">${esc(r.store_name||"ไม่ระบุชื่อร้าน")}</span>${storeDuplicate(r)?'<span class="store-duplicate">⚠ ชื่อร้านซ้ำ</span>':""}</div>
        <div class="store-meta"><b>${esc(phone||"—")}</b>${r.contact_name?` · ${esc(r.contact_name)}`:""}${r.province?` · ${esc(r.province)}`:""}${r.contact_detail?`<br>${esc(r.contact_detail)}`:""}<br>ส่งคำขอ ${esc(storeDate(r.created_at))}</div>
        ${(()=>{
          const a=storeAnalyticsMap[id]||{};
          const tabs=Array.isArray(a.top_tabs)?a.top_tabs:[];
          return `<div class="store-activity">
            <span class="store-activity-chip ${a.last_active?"live":""}">ล่าสุด ${esc(a.last_active?storeDate(a.last_active):"ยังไม่มีข้อมูล")}</span>
            <span class="store-activity-chip">${Number(a.sessions||0)} sessions</span>
            <span class="store-activity-chip">${Number(a.views||0)} views / 30 วัน</span>
          </div>${tabs.length?`<div class="store-tabs-line">หมวดที่ดู: ${tabs.map(x=>`${esc(x.name)} (${Number(x.count||0)})`).join(" · ")}</div>`:""}`;
        })()}
      </div>
      <div class="store-actions"><span class="store-status ${status.toLowerCase()}">${esc(status)}</span>${buttons}</div>
    </div>
  </div>`;
}

function bindStoreActions(){
  document.querySelectorAll(".store-action").forEach(btn=>btn.onclick=async()=>{
    const next=btn.dataset.action, id=btn.dataset.id;
    const label=next==="APPROVED"?"อนุมัติ":next==="REJECTED"?"ปฏิเสธ":"ระงับสิทธิ์";
    if(!confirm(`${label}ร้านนี้?`))return;
    btn.disabled=true;
    try{
      await apiGet({action:"storeSetStatus",storeId:id,status:next});
      await renderStoreAccessView();
    }catch(e){alert("อัปเดตไม่สำเร็จ: "+e.message);btn.disabled=false}
  });
}

async function renderStoreAccessView(){
  title.textContent="ร้านค้า / คำขอสิทธิ์";
  subtitle.textContent="ตรวจสอบสิทธิ์ร้านค้า พร้อมดูการใช้งาน Retail ย้อนหลัง 30 วัน";
  content.innerHTML='<div class="panel"><div class="empty">กำลังโหลดข้อมูลร้านค้า...</div></div>';
  try{await loadStoreAccessRows()}
  catch(e){content.innerHTML=`<div class="panel"><div class="api-needed"><b>ยังอ่าน Store Access ไม่ได้</b><div>${esc(e.message)}</div></div></div>`;return}
  const shown=storeAccessFilter==="ALL"?storeAccessRows:storeAccessRows.filter(r=>r.__status===storeAccessFilter);
  content.innerHTML=`
    <div class="store-summary">
      <div class="panel"><span class="muted">รอตรวจสอบ</span><strong>${storeCount("PENDING")}</strong></div>
      <div class="panel"><span class="muted">อนุมัติแล้ว</span><strong>${storeCount("APPROVED")}</strong></div>
      <div class="panel"><span class="muted">ปฏิเสธ</span><strong>${storeCount("REJECTED")}</strong></div>
      <div class="panel"><span class="muted">ระงับสิทธิ์</span><strong>${storeCount("REVOKED")}</strong></div>
    </div>
    <div class="store-toolbar">
      <div class="store-filters">${["PENDING","APPROVED","REJECTED","REVOKED","ALL"].map(x=>`<button class="${storeAccessFilter===x?"primary":"secondary"} store-filter" data-filter="${x}">${x==="ALL"?"ทั้งหมด":x}</button>`).join("")}</div>
      <button class="secondary" id="storeRefresh">รีเฟรช</button>
    </div>
    <div class="panel"><div class="store-list">${shown.length?shown.map(storeRowHtml).join(""):'<div class="store-empty">ยังไม่มีรายการในสถานะนี้</div>'}</div></div>`;
  document.querySelectorAll(".store-filter").forEach(b=>b.onclick=()=>{storeAccessFilter=b.dataset.filter;renderStoreAccessView()});
  document.querySelector("#storeRefresh").onclick=()=>renderStoreAccessView();
  bindStoreActions();
}

function ensureStoreAccessNav(){
  const nav=document.querySelector("aside nav");
  if(!nav||nav.querySelector('[data-view="stores"]'))return;
  const btn=document.createElement("button");
  btn.className="nav";btn.dataset.view="stores";btn.textContent="ร้านค้า / คำขอสิทธิ์";
  const analyticsBtn=nav.querySelector('[data-view="analytics"]');
  const settingsBtn=nav.querySelector('[data-view="settings"]');
  if(analyticsBtn)nav.insertBefore(btn,analyticsBtn);
  else if(settingsBtn)nav.insertBefore(btn,settingsBtn);
  else nav.appendChild(btn);
  btn.onclick=()=>render("stores");
}

function val(v){return v==null?"":String(v)}
function esc(v){return val(v).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]))}
function activeText(v){return String(v||"").toUpperCase()==="ACTIVE"}

function safeFileName(name){
  const p=name.split(".");
  const ext=(p.length>1?p.pop():"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const base=p.join(".").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,45)||"file";
  return `${base}-${Date.now()}${ext?"."+ext:""}`;
}
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const r=new FileReader();
    r.onload=()=>resolve(String(r.result).split(",")[1]||"");
    r.onerror=reject;
    r.readAsDataURL(file);
  });
}
async function uploadFile(file,kind){
  if(!file) throw new Error("กรุณาเลือกไฟล์");
  const max=kind==="pdf"?20*1024*1024:8*1024*1024;
  if(file.size>max) throw new Error(kind==="pdf"?"PDF ต้องไม่เกิน 20 MB":"รูปต้องไม่เกิน 8 MB");
  const filename=safeFileName(file.name);
  const base64=await fileToBase64(file);
  const r=await fetch(SHEET_API,{
    method:"POST",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({action:"uploadFile",kind,filename,mimeType:file.type||"",base64})
  });
  if(!r.ok) throw new Error(`HTTP ${r.status}`);
  const j=await r.json();
  if(!j.success) throw new Error(j.message||"Upload failed");
  return j;
}

async function saveCategory(payload){
  return await apiGet({
    action:"saveCategory",
    row:payload.__row||"",
    titleTH:payload.titleTH||"",
    titleEN:payload.titleEN||"",
    categoryType:payload.categoryType||"PRICE",
    sheetTab:payload.sheetTab||"",
    status:payload.status||"ACTIVE",
    dealerEnabled:payload.dealerEnabled||"TRUE",
    sort:payload.sort||"",
    image:payload.image||"",
    pdf_url:payload.pdf_url||"",
    dealer_pdf_url:payload.dealer_pdf_url||"",
    price_url:payload.price_url||"",
    autoCreate:payload.autoCreate||"0"
  });
}
async function deleteCategoryRow(row){
  return await apiGet({action:"deleteCategory",row:String(row)});
}
async function saveCategoryOrder(rows){
  return await apiGet({action:"saveCategoryOrder",rows:JSON.stringify(rows)});
}


async function loadSheetTabs(){
  if(sheetLoadState==="loading"||sheetLoadState==="ok")return;
  sheetLoadState="loading";
  try{
    const r=await fetch(`${SHEET_API}?action=tabs&t=${Date.now()}`,{cache:"no-store"});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const j=await r.json();
    const raw=Array.isArray(j)?j:(j.tabs||j.data||j.sheets||[]);
    if(!Array.isArray(raw)) throw new Error("รูปแบบข้อมูล tabs ไม่ถูกต้อง");
    sheetTabs=raw.map(x=>typeof x==="string"?x:(x.name||x.title||x.sheetTab||"")).map(x=>String(x).trim()).filter(Boolean);
    sheetLoadState="ok";
  }catch(e){
    console.warn("Tabs API not ready:",e);
    sheetTabs=[];
    sheetLoadState="unsupported";
  }
}
function liveCats(){return categoryApiData.length?categoryApiData:cats()}
function catTab(c){return String(c.sheetTab||sheetFromUrl(c.price_url)||"").trim()}
function sheetStatus(){
  const currentCats=liveCats();
  const mapped=new Set(currentCats.map(catTab).filter(Boolean));
  const tabs=new Set(sheetTabs);
  return {
    linked:sheetTabs.filter(t=>mapped.has(t)),
    unmapped:sheetTabs.filter(t=>!mapped.has(t)),
    missing:[...mapped].filter(t=>!tabs.has(t)),
    tabs:sheetTabs
  };
}
function badge(txt,type=""){return `<span class="status ${type}">${txt}</span>`}
function sheetRows(){
  if(sheetLoadState==="loading") return '<div class="empty">กำลังอ่าน Google Sheet...</div>';
  if(sheetLoadState==="unsupported") return `<div class="api-needed"><b>รอเพิ่ม Tabs API ที่ Google Apps Script</b><div>Backoffice พร้อมแล้ว แต่ Apps Script ปัจจุบันยังไม่มี <code>action=tabs</code></div></div>`;
  const s=sheetStatus();
  if(!sheetTabs.length) return '<div class="empty">ไม่พบ Sheet Tab</div>';
  return sheetTabs.map(t=>{
    const c=liveCats().find(x=>catTab(x)===t);
    return `<div class="sheet-row"><div class="grow"><b>${t}</b><div class="muted">${c?`เชื่อมกับ ${c.titleTH||c.titleEN}`:"ยังไม่มีหมวดเชื่อม"}</div></div>${c?badge("เชื่อมแล้ว","ok"):badge("รอเชื่อม","wait")}</div>`
  }).join("");
}

const content=document.querySelector('#content'), title=document.querySelector('#title'), subtitle=document.querySelector('#subtitle');let db={categories:[]};
async function load(){await Promise.all([loadCategoryApi(),(async()=>{try{const r=await fetch('../categories.json?ts='+Date.now());db=await r.json()}catch(e){console.error(e)}})()]);sheetLoadState="idle";render('dashboard')}
function cats(){return db.categories||[]}

const DASHBOARD_CACHE_KEY="leeplus_bo_dashboard_v1";
let dashboardRunId=0;

function readDashboardCache(){
  try{
    const raw=localStorage.getItem(DASHBOARD_CACHE_KEY);
    if(!raw)return null;
    const obj=JSON.parse(raw);
    return obj&&obj.data?obj:null;
  }catch(_){return null}
}
function writeDashboardCache(data){
  try{localStorage.setItem(DASHBOARD_CACHE_KEY,JSON.stringify({savedAt:Date.now(),data:data}))}catch(_){}
}
function formatDashboardDate(value){
  const s=String(value||"").trim();
  if(!s||s==="-")return "-";
  const d=new Date(s);
  if(!Number.isNaN(d.getTime())){
    return new Intl.DateTimeFormat("th-TH",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d);
  }
  return s;
}
function dashboardCacheAgeText(savedAt){
  if(!savedAt)return "ยังไม่เคยคำนวณ";
  const mins=Math.max(0,Math.floor((Date.now()-savedAt)/60000));
  if(mins<1)return "อัปเดตเมื่อสักครู่";
  if(mins<60)return `อัปเดตเมื่อ ${mins} นาทีที่แล้ว`;
  const hrs=Math.floor(mins/60);
  if(hrs<24)return `อัปเดตเมื่อ ${hrs} ชั่วโมงที่แล้ว`;
  return `อัปเดตเมื่อ ${Math.floor(hrs/24)} วันที่แล้ว`;
}
function buildLightDashboard(){
  const cats=liveCats();
  const active=cats.filter(c=>String(c.status||"ACTIVE").toUpperCase()==="ACTIVE");
  return {
    total:cats.length,active:active.length,items:null,newCount:null,tagCount:null,
    emptySheets:null,
    noImage:active.filter(c=>!String(c.image||"").trim()).length,
    noPdf:active.filter(c=>!String(c.pdf_url||"").trim()).length,
    dealerIssues:active.filter(c=>String(c.dealerEnabled??"TRUE").toUpperCase()!=="FALSE"&&!String(c.dealer_pdf_url||"").trim()).length,
    lastUpdated:"-",apiOk:true,isLight:true,
    categories:active.map(c=>({
      title:c.titleTH||c.titleEN||catTab(c)||"หมวด",tab:catTab(c),
      type:String(c.categoryType||"PRICE").toUpperCase(),count:null,updated:"-",
      image:!!String(c.image||"").trim(),pdf:!!String(c.pdf_url||"").trim(),
      dealer:String(c.dealerEnabled??"TRUE").toUpperCase()!=="FALSE",
      dealerPdf:!!String(c.dealer_pdf_url||"").trim(),empty:false,error:false
    }))
  };
}
async function loadDashboardLive(runId){
  const cats=liveCats();
  const active=cats.filter(c=>String(c.status||"ACTIVE").toUpperCase()==="ACTIVE");
  const result={total:cats.length,active:active.length,items:0,newCount:0,tagCount:0,emptySheets:0,noImage:0,noPdf:0,dealerIssues:0,lastUpdated:"-",categories:[],apiOk:true,isLight:false};
  const dates=[];
  for(let i=0;i<active.length;i+=3){
    if(runId!==dashboardRunId)throw new Error("__DASHBOARD_CANCELLED__");
    const batch=active.slice(i,i+3);
    const items=await Promise.all(batch.map(async c=>{
      const tab=catTab(c),type=String(c.categoryType||"PRICE").toUpperCase();
      const item={title:c.titleTH||c.titleEN||tab||"หมวด",tab,type,count:0,updated:"-",image:!!String(c.image||"").trim(),pdf:!!String(c.pdf_url||"").trim(),dealer:String(c.dealerEnabled??"TRUE").toUpperCase()!=="FALSE",dealerPdf:!!String(c.dealer_pdf_url||"").trim(),empty:false,error:false};
      if(!item.image)result.noImage++;
      if(!item.pdf)result.noPdf++;
      if(item.dealer&&!item.dealerPdf)result.dealerIssues++;
      if(!tab){item.empty=true;result.emptySheets++;return item}
      try{
        const j=await apiGet({action:"prices",tab:tab});
        const rows=(Array.isArray(j.data)?j.data:[]).filter(r=>Object.values(r||{}).some(v=>String(v??"").trim()!==""));
        item.count=rows.length;item.empty=!rows.length;result.items+=rows.length;if(item.empty)result.emptySheets++;
        rows.forEach(r=>{
          const text=String(r.model||r.models||"");
          if(/\bNEW\b/i.test(text))result.newCount++;
          if(/\([^()]+\)\s*$/.test(text))result.tagCount++;
          const u=String(r.updated||"").trim();if(u)dates.push(u);
        });
        const upd=rows.find(r=>String(r.updated||"").trim())?.updated;if(upd)item.updated=String(upd);
      }catch(_){item.error=true;result.apiOk=false}
      return item;
    }));
    result.categories.push(...items);
    await new Promise(r=>setTimeout(r,0));
  }
  if(runId!==dashboardRunId)throw new Error("__DASHBOARD_CANCELLED__");
  if(dates.length)result.lastUpdated=dates.sort().slice(-1)[0];
  result.categories.sort((a,b)=>String(a.title).localeCompare(String(b.title),"th"));
  writeDashboardCache(result);
  return result;
}


function dashboardStoreMs(v){
  const d=new Date(v||"");
  return Number.isNaN(d.getTime())?0:d.getTime();
}
function dashboardStoreSnapshotHtml(s){
  const latest=s.latestStore;
  const latestUsage=s.latestUsage;
  return `<div class="panel dashboard-store-wrap">
    <div class="dashboard-store-head">
      <div><h2>ร้านค้า / Store Access</h2><div class="muted" style="font-size:10px;margin-top:3px">สถานะล่าสุดของร้านค้าและการใช้งาน Retail</div></div>
      <button class="secondary" id="dashboardOpenStores">จัดการร้านค้า</button>
    </div>
    <div class="dashboard-store-grid">
      <div class="dashboard-store-stat"><span>รอตรวจสอบ</span><strong>${s.pending}</strong><small>${s.pending?`มี ${s.pending} ร้านที่ต้องดำเนินการ`:"ไม่มีคำขอค้าง"}</small></div>
      <div class="dashboard-store-stat"><span>อนุมัติแล้ว</span><strong>${s.approved}</strong><small>ร้านที่เปิดดูราคา Retail ได้</small></div>
      <div class="dashboard-store-stat"><span>Active 30 วัน</span><strong>${s.active30}</strong><small>ร้านที่มีการใช้งาน Retail ใน 30 วัน</small></div>
      <div class="dashboard-store-stat"><span>Usage 30 วัน</span><strong>${s.views}</strong><small>${s.sessions} sessions · views จากร้านที่ระบุตัวตนได้</small></div>
    </div>
    <div class="dashboard-store-latest">
      <div class="dashboard-store-box">
        <div class="label">ร้านล่าสุด</div>
        ${latest?`<b>${esc(latest.store_name||"ไม่ระบุชื่อร้าน")}</b><small>${esc(latest.province||"ไม่ระบุจังหวัด")} · ${esc(storeStatus(latest.status))}<br>สมัคร ${esc(storeDate(latest.created_at))}</small>`:'<div class="dashboard-store-empty">ยังไม่มีข้อมูลร้านค้า</div>'}
      </div>
      <div class="dashboard-store-box">
        <div class="label">Usage ล่าสุด</div>
        ${latestUsage?`<b>${esc(latestUsage.store_name||"ไม่ระบุชื่อร้าน")}</b><small>ล่าสุด ${esc(storeDate(latestUsage.last_active))}<br>${Number(latestUsage.sessions||0)} sessions · ${Number(latestUsage.views||0)} views / 30 วัน</small>`:'<div class="dashboard-store-empty">ยังไม่มี Store Analytics</div>'}
      </div>
    </div>
  </div>`;
}
async function loadDashboardStoreSnapshot(){
  const host=document.querySelector("#dashboardStoreSnapshot");
  if(!host)return;
  try{
    const [storesJ,analyticsJ]=await Promise.all([
      apiGet({action:"storesAdmin"}),
      apiGet({action:"storeAnalyticsSummary",days:"30"}).catch(()=>({data:[]}))
    ]);
    const stores=(Array.isArray(storesJ?.data)?storesJ.data:[]).map(r=>({...r,__status:storeStatus(r.status)}));
    const analytics=Array.isArray(analyticsJ?.data)?analyticsJ.data:[];
    const storeById={}; stores.forEach(r=>{if(r.store_id)storeById[r.store_id]=r});
    const approved=stores.filter(r=>r.__status==="APPROVED").length;
    const pending=stores.filter(r=>r.__status==="PENDING").length;
    const activeRows=analytics.filter(a=>dashboardStoreMs(a.last_active)>0);
    const active30=new Set(activeRows.map(a=>a.store_id).filter(Boolean)).size;
    const views=analytics.reduce((n,a)=>n+Number(a.views||0),0);
    const sessions=analytics.reduce((n,a)=>n+Number(a.sessions||0),0);
    const latestStore=[...stores].sort((a,b)=>dashboardStoreMs(b.created_at)-dashboardStoreMs(a.created_at))[0]||null;
    const latestA=[...activeRows].sort((a,b)=>dashboardStoreMs(b.last_active)-dashboardStoreMs(a.last_active))[0]||null;
    const latestUsage=latestA?{...latestA,store_name:storeById[latestA.store_id]?.store_name||latestA.store_id}:null;
    host.innerHTML=dashboardStoreSnapshotHtml({pending,approved,active30,views,sessions,latestStore,latestUsage});
    document.querySelector("#dashboardOpenStores")?.addEventListener("click",()=>render("stores"));
  }catch(err){
    console.warn("Dashboard Store Snapshot failed:",err);
    host.innerHTML=`<div class="panel dashboard-store-wrap"><div class="dashboard-store-head"><div><h2>ร้านค้า / Store Access</h2><div class="muted" style="font-size:10px;margin-top:3px">โหลดข้อมูลร้านค้าไม่สำเร็จ</div></div><button class="secondary" id="dashboardOpenStores">จัดการร้านค้า</button></div></div>`;
    document.querySelector("#dashboardOpenStores")?.addEventListener("click",()=>render("stores"));
  }
}

function dashboardBadge(text,type=""){return `<span class="smart-badge ${type}">${text}</span>`}
function dashboardValue(v){return v===null||v===undefined?"—":v}
function renderDashboardData(d,meta={}){
  const issueCount=(Number(d.emptySheets)||0)+(Number(d.noImage)||0)+(Number(d.dealerIssues)||0);
  content.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap">
      <div class="muted" style="font-size:11px">${meta.cacheText||""}${d.isLight?" · แสดงข้อมูลพื้นฐานก่อนเพื่อให้ Backoffice เปิดเร็ว":""}</div>
      <button class="primary" id="refreshDashboardBtn">รีเฟรชข้อมูล Dashboard</button>
    </div>
    <div id="dashboardStoreSnapshot"><div class="panel dashboard-store-wrap"><div class="dashboard-store-head"><div><h2>ร้านค้า / Store Access</h2><div class="muted" style="font-size:10px;margin-top:3px">กำลังโหลดสถานะร้านค้า...</div></div><button class="secondary" data-go="stores">จัดการร้านค้า</button></div></div></div>
    <div class="cards">
      <div class="card"><span class="muted">หมวดเปิดใช้งาน</span><strong>${dashboardValue(d.active)}</strong><small>จากทั้งหมด ${dashboardValue(d.total)} หมวด</small></div>
      <div class="card"><span class="muted">รายการข้อมูลรวม</span><strong>${dashboardValue(d.items)}</strong><small>${d.isLight?"กดรีเฟรชเพื่อคำนวณ":"ข้อมูลจากทุก Sheet"}</small></div>
      <div class="card"><span class="muted">NEW / Tag</span><strong>${dashboardValue(d.newCount)} / ${dashboardValue(d.tagCount)}</strong><small>รายการใหม่ / ข้อความเน้นในวงเล็บ</small></div>
      <div class="card"><span class="muted">ต้องตรวจสอบ</span><strong>${d.isLight?"—":issueCount}</strong><small>Sheet ว่าง / รูป / Dealer</small></div>
    </div>
    <div class="dashboard-health-grid">
      <div class="panel">
        <h2>สถานะหมวดสินค้า</h2>
        <div class="smart-list">
          ${(d.categories||[]).map(c=>`<div class="smart-item">
            <div class="smart-item-main"><b>${esc(c.title)}</b><small>${esc(c.tab||"ยังไม่เชื่อม Sheet")} · ${c.type==="COMPATIBILITY"?"Compatibility":c.type==="VISUAL_CATALOG"?"Visual Catalog":"Price List"} · อัปเดต ${esc(formatDashboardDate(c.updated))}</small></div>
            <div class="smart-badges">
              ${c.count===null?dashboardBadge("ยังไม่คำนวณ"):dashboardBadge(c.count+" รายการ",c.empty?"warn":"ok")}
              ${dashboardBadge(c.image?"รูป ✓":"ไม่มีรูป",c.image?"ok":"warn")}
              ${dashboardBadge(c.pdf?"PDF ✓":"ไม่มี PDF",c.pdf?"ok":"warn")}
              ${c.dealer?dashboardBadge(c.dealerPdf?"Dealer ✓":"Dealer PDF ?",c.dealerPdf?"ok":"warn"):dashboardBadge("Dealer ปิด")}
              ${c.error?dashboardBadge("API Error","bad"):""}
            </div>
          </div>`).join("")}
        </div>
      </div>
      <div>
        <div class="panel" style="margin-bottom:14px">
          <h2>System Health</h2>
          <div class="health-row"><span><i class="health-dot ${d.apiOk?"ok":"bad"}"></i>Google Sheet API</span><b>${d.apiOk?"พร้อมใช้งาน":"มีข้อผิดพลาด"}</b></div>
          <div class="health-row"><span><i class="health-dot ${Number(d.emptySheets)?"warn":"ok"}"></i>Sheet ว่าง</span><b>${dashboardValue(d.emptySheets)}</b></div>
          <div class="health-row"><span><i class="health-dot ${Number(d.noImage)?"warn":"ok"}"></i>หมวดไม่มีรูป</span><b>${dashboardValue(d.noImage)}</b></div>
          <div class="health-row"><span><i class="health-dot ${Number(d.noPdf)?"warn":"ok"}"></i>หมวดไม่มี PDF</span><b>${dashboardValue(d.noPdf)}</b></div>
          <div class="health-row"><span><i class="health-dot ${Number(d.dealerIssues)?"warn":"ok"}"></i>Dealer ยังไม่ครบ</span><b>${dashboardValue(d.dealerIssues)}</b></div>
          <div class="health-row"><span><i class="health-dot ok"></i>อัปเดตข้อมูลล่าสุด</span><b>${esc(formatDashboardDate(d.lastUpdated))}</b></div>
        </div>
        <div class="panel">
          <h2>เข้าถึงงานเร็ว</h2>
          <div class="dashboard-actions">
            <button class="primary" data-go="categories">จัดการหมวด</button>
            <button class="secondary" data-go="media">รูปและสื่อ</button>
            <button class="secondary" data-go="pdf">ไฟล์ PDF</button>
            <button class="secondary" data-go="settings">ตั้งค่าเว็บไซต์</button>
          </div>
        </div>
      </div>
    </div>`;
  document.querySelector("#refreshDashboardBtn")?.addEventListener("click",refreshDashboardHeavy);
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>render(b.dataset.go));
  loadDashboardStoreSnapshot();
}
function renderLiveDashboard(){
  title.textContent='ภาพรวม';subtitle.textContent='สถานะระบบและข้อมูลล่าสุดจาก Google Sheet';
  const cached=readDashboardCache();
  if(cached?.data)renderDashboardData(cached.data,{cacheText:dashboardCacheAgeText(cached.savedAt)});
  else renderDashboardData(buildLightDashboard(),{cacheText:"ยังไม่มี Dashboard cache"});
}
async function refreshDashboardHeavy(){
  const runId=++dashboardRunId;
  const btn=document.querySelector("#refreshDashboardBtn");if(btn){btn.disabled=true;btn.textContent="กำลังคำนวณ..."}
  try{
    const d=await loadDashboardLive(runId);
    const active=[...document.querySelectorAll(".nav")].some(b=>b.dataset.view==="dashboard"&&b.classList.contains("active"));
    if(active)renderDashboardData(d,{cacheText:"อัปเดตเมื่อสักครู่"});
  }catch(err){
    if(String(err?.message||err)!=="__DASHBOARD_CANCELLED__")console.warn(err);
  }finally{if(btn){btn.disabled=false;btn.textContent="รีเฟรชข้อมูล Dashboard"}}
}


function ensureAnalyticsNav(){
  const nav=document.querySelector("aside nav");
  if(!nav||nav.querySelector('[data-view="analytics"]'))return;
  const btn=document.createElement("button");
  btn.className="nav";
  btn.dataset.view="analytics";
  btn.textContent="Analytics";
  const settingsBtn=nav.querySelector('[data-view="settings"]');
  if(settingsBtn)nav.insertBefore(btn,settingsBtn);
  else nav.appendChild(btn);
  btn.onclick=()=>render("analytics");
}

function formatAnalyticsNumber(v){
  const n=Number(v||0);
  return Number.isFinite(n)?new Intl.NumberFormat("th-TH").format(n):"0";
}

function formatAnalyticsSeconds(v){
  const s=Math.max(0,Number(v||0));
  if(s<60)return `${Math.round(s)} วิ`;
  const m=Math.floor(s/60),sec=Math.round(s%60);
  return `${m} นาที ${sec} วิ`;
}

function analyticsDateLabel(s){
  const d=new Date(String(s||"")+"T00:00:00");
  if(Number.isNaN(d.getTime()))return String(s||"");
  return new Intl.DateTimeFormat("th-TH",{day:"2-digit",month:"2-digit"}).format(d);
}

function analyticsListHtml(items,emptyText){
  if(!Array.isArray(items)||!items.length)return `<div class="analytics-empty">${emptyText}</div>`;
  return `<div class="analytics-list">${items.map(x=>`
    <div class="analytics-row">
      <b>${esc(x.name||"-")}</b>
      <span>${formatAnalyticsNumber(x.count)}</span>
    </div>`).join("")}</div>`;
}

function analyticsDailyChartHtml(items){
  if(!Array.isArray(items)||!items.length)return '<div class="analytics-empty">ยังไม่มีข้อมูลรายวัน</div>';
  // ตัดวันว่างก่อน Analytics เริ่มมีข้อมูลจริงออก เพื่อไม่ให้กราฟ 30/90 วันมีเส้น 0 ยาวเกินจำเป็น
  const firstActive=items.findIndex(x=>Number(x.views||0)>0 || Number(x.visitors||0)>0);
  if(firstActive<0)return '<div class="analytics-empty">ยังไม่มี Views ในช่วงเวลานี้</div>';
  items=items.slice(firstActive);
  const values=items.map(x=>Math.max(0,Number(x.views||0)));
  const max=Math.max(1,...values);
  const W=760,H=230,padL=42,padR=18,padT=18,padB=38;
  const plotW=W-padL-padR,plotH=H-padT-padB;
  const x=i=>items.length<=1?padL+plotW/2:padL+(i/(items.length-1))*plotW;
  const y=v=>padT+plotH-(Math.max(0,v)/max)*plotH;
  const points=values.map((v,i)=>`${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area=`${padL},${padT+plotH} ${points} ${x(items.length-1).toFixed(1)},${padT+plotH}`;
  const ticks=4;
  const grid=Array.from({length:ticks+1},(_,i)=>{
    const val=Math.round(max*(ticks-i)/ticks);
    const yy=padT+(plotH*i/ticks);
    return `<line x1="${padL}" y1="${yy}" x2="${W-padR}" y2="${yy}" class="analytics-chart-grid"/>
      <text x="${padL-8}" y="${yy+4}" class="analytics-chart-y">${formatAnalyticsNumber(val)}</text>`;
  }).join("");
  const step=Math.max(1,Math.ceil(items.length/6));
  const labels=items.map((it,i)=>{
    if(i!==0 && i!==items.length-1 && i%step!==0)return "";
    return `<text x="${x(i)}" y="${H-10}" class="analytics-chart-x">${esc(analyticsDateLabel(it.date))}</text>`;
  }).join("");
  const dots=items.map((it,i)=>{
    const cx=x(i),cy=y(values[i]);
    const title=`${analyticsDateLabel(it.date)} · ${formatAnalyticsNumber(values[i])} Views · ${formatAnalyticsNumber(it.visitors||0)} Users`;
    return `<circle cx="${cx}" cy="${cy}" r="4.5" class="analytics-chart-dot"><title>${esc(title)}</title></circle>`;
  }).join("");
  const latest=values.length?values[values.length-1]:0;
  const best=Math.max(...values);
  const avg=values.length?values.reduce((a,b)=>a+b,0)/values.length:0;
  return `
    <div class="analytics-chart-summary">
      <span><b>${formatAnalyticsNumber(latest)}</b><small>ล่าสุด</small></span>
      <span><b>${formatAnalyticsNumber(best)}</b><small>สูงสุด/วัน</small></span>
      <span><b>${formatAnalyticsNumber(avg.toFixed(1))}</b><small>เฉลี่ย/วัน</small></span>
    </div>
    <div class="analytics-chart-scroll">
      <svg class="analytics-line-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="กราฟ Views รายวัน">
        ${grid}
        <polygon points="${area}" class="analytics-chart-area"></polygon>
        <polyline points="${points}" class="analytics-chart-line"></polyline>
        ${dots}
        ${labels}
      </svg>
    </div>`;
}

function analyticsProvinceHtml(items){
  if(!Array.isArray(items)||!items.length)return '<div class="analytics-empty">เริ่มเก็บข้อมูลจังหวัดแล้ว · ข้อมูลเก่าก่อนเปิด Geo จะไม่แสดงจังหวัด</div>';
  const ranked=items.slice().sort((a,b)=>(Number(b.users||0)-Number(a.users||0))||(Number(b.views||0)-Number(a.views||0))).slice(0,12);
  const maxUsers=Math.max(1,...ranked.map(x=>Number(x.users||0)));
  return `<div class="analytics-province-list">
    ${ranked.map((x,i)=>{
      const pct=Math.max(3,Math.round(Number(x.users||0)/maxUsers*100));
      return `<div class="analytics-province-row">
        <div class="analytics-province-rank">${i+1}</div>
        <div class="analytics-province-name"><b>${esc(x.name||"-")}</b><div class="analytics-province-meta">${formatAnalyticsNumber(x.users)} ผู้ใช้ · ${formatAnalyticsNumber(x.views)} Views</div><div class="analytics-province-track"><i style="width:${pct}%"></i></div></div>
      </div>`;
    }).join("")}
  </div>`;
}

async function loadAnalyticsSummary(days=30){
  const j=await apiGet({action:"analyticsSummary",days:String(days)});
  if(!j||j.success===false)throw new Error(j?.message||"Analytics API failed");
  return j.data||{};
}

function renderAnalyticsData(d,days){
  const totalViews=Number(d.views||0);
  const retail=Number(d.retailViews||0);
  const dealer=Number(d.dealerViews||0);
  const retailPct=totalViews?Math.round(retail/totalViews*100):0;
  const dealerPct=totalViews?Math.round(dealer/totalViews*100):0;
  const peak=d.peakHour===null||d.peakHour===undefined?"—":`${String(d.peakHour).padStart(2,"0")}:00–${String((Number(d.peakHour)+1)%24).padStart(2,"0")}:00`;

  content.innerHTML=`
    <div class="analytics-toolbar">
      <div class="left">
        <label><b>ช่วงข้อมูล</b> 
          <select id="analyticsDays">
            <option value="7" ${Number(days)===7?"selected":""}>7 วัน</option>
            <option value="30" ${Number(days)===30?"selected":""}>30 วัน</option>
            <option value="90" ${Number(days)===90?"selected":""}>90 วัน</option>
          </select>
        </label>
        <span class="analytics-note">อัปเดตจาก Analytics Sheet โดยตรง</span>
      </div>
      <button class="primary" id="refreshAnalyticsBtn">รีเฟรช</button>
    </div>

    <div class="analytics-grid">
      <div class="analytics-stat"><span>ผู้ใช้วันนี้</span><strong>${formatAnalyticsNumber(d.todayVisitors)}</strong><small>Unique Visitors</small></div>
      <div class="analytics-stat"><span>Views วันนี้</span><strong>${formatAnalyticsNumber(d.todayViews)}</strong><small>Page views</small></div>
      <div class="analytics-stat"><span>Sessions วันนี้</span><strong>${formatAnalyticsNumber(d.todaySessions)}</strong><small>Session 30 นาที</small></div>
      <div class="analytics-stat"><span>ผู้ใช้ ${days} วัน</span><strong>${formatAnalyticsNumber(d.uniqueVisitors)}</strong><small>${formatAnalyticsNumber(d.views)} views ทั้งหมด</small></div>
      <div class="analytics-stat"><span>Retail</span><strong>${formatAnalyticsNumber(retail)}</strong><small>${retailPct}% ของ Views</small></div>
      <div class="analytics-stat"><span>Dealer</span><strong>${formatAnalyticsNumber(dealer)}</strong><small>${dealerPct}% ของ Views</small></div>
      <div class="analytics-stat"><span>เวลาใช้งานเฉลี่ย</span><strong>${formatAnalyticsSeconds(d.avgEngagementSec)}</strong><small>จาก engagement event</small></div>
      <div class="analytics-stat"><span>ช่วงเวลาคนเข้าเยอะสุด</span><strong style="font-size:22px">${esc(peak)}</strong><small>อิงจาก Views</small></div>
    </div>

    <div class="analytics-layout">
      <div>
        <div class="panel" style="margin-bottom:14px">
          <h2>Views รายวัน</h2>
          ${analyticsDailyChartHtml(d.daily)}
        </div>
        <div class="panel" style="margin-bottom:14px">
          <h2>พื้นที่ผู้ใช้งาน</h2>
          <div class="analytics-note" style="margin-bottom:10px">นับผู้ใช้แบบ Unique Visitor · จังหวัดจาก Geo-IP · ไม่เก็บ IP</div>
          ${analyticsProvinceHtml(d.provinces)}
        </div>
        <div class="panel">
          <h2>หมวดที่เปิดดูมากที่สุด</h2>
          ${analyticsListHtml(d.topCategories,"ยังไม่มีข้อมูลหมวด")}
        </div>
      </div>
      <div>
        <div class="panel" style="margin-bottom:14px">
          <h2>Event ที่เกิดมากที่สุด</h2>
          ${analyticsListHtml(d.topEvents,"ยังไม่มี Event")}
        </div>
        <div class="panel">
          <h2>สรุปช่วง ${days} วัน</h2>
          <div class="health-row"><span>Total Events</span><b>${formatAnalyticsNumber(d.totalEvents)}</b></div>
          <div class="health-row"><span>Total Views</span><b>${formatAnalyticsNumber(d.views)}</b></div>
          <div class="health-row"><span>Unique Visitors</span><b>${formatAnalyticsNumber(d.uniqueVisitors)}</b></div>
          <div class="health-row"><span>Sessions</span><b>${formatAnalyticsNumber(d.sessions)}</b></div>
        </div>
      </div>
    </div>`;

  document.querySelector("#analyticsDays")?.addEventListener("change",e=>renderAnalyticsView(Number(e.target.value)||30));
  document.querySelector("#refreshAnalyticsBtn")?.addEventListener("click",()=>renderAnalyticsView(days,true));
}

async function renderAnalyticsView(days=30,force=false){
  title.textContent="Analytics";
  subtitle.textContent="ดูจำนวนผู้ใช้งานและพฤติกรรมการเข้าเว็บ LEEPLUS";
  content.innerHTML='<div class="panel"><div class="empty">กำลังโหลด Analytics...</div></div>';
  try{
    const d=await loadAnalyticsSummary(days);
    renderAnalyticsData(d,days);
  }catch(err){
    console.warn("Analytics load failed:",err);
    content.innerHTML=`<div class="panel"><div class="empty">โหลด Analytics ไม่สำเร็จ<br><small>${esc(err?.message||String(err))}</small></div></div>`;
  }
}


const views={dashboard(){renderLiveDashboard()},analytics(){renderAnalyticsView(30)},stores(){renderStoreAccessView()},categories(){title.textContent='หมวดสินค้า';subtitle.textContent='เพิ่ม แก้ไข เปิด-ปิด และเชื่อม Sheet Tab';content.innerHTML=`
<div class="cat-toolbar"><button class="primary" id="addCategory">+ เพิ่มหมวดสินค้า</button><button class="secondary" id="reloadCats">รีเฟรช</button></div>
<div class="panel"><h2>รายการหมวดสินค้า</h2><div id="catAdminRows">${categoryAdminRows()}</div></div>
<div id="categoryModal" class="modal hidden"><div class="modal-card">
  <div class="modal-head"><h2 id="modalTitle">เพิ่มหมวดสินค้า</h2><button id="closeModal" class="icon-btn">×</button></div>
  <form id="categoryForm">
    <input type="hidden" id="catRow">
    <div class="form-grid">
      <label>ชื่อหมวดภาษาไทย<input id="catTH" required></label>
      <label>ชื่อหมวดภาษาอังกฤษ<input id="catEN"></label>
      <label>รูปแบบรายการ
        <select id="catType">
          <option value="PRICE">รายการราคา</option>
          <option value="COMPATIBILITY">รายการรุ่น / Compatibility</option>\n          <option value="VISUAL_CATALOG">Visual Catalog / รูป + รุ่น + สี</option>
        </select>
        <small class="field-note">หมวดใหม่จะสร้าง Google Sheet ตามรูปแบบที่เลือก</small>
      </label>
      <label id="catTabField">Google Sheet Tab<select id="catTab"><option value="">-- ยังไม่เชื่อม --</option></select><small class="field-note">ใช้สำหรับสลับหมวดเดิมไปยัง Sheet Tab อื่น</small></label>
      <label>สถานะ<select id="catStatus"><option value="ACTIVE">เปิดใช้งาน</option><option value="INACTIVE">ปิดใช้งาน</option></select></label><label>หน้าตัวแทนจำหน่าย<select id="catDealerEnabled"><option value="TRUE">แสดงราคาตัวแทน</option><option value="FALSE">ซ่อนจากหน้าตัวแทน</option></select><small class="field-note">ถ้าปิด Card หมวดนี้จะไม่แสดงในหน้า Dealer</small></label>
      <label>ลำดับ<input id="catSort" type="number" min="1"></label>
      <label>รูปหมวด
        <div class="upload-field"><input id="catImage" placeholder="/assets/... หรือ https://..."><button type="button" class="library-btn" data-picker="image">เลือกจากคลัง</button><button type="button" class="upload-btn" data-kind="image">อัปโหลดรูป</button></div>
        <input id="imageFile" class="file-hidden" type="file" accept="image/png,image/jpeg,image/webp,image/gif">
        <div id="imagePreview" class="upload-preview"></div>
      </label>
      <label>ไฟล์ PDF
        <div class="upload-field"><input id="catPdf" placeholder="/assets/uploads/pdfs/..."><button type="button" class="library-btn" data-picker="pdf">เลือกจากคลัง</button><button type="button" class="upload-btn" data-kind="pdf">อัปโหลด PDF</button></div>
        <input id="pdfFile" class="file-hidden" type="file" accept="application/pdf"><input id="dealerPdfFile" class="file-hidden" type="file" accept="application/pdf">
        <div id="pdfPreview" class="upload-preview"></div>
      </label>
<label>PDF ราคาตัวแทนจำหน่าย
  <div class="upload-field">
    <input id="catDealerPdf" placeholder="เลือก PDF สำหรับหน้าตัวแทน">
    <button type="button" class="library-btn" data-picker="dealerPdf">เลือกจากคลัง</button>
    <button type="button" class="upload-btn dealer-pdf-upload">อัปโหลด PDF</button>
  </div>
  <div id="dealerPdfPreview" class="upload-preview"></div>
  <small class="field-note">ถ้าไม่เลือก PDF หน้าตัวแทนจะไม่แสดงปุ่ม PDF</small>
</label>
      <input id="catPrice" type="hidden">
    </div>
    <div class="form-actions"><button type="button" class="danger hidden" id="deleteCat">ลบหมวด</button><div class="spacer"></div><button type="button" class="secondary" id="cancelCat">ยกเลิก</button><button type="submit" class="primary">บันทึก</button></div>
    <div id="formMsg" class="form-msg"></div>
  </form>
</div></div>
<div id="libraryPicker" class="picker-modal hidden">
  <div class="picker-card">
    <div class="modal-head"><div><h2 id="pickerTitle">เลือกจากคลัง</h2><div class="muted" id="pickerSubtitle"></div></div><button type="button" id="closePicker" class="icon-btn">×</button></div>
    <div id="pickerBody" class="picker-body"><div class="empty">กำลังโหลด...</div></div>
  </div>
</div>`;
bindCategoryAdmin()},media(){renderMediaView()},pdf(){renderPdfView()},async sheet(){
    await loadCategoryApi();title.textContent='Google Sheet';subtitle.textContent='ตรวจสอบการเชื่อมหมวดสินค้ากับ Tab ใน Google Sheet';const s=sheetStatus();content.innerHTML=`<div class="sheet-tools"><button class="refresh-sheet" id="refreshSheet">รีเฟรชจาก Google Sheet</button><div class="sheet-counts">${badge(`เชื่อมแล้ว ${s.linked.length}`,"ok")} ${badge(`Tab ยังไม่ผูก ${s.unmapped.length}`,"wait")} ${badge(`Mapping หา Tab ไม่เจอ ${s.missing.length}`,"bad")}</div></div><div class="panel"><h2>Sheet Tabs</h2><div id="sheetRows">${sheetRows()}</div></div>${s.missing.length?`<div class="panel"><h2>Mapping ที่หา Tab ไม่เจอ</h2>${s.missing.map(t=>`<div class="sheet-row"><div class="grow"><b>${t}</b><div class="muted">ตรวจชื่อ Tab หรือแก้ Mapping</div></div>${badge("ไม่พบ Tab","bad")}</div>`).join("")}</div>`:""}`;document.querySelector("#refreshSheet")?.addEventListener("click",async()=>{await Promise.all([loadSheetTabs(),loadCategoryApi()]);views.sheet()})},
settings(){renderSettingsView()}
};
function rows(a){return a.length?a.map(x=>`<div class="row">${x.image?`<img class="thumb" src="${x.image}">`:'<div class="thumb"></div>'}<div class="grow"><b>${x.titleTH||x.titleEN||'-'}</b><div class="muted">${x.titleEN||''}</div></div><span class="tag">${x.sheetTab||sheetFromUrl(x.price_url)||'ยังไม่ผูก Sheet'}</span></div>`).join(''):'<div class="empty">ยังไม่มีข้อมูล</div>'}
function sheetFromUrl(u=''){try{return new URL(u,location.href).searchParams.get('tab')||''}catch{return''}}

function categoryAdminRows(){
  const arr=categoryApiData.length?categoryApiData:cats().map((x,i)=>({...x,__row:i+2}));
  if(!arr.length) return '<div class="empty">ยังไม่มีหมวดสินค้า</div>';
  return arr.map((x,i)=>`<div class="cat-admin-row" data-i="${i}" data-row="${esc(x.__row||"")}" draggable="true">\n    <div class="cat-order drag-handle" title="ลากเพื่อจัดลำดับ">⠿</div>
    ${x.image?`<img class="thumb" src="${esc(x.image)}">`:'<div class="thumb"></div>'}
    <div class="grow"><b>${esc(x.titleTH||x.titleEN||"-")}</b><div class="muted">${esc(x.titleEN||"")} · ${esc(x.sheetTab||sheetFromUrl(x.price_url)||"ยังไม่ผูก Sheet")}</div></div>
    ${activeText(x.status||"ACTIVE")?badge("เปิด","ok"):badge("ปิด","bad")} ${String(x.dealerEnabled??x.dealer_enabled??"TRUE").toUpperCase()==="FALSE"?badge("Dealer ปิด","bad"):badge("Dealer เปิด","ok")}
    <button class="edit-cat" data-i="${i}">แก้ไข</button>
  </div>`).join("");
}

async function handleUpload(file,kind){
  if(!file)return;
  const msg=document.querySelector("#formMsg"), btn=document.querySelector(`.upload-btn[data-kind="${kind}"]`);
  const old=btn.textContent;btn.disabled=true;btn.textContent="กำลังอัปโหลด...";msg.textContent="";
  try{
    const j=await uploadFile(file,kind);
    const input=document.querySelector(kind==="image"?"#catImage":"#catPdf");
    input.value=j.url;
    updateUploadPreview(kind,j.url);
    msg.classList.add("success");msg.textContent="อัปโหลดสำเร็จ";
  }catch(err){
    msg.classList.remove("success");msg.textContent="อัปโหลดไม่สำเร็จ: "+err.message;
  }finally{btn.disabled=false;btn.textContent=old}
}
function updateUploadPreview(kind,url){
  const box=document.querySelector(kind==="image"?"#imagePreview":kind==="dealerPdf"?"#dealerPdfPreview":"#pdfPreview");
  if(!box)return;
  if(!url){box.innerHTML="";return}
  box.innerHTML=kind==="image"?`<img src="${esc(url)}"><span>ไฟล์พร้อมใช้งาน</span>`:`<a href="${esc(url)}" target="_blank">เปิด PDF ที่อัปโหลด</a>`;
}


async function openLibraryPicker(kind){
  const modal=document.querySelector("#libraryPicker");
  const body=document.querySelector("#pickerBody");
  const titleEl=document.querySelector("#pickerTitle");
  const sub=document.querySelector("#pickerSubtitle");
  modal.classList.remove("hidden");
  titleEl.textContent=kind==="image"?"เลือกรูปจากคลัง":"เลือก PDF จากคลัง";
  sub.textContent=kind==="image"?"เลือกรูปแล้วระบบจะผูกเข้าหมวดทันทีในฟอร์ม":"เลือก PDF แล้วระบบจะผูกเข้าหมวดทันทีในฟอร์ม";
  body.innerHTML='<div class="empty">กำลังโหลด...</div>';

  try{
    if(kind==="image"){
      await loadMediaLibrary();
      if(!mediaFiles.length){
        body.innerHTML='<div class="empty">ยังไม่มีรูปในคลัง</div>';
      }else{
        body.innerHTML=`<div class="picker-grid">${mediaFiles.map(f=>`
          <button type="button" class="picker-image-item" data-url="${esc(f.url)}">
            <span class="picker-thumb"><img src="${esc(f.url)}" alt=""></span>
            <span class="picker-name">${esc(f.name||"รูป")}</span>
          </button>`).join("")}</div>`;
        body.querySelectorAll(".picker-image-item").forEach(b=>b.onclick=()=>{
          document.querySelector("#catImage").value=b.dataset.url;
          updateUploadPreview("image",b.dataset.url);
          closeLibraryPicker();
        });
      }
    }else{
      await loadPdfLibrary();
      if(!pdfFiles.length){
        body.innerHTML='<div class="empty">ยังไม่มี PDF ในคลัง</div>';
      }else{
        body.innerHTML=`<div class="picker-pdf-list">${pdfFiles.map(f=>`
          <button type="button" class="picker-pdf-item" data-url="${esc(f.url)}">
            <span class="picker-pdf-icon">PDF</span>
            <span class="picker-pdf-text"><b>${esc(f.name||"PDF")}</b><small>${formatBytes(f.size)}</small></span>
            <span class="picker-select">เลือก</span>
          </button>`).join("")}</div>`;
        body.querySelectorAll(".picker-pdf-item").forEach(b=>b.onclick=()=>{
          const target=kind==="dealerPdf"?"#catDealerPdf":"#catPdf";
          document.querySelector(target).value=b.dataset.url;
          updateUploadPreview(kind==="dealerPdf"?"dealerPdf":"pdf",b.dataset.url);
          closeLibraryPicker();
        });
      }
    }
  }catch(err){
    body.innerHTML=`<div class="api-needed">โหลดคลังไม่สำเร็จ: ${esc(err.message||err)}</div>`;
  }
}
function closeLibraryPicker(){
  document.querySelector("#libraryPicker")?.classList.add("hidden");
}

function bindCategoryAdmin(){
  document.querySelector("#addCategory")?.addEventListener("click",()=>openCategoryModal());
  document.querySelector("#reloadCats")?.addEventListener("click",async()=>{await Promise.all([loadCategoryApi(),loadSheetTabs()]);views.categories()});
  document.querySelectorAll(".edit-cat").forEach(b=>b.addEventListener("click",()=>openCategoryModal(categoryApiData[Number(b.dataset.i)])));
  bindCategoryDragSort();
}
function bindCategoryDragSort(){
  const list=document.querySelector(".cat-admin-list");
  const rows=[...document.querySelectorAll(".cat-admin-row")];
  if(!rows.length)return;
  let dragging=null;
  rows.forEach(row=>{
    row.addEventListener("dragstart",e=>{dragging=row;row.classList.add("dragging");e.dataTransfer.effectAllowed="move"});
    row.addEventListener("dragend",()=>{row.classList.remove("dragging");dragging=null;saveCurrentCategoryOrder()});
    row.addEventListener("dragover",e=>{
      e.preventDefault();if(!dragging||dragging===row)return;
      const rect=row.getBoundingClientRect(),after=e.clientY>rect.top+rect.height/2;
      row.parentNode.insertBefore(dragging,after?row.nextSibling:row);
    });
    row.addEventListener("touchstart",()=>row.classList.add("touch-ready"),{passive:true});
  });
}
let categoryOrderSaving=false;
async function saveCurrentCategoryOrder(){
  if(categoryOrderSaving)return;
  const rows=[...document.querySelectorAll(".cat-admin-row")].map((el,i)=>({row:Number(el.dataset.row||0),sort:i+1})).filter(x=>x.row>=2);
  if(!rows.length)return;
  categoryOrderSaving=true;
  const msg=document.querySelector("#categoryOrderMsg");if(msg)msg.textContent="กำลังบันทึกลำดับ...";
  try{
    await saveCategoryOrder(rows);
    await loadCategoryApi();
    if(msg){msg.className="media-msg success";msg.textContent="บันทึกลำดับแล้ว"}
  }catch(err){
    if(msg){msg.className="media-msg error";msg.textContent="บันทึกลำดับไม่สำเร็จ: "+err.message}
  }finally{categoryOrderSaving=false}
}
async function openCategoryModal(x=null){
  const modal=document.querySelector("#categoryModal"), del=document.querySelector("#deleteCat");
  modal.classList.remove("hidden");
  document.querySelector("#modalTitle").textContent=x?"แก้ไขหมวดสินค้า":"เพิ่มหมวดสินค้า";
  document.querySelector("#catRow").value=x?.__row||"";
  document.querySelector("#catTH").value=x?.titleTH||"";
  document.querySelector("#catEN").value=x?.titleEN||"";
  const catTypeEl=document.querySelector("#catType");
  {
    const t=String(x?.categoryType||"PRICE").toUpperCase();
    catTypeEl.value=["PRICE","COMPATIBILITY","VISUAL_CATALOG"].includes(t)?t:"PRICE";
  }
  catTypeEl.disabled=!!x?.__row;
  const tabField=document.querySelector("#catTabField"), tabSelect=document.querySelector("#catTab");
  if(x){
    tabField.classList.remove("hidden");
    await loadSheetTabs();
    const currentTab=x?.sheetTab||sheetFromUrl(x?.price_url)||"";
    const allTabs=[...new Set([currentTab,...sheetTabs].filter(Boolean))];
    tabSelect.innerHTML='<option value="">-- ยังไม่เชื่อม --</option>'+allTabs.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("");
    tabSelect.value=currentTab;
  }else{
    tabField.classList.add("hidden");
    tabSelect.innerHTML='<option value="">-- สร้าง Tab อัตโนมัติ --</option>';
    tabSelect.value="";
  }
  document.querySelector("#catStatus").value=(x?.status||"ACTIVE").toUpperCase()==="ACTIVE"?"ACTIVE":"INACTIVE";document.querySelector("#catDealerEnabled").value=String(x?.dealerEnabled??x?.dealer_enabled??"TRUE").toUpperCase()==="FALSE"?"FALSE":"TRUE";
  document.querySelector("#catSort").value=x?.sort||"";
  document.querySelector("#catImage").value=x?.image||"";
  document.querySelector("#catPdf").value=x?.pdf_url||"";
  document.querySelector("#catDealerPdf").value=x?.dealer_pdf_url||"";
  document.querySelector("#catPrice").value=x?.price_url||"";
  updateUploadPreview("image",x?.image||"");updateUploadPreview("pdf",x?.pdf_url||"");
  document.querySelectorAll(".upload-btn").forEach(btn=>btn.onclick=()=>document.querySelector(btn.dataset.kind==="image"?"#imageFile":"#pdfFile").click());
  document.querySelector(".dealer-pdf-upload")?.addEventListener("click",()=>document.querySelector("#dealerPdfFile")?.click());
  document.querySelectorAll(".library-btn").forEach(btn=>btn.onclick=()=>openLibraryPicker(btn.dataset.picker));
  document.querySelector("#closePicker").onclick=closeLibraryPicker;
  document.querySelector("#libraryPicker").onclick=e=>{if(e.target.id==="libraryPicker")closeLibraryPicker()};
  document.querySelector("#imageFile").onchange=e=>handleUpload(e.target.files[0],"image");
  document.querySelector("#pdfFile").onchange=e=>handleUpload(e.target.files[0],"pdf");
  document.querySelector("#dealerPdfFile").onchange=async e=>{
    const file=e.target.files[0]; if(!file)return;
    const result=await uploadFile(file,"pdf");
    document.querySelector("#catDealerPdf").value=result.url;
    updateUploadPreview("dealerPdf",result.url);
    e.target.value="";
  };
  del.classList.toggle("hidden",!x?.__row);
  const close=()=>modal.classList.add("hidden");
  document.querySelector("#closeModal").onclick=close;document.querySelector("#cancelCat").onclick=close;
  document.querySelector("#categoryForm").onsubmit=async e=>{
    e.preventDefault();const msg=document.querySelector("#formMsg");msg.textContent="กำลังบันทึก...";
    try{
      const tab=document.querySelector("#catTab").value;
      let price=document.querySelector("#catPrice").value.trim();
      if(tab && !price) price=`price_sheet.html?tab=${encodeURIComponent(tab)}`;
      await saveCategory({
        __row:document.querySelector("#catRow").value,
        titleTH:document.querySelector("#catTH").value.trim(),
        titleEN:document.querySelector("#catEN").value.trim(),
        categoryType:document.querySelector("#catType").value,
        sheetTab:tab,
        status:document.querySelector("#catStatus").value,
        dealerEnabled:document.querySelector("#catDealerEnabled").value,
        sort:document.querySelector("#catSort").value,
        image:document.querySelector("#catImage").value.trim(),
        pdf_url:document.querySelector("#catPdf").value.trim(),
        dealer_pdf_url:document.querySelector("#catDealerPdf").value.trim(),
        price_url:price,
        autoCreate:document.querySelector("#catRow").value?"0":"1"
      });
      await loadCategoryApi();close();views.categories();
    }catch(err){msg.textContent="บันทึกไม่สำเร็จ: "+err.message}
  };
  del.onclick=async()=>{
    if(!confirm("ลบหมวดนี้ออกจาก Sheet categories ใช่หรือไม่?"))return;
    const msg=document.querySelector("#formMsg");msg.textContent="กำลังลบ...";
    try{await deleteCategoryRow(document.querySelector("#catRow").value);await loadCategoryApi();close();views.categories()}catch(err){msg.textContent="ลบไม่สำเร็จ: "+err.message}
  };
}

function render(v){if(v!=="dashboard")dashboardRunId++;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===v));if(typeof views[v]==='function'){views[v]()}else{console.error('Unknown admin view:',v)}};ensureAnalyticsNav();ensureStoreAccessNav();document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>render(b.dataset.view));load();