const $=id=>document.getElementById(id),priceKeys=["gram","ceyrek","yarim","tam","cumhuriyet","bilezik22"];
let state=null,cities={},selectedCity="istanbul";

async function api(url,opt={}){const r=await fetch(url,{...opt,headers:{"Content-Type":"application/json",...(opt.headers||{})}});let data={};try{data=await r.json()}catch{}if(!r.ok)throw Object.assign(new Error(data.error||"İşlem başarısız"),{status:r.status,data});return data}
async function session(){try{const s=await api("/api/admin/session");if(s.authenticated){showApp();await load()}else if(!s.configured){$("loginWarning").textContent="Panel etkin değil. Render Environment bölümüne ADMIN_PASSWORD ve ADMIN_SECRET eklenmeli.";$("loginWarning").classList.remove("hidden")}}catch{}}
function showApp(){$("loginView").classList.add("hidden");$("appView").classList.remove("hidden")}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();$("loginMsg").textContent="Giriş yapılıyor...";try{await api("/api/admin/login",{method:"POST",body:JSON.stringify({password:$("password").value})});showApp();await load()}catch(err){$("loginMsg").textContent=err.status===429?"Çok fazla deneme. 15 dakika sonra tekrar dene.":"Şifre hatalı veya panel yapılandırılmamış."}});
$("logoutBtn").addEventListener("click",async()=>{await api("/api/admin/logout",{method:"POST"});location.reload()});
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav-item,.page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.page).classList.add("active")}));

