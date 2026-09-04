const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('site config enables AdSense with the configured publisher id',()=>{
  const config=JSON.parse(fs.readFileSync('data/site-config.json','utf8'));
  assert.equal(config.ads?.enabled,true);
  assert.equal(config.ads?.adsenseClient,'ca-pub-3281657102517909');
});

test('server emits the AdSense script from config',()=>{
  const source=fs.readFileSync('server.js','utf8');
  assert.match(source,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=/);
  assert.match(source,/adsenseClient/);
});
