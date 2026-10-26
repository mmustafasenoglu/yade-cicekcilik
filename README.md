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

## Sipariş akışı

Site özet ve PDF hazırlar, WhatsApp sohbetini açar. Mesajın gönderilmesi ve fiyat, stok, hazırlama zamanı teyidi işletme ile müşteriye aittir. Ödeme veya otomatik sipariş alma altyapısı yoktur.

Bu depo sitenin kullandığı marka ve ürün görsellerini içerir. PDF-Lib için lisans metni `dist/assets/PDF-LIB-LICENSE.md` dosyasındadır.
