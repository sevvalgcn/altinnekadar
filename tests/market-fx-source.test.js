const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('Kapalıçarşı döviz akışı güncel doviz-api kaynağını dener ve legacy kaynağı yedek tutar',()=>{
  const src=fs.readFileSync('server.js','utf8');
  const start=src.indexOf('async function marketFx(){');
  const end=src.indexOf('\napp.get("/api/market-fx-status"',start);
  assert.ok(start>=0&&end>start,'marketFx bloğu bulunamadı');
  const block=src.slice(start,end);
  assert.match(block,/const urls=\[/);
  assert.match(block,/source=doviz-api/);
  assert.match(block,/source=doviz/);
  assert.match(block,/for\(const url of urls\)/);
});
