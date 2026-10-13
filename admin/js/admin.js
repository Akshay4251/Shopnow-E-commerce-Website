/**
 * ===================================================
 * SHOPNOW - ADMIN MAIN CONTROLLER (admin.js)
 * Comprehensive state management, MockAPI syncing,
 * Sellers KYC approval, Buyers management, Orders,
 * Delivery fleet assignments, Returns/Refunds,
 * Categories, Promotions wizard, Support & Notifications.
 * ===================================================
 */

$(document).ready(function () {
  'use strict';

  const STORAGE_SELLERS = 'shopnow_admin_sellers';
  const STORAGE_BUYERS = 'shopnow_admin_buyers';
  const STORAGE_PROMOTIONS = 'shopnow_admin_promotions';

  // Seed default sellers matching Figma
  const defaultSellers = [
    {
      id: 'SEL-001',
      storeName: 'Fashion Hub',
      ownerName: 'Rohit Sharma',
      email: 'rohit@gmail.com',
      phone: '+91 9819283718',
      address: 'Pune, Maharashtra',
      description: 'Fashion and lifestyle products',
      pan: 'ABCDE1234F',
      gst: '27ABCDE1234F1Z5',
      status: 'Pending',
      statusClass: 'review',
      joined: '15 Aug 2026',
      totalSales: 145000,
      payoutDue: 24500,
      docs: {
        aadhaar: 'Verified',
        pan: 'Verified',
        business: 'Pending Review',
        gst: 'Pending Review'
      }
    },
    {
      id: 'SEL-002',
      storeName: 'Style Zone',
      ownerName: 'Priya Patel',
      email: 'priya@gmail.com',
      phone: '+91 9822334455',
      address: 'Mumbai, Maharashtra',
      description: 'Ethnic and bridal collection',
      pan: 'BCDEF2345G',
      gst: '27BCDEF2345G1Z6',
      status: 'Blocked',
      statusClass: 'blocked',
      joined: '12 Jul 2026',
      totalSales: 89000,
      payoutDue: 0,
      docs: { aadhaar: 'Verified', pan: 'Rejected', business: 'Rejected', gst: 'Rejected' }
    },
    {
      id: 'SEL-003',
      storeName: 'Tech World',
      ownerName: 'Amit Verma',
      email: 'amit@gmail.com',
      phone: '+91 9833445566',
      address: 'Bengaluru, Karnataka',
      description: 'Electronics and smart accessories',
      pan: 'CDEFG3456H',
      gst: '29CDEFG3456H1Z7',
      status: 'Active',
      statusClass: 'active',
      joined: '05 Jul 2026',
      totalSales: 520000,
      payoutDue: 45000,
      docs: { aadhaar: 'Verified', pan: 'Verified', business: 'Verified', gst: 'Verified' }
    },
    {
      id: 'SEL-004',
      storeName: 'Home Essentials',
      ownerName: 'Sneha Kulkarni',
      email: 'sneha@gmail.com',
      phone: '+91 9844556677',
      address: 'Hyderabad, Telangana',
      description: 'Kitchen and home decor',
      pan: 'DEFGH4567I',
      gst: '36DEFGH4567I1Z8',
      status: 'Active',
      statusClass: 'active',
      joined: '01 Sep 2026',
      totalSales: 310000,
      payoutDue: 18000,
      docs: { aadhaar: 'Verified', pan: 'Verified', business: 'Verified', gst: 'Verified' }
    },
    {
      id: 'SEL-005',
      storeName: 'Beauty Zone',
      ownerName: 'Karan Mehra',
      email: 'karan@gmail.com',
      phone: '+91 9855667788',
      address: 'Delhi NCR',
      description: 'Organic skincare and wellness',
      pan: 'EFGHI5678J',
      gst: '07EFGHI5678J1Z9',
      status: 'Pending',
      statusClass: 'review',
      joined: '28 Aug 2026',
      totalSales: 62000,
      payoutDue: 12000,
      docs: { aadhaar: 'Verified', pan: 'Verified', business: 'Pending Review', gst: 'Pending Review' }
    }
  ];

  // Seed default buyers
  const defaultBuyers = [
    {
      id: 'BUY-101',
      name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      phone: '+91 9811223344',
      ordersCount: 14,
      totalSpent: 12450,
      wishlistCount: 3,
      status: 'Active',
      statusClass: 'active',
      joined: '10 Jan 2026',
      address: 'Flat 402, Green Meadows, Andheri East, Mumbai'
    },
    {
      id: 'BUY-102',
      name: 'Ananya Sen',
      email: 'ananya@gmail.com',
      phone: '+91 9822334411',
      ordersCount: 8,
      totalSpent: 8900,
      wishlistCount: 5,
      status: 'Active',
      statusClass: 'active',
      joined: '18 Feb 2026',
      address: 'B-12 Lake View, Salt Lake, Kolkata'
    },
    {
      id: 'BUY-103',
      name: 'Vikram Joshi',
      email: 'vikram@gmail.com',
      phone: '+91 9833445522',
      ordersCount: 2,
      totalSpent: 1200,
      wishlistCount: 1,
      status: 'Blocked',
      statusClass: 'blocked',
      joined: '04 Mar 2026',
      address: '74 Civil Lines, Jaipur, Rajasthan'
    }
  ];

  // Seed promotions
  const defaultPromotions = [
    {
      id: 'OFF-01',
      name: 'Diwali Dhamaka',
      code: 'DIWALI50',
      discount: '50% OFF',
      minSpend: '₹ 1,999',
      validTill: 'Nov 15, 2026',
      status: 'Active',
      statusClass: 'active'
    },
    {
      id: 'OFF-02',
      name: 'Festive Specials',
      code: 'FESTIVE25',
      discount: '25% OFF',
      minSpend: '₹ 999',
      validTill: 'Dec 01, 2026',
      status: 'Active',
      statusClass: 'active'
    },
    {
      id: 'OFF-03',
      name: 'Winter Carnival',
      code: 'WINTER10',
      discount: '₹ 200 Flat',
      minSpend: '₹ 1,499',
      validTill: 'Jan 10, 2027',
      status: 'Scheduled',
      statusClass: 'review'
    }
  ];

  function initAdminStorage() {
    let sellers = JSON.parse(localStorage.getItem(STORAGE_SELLERS) || 'null') || [...defaultSellers];
    let buyers = JSON.parse(localStorage.getItem(STORAGE_BUYERS) || 'null') || [...defaultBuyers];

    const users = JSON.parse(localStorage.getItem('shopnow_users') || '[]');
    users.forEach(function (u) {
      if (u.role === 'seller') {
        if (!sellers.some(s => s.email && s.email.toLowerCase() === (u.email || '').toLowerCase())) {
          sellers.unshift({
            id: 'SEL-' + (u.id || Math.floor(100 + Math.random() * 900)),
            storeName: u.storeName || (u.name + ' Store'),
            ownerName: u.name,
            email: u.email,
            phone: u.phone || '+91 98000 00000',
            address: u.city || 'India',
            description: `${u.category || 'General'} Merchant Store`,
            pan: 'ABCDE' + Math.floor(1000 + Math.random() * 9000) + 'F',
            gst: '27ABCDE' + Math.floor(1000 + Math.random() * 9000) + '1Z5',
            status: 'Active',
            statusClass: 'active',
            joined: 'Today',
            totalSales: 0,
            payoutDue: 0,
            docs: { aadhaar: 'Verified', pan: 'Verified', business: 'Verified', gst: 'Verified' }
          });
        }
      } else if (!u.role || u.role === 'buyer') {
        if (!buyers.some(b => b.email && b.email.toLowerCase() === (u.email || '').toLowerCase())) {
          buyers.unshift({
            id: 'BUY-' + (u.id || Math.floor(100 + Math.random() * 900)),
            name: u.name,
            email: u.email,
            phone: u.phone || '+91 98000 00000',
            ordersCount: 0,
            totalSpent: 0,
            wishlistCount: 0,
            status: 'Active',
            statusClass: 'active',
            joined: 'Today',
            address: u.address || (u.city ? u.city : 'India')
          });
        }
      }
    });

    localStorage.setItem(STORAGE_SELLERS, JSON.stringify(sellers));
    localStorage.setItem(STORAGE_BUYERS, JSON.stringify(buyers));

    if (!localStorage.getItem(STORAGE_PROMOTIONS)) {
      localStorage.setItem(STORAGE_PROMOTIONS, JSON.stringify(defaultPromotions));
    }
  }
  initAdminStorage();

  // ===================================================
  // 0. PAGE: DASHBOARD CONTROLLER
  // ===================================================
  if ($('#kpiAdminTotalBuyers').length || $('#adminRecentOrdersTableBody').length) {
    const buyers = JSON.parse(localStorage.getItem(STORAGE_BUYERS) || '[]');
    const sellers = JSON.parse(localStorage.getItem(STORAGE_SELLERS) || '[]');
    const products = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
    const orders = JSON.parse(localStorage.getItem('shopnow_orders') || '[]');

    // Dynamic calculations
    const totalBuyersCount = 1250 + buyers.length;
    const totalSellersCount = 320 + sellers.length;
    const totalProductsCount = products.length ? products.length : 2580;
    const totalOrdersCount = 1860 + orders.length;

    let ordersSum = 0;
    orders.forEach(o => {
      ordersSum += Number(o.price || o.totalAmount || 0);
    });
    const totalGmv = 520000 + ordersSum;
    const netEarnings = Math.round(totalGmv * 0.10); // 10% commission

    $('#kpiAdminTotalBuyers').text(totalBuyersCount.toLocaleString('en-IN'));
    $('#kpiAdminTotalSellers').text(totalSellersCount.toLocaleString('en-IN'));
    $('#kpiAdminTotalProducts').text(totalProductsCount.toLocaleString('en-IN'));
    $('#kpiAdminTotalOrders').text(totalOrdersCount.toLocaleString('en-IN'));
    $('#kpiAdminTotalSales').text(`₹ ${totalGmv.toLocaleString('en-IN')}`);
    $('#kpiAdminNetEarnings').text(`₹ ${netEarnings.toLocaleString('en-IN')}`);

    // Hydrate Recent Orders Table
    if ($('#adminRecentOrdersTableBody').length) {
      let recentList = orders.slice(0, 5);
      if (recentList.length === 0) {
        recentList = [
          { id: 'ORD-101', customer: 'John Doe', product: 'Wireless Headphones', price: 2999, status: 'Delivered', statusClass: 'delivered', date: '12 Oct 2026' },
          { id: 'ORD-102', customer: 'Priya Sharma', product: 'Maxi Dress', price: 1499, status: 'Shipped', statusClass: 'shipped', date: '11 Oct 2026' },
          { id: 'ORD-103', customer: 'Aman Patel', product: 'T-Shirt', price: 799, status: 'Shipped', statusClass: 'shipped', date: '11 Oct 2026' },
          { id: 'ORD-104', customer: 'Renu Soni', product: 'Running Shoes', price: 3299, status: 'Pending', statusClass: 'pending', date: '10 Oct 2026' },
          { id: 'ORD-105', customer: 'Varun Verma', product: 'Backpack', price: 1299, status: 'Cancelled', statusClass: 'cancelled', date: '10 Oct 2026' }
        ];
      }
      let html = '';
      recentList.forEach(ord => {
        html += `
          <tr>
            <td><strong class="text-coral">#${ord.id || ord.orderId}</strong></td>
            <td>${ord.customer || ord.customerName || ord.buyerName || 'Customer'}</td>
            <td>${ord.product || (ord.items && ord.items[0] ? ord.items[0].name : 'Assorted Items')}</td>
            <td><strong>₹ ${Number(ord.price || ord.totalAmount || 1499).toLocaleString('en-IN')}</strong></td>
            <td><span class="badge-status badge-status-${ord.statusClass || (ord.status === 'Delivered' ? 'delivered' : 'pending')}">${ord.status || 'Pending'}</span></td>
            <td>${ord.date || 'Today'}</td>
          </tr>
        `;
      });
      $('#adminRecentOrdersTableBody').html(html);
    }
  }

  // ===================================================
  // 0B. PAGE: PRODUCTS CATALOG MANAGEMENT CONTROLLER
  // ===================================================
  if ($('#adminProductsTableBody').length) {
    let prods = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
    if (!prods.length && typeof ShopNowCommon !== 'undefined' && ShopNowCommon.products) {
      prods = ShopNowCommon.products;
    }

    if ($('#kpiAdminCatalogCount').length) {
      $('#kpiAdminCatalogCount').text(prods.length ? prods.length : 2580);
      $('#kpiAdminActiveProductsCount').text(prods.filter(p => !p.stock || p.stock > 0).length || 2410);
      $('#kpiAdminOutOfStockCount').text(prods.filter(p => p.stock === 0).length || 0);
    }

    function renderAdminProducts(items) {
      let html = '';
      if (!items || items.length === 0) {
        html = '<tr><td colspan="7" class="text-center py-4 text-muted">No products found in marketplace catalog.</td></tr>';
      } else {
        items.slice(0, 50).forEach(p => {
          const imgSrc = p.image || (p.images && p.images[0]) || 'https://via.placeholder.com/80';
          const stock = p.stock !== undefined ? p.stock : 25;
          const stockBadge = stock > 10 ? `<span class="badge bg-success-subtle text-success">${stock} in stock</span>` : (stock > 0 ? `<span class="badge bg-warning-subtle text-warning-emphasis">${stock} left (Low)</span>` : `<span class="badge bg-danger-subtle text-danger">Out of stock</span>`);
          html += `
            <tr>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <img src="${imgSrc}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: contain;" class="rounded border p-1 bg-white" onerror="this.src='https://via.placeholder.com/80'" />
                  <div>
                    <strong class="text-dark d-block">${p.name}</strong>
                    <span class="extra-small text-muted">SKU: ${p.sku || ('PRD-' + (p.id || 101))}</span>
                  </div>
                </div>
              </td>
              <td>${p.category || 'General'}</td>
              <td><strong>₹ ${Number(p.price || 999).toLocaleString('en-IN')}</strong></td>
              <td>${stockBadge}</td>
              <td>${p.seller || p.sellerName || 'Verified Merchant'}</td>
              <td><span class="badge-status badge-status-active">Active</span></td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-admin py-1 px-2 btn-inspect-product" data-id="${p.id}">
                  Inspect
                </button>
              </td>
            </tr>
          `;
        });
      }
      $('#adminProductsTableBody').html(html);
    }

    renderAdminProducts(prods);

    $('#adminProductSearchInput').on('input', function () {
      const q = $(this).val().toLowerCase();
      const filtered = prods.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.seller && p.seller.toLowerCase().includes(q))
      );
      renderAdminProducts(filtered);
    });

    $(document).on('click', '.btn-inspect-product', function () {
      const id = $(this).data('id');
      const prod = prods.find(p => p.id == id);
      if (prod && typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Catalog product "${prod.name}" inspected. All compliance checks passed.`, 'info');
      }
    });
  }

  // ===================================================
  // 0C. PAGE: DELIVERY AGENTS FLEET CONTROLLER
  // ===================================================
  if ($('#adminDeliveryAgentsTableBody').length) {
    const regUsers = JSON.parse(localStorage.getItem('shopnow_users') || '[]');
    const deliveryUsers = regUsers.filter(u => u.role === 'delivery');
    
    let defaultAgents = [
      { id: 'DRV-821', name: 'Rajesh Verma', phone: '+91 98201 45892', vehicle: 'Sprinter Van (MH-02-CP-8921)', status: 'On Route', stops: '14 stops', rating: '4.95' },
      { id: 'DRV-822', name: 'Sunita Patel', phone: '+91 98334 56789', vehicle: 'Hybrid Sedan (MH-12-AB-4819)', status: 'On Route', stops: '9 stops', rating: '4.92' },
      { id: 'DRV-823', name: 'Amit Kumar', phone: '+91 98112 44999', vehicle: 'Motorcycle (MH-01-BK-9981)', status: 'Available At Hub', stops: '0 stops', rating: '4.88' }
    ];

    deliveryUsers.forEach((u, i) => {
      if (!defaultAgents.some(a => a.phone === u.phone)) {
        defaultAgents.push({
          id: 'DRV-' + (824 + i),
          name: u.name || 'Courier Agent',
          phone: u.phone || '+91 98000 00000',
          vehicle: `${u.vehicle || 'Motorcycle'} (${u.city || 'Mumbai'})`,
          status: 'Available At Hub',
          stops: '0 stops',
          rating: '5.00'
        });
      }
    });

    function renderAgents(items) {
      let html = '';
      items.forEach(a => {
        html += `
          <tr>
            <td><strong class="text-coral">${a.id}</strong></td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="admin-avatar"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="${a.name}" /></div>
                <div><strong class="text-dark d-block">${a.name}</strong><span class="extra-small text-muted">★ ${a.rating} Rating</span></div>
              </div>
            </td>
            <td>${a.phone}</td>
            <td>${a.vehicle}</td>
            <td><span class="badge-status ${a.status === 'On Route' ? 'badge-status-active' : 'badge-status-review'}">${a.status}</span></td>
            <td><strong>${a.stops}</strong></td>
            <td class="text-end">
              <button class="btn btn-sm btn-coral-admin py-1 px-3 btn-assign-run" data-id="${a.id}">Assign Run</button>
            </td>
          </tr>
        `;
      });
      $('#adminDeliveryAgentsTableBody').html(html);
    }
    renderAgents(defaultAgents);

    $(document).on('click', '.btn-assign-run', function () {
      new bootstrap.Modal(document.getElementById('assignDeliveryModal')).show();
    });
  }

  // ===================================================
  // 1. PAGE: SELLERS MANAGEMENT CONTROLLER
  // ===================================================
  if ($('#adminSellersTableBody').length) {
    let sellers = JSON.parse(localStorage.getItem(STORAGE_SELLERS) || '[]');

    function renderSellersTable(items) {
      let html = '';
      items.forEach((s, idx) => {
        html += `
          <tr>
            <td>${idx + 1}</td>
            <td><strong class="text-dark">${s.storeName}</strong></td>
            <td>${s.ownerName}</td>
            <td><span class="text-secondary">${s.email}</span></td>
            <td><span class="badge-status badge-status-${s.statusClass}">${s.status}</span></td>
            <td>${s.joined}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-admin py-1 px-2 btn-view-seller" data-id="${s.id}">
                View &amp; Verify
              </button>
            </td>
          </tr>
        `;
      });
      $('#adminSellersTableBody').html(html);
    }
    renderSellersTable(sellers);

    // Search Filter
    $('#adminSellerSearchInput').on('input', function () {
      const q = $(this).val().toLowerCase();
      const filtered = sellers.filter(s =>
        s.storeName.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
      renderSellersTable(filtered);
    });

    // View & Verify Seller Modal
    $(document).on('click', '.btn-view-seller', function () {
      const id = $(this).data('id');
      const seller = sellers.find(s => s.id === id);
      if (seller) {
        $('#sellerModalStoreName').text(seller.storeName);
        $('#sellerModalOwnerName').text(seller.ownerName);
        $('#sellerModalEmail').text(seller.email);
        $('#sellerModalPhone').text(seller.phone);
        $('#sellerModalAddress').text(seller.address);
        $('#sellerModalPan').text(seller.pan);
        $('#sellerModalGst').text(seller.gst);
        $('#sellerModalStatus').text(seller.status).attr('class', `badge-status badge-status-${seller.statusClass}`);
        $('#btnApproveSellerAction').data('id', seller.id);
        $('#btnRejectSellerAction').data('id', seller.id);
        new bootstrap.Modal(document.getElementById('approveSellerModal')).show();
      }
    });

    // Approve Seller Action
    $('#btnApproveSellerAction').on('click', function () {
      const id = $(this).data('id');
      const seller = sellers.find(s => s.id === id);
      if (seller) {
        seller.status = 'Active';
        seller.statusClass = 'active';
        localStorage.setItem(STORAGE_SELLERS, JSON.stringify(sellers));
        renderSellersTable(sellers);
        bootstrap.Modal.getInstance(document.getElementById('approveSellerModal')).hide();
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast(`Seller "${seller.storeName}" approved successfully! Storefront activated.`, 'success');
        }
      }
    });

    // Reject Seller Action
    $('#btnRejectSellerAction').on('click', function () {
      const id = $(this).data('id');
      const seller = sellers.find(s => s.id === id);
      if (seller) {
        seller.status = 'Blocked';
        seller.statusClass = 'blocked';
        localStorage.setItem(STORAGE_SELLERS, JSON.stringify(sellers));
        renderSellersTable(sellers);
        bootstrap.Modal.getInstance(document.getElementById('approveSellerModal')).hide();
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast(`Seller "${seller.storeName}" onboarding rejected. Notification sent.`, 'danger');
        }
      }
    });

    // Manually Add Seller Form Handler
    $('#formManualAddSeller').on('submit', function (e) {
      e.preventDefault();
      const storeName = $('#newSellerStore').val().trim();
      const ownerName = $('#newSellerOwner').val().trim();
      const email = $('#newSellerEmail').val().trim();
      if (!storeName || !ownerName || !email) return;

      const newSeller = {
        id: `SEL-${1000 + sellers.length + 1}`,
        storeName: storeName,
        ownerName: ownerName,
        email: email,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
        address: 'Bandra West, Mumbai, MH - 400050',
        pan: 'AAACS' + Math.floor(1000 + Math.random() * 8999) + 'K',
        gst: '27AAACS' + Math.floor(1000 + Math.random() * 8999) + 'K1Z5',
        status: 'Active',
        statusClass: 'active',
        joined: 'Today'
      };

      sellers.unshift(newSeller);
      localStorage.setItem(STORAGE_SELLERS, JSON.stringify(sellers));
      renderSellersTable(sellers);
      const modalEl = document.getElementById('addSellerModal');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
      }
      $('#newSellerStore').val('');
      $('#newSellerOwner').val('');
      $('#newSellerEmail').val('');
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Seller "${storeName}" registered successfully! Storefront activated.`, 'success');
      }
    });
  }

  // ===================================================
  // 2. PAGE: BUYERS MANAGEMENT CONTROLLER
  // ===================================================
  if ($('#adminBuyersTableBody').length) {
    let buyers = JSON.parse(localStorage.getItem(STORAGE_BUYERS) || '[]');

    function renderBuyersTable(items) {
      let html = '';
      items.forEach(b => {
        html += `
          <tr>
            <td><strong class="text-coral">${b.id}</strong></td>
            <td><strong class="text-dark">${b.name}</strong></td>
            <td>${b.email}</td>
            <td>${b.ordersCount} Orders</td>
            <td><strong>₹ ${Number(b.totalSpent).toLocaleString('en-IN')}</strong></td>
            <td><span class="badge-status badge-status-${b.statusClass}">${b.status}</span></td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-admin py-1 px-2 btn-view-buyer" data-id="${b.id}">
                View Details
              </button>
            </td>
          </tr>
        `;
      });
      $('#adminBuyersTableBody').html(html);
    }
    renderBuyersTable(buyers);

    $(document).on('click', '.btn-view-buyer', function () {
      const id = $(this).data('id');
      const buyer = buyers.find(b => b.id === id);
      if (buyer) {
        $('#buyerDetailName').text(buyer.name);
        $('#buyerDetailEmail').text(buyer.email);
        $('#buyerDetailPhone').text(buyer.phone);
        $('#buyerDetailOrders').text(buyer.ordersCount);
        $('#buyerDetailSpent').text(`₹ ${Number(buyer.totalSpent).toLocaleString('en-IN')}`);
        $('#buyerDetailAddress').text(buyer.address);
        new bootstrap.Modal(document.getElementById('buyerDetailsModal')).show();
      }
    });
  }

  // ===================================================
  // 3. PAGE: ORDER MANAGEMENT & ASSIGN DELIVERY
  // ===================================================
  if ($('#adminOrdersTableBody').length) {
    let orders = JSON.parse(localStorage.getItem('shopnow_orders') || '[]');
    if (!orders.length) {
      orders = [
        { id: 'ORD-101', customer: 'John Doe', product: 'Wireless Headphones', price: 2999, status: 'Delivered', statusClass: 'delivered', date: '12 Oct 2026', agent: 'Alex Rivera' },
        { id: 'ORD-102', customer: 'Priya Sharma', product: 'Maxi Dress', price: 1499, status: 'Shipped', statusClass: 'shipped', date: '11 Oct 2026', agent: 'Sophia Love' },
        { id: 'ORD-103', customer: 'Aman Patel', product: 'T-Shirt', price: 799, status: 'Shipped', statusClass: 'shipped', date: '11 Oct 2026', agent: 'David Miller' },
        { id: 'ORD-104', customer: 'Renu Soni', product: 'Running Shoes', price: 3299, status: 'Pending', statusClass: 'pending', date: '10 Oct 2026', agent: 'Unassigned' },
        { id: 'ORD-105', customer: 'Varun Verma', product: 'Backpack', price: 1299, status: 'Cancelled', statusClass: 'cancelled', date: '10 Oct 2026', agent: 'None' }
      ];
      localStorage.setItem('shopnow_orders', JSON.stringify(orders));
    }

    function renderOrdersTable(items) {
      let html = '';
      items.forEach(ord => {
        html += `
          <tr>
            <td><strong class="text-coral">${ord.id || ord.orderId}</strong></td>
            <td><strong class="text-dark">${ord.customer || ord.customerName || 'Shopper'}</strong></td>
            <td>${ord.product || (ord.items ? ord.items[0]?.name : 'Assorted Items')}</td>
            <td><strong>₹ ${Number(ord.price || ord.totalAmount || 1499).toLocaleString('en-IN')}</strong></td>
            <td><span class="badge-status badge-status-${ord.statusClass || 'pending'}">${ord.status || 'Processing'}</span></td>
            <td><span class="small text-muted">${ord.agent || 'Alex Rivera'}</span></td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-admin py-1 px-2 btn-assign-delivery" data-id="${ord.id || ord.orderId}">
                Assign Driver
              </button>
            </td>
          </tr>
        `;
      });
      $('#adminOrdersTableBody').html(html);
    }
    renderOrdersTable(orders);

    $(document).on('click', '.btn-assign-delivery', function () {
      const id = $(this).data('id');
      $('#assignOrderIdLabel').text(id);
      new bootstrap.Modal(document.getElementById('assignDeliveryModal')).show();
    });

    $('#btnConfirmAssignDriver').on('click', function () {
      const driver = $('#selectDeliveryDriver').val();
      bootstrap.Modal.getInstance(document.getElementById('assignDeliveryModal')).hide();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Order dispatched and assigned to ${driver}! Route notification sent.`, 'success');
      }
    });
  }

  // ===================================================
  // 4. PAGE: PROMOTIONS WIZARD & CALENDAR
  // ===================================================
  if ($('#adminOffersTableBody').length) {
    let promos = JSON.parse(localStorage.getItem(STORAGE_PROMOTIONS) || '[]');

    function renderPromos(items) {
      let html = '';
      items.forEach(p => {
        html += `
          <tr>
            <td><strong class="text-coral">${p.id}</strong></td>
            <td><strong class="text-dark">${p.name}</strong></td>
            <td><span class="badge bg-light text-dark border font-monospace">${p.code}</span></td>
            <td><strong class="text-success">${p.discount}</strong></td>
            <td>${p.minSpend}</td>
            <td>${p.validTill}</td>
            <td><span class="badge-status badge-status-${p.statusClass}">${p.status}</span></td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger py-1 px-2 btn-delete-offer" data-id="${p.id}">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      });
      $('#adminOffersTableBody').html(html);
    }
    renderPromos(promos);

    // Create Offer 4-Step Wizard Navigation
    $('.btn-wizard-next').on('click', function () {
      const nextStep = $(this).data('next');
      $('.wizard-step-pane').addClass('d-none');
      $(`#wizardStep${nextStep}`).removeClass('d-none');
      $('.wizard-step-tab').removeClass('active');
      $(`.wizard-step-tab[data-step="${nextStep}"]`).addClass('active');
    });

    $('.btn-wizard-prev').on('click', function () {
      const prevStep = $(this).data('prev');
      $('.wizard-step-pane').addClass('d-none');
      $(`#wizardStep${prevStep}`).removeClass('d-none');
      $('.wizard-step-tab').removeClass('active');
      $(`.wizard-step-tab[data-step="${prevStep}"]`).addClass('active');
    });

    $('#btnFinishCreateOffer').on('click', function () {
      const name = $('#offerNameInput').val() || 'Festive Promo';
      const code = ($('#offerCodeInput').val() || 'SAVE20').toUpperCase();
      const discount = $('#offerDiscountInput').val() || '20% OFF';

      const newOffer = {
        id: 'OFF-0' + (promos.length + 1),
        name,
        code,
        discount,
        minSpend: '₹ 999',
        validTill: 'Nov 30, 2026',
        status: 'Active',
        statusClass: 'active'
      };

      promos.unshift(newOffer);
      localStorage.setItem(STORAGE_PROMOTIONS, JSON.stringify(promos));
      renderPromos(promos);

      bootstrap.Modal.getInstance(document.getElementById('createOfferModal')).hide();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Promotional offer "${code}" published across buyer storefront!`, 'success');
      }
    });

    $(document).on('click', '.btn-delete-offer', function () {
      const id = $(this).data('id');
      promos = promos.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_PROMOTIONS, JSON.stringify(promos));
      renderPromos(promos);
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Coupon offer deleted.', 'info');
      }
    });
  }

  // ===================================================
  // 5. PAGE: CATEGORY MANAGEMENT CONTROLLER
  // ===================================================
  if ($('#adminCategoriesList').length) {
    let categories = JSON.parse(localStorage.getItem('shopnow_categories') || '[]');
    if (!categories.length) {
      categories = [
        { id: 1, name: 'Handmade & Artisanal', slug: 'artisanal', count: 124, status: 'Active' },
        { id: 2, name: 'Electronics & Audio', slug: 'electronics', count: 340, status: 'Active' },
        { id: 3, name: 'Fashion & Apparel', slug: 'fashion', count: 512, status: 'Active' },
        { id: 4, name: 'Home & Living', slug: 'home', count: 198, status: 'Active' },
        { id: 5, name: 'Beauty & Wellness', slug: 'beauty', count: 85, status: 'Active' }
      ];
      localStorage.setItem('shopnow_categories', JSON.stringify(categories));
    }

    function renderCategoryList(items) {
      let html = '';
      items.forEach(c => {
        html += `
          <div class="col-12 col-md-6 col-xl-4 mb-3">
            <div class="admin-card mb-0 d-flex justify-content-between align-items-center">
              <div>
                <strong class="text-dark d-block">${c.name}</strong>
                <span class="extra-small text-muted">${c.count} Products &bull; /${c.slug}</span>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-light border py-1 px-2 btn-edit-category" data-id="${c.id}" data-name="${c.name}"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger py-1 px-2 btn-delete-category" data-id="${c.id}"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        `;
      });
      $('#adminCategoriesList').html(html);
    }
    renderCategoryList(categories);

    $('#btnAddCategoryForm').on('submit', function (e) {
      e.preventDefault();
      const name = $('#newCategoryName').val().trim();
      if (!name) return;

      const newCat = {
        id: Date.now(),
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        count: 0,
        status: 'Active'
      };
      categories.push(newCat);
      localStorage.setItem('shopnow_categories', JSON.stringify(categories));
      renderCategoryList(categories);
      bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
      $('#newCategoryName').val('');
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Category "${name}" added to marketplace catalog!`, 'success');
      }
    });

    $(document).on('click', '.btn-delete-category', function () {
      const id = $(this).data('id');
      categories = categories.filter(c => c.id != id);
      localStorage.setItem('shopnow_categories', JSON.stringify(categories));
      renderCategoryList(categories);
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Category removed.', 'info');
      }
    });
  }

  // ===================================================
  // 6. PAGE: SUPPORT, NOTIFICATIONS & AUDITS
  // ===================================================
  if ($('#btnBroadcastNotification').length) {
    $('#btnBroadcastNotification').on('click', function () {
      const title = $('#notifTitleInput').val() || 'Platform Announcement';
      const msg = $('#notifMsgInput').val() || 'Special festive discounts are now live!';
      
      if (typeof ShopNowAPI !== 'undefined') {
        ShopNowAPI.createNotification({
          title,
          message: msg,
          type: 'broadcast',
          createdAt: new Date().toISOString()
        });
      }

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Notification push sent to all active buyer and seller mobile feeds!', 'success');
      }
      $('#notifTitleInput').val('');
      $('#notifMsgInput').val('');
    });
  }

  // Export buttons
  $('#btnExportAdminReport').on('click', function () {
    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast('Consolidated Platform Performance Audit PDF downloaded.', 'info');
    }
  });
});
