/**
 * ===================================================
 * SHOPNOW - COMMON GLOBAL JAVASCRIPT & API CLIENT
 * Local Storage Helper, Session State, Toast UI &
 * Central MockAPI Client for Users, Addresses, Orders,
 * Returns, Notifications, and Support Tickets.
 * ===================================================
 */

const ShopNowCommon = (function () {
  'use strict';

  // Storage Helpers
  function saveStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  }

  function getStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage read error:', e);
      return null;
    }
  }

  function removeStorage(key) {
    localStorage.removeItem(key);
  }

  // Auth Session Helpers
  function getCurrentUser() {
    return getStorage('shopnow_current_user');
  }

  function setCurrentUser(user) {
    return saveStorage('shopnow_current_user', user);
  }

  function logout() {
    removeStorage('shopnow_current_user');
    removeStorage('shopnow_cart');
    removeStorage('shopnow_wishlist');
    window.location.reload();
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  // Scoped User Cart & Wishlist Helpers (Prevents leakage between users or when signed out)
  function getUserCart(user) {
    const u = user !== undefined ? user : getCurrentUser();
    if (!u || !u.email) return [];
    const userKey = `shopnow_cart_${u.email.toLowerCase()}`;
    const data = getStorage(userKey);
    if (data !== null) return data;
    // For demo buyer account only, migrate existing cart if present
    if (u.email.toLowerCase() === 'buyer@demo.com') {
      const legacy = getStorage('shopnow_cart');
      if (Array.isArray(legacy) && legacy.length > 0) {
        saveStorage(userKey, legacy);
        return legacy;
      }
    }
    return [];
  }

  function saveUserCart(cart, user) {
    const u = user !== undefined ? user : getCurrentUser();
    if (!u || !u.email) return false;
    const userKey = `shopnow_cart_${u.email.toLowerCase()}`;
    return saveStorage(userKey, cart);
  }

  function getUserWishlist(user) {
    const u = user !== undefined ? user : getCurrentUser();
    if (!u || !u.email) return [];
    const userKey = `shopnow_wishlist_${u.email.toLowerCase()}`;
    const data = getStorage(userKey);
    if (data !== null) return data;
    // For demo buyer account only, migrate existing wishlist if present
    if (u.email.toLowerCase() === 'buyer@demo.com') {
      const legacy = getStorage('shopnow_wishlist');
      if (Array.isArray(legacy) && legacy.length > 0) {
        saveStorage(userKey, legacy);
        return legacy;
      }
    }
    return [];
  }

  function saveUserWishlist(wishlist, user) {
    const u = user !== undefined ? user : getCurrentUser();
    if (!u || !u.email) return false;
    const userKey = `shopnow_wishlist_${u.email.toLowerCase()}`;
    return saveStorage(userKey, wishlist);
  }

  // Toast UI
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `shopnow-toast shopnow-toast-${type}`;
    toast.innerHTML = `
      <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'}"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Formatters
  function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
  }

  function generateStars(rating, maxStars = 5) {
    let html = '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) html += '<i class="bi bi-star-fill text-warning"></i>';
    if (half) html += '<i class="bi bi-star-half text-warning"></i>';
    const empty = maxStars - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) html += '<i class="bi bi-star text-warning"></i>';
    return html;
  }

  // Route Protection: Check if user is logged in on protected pages
  function enforceAuthGuard() {
    const fullPath = (window.location.pathname || '').toLowerCase().replace(/\\/g, '/');
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1) || 'index.html';

    // Exempt public pages (Home, About Us, Contact Us, Login, Register)
    const publicPages = [
      '',
      'index.html',
      'home.html',
      'about.html',
      'contact.html',
      'login.html',
      'register.html'
    ];

    if (publicPages.includes(fileName)) {
      return;
    }

    const user = getCurrentUser();
    if (!user || !user.email) {
      console.warn(`[ShopNow Guard] Unauthenticated access to "${fileName}". Redirecting to login.`);
      let loginPath = 'login.html';
      if (fullPath.includes('/seller/') || fullPath.includes('/buyer/') || fullPath.includes('/admin/') || fullPath.includes('/delivery-agent/')) {
        loginPath = '../../common/html/login.html';
      } else if (fullPath.includes('/common/')) {
        loginPath = 'login.html';
      } else {
        loginPath = 'common/html/login.html';
      }

      const redirectTarget = encodeURIComponent(window.location.href);
      window.location.replace(`${loginPath}?auth_required=true&redirect=${redirectTarget}`);
    }
  }

  // Execute guard on script evaluation
  try {
    enforceAuthGuard();
  } catch (err) {
    console.warn('[ShopNow Guard] Error during auth check:', err);
  }

  return {
    saveStorage,
    getStorage,
    removeStorage,
    getCurrentUser,
    setCurrentUser,
    logout,
    isLoggedIn,
    enforceAuthGuard,
    getUserCart,
    saveUserCart,
    getUserWishlist,
    saveUserWishlist,
    showToast,
    formatPrice,
    generateStars
  };
})();

/**
 * ===================================================
 * SHOPNOW MOCKAPI CLIENT (RESILIENT / OFFLINE-FIRST)
 * Synchronizes with user's created endpoints, falling back
 * to localStorage whenever network is slow or offline.
 * ===================================================
 */
const ShopNowAPI = (function () {
  'use strict';

  const ENDPOINTS = {
    USERS: 'https://6acc618fef37b15040787a1f.mockapi.io/api/v1/users',
    ADDRESSES: 'https://6acc618fef37b15040787a1f.mockapi.io/api/v1/addresses',
    ORDERS: 'https://6acc64d4ef37b15040787da2.mockapi.io/api/v1/orders',
    RETURNS: 'https://6acc64d4ef37b15040787da2.mockapi.io/api/v1/returns',
    NOTIFICATIONS: 'https://6acc6698ef37b15040787ff7.mockapi.io/api/v1/notifications',
    SUPPORT_TICKETS: 'https://6acc6698ef37b15040787ff7.mockapi.io/api/v1/support_tickets',
    PRODUCTS: 'https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/products'
  };

  const CLOUDINARY_CONFIG = {
    cloudName: 'dpva4smxo',            // <-- PUT YOUR CLOUDINARY CLOUD NAME HERE
    uploadPreset: 'ml_default',     // <-- PUT YOUR CLOUDINARY UNSIGNED PRESET HERE
    apiKey: '117174192694644',                        // <-- (Optional) API Key if required
    get uploadUrl() {
      return `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    }
  };

  const TIMEOUT_MS = 5000;

  async function request(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[ShopNowAPI] Network request notice for ${url}:`, err.message);
      return null;
    }
  }

  // 1. Users Service
  async function getUsers() {
    const remote = await request(ENDPOINTS.USERS);
    if (Array.isArray(remote) && remote.length > 0) {
      ShopNowCommon.saveStorage('shopnow_users', remote);
      return remote;
    }
    return ShopNowCommon.getStorage('shopnow_users') || [];
  }

  async function createUser(user) {
    const remote = await request(ENDPOINTS.USERS, {
      method: 'POST',
      body: JSON.stringify(user)
    });
    const users = ShopNowCommon.getStorage('shopnow_users') || [];
    users.push(remote || user);
    ShopNowCommon.saveStorage('shopnow_users', users);
    return remote || user;
  }

  // 2. Addresses Service
  async function getAddresses() {
    const remote = await request(ENDPOINTS.ADDRESSES);
    if (Array.isArray(remote) && remote.length > 0) {
      ShopNowCommon.saveStorage('shopnow_addresses', remote);
      return remote;
    }
    return ShopNowCommon.getStorage('shopnow_addresses') || [];
  }

  async function createAddress(address) {
    const remote = await request(ENDPOINTS.ADDRESSES, {
      method: 'POST',
      body: JSON.stringify(address)
    });
    const addresses = ShopNowCommon.getStorage('shopnow_addresses') || [];
    addresses.push(remote || address);
    ShopNowCommon.saveStorage('shopnow_addresses', addresses);
    return remote || address;
  }

  // 3. Orders Service
  async function getOrders() {
    const remote = await request(ENDPOINTS.ORDERS);
    if (Array.isArray(remote) && remote.length > 0) {
      ShopNowCommon.saveStorage('shopnow_orders', remote);
      return remote;
    }
    return ShopNowCommon.getStorage('shopnow_orders') || [];
  }

  async function createOrder(order) {
    const remote = await request(ENDPOINTS.ORDERS, {
      method: 'POST',
      body: JSON.stringify(order)
    });
    const orders = ShopNowCommon.getStorage('shopnow_orders') || [];
    orders.unshift(remote || order);
    ShopNowCommon.saveStorage('shopnow_orders', orders);
    return remote || order;
  }

  async function updateOrder(id, data) {
    let remote = null;
    if (id) {
      remote = await request(`${ENDPOINTS.ORDERS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
    const orders = ShopNowCommon.getStorage('shopnow_orders') || [];
    const idx = orders.findIndex(o => o.id == id || o.orderId == id);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...data, ...(remote || {}) };
      ShopNowCommon.saveStorage('shopnow_orders', orders);
    }
    return remote || data;
  }

  // 4. Returns Service
  async function getReturns() {
    const remote = await request(ENDPOINTS.RETURNS);
    if (Array.isArray(remote) && remote.length > 0) {
      ShopNowCommon.saveStorage('shopnow_returns', remote);
      return remote;
    }
    return ShopNowCommon.getStorage('shopnow_returns') || [];
  }

  async function createReturn(ret) {
    const remote = await request(ENDPOINTS.RETURNS, {
      method: 'POST',
      body: JSON.stringify(ret)
    });
    const returns = ShopNowCommon.getStorage('shopnow_returns') || [];
    returns.unshift(remote || ret);
    ShopNowCommon.saveStorage('shopnow_returns', returns);
    return remote || ret;
  }

  async function updateReturn(id, data) {
    let remote = null;
    if (id) {
      remote = await request(`${ENDPOINTS.RETURNS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
    const returns = ShopNowCommon.getStorage('shopnow_returns') || [];
    const idx = returns.findIndex(r => r.id == id || r.returnId == id);
    if (idx !== -1) {
      returns[idx] = { ...returns[idx], ...data, ...(remote || {}) };
      ShopNowCommon.saveStorage('shopnow_returns', returns);
    }
    return remote || data;
  }

  // 5. Notifications Service
  async function getNotifications() {
    const remote = await request(ENDPOINTS.NOTIFICATIONS);
    if (Array.isArray(remote) && remote.length > 0) {
      ShopNowCommon.saveStorage('shopnow_notifications', remote);
      return remote;
    }
    return ShopNowCommon.getStorage('shopnow_notifications') || [];
  }

  async function createNotification(notif) {
    const remote = await request(ENDPOINTS.NOTIFICATIONS, {
      method: 'POST',
      body: JSON.stringify(notif)
    });
    const notifs = ShopNowCommon.getStorage('shopnow_notifications') || [];
    notifs.unshift(remote || notif);
    ShopNowCommon.saveStorage('shopnow_notifications', notifs);
    return remote || notif;
  }

  // 6. Support Tickets Service
  async function getSupportTickets() {
    const remote = await request(ENDPOINTS.SUPPORT_TICKETS);
    if (Array.isArray(remote) && remote.length > 0) {
      ShopNowCommon.saveStorage('shopnow_support_tickets', remote);
      return remote;
    }
    return ShopNowCommon.getStorage('shopnow_support_tickets') || [];
  }

  async function createSupportTicket(ticket) {
    const remote = await request(ENDPOINTS.SUPPORT_TICKETS, {
      method: 'POST',
      body: JSON.stringify(ticket)
    });
    const tickets = ShopNowCommon.getStorage('shopnow_support_tickets') || [];
    tickets.unshift(remote || ticket);
    ShopNowCommon.saveStorage('shopnow_support_tickets', tickets);
    return remote || ticket;
  }

  return {
    ENDPOINTS,
    CLOUDINARY: CLOUDINARY_CONFIG,
    CLOUDINARY_CONFIG,
    request,
    getUsers,
    createUser,
    getAddresses,
    createAddress,
    getOrders,
    createOrder,
    updateOrder,
    getReturns,
    createReturn,
    updateReturn,
    getNotifications,
    createNotification,
    getSupportTickets,
    createSupportTicket
  };
})();

// Attach to global ShopNowCommon as well
if (typeof ShopNowCommon !== 'undefined') {
  ShopNowCommon.API = ShopNowAPI;
}
