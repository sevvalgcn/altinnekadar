/**
 * Bu dosyayı şehir adıyla kopyalayın (ör. sakarya.js).
 * Yalnızca ilgili kuyumcu odası/derneğinin izinli API/JSON/XML kaynağı doğrulandıktan sonra kullanın.
 */
module.exports={
  sourceName:"Kaynak adı",
  sourceUrl:"https://resmi-kaynak.example/",
  async fetchPrices(){
    // const r=await fetch("https://izinli-endpoint.example/api",{signal:AbortSignal.timeout(6000)});
    // const raw=await r.json();
    // return {updatedAt:new Date().toISOString(),prices:[
    //   {key:"gram",name:"Gram Altın",buy:0,sell:0,change:0},
    //   {key:"ceyrek",name:"Çeyrek Altın",buy:0,sell:0,change:0}
    // ]};
    throw new Error("Kaynak adaptörü yapılandırılmadı");
  }
};
