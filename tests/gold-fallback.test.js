const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('şehir fiyatlarında Harem kullanılamazsa merkezi canlı kaynak devreye girer',()=>{
  const src=fs.readFileSync('server.js','utf8');
  const start=src.indexOf('async function cityGold(city){');
  const end=src.indexOf('\napp.get("/api/city-source"',start);
  assert.ok(start>=0&&end>start,'cityGold bloğu bulunamadı');
  const block=src.slice(start,end);
  assert.match(block,/const centralFallback=await fetchCentralGold\(\);/);
  assert.match(block,/centralFallback\?\.prices\?\.length/);
  assert.match(block,/return \{\.\.\.centralFallback,city,verified:true,local:false/);
});

test('yedek kaynak ön yüzde yerel kaynak gibi etiketlenmez',()=>{
  const src=fs.readFileSync('public/app.js','utf8');
  assert.match(src,/data\.local\?"Doğrulanmış yerel kaynak":"Canlı yedek kaynak"/);
});
