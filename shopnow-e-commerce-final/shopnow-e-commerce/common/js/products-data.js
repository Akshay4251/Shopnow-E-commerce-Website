/* ShopNow · common/js/products-data.js
   Maps a MockAPI "product" record <-> the fields the seller pages use.
   Field names are auto-detected from your real records, so it works whatever
   you called them (name / productName / title ...). Load AFTER api.js. */
(function (root) {
  'use strict';
  var ALIASES = {
    name:          ['name', 'productName', 'title', 'product_name'],
    sku:           ['sku', 'SKU', 'productSku', 'productSKU'],
    category:      ['category', 'categoryName', 'categoryId'],
    subCategory:   ['subCategory', 'subcategory', 'sub_category'],
    stock:         ['stock', 'quantity', 'qty', 'inventory'],
    price:         ['price', 'mrp', 'regularPrice', 'sellingPrice'],
    discountPrice: ['discountPrice', 'discount', 'salePrice', 'discount_price'],
    status:        ['status', 'productStatus'],
    description:   ['description', 'desc', 'details']
  };
  /* categories collection isn't created yet, so categoryId (Number) uses this fixed list: id = position + 1 */
  var CATS = ['Garden', 'Home decor', 'Home furnishings', 'Kitchen & dining', 'Storage', 'Electronics'];
  var sample = null;                                   // any real record, used to copy key names / case

  function keyFor(field, rec) {
    var a = ALIASES[field], r = rec || sample || {};
    if (!a) return field;                              // not a mapped field (createdAt, sellerId...): keep its own name
    for (var i = 0; i < a.length; i++) if (Object.prototype.hasOwnProperty.call(r, a[i])) return a[i];
    return a[0];
  }
  function get(rec, field) { var k = keyFor(field, rec); return rec[k]; }

  function cap(s) { s = String(s == null ? '' : s).trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''; }

  function isIdKey(k) { return /Id$/.test(k); }
  function catName(rec) {
    var k = keyFor('category', rec), v = rec[k];
    if (v == null || v === '') return '';
    if (isIdKey(k) || /^\d+$/.test(String(v))) { var n = Number(v); return CATS[n - 1] || ('Category ' + n); }
    return v;
  }

  var PD = {
    setSample: function (rec) { if (rec) sample = rec; },
    /* API record -> plain object for display */
    view: function (rec) {
      var stock = Number(get(rec, 'stock')) || 0;
      var st = cap(get(rec, 'status'));
      if (st !== 'Draft') st = 'Active';                // Faker words / "active" / anything else -> Active
      if (stock === 0 && st === 'Active') st = 'Out of stock';
      return {
        id: rec.id, name: get(rec, 'name') || '', sku: get(rec, 'sku') || '',
        category: catName(rec), subCategory: get(rec, 'subCategory') || '',
        stock: stock, price: Number(get(rec, 'price')) || 0,
        discountPrice: Number(get(rec, 'discountPrice')) || '', status: st,
        description: get(rec, 'description') || ''
      };
    },
    /* form values -> payload for the API (copies the key names + status case of existing records) */
    payload: function (v, existing) {
      var ref = existing || sample, out = {};
      var lower = ref && typeof get(ref, 'status') === 'string' && get(ref, 'status') === String(get(ref, 'status')).toLowerCase();
      Object.keys(v).forEach(function (f) {
        if (v[f] === undefined) return;
        var val = v[f], key = keyFor(f, ref);
        if (f === 'status' && lower) val = String(val).toLowerCase();
        if (f === 'category' && isIdKey(key)) { var i = CATS.indexOf(val); if (i < 0) return; val = i + 1; }   // unknown name: leave categoryId untouched
        if (f === 'discountPrice' && val === '') val = 0;
        out[key] = val;
      });
      return out;
    }
  };
  root.ProductsData = PD;
})(window);
