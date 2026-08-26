const CITIES={adana:"Adana",adiyaman:"Adıyaman",afyonkarahisar:"Afyonkarahisar",agri:"Ağrı",amasya:"Amasya",ankara:"Ankara",antalya:"Antalya",artvin:"Artvin",aydin:"Aydın",balikesir:"Balıkesir",bilecik:"Bilecik",bingol:"Bingöl",bitlis:"Bitlis",bolu:"Bolu",burdur:"Burdur",bursa:"Bursa",canakkale:"Çanakkale",cankiri:"Çankırı",corum:"Çorum",denizli:"Denizli",diyarbakir:"Diyarbakır",edirne:"Edirne",elazig:"Elazığ",erzincan:"Erzincan",erzurum:"Erzurum",eskisehir:"Eskişehir",gaziantep:"Gaziantep",giresun:"Giresun",gumushane:"Gümüşhane",hakkari:"Hakkari",hatay:"Hatay",isparta:"Isparta",mersin:"Mersin",istanbul:"İstanbul",izmir:"İzmir",kars:"Kars",kastamonu:"Kastamonu",kayseri:"Kayseri",kirklareli:"Kırklareli",kirsehir:"Kırşehir",kocaeli:"Kocaeli",konya:"Konya",kutahya:"Kütahya",malatya:"Malatya",manisa:"Manisa",kahramanmaras:"Kahramanmaraş",mardin:"Mardin",mugla:"Muğla",mus:"Muş",nevsehir:"Nevşehir",nigde:"Niğde",ordu:"Ordu",rize:"Rize",sakarya:"Sakarya",samsun:"Samsun",siirt:"Siirt",sinop:"Sinop",sivas:"Sivas",tekirdag:"Tekirdağ",tokat:"Tokat",trabzon:"Trabzon",tunceli:"Tunceli",sanliurfa:"Şanlıurfa",usak:"Uşak",van:"Van",yozgat:"Yozgat",zonguldak:"Zonguldak",aksaray:"Aksaray",bayburt:"Bayburt",karaman:"Karaman",kirikkale:"Kırıkkale",batman:"Batman",sirnak:"Şırnak",bartin:"Bartın",ardahan:"Ardahan",igdir:"Iğdır",yalova:"Yalova",karabuk:"Karabük",kilis:"Kilis",osmaniye:"Osmaniye",duzce:"Düzce"};

const $=id=>document.getElementById(id);

let goldData=null;
let fxData=null;
let currentCity="istanbul";
let fxTimer=null;
let goldTimer=null;

const money=n=>Number.isFinite(Number(n))
  ? new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:2}).format(Number(n))
  : "—";

const number=n=>new Intl.NumberFormat("tr-TR",{maximumFractionDigits:4}).format(Number(n)||0);

function cityFromPath(){
  const m=location.pathname.match(/^\/([a-z0-9-]+)-altin-fiyatlari\/?$/);
  return m&&CITIES[m[1]]?m[1]:"istanbul";
}

function initCities(){
  currentCity=cityFromPath();
  if($("citySelect")){
    $("citySelect").innerHTML=Object.entries(CITIES).map(([s,n])=>`<option value="${s}">${n}</option>`).join("");
    $("citySelect").value=currentCity;
  }
  renderCityLinks("");
  if($("cityHeading"))$("cityHeading").textContent=CITIES[currentCity];
}

function renderCityLinks(q){
  const box=$("cityLinks");
  if(!box)return;
  const needle=(q||"").toLocaleLowerCase("tr-TR");
  box.innerHTML=Object.entries(CITIES)
    .filter(([,n])=>n.toLocaleLowerCase("tr-TR").includes(needle))
    .map(([s,n])=>`<a href="/${s}-altin-fiyatlari">${n}</a>`)
    .join("")||"<span>Şehir bulunamadı.</span>";
}

