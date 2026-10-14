/**
 * ===================================================
 * SHOPNOW - DELIVERY AGENT SIDEBAR & TOPBAR CONTROLLER
 * Injects responsive navy sidebar, active indicators,
 * live online toggle, and profile management menu.
 * ===================================================
 */

(function () {
  'use strict';

  function getSidebarHtml(activeTab = 'dashboard') {
    return `
      <!-- Brand Logo Header & Mobile Close Button -->
      <div class="delivery-sidebar-header">
        <a href="dashboard.html" class="delivery-sidebar-brand">
          <div class="delivery-brand-icon">
            <i class="bi bi-bag-fill"></i>
          </div>
          <span class="delivery-brand-name">ShopNow</span>
        </a>
        <button type="button" class="delivery-sidebar-close-btn d-lg-none" id="btnCloseDeliverySidebar" aria-label="Close Sidebar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Navigation Menu -->
      <ul class="delivery-sidebar-menu">
        <li>
          <a href="dashboard.html" class="delivery-nav-item ${activeTab === 'dashboard' ? 'active' : ''}">
            <i class="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="assigned-orders.html" class="delivery-nav-item ${activeTab === 'orders' ? 'active' : ''}">
            <i class="bi bi-box-seam-fill"></i>
            <span>Assigned Orders</span>
          </a>
        </li>
        <li>
          <a href="location.html" class="delivery-nav-item ${activeTab === 'location' ? 'active' : ''}">
            <i class="bi bi-geo-alt-fill"></i>
            <span>Location</span>
          </a>
        </li>
        <li>
          <a href="customer-interaction.html" class="delivery-nav-item ${activeTab === 'interaction' ? 'active' : ''}">
            <i class="bi bi-chat-left-dots-fill"></i>
            <span>Customer Interaction</span>
          </a>
        </li>
        <li>
          <a href="payment.html" class="delivery-nav-item ${activeTab === 'payment' ? 'active' : ''}">
            <i class="bi bi-credit-card-2-front-fill"></i>
            <span>Payment Management</span>
          </a>
        </li>
        <li>
          <a href="history.html" class="delivery-nav-item ${activeTab === 'history' ? 'active' : ''}">
            <i class="bi bi-clock-history"></i>
            <span>History</span>
          </a>
        </li>
        <li>
          <a href="reports.html" class="delivery-nav-item ${activeTab === 'reports' ? 'active' : ''}">
            <i class="bi bi-bar-chart-line-fill"></i>
            <span>Reports</span>
          </a>
        </li>
        <li>
          <a href="profile.html" class="delivery-nav-item ${activeTab === 'profile' ? 'active' : ''}">
            <i class="bi bi-person-fill"></i>
            <span>Profile</span>
          </a>
        </li>
      </ul>

      <!-- Footer Help -->
      <div class="delivery-sidebar-footer">
        <a href="profile.html#help"><i class="bi bi-question-circle me-1"></i> Help & Support</a>
        <span class="text-secondary extra-small">v2.4.0</span>
      </div>
    `;
  }

  function getTopBarHtml() {
    const currentUser = (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null) || JSON.parse(localStorage.getItem('shopnow_current_user') || 'null');
    const agentName = currentUser && currentUser.name ? currentUser.name : 'Dave Miller';
    const agentId = currentUser && currentUser.id ? 'DRV-' + currentUser.id : 'DRV-821';

    return `
      <div class="d-flex align-items-center justify-content-between gap-3">
        <!-- Mobile Toggle & Search Capsule -->
        <div class="d-flex align-items-center gap-3 flex-grow-1">
          <button class="btn btn-light d-lg-none py-1 px-2 border" id="btnToggleDeliverySidebar" type="button">
            <i class="bi bi-list fs-5"></i>
          </button>
          
          <form class="delivery-search-form d-none d-sm-block" id="deliverySearchForm" action="assigned-orders.html" method="GET">
            <i class="bi bi-search delivery-search-icon"></i>
            <input type="text" name="q" class="delivery-search-input" placeholder="Search orders, clients, or addresses..." />
          </form>
        </div>

        <!-- Online Switch, Notification & Profile Pill -->
        <div class="d-flex align-items-center gap-3">
          <!-- Active & Online Toggle Switch (Matching Figma) -->
          <div class="d-flex align-items-center gap-2">
            <span class="delivery-online-status-badge d-none d-md-inline-flex" id="deliveryOnlineBadge">
              <span class="online-dot"></span>
              <span id="deliveryOnlineText">Active &amp; Online</span>
            </span>
            <div class="form-check form-switch m-0 p-0">
              <input class="form-check-input cursor-pointer" type="checkbox" id="toggleAgentOnlineSwitch" checked style="width: 44px; height: 22px;" />
            </div>
          </div>

          <!-- Notification Bell -->
          <a href="assigned-orders.html" class="btn btn-light rounded-circle position-relative p-2" title="Notifications">
            <i class="bi bi-bell text-secondary fs-6"></i>
            <span class="position-absolute top-0 start-100 translate-middle p-1 bg-coral border border-light rounded-circle" style="background-color: #ff5338;"></span>
          </a>

          <!-- Profile Pill Dropdown (Matching Figma) -->
          <div class="dropdown">
            <div class="delivery-profile-pill" data-bs-toggle="dropdown" aria-expanded="false">
              <div class="delivery-avatar">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" alt="${agentName}" />
              </div>
              <div class="d-none d-sm-block text-start pe-1">
                <span class="fw-bold small d-block lh-1 text-dark">${agentName}</span>
                <span class="extra-small text-muted">ID: ${agentId}</span>
              </div>
              <i class="bi bi-chevron-down text-muted small ms-1"></i>
            </div>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2">
              <li><h6 class="dropdown-header">Delivery Professional</h6></li>
              <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>My Profile</a></li>
              <li><a class="dropdown-item" href="payment.html"><i class="bi bi-wallet2 me-2"></i>Earnings &amp; Payouts</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="../../seller/html/dashboard.html"><i class="bi bi-shop me-2"></i>Switch to Seller</a></li>
              <li><a class="dropdown-item" href="../../buyer/html/dashboard.html"><i class="bi bi-arrow-repeat me-2"></i>Switch to Buyer</a></li>
              <li><a class="dropdown-item text-danger btn-delivery-logout" href="../../common/html/login.html?role=delivery"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const sidebarContainer = document.getElementById('deliverySidebar');
    if (sidebarContainer) {
      const activeTab = sidebarContainer.getAttribute('data-active') || 'dashboard';
      sidebarContainer.innerHTML = getSidebarHtml(activeTab);
    }

    const topBarContainer = document.getElementById('deliveryTopBar');
    if (topBarContainer) {
      topBarContainer.innerHTML = getTopBarHtml();
    }

    // Mobile Sidebar & Backdrop Controller (Hamburger effect)
    let backdrop = document.getElementById('deliverySidebarBackdrop');
    if (!backdrop && sidebarContainer) {
      backdrop = document.createElement('div');
      backdrop.className = 'delivery-sidebar-backdrop';
      backdrop.id = 'deliverySidebarBackdrop';
      document.body.appendChild(backdrop);
    }

    function openSidebar() {
      if (sidebarContainer) {
        sidebarContainer.classList.add('show');
        document.body.classList.add('delivery-sidebar-open');
      }
      if (backdrop) {
        backdrop.classList.add('show');
      }
    }

    function closeSidebar() {
      if (sidebarContainer) {
        sidebarContainer.classList.remove('show');
        document.body.classList.remove('delivery-sidebar-open');
      }
      if (backdrop) {
        backdrop.classList.remove('show');
      }
    }

    const toggleBtn = document.getElementById('btnToggleDeliverySidebar');
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
    const closeBtn = document.getElementById('btnCloseDeliverySidebar');
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
        if (window.innerWidth < 992 && e.target.closest('.delivery-nav-item')) {
          closeSidebar();
        }
      });
    }

    // Online status switch toggle
    const onlineSwitch = document.getElementById('toggleAgentOnlineSwitch');
    const onlineBadge = document.getElementById('deliveryOnlineBadge');
    const onlineText = document.getElementById('deliveryOnlineText');
    if (onlineSwitch && onlineBadge && onlineText) {
      onlineSwitch.addEventListener('change', function () {
        if (this.checked) {
          onlineBadge.className = 'delivery-online-status-badge d-none d-md-inline-flex';
          onlineText.innerText = 'Active & Online';
          if (typeof ShopNowCommon !== 'undefined') {
            ShopNowCommon.showToast('You are now Online and ready to receive dispatch requests!', 'success');
          }
        } else {
          onlineBadge.className = 'delivery-online-status-badge d-none d-md-inline-flex bg-secondary-subtle border-secondary-subtle text-secondary';
          onlineText.innerText = 'Offline';
          if (typeof ShopNowCommon !== 'undefined') {
            ShopNowCommon.showToast('You are now Offline. No new delivery runs will be assigned.', 'info');
          }
        }
      });
    }

    // Logout click handler
    document.addEventListener('click', function (e) {
      if (e.target.closest('.btn-delivery-logout')) {
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
