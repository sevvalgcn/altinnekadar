const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('geçici altın API hatasında son başarılı fiyatlar ekrandan silinmez',()=>{
  const src=fs.readFileSync('public/app.js','utf8');
  const start=src.indexOf('async function loadGold(){');
  const end=src.indexOf('\nfunction renderFx',start);
  assert.ok(start>=0&&end>start,'loadGold bloğu bulunamadı');
  const block=src.slice(start,end);
  assert.match(block,/catch\s*\{[\s\S]*if\(goldData\?\.prices\?\.length\)\{[\s\S]*showGoldStaleNotice\(\);[\s\S]*return;[\s\S]*const cached=readGoldCache\(\);/);
  assert.match(block,/if\(cached\)\{[\s\S]*renderGold\(cached\);[\s\S]*return;/);
});

test('son başarılı altın verisi tarayıcıda saklanır ve açılışta geri yüklenir',()=>{
  const src=fs.readFileSync('public/app.js','utf8');
  assert.match(src,/localStorage\.setItem\([^\n]*GOLD_CACHE_KEY/);
  assert.match(src,/localStorage\.getItem\(GOLD_CACHE_KEY/);
});
