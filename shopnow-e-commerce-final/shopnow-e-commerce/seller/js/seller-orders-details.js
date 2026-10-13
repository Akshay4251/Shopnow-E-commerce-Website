(function(){
var $=function(s){return document.getElementById(s)};
var C={AM:['Ananya Mehta','Mumbai, Maharashtra','+91 98765 43210','ananya.mehta@gmail.com','Flat 402, Sea Breeze Apartments,<br>Linking Road, Bandra West,<br>Mumbai, Maharashtra 400050,<br>India'],
AN:['Arjun Nair','Bengaluru, Karnataka','+91 98450 11223','arjun.nair@gmail.com','12, 5th Cross, Indiranagar,<br>Bengaluru, Karnataka 560038,<br>India'],
PK:['Priya Kapoor','New Delhi, Delhi','+91 98110 22334','priya.kapoor@gmail.com','B-27, Greater Kailash II,<br>New Delhi, Delhi 110048,<br>India'],
RP:['Rohan Patel','Ahmedabad, Gujarat','+91 98250 33445','rohan.patel@gmail.com','A-14, Satellite Road,<br>Ahmedabad, Gujarat 380015,<br>India'],
SI:['Sneha Iyer','Chennai, Tamil Nadu','+91 98400 44556','sneha.iyer@gmail.com','7, Lake View Road, Adyar,<br>Chennai, Tamil Nadu 600020,<br>India']};
var MUG=['Speckled ceramic mug','RH-CM-012',899],CUSH=['Linen cushion cover','RH-LC-008',1299],BASK=['Handwoven storage basket','RH-SB-015',1850],CAND=['Amber glass candle','RH-AC-021',649],PLAN=['Terracotta planter','RH-TP-008',1099],VASE=['Textured ceramic vase','RH-CV-024',1499],BOARD=['Acacia serving board','RH-AB-017',1199],THROW=['Cotton throw blanket','RH-CT-030',2199];
var D={
1024:{c:'AM',st:'Packed',items:[[MUG,2],[CUSH,1]],ship:80,disc:200,pm:'UPI',paid:1,dt:'02 Oct 2026 at 10:24 AM',pd:'02 Oct 2026',ts:['02 Oct, 10:24 AM','02 Oct, 10:40 AM','03 Oct, 09:15 AM']},
1023:{c:'AN',st:'New',items:[[CUSH,1]],ship:0,disc:0,pm:'Credit card',paid:1,dt:'02 Oct 2026 at 09:50 AM',pd:'02 Oct 2026',ts:['02 Oct, 09:50 AM']},
1022:{c:'PK',st:'New',items:[[BASK,1]],ship:0,disc:0,pm:'Cash on delivery',paid:0,dt:'02 Oct 2026 at 08:30 AM',ts:['02 Oct, 08:30 AM']},
1021:{c:'RP',st:'Processing',items:[[CAND,2]],ship:0,disc:0,pm:'UPI',paid:1,dt:'01 Oct 2026 at 04:12 PM',pd:'01 Oct 2026',ts:['01 Oct, 04:12 PM','01 Oct, 04:30 PM']},
1020:{c:'SI',st:'Shipped',items:[[PLAN,1]],ship:0,disc:0,pm:'Credit card',paid:1,dt:'01 Oct 2026 at 11:05 AM',pd:'01 Oct 2026',ts:['01 Oct, 11:05 AM','01 Oct, 11:20 AM','01 Oct, 03:00 PM','02 Oct, 10:00 AM']},
1019:{c:'AM',st:'Delivered',items:[[VASE,1]],ship:0,disc:0,pm:'UPI',paid:1,dt:'28 Sep 2026 at 02:15 PM',pd:'28 Sep 2026',ts:['28 Sep, 02:15 PM','28 Sep, 02:30 PM','28 Sep, 05:00 PM','29 Sep, 10:00 AM','01 Oct, 12:30 PM']},
1018:{c:'AN',st:'Delivered',items:[[BOARD,1]],ship:0,disc:0,pm:'Credit card',paid:1,dt:'28 Sep 2026 at 11:40 AM',pd:'28 Sep 2026',ts:['28 Sep, 11:40 AM','28 Sep, 11:55 AM','28 Sep, 03:30 PM','29 Sep, 09:30 AM','30 Sep, 06:20 PM']},
1017:{c:'PK',st:'Cancelled',items:[[THROW,1]],ship:0,disc:0,pm:'Cash on delivery',paid:0,dt:'28 Sep 2026 at 09:10 AM',ts:['28 Sep, 09:10 AM']}};
var STEPS=['Placed','Confirmed','Packed','Shipped','Delivered'],IDX={New:0,Processing:1,Packed:2,Shipped:3,Delivered:4,Cancelled:-1},FLOW=['Processing','Packed','Shipped'];
var WAIT=['','Awaiting confirmation','Awaiting packing','Awaiting dispatch','Not delivered yet'];
var id=new URLSearchParams(location.search).get('id')||'1024',o=D[id];
function fmt(n){return 'Rs '+Number(n).toLocaleString('en-IN')}
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function put(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function stamp(){var d=new Date();return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'})+', '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}
if(!o){$('pg').hidden=true;$('nf').hidden=false;return}
var cu=C[o.c],ts=o.ts.slice(),st=o.st;
var sv=get('ordst:'+id);if(sv&&IDX[sv]!==undefined){st=sv;try{ts=JSON.parse(get('ordts:'+id))||ts}catch(e){}}
document.title='Order #ORD-'+id+' · ShopNow';$('bcid').textContent='#ORD-'+id;$('oid').textContent='#ORD-'+id;
var qty=0,sub=0;o.items.forEach(function(x){qty+=x[1];sub+=x[0][2]*x[1]});
var tot=sub+o.ship-o.disc;
$('sub').textContent='Placed on '+o.dt+' · '+qty+' item'+(qty>1?'s':'');
$('items').innerHTML=o.items.map(function(x){return '<tr><td><div class="ip"><span class="pth"></span><div><b>'+x[0][0]+'</b><small>'+x[0][1]+'</small></div></div></td><td>'+x[1]+'</td><td><b>'+fmt(x[0][2])+'</b></td></tr>'}).join('');
$('sum').innerHTML='<b class="sh">Order summary</b><div><span>Subtotal</span><span>'+fmt(sub)+'</span></div><div><span>Shipping</span><span>'+(o.ship?fmt(o.ship):'Free')+'</span></div>'+(o.disc?'<div><span>Discount</span><span>− '+fmt(o.disc)+'</span></div>':'')+'<div class="tot"><span>Total</span><b>'+fmt(tot)+'</b></div>';
$('ci').textContent=cu[0].split(' ').map(function(w){return w[0]}).join('');$('cn').textContent=cu[0];$('cl').textContent=cu[1];
$('cp').textContent='📞 '+cu[2];$('ce').textContent='✉ '+cu[3];$('an').textContent=cu[0];$('ad').innerHTML=cu[4];
$('pm').textContent=o.pm;$('ps').textContent=o.paid?'Paid':'Pending';$('ps').className='pl '+(o.paid?'pay-Paid':'pay-Pending');
$('pn').textContent=o.paid?fmt(tot)+' paid on '+o.pd:'Payment pending · '+fmt(tot)+' due '+(st==='Cancelled'?'(order cancelled)':'on delivery');
function render(){
  var k=IDX[st],tag=$('tag');tag.textContent=st;tag.className='pl os '+st;
  $('prog').hidden=k<0;
  $('prog').innerHTML=STEPS.map(function(s,i){var on=i<=k;return '<li class="'+(on?'done':'')+'"><i>'+(on?'✓':i+1)+'</i><b>'+s+'</b><span>'+(on?(ts[i]||''):WAIT[i])+'</span></li>'}).join('');
  var opts=FLOW.filter(function(s){return IDX[s]>k}),sel=$('sel');
  sel.innerHTML=opts.map(function(s){return '<option>'+s+'</option>'}).join('');
  var done=!opts.length;sel.disabled=$('upd').disabled=done;
  $('hint').textContent=st==='Cancelled'?'This order was cancelled. Its status cannot be changed.':st==='Delivered'?'This order is delivered. Its status cannot be changed.':st==='Shipped'?'Delivery status is updated once the courier confirms delivery.':'Available statuses: '+opts.join(', ')}
$('upd').addEventListener('click',function(){
  var v=$('sel').value;if(!v)return;var k=IDX[v];
  for(var i=0;i<=k;i++)if(!ts[i])ts[i]=stamp();
  st=v;put('ordst:'+id,st);put('ordts:'+id,JSON.stringify(ts));render();
  var al=$('al');al.hidden=false;al.textContent='Order status updated to '+v+'.';
  clearTimeout(al._t);al._t=setTimeout(function(){al.hidden=true},3000)});
$('prt').addEventListener('click',function(){window.print()});
render();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
