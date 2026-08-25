const express=require("express");
const path=require("path");
const fs=require("fs");
const crypto=require("crypto");

const app=express();
const PORT=process.env.PORT||3000;
const BASE="https://altinnekadar.com.tr";
const PUBLIC=path.join(__dirname,"public");
const DATA_DIR=path.join(__dirname,"data");
const CONFIG_FILE=path.join(DATA_DIR,"site-config.json");
const UPLOADS=path.join(PUBLIC,"uploads");

const CITIES={adana:"Adana",adiyaman:"Adıyaman",afyonkarahisar:"Afyonkarahisar",agri:"Ağrı",amasya:"Amasya",ankara:"Ankara",antalya:"Antalya",artvin:"Artvin",aydin:"Aydın",balikesir:"Balıkesir",bilecik:"Bilecik",bingol:"Bingöl",bitlis:"Bitlis",bolu:"Bolu",burdur:"Burdur",bursa:"Bursa",canakkale:"Çanakkale",cankiri:"Çankırı",corum:"Çorum",denizli:"Denizli",diyarbakir:"Diyarbakır",edirne:"Edirne",elazig:"Elazığ",erzincan:"Erzincan",erzurum:"Erzurum",eskisehir:"Eskişehir",gaziantep:"Gaziantep",giresun:"Giresun",gumushane:"Gümüşhane",hakkari:"Hakkari",hatay:"Hatay",isparta:"Isparta",mersin:"Mersin",istanbul:"İstanbul",izmir:"İzmir",kars:"Kars",kastamonu:"Kastamonu",kayseri:"Kayseri",kirklareli:"Kırklareli",kirsehir:"Kırşehir",kocaeli:"Kocaeli",konya:"Konya",kutahya:"Kütahya",malatya:"Malatya",manisa:"Manisa",kahramanmaras:"Kahramanmaraş",mardin:"Mardin",mugla:"Muğla",mus:"Muş",nevsehir:"Nevşehir",nigde:"Niğde",ordu:"Ordu",rize:"Rize",sakarya:"Sakarya",samsun:"Samsun",siirt:"Siirt",sinop:"Sinop",sivas:"Sivas",tekirdag:"Tekirdağ",tokat:"Tokat",trabzon:"Trabzon",tunceli:"Tunceli",sanliurfa:"Şanlıurfa",usak:"Uşak",van:"Van",yozgat:"Yozgat",zonguldak:"Zonguldak",aksaray:"Aksaray",bayburt:"Bayburt",karaman:"Karaman",kirikkale:"Kırıkkale",batman:"Batman",sirnak:"Şırnak",bartin:"Bartın",ardahan:"Ardahan",igdir:"Iğdır",yalova:"Yalova",karabuk:"Karabük",kilis:"Kilis",osmaniye:"Osmaniye",duzce:"Düzce"};
const CENTERS={adana:[37,35.3213],adiyaman:[37.7648,38.2786],afyonkarahisar:[38.7507,30.5567],agri:[39.7191,43.0503],amasya:[40.6499,35.8353],ankara:[39.9334,32.8597],antalya:[36.8969,30.7133],artvin:[41.1828,41.8183],aydin:[37.856,27.8416],balikesir:[39.6484,27.8826],bilecik:[40.1426,29.9793],bingol:[38.8854,40.498],bitlis:[38.4006,42.1095],bolu:[40.735,31.6061],burdur:[37.7203,30.2908],bursa:[40.195,29.06],canakkale:[40.1553,26.4142],cankiri:[40.6013,33.6134],corum:[40.5506,34.9556],denizli:[37.7765,29.0864],diyarbakir:[37.9144,40.2306],edirne:[41.6818,26.5623],elazig:[38.681,39.2264],erzincan:[39.75,39.5],erzurum:[39.9043,41.2679],eskisehir:[39.7767,30.5206],gaziantep:[37.0662,37.3833],giresun:[40.9128,38.3895],gumushane:[40.4603,39.4814],hakkari:[37.5744,43.7408],hatay:[36.2023,36.1606],isparta:[37.7648,30.5566],mersin:[36.8121,34.6415],istanbul:[41.0082,28.9784],izmir:[38.4237,27.1428],kars:[40.6013,43.0975],kastamonu:[41.3887,33.7827],kayseri:[38.7312,35.4787],kirklareli:[41.7351,27.2252],kirsehir:[39.1425,34.1709],kocaeli:[40.8533,29.8815],konya:[37.8746,32.4932],kutahya:[39.4192,29.9857],malatya:[38.3552,38.3095],manisa:[38.6191,27.4289],kahramanmaras:[37.5753,36.9228],mardin:[37.3212,40.7245],mugla:[37.2153,28.3636],mus:[38.7433,41.5065],nevsehir:[38.6244,34.7142],nigde:[37.9698,34.6766],ordu:[40.9839,37.8764],rize:[41.0201,40.5234],sakarya:[40.7569,30.3781],samsun:[41.2867,36.33],siirt:[37.9333,41.95],sinop:[42.0264,35.1551],sivas:[39.7477,37.0179],tekirdag:[40.978,27.511],tokat:[40.3167,36.55],trabzon:[41.0015,39.7178],tunceli:[39.1079,39.5401],sanliurfa:[37.1674,38.7955],usak:[38.6823,29.4082],van:[38.4891,43.4089],yozgat:[39.8181,34.8147],zonguldak:[41.4564,31.7987],aksaray:[38.3687,34.037],bayburt:[40.2552,40.2249],karaman:[37.181,33.215],kirikkale:[39.8468,33.5153],batman:[37.8812,41.1351],sirnak:[37.5164,42.4611],bartin:[41.6344,32.3375],ardahan:[41.1105,42.7022],igdir:[39.9201,44.0436],yalova:[40.65,29.2667],karabuk:[41.2061,32.6204],kilis:[36.7184,37.1212],osmaniye:[37.0742,36.2478],duzce:[40.8438,31.1565]};

