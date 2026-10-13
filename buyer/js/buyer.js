/**
 * ===================================================
 * SHOPNOW - CUSTOMER / BUYER MODULE CONTROLLER
 * Powers Dashboard, Catalog, Product Details, & Wishlist
 * ===================================================
 */

$(document).ready(function () {
  'use strict';

  const PRODUCTS_API = 'https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/products';
  const STORAGE_PRODUCTS_KEY = 'shopnow_products';
  const STORAGE_WISHLIST_KEY = 'shopnow_wishlist';
  const STORAGE_CART_KEY = 'shopnow_cart';
  const STORAGE_USER_KEY = 'shopnow_current_user';

  // Fallback Full Product Catalog (Matching the exact 8 Figma products)
  const defaultProducts = [
    {
      id: 101,
      brand: 'AERFORM',
      title: 'Textured Cashmere Blend Sweater',
      category: 'Sweaters',
      price: 189.00,
      rating: 4.8,
      reviews: 124,
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png'
    },
    {
      id: 102,
      brand: 'LUMEN',
      title: 'Over-Ear Noise Canceling Headphones',
      category: 'Audio',
      price: 199.00,
      rating: 4.9,
      reviews: 88,
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_1_dtjolj.png'
    },
    {
      id: 103,
      brand: 'KIN HOME',
      title: 'Sculptural Ceramic Table Lamp',
      category: 'Decor',
      price: 145.00,
      rating: 4.7,
      reviews: 42,
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png'
    },
    {
      id: 104,
      brand: 'RIVIERA',
      title: 'Structured Leather Shoulder Bag',
      category: 'Accessories',
      price: 175.00,
      rating: 4.6,
      reviews: 210,
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png'
    },
    {
      id: 105,
      brand: 'AERFORM',
      title: 'Aeroflex Pro Runner Sneakers',
      category: 'Footwear',
      price: 140.00,
      rating: 4.8,
      reviews: 56,
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_4_dh5fbk.png'
    },
    {
      id: 106,
      brand: 'LUMEN',
      title: 'Hydration Serum & Body Oil',
      category: 'Skincare',
      price: 48.00,
      rating: 4.9,
      reviews: 310,
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_5_mqgoba.png'
    },
    {
      id: 107,
      brand: 'NOMAD',
      title: 'Expandable Carry-On Suitcase',
      category: 'Luggage',
      price: 220.00,
      rating: 4.9,
      reviews: 512,
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_6_vvdraq.png'
    },
    {
      id: 108,
      brand: 'SONORA AUDIO',
      title: 'Mini 360 Portable Tech Speaker',
      category: 'Portable Tech',
      price: 95.00,
      rating: 4.7,
      reviews: 94,
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_7_radxl9.png'
    }
  ];

  // Scoped User Helpers for Buyer Cart & Wishlist
  function getCurrentBuyer() {
    return (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null) || JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null');
  }

  function getBuyerWishlist() {
    const user = getCurrentBuyer();
    if (!user || !user.email) return [];
    if (typeof ShopNowCommon !== 'undefined' && ShopNowCommon.getUserWishlist) {
      const list = ShopNowCommon.getUserWishlist(user);
      if (list && list.length > 0) return list;
    }
    // Only seed for demo buyer
    if (user.email.toLowerCase() === 'buyer@demo.com') {
      const initialWishlist = [
        defaultProducts[6], // Suitcase
        defaultProducts[7], // Speaker
        defaultProducts[1], // Headphones
        defaultProducts[4]  // Runner shoes
      ];
      if (typeof ShopNowCommon !== 'undefined' && ShopNowCommon.saveUserWishlist) {
        ShopNowCommon.saveUserWishlist(initialWishlist, user);
      } else {
        localStorage.setItem(`shopnow_wishlist_${user.email.toLowerCase()}`, JSON.stringify(initialWishlist));
      }
      return initialWishlist;
    }
    return [];
  }

  function saveBuyerWishlist(wishlist) {
    const user = getCurrentBuyer();
    if (!user || !user.email) return;
    if (typeof ShopNowCommon !== 'undefined' && ShopNowCommon.saveUserWishlist) {
      ShopNowCommon.saveUserWishlist(wishlist, user);
    } else {
      localStorage.setItem(`shopnow_wishlist_${user.email.toLowerCase()}`, JSON.stringify(wishlist));
    }
    if (window.ShopNowHeader && window.ShopNowHeader.updateWishlistBadge) {
      window.ShopNowHeader.updateWishlistBadge(wishlist.length);
    }
  }

  function getBuyerCart() {
    const user = getCurrentBuyer();
    if (!user || !user.email) return [];
    if (typeof ShopNowCommon !== 'undefined' && ShopNowCommon.getUserCart) {
      const list = ShopNowCommon.getUserCart(user);
      if (list && list.length > 0) return list;
    }
    // Only seed for demo buyer
    if (user.email.toLowerCase() === 'buyer@demo.com') {
      const initialCart = [
        {
          id: 104,
          title: 'Structured Leather Daypack',
          variant: 'Midnight navy • Standard',
          price: 175.00,
          quantity: 1,
          image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png'
        },
        {
          id: 105,
          title: 'Aeroflex Pro Runner',
          variant: 'Soft white • Size 9',
          price: 140.00,
          quantity: 1,
          image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_4_dh5fbk.png'
        },
        {
          id: 101,
          title: 'Textured Cashmere Blend Sweater',
          variant: 'Oatmeal • 50 x 60 in',
          price: 189.00,
          quantity: 1,
          image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png'
        }
      ];
      if (typeof ShopNowCommon !== 'undefined' && ShopNowCommon.saveUserCart) {
        ShopNowCommon.saveUserCart(initialCart, user);
      } else {
        localStorage.setItem(`shopnow_cart_${user.email.toLowerCase()}`, JSON.stringify(initialCart));
      }
      return initialCart;
    }
    return [];
  }

  function saveBuyerCart(cart) {
    const user = getCurrentBuyer();
    if (!user || !user.email) return;
    if (typeof ShopNowCommon !== 'undefined' && ShopNowCommon.saveUserCart) {
      ShopNowCommon.saveUserCart(cart, user);
    } else {
      localStorage.setItem(`shopnow_cart_${user.email.toLowerCase()}`, JSON.stringify(cart));
    }
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (window.ShopNowHeader && window.ShopNowHeader.updateCartBadge) {
      window.ShopNowHeader.updateCartBadge(totalCount);
    }
  }

  // Helper: Get Cached or Default Products (Instant 0ms Load with Background Sync)
  function getProducts(callback) {
    let initial = defaultProducts;
    const cached = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initial = parsed;
        }
      } catch (e) {}
    } else {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(defaultProducts));
    }
    
    // Call callback immediately with initial data for instant UI rendering
    callback(initial);

    // Sync in background without blocking
    $.getJSON(PRODUCTS_API, function (data) {
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
        callback(merged);
      }
    });
  }

  // Common Cart Helper
  function addToCart(product, quantity = 1) {
    const user = getCurrentBuyer();
    if (!user || !user.email) {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Please sign in to add items to your cart', 'info');
      }
      setTimeout(function () {
        window.location.href = '../../common/html/login.html?redirect=cart';
      }, 1000);
      return;
    }
    let cart = getBuyerCart();
    const existing = cart.find(item => item.id == product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + quantity;
    } else {
      cart.push({ ...product, quantity: quantity });
    }
    saveBuyerCart(cart);

    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast(`Added "${product.title}" to cart!`, 'success');
    }
  }

  // ===================================================
  // 1. PAGE: CUSTOMER DASHBOARD (YOUR ACCOUNT)
  // ===================================================
  if ($('#customerNameText').length) {
    const user = JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null');
    const name = user && user.name ? user.name : 'Alex Johnson';
    $('#customerNameText').text(name);
    $('#securityNameInput').val(name);
    if (user && user.email) $('#securityEmailInput').val(user.email);

    $('#btnSaveSecurity').on('click', function () {
      const newName = $('#securityNameInput').val().trim();
      const newEmail = $('#securityEmailInput').val().trim();
      if (newName) {
        const updated = user || { role: 'buyer' };
        updated.name = newName;
        updated.email = newEmail;
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
        $('#customerNameText').text(newName);
        bootstrap.Modal.getInstance(document.getElementById('securityModal')).hide();
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Account details updated successfully!', 'success');
        }
      }
    });
  }

  // ===================================================
  // 2. PAGE: PRODUCT LISTING (CATALOG & FILTERS)
  // ===================================================
  if ($('#catalogProductsContainer').length) {
    let allCatalogProducts = [];

    getProducts(function (prods) {
      allCatalogProducts = prods.map((p, idx) => {
        let cat = p.category;
        if (!cat || /^category\s*\d*$/i.test(cat)) {
          const idNum = parseInt(String(p.id).replace(/\D/g, '')) || idx;
          const fallbackCats = ['Sweaters', 'Audio', 'Decor', 'Accessories', 'Footwear', 'Skincare', 'Luggage', 'Portable Tech'];
          cat = fallbackCats[idNum % fallbackCats.length];
        }
        let img = p.image;
        if (!img || img.includes('placeholder') || img.length < 15 || !img.startsWith('http')) {
          img = defaultProducts[idx % defaultProducts.length].image;
        }
        return { ...p, category: cat, image: img };
      });
      applyCatalogFilters();
    });

    // Parse URL Params (e.g. ?category=audio or ?q=headphones or ?brand=AERFORM or ?filter=deals)
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('q');
    const categoryParam = urlParams.get('category');
    const brandParam = urlParams.get('brand');
    const filterParam = urlParams.get('filter');

    if (searchParam) {
      $('#siteSearchInput').val(searchParam);
    }
    if (brandParam) {
      $('#siteSearchInput').val(brandParam);
    }

    if (categoryParam && categoryParam !== 'all') {
      const catLower = categoryParam.toLowerCase();
      $('#categoryFiltersList input[type="checkbox"]').prop('checked', false);
      let matched = false;
      $('#categoryFiltersList input[type="checkbox"]').each(function () {
        const val = ($(this).val() || '').toLowerCase();
        if (val !== 'all' && (
          val.includes(catLower) || catLower.includes(val) ||
          (catLower === 'fashion' && (val === 'sweaters' || val === 'accessories' || val === 'footwear')) ||
          (catLower === 'electronics' && (val === 'audio' || val === 'portable tech')) ||
          (catLower === 'home' && val === 'decor') ||
          (catLower === 'beauty' && val === 'skincare') ||
          (catLower === 'sports' && (val === 'footwear' || val === 'luggage')) ||
          (catLower === 'luxury' && (val === 'accessories' || val === 'sweaters'))
        )) {
          $(this).prop('checked', true);
          matched = true;
        }
      });
      if (!matched) {
        $('#categoryFiltersList input[value="all"]').prop('checked', true);
      }
      if (window.ShopNowHeader && window.ShopNowHeader.setActiveCategory) {
        window.ShopNowHeader.setActiveCategory(catLower);
      }
    } else if (categoryParam === 'all') {
      if (window.ShopNowHeader && window.ShopNowHeader.setActiveCategory) {
        window.ShopNowHeader.setActiveCategory('trending');
      }
    }

    function applyCatalogFilters() {
      let filtered = [...allCatalogProducts];

      // 0. Quick filter param (e.g., deals, new, best)
      if (filterParam === 'deals' || categoryParam === 'deals') {
        filtered = filtered.filter(p => p.oldPrice || (p.badge && p.badge.includes('OFF')));
      } else if (filterParam === 'new') {
        const newOnes = filtered.filter(p => p.badge && p.badge.toLowerCase().includes('new'));
        if (newOnes.length > 0) filtered = newOnes;
      } else if (filterParam === 'best') {
        filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
      }

      // 1. Search Query Filter / Brand Filter
      const q = ($('#siteSearchInput').val() || '').toLowerCase().trim();
      if (q) {
        filtered = filtered.filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      }

      // 2. Category Checkboxes
      const selectedCats = [];
      $('#categoryFiltersList input[type="checkbox"]:checked').each(function () {
        selectedCats.push($(this).val());
      });

      if (!selectedCats.includes('all') && selectedCats.length > 0) {
        filtered = filtered.filter(p =>
          selectedCats.some(cat => (p.category || '').toLowerCase().includes(cat.toLowerCase()))
        );
      }

      // 3. Price Filter
      const minPrice = parseFloat($('#minPriceInput').val());
      const maxPrice = parseFloat($('#maxPriceInput').val());
      if (!isNaN(minPrice)) filtered = filtered.filter(p => Number(p.price) >= minPrice);
      if (!isNaN(maxPrice)) filtered = filtered.filter(p => Number(p.price) <= maxPrice);

      // 4. Rating Radio
      const minRating = parseFloat($('input[name="ratingFilter"]:checked').val()) || 0;
      if (minRating > 0) {
        filtered = filtered.filter(p => Number(p.rating) >= minRating);
      }

      // 5. Sorting
      const sortVal = $('#sortSelect').val();
      if (sortVal === 'price-low') {
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortVal === 'price-high') {
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sortVal === 'rating') {
        filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
      }

      renderCatalogGrid(filtered, 1);
    }

    let currentCatalogPage = 1;
    const catalogPageSize = 8;
    let filteredCatalogProds = [];

    function renderCatalogGrid(prods, page) {
      if (prods !== undefined) filteredCatalogProds = prods;
      if (page !== undefined) currentCatalogPage = page;

      const $container = $('#catalogProductsContainer');
      const $title = $('#catalogResultsTitle');

      $title.text(`${filteredCatalogProds.length} results for ${$('#siteSearchInput').val() || 'all items'}`);

      if (filteredCatalogProds.length === 0) {
        $container.html(`
          <div class="col-12 text-center py-5">
            <h5 class="text-muted font-serif">No products found matching your filter criteria.</h5>
            <button class="btn btn-sm btn-coral-custom mt-3" id="btnResetAllFiltersEmpty">Reset Filters</button>
          </div>
        `);
        $('.catalog-pagination').addClass('d-none');
        return;
      }

      const pInfo = ShopNowCommon.paginate(filteredCatalogProds, currentCatalogPage, catalogPageSize);
      currentCatalogPage = pInfo.currentPage;

      const currentWishlist = getBuyerWishlist();

      let html = '';
      pInfo.pageItems.forEach(p => {
        const ratingVal = p.rating ? Number(p.rating).toFixed(1) : '4.8';
        const priceVal = Number(p.price).toLocaleString('en-IN');
        const isWishlisted = currentWishlist.some(w => String(w.id) === String(p.id));

        html += `
          <div class="col-6 col-md-4 col-xl-3">
            <div class="catalog-product-card">
              <div class="position-relative">
                <button type="button" class="catalog-wish-btn btn-catalog-wish ${isWishlisted ? 'active' : ''}" data-id="${p.id}" aria-label="Add to Wishlist" title="${isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}">
                  <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
                <a href="product-details.html?id=${p.id}" class="catalog-product-thumb d-block">
                  <img src="${p.image}" alt="${p.title}" />
                </a>
                <span class="catalog-brand-tag">${p.brand || 'SHOPNOW'}</span>
                <a href="product-details.html?id=${p.id}" class="catalog-product-name">${p.title}</a>
                <div class="catalog-rating-row">
                  <i class="bi bi-star-fill text-warning"></i>
                  <span>${ratingVal}</span>
                </div>
                <div class="catalog-price-val">₹ ${priceVal}</div>
              </div>
              <button type="button" class="btn-coral-add-cart btn-quick-add" data-id="${p.id}">
                <i class="bi bi-cart-plus me-1"></i>Add to Cart
              </button>
            </div>
          </div>
        `;
      });

      $container.html(html);

      // Render Dynamic Catalog Pagination
      const $pag = $('.catalog-pagination');
      if ($pag.length) {
        $pag.removeClass('d-none');
        let pagHtml = '';
        const prevDisabled = currentCatalogPage <= 1;
        pagHtml += `<button class="page-btn-item page-catalog-prev" ${prevDisabled ? 'disabled' : ''}>&lt;</button>`;

        for (let i = 1; i <= pInfo.totalPages; i++) {
          pagHtml += `<button class="page-btn-item page-catalog-num ${i === currentCatalogPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        const nextDisabled = currentCatalogPage >= pInfo.totalPages;
        pagHtml += `<button class="page-btn-item page-catalog-next" ${nextDisabled ? 'disabled' : ''}>&gt;</button>`;
        $pag.html(pagHtml);

        $pag.off('click', '.page-catalog-prev').on('click', '.page-catalog-prev', function () {
          if (currentCatalogPage > 1) {
            renderCatalogGrid(filteredCatalogProds, currentCatalogPage - 1);
            const el = document.getElementById('catalogProductsContainer');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
        $pag.off('click', '.page-catalog-next').on('click', '.page-catalog-next', function () {
          if (currentCatalogPage < pInfo.totalPages) {
            renderCatalogGrid(filteredCatalogProds, currentCatalogPage + 1);
            const el = document.getElementById('catalogProductsContainer');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
        $pag.off('click', '.page-catalog-num').on('click', '.page-catalog-num', function () {
          const pg = parseInt($(this).data('page'), 10);
          if (pg && pg !== currentCatalogPage) {
            renderCatalogGrid(filteredCatalogProds, pg);
            const el = document.getElementById('catalogProductsContainer');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    }

    // Filter Events
    $('#categoryFiltersList input[type="checkbox"]').on('change', function () {
      if ($(this).val() === 'all' && $(this).is(':checked')) {
        $('#categoryFiltersList input[type="checkbox"]').not(this).prop('checked', false);
      } else if ($(this).val() !== 'all' && $(this).is(':checked')) {
        $('#categoryFiltersList input[value="all"]').prop('checked', false);
      }
      applyCatalogFilters();
    });

    $('#btnApplyPriceFilter').on('click', applyCatalogFilters);
    $('input[name="ratingFilter"]').on('change', applyCatalogFilters);
    $('#sortSelect').on('change', applyCatalogFilters);

    $('#btnResetFilters, $(document)').on('click', '#btnResetAllFiltersEmpty', function () {
      $('#categoryFiltersList input[type="checkbox"]').prop('checked', false);
      $('#categoryFiltersList input[value="all"]').prop('checked', true);
      $('#minPriceInput').val('');
      $('#maxPriceInput').val('');
      $('input[name="ratingFilter"][value="0"]').prop('checked', true);
      $('#sortSelect').val('featured');
      applyCatalogFilters();
    });

    // Add to Cart Click from Catalog
    $(document).on('click', '.btn-quick-add', function (e) {
      e.preventDefault();
      const rawId = $(this).attr('data-id') || $(this).data('id');
      const id = String(rawId);
      let prod = allCatalogProducts.find(p => String(p.id) === id);
      if (!prod) {
        const cached = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS_KEY) || '[]');
        prod = cached.find(p => String(p.id) === id);
      }
      if (!prod) {
        prod = defaultProducts.find(p => String(p.id) === id);
      }
      if (prod) {
        addToCart(prod, 1);
      } else {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Product not found', 'error');
        }
      }
    });

    // Add to Wishlist Toggle from Catalog
    $(document).on('click', '.btn-catalog-wish', function (e) {
      e.preventDefault();
      const $btn = $(this);
      const rawId = $btn.attr('data-id') || $btn.data('id');
      const id = String(rawId);

      const user = getCurrentBuyer();
      if (!user || !user.email) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Please sign in to save items to your wishlist', 'info');
        }
        setTimeout(function () {
          window.location.href = '../../common/html/login.html?redirect=catalog';
        }, 1000);
        return;
      }

      let prod = allCatalogProducts.find(p => String(p.id) === id);
      if (!prod) {
        const cached = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS_KEY) || '[]');
        prod = cached.find(p => String(p.id) === id);
      }
      if (!prod) {
        prod = defaultProducts.find(p => String(p.id) === id);
      }
      if (!prod) return;

      let wishlist = getBuyerWishlist();
      const existingIdx = wishlist.findIndex(item => String(item.id) === id);

      if (existingIdx > -1) {
        wishlist.splice(existingIdx, 1);
        saveBuyerWishlist(wishlist);
        $btn.removeClass('active');
        $btn.find('i').removeClass('bi-heart-fill').addClass('bi-heart');
        $btn.attr('title', 'Add to Wishlist');
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast(`Removed "${prod.title}" from Wishlist`, 'info');
        }
      } else {
        wishlist.push(prod);
        saveBuyerWishlist(wishlist);
        $btn.addClass('active');
        $btn.find('i').removeClass('bi-heart').addClass('bi-heart-fill');
        $btn.attr('title', 'In Wishlist');
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast(`Saved "${prod.title}" to Wishlist!`, 'success');
        }
      }
    });
  }

  // ===================================================
  // 3. PAGE: PRODUCT DETAILS
  // ===================================================
  if ($('#detailTitle').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get('id') || '102'; // Default to Headphones from Figma Screen 3

    let currentProduct = defaultProducts.find(p => p.id == prodId) || defaultProducts[1];

    getProducts(function (prods) {
      const found = prods.find(p => p.id == prodId);
      if (found) currentProduct = found;
      hydrateProductDetails(currentProduct);
    });

    function hydrateProductDetails(p) {
      $('#crumbCategory').text(p.category || 'Electronics');
      $('#crumbTitle').text(p.title);
      $('#detailTitle').text(p.title);
      $('#detailRatingText').text(p.rating ? Number(p.rating).toFixed(1) : '4.9');
      $('#detailReviewsCountText').text(`(${p.reviews || 88} reviews)`);
      $('#detailSellerName').text(`${p.brand || 'LUMEN'} Official Store`);
      const priceStr = `$${Number(p.price).toFixed(2)}`;
      $('#detailPriceMain').text(priceStr);
      $('#buyBoxPrice').text(priceStr);
      $('#mainProductImage').attr('src', p.image);

      // Set thumbnails to same image
      $('#detailThumbnailsWrap img').attr('src', p.image);
    }

    // Thumbnail click switch
    $(document).on('click', '.detail-thumb-item', function () {
      $('.detail-thumb-item').removeClass('active');
      $(this).addClass('active');
      const newSrc = $(this).find('img').attr('src');
      $('#mainProductImage').attr('src', newSrc);
    });

    // Buy Box Actions
    $('#btnDetailAddToCart').on('click', function () {
      const qty = parseInt($('#qtySelect').val()) || 1;
      addToCart(currentProduct, qty);
    });

    $('#btnDetailBuyNow').on('click', function () {
      const qty = parseInt($('#qtySelect').val()) || 1;
      addToCart(currentProduct, qty);
      window.location.href = 'catalog.html';
    });

    $('#btnDetailWishlist').on('click', function () {
      const user = getCurrentBuyer();
      if (!user || !user.email) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Please sign in to save items to your wishlist', 'info');
        }
        setTimeout(function () {
          window.location.href = '../../common/html/login.html?redirect=wishlist';
        }, 1000);
        return;
      }
      let wishlist = getBuyerWishlist();
      if (!wishlist.find(item => item.id == currentProduct.id)) {
        wishlist.push(currentProduct);
        saveBuyerWishlist(wishlist);
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast(`Saved "${currentProduct.title}" to Wishlist!`, 'success');
        }
      } else {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast(`"${currentProduct.title}" is already in your Wishlist.`, 'info');
        }
      }
    });

    // Review submission form
    $('#writeReviewForm').on('submit', function (e) {
      e.preventDefault();
      const rating = $('#reviewRatingSelect').val();
      const title = $('#reviewTitleInput').val().trim();
      const text = $('#reviewTextInput').val().trim();

      if (!title || !text) return;

      const user = JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null');
      const author = user && user.name ? user.name : 'Verified Customer';

      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

      const reviewHtml = `
        <div class="single-review-item">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="single-review-title">${title}</h6>
            <div class="small">
              <span class="badge bg-success-subtle text-success">Verified</span>
            </div>
          </div>
          <div class="single-review-meta">
            <i>${stars}</i> &bull; <span>${author} &bull; Just now</span>
          </div>
          <p class="single-review-text">${text}</p>
        </div>
      `;

      $('#reviewsListContainer').prepend(reviewHtml);
      this.reset();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Thank you! Your review has been submitted.', 'success');
      }
    });
  }

  // ===================================================
  // 4. PAGE: WISHLIST (EMPTY & ACTIVE STATES)
  // ===================================================
  if ($('#wishlistItemsContainer').length) {
    function renderWishlist() {
      const user = getCurrentBuyer();
      const wishlist = user ? getBuyerWishlist() : [];
      const $empty = $('#wishlistEmptyState');
      const $active = $('#wishlistActiveState');
      const $container = $('#wishlistItemsContainer');
      const $counter = $('#wishlistItemsCountHeader');

      if (window.ShopNowHeader) {
        window.ShopNowHeader.updateWishlistBadge(wishlist.length);
      }

      if (wishlist.length === 0) {
        $active.addClass('d-none');
        $empty.removeClass('d-none');
        return;
      }

      $empty.addClass('d-none');
      $active.removeClass('d-none');
      $counter.text(`${wishlist.length} saved item${wishlist.length > 1 ? 's' : ''}`);

      let html = '';
      wishlist.forEach(item => {
        html += `
          <div class="col-6 col-md-4 col-lg-3" id="wishItem-${item.id}">
            <div class="wishlist-item-card">
              <div>
                <a href="product-details.html?id=${item.id}" class="wishlist-thumb-box d-block">
                  <img src="${item.image}" alt="${item.title}" />
                </a>
                <a href="product-details.html?id=${item.id}" class="wishlist-item-name text-decoration-none text-dark d-block text-truncate">
                  ${item.title}
                </a>
                <div class="wishlist-price-line">
                  <span class="wishlist-price-val">$${Number(item.price).toFixed(2)}</span>
                  <span class="wishlist-in-stock">In stock</span>
                </div>
              </div>
              <div>
                <button type="button" class="btn-coral-add-cart btn-wishlist-cart" data-id="${item.id}">
                  Add to Cart
                </button>
                <button type="button" class="wishlist-remove-btn" data-id="${item.id}">
                  Remove
                </button>
              </div>
            </div>
          </div>
        `;
      });

      $container.html(html);
    }

    renderWishlist();

    // Wishlist Add to Cart
    $(document).on('click', '.btn-wishlist-cart', function () {
      const id = $(this).data('id');
      const wishlist = getBuyerWishlist();
      const item = wishlist.find(p => p.id == id);
      if (item) addToCart(item, 1);
    });

    // Wishlist Remove Item
    $(document).on('click', '.wishlist-remove-btn', function () {
      const id = $(this).data('id');
      let wishlist = getBuyerWishlist();
      wishlist = wishlist.filter(p => p.id != id);
      saveBuyerWishlist(wishlist);
      renderWishlist();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Item removed from your wishlist.', 'info');
      }
    });
  }

  // ===================================================
  // SEED HELPERS: DEFAULT CART & ORDERS DATA
  // ===================================================
  const STORAGE_ORDERS_KEY = 'shopnow_orders';
  const STORAGE_RETURNS_KEY = 'shopnow_returns';

  // Seed default orders matching Figma Screen 4 center (scoped to demo buyer)
  function initDefaultOrders() {
    if (!localStorage.getItem(STORAGE_ORDERS_KEY)) {
      const sampleOrders = [
        {
          orderId: 'SN-98241',
          buyerEmail: 'buyer@demo.com',
          date: 'Oct 08, 2026',
          total: 504.00,
          status: 'Delivered',
          statusClass: 'delivered',
          shipTo: 'Alex Johnson',
          address: '742 Evergreen Terrace, Apt 4B, Springfield, OR 97477',
          items: [
            {
              id: 104,
              title: 'Structured Leather Daypack',
              variant: 'Midnight navy &bull; Standard',
              price: 175.00,
              quantity: 1,
              image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png'
            },
            {
              id: 105,
              title: 'Aeroflex Pro Runner',
              variant: 'Soft white &bull; Size 9',
              price: 140.00,
              quantity: 1,
              image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_4_dh5fbk.png'
            },
            {
              id: 101,
              title: 'Textured Cashmere Blend Sweater',
              variant: 'Oatmeal &bull; 50 x 60 in',
              price: 189.00,
              quantity: 1,
              image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png'
            }
          ]
        },
        {
          orderId: 'SN-98104',
          buyerEmail: 'buyer@demo.com',
          date: 'Oct 12, 2026',
          total: 189.00,
          status: 'On the way &bull; Expected Oct 16',
          statusClass: 'in-transit',
          shipTo: 'Alex Johnson',
          address: '742 Evergreen Terrace, Apt 4B, Springfield, OR 97477',
          items: [
            {
              id: 101,
              title: 'Textured Cashmere Blend Sweater',
              variant: 'Oatmeal &bull; 50 x 60 in',
              price: 189.00,
              quantity: 1,
              image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png'
            }
          ]
        },
        {
          orderId: 'SN-97552',
          buyerEmail: 'buyer@demo.com',
          date: 'Sep 24, 2026',
          total: 145.00,
          status: 'Delivered',
          statusClass: 'delivered',
          shipTo: 'Alex Johnson',
          address: '742 Evergreen Terrace, Apt 4B, Springfield, OR 97477',
          items: [
            {
              id: 103,
              title: 'Sculptural Ceramic Table Lamp',
              variant: 'Warm Ivory &bull; 18 in',
              price: 145.00,
              quantity: 1,
              image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png'
            }
          ]
        }
      ];
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(sampleOrders));
    }
  }

  function getBuyerOrders() {
    const user = getCurrentBuyer();
    if (!user || !user.email) return [];
    if (!localStorage.getItem(STORAGE_ORDERS_KEY) && user.email.toLowerCase() === 'buyer@demo.com') {
      initDefaultOrders();
    }
    const allOrders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
    return allOrders.filter(function (o) {
      if (user.email.toLowerCase() === 'buyer@demo.com') {
        return !o.buyerEmail || o.buyerEmail.toLowerCase() === 'buyer@demo.com';
      }
      return o.buyerEmail && o.buyerEmail.toLowerCase() === user.email.toLowerCase();
    });
  }

  // ===================================================
  // 5. PAGE: CART (EMPTY & POPULATED CONTROLLER)
  // ===================================================
  if ($('#cartItemsListContainer').length || $('#cartEmptyState').length) {
    function renderCartPage() {
      const user = getCurrentBuyer();
      const cart = user ? getBuyerCart() : [];
      const $empty = $('#cartEmptyState');
      const $populated = $('#cartPopulatedState');
      const $list = $('#cartItemsListContainer');
      const $headerCount = $('#cartItemsHeaderCount');
      const $footerCount = $('#cartSubtotalFooterLabel');
      const $footerVal = $('#cartSubtotalFooterVal');
      const $summarySubtotal = $('#summarySubtotalVal');

      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const subtotalPrice = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

      if (window.ShopNowHeader) {
        window.ShopNowHeader.updateCartBadge(totalItems);
      }

      if (cart.length === 0) {
        $populated.addClass('d-none');
        $empty.removeClass('d-none');
        return;
      }

      $empty.addClass('d-none');
      $populated.removeClass('d-none');

      $headerCount.text(`${totalItems} item${totalItems > 1 ? 's' : ''}`);
      $footerCount.text(`Subtotal (${totalItems} item${totalItems > 1 ? 's' : ''}):`);
      $footerVal.text(`$${subtotalPrice.toFixed(2)}`);
      $summarySubtotal.text(`$${subtotalPrice.toFixed(2)}`);

      let html = '';
      cart.forEach((item, idx) => {
        const itemTotal = (Number(item.price) * (item.quantity || 1)).toFixed(2);
        const variantText = item.variant || 'Standard';

        html += `
          <div class="cart-item-row" data-id="${item.id}">
            <a href="product-details.html?id=${item.id}" class="cart-item-thumb-box">
              <img src="${item.image}" alt="${item.title}" />
            </a>
            <div class="cart-item-details">
              <a href="product-details.html?id=${item.id}" class="cart-item-title">${item.title}</a>
              <div class="cart-item-variant">${variantText}</div>
              <div class="cart-item-stock-tag">
                <span class="cart-stock-dot"></span>
                <span>In stock</span>
              </div>
              <div class="cart-actions-links">
                <button type="button" class="cart-action-link btn-cart-delete" data-id="${item.id}">Delete</button>
                <button type="button" class="cart-action-link btn-cart-wishlist" data-id="${item.id}">Move to wishlist</button>
              </div>
            </div>
            <div class="cart-qty-wrapper">
              <span class="cart-qty-label">Quantity</span>
              <select class="cart-qty-select" data-id="${item.id}">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `<option value="${n}" ${n == (item.quantity || 1) ? 'selected' : ''}>${n}</option>`).join('')}
              </select>
            </div>
            <div class="cart-item-price-val">$${itemTotal}</div>
          </div>
        `;
      });

      $list.html(html);
    }

    renderCartPage();

    // Quantity Change
    $(document).on('change', '.cart-qty-select', function () {
      const id = $(this).data('id');
      const newQty = parseInt($(this).val(), 10) || 1;
      let cart = getBuyerCart();
      const item = cart.find(p => p.id == id);
      if (item) {
        item.quantity = newQty;
        saveBuyerCart(cart);
        renderCartPage();
      }
    });

    // Delete item from cart
    $(document).on('click', '.btn-cart-delete', function () {
      const id = $(this).data('id');
      let cart = getBuyerCart();
      cart = cart.filter(p => p.id != id);
      saveBuyerCart(cart);
      renderCartPage();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Item removed from cart.', 'info');
      }
    });

    // Move to wishlist
    $(document).on('click', '.btn-cart-wishlist', function () {
      const id = $(this).data('id');
      let cart = getBuyerCart();
      const item = cart.find(p => p.id == id);
      if (item) {
        let wishlist = getBuyerWishlist();
        if (!wishlist.some(w => w.id == id)) {
          wishlist.push({ ...item });
          saveBuyerWishlist(wishlist);
        }
        cart = cart.filter(p => p.id != id);
        saveBuyerCart(cart);
        renderCartPage();
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast(`Moved "${item.title}" to wishlist!`, 'success');
        }
      }
    });
  }

  // ===================================================
  // 6. PAGE: CHECKOUT CONTROLLER
  // ===================================================
  if ($('#checkoutReviewItemsContainer').length) {
    const user = getCurrentBuyer();
    if (!user || !user.email) {
      window.location.href = '../../common/html/login.html?redirect=cart';
      return;
    }
    const cart = getBuyerCart();
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

    $('#checkoutItemsPrice').text(`$${subtotal.toFixed(2)}`);
    $('#checkoutTotalPrice').text(`$${subtotal.toFixed(2)}`);

    // Render review items
    let reviewHtml = '';
    if (cart.length === 0) {
      reviewHtml = '<p class="text-muted small">No items in cart.</p>';
    } else {
      cart.forEach(item => {
        reviewHtml += `
          <div class="checkout-review-item">
            <div class="checkout-review-thumb">
              <img src="${item.image}" alt="${item.title}" />
            </div>
            <div class="flex-grow-1">
              <h6 class="mb-1 fw-bold text-dark fs-6">${item.title}</h6>
              <span class="small text-muted">Qty: ${item.quantity || 1}</span>
            </div>
            <div class="fw-bold text-dark fs-6">
              $${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
            </div>
          </div>
        `;
      });
    }
    $('#checkoutReviewItemsContainer').html(reviewHtml);

    // Address card selection
    $(document).on('click', '.address-choice-card', function () {
      $('.address-choice-card').removeClass('selected').find('input[type="radio"]').prop('checked', false);
      $(this).addClass('selected').find('input[type="radio"]').prop('checked', true);
    });

    // Payment method radio selection
    $(document).on('click', '.payment-method-item', function () {
      $('.payment-method-item').removeClass('selected').find('input[type="radio"]').prop('checked', false);
      $(this).addClass('selected').find('input[type="radio"]').prop('checked', true);
    });

    // Place Order Button Click -> redirect to payment
    $('#btnPlaceOrder').on('click', function () {
      const orderNum = 'SN-' + Math.floor(10000 + Math.random() * 90000);
      const chosenAddr = $('.address-choice-card.selected').data('address') || 'home';
      
      const orderData = {
        orderId: orderNum,
        buyerEmail: user.email,
        buyerName: user.name || 'Alex Johnson',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        total: subtotal > 0 ? subtotal : 504.00,
        status: 'In transit',
        statusClass: 'in-transit',
        shipTo: chosenAddr === 'home' ? (user.name || 'Alex Johnson') : `${user.name || 'Alex Johnson'} (Tech Hub)`,
        address: chosenAddr === 'home' ? '742 Evergreen Terrace, Apt 4B, Springfield, OR 97477' : '500 Innovation Way, Suite 120, San Francisco, CA 94105',
        items: cart.length > 0 ? cart : [
          {
            id: 105,
            title: 'Aeroflex Pro Runner',
            variant: 'Soft white &bull; Size 9',
            price: 140.00,
            quantity: 1,
            image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_4_dh5fbk.png'
          }
        ]
      };

      localStorage.setItem('shopnow_pending_order', JSON.stringify(orderData));
      window.location.href = `payment.html?orderId=${orderNum}&amount=${orderData.total.toFixed(2)}`;
    });

    // Add new address form handler
    $('#newAddressForm').on('submit', function (e) {
      e.preventDefault();
      const name = $('#modalAddrName').val().trim();
      const street = $('#modalAddrStreet').val().trim();
      const city = $('#modalAddrCity').val().trim();
      const pin = $('#modalAddrPin').val().trim();
      const phone = $('#modalAddrPhone').val().trim();

      const newAddrHtml = `
        <div class="col-12 col-md-6">
          <div class="address-choice-card selected" data-address="custom">
            <div class="address-choice-header">
              <input class="form-check-input mt-0 border-coral" type="radio" name="deliveryAddressRadio" checked />
              <label class="mb-0 cursor-pointer">Custom Address</label>
            </div>
            <div class="address-choice-body">
              <strong class="d-block text-dark fw-bold">${name}</strong>
              <div>${street}</div>
              <div>${city}, ${pin}</div>
              <div class="text-muted small mt-1">${phone}</div>
            </div>
          </div>
        </div>
      `;

      $('.address-choice-card').removeClass('selected').find('input[type="radio"]').prop('checked', false);
      $('#addressCardsRow').append(newAddrHtml);
      bootstrap.Modal.getInstance(document.getElementById('addNewAddressModal')).hide();
      this.reset();

      if (typeof ShopNowAPI !== 'undefined') {
        ShopNowAPI.createAddress({
          name: name,
          street: street,
          city: city,
          pincode: pin,
          phone: phone,
          type: 'Custom'
        });
      }

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Delivery address added!', 'success');
      }
    });
  }

  // ===================================================
  // 7. PAGE: PAYMENT GATEWAY CONTROLLER
  // ===================================================
  if ($('#paymentGatewayForm').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId') || 'SN-98241';
    const amountParam = urlParams.get('amount') || '504.00';

    $('#paymentHeadingTitle').text(`Pay for order #${orderIdParam}`);
    $('#paymentOrderNumLabel').text(`Order #${orderIdParam}`);
    $('#paymentOrderAmount').text(`$${Number(amountParam).toFixed(2)}`);

    // Format Card Number (auto space every 4 digits)
    $('#cardNumberInput').on('input', function () {
      let val = $(this).val().replace(/\D/g, '');
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      $(this).val(formatted);

      if (val.startsWith('4')) {
        $('#cardBrandIcon').html('<span class="badge bg-primary text-white">VISA</span>');
      } else if (val.startsWith('5')) {
        $('#cardBrandIcon').html('<span class="badge bg-danger text-white">Mastercard</span>');
      } else {
        $('#cardBrandIcon').html('<i class="bi bi-credit-card-2-front fs-5"></i>');
      }
    });

    // Format Expiry MM / YY
    $('#cardExpiryInput').on('input', function () {
      let val = $(this).val().replace(/\D/g, '');
      if (val.length > 2) {
        $(this).val(val.slice(0, 2) + ' / ' + val.slice(2, 4));
      } else {
        $(this).val(val);
      }
    });

    // Form submit
    $('#paymentGatewayForm').on('submit', function (e) {
      e.preventDefault();
      const outcome = $('input[name="demoOutcomeRadio"]:checked').val() || 'success';
      const $btn = $('#btnPayNowSubmit');
      $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Processing payment...');

      setTimeout(function () {
        if (outcome === 'success') {
          // Commit order to orders list and clear user cart
          const pending = JSON.parse(localStorage.getItem('shopnow_pending_order') || 'null');
          let orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
          if (pending) {
            orders.unshift(pending);
            localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
            if (typeof ShopNowAPI !== 'undefined') {
              ShopNowAPI.createOrder(pending);
            }
            localStorage.removeItem('shopnow_pending_order');
          }
          saveBuyerCart([]);
          localStorage.removeItem(STORAGE_CART_KEY);
          if (window.ShopNowHeader) {
            window.ShopNowHeader.updateCartBadge(0);
          }
          window.location.href = `payment-success.html?orderId=${orderIdParam}&amount=${amountParam}`;
        } else {
          window.location.href = `payment-failed.html?orderId=${orderIdParam}&amount=${amountParam}`;
        }
      }, 900);
    });
  }

  // ===================================================
  // 8. PAGES: PAYMENT SUCCESS & FAILED CONTROLLER
  // ===================================================
  if ($('#successOrderNumLabel').length || $('#failedOrderNumLabel').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId') || 'SN-98241';
    const amountParam = urlParams.get('amount') || '504.00';

    if ($('#successOrderNumLabel').length) {
      $('#successOrderNumLabel').text(`Order #${orderIdParam}`);
      $('#successOrderAmount').text(`$${Number(amountParam).toFixed(2)}`);
      $('#btnSuccessViewOrder').attr('href', `order-confirmation.html?orderId=${orderIdParam}`);
    }

    if ($('#failedOrderNumLabel').length) {
      $('#failedOrderNumLabel').text(`Order #${orderIdParam}`);
      $('#failedOrderAmount').text(`$${Number(amountParam).toFixed(2)}`);
      $('#btnFailedTryAgain').attr('href', `payment.html?orderId=${orderIdParam}&amount=${amountParam}`);
    }
  }

  // ===================================================
  // 9. PAGE: ORDER CONFIRMATION CONTROLLER
  // ===================================================
  if ($('#confirmOrderedItemsList').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId') || 'SN-98241';
    const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
    const currentOrder = orders.find(o => o.orderId == orderIdParam) || orders[0] || {
      orderId: orderIdParam,
      total: 504.00,
      items: [
        {
          id: 104,
          title: 'Structured Leather Daypack',
          variant: 'Midnight navy &bull; Standard',
          price: 175.00,
          quantity: 1,
          image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png'
        },
        {
          id: 105,
          title: 'Aeroflex Pro Runner',
          variant: 'Soft white &bull; Size 9',
          price: 140.00,
          quantity: 1,
          image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_4_dh5fbk.png'
        },
        {
          id: 101,
          title: 'Textured Cashmere Blend Sweater',
          variant: 'Oatmeal &bull; 50 x 60 in',
          price: 189.00,
          quantity: 1,
          image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png'
        }
      ]
    };

    $('#confirmOrderNumberText').text(`Order #${currentOrder.orderId}`);
    $('#btnConfirmTrackOrder').attr('href', `tracking.html?orderId=${currentOrder.orderId}`);

    let itemsHtml = '';
    currentOrder.items.forEach(item => {
      itemsHtml += `
        <div class="cart-item-row">
          <div class="cart-item-thumb-box" style="width: 72px; height: 72px;">
            <img src="${item.image}" alt="${item.title}" />
          </div>
          <div class="flex-grow-1">
            <h6 class="fw-bold text-dark mb-1 fs-6">${item.title}</h6>
            <span class="small text-muted d-block">${item.variant || 'Standard'} &bull; Qty: ${item.quantity || 1}</span>
          </div>
          <div class="fw-bold text-dark fs-6">
            $${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
          </div>
        </div>
      `;
    });
    $('#confirmOrderedItemsList').html(itemsHtml);
  }

  // ===================================================
  // 10. PAGE: ORDER HISTORY (YOUR ORDERS)
  // ===================================================
  if ($('#ordersListContainer').length) {
    function renderOrders(filter = 'all') {
      const user = getCurrentBuyer();
      const $container = $('#ordersListContainer');

      if (!user || !user.email) {
        $container.html('<div class="text-center py-5"><h5 class="text-muted">Please sign in to view your orders.</h5><a href="../../common/html/login.html" class="btn btn-coral mt-3 px-4">Sign In</a></div>');
        return;
      }

      let orders = getBuyerOrders();

      if (filter === 'delivered') {
        orders = orders.filter(o => o.statusClass === 'delivered');
      } else if (filter === 'transit') {
        orders = orders.filter(o => o.statusClass !== 'delivered');
      }

      if (orders.length === 0) {
        $container.html('<div class="text-center py-5"><h5 class="text-muted">You have no orders yet.</h5><a href="catalog.html" class="btn btn-coral mt-3 px-4">Browse catalog</a></div>');
        return;
      }

      let html = '';
      orders.forEach(order => {
        const statusBadgeClass = order.statusClass === 'delivered' ? 'delivered' : 'in-transit';
        const statusIcon = order.statusClass === 'delivered' ? 'bi-check-circle-fill' : 'bi-truck';

        html += `
          <div class="order-history-card">
            <!-- Header Strip -->
            <div class="order-history-header">
              <div class="d-flex flex-wrap gap-4 align-items-center">
                <div class="order-meta-block">
                  <span>Order Placed</span>
                  <strong>${order.date}</strong>
                </div>
                <div class="order-meta-block">
                  <span>Total</span>
                  <strong>$${Number(order.total).toFixed(2)}</strong>
                </div>
                <div class="order-meta-block">
                  <span>Ship To</span>
                  <strong>${order.shipTo}</strong>
                </div>
                <div class="order-meta-block">
                  <span>Order #</span>
                  <strong>${order.orderId}</strong>
                </div>
              </div>
              <div>
                <a href="javascript:void(0)" class="order-invoice-link btn-view-invoice" data-id="${order.orderId}">View invoice &rarr;</a>
              </div>
            </div>

            <!-- Card Body Items -->
            <div class="order-history-body">
              <div class="order-status-pill ${statusBadgeClass}">
                <i class="bi ${statusIcon}"></i>
                <span>${order.status}</span>
              </div>

              ${order.items.map(item => `
                <div class="order-item-history-row mb-3">
                  <a href="product-details.html?id=${item.id}" class="order-history-thumb">
                    <img src="${item.image}" alt="${item.title}" />
                  </a>
                  <div class="order-history-info">
                    <a href="product-details.html?id=${item.id}" class="order-history-title">${item.title}</a>
                    <div class="small text-muted mb-1">${item.variant || 'Standard'} &bull; Qty: ${item.quantity || 1}</div>
                    <div class="fw-bold text-dark fs-6">$${(Number(item.price) * (item.quantity || 1)).toFixed(2)}</div>
                  </div>
                  <div class="order-history-actions">
                    <a href="tracking.html?orderId=${order.orderId}" class="btn-order-action">Track order</a>
                    <button type="button" class="btn-order-action btn-trigger-review" data-title="${item.title}" data-id="${item.id}">Write a review</button>
                    <a href="request-return.html?orderId=${order.orderId}&itemId=${item.id}" class="btn-order-action">Return item</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      });

      $container.html(html);
    }

    renderOrders();

    // Date Filter change
    $('#orderDateFilter').on('change', function () {
      renderOrders($(this).val());
    });

    // Write review modal trigger
    $(document).on('click', '.btn-trigger-review', function () {
      const title = $(this).data('title');
      const id = $(this).data('id');
      $('#orderReviewModalTitle').text(`Review: ${title}`);
      $('#reviewModalProductId').val(id);
      new bootstrap.Modal(document.getElementById('orderReviewModal')).show();
    });

    $('#orderReviewSubmitForm').on('submit', function (e) {
      e.preventDefault();
      bootstrap.Modal.getInstance(document.getElementById('orderReviewModal')).hide();
      this.reset();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Thank you! Your verified product review has been posted.', 'success');
      }
    });

    // View Invoice
    $(document).on('click', '.btn-view-invoice', function (e) {
      e.preventDefault();
      const orderId = $(this).data('id');
      const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
      const order = orders.find(o => o.orderId == orderId) || orders[0];

      const invoiceHtml = `
        <div class="p-3 border rounded-3 bg-light mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 class="fw-bold text-dark mb-0">ShopNow Marketplace</h4>
              <span class="small text-muted">Official Tax Invoice &bull; #INV-${order.orderId}</span>
            </div>
            <div class="text-end">
              <span class="badge bg-success">PAID</span>
              <div class="small text-muted mt-1">Date: ${order.date}</div>
            </div>
          </div>
          <div class="row small text-muted">
            <div class="col-6">
              <strong>Billed To:</strong>
              <div>${order.shipTo}</div>
              <div>${order.address}</div>
            </div>
            <div class="col-6 text-end">
              <strong>Payment Method:</strong>
              <div>Card ending in 4242</div>
              <div>Currency: USD ($)</div>
            </div>
          </div>
        </div>
        <table class="table table-bordered small">
          <thead class="table-light">
            <tr>
              <th>Item Description</th>
              <th class="text-center">Qty</th>
              <th class="text-end">Unit Price</th>
              <th class="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(it => `
              <tr>
                <td><strong>${it.title}</strong><div class="text-muted extra-small">${it.variant || ''}</div></td>
                <td class="text-center">${it.quantity || 1}</td>
                <td class="text-end">$${Number(it.price).toFixed(2)}</td>
                <td class="text-end">$${(Number(it.price) * (it.quantity || 1)).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" class="text-end fw-bold">Subtotal:</td>
              <td class="text-end">$${Number(order.total).toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-end fw-bold">Standard Shipping:</td>
              <td class="text-end text-success">FREE</td>
            </tr>
            <tr class="table-light">
              <td colspan="3" class="text-end fw-bold fs-6">Grand Total:</td>
              <td class="text-end fw-bold fs-6">$${Number(order.total).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      `;

      $('#invoiceModalContent').html(invoiceHtml);
      new bootstrap.Modal(document.getElementById('invoiceModal')).show();
    });
  }

  // ===================================================
  // 11. PAGE: ORDER TRACKING CONTROLLER
  // ===================================================
  if ($('#trackingTimelineContainer').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId') || 'SN-98104';
    const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
    const order = orders.find(o => o.orderId == orderIdParam) || orders[1] || orders[0];

    if (order) {
      $('#trackOrderNumBadge').text(`Order #${order.orderId}`);
      $('#btnCancelOrderLink').attr('href', `cancel-order.html?orderId=${order.orderId}`);
      if (order.items && order.items[0]) {
        $('#trackProductThumb').attr('src', order.items[0].image);
        $('#trackProductTitle').text(order.items[0].title);
      }
    }
  }

  // ===================================================
  // 12. PAGE: CANCEL ORDER CONTROLLER
  // ===================================================
  if ($('#cancelOrderForm').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId') || 'SN-98104';
    const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
    const order = orders.find(o => o.orderId == orderIdParam) || orders[1] || orders[0];

    if (order) {
      $('#cancelOrderNumBadge').text(`Order #${order.orderId}`);
      $('#cancelRefundAmountText').text(`$${Number(order.total).toFixed(2)}`);
      if (order.items && order.items[0]) {
        $('#cancelProductImg').attr('src', order.items[0].image);
        $('#cancelProductTitle').text(order.items[0].title);
        $('#cancelProductPrice').text(`$${Number(order.items[0].price).toFixed(2)}`);
      }
    }

    $('#cancelOrderForm').on('submit', function (e) {
      e.preventDefault();
      // Update order status in localStorage
      let allOrders = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
      const target = allOrders.find(o => o.orderId == orderIdParam);
      if (target) {
        target.status = 'Cancelled &bull; Refund pending';
        target.statusClass = 'cancelled';
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(allOrders));
      }

      window.location.href = `order-cancelled.html?orderId=${orderIdParam}&refund=${order ? order.total.toFixed(2) : '189.00'}`;
    });
  }

  if ($('#cancelledOrderNumLabel').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId') || 'SN-98104';
    const refundParam = urlParams.get('refund') || '189.00';
    $('#cancelledOrderNumLabel').text(`#${orderIdParam}`);
    $('#cancelledRefundAmountLabel').text(`$${Number(refundParam).toFixed(2)}`);
  }

  // ===================================================
  // 13. PAGE: REQUEST RETURN CONTROLLER
  // ===================================================
  if ($('#requestReturnForm').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId') || 'SN-97880';

    $('#requestReturnForm').on('submit', function (e) {
      e.preventDefault();
      const retId = 'RET-' + Math.floor(1000 + Math.random() * 9000);
      const reason = $('#returnReasonSelect option:selected').text();

      let returns = JSON.parse(localStorage.getItem(STORAGE_RETURNS_KEY) || '[]');
      const newRet = {
        returnId: retId,
        orderId: orderIdParam,
        itemTitle: 'Hydration Serum & Body Oil',
        image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_5_mqgoba.png',
        amount: 48.00,
        reason: reason,
        currentStep: 1, // Step 1: Return requested
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
      returns.unshift(newRet);
      localStorage.setItem(STORAGE_RETURNS_KEY, JSON.stringify(returns));

      if (typeof ShopNowAPI !== 'undefined') {
        ShopNowAPI.createReturn(newRet);
      }

      window.location.href = `return-status.html?retId=${retId}`;
    });
  }

  // ===================================================
  // 14. PAGE: RETURN STATUS CONTROLLER
  // ===================================================
  if ($('#returnsListContainer').length) {
    // Seed sample returns matching Figma Screen 5 center
    function initDefaultReturns() {
      if (!localStorage.getItem(STORAGE_RETURNS_KEY)) {
        const defaultReturns = [
          {
            returnId: 'RET-7281',
            orderId: 'SN-98104',
            itemTitle: 'Textured Cashmere Blend Sweater',
            image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png',
            amount: 189.00,
            date: 'Oct 11, 2026',
            currentStep: 2 // Step 2: Item picked up
          },
          {
            returnId: 'RET-6104',
            orderId: 'SN-97552',
            itemTitle: 'Sculptural Ceramic Table Lamp',
            image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png',
            amount: 145.00,
            date: 'Sep 26, 2026',
            currentStep: 3 // Step 3: Inspected & approved
          },
          {
            returnId: 'RET-5580',
            orderId: 'SN-96112',
            itemTitle: 'Structured Leather Shoulder Bag',
            image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png',
            amount: 175.00,
            date: 'Aug 14, 2026',
            currentStep: 4 // Step 4: Refund processed
          }
        ];
        localStorage.setItem(STORAGE_RETURNS_KEY, JSON.stringify(defaultReturns));
      }
    }
    initDefaultReturns();

    const returns = JSON.parse(localStorage.getItem(STORAGE_RETURNS_KEY) || '[]');
    let html = '';

    returns.forEach(ret => {
      const step1Done = ret.currentStep >= 1 ? 'done' : 'upcoming';
      const step2Done = ret.currentStep > 2 ? 'done' : (ret.currentStep === 2 ? 'active' : 'upcoming');
      const step3Done = ret.currentStep > 3 ? 'done' : (ret.currentStep === 3 ? 'active' : 'upcoming');
      const step4Done = ret.currentStep >= 4 ? 'done' : 'upcoming';

      const fillWidth = ret.currentStep === 1 ? '0%' : (ret.currentStep === 2 ? '33%' : (ret.currentStep === 3 ? '66%' : '100%'));

      html += `
        <div class="card border-1 rounded-4 shadow-sm p-4 mb-4">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom pb-3 mb-3">
            <div class="d-flex align-items-center gap-3">
              <div class="cart-item-thumb-box" style="width: 72px; height: 72px;">
                <img src="${ret.image}" alt="${ret.itemTitle}" />
              </div>
              <div>
                <span class="badge bg-secondary-subtle text-secondary mb-1">Return ID: #${ret.returnId}</span>
                <h5 class="fw-bold text-dark mb-0 fs-6">${ret.itemTitle}</h5>
                <span class="small text-muted">Refund Amount: <strong class="text-dark">$${Number(ret.amount).toFixed(2)}</strong></span>
              </div>
            </div>
            <div class="text-end small text-muted">
              <div>Requested: <strong class="text-dark">${ret.date}</strong></div>
              <div class="text-success fw-bold">Pickup scheduled</div>
            </div>
          </div>

          <!-- 4-Step Stepper -->
          <div class="stepper-container my-3">
            <div class="stepper-progress-line">
              <div class="stepper-progress-fill" style="width: ${fillWidth};"></div>
            </div>

            <div class="stepper-node ${step1Done}">
              <div class="stepper-dot"><i class="bi bi-check-lg"></i></div>
              <span class="stepper-label">Return requested</span>
            </div>

            <div class="stepper-node ${step2Done}">
              <div class="stepper-dot">${ret.currentStep >= 2 ? '<i class="bi bi-box-seam"></i>' : '2'}</div>
              <span class="stepper-label">Item picked up</span>
            </div>

            <div class="stepper-node ${step3Done}">
              <div class="stepper-dot">${ret.currentStep >= 3 ? '<i class="bi bi-search"></i>' : '3'}</div>
              <span class="stepper-label">Inspected &amp; approved</span>
            </div>

            <div class="stepper-node ${step4Done}">
              <div class="stepper-dot">${ret.currentStep >= 4 ? '<i class="bi bi-check-lg"></i>' : '4'}</div>
              <span class="stepper-label">Refund processed</span>
            </div>
          </div>
        </div>
      `;
    });

    $('#returnsListContainer').html(html);
  }

  // ===================================================
  // 15. PAGE: NOTIFICATIONS CONTROLLER
  // ===================================================
  if ($('#notificationFilterTabs').length) {
    $('#notificationFilterTabs button').on('click', function () {
      $('#notificationFilterTabs button').removeClass('active');
      $(this).addClass('active');

      const filter = $(this).data('filter');
      if (filter === 'all') {
        $('.notification-item-card').removeClass('d-none');
      } else {
        $('.notification-item-card').addClass('d-none');
        $(`.notification-item-card[data-category="${filter}"]`).removeClass('d-none');
      }
    });

    $('#btnMarkAllRead').on('click', function () {
      $('.notification-item-card').removeClass('unread');
      $('.notification-item-card .badge.bg-danger').remove();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('All notifications marked as read.', 'info');
      }
    });
  }

  // ===================================================
  // 16. PAGE: SUPPORT MINI CHATBOT CONTROLLER
  // ===================================================
  if ($('#supportChatMessages').length || $('#supportChatInputForm').length) {
    const CHAT_STORAGE_KEY = 'shopnow_support_chat_history';

    // Structured Rule-Based Knowledge Base (JSON)
    const SUPPORT_BOT_RULES = [
      {
        id: 'track',
        keywords: ['track', 'where is my order', 'status', 'delivery status', 'shipped', 'where is package', 'order status'],
        matchOrderRegex: /(?:#?sn-?\d+)/i,
        handler: function (input) {
          const match = input.match(/(?:#?sn-?\d+)/i);
          if (match) {
            const orderId = match[0].toUpperCase();
            return `
              <p>📦 <strong>Order Tracking Found: ${orderId}</strong></p>
              <p>Status: <span class="badge bg-success-subtle text-success">In Transit &bull; On Time</span></p>
              <p class="mb-2">Carrier: <strong>ShopNow Express Fleet</strong><br>Estimated Delivery: <strong>Today by 6:00 PM</strong></p>
              <a href="tracking.html?order=${encodeURIComponent(orderId)}" class="btn btn-sm btn-coral-custom rounded-pill text-white mt-1">
                <i class="bi bi-geo-alt me-1"></i>Open Live GPS Map
              </a>
            `;
          }
          return `
            <p>📦 <strong>Track Your Order</strong></p>
            <p>You can check the live milestone tracking of all your orders directly in your account:</p>
            <a href="orders.html" class="btn btn-sm btn-outline-dark rounded-pill me-2 mt-1">
              <i class="bi bi-box-seam me-1"></i>View All Orders
            </a>
            <p class="extra-small text-muted mt-2 mb-0">💡 <em>Tip: You can also paste your order number here (e.g. <code>#SN-98104</code>) for instant status!</em></p>
          `;
        }
      },
      {
        id: 'return',
        keywords: ['return', 'refund', 'exchange', 'send back', 'money back', 'replace item', 'damaged item'],
        handler: function () {
          return `
            <p>🔄 <strong>30-Day Hassle-Free Returns &amp; Refunds</strong></p>
            <ul class="ps-3 mb-2 small">
              <li>Free returns within 30 days of delivery.</li>
              <li>Free doorstep pickup scheduled at your convenience.</li>
              <li>Refunds processed directly to original payment method in 3–5 business days.</li>
            </ul>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <a href="request-return.html" class="btn btn-sm btn-coral-custom rounded-pill text-white">
                <i class="bi bi-arrow-return-left me-1"></i>Start a Return
              </a>
              <a href="return-status.html" class="btn btn-sm btn-outline-secondary rounded-pill">
                Check Return Status
              </a>
            </div>
          `;
        }
      },
      {
        id: 'shipping',
        keywords: ['shipping', 'shipping time', 'delivery fee', 'shipping cost', 'how long', 'fast delivery', 'free shipping'],
        handler: function () {
          return `
            <p>🚚 <strong>Shipping &amp; Delivery Policies</strong></p>
            <ul class="ps-3 mb-2 small">
              <li><strong>Free Standard Shipping:</strong> On all orders over ₹ 499 (2–4 business days).</li>
              <li><strong>Standard Shipping:</strong> ₹ 49 on orders under ₹ 499.</li>
              <li><strong>Express Delivery:</strong> ₹ 99 for guaranteed 1–2 day arrival.</li>
            </ul>
            <p class="mb-0 extra-small text-muted">All orders are dispatched within 24 hours from verified warehouse hubs.</p>
          `;
        }
      },
      {
        id: 'payment',
        keywords: ['payment', 'pay', 'card', 'credit card', 'debit card', 'upi', 'checkout', 'double charge', 'billing'],
        handler: function () {
          return `
            <p>💳 <strong>Payments &amp; Billing Security</strong></p>
            <p class="small mb-2">We support Visa, MasterCard, American Express, and UPI. All checkouts are encrypted with 256-bit bank-grade SSL security.</p>
            <p class="small mb-0 text-muted">If you suspect an accidental double charge, please note banks sometimes hold a temporary pre-authorization that automatically settles within 24 hours.</p>
          `;
        }
      },
      {
        id: 'cancel',
        keywords: ['cancel', 'cancellation', 'stop order', 'dont want', 'cancel order'],
        handler: function () {
          return `
            <p>❌ <strong>Order Cancellation</strong></p>
            <p class="small mb-2">You can cancel any order free of charge before it leaves the seller's facility for dispatch.</p>
            <a href="orders.html" class="btn btn-sm btn-outline-danger rounded-pill mt-1">
              <i class="bi bi-x-circle me-1"></i>Go to Orders to Cancel
            </a>
            <p class="extra-small text-muted mt-2 mb-0">If the item is already in transit, simply refuse delivery or submit a 30-day return upon arrival.</p>
          `;
        }
      },
      {
        id: 'human',
        keywords: ['human', 'agent', 'person', 'representative', 'support team', 'talk to someone', 'complaint', 'ticket'],
        handler: function () {
          const user = getCurrentBuyer();
          const userEmail = user && user.email ? user.email : 'your registered email';
          return `
            <p>👤 <strong>Connect with Support Agent</strong></p>
            <p class="small mb-2">Our dedicated customer care leads are ready to assist you personally.</p>
            <div class="p-2 rounded bg-light border mb-2">
              <p class="small mb-1 fw-bold text-dark">Would you like me to create an escalation ticket now?</p>
              <button type="button" class="btn btn-sm btn-coral-custom rounded-pill text-white btn-bot-create-ticket">
                <i class="bi bi-envelope-check me-1"></i>Yes, Create Priority Ticket
              </button>
            </div>
            <p class="extra-small text-muted mb-0">Response will be delivered to <strong>${userEmail}</strong> within 2 hours.</p>
          `;
        }
      }
    ];

    function appendMessage(sender, htmlContent, save = true) {
      const $container = $('#supportChatMessages');
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isBot = sender === 'bot';

      const msgHtml = `
        <div class="support-msg-item ${isBot ? 'bot' : 'user'}">
          ${isBot ? `
            <div class="support-bot-avatar flex-shrink-0" style="width:32px;height:32px;font-size:0.95rem;">
              <i class="bi bi-robot"></i>
            </div>
          ` : ''}
          <div>
            <div class="support-msg-bubble">
              ${htmlContent}
            </div>
            <span class="support-msg-time">${timeStr}</span>
          </div>
        </div>
      `;

      $container.append(msgHtml);
      $container.scrollTop($container[0].scrollHeight);

      if (save) {
        try {
          const hist = JSON.parse(sessionStorage.getItem(CHAT_STORAGE_KEY) || '[]');
          hist.push({ sender, htmlContent, time: timeStr });
          sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(hist));
        } catch (e) {}
      }
    }

    function showTyping(show = true) {
      if (show) {
        $('#supportTypingRow').removeClass('d-none');
        const $container = $('#supportChatMessages');
        if ($container.length && $container[0]) {
          $container.scrollTop($container[0].scrollHeight);
        }
      } else {
        $('#supportTypingRow').addClass('d-none');
      }
    }

    function processUserQuery(text) {
      const clean = text.toLowerCase().trim();
      if (!clean) return;

      appendMessage('user', `<p>${escapeHtml(text)}</p>`);
      showTyping(true);

      setTimeout(function () {
        showTyping(false);

        // Check rules
        let matchedRule = null;
        for (const rule of SUPPORT_BOT_RULES) {
          if (rule.matchOrderRegex && rule.matchOrderRegex.test(clean)) {
            matchedRule = rule;
            break;
          }
          if (rule.keywords.some(k => clean.includes(k))) {
            matchedRule = rule;
            break;
          }
        }

        if (matchedRule) {
          appendMessage('bot', matchedRule.handler(text));
        } else {
          // Fallback response with helpful options
          appendMessage('bot', `
            <p>🤔 I'm not completely sure about that specific inquiry, but I can definitely assist you with:</p>
            <ul class="ps-3 mb-2 small">
              <li><strong>Track an order:</strong> Enter your order number like <code>#SN-98104</code></li>
              <li><strong>Returns &amp; refunds:</strong> 30-day free policy</li>
              <li><strong>Shipping times:</strong> Free over ₹ 499</li>
              <li><strong>Contact a specialist:</strong> Get a 2-hour response</li>
            </ul>
            <p class="extra-small text-muted mb-0">Or choose one of the quick topic pills below!</p>
          `);
        }
      }, 550);
    }

    function escapeHtml(string) {
      return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '/': '&#x2F;',
          '`': '&#x60;',
          '=': '&#x3D;'
        }[s];
      });
    }

    function initChat() {
      const $container = $('#supportChatMessages');
      $container.empty();

      const rawHist = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (rawHist) {
        try {
          const hist = JSON.parse(rawHist);
          if (Array.isArray(hist) && hist.length > 0) {
            hist.forEach(m => appendMessage(m.sender, m.htmlContent, false));
            return;
          }
        } catch (e) {}
      }

      // Initial Bot Greeting
      const user = getCurrentBuyer();
      const userName = user && user.name ? user.name.split(' ')[0] : 'there';
      appendMessage('bot', `
        <p class="fw-bold mb-1">👋 Hello ${userName}! Welcome to ShopNow Support.</p>
        <p class="small mb-2">I am your automated 24/7 assistant. How can I help you today?</p>
        <p class="extra-small text-muted mb-0">Select a topic below or type any question about orders, shipping, or returns.</p>
      `);
    }

    // Submit user message
    $('#supportChatInputForm').on('submit', function (e) {
      e.preventDefault();
      const val = $('#supportChatInputText').val().trim();
      if (!val) return;
      $('#supportChatInputText').val('');
      processUserQuery(val);
    });

    // Quick chip click
    $(document).on('click', '.support-chip-btn', function () {
      const q = $(this).data('query') || $(this).text();
      processUserQuery(q);
    });

    // Reset Chat
    $('#btnResetSupportChat').on('click', function () {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
      initChat();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Chat history reset.', 'info');
      }
    });

    // Ticket escalation action
    $(document).on('click', '.btn-bot-create-ticket', function () {
      const user = getCurrentBuyer();
      const userEmail = user && user.email ? user.email : 'buyer@demo.com';
      const ticketId = 'TKT-' + Math.floor(10000 + Math.random() * 90000);

      // Save ticket in localStorage
      const tickets = JSON.parse(localStorage.getItem('shopnow_support_tickets') || '[]');
      tickets.push({
        id: ticketId,
        userEmail: userEmail,
        createdAt: new Date().toISOString(),
        status: 'Open',
        subject: 'Support chat ticket request',
        priority: 'High'
      });
      localStorage.setItem('shopnow_support_tickets', JSON.stringify(tickets));

      $(this).prop('disabled', true).text('Ticket Created');

      showTyping(true);
      setTimeout(function () {
        showTyping(false);
        appendMessage('bot', `
          <div class="p-2 border rounded bg-success-subtle text-success-emphasis">
            <h6 class="fw-bold mb-1"><i class="bi bi-check-circle-fill me-1"></i>Ticket #${ticketId} Created!</h6>
            <p class="extra-small mb-1">Our customer experience lead has received your request.</p>
            <p class="extra-small mb-0">Confirmation sent to <strong>${userEmail}</strong> &bull; Estimated resolution: <strong>2 hours</strong>.</p>
          </div>
        `);
      }, 500);
    });

    // Initialize on ready
    initChat();

    // FAQ Search Filter
    $('#supportSearchInput').on('input', function () {
      const q = $(this).val().toLowerCase().trim();
      $('.accordion-item').each(function () {
        const text = $(this).text().toLowerCase();
        if (text.includes(q)) {
          $(this).removeClass('d-none');
        } else {
          $(this).addClass('d-none');
        }
      });
    });
  }

  // ===================================================
  // 17. MOCKAPI REST CLIENT & SYNC ARCHITECTURE
  // ===================================================
  const MOCKAPI_BASE_URL = 'https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1';
  window.ShopNowMockAPI = {
    endpoints: {
      products: `${MOCKAPI_BASE_URL}/products`,
      categories: `${MOCKAPI_BASE_URL}/categories`,
      users: `${MOCKAPI_BASE_URL}/users`,
      addresses: `${MOCKAPI_BASE_URL}/addresses`,
      orders: `${MOCKAPI_BASE_URL}/orders`,
      returns: `${MOCKAPI_BASE_URL}/returns`,
      notifications: `${MOCKAPI_BASE_URL}/notifications`,
      support_tickets: `${MOCKAPI_BASE_URL}/support_tickets`,
      reviews: `${MOCKAPI_BASE_URL}/reviews`
    },

    // Generic MockAPI GET with offline fallback
    get: function (resource, storageKey, fallbackData, callback) {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) ? parsed.length > 0 : parsed) {
            callback(parsed);
          }
        } catch (e) {}
      }

      const url = this.endpoints[resource];
      if (url) {
        $.getJSON(url, function (data) {
          if (data && (Array.isArray(data) ? data.length > 0 : true)) {
            localStorage.setItem(storageKey, JSON.stringify(data));
            callback(data);
          } else if (!cached && fallbackData) {
            callback(fallbackData);
          }
        }).fail(function () {
          if (!cached && fallbackData) {
            callback(fallbackData);
          }
        });
      } else if (!cached && fallbackData) {
        callback(fallbackData);
      }
    },

    // Generic MockAPI POST
    post: function (resource, data, callback) {
      const url = this.endpoints[resource];
      if (url) {
        $.ajax({
          url: url,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function (res) {
            if (callback) callback(null, res);
          },
          error: function (xhr, status, error) {
            console.warn(`MockAPI POST ${resource} notice:`, error);
            if (callback) callback(error, data);
          }
        });
      }
    },

    // Generic MockAPI PUT
    put: function (resource, id, data, callback) {
      const url = `${this.endpoints[resource]}/${id}`;
      if (url) {
        $.ajax({
          url: url,
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function (res) {
            if (callback) callback(null, res);
          },
          error: function (xhr, status, error) {
            console.warn(`MockAPI PUT ${resource} notice:`, error);
            if (callback) callback(error, data);
          }
        });
      }
    },

    // Generic MockAPI DELETE
    delete: function (resource, id, callback) {
      const url = `${this.endpoints[resource]}/${id}`;
      if (url) {
        $.ajax({
          url: url,
          type: 'DELETE',
          success: function (res) {
            if (callback) callback(null, res);
          },
          error: function (xhr, status, error) {
            console.warn(`MockAPI DELETE ${resource} notice:`, error);
            if (callback) callback(error);
          }
        });
      }
    }
  };

  // ===================================================
  // 18. PAGE: PROFILE CONTROLLER (FIGMA SCREEN: PROFILE)
  // ===================================================
  const STORAGE_ADDRESSES_KEY = 'shopnow_addresses';

  if ($('#profileDetailsForm').length) {
    const user = JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null') || {
      name: 'Priya Patel',
      email: 'priya@example.in',
      phone: '+91 98201 45892',
      role: 'buyer'
    };

    $('#profileFullName').val(user.name || 'Priya Patel');
    $('#profileEmail').val(user.email || 'priya@example.in');
    $('#profilePhone').val(user.phone || '+91 98201 45892');
    $('#profileDisplayName').text(user.name || 'Priya Patel');

    const initial = (user.name || 'Alex').charAt(0).toUpperCase();
    $('#profileAvatarInitial').text(initial);

    // Save Profile Details
    $('#profileDetailsForm').on('submit', function (e) {
      e.preventDefault();
      const updatedName = $('#profileFullName').val().trim();
      const updatedPhone = $('#profilePhone').val().trim();
      const updatedEmail = $('#profileEmail').val().trim();

      const updatedUser = {
        ...user,
        name: updatedName,
        phone: updatedPhone,
        email: updatedEmail
      };

      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
      $('#profileDisplayName').text(updatedName);
      $('#profileAvatarInitial').text(updatedName.charAt(0).toUpperCase());

      // Sync with MockAPI Users endpoint
      window.ShopNowMockAPI.put('users', '1', updatedUser);

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Profile details updated successfully!', 'success');
      }
    });

    // Update Password
    $('#profilePasswordForm').on('submit', function (e) {
      e.preventDefault();
      const currentPass = $('#profileCurrentPassword').val().trim();
      const newPass = $('#profileNewPassword').val().trim();
      const confirmPass = $('#profileConfirmPassword').val().trim();

      if (newPass.length < 8) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('New password must have at least 8 characters.', 'warning');
        }
        return;
      }

      if (newPass !== confirmPass) {
        $('#passwordMatchError').removeClass('d-none');
        return;
      }

      $('#passwordMatchError').addClass('d-none');
      this.reset();

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Password updated successfully!', 'success');
      }
    });

    // Change photo simulated trigger
    $('#btnChangePhoto').on('click', function () {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Photo upload option: select your image file.', 'info');
      }
    });
  }

  // ===================================================
  // 19. PAGE: ADDRESSES CONTROLLER (FIGMA SCREEN: ADDRESSES)
  // ===================================================
  function initDefaultAddresses() {
    if (!localStorage.getItem(STORAGE_ADDRESSES_KEY)) {
      const defaultAddresses = [
        {
          id: 'addr_1',
          userEmail: 'buyer@demo.com',
          label: 'Home',
          isDefault: true,
          name: 'Priya Patel',
          street: 'Flat 502, Orchid Heights, Andheri West',
          city: 'Mumbai',
          state: 'MH',
          pin: '400053',
          phone: '+91 98201 45892'
        },
        {
          id: 'addr_2',
          userEmail: 'buyer@demo.com',
          label: 'Work',
          isDefault: false,
          name: 'Priya Patel (Work Hub)',
          street: '402 Raheja Towers, Bandra Kurla Complex',
          city: 'Mumbai',
          state: 'MH',
          pin: '400051',
          phone: '+91 98334 12044'
        }
      ];
      localStorage.setItem(STORAGE_ADDRESSES_KEY, JSON.stringify(defaultAddresses));
    }
  }

  function getUserAddresses() {
    const user = getCurrentBuyer();
    if (!user || !user.email) return [];
    if (!localStorage.getItem(STORAGE_ADDRESSES_KEY) && user.email.toLowerCase() === 'buyer@demo.com') {
      initDefaultAddresses();
    }
    const all = JSON.parse(localStorage.getItem(STORAGE_ADDRESSES_KEY) || '[]');
    return all.filter(function (a) {
      if (user.email.toLowerCase() === 'buyer@demo.com') {
        return !a.userEmail || a.userEmail.toLowerCase() === 'buyer@demo.com';
      }
      return a.userEmail && a.userEmail.toLowerCase() === user.email.toLowerCase();
    });
  }

  if ($('#savedAddressesGridContainer').length) {
    function renderSavedAddresses() {
      const addresses = getUserAddresses();
      const $container = $('#savedAddressesGridContainer');

      let html = `
        <!-- Card 1: Add Address (Dotted Card) -->
        <div class="col-12 col-md-6 col-lg-4">
          <a href="add-address.html" class="add-address-dash-card">
            <div class="add-address-icon-circle">
              <i class="bi bi-plus-lg"></i>
            </div>
            <div class="add-address-text">Add address</div>
          </a>
        </div>
      `;

      addresses.forEach(addr => {
        const iconClass = addr.label && addr.label.toLowerCase() === 'work' ? 'bi-briefcase' : 'bi-house-door';
        const defaultBadge = addr.isDefault ? '<span class="address-default-badge">DEFAULT</span>' : '';

        html += `
          <div class="col-12 col-md-6 col-lg-4" id="addressCardItem-${addr.id}">
            <div class="saved-address-card ${addr.isDefault ? 'is-default' : ''}">
              <div>
                <div class="address-card-top-row">
                  <span class="address-type-tag">
                    <i class="bi ${iconClass} text-coral"></i>
                    <span>${addr.label || 'Home'}</span>
                  </span>
                  ${defaultBadge}
                </div>
                <div class="address-card-details">
                  <strong class="d-block mb-1">${addr.name}</strong>
                  <div>${addr.street}</div>
                  <div>${addr.city}, ${addr.state || ''} ${addr.pin}</div>
                  <div class="text-muted mt-2">${addr.phone}</div>
                </div>
              </div>
              <div class="address-actions-row">
                <a href="add-address.html?editId=${addr.id}" class="address-action-link">Edit</a>
                <span class="text-muted">&bull;</span>
                <button type="button" class="address-action-link delete-link btn-remove-address" data-id="${addr.id}">Remove</button>
              </div>
            </div>
          </div>
        `;
      });

      $container.html(html);
    }

    renderSavedAddresses();

    // Remove address handler
    $(document).on('click', '.btn-remove-address', function () {
      const id = $(this).data('id');
      let addresses = JSON.parse(localStorage.getItem(STORAGE_ADDRESSES_KEY) || '[]');
      addresses = addresses.filter(a => a.id != id);
      localStorage.setItem(STORAGE_ADDRESSES_KEY, JSON.stringify(addresses));
      renderSavedAddresses();

      // Sync with MockAPI
      window.ShopNowMockAPI.delete('addresses', id);

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Address removed.', 'info');
      }
    });
  }

  // ===================================================
  // 20. PAGE: ADD ADDRESS CONTROLLER (FIGMA SCREEN: ADD ADDRESS)
  // ===================================================
  if ($('#addAddressPageForm').length) {
    const user = getCurrentBuyer();
    const urlParams = new URLSearchParams(window.location.search);
    const editIdParam = urlParams.get('editId');
    let addresses = JSON.parse(localStorage.getItem(STORAGE_ADDRESSES_KEY) || '[]');

    if (editIdParam) {
      const existing = addresses.find(a => a.id == editIdParam);
      if (existing) {
        $('#addressFullName').val(existing.name);
        $('#addressPhone').val(existing.phone);
        $('#addressLabelType').val(existing.label || 'Home');
        $('#addressStreet').val(existing.street);
        $('#addressCity').val(existing.city);
        $('#addressState').val(existing.state || '');
        $('#addressPin').val(existing.pin);
        $('#addressDefaultCheck').prop('checked', !!existing.isDefault);
        $('#btnSaveNewAddress').text('Update address');
      }
    }

    $('#addAddressPageForm').on('submit', function (e) {
      e.preventDefault();
      const isDefault = $('#addressDefaultCheck').is(':checked');
      const label = $('#addressLabelType').val();
      const name = $('#addressFullName').val().trim();
      const phone = $('#addressPhone').val().trim();
      const street = $('#addressStreet').val().trim();
      const apt = $('#addressApartment').val().trim();
      const fullStreet = apt ? `${street}, ${apt}` : street;
      const city = $('#addressCity').val().trim();
      const state = $('#addressState').val().trim();
      const pin = $('#addressPin').val().trim();

      if (isDefault) {
        addresses.forEach(a => { a.isDefault = false; });
      }

      if (editIdParam) {
        const target = addresses.find(a => a.id == editIdParam);
        if (target) {
          target.name = name;
          target.phone = phone;
          target.label = label;
          target.street = fullStreet;
          target.city = city;
          target.state = state;
          target.pin = pin;
          target.isDefault = isDefault;
          window.ShopNowMockAPI.put('addresses', editIdParam, target);
        }
      } else {
        const newAddr = {
          id: 'addr_' + Date.now(),
          userEmail: user ? user.email : 'buyer@demo.com',
          name: name,
          phone: phone,
          label: label,
          street: fullStreet,
          city: city,
          state: state,
          pin: pin,
          isDefault: isDefault || addresses.length === 0
        };
        addresses.push(newAddr);
        window.ShopNowMockAPI.post('addresses', newAddr);
      }

      localStorage.setItem(STORAGE_ADDRESSES_KEY, JSON.stringify(addresses));

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Delivery address saved successfully!', 'success');
      }

      setTimeout(function () {
        window.location.href = 'addresses.html';
      }, 500);
    });
  }
});

