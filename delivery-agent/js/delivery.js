/**
 * ===================================================
 * SHOPNOW - DELIVERY AGENT MAIN CONTROLLER (delivery.js)
 * Manages Dashboard, Assigned Orders, Status Updates,
 * Live Navigation, Customer SMS Hub, Payouts, & Reports.
 * ===================================================
 */

$(document).ready(function () {
  'use strict';

  const STORAGE_DELIVERY_ORDERS = 'shopnow_delivery_orders';
  const STORAGE_DELIVERY_PAYOUTS = 'shopnow_delivery_payouts';

  // Seed default delivery orders in Indian Metro Cities & INR
  const defaultDeliveryOrders = [
    {
      id: 'ORD-98104',
      customer: 'Priya Patel',
      phone: '+91 98201 45892',
      email: 'priya.p@example.in',
      address: 'Plot 42, MIDC Road No. 11, Andheri East, Mumbai 400069',
      pickupLocation: 'ShopNow Fulfillment Hub, Lower Parel, Mumbai',
      dropoffLocation: 'Parkside Heights, Flat 4B, Andheri East',
      status: 'In transit',
      statusClass: 'in-transit',
      eta: '11:15 AM',
      date: 'Oct 24, 2026',
      itemsCount: 2,
      orderContents: 'Gourmet Organic Spice Hamper (2.1 kg), Filter Coffee Pack (1.5 kg)',
      specialInstructions: 'Please leave at front door and ring doorbell. Gate code: 4912.',
      amount: 1499.00,
      earnings: 120.00,
      duration: '24 mins'
    },
    {
      id: 'ORD-98103',
      customer: 'Rahul Sharma',
      phone: '+91 98334 12044',
      email: 'rahul.s@example.in',
      address: '88 King St, Bandra West, Mumbai 400050',
      pickupLocation: 'ShopNow BKC Logistics Hub, Mumbai',
      dropoffLocation: '88 King St, Apt 2, Bandra West',
      status: 'Pending',
      statusClass: 'pending',
      eta: '11:45 AM',
      date: 'Oct 24, 2026',
      itemsCount: 1,
      orderContents: 'Noise Canceling Bluetooth Headphones',
      specialInstructions: 'Direct handoff required. Customer will meet at lobby.',
      amount: 3499.00,
      earnings: 150.00,
      duration: '18 mins'
    },
    {
      id: 'ORD-98102',
      customer: 'Neha Verma',
      phone: '+91 98441 89210',
      email: 'neha.v@example.in',
      address: '45 Koramangala 4th Block, Bengaluru 560034',
      pickupLocation: 'Artisan Decor Studio, Indiranagar, Bengaluru',
      dropoffLocation: '45 Koramangala 4th Block, Floor 2',
      status: 'Out for Delivery',
      statusClass: 'out-for-delivery',
      eta: '12:20 PM',
      date: 'Oct 24, 2026',
      itemsCount: 3,
      orderContents: 'Sculptural Ceramic Table Lamp, Cashmere Throw',
      specialInstructions: 'Fragile package. Handle with care.',
      amount: 2850.00,
      earnings: 180.00,
      duration: '30 mins'
    },
    {
      id: 'ORD-98101',
      customer: 'Aarav Mehta',
      phone: '+91 98773 90118',
      email: 'aarav.m@example.in',
      address: '912 Sunshine Towers, Senapati Bapat Marg, Mumbai 400013',
      pickupLocation: 'Downtown Express Hub, Dadar, Mumbai',
      dropoffLocation: '912 Sunshine Towers, Apt 14A',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '10:40 AM',
      date: 'Oct 24, 2026',
      itemsCount: 4,
      orderContents: 'Assorted Gourmet Snack Box & Organic Darjeeling Tea',
      specialInstructions: 'Leave with concierge if not available.',
      amount: 999.00,
      earnings: 90.00,
      duration: '20 mins'
    },
    {
      id: 'ORD-98100',
      customer: 'Vikram Singh',
      phone: '+91 98320 19445',
      email: 'vikram.s@example.in',
      address: '18 Oak Lane, FC Road, Pune 411004',
      pickupLocation: 'Central Logistics Depot, Shivaji Nagar, Pune',
      dropoffLocation: '18 Oak Lane, Bungalow 3',
      status: 'In transit',
      statusClass: 'in-transit',
      eta: '12:50 PM',
      date: 'Oct 24, 2026',
      itemsCount: 1,
      orderContents: 'Organic Essential Oils Pack',
      specialInstructions: 'Ring doorbell twice upon delivery.',
      amount: 1250.00,
      earnings: 110.00,
      duration: '15 mins'
    }
  ];

  const currentAgent = (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null) || JSON.parse(localStorage.getItem('shopnow_current_user') || 'null');

  function initDeliveryOrders() {
    let existing = JSON.parse(localStorage.getItem(STORAGE_DELIVERY_ORDERS) || 'null');
    // If empty or containing legacy US orders, reseed with Indian orders
    if (!existing || existing.length === 0 || (existing[0] && existing[0].address && existing[0].address.includes('Springfield, OR'))) {
      const agentMail = currentAgent && currentAgent.email ? currentAgent.email : 'delivery@demo.com';
      const seeded = defaultDeliveryOrders.map(o => ({
        ...o,
        agentEmail: agentMail
      }));
      localStorage.setItem(STORAGE_DELIVERY_ORDERS, JSON.stringify(seeded));
    }
  }

  // Ensure orders are seeded
  initDeliveryOrders();

  function getAgentOrders() {
    const user = currentAgent;
    let deliveryOrders = JSON.parse(localStorage.getItem(STORAGE_DELIVERY_ORDERS) || '[]');
    
    // Check if deliveryOrders has old Springfield data
    if (deliveryOrders.length > 0 && deliveryOrders[0].address && deliveryOrders[0].address.includes('Springfield, OR')) {
      initDeliveryOrders();
      deliveryOrders = JSON.parse(localStorage.getItem(STORAGE_DELIVERY_ORDERS) || '[]');
    }

    if (!user || !user.email || user.email.toLowerCase() === 'delivery@demo.com') {
      return deliveryOrders;
    }

    const allOrders = JSON.parse(localStorage.getItem('shopnow_orders') || '[]');
    const combined = [...deliveryOrders, ...allOrders];

    const seen = new Set();
    const result = [];
    combined.forEach(o => {
      if (o && (o.agentEmail && o.agentEmail.toLowerCase() === user.email.toLowerCase())) {
        const key = o.id || o.orderId;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(o);
        }
      }
    });

    // If new registered rider has no specific orders yet, share seed orders so they can test immediately
    if (result.length === 0) {
      deliveryOrders.forEach(o => {
        o.agentEmail = user.email.toLowerCase();
        result.push(o);
      });
      localStorage.setItem(STORAGE_DELIVERY_ORDERS, JSON.stringify(deliveryOrders));
    }

    return result;
  }

  // ===================================================
  // 1. PAGE: DASHBOARD CONTROLLER
  // ===================================================
  if ($('#deliveryDashboardAssignmentsBody').length) {
    const orders = getAgentOrders();
    const inTransit = orders.filter(o => o.status === 'In transit' || o.status === 'Out for Delivery').length;
    
    if ($('#kpiAgentAssignedOrders').length) {
      $('#kpiAgentAssignedOrders').text(orders.length);
    }
    if ($('#kpiAgentInTransit').length) {
      $('#kpiAgentInTransit').text(inTransit > 9 ? inTransit : '0' + inTransit);
    }
    if (currentAgent && currentAgent.name && $('#deliveryAgentGreeting').length) {
      $('#deliveryAgentGreeting').text(`Welcome Back, ${currentAgent.name}`);
    }

    let html = '';
    if (orders.length === 0) {
      html = '<tr><td colspan="6" class="text-center py-4 text-muted">No delivery routes or assignments assigned to you yet.</td></tr>';
    } else {
      orders.forEach(ord => {
        html += `
          <tr>
            <td><strong class="text-dark">${ord.id || ord.orderId}</strong></td>
            <td>
              <strong class="text-dark d-block">${ord.customer || ord.buyerName || 'Customer'}</strong>
            </td>
            <td>
              <span class="text-secondary small d-inline-block text-truncate" style="max-width: 200px;" title="${ord.address}">
                ${ord.address}
              </span>
            </td>
            <td>
              <span class="delivery-status-pill ${ord.statusClass || (ord.status === 'Delivered' ? 'delivered' : 'in-transit')}">${ord.status || 'In transit'}</span>
            </td>
            <td><span class="fw-bold small text-dark">${ord.eta || 'Today'}</span></td>
            <td>
              <a href="update-status.html?id=${ord.id || ord.orderId}" class="btn btn-sm btn-outline-delivery py-1 px-3">
                Update
              </a>
            </td>
          </tr>
        `;
      });
    }

    $('#deliveryDashboardAssignmentsBody').html(html);
  }

  // ===================================================
  // 2. PAGE: ASSIGNED ORDERS CONTROLLER
  // ===================================================
  if ($('#assignedOrdersTableBody').length) {
    let orders = getAgentOrders();

    const activeCount = orders.filter(o => o.status !== 'Delivered').length;
    const readyPickup = orders.filter(o => o.status === 'Pending').length;
    if ($('#badgeTotalActive').length) {
      $('#badgeTotalActive').text(activeCount);
    }
    if ($('#badgeReadyPickup').length) {
      $('#badgeReadyPickup').text(readyPickup > 9 ? readyPickup : '0' + readyPickup);
    }

    function renderAssignedTable(items) {
      let html = '';
      if (!items || items.length === 0) {
        html = '<tr><td colspan="6" class="text-center py-5 text-muted">No orders currently assigned to your route.</td></tr>';
      } else {
        items.forEach(ord => {
          html += `
            <tr>
              <td><strong class="text-dark">${ord.id || ord.orderId}</strong></td>
              <td>
                <strong class="text-dark d-block">${ord.customer || ord.buyerName || 'Customer'}</strong>
                <span class="extra-small text-muted d-inline-block text-truncate" style="max-width: 240px;">
                  ${ord.address}
                </span>
              </td>
              <td>
                <span class="delivery-status-pill ${ord.statusClass || (ord.status === 'Delivered' ? 'delivered' : 'in-transit')}">${ord.status || 'In transit'}</span>
              </td>
              <td><strong>${ord.itemsCount || (ord.items ? ord.items.length : 1)} Items</strong></td>
              <td>
                <span class="small text-dark fw-semibold d-block">${ord.date || 'Today'}</span>
                <span class="extra-small text-muted">by ${ord.eta || '12:00 PM'}</span>
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <a href="order-details.html?id=${ord.id || ord.orderId}" class="btn btn-sm btn-outline-delivery py-1 px-2" title="View details">
                    <i class="bi bi-eye"></i>
                  </a>
                  <a href="update-status.html?id=${ord.id || ord.orderId}" class="btn btn-sm btn-coral-delivery py-1 px-2" title="Update status">
                    <i class="bi bi-arrow-right"></i>
                  </a>
                </div>
              </td>
            </tr>
          `;
        });
      }
      $('#assignedOrdersTableBody').html(html);
    }

    renderAssignedTable(orders);

    // Search and Status Filters
    function filterAssignedOrders() {
      const q = ($('#assignedOrdersSearchInput').val() || '').toLowerCase();
      const status = $('#assignedOrdersStatusFilter').val();

      const filtered = orders.filter(ord => {
        const ordId = (ord.id || ord.orderId || '').toLowerCase();
        const cust = (ord.customer || ord.buyerName || '').toLowerCase();
        const addr = (ord.address || '').toLowerCase();
        const matchesQ = ordId.includes(q) || cust.includes(q) || addr.includes(q);
        const matchesStatus = (status === 'all') || ((ord.status || '').toLowerCase() === status.toLowerCase());
        return matchesQ && matchesStatus;
      });

      renderAssignedTable(filtered);
    }

    $('#assignedOrdersSearchInput').on('input', filterAssignedOrders);
    $('#assignedOrdersStatusFilter').on('change', filterAssignedOrders);
  }

  // ===================================================
  // 3. PAGE: ORDER DETAILS & ACCEPTANCE CONTROLLER
  // ===================================================
  if ($('#btnAcceptDeliveryOrder').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const ordId = urlParams.get('id') || 'ORD-98104';
    const orders = getAgentOrders();
    const currentOrd = orders.find(o => (o.id === ordId || o.orderId === ordId)) || orders[0];

    if (currentOrd) {
      $('#detailOrderCode').text(`#${currentOrd.id || currentOrd.orderId} - Assigned to you`);
      $('#detailCustomerName').text(currentOrd.customer || currentOrd.buyerName || 'Customer');
      $('#detailCustomerAddress').text(currentOrd.address);
      $('#detailEstimatedEarning').text(`₹ ${Number(currentOrd.earnings || 120.00).toFixed(2)}`);
      $('#detailEstimatedDuration').text(currentOrd.duration || '24 mins');
    }

    $('#btnAcceptDeliveryOrder').on('click', function () {
      if (currentOrd) {
        currentOrd.status = 'In transit';
        currentOrd.statusClass = 'in-transit';
        localStorage.setItem(STORAGE_DELIVERY_ORDERS, JSON.stringify(orders));

        if (typeof ShopNowAPI !== 'undefined') {
          ShopNowAPI.updateOrder(currentOrd.id, { status: 'In transit', statusClass: 'in-transit' });
        }
      }

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Delivery Order #${currentOrd ? (currentOrd.id || currentOrd.orderId) : 'ORD-98104'} accepted! Navigation route loaded.`, 'success');
      }

      setTimeout(function () {
        window.location.href = `update-status.html?id=${currentOrd ? (currentOrd.id || currentOrd.orderId) : 'ORD-98104'}`;
      }, 800);
    });

    $('#btnRejectDeliveryOrder').on('click', function () {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Order reassigned to another nearby fleet agent.', 'info');
      }
      setTimeout(function () {
        window.location.href = 'assigned-orders.html';
      }, 800);
    });
  }

  // ===================================================
  // 4. PAGE: UPDATE DELIVERY STATUS CONTROLLER
  // ===================================================
  if ($('#btnConfirmDeliveryStatus').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const ordId = urlParams.get('id') || 'ORD-98104';
    const orders = getAgentOrders();
    const currentOrd = orders.find(o => (o.id === ordId || o.orderId === ordId)) || orders[0];

    if (currentOrd) {
      $('#updateStatusOrderBadge').text(`#${currentOrd.id || currentOrd.orderId}`);
      $('#updateStatusCustomerName').text(currentOrd.customer || currentOrd.buyerName || 'Customer');
      $('#updateStatusAddress').text(currentOrd.address);
    }

    $('#btnConfirmDeliveryStatus').on('click', function () {
      const remarks = $('#deliveryRemarksInput').val() || 'Delivered directly to customer handoff.';
      if (currentOrd) {
        currentOrd.status = 'Delivered';
        currentOrd.statusClass = 'delivered';
        localStorage.setItem(STORAGE_DELIVERY_ORDERS, JSON.stringify(orders));

        if (typeof ShopNowAPI !== 'undefined') {
          ShopNowAPI.updateOrder(currentOrd.id || currentOrd.orderId, {
            status: 'Delivered',
            statusClass: 'delivered',
            deliveryRemarks: remarks
          });
          ShopNowAPI.createNotification({
            title: 'Parcel Delivered',
            message: `Your Order #${currentOrd.id || currentOrd.orderId} has been delivered by driver ${currentAgent ? currentAgent.name : 'Rajesh Verma'} with verified photo proof.`,
            type: 'order_delivered',
            createdAt: new Date().toISOString()
          });
        }
      }

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Order #${currentOrd ? (currentOrd.id || currentOrd.orderId) : 'ORD-98104'} marked as Delivered! Photo proof uploaded.`, 'success');
      }

      setTimeout(function () {
        window.location.href = 'assigned-orders.html';
      }, 1000);
    });

    $('#btnReportDeliveryIssue').on('click', function () {
      new bootstrap.Modal(document.getElementById('deliveryIssueModal')).show();
    });

    $('#btnSubmitDeliveryIssue').on('click', function () {
      const category = $('#issueCategorySelect').val();
      const notes = $('#deliveryIssueModal textarea').val() || 'Delivery exception encountered on route.';
      
      if (typeof ShopNowAPI !== 'undefined') {
        ShopNowAPI.createSupportTicket({
          orderId: currentOrd ? (currentOrd.id || currentOrd.orderId) : 'ORD-98104',
          category: category,
          subject: `Road Exception: ${category}`,
          message: notes,
          status: 'Open',
          priority: 'Urgent',
          createdAt: new Date().toISOString()
        });
      }

      bootstrap.Modal.getInstance(document.getElementById('deliveryIssueModal')).hide();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Issue flagged to Central Dispatcher. Agent assist ticket opened in MockAPI.', 'warning');
      }
    });
  }

  // ===================================================
  // 5. PAGE: CUSTOMER INTERACTION CONTROLLER
  // ===================================================
  if ($('#customerInteractionSendForm').length) {
    // Quick Response Template pills
    $('.template-pill').on('click', function () {
      const text = $(this).data('text');
      $('#interactionMsgInput').val(text);
    });

    $('#customerInteractionSendForm').on('submit', function (e) {
      e.preventDefault();
      const text = $('#interactionMsgInput').val().trim();
      if (!text) return;

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const driverDisplayName = currentAgent && currentAgent.name ? currentAgent.name : 'Rajesh Verma';
      const newLogHtml = `
        <div class="p-3 bg-light rounded-3 border mb-2">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong class="text-dark small"><i class="bi bi-chat-text-fill text-coral me-1"></i> SMS from You (${driverDisplayName})</strong>
            <span class="extra-small text-muted">Just now &bull; ${time}</span>
          </div>
          <p class="small text-secondary mb-0">${text}</p>
        </div>
      `;

      $('#customerInteractionLog').prepend(newLogHtml);
      $('#interactionMsgInput').val('');

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('SMS dispatched to customer mobile device.', 'success');
      }
    });
  }

  // ===================================================
  // 6. PAGE: PAYMENT MANAGEMENT CONTROLLER
  // ===================================================
  if ($('#btnRequestPayout').length || $('#btnWithdrawNow').length) {
    $('#btnRequestPayout, #btnWithdrawNow').on('click', function () {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Payout of ₹ 8,420 initiated! Transferring to HDFC Bank A/C ***4589.', 'success');
      }
      $('#pendingPayoutAmountLabel').text('₹ 0.00');
      $('#pendingPayoutWidgetAmount').text('₹ 0.00');
    });

    $('#btnDownloadStatement').on('click', function () {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Monthly Driver Earning Statement PDF compiled & downloaded.', 'info');
      }
    });
  }

  // ===================================================
  // 7. PAGE: HISTORY CONTROLLER
  // ===================================================
  if ($('#deliveryHistoryTableBody').length) {
    const orders = getAgentOrders();

    function renderHistoryTable(items) {
      let html = '';
      if (!items || items.length === 0) {
        html = '<tr><td colspan="6" class="text-center py-4 text-muted">No historical delivery records found.</td></tr>';
      } else {
        items.forEach(ord => {
          html += `
            <tr>
              <td><strong class="text-coral">${ord.id || ord.orderId}</strong></td>
              <td><strong class="text-dark small d-block">${ord.customer || ord.buyerName || 'Customer'}</strong></td>
              <td>
                <span class="extra-small text-secondary d-inline-block text-truncate" style="max-width: 260px;" title="${ord.address}">
                  ${ord.address}
                </span>
              </td>
              <td>
                <span class="small text-dark fw-semibold d-block">${ord.date || '2026-10-24'}</span>
                <span class="extra-small text-muted">${ord.eta || '12:00 PM'}</span>
              </td>
              <td><span class="delivery-status-pill ${ord.statusClass || (ord.status === 'Delivered' ? 'delivered' : 'in-transit')}">${ord.status || 'Delivered'}</span></td>
              <td class="text-end fw-bold text-dark">₹ ${Number(ord.earnings || 120).toFixed(2)}</td>
            </tr>
          `;
        });
      }
      $('#deliveryHistoryTableBody').html(html);
    }

    renderHistoryTable(orders);

    $('#historySearchInput').on('input', function () {
      const q = $(this).val().toLowerCase();
      const status = $('#historyStatusFilter').val();
      const filtered = orders.filter(o => {
        const id = (o.id || o.orderId || '').toLowerCase();
        const cust = (o.customer || o.buyerName || '').toLowerCase();
        const addr = (o.address || '').toLowerCase();
        const matchesQ = id.includes(q) || cust.includes(q) || addr.includes(q);
        const matchesStatus = (status === 'all') || ((o.status || '').toLowerCase() === status.toLowerCase());
        return matchesQ && matchesStatus;
      });
      renderHistoryTable(filtered);
    });

    $('#historyStatusFilter').on('change', function () {
      $('#historySearchInput').trigger('input');
    });

    if ($('#btnExportHistoryCsv').length) {
      $('#btnExportHistoryCsv').on('click', function () {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Delivery History CSV exported successfully.', 'success');
        }
      });

      $('#historyFilterPeriod button').on('click', function () {
        $('#historyFilterPeriod button').removeClass('btn-dark active').addClass('btn-outline-secondary');
        $(this).removeClass('btn-outline-secondary').addClass('btn-dark active');
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Filtered history records.', 'info');
        }
      });
    }
  }

  // ===================================================
  // 8. PAGE: REPORTS CONTROLLER
  // ===================================================
  if ($('#btnExportReportsPdf').length) {
    $('#btnExportReportsPdf').on('click', function () {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Performance Audit PDF generated and downloaded.', 'info');
      }
    });

    $('#btnApplyEfficiencySettings').on('click', function () {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Route AI Optimization & Stop Prioritization applied!', 'success');
      }
    });
  }

  // ===================================================
  // 9. PAGE: PROFILE CONTROLLER
  // ===================================================
  if ($('#deliveryProfileForm').length) {
    $('#deliveryProfileForm').on('submit', function (e) {
      e.preventDefault();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Delivery agent identity & emergency contact updated!', 'success');
      }
    });
  }
});
