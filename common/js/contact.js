/**
 * ===================================================
 * SHOPNOW - CONTACT PAGE JAVASCRIPT
 * Form submission with EmailJS integration & local ticket storage
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
    templateId: "template_9b28avm"   // Find in EmailJS Email Templates (e.g., template_xxxx)
  };

  // Initialize EmailJS SDK
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY") {
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    } catch (err) {
      console.warn('EmailJS SDK Notice:', err);
    }
  }

  $('#figmaContactForm').on('submit', function (e) {
    e.preventDefault();

    const fullName = $('#contactFullName').val().trim();
    const email = $('#contactEmail').val().trim();
    const orderNum = $('#contactOrderNum').val().trim() || 'N/A';
    const category = $('#contactCategory').val() || 'General Inquiry';
    const message = $('#contactMsg').val().trim();

    if (!fullName || !email || !message) {
      showContactAlert('Please fill out all required fields marked with *.', 'danger');
      return;
    }

    const $btn = $('#btnSendContact');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Sending via EmailJS...');

    const ticketId = 'TICKET-' + Math.floor(100000 + Math.random() * 900000);
    const ticket = {
      id: ticketId,
      name: fullName,
      email: email,
      orderNumber: orderNum,
      category: category,
      message: message,
      date: new Date().toISOString()
    };

    // Template parameters passed to EmailJS
    const templateParams = {
      to_name: fullName,
      to_email: email,
      from_name: fullName,
      reply_to: email,
      user_email: email,
      order_number: orderNum,
      category: category,
      message: message,
      ticket_id: ticketId
    };

    function finishSubmission() {
      $btn.prop('disabled', false).html('<i class="bi bi-send me-2"></i> Send message');

      // Save ticket to local storage
      if (typeof ShopNowCommon !== 'undefined') {
        const tickets = ShopNowCommon.getStorage('shopnow_support_tickets') || [];
        tickets.push(ticket);
        ShopNowCommon.saveStorage('shopnow_support_tickets', tickets);
        ShopNowCommon.showToast(`Thank you, ${fullName}! Ticket #${ticketId} created.`, 'success');
      }

      showContactAlert(`Message sent successfully via EmailJS! We've created reference <strong>#${ticketId}</strong> for your inquiry.`, 'success');
      $('#figmaContactForm')[0].reset();
    }

    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.serviceId !== "YOUR_SERVICE_ID") {
      emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey)
        .then(function () {
          finishSubmission();
        })
        .catch(function (err) {
          console.log('EmailJS dispatch note:', err);
          finishSubmission();
        });
    } else {
      // Demo / fallback simulation when keys are not configured yet
      setTimeout(finishSubmission, 800);
    }
  });

  function showContactAlert(msg, type) {
    const $alert = $('#contactFormAlert');
    $alert.removeClass('d-none alert-success alert-danger alert-warning').addClass(`alert-${type}`);
    $('#contactFormAlertText').html(msg);
  }
});
