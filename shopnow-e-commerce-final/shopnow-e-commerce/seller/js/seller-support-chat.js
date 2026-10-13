(function(){
var $=function(s){return document.querySelector(s)};
var msgs=$('#msgs'),f=$('#f'),t=$('#t'),tk=$('#tk'),items=[].slice.call(document.querySelectorAll('.ci'));
var first=msgs.innerHTML;
var T=[null,
 [['a','Hi Riya, we are checking the September payout with our finance team.','Yesterday, 4:10 PM'],['u','Thanks, when can I expect it?','Yesterday, 4:15 PM'],['a','You should see it within 2 working days.','Yesterday, 4:18 PM']],
 [['u','My new product images are not showing on the listing.','28 Sep, 1:50 PM'],['a','This is fixed now. Please refresh the listing page.','28 Sep, 2:05 PM']],
 [['u','I need to change my return address.','25 Sep, 11:10 AM'],['a','Done. Your return address has been updated.','25 Sep, 11:30 AM']],
 [['u','The shipping fee does not match the rate card.','21 Sep, 8:55 AM'],['a','We corrected the fee and adjusted your next payout.','21 Sep, 9:12 AM']],
 [['u','How do I upload inventory in bulk?','17 Sep, 3:30 PM'],['a','Use Inventory > Bulk upload with our CSV template.','17 Sep, 3:44 PM']]];
var tags=['#SN-TK-2481','#SN-TK-2468','#SN-TK-2429','#SN-TK-2397','#SN-TK-2364','#SN-TK-2330'];
function bubble(w,txt,time){var d=document.createElement('div');d.className='m '+w;var p=document.createElement('p');p.textContent=txt;var s=document.createElement('small');s.textContent=time;d.appendChild(p);d.appendChild(s);msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight}
function now(){return new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}
function pick(i){items.forEach(function(x){x.classList.remove('on')});items[i].classList.add('on');tk.textContent=tags[i];
  if(i===0)msgs.innerHTML=first;else{msgs.innerHTML='<div class="day"><span>'+items[i].querySelector('small').textContent.split(',')[0]+'</span></div>';T[i].forEach(function(m){bubble(m[0],m[1],m[2])})}
  msgs.scrollTop=msgs.scrollHeight}
items.forEach(function(x,i){x.addEventListener('click',function(){pick(i)});x.addEventListener('keydown',function(e){if(e.key==='Enter')pick(i)})});
f.addEventListener('submit',function(e){e.preventDefault();var v=t.value.trim();if(!v)return;bubble('u',v,now());t.value='';
  setTimeout(function(){bubble('a','Thanks, we have noted this and will reply shortly.',now())},900)});
msgs.scrollTop=msgs.scrollHeight;
})();
