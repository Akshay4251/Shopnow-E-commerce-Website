/**
 * ===================================================
 * SHOPNOW - ADMIN SIDEBAR & TOPBAR CONTROLLER (admin-nav.js)
 * Injects responsive navy sidebar, active indicators,
 * search capsule, notification bell, and admin profile menu.
 * ===================================================
 */

(function () {
  'use strict';

  function getAdminSidebarHtml(activeTab = 'dashboard') {
    return `
      <!-- Brand Logo Header & Mobile Close Button -->
      <div class="admin-sidebar-header">
        <a href="dashboard.html" class="admin-sidebar-brand">
          <div class="admin-brand-icon">
            <i class="bi bi-bag-fill"></i>
          </div>
          <span class="admin-brand-name">ShopNow</span>
        </a>
        <button type="button" class="admin-sidebar-close-btn d-lg-none" id="btnCloseAdminSidebar" aria-label="Close Sidebar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Navigation Menu (14 Core Sections Matching Figma) -->
      <ul class="admin-sidebar-menu">
        <li>
          <a href="dashboard.html" class="admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}">
            <i class="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="sellers.html" class="admin-nav-item ${activeTab === 'sellers' ? 'active' : ''}">
            <i class="bi bi-shop"></i>
            <span>Seller</span>
          </a>
        </li>
        <li>
          <a href="buyers.html" class="admin-nav-item ${activeTab === 'buyers' ? 'active' : ''}">
            <i class="bi bi-people-fill"></i>
            <span>Buyer</span>
          </a>
        </li>
        <li>
          <a href="delivery-agents.html" class="admin-nav-item ${activeTab === 'delivery' ? 'active' : ''}">
            <i class="bi bi-truck"></i>
            <span>Delivery Agent</span>
          </a>
        </li>
        <li>
          <a href="orders.html" class="admin-nav-item ${activeTab === 'orders' ? 'active' : ''}">
            <i class="bi bi-receipt"></i>
            <span>Order Management</span>
          </a>
        </li>
        <li>
          <a href="returns-refunds.html" class="admin-nav-item ${activeTab === 'returns' ? 'active' : ''}">
            <i class="bi bi-arrow-left-right"></i>
            <span>Return and Refund</span>
          </a>
        </li>
        <li>
          <a href="products.html" class="admin-nav-item ${activeTab === 'products' ? 'active' : ''}">
            <i class="bi bi-box-seam-fill"></i>
            <span>Product</span>
          </a>
        </li>
        <li>
          <a href="categories.html" class="admin-nav-item ${activeTab === 'categories' ? 'active' : ''}">
            <i class="bi bi-tags-fill"></i>
            <span>Categories</span>
          </a>
        </li>
        <li>
          <a href="payouts.html" class="admin-nav-item ${activeTab === 'payouts' ? 'active' : ''}">
            <i class="bi bi-cash-coin"></i>
            <span>Commission &amp; Payout</span>
          </a>
        </li>
        <li>
          <a href="promotions.html" class="admin-nav-item ${activeTab === 'promotions' ? 'active' : ''}">
            <i class="bi bi-megaphone-fill"></i>
            <span>Promotion</span>
          </a>
        </li>
        <li>
          <a href="support.html" class="admin-nav-item ${activeTab === 'support' ? 'active' : ''}">
            <i class="bi bi-headset"></i>
            <span>Support &amp; Complaint</span>
          </a>
        </li>
        <li>
          <a href="reports.html" class="admin-nav-item ${activeTab === 'reports' ? 'active' : ''}">
            <i class="bi bi-bar-chart-fill"></i>
            <span>Reports</span>
          </a>
        </li>
        <li>
          <a href="notifications.html" class="admin-nav-item ${activeTab === 'notifications' ? 'active' : ''}">
            <i class="bi bi-bell-fill"></i>
            <span>Notification</span>
          </a>
        </li>
        <li>
          <a href="profile.html" class="admin-nav-item ${activeTab === 'profile' ? 'active' : ''}">
            <i class="bi bi-person-badge-fill"></i>
            <span>Profile Management</span>
          </a>
        </li>
      </ul>

      <!-- Footer Version -->
      <div class="admin-sidebar-footer">
        <a href="profile.html"><i class="bi bi-shield-check me-1"></i> Admin HQ</a>
        <span class="text-secondary extra-small">v3.0.0</span>
      </div>
    `;
  }

  function getAdminTopBarHtml() {
    return `
      <div class="d-flex align-items-center justify-content-between gap-3">
        <!-- Mobile Toggle & Global Search Capsule -->
        <div class="d-flex align-items-center gap-3 flex-grow-1">
          <button class="btn btn-light d-lg-none py-1 px-2 border" id="btnToggleAdminSidebar" type="button">
            <i class="bi bi-list fs-5"></i>
          </button>
          
          <form class="admin-search-form d-none d-sm-block" id="adminGlobalSearchForm" action="orders.html" method="GET">
            <i class="bi bi-search admin-search-icon"></i>
            <input type="text" name="q" class="admin-search-input" placeholder="Search products, orders, sellers, buyers..." />
          </form>
        </div>

        <!-- Notification & Admin Profile Dropdown -->
        <div class="d-flex align-items-center gap-3">
          <!-- Notification Bell -->
          <a href="notifications.html" class="btn btn-light rounded-circle position-relative p-2" title="Notifications">
            <i class="bi bi-bell text-secondary fs-6"></i>
            <span class="position-absolute top-0 start-100 translate-middle p-1 bg-coral border border-light rounded-circle" style="background-color: #ff5338;"></span>
          </a>

          <!-- Profile Pill Dropdown -->
          <div class="dropdown">
            <div class="admin-profile-pill" data-bs-toggle="dropdown" aria-expanded="false">
              <div class="admin-avatar">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80" alt="Super Admin" />
              </div>
              <div class="d-none d-sm-block text-start pe-1">
                <span class="fw-bold small d-block lh-1 text-dark">Admin HQ</span>
                <span class="extra-small text-muted">Super Administrator</span>
              </div>
              <i class="bi bi-chevron-down text-muted small ms-1"></i>
            </div>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2">
              <li><h6 class="dropdown-header">System Administration</h6></li>
              <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>Admin Profile</a></li>
              <li><a class="dropdown-item" href="reports.html"><i class="bi bi-graph-up-arrow me-2"></i>System Analytics</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="../../seller/html/dashboard.html"><i class="bi bi-shop me-2"></i>Switch to Seller</a></li>
              <li><a class="dropdown-item" href="../../buyer/html/dashboard.html"><i class="bi bi-bag me-2"></i>Switch to Buyer</a></li>
              <li><a class="dropdown-item" href="../../delivery-agent/html/dashboard.html"><i class="bi bi-truck me-2"></i>Switch to Delivery</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger btn-admin-logout" href="../../common/html/login.html?role=admin"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const sidebarContainer = document.getElementById('adminSidebar');
    if (sidebarContainer) {
      const activeTab = sidebarContainer.getAttribute('data-active') || 'dashboard';
      sidebarContainer.innerHTML = getAdminSidebarHtml(activeTab);
    }

    const topBarContainer = document.getElementById('adminTopBar');
    if (topBarContainer) {
      topBarContainer.innerHTML = getAdminTopBarHtml();
    }

    // Mobile Sidebar & Backdrop Controller (Hamburger effect)
    let backdrop = document.getElementById('adminSidebarBackdrop');
    if (!backdrop && sidebarContainer) {
      backdrop = document.createElement('div');
      backdrop.className = 'admin-sidebar-backdrop';
      backdrop.id = 'adminSidebarBackdrop';
      document.body.appendChild(backdrop);
    }

    function openSidebar() {
      if (sidebarContainer) {
        sidebarContainer.classList.add('show');
        document.body.classList.add('admin-sidebar-open');
      }
      if (backdrop) {
        backdrop.classList.add('show');
      }
    }

    function closeSidebar() {
      if (sidebarContainer) {
        sidebarContainer.classList.remove('show');
        document.body.classList.remove('admin-sidebar-open');
      }
      if (backdrop) {
        backdrop.classList.remove('show');
      }
    }

    const toggleBtn = document.getElementById('btnToggleAdminSidebar');
    if (toggleBtn && sidebarContainer) {
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (sidebarContainer.classList.contains('show')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    // Close button inside sidebar header
    const closeBtn = document.getElementById('btnCloseAdminSidebar');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeSidebar();
      });
    }

    // Click on backdrop to close
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        e.stopPropagation();
        closeSidebar();
      });
    }

    // Click outside handler for mobile
    document.addEventListener('click', function (e) {
      if (window.innerWidth < 992 && sidebarContainer && sidebarContainer.classList.contains('show')) {
        if (!sidebarContainer.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
          closeSidebar();
        }
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebarContainer && sidebarContainer.classList.contains('show')) {
        closeSidebar();
      }
    });

    // Close sidebar on link click on mobile
    if (sidebarContainer) {
      sidebarContainer.addEventListener('click', function (e) {
        if (window.innerWidth < 992 && e.target.closest('.admin-nav-item')) {
          closeSidebar();
        }
      });
    }

    // Logout click listener
    document.addEventListener('click', function (e) {
      if (e.target.closest('.btn-admin-logout')) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.logout();
        } else {
          localStorage.removeItem('shopnow_current_user');
          localStorage.removeItem('shopnow_cart');
          localStorage.removeItem('shopnow_wishlist');
        }
      }
    });
  });
})();
