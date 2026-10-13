(function(){
var $=function(s){return document.getElementById(s)};
var T=[['2481','Order marked delivered but buyer has not received it','Orders','Open','Today, 10:42 AM'],
['2468','Payout for September sales is still pending','Payments','In progress','Yesterday, 4:18 PM'],
['2429','Product listing images are not updating','Products','Resolved','28 Sep, 2:05 PM'],
['2397','Unable to change return address','Account','Resolved','25 Sep, 11:30 AM'],
['2364','Shipping fee differs from rate card','Shipping','In progress','21 Sep, 9:12 AM'],
['2330','Need help with bulk inventory upload','Products','Resolved','17 Sep, 3:44 PM'],
['2312','Buyer reported wrong item received','Orders','Resolved','14 Sep, 1:20 PM'],
['2298','GST invoice not generated','Payments','Resolved','12 Sep, 10:05 AM'],
['2271','Unable to verify bank account','Account','Resolved','09 Sep, 4:40 PM'],
['2250','Product category change request','Products','Resolved','06 Sep, 11:15 AM'],
['2233','Courier pickup missed twice','Shipping','Resolved','03 Sep, 5:30 PM'],
['2205','Refund adjusted in payout','Payments','Resolved','30 Aug, 9:50 AM']];
var PER=8,tab='All',page=1;
['All','Open','In progress','Resolved'].forEach(function(s,i){$('c'+i).textContent=T.filter(function(t){return s==='All'||t[3]===s}).length});
function cls(s){return s==='In progress'?'In':s}
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function list(){var q=$('q').value.toLowerCase().trim(),c=$('cat').value;
  return T.filter(function(t){return(tab==='All'||t[3]===tab)&&(c==='All'||t[2]===c)&&(!q||('#sn-tk-'+t[0]+' '+t[1]).toLowerCase().indexOf(q)>-1)})}
function render(){
  var l=list(),pages=Math.max(1,Math.ceil(l.length/PER));if(page>pages)page=pages;
  var s=(page-1)*PER,rows=l.slice(s,s+PER);
  $('tbd').innerHTML=rows.map(function(t){return '<tr><td class="id">#SN-TK-'+t[0]+'</td><td>'+esc(t[1])+'</td><td>'+t[2]+'</td><td><span class="st '+cls(t[3])+'">'+t[3]+'</span></td><td class="lu">'+t[4]+'</td><td><a class="vl" href="seller-support-chat.html">View</a></td></tr>'}).join('');
  $('empty').classList.toggle('show',!l.length);
  $('info').textContent=l.length?'Showing '+(s+1)+'–'+(s+rows.length)+' of '+l.length+' tickets':'No tickets';
  var h='<button id="pv"'+(page===1?' disabled':'')+'>Prev</button>';
  for(var i=1;i<=pages;i++)h+='<button data-p="'+i+'" class="'+(i===page?'on':'')+'">'+i+'</button>';
  h+='<button id="nx"'+(page===pages?' disabled':'')+'>Next</button>';$('pg').innerHTML=h;
}
$('pg').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;if(b.id==='pv')page--;else if(b.id==='nx')page++;else page=+b.dataset.p;render()});
[].slice.call(document.querySelectorAll('.tabs button')).forEach(function(b){b.addEventListener('click',function(){[].slice.call(document.querySelectorAll('.tabs button')).forEach(function(x){x.classList.remove('on')});b.classList.add('on');tab=b.dataset.t;page=1;render()})});
$('q').addEventListener('input',function(){page=1;render()});$('cat').addEventListener('change',function(){page=1;render()});
$('rs').addEventListener('click',function(){$('q').value='';$('cat').value='All';tab='All';page=1;[].slice.call(document.querySelectorAll('.tabs button')).forEach(function(x,i){x.classList.toggle('on',i===0)});render()});
render();
})();
