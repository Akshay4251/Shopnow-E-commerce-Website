(function(){
/* Shipping: rows come from the MockAPI "shipments" resource (customer / address from "orders",
   agent names from "deliveryAgents"). The mark buttons save with PUT /shipments/:id. */
var $=function(s){return document.getElementById(s)},tbd=$('tbd');
var PAGE=10,ships=[],orders={},agents={},tab='In transit',page=1,sel={},busy=false,rr=0,loaded=false;
var KNOWN=['Ready to ship','In transit','Out for delivery','Delivered'];
var CLS={'Ready to ship':'ds-Ready','In transit':'ds-In','Out for delivery':'ds-Out','Delivered':'ds-Delivered'};
var LBL={'Ready to ship':'Mark as in transit','In transit':'Mark out for delivery','Delivered':'Already delivered'};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function errText(e){return(e&&e.message)?e.message:String(e)}
function norm(s){var t=String(s||'').trim().toLowerCase();for(var i=0;i<KNOWN.length;i++)if(KNOWN[i].toLowerCase()===t)return KNOWN[i];return 'Ready to ship'}
function tabOf(st){return st==='Out for delivery'?'In transit':st}
function mkey(r){var d=new Date(r.shippedAt||r.estimatedDelivery||r.createdAt||'');return isNaN(d)?'':d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)}
function mlabel(k){var p=k.split('-');return new Date(+p[0],+p[1]-1,1).toLocaleString('en-IN',{month:'long',year:'numeric'})}
function view(r){
  var o=API.orderInfo(orders[String(r.orderId)]),ag=agents[String(r.deliveryAgentId)];
  return{raw:r,id:String(r.id),orderId:String(r.orderId),status:norm(r.shipmentStatus),o:o,
    label:'#'+(o.number?o.number.replace(/^#/,''):'ORD-'+r.orderId),
    agent:r.deliveryAgentId?API.agentName(ag,r.deliveryAgentId):'Not assigned',mo:mkey(r)}}
function byId(id){return ships.filter(function(v){return v.id===String(id)})[0]}
function text(v){return[v.label,v.o.name,v.o.city,v.o.address,v.agent,v.raw.trackingNumber,v.raw.courierName,v.status].join(' ').toLowerCase()}

/* ---------- list ---------- */
function rowHtml(v){
  var r=v.raw,cust=v.o.name?'<b>'+esc(v.o.name)+'</b><small>'+esc(v.o.city)+'</small>':'<b>'+esc(r.courierName||'—')+'</b><small>'+esc(r.trackingNumber||'')+'</small>';
  var go=v.status==='Ready to ship'?'Mark in transit':v.status==='In transit'?'Out for delivery':'';
  return'<tr data-row data-id="'+esc(v.id)+'"'+(sel[v.id]?' class="sel"':'')+'><td data-label="Select"><input type="checkbox" class="cb rowcb" data-id="'+esc(v.id)+'"'+(sel[v.id]?' checked':'')+(go?'':' disabled')+' aria-label="Select '+esc(v.label)+'"></td>'
  +'<td data-label="Order ID" class="id">'+esc(v.label)+'</td><td data-label="Customer" class="cu">'+cust+'</td><td data-label="Address" class="adr">'+(esc(v.o.address)||'—')+'</td>'
  +'<td data-label="Agent">'+esc(v.agent)+'</td><td data-label="Status"><span class="pl '+CLS[v.status]+'">'+v.status+'</span></td>'
  +'<td data-label=""><span class="acs">'+(go?'<button class="btn sm rowmark" data-go="'+esc(v.id)+'">'+go+'</button>':'')+'<a class="btn sm" href="seller-shipping-tracking.html?shipment='+encodeURIComponent(v.id)+'">View</a></span></td></tr>'}
function filtered(){
  var q=$('q').value.toLowerCase().replace(/^#/,'').trim(),m=$('mo').value;
  return ships.filter(function(v){return tabOf(v.status)===tab&&(m==='All'||v.mo===m)&&(!q||text(v).indexOf(q)>-1)})}
function counts(){var c={'Ready to ship':0,'In transit':0,'Delivered':0};ships.forEach(function(v){c[tabOf(v.status)]++});
  [].slice.call(document.querySelectorAll('.itabs button')).forEach(function(b){b.querySelector('em').textContent=c[b.dataset.t]})}
function months(){var seen={},keys=[];ships.forEach(function(v){if(v.mo&&!seen[v.mo]){seen[v.mo]=1;keys.push(v.mo)}});keys.sort().reverse();
  var cur=$('mo').value;$('mo').innerHTML='<option value="All">Date range</option>'+keys.map(function(k){return'<option value="'+k+'">'+mlabel(k)+'</option>'}).join('');$('mo').value=keys.indexOf(cur)>-1?cur:'All'}
function draw(){
  var list=filtered(),pages=Math.max(1,Math.ceil(list.length/PAGE));if(page>pages)page=pages;
  var from=(page-1)*PAGE,slice=list.slice(from,from+PAGE),f=$('q').value.trim()||$('mo').value!=='All';
  tbd.innerHTML=slice.map(rowHtml).join('');
  $('empty').classList.toggle('show',loaded&&!list.length);
  $('info').textContent=!list.length?'No shipments found':(f?'Showing '+list.length+' matching shipment'+(list.length>1?'s':''):'Showing '+(from+1)+'–'+(from+slice.length)+' of '+list.length+' shipments');
  var h='<button data-p="'+(page-1)+'"'+(page<=1?' disabled':'')+'>Previous</button>';
  for(var i=1;i<=pages;i++)h+='<button data-p="'+i+'"'+(i===page?' class="on"':'')+'>'+i+'</button>';
  $('pg').innerHTML=h+'<button data-p="'+(page+1)+'"'+(page>=pages?' disabled':'')+'>Next</button>';
  counts();selUi(slice)}
function selIds(){return Object.keys(sel).filter(function(k){return sel[k]&&byId(k)&&tabOf(byId(k).status)===tab})}
function selUi(slice){var n=selIds().length,rows=(slice||[]).filter(function(v){return v.status!=='Delivered'&&v.status!=='Out for delivery'});
  $('selc').textContent=n+' selected';$('mark').textContent=LBL[tab];$('mark').disabled=busy||!n||tab==='Delivered';
  $('all').checked=rows.length>0&&rows.every(function(v){return sel[v.id]});$('all').indeterminate=!$('all').checked&&rows.some(function(v){return sel[v.id]})}
function say(msg,bad){var al=$('al');al.hidden=false;al.className='alert'+(bad?' err':'');al.textContent=msg;clearTimeout(al._t);al._t=setTimeout(function(){al.hidden=true},bad?9000:4000)}

/* ---------- marking ---------- */
function nextAgent(){var all=Object.keys(agents).map(function(k){return agents[k]}),on=all.filter(function(a){return String(a.status||'').toLowerCase()==='active'});on=on.length?on:all;return on.length?on[rr++%on.length]:null}
function save(v,patch){
  var body=Object.assign({},v.raw,patch);
  return API.update('shipments',v.id,body).catch(function(e){
    if(/\(400\)/.test(errText(e))&&'outForDeliveryAt' in patch){var p2=Object.assign({},patch);delete p2.outForDeliveryAt;body=Object.assign({},v.raw,p2);return API.update('shipments',v.id,body)}   /* schema has no outForDeliveryAt */
    throw e}).then(function(saved){var i=ships.indexOf(v);ships[i]=view(Object.assign({},body,saved||{}));return ships[i]})}
function mark(ids){
  var todo=ids.map(byId).filter(function(v){return v&&(v.status==='Ready to ship'||v.status==='In transit')});
  if(!todo.length||busy)return;busy=true;selUi();
  var from=todo[0].status,ok=0,fail=0,why='';
  Promise.all(todo.map(function(v){
    var t=new Date().toISOString(),p;
    if(v.status==='Ready to ship'){p={shipmentStatus:'In transit',shippedAt:t};if(!v.raw.deliveryAgentId){var a=nextAgent();if(a)p.deliveryAgentId=String(a.id)}}
    else{p={shipmentStatus:'Out for delivery',outForDeliveryAt:t};try{localStorage.setItem('ofd:'+v.id,t)}catch(e){}}
    return save(v,p).then(function(){ok++;delete sel[v.id]},function(e){fail++;why=why||errText(e)})
  })).then(function(){busy=false;
    if(ok&&from==='Ready to ship'&&!fail){}
    say((ok?ok+' shipment'+(ok>1?'s':'')+(from==='Ready to ship'?' moved to In transit.':' marked out for delivery.'):'')+(fail?(ok?' ':'')+fail+' could not be updated: '+why:''),!!fail);
    months();draw()})}

/* ---------- load ---------- */
function load(){
  loaded=false;tbd.innerHTML='<tr><td colspan="7" class="ldmsg">Loading shipments…</td></tr>';$('info').textContent='Loading…';
  Promise.all([API.list('shipments'),API.list('orders').catch(function(){return[]}),API.list('deliveryAgents').catch(function(){return[]})]).then(function(x){
    orders={};x[1].forEach(function(o){orders[String(o.id)]=o});agents={};x[2].forEach(function(a){agents[String(a.id)]=a});
    ships=x[0].map(view).sort(function(a,b){return(+b.id||0)-(+a.id||0)});loaded=true;months();draw()
  }).catch(function(e){tbd.innerHTML='<tr><td colspan="7" class="ldmsg">Could not load shipments: '+esc(errText(e))+' <button class="btn sm" data-retry>Retry</button></td></tr>';$('info').textContent='Load failed'})}

/* ---------- events ---------- */
[].slice.call(document.querySelectorAll('.itabs button')).forEach(function(b){b.addEventListener('click',function(){
  [].slice.call(document.querySelectorAll('.itabs button')).forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});
  b.classList.add('on');b.setAttribute('aria-selected','true');tab=b.dataset.t;page=1;sel={};draw()})});
['q','mo'].forEach(function(i){$(i).addEventListener('input',function(){page=1;draw()})});
tbd.addEventListener('change',function(e){var c=e.target.closest('.rowcb');if(!c)return;sel[c.dataset.id]=c.checked;draw()});
tbd.addEventListener('click',function(e){var g=e.target.closest('[data-go]');if(g){mark([g.dataset.go]);return}if(e.target.closest('[data-retry]'))load()});
$('all').addEventListener('change',function(){var on=$('all').checked;filtered().slice((page-1)*PAGE,page*PAGE).forEach(function(v){if(v.status!=='Delivered'&&v.status!=='Out for delivery')sel[v.id]=on});draw()});
$('mark').addEventListener('click',function(){mark(selIds())});
$('pg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;page=+b.dataset.p;draw()});
load();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