function renderGold(data){
  goldData=data;
  if($("cityHeading"))$("cityHeading").textContent=CITIES[currentCity];

  if((!data.verified&&!data.manual)||!Array.isArray(data.prices)||!data.prices.length){
    if($("priceGrid"))$("priceGrid").innerHTML=`<div class="empty-price"><b>${CITIES[currentCity]} için doğrulanmış yerel canlı kaynak henüz bağlı değil.</b><span>Kaynak doğrulandığında fiyatlar burada otomatik gösterilecek.</span></div>`;
    if($("goldSourceChip"))$("goldSourceChip").textContent="Kaynak bekleniyor";
    if($("statusText"))$("statusText").textContent=`${CITIES[currentCity]} • doğrulanmış kaynak bekleniyor`;
    if($("sourceText"))$("sourceText").textContent="Bu şehir için doğrulanmış kuyumcu odası/dernek canlı veri kaynağı henüz sisteme eklenmedi.";
    if($("sourceLink"))$("sourceLink").hidden=true;
    if($("heroGram"))$("heroGram").textContent="—";
    if($("goldType"))$("goldType").innerHTML="<option>Canlı kaynak bekleniyor</option>";
    return;
  }

  if($("priceGrid")){
    $("priceGrid").innerHTML=data.prices.map(p=>`<article class="price-card"><div class="name">${p.name}</div><div class="sell">${money(p.sell)}</div><div class="buy">Alış: ${money(p.buy)}</div><span class="change ${Number(p.change)<0?"down":""}">${Number(p.change)>=0?"▲":"▼"} %${Math.abs(Number(p.change||0)).toFixed(2)}</span></article>`).join("");
  }

  if($("goldType"))$("goldType").innerHTML=data.prices.map(p=>`<option value="${p.key}">${p.name}</option>`).join("");
  if($("goldSourceChip"))$("goldSourceChip").textContent=data.manual?"Panelden girilen fiyat":"Doğrulanmış yerel kaynak";
  if($("statusText"))$("statusText").textContent=`${CITIES[currentCity]} • ${new Date(data.updatedAt).toLocaleString("tr-TR")}`;
  if($("sourceText"))$("sourceText").textContent=`Kaynak: ${data.sourceName}`;

  if($("sourceLink")){
    if(data.sourceUrl){
      $("sourceLink").href=data.sourceUrl;
      $("sourceLink").hidden=false;
    }else{
      $("sourceLink").hidden=true;
    }
  }

  const gram=data.prices.find(p=>p.key==="gram");
  if($("heroGram"))$("heroGram").textContent=gram?money(gram.sell):"—";
  markGoldSourceMode(data);
  calcGold();
}

async function loadGold(){
  try{
    const r=await fetch(`/api/prices?city=${encodeURIComponent(currentCity)}`,{cache:"no-store"});
    if(!r.ok)throw 0;
    renderGold(await r.json());
  }catch{
    renderGold({verified:false,prices:[]});
  }
}

function renderFx(data){
  fxData=data;

  const official=data.tcmb||data;
  const market=data.market;
  const order=["USD","EUR","GBP","CHF"];
  const labels={USD:"Dolar / TL",EUR:"Euro / TL",GBP:"Sterlin / TL",CHF:"İsviçre Frangı / TL"};

  if($("fxGrid")){
    $("fxGrid").innerHTML=order.map(c=>{
      const t=official.rates?.find(x=>x.code===c);
      const m=market?.rates?.find(x=>x.code===c);
      return `<article class="fx-card fx-compare-card">
        <div class="name">${labels[c]}</div>
        <div class="fx-columns">
          <div class="fx-source"><b>TCMB</b><span class="fx-sell">${t?money(t.sell):"—"}</span><small>${t?`Alış ${money(t.buy)}`:"Veri yok"}</small></div>
          <div class="fx-source market"><b>Kapalıçarşı</b><span class="fx-sell">${m?money(m.sell):"—"}</span><small>${m?`Alış ${money(m.buy)}`:"Veri bekleniyor"}</small></div>
        </div>
      </article>`;
    }).join("");
  }

  const converterRates=Array.isArray(data.rates)&&data.rates.length
    ? data.rates
    : (Array.isArray(official.rates)?official.rates:[]);

  if($("fxCurrency")){
    $("fxCurrency").innerHTML=converterRates
      .filter(r=>r&&r.code&&!["ONS","DXY"].includes(r.code))
      .map(r=>`<option value="${r.code}">${r.code} — ${r.name||r.code}</option>`)
      .join("");
  }

  if($("fxStatus")){
    $("fxStatus").textContent=market
      ? `TCMB + Kapalıçarşı • ${official.displayDate||new Date(data.updatedAt).toLocaleString("tr-TR")}`
      : "TCMB • Kapalıçarşı verisi bekleniyor";
  }

  const usd=(market?.rates?.find(x=>x.code==="USD"))||(official.rates||[]).find(x=>x.code==="USD");
  const eur=(market?.rates?.find(x=>x.code==="EUR"))||(official.rates||[]).find(x=>x.code==="EUR");

  if($("heroUsd"))$("heroUsd").textContent=usd?money(usd.sell):"—";
  if($("heroEur"))$("heroEur").textContent=eur?money(eur.sell):"—";

  updateFxCalculation();
}

