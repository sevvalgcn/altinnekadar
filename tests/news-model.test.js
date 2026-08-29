const test=require("node:test");
const assert=require("node:assert/strict");
const {normalizeNewsPost,validateNewsInput,publishedNews}=require("../public/news.js");

test("eski altın gündemi içeriğini yayınlanmış altın haberi olarak normalleştirir",()=>{
  const post=normalizeNewsPost({id:"x",slot:"sabah",title:"Altın piyasasında sabah görünümü",description:"Güncel piyasa özeti ve fiyat hareketleri yatırımcılar için derlendi.",body:["Birinci paragraf","İkinci paragraf"],publishedAt:"2026-08-29T08:00:00.000Z"});
  assert.equal(post.category,"altin");
  assert.equal(post.status,"published");
  assert.equal(post.sourceType,"market-summary");
});

test("yalnız yayındaki haberleri en yeniden eskiye sıralar",()=>{
  const rows=publishedNews([
    {id:"a",status:"draft",publishedAt:"2026-08-29T12:00:00Z"},
    {id:"b",status:"published",publishedAt:"2026-08-29T10:00:00Z"},
    {id:"c",status:"published",publishedAt:"2026-08-29T11:00:00Z"}
  ]);
  assert.deepEqual(rows.map(x=>x.id),["c","b"]);
});

test("geçersiz kategori ve kısa haber içeriğini reddeder",()=>{
  assert.equal(validateNewsInput({title:"Kısa",description:"Az",body:[],category:"spor",status:"published"}).ok,false);
});

test("geçerli manuel haber taslağını güvenli biçimde kabul eder",()=>{
  const result=validateNewsInput({
    title:"Piyasalarda haftanın öne çıkan gelişmeleri",
    description:"Altın, döviz ve borsa yatırımcılarının takip ettiği gelişmeler haftalık görünümde bir araya getirildi.",
    body:["Piyasalarda haftanın ilk işlem gününde fiyat hareketleri yakından takip edildi.","Yatırımcıların kararlarında güncel verileri ve riskleri birlikte değerlendirmesi önem taşıyor."],
    category:"ekonomi",status:"draft",sourceName:"Editör"
  });
  assert.equal(result.ok,true);
  assert.equal(result.value.category,"ekonomi");
  assert.equal(result.value.status,"draft");
});
