(function(){
/* Tracking: one shipment from the MockAPI "shipments" resource. Open it as
   seller-shipping-tracking.html?shipment=<shipment id>   (or ?id=<order id>).
   Order details come from "orders", the agent from "deliveryAgents". */
var $=function(s){return document.getElementById(s)};
var STEPS=['Picked up','In transit','Out for delivery','Delivered'],DONE={'Ready to ship':0,'In transit':2,'Out for delivery':3,'Delivered':4},CLS={'Ready to ship':'ds-Ready','In transit':'ds-In','Out for delivery':'ds-Out','Delivered':'ds-Delivered'};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fmt(n){return 'Rs '+Number(n).toLocaleString('en-IN')}
function dt(s){var d=new Date(s);return(!s||isNaN(d))?'':d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'})+', '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}
function dd(s){var d=new Date(s);return(!s||isNaN(d))?'':d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
function norm(s){var t=String(s||'').trim().toLowerCase(),k=Object.keys(DONE);for(var i=0;i<k.length;i++)if(k[i].toLowerCase()===t)return k[i];return 'Ready to ship'}
function note(msg,link){$('pg2').hidden=true;$('nf').hidden=false;$('nf').innerHTML=esc(msg)+(link===false?'':' <a href="seller-shipping.html">Back to shipping</a>')}

var q=new URLSearchParams(location.search),sid=q.get('shipment'),oid=q.get('id');
if(!sid&&!oid){note('No shipment selected.');return}
note('Loading shipment…',false);
(sid?API.get('shipments',sid):API.list('shipments',{orderId:oid}).then(function(l){return l.filter(function(x){return String(x.orderId)===String(oid)})[0]||null})).then(function(r){
  if(!r){note('Shipment not found.');return}
  return Promise.all([API.get('orders',r.orderId).catch(function(){return null}),r.deliveryAgentId?API.get('deliveryAgents',r.deliveryAgentId).catch(function(){return null}):null]).then(function(x){render(r,x[0],x[1])})
}).catch(function(e){note('Could not load this shipment: '+((e&&e.message)||e))});

function render(r,order,agent){
  var o=API.orderInfo(order),st=norm(r.shipmentStatus),k=DONE[st],label=o.number?o.number.replace(/^#/,''):'ORD-'+r.orderId;
  var ofd=r.outForDeliveryAt||'';if(!ofd){try{ofd=localStorage.getItem('ofd:'+r.id)||''}catch(e){}}
  var ts=[r.shippedAt,r.shippedAt,ofd||(st==='Delivered'?r.deliveredAt:''),r.deliveredAt];
  $('pg2').hidden=false;$('nf').hidden=true;
  document.title='Tracking #'+label+' · ShopNow';$('bcid').textContent='Tracking #'+label;
  $('tag').textContent=$('st2').textContent=st;$('tag').className='pl '+CLS[st];$('st2').className='pl '+CLS[st];
  var qty=0,sub=0;o.items.forEach(function(i){qty+=i.qty;sub+=i.price*i.qty});
  $('sub').textContent=(o.date?'Placed on '+dd(o.date)+' · ':'')+(qty?qty+' item'+(qty>1?'s':''):'Order #'+label);
  $('pk').textContent='Order #'+label+(qty?' · '+qty+' item'+(qty>1?'s':''):'')+' · 1 package';
  $('items').innerHTML=o.items.length?o.items.map(function(i){return'<tr><td><div class="ip"><span class="pth"></span><div><b>'+esc(i.name)+'</b><small>'+esc(i.sku)+'</small></div></div></td><td>'+i.qty+'</td><td><b>'+(i.price?fmt(i.price):'—')+'</b></td></tr>'}).join(''):'<tr><td colspan="3" style="padding:18px;color:var(--m)">Item details are not available for this order yet.</td></tr>';
  var total=o.total||sub;$('sum').innerHTML=total?'<b class="sh">Order summary</b><div class="tot"><span>Total</span><b>'+fmt(total)+'</b></div>':'';
  $('wt').textContent=qty?(qty*0.6).toFixed(1)+' kg':'—';$('fr').textContent='Handle with care';
  $('an').textContent=o.name||'Delivery address';$('ad').textContent=o.address||(o.city||'Address not available');
  var nm=agent?API.agentName(agent,r.deliveryAgentId):'';
  if(agent){$('ai').textContent=nm.split(' ').map(function(x){return x[0]}).join('').slice(0,2).toUpperCase();$('gn').textContent=nm;$('ga').textContent='Delivery partner'+(agent.status?' · '+agent.status:'');
    $('gp').textContent=agent.phone?'📞 '+agent.phone:'';$('gv').textContent=agent.email?'✉️ '+agent.email:'';
    if(agent.phone){$('gc').href='tel:'+String(agent.phone).replace(/[^\d+]/g,'')}else{$('gc').setAttribute('aria-disabled','true');$('gc').removeAttribute('href')}}
  else{$('ai').textContent='–';$('gn').textContent=r.deliveryAgentId?'Agent #'+r.deliveryAgentId:'Not assigned yet';$('ga').textContent=r.deliveryAgentId?'Agent details are not available':'An agent is assigned once the package is marked as in transit';$('gp').textContent='';$('gv').textContent='';$('gc').setAttribute('aria-disabled','true');$('gc').removeAttribute('href')}
  $('tid').textContent=r.trackingNumber||'—';$('cr').textContent=r.courierName||'—';$('eta').textContent=dd(r.estimatedDelivery)||'—';
  var eta=dd(r.estimatedDelivery);
  $('tl').innerHTML=STEPS.map(function(s,i){var on=i<k;return'<li class="'+(on?'done':'')+'"><i>'+(on?'✓':i+1)+'</i><div><b>'+s+'</b><span>'+(on?esc(dt(ts[i])):(i===0?'Awaiting pickup':'Estimated · '+esc(eta||'soon')))+'</span></div></li>'}).join('');
  $('lu').textContent=k?(dt(ts[k-1])?'Last updated '+dt(ts[k-1]):''):'Not picked up yet';
  $('mt1').textContent=(o.city||'Destination').toUpperCase();$('mt2').textContent='City centre';$('mcap').textContent=(o.city?o.city+' · ':'')+(r.courierName||'Courier')+' · Route preview';
  var rt=$('rt');if(rt)rt.classList.add('go');
}
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
