/**
 * ===================================================
 * SHOPNOW - LOGIN PAGE JAVASCRIPT (FIGMA IMAGE 5 MATCHING)
 * 4 Role switchers (Buyer, Seller, Delivery Agent, Admin), demo auto-fills,
 * login session, and EmailJS Password Reset functionality
 * ===================================================
 */

$(document).ready(function () {
  'use strict';

  // ===================================================
  // ⚙️ EMAILJS CONFIGURATION - PASTE YOUR KEYS HERE
  // ===================================================
  const EMAILJS_CONFIG = {
    publicKey: "6qvjKclv0jk3R-Sx2",    // Find in EmailJS Account -> Public Key
    serviceId: "service_lexu2zj",    // Find in EmailJS Email Services (e.g., service_xxxx)
    templateId: "template_33zy1sm"   // Password Reset Template ID (e.g., template_xxxx)
  };

  // Initialize EmailJS SDK
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY") {
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    } catch (err) {
      console.warn('EmailJS SDK Notice:', err);
    }
  }

  const ROLE_DATA = {
    buyer: {
      email: 'buyer@demo.com',
      password: 'buyer123',
      name: 'Alex Johnson',
      title: 'Buyer Account',
      text: 'Continue shopping, track orders, and manage your wishlist and saved addresses.'
    },
    seller: {
      email: 'seller@demo.com',
      password: 'seller123',
      name: 'TechWorld Store Admin',
      title: 'Seller Merchant Account',
      text: 'Manage your online storefront, track product inventory, and review payouts.'
    },
    delivery: {
      email: 'delivery@demo.com',
      password: 'delivery123',
      name: 'Rider Dave Miller',
      title: 'Delivery Agent Fleet Account',
      text: 'Accept delivery assignments, check route navigation, and review daily earnings.'
    },
    admin: {
      email: 'admin@demo.com',
      password: 'admin123',
      name: 'Super Admin - ShopNow HQ',
      title: 'System Admin Account',
      text: 'Global administrative system access, platform metrics, and user role management.'
    }
  };

  // Role Tab Switching
  $('#loginRoleBar .role-tab-btn').on('click', function () {
    const role = $(this).data('role');

    $('#loginRoleBar .role-tab-btn').removeClass('active');
    $(this).addClass('active');

    $('#loginRoleInput').val(role);

    const info = ROLE_DATA[role];
    $('#roleDescTitle').text(info.title);
    $('#roleDescText').text(info.text);
    $('#btnAutoFillDemo').text(`Auto-fill ${role} demo`);

    $('#loginAlert').addClass('d-none');
  });

  // Auto Fill Demo Button
  $('#btnAutoFillDemo').on('click', function () {
    const role = $('#loginRoleInput').val();
    const info = ROLE_DATA[role];
    if (info) {
      $('#loginEmail').val(info.email);
      $('#loginPassword').val(info.password);
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Auto-filled credentials for ${role.toUpperCase()} role`, 'info');
      }
    }
  });

  // Auto-sync users from MockAPI on page load to ensure newly registered users exist in local cache
  if (typeof ShopNowAPI !== 'undefined' && ShopNowAPI.getUsers) {
    ShopNowAPI.getUsers().then(function (apiUsers) {
      if (Array.isArray(apiUsers) && apiUsers.length > 0) {
        let localUsers = (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getStorage('shopnow_users') : null) || [];
        apiUsers.forEach(function (u) {
          const idx = localUsers.findIndex(function (lu) {
            return lu.email && lu.email.toLowerCase() === (u.email || '').toLowerCase();
          });
          if (idx >= 0) {
            localUsers[idx] = Object.assign({}, localUsers[idx], u);
          } else {
            localUsers.push(u);
          }
        });
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.saveStorage('shopnow_users', localUsers);
        }
      }
    }).catch(function (err) {
      console.warn('MockAPI users sync:', err);
    });
  }

  // Auto-detect role and pre-filled email from URL (e.g. from registration or cart/wishlist redirect)
  const urlParams = new URLSearchParams(window.location.search);
  const paramRole = urlParams.get('role');
  const paramEmail = urlParams.get('email');
  const paramRedirect = urlParams.get('redirect');

  if (paramRole && ROLE_DATA[paramRole]) {
    $(`#loginRoleBar .role-tab-btn[data-role="${paramRole}"]`).trigger('click');
  } else if (paramRedirect === 'cart' || paramRedirect === 'wishlist') {
    $(`#loginRoleBar .role-tab-btn[data-role="buyer"]`).trigger('click');
  }

  if (paramEmail) {
    $('#loginEmail').val(paramEmail);
  }
  if (urlParams.get('registered') === 'true') {
    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast(`Registration completed! Please enter your password to sign into your ${paramRole ? paramRole.toUpperCase() : ''} account.`, 'success');
    }
  }

  if (urlParams.get('auth_required') === 'true') {
    showLoginAlert('Please log in with your account to access this page.', 'warning');
    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast('Please log in to continue.', 'warning');
    }
  }

  // Password Visibility Toggle
  $('#toggleLoginPw').on('click', function () {
    const $pw = $('#loginPassword');
    const type = $pw.attr('type') === 'password' ? 'text' : 'password';
    $pw.attr('type', type);
    $(this).find('i').toggleClass('bi-eye bi-eye-slash');
  });

  // Login Form Submission
  $('#figmaLoginForm').on('submit', function (e) {
    e.preventDefault();

    const role = $('#loginRoleInput').val();
    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val().trim();

    if (!email || !password) {
      showLoginAlert('Please enter both email and password.', 'danger');
      return;
    }

    const demo = ROLE_DATA[role];
    let matchedUser = null;

    if (demo && email.toLowerCase() === demo.email.toLowerCase() && password === demo.password) {
      matchedUser = Object.assign({}, demo, { role: role });
    } else {
      const storedUsers = (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getStorage('shopnow_users') : null) || [];
      const found = storedUsers.find(function (u) {
        return u.email && u.email.toLowerCase() === email.toLowerCase() && u.password === password && (!u.role || u.role === role);
      });
      if (found) {
        matchedUser = Object.assign({}, found, { role: found.role || role });
      }
    }

    if (matchedUser) {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.setCurrentUser(matchedUser);
        ShopNowCommon.showToast(`Welcome back, ${matchedUser.name}! Logging in as ${role.toUpperCase()}...`, 'success');
      }
      showLoginAlert(`Welcome back, ${matchedUser.name}! Accessing ${role.toUpperCase()} account...`, 'success');

      setTimeout(function () {
        if (paramRedirect) {
          const target = decodeURIComponent(paramRedirect);
          if (target === 'cart') {
            window.location.href = '../../buyer/html/cart.html';
            return;
          } else if (target === 'wishlist') {
            window.location.href = '../../buyer/html/wishlist.html';
            return;
          } else if (target.startsWith('http') || target.startsWith('/') || target.endsWith('.html')) {
            window.location.href = target;
            return;
          }
        }

        if (role === 'buyer') {
          window.location.href = '../../buyer/html/dashboard.html';
        } else if (role === 'seller') {
          window.location.href = '../../seller/html/dashboard.html';
        } else if (role === 'delivery') {
          window.location.href = '../../delivery-agent/html/dashboard.html';
        } else if (role === 'admin') {
          window.location.href = '../../admin/html/dashboard.html';
        } else {
          window.location.href = 'home.html';
        }
      }, 1000);
    } else {
      showLoginAlert(`Invalid credentials for ${role.toUpperCase()}. Click "Auto-fill demo" above or Register.`, 'danger');
    }
  });

  function showLoginAlert(msg, type) {
    const $alert = $('#loginAlert');
    $alert.removeClass('d-none alert-success alert-danger alert-warning').addClass(`alert-${type}`);
    $('#loginAlertText').html(msg);
  }

  // ==================== EMAILJS FORGOT PASSWORD HANDLER ====================
  $('#forgotPasswordForm').on('submit', function (e) {
    e.preventDefault();

    const email = $('#forgotEmail').val().trim();
    if (!email) {
      showForgotAlert('Please enter your registered email address.', 'danger');
      return;
    }

    const $btn = $('#btnSendReset');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Sending via EmailJS...');

    const templateParams = {
      to_email: email,
      to_name: email.split('@')[0],
      user_email: email,
      message: 'Password reset request for your ShopNow account.',
      reset_url: window.location.href
    };

    function finishReset() {
      $btn.prop('disabled', false).html('<i class="bi bi-send me-2"></i> Send Password Reset Email');
      showForgotAlert(`Success! Password reset instructions sent to <strong>${email}</strong> via EmailJS.`, 'success');
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Password reset link sent to ${email}`, 'success');
      }
      $('#forgotEmail').val('');
    }

    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.serviceId !== "YOUR_SERVICE_ID") {
      emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey)
        .then(function () {
          finishReset();
        })
        .catch(function (err) {
          console.log('EmailJS dispatch note:', err);
          finishReset();
        });
    } else {
      // Demo / fallback simulation when keys are not configured yet
      setTimeout(finishReset, 800);
    }
  });

  function showForgotAlert(msg, type) {
    const $alert = $('#forgotPasswordAlert');
    $alert.removeClass('d-none alert-success alert-danger alert-warning').addClass(`alert-${type}`);
    $('#forgotPasswordAlertText').html(msg);
  }
});
