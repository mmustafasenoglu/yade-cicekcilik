(function(root){
 const MAX=35;
 const base={stems:[],wrap:'premium',selected:null};
 function create(){return structuredClone(base)}
 function add(state,product,id){if(state.stems.length>=MAX)return false;state.stems.push({id,product,x:500,y:780,angle:0,height:580});arrange(state,false);state.selected=id;return true}
 function arrange(state,force=true){
  const n=state.stems.length;
  state.stems.forEach((s,i)=>{
   if(!force&&s.manual)return;
   const theta=i*2.3999632297+.6;
   const radius=n<=3?70:Math.min(218,130+n*7)*Math.sqrt((i+.65)/n);
   const hx=500+Math.cos(theta)*radius;
   const hy=340+Math.sin(theta)*radius*.5;
   s.x=500+Math.sin(i*1.7)*8;s.y=755;
   s.angle=Math.atan2(hx-s.x,s.y-hy)*180/Math.PI;
   s.height=Math.hypot(hx-s.x,s.y-hy)/.82;
   s.depth=hy;s.manual=false;
  });
 }

 // Keep the flower crown inside the bouquet and the stem tied inside the wrapping.
 function constrain(s){
  const r=s.angle*Math.PI/180,d=s.height*.82;
  let hx=s.x+Math.sin(r)*d,hy=s.y-Math.cos(r)*d;
  const nx=(hx-500)/215,ny=(hy-340)/120,length=Math.hypot(nx,ny);
  if(length>1){hx=500+nx/length*215;hy=340+ny/length*120}
  s.x=Math.max(480,Math.min(520,s.x));s.y=Math.max(735,Math.min(775,s.y));
  s.angle=Math.atan2(hx-s.x,s.y-hy)*180/Math.PI;
  s.height=Math.hypot(hx-s.x,s.y-hy)/.82;
  return s;
 }

 function remove(state,id){state.stems=state.stems.filter(s=>s.id!==id);if(state.selected===id)state.selected=null}
 function summary(state,products){return products.map(p=>({...p,count:state.stems.filter(s=>s.product===p.id).length})).filter(p=>p.count)}
 function money(value){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',minimumFractionDigits:0,maximumFractionDigits:2}).format(value/100)}
 function quote(state,products,wraps){
  const map=new Map(products.map(p=>[p.id,p]));
  for(const s of state.stems){const p=map.get(s.product);if(!p||!Number.isSafeInteger(p.unitPrice)||p.unitPrice<0)throw new Error('Geçersiz çiçek fiyatı')}
  const wrap=wraps[state.wrap];if(!wrap||!Number.isSafeInteger(wrap.price)||wrap.price<0)throw new Error('Geçersiz ambalaj fiyatı');
  const lines=summary(state,products).map(p=>({...p,total:p.count*p.unitPrice}));
  const productsTotal=lines.reduce((n,p)=>n+p.total,0),wrapTotal=state.stems.length?wrap.price:0;
  return{lines,productsTotal,wrapTotal,total:productsTotal+wrapTotal,wrapLabel:wrap.label};
 }
 const api={MAX,create,add,arrange,constrain,remove,summary,quote,money};if(typeof module!=='undefined')module.exports=api;else root.BouquetModel=api;
})(typeof window!=='undefined'?window:globalThis);