const DEFAULT_CONFIG={"site": {"announcement": "", "maintenance": false, "defaultCity": "istanbul", "siteName": "AltınNeKadar", "domainLabel": "altinnekadar.com.tr", "logoPath": "", "faviconPath": "/favicon.svg", "heroImagePath": "", "primaryColor": "#e1a900", "accentColor": "#f4c430"}, "home": {"eyebrow": "ALTIN • DÖVİZ • HESAPLAMA", "heroTitleBefore": "Bugün", "heroHighlight": "altın", "heroTitleAfter": "ne kadar?", "heroDescription": "Şehrine göre yerel altın fiyatlarını, TCMB döviz kurlarını ve finansal hesaplama araçlarını tek ekranda takip et.", "goldSectionTitle": "altın fiyatları", "fxSectionTitle": "Güncel döviz kurları", "toolsSectionTitle": "Hesaplama araçları", "citiesSectionTitle": "Şehrine göre altın fiyatları", "showMarket": true, "showGold": true, "showFx": true, "showCalculators": true, "showCities": true, "showBenefits": true}, "navigation": {"gold": "Altın Fiyatları", "fx": "Döviz Kurları", "tools": "Hesaplamalar", "cities": "Şehirler"}, "footer": {"description": "Altın, döviz ve günlük finans hesaplamaları.", "contactEmail": "", "copyright": "AltınNeKadar.com.tr", "showLegalLinks": true}, "seo": {"defaultTitle": "Bugün Altın Ne Kadar? Güncel Altın ve Döviz Fiyatları", "defaultDescription": "Güncel altın ve TCMB döviz kurlarını takip et; kredi, KDV, yüzde ve zam hesaplama araçlarını kullan.", "googleSiteVerification": ""}, "fx": {"enabled": true, "refreshMinutes": 5}, "tools": {"gold": true, "loan": true, "percent": true, "vat": true, "raise": true}, "ads": {"enabled": false, "adsenseClient": "", "topSlot": "", "middleSlot": ""}, "pages": {"aboutTitle": "Hakkımızda", "aboutBody": "AltınNeKadar.com.tr; altın, döviz ve finansal hesaplama araçlarını sade bir arayüzde sunar.", "privacyTitle": "Gizlilik", "privacyBody": "Gizlilik metni yönetim panelinden güncellenebilir.", "termsTitle": "Kullanım Şartları", "termsBody": "Fiyat ve hesaplamalar bilgilendirme amaçlıdır."}, "cities": {}};
function clone(v){return JSON.parse(JSON.stringify(v))}
function mergeConfig(base,extra){
  const out=clone(base); if(!extra||typeof extra!=="object")return out;
  for(const k of ["site","home","navigation","footer","seo","fx","tools","ads","pages"]) if(extra[k]&&typeof extra[k]==="object") out[k]={...out[k],...extra[k]};
  if(extra.cities&&typeof extra.cities==="object")out.cities=extra.cities;
  return out;
}
function loadConfig(){try{return mergeConfig(DEFAULT_CONFIG,JSON.parse(fs.readFileSync(CONFIG_FILE,"utf8")))}catch{return clone(DEFAULT_CONFIG)}}
let siteConfig=loadConfig();

