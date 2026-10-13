
(function(){
var $=function(s){return document.getElementById(s)};
var PAGE=10,all=[],page=1,rows=[];
var PEN='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
var BIN='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>';
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){return 'Rs '+Number(n).toLocaleString('en-IN')}

function rowHtml(p){
  var pl=p.status==='Out of stock'?'Out':p.status;
  return '<tr data-row data-id="'+esc(p.id)+'"><td><input type="checkbox" class="cb rowcb" aria-label="Select '+esc(p.name)+'"></td>'+
  '<td class="pn"><b>'+esc(p.name)+'</b></td><td class="sku">'+esc(p.sku)+'</td><td>'+esc(p.category)+'</td>'+
  '<td><b>'+money(p.price)+'</b></td><td class="'+(p.stock===0?'zero':'')+'">'+p.stock+'</td>'+
  '<td><span class="pl '+esc(pl)+'">'+esc(p.status)+'</span></td>'+
  '<td class="ac"><a class="ib" href="seller-products-edit.html?id='+encodeURIComponent(p.id)+'" aria-label="Edit '+esc(p.name)+'">'+PEN+'</a>'+
  '<button class="ib del" aria-label="Delete '+esc(p.name)+'">'+BIN+'</button></td></tr>';
}
function filtered(){
  var q=$('q').value.toLowerCase().trim(),c=$('cat').value,s=$('st').value,k=$('sk').value;
  return all.filter(function(p){
    if(q&&(p.name+' '+p.sku).toLowerCase().indexOf(q)<0)return false;
    if(c!=='All'&&p.category!==c)return false;
    if(s!=='All'&&p.status!==s)return false;
    if(k==='in'&&p.stock<=0)return false;if(k==='low'&&!(p.stock>0&&p.stock<=5))return false;if(k==='out'&&p.stock!==0)return false;
    return true});
}
function draw(){
  var list=filtered(),pages=Math.max(1,Math.ceil(list.length/PAGE));if(page>pages)page=pages;
  var from=(page-1)*PAGE,slice=list.slice(from,from+PAGE);
  $('tbd').innerHTML=slice.map(rowHtml).join('');
  $('empty').classList.toggle('show',!list.length);
  var f=$('q').value||$('cat').value!=='All'||$('st').value!=='All'||$('sk').value!=='All';
  $('info').textContent=!list.length?'No products found':(f?'Showing '+list.length+' matching product'+(list.length>1?'s':''):'Showing '+(from+1)+'–'+(from+slice.length)+' of '+list.length+' products');
  var h='<button data-p="'+(page-1)+'"'+(page<=1?' disabled':'')+'>Previous</button>';
  for(var i=1;i<=pages;i++)h+='<button data-p="'+i+'"'+(i===page?' class="on"':'')+'>'+i+'</button>';
  h+='<button data-p="'+(page+1)+'"'+(page>=pages?' disabled':'')+'>Next</button>';
  $('pg').innerHTML=h;
}
function load(){
  $('tbd').innerHTML='<tr><td colspan="8" style="padding:28px;text-align:center">Loading products…</td></tr>';
  API.list('products').then(function(d){
    if(d.length)ProductsData.setSample(d[0]);
    all=d.map(ProductsData.view).sort(function(a,b){return Number(b.id)-Number(a.id)});
    draw();
  }).catch(function(e){
    console.error(e);
    $('tbd').innerHTML='<tr><td colspan="8" style="padding:28px;text-align:center">Could not load products from the API. Check your internet and the URL in common/js/api.js.</td></tr>';
  });
}
['q','cat','st','sk'].forEach(function(i){$(i).addEventListener('input',function(){page=1;draw()})});
$('pg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;page=+b.dataset.p;draw()});
$('all').addEventListener('change',function(){[].slice.call($('tbd').querySelectorAll('.rowcb')).forEach(function(c){c.checked=$('all').checked})});

var ov=$('ov'),target=null,opener=null;
function openFor(r,btn){target=all.filter(function(p){return String(p.id)===r.dataset.id})[0];if(!target)return;opener=btn||null;
  $('pn').textContent=target.name;$('ps').textContent=target.sku;$('pp').textContent=money(target.price);
  ov.classList.add('open');document.body.classList.add('lock');$('cn').focus()}
function closeM(){ov.classList.remove('open');document.body.classList.remove('lock');if(opener&&opener.isConnected)opener.focus()}
$('tbd').addEventListener('click',function(e){var b=e.target.closest('.del');if(b)openFor(b.closest('tr'),b)});
$('x').addEventListener('click',closeM);$('cn').addEventListener('click',closeM);
ov.addEventListener('click',function(e){if(e.target===ov)closeM()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('open'))closeM()});
$('dp').addEventListener('click',function(){
  if(!target){closeM();return}
  var t=target,btn=$('dp');btn.disabled=true;btn.textContent='Deleting…';
  API.remove('products',t.id).then(function(){
    all=all.filter(function(p){return p.id!==t.id});draw();closeM();target=null;
  }).catch(function(e){console.error(e);alert('Could not delete the product. Please try again.')})
  .then(function(){btn.disabled=false;btn.textContent='Delete product'});
});
try{var pq=new URLSearchParams(location.search).get('q');if(pq)$('q').value=pq}catch(e){}
load();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
