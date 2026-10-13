/**
 * ===================================================
 * SHOPNOW - SELLER MODULE HEADER & NAVIGATION SYSTEM
 * Injects responsive seller header, active navigation bar,
 * merchant profile menu, and seller navy footer
 * Exactly matching the Figma design specifications
 * ===================================================
 */

(function () {
  'use strict';

  function detectActiveTab(headerContainer) {
    if (headerContainer && headerContainer.getAttribute('data-active')) {
      return headerContainer.getAttribute('data-active').toLowerCase();
    }
    const path = window.location.pathname.toLowerCase();
    if (path.includes('product') || path.includes('add-product')) return 'products';
    if (path.includes('inventory')) return 'inventory';
    if (path.includes('order-report') || path.includes('stock-report') || path.includes('reports')) return 'reports';
    if (path.includes('order')) return 'orders';
    if (path.includes('shipping') || path.includes('tracking')) return 'shipping';
    if (path.includes('review')) return 'reviews';
    if (path.includes('return')) return 'returns';
    if (path.includes('profile') || path.includes('password')) return 'profile';
    if (path.includes('notif')) return 'notifications';
    if (path.includes('support') || path.includes('ticket')) return 'support';
    return 'dashboard';
  }

  function getSellerHeaderHtml(activeTab = 'dashboard') {
    const currentUser = (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null) || JSON.parse(localStorage.getItem('shopnow_current_user') || 'null');
    const sellerName = currentUser && currentUser.name ? currentUser.name : 'Riya Sharma';
    const storeName = currentUser && (currentUser.storeName || (currentUser.name ? currentUser.name + ' Store' : '')) ? (currentUser.storeName || currentUser.name + ' Store') : 'Riya Home Studio';
    const initials = sellerName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'RS';

    return `
      <!-- Top Announcement Bar -->
      <div class="seller-top-bar">
        <div class="container d-flex justify-content-center align-items-center position-relative">
          <span class="seller-top-bar-text">Good items. Great possibilities. Discover something new every day.</span>
          <div class="d-none d-lg-flex align-items-center gap-3 position-absolute end-0 pe-3">
            <span class="extra-small text-secondary">Seller Center &bull; Live Store</span>
          </div>
        </div>
      </div>

      <!-- Main Navigation Header -->
      <header class="seller-main-header">
        <div class="container">
          <div class="d-flex align-items-center justify-content-between gap-3">
            <!-- Brand Logo -->
            <a href="dashboard.html" class="brand-logo-wrap text-decoration-none">
              <div class="brand-logo-icon">
                <i class="bi bi-bag-fill"></i>
              </div>
              <span class="brand-logo-text">ShopNow</span>
            </a>

            <!-- Search Capsule -->
            <form class="seller-search-form d-none d-md-block" id="sellerSearchForm" action="products.html" method="GET">
              <i class="bi bi-search seller-search-icon"></i>
              <input type="text" name="q" class="seller-search-input" placeholder="Search products, orders and more" autocomplete="off" />
            </form>

            <!-- Actions: Notifications & Merchant Pill -->
            <div class="seller-header-actions">
              <a href="notifications.html" class="seller-notif-btn" title="Notifications">
                <i class="bi bi-bell"></i>
                <span class="seller-notif-badge"></span>
              </a>

              <!-- Merchant Dropdown Pill -->
              <div class="dropdown">
                <div class="seller-profile-pill" data-bs-toggle="dropdown" aria-expanded="false" role="button" tabindex="0">
                  <div class="seller-avatar-initials">${initials}</div>
                  <div class="seller-profile-info d-none d-sm-block">
                    <span class="seller-profile-name">${sellerName}</span>
                    <span class="seller-profile-store">${storeName}</span>
                  </div>
                  <i class="bi bi-chevron-down text-muted small ms-1"></i>
                </div>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
                  <li><h6 class="dropdown-header text-coral fw-bold text-uppercase small">${storeName}</h6></li>
                  <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2 text-coral"></i>Seller Profile</a></li>
                  <li><a class="dropdown-item" href="dashboard.html"><i class="bi bi-shop me-2 text-coral"></i>Storefront Dashboard</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="../../buyer/html/dashboard.html"><i class="bi bi-arrow-repeat me-2"></i>Switch to Buyer</a></li>
                  <li><a class="dropdown-item text-danger btn-seller-logout" href="javascript:void(0)"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Seller Sub-Navigation Bar (11 Horizontal Tabs Matching Figma) -->
      <nav class="seller-nav-bar">
        <div class="container">
          <ul class="seller-nav-list" id="sellerNavList">
            <li><a href="dashboard.html" class="seller-nav-link ${activeTab === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
            <li><a href="products.html" class="seller-nav-link ${activeTab === 'products' ? 'active' : ''}">Products</a></li>
            <li><a href="inventory.html" class="seller-nav-link ${activeTab === 'inventory' ? 'active' : ''}">Inventory</a></li>
            <li><a href="orders.html" class="seller-nav-link ${activeTab === 'orders' ? 'active' : ''}">Orders</a></li>
            <li><a href="shipping.html" class="seller-nav-link ${activeTab === 'shipping' ? 'active' : ''}">Shipping</a></li>
            <li><a href="reviews.html" class="seller-nav-link ${activeTab === 'reviews' ? 'active' : ''}">Reviews</a></li>
            <li><a href="returns.html" class="seller-nav-link ${activeTab === 'returns' ? 'active' : ''}">Returns</a></li>
            <li><a href="reports.html" class="seller-nav-link ${activeTab === 'reports' ? 'active' : ''}">Reports</a></li>
            <li><a href="profile.html" class="seller-nav-link ${activeTab === 'profile' ? 'active' : ''}">Profile</a></li>
            <li><a href="notifications.html" class="seller-nav-link ${activeTab === 'notifications' ? 'active' : ''}">Notifications</a></li>
            <li><a href="support.html" class="seller-nav-link ${activeTab === 'support' ? 'active' : ''}">Support</a></li>
          </ul>
        </div>
      </nav>
    `;
  }

  function getSellerFooterHtml() {
    return `
      <footer class="seller-navy-footer">
        <div class="container">
          <div class="row g-4">
            <!-- Brand Column -->
            <div class="col-12 col-md-4">
              <a href="dashboard.html" class="brand-logo-wrap text-decoration-none d-inline-flex align-items-center gap-2 mb-3">
                <div class="brand-logo-icon" style="width: 36px; height: 36px; font-size: 1.1rem;">
                  <i class="bi bi-bag-fill"></i>
                </div>
                <span class="fs-4 fw-bold text-white">ShopNow</span>
              </a>
              <p class="text-secondary small mb-3 lh-base">
                Everyday finds. Independent brands.<br>A world of possibilities, all in one place.
              </p>
              <div class="d-flex gap-3 text-secondary">
                <a href="javascript:void(0)" class="text-secondary fs-5" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a href="javascript:void(0)" class="text-secondary fs-5" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>
                <a href="javascript:void(0)" class="text-secondary fs-5" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="javascript:void(0)" class="text-secondary fs-5" aria-label="Twitter X"><i class="bi bi-twitter-x"></i></a>
              </div>
            </div>

            <!-- Shop -->
            <div class="col-6 col-md-2">
              <h6 class="seller-footer-title">Shop</h6>
              <ul class="seller-footer-links">
                <li><a href="../../buyer/html/catalog.html">New arrivals</a></li>
                <li><a href="../../buyer/html/catalog.html">Best sellers</a></li>
                <li><a href="../../buyer/html/catalog.html">Shop all</a></li>
                <li><a href="../../buyer/html/catalog.html">Gift cards</a></li>
              </ul>
            </div>

            <!-- Sell with us -->
            <div class="col-6 col-md-2">
              <h6 class="seller-footer-title">Sell with us</h6>
              <ul class="seller-footer-links">
                <li><a href="../../common/html/register.html">Become a seller</a></li>
                <li><a href="dashboard.html">Seller Centre</a></li>
                <li><a href="support.html">Seller resources</a></li>
                <li><a href="support.html">Seller support</a></li>
              </ul>
            </div>

            <!-- Help -->
            <div class="col-6 col-md-2">
              <h6 class="seller-footer-title">Help</h6>
              <ul class="seller-footer-links">
                <li><a href="support.html">Contact us</a></li>
                <li><a href="shipping.html">Shipping &amp; delivery</a></li>
                <li><a href="returns.html">Returns &amp; refunds</a></li>
                <li><a href="orders.html">Track your order</a></li>
              </ul>
            </div>

            <!-- About ShopNow -->
            <div class="col-6 col-md-2">
              <h6 class="seller-footer-title">About ShopNow</h6>
              <ul class="seller-footer-links">
                <li><a href="../../common/html/about.html">Our story</a></li>
                <li><a href="../../common/html/about.html#culture-section">Careers</a></li>
                <li><a href="../../common/html/about.html">Journal</a></li>
                <li><a href="../../common/html/about.html">Our community</a></li>
              </ul>
            </div>
          </div>

          <!-- Bottom Row -->
          <div class="seller-bottom-divider d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div class="text-secondary small">
              &copy; 2026 ShopNow India. All rights reserved. &bull; <a href="javascript:void(0)" onclick="ShopNowCommon.showToast('ShopNow Privacy Policy compliant with Indian IT Rules', 'info')" class="text-secondary text-decoration-none">Privacy policy</a> &bull; <a href="javascript:void(0)" onclick="ShopNowCommon.showToast('ShopNow Terms of Service', 'info')" class="text-secondary text-decoration-none">Terms of service</a>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="text-secondary small me-1">Secure payments:</span>
              <span class="payment-method-pill">UPI</span>
              <span class="payment-method-pill">RuPay</span>
              <span class="payment-method-pill">VISA</span>
              <span class="payment-method-pill">NetBanking</span>
            </div>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // Mount on DOM Ready
  function mountSellerNavigation() {
    const headerContainer = document.getElementById('sellerHeader');
    if (headerContainer) {
      const activeTab = detectActiveTab(headerContainer);
      headerContainer.innerHTML = getSellerHeaderHtml(activeTab);
    }

    const footerContainer = document.getElementById('sellerFooter');
    if (footerContainer) {
      footerContainer.innerHTML = getSellerFooterHtml();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSellerNavigation);
  } else {
    mountSellerNavigation();
  }

  // Attach Sign Out Handler
  document.addEventListener('click', function (e) {
    const logoutBtn = e.target.closest('.btn-seller-logout');
    if (logoutBtn) {
      e.preventDefault();
      localStorage.removeItem('shopnow_current_user');
      localStorage.removeItem('shopnow_cart');
      localStorage.removeItem('shopnow_wishlist');
      if (typeof ShopNowCommon !== 'undefined' && ShopNowCommon.logout) {
        ShopNowCommon.logout();
      }
      window.location.href = '../../common/html/login.html?role=seller';
    }
  });

  window.ShopNowSellerNav = {
    setActiveTab: function (tab) {
      const links = document.querySelectorAll('.seller-nav-link');
      links.forEach(l => {
        if (l.textContent.trim().toLowerCase() === tab.toLowerCase()) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });
    }
  };
})();
