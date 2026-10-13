(function(){
/* Inventory: products come from the MockAPI "product" resource, stock changes are saved with
   API.updateStock (updates product.stock AND adds a row to stockMovements). */
var AUTO='stock'; /* the two modal preview pages set this to 'stock' / 'price' to open the modal on load */
var $=function(s){return document.getElementById(s)},tbd=$('tbd');
var PAGE=10,all=[],moves=[],tab='All',page=1,cur=null;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function st(n){return n===0?['Out of stock','Out']:(n<=5?['Low stock','Low']:['In stock','In'])}
function fmt(n){return 'Rs '+Number(n).toLocaleString('en-IN')}
function errText(e){return (e&&e.message)?e.message:String(e)}
function byId(id){return all.filter(function(p){return String(p.id)===String(id)})[0]}

/* ---------- list ---------- */
function rowHtml(p){var s=st(p.stock);
  return '<tr data-row data-id="'+esc(p.id)+'"><td data-label="Product" class="nm"><b>'+esc(p.name)+'</b></td>'+
  '<td data-label="SKU" class="sku">'+esc(p.sku)+'</td><td data-label="Price" class="pc2"><b>'+fmt(p.price)+'</b></td>'+
  '<td data-label="Stock" class="sk2">'+p.stock+'</td><td data-label="Status"><span class="pl '+s[1]+'">'+s[0]+'</span></td>'+
  '<td data-label="" class="ac"><button class="btn sm" data-a="price">Update price</button><button class="btn sm" data-a="stock">Update stock</button></td></tr>'}
function filtered(){
  var q=$('q').value.toLowerCase().trim(),v=$('so').value;
  var l=all.filter(function(p){return(tab==='All'||st(p.stock)[0]===tab)&&(!q||(p.name+' '+p.sku).toLowerCase().indexOf(q)>-1)});
  var k={n:function(a,b){return a.name.localeCompare(b.name)},sl:function(a,b){return a.stock-b.stock},sh:function(a,b){return b.stock-a.stock},pl:function(a,b){return a.price-b.price},ph:function(a,b){return b.price-a.price}}[v];
  return k?l.slice().sort(k):l}
function kpis(){var c={'Low stock':0,'In stock':0,'Out of stock':0};all.forEach(function(p){c[st(p.stock)[0]]++});
  $('k-low').textContent=c['Low stock'];$('k-in').textContent=c['In stock'];$('k-out').textContent=c['Out of stock']}
function draw(){
  var list=filtered(),pages=Math.max(1,Math.ceil(list.length/PAGE));if(page>pages)page=pages;
  var from=(page-1)*PAGE,slice=list.slice(from,from+PAGE),f=tab!=='All'||$('q').value.trim();
  tbd.innerHTML=slice.map(rowHtml).join('');
  $('empty').classList.toggle('show',!list.length);
  $('info').textContent=!list.length?'No products found':(f?'Showing '+list.length+' matching product'+(list.length>1?'s':''):'Showing '+(from+1)+'–'+(from+slice.length)+' of '+list.length+' products');
  var h='<button data-p="'+(page-1)+'"'+(page<=1?' disabled':'')+'>Previous</button>';
  for(var i=1;i<=pages;i++)h+='<button data-p="'+i+'"'+(i===page?' class="on"':'')+'>'+i+'</button>';
  h+='<button data-p="'+(page+1)+'"'+(page>=pages?' disabled':'')+'>Next</button>';
  $('pg').innerHTML=h;kpis()}

/* ---------- recent stock movements ---------- */
function when(s){var d=new Date(s);return isNaN(d)?'':d.toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
function drawMoves(){
  if(!moves.length){$('mvb').innerHTML='<tr><td colspan="5" class="mvmsg">No stock changes yet.</td></tr>';return}
  $('mvb').innerHTML=moves.map(function(m){var p=byId(m.productId),q=Number(m.quantityChanged)||0;
    return '<tr><td data-label="When">'+esc(when(m.createdAt))+'</td><td data-label="Product" class="nm"><b>'+esc(p?p.name:'Product #'+m.productId)+'</b></td>'+
    '<td data-label="Change"><span class="mq '+(q<0?'neg':'pos')+'">'+(q>0?'+':'')+q+'</span></td>'+
    '<td data-label="Stock">'+esc(m.previousStock)+' → '+esc(m.newStock)+'</td><td data-label="Reason">'+esc(m.reason)+'</td></tr>'}).join('')}
function loadMoves(){
  return API.list('stockMovements',{sortBy:'createdAt',order:'desc',page:1,limit:10}).then(function(d){moves=d;drawMoves()})
  .catch(function(e){console.error(e);$('mvb').innerHTML='<tr><td colspan="5" class="mvmsg">Could not load stock movements. '+esc(errText(e))+'</td></tr>'})}

function load(){
  tbd.innerHTML='<tr><td colspan="6" style="padding:28px;text-align:center">Loading products…</td></tr>';
  $('mvb').innerHTML='<tr><td colspan="5" class="mvmsg">Loading…</td></tr>';
  return API.list('products').then(function(d){
    if(d.length)ProductsData.setSample(d[0]);
    all=d.map(ProductsData.view).sort(function(a,b){return Number(b.id)-Number(a.id)});
    draw();return loadMoves()
  }).then(function(){if(AUTO&&all.length){openFor(all[0].id,AUTO);if(AUTO==='stock')$('ns').value='+20'}})
  .catch(function(e){console.error(e);tbd.innerHTML='<tr><td colspan="6" style="padding:28px;text-align:center">Could not load products. '+esc(errText(e))+'</td></tr>'})}

/* ---------- filters ---------- */
[].slice.call(document.querySelectorAll('.itabs button')).forEach(function(b){b.addEventListener('click',function(){[].slice.call(document.querySelectorAll('.itabs button')).forEach(function(x){x.classList.remove('on')});b.classList.add('on');tab=b.dataset.t;page=1;draw()})});
$('q').addEventListener('input',function(){page=1;draw()});$('so').addEventListener('change',function(){page=1;draw()});
$('pg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;page=+b.dataset.p;draw()});

/* ---------- modal ---------- */
var ov=$('ov'),opener=null;
function showTab(t){[].slice.call(document.querySelectorAll('.mt button')).forEach(function(b){var on=b.dataset.t===t;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});$('fp').hidden=t!=='price';$('fs').hidden=t!=='stock';$(t==='price'?'np':'ns').focus()}
function openFor(id,t,btn){cur=byId(id);if(!cur)return;opener=btn||null;$('mn').textContent=cur.name;$('ms').textContent=cur.sku;
  $('cur').value=fmt(cur.price);$('np').value=cur.price;$('cs').value=cur.stock+' units';$('ns').value='';pick(0);dd(false);$('e1').hidden=$('e2').hidden=true;
  ov.classList.add('open');document.body.classList.add('lock');showTab(t)}
function closeM(){ov.classList.remove('open');document.body.classList.remove('lock');if(opener&&opener.isConnected)opener.focus()}
tbd.addEventListener('click',function(e){var b=e.target.closest('button[data-a]');if(b)openFor(b.closest('tr').dataset.id,b.dataset.a,b)});
[].slice.call(document.querySelectorAll('.mt button')).forEach(function(b){b.addEventListener('click',function(){showTab(b.dataset.t)})});
[].slice.call(document.querySelectorAll('[data-c]')).forEach(function(b){b.addEventListener('click',closeM)});
$('x').addEventListener('click',closeM);ov.addEventListener('click',function(e){if(e.target===ov)closeM()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('open'))closeM()});

function busy(form,on,label){var b=form.querySelector('[type=submit]');b.disabled=on;if(label)b.dataset.l=b.dataset.l||b.textContent;b.textContent=on?label:(b.dataset.l||b.textContent)}

/* update price -> PUT product */
$('fp').addEventListener('submit',function(e){e.preventDefault();var v=$('np').value,er=$('e1');
  if(!/^\d+$/.test(v)||+v<1){er.hidden=false;er.textContent='Enter a price of Rs 1 or more.';$('np').focus();return}
  if(!cur)return;var p=cur,form=this;er.hidden=true;busy(form,true,'Saving…');
  API.get('products',p.id).then(function(rec){
    var pk=ProductsData.payload({price:v},rec);
    var k=Object.keys(pk)[0];if(typeof rec[k]==='number')pk[k]=Number(v); /* keep the same type the record uses (Faker gives a string) */
    return API.update('products',p.id,pk)
  }).then(function(saved){p.price=Number(v);draw();closeM()})
  .catch(function(x){console.error(x);er.hidden=false;er.textContent='Could not save the price. '+errText(x)})
  .then(function(){busy(form,false)})});

/* reason dropdown */
var rl=$('rl'),opts=[].slice.call(rl.children),reason='Restock';
function dd(o){rl.classList.toggle('open',o);$('rb').setAttribute('aria-expanded',o)}
function pick(i){opts.forEach(function(x,k){x.classList.toggle('sel',k===i);x.setAttribute('aria-selected',k===i)});reason=opts[i].firstChild.textContent;$('rv').textContent=reason}
$('rb').addEventListener('click',function(e){e.stopPropagation();dd(!rl.classList.contains('open'))});
opts.forEach(function(o,i){o.addEventListener('click',function(e){e.stopPropagation();pick(i);dd(false)})});
document.addEventListener('click',function(e){if(!e.target.closest('.dd'))dd(false)});

/* update stock -> API.updateStock (PUT product + POST stockMovements) */
$('fs').addEventListener('submit',function(e){e.preventDefault();var v=$('ns').value.replace(/\s/g,''),er=$('e2');
  if(!/^[+-]?\d+$/.test(v)||+v===0){er.hidden=false;er.textContent='Enter a quantity like +20 or -5.';$('ns').focus();return}
  if(!cur)return;var p=cur,old=p.stock;
  if(old+(+v)<0){er.hidden=false;er.textContent='You only have '+old+' units, so you cannot remove '+Math.abs(+v)+'.';$('ns').focus();return}
  var form=this;er.hidden=true;busy(form,true,'Saving…');
  API.updateStock(p.id,+v,reason).then(function(saved){
    p.stock=Number(ProductsData.view(saved).stock);draw();closeM();return loadMoves()
  }).catch(function(x){console.error(x);er.hidden=false;er.textContent='Could not save the stock. '+errText(x)})
  .then(function(){busy(form,false)})});

load();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
