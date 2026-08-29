(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root)root.CitySearch=api;
})(typeof window!=="undefined"?window:globalThis,function(){
  const normalize=value=>String(value||"")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g,"i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"");
  const escapeHtml=value=>String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);

  function filterCities(cities,query){
    const needle=normalize(query);
    if(!needle)return [];
    return Object.entries(cities)
      .filter(([,name])=>normalize(name).includes(needle))
      .sort((a,b)=>{
        const aStarts=normalize(a[1]).startsWith(needle)?0:1;
        const bStarts=normalize(b[1]).startsWith(needle)?0:1;
        return aStarts-bStarts||a[1].localeCompare(b[1],"tr-TR");
      })
      .slice(0,6);
  }

  function initCityTypeahead({input,suggestions,cities,navigate,documentRef}){
    if(!input||!suggestions)return;
    const render=()=>{
      const matches=filterCities(cities,input.value);
      suggestions.innerHTML=matches.map(([slug,name])=>`<button type="button" class="city-suggestion" role="option" data-city-slug="${escapeHtml(slug)}">${escapeHtml(name)}</button>`).join("");
      suggestions.hidden=!matches.length;
      input.setAttribute("aria-expanded",String(matches.length>0));
    };
    input.addEventListener("input",render);
    input.addEventListener("focus",render);
    input.addEventListener("keydown",event=>{
      if(event.key!=="Enter")return;
      const first=filterCities(cities,input.value)[0];
      if(!first)return;
      event.preventDefault();
      navigate(`/${first[0]}-altin-fiyatlari`);
    });
    suggestions.addEventListener("click",event=>{
      const option=event.target.closest?.("[data-city-slug]");
      if(option?.dataset.citySlug)navigate(`/${option.dataset.citySlug}-altin-fiyatlari`);
    });
    documentRef?.addEventListener("click",event=>{
      if(event.target!==input&&!suggestions.contains(event.target)){
        suggestions.hidden=true;
        input.setAttribute("aria-expanded","false");
      }
    });
  }
  return {filterCities,initCityTypeahead};
});
