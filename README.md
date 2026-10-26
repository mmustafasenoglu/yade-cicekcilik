# Yade Flowers

Yade Çiçekçilik için statik web sitesi. Etkileşimli buket tasarımı, ürün koleksiyonu, PDF tasarım belgesi ve WhatsApp üzerinden talep hazırlama içerir.

## Yerel önizleme

```bash
python3 -m http.server 4175 --bind 127.0.0.1 --directory dist
```

Ardından `http://127.0.0.1:4175` adresini açın. Yayında `dist/` klasörü doğrudan statik dosya kökü olarak sunulur; sunucu tarafı uygulama veya veritabanı gerekmez.

## Test

```bash
node --test tests/*.test.cjs
```

Ürün bilgileri `dist/content.js` içinde değiştirildiğinde, yayına hazırlamadan önce SEO koleksiyon sayfalarını ve ana sayfanın JavaScript olmadan görünen ürün kartlarını yeniden üretin:

```bash
node scripts/build-seo-pages.cjs
```

Bu komut `dist/cicek-buketleri/`, `dist/celenkler/`, `dist/saksi-cicekleri/` ve `dist/sitemap.xml` dosyalarını günceller. Yayına yalnızca `dist/` içeriği kopyalanır.

Katalogdaki her ürünün `image` alanı galeride kullanılan en fazla 900 piksel genişliğindeki `.thumb.webp` dosyasına, `fullImage` alanı fotoğraf büyütülünce açılan `.webp` dosyasına işaret eder. Orijinal JPG/PNG kaynakları depoda korunur. Yeni ürün eklerken iki WebP sürümünü üretip `node scripts/build-seo-pages.cjs` ve `node --test tests/*.test.cjs` komutlarını çalıştırın.

## Otomatik yayın

`main` dalına gönderilen her commit, [GitHub Actions](.github/workflows/publish.yml) ile SEO sayfalarını yeniden üretir, testleri çalıştırır ve `dist/` içeriğini GitHub Pages'e yayımlar. Canlı adres `https://yadecicekcilik.com/`; `www` adresi ana adrese yönlenir. Sunucu SSH erişimi veya sunucu parolası gerekmez.

İçerik güncelleme akışı: ilgili `dist/` dosyalarını düzenleyin, yerelde `node scripts/build-seo-pages.cjs` ve `node --test tests/*.test.cjs` çalıştırın, ardından değişiklikleri `main` dalına gönderin. Yayın durumunu deponun **Actions** sekmesinden izleyin. Alan adı Cloudflare DNS üzerinden GitHub Pages'e yönlenir.

## Sipariş akışı

Site özet ve PDF hazırlar, WhatsApp sohbetini açar. Mesajın gönderilmesi ve fiyat, stok, hazırlama zamanı teyidi işletme ile müşteriye aittir. Ödeme veya otomatik sipariş alma altyapısı yoktur.

Bu depo sitenin kullandığı marka ve ürün görsellerini içerir. PDF-Lib için lisans metni `dist/assets/PDF-LIB-LICENSE.md` dosyasındadır.