function text(v,max=1000){return String(v??"").slice(0,max)}
function bool(v){return Boolean(v)}
function color(v,fallback){return /^#[0-9a-fA-F]{6}$/.test(String(v||""))?String(v):fallback}
function safeConfig(input){
  const c=mergeConfig(DEFAULT_CONFIG,input);
  c.site={...c.site,announcement:text(c.site.announcement,500),maintenance:bool(c.site.maintenance),defaultCity:CITIES[c.site.defaultCity]?c.site.defaultCity:"istanbul",siteName:text(c.site.siteName,80),domainLabel:text(c.site.domainLabel,120),logoPath:text(c.site.logoPath,300),faviconPath:text(c.site.faviconPath,300),heroImagePath:text(c.site.heroImagePath,300),primaryColor:color(c.site.primaryColor,"#e1a900"),accentColor:color(c.site.accentColor,"#f4c430")};
  for(const k of ["eyebrow","heroTitleBefore","heroHighlight","heroTitleAfter","heroDescription","goldSectionTitle","fxSectionTitle","toolsSectionTitle","citiesSectionTitle"])c.home[k]=text(c.home[k],k==="heroDescription"?500:120);
  for(const k of ["showMarket","showGold","showFx","showCalculators","showCities","showBenefits"])c.home[k]=bool(c.home[k]);
  for(const k of ["gold","fx","tools","cities"])c.navigation[k]=text(c.navigation[k],60);
  c.footer.description=text(c.footer.description,500);c.footer.contactEmail=text(c.footer.contactEmail,160);c.footer.copyright=text(c.footer.copyright,120);c.footer.showLegalLinks=bool(c.footer.showLegalLinks);
  c.seo.defaultTitle=text(c.seo.defaultTitle,180);c.seo.defaultDescription=text(c.seo.defaultDescription,320);c.seo.googleSiteVerification=text(c.seo.googleSiteVerification,180);
  c.fx.enabled=bool(c.fx.enabled);c.fx.refreshMinutes=Math.max(1,Math.min(60,Number(c.fx.refreshMinutes)||5));
  for(const k of Object.keys(c.tools))c.tools[k]=bool(c.tools[k]);
  c.ads.enabled=bool(c.ads.enabled);for(const k of ["adsenseClient","topSlot","middleSlot"])c.ads[k]=text(c.ads[k],120);
  for(const k of Object.keys(c.pages))c.pages[k]=text(c.pages[k],k.endsWith("Body")?12000:160);
  const cleanCities={};
  for(const [city,v] of Object.entries(c.cities||{})){
    if(!CITIES[city]||!v||typeof v!=="object")continue;
    const mode=["none","manual","adapter"].includes(v.sourceMode)?v.sourceMode:"none",prices={};
    for(const key of ["gram","ceyrek","yarim","tam","cumhuriyet","bilezik22"]){
      const p=v.prices?.[key]||{};prices[key]={buy:Math.max(0,Number(p.buy)||0),sell:Math.max(0,Number(p.sell)||0)};
    }
    cleanCities[city]={sourceMode:mode,sourceName:text(v.sourceName,180),sourceUrl:text(v.sourceUrl,600),prices,updatedAt:v.updatedAt||new Date().toISOString()};
  }
  c.cities=cleanCities;
  return c;
}
function saveLocal(c){fs.mkdirSync(DATA_DIR,{recursive:true});fs.writeFileSync(CONFIG_FILE,JSON.stringify(c,null,2));siteConfig=c}

function ghEnv(){return {token:process.env.GITHUB_TOKEN,owner:process.env.GITHUB_OWNER,repo:process.env.GITHUB_REPO,branch:process.env.GITHUB_BRANCH||"main"}}
async function githubPut(repoPath,buffer,message){
  const {token,owner,repo,branch}=ghEnv();if(!token||!owner||!repo)return false;
  const api=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${repoPath.split("/").map(encodeURIComponent).join("/")}`;
  const headers={Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"AltinNeKadar-Admin"};
  let sha;const cur=await fetch(`${api}?ref=${encodeURIComponent(branch)}`,{headers});
  if(cur.ok)sha=(await cur.json()).sha;else if(cur.status!==404)throw new Error("github_read_failed");
  const body={message,content:buffer.toString("base64"),branch,...(sha?{sha}:{})};
  const r=await fetch(api,{method:"PUT",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok)throw new Error("github_write_failed");return true;
}
async function persistConfig(c){return githubPut("data/site-config.json",Buffer.from(JSON.stringify(c,null,2)),"Panel ayarlarını güncelle")}

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function plainTextHtml(s){return esc(s).replace(/\n/g,"<br>")}
function renderHome(citySlug="istanbul"){
  const city=CITIES[citySlug]||"Türkiye";
  const title=citySlug==="istanbul"?(siteConfig.seo.defaultTitle||DEFAULT_CONFIG.seo.defaultTitle):`${city} Altın Fiyatları — ${siteConfig.site.siteName||"AltınNeKadar"}`;
  const desc=citySlug==="istanbul"?(siteConfig.seo.defaultDescription||DEFAULT_CONFIG.seo.defaultDescription):`${city} güncel altın fiyatlarını, TCMB döviz kurlarını ve finansal hesaplama araçlarını takip et.`;
  const canonical=citySlug==="istanbul"?`${BASE}/`:`${BASE}/${citySlug}-altin-fiyatlari`;
  const schema=JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:siteConfig.site.siteName||"AltınNeKadar",url:BASE});
  const verification=siteConfig.seo.googleSiteVerification?`<meta name="google-site-verification" content="${esc(siteConfig.seo.googleSiteVerification)}">`:"";
  return fs.readFileSync(path.join(PUBLIC,"index.html"),"utf8")
   .replaceAll("__TITLE__",esc(title)).replaceAll("__DESCRIPTION__",esc(desc)).replaceAll("__CANONICAL__",canonical)
   .replace("__SCHEMA__",schema).replace("__GOOGLE_VERIFY__",verification).replace("__FAVICON__",esc(siteConfig.site.faviconPath||"/favicon.svg"));
}
function simplePage(title,body){return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>body{font-family:system-ui;max-width:850px;margin:60px auto;padding:20px;line-height:1.7}a{color:#9a7300}</style></head><body><a href="/">← Ana sayfa</a><h1>${esc(title)}</h1>${body}</body></html>`}

app.disable("x-powered-by");app.set("trust proxy",1);
app.use((req,res,next)=>{res.set({"X-Content-Type-Options":"nosniff","X-Frame-Options":"SAMEORIGIN","Referrer-Policy":"strict-origin-when-cross-origin","Permissions-Policy":"geolocation=(self)","Cross-Origin-Opener-Policy":"same-origin","Content-Security-Policy":"default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; upgrade-insecure-requests"});next()});
app.use(express.static(PUBLIC,{maxAge:"1d",etag:true,index:false,immutable:false}));
app.use(express.json({limit:"3mb"}));

function cookies(req){return Object.fromEntries(String(req.headers.cookie||"").split(";").map(x=>x.trim().split("=")).filter(x=>x.length===2).map(([k,v])=>[k,decodeURIComponent(v)]))}
function adminConfigured(){return Boolean(process.env.ADMIN_PASSWORD&&process.env.ADMIN_SECRET)}
function signSession(payload){const body=Buffer.from(JSON.stringify(payload)).toString("base64url");const sig=crypto.createHmac("sha256",process.env.ADMIN_SECRET||"disabled").update(body).digest("base64url");return `${body}.${sig}`}
function validSession(req){if(!adminConfigured())return false;const token=cookies(req).ank_admin;if(!token)return false;const [body,sig]=token.split(".");if(!body||!sig)return false;const expected=crypto.createHmac("sha256",process.env.ADMIN_SECRET).update(body).digest("base64url");try{if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;const p=JSON.parse(Buffer.from(body,"base64url").toString());return Number(p.exp)>Date.now()}catch{return false}}
function requireAdmin(req,res,next){if(!validSession(req))return res.status(401).json({error:"unauthorized"});next()}
const loginAttempts=new Map();
app.get("/admin",(req,res)=>res.sendFile(path.join(PUBLIC,"admin.html")));
app.get("/api/admin/session",(req,res)=>res.json({configured:adminConfigured(),authenticated:validSession(req)}));
app.post("/api/admin/login",(req,res)=>{if(!adminConfigured())return res.status(503).json({error:"admin_not_configured"});const key=req.ip||"unknown",now=Date.now(),a=loginAttempts.get(key)||{count:0,until:0};if(a.until>now)return res.status(429).json({error:"too_many_attempts"});const e=crypto.createHash("sha256").update(String(process.env.ADMIN_PASSWORD)).digest(),g=crypto.createHash("sha256").update(String(req.body?.password||"")).digest();if(!crypto.timingSafeEqual(e,g)){a.count++;if(a.count>=5){a.count=0;a.until=now+15*60_000}loginAttempts.set(key,a);return res.status(401).json({error:"invalid_credentials"})}loginAttempts.delete(key);const t=signSession({exp:Date.now()+8*60*60_000});res.setHeader("Set-Cookie",`ank_admin=${encodeURIComponent(t)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);res.json({ok:true})});
app.post("/api/admin/logout",(req,res)=>{res.setHeader("Set-Cookie","ank_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");res.json({ok:true})});

const verifiedSources={}; // Doğrulanmış şehir adaptörleri buraya eklenir.
app.get("/api/admin/config",requireAdmin,(req,res)=>res.json({config:siteConfig,cities:CITIES}));
app.get("/api/admin/status",requireAdmin,async(req,res)=>{const configuredSources=Object.values(siteConfig.cities||{}).filter(x=>x.sourceMode==="manual"||x.sourceMode==="adapter").length;const central=await fetchCentralGold();res.json({service:"altinnekadar.com.tr",node:process.version,uptime:process.uptime(),adapters:Object.keys(verifiedSources).length,configuredSources,centralGoldConfigured:Boolean(process.env.GOLD_API_KEY),centralGoldLive:Boolean(central?.prices?.length),centralGoldUpdatedAt:central?.fetchedAt||null,centralGoldCacheMinutes:CENTRAL_GOLD_TTL/60000,centralGoldLastError:centralGoldCache.lastError,githubPersistence:Boolean(ghEnv().token&&ghEnv().owner&&ghEnv().repo)})});
app.put("/api/admin/config",requireAdmin,async(req,res)=>{try{const c=safeConfig(req.body?.config);saveLocal(c);let githubCommitted=false;try{githubCommitted=await persistConfig(c)}catch(e){console.error("GitHub config:",e.message)}goldCache.clear();res.json({ok:true,githubCommitted})}catch{res.status(400).json({error:"invalid_config"})}});

const ALLOWED_MIME={"image/png":"png","image/jpeg":"jpg","image/webp":"webp","image/x-icon":"ico"};
app.post("/api/admin/media",requireAdmin,async(req,res)=>{try{
 const kind=String(req.body?.kind||"");if(!["logo","favicon","hero"].includes(kind))return res.status(400).json({error:"invalid_kind"});
 const mime=String(req.body?.mime||"");const ext=ALLOWED_MIME[mime];if(!ext)return res.status(400).json({error:"invalid_type"});
 const buffer=Buffer.from(String(req.body?.dataBase64||""),"base64");if(!buffer.length||buffer.length>2*1024*1024)return res.status(400).json({error:"invalid_size"});
 fs.mkdirSync(UPLOADS,{recursive:true});const filename=`${kind}.${ext}`,local=path.join(UPLOADS,filename);fs.writeFileSync(local,buffer);
 const publicPath=`/uploads/${filename}`;if(kind==="logo")siteConfig.site.logoPath=publicPath;if(kind==="favicon")siteConfig.site.faviconPath=publicPath;if(kind==="hero")siteConfig.site.heroImagePath=publicPath;saveLocal(siteConfig);
 let mediaCommitted=false,configCommitted=false;try{mediaCommitted=await githubPut(`public/uploads/${filename}`,buffer,`${kind} görselini güncelle`);configCommitted=await persistConfig(siteConfig)}catch(e){console.error("GitHub media:",e.message)}
 res.json({ok:true,path:publicPath,githubCommitted:mediaCommitted&&configCommitted});
}catch{res.status(400).json({error:"media_upload_failed"})}});

app.get("/api/site-config",(req,res)=>{res.set("Cache-Control","public,max-age=30").json({site:siteConfig.site,home:siteConfig.home,navigation:siteConfig.navigation,footer:siteConfig.footer,fx:siteConfig.fx,tools:siteConfig.tools,ads:siteConfig.ads})});


const CENTRAL_GOLD_BASE="https://api.apinoktam.erenozdemir.com.tr/v1/altin";
const CENTRAL_GOLD_TTL=Math.max(5,Number(process.env.GOLD_CACHE_MINUTES)||60)*60_000;
let centralGoldCache={time:0,data:null,lastError:null};
function parseGoldNumber(v){if(typeof v==="number")return Number.isFinite(v)?v:null;let s=String(v??"").trim();if(!s)return null;if(s.includes(",")&&s.includes("."))s=s.replace(/\./g,"").replace(",", ".");else if(s.includes(","))s=s.replace(",", ".");const n=Number(s);return Number.isFinite(n)?n:null}
function centralGoldKey(item){const symbol=String(item?.sembol||"").toUpperCase(),tur=String(item?.tur||"").toLocaleLowerCase("tr-TR"),isim=String(item?.isim||"").toLocaleLowerCase("tr-TR");if(symbol==="GRA"||tur==="gram"||isim.includes("gram alt"))return "gram";if(tur==="ceyrek"||tur==="çeyrek"||isim.includes("çeyrek"))return "ceyrek";if(tur==="yarim"||tur==="yarım"||isim.includes("yarım"))return "yarim";if(tur==="tam"||isim.includes("tam alt"))return "tam";if(tur==="cumhuriyet"||isim.includes("cumhuriyet"))return "cumhuriyet";if(tur.includes("22")||isim.includes("22 ayar"))return "bilezik22";return null}
function centralGoldName(key){return {gram:"Gram Altın",ceyrek:"Çeyrek Altın",yarim:"Yarım Altın",tam:"Tam Altın",cumhuriyet:"Cumhuriyet Altını",bilezik22:"22 Ayar Bilezik"}[key]||key}
async function fetchCentralGold(force=false){const now=Date.now();if(!force&&centralGoldCache.data&&now-centralGoldCache.time<CENTRAL_GOLD_TTL)return centralGoldCache.data;const apiKey=process.env.GOLD_API_KEY;if(!apiKey){centralGoldCache.lastError="GOLD_API_KEY_missing";return centralGoldCache.data||null}try{const r=await fetch(CENTRAL_GOLD_BASE,{headers:{"x-api-key":apiKey,"Accept":"application/json","User-Agent":"AltinNeKadar.com.tr/1.0"},signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error(`gold_api_http_${r.status}`);const json=await r.json(),items=json?.data?.kalemler;if(!Array.isArray(items)||!items.length)throw new Error("gold_api_invalid_format");const prices=[],seen=new Set();for(const item of items){const key=centralGoldKey(item);if(!key||seen.has(key))continue;const buy=parseGoldNumber(item.alis),sell=parseGoldNumber(item.satis),change=parseGoldNumber(item.degisim);if(buy==null&&sell==null)continue;prices.push({key,name:centralGoldName(key),buy:buy??sell??0,sell:sell??buy??0,change:change??0});seen.add(key)}if(!prices.some(p=>p.key==="gram"))throw new Error("gold_api_missing_gram");const data={verified:true,central:true,sourceName:"apinoktam Altın API",sourceUrl:"https://apinoktam.erenozdemir.com.tr/en/api-noktalari/altin-fiyatlari-api",providerSource:json?.meta?.kaynak||"truncgil.com",updatedAt:json?.data?.tarih||json?.meta?.updatedAt||new Date().toISOString(),fetchedAt:new Date().toISOString(),prices};centralGoldCache={time:now,data,lastError:null};return data}catch(err){centralGoldCache.lastError=String(err?.message||err);console.error("Central gold:",centralGoldCache.lastError);return centralGoldCache.data||null}}


const HAREM_GOLD_URL="https://api.hasfiyat.com/api/prices?source=harem";
const HAREM_TTL=Math.max(15,Number(process.env.HAREM_CACHE_SECONDS)||60)*1000;
let haremCache={time:0,data:null,lastError:null};

function haremNormalize(value){
  return String(value??"")
    .toLocaleUpperCase("tr-TR")
    .replaceAll("İ","I").replaceAll("Ş","S").replaceAll("Ğ","G")
    .replaceAll("Ü","U").replaceAll("Ö","O").replaceAll("Ç","C")
    .replace(/[^A-Z0-9]/g,"");
}
function haremMapKey(item){
  const raw=haremNormalize(item?.symbol||item?.sembol||item?.code||item?.kod||item?.title||item?.type||item?.tur||item?.name||item?.isim);
  if(raw.includes("CEYREK"))return "ceyrek";
  if(raw.includes("YARIM"))return "yarim";
  if(raw.includes("CUMHURIYET")||raw==="ATA"||raw.includes("ATALIRA"))return "cumhuriyet";
  if(raw.includes("TAM")||raw.includes("TEKLIRA"))return "tam";
  if(raw.includes("22AYAR")||raw.includes("22BILEZIK")||raw.includes("BILEZIK22"))return "bilezik22";
  if(raw==="GRAM"||raw==="GA"||raw.includes("GRAMALTIN")||raw==="GRAMALTINI")return "gram";
  return null;
}
function haremList(json){
  if(Array.isArray(json))return json;
  if(Array.isArray(json?.data))return json.data;
  if(Array.isArray(json?.prices))return json.prices;
  if(Array.isArray(json?.result))return json.result;
  if(Array.isArray(json?.data?.prices))return json.data.prices;
  if(Array.isArray(json?.data?.items))return json.data.items;
  if(json?.data&&typeof json.data==="object"){
    return Object.entries(json.data)
      .map(([symbol,v])=>v&&typeof v==="object"?{symbol,...v}:null)
      .filter(Boolean);
  }
  return [];
}
function haremPriceValue(item,side){
  const fields=side==="buy"
    ? ["buy","alis","alış","buying","bid","purchase"]
    : ["sell","satis","satış","selling","ask","sale"];
  for(const field of fields){
    if(item?.[field]!==undefined&&item?.[field]!==null){
      const n=parseGoldNumber(item[field]);
      if(n!==null)return n;
    }
  }
  return null;
}
async function fetchHaremGold(force=false){
  const now=Date.now();
  if(!force&&haremCache.data&&now-haremCache.time<HAREM_TTL)return haremCache.data;

  const token=process.env.HAREM_API_KEY;
  if(!token){
    haremCache.lastError="HAREM_API_KEY_missing";
    return haremCache.data||null;
  }

  try{
    const response=await fetch(HAREM_GOLD_URL,{
      headers:{
        "Authorization":`Bearer ${token}`,
        "Accept":"application/json",
        "User-Agent":"AltinNeKadar.com.tr/1.0"
      },
      signal:AbortSignal.timeout(10000)
    });

    if(!response.ok)throw new Error(`harem_http_${response.status}`);

    const json=await response.json();
    const items=haremList(json);
    if(!items.length)throw new Error("harem_empty_response");

    const prices=[];
    const seen=new Set();

    for(const item of items){
      const key=haremMapKey(item);
      if(!key||seen.has(key))continue;

      const buy=haremPriceValue(item,"buy");
      const sell=haremPriceValue(item,"sell");
      if(buy===null&&sell===null)continue;

      prices.push({
        key,
        name:centralGoldName(key),
        buy:buy??sell??0,
        sell:sell??buy??0,
        change:parseGoldNumber(item?.change??item?.degisim??item?.değişim)??0
      });
      seen.add(key);
    }

    if(!prices.some(p=>p.key==="gram"))throw new Error("harem_missing_gram");

    const data={
      city:"istanbul",
      verified:true,
      local:true,
      central:false,
      harem:true,
      sourceName:"Harem Altın • Hasfiyat API",
      sourceUrl:"https://altinapi.hasfiyat.com/",
      updatedAt:json?.updatedAt||json?.timestamp||json?.data?.updatedAt||new Date().toISOString(),
      fetchedAt:new Date().toISOString(),
      prices
    };

    haremCache={time:now,data,lastError:null};
    return data;
  }catch(error){
    haremCache.lastError=String(error?.message||error);
    console.error("Harem gold:",haremCache.lastError);
    return haremCache.data||null;
  }
}

const goldCache=new Map(),GOLD_TTL=30_000;
async function cityGold(city){
 const cfg=siteConfig.cities?.[city];

 if(cfg?.sourceMode==="manual"){
  const names={gram:"Gram Altın",ceyrek:"Çeyrek Altın",yarim:"Yarım Altın",tam:"Tam Altın",cumhuriyet:"Cumhuriyet Altını",bilezik22:"22 Ayar Bilezik"};
  const prices=Object.entries(cfg.prices||{})
    .filter(([,p])=>Number(p.sell)>0)
    .map(([key,p])=>({key,name:names[key]||key,buy:Number(p.buy)||0,sell:Number(p.sell)||0,change:0}));

  if(prices.length){
    return {
      city,
      verified:false,
      manual:true,
      central:false,
      sourceName:cfg.sourceName||"Panelden girilen yerel fiyat",
      sourceUrl:cfg.sourceUrl||"",
      updatedAt:cfg.updatedAt||new Date().toISOString(),
      prices
    };
  }
 }

 // İstanbul'da Harem verisi öncelikli.
 if(city==="istanbul"&&process.env.HAREM_API_KEY){
  const harem=await fetchHaremGold();
  if(harem)return harem;
 }

 // Şehre özel doğrulanmış adapter varsa onu kullan.
 const src=verifiedSources[city];
 if(src&&cfg?.sourceMode!=="none"){
  const hit=goldCache.get(city);
  if(hit&&Date.now()-hit.time<GOLD_TTL)return hit.data;

  const raw=await src.fetchPrices();
  if(!raw||!Array.isArray(raw.prices)||!raw.prices.length)throw new Error("invalid source");

  const data={
    city,
    verified:true,
    manual:false,
    central:false,
    sourceName:cfg?.sourceName||src.sourceName,
    sourceUrl:cfg?.sourceUrl||src.sourceUrl,
    updatedAt:raw.updatedAt||new Date().toISOString(),
    prices:raw.prices
  };

  goldCache.set(city,{time:Date.now(),data});
  return data;
 }

 // Son fallback: merkezi canlı altın.
 const central=await fetchCentralGold();
 if(!central)return null;

 return {
  ...central,
  city,
  local:false,
  sourceName:"Türkiye Geneli Canlı Altın Verisi • apinoktam"
 };
}

app.get("/api/harem-debug",async(req,res)=>{
  const token=process.env.HAREM_API_KEY;
  if(!token)return res.status(503).json({configured:false,error:"HAREM_API_KEY_missing"});

  try{
    const response=await fetch(HAREM_GOLD_URL,{
      headers:{
        "Authorization":`Bearer ${token}`,
        "Accept":"application/json",
        "User-Agent":"AltinNeKadar.com.tr/1.0"
      },
      signal:AbortSignal.timeout(10000)
    });

    const status=response.status;
    let json=null;
    try{
      json=await response.json();
    }catch{
      return res.status(502).json({configured:true,httpStatus:status,error:"non_json_response"});
    }

    const list=haremList(json);
    const samples=list.slice(0,12).map(item=>({
      keys:Object.keys(item||{}).slice(0,20),
      symbol:item?.symbol??item?.sembol??null,
      code:item?.code??item?.kod??null,
      title:item?.title??null,
      name:item?.name??item?.isim??null,
      type:item?.type??item?.tur??null,
      buyPresent:["buy","alis","alış","buying","bid","purchase"].some(k=>item?.[k]!==undefined),
      sellPresent:["sell","satis","satış","selling","ask","sale"].some(k=>item?.[k]!==undefined)
    }));

    res.json({
      configured:true,
      httpStatus:status,
      topLevelKeys:json&&typeof json==="object"?Object.keys(json).slice(0,30):[],
      itemCount:list.length,
      sample:samples
    });
  }catch(error){
    res.status(502).json({
      configured:true,
      error:String(error?.message||error)
    });
  }
});

app.get("/api/harem-status",async(req,res)=>{
 const data=await fetchHaremGold();
 res.json({
  configured:Boolean(process.env.HAREM_API_KEY),
  live:Boolean(data?.prices?.length),
  source:data?.sourceName||"Harem Altın • Hasfiyat API",
  updatedAt:data?.fetchedAt||null,
  cacheSeconds:HAREM_TTL/1000,
  lastError:haremCache.lastError
 });
});

app.get("/api/gold",async(req,res)=>{const force=req.query.refresh==="1"&&validSession(req);const data=await fetchCentralGold(force);if(!data)return res.status(503).json({error:"central_gold_unavailable",configured:Boolean(process.env.GOLD_API_KEY)});res.set("Cache-Control","public,max-age=30,stale-while-revalidate=300").json(data)});
app.get("/api/prices",async(req,res)=>{const city=String(req.query.city||"").toLowerCase();if(!CITIES[city])return res.status(400).json({error:"invalid_city"});try{const d=await cityGold(city);if(!d)return res.status(404).json({city,verified:false,error:"source_not_configured"});res.set("Cache-Control","public,max-age=15").json(d)}catch{res.status(502).json({error:"source_unavailable"})}});

let fxCache={time:0,data:null};const FX_TTL=5*60_000;
function tag(block,name){const m=block.match(new RegExp(`<${name}>([^<]*)</${name}>`,"i"));return m?m[1].trim():""}
async function tcmb(){
 if(fxCache.data&&Date.now()-fxCache.time<FX_TTL)return fxCache.data;
 const r=await fetch("https://www.tcmb.gov.tr/kurlar/today.xml",{headers:{"User-Agent":"AltinNeKadar.com.tr/1.0"}});if(!r.ok)throw new Error("tcmb");
 const xml=await r.text(),wanted=new Set(["USD","EUR","GBP","CHF"]),rates=[];let m;const re=/<Currency\b[^>]*CurrencyCode="([A-Z]{3})"[^>]*>([\s\S]*?)<\/Currency>/gi;
 while((m=re.exec(xml))){if(!wanted.has(m[1]))continue;const buy=Number(tag(m[2],"ForexBuying")),sell=Number(tag(m[2],"ForexSelling"));if(Number.isFinite(buy)&&Number.isFinite(sell))rates.push({code:m[1],name:tag(m[2],"Isim")||m[1],buy,sell})}
 const dm=xml.match(/Tarih_Date[^>]*Tarih="([^"]+)"/i),data={sourceName:"TCMB",updatedAt:new Date().toISOString(),displayDate:dm?.[1]||"",rates};fxCache={time:Date.now(),data};return data;
}
app.get("/api/fx",async(req,res)=>{try{res.set("Cache-Control","public,max-age=60").json(await tcmb())}catch{res.status(502).json({error:"tcmb_unavailable"})}});

function hav(a,b,c,d){const R=6371,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p,u=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;return 2*R*Math.asin(Math.sqrt(u))}
app.get("/api/reverse-geocode",(req,res)=>{const lat=Number(req.query.lat),lon=Number(req.query.lon);if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<35||lat>43||lon<25||lon>46)return res.status(400).json({error:"invalid_coordinates"});let best=null,dist=1e9;for(const [slug,[a,b]] of Object.entries(CENTERS)){const d=hav(lat,lon,a,b);if(d<dist){dist=d;best=slug}}res.json({citySlug:best,cityName:CITIES[best],approximate:true})});
app.get("/api/source-status",(req,res)=>res.json(Object.fromEntries(Object.keys(CITIES).map(c=>{const cfg=siteConfig.cities?.[c];return[c,{configured:Boolean(verifiedSources[c])||cfg?.sourceMode==="manual",mode:cfg?.sourceMode||"none",name:cfg?.sourceName||verifiedSources[c]?.sourceName||null}]}))));
app.get("/health",(req,res)=>res.json({ok:true,time:new Date().toISOString(),goldApiConfigured:Boolean(process.env.GOLD_API_KEY),goldCacheAgeSeconds:centralGoldCache.time?Math.round((Date.now()-centralGoldCache.time)/1000):null}));

app.use((req,res,next)=>{if(!siteConfig.site.maintenance)return next();if(req.path.startsWith("/admin")||req.path.startsWith("/api/admin")||req.path==="/health")return next();res.status(503).send(simplePage("Bakımdayız","<p>Site kısa süreli bakım çalışmasındadır.</p>"))});
app.get("/",(req,res)=>res.send(renderHome("istanbul")));
app.get("/:city-altin-fiyatlari",(req,res,next)=>CITIES[req.params.city]?res.send(renderHome(req.params.city)):next());
app.get("/hakkimizda",(req,res)=>res.send(simplePage(siteConfig.pages.aboutTitle,`<p>${plainTextHtml(siteConfig.pages.aboutBody)}</p>`)));
app.get("/gizlilik",(req,res)=>res.send(simplePage(siteConfig.pages.privacyTitle,`<p>${plainTextHtml(siteConfig.pages.privacyBody)}</p>`)));
app.get("/kullanim-sartlari",(req,res)=>res.send(simplePage(siteConfig.pages.termsTitle,`<p>${plainTextHtml(siteConfig.pages.termsBody)}</p>`)));
app.use((req,res)=>res.status(404).send(simplePage("Sayfa bulunamadı","<p>Aradığınız sayfa mevcut değil.</p>")));
app.listen(PORT,()=>console.log(`AltınNeKadar.com.tr http://localhost:${PORT}`));
