# Ekonomi ve Yatırım Haberleri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bugün Altın'a otomatik piyasa içerikleriyle ve panelden yönetilen haberlerle çalışan SEO uyumlu ekonomi haberleri bölümü eklemek.

**Architecture:** Mevcut `seo-posts.json` ve admin kimlik doğrulaması genişletilecek. `public/news.js` saf model/normalizasyon işlerini yürütecek; Express rotaları ve HTML üretimi mevcut `public/server.js` içinde kalacak. Eski `/altin-gundemi` adresleri korunurken yeni merkez `/haberler` olacak.

**Tech Stack:** Node.js 18+, Express 4, düz JavaScript, JSON dosya depolama, Node test runner.

**Spec:** `docs/superpowers/specs/2026-08-29-economy-news-design.md`

## Global Constraints

- Mevcut altın, döviz, şehir ve hesaplama akışları değişmeyecek.
- Harici haber sitelerinden tam metin otomatik kopyalanmayacak.
- Taslaklar ziyaretçilere ve site haritasına gösterilmeyecek.
- Eski otomatik altın özetleri geriye uyumlu çalışacak.
- Admin girdileri doğrulanacak ve ziyaretçi çıktıları HTML kaçışından geçirilecek.

---

### Task 1: Haber modelini oluştur

**Files:**
- Create: `public/news.js`
- Test: `tests/news-model.test.js`

**Interfaces:**
- Consumes: Mevcut SEO post nesneleri.
- Produces: `normalizeNewsPost(post)`, `validateNewsInput(input)`, `publishedNews(posts)`.

- [ ] **Step 1: Başarısız model testlerini yaz**

```js
assert.equal(normalizeNewsPost({slot:"sabah"}).category,"altin");
assert.equal(normalizeNewsPost({slot:"sabah"}).status,"published");
assert.deepEqual(publishedNews([{status:"draft"},{status:"published"}]).length,1);
assert.equal(validateNewsInput({title:"kısa"}).ok,false);
```

- [ ] **Step 2: Testi çalıştır ve eksik modül nedeniyle başarısız olduğunu doğrula**

Run: `node --test tests/news-model.test.js`
Expected: FAIL with module not found.

- [ ] **Step 3: Normalizasyon ve doğrulamayı uygula**

Model; `category`, `status`, `image`, `sourceName`, `sourceUrl`, `publishedAt` ve `updatedAt` alanlarını güvenli varsayılanlarla döndürür. Kategoriler `altin,doviz,borsa,kripto,ekonomi`; durumlar `draft,published,archived` ile sınırlıdır.

- [ ] **Step 4: Model testlerini çalıştır**

Run: `node --test tests/news-model.test.js`
Expected: PASS.

### Task 2: Ziyaretçi haber sayfalarını ve SEO'yu ekle

**Files:**
- Modify: `public/server.js`
- Modify: `public/index.html`
- Modify: `public/styles.css`
- Test: `tests/news-pages.test.js`

**Interfaces:**
- Consumes: Task 1 model işlevleri.
- Produces: `GET /haberler`, `GET /haberler/:slug`, ana sayfa haber kartları ve `NewsArticle` şeması.

- [ ] **Step 1: Yayındaki içeriğin listelendiğini, taslağın gizlendiğini ve eski rotanın korunduğunu doğrulayan testleri yaz**
- [ ] **Step 2: Testleri çalıştırıp yeni rotalar eksik olduğu için başarısızlığı doğrula**
- [ ] **Step 3: Haber liste/detay üreticilerini, ana sayfa bölümünü ve stilleri uygula**
- [ ] **Step 4: Yayındaki haberleri dinamik site haritasına ekle**
- [ ] **Step 5: Testleri çalıştır ve geçir**

Run: `node --test tests/news-pages.test.js`
Expected: PASS.

### Task 3: Admin haber yönetimini ekle

**Files:**
- Modify: `public/server.js`
- Modify: `public/admin.html`
- Modify: `public/admin.js`
- Test: `tests/news-admin.test.js`

**Interfaces:**
- Consumes: Task 1 doğrulama işlevi ve mevcut `requireAdmin`, `saveSeoPosts`, `persistSeoPostsToGithub` işlevleri.
- Produces: `POST /api/admin/news`, `PUT /api/admin/news/:id`, `GET /api/admin/news`.

- [ ] **Step 1: Geçersiz kategoriyi reddeden ve geçerli taslağı kaydeden testleri yaz**
- [ ] **Step 2: Testleri çalıştırıp rotalar eksik olduğu için başarısızlığı doğrula**
- [ ] **Step 3: Admin API rotalarını uygula**
- [ ] **Step 4: Panelde haber seçme, yeni haber oluşturma, düzenleme ve yayın durumu alanlarını ekle**
- [ ] **Step 5: Testleri çalıştır ve geçir**

Run: `node --test tests/news-admin.test.js`
Expected: PASS.

### Task 4: Bütünleşik doğrulama ve yayın

**Files:**
- Modify: `package.json`
- Test: `tests/*.test.js`

**Interfaces:**
- Consumes: Tüm haber ve şehir arama özellikleri.
- Produces: Tek komutla çalışan regresyon testi.

- [ ] **Step 1: `npm test` ile tüm testleri çalıştır**
- [ ] **Step 2: `node --check` ile değişen JavaScript dosyalarını doğrula**
- [ ] **Step 3: `git diff --check` ile biçim hatalarını kontrol et**
- [ ] **Step 4: Değişiklikleri commit et**
- [ ] **Step 5: GitHub `render-live` dalına gönder ve uzak commit'i doğrula**
