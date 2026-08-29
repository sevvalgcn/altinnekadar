const NEWS_CATEGORIES=["altin","doviz","borsa","kripto","ekonomi"];
const NEWS_STATUSES=["draft","published","archived"];

const clean=(value,max=4000)=>String(value??"").replace(/\s+/g," ").trim().slice(0,max);
const slugify=value=>clean(value,180).toLocaleLowerCase("tr-TR").replace(/ı/g,"i").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,120);

function normalizeNewsPost(post={}){
  const legacy=Boolean(post.slot&&!post.category);
  const publishedAt=post.publishedAt||post.updatedAt||new Date().toISOString();
  return {
    ...post,
    id:clean(post.id||`${Date.now()}`,100),
    slug:clean(post.slug||slugify(post.title||post.id),140),
    title:clean(post.title,150),
    description:clean(post.description,300),
    body:Array.isArray(post.body)?post.body.map(x=>clean(x,5000)).filter(Boolean).slice(0,16):[],
    category:NEWS_CATEGORIES.includes(post.category)?post.category:(legacy?"altin":"ekonomi"),
    status:NEWS_STATUSES.includes(post.status)?post.status:(legacy?"published":"draft"),
    image:clean(post.image||"",500),
    sourceName:clean(post.sourceName||"Bugün Altın",120),
    sourceUrl:clean(post.sourceUrl||"",500),
    sourceType:clean(post.sourceType||(legacy?"market-summary":"manual"),50),
    publishedAt,
    updatedAt:post.updatedAt||publishedAt
  };
}

function validateNewsInput(input={}){
  const value=normalizeNewsPost(input);
  const errors=[];
  if(value.title.length<20)errors.push("title_too_short");
  if(value.description.length<60)errors.push("description_too_short");
  if(value.body.length<2||value.body.join(" ").length<120)errors.push("body_too_short");
  if(!NEWS_CATEGORIES.includes(input.category))errors.push("invalid_category");
  if(!NEWS_STATUSES.includes(input.status))errors.push("invalid_status");
  if(value.sourceUrl&&!/^https?:\/\//i.test(value.sourceUrl))errors.push("invalid_source_url");
  return {ok:errors.length===0,errors,value};
}

function publishedNews(posts=[]){
  return posts.map(normalizeNewsPost).filter(x=>x.status==="published").sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
}

module.exports={NEWS_CATEGORIES,NEWS_STATUSES,normalizeNewsPost,validateNewsInput,publishedNews,slugify};
