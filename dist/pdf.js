window.createBouquetPDF=async function({snapshot,preview,summary,wrap,quote,notes,code,date}){
 await document.fonts.ready;
 const logo=new Image();logo.src='assets/yade-logo-clean.svg';await logo.decode();
 const pdf=await PDFLib.PDFDocument.create();pdf.setTitle('Yade Flowers | Buket talebi | '+code);pdf.setAuthor('Yade Flowers');pdf.setSubject('Kişisel buket tasarımı, seçim listesi ve hazırlık talebi');
 const W=1240,H=1754,M=80,INK='#344d3b',ROSE='#a13f68',MUTED='#66735c',pages=[];let ctx,y;
 function text(s,x,top,size=22,color=INK,font='Arial'){ctx.font=size+'px '+font;ctx.fillStyle=color;ctx.fillText(String(s),x,top)}
 function rule(top){ctx.strokeStyle='#d9ddce';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(M,top);ctx.lineTo(W-M,top);ctx.stroke()}
 function page(label){let c=document.createElement('canvas');c.width=W;c.height=H;ctx=c.getContext('2d');pages.push(c);ctx.fillStyle='#fcf9f1';ctx.fillRect(0,0,W,H);ctx.fillStyle=INK;ctx.fillRect(0,0,W,13);ctx.drawImage(logo,M,48,410,87);text('KİŞİSEL BUKET TALEBİ',835,71,18,ROSE);text(code,835,102,17);text(date,835,129,16,MUTED);rule(164);text(label,M,215,17,ROSE);y=265}
 function ensure(height){if(y+height>1530)page('TALEBİNİN DETAYLARI / DEVAM')}
 function rows(s,width,size=22){ctx.font=size+'px Arial';let out=[];for(const para of String(s).split('\n')){let row='';for(const char of para){if(ctx.measureText(row+char).width>width&&row){let i=row.lastIndexOf(' ');if(i>row.length*.5){out.push(row.slice(0,i));row=row.slice(i+1)+char}else{out.push(row);row=char}}else row+=char}out.push(row)}return out}
 function block(label,body){if(!body)return;const lines=rows(body,1040);ensure(95);text(label,M,y,17,ROSE);y+=35;for(const line of lines){ensure(36);text(line,M,y,22);y+=33}y+=27}
 page('01 / SENİN DEMETİN');text('Bir demet. Sana özel.',M,285,57,INK,'Georgia');text('Her dalını sen seçtin. Şimdi Yade dokunuşuyla hayat bulsun.',M,329,23,MUTED);
 ctx.fillStyle='#f0e9e2';ctx.fillRect(M,367,1080,850);ctx.drawImage(preview,210,377,820,820);
 ctx.fillStyle=INK;ctx.fillRect(M,1244,1080,96);text(snapshot.stems.length+' DAL',107,1284,19,'#e6ebd6');text(wrap+' ambalaj',107,1314,22,'#fff5ec');text('SENİN SEÇİMİN · YADE’NİN DOKUNUŞU',650,1301,18,'#edbfd2');
 y=1390;block('TASARIM NOTU','Bu görsel, seçtiğin çiçeklerin yerleşimini ve renk uyumunu anlatan tasarım önizlemesidir. Mevsime ve çiçeklerin doğal formuna göre son görünüm farklılık gösterebilir.');
 page('02 / SEÇİMLERİN VE HAZIRLIK NOTLARI');text('İçinden geçenler, bir arada.',M,281,43,INK,'Georgia');y=340;
 ctx.fillStyle='#e8ecde';ctx.fillRect(M,y-28,1080,54);text('ÇİÇEK / YEŞİLLİK',100,y+7,18);text('BİRİM FİYAT',570,y+7,18);text('ADET',790,y+7,18);text('TUTAR',1010,y+7,18);y+=73;
 for(const item of summary){ensure(65);text(item.name,100,y,22);text(BouquetModel.money(item.unitPrice),570,y,22);text(item.count+' dal',790,y,22);text(BouquetModel.money(item.total),1010,y,22);rule(y+23);y+=61}
 ensure(190);text(wrap+' ambalaj',100,y,21);text(BouquetModel.money(quote.wrapTotal),570,y,22);text('1 adet',790,y,22);text(BouquetModel.money(quote.wrapTotal),1010,y,22);rule(y+24);y+=65;text('Çiçekler toplamı',100,y,21);text(BouquetModel.money(quote.productsTotal),1010,y,22);y+=42;ctx.fillStyle=INK;ctx.fillRect(M,y-27,1080,65);text('HESAPLANAN TOPLAM',100,y+12,20,'#fff7ed');text(BouquetModel.money(quote.total),980,y+12,28,'#efbfd1');y+=89;
 block('FİYAT VE UYGUNLUK','Nihai fiyat; seçtiğin çiçekler, adetler ve ambalaja göre Yade Flowers tarafından teyit edilerek sana bildirilecektir. Stok durumu ve dükkândan alma zamanı birlikte netleştirilir. Onayın alındıktan sonra hazırlık planlanır.');
 block('TALEBİ OLUŞTURAN',notes.sender||'İsim belirtilmedi.');block('KARTINA YAZILACAK NOT',notes.card||'Kart notu eklenmedi.');block('YADE’YE ÖZEL İSTEĞİN',notes.order||'Ek bir hazırlık isteği belirtilmedi.');
 block('BUNDAN SONRA','1. Bu belgeyi Yade Flowers ile WhatsApp üzerinden paylaş.\n2. Çiçeklerin uygunluğu, nihai fiyat ve hazır olacağı zaman sana bildirilsin.\n3. Detayları onayla; hazırlanan demetini dükkândan al.');
 for(let i=0;i<pages.length;i++){ctx=pages[i].getContext('2d');rule(1580);text('YADE FLOWERS  /  EFELER · AYDIN',M,1618,18,ROSE);text('0552 204 86 15  ·  0256 213 35 05',M,1650,18);text('Cumhuriyet Mah. · Vali Konağı Blv. No:59 · Efeler / Aydın',M,1680,17,MUTED);text('Bu belge bir tasarım talebidir; kesinleşmiş sipariş veya ödeme belgesi değildir.',M,1710,15,MUTED);text((i+1)+' / '+pages.length,1090,1680,18);const img=await pdf.embedPng(pages[i].toDataURL('image/png'));const p=pdf.addPage([595.28,841.89]);p.drawImage(img,{x:0,y:0,width:595.28,height:841.89})}
 return new File([await pdf.save()],code+'.pdf',{type:'application/pdf'});
};
