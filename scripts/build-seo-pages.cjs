const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dist = path.resolve(__dirname, '../dist');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(dist, 'content.js'), 'utf8'), context);
const business = context.window.FLOWER_CONTENT;
const products = business.readyBouquets.filter(item => item.id && item.name && item.image);
const site = 'https://yadecicekcilik.com';
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
const asset = value => `/${value.replace(/^\//, '')}`;
const whatsapp = item => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Merhaba Yade Flowers, ${item ? `sitenizdeki “${item.name}” (${item.id}) tasarımını` : 'sitenizdeki çiçekleri'} beğendim. Güncel fiyatı, uygunluğu ve dükkândan alma zamanını öğrenebilir miyim?`)}`;
const cards = (items, staticHome = false) => items.map((item, index) => `
<article class="${staticHome ? 'ready-card' : 'collection-card'}">
  <a class="${staticHome ? 'ready-photo' : 'collection-photo'}" href="${escape(whatsapp(item))}" target="_blank" rel="noopener noreferrer" aria-label="${escape(item.name)} hakkında WhatsApp’tan bilgi al">
    ${staticHome ? '<span class="ready-frame-flower frame-top" aria-hidden="true"></span><span class="ready-frame-flower frame-bottom" aria-hidden="true"></span><i class="ready-frame-dot" aria-hidden="true"></i>' : ''}
    <img src="${escape(asset(item.image))}" alt="${escape(item.alt || `${item.name} — Yade Flowers gerçek ürün fotoğrafı`)}" width="800" height="1000" loading="${index === 0 && !staticHome ? 'eager' : 'lazy'}" decoding="async">
    <span class="${staticHome ? 'ready-product-code' : 'collection-code'}">${escape(item.id)}</span>
  </a>
  <div class="${staticHome ? 'ready-info' : 'collection-info'}"><h3>${escape(item.name)}</h3><p>Güncel fiyat ve uygunluk için bize sor</p><a class="${staticHome ? 'ready-enquire' : 'collection-enquire'}" href="${escape(whatsapp(item))}" target="_blank" rel="noopener noreferrer">WHATSAPP’TAN SOR ↗</a></div>
</article>`).join('').replace(/[ \t]+$/gm, '');