async function loadFx(){
  try{
    const r=await fetch("/api/fx",{cache:"no-store"});
    if(!r.ok)throw 0;
    renderFx(await r.json());
  }catch{
    if($("fxStatus"))$("fxStatus").textContent="TCMB verisine şu anda ulaşılamıyor";
    if($("fxGrid")){
      $("fxGrid").innerHTML=["Dolar / TL","Euro / TL","Sterlin / TL","İsviçre Frangı / TL"]
        .map(n=>`<article class="fx-card"><div class="name">${n}</div><div class="fx-value">—</div></article>`)
        .join("");
    }
  }
}

function calcGold(){
  if(!goldData?.verified&&!goldData?.manual){
    if($("goldCalcResult"))$("goldCalcResult").textContent="Yerel fiyat bağlandığında hesaplanır.";
    return;
  }
  if(!$("goldType")||!$("goldAmount"))return;
  const p=goldData.prices.find(x=>x.key===$("goldType").value);
  const a=Math.max(0,Number($("goldAmount").value)||0);
  if($("goldCalcResult"))$("goldCalcResult").textContent=p?`${a} × ${p.name} = ${money(a*p.sell)}`:"—";
}

function calcFx(){
  if(!fxData||!$("fxCurrency")||!$("fxAmount"))return;
  const p=(fxData.rates||[]).find(x=>x.code===$("fxCurrency").value);
  const raw=$("fxAmount").value.trim();

  if(raw===""){
    if($("fxConvertResult"))$("fxConvertResult").textContent="";
    return;
  }

  const a=Math.max(0,Number(raw)||0);
  if($("fxConvertResult"))$("fxConvertResult").textContent=p?`${number(a)} ${p.code} ≈ ${money(a*p.sell)}`:"—";
}

function updateFxCalculation(){
  if(!$("fxAmount")||!$("fxCurrency"))return;

  const amountText=$("fxAmount").value.trim();
  const code=$("fxCurrency").value;

  if(amountText===""||!code){
    if($("fxConvertResult"))$("fxConvertResult").textContent="";
    return;
  }

  calcFx();
}

function calcLoan(){
  if(!$("loanAmount")||!$("loanMonths")||!$("loanRate"))return;
  const P=Math.max(0,Number($("loanAmount").value)||0);
  const m=Math.min(360,Math.max(1,Number($("loanMonths").value)||1));
  const r=Math.max(0,Number($("loanRate").value)||0)/100;
  const pay=r===0?P/m:P*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1);
  if($("loanResult"))$("loanResult").innerHTML=`Aylık ${money(pay)}<br><small>Toplam ${money(pay*m)}</small>`;
}

function calcPercent(){
  if(!$("percentBase")||!$("percentRate"))return;
  const b=Number($("percentBase").value)||0;
  const r=Number($("percentRate").value)||0;
  const v=b*r/100;
  if($("percentResult"))$("percentResult").innerHTML=`%${number(r)} = ${number(v)}<br><small>Artırılmış: ${number(b+v)} • Azaltılmış: ${number(b-v)}</small>`;
}

function calcVat(){
  if(!$("vatBase")||!$("vatRate")||!$("vatMode"))return;
  const b=Math.max(0,Number($("vatBase").value)||0);
  const r=Number($("vatRate").value)||0;
  const mode=$("vatMode").value;

  if(mode==="add"){
    const v=b*r/100;
    if($("vatResult"))$("vatResult").innerHTML=`KDV: ${money(v)}<br><small>Toplam: ${money(b+v)}</small>`;
  }else{
    const net=b/(1+r/100);
    const v=b-net;
    if($("vatResult"))$("vatResult").innerHTML=`KDV: ${money(v)}<br><small>KDV hariç: ${money(net)}</small>`;
  }
}

