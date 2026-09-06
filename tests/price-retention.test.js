const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('geçici altın API hatasında son başarılı fiyatlar ekrandan silinmez',()=>{
  const src=fs.readFileSync('public/app.js','utf8');
  const start=src.indexOf('async function loadGold(){');
  const end=src.indexOf('\nfunction renderFx',start);
  assert.ok(start>=0&&end>start,'loadGold bloğu bulunamadı');
  const block=src.slice(start,end);
  assert.doesNotMatch(block,/catch\s*\{[\s\S]*renderGold\(\{verified:false,prices:\[\]\}\)/);
  assert.match(block,/goldData\?\.prices\?\.length/);
});

test('son başarılı altın verisi tarayıcıda saklanır ve açılışta geri yüklenir',()=>{
  const src=fs.readFileSync('public/app.js','utf8');
  assert.match(src,/localStorage\.setItem\([^\n]*gold/i);
  assert.match(src,/localStorage\.getItem\([^\n]*gold/i);
});
