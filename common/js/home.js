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
      catHtml += `
        <div class="col-6 col-sm-4 col-md-2">
          <a href="#trending-products" class="category-card-figma">
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

  function renderProducts(prods) {
    let prodHtml = '';
    prods.forEach(p => {
      const priceVal = Number(p.price) || 0;
      const oldPriceVal = p.oldPrice ? Number(p.oldPrice) : null;
      const oldPriceHtml = oldPriceVal ? `<span class="old-price">$${oldPriceVal.toFixed(2)}</span>` : '';
      const badgeHtml = p.badge ? `<span class="product-badge-tag">${p.badge}</span>` : '';
      const ratingVal = p.rating ? Number(p.rating).toFixed(1) : '4.8';
      const reviewsVal = p.reviews ? p.reviews : '0';

      prodHtml += `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="product-card-figma">
            <div class="product-img-wrapper">
              ${badgeHtml}
              <button class="product-fav-circle-btn" aria-label="Favorite">
                <i class="bi bi-heart"></i>
              </button>
              <img src="${p.image}" alt="${p.title}" />
            </div>
            <div class="product-info-wrapper">
              <span class="product-brand-tag">${p.brand || 'SHOPNOW'}</span>
              <h6 class="product-name-title">${p.title}</h6>
              <div class="product-rating-row">
                <i class="bi bi-star-fill text-warning"></i>
                <span>${ratingVal}</span>
                <span class="reviews-count">(${reviewsVal})</span>
              </div>
              <div class="product-price-row">
                <span class="curr-price">$${priceVal.toFixed(2)}</span>
                ${oldPriceHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    });
    $('#trendingProductsContainer, #productsContainer').html(prodHtml);
  }

  // Handle heart favorite toggle button
  $(document).on('click', '.product-fav-circle-btn', function (e) {
    e.preventDefault();
    $(this).toggleClass('active');
    const icon = $(this).find('i');
    if ($(this).hasClass('active')) {
      icon.removeClass('bi-heart').addClass('bi-heart-fill');
    } else {
      icon.removeClass('bi-heart-fill').addClass('bi-heart');
    }
  });

  // Load Categories (localStorage cache -> MockAPI -> default fallback)
  const cachedCategories = localStorage.getItem(STORAGE_CATEGORIES_KEY);
  if (cachedCategories) {
    try {
      renderCategories(JSON.parse(cachedCategories));
    } catch (e) {
      renderCategories(defaultCategories);
    }
  }

  $.getJSON(MOCKAPI_CATEGORIES_URL, function (data) {
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(data));
      renderCategories(data);
    } else if (!cachedCategories) {
      renderCategories(defaultCategories);
    }
  }).fail(function () {
    if (!cachedCategories) {
      // Try local JSON resource fallback if available
      $.getJSON('../resources/categories.json', function (data) {
        const list = data.categories || defaultCategories;
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(list));
        renderCategories(list);
      }).fail(function () {
        renderCategories(defaultCategories);
      });
    }
  });

  // Load Products (localStorage cache -> MockAPI -> default fallback)
  const cachedProducts = localStorage.getItem(STORAGE_PRODUCTS_KEY);
  if (cachedProducts) {
    try {
      renderProducts(JSON.parse(cachedProducts));
    } catch (e) {
      renderProducts(defaultProducts);
    }
  }

  $.getJSON(MOCKAPI_PRODUCTS_URL, function (data) {
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(data));
      renderProducts(data);
    } else if (!cachedProducts) {
      renderProducts(defaultProducts);
    }
  }).fail(function () {
    if (!cachedProducts) {
      // Try local JSON resource fallback if available
      $.getJSON('../resources/products.json', function (data) {
        const list = data.products || defaultProducts;
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(list));
        renderProducts(list);
      }).fail(function () {
        renderProducts(defaultProducts);
      });
    }
  });
});
