# Ekonomi ve Yatırım Haberleri Tasarımı

## Amaç

Bugün Altın'a yatırımcıların takip edebileceği SEO uyumlu bir ekonomi haberleri alanı eklemek. Mevcut altın, döviz, şehir ve hesaplama akışları korunacak. Haberler hem sistem tarafından otomatik üretilebilecek hem de yönetim panelinden oluşturulup yönetilebilecek.

## Yaklaşım

Mevcut `seo-posts.json`, yapay zekâ üretimi, GitHub kalıcı kayıt ve sürüm geçmişi altyapısı genişletilecek. Ayrı ve ikinci bir içerik motoru kurulmayacak. Mevcut `/altin-gundemi` adresleri geriye dönük olarak çalışmaya devam edecek; yeni genel merkez `/haberler` olacak.

İlk sürümde otomatik içerikler doğrulanmış canlı altın ve döviz verilerinden hazırlanacak. Harici haber sitelerinden izinsiz tam metin kopyalanmayacak. Panelde kaynak adı ve kaynak bağlantısı girilebilecek; editörün sağladığı bilgi yapay zekâ ile özgün bir haber taslağına dönüştürülebilecek.

## İçerik modeli

Her haber şu alanları taşıyacak:

- benzersiz kimlik ve SEO uyumlu bağlantı;
- başlık, kısa özet ve paragraf listesi;
- kategori: Altın, Döviz, Borsa, Kripto veya Ekonomi;
- kapak görseli;
- kaynak adı ve kaynak bağlantısı;
- taslak veya yayında durumu;
- otomatik ya da manuel üretim bilgisi;
- yayın ve güncelleme tarihleri.

Eski otomatik altın özetleri veri dönüşümüne gerek kalmadan Altın kategorisinde ve yayında kabul edilecek.

## Ziyaretçi arayüzü

- Ana sayfada son yayınlanan haberlerden oluşan “Ekonomi ve Yatırım Haberleri” bölümü bulunacak.
- `/haberler` sayfası son haberleri kartlar halinde gösterecek ve kategori filtreleri sunacak.
- `/haberler/:slug` sayfası haber detayını, kaynak bilgisini ve ilgili yatırım araçlarına iç bağlantıları gösterecek.
- Eski `/altin-gundemi` ve `/altin-gundemi/:slug` adresleri çalışmaya devam edecek.
- Haber detaylarında `NewsArticle`, liste sayfasında `CollectionPage` yapılandırılmış verisi kullanılacak.
- Yayındaki haberler XML site haritasına eklenecek; taslaklar ziyaretçilere ve arama motorlarına gösterilmeyecek.

## Yönetim paneli

Panelde “Haber Yönetimi” alanı bulunacak. Editör:

- yeni haber oluşturabilecek;
- mevcut haberi seçip düzenleyebilecek;
- kategori, görsel, kaynak ve yayın durumunu değiştirebilecek;
- taslağı yayınlayabilecek veya yayından kaldırabilecek;
- yapay zekâ ile başlık, özet ve içerik hazırlatabilecek;
- otomatik üretim modunu açıp kapatabilecek.

Silme yerine geri alınabilir “yayından kaldırma” kullanılacak. Mevcut sürüm geçmişi korunacak.

## Otomasyon

Mevcut zamanlayıcı canlı piyasa verilerinden günün belirli saatlerinde otomatik içerik üretmeye devam edecek. Yeni yapı bu içerikleri haber modelinde yayınlayacak. Aynı zaman dilimi ve veri için ikinci kez haber üretilmeyecek.

Harici kaynak akışı ilk sürümün dışında tutulacak. Böylece kaynağı belirsiz içerik, telif riski ve hatalı otomatik yayın önlenecek. Panelden girilen kaynaklı metinler için yapay zekâ yalnızca taslak hazırlayacak; yayın kararı editörde olacak.

## Veri ve güvenlik

- Haber verileri `data/seo-posts.json` içinde geriye uyumlu biçimde saklanacak.
- Yazma işlemleri mevcut admin oturum kontrolünden geçecek.
- Girdi uzunlukları, kategori, durum ve bağlantı alanları sunucuda doğrulanacak.
- HTML doğrudan kabul edilmeyecek; ziyaretçi çıktıları kaçış işleminden geçirilecek.
- GitHub kaydı başarısız olsa bile yerel kayıt sonucu panelde açıkça gösterilecek.

## Testler

- Eski içeriklerin yeni modele uyumluluğu;
- taslakların ziyaretçiye gösterilmemesi;
- kategori ve durum doğrulaması;
- manuel haber oluşturma ve güncelleme;
- haber liste/detay yolları ve eski bağlantıların korunması;
- ana sayfa haber kartları;
- site haritasında yalnız yayınlanmış haberlerin yer alması;
- otomatik içerikte tekrar kayıt oluşmaması.

## Başarı ölçütü

Ziyaretçi ana sayfadan ekonomi haberlerine ulaşabilmeli, kategoriye göre içerik görebilmeli ve SEO uyumlu detay sayfasını açabilmeli. Yönetici panelden haber ekleyip düzenleyebilmeli, otomatik piyasa içeriklerini kontrol edebilmeli ve mevcut sitenin fiyat/şehir özellikleri değişmeden çalışmaya devam etmelidir.
