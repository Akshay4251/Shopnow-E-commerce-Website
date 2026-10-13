/**
 * ===================================================
 * SHOPNOW - COMMON HEADER & FOOTER JAVASCRIPT
 * Renders, hydrates, and controls the reusable header & footer
 * Compatible with Buyer, Seller, Admin, and Common modules
 * ===================================================
 */

(function () {
  'use strict';

  // Determine root relative path depending on page location
  function getPathPrefix() {
    const path = window.location.pathname.replace(/\\/g, '/');
    // All module HTML pages (common/html, buyer/html, seller/html, delivery-agent/html, admin/html) are 2 levels deep
    if (path.includes('/html/') || path.includes('/buyer/') || path.includes('/seller/') || path.includes('/admin/') || path.includes('/delivery-agent/') || path.includes('/common/')) {
      return '../../';
    }
    return '';
  }

  const PREFIX = getPathPrefix();

  // Header HTML Template
  function getHeaderHtml(activeCategory = 'trending') {
    const user = JSON.parse(localStorage.getItem('shopnow_current_user') || 'null');
    const userName = user && user.name ? user.name.split(' ')[0] : 'Sign In';
    let accountUrl = `${PREFIX}common/html/login.html`;
    if (user && user.role) {
      if (user.role === 'seller') accountUrl = `${PREFIX}seller/html/dashboard.html`;
      else if (user.role === 'delivery') accountUrl = `${PREFIX}delivery-agent/html/dashboard.html`;
      else if (user.role === 'admin') accountUrl = `${PREFIX}admin/html/dashboard.html`;
      else accountUrl = `${PREFIX}buyer/html/dashboard.html`;
    }

    // Wishlist & Cart scoped to logged-in user. If NOT logged in, both are EMPTY (0)
    let wishlist = [];
    let cart = [];
    if (user && user.email) {
      const uKey = user.email.toLowerCase();
      const rawWishlist = localStorage.getItem(`shopnow_wishlist_${uKey}`);
      if (rawWishlist !== null) {
        wishlist = JSON.parse(rawWishlist || '[]');
      } else if (uKey === 'buyer@demo.com') {
        wishlist = JSON.parse(localStorage.getItem('shopnow_wishlist') || '[]');
      }

      const rawCart = localStorage.getItem(`shopnow_cart_${uKey}`);
      if (rawCart !== null) {
        cart = JSON.parse(rawCart || '[]');
      } else if (uKey === 'buyer@demo.com') {
        cart = JSON.parse(localStorage.getItem('shopnow_cart') || '[]');
      }
    }
    const wishlistCount = wishlist.length;
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const wishlistUrl = user ? `${PREFIX}buyer/html/wishlist.html` : `${PREFIX}common/html/login.html?redirect=wishlist`;
    const cartUrl = user ? `${PREFIX}buyer/html/cart.html` : `${PREFIX}common/html/login.html?redirect=cart`;

    return `
      <!-- Top Announcement Bar -->
      <div class="site-top-bar">
        <div class="container d-flex justify-content-between align-items-center">
          <div class="top-bar-announcement">
            <span>Free delivery over ₹ 499 &bull; Easy 7-day returns</span>
          </div>
          <div class="top-bar-links d-flex align-items-center">
            <a href="${PREFIX}buyer/html/orders.html">Track order</a>
            <span class="top-bar-divider">&bull;</span>
            <a href="${PREFIX}buyer/html/support.html">Help center</a>
            <span class="top-bar-divider">&bull;</span>
            <span>IN &bull; INR (₹)</span>
          </div>
        </div>
      </div>

      <!-- Main Navigation Header -->
      <header class="site-main-header">
        <div class="container">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <!-- Brand Logo -->
            <a href="${PREFIX}common/html/home.html" class="brand-logo-wrap">
              <div class="brand-logo-icon">
                <i class="bi bi-bag-fill"></i>
              </div>
              <span class="brand-logo-text">ShopNow</span>
            </a>

            <!-- Search Capsule -->
            <form class="header-search-form flex-grow-1 mx-lg-4" id="siteSearchForm" action="${PREFIX}buyer/html/catalog.html" method="GET">
              <i class="bi bi-search header-search-icon"></i>
              <input type="text" name="q" class="header-search-input" id="siteSearchInput" placeholder="Search products, brands and categories" autocomplete="off" />
              <button type="submit" class="header-search-btn" aria-label="Search">
                <i class="bi bi-arrow-right"></i>
              </button>
            </form>

            <!-- Header Action Items -->
            <div class="header-actions-group">
              <!-- Account -->
              <div class="dropdown d-inline-block header-account-dropdown" id="headerAccountDropdown">
                <a href="${accountUrl}" class="header-action-item" id="headerAccountLink" role="button">
                  <i class="bi bi-person"></i>
                  <div class="account-text-wrap text-start">
                    <span class="account-sub-label">Hello, ${userName}</span>
                    <span class="account-main-label">Account <i class="bi bi-chevron-down ms-1" style="font-size: 0.65rem;"></i></span>
                  </div>
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2 header-account-menu" id="headerAccountMenu">
                  ${user ? `
                    <li><h6 class="dropdown-header text-uppercase fw-bold text-coral small mb-1">${user.name || 'Member'} (${(user.role || 'buyer').toUpperCase()})</h6></li>
                    <li><span class="dropdown-item-text text-muted small py-0 mb-2">${user.email || ''}</span></li>
                    <li><a class="dropdown-item" href="${accountUrl}"><i class="bi bi-grid-fill me-2 text-coral"></i>My Dashboard</a></li>
                    ${user.role === 'buyer' ? `
                      <li><a class="dropdown-item" href="${PREFIX}buyer/html/orders.html"><i class="bi bi-box-seam me-2"></i>My Orders</a></li>
                      <li><a class="dropdown-item" href="${PREFIX}buyer/html/wishlist.html"><i class="bi bi-heart me-2"></i>Wishlist</a></li>
                      <li><a class="dropdown-item" href="${PREFIX}buyer/html/addresses.html"><i class="bi bi-geo-alt me-2"></i>Saved Addresses</a></li>
                      <li><a class="dropdown-item" href="${PREFIX}buyer/html/profile.html"><i class="bi bi-person-gear me-2"></i>Account Profile</a></li>
                    ` : ''}
                    ${user.role === 'seller' ? `
                      <li><a class="dropdown-item" href="${PREFIX}seller/html/products.html"><i class="bi bi-boxes me-2"></i>Product Catalog</a></li>
                      <li><a class="dropdown-item" href="${PREFIX}seller/html/orders.html"><i class="bi bi-receipt me-2"></i>Customer Orders</a></li>
                      <li><a class="dropdown-item" href="${PREFIX}seller/html/inventory.html"><i class="bi bi-archive me-2"></i>Stock Inventory</a></li>
                    ` : ''}
                    ${user.role === 'delivery' ? `
                      <li><a class="dropdown-item" href="${PREFIX}delivery-agent/html/assigned-orders.html"><i class="bi bi-truck me-2"></i>Assigned Shipments</a></li>
                      <li><a class="dropdown-item" href="${PREFIX}delivery-agent/html/location.html"><i class="bi bi-compass me-2"></i>Live Route Map</a></li>
                    ` : ''}
                    ${user.role === 'admin' ? `
                      <li><a class="dropdown-item" href="${PREFIX}admin/html/sellers.html"><i class="bi bi-shop me-2"></i>Manage Sellers</a></li>
                      <li><a class="dropdown-item" href="${PREFIX}admin/html/buyers.html"><i class="bi bi-people me-2"></i>Manage Buyers</a></li>
                      <li><a class="dropdown-item" href="${PREFIX}admin/html/delivery-agents.html"><i class="bi bi-truck me-2"></i>Delivery Fleet</a></li>
                    ` : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="javascript:void(0)" id="headerLogoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
                  ` : `
                    <li><h6 class="dropdown-header text-uppercase fw-bold text-coral small mb-1">Welcome to ShopNow</h6></li>
                    <li><a class="dropdown-item fw-bold" href="${PREFIX}common/html/login.html"><i class="bi bi-box-arrow-in-right me-2 text-coral"></i>Sign In</a></li>
                    <li><a class="dropdown-item" href="${PREFIX}common/html/register.html"><i class="bi bi-person-plus me-2 text-coral"></i>Create an Account (Register)</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><span class="dropdown-header text-uppercase small text-muted">Merchant & Fleets</span></li>
                    <li><a class="dropdown-item" href="${PREFIX}common/html/login.html?role=seller"><i class="bi bi-shop me-2"></i>Seller Merchant Login</a></li>
                    <li><a class="dropdown-item" href="${PREFIX}common/html/login.html?role=delivery"><i class="bi bi-truck me-2"></i>Delivery Agent Login</a></li>
                    <li><a class="dropdown-item" href="${PREFIX}common/html/login.html?role=admin"><i class="bi bi-shield-lock me-2"></i>System Admin Login</a></li>
                  `}
                </ul>
              </div>

              <!-- Wishlist -->
              <a href="${wishlistUrl}" class="header-action-item" id="headerWishlistLink">
                <i class="bi bi-heart"></i>
                <span>Wishlist</span>
                <span class="header-badge-count ${wishlistCount > 0 ? '' : 'd-none'}" id="headerWishlistBadge">${wishlistCount}</span>
              </a>

              <!-- Cart -->
              <a href="${cartUrl}" class="header-action-item" id="headerCartLink">
                <i class="bi bi-cart3"></i>
                <span>Cart &bull; [<span id="headerCartCount">${cartCount}</span>]</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Secondary Categories Bar -->
      <nav class="site-categories-bar">
        <div class="container">
          <ul class="category-nav-list" id="categoryNavList">
            <li><a href="${PREFIX}buyer/html/catalog.html?category=all" data-cat="trending" class="category-nav-link ${activeCategory === 'trending' || activeCategory === 'all' ? 'active' : ''}">New &amp; trending</a></li>
            <li><a href="${PREFIX}buyer/html/catalog.html?category=fashion" data-cat="fashion" class="category-nav-link ${activeCategory === 'fashion' ? 'active' : ''}">Fashion</a></li>
            <li><a href="${PREFIX}buyer/html/catalog.html?category=electronics" data-cat="electronics" class="category-nav-link ${activeCategory === 'electronics' ? 'active' : ''}">Electronics</a></li>
            <li><a href="${PREFIX}buyer/html/catalog.html?category=home" data-cat="home" class="category-nav-link ${activeCategory === 'home' ? 'active' : ''}">Home</a></li>
            <li><a href="${PREFIX}buyer/html/catalog.html?category=beauty" data-cat="beauty" class="category-nav-link ${activeCategory === 'beauty' ? 'active' : ''}">Beauty</a></li>
            <li><a href="${PREFIX}buyer/html/catalog.html?category=grocery" data-cat="grocery" class="category-nav-link ${activeCategory === 'grocery' ? 'active' : ''}">Grocery</a></li>
            <li><a href="${PREFIX}buyer/html/catalog.html?category=sports" data-cat="sports" class="category-nav-link ${activeCategory === 'sports' ? 'active' : ''}">Sports</a></li>
            <li><a href="${PREFIX}buyer/html/catalog.html?category=luxury" data-cat="luxury" class="category-nav-link ${activeCategory === 'luxury' ? 'active' : ''}">Luxury</a></li>
            <li><a href="${PREFIX}buyer/html/catalog.html?category=deals" data-cat="deals" class="category-nav-link ${activeCategory === 'deals' ? 'active' : ''}">Deals</a></li>
          </ul>
        </div>
      </nav>
    `;
  }

  // Footer HTML Template
  function getFooterHtml() {
    return `
      <!-- Trust Badges Bar (Peach Cream) -->
      <section class="site-trust-badges-bar">
        <div class="container">
          <div class="row g-4 align-items-center">
            <div class="col-6 col-lg-3">
              <div class="trust-badge-card">
                <div class="trust-badge-circle-icon"><i class="bi bi-truck"></i></div>
                <div>
                  <h6 class="trust-badge-heading">Fast free delivery</h6>
                  <p class="trust-badge-desc">On eligible orders over ₹ 499</p>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="trust-badge-card">
                <div class="trust-badge-circle-icon"><i class="bi bi-arrow-repeat"></i></div>
                <div>
                  <h6 class="trust-badge-heading">Easy 30-day returns</h6>
                  <p class="trust-badge-desc">Simple, convenient and flexible</p>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="trust-badge-card">
                <div class="trust-badge-circle-icon"><i class="bi bi-shield-check"></i></div>
                <div>
                  <h6 class="trust-badge-heading">Secure checkout</h6>
                  <p class="trust-badge-desc">Protected payments and purchases</p>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="trust-badge-card">
                <div class="trust-badge-circle-icon"><i class="bi bi-headset"></i></div>
                <div>
                  <h6 class="trust-badge-heading">24/7 support</h6>
                  <p class="trust-badge-desc">Real help, whenever you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Back To Top Bar -->
      <div class="site-back-to-top-bar">
        <button type="button" class="back-to-top-btn" id="btnBackToTop">
          Back to top <i class="bi bi-arrow-up"></i>
        </button>
      </div>

      <!-- Dark Navy Footer -->
      <footer class="site-navy-footer">
        <div class="container">
          <div class="row g-4 g-lg-5">
            <!-- Brand Col -->
            <div class="col-lg-4">
              <a href="${PREFIX}common/html/home.html" class="footer-brand-title">
                <div class="brand-logo-icon" style="width: 34px; height: 34px; font-size: 1.1rem;">
                  <i class="bi bi-bag-fill"></i>
                </div>
                <span>ShopNow</span>
              </a>
              <p class="footer-brand-tagline">
                Everything you love, thoughtfully brought together. Trusted by shoppers and sellers worldwide.
              </p>
              <div class="footer-social-icons">
                <a href="javascript:void(0)" onclick="ShopNowCommon.showToast('Follow ShopNow on Instagram', 'info')" class="footer-social-circle" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a href="javascript:void(0)" onclick="ShopNowCommon.showToast('Follow ShopNow on Facebook', 'info')" class="footer-social-circle" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="javascript:void(0)" onclick="ShopNowCommon.showToast('Subscribe to ShopNow on YouTube', 'info')" class="footer-social-circle" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                <a href="javascript:void(0)" onclick="ShopNowCommon.showToast('Follow ShopNow on X (Twitter)', 'info')" class="footer-social-circle" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
              </div>
            </div>

            <!-- Links: SHOP -->
            <div class="col-6 col-sm-3 col-lg-2">
              <h6 class="footer-col-heading">SHOP</h6>
              <ul class="footer-links-list">
                <li><a href="${PREFIX}buyer/html/catalog.html?filter=new">New arrivals</a></li>
                <li><a href="${PREFIX}buyer/html/catalog.html?filter=best">Best sellers</a></li>
                <li><a href="${PREFIX}buyer/html/catalog.html?filter=deals">Today's deals</a></li>
                <li><a href="${PREFIX}buyer/html/catalog.html">Gift cards</a></li>
                <li><a href="${PREFIX}buyer/html/catalog.html">Shop by brand</a></li>
              </ul>
            </div>

            <!-- Links: CUSTOMER CARE -->
            <div class="col-6 col-sm-3 col-lg-2">
              <h6 class="footer-col-heading">CUSTOMER CARE</h6>
              <ul class="footer-links-list">
                <li><a href="${PREFIX}buyer/html/support.html">Help center</a></li>
                <li><a href="${PREFIX}buyer/html/orders.html">Shipping &amp; delivery</a></li>
                <li><a href="${PREFIX}buyer/html/return-status.html">Returns &amp; refunds</a></li>
                <li><a href="${PREFIX}buyer/html/orders.html">Track your order</a></li>
                <li><a href="${PREFIX}common/html/contact.html">Contact us</a></li>
              </ul>
            </div>

            <!-- Links: ABOUT SHOPNOW -->
            <div class="col-6 col-sm-3 col-lg-2">
              <h6 class="footer-col-heading">ABOUT SHOPNOW</h6>
              <ul class="footer-links-list">
                <li><a href="${PREFIX}common/html/about.html">Our story</a></li>
                <li><a href="${PREFIX}common/html/about.html#culture-section">Careers</a></li>
                <li><a href="${PREFIX}common/html/about.html">Press room</a></li>
                <li><a href="${PREFIX}common/html/about.html">Sustainability</a></li>
                <li><a href="${PREFIX}common/html/register.html">Sell with us</a></li>
              </ul>
            </div>

            <!-- Links: POLICIES -->
            <div class="col-6 col-sm-3 col-lg-2">
              <h6 class="footer-col-heading">POLICIES</h6>
              <ul class="footer-links-list">
                <li><a href="javascript:void(0)" onclick="ShopNowCommon.showToast('ShopNow Privacy Policy compliant with Indian IT Rules', 'info')">Privacy</a></li>
                <li><a href="javascript:void(0)" onclick="ShopNowCommon.showToast('ShopNow Terms of Use', 'info')">Terms of use</a></li>
                <li><a href="javascript:void(0)" onclick="ShopNowCommon.showToast('ShopNow Accessibility Statement', 'info')">Accessibility</a></li>
                <li><a href="javascript:void(0)" onclick="ShopNowCommon.showToast('Cookie preferences updated', 'info')">Cookie settings</a></li>
                <li><a href="javascript:void(0)" onclick="ShopNowCommon.showToast('Marketplace Merchant & Consumer Terms', 'info')">Marketplace terms</a></li>
              </ul>
            </div>
          </div>

          <!-- Bottom Row -->
          <div class="footer-bottom-divider d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <p class="footer-copyright-text">
              &copy; 2026 ShopNow Marketplace, Inc.
            </p>
            <div class="footer-payment-methods">
              <span class="small text-muted me-2">Secure payments:</span>
              <span class="payment-method-pill">VISA</span>
              <span class="payment-method-pill">MC</span>
              <span class="payment-method-pill">AMEX</span>
              <span class="payment-method-pill">Pay</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  function normalizeCategory(raw) {
    if (!raw) return '';
    const c = raw.toLowerCase().trim();
    if (c === 'all' || c === 'trending' || c === 'new') return 'trending';
    if (c === 'fashion' || c === 'sweaters' || c === 'apparel' || c === 'accessories' || c === 'footwear') return 'fashion';
    if (c === 'electronics' || c === 'audio' || c === 'tech' || c === 'portable tech') return 'electronics';
    if (c === 'home' || c === 'decor') return 'home';
    if (c === 'beauty' || c === 'skincare') return 'beauty';
    if (c === 'grocery') return 'grocery';
    if (c === 'sports' || c === 'active') return 'sports';
    if (c === 'luxury') return 'luxury';
    if (c === 'deals') return 'deals';
    return c;
  }

  function detectActiveCategory(headerContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category');
    const filter = urlParams.get('filter');

    if (filter === 'deals') return 'deals';
    if (cat) return normalizeCategory(cat);

    const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    const isHome = path.endsWith('home.html') || path.endsWith('index.html') || path === '/' || path.endsWith('/');
    const isCatalog = path.endsWith('catalog.html');

    if (isHome) return 'trending';
    if (isCatalog) {
      // If on catalog without category param, check explicit attribute or default to trending
      const explicit = headerContainer ? headerContainer.getAttribute('data-active') : null;
      if (explicit && explicit !== 'trending') return normalizeCategory(explicit);
      return 'trending';
    }

    // On pages outside catalog/home (e.g. cart, wishlist, orders, support), do not falsely highlight any category
    return '';
  }

  // Auto-mount on DOM Ready
  document.addEventListener('DOMContentLoaded', function () {
    const headerContainer = document.getElementById('siteHeader');
    if (headerContainer) {
      const activeCat = detectActiveCategory(headerContainer);
      headerContainer.innerHTML = getHeaderHtml(activeCat);
    }

    const footerContainer = document.getElementById('siteFooter');
    if (footerContainer) {
      footerContainer.innerHTML = getFooterHtml();
    }

    // Attach Back-to-Top handler
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('#btnBackToTop');
      if (btn) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // Attach Logout handler
    document.addEventListener('click', function (e) {
      const logoutBtn = e.target.closest('#headerLogoutBtn, a[href*="login.html"].text-danger');
      if (logoutBtn) {
        localStorage.removeItem('shopnow_current_user');
        localStorage.removeItem('shopnow_cart');
        localStorage.removeItem('shopnow_wishlist');
        if (logoutBtn.id === 'headerLogoutBtn') {
          e.preventDefault();
          window.location.href = `${PREFIX}common/html/login.html`;
        }
      }
    });

    // Update Header counters dynamically
    window.ShopNowHeader = {
      updateCartBadge: function (count) {
        const el = document.getElementById('headerCartCount');
        if (el) el.textContent = count;
      },
      updateWishlistBadge: function (count) {
        const el = document.getElementById('headerWishlistBadge');
        if (el) {
          el.textContent = count;
          if (count > 0) el.classList.remove('d-none');
          else el.classList.add('d-none');
        }
      },
      setActiveCategory: function (cat) {
        const norm = normalizeCategory(cat);
        const links = document.querySelectorAll('.category-nav-link');
        links.forEach(link => {
          const c = link.getAttribute('data-cat');
          if (norm && c === norm) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    };
  });
})();
