const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const src=()=>fs.readFileSync('server.js','utf8');

test('şehir fiyatlarında Harem kullanılamazsa merkezi canlı kaynak devreye girer',()=>{
  const s=src();
  const start=s.indexOf('async function cityGold(city){');
  const end=s.indexOf('\napp.get("/api/city-source"',start);
  assert.ok(start>=0&&end>start,'cityGold bloğu bulunamadı');
  const block=s.slice(start,end);
  assert.match(block,/const centralFallback=await fetchCentralGold\(\);/);
  assert.match(block,/centralFallback\?\.prices\?\.length/);
});

test('SEO otomasyonu Harem kesilirse merkezi canlı veriden üretime devam eder',()=>{
  const s=src();
  const start=s.indexOf('async function ensureSeoPost(slot,force=false){');
  const end=s.indexOf('\nasync function runSeoScheduler()',start);
  assert.ok(start>=0&&end>start,'ensureSeoPost bloğu bulunamadı');
  const block=s.slice(start,end);
  assert.match(block,/let live=await fetchHaremGold\(force\);/);
  assert.match(block,/if\(!live\)live=await fetchCentralGold\(force\);/);
});

test('ana altın API Harem kesilirse merkezi canlı veriyi döndürür',()=>{
  const s=src();
  const start=s.indexOf('app.get("/api/gold"');
  const end=s.indexOf('\napp.get("/api/prices"',start);
  assert.ok(start>=0&&end>start,'/api/gold bloğu bulunamadı');
  const block=s.slice(start,end);
  assert.match(block,/let data=await fetchHaremGold\(force\);/);
  assert.match(block,/if\(!data\)data=await fetchCentralGold\(force\);/);
});

test('Harem kaynağı için normal ve canlı alternatif uç noktalar denenir',()=>{
  const s=src();
  assert.match(s,/const HAREM_GOLD_URLS=\[/);
  assert.match(s,/source=harem"/);
  assert.match(s,/source=harem-canli"/);
  assert.match(s,/for\(const url of HAREM_GOLD_URLS\)/);
});

test('yedek kaynak ön yüzde yerel kaynak gibi etiketlenmez',()=>{
  const app=fs.readFileSync('public/app.js','utf8');
  assert.match(app,/data\.local\?"Doğrulanmış yerel kaynak":"Canlı yedek kaynak"/);
});
