(function(){
var $=function(s){return document.querySelector(s)},all=function(s){return [].slice.call(document.querySelectorAll(s))};
var tab='All',nl=$('#nl');
var extra=[['Orders','▤','Order #ORD-1021 was shipped','Your shipment is on its way with the carrier.','5 days ago'],['Stock','⬡','Restock reminder','Terracotta planter is running low on inventory.','6 days ago'],['System','⚙','Profile updated','Your store profile was updated successfully.','1 week ago']];
function run(){var n=0;all('.nt').forEach(function(x){var ok=!x.dataset.more&&(tab==='All'||x.dataset.cat===tab)||(x.dataset.more==='shown'&&(tab==='All'||x.dataset.cat===tab));x.hidden=!ok;if(ok)n++});$('#empty').style.display=n?'none':'block'}
all('.nts button').forEach(function(b){b.addEventListener('click',function(){all('.nts button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');tab=b.dataset.t;run()})});
nl.addEventListener('click',function(e){var b=e.target.closest('.mr');if(b)b.closest('.nt').classList.remove('unread')});
$('#all').addEventListener('click',function(){all('.nt').forEach(function(x){x.classList.remove('unread')})});
$('#more').addEventListener('click',function(){extra.forEach(function(n){var li=document.createElement('li');li.className='nt';li.dataset.cat=n[0];li.dataset.more='shown';li.innerHTML='<span class="dot"></span><span class="ni">'+n[1]+'</span><div class="nb"><b>'+n[2]+'</b><p>'+n[3]+'</p><small>'+n[4]+'</small></div><button class="mr">Mark as read</button>';nl.appendChild(li)});this.parentNode.style.display='none';run()});
run();
})();
