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

  // Fallback Products Data
  const defaultProducts = [
    { 
      id: "101", 
      brand: 'AERFORM', 
      title: 'Textured Cashmere Blend Sweater', 
      price: 189.00, 
      oldPrice: 240.00, 
      badge: '15% OFF', 
      rating: 4.8, 
      reviews: 124, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png' 
    },
    { 
      id: "102", 
      brand: 'LUMEN', 
      title: 'Over-Ear Noise Canceling Headphones', 
      price: 199.00, 
      oldPrice: 270.00, 
      badge: '15% OFF', 
      rating: 4.9, 
      reviews: 88, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_1_dtjolj.png' 
    },
    { 
      id: "103", 
      brand: 'KIN HOME', 
      title: 'Sculptural Ceramic Table Lamp', 
      price: 145.00, 
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
      price: 175.00, 
      oldPrice: 220.00, 
      badge: '15% OFF', 
      rating: 4.6, 
      reviews: 210, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png' 
    },
    { 
      id: "105", 
      brand: 'AERFORM', 
      title: 'Aeroflex Pro Runner', 
      price: 140.00, 
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
      price: 48.00, 
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
      price: 220.00, 
      oldPrice: 280.00, 
      badge: 'BESTSELLER', 
      rating: 4.9, 
      reviews: 512, 
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_6_vvdraq.png' 
    },
    { 
      id: "108", 
      brand: 'SONORA AUDIO', 
      title: 'Mini 360 Speaker', 
      price: 95.00, 
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

  let allHomeProducts = [...defaultProducts];

  function renderProducts(prods) {
    if (Array.isArray(prods) && prods.length > 0) {
      allHomeProducts = prods.map((p, idx) => {
        let img = p.image;
        if (!img || img.includes('placeholder') || img.length < 15 || !img.startsWith('http')) {
          img = defaultProducts[idx % defaultProducts.length].image;
        }
        return { ...p, image: img };
      });
    }
    const user = typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null;
    const userWishlist = user ? ShopNowCommon.getUserWishlist(user) : [];

    let prodHtml = '';
    allHomeProducts.forEach(p => {
      const priceVal = Number(p.price) || 0;
      const oldPriceVal = p.oldPrice ? Number(p.oldPrice) : null;
      const oldPriceHtml = oldPriceVal ? `<span class="old-price">$${oldPriceVal.toFixed(2)}</span>` : '';
      const badgeHtml = p.badge ? `<span class="product-badge-tag">${p.badge}</span>` : '';
      const ratingVal = p.rating ? Number(p.rating).toFixed(1) : '4.8';
      const reviewsVal = p.reviews ? p.reviews : '0';
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
                  <span class="curr-price">$${priceVal.toFixed(2)}</span>
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
