/**
 * ===================================================
 * SHOPNOW - COMMON GLOBAL JAVASCRIPT
 * Local Storage Helper, Session State & Toast Notifications
 * (No Header & Footer loading scripts included)
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
    window.location.reload();
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
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

  return {
    saveStorage,
    getStorage,
    removeStorage,
    getCurrentUser,
    setCurrentUser,
    logout,
    isLoggedIn,
    showToast,
    formatPrice,
    generateStars
  };
})();
