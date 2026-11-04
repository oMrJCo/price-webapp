/* LEEPLUS claims notebook — no inventory changes */
(function(){
"use strict";
const BASE="https://dxlngxkuggbgdzmithzx.supabase.co",KEY="sb_publishable_sqAwuko-g-Kgzp51YyMT3g_gIAwtEan";
let token="local",userId="local",products=[],items=[],history=[];
const $=s=>document.querySelector(s),esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>{let d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const STORE="leeplus_claims_notebook_v1";
function read(){try{return JSON.parse(localStorage.getItem(STORE))||[]}catch(e){return []}}
function write(data){localStorage.setItem(STORE,JSON.stringify(data))}
async function api(path,method="GET",body){
 let data=read();
 if(path.startsWith("lp_claims?")&&method==="GET")return data.sort((a,b)=>b.created_at.localeCompare(a.created_at));
 if(path==="lp_claims"&&method==="POST"){const row={...body,id:Date.now(),created_at:new Date().toISOString(),lp_claim_items:[]};data.push(row);write(data);return [row]}
 if(path==="lp_claim_items"&&method==="POST"){for(const x of body){const c=data.find(z=>z.id===x.claim_id);if(!c)throw Error("ไม่พบใบเคลม");c.lp_claim_items.push({...x,id:Date.now()+Math.floor(Math.random()*100000)})}write(data);return body}
 if(path.startsWith("lp_claims?id=eq.")&&method==="DELETE"){write(data.filter(x=>x.id!==Number(path.split("eq.")[1])));return []}
 if(path.startsWith("lp_claim_items?id=eq.")&&method==="PATCH"){const id=Number(path.split("eq.")[1]);for(const c of data){const x=c.lp_claim_items.find(x=>x.id===id);if(x)Object.assign(x,body)}write(data);return []}
 throw Error("คำสั่งไม่รองรับ");
}
function msg(s){const x=$("#claimMsg");if(x)x.textContent=s}
function view(){
$("#title").textContent="บันทึกของเคลม";$("#subtitle").textContent="ค้นหาสินค้า · ใส่จำนวน · ติ๊กเคลมแล้ว";
if(false){$("#content").innerHTML='<div class="panel"><h2>เข้าสู่ระบบเคลม</h2><form id="clLogin" class="claims-login"><input id="clEmail" type="email" required placeholder="อีเมล Billing"><input id="clPass" type="password" required placeholder="รหัสผ่าน Billing"><button class="primary">เข้าสู่ระบบ</button></form><p id="claimMsg"></p></div>';$("#clLogin").onsubmit=login;return}
$("#content").innerHTML='<div class="panel claims-panel"><div class="claims-toolbar"><h2>บันทึกเคลม</h2><button class="secondary" id="clExport">สำรองข้อมูล</button><button class="secondary" id="clImport">นำเข้าข้อมูล</button><input id="clImportFile" type="file" accept=".json,application/json" hidden></div><div class="claims-fields"><label>วันที่รับ<input id="clDate" type="date" value="'+today()+'"></label><label>ชื่อร้านค้า<input id="clShop" placeholder="ชื่อร้านค้า"></label><label>หมายเหตุ<input id="clNote" placeholder="ไม่บังคับ"></label></div><div class="claims-search"><select id="clCategory"><option value="">ทุกหมวดสินค้า</option></select><input id="clSearch" placeholder="ค้นหา Smart Search เช่น ip12, 12 pro"><button class="secondary" id="clManual">+ พิมพ์สินค้าเอง</button></div><div id="clMatches"></div><div id="clLines"></div><button class="primary" id="clSave">บันทึก</button><p id="claimMsg"></p></div><div class="panel claims-panel"><div class="claims-toolbar"><h2>ประวัติเคลม</h2><button class="secondary" id="clRefresh">รีเฟรช</button></div><div class="claims-fields"><label>ค้นหา<input id="clFilter" placeholder="ร้านค้า / สินค้า"></label><label>สถานะ<select id="clStatus"><option value="all">ทั้งหมด</option><option value="pending">ค้างเคลม</option><option value="done">เคลมแล้ว</option></select></label></div><p class="muted">ข้อมูลบันทึกในเบราว์เซอร์เครื่องนี้ กรุณากดสำรองข้อมูลเป็นระยะ หากเปลี่ยนเครื่องให้นำเข้าไฟล์สำรอง</p><div id="clStats"></div><div id="clHistory"></div></div>';
$("#clExport").onclick=()=>{const blob=new Blob([JSON.stringify(read(),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="leeplus-claims-"+today()+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$("#clImport").onclick=()=>$("#clImportFile").click();
$("#clImportFile").onchange=async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data)||data.some(x=>!x.shop_name||!Array.isArray(x.lp_claim_items)))throw Error("ไฟล์ไม่ถูกต้อง");if(!confirm("นำเข้าข้อมูลจะทับรายการเดิมในเบราว์เซอร์นี้ ยืนยันหรือไม่?"))return;write(data);await loadHistory();msg("นำเข้าข้อมูลแล้ว")}catch(err){msg("นำเข้าไม่สำเร็จ: "+err.message)}};
$("#clSearch").oninput=search;$("#clCategory").onchange=search;$("#clManual").onclick=()=>{items.push({product_name:$("#clSearch").value.trim(),product_key:"",qty_received:1,qty_replaced:0,issue:""});lines()};
$("#clSave").onclick=save;$("#clRefresh").onclick=loadHistory;$("#clFilter").oninput=showHistory;$("#clStatus").onchange=showHistory;
lines();loadHistory();if(!products.length&&typeof preloadBillProducts==="function")preloadBillProducts().then(x=>{products=Array.isArray(x)?x:[];const cats=[...new Set(products.map(p=>p.category_sheet_tab).filter(Boolean))].sort();$("#clCategory").innerHTML='<option value="">ทุกหมวดสินค้า</option>'+cats.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join("");}).catch(e=>msg(e.message));
}
async function login(e){e.preventDefault();try{
const r=await fetch(BASE+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify({email:$("#clEmail").value,password:$("#clPass").value})});
const j=await r.json();if(!r.ok)throw Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
if(j.user?.app_metadata?.leeplus_claims_admin!==true)throw Error("บัญชีนี้ยังไม่ได้รับสิทธิ์บันทึกเคลม");
token=j.access_token;userId=j.user.id;view()}catch(e){msg(e.message)}}
function search(){
const q=$("#clSearch").value.trim(),cat=$("#clCategory").value,el=$("#clMatches");if(!q){el.innerHTML="";return}
const found=typeof billSearchProducts==="function"?billSearchProducts(q,cat).slice(0,30):products.filter(x=>(!cat||x.category_sheet_tab===cat)&&[x.brand,x.model].join(" ").toLowerCase().includes(q.toLowerCase())).slice(0,30);
el.innerHTML=found.map((x,i)=>'<button type="button" class="claims-result" data-i="'+i+'"><b>'+esc(x.category_sheet_tab||"สินค้า")+'</b> · '+esc([x.brand,x.model].filter(Boolean).join(" · "))+'</button>').join("")||'<small>ไม่พบสินค้า — พิมพ์สินค้าเองได้</small>';
el.querySelectorAll("button").forEach(b=>b.onclick=()=>{const x=found[+b.dataset.i],key=String(x.id||[x.category_sheet_tab,x.brand,x.model].join("|")),name=[x.category_sheet_tab,x.brand,x.model].filter(Boolean).join(" · ");const existing=items.find(y=>y.product_key===key);if(existing)existing.qty_received+=1;else items.push({product_name:name,product_key:key,qty_received:1,qty_replaced:0,issue:""});$("#clSearch").value="";el.innerHTML="";lines()});
}
function lines(){const el=$("#clLines");if(!el)return;el.innerHTML=items.map((x,i)=>'<div class="claims-line"><input data-i="'+i+'" data-k="product_name" value="'+esc(x.product_name)+'" placeholder="สินค้า"><label>จำนวน<input type="number" min="1" data-i="'+i+'" data-k="qty_received" value="'+x.qty_received+'"></label><label>เคลมแล้ว<input type="number" min="0" data-i="'+i+'" data-k="qty_replaced" value="'+x.qty_replaced+'"></label><input data-i="'+i+'" data-k="issue" value="'+esc(x.issue)+'" placeholder="อาการเสีย / หมายเหตุ"><button class="secondary" data-del="'+i+'">ลบ</button></div>').join("");
el.querySelectorAll("[data-k]").forEach(x=>x.onchange=()=>items[+x.dataset.i][x.dataset.k]=x.type==="number"?Number(x.value):x.value);
el.querySelectorAll("[data-del]").forEach(x=>x.onclick=()=>{items.splice(+x.dataset.del,1);lines()})}
async function save(){const shop=$("#clShop").value.trim();if(!shop||!items.length){msg("ใส่ชื่อร้านค้าและสินค้าอย่างน้อย 1 รายการ");return}
if(items.some(x=>!x.product_name.trim()||!Number.isInteger(x.qty_received)||x.qty_received<1||!Number.isInteger(x.qty_replaced)||x.qty_replaced<0||x.qty_replaced>x.qty_received)){msg("ตรวจสอบจำนวนเคลมให้ถูกต้อง");return}
const btn=$("#clSave");btn.disabled=true;try{const no="CL-"+Date.now()+"-"+Math.random().toString(36).slice(2,5);
const a=await api("lp_claims","POST",{claim_no:no,shop_name:shop,received_on:$("#clDate").value,note:$("#clNote").value,created_by:userId});
try{await api("lp_claim_items","POST",items.map(x=>({...x,claim_id:a[0].id})))}catch(e){await api("lp_claims?id=eq."+a[0].id,"DELETE");throw e}
items=[];$("#clShop").value="";$("#clNote").value="";lines();msg("บันทึกแล้ว "+no);await loadHistory()}catch(e){msg("บันทึกไม่สำเร็จ: "+e.message)}finally{btn.disabled=false}}
async function loadHistory(){try{history=await api("lp_claims?select=*,lp_claim_items(*)&order=created_at.desc&limit=200");showHistory()}catch(e){msg("โหลดประวัติไม่สำเร็จ: "+e.message)}}
function showHistory(){const el=$("#clHistory");if(!el)return;const q=$("#clFilter").value.toLowerCase(),filter=$("#clStatus").value;
let total=0,done=0;const cards=[];
history.forEach(c=>{const lines=c.lp_claim_items.filter(x=>(c.shop_name+" "+x.product_name).toLowerCase().includes(q)&&(filter==="all"||(filter==="done"?x.qty_replaced===x.qty_received:x.qty_replaced<x.qty_received)));
if(!lines.length)return;lines.forEach(x=>{total+=x.qty_received;done+=x.qty_replaced});
cards.push('<details class="claims-history" open><summary>'+esc(c.received_on)+' · '+esc(c.shop_name)+' · '+lines.length+' รายการ</summary>'+lines.map(x=>'<div class="claims-line" data-id="'+x.id+'"><b>'+esc(x.product_name)+'</b><span>รับ '+x.qty_received+' ชิ้น</span><label>เคลมแล้ว<input type="number" min="0" max="'+x.qty_received+'" value="'+x.qty_replaced+'"></label><span>'+(x.qty_replaced===x.qty_received?'✅ เคลมแล้ว':'⏳ ค้าง '+(x.qty_received-x.qty_replaced))+'</span><button class="secondary">บันทึก</button></div>').join("")+'</details>')});
$("#clStats").textContent="รับเคลม "+total+" ชิ้น · เคลมแล้ว "+done+" ชิ้น · ค้าง "+(total-done)+" ชิ้น";
el.innerHTML=cards.join("")||"ไม่มีรายการ";
el.querySelectorAll("[data-id]").forEach(row=>row.querySelector("button").onclick=async()=>{const x=history.flatMap(c=>c.lp_claim_items).find(v=>v.id===Number(row.dataset.id)),n=Number(row.querySelector("input").value);
if(!Number.isInteger(n)||n<0||n>x.qty_received){alert("จำนวนต้องอยู่ระหว่าง 0 ถึง "+x.qty_received);return}
try{await api("lp_claim_items?id=eq."+x.id,"PATCH",{qty_replaced:n});await loadHistory()}catch(e){alert(e.message)}});
}
window.renderClaimsView=view;
})();