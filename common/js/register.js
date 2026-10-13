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
      $('#sellerFullName').val('Jordan Ross');
      $('#sellerBizName').val(`Moonstone Handcraft #${id}`);
      $('#sellerEmail').val(`seller${id}@moonstone.com`);
      $('#sellerPhone').val(`+1 (555) 888-${id}`);
      $('#sellerPassword, #sellerConfirmPw').val('Pass1234!');
      $('#sellerBizAddress').val('100 Artisans Way, Suite 200, San Jose, CA');
      $('#sellerTaxId').val(`TAX-US-${id}`);
      $('#sellerCategory').val('artisanal');
      $('#sellerBankName').val('Global Merchant Bank');
      $('#sellerAccountHolder').val('Moonstone Retail Pvt Ltd');
      $('#sellerAccountNumber').val(`4920${id}48102938`);
      $('#sellerRoutingNumber').val('BOFAUS3NXXX');
    } else if (role === 'delivery') {
      $('#agentName').val('David Miller');
      $('#agentPhone').val(`+1 (555) 444-${id}`);
      $('#agentEmail').val(`rider${id}@express-delivery.com`);
      $('#agentVehicle').val('motorcycle');
      $('#agentDL').val(`DL-NY-${id}`);
      $('#agentRegNumber').val(`DL-02-AB-${id}`);
      $('#agentCity').val('New York');
      $('#agentEmergencyName').val('Claire Miller');
      $('#agentEmergencyPhone').val(`+1 (555) 999-${id}`);
      $('#agentPassword, #agentConfirmPw').val('Pass1234!');
    } else {
      $('#buyerName').val('John Doe');
      $('#buyerEmail').val(`johndoe${id}@example.com`);
      $('#buyerPhone').val(`+1 (555) 019-${id}`);
      $('#buyerAddress').val('123 Market Street, Apt 4B');
      $('#buyerPassword, #buyerConfirmPassword').val('Pass1234!');
      $('#buyerPassword').trigger('input');
    }

    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast(`Sample data generated for ${role.toUpperCase()}`, 'info');
    }
  });

  // Form Submission Handler
  $('#figmaRegisterForm').on('submit', function (e) {
    e.preventDefault();

    const role = $('#regRole').val();
    let name = '', email = '', password = '';

    if (role === 'seller') {
      name = $('#sellerBizName').val() || $('#sellerFullName').val();
      email = $('#sellerEmail').val();
      password = $('#sellerPassword').val();
    } else if (role === 'delivery') {
      name = $('#agentName').val();
      email = $('#agentEmail').val();
      password = $('#agentPassword').val();
    } else {
      name = $('#buyerName').val();
      email = $('#buyerEmail').val();
      password = $('#buyerPassword').val();
    }

    if (!email || !password) {
      showRegAlert('Please fill in mandatory email and password fields.', 'danger');
      return;
    }

    const newUser = { id: 'USER-' + Date.now(), name, email, password, role };
    if (typeof ShopNowCommon !== 'undefined') {
      const users = ShopNowCommon.getStorage('shopnow_users') || [];
      users.push(newUser);
      ShopNowCommon.saveStorage('shopnow_users', users);
      ShopNowCommon.showToast(`Account created for ${name}! Redirecting to Sign In...`, 'success');
    }

    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1400);
  });

  function showRegAlert(msg, type) {
    const $alert = $('#regAlert');
    $alert.removeClass('d-none alert-success alert-danger alert-warning').addClass(`alert-${type}`);
    $('#regAlertText').html(msg);
  }
});
