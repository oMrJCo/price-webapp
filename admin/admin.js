const AUTH_HASH="246540996575c8ca5609b39f10588c8ca104b2ceacb577ee4f557b6256a9c0aa", AUTH_KEY="leeplus_admin_until";
async function sha256(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function authOK(){return Number(sessionStorage.getItem(AUTH_KEY)||0)>Date.now()}
function showGate(){document.querySelector("#loginGate").classList.remove("hidden");document.querySelector("#adminCode").focus()}
function hideGate(){document.querySelector("#loginGate").classList.add("hidden")}
document.querySelector("#loginForm").addEventListener("submit",async e=>{e.preventDefault();const el=document.querySelector("#adminCode"),err=document.querySelector("#loginError");err.textContent="";if(await sha256(el.value)===AUTH_HASH){sessionStorage.setItem(AUTH_KEY,String(Date.now()+12*60*60*1000));el.value="";hideGate()}else{err.textContent="รหัสไม่ถูกต้อง";el.value="";setTimeout(()=>el.focus(),250)}});
document.querySelector("#logoutBtn").addEventListener("click",()=>{sessionStorage.removeItem(AUTH_KEY);showGate()});
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
function val(v){return v==null?"":String(v)}
function esc(v){return val(v).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]))}
function activeText(v){return String(v||"").toUpperCase()==="ACTIVE"}
async function saveCategory(payload){
  return await apiGet({
    action:"saveCategory",
    row:payload.__row||"",
    titleTH:payload.titleTH||"",
    titleEN:payload.titleEN||"",
    sheetTab:payload.sheetTab||"",
    status:payload.status||"ACTIVE",
    sort:payload.sort||"",
    image:payload.image||"",
    pdf_url:payload.pdf_url||"",
    price_url:payload.price_url||""
  });
}
async function deleteCategoryRow(row){
  return await apiGet({action:"deleteCategory",row:String(row)});
}


