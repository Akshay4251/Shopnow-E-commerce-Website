(function(){
var $=function(s){return document.getElementById(s)};
var P={mug:['Speckled ceramic mug',899,'#d9c7b0'],cush:['Linen cushion cover',1299,'#c9d3d6'],bask:['Handwoven storage basket',1850,'#c8a77c'],cand:['Amber glass candle',649,'#b58a52'],plan:['Terracotta planter',1099,'#c9784f'],vase:['Textured ceramic vase',1499,'#d8d1c4'],board:['Acacia serving board',1199,'#a9774b'],thr:['Cotton throw blanket',2199,'#cfc6b8'],rug:['Woven jute rug',2499,'#bfa98a'],bowl:['Stoneware bowl set',1799,'#cdd3d8'],lamp:['Brass table lamp',3299,'#c9a45c'],pil:['Wool throw pillow',999,'#d6c3b6']};
function R(ord,p,sku,reason,date,st,cust,pay,ts,rej){return {ord:ord,p:p,sku:sku,reason:reason,date:date,st:st,cust:cust,pay:pay,ts:ts||[date+' 2026, 10:24 AM'],rej:rej||''}}
var D={2041:R('1735','mug','HI-CE-012','Arrived damaged','09 Oct','Requested','Ananya Mehta','UPI'),
2040:R('1215','cush','HI-LC-043','Wrong item received','08 Oct','Requested','Arjun Nair','Credit card'),
2039:R('1914','bask','HI-HB-031','Not as described','02 Oct','Requested','Priya Kapoor','UPI'),
2038:R('1012','cand','HI-GC-027','Arrived damaged','02 Oct','Requested','Rohan Patel','UPI'),
2037:R('1012','plan','HI-TP-018','Arrived damaged','01 Oct','Requested','Rohan Patel','UPI'),
2036:R('1011','vase','HI-CV-021','Not as described','01 Oct','Requested','Sneha Iyer','Credit card'),
2035:R('1010','board','HI-SB-009','Wrong item received','30 Sep','Requested','Meera Joshi','UPI'),
2034:R('1082','thr','HI-CT-054','Quality issue','30 Sep','Requested','Kabir Shah','Credit card'),
2033:R('0998','rug','HI-JR-011','Not as described','28 Sep','Approved','Isha Verma','UPI',['28 Sep 2026, 11:10 AM','28 Sep 2026, 03:45 PM']),
2032:R('0987','bowl','HI-SW-006','Arrived damaged','27 Sep','Rejected','Neha Gupta','Credit card',['27 Sep 2026, 09:30 AM','27 Sep 2026, 01:15 PM'],'Insufficient evidence provided'),
2031:R('0975','lamp','HI-BL-014','Wrong item received','26 Sep','In transit','Rahul Menon','UPI',['26 Sep 2026, 12:00 PM','26 Sep 2026, 04:20 PM','27 Sep 2026, 11:30 AM']),
2030:R('0961','pil','HI-WP-022','Quality issue','24 Sep','Refunded','Dev Patel','UPI',['24 Sep 2026, 10:05 AM','24 Sep 2026, 02:30 PM','25 Sep 2026, 10:00 AM','26 Sep 2026, 12:40 PM','27 Sep 2026, 09:15 AM'])};
var TXT={'Arrived damaged':'The item arrived damaged. I noticed the damage when I unpacked it and have not used it. Please arrange a return and refund.','Wrong item received':'I received a different item from the one I ordered. It has not been used and is still in its original packaging. Please arrange a return and refund.','Not as described':'The item does not match the description and photos on the listing. I would like to return it for a refund.','Quality issue':'The quality of the item is below what I expected. I would like to return it for a refund.'};
var CAP={'Arrived damaged':['Damaged area','Close-up','Delivery packaging'],'Wrong item received':['Item received','Packaging label','Order slip'],'Not as described':['Item front','Item detail','Listing screenshot'],'Quality issue':['Item front','Close-up','Packaging']};
var STEPS=['Requested','Approved','Picked up','Received','Refunded'],DONE={'Requested':1,'Approved':2,'In transit':3,'Refunded':5,'Rejected':1},CLS={'Requested':'Requested','Approved':'Approved','Rejected':'Rejected','In transit':'Intransit','Refunded':'Refunded'};
var id=new URLSearchParams(location.search).get('id')||'2041',o=D[id];
function fmt(n){return 'Rs '+Number(n).toLocaleString('en-IN')}
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function put(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function stamp(){var d=new Date();return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})+', '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
if(!o){$('pg2').hidden=true;$('nf').hidden=false;return}
var p=P[o.p],st=o.st,ts=o.ts.slice(),rej=o.rej,cust=o.cust;
if(ts[0].length<12)ts[0]=ts[0]+' 2026, 10:24 AM';
try{var sv=JSON.parse(get('ret:'+id)||'null');if(sv&&sv.st){st=sv.st;ts=sv.ts||ts;rej=sv.reason||rej}}catch(e){}
document.title='Return RET-'+id+' · ShopNow';$('bcid').textContent='RET-'+id;$('rid').textContent='RET-'+id;
$('sub').textContent='Requested on '+ts[0].replace(', ',' at ')+' · Order #ORD-'+o.ord+' · '+cust;
$('pth').style.background=p[2];$('pn').textContent=p[0];$('ps').textContent=o.sku;$('pq').textContent='Quantity: 1 · '+fmt(p[1]);
$('rc').textContent=o.reason;$('rt').textContent=TXT[o.reason];
$('ph').innerHTML=CAP[o.reason].map(function(c){return '<figure><div></div><figcaption>'+c+'</figcaption></figure>'}).join('');
$('up').textContent='Uploaded by '+cust+' on '+ts[0].split(',')[0];
$('ra').textContent=fmt(p[1]);$('rmd').textContent='Original payment method · '+o.pay;
function render(){
  var k=DONE[st],tag=$('st');tag.textContent=st;tag.className='tag '+CLS[st];
  var pend={2:'Pickup to be scheduled'};
  $('steps').innerHTML=STEPS.map(function(s,i){
    var on=i<k,rejd=st==='Rejected'&&i===1,lab=rejd?'Rejected':s,sub;
    if(rejd)sub=(rej||'You rejected this return')+(ts[1]?' · '+ts[1]:'');
    else if(on)sub=ts[i]||'';
    else sub=[ '','Awaiting your approval',st==='Approved'?pend[2]:'Pickup not scheduled','Awaiting returned item','Refund not initiated'][i];
    if(st==='Rejected'&&i>1)sub='Not applicable';
    return '<li class="'+(on?'done':'')+'"><i>'+(on?'✓':(rejd?'✕':i+1))+'</i><div><b>'+lab+'</b><span>'+sub+'</span></div></li>'}).join('');
  var rf=$('rf');rf.className='box refund'+(st==='Refunded'?' done':st==='Rejected'?' na':'');
  $('pd').textContent=st==='Refunded'?'Refunded':st==='Rejected'?'Not applicable':'Pending';
  $('rn').textContent=st==='Refunded'?'The refund was issued to the original payment method.':st==='Rejected'?'No refund will be initiated for this return.':'The refund will be initiated after the returned item is received and checked.';
  var open=st==='Requested';$('acts').hidden=!open;
  $('note').textContent=open?'':({'Approved':'Approved. Pickup will be scheduled with the customer.','In transit':'The returned item is on its way back to you.','Refunded':'This return is complete and the refund has been issued.','Rejected':'You rejected this return.'})[st]}
function save(){put('ret:'+id,JSON.stringify({st:st,ts:ts,reason:rej}))}
$('ok').addEventListener('click',function(){st='Approved';ts[1]=stamp();save();render()});
var ov=$('ov'),dl=$('dl'),dt=$('dt'),dv=$('dv'),mn=$('mn'),val='';
$('mp').textContent='Select a reason for rejecting return RET-'+id+'. The customer will be notified and no refund will be initiated.';
function toggle(o){dl.classList.toggle('open',o);dt.setAttribute('aria-expanded',o)}
function openRej(){val='';dv.textContent='Select a reason';dt.classList.remove('set');mn.classList.remove('err');mn.textContent='This reason will be shared with the customer.';toggle(false);ov.classList.add('open');document.body.classList.add('lock');dt.focus()}
function closeM(){ov.classList.remove('open');document.body.classList.remove('lock')}
$('no').addEventListener('click',openRej);
dt.addEventListener('click',function(){toggle(!dl.classList.contains('open'))});
dl.addEventListener('click',function(e){var li=e.target.closest('li');if(!li)return;val=li.textContent;dv.textContent=val;dt.classList.add('set');mn.classList.remove('err');mn.textContent='This reason will be shared with the customer.';toggle(false)});
$('x').addEventListener('click',closeM);$('cn').addEventListener('click',closeM);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('open'))closeM()});
ov.addEventListener('click',function(e){if(e.target===ov)closeM()});
$('rj').addEventListener('click',function(){
  if(!val){mn.textContent='Please select a reason for rejection.';mn.classList.add('err');return}
  st='Rejected';rej=val;ts[1]=stamp();save();closeM();render()});
render();
openRej();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
