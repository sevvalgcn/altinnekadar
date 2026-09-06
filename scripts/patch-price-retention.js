const fs=require('node:fs');

const path='public/app.js';
let src=fs.readFileSync(path,'utf8');

const marker='const number=n=>new Intl.NumberFormat("tr-TR",{maximumFractionDigits:4}).format(Number(n)||0);';
const helperBlock=[
  marker,
  '',
  'const GOLD_CACHE_KEY="bugunaltin:last-good-gold:v1";',
  '',
  'function saveGoldCache(data){',
  '  if(!data?.prices?.length)return;',
  '  try{',
  '    localStorage.setItem(GOLD_CACHE_KEY,JSON.stringify({city:currentCity,data,savedAt:Date.now()}));',
  '  }catch{}',
  '}',
  '',
  'function readGoldCache(){',
  '  try{',
  '    const cached=JSON.parse(localStorage.getItem(GOLD_CACHE_KEY)||"null");',
  '    if(cached?.city===currentCity&&cached?.data?.prices?.length)return cached.data;',
  '  }catch{}',
  '  return null;',
  '}',
  '',
  'function showGoldStaleNotice(){',
  '  if($("goldSourceChip"))$("goldSourceChip").textContent="Son başarılı fiyat";',
  '  if($("statusText"))$("statusText").textContent=`${CITIES[currentCity]} • canlı güncelleme bekleniyor`;',
  '}'
].join('\n');

if(!src.includes('const GOLD_CACHE_KEY="bugunaltin:last-good-gold:v1";')){
  if(!src.includes(marker))throw new Error('number helper marker bulunamadı');
  src=src.replace(marker,helperBlock);
}

const oldLoad=[
  'async function loadGold(){',
  '  try{',
  '    const r=await fetch(`/api/prices?city=${encodeURIComponent(currentCity)}`,{cache:"no-store"});',
  '    if(!r.ok)throw 0;',
  '    renderGold(await r.json());',
  '  }catch{',
  '    renderGold({verified:false,prices:[]});',
  '  }',
  '}'
].join('\n');

const newLoad=[
  'async function loadGold(){',
  '  try{',
  '    const r=await fetch(`/api/prices?city=${encodeURIComponent(currentCity)}`,{cache:"no-store"});',
  '    if(!r.ok)throw 0;',
  '    const data=await r.json();',
  '    renderGold(data);',
  '    saveGoldCache(data);',
  '  }catch{',
  '    if(goldData?.prices?.length){',
  '      showGoldStaleNotice();',
  '      return;',
  '    }',
  '    const cached=readGoldCache();',
  '    if(cached){',
  '      renderGold(cached);',
  '      showGoldStaleNotice();',
  '      return;',
  '    }',
  '    renderGold({verified:false,prices:[]});',
  '  }',
  '}'
].join('\n');

if(!src.includes('saveGoldCache(data);')){
  if(!src.includes(oldLoad))throw new Error('loadGold eski bloğu bulunamadı');
  src=src.replace(oldLoad,newLoad);
}

fs.writeFileSync(path,src);
console.log('price retention patch applied');
