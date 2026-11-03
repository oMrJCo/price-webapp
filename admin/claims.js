/* LEEPLUS Claims v1: isolated from billing and stock. */
(function(){
"use strict";
const BASE="https://dxlngxkuggbgdzmithzx.supabase.co",KEY="sb_publishable_sqAwuko-g-Kgzp51YyMT3g_gIAwtEan";
const state={token:"",items:[],products:[],claims:[],selected:null};
const $=s=>document.querySelector(s),escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function api(path,method="GET",body){
 const r=await fetch(BASE+"/rest/v1/"+path,{method,headers:{"apikey":KEY,"Authorization":"Bearer "+state.token,"Content-Type":"application/json","Prefer":"return=representation"},body:body===undefined?undefined:JSON.stringify(body)});
 if(!r.ok)throw Error((await r.text()).slice(0,350));return r.status===204?[]:r.json();
}
function message(s,error=false){const el=$("#claimsMessage");if(el){el.textContent=s;el.style.color=error?"#b91c1c":"#177245"}}
function panel(html){return '<section class="panel claims-panel">'+html+'</section>'}
function render(){
 $("#title").textContent="บันทึกของเคลม";$("#subtitle").textContent="เปลี่ยนให้ร้านค้าทันที · ติดตามโรงงานแยกต่างหาก · ไม่ตัดสต๊อก";
 if(!state.token){$("#content").innerHTML=panel('<h2>เข้าสู่ระบบเคลม</h2><p>เพื่อป้องกันการเข้าถึงข้อมูลร้านค้า ระบบเคลมใช้บัญชี Supabase ที่ได้รับสิทธิ์เฉพาะ ไม่ใช้รหัสหลังบ้านที่ฝังในเว็บไซต์</p><form id="claimLogin" class="claims-login"><input id="claimEmail" type="email" required placeholder="อีเมลผู้ดูแล"><input id="claimPassword" type="password" required placeholder="รหัสผ่าน"><button class="primary">เข้าสู่ระบบเคลม</button></form><div id="claimsMessage"></div>');$("#claimLogin").onsubmit=login;return}
 $("#content").innerHTML=panel('<div class="claims-toolbar"><h2>รับสินค้าเคลม</h2><button class="secondary" id="claimLogout">ออกจากระบบเคลม</button></div><div class="claims-fields"><label>ร้านค้า<input id="claimShop" placeholder="ชื่อร้านค้า"></label><label>โทรศัพท์<input id="claimPhone" placeholder="เบอร์โทร (ไม่บังคับ)"></label><label>วันที่รับ<input id="claimDate" type="date" value="'+new Date().toLocaleDateString("en-CA")+'"></label><label>หมายเหตุ<input id="claimNote" placeholder="รายละเอียดเพิ่มเติม"></label></div><div class="claims-search"><input id="claimSearch" placeholder="ค้นหาสินค้าจากฐานข้อมูล LEEPLUS"><button class="secondary" id="claimManual">+ เพิ่มสินค้าเอง</button></div><div id="claimMatches"></div><div id="claimLines"></div><button class="primary" id="claimSave">บันทึกใบเคลม</button><div id="claimsMessage"></div>')+
 panel('<div class="claims-toolbar"><h2>ประวัติ / ติดตามเคลมโรงงาน</h2><button class="secondary" id="claimRefresh">รีเฟรช</button></div><div id="claimHistory">กำลังโหลด...</div>');
 $("#claimLogout").onclick=()=>{state.token="";state.items=[];render()};
 $("#claimSearch").oninput=search;$("#claimManual").onclick=()=>{state.items.push({product_name:$("#claimSearch").value.trim(),product_key:"",qty_received:1,qty_replaced:1,issue:""});lines()};
 $("#claimSave").onclick=save;$("#claimRefresh").onclick=history;
 lines();history();if(!state.products.length)loadProducts();
}
async function login(e){e.preventDefault();try{
 const r=await fetch(BASE+"/auth/v1/token?grant_type=password",{method:"POST",headers:{"apikey":KEY,"Content-Type":"application/json"},body:JSON.stringify({email:$("#claimEmail").value,password:$("#claimPassword").value})});
 const j=await r.json();if(!r.ok)throw Error(j.error_description||j.msg||j.error||"เข้าสู่ระบบไม่สำเร็จ");
 if(j.user?.app_metadata?.leeplus_claims_admin!==true)throw Error("บัญชีนี้ยังไม่ได้รับสิทธิ์จัดการเคลม");
 state.token=j.access_token;render();
 }catch(err){message(err.message,true)}}
async function loadProducts(){try{
 if(typeof preloadBillProducts==="function"){state.products=await preloadBillProducts();return}
 state.products=[];
 }catch(e){message("โหลดสินค้าไม่สำเร็จ: "+e.message,true)}}
function search(){const q=$("#claimSearch").value.trim().toLowerCase(),box=$("#claimMatches");if(!q){box.innerHTML="";return}
 const found=state.products.filter(x=>[x.brand,x.model,x.category_sheet_tab].join(" ").toLowerCase().includes(q)).slice(0,12);
 box.innerHTML=found.length?found.map((x,i)=>'<button type="button" class="claims-result" data-idx="'+i+'">'+escape([x.brand,x.model].filter(Boolean).join(" · "))+' <small>'+escape(x.category_sheet_tab)+'</small></button>').join(""):'<small>ไม่พบสินค้า — กด “เพิ่มสินค้าเอง” ได้</small>';
 box.querySelectorAll("button").forEach(b=>b.onclick=()=>{const x=found[+b.dataset.idx];state.items.push({product_name:[x.brand,x.model].filter(Boolean).join(" · "),product_key:[x.category_sheet_tab,x.brand,x.model].join("|"),qty_received:1,qty_replaced:1,issue:""});$("#claimSearch").value="";box.innerHTML="";lines()});
}
function lines(){const el=$("#claimLines");if(!el)return;el.innerHTML=state.items.map((x,i)=>'<div class="claims-line"><input data-i="'+i+'" data-k="product_name" value="'+escape(x.product_name)+'" placeholder="ชื่อสินค้า"><label>รับเคลม<input type="number" min="1" data-i="'+i+'" data-k="qty_received" value="'+x.qty_received+'"></label><label>เปลี่ยนใหม่<input type="number" min="0" data-i="'+i+'" data-k="qty_replaced" value="'+x.qty_replaced+'"></label><input data-i="'+i+'" data-k="issue" value="'+escape(x.issue)+'" placeholder="อาการเสีย"><button class="secondary" data-del="'+i+'">ลบ</button></div>').join("");
 el.querySelectorAll("[data-k]").forEach(n=>n.onchange=()=>{state.items[+n.dataset.i][n.dataset.k]=n.type==="number"?Number(n.value):n.value});
 el.querySelectorAll("[data-del]").forEach(n=>n.onclick=()=>{state.items.splice(+n.dataset.del,1);lines()});
}
async function save(){const shop=$("#claimShop").value.trim();if(!shop||!state.items.length){message("กรอกชื่อร้านค้าและเพิ่มสินค้าอย่างน้อยหนึ่งรายการ",true);return}
 if(state.items.some(x=>!x.product_name.trim()||!Number.isInteger(x.qty_received)||x.qty_received<1||!Number.isInteger(x.qty_replaced)||x.qty_replaced<0||x.qty_replaced>x.qty_received)){message("ตรวจสอบชื่อสินค้าและจำนวนที่เปลี่ยนใหม่ (ต้องไม่เกินจำนวนรับเคลม)",true);return}
 const btn=$("#claimSave");btn.disabled=true;try{
 const no="CL"+new Date().toISOString().replace(/[-:TZ.]/g,"").slice(0,14)+"-"+Math.random().toString(36).slice(2,6).toUpperCase();
 const claims=await api("lp_claims","POST",{claim_no:no,shop_name:shop,shop_phone:$("#claimPhone").value.trim(),received_on:$("#claimDate").value,note:$("#claimNote").value,created_by:(await getUser()).id});
 try{await api("lp_claim_items","POST",state.items.map(x=>({...x,claim_id:claims[0].id})))}catch(e){await api("lp_claims?id=eq."+claims[0].id,"DELETE");throw e}
 state.items=[];$("#claimShop").value="";$("#claimPhone").value="";$("#claimNote").value="";lines();message("บันทึกใบเคลม "+no+" สำเร็จ");await history();
 }catch(e){message("บันทึกไม่สำเร็จ: "+e.message,true)}finally{btn.disabled=false}}
async function getUser(){const r=await fetch(BASE+"/auth/v1/user",{headers:{"apikey":KEY,"Authorization":"Bearer "+state.token}});if(!r.ok)throw Error("กรุณาเข้าสู่ระบบใหม่");return r.json()}
async function history(){const el=$("#claimHistory");if(!el)return;try{
 const claims=await api("lp_claims?select=*,lp_claim_items(*)&order=created_at.desc&limit=100");state.claims=claims;
 el.innerHTML=claims.length?claims.map(c=>'<details class="claims-history"><summary><b>'+escape(c.claim_no)+'</b> · '+escape(c.shop_name)+' · '+escape(c.received_on)+' · '+c.lp_claim_items.length+' รายการ</summary>'+c.lp_claim_items.map(x=>'<div class="claims-factory" data-item="'+x.id+'"><b>'+escape(x.product_name)+'</b><small>รับ '+x.qty_received+' / เปลี่ยน '+x.qty_replaced+'</small><label>รอบส่งโรงงาน<input data-field="factory_batch" value="'+escape(x.factory_batch)+'" placeholder="เช่น F-202611-01"></label><label>ส่งโรงงาน<input data-field="qty_sent" type="number" min="0" max="'+x.qty_received+'" value="'+x.qty_sent+'"></label><label>ชดเชยแล้ว<input data-field="qty_compensated" type="number" min="0" max="'+x.qty_sent+'" value="'+x.qty_compensated+'"></label><label>ผลโรงงาน<select data-field="factory_result">'+["PENDING","ACCEPTED","PARTIAL","REJECTED"].map(v=>'<option value="'+v+'" '+(x.factory_result===v?"selected":"")+'>'+({PENDING:"รอดำเนินการ",ACCEPTED:"รับเคลม",PARTIAL:"ชดเชยบางส่วน",REJECTED:"ปฏิเสธ"}[v])+'</option>').join("")+'</select></label><button class="secondary" data-save-item="'+x.id+'">บันทึกผล</button></div>').join("")+'</details>').join(""):'ยังไม่มีรายการเคลม';
 el.querySelectorAll("[data-save-item]").forEach(b=>b.onclick=async()=>{const row=b.closest("[data-item]"),data={};row.querySelectorAll("[data-field]").forEach(n=>data[n.dataset.field]=n.type==="number"?Number(n.value):n.value);
 const original=claims.flatMap(c=>c.lp_claim_items).find(x=>x.id===Number(b.dataset.saveItem));if(data.qty_sent<0||data.qty_sent>original.qty_received||data.qty_compensated<0||data.qty_compensated>data.qty_sent){alert("จำนวนส่งโรงงาน/ชดเชยไม่ถูกต้อง");return}
 b.disabled=true;try{await api("lp_claim_items?id=eq."+b.dataset.saveItem,"PATCH",data);await history()}catch(e){alert("บันทึกไม่สำเร็จ: "+e.message);b.disabled=false}});
 }catch(e){el.textContent="โหลดประวัติไม่สำเร็จ: "+e.message}}
window.renderClaimsView=render;
})();