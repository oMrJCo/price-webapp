const SPREADSHEET_ID = "1g_j4Jym6hvqm2xvHRiM3_RJHshzGgOtAkTQXh3xHOkU";

const ALL_BRAND_KEY = "__ALL__";
const ALL_BRAND_LABEL = "All";

function el(id){ return document.getElementById(id); }

function escapeHTML(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function csvUrlForSheet(sheetName){
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

function normalizeImageUrl(url){
  const s = (url || "").trim();
  if(!s) return "";
  if(s.startsWith("http")) return s;
  if(s.startsWith("/")) return "https://omrjco.github.io" + s;
  return s;
}

function normalizeSearchCompact(s){
  let t = String(s||"").toLowerCase();
  t = t.replace(/[^\p{L}\p{N}]+/gu,"");
  if(t.startsWith("ip") && !t.startsWith("iphone")){
    t = "iphone" + t.slice(2);
  }
  return t;
}

function parseCSV(text){
  const rows=[], row=[]; let cur="", q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(c=='"' && q && n=='"'){cur+='"';i++;continue;}
    if(c=='"'){q=!q;continue;}
    if(!q && c==','){row.push(cur);cur="";continue;}
    if(!q && (c=='\n'||c=='\r')){
      if(cur||row.length){row.push(cur);rows.push([...row]);}
      row.length=0;cur="";continue;
    }
    cur+=c;
  }
  if(cur||row.length){row.push(cur);rows.push([...row]);}
  return rows.filter(r=>r.some(c=>c.trim()));
}

function formatPrice(p){
  const n = Number(String(p||"").replace(/[^\d]/g,""));
  return Number.isFinite(n) ? `${n.toLocaleString("th-TH")} บาท` : "-";
}

function groupByBrandPreserveSheetOrder(rows){
  const map=new Map(), order=[];
  rows.forEach(r=>{
    const b=(r.brand||"Other").trim();
    if(!map.has(b)){map.set(b,[]);order.push(b);}
    map.get(b).push(r);
  });
  const out=[];
  order.forEach(b=>{
    out.push({__type:"brandHeader",brand:b});
    out.push(...map.get(b));
  });
  return out;
}

function renderTabs(brands, active, onClick){
  el("tabs").innerHTML = brands.map(b=>`
    <button class="tab ${b.key===active?"active":""}" data-b="${b.key}">${b.label}</button>
  `).join("");
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.onclick=()=>onClick(btn.dataset.b);
  });
}

function renderTable(rows){
  const tbody=el("tbody"), empty=el("empty");
  tbody.innerHTML = rows.map(r=>{
    if(r.__type==="brandHeader"){
      return `
        <tr class="brand-row">
          <td colspan="2">
            <span class="brand-pill">
              <span class="brand-dot"></span>${escapeHTML(r.brand)}
            </span>
          </td>
        </tr>`;
    }

    const img=normalizeImageUrl(r.image_url);
    const hasImg=!!img;

    return `
      <tr>
        <td>
          <div class="row">
            <div class="thumb ${hasImg?"":"no-img"}"
              ${hasImg?`data-img="${img}" data-title="${escapeHTML(r.model)}"`:""}
              tabindex="0">
              ${hasImg?`<img src="${img}" loading="lazy">`:""}
            </div>
            <div>
              <div class="model">${escapeHTML(r.model)}</div>
              <span class="brandBadge">${escapeHTML(r.brand)}</span>
            </div>
          </div>
        </td>
        <td class="price">${formatPrice(r.price)}</td>
      </tr>`;
  }).join("");

  empty.style.display = rows.some(r=>!r.__type) ? "none":"block";
}

async function loadSheet(name){
  const res = await fetch(csvUrlForSheet(name),{cache:"no-store"});
  const rows=parseCSV(await res.text());
  const headers=rows.shift();
  return rows.map(r=>{
    const o={}; headers.forEach((h,i)=>o[h]=r[i]||""); return o;
  });
}

(function init(){
  const tab = new URL(location).searchParams.get("tab") || "Battery";
  el("pageTitle").textContent = tab;
  el("crumb").textContent = `Sheet › ${tab}`;

  loadSheet(tab).then(all=>{
    el("updateText").textContent = "อัปเดต: " + (all.find(r=>r.updated)?.updated||"-");

    const brands=[{key:ALL_BRAND_KEY,label:ALL_BRAND_LABEL},
      ...[...new Set(all.map(r=>r.brand).filter(Boolean))]
        .map(b=>({key:b,label:b}))
    ];

    let active=ALL_BRAND_KEY, q="";

    function apply(){
      let rows=[...all];
      if(!q && active!==ALL_BRAND_KEY){
        rows=rows.filter(r=>r.brand===active);
        renderTable(rows); return;
      }
      if(!q && active===ALL_BRAND_KEY){
        renderTable(groupByBrandPreserveSheetOrder(rows)); return;
      }
      const qc=normalizeSearchCompact(q);
      rows=rows.filter(r=>{
        const h=normalizeSearchCompact(`${r.brand} ${r.model}`);
        return h.includes(qc);
      });
      renderTable(rows);
    }

    renderTabs(brands,active,b=>{active=b;renderTabs(brands,active,arguments.callee);apply();});
    el("search").oninput=e=>{q=e.target.value.trim();apply();};
    apply();
  });
})();
