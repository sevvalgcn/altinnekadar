const fs=require('node:fs');

const path='public/app.js';
let src=fs.readFileSync(path,'utf8');

const marker='const number=n=>new Intl.NumberFormat("tr-TR",{maximumFractionDigits:4}).format(Number(n)||0);';
const helpers=`${marker}\n\nconst GOLD_CACHE_KEY="bugunaltin:last-good-gold:v1";\n\nfunction saveGoldCache(data){\n  if(!data?.prices?.length)return;\n  try{\n    localStorage.setItem(GOLD_CACHE_KEY,JSON.stringify({city:currentCity,data,savedAt:Date.now()}));\n  }catch{}\n}\n\nfunction readGoldCache(){\n  try{\n    const cached=JSON.parse(localStorage.getItem(GOLD_CACHE_KEY)||"null");\n    if(cached?.city===currentCity&&cached?.data?.prices?.length)return cached.data;\n  }catch{}\n  return null;\n}\n\nfunction showGoldStaleNotice(){\n  if($("goldSourceChip"))$("goldSourceChip").textContent="Son başarılı fiyat";\n  if($("statusText"))$("statusText").textContent=\\`${CITIES[currentCity]} • canlı güncelleme bekleniyor\\`;\n}`;

if(!src.includes('const GOLD_CACHE_KEY="bugunaltin:last-good-gold:v1";')){
  if(!src.includes(marker))throw new Error('number helper marker bulunamadı');
  src=src.replace(marker,helpers);
}

const oldLoad=`async function loadGold(){\n  try{\n    const r=await fetch(\\`/api/prices?city=\\${encodeURIComponent(currentCity)}\\`,{cache:"no-store"});\n    if(!r.ok)throw 0;\n    renderGold(await r.json());\n  }catch{\n    renderGold({verified:false,prices:[]});\n  }\n}`;

const newLoad=`async function loadGold(){\n  try{\n    const r=await fetch(\\`/api/prices?city=\\${encodeURIComponent(currentCity)}\\`,{cache:"no-store"});\n    if(!r.ok)throw 0;\n    const data=await r.json();\n    renderGold(data);\n    saveGoldCache(data);\n  }catch{\n    if(goldData?.prices?.length){\n      showGoldStaleNotice();\n      return;\n    }\n    const cached=readGoldCache();\n    if(cached){\n      renderGold(cached);\n      showGoldStaleNotice();\n      return;\n    }\n    renderGold({verified:false,prices:[]});\n  }\n}`;

if(!src.includes('saveGoldCache(data);')){
  if(!src.includes(oldLoad))throw new Error('loadGold eski bloğu bulunamadı');
  src=src.replace(oldLoad,newLoad);
}

fs.writeFileSync(path,src);
console.log('price retention patch applied');