function setv(id,v){const e=$(id);if(e)e.value=v??""} function setc(id,v){const e=$(id);if(e)e.checked=!!v}
async function load(){
 const d=await api("/api/admin/config");state=d.config;cities=d.cities;
 $("defaultCity").innerHTML=Object.entries(cities).map(([s,n])=>`<option value="${s}">${n}</option>`).join("");
 setv("announcement",state.site.announcement);setv("defaultCity",state.site.defaultCity);setc("maintenance",state.site.maintenance);
 setv("siteName",state.site.siteName);setv("domainLabel",state.site.domainLabel);setv("primaryColor",state.site.primaryColor);setv("accentColor",state.site.accentColor);setv("primaryColorPick",state.site.primaryColor);setv("accentColorPick",state.site.accentColor);
 setv("heroEyebrow",state.home.eyebrow);setv("heroTitleBefore",state.home.heroTitleBefore);setv("heroHighlight",state.home.heroHighlight);setv("heroTitleAfter",state.home.heroTitleAfter);setv("heroDescription",state.home.heroDescription);
 setv("goldSectionTitle",state.home.goldSectionTitle);setv("fxSectionTitle",state.home.fxSectionTitle);setv("toolsSectionTitle",state.home.toolsSectionTitle);setv("citiesSectionTitle",state.home.citiesSectionTitle);
 ["showMarket","showGold","showFx","showCalculators","showCities","showBenefits"].forEach(id=>setc(id,state.home[id]));
 setv("navGold",state.navigation.gold);setv("navFx",state.navigation.fx);setv("navTools",state.navigation.tools);setv("navCities",state.navigation.cities);
 setc("fxEnabled",state.fx.enabled);setv("fxRefresh",state.fx.refreshMinutes);
 setc("toolGold",state.tools.gold);setc("toolLoan",state.tools.loan);setc("toolPercent",state.tools.percent);setc("toolVat",state.tools.vat);setc("toolRaise",state.tools.raise);
 setc("adsEnabled",state.ads.enabled);setv("adsClient",state.ads.adsenseClient);setv("topSlot",state.ads.topSlot);setv("middleSlot",state.ads.middleSlot);
 setv("seoTitle",state.seo.defaultTitle);setv("seoDescription",state.seo.defaultDescription);setv("googleVerification",state.seo.googleSiteVerification);
 setv("aboutTitle",state.pages.aboutTitle);setv("aboutBody",state.pages.aboutBody);setv("privacyTitle",state.pages.privacyTitle);setv("privacyBody",state.pages.privacyBody);setv("termsTitle",state.pages.termsTitle);setv("termsBody",state.pages.termsBody);
 setv("footerDescription",state.footer.description);setv("contactEmail",state.footer.contactEmail);setv("copyright",state.footer.copyright);setc("showLegalLinks",state.footer.showLegalLinks);
 renderCities("");selectCity(selectedCity);refreshMediaPreview();
 const status=await api("/api/admin/status");
 $("persistStatus").textContent=status.githubPersistence?"GitHub kalıcı kayıt aktif":"GitHub kalıcı kayıt kapalı";$("persistStatus").className="status "+(status.githubPersistence?"ok":"bad");
 $("statSources").textContent=status.configuredSources;$("statUptime").textContent=Math.round(status.uptime/60);
 $("systemInfo").innerHTML=`<div class="system-line"><b>Servis:</b> ${status.service}</div><div class="system-line"><b>Node:</b> ${status.node}</div><div class="system-line"><b>Çalışma süresi:</b> ${Math.round(status.uptime/60)} dakika</div><div class="system-line"><b>Canlı adaptör:</b> ${status.adapters}</div><div class="system-line"><b>Panel kaynağı:</b> ${status.configuredSources}</div>`;
 $("githubInfo").innerHTML=status.githubPersistence?'<span class="status ok">GitHub otomatik kayıt aktif</span>':'<span class="status bad">GITHUB_TOKEN / OWNER / REPO ayarları eksik</span>';
}
function renderCities(q){const n=(q||"").toLocaleLowerCase("tr-TR");$("cityList").innerHTML=Object.entries(cities).filter(([,name])=>name.toLocaleLowerCase("tr-TR").includes(n)).map(([s,name])=>`<button class="city-btn ${s===selectedCity?"active":""}" data-city="${s}">${name}</button>`).join("");document.querySelectorAll(".city-btn").forEach(b=>b.addEventListener("click",()=>selectCity(b.dataset.city)))}
$("citySearch").addEventListener("input",e=>renderCities(e.target.value));
function selectCity(slug){selectedCity=slug;renderCities($("citySearch").value);const c=state.cities?.[slug]||{};$("cityTitle").textContent=(cities[slug]||slug)+" Ayarı";setv("sourceMode",c.sourceMode||"none");setv("sourceName",c.sourceName||"");setv("sourceUrl",c.sourceUrl||"");priceKeys.forEach(k=>{setv(k+"Buy",c.prices?.[k]?.buy??"");setv(k+"Sell",c.prices?.[k]?.sell??"")});toggleManual()}
$("sourceMode").addEventListener("change",toggleManual);function toggleManual(){$("manualPrices").style.display=$("sourceMode").value==="manual"?"block":"none"}
function collectCity(){const prices={};priceKeys.forEach(k=>prices[k]={buy:Number($(k+"Buy").value)||0,sell:Number($(k+"Sell").value)||0});state.cities[selectedCity]={sourceMode:$("sourceMode").value,sourceName:$("sourceName").value.trim(),sourceUrl:$("sourceUrl").value.trim(),prices,updatedAt:new Date().toISOString()}}

