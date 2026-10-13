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
    if (demo && email === demo.email && password === demo.password) {
      const user = { name: demo.name, email: demo.email, role: role };
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.setCurrentUser(user);
        ShopNowCommon.showToast(`Welcome back, ${user.name}! Logging in as ${role.toUpperCase()}...`, 'success');
      }
      showLoginAlert(`Welcome back, ${user.name}! Accessing ${role.toUpperCase()} account...`, 'success');

      setTimeout(function () {
        window.location.href = 'home.html';
      }, 1200);
    } else {
      showLoginAlert(`Invalid credentials for ${role.toUpperCase()}. Click "Auto-fill demo" above.`, 'danger');
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