const pages = [
  {
    slug: 'cicek-buketleri', label: 'Çiçek buketleri', title: 'Aydın Efeler Çiçek Buketleri | Yade Flowers',
    description: 'Yade Flowers’ın Aydın Efeler’de hazırladığı gerçek çiçek buketlerini incele. Gül, gerbera ve lilyum seçenekleri için güncel fiyatı ve mağazadan alma zamanını sor.',
    heading: 'Aydın Efeler’de çiçek buketleri', intro: 'Birine renkli bir sürpriz yapmak ya da kendi seçtiğin çiçeklerle bir demet hazırlatmak için gerçek Yade buketlerine göz at. Güllü, gerberalı ve lilyumlu tasarımları Cumhuriyet Mahallesi’ndeki dükkânımızda konuşup seçebilirsin.',
    detail: 'Fotoğraflar Yade Flowers’ın hazırladığı gerçek buketlerden. Çiçeklerin mevsime göre bulunurluğu değişebilir; beğendiğin tasarımın güncel fiyatını ve ne zaman hazır olacağını WhatsApp’tan teyit ederiz.',
    items: products.filter(item => item.category === 'flowers').slice(0, 16),
    questions: [
      ['Kendi buketimi oluşturabilir miyim?', 'Evet. Ana sayfadaki buket atölyesinde çiçekleri ve ambalajı seçip tasarımını PDF olarak hazırlayabilirsin. Son fiyat ve stok Yade Flowers ile görüşülerek netleşir.'],
      ['Buketimi mağazadan alabilir miyim?', 'Evet. Cumhuriyet Mahallesi, Vali Konağı Bulvarı No:59, Efeler/Aydın adresine gelmeden önce hazırlık saatini bizimle konuşmanı öneririz.']
    ]
  },
  {
    slug: 'celenkler', label: 'Çelenkler', title: 'Aydın Efeler Çelenk Modelleri | Yade Flowers',
    description: 'Aydın Efeler’de Yade Flowers’ın hazırladığı açılış, tören ve anma çelenklerini gerçek fotoğraflarla incele. Uygunluk ve hazırlık zamanı için doğrudan iletişime geç.',
    heading: 'Aydın Efeler’de çelenk modelleri', intro: 'Açılış, tören ve anma için hazırlanmış çelenk örneklerini burada görebilirsin. Renk, yazı ve hazırlanma zamanı önemli olduğu için seçtiğin modeli bizimle görüşerek netleştiriyoruz.',
    detail: 'Bu sayfadaki görseller Yade Flowers’ın gerçek çelenk çalışmalarından. Çiçek türü ve renkler mevsime ve stoğa bağlıdır; güncel fiyat, yazı ve hazırlık ayrıntıları iletişim sırasında teyit edilir.',
    items: [...products.filter(item => item.category === 'wreath').slice(0, 10), ...products.filter(item => item.category === 'funeral')],
    questions: [
      ['Çelenk üzerindeki yazıyı belirleyebilir miyim?', 'Modeli seçerken istediğin yazıyı ve tören zamanını bize ilet. Uygunluğu ve hazırlık ayrıntılarını birlikte netleştirelim.'],
      ['Fiyatı nasıl öğrenebilirim?', 'Beğendiğin fotoğrafın YD kodunu WhatsApp’tan gönder. Kullanılacak çiçek ve hazırlık bilgisine göre güncel fiyatı teyit edelim.']
    ]
  },
  {
    slug: 'saksi-cicekleri', label: 'Saksı çiçekleri', title: 'Aydın Efeler Saksı Çiçekleri ve Orkideler | Yade Flowers',
    description: 'Aydın Efeler’de Yade Flowers’ın gerçek orkide ve saksı çiçeği fotoğraflarına bak. Güncel stok, fiyat ve mağazadan alma zamanı için bize yaz.',
    heading: 'Aydın Efeler’de saksı çiçekleri', intro: 'Orkide, antoryum ve yeşil bitki seçeneklerini gerçek Yade fotoğraflarıyla incele. Evin veya iş yerin için uygun bir saksı çiçeği seçerken güncel seçenekleri öğrenmek üzere bize yazabilirsin.',
    detail: 'Canlı bitkilerde renk, boy ve stok değişebilir. Fotoğraftaki tasarımın güncel bulunurluğunu, fiyatını ve dükkândan ne zaman alabileceğini önce bizimle teyit et.',
    items: products.filter(item => item.category === 'potted').slice(0, 12),
    questions: [
      ['Fotoğraftaki orkide şu anda var mı?', 'Canlı bitki stoku değişebilir. Beğendiğin ürünün YD kodunu WhatsApp’tan gönder; güncel durumu teyit edelim.'],
      ['Saksı çiçeğini nereden alabilirim?', 'Cumhuriyet Mahallesi, Vali Konağı Bulvarı No:59, Efeler/Aydın adresindeki dükkânımıza gelebilirsin. Gelmeden önce arayıp ürünü sorabilirsin.']
    ]
  }
];

function pageHtml(page) {
  const url = `${site}/${page.slug}/`;
  const other = pages.filter(item => item.slug !== page.slug);
  const breadcrumb = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    {'@type': 'ListItem', position: 1, name: 'Ana sayfa', item: `${site}/`},
    {'@type': 'ListItem', position: 2, name: page.label, item: url}
  ]};
  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f5f2ec">
