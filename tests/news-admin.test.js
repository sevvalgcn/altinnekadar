const test=require("node:test");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");

const port=33872;
let child,tempDir,cookie;

test.before(async()=>{
  tempDir=fs.mkdtempSync(path.join(os.tmpdir(),"bugun-altin-news-"));
  fs.writeFileSync(path.join(tempDir,"seo-posts.json"),"[]");
  fs.writeFileSync(path.join(tempDir,"seo-history.json"),"[]");
  child=spawn(process.execPath,["server.js"],{cwd:path.join(__dirname,".."),env:{...process.env,PORT:String(port),DATA_DIR:tempDir,ADMIN_PASSWORD:"test-password",ADMIN_SECRET:"test-secret",SEO_AUTO_CONTENT:"false",GITHUB_TOKEN:"",GH_TOKEN:""},stdio:"ignore"});
  for(let i=0;i<40;i++){
    try{const response=await fetch(`http://127.0.0.1:${port}/health`);if(response.ok)break}catch{}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  const login=await fetch(`http://127.0.0.1:${port}/api/admin/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:"test-password"})});
  assert.equal(login.status,200);
  cookie=login.headers.get("set-cookie").split(";")[0];
});

test.after(()=>{child?.kill("SIGTERM");if(tempDir)fs.rmSync(tempDir,{recursive:true,force:true})});

test("panelden taslak haber oluşturur ve yayınlar",async()=>{
  const payload={category:"ekonomi",status:"draft",title:"Piyasalarda haftanın öne çıkan gelişmeleri",description:"Altın, döviz ve borsa yatırımcılarının takip ettiği gelişmeler haftalık görünümde bir araya getirildi.",body:["Piyasalarda haftanın ilk işlem gününde fiyat hareketleri yakından takip edildi.","Yatırımcıların kararlarında güncel verileri ve riskleri birlikte değerlendirmesi önem taşıyor."],sourceName:"Bugün Altın",sourceUrl:"",image:""};
  const created=await fetch(`http://127.0.0.1:${port}/api/admin/news`,{method:"POST",headers:{"Content-Type":"application/json",Cookie:cookie},body:JSON.stringify(payload)});
  assert.equal(created.status,201);
  const createdData=await created.json();

  const hidden=await fetch(`http://127.0.0.1:${port}/haberler/${createdData.post.slug}`);
  assert.equal(hidden.status,404);

  const updated=await fetch(`http://127.0.0.1:${port}/api/admin/news/${createdData.post.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Cookie:cookie},body:JSON.stringify({...payload,status:"published"})});
  assert.equal(updated.status,200);

  const visible=await fetch(`http://127.0.0.1:${port}/haberler/${createdData.post.slug}`);
  assert.equal(visible.status,200);
  assert.match(await visible.text(),/Piyasalarda haftanın öne çıkan gelişmeleri/);
});

test("geçersiz kategoriyi reddeder",async()=>{
  const response=await fetch(`http://127.0.0.1:${port}/api/admin/news`,{method:"POST",headers:{"Content-Type":"application/json",Cookie:cookie},body:JSON.stringify({category:"spor",status:"draft",title:"Piyasalarda haftanın öne çıkan gelişmeleri",description:"Altın, döviz ve borsa yatırımcılarının takip ettiği gelişmeler haftalık görünümde bir araya getirildi.",body:["Piyasalarda haftanın ilk işlem gününde fiyat hareketleri yakından takip edildi.","Yatırımcıların kararlarında güncel verileri ve riskleri birlikte değerlendirmesi önem taşıyor."]})});
  assert.equal(response.status,400);
});
