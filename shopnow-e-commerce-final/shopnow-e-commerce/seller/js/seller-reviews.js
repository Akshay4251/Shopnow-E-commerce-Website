(function(){
var $=function(s){return document.getElementById(s)},list=$('rl'),cards=[].slice.call(list.querySelectorAll('.rv')),total=1248;
function run(){
  var p=$('pf').value,r=$('rf').value,s=$('so').value,n=0;
  var k={n:function(a,b){return b.dataset.d.localeCompare(a.dataset.d)},o:function(a,b){return a.dataset.d.localeCompare(b.dataset.d)},h:function(a,b){return b.dataset.r-a.dataset.r||b.dataset.d.localeCompare(a.dataset.d)},l:function(a,b){return a.dataset.r-b.dataset.r||b.dataset.d.localeCompare(a.dataset.d)}}[s];
  cards.sort(k).forEach(function(c){list.insertBefore(c,$('empty'));var ok=(p==='All'||c.dataset.p===p)&&(r==='All'||c.dataset.r===r);c.style.display=ok?'':'none';if(ok)n++});
  $('empty').classList.toggle('show',!n);
  var f=p!=='All'||r!=='All';
  $('info').textContent=n?(f?'Showing '+n+' matching review'+(n>1?'s':''):'Showing 1–'+n+' of '+total.toLocaleString('en-US')+' reviews'):'No reviews found'}
['pf','rf','so'].forEach(function(i){$(i).addEventListener('change',run)});
$('pg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled||isNaN(+b.textContent))return;[].slice.call($('pg').children).forEach(function(x){x.classList.remove('on')});b.classList.add('on')});
run();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
