from pathlib import Path
import json,re,shutil,hashlib
root=Path(__file__).resolve().parents[1]
p=root/'dist/content.js';text=p.read_text();start=text.index('[',text.index('readyBouquets:'));end=text.index('\n],',start)+2
old=json.loads(text[start:end]);assert len(old)==47, 'Import already applied; do not run twice';rows=json.loads((root/'catalog-production/safari-imported.json').read_text());added=[]
for r in rows:
 if r['index']==224:
  r['status']='excluded_duplicate_YD-06';continue
 code=f"YD-{51+len(added):02}";filename='yade-safari-'+str(r['index']).zfill(3)+'.jpg';dest=root/'dist/assets/bouquets'/filename
 shutil.copyfile(root/'catalog-source/safari-full'/r['file'],dest)
 b=dict(id=code,name=r['name'],image='assets/bouquets/'+filename,alt=r['name']+' — Yade Flowers gerçek ürün fotoğrafı',category=r['category'],price=None,source=r['sourceUrl']);added.append(b);r.update(productId=code,status='imported',sha256=hashlib.sha256(dest.read_bytes()).hexdigest())
p.write_text(text[:start]+json.dumps(old+added,ensure_ascii=False,indent=2)+text[end:])
(root/'catalog-production/safari-imported.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
p=root/'dist/index.html';p.write_text(p.read_text().replace('collection-47','collection-safari-203'))
p=root/'README.md';p.write_text(p.read_text()+'''\n## Safari galerisinden aktarım — güncel\nKullanıcının açık Safari galerisinden kaydedilen WebArchive içindeki 251 fotoğraf adayı görsel olarak incelendi. Araç/mağaza görselleri, kolajlar, mevcut ürünler ve aynı ürünün tekrar açıları ayıklandı. 157 seçilmiş fotoğraf net boyutta indirildi; benzerlik karşılaştırmasıyla mevcut YD-06 tekrarının çıkarılmasının ardından 156 yeni ürün eklendi. Koleksiyon toplamı **203 ürün** (YD-51–206 yeni kodlar). Fiyatlar teyit edilmediği için null tutulur. Orijinal Google JPEG dosyaları dönüştürülmeden kopyalandı; doğal ışık, arka plan ve ürün ayrıntıları korunur. CSS marka çerçeveleri sürer. Kaynak URL, boyut, ürün eşlemesi ve dosya özeti catalog-production/safari-imported.json içindedir. 251 aday incelendi; Google kaydında görünen 451 görselin tamamının tarandığı iddia edilmez.\n''')
print('Added',len(added),'total',len(old+added))
