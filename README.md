# BugunAltin.com — Nova Tarzı Yönetim Paneli

Bu sürüm, mevcut finans sitesini kod değiştirmeden yönetmek için hazırlanmıştır.

## Panel
`https://bugunaltin.com/admin`

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




## Harem sarrafiye fiyat ölçeği düzeltmesi
Harem kaynağında Çeyrek/Yarım/Tam/Cumhuriyet fiyatları bazı yanıtlarda 11.71, 23.41, 46.65 gibi bin TL ölçeğinde gelebilir.
Bu ürünlerde değer 1000 TL'den küçükse backend otomatik olarak 1000 ile çarpar.
Gram Altın ve 22 Ayar Bilezik bu dönüşümden etkilenmez.


## 81 Şehir — Tek Kaynak Registry

Tüm şehir kaynakları `data/city-source-registry.json` içinde tek yerde tutulur.

Hazır eşlemeler:
- İstanbul → Harem Altın / Hasfiyat
- Ankara → Harem Altın / Hasfiyat
- İzmir → İzmir Kuyumcular Odası resmî güncel kur sayfası
- Sakarya → ceyrekaltinfiyatlari.com/sakarya
- Diğer şehirler → doğrulanmış resmî/yerel canlı kaynak bulunana kadar merkezi apinoktam fallback

Doğruluk ilkesi:
Açık ve makine tarafından okunabilir resmî oda fiyatı doğrulanmamış şehirler resmî oda verisi diye gösterilmez.
Yerel kaynak çalışmazsa sayfa boş kalmaz; merkezi canlı veri otomatik devreye girer.


## Sakarya parser düzeltmesi
Sakarya kaynak sayfasında ürün satırlarında gram/adet/ayar değerleri fiyatlardan önce geçtiği için eski parser bu değerleri fiyat sanabiliyordu.
Yeni parser:
- gram/ayar gibi küçük teknik sayıları atlar,
- 100 TL üzerindeki ilk iki gerçek para değerini alış/satış olarak kullanır,
- `7.193,03` ve `7,193.03` biçimlerini destekler,
- Gram ve Çeyrek için mantık kontrolü yapar; şüpheli veri varsa merkezi fallback'e geçer.