function calcRaise(){
  if(!$("raiseBase")||!$("raiseRate"))return;
  const b=Math.max(0,Number($("raiseBase").value)||0);
  const r=Math.max(0,Number($("raiseRate").value)||0);
  const v=b*r/100;
  if($("raiseResult"))$("raiseResult").innerHTML=`Yeni tutar: ${money(b+v)}<br><small>Artış: ${money(v)}</small>`;
}

async function locate(){
  const btn=$("locateBtn");
  if(!btn)return;

  if(!navigator.geolocation){
    btn.textContent="Konum desteklenmiyor";
    return;
  }

  btn.textContent="Konum bulunuyor…";

  navigator.geolocation.getCurrentPosition(async p=>{
    try{
      const r=await fetch(`/api/reverse-geocode?lat=${encodeURIComponent(p.coords.latitude)}&lon=${encodeURIComponent(p.coords.longitude)}`);
      if(!r.ok)throw 0;
      const d=await r.json();

      if(d.citySlug&&CITIES[d.citySlug]){
        currentCity=d.citySlug;
        if($("citySelect"))$("citySelect").value=currentCity;
        history.pushState(null,"",`/${currentCity}-altin-fiyatlari`);
        if($("cityHeading"))$("cityHeading").textContent=CITIES[currentCity];
        btn.textContent=`📍 ${CITIES[currentCity]}`;
        loadGold();
      }else{
        btn.textContent="Şehri seç";
      }
    }catch{
      btn.textContent="Şehri seç";
    }
  },()=>{
    btn.textContent="Konum izni gerekli";
  },{timeout:8000,maximumAge:300000});
}

function setupFxSearch(){
  const search=$("fxSearch");
  const select=$("fxCurrency");

  if(!search||!select)return;

  search.addEventListener("input",function(){
    const q=this.value.trim().toLocaleUpperCase("tr-TR");
    let firstMatch=null;

    for(const option of select.options){
      const haystack=`${option.value} ${option.textContent}`.toLocaleUpperCase("tr-TR");
      const match=!q||haystack.includes(q);
      option.hidden=!match;
      if(match&&!firstMatch)firstMatch=option;
    }

    if(firstMatch){
      select.value=firstMatch.value;
      updateFxCalculation();
    }else{
      if($("fxConvertResult"))$("fxConvertResult").textContent="Döviz bulunamadı";
    }
  });
}

async function loadPublicConfig(){
  try{
    const r=await fetch("/api/site-config",{cache:"no-store"});
    if(!r.ok)return;

    const c=await r.json();
    const s=c.site||{};
    const h=c.home||{};
    const n=c.navigation||{};
    const f=c.footer||{};

    if(s.primaryColor)document.documentElement.style.setProperty("--gold",s.primaryColor);
    if(s.accentColor)document.documentElement.style.setProperty("--gold2",s.accentColor);

    if(s.announcement){
      const bar=document.createElement("div");
      bar.className="admin-announcement";
      bar.textContent=s.announcement;
      document.body.prepend(bar);
    }

    if(s.siteName){
      document.querySelectorAll(".brand").forEach(el=>{
        const t=el.querySelector("#brandText")||el.querySelector("span:last-child");
        if(t)t.textContent=s.siteName;
      });
    }

    if(s.logoPath){
      document.querySelectorAll(".brand-icon").forEach(icon=>{
        const img=document.createElement("img");
        img.src=s.logoPath;
        img.alt="";
        img.className="brand-logo-img";
        icon.replaceWith(img);
      });
    }

    if(s.faviconPath){
      const fav=document.getElementById("siteFavicon");
      if(fav)fav.href=s.faviconPath;
    }

    if(s.heroImagePath){
      const hero=document.getElementById("heroSection");
      if(hero){
        hero.style.backgroundImage=`linear-gradient(90deg,rgba(6,6,6,.94),rgba(10,10,10,.70)),url("${s.heroImagePath}")`;
        hero.style.backgroundSize="cover";
        hero.style.backgroundPosition="center";
      }
    }

    if(c.fx?.refreshMinutes){
      clearInterval(fxTimer);
      fxTimer=setInterval(loadFx,Math.max(1,Math.min(60,Number(c.fx.refreshMinutes)||5))*60000);
    }

    const set=(id,v)=>{
      const e=document.getElementById(id);
      if(e&&v!==undefined)e.textContent=v;
    };

    set("heroEyebrow",h.eyebrow);
    set("heroBefore",h.heroTitleBefore);
    set("heroHighlight",h.heroHighlight);
    set("heroAfter",h.heroTitleAfter);
    set("heroDescription",h.heroDescription);
    set("goldSectionTitle",h.goldSectionTitle);
    set("fxSectionTitle",h.fxSectionTitle);
    set("toolsSectionTitle",h.toolsSectionTitle);
    set("citiesSectionTitle",h.citiesSectionTitle);
    set("navGold",n.gold);
    set("navFx",n.fx);
    set("navTools",n.tools);
    set("navCities",n.cities);
    set("footerDescription",f.description);

    const show=(id,on)=>{
      const e=document.getElementById(id);
      if(e)e.style.display=on===false?"none":"";
    };

    show("marketBox",h.showMarket);
    show("gold",h.showGold);
    show("fx",h.showFx!==false&&c.fx?.enabled!==false);
    show("calculators",h.showCalculators);
    show("cities",h.showCities);
    show("benefitsSection",h.showBenefits);

    const toolMap={
      gold:"goldCalcPanel",
      loan:"loanCalcPanel",
      percent:"percentCalcPanel",
      vat:"vatCalcPanel",
      raise:"raiseCalcPanel"
    };

    Object.entries(toolMap).forEach(([k,id])=>show(id,c.tools?.[k]));
    show("legalLinks",f.showLegalLinks);
  }catch(error){
    console.error("Public config error:",error);
  }
}

