/**
 * ===================================================
 * SHOPNOW - HOME PAGE JAVASCRIPT
 * MockAPI endpoints integration with localStorage caching
 * ===================================================
 */

$(document).ready(function () {
  'use strict';

  const MOCKAPI_CATEGORIES_URL = 'https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/categories';
  const MOCKAPI_PRODUCTS_URL = 'https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/products';

  const STORAGE_CATEGORIES_KEY = 'shopnow_categories';
  const STORAGE_PRODUCTS_KEY = 'shopnow_products';

  // Fallback Categories Data
  const defaultCategories = [
    { 
      id: "1",
      title: "Women's Fashion", 
      subtitle: "Coat, dresses & top", 
      image: "https://res.cloudinary.com/dpva4smxo/image/upload/v1791382195/Category_image_ngf5ah.png" 
    },
    { 
      id: "2",
      title: "Men's Apparel", 
      subtitle: "Tailoring & casualwear", 
      image: "https://res.cloudinary.com/dpva4smxo/image/upload/v1791382194/Category_image_1_to3kzh.png" 
    },
    { 
      id: "3",
      title: "Tech & Sound", 
      subtitle: "Audio, headphones & desk", 
      image: "https://res.cloudinary.com/dpva4smxo/image/upload/v1791382194/Category_image_2_f7jb8v.png" 
    },
    { 
      id: "4",
      title: "Modern Home", 
      subtitle: "Lamps, cookware & decor", 
      image: "https://res.cloudinary.com/dpva4smxo/image/upload/v1791382194/Category_image_3_he65nx.png" 
    },
    { 
      id: "5",
      title: "Beauty Edit", 
      subtitle: "Serums & body", 
      image: "https://res.cloudinary.com/dpva4smxo/image/upload/v1791382195/Category_image_4_xcruqj.png" 
    },
    { 
      id: "6",
      title: "Active Life", 
      subtitle: "Gym, running & outdoors", 
      image: "https://res.cloudinary.com/dpva4smxo/image/upload/v1791382195/Category_image_5_tkquqx.png" 
    }
  ];

  // Fallback Products Data (Curated with Indian Rupee Prices)
  const defaultProducts = [
    { 
      id: "101", 
      brand: 'AERFORM', 
      title: 'Textured Cashmere Blend Sweater', 
      category: 'Sweaters',
      price: 1899, 
      oldPrice: 2499, 
      badge: '15% OFF', 
      rating: 4.8, 
      reviews: 124, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png' 
    },
    { 
      id: "102", 
      brand: 'LUMEN', 
      title: 'Over-Ear Noise Canceling Headphones', 
      category: 'Audio',
      price: 2999, 
      oldPrice: 3999, 
      badge: '15% OFF', 
      rating: 4.9, 
      reviews: 88, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_1_dtjolj.png' 
    },
    { 
      id: "103", 
      brand: 'KIN HOME', 
      title: 'Sculptural Ceramic Table Lamp', 
      category: 'Decor',
      price: 1450, 
      oldPrice: null, 
      badge: '', 
      rating: 4.7, 
      reviews: 42, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png' 
    },
    { 
      id: "104", 
      brand: 'RIVIERA HOME', 
      title: 'Structured Leather Daypack', 
      category: 'Accessories',
      price: 1750, 
      oldPrice: 2200, 
      badge: '15% OFF', 
      rating: 4.6, 
      reviews: 210, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png' 
    },
    { 
      id: "105", 
      brand: 'AERFORM', 
      title: 'Aeroflex Pro Runner', 
      category: 'Footwear',
      price: 1400, 
      oldPrice: null, 
      badge: 'NEW EDIT', 
      rating: 4.8, 
      reviews: 56, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_4_dh5fbk.png' 
    },
    { 
      id: "106", 
      brand: 'LUMEN', 
      title: 'Hydration Serum & Body Oil', 
      category: 'Skincare',
      price: 890, 
      oldPrice: null, 
      badge: '', 
      rating: 4.9, 
      reviews: 310, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_5_mqgoba.png' 
    },
    { 
      id: "107", 
      brand: 'NOMAD', 
      title: 'Expandable Carry-On Suitcase', 
      category: 'Luggage',
      price: 2499, 
      oldPrice: 3199, 
      badge: 'BESTSELLER', 
      rating: 4.9, 
      reviews: 512, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_6_vvdraq.png' 
    },
    { 
      id: "108", 
      brand: 'SONORA AUDIO', 
      title: 'Mini 360 Speaker', 
      category: 'Audio',
      price: 950, 
      oldPrice: null, 
      badge: '', 
      rating: 4.7, 
      reviews: 94, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_7_radxl9.png' 
    }
  ];

  function renderCategories(cats) {
    let catHtml = '';
    cats.forEach(c => {
      let catParam = c.title;
      if (c.title.includes("Women")) catParam = "Sweaters";
      else if (c.title.includes("Men")) catParam = "Sweaters";
      else if (c.title.includes("Tech") || c.title.includes("Sound")) catParam = "Audio";
      else if (c.title.includes("Home")) catParam = "Decor";
      else if (c.title.includes("Beauty")) catParam = "Skincare";
      else if (c.title.includes("Active")) catParam = "Footwear";

      catHtml += `
        <div class="col-6 col-sm-4 col-md-2">
          <a href="../../buyer/html/catalog.html?category=${encodeURIComponent(catParam)}" class="category-card-figma text-decoration-none">
            <div class="category-img-box">
              <img src="${c.image}" alt="${c.title}" />
            </div>
            <div class="category-info-box">
              <h6 class="category-title">${c.title}</h6>
              <span class="category-sub">${c.subtitle}</span>
            </div>
          </a>
        </div>
      `;
    });
    $('#categoriesContainer').html(catHtml);
  }

  // Normalizer: cleans raw MockAPI data into accurate, professional product attributes
  function normalizeProduct(p, idx) {
    if (!p) return null;
    const defaultRef = defaultProducts.find(d => String(d.id) === String(p.id)) || defaultProducts[idx % defaultProducts.length];
    
    // Check if title is dummy generated e.g. "title 101"
    const isDummyTitle = !p.title || /^title\s*\d*$/i.test(p.title);
    const title = isDummyTitle ? defaultRef.title : p.title;

    // Check if brand is dummy generated e.g. "brand 101"
    const isDummyBrand = !p.brand || /^brand\s*\d*$/i.test(p.brand);
    const brand = isDummyBrand ? (p.sellerName || defaultRef.brand || 'SHOPNOW') : p.brand;

    // Category
    let cat = p.category;
    if (!cat || /^category\s*\d*$/i.test(cat)) {
      cat = defaultRef.category || 'Lifestyle';
    }

    // Image fallback to Cloudinary if empty or placeholder
    let img = p.image || (Array.isArray(p.images) && p.images[0]);
    if (!img || img.includes('placeholder') || img.length < 15 || !img.startsWith('http')) {
      img = defaultRef.image;
    }

    // Price
    let price = Number(p.price);
    if (isNaN(price) || price <= 0 || (isDummyTitle && price < 100)) {
      price = defaultRef.price;
    }

    // Old price / discount
    let oldPrice = p.oldPrice ? Number(p.oldPrice) : (p.discountPrice ? Number(p.discountPrice) : null);
    if (oldPrice && oldPrice <= price) {
      if (oldPrice > 0 && oldPrice < price) {
        const temp = price;
        price = oldPrice;
        oldPrice = temp;
      } else {
        oldPrice = defaultRef.oldPrice || null;
      }
    }

    return {
      ...p,
      id: p.id || defaultRef.id,
      title: title,
      brand: brand,
      category: cat,
      price: price,
      oldPrice: oldPrice,
      badge: p.badge || (p.createdAt ? 'NEW' : defaultRef.badge || ''),
      rating: p.rating ? Number(p.rating) : defaultRef.rating || 4.8,
      reviews: p.reviews !== undefined ? p.reviews : defaultRef.reviews || 0,
      image: img
    };
  }

  // Sorter: Latest products (custom seller created or newest IDs/timestamps) come first
  function sortLatestProducts(list) {
    return [...list].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (a.createdAt) return -1;
      if (b.createdAt) return 1;

      const aIsCustom = a.sellerEmail && a.sellerEmail !== 'seller@demo.com';
      const bIsCustom = b.sellerEmail && b.sellerEmail !== 'seller@demo.com';
      if (aIsCustom && !bIsCustom) return -1;
      if (!aIsCustom && bIsCustom) return 1;

      const numA = parseInt(String(a.id).replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(String(b.id).replace(/\D/g, ''), 10) || 0;
      if (numA > 108 || numB > 108) {
        return numB - numA;
      }
      return numA - numB;
    });
  }

  let allHomeProducts = [];

  function renderProducts(prods) {
    const list = Array.isArray(prods) && prods.length > 0 ? prods : defaultProducts;
    
    // Normalize and sort by newest/latest
    const normalized = list.map((p, idx) => normalizeProduct(p, idx)).filter(Boolean);
    const sorted = sortLatestProducts(normalized);

    // Strictly limit to the latest 8 products - do not add further!
    allHomeProducts = sorted.slice(0, 8);

    const user = typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null;
    const userWishlist = user ? ShopNowCommon.getUserWishlist(user) : [];

    let prodHtml = '';
    allHomeProducts.forEach(p => {
      const priceVal = Number(p.price) || 0;
      const oldPriceVal = p.oldPrice ? Number(p.oldPrice) : null;
      const oldPriceHtml = (oldPriceVal && oldPriceVal > priceVal) 
        ? `<span class="old-price">₹ ${oldPriceVal.toLocaleString('en-IN')}</span>` 
        : '';
      const badgeHtml = p.badge ? `<span class="product-badge-tag">${p.badge}</span>` : '';
      const ratingVal = p.rating ? Number(p.rating).toFixed(1) : '4.8';
      const reviewsVal = p.reviews !== undefined ? p.reviews : '0';
      const isWishlisted = userWishlist.some(w => String(w.id) === String(p.id));

      prodHtml += `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="product-card-figma">
            <div class="product-img-wrapper">
              ${badgeHtml}
              <button class="product-fav-circle-btn ${isWishlisted ? 'active' : ''}" aria-label="Favorite" data-id="${p.id}" title="${isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}">
                <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
              </button>
              <a href="../../buyer/html/product-details.html?id=${p.id}" class="d-block w-100 h-100">
                <img src="${p.image}" alt="${p.title}" />
              </a>
            </div>
            <div class="product-info-wrapper">
              <span class="product-brand-tag">${p.brand || 'SHOPNOW'}</span>
              <h6 class="product-name-title">
                <a href="../../buyer/html/product-details.html?id=${p.id}" class="text-dark text-decoration-none product-link-title">
                  ${p.title}
                </a>
              </h6>
              <div class="product-rating-row">
                <i class="bi bi-star-fill text-warning"></i>
                <span>${ratingVal}</span>
                <span class="reviews-count">(${reviewsVal})</span>
              </div>
              <div class="product-price-row d-flex justify-content-between align-items-center mb-2">
                <div>
                  <span class="curr-price">₹ ${priceVal.toLocaleString('en-IN')}</span>
                  ${oldPriceHtml}
                </div>
                <a href="../../buyer/html/product-details.html?id=${p.id}" class="btn btn-sm btn-outline-dark rounded-pill px-3 py-1 small fw-semibold">
                  View <i class="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
              <button type="button" class="btn btn-sm btn-coral-custom w-100 rounded-pill py-2 small fw-semibold btn-home-add-cart" data-id="${p.id}">
                <i class="bi bi-cart-plus me-1"></i>Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    });
    $('#trendingProductsContainer, #productsContainer').html(prodHtml);
  }

  // Handle heart favorite toggle button with user session and separation
  $(document).on('click', '.product-fav-circle-btn', function (e) {
    e.preventDefault();
    const $btn = $(this);
    const rawId = $btn.attr('data-id') || $btn.data('id');
    const id = String(rawId);

    const user = typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null;
    if (!user || !user.email) {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Please sign in to save items to your wishlist', 'info');
      }
      setTimeout(function () {
        window.location.href = 'login.html?redirect=home';
      }, 1000);
      return;
    }

    let prod = allHomeProducts.find(p => String(p.id) === id);
    if (!prod) {
      const cached = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS_KEY) || '[]');
      prod = cached.find(p => String(p.id) === id);
    }
    if (!prod) {
      prod = defaultProducts.find(p => String(p.id) === id);
    }
    if (!prod) return;

    let wishlist = ShopNowCommon.getUserWishlist(user);
    const existingIdx = wishlist.findIndex(item => String(item.id) === id);

    if (existingIdx > -1) {
      wishlist.splice(existingIdx, 1);
      ShopNowCommon.saveUserWishlist(wishlist, user);
      $btn.removeClass('active');
      $btn.find('i').removeClass('bi-heart-fill').addClass('bi-heart');
      $btn.attr('title', 'Add to Wishlist');
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Removed "${prod.title}" from Wishlist`, 'info');
      }
    } else {
      wishlist.push(prod);
      ShopNowCommon.saveUserWishlist(wishlist, user);
      $btn.addClass('active');
      $btn.find('i').removeClass('bi-heart').addClass('bi-heart-fill');
      $btn.attr('title', 'In Wishlist');
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Saved "${prod.title}" to Wishlist!`, 'success');
      }
    }

    if (window.ShopNowHeader && window.ShopNowHeader.updateWishlistBadge) {
      window.ShopNowHeader.updateWishlistBadge(wishlist.length);
    }
  });

  // Handle Add to Cart direct from home page with user session and separation
  $(document).on('click', '.btn-home-add-cart', function (e) {
    e.preventDefault();
    const rawId = $(this).attr('data-id') || $(this).data('id');
    const id = String(rawId);

    const user = typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null;
    if (!user || !user.email) {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Please sign in to add items to your cart', 'info');
      }
      setTimeout(function () {
        window.location.href = 'login.html?redirect=cart';
      }, 1000);
      return;
    }

    let prod = allHomeProducts.find(p => String(p.id) === id);
    if (!prod) {
      const cached = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS_KEY) || '[]');
      prod = cached.find(p => String(p.id) === id);
    }
    if (!prod) {
      prod = defaultProducts.find(p => String(p.id) === id);
    }
    if (!prod) {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Product not found', 'error');
      }
      return;
    }

    let cart = ShopNowCommon.getUserCart(user);
    const existing = cart.find(item => String(item.id) === id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...prod, quantity: 1 });
    }

    ShopNowCommon.saveUserCart(cart, user);

    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (window.ShopNowHeader && window.ShopNowHeader.updateCartBadge) {
      window.ShopNowHeader.updateCartBadge(totalCount);
    }

    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast(`Added "${prod.title}" to cart!`, 'success');
    }
  });

  // 1. Immediately Render Categories (from cache or instant default) - 0ms latency
  let activeCategories = defaultCategories;
  const cachedCategories = localStorage.getItem(STORAGE_CATEGORIES_KEY);
  if (cachedCategories) {
    try {
      const parsed = JSON.parse(cachedCategories);
      if (Array.isArray(parsed) && parsed.length > 0) activeCategories = parsed;
    } catch (e) {}
  } else {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(defaultCategories));
  }
  renderCategories(activeCategories);

  // Background non-blocking sync for Categories
  $.getJSON(MOCKAPI_CATEGORIES_URL, function (data) {
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(data));
      renderCategories(data);
    }
  });

  // 2. Immediately Render Products (from cache or instant default) - 0ms latency
  let activeProducts = defaultProducts;
  const cachedProducts = localStorage.getItem(STORAGE_PRODUCTS_KEY);
  if (cachedProducts) {
    try {
      const parsed = JSON.parse(cachedProducts);
      if (Array.isArray(parsed) && parsed.length > 0) activeProducts = parsed;
    } catch (e) {}
  } else {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(defaultProducts));
  }
  renderProducts(activeProducts);

  // Background non-blocking sync for Products
  $.getJSON(MOCKAPI_PRODUCTS_URL, function (data) {
    if (Array.isArray(data) && data.length > 0) {
      const currentCat = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS_KEY) || '[]');
      const sellerProds = JSON.parse(localStorage.getItem('shopnow_seller_products') || '[]');
      const customAdded = [...currentCat, ...sellerProds].filter(p => p && p.sellerEmail && p.sellerEmail !== 'seller@demo.com');
      const merged = [...data];
      customAdded.forEach(sp => {
        if (!merged.some(m => String(m.id) === String(sp.id) || (m.sku && sp.sku && m.sku === sp.sku))) {
          merged.unshift(sp);
        }
      });
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(merged));
      renderProducts(merged);
    }
  });
});
