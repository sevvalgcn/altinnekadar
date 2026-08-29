const test=require("node:test");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const path=require("node:path");
const posts=require("../data/seo-posts.json");

const port=33871;
let child;

test.before(async()=>{
  child=spawn(process.execPath,["server.js"],{cwd:path.join(__dirname,".."),env:{...process.env,PORT:String(port),SEO_AUTO_CONTENT:"false"},stdio:"ignore"});
  for(let i=0;i<40;i++){
    try{const response=await fetch(`http://127.0.0.1:${port}/health`);if(response.ok)return}catch{}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error("Test sunucusu başlamadı");
});

test.after(()=>child?.kill("SIGTERM"));

test("haber merkezi yatırım kategorilerini ve yayınlanan haberleri gösterir",async()=>{
  const response=await fetch(`http://127.0.0.1:${port}/haberler`);
  const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/Ekonomi ve Yatırım Haberleri/);
  assert.match(html,/Altın/);
  assert.match(html,/Döviz/);
});

test("ana sayfa haber bölümünü gösterir",async()=>{
  const html=await (await fetch(`http://127.0.0.1:${port}/`)).text();
  assert.match(html,/YATIRIMCI GÜNDEMİ/);
  assert.match(html,/\/haberler\//);
});

test("eski altın gündemi bağlantısı çalışmaya devam eder",async()=>{
  const slug=posts[0].slug;
  const response=await fetch(`http://127.0.0.1:${port}/altin-gundemi/${slug}`);
  const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/NewsArticle/);
});
