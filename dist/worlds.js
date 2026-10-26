(()=>{'use strict';
const select=document.querySelector('#world-select'),button=document.querySelector('#world-go');
const labels={bouquet:'DEMETİNİ TASARLA ↗',wreath:'ÇELENKLERİ GÖR ↗',funeral:'CENAZE ÇELENKLERİNİ GÖR ↗',potted:'SAKSI ÇİÇEKLERİNİ GÖR ↗'};
function choose(){const type=select.value;button.textContent=labels[type];if(type==='bouquet'){location.hash='atolye';document.querySelector('#atolye').scrollIntoView({block:'start'});return}document.querySelector('#ready-clear').click();document.querySelector('#ready-filters [data-filter="'+type+'"]').click();location.hash='hazir-buketler';document.querySelector('#hazir-buketler').scrollIntoView({block:'start'})}
document.querySelectorAll('[data-route]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();select.value=link.dataset.route;choose()}));
document.querySelectorAll('[data-ready-reset]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#ready-clear').click();document.querySelector('#ready-filters [data-filter=all]').click()}));
document.querySelectorAll('[data-ready-code]').forEach(link=>link.addEventListener('click',()=>{const input=document.querySelector('#ready-query');input.value=link.dataset.readyCode;input.dispatchEvent(new Event('input',{bubbles:true}))}));
if(FLOWER_CONTENT.shopImage){const image=document.querySelector('#shop-real-photo'),picture=document.querySelector('#shop-picture');image.onload=()=>{image.hidden=false;picture.classList.add('has-shop-photo')};const load=()=>{image.src=FLOWER_CONTENT.shopImage};if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){load();observer.disconnect()}},{rootMargin:'400px'});observer.observe(picture)}else load()}
select.addEventListener('change',choose);button.addEventListener('click',choose);
})();
