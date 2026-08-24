# AltınNeKadar.com.tr — Production Paket

## Hazır özellikler
- Mobil, tablet ve masaüstü responsive arayüz
- 81 il seçimi ve şehir bazlı SEO URL'leri
- Kullanıcı izniyle cihaz konumundan en yakın il merkezi önerisi (koordinat dış servise gönderilmez)
- Şehir başına ayrı, doğrulanmış yerel kuyumcu kaynağı adaptörü
- TCMB `today.xml` ile USD, EUR, GBP, CHF alış/satış kurları
- Döviz çevirici
- Altın, kredi taksit, yüzde, KDV ve zam hesaplama araçları
- 30 sn yerel altın cache, 5 dk TCMB cache
- PWA manifest + service worker
- Dinamik SEO title/description/canonical
- sitemap.xml, robots.txt, favicon
- Güvenlik başlıkları, health endpoint, 404 sayfası
- Hakkımızda, Gizlilik, Kullanım Şartları
- Reklam alanı placeholder'ı

## Yerel altın verisinin çalışması
`server.js` içindeki `verifiedSources` nesnesine doğrulanmış şehir adaptörlerini ekleyin:

```js
const verifiedSources={
  sakarya: require('./sources/sakarya'),
  ankara: require('./sources/ankara')
};
```

`sources/_template.js` adaptör şablonudur. Kaynak bağlanana kadar site o şehir için fiyat UYDURMAZ; açıkça kaynak beklediğini gösterir.

## Çalıştırma
```bash
npm install
npm start
```
Yerel adres: `http://localhost:3000`

## Render deploy
- Build command: `npm install`
- Start command: `npm start`
- Node 18+
- Custom domain: `altinnekadar.com.tr`

## Canlıya çıkmadan önce
1. İlk şehirlerin kuyumcu odası/dernek kaynaklarını doğrula ve adaptörleri bağla.
2. Render'a deploy et.
3. Atak Domain DNS kayıtlarını Render'ın verdiği değerlere yönlendir.
4. Google Search Console'a `https://altinnekadar.com.tr/sitemap.xml` gönder.
5. Analytics/AdSense eklenecekse Gizlilik sayfasını kullanılan servislerle güncelle.
