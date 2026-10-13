(function(){
var $=function(s){return document.getElementById(s)};
var months=['Apr','May','Jun','Jul','Aug','Sep'];
var data={'Kitchen & dining':[24,28,33,30,34,38],'Home furnishings':[20,22,26,24,28,31],'Home decor':[15,16,20,19,22,24]};
var cls=['c1','c2','c3'],cats=Object.keys(data),MAX=40;
$('yx').innerHTML=[0,10,20,30,40].map(function(v){return '<span>'+(v?'Rs '+v+'K':'0')+'</span>'}).join('');
function drawChart(from,to){
  var idx=months.map(function(m,i){return i}).filter(function(i){
    var ms=new Date(2026,3+i,1),me=new Date(2026,3+i+1,0);
    return !from||(me>=from&&ms<=to)});
  var pl=$('plot');
  pl.style.gridTemplateColumns='repeat('+Math.max(idx.length,1)+',1fr)';
  pl.innerHTML=idx.length?idx.map(function(i){var m=months[i];
    return '<div class="grp"><div class="bars2">'+cats.map(function(c,k){var v=data[c][i];return '<i class="bar '+cls[k]+'" style="height:'+(v/MAX*100)+'%" title="'+c+' · '+m+' · Rs '+v+'K"></i>'}).join('')+'</div><label>'+m+'</label></div>'}).join(''):'<p style="grid-column:1/-1;align-self:center;text-align:center;color:var(--m);font-size:13px">No monthly data in the selected dates.</p>';
  var st=document.querySelector('.rv2 .mt2');
  if(st)st.textContent='Net-life revenue by product category · '+(idx.length?(idx.length>1?months[idx[0]]+'–'+months[idx[idx.length-1]]:months[idx[0]])+' 2026':'no months selected');
}
drawChart();
document.addEventListener('sn:range',function(e){drawChart(e.detail.from,e.detail.to)});
/* export menu */
var m=$('exm'),b=$('exb');
function toggle(o){m.classList.toggle('open',o);b.setAttribute('aria-expanded',o)}
b.addEventListener('click',function(e){e.stopPropagation();toggle(!m.classList.contains('open'))});
document.addEventListener('click',function(){toggle(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
function csv(){
  var rows=[['Month'].concat(cats)];months.forEach(function(mo,i){rows.push([mo].concat(cats.map(function(c){return data[c][i]*1000})))});
  rows.push([]);rows.push(['Rank','Product','SKU','Units sold','Revenue (Rs)']);
  [].slice.call(document.querySelectorAll('.tp tbody tr')).forEach(function(r){var t=r.children;rows.push([t[0].textContent,t[1].querySelector('b').textContent,t[1].querySelector('small').textContent,t[2].textContent,t[3].textContent.replace('Rs ','').replace(/,/g,'')])});
  var text=rows.map(function(r){return r.map(function(x){return '"'+String(x).replace(/"/g,'""')+'"'}).join(',')}).join('\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));a.download='sales-report-apr-sep-2026.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(a.href)}
m.addEventListener('click',function(e){var li=e.target.closest('li');if(!li)return;if(li.dataset.f==='csv')csv();else window.print();toggle(false)});
m.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.dataset.f)e.target.click()});
})();

/* keep the active nav tab in view when the tab bar scrolls */
(function(){var n=document.querySelector('nav'),a=n&&n.querySelector('a.on');function s(){if(a&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}s();window.addEventListener('resize',s)})();
