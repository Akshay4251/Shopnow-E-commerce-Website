(function(){
var $=function(s){return document.getElementById(s)};
var S=[['In stock',64,'d',1],['Low stock',14,'p',1],['Reserved',11,'r',0],['Out of stock',8,'o',1]],MAX=80,sel=null,hb=$('hb');
hb.innerHTML=S.map(function(s){
  var inner='<span class="lb2">'+s[0]+'</span><span class="tr"><i class="fi2" style="width:0"></i></span><b>'+s[1]+'</b>';
  return s[3]?'<button type="button" class="hr2 '+s[2]+'" data-s="'+s[0]+'" aria-pressed="false" aria-label="'+s[0]+': '+s[1]+' products. Click to filter the table">'+inner+'</button>'
             :'<div class="hr2 '+s[2]+'" role="img" aria-label="'+s[0]+': '+s[1]+' products">'+inner+'</div>'}).join('')
  +'<div class="ax" aria-hidden="true"><span></span><div>'+[0,20,40,60,80].map(function(v){return '<span>'+v+'</span>'}).join('')+'</div><span></span></div>';
requestAnimationFrame(function(){requestAnimationFrame(function(){[].slice.call(hb.querySelectorAll('.hr2')).forEach(function(b,i){b.querySelector('.fi2').style.width=Math.max(S[i][1]/MAX*100,3)+'%'})})});
var rows=[].slice.call($('tbd').children);
function run(){var n=0;rows.forEach(function(r){var ok=!sel||r.dataset.st===sel;r.style.display=ok?'':'none';if(ok)n++});
  $('empty').classList.toggle('show',!n);var c=$('chip');c.hidden=!sel;c.textContent=sel?sel+' ✕':'';
  [].slice.call(hb.querySelectorAll('button.hr2')).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.s===sel)})}
hb.addEventListener('click',function(e){var b=e.target.closest('button.hr2');if(!b)return;sel=sel===b.dataset.s?null:b.dataset.s;run()});
$('chip').addEventListener('click',function(){sel=null;run()});
var m=$('exm'),eb=$('exb');
function toggle(o){m.classList.toggle('open',o);eb.setAttribute('aria-expanded',o)}
eb.addEventListener('click',function(e){e.stopPropagation();toggle(!m.classList.contains('open'))});
document.addEventListener('click',function(){toggle(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
function csv(){
  var rs=[['Level','Products']].concat(S.map(function(s){return [s[0],s[1]]}));rs.push([]);rs.push(['Product','SKU','Stock (units)','Status']);
  rows.forEach(function(r){var t=r.children;rs.push([t[0].textContent,t[1].textContent,parseInt(t[2].textContent,10),t[3].textContent])});
  var text=rs.map(function(r){return r.map(function(x){return '"'+String(x).replace(/"/g,'""')+'"'}).join(',')}).join('\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));a.download='stock-report.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(a.href)}
m.addEventListener('click',function(e){var li=e.target.closest('li');if(!li)return;if(li.dataset.f==='csv')csv();else window.print();toggle(false)});
m.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.dataset.f)e.target.click()});
run();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
