(() => {
  "use strict";

  const API = "https://script.google.com/macros/s/AKfycbxqUpwXOo05dZ1iv9BP29pVR273Qj1d8fXwYZnn29A9cpNfrAtE0IKL7uqO-DXopIgUYA/exec";
  const TOKEN_KEY = "leeplus_store_access_token";
  const STORE_KEY = "leeplus_store_access_store";

  const state = {
    authorized: false,
    store: null
  };
  window.LEEPLUS_STORE_ACCESS = state;

  function esc(v){
    return String(v ?? "").replace(/[&<>"']/g, s => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
  }

  async function post(action, payload = {}){
    const r = await fetch(API, {
      method: "POST",
      headers: {"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify({action, ...payload})
    });
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  }

  function setAuthorized(store){
    state.authorized = true;
    state.store = store || null;
    try{
      localStorage.setItem(STORE_KEY, JSON.stringify(store || {}));
    }catch(_){}
    updateAccessButton();
    window.dispatchEvent(new CustomEvent("leeplus:store-access", {
      detail: {authorized:true, store:state.store}
    }));
  }

  function clearAuthorized(){
    state.authorized = false;
    state.store = null;
    try{
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(STORE_KEY);
    }catch(_){}
    updateAccessButton();
    window.dispatchEvent(new CustomEvent("leeplus:store-access", {
      detail: {authorized:false, store:null}
    }));
  }

  function cachedStore(){
    try{return JSON.parse(localStorage.getItem(STORE_KEY) || "null")}catch(_){return null}
  }

  function updateAccessButton(){
    const btn = document.getElementById("storeAccessBtn");
    if(!btn) return;
    if(state.authorized){
      const name = state.store?.name || cachedStore()?.name || "ได้รับสิทธิ์แล้ว";
      btn.classList.add("is-approved");
      btn.innerHTML = `<span class="store-access-dot"></span><span>${esc(name)}</span>`;
      btn.title = "อุปกรณ์นี้ได้รับสิทธิ์ดูราคาแล้ว";
    }else{
      btn.classList.remove("is-approved");
      btn.textContent = "ลงทะเบียนร้านค้า / เปิดสิทธิ์ดูราคา";
      btn.title = "ลงทะเบียนร้านค้า / เปิดสิทธิ์ดูราคา";
    }
  }

  function buildUI(){
    if(document.getElementById("storeAccessModal")) return;

    const style = document.createElement("style");
    style.id = "storeAccessStyle";
    style.textContent = `
      .store-access-btn{
        min-height:40px;display:inline-flex;align-items:center;justify-content:center;gap:7px;
        padding:0 16px;border-radius:999px;border:1px solid rgba(243,201,0,.55);
        background:#f3c900;color:#090b10;font:900 12px/1 system-ui,-apple-system,sans-serif;
        cursor:pointer;white-space:nowrap
      }
      .store-access-btn.is-approved{background:rgba(34,181,115,.12);border-color:rgba(34,181,115,.55);color:#dff8e9}
      .store-access-dot{width:8px;height:8px;border-radius:50%;background:#22b573;box-shadow:0 0 0 4px rgba(34,181,115,.12)}
      .store-access-modal{position:fixed;inset:0;z-index:10050;display:none;place-items:center;padding:18px;background:rgba(0,0,0,.78);backdrop-filter:blur(5px)}
      .store-access-modal.show{display:grid}
      .store-access-card{width:min(440px,100%);max-height:min(760px,92vh);overflow:auto;background:#0d1119;border:1px solid rgba(255,255,255,.12);border-radius:22px;box-shadow:0 28px 90px rgba(0,0,0,.7)}
      .store-access-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:22px 22px 15px}
      .store-access-brand{font-size:18px;font-weight:950;color:#fff}.store-access-brand span{display:block;margin-top:3px;color:#f3c900;font-size:9px;letter-spacing:2px}
      .store-access-close{width:34px;height:34px;flex:0 0 34px;border:0;border-radius:50%;background:#171c26;color:#fff;font-size:21px;cursor:pointer}
      .store-access-tabs{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:0 22px;padding:4px;background:#090c12;border:1px solid rgba(255,255,255,.08);border-radius:13px}
      .store-access-tab{min-height:42px;border:0;border-radius:9px;background:transparent;color:#8e96a5;font:850 11px/1 system-ui;cursor:pointer}
      .store-access-tab.active{background:#1a202b;color:#fff;box-shadow:0 3px 12px rgba(0,0,0,.25)}
      .store-access-body{padding:18px 22px 22px}
      .store-access-view{display:none}.store-access-view.active{display:block}
      .store-access-title{margin:0;color:#fff;font-size:20px;font-weight:950}.store-access-desc{margin:6px 0 17px;color:#8d95a4;font-size:11px;line-height:1.55}
      .store-access-field{display:block;margin:11px 0}.store-access-field span{display:block;margin:0 0 6px;color:#c8ced8;font-size:10px;font-weight:850}
      .store-access-field input{width:100%;height:47px;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:#090c12;color:#fff;padding:0 13px;font-size:15px;outline:none}
      .store-access-field input:focus{border-color:rgba(243,201,0,.7);box-shadow:0 0 0 3px rgba(243,201,0,.08)}
      .store-access-phone{letter-spacing:1px;font-variant-numeric:tabular-nums}
      .store-access-submit{width:100%;height:47px;border:0;border-radius:11px;background:#f3c900;color:#090b10;font-size:13px;font-weight:950;cursor:pointer;margin-top:5px}
      .store-access-submit:disabled{opacity:.55;cursor:wait}
      .store-access-msg{min-height:20px;margin-top:10px;font-size:11px;line-height:1.5}
      .store-access-msg.error{color:#ff8b8b}.store-access-msg.success{color:#6fe0a0}.store-access-msg.info{color:#f5d85d}
      .store-access-approved{padding:12px;border:1px solid rgba(34,181,115,.22);background:rgba(34,181,115,.07);border-radius:12px;margin-bottom:13px;color:#dff8e9;font-size:11px;line-height:1.6}
      .store-access-logout{border:0;background:transparent;color:#9ca3af;font-size:10px;text-decoration:underline;cursor:pointer;padding:7px 0 0}
      .store-access-flow{margin-top:14px;padding:10px 11px;border:1px solid rgba(255,255,255,.08);border-radius:11px;background:#090c12;color:#a8afba;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap}.store-access-flow span{width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:rgba(243,201,0,.13);color:#f3c900;font-size:9px}.store-access-flow b{color:#596170}.store-access-note{margin-top:10px;color:#707988;font-size:9px;line-height:1.5}
      @media(max-width:760px){
        .store-access-btn{min-height:36px;padding:0 12px;font-size:10px}
        .store-access-card{border-radius:18px}.store-access-head{padding:18px 17px 13px}.store-access-tabs{margin:0 17px}.store-access-body{padding:16px 17px 19px}
      }
    `;
    document.head.appendChild(style);

    const modal = document.createElement("div");
    modal.id = "storeAccessModal";
    modal.className = "store-access-modal";
    modal.setAttribute("aria-hidden","true");
    modal.innerHTML = `
      <div class="store-access-card" role="dialog" aria-modal="true" aria-label="JackLeeplus Store Access">
        <div class="store-access-head">
          <div class="store-access-brand">JackLeeplus <span>STORE ACCESS</span></div>
          <button type="button" class="store-access-close" id="storeAccessClose" aria-label="ปิด">×</button>
        </div>

        <div class="store-access-tabs">
          <button type="button" class="store-access-tab active" data-store-tab="login">มีสิทธิ์แล้ว</button>
          <button type="button" class="store-access-tab" data-store-tab="register">ลงทะเบียนร้านค้า</button>
        </div>

        <div class="store-access-body">
          <section class="store-access-view active" data-store-view="login">
            <h2 class="store-access-title">เข้าสู่ระบบร้านค้า</h2>
            <p class="store-access-desc">ร้านที่ได้รับอนุมัติแล้ว ใช้เบอร์โทรที่ลงทะเบียนเพื่อเปิดดูราคา อุปกรณ์นี้จะจำสิทธิ์ไว้ให้อัตโนมัติ</p>
            <div id="storeApprovedBox"></div>
            <form id="storeLoginForm" novalidate>
              <label class="store-access-field">
                <span>เบอร์โทรร้านค้า</span>
                <input id="storeLoginPhone" class="store-access-phone" type="text" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" autocomplete="tel" placeholder="0XXXXXXXXX">
              </label>
              <button class="store-access-submit" id="storeLoginSubmit" type="submit">เข้าสู่ระบบดูราคา</button>
              <div id="storeLoginMsg" class="store-access-msg"></div>
            </form>
          </section>

          <section class="store-access-view" data-store-view="register">
            <h2 class="store-access-title">ลงทะเบียนร้านค้า</h2>
            <p class="store-access-desc">สำหรับร้านค้าใหม่ ลงทะเบียนครั้งเดียวเพื่อขอสิทธิ์ดูราคา หลังอนุมัติใช้เบอร์เดิมเข้าสู่ระบบได้ทันที</p>
            <form id="storeRegisterForm" novalidate>
              <label class="store-access-field"><span>ชื่อร้าน *</span><input id="storeRegName" maxlength="120" autocomplete="organization" placeholder="ชื่อร้านค้า"></label>
              <label class="store-access-field"><span>ชื่อผู้ติดต่อ</span><input id="storeRegContact" maxlength="120" autocomplete="name" placeholder="ชื่อผู้ติดต่อ"></label>
              <label class="store-access-field"><span>เบอร์โทร *</span><input id="storeRegPhone" class="store-access-phone" type="text" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" autocomplete="tel" placeholder="0XXXXXXXXX"></label>
              <label class="store-access-field"><span>จังหวัด</span><input id="storeRegProvince" maxlength="80" autocomplete="address-level1" placeholder="จังหวัด"></label>
              <label class="store-access-field"><span>LINE / Facebook / ช่องทางติดต่อ <small style="color:#707988;font-weight:700">(ไม่บังคับ)</small></span><input id="storeRegContactDetail" maxlength="180" placeholder="ไม่ใส่ก็ได้"></label>
              <button class="store-access-submit" id="storeRegisterSubmit" type="submit">ส่งคำขอสิทธิ์</button>
              <div id="storeRegisterMsg" class="store-access-msg"></div>
              <div class="store-access-flow"><span>1</span> ลงทะเบียน <b>›</b> <span>2</span> รอตรวจสอบ <b>›</b> <span>3</span> เปิดดูราคา</div>
              <div class="store-access-note">เบอร์โทรต้องเป็นตัวเลข 10 หลัก และใช้เป็นข้อมูลยืนยันสิทธิ์ของร้าน กรุณาใช้เบอร์ที่ติดต่อได้จริง</div>
            </form>
          </section>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  function digitsOnly(input){
    if(!input) return;
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g,"").slice(0,10);
    });
    input.addEventListener("paste", () => setTimeout(() => {
      input.value = input.value.replace(/\D/g,"").slice(0,10);
    },0));
  }

  function setMsg(el, text, type=""){
    if(!el) return;
    el.className = `store-access-msg ${type}`.trim();
    el.textContent = text || "";
  }

  function switchTab(name){
    document.querySelectorAll("[data-store-tab]").forEach(b => b.classList.toggle("active", b.dataset.storeTab === name));
    document.querySelectorAll("[data-store-view]").forEach(v => v.classList.toggle("active", v.dataset.storeView === name));
    setTimeout(() => document.querySelector(name === "login" ? "#storeLoginPhone" : "#storeRegName")?.focus(), 50);
  }

  function renderApprovedBox(){
    const box = document.getElementById("storeApprovedBox");
    const form = document.getElementById("storeLoginForm");
    if(!box || !form) return;
    if(state.authorized){
      const s = state.store || cachedStore() || {};
      box.innerHTML = `<div class="store-access-approved">✓ อุปกรณ์นี้ได้รับสิทธิ์แล้ว${s.name ? `<br><b>${esc(s.name)}</b>` : ""}${s.province ? ` · ${esc(s.province)}` : ""}<br><button class="store-access-logout" id="storeAccessLogout" type="button">ลืมสิทธิ์ในอุปกรณ์นี้</button></div>`;
      form.style.display = "none";
      document.getElementById("storeAccessLogout")?.addEventListener("click", () => {
        clearAuthorized();
        renderApprovedBox();
      });
    }else{
      box.innerHTML = "";
      form.style.display = "";
    }
  }

  function open(tab="login"){
    const m = document.getElementById("storeAccessModal");
    if(!m) return;
    switchTab(tab);
    renderApprovedBox();
    m.classList.add("show");
    m.setAttribute("aria-hidden","false");
  }

  function close(){
    const m = document.getElementById("storeAccessModal");
    if(!m) return;
    m.classList.remove("show");
    m.setAttribute("aria-hidden","true");
  }

  async function validateSavedToken(){
    let token = "";
    try{token = localStorage.getItem(TOKEN_KEY) || ""}catch(_){}
    if(!token){updateAccessButton();return false}
    try{
      const j = await post("storeValidateToken", {token});
      if(j?.authorized){
        setAuthorized(j.store || cachedStore());
        return true;
      }
      clearAuthorized();
      return false;
    }catch(e){
      // Network failure should not erase a valid remembered token.
      const c = cachedStore();
      if(c){
        state.authorized = true;
        state.store = c;
        updateAccessButton();
      }
      return false;
    }
  }

  function normalizePhone(v){
    return String(v ?? "").replace(/\D/g,"").slice(0,10);
  }

  async function login(phone){
    phone = normalizePhone(phone);
    return await post("storeLogin", {phone});
  }

  async function register(payload){
    return await post("storeRegister", payload);
  }

  function bind(){
    document.getElementById("storeAccessBtn")?.addEventListener("click", () => open("login"));
    document.getElementById("storeAccessClose")?.addEventListener("click", close);
    document.getElementById("storeAccessModal")?.addEventListener("click", e => {if(e.target?.id === "storeAccessModal") close()});
    document.addEventListener("keydown", e => {if(e.key === "Escape") close()});
    document.querySelectorAll("[data-store-tab]").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.storeTab)));

    const loginPhone = document.getElementById("storeLoginPhone");
    const regPhone = document.getElementById("storeRegPhone");
    digitsOnly(loginPhone); digitsOnly(regPhone);

    document.getElementById("storeLoginForm")?.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = document.getElementById("storeLoginSubmit");
      const msg = document.getElementById("storeLoginMsg");
      const phone = normalizePhone(loginPhone.value);
      loginPhone.value = phone;
      if(!/^\d{10}$/.test(phone)){
        setMsg(msg, "กรุณากรอกเบอร์โทรเป็นตัวเลข 10 หลัก", "error");
        loginPhone.focus(); return;
      }
      btn.disabled = true;
      setMsg(msg, "กำลังตรวจสอบสิทธิ์...", "info");
      try{
        const j = await login(phone);
        if(j?.authorized && j?.token){
          localStorage.setItem(TOKEN_KEY, j.token);
          setAuthorized(j.store || null);
          setMsg(msg, "เข้าสู่ระบบเรียบร้อย", "success");
          renderApprovedBox();
          setTimeout(close, 650);
        }else{
          const status = String(j?.status || "").toUpperCase();
          if(status === "PENDING"){
            setMsg(msg, "คำขออยู่ระหว่างการตรวจสอบ เมื่ออนุมัติแล้วใช้เบอร์เดิมเข้าสู่ระบบได้ทันที", "info");
          }else if(status === "REJECTED"){
            setMsg(msg, "คำขอนี้ยังไม่ได้รับอนุมัติ กรุณาติดต่อ JackLeeplus เพื่อตรวจสอบข้อมูล", "error");
          }else if(status === "REVOKED"){
            setMsg(msg, "สิทธิ์ของร้านนี้ถูกยกเลิก กรุณาติดต่อ JackLeeplus หากต้องการเปิดสิทธิ์อีกครั้ง", "error");
          }else{
            setMsg(msg, j?.message || "ยังไม่พบสิทธิ์ของเบอร์นี้ หากเป็นร้านใหม่ให้เลือก ‘ลงทะเบียนร้านค้า’", "error");
          }
        }
      }catch(_){
        setMsg(msg, "เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่", "error");
      }finally{btn.disabled = false}
    });

    document.getElementById("storeRegisterForm")?.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = document.getElementById("storeRegisterSubmit");
      const msg = document.getElementById("storeRegisterMsg");
      const storeName = document.getElementById("storeRegName").value.trim();
      const contactName = document.getElementById("storeRegContact").value.trim();
      const phone = normalizePhone(regPhone.value);
      regPhone.value = phone;
      const province = document.getElementById("storeRegProvince").value.trim();
      const contactDetail = document.getElementById("storeRegContactDetail").value.trim();

      if(!storeName){setMsg(msg,"กรุณากรอกชื่อร้าน","error");document.getElementById("storeRegName").focus();return}
      if(!/^\d{10}$/.test(phone)){setMsg(msg,"กรุณากรอกเบอร์โทรเป็นตัวเลข 10 หลัก","error");regPhone.focus();return}

      btn.disabled = true;
      setMsg(msg, "กำลังส่งคำขอ...", "info");
      try{
        const j = await register({storeName, contactName, phone, province, contactDetail});
        if(j?.success){
          setMsg(msg, "ส่งคำขอเรียบร้อยแล้ว ✓ กรุณารอทีมงาน JackLeeplus ตรวจสอบ เมื่ออนุมัติแล้วใช้เบอร์เดิมเข้าสู่ระบบได้เลย", "success");
          document.getElementById("storeRegisterForm").reset();
        }else{
          const status = String(j?.status || "").toUpperCase();
          if(status === "PENDING"){
            setMsg(msg, "เบอร์นี้ลงทะเบียนแล้ว และคำขอยังอยู่ระหว่างการตรวจสอบ", "info");
          }else if(status === "APPROVED"){
            setMsg(msg, "เบอร์นี้ได้รับอนุมัติแล้ว กำลังพาไปหน้าเข้าสู่ระบบ…", "success");
            loginPhone.value = phone;
            setTimeout(() => switchTab("login"), 700);
          }else if(status === "REJECTED"){
            setMsg(msg, "เบอร์นี้มีคำขอที่ยังไม่ได้รับอนุมัติ กรุณาติดต่อ JackLeeplus", "error");
          }else if(status === "REVOKED"){
            setMsg(msg, "สิทธิ์ของเบอร์นี้ถูกยกเลิก กรุณาติดต่อ JackLeeplus หากต้องการเปิดสิทธิ์อีกครั้ง", "error");
          }else{
            setMsg(msg, j?.message || "ไม่สามารถส่งคำขอได้ กรุณาลองใหม่", "error");
          }
        }
      }catch(_){
        setMsg(msg, "เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่", "error");
      }finally{btn.disabled = false}
    });
  }

  function addHeaderButton(){
    if(document.getElementById("storeAccessBtn")) return;
    const nav = document.querySelector(".topNav");
    if(!nav) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "storeAccessBtn";
    btn.className = "store-access-btn";
    btn.textContent = "ลงทะเบียนร้านค้า / เปิดสิทธิ์ดูราคา";
    nav.insertBefore(btn, nav.firstChild);
  }

  async function init(){
    addHeaderButton();
    buildUI();
    bind();
    updateAccessButton();
    await validateSavedToken();
    renderApprovedBox();
    try{
      const q=new URL(location.href).searchParams;
      if(q.get("access")==="1") open("login");
    }catch(_){}
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  }else{
    init();
  }
})();