async function loadSheetTabs(){
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
function catTab(c){return String(c.sheetTab||sheetFromUrl(c.price_url)||"").trim()}
function sheetStatus(){
  const mapped=new Set(cats().map(catTab).filter(Boolean));
  const tabs=new Set(sheetTabs);
  return {
    linked:[...tabs].filter(t=>mapped.has(t)),
    unlinked:[...tabs].filter(t=>!mapped.has(t)),
    missing:[...mapped].filter(t=>!tabs.has(t))
  };
}
function badge(txt,type=""){return `<span class="status ${type}">${txt}</span>`}
function sheetRows(){
  if(sheetLoadState==="loading") return '<div class="empty">กำลังอ่าน Google Sheet...</div>';
  if(sheetLoadState==="unsupported") return `<div class="api-needed"><b>รอเพิ่ม Tabs API ที่ Google Apps Script</b><div>Backoffice พร้อมแล้ว แต่ Apps Script ปัจจุบันยังไม่มี <code>action=tabs</code></div></div>`;
  const s=sheetStatus();
  if(!sheetTabs.length) return '<div class="empty">ไม่พบ Sheet Tab</div>';
  return sheetTabs.map(t=>{
    const c=cats().find(x=>catTab(x)===t);
    return `<div class="sheet-row"><div class="grow"><b>${t}</b><div class="muted">${c?`เชื่อมกับ ${c.titleTH||c.titleEN}`:"ยังไม่มีหมวดเชื่อม"}</div></div>${c?badge("เชื่อมแล้ว","ok"):badge("รอเชื่อม","wait")}</div>`
  }).join("");
}

const content=document.querySelector('#content'), title=document.querySelector('#title'), subtitle=document.querySelector('#subtitle');let db={categories:[]};
async function load(){await Promise.all([loadSheetTabs(),loadCategoryApi(),(async()=>{try{const r=await fetch('../categories.json?ts='+Date.now());db=await r.json()}catch(e){console.error(e)}})()]);render('dashboard')}
function cats(){return db.categories||[]}
const views={dashboard(){title.textContent='ภาพรวม';subtitle.textContent='สถานะข้อมูลที่ใช้ในเว็บใบราคา';const c=cats();content.innerHTML=`<div class="warn">Backoffice รุ่นนี้เป็นฐานใหม่ที่ไม่ใช้ Netlify หรือ Decap การบันทึกจริงและการ Sync Google Sheet จะเชื่อมในขั้นถัดไป</div><div class="cards"><div class="card"><span class="muted">หมวดสินค้าทั้งหมด</span><strong>${c.length}</strong></div><div class="card"><span class="muted">มีรูปหมวด</span><strong>${c.filter(x=>x.image).length}</strong></div><div class="card"><span class="muted">มี PDF</span><strong>${c.filter(x=>x.pdf_url).length}</strong></div><div class="card"><span class="muted">เชื่อม Sheet Tab</span><strong>${c.filter(x=>x.sheetTab||x.price_url).length}</strong></div></div><div class="panel"><h2>หมวดสินค้าปัจจุบัน</h2>${rows(c)}</div>`},categories(){title.textContent='หมวดสินค้า';subtitle.textContent='เพิ่ม แก้ไข เปิด-ปิด และเชื่อม Sheet Tab';content.innerHTML=`
<div class="cat-toolbar"><button class="primary" id="addCategory">+ เพิ่มหมวดสินค้า</button><button class="secondary" id="reloadCats">รีเฟรช</button></div>
<div class="panel"><h2>รายการหมวดสินค้า</h2><div id="catAdminRows">${categoryAdminRows()}</div></div>
<div id="categoryModal" class="modal hidden"><div class="modal-card">
  <div class="modal-head"><h2 id="modalTitle">เพิ่มหมวดสินค้า</h2><button id="closeModal" class="icon-btn">×</button></div>
  <form id="categoryForm">
    <input type="hidden" id="catRow">
    <div class="form-grid">
      <label>ชื่อหมวดภาษาไทย<input id="catTH" required></label>
      <label>ชื่อหมวดภาษาอังกฤษ<input id="catEN"></label>
      <label>Google Sheet Tab<select id="catTab"><option value="">-- ยังไม่เชื่อม --</option>${sheetTabs.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("")}</select></label>
      <label>สถานะ<select id="catStatus"><option value="ACTIVE">เปิดใช้งาน</option><option value="INACTIVE">ปิดใช้งาน</option></select></label>
      <label>ลำดับ<input id="catSort" type="number" min="1"></label>
      <label>URL รูปหมวด<input id="catImage" placeholder="/assets/... หรือ https://..."></label>
      <label>URL PDF<input id="catPdf" placeholder="/pdf/... หรือ https://..."></label>
      <label>Price URL<input id="catPrice" placeholder="price_sheet.html?tab=..."></label>
    </div>
    <div class="form-actions"><button type="button" class="danger hidden" id="deleteCat">ลบหมวด</button><div class="spacer"></div><button type="button" class="secondary" id="cancelCat">ยกเลิก</button><button type="submit" class="primary">บันทึก</button></div>
    <div id="formMsg" class="form-msg"></div>
  </form>
</div></div>`;
bindCategoryAdmin()},media(){title.textContent='รูปและสื่อ';subtitle.textContent='ศูนย์รวมรูปที่ใช้บนหน้าเว็บ';content.innerHTML=`<div class="panel"><h2>รูปหมวดปัจจุบัน</h2>${rows(cats().filter(x=>x.image))}</div>`},pdf(){title.textContent='ไฟล์ PDF';subtitle.textContent='เอกสารและใบราคาที่เชื่อมกับหมวด';const x=cats().filter(x=>x.pdf_url);content.innerHTML=`<div class="panel"><h2>PDF ที่ใช้อยู่</h2>${x.length?rows(x):'<div class="empty">ยังไม่มีรายการ PDF</div>'}</div>`},sheet(){title.textContent='Google Sheet';subtitle.textContent='ตรวจสอบการเชื่อมหมวดสินค้ากับ Tab ใน Google Sheet';const s=sheetStatus();content.innerHTML=`<div class="sheet-tools"><button class="refresh-sheet" id="refreshSheet">รีเฟรชจาก Google Sheet</button><div class="sheet-counts">${badge(`เชื่อมแล้ว ${s.linked.length}`,"ok")} ${badge(`Tab ยังไม่ผูก ${s.unlinked.length}`,"wait")} ${badge(`Mapping หา Tab ไม่เจอ ${s.missing.length}`,"bad")}</div></div><div class="panel"><h2>Sheet Tabs</h2><div id="sheetRows">${sheetRows()}</div></div>${s.missing.length?`<div class="panel"><h2>Mapping ที่หา Tab ไม่เจอ</h2>${s.missing.map(t=>`<div class="sheet-row"><div class="grow"><b>${t}</b><div class="muted">ตรวจชื่อ Tab หรือแก้ Mapping</div></div>${badge("ไม่พบ Tab","bad")}</div>`).join("")}</div>`:""}`;document.querySelector("#refreshSheet")?.addEventListener("click",async()=>{await loadSheetTabs();views.sheet()})}};
function rows(a){return a.length?a.map(x=>`<div class="row">${x.image?`<img class="thumb" src="${x.image}">`:'<div class="thumb"></div>'}<div class="grow"><b>${x.titleTH||x.titleEN||'-'}</b><div class="muted">${x.titleEN||''}</div></div><span class="tag">${x.sheetTab||sheetFromUrl(x.price_url)||'ยังไม่ผูก Sheet'}</span></div>`).join(''):'<div class="empty">ยังไม่มีข้อมูล</div>'}
function sheetFromUrl(u=''){try{return new URL(u,location.href).searchParams.get('tab')||''}catch{return''}}

function categoryAdminRows(){
  const arr=categoryApiData.length?categoryApiData:cats().map((x,i)=>({...x,__row:i+2}));
  if(!arr.length) return '<div class="empty">ยังไม่มีหมวดสินค้า</div>';
  return arr.map((x,i)=>`<div class="cat-admin-row" data-i="${i}">
    <div class="cat-order">${esc(x.sort||i+1)}</div>
    ${x.image?`<img class="thumb" src="${esc(x.image)}">`:'<div class="thumb"></div>'}
    <div class="grow"><b>${esc(x.titleTH||x.titleEN||"-")}</b><div class="muted">${esc(x.titleEN||"")} · ${esc(x.sheetTab||sheetFromUrl(x.price_url)||"ยังไม่ผูก Sheet")}</div></div>
    ${activeText(x.status||"ACTIVE")?badge("เปิด","ok"):badge("ปิด","bad")}
    <button class="edit-cat" data-i="${i}">แก้ไข</button>
  </div>`).join("");
}
function bindCategoryAdmin(){
  document.querySelector("#addCategory")?.addEventListener("click",()=>openCategoryModal());
  document.querySelector("#reloadCats")?.addEventListener("click",async()=>{await Promise.all([loadCategoryApi(),loadSheetTabs()]);views.categories()});
  document.querySelectorAll(".edit-cat").forEach(b=>b.addEventListener("click",()=>openCategoryModal(categoryApiData[Number(b.dataset.i)])));
}
function openCategoryModal(x=null){
  const modal=document.querySelector("#categoryModal"), del=document.querySelector("#deleteCat");
  modal.classList.remove("hidden");
  document.querySelector("#modalTitle").textContent=x?"แก้ไขหมวดสินค้า":"เพิ่มหมวดสินค้า";
  document.querySelector("#catRow").value=x?.__row||"";
  document.querySelector("#catTH").value=x?.titleTH||"";
  document.querySelector("#catEN").value=x?.titleEN||"";
  document.querySelector("#catTab").value=x?.sheetTab||sheetFromUrl(x?.price_url)||"";
  document.querySelector("#catStatus").value=(x?.status||"ACTIVE").toUpperCase()==="ACTIVE"?"ACTIVE":"INACTIVE";
  document.querySelector("#catSort").value=x?.sort||"";
  document.querySelector("#catImage").value=x?.image||"";
  document.querySelector("#catPdf").value=x?.pdf_url||"";
  document.querySelector("#catPrice").value=x?.price_url||"";
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
        sheetTab:tab,
        status:document.querySelector("#catStatus").value,
        sort:document.querySelector("#catSort").value,
        image:document.querySelector("#catImage").value.trim(),
        pdf_url:document.querySelector("#catPdf").value.trim(),
        price_url:price
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

function render(v){document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===v));views[v]()};document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>render(b.dataset.view));load();