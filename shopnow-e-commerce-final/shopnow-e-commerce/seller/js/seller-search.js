/* ShopNow seller – header search (all pages)
   - type a product name / SKU  -> matching products (price + stock status)
   - type an order ID (1024, #ORD-1024) or customer -> matching orders (+ order status)
   Products / orders come from the MockAPI (common/js/api.js, loaded on demand);
   the demo orders & products below are the fallback when the API is offline. */
(function () {
  'use strict';

  var me = document.currentScript;
  var ROOT = me && me.src ? me.src.replace(/seller\/js\/[^\/?#]*([?#].*)?$/, '') : '../../';

  /* ---------- fallback demo data (same orders as seller-orders-details.html) ---------- */
  var ST_ORDERS = [
    [1024, 'Ananya Mehta', 'Mumbai', 'Packed', 2977, 3], [1023, 'Arjun Nair', 'Bengaluru', 'New', 1299, 1],
    [1022, 'Priya Kapoor', 'New Delhi', 'New', 1850, 1], [1021, 'Rohan Patel', 'Ahmedabad', 'Processing', 1298, 2],
    [1020, 'Sneha Iyer', 'Chennai', 'Shipped', 1099, 1], [1019, 'Ananya Mehta', 'Mumbai', 'Delivered', 1499, 1],
    [1018, 'Arjun Nair', 'Bengaluru', 'Delivered', 1199, 1], [1017, 'Priya Kapoor', 'New Delhi', 'Cancelled', 2199, 1]
  ];
  var ST_PRODUCTS = [
    ['Speckled ceramic mug', 'RH-CM-012', 899, 4], ['Linen cushion cover', 'RH-LC-008', 1299, 5],
    ['Handwoven storage basket', 'RH-SB-015', 1850, null], ['Amber glass candle', 'RH-AC-021', 649, 2],
    ['Terracotta planter', 'RH-TP-008', 1099, 3], ['Textured ceramic vase', 'RH-CV-024', 1499, null],
    ['Acacia serving board', 'RH-AB-017', 1199, null], ['Cotton throw blanket', 'RH-CT-030', 2199, null]
  ];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return 'Rs ' + Number(n || 0).toLocaleString('en-IN'); }
  function low(s) { return String(s == null ? '' : s).toLowerCase(); }
  function cap(s) { s = String(s || '').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function rx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function hl(text, terms) {
    text = String(text == null ? '' : text);
    if (!terms.length) return esc(text);
    var re = new RegExp('(' + terms.map(rx).join('|') + ')', 'ig');
    return esc(text.replace(re, '\u0001$1\u0002')).replace(/\u0001/g, '<mark>').replace(/\u0002/g, '</mark>');
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function pick(o) { for (var i = 1; i < arguments.length; i++) { var v = o[arguments[i]]; if (v !== undefined && v !== null && v !== '') return v; } return ''; }
  function loadScript(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }

  /* ---------- data ---------- */
  var DATA = { orders: [], products: [], ready: false }, loading = null;

  function staticOrders() {
    return ST_ORDERS.map(function (r) {
      var st = lsGet('ordst:' + r[0]) || r[3];
      return { num: String(r[0]), label: '#ORD-' + r[0], name: r[1], city: r[2], status: st, total: r[4], items: r[5], href: 'seller-orders-details.html?id=' + r[0] };
    });
  }
  function staticProducts() {
    return ST_PRODUCTS.map(function (p, i) { return { id: 's' + i, name: p[0], sku: p[1], price: p[2], stock: p[3], category: '', href: 'seller-products.html?q=' + encodeURIComponent(p[0]) }; });
  }
  function ensureApi() {
    var jobs = [];
    if (!window.API) jobs.push(loadScript(ROOT + 'common/js/api.js'));
    return Promise.all(jobs).then(function () { return window.ProductsData ? 0 : loadScript(ROOT + 'common/js/products-data.js'); });
  }
  function withTimeout(p, ms) { return Promise.race([p, new Promise(function (_, no) { setTimeout(function () { no(new Error('timeout')); }, ms); })]); }

  function load() {
    if (loading) return loading;
    var orders = staticOrders(), products = staticProducts();
    DATA.orders = orders; DATA.products = products; DATA.ready = true;           // usable straight away
    loading = withTimeout(ensureApi().then(function () {
      return Promise.all([
        window.API.list('products').catch(function () { return []; }),
        window.API.list('orders').catch(function () { return []; })
      ]);
    }), 8000).then(function (x) {
      var pr = x[0] || [], or = x[1] || [];
      if (pr.length && window.ProductsData) {
        window.ProductsData.setSample(pr[0]);
        DATA.products = pr.map(window.ProductsData.view).map(function (p) {
          return { id: p.id, name: p.name, sku: p.sku, price: p.price, stock: p.stock, category: p.category, href: 'seller-products-edit.html?id=' + encodeURIComponent(p.id) };
        });
      }
      var have = {}; orders.forEach(function (o) { have[o.num] = 1; });
      or.forEach(function (o) {
        var info = window.API.orderInfo(o), num = (String(info.number || '').replace(/\D/g, '')) || String(o.id);
        if (have[num]) return;
        have[num] = 1;
        DATA.orders.push({
          num: num, label: '#' + (info.number ? String(info.number).replace(/^#/, '') : 'ORD-' + o.id),
          name: info.name, city: info.city, status: cap(pick(o, 'status', 'orderStatus', 'state')) || 'Placed',
          total: info.total, items: info.items.length, href: 'seller-shipping-tracking.html?id=' + encodeURIComponent(o.id)
        });
      });
    }).catch(function () { /* offline: keep demo data */ });
    return loading;
  }

  /* ---------- searching ---------- */
  function search(q) {
    q = q.trim();
    var res = { orders: [], products: [], terms: [] };
    if (!q) return res;
    var m = q.match(/^#?\s*(?:ord[\s-]*)?(\d+)$/i), terms = low(q).replace(/^#/, '').split(/\s+/).filter(Boolean);
    res.terms = m ? [m[1]] : terms;
    if (m) {                                                           // order id (1024 / #ORD-1024)
      var d = m[1];
      res.orders = DATA.orders.filter(function (o) { return o.num.indexOf(d) > -1; }).sort(function (a, b) {
        return (b.num === d) - (a.num === d) || (b.num.indexOf(d) === 0) - (a.num.indexOf(d) === 0) || Number(b.num) - Number(a.num);
      });
    } else if (/^#?ord(er)?s?[\s-]*$/i.test(q)) {                      // "ord" -> latest orders
      res.orders = DATA.orders.slice().sort(function (a, b) { return Number(b.num) - Number(a.num); });
      res.terms = [];
    } else {                                                           // customer / city / status
      res.orders = DATA.orders.filter(function (o) {
        var t = low(o.name + ' ' + o.city + ' ' + o.status + ' ' + o.label);
        return terms.every(function (w) { return t.indexOf(w) > -1; });
      });
    }
    res.products = DATA.products.filter(function (p) {
      var t = low(p.name + ' ' + p.sku + ' ' + p.category);
      return res.terms.length && res.terms.every(function (w) { return t.indexOf(w) > -1; });
    }).sort(function (a, b) {
      var s = low(q); return (low(b.name).indexOf(s) === 0) - (low(a.name).indexOf(s) === 0);
    });
    /* a customer name like "ananya" should not drown products and vice-versa */
    res.orders = res.orders.slice(0, 5); res.products = res.products.slice(0, 6);
    return res;
  }

  function stockChip(p) {
    if (p.stock === null || p.stock === undefined || p.stock === '') return '';
    if (p.stock <= 0) return '<span class="ss-b ss-out">Out of stock</span>';
    if (p.stock <= 5) return '<span class="ss-b ss-low">Low stock · ' + p.stock + ' left</span>';
    return '<span class="ss-b ss-in">In stock · ' + p.stock + '</span>';
  }

  /* ---------- UI ---------- */
  function init(form) {
    var input = form.querySelector('input[type="search"]');
    if (!input || form.dataset.ss) return;
    form.dataset.ss = '1';
    var uid = 'ss' + Math.random().toString(36).slice(2, 7), dd = document.createElement('div');
    dd.className = 'ss-dd'; dd.id = uid; dd.setAttribute('role', 'listbox'); dd.hidden = true;
    form.appendChild(dd);
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', uid); input.setAttribute('aria-autocomplete', 'list');
    var act = -1, items = [], timer = null;

    function open(o) { dd.hidden = !o; input.setAttribute('aria-expanded', o ? 'true' : 'false'); if (!o) { act = -1; input.removeAttribute('aria-activedescendant'); } }
    function mark(i) {
      items.forEach(function (el, k) { el.classList.toggle('on', k === i); el.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      act = i;
      if (i > -1) { input.setAttribute('aria-activedescendant', items[i].id); items[i].scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
    }
    function helpHref(q) { return 'seller-help-search.html?q=' + encodeURIComponent(q); }

    function render() {
      var q = input.value.trim();
      if (!q) {
        dd.innerHTML = '<div class="ss-hint"><b>Search your shop</b><span>Product name or SKU &nbsp;·&nbsp; order ID like <i>#ORD-1024</i> &nbsp;·&nbsp; customer name</span></div>';
        items = []; open(true); return;
      }
      var r = search(q), h = '', n = 0;
      function id() { return uid + '-' + (n++); }
      if (r.orders.length) {
        h += '<div class="ss-h" role="presentation">Orders</div>';
        r.orders.forEach(function (o) {
          h += '<a class="ss-i" role="option" id="' + id() + '" href="' + esc(o.href) + '"><span class="ss-ic" aria-hidden="true">🧾</span>' +
            '<span class="ss-t"><b>' + hl(o.label, r.terms) + '</b><small>' + hl(o.name || 'Customer', r.terms) + (o.city ? ' · ' + hl(o.city, r.terms) : '') + (o.items ? ' · ' + o.items + ' item' + (o.items > 1 ? 's' : '') : '') + '</small></span>' +
            '<span class="ss-r"><span class="ss-b ss-s ' + esc(o.status) + '">' + esc(o.status) + '</span>' + (o.total ? '<em>' + money(o.total) + '</em>' : '') + '</span></a>';
        });
      }
      if (r.products.length) {
        h += '<div class="ss-h" role="presentation">Products</div>';
        r.products.forEach(function (p) {
          h += '<a class="ss-i" role="option" id="' + id() + '" href="' + esc(p.href) + '"><span class="ss-ic" aria-hidden="true">🛍</span>' +
            '<span class="ss-t"><b>' + hl(p.name, r.terms) + '</b><small>' + hl(p.sku || '—', r.terms) + (p.category ? ' · ' + hl(p.category, r.terms) : '') + '</small></span>' +
            '<span class="ss-r">' + stockChip(p) + '<em>' + money(p.price) + '</em></span></a>';
        });
      }
      if (!n) h += '<div class="ss-none"><b>No orders or products found for “' + esc(q) + '”</b><span>Check the spelling, or try the SKU / order ID.</span></div>';
      h += '<a class="ss-all" href="' + esc(helpHref(q)) + '">Search help articles for “' + esc(q) + '” →</a>';
      dd.innerHTML = h;
      items = [].slice.call(dd.querySelectorAll('.ss-i'));
      act = -1; input.removeAttribute('aria-activedescendant');
      open(true);
    }

    function go() { clearTimeout(timer); timer = setTimeout(render, 90); }
    input.addEventListener('focus', function () { load().then(function () { if (document.activeElement === input) render(); }); render(); });
    input.addEventListener('input', function () { load(); go(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (dd.hidden) render();
        if (!items.length) return;
        e.preventDefault();
        mark(e.key === 'ArrowDown' ? (act + 1) % items.length : (act <= 0 ? items.length - 1 : act - 1));
      } else if (e.key === 'Escape') { if (!dd.hidden) { open(false); e.preventDefault(); } }
    });
    form.addEventListener('submit', function (e) {
      var q = input.value.trim();
      if (!q) { e.preventDefault(); return; }
      var t = act > -1 ? items[act] : items[0];
      e.preventDefault();
      location.href = t ? t.getAttribute('href') : helpHref(q);
    });
    dd.addEventListener('mousemove', function (e) { var a = e.target.closest('.ss-i'); if (a) { var i = items.indexOf(a); if (i !== act) mark(i); } });
    dd.addEventListener('mousedown', function (e) { e.preventDefault(); });     // keep focus in the input
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    form.addEventListener('focusout', function () { setTimeout(function () { if (!form.contains(document.activeElement)) open(false); }, 120); });
  }

  [].slice.call(document.querySelectorAll('form.gs, form.sn-search')).forEach(init);
})();
