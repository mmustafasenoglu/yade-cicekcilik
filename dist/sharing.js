(function(root){
'use strict';
function canAttach(nav,file){try{return !!(file&&typeof nav.share==='function'&&typeof nav.canShare==='function'&&nav.canShare({files:[file]}))}catch{return false}}
function share(nav,file,text){if(!canAttach(nav,file)){return Promise.reject(Object.assign(new Error('File sharing unsupported'),{name:'NotSupportedError'}))}return nav.share({files:[file],title:'Yade Flowers — Buket tasarımım',text})}
const api={canAttach,share};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BouquetSharing=api;
})(typeof window!=='undefined'?window:this);
