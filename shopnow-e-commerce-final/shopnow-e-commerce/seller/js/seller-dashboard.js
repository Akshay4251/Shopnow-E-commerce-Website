(function(){
var $=function(s){return document.getElementById(s)};
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
var stats=[['₹1,24,500','Total sales'],['28','New orders'],['6','Low stock items'],['3','Pending returns']];
var orders=[['1024','Ananya Mehta','Mumbai','Speckled ceramic mug +1 more','Rs 2,977','Packed'],['1023','Arjun Nair','Bengaluru','Linen cushion cover','Rs 1,299','New'],['1022','Priya Kapoor','New Delhi','Handwoven storage basket','Rs 1,850','New'],['1021','Rohan Patel','Ahmedabad','Amber glass candle (x2)','Rs 1,298','Processing'],['1020','Sneha Iyer','Chennai','Terracotta planter','Rs 1,099','Shipped']];
var low=[['Speckled ceramic mug','HI-CE-012','Only 4 left'],['Linen cushion cover','HI-LC-043','Only 5 left'],['Amber glass candle','HI-GC-027','Only 2 left'],['Terracotta planter','HI-TP-018','Only 3 left']];
var rev=[['Ananya Mehta','“Beautiful mug, my new morning favourite!”','Speckled ceramic mug',5],['Priya Kapoor','“Lovely quality and so thoughtfully packed.”','Handwoven storage basket',5],['Sneha Iyer','“Looks even better in person. Love it!”','Terracotta planter',5]];
var ql=[['🛍','Products','Manage your catalogue','seller-products.html'],['📦','Inventory','Keep stock levels in check','seller-inventory.html'],['🧾','Orders','Review and fulfil orders','seller-orders.html'],['🚚','Shipping','Track and manage shipments','seller-shipping.html'],['⭐','Reviews','Read customer feedback','seller-reviews.html'],['↺','Returns','Handle return requests','seller-return-orders.html'],['📊','Reports','Understand your growth','seller-reports.html'],['👤','Profile','Update store details','seller-profile.html'],['🔔','Notifications','Stay on top of updates','seller-notifications.html'],['💬','Support','Get help from our team','seller-support.html']];
$('stats').innerHTML=stats.map(function(s){return '<div class="stat"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>'}).join('');
orders.forEach(function(o){try{var v=localStorage.getItem('ordst:'+o[0]);if(v)o[5]=v}catch(e){}});
$('ord').innerHTML=orders.map(function(o){return '<tr><td class="id">#ORD-'+o[0]+'</td><td class="cu"><b>'+esc(o[1])+'</b><small>'+esc(o[2])+'</small></td><td>'+esc(o[3])+'</td><td>'+o[4]+'</td><td><span class="os '+o[5]+'">'+o[5]+'</span></td><td><a class="vl" href="seller-orders-details.html?id='+o[0]+'">View</a></td></tr>'}).join('');
$('low').innerHTML=low.map(function(l){return '<li><div>'+esc(l[0])+'<small>'+l[1]+'</small></div><span class="left">'+l[2]+'</span></li>'}).join('');
$('rev').innerHTML=rev.map(function(r){return '<li class="rv"><span class="av2">'+r[0].charAt(0)+'</span><div><b>'+esc(r[0])+'</b><br>'+esc(r[1])+'<small>'+esc(r[2])+'</small></div><span class="stars" aria-label="'+r[3]+' out of 5">'+'★'.repeat(r[3])+'</span></li>'}).join('');
$('ql').innerHTML=ql.map(function(q){return '<a class="qc" href="'+q[3]+'"><i>'+q[0]+'</i><b>'+q[1]+'</b><span>'+q[2]+'</span></a>'}).join('');
})();
