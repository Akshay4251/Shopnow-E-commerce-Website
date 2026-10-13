(function(){
var $=function(s){return document.getElementById(s)};
var rows=[].slice.call(document.querySelectorAll('#tbd tr'));
function match(r){
  var q=$('q').value.toLowerCase().trim(),c=$('cat').value,s=$('st').value,k=$('sk').value,n=+r.dataset.stock;
  if(q&&r.textContent.toLowerCase().indexOf(q)<0)return false;
  if(c!=='All'&&r.dataset.cat!==c)return false;
  if(s!=='All'&&r.dataset.st!==s)return false;
  if(k==='in'&&n<=0)return false;if(k==='low'&&!(n>0&&n<=5))return false;if(k==='out'&&n!==0)return false;
  return true}
function run(){var live=rows.filter(function(r){return r.isConnected}),n=0;
  live.forEach(function(r){var ok=match(r);r.style.display=ok?'':'none';if(ok)n++});
  var f=$('q').value||$('cat').value!=='All'||$('st').value!=='All'||$('sk').value!=='All';
  $('empty').classList.toggle('show',!n);
  $('info').textContent=n?(f?'Showing '+n+' matching product'+(n>1?'s':''):'Showing 1–'+n+' of '+total+' products'):'No products found'}
var total=42;
['q','cat','st','sk'].forEach(function(i){$(i).addEventListener('input',run)});
$('all').addEventListener('change',function(){rows.forEach(function(r){if(r.isConnected&&r.style.display!=='none')r.querySelector('.rowcb').checked=$('all').checked})});
var ov=$('ov'),target=null,opener=null;
function openFor(r,btn){target=r;opener=btn||null;$('pn').textContent=r.querySelector('.pn').textContent;$('ps').textContent=r.querySelector('.sku').textContent;$('pp').textContent=r.children[4].textContent;ov.classList.add('open');$('cn').focus()}
function closeM(){ov.classList.remove('open');if(opener)opener.focus()}
$('tbd').addEventListener('click',function(e){var b=e.target.closest('.del');if(b)openFor(b.closest('tr'),b)});
$('x').addEventListener('click',closeM);$('cn').addEventListener('click',closeM);
ov.addEventListener('click',function(e){if(e.target===ov)closeM()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('open'))closeM()});
$('dp').addEventListener('click',function(){if(target){target.remove();total--;run()}ov.classList.remove('open');target=null});
$('pg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||isNaN(+b.textContent))return;[].slice.call($('pg').children).forEach(function(x){x.classList.remove('on')});b.classList.add('on')});
run();
openFor(rows[0]);
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
