/* =========================================================
   ShopNow · common/js/api.js
   One small client for every MockAPI resource used by the seller module.
   Put it in shopnow-e-commerce/common/js/ and load it BEFORE your page script:
     <script src="../../common/js/api.js"></script>
   Usage:
     const products = await API.list('products', { sellerId: '1', sortBy: 'createdAt', order: 'desc' });
     const one      = await API.get('products', '5');
     const created  = await API.create('categories', { categoryName: 'Garden', status: 'active' });
     await API.update('products', '5', { price: 599 });          // PUT (merges your fields)
     await API.remove('products', '5');
     await API.updateStock('5', +20, 'Restock');                 // updates product + logs stockMovements
   ========================================================= */
(function (root) {
  'use strict';

  /* ---- 1. Base URL of every MockAPI project --------------------------------
     Each MockAPI project hosts two resources, so several names share one URL.
     users + categories still need a project: paste its URL on the PASTE_ lines. */
  var P_PRODUCT   = 'https://6acba5ebef37b15040781842.mockapi.io/api/v1';  // product, stockMovements
  var P_ORDERS    = 'https://6acbbc89ef37b150407829eb.mockapi.io/api/v1';  // orders, shipments
  var P_AGENTS    = 'https://6acbbf0def37b15040782bb3.mockapi.io/api/v1';  // deliveryAgents, reviews
  var P_RETURNS   = 'https://6acbc0c3ef37b15040782cf6.mockapi.io/api/v1';  // returns, notifications
  var P_SUPPORT   = 'https://6acbc2b8ef37b15040782e47.mockapi.io/api/v1';  // supportTickets, chatMessages
  var P_HELP      = 'https://6acbc4f5ef37b15040782f4e.mockapi.io/api/v1';  // helpArticles

  var BASE = {
    products:       P_PRODUCT,
    stockMovements: P_PRODUCT,
    orders:         P_ORDERS,
    shipments:      P_ORDERS,
    deliveryAgents: P_AGENTS,
    reviews:        P_AGENTS,
    returns:        P_RETURNS,
    notifications:  P_RETURNS,
    tickets:        P_SUPPORT,
    chatMessages:   P_SUPPORT,
    helpArticles:   P_HELP,

    /* ---- not created yet ---- */
    users:          'PASTE_USERS_CATEGORIES_PROJECT_URL_HERE',
    categories:     'PASTE_USERS_CATEGORIES_PROJECT_URL_HERE'
  };

  /* Name your code uses -> real endpoint name in MockAPI (only where they differ) */
  var ENDPOINT = {
    products: 'product',          // MockAPI resource is called "product" (singular)
    tickets:  'supportTickets'    // MockAPI resource is called "supportTickets"
  };

  function url(resource, id, params) {
    var base = BASE[resource];
    if (!base) throw new Error('Unknown API resource: ' + resource);
    if (/PASTE_/.test(base)) throw new Error('Set the MockAPI URL for "' + resource + '" in common/js/api.js');
    var name = ENDPOINT[resource] || resource;
    var u = base.replace(/\/$/, '') + '/' + name + (id != null ? '/' + encodeURIComponent(id) : '');
    var q = [];
    Object.keys(params || {}).forEach(function (k) {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') q.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    });
    return q.length ? u + '?' + q.join('&') : u;
  }

  function request(method, u, body, on404) {
    var opt = { method: method, headers: { 'Content-Type': 'application/json' } };
    if (body !== undefined) opt.body = JSON.stringify(body);
    return fetch(u, opt).then(function (r) {
      if (r.status === 404 && on404 !== undefined) return on404;   // MockAPI answers 404 when a filter matches nothing
      if (!r.ok) return r.text().then(function (t) { throw new Error(method + ' ' + u + ' failed (' + r.status + ') ' + String(t).slice(0, 200)); });
      return r.json();
    });
  }

  var API = {
    BASE: BASE,

    /* GET list. params: any field to filter on, plus search, sortBy, order (asc|desc), page, limit */
    list: function (resource, params) { return request('GET', url(resource, null, params), undefined, []).then(function (d) { return Array.isArray(d) ? d : []; }); },
    get: function (resource, id) { return request('GET', url(resource, id), undefined, null); },
    create: function (resource, data) { return request('POST', url(resource), data); },
    update: function (resource, id, data) { return request('PUT', url(resource, id), data); },
    remove: function (resource, id) { return request('DELETE', url(resource, id)); },

    /* Change stock and keep an audit row in stockMovements (Inventory page) */
    updateStock: function (productId, quantityChanged, reason) {
      return API.get('products', productId).then(function (p) {
        var prev = Number(p.stock) || 0, next = prev + Number(quantityChanged);
        if (next < 0) throw new Error('Stock cannot go below 0');
        return API.update('products', productId, { stock: next }).then(function (saved) {
          return API.create('stockMovements', {
            productId: Number(productId), sellerId: Number(p.sellerId) || 0, previousStock: prev,
            quantityChanged: Number(quantityChanged), newStock: next, reason: reason || 'Correction',
            createdAt: new Date().toISOString()
          }).then(function () { return saved; });
        });
      });
    },

    /* Handy: mark every unread notification of a seller as read */
    markAllRead: function (sellerId) {
      return API.list('notifications', { sellerId: sellerId, isRead: false }).then(function (rows) {
        return Promise.all(rows.map(function (n) { return API.update('notifications', n.id, { isRead: true }); }));
      });
    }
  };

  /* ---- 2. Optional: fill the NEW collections with realistic demo rows ------
     Run once from the browser console (or Node 18+):  await API.seedRemaining()   */
  var now = function (d) { return new Date(Date.now() + (d || 0) * 864e5).toISOString(); };
  API.seedRemaining = function () {
    var data = {
      users: [
        { name: 'Riya Sharma', email: 'riya@example.com', password: 'demo1234', phone: '9876543210', role: 'seller', status: 'active', storeName: 'Riya Home Studio', city: 'Pune' },
        { name: 'Aman Verma', email: 'aman@example.com', password: 'demo1234', phone: '9822012345', role: 'delivery', status: 'active' },
        { name: 'Admin', email: 'admin@example.com', password: 'demo1234', phone: '9000000000', role: 'admin', status: 'active' }
      ],
      categories: ['Garden', 'Home decor', 'Home furnishings', 'Kitchen & dining', 'Storage'].map(function (n) { return { categoryName: n, description: n + ' products', status: 'active' }; }),
      deliveryAgents: [
        { name: 'Aman Verma', phone: '9822012345', email: 'aman@example.com', status: 'active' },
        { name: 'Sunil Patil', phone: '9850098500', email: 'sunil@example.com', status: 'active' },
        { name: 'Farah Khan', phone: '9890011223', email: 'farah@example.com', status: 'inactive' }
      ],
      shipments: [
        { orderId: '1', deliveryAgentId: '1', trackingNumber: 'SN7000071', courierName: 'Delhivery', shipmentStatus: 'In transit', shippedAt: now(-1), estimatedDelivery: now(3), deliveredAt: null },
        { orderId: '2', deliveryAgentId: '2', trackingNumber: 'SN7000078', courierName: 'Blue Dart', shipmentStatus: 'Delivered', shippedAt: now(-5), estimatedDelivery: now(-1), deliveredAt: now(-1) },
        { orderId: '3', deliveryAgentId: '1', trackingNumber: 'SN7000085', courierName: 'India Post', shipmentStatus: 'Ready to ship', shippedAt: null, estimatedDelivery: now(5), deliveredAt: null }
      ],
      stockMovements: [
        { productId: '1', sellerId: '1', previousStock: 3, quantityChanged: 20, newStock: 23, reason: 'Restock', createdAt: now(-2) },
        { productId: '2', sellerId: '1', previousStock: 8, quantityChanged: -5, newStock: 3, reason: 'Damaged', createdAt: now(-1) }
      ],
      helpArticles: [
        { title: 'How do I add my first product?', content: 'Go to Products → Add product, fill in the details and save.', category: 'Getting started', updatedAt: now(-10) },
        { title: 'When do I receive my payout?', content: 'Payouts are sent every Tuesday for delivered orders.', category: 'Payments', updatedAt: now(-7) },
        { title: 'How are returns handled?', content: 'Open Returns, review the request and approve or reject it.', category: 'Returns', updatedAt: now(-3) }
      ]
    };
    var jobs = [];
    Object.keys(data).forEach(function (r) { data[r].forEach(function (row) { jobs.push(API.create(r, row)); }); });
    return Promise.all(jobs).then(function (x) { return x.length + ' rows created'; });
  };

  /* ---- 3. Tolerant readers (the Orders / delivery-agent schemas may name fields differently) ---- */
  function pick(o) { for (var i = 1; i < arguments.length; i++) { var v = o[arguments[i]]; if (v !== undefined && v !== null && v !== '') return v; } return ''; }
  API.agentName = function (a, id) { return a ? String(pick(a, 'name', 'agentName', 'fullName') || ('Agent #' + a.id)) : (id ? 'Agent #' + id : 'Not assigned'); };
  API.orderInfo = function (o) {
    if (!o) return { name: '', phone: '', city: '', address: '', number: '', date: '', total: 0, items: [] };
    var c = o.customer, a = o.shippingAddress || o.address || o.deliveryAddress || '';
    var city = pick(o, 'city', 'shippingCity') || (a && typeof a === 'object' ? pick(a, 'city') : '');
    var addr = a && typeof a === 'object' ? [pick(a, 'line1', 'street', 'address'), pick(a, 'city'), pick(a, 'state'), pick(a, 'pincode', 'zip', 'postalCode')].filter(Boolean).join(', ') : String(a || '');
    var items = o.items || o.orderItems || o.products || [];
    return {
      name: String(pick(o, 'customerName', 'buyerName', 'fullName') || (c && typeof c === 'object' ? pick(c, 'name', 'fullName') : (typeof c === 'string' ? c : '')) || ''),
      phone: String(pick(o, 'customerPhone', 'phone') || (c && typeof c === 'object' ? pick(c, 'phone') : '') || ''),
      city: String(city || ''), address: addr,
      number: String(pick(o, 'orderNumber', 'orderNo', 'number') || ''),
      date: pick(o, 'createdAt', 'orderDate', 'placedAt', 'orderedAt'),
      total: Number(pick(o, 'totalAmount', 'total', 'grandTotal', 'amount')) || 0,
      items: (Array.isArray(items) ? items : []).map(function (i) {
        return { name: String(pick(i, 'productName', 'name', 'title') || 'Item'), sku: String(pick(i, 'sku') || ''), qty: Number(pick(i, 'quantity', 'qty')) || 1, price: Number(pick(i, 'price', 'unitPrice')) || 0 };
      })
    };
  };

  root.API = API;
  if (typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
