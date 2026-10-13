(function(){
var $=function(s){return document.querySelector(s)},rows=[].slice.call(document.querySelectorAll('tbody tr')),tab='Requested',tabs=[].slice.call(document.querySelectorAll('.tabs button')),totals={};
tabs.forEach(function(b){totals[b.dataset.t]=+b.querySelector('em').textContent});
var CLS={'Requested':'Requested','Approved':'Approved','Rejected':'Rejected','In transit':'Intransit','Refunded':'Refunded'};
function counts(){tabs.forEach(function(b){b.querySelector('em').textContent=totals[b.dataset.t]})}
rows.forEach(function(r){try{var id=r.querySelector('.id').textContent.replace('RET-',''),s=JSON.parse(localStorage.getItem('ret:'+id)||'null');
  if(s&&s.st&&s.st!==r.dataset.status){totals[r.dataset.status]--;totals[s.st]=(totals[s.st]||0)+1;r.dataset.status=s.st;
    var t=r.children[5].querySelector('.tag');t.textContent=s.st;t.className='tag '+CLS[s.st];
    var rf=s.st==='Rejected'?'Rejected':'Pending';r.dataset.refund=rf;var u=r.children[6].querySelector('.tag');u.textContent=rf;u.className='tag '+rf}}catch(e){}});
function run(){
  var q=$('#q').value.toLowerCase().trim(),d=$('#date').value,r=$('#rs').value,n=0;
  rows.forEach(function(x){
    var ok=x.dataset.status===tab&&(!q||x.textContent.toLowerCase().indexOf(q)>-1)&&(r==='All'||x.dataset.refund===r)&&(d==='All'||x.dataset.range===d||(d==='30'&&x.dataset.range==='7'));
    x.style.display=ok?'':'none';if(ok)n++;
  });
  counts();
  $('#empty').classList.toggle('show',!n);
  $('#info').textContent=n?'Showing 1–'+n+' of '+Math.max(totals[tab],n)+' '+tab.toLowerCase()+' returns':'No '+tab.toLowerCase()+' returns';
}
tabs.forEach(function(b){b.addEventListener('click',function(){tabs.forEach(function(x){x.classList.remove('on')});b.classList.add('on');tab=b.dataset.t;run()})});
['#q','#date','#rs'].forEach(function(s){$(s).addEventListener('input',run)});
document.querySelectorAll('.pg').forEach(function(p){p.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||isNaN(+b.textContent))return;p.querySelectorAll('button').forEach(function(x){x.classList.remove('on')});b.classList.add('on')})});
run();
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
