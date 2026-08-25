# AltınNeKadar.com.tr — Nova Tarzı Yönetim Paneli

Bu sürüm, mevcut finans sitesini kod değiştirmeden yönetmek için hazırlanmıştır.

## Panel
`https://altinnekadar.com.tr/admin`

### Panelden yönetilenler
- Logo, favicon, hero görseli
- Site adı ve marka renkleri
- Ana sayfa başlık / açıklamalar
- Menü yazıları
- Ana sayfa bölüm aç/kapat
- 81 il altın kaynakları
- Manuel altın alış/satış fiyatları
- Doğrulanmış canlı API adaptörleri
- TCMB döviz bölümü
- Altın / kredi / yüzde / KDV / zam araçları
- Reklam alanları
- SEO başlığı ve meta açıklaması
- Google Search Console verification
- Hakkımızda / Gizlilik / Kullanım Şartları
- Footer / iletişim
- Duyuru bandı ve bakım modu
- Sistem / kalıcı kayıt durumu

## Render Environment Variables
Zorunlu:
- `ADMIN_PASSWORD` = yönetici şifresi
- `ADMIN_SECRET` = en az 32 karakter rastgele gizli anahtar

Kalıcı ücretsiz GitHub depolaması:
- `GITHUB_OWNER` = `sevvalgcn`
- `GITHUB_REPO` = `altinnekadar`
- `GITHUB_BRANCH` = `main`
- `GITHUB_TOKEN` = yalnızca `altinnekadar` reposuna Contents Read and write izni olan fine-grained token

## Ücretsiz depolama / performans
Panel ayarları `data/site-config.json` içinde, logo/favicon/hero gibi düşük hacimli medya ise `public/uploads/` altında tutulur.
Panel kaydettiğinde backend bunları GitHub reposuna işler. GitHub değişikliğinden sonra Render otomatik deploy yapar.
Ziyaretçiler medya dosyalarını GitHub'dan değil Render'daki sitenin kendi statik dosya alanından alır.

Bu yaklaşım:
- Başlangıçta ayrı veritabanı gerektirmez.
- Her ziyaretçide GitHub API çağrısı yapmaz.
- Döviz ve altın API sonuçları cache edilir.
- Statik dosyalar tarayıcı cache'i ile sunulur.

Not: Gelecekte haber sitesi gibi binlerce büyük medya dosyası yüklenirse GitHub medya deposu yerine Cloudflare R2 gibi obje depolama kullanılmalıdır.

## Canlı şehir altın kaynakları
Her şehrin doğrulanmış canlı kaynağı varsa `sources/<şehir>.js` adaptörü eklenir.
Panelden kaynak adı/URL ve mod yönetilir. Doğrulanmamış veri resmi oda verisi gibi gösterilmez.


## Merkezi canlı altın bağlantısı
- Render: `GOLD_API_KEY`
- Opsiyonel: `GOLD_CACHE_MINUTES` (varsayılan 60)
- Sağlayıcı: `https://api.apinoktam.erenozdemir.com.tr/v1/altin`
- API anahtarı yalnız backend'de `x-api-key` başlığıyla kullanılır.
- Öncelik: şehir manuel fiyatı → doğrulanmış şehir adaptörü → merkezi canlı altın.
- API her ziyaretçide çağrılmaz; sunucu cache'i tüm ziyaretçilerce paylaşılır.


## İstanbul Harem Altın
- Render variable: `HAREM_API_KEY`
- Endpoint: `https://api.hasfiyat.com/api/prices?source=harem`
- Auth header: `Authorization: Bearer HAREM_API_KEY`
- İstanbul için Harem öncelikli.
- Harem erişilemezse merkezi apinoktam verisine fallback.
- Test endpoint: `/api/harem-status`


