/* ShopNow seller – mobile menu + table labels for the stacked card layout */
(function(){
  function menu(row,nav,cls,bp){
    if(!row||!nav)return;
    nav.id=nav.id||'site-nav';
    var b=document.createElement('button');
    b.type='button';b.className=cls;b.setAttribute('aria-controls',nav.id);
    b.innerHTML='<span aria-hidden="true">☰</span>';
    function set(o){nav.classList.toggle('open',o);b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu');b.firstChild.textContent=o?'✕':'☰'}
    set(false);row.appendChild(b);
    b.addEventListener('click',function(){set(!nav.classList.contains('open'))});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){set(false);b.focus()}});
    window.addEventListener('resize',function(){if(window.innerWidth>bp)set(false)});
  }
  menu(document.querySelector('.hd .hr'),document.querySelector('.hd nav'),'nav-toggle',1000);
  menu(document.querySelector('.sn-header__row'),document.querySelector('.sn-nav'),'sn-nav-toggle',991);
  function label(t){
    var th=[].slice.call(t.querySelectorAll('thead th')).map(function(h){return h.textContent.trim()});
    if(!th.length)return;
    [].slice.call(t.querySelectorAll('tbody tr')).forEach(function(r){
      [].slice.call(r.children).forEach(function(c,i){if(c.tagName==='TD'&&c.getAttribute('data-label')===null)c.setAttribute('data-label',th[i]||'')})});
  }
  [].slice.call(document.querySelectorAll('table')).forEach(function(t){
    label(t);
    var tb=t.querySelector('tbody');
    if(tb&&window.MutationObserver)new MutationObserver(function(){label(t)}).observe(tb,{childList:true});
  });
})();
