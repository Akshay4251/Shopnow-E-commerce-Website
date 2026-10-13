(function(){
var $=function(s){return document.getElementById(s)};
var SUB={'Electronics':['Mobiles','Laptops','Audio','Accessories'],'Kitchen & dining':['Mugs & cups','Serveware','Cookware'],'Home furnishings':['Cushion covers','Throws & blankets','Rugs'],'Home decor':['Candles','Vases','Wall art'],'Storage':['Baskets','Boxes'],'Garden':['Planters','Tools']};
var cat=$('cat'),sub=$('sub'),imgs=[],MAX=5*1024*1024,OK=/\.(jpe?g|png)$/i,status='Active';
Object.keys(SUB).forEach(function(c){var o=document.createElement('option');o.textContent=c;cat.appendChild(o)});

function subs(sel){sub.innerHTML='';(SUB[cat.value]||[]).forEach(function(s){var o=document.createElement('option');o.textContent=s;sub.appendChild(o)});if(sel)sub.value=sel}
subs();cat.addEventListener('change',function(){subs()});
function err(id,msg){var e=$('e-'+id);if(!e)return;e.hidden=!msg;e.textContent=msg||'';var f=e.closest('.f');if(f)f.classList.toggle('err',!!msg)}
function draw(){var th=$('th');th.innerHTML='';imgs.forEach(function(im,i){var d=document.createElement('div');d.className='tn';d.innerHTML='<img alt="Product photo '+(i+1)+'"><button type="button" aria-label="Remove photo">×</button>'+(i===0?'<span class="cv">Cover</span>':'');d.querySelector('img').src=im.url;d.querySelector('button').onclick=function(){URL.revokeObjectURL(im.url);imgs.splice(i,1);draw()};th.appendChild(d)});
  var p=document.createElement('button');p.type='button';p.className='plus';p.id='plus';p.textContent='+';p.setAttribute('aria-label','Add another photo');p.onclick=function(){$('fl').click()};th.appendChild(p)}
function add(list){var bad=[];[].slice.call(list).forEach(function(f){if(!OK.test(f.name)||f.size>MAX)bad.push(f.name);else imgs.push({url:URL.createObjectURL(f)})});draw();err('im',bad.length?'Not added (JPG or PNG up to 5 MB only): '+bad.join(', '):'')}
var dz=$('dz'),fl=$('fl');
dz.addEventListener('click',function(){fl.click()});dz.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fl.click()}});
fl.addEventListener('change',function(){add(fl.files);fl.value=''});$('plus').onclick=function(){fl.click()};
['dragenter','dragover'].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.add('drag')})});
['dragleave','drop'].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.remove('drag')})});
dz.addEventListener('drop',function(e){add(e.dataTransfer.files)});
$('seg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;status=b.dataset.v;[].slice.call($('seg').children).forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-checked',on)});$('sh').textContent=status==='Active'?'Active products are visible in your shop.':'Draft products are hidden from your shop until you activate them.'});
var pid=new URLSearchParams(location.search).get('id'),current=null;
if(!pid){$('al').textContent='No product selected. Go back to Products and click Edit on a product.';$('al').hidden=false}
else API.get('products',pid).then(function(rec){
  if(!rec)throw new Error('not found');current=rec;ProductsData.setSample(rec);var d=ProductsData.view(rec);
  if(d.category&&![].slice.call(cat.options).some(function(o){return o.value===d.category||o.textContent===d.category})){var o=document.createElement('option');o.textContent=d.category;cat.appendChild(o)}
  cat.value=d.category;subs(d.subCategory);
  if(d.subCategory&&sub.value!==d.subCategory){var so=document.createElement('option');so.textContent=d.subCategory;sub.appendChild(so);sub.value=d.subCategory}
  $('nm').value=d.name;$('sku').value=d.sku;$('stk').value=d.stock;$('pr').value=d.price;
  if($('dp'))$('dp').value=d.discountPrice;if($('ds'))$('ds').value=d.description;
  if(d.status==='Draft')$('seg').querySelector('[data-v="Draft"]').click();
}).catch(function(er){console.error(er);$('al').textContent='Could not load this product from the API.';$('al').hidden=false});
$('f').addEventListener('submit',function(e){e.preventDefault();var bad=null,v={nm:$('nm').value.trim(),sku:$('sku').value.trim(),stk:$('stk').value,pr:$('pr').value,dp:$('dp').value};
  function chk(id,msg){err(id,msg);if(msg&&!bad)bad=id}
  chk('nm',v.nm?'':'Please enter a product name.');chk('sku',v.sku?'':'Please enter a SKU.');
  chk('stk',v.stk===''||+v.stk<0||!/^\d+$/.test(v.stk)?'Enter a whole number, 0 or more.':'');
  chk('pr',v.pr===''||+v.pr<=0?'Enter a price greater than 0.':'');
  chk('dp',v.dp!==''&&(+v.dp<=0||+v.dp>=+v.pr)?'Discount price must be lower than the regular price.':'');
  if(bad){$(bad).focus();return}
  
  var btn=$('f').querySelector('[type=submit]'),al=$('al');
  var vals={name:v.nm,sku:v.sku,category:cat.value,subCategory:sub.value,stock:+v.stk,price:+v.pr,discountPrice:v.dp===''?'':+v.dp,description:$('ds')?$('ds').value.trim():'',status:status};
  if(btn){btn.disabled=true}
  (current?Promise.resolve(current):API.get('products',pid)).then(function(rec){
    return API.update('products',pid,ProductsData.payload(vals,rec))})
  .then(function(){al.innerHTML='<b>Changes saved.</b> <a href="seller-products.html">Back to products</a>';al.hidden=false;al.style.removeProperty('color');al.style.removeProperty('background');window.scrollTo(0,0)})
  .catch(function(er){console.error(er);al.textContent='Could not save: '+(er&&er.message?er.message:er);al.style.background='#fdecea';al.style.color='#b3261e';al.hidden=false;window.scrollTo(0,0)})
  .then(function(){if(btn)btn.disabled=false});});

})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