function collect(){
 collectCity();
 state.site={...state.site,announcement:$("announcement").value.trim(),maintenance:$("maintenance").checked,defaultCity:$("defaultCity").value,siteName:$("siteName").value.trim(),domainLabel:$("domainLabel").value.trim(),primaryColor:$("primaryColor").value.trim(),accentColor:$("accentColor").value.trim()};
 state.home={eyebrow:$("heroEyebrow").value.trim(),heroTitleBefore:$("heroTitleBefore").value.trim(),heroHighlight:$("heroHighlight").value.trim(),heroTitleAfter:$("heroTitleAfter").value.trim(),heroDescription:$("heroDescription").value.trim(),goldSectionTitle:$("goldSectionTitle").value.trim(),fxSectionTitle:$("fxSectionTitle").value.trim(),toolsSectionTitle:$("toolsSectionTitle").value.trim(),citiesSectionTitle:$("citiesSectionTitle").value.trim(),showMarket:$("showMarket").checked,showGold:$("showGold").checked,showFx:$("showFx").checked,showCalculators:$("showCalculators").checked,showCities:$("showCities").checked,showBenefits:$("showBenefits").checked};
 state.navigation={gold:$("navGold").value.trim(),fx:$("navFx").value.trim(),tools:$("navTools").value.trim(),cities:$("navCities").value.trim()};
 state.fx={enabled:$("fxEnabled").checked,refreshMinutes:Math.max(1,Math.min(60,Number($("fxRefresh").value)||5))};
 state.tools={gold:$("toolGold").checked,loan:$("toolLoan").checked,percent:$("toolPercent").checked,vat:$("toolVat").checked,raise:$("toolRaise").checked};
 state.ads={enabled:$("adsEnabled").checked,adsenseClient:$("adsClient").value.trim(),topSlot:$("topSlot").value.trim(),middleSlot:$("middleSlot").value.trim()};
 state.seo={defaultTitle:$("seoTitle").value.trim(),defaultDescription:$("seoDescription").value.trim(),googleSiteVerification:$("googleVerification").value.trim()};
 state.pages={aboutTitle:$("aboutTitle").value.trim(),aboutBody:$("aboutBody").value.trim(),privacyTitle:$("privacyTitle").value.trim(),privacyBody:$("privacyBody").value.trim(),termsTitle:$("termsTitle").value.trim(),termsBody:$("termsBody").value.trim()};
 state.footer={description:$("footerDescription").value.trim(),contactEmail:$("contactEmail").value.trim(),copyright:$("copyright").value.trim(),showLegalLinks:$("showLegalLinks").checked};
}
$("saveBtn").addEventListener("click",async()=>{collect();$("saveMsg").textContent="Kaydediliyor...";try{const r=await api("/api/admin/config",{method:"PUT",body:JSON.stringify({config:state})});$("saveMsg").textContent=r.githubCommitted?"Kaydedildi • GitHub'a işlendi":"Kaydedildi • GitHub kalıcı kayıt kapalı";setTimeout(()=>$("saveMsg").textContent="",5000)}catch(e){$("saveMsg").textContent="Kayıt başarısız: "+e.message}});

$("primaryColorPick").addEventListener("input",e=>$("primaryColor").value=e.target.value);$("accentColorPick").addEventListener("input",e=>$("accentColor").value=e.target.value);
$("primaryColor").addEventListener("input",e=>{if(/^#[0-9a-f]{6}$/i.test(e.target.value))$("primaryColorPick").value=e.target.value});$("accentColor").addEventListener("input",e=>{if(/^#[0-9a-f]{6}$/i.test(e.target.value))$("accentColorPick").value=e.target.value});

function refreshMediaPreview(){[["logoPreview",state.site.logoPath],["faviconPreview",state.site.faviconPath],["heroPreview",state.site.heroImagePath]].forEach(([id,path])=>{const e=$(id);if(path){e.src=path+"?v="+Date.now();e.classList.remove("hidden")}else e.classList.add("hidden")})}
document.querySelectorAll(".uploadBtn").forEach(btn=>btn.addEventListener("click",async()=>{const input=$(btn.dataset.input),file=input.files?.[0];if(!file)return alert("Önce bir dosya seç.");if(file.size>2*1024*1024)return alert("Dosya 2 MB'dan küçük olmalı.");btn.disabled=true;btn.textContent="Yükleniyor...";try{const data=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(",")[1]);r.onerror=no;r.readAsDataURL(file)});const resp=await api("/api/admin/media",{method:"POST",body:JSON.stringify({kind:btn.dataset.kind,filename:file.name,mime:file.type,dataBase64:data})});if(btn.dataset.kind==="logo")state.site.logoPath=resp.path;if(btn.dataset.kind==="favicon")state.site.faviconPath=resp.path;if(btn.dataset.kind==="hero")state.site.heroImagePath=resp.path;refreshMediaPreview();alert(resp.githubCommitted?"Dosya yüklendi ve GitHub'a işlendi.":"Dosya yüklendi. GitHub kalıcı kayıt kapalı.")}catch(e){alert("Yükleme başarısız: "+e.message)}finally{btn.disabled=false;btn.textContent="Yükle"}}));

session();
