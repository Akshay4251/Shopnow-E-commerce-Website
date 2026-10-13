(function(){
var $=function(s){return document.getElementById(s)};
var rows=[].slice.call($('tbd').children),tab='All',total=24,tabs=[].slice.call(document.querySelectorAll('.itabs button'));
rows.forEach(function(r){try{var id=r.querySelector('.id').textContent.replace('#ORD-',''),s=localStorage.getItem('ordst:'+id);if(s){r.dataset.st=s;var p=r.querySelector('[class*="os-"]');p.textContent=s;p.className='pl os-'+s}}catch(e){}});
try{var pq=new URLSearchParams(location.search).get('q');if(pq)$('q').value=pq}catch(e){}
function run(){
  var q=$('q').value.toLowerCase().replace('#','').trim(),m=$('mo').value,p=$('py').value,n=0;
  rows.forEach(function(r){
    var ok=(tab==='All'||r.dataset.st===tab)&&(m==='All'||r.dataset.mo===m)&&(p==='All'||r.dataset.pay===p)&&(!q||r.querySelector('.id').textContent.toLowerCase().indexOf(q)>-1);
    r.style.display=ok?'':'none';if(ok)n++});
  var f=tab!=='All'||q||m!=='All'||p!=='All';
  $('empty').classList.toggle('show',!n);
  $('info').textContent=n?(f?'Showing '+n+' matching order'+(n>1?'s':''):'Showing 1–'+n+' of '+total+' orders'):'No orders found'}
tabs.forEach(function(b){b.addEventListener('click',function(){tabs.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});b.classList.add('on');b.setAttribute('aria-selected','true');tab=b.dataset.t;run()})});
['q','mo','py'].forEach(function(i){$(i).addEventListener('input',run)});
$('pg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||isNaN(+b.textContent))return;[].slice.call($('pg').children).forEach(function(x){x.classList.remove('on')});b.classList.add('on')});
run();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
