/*
 * Fake backend for the COMMON features only: sign out, current user, search (customer, seller, admin,
 * delivery agent), cart count.
 * Intercepts every jQuery $.ajax call whose URL starts with /api/ and answers it from localStorage.
 * When the real backend exists, delete this <script> tag; no other file needs to change.
 */
(function ($) {
  "use strict";
  var KEY = "shopnow_common_db";
  var LATENCY = 300;

  var PRODUCTS = [
    {
      id: 1,
      brand: "Northwind",
      name: "Midnight Navy Cotton Jacket",
      category: "Fashion",
      price: 79,
      rating: 4.5,
    },
    {
      id: 2,
      brand: "Stride",
      name: "Soft White Running Shoes",
      category: "Sports",
      price: 64,
      rating: 4.2,
    },
    {
      id: 3,
      brand: "Hearth",
      name: "Oatmeal Wool Throw Blanket",
      category: "Home",
      price: 48,
      rating: 4.7,
    },
    {
      id: 4,
      brand: "Auralis",
      name: "Wireless Noise-Cancelling Headphones",
      category: "Electronics",
      price: 129,
      rating: 4.4,
    },
    {
      id: 5,
      brand: "Pulse",
      name: "Smart Fitness Watch",
      category: "Electronics",
      price: 99,
      rating: 4.1,
    },
    {
      id: 6,
      brand: "Glow",
      name: "Vitamin C Face Serum",
      category: "Beauty",
      price: 24,
      rating: 4.6,
    },
    {
      id: 7,
      brand: "Bloom",
      name: "Hydrating Face Moisturizer",
      category: "Beauty",
      price: 19,
      rating: 4.3,
    },
    {
      id: 8,
      brand: "Harvest",
      name: "Organic Green Tea Box",
      category: "Grocery",
      price: 12,
      rating: 4.5,
    },
    {
      id: 9,
      brand: "Harvest",
      name: "Cold-Pressed Olive Oil",
      category: "Grocery",
      price: 18,
      rating: 4.8,
    },
    {
      id: 10,
      brand: "Atelier",
      name: "Leather Crossbody Bag",
      category: "Luxury",
      price: 240,
      rating: 4.7,
    },
    {
      id: 11,
      brand: "Atelier",
      name: "Silk Evening Scarf",
      category: "Luxury",
      price: 140,
      rating: 4.4,
    },
    {
      id: 12,
      brand: "Hearth",
      name: "Ceramic Table Lamp",
      category: "Home",
      price: 56,
      rating: 3.9,
    },
    {
      id: 13,
      brand: "Stride",
      name: "Yoga Mat Pro",
      category: "Sports",
      price: 35,
      rating: 4.6,
    },
    {
      id: 14,
      brand: "Northwind",
      name: "Linen Summer Shirt",
      category: "Fashion",
      price: 42,
      rating: 4.0,
    },
    {
      id: 15,
      brand: "Auralis",
      name: "Portable Bluetooth Speaker",
      category: "Electronics",
      price: 59,
      rating: 4.2,
    },
    {
      id: 16,
      brand: "Pulse",
      name: "Insulated Steel Water Bottle",
      category: "Sports",
      price: 22,
      rating: 4.5,
    },
  ];
  var CATEGORIES = [
    "Fashion",
    "Electronics",
    "Home",
    "Beauty",
    "Grocery",
    "Sports",
    "Luxury",
  ];

  /* ---------- Demo data for the seller / admin / delivery-agent search ----------
     Demo seller = "Hearth Home", demo delivery agent = "Ravi K.". A real backend must take the seller/agent from the
     signed-in token (never from the request) so each person only finds their own records. */
  var ORDERS = [
    {
      no: "SN1001",
      customer: "Avery Morgan",
      status: "Packed",
      seller: "Hearth Home",
      agent: "",
      pin: "411038",
      area: "Kothrud, Pune",
      items: "Oatmeal Wool Throw Blanket",
    },
    {
      no: "SN1002",
      customer: "Jordan Lee",
      status: "Shipped",
      seller: "Hearth Home",
      agent: "Ravi K.",
      pin: "411045",
      area: "Baner, Pune",
      items: "Ceramic Table Lamp",
    },
    {
      no: "SN1003",
      customer: "Priya Shah",
      status: "Delivered",
      seller: "Stride Store",
      agent: "Ravi K.",
      pin: "411014",
      area: "Viman Nagar, Pune",
      items: "Yoga Mat Pro",
    },
    {
      no: "SN1004",
      customer: "Avery Morgan",
      status: "Out for delivery",
      seller: "Auralis Audio",
      agent: "Ravi K.",
      pin: "411001",
      area: "Camp, Pune",
      items: "Smart Fitness Watch",
    },
    {
      no: "SN1005",
      customer: "Jordan Lee",
      status: "Delivered",
      seller: "Hearth Home",
      agent: "Meera D.",
      pin: "411057",
      area: "Hinjewadi, Pune",
      items: "Oatmeal Wool Throw Blanket",
    },
  ];
  var USERS = [
    { id: 1, name: "Avery Morgan", email: "avery.morgan@email.com" },
    { id: 2, name: "Jordan Lee", email: "jordan.lee@email.com" },
    { id: 3, name: "Priya Shah", email: "priya.shah@email.com" },
  ];
  var SELLERS = [
    { id: 7, name: "Hearth Home", city: "Pune" },
    { id: 8, name: "Stride Store", city: "Mumbai" },
    { id: 9, name: "Auralis Audio", city: "Bengaluru" },
  ];

  /** Everything one module is allowed to search, as {type,label,sub,href,hay}. */
  function indexFor(mod) {
    var out = [];
    function add(type, label, sub, href, extra) {
      out.push({
        type: type,
        label: label,
        sub: sub,
        href: href,
        hay: (label + " " + sub + " " + extra).toLowerCase(),
      });
    }
    if (mod === "seller") {
      PRODUCTS.filter(function (p) {
        return p.brand === "Hearth";
      }).forEach(function (p) {
        add(
          "product",
          p.name,
          "Your product · $" + p.price,
          "seller-products.html?id=" + p.id,
          p.category,
        );
      });
      ORDERS.filter(function (o) {
        return o.seller === "Hearth Home";
      }).forEach(function (o) {
        add(
          "order",
          "Order " + o.no,
          o.status + " · " + o.customer,
          "seller-orders.html?id=" + o.no,
          o.items,
        );
      });
    } else if (mod === "admin") {
      USERS.forEach(function (u) {
        add(
          "user",
          u.name,
          "Customer · " + u.email,
          "admin-users.html?id=" + u.id,
          "",
        );
      });
      SELLERS.forEach(function (s) {
        add(
          "seller",
          s.name,
          "Seller · " + s.city,
          "admin-sellers.html?id=" + s.id,
          "",
        );
      });
      ORDERS.forEach(function (o) {
        add(
          "order",
          "Order " + o.no,
          o.status + " · " + o.customer,
          "admin-orders.html?id=" + o.no,
          o.seller + " " + o.items,
        );
      });
    } else if (mod === "agent") {
      ORDERS.filter(function (o) {
        return o.agent === "Ravi K.";
      }).forEach(function (o) {
        add(
          "delivery",
          "Order " + o.no,
          "PIN " + o.pin + " · " + o.area + " · " + o.status,
          "agent-deliveries.html?order=" + o.no,
          o.customer,
        );
      });
    }
    return out;
  }

  function seed() {
    return {
      session: { loggedIn: true },
      customer: {
        id: 1,
        name: "Avery Morgan",
        email: "avery.morgan@email.com",
      },
      cartCount: 0,
    };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    var db = seed();
    save(db);
    return db;
  }
  function save(db) {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch (e) {}
  }
  function ok(body, status) {
    return { status: status || 200, body: body };
  }
  function fail(status, message) {
    return { status: status, body: { message: message } };
  }

  function matches(p, q) {
    var hay = (p.brand + " " + p.name + " " + p.category).toLowerCase();
    return q
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every(function (t) {
        return hay.indexOf(t) > -1;
      });
  }

  function route(method, url, data) {
    var db = load(),
      m;
    var qs = new URLSearchParams(url.split("?")[1] || "");
    url = url.split("?")[0].replace(/\/+$/, "");

    /* ---------- Auth (sign-in belongs to the login team) ---------- */
    if (method === "POST" && url === "/api/auth/logout") {
      db.session.loggedIn = false;
      save(db);
      return ok({ loggedOut: true });
    }
    if (method === "GET" && url === "/api/customer/me") {
      return db.session.loggedIn
        ? ok(db.customer)
        : fail(401, "Please sign in to continue.");
    }

    /* ---------- Search (public) ---------- */
    if (method === "GET" && url === "/api/search/suggestions") {
      var sq = (qs.get("q") || "").trim();
      if (!sq) return ok({ products: [], categories: [] });
      return ok({
        products: PRODUCTS.filter(function (p) {
          return matches(p, sq);
        })
          .slice(0, 5)
          .map(function (p) {
            return { id: p.id, name: p.name, category: p.category };
          }),
        categories: CATEGORIES.filter(function (c) {
          return c.toLowerCase().indexOf(sq.toLowerCase()) > -1;
        }).slice(0, 2),
      });
    }
    if (method === "GET" && url === "/api/products") {
      var q = (qs.get("q") || "").trim();
      var pool = PRODUCTS.filter(function (p) {
        return !q || matches(p, q);
      });
      var facets = CATEGORIES.map(function (c) {
        return {
          name: c,
          count: pool.filter(function (p) {
            return p.category === c;
          }).length,
        };
      }).filter(function (f) {
        return f.count;
      });
      var cats = (qs.get("category") || "").split(",").filter(Boolean);
      var minP = parseFloat(qs.get("minPrice")),
        maxP = parseFloat(qs.get("maxPrice")),
        minR = parseFloat(qs.get("rating"));
      var items = pool.filter(function (p) {
        return (
          (!cats.length || cats.indexOf(p.category) > -1) &&
          (isNaN(minP) || p.price >= minP) &&
          (isNaN(maxP) || p.price <= maxP) &&
          (isNaN(minR) || p.rating >= minR)
        );
      });
      var sort = qs.get("sort");
      if (sort === "price_asc")
        items.sort(function (a, b) {
          return a.price - b.price;
        });
      else if (sort === "price_desc")
        items.sort(function (a, b) {
          return b.price - a.price;
        });
      else if (sort === "rating")
        items.sort(function (a, b) {
          return b.rating - a.rating;
        });
      var size = Math.max(1, parseInt(qs.get("pageSize"), 10) || 8);
      var pages = Math.max(1, Math.ceil(items.length / size));
      var page = Math.min(
        Math.max(1, parseInt(qs.get("page"), 10) || 1),
        pages,
      );
      return ok({
        total: items.length,
        page: page,
        pages: pages,
        pageSize: size,
        categories: facets,
        items: items.slice((page - 1) * size, page * size),
      });
    }
    if ((m = url.match(/^\/api\/products\/(\d+)$/)) && method === "GET") {
      var prod = PRODUCTS.filter(function (p) {
        return p.id === +m[1];
      })[0];
      return prod ? ok(prod) : fail(404, "Product not found.");
    }

    /* ---------- Seller / admin / delivery-agent search ---------- */
    if (
      method === "GET" &&
      (m = url.match(/^\/api\/(seller|admin|agent)\/search(\/suggestions)?$/))
    ) {
      var mq = (qs.get("q") || "").trim(),
        suggestions = !!m[2];
      var hits = indexFor(m[1])
        .filter(function (e) {
          return mq
            ? matches({ brand: "", name: e.hay, category: "" }, mq)
            : !suggestions;
        })
        .map(function (e) {
          return { type: e.type, label: e.label, sub: e.sub, href: e.href };
        });
      if (suggestions) return ok({ results: hits.slice(0, 6) });
      var psize = Math.max(1, parseInt(qs.get("pageSize"), 10) || 10);
      var ppages = Math.max(1, Math.ceil(hits.length / psize));
      var ppage = Math.min(
        Math.max(1, parseInt(qs.get("page"), 10) || 1),
        ppages,
      );
      return ok({
        total: hits.length,
        page: ppage,
        pages: ppages,
        pageSize: psize,
        items: hits.slice((ppage - 1) * psize, ppage * psize),
      });
    }

    if (method === "GET" && url === "/api/cart/count")
      return ok({ count: db.cartCount });

    return fail(404, "Endpoint not found: " + method + " " + url);
  }

  $.ajaxTransport("+*", function (options) {
    if (!/^\/api\//.test(options.url)) return;
    var timer;
    return {
      send: function (headers, complete) {
        timer = setTimeout(function () {
          var payload = options.data;
          if (typeof payload === "string") {
            try {
              payload = JSON.parse(payload);
            } catch (e) {}
          }
          var res = route(
            (options.type || "GET").toUpperCase(),
            options.url,
            payload,
          );
          complete(
            res.status,
            res.status < 400 ? "success" : "error",
            { text: JSON.stringify(res.body) },
            "Content-Type: application/json",
          );
        }, LATENCY);
      },
      abort: function () {
        clearTimeout(timer);
      },
    };
  });

  window.shopnowResetDb = function () {
    localStorage.removeItem(KEY);
    location.reload();
  };
})(jQuery);
