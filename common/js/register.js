/**
 * ===================================================
 * SHOPNOW - REGISTER PAGE JAVASCRIPT
 * Handles role tab switching, password strength meter, sample data fill, and user signup
 * ===================================================
 */

$(document).ready(function () {
  'use strict';

  // Role Tab Switching (Buyer, Seller, Delivery Agent)
  $('#regRoleBar .role-tab-btn').on('click', function () {
    const role = $(this).data('role');

    $('#regRoleBar .role-tab-btn').removeClass('active');
    $(this).addClass('active');

    $('#regRole').val(role);

    // Dynamic field visibility
    if (role === 'seller') {
      $('#sellerFieldsSection').removeClass('d-none');
      $('#buyerFieldsSection, #deliveryFieldsSection').addClass('d-none');
      $('#regSubmitBtn').text('Register Seller Account');
    } else if (role === 'delivery') {
      $('#deliveryFieldsSection').removeClass('d-none');
      $('#buyerFieldsSection, #sellerFieldsSection').addClass('d-none');
      $('#regSubmitBtn').text('Register Driver Partner Account');
    } else {
      $('#buyerFieldsSection').removeClass('d-none');
      $('#sellerFieldsSection, #deliveryFieldsSection').addClass('d-none');
      $('#regSubmitBtn').text('Create Buyer Account');
    }

    $('#regAlert').addClass('d-none');
  });

  // Password Visibility Toggle
  $('.toggle-pw-btn').on('click', function () {
    const targetId = $(this).data('target');
    const $input = $('#' + targetId);
    if ($input.length) {
      const type = $input.attr('type') === 'password' ? 'text' : 'password';
      $input.attr('type', type);
      $(this).find('i').toggleClass('bi-eye bi-eye-slash');
    }
  });

  // Live Password Strength Indicator for Buyer
  $('#buyerPassword').on('input', function () {
    const val = $(this).val();
    let score = 0;
    if (val.length >= 6) score += 33;
    if (/[A-Z]/.test(val)) score += 33;
    if (/[0-9!@#$%^&*]/.test(val)) score += 34;

    const $bar = $('#buyerPwBar');
    $bar.css('width', `${score}%`);
    if (score <= 33) $bar.css('background-color', '#ef4444');
    else if (score <= 66) $bar.css('background-color', '#f59e0b');
    else $bar.css('background-color', '#10b981');
  });

  // Quick Sample Data Fill Button
  $('#btnQuickSampleReg').on('click', function () {
    const role = $('#regRole').val();
    const id = Math.floor(1000 + Math.random() * 9000);

    if (role === 'seller') {
      $('#sellerFullName').val('Aarav Sharma');
      $('#sellerBizName').val(`CraftVeda Creations #${id}`);
      $('#sellerEmail').val(`seller${id}@craftveda.in`);
      $('#sellerPhone').val(`+91 98201 ${id}`);
      $('#sellerPassword, #sellerConfirmPw').val('Pass1234!');
      $('#sellerBizAddress').val('402 Raheja Towers, Bandra Kurla Complex, Mumbai, MH');
      $('#sellerTaxId').val(`27ABCDE${id}1Z5`);
      $('#sellerCategory').val('artisanal');
      $('#sellerBankName').val('HDFC Bank');
      $('#sellerAccountHolder').val('CraftVeda Retail Enterprises');
      $('#sellerAccountNumber').val(`50100${id}92841`);
      $('#sellerRoutingNumber').val('HDFC0000240');
    } else if (role === 'delivery') {
      $('#agentName').val('Rajesh Verma');
      $('#agentPhone').val(`+91 98334 ${id}`);
      $('#agentEmail').val(`rider${id}@shopnow-delivery.in`);
      $('#agentVehicle').val('motorcycle');
      $('#agentDL').val(`MH-02-2023-${id}`);
      $('#agentRegNumber').val(`MH-02-EM-${id}`);
      $('#agentCity').val('Mumbai');
      $('#agentEmergencyName').val('Sunita Verma');
      $('#agentEmergencyPhone').val(`+91 98112 ${id}`);
      $('#agentPassword, #agentConfirmPw').val('Pass1234!');
    } else {
      $('#buyerName').val('Priya Patel');
      $('#buyerEmail').val(`priya${id}@example.in`);
      $('#buyerPhone').val(`+91 98765 ${id}`);
      $('#buyerAddress').val('Flat 502, Orchid Heights, Andheri West, Mumbai, MH');
      $('#buyerPassword, #buyerConfirmPassword').val('Pass1234!');
      $('#buyerPassword').trigger('input');
    }

    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast(`Sample data generated for ${role.toUpperCase()}`, 'info');
    }
  });

    // Form Submission Handler
    $('#figmaRegisterForm').on('submit', async function (e) {
      e.preventDefault();

      const role = $('#regRole').val();
      let name = '', email = '', password = '';
      let storeName = '', category = '', phone = '', vehicle = '', city = '', address = '';

      if (role === 'seller') {
        storeName = $('#sellerBizName').val().trim();
        name = $('#sellerFullName').val().trim() || storeName;
        email = $('#sellerEmail').val().trim();
        password = $('#sellerPassword').val().trim();
        phone = $('#sellerPhone').val().trim();
        category = $('#sellerCategory').val();
      } else if (role === 'delivery') {
        name = $('#agentName').val().trim();
        email = $('#agentEmail').val().trim();
        password = $('#agentPassword').val().trim();
        phone = $('#agentPhone').val().trim();
        vehicle = $('#agentVehicle').val() || 'motorcycle';
        city = $('#agentCity').val().trim() || 'Mumbai';
      } else {
        name = $('#buyerName').val().trim();
        email = $('#buyerEmail').val().trim();
        password = $('#buyerPassword').val().trim();
        phone = $('#buyerPhone').val().trim();
        address = $('#buyerAddress').val().trim();
      }

      if (!email || !password) {
        showRegAlert('Please fill in mandatory email and password fields.', 'danger');
        return;
      }

      const $submitBtn = $('#regSubmitBtn');
      $submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Creating account...');

      const newUser = {
        id: 'USER-' + Date.now(),
        name,
        email: email.toLowerCase(),
        password,
        role,
        storeName: storeName || (name ? `${name}'s Store` : 'My Store'),
        category,
        phone,
        vehicle,
        city,
        address,
        createdAt: new Date().toISOString()
      };

      // Save locally immediately
      const users = (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getStorage('shopnow_users') : null) || [];
      const existingIdx = users.findIndex(u => u.email && u.email.toLowerCase() === newUser.email && (!u.role || u.role === role));
      if (existingIdx !== -1) {
        users[existingIdx] = newUser;
      } else {
        users.push(newUser);
      }
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.saveStorage('shopnow_users', users);
      }

      // Sync to MockAPI asynchronously
      if (typeof ShopNowAPI !== 'undefined') {
        try {
          await ShopNowAPI.createUser(newUser);
        } catch (err) {
          console.warn('[Register] MockAPI sync notice:', err);
        }
      }

      // Automatically establish user session directly upon registration
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.setCurrentUser(newUser);
        ShopNowCommon.showToast(`Welcome to ShopNow, ${name}! Your account is registered and logged in.`, 'success');
      } else {
        localStorage.setItem('shopnow_current_user', JSON.stringify(newUser));
      }

      // Redirect immediately to role-specific dashboard / landing page
      setTimeout(function () {
        if (role === 'seller') {
          window.location.href = '../../seller/html/dashboard.html';
        } else if (role === 'delivery') {
          window.location.href = '../../delivery-agent/html/dashboard.html';
        } else if (role === 'admin') {
          window.location.href = '../../admin/html/dashboard.html';
        } else {
          // Buyer default
          window.location.href = 'home.html';
        }
      }, 800);
    });

  function showRegAlert(msg, type) {
    const $alert = $('#regAlert');
    $alert.removeClass('d-none alert-success alert-danger alert-warning').addClass(`alert-${type}`);
    $('#regAlertText').html(msg);
  }
});