<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><link rel="canonical" href="${url}"><link rel="icon" type="image/svg+xml" href="/assets/yade-mark.svg">
<meta property="og:type" content="website"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="Yade Flowers"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}${asset(page.items[0].fullImage || page.items[0].image)}"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(breadcrumb).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap"><link rel="stylesheet" href="/category.css?v=1">
</head><body><a class="skip" href="#urunler">Ürünlere geç</a><header class="category-header"><a class="logo" href="/" aria-label="Yade Flowers ana sayfa"><img src="/assets/yade-logo-clean.svg" width="1040" height="220" alt="Yade Flowers"></a><nav aria-label="Ana menü"><a href="/">Ana sayfa</a><a href="/cicek-buketleri/">Buketler</a><a href="/celenkler/">Çelenkler</a><a href="/saksi-cicekleri/">Saksı çiçekleri</a></nav><a class="header-call" href="tel:+905522048615">BİZİ ARA ↗</a></header>
<main><div class="breadcrumb"><a href="/">Yade Flowers</a><span aria-hidden="true">/</span><span>${escape(page.label)}</span></div><section class="category-hero"><div><p class="eyebrow">YADE FLOWERS · CUMHURİYET MAHALLESİ / EFELER</p><h1>${escape(page.heading)}</h1><p class="intro">${escape(page.intro)}</p><div class="hero-actions"><a class="primary" href="#urunler">MODELLERE BAK ↓</a><a href="${escape(whatsapp())}" target="_blank" rel="noopener noreferrer">WhatsApp’tan sor ↗</a></div></div><div class="hero-photo"><img src="${escape(asset(page.items[0].fullImage || page.items[0].image))}" alt="${escape(page.items[0].alt || page.items[0].name)}" width="800" height="1000" fetchpriority="high"><span>GERÇEK YADE TASARIMLARI ✿</span></div></section>
<section class="collection" id="urunler"><div class="section-heading"><p class="eyebrow">DÜKKÂNIMIZDAN SEÇİLENLER</p><h2>${escape(page.label)}<em> · Yade Flowers</em></h2><p>${escape(page.detail)}</p></div><div class="collection-grid">${cards(page.items)}</div><p class="collection-more">Daha fazla gerçek Yade tasarımını <a href="/#hazir-buketler">ana sayfadaki koleksiyonda</a> görebilirsin.</p></section>
<section class="category-questions"><p class="eyebrow">KISACA MERAK ETTİKLERİN</p><h2>Seçmeden önce bil.</h2><div class="question-grid">${page.questions.map(([question, answer]) => `<article><h3>${escape(question)}</h3><p>${escape(answer)}</p></article>`).join('')}</div></section>
<section class="visit"><div><p class="eyebrow">AYDIN EFELER’DE BİZİ BUL</p><h2>Çiçeğin Yade’de, yolun bize.</h2><p>Cumhuriyet Mahallesi, Vali Konağı Bulvarı No:59, Efeler / Aydın</p></div><div><a class="primary" href="tel:+905522048615">0552 204 86 15 · ARA ↗</a><a href="https://www.google.com/maps/dir/?api=1&amp;destination=Yade%20Flowers%2C%20Cumhuriyet%20Mahallesi%2C%20Vali%20Kona%C4%9F%C4%B1%20Bulvar%C4%B1%20No%3A59%2C%20Efeler%2C%20Ayd%C4%B1n" target="_blank" rel="noopener noreferrer">Yol tarifi al ↗</a></div></section></main>
<footer><a class="footer-logo" href="/">Yade Flowers</a><nav aria-label="Diğer koleksiyonlar"><a href="/">Ana sayfa</a>${other.map(item => `<a href="/${item.slug}/">${escape(item.label)}</a>`).join('')}</nav><span>Vali Konağı Bulvarı No:59 · Cumhuriyet Mahallesi · Efeler / Aydın</span></footer></body></html>`;
}

for (const page of pages) {
  const folder = path.join(dist, page.slug);
  fs.mkdirSync(folder, {recursive: true});
  fs.writeFileSync(path.join(folder, 'index.html'), pageHtml(page));
}

const homepagePath = path.join(dist, 'index.html');
let homepage = fs.readFileSync(homepagePath, 'utf8');
const start = '<!-- seo:cards:start -->';
const end = '<!-- seo:cards:end -->';
const staticCards = `${start}${cards(products.slice(0, 16), true)}${end}`;
if (homepage.includes(start)) homepage = homepage.replace(new RegExp(`${start}[\\s\\S]*?${end}`), staticCards);
else homepage = homepage.replace('<div id="ready-grid" class="ready-grid"></div>', `<div id="ready-grid" class="ready-grid">${staticCards}</div>`);
homepage = homepage.replace('id="hazir-buketler" aria-labelledby="ready-title" hidden', 'id="hazir-buketler" aria-labelledby="ready-title"');
fs.writeFileSync(homepagePath, homepage);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['', ...pages.map(page => `${page.slug}/`)].map(part => `  <url><loc>${site}/${part}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
console.log(`Generated ${pages.length} collection pages and homepage product fallback.`);