function markGoldSourceMode(data){
  const badge=document.getElementById("sourceBadge");
  const text=document.getElementById("sourceText");

  if(!data)return;

  if(data.central){
    if(badge)badge.textContent="Türkiye geneli canlı veri";
    if(text)text.textContent="Bu şehir için doğrulanmış özel yerel kaynak henüz bağlı değil; gösterilen fiyatlar merkezi canlı altın kaynağından alınır.";
  }else if(data.manual){
    if(badge)badge.textContent="Yerel manuel fiyat";
  }else if(data.verified){
    if(badge)badge.textContent="Doğrulanmış yerel kaynak";
  }
}

function setupEvents(){
  $("citySelect")?.addEventListener("change",()=>{
    currentCity=$("citySelect").value;
    history.pushState(null,"",`/${currentCity}-altin-fiyatlari`);
    if($("cityHeading"))$("cityHeading").textContent=CITIES[currentCity];
    loadGold();
  });

  $("citySearch")?.addEventListener("input",e=>renderCityLinks(e.target.value));
  $("locateBtn")?.addEventListener("click",locate);

  $("goldAmount")?.addEventListener("input",calcGold);
  $("goldType")?.addEventListener("change",calcGold);

  $("fxAmount")?.addEventListener("input",updateFxCalculation);
  $("fxCurrency")?.addEventListener("change",updateFxCalculation);

  $("loanAmount")?.addEventListener("input",calcLoan);
  $("loanMonths")?.addEventListener("input",calcLoan);
  $("loanRate")?.addEventListener("input",calcLoan);
  $("loanBtn")?.addEventListener("click",calcLoan);

  $("percentBase")?.addEventListener("input",calcPercent);
  $("percentRate")?.addEventListener("input",calcPercent);
  $("percentBtn")?.addEventListener("click",calcPercent);

  $("vatBase")?.addEventListener("input",calcVat);
  $("vatRate")?.addEventListener("input",calcVat);
  $("vatMode")?.addEventListener("change",calcVat);

  $("raiseBase")?.addEventListener("input",calcRaise);
  $("raiseRate")?.addEventListener("input",calcRaise);

  $("menuToggle")?.addEventListener("click",()=>{
    const nav=$("mainNav");
    if(!nav)return;
    const open=nav.classList.toggle("open");
    $("menuToggle")?.setAttribute("aria-expanded",String(open));
  });

  $("mainNav")?.addEventListener("click",()=>{
    $("mainNav")?.classList.remove("open");
    $("menuToggle")?.setAttribute("aria-expanded","false");
  });

  setupFxSearch();
}

async function init(){
  initCities();
  setupEvents();

  await Promise.allSettled([
    loadPublicConfig(),
    loadGold(),
    loadFx()
  ]);

  if(!goldTimer)goldTimer=setInterval(loadGold,60000);
  if(!fxTimer)fxTimer=setInterval(loadFx,5*60000);
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init,{once:true});
}else{
  init();
}
