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

    let currentAdminProductPage = 1;
    const adminProductPageSize = 5;
    let filteredAdminProducts = prods;

    function renderAdminProducts(items, page) {
      if (items !== undefined) filteredAdminProducts = items;
      if (page !== undefined) currentAdminProductPage = page;

      const pInfo = ShopNowCommon.paginate(filteredAdminProducts, currentAdminProductPage, adminProductPageSize);
      currentAdminProductPage = pInfo.currentPage;

      let html = '';
      if (!pInfo.pageItems || pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="7" class="text-center py-5 text-muted"><p class="mb-0">No catalog products match your search and filter criteria.</p></td></tr>';
      } else {
        pInfo.pageItems.forEach(p => {
          const imgSrc = p.image || (p.images && p.images[0]) || 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_1_dtjolj.png';
          const pTitle = p.title || p.name || 'Catalog Product';
          const pSku = p.sku || ('PRD-' + (p.id || 101));
          const stock = p.stock !== undefined ? Number(p.stock) : 24;
          const stockBadge = stock > 10
            ? `<span class="badge bg-success-subtle text-success">${stock} in stock</span>`
            : (stock > 0 ? `<span class="badge bg-warning-subtle text-warning-emphasis">${stock} left (Low)</span>` : `<span class="badge bg-danger-subtle text-danger">Out of stock</span>`);
          const sellerName = p.sellerStore || p.sellerName || p.seller || p.brand || 'Tech World';

          html += `
            <tr>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <img src="${imgSrc}" alt="${pTitle}" style="width: 44px; height: 44px; object-fit: contain;" class="rounded border p-1 bg-white" onerror="this.src='https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_1_dtjolj.png'" />
                  <div>
                    <strong class="text-dark d-block text-truncate" style="max-width: 260px;" title="${pTitle}">${pTitle}</strong>
                    <span class="extra-small text-muted font-monospace">SKU: ${pSku}</span>
                  </div>
                </div>
              </td>
              <td>${p.category || 'General'}</td>
              <td><strong>₹ ${Number(p.price || 999).toLocaleString('en-IN')}</strong></td>
              <td>${stockBadge}</td>
              <td>${sellerName}</td>
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

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#adminProductsPaginationWrapper',
        infoSelector: '#adminProductsPaginationInfo',
        listSelector: '#adminProductsPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'products',
        onPageChange: function (newPage) {
          renderAdminProducts(filteredAdminProducts, newPage);
        }
      });
    }

    function applyAdminProductFilters() {
      const q = ($('#adminProductSearchInput').val() || '').toLowerCase().trim();
      const cat = ($('#adminProductCategoryFilter').val() || 'all').toLowerCase();
      const stock = $('#adminProductStockFilter').val() || 'all';

      const filtered = prods.filter(p => {
        const titleStr = (p.title || p.name || '').toLowerCase();
        const skuStr = (p.sku || ('PRD-' + (p.id || ''))).toLowerCase();
        const sellerStr = (p.sellerStore || p.sellerName || p.seller || p.brand || '').toLowerCase();
        const catStr = (p.category || '').toLowerCase();

        const matchesQ = !q || titleStr.includes(q) || skuStr.includes(q) || sellerStr.includes(q) || catStr.includes(q);
        const matchesCat = (cat === 'all') || catStr.includes(cat);

        let matchesStock = true;
        const sVal = p.stock !== undefined ? Number(p.stock) : 24;
        if (stock === 'in') matchesStock = sVal > 5;
        else if (stock === 'low') matchesStock = sVal <= 5;

        return matchesQ && matchesCat && matchesStock;
      });

      renderAdminProducts(filtered, 1);
    }

    renderAdminProducts(prods, 1);

    $('#adminProductSearchInput').on('input', applyAdminProductFilters);
    $('#adminProductCategoryFilter, #adminProductStockFilter').on('change', applyAdminProductFilters);

    $(document).on('click', '.btn-inspect-product', function () {
      const id = $(this).data('id');
      const prod = prods.find(p => String(p.id) === String(id));
      if (prod) {
        const imgSrc = prod.image || (prod.images && prod.images[0]) || 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_1_dtjolj.png';
        const pTitle = prod.title || prod.name || 'Catalog Product';
        const pSku = prod.sku || ('PRD-' + (prod.id || 101));
        const pSeller = prod.sellerStore || prod.sellerName || prod.seller || prod.brand || 'Tech World';
        const pPrice = Number(prod.price || 999);
        const pStock = prod.stock !== undefined ? Number(prod.stock) : 24;
        const commission = Math.round(pPrice * 0.10);

        const modalEl = document.getElementById('productDetailModal');
        if (modalEl) {
          $(modalEl).find('img').attr('src', imgSrc);
          $(modalEl).find('h5.fw-bold.text-dark.mb-1').text(pTitle);
          $(modalEl).find('p.extra-small.text-muted.mb-3').html(`Listed by ${pSeller} &bull; SKU: ${pSku} &bull; Category: ${prod.category || 'General'}`);
          $(modalEl).find('.text-coral.fs-6').text(`₹ ${pPrice.toLocaleString('en-IN')}`);
          $(modalEl).find('.text-dark:contains("Units")').text(`${pStock} Units`);
          $(modalEl).find('.text-dark:contains("10%")').text(`10% (₹ ${commission.toLocaleString('en-IN')} / unit)`);
          new bootstrap.Modal(modalEl).show();
        }
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
      { id: 'DRV-821', name: 'Rajesh Verma', phone: '+91 98201 45892', vehicle: 'Sprinter Van (MH-02-CP-8921)', status: 'On Route', statusKey: 'on-duty', stops: '14 stops', rating: '4.95' },
      { id: 'DRV-822', name: 'Sunita Patel', phone: '+91 98334 56789', vehicle: 'Hybrid Sedan (MH-12-AB-4819)', status: 'On Route', statusKey: 'on-duty', stops: '9 stops', rating: '4.92' },
      { id: 'DRV-823', name: 'Amit Kumar', phone: '+91 98112 44999', vehicle: 'Motorcycle (MH-01-BK-9981)', status: 'Available At Hub', statusKey: 'available', stops: '0 stops', rating: '4.88' },
      { id: 'DRV-824', name: 'Vikram Joshi', phone: '+91 98231 77654', vehicle: 'Electric Scooter (MH-04-ET-1102)', status: 'Available At Hub', statusKey: 'available', stops: '0 stops', rating: '4.90' },
      { id: 'DRV-825', name: 'Pooja Nair', phone: '+91 98450 33211', vehicle: 'Delivery Van (MH-03-CV-5541)', status: 'Inactive / Off-Duty', statusKey: 'inactive', stops: '0 stops', rating: '4.78' }
    ];

    deliveryUsers.forEach((u, i) => {
      if (!defaultAgents.some(a => a.phone === u.phone)) {
        defaultAgents.push({
          id: 'DRV-' + (826 + i),
          name: u.name || 'Courier Agent',
          phone: u.phone || '+91 98000 00000',
          vehicle: `${u.vehicle || 'Motorcycle'} (${u.city || 'Mumbai'})`,
          status: 'Available At Hub',
          statusKey: 'available',
          stops: '0 stops',
          rating: '5.00'
        });
      }
    });

    let currentAgentPage = 1;
    const agentPageSize = 5;
    let currentAgentFilter = 'all';
    let filteredAgents = defaultAgents;

    function renderAgents(items, page) {
      if (items !== undefined) filteredAgents = items;
      if (page !== undefined) currentAgentPage = page;

      const pInfo = ShopNowCommon.paginate(filteredAgents, currentAgentPage, agentPageSize);
      currentAgentPage = pInfo.currentPage;

      let html = '';
      if (!pInfo.pageItems || pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="7" class="text-center py-5 text-muted">No delivery drivers match your search and fleet filter.</td></tr>';
      } else {
        pInfo.pageItems.forEach(a => {
          const isOnRoute = (a.status || '').toLowerCase().includes('route');
          const isAvailable = (a.status || '').toLowerCase().includes('available');
          const badgeClass = isOnRoute ? 'badge-status-active' : (isAvailable ? 'badge-status-review' : 'badge-status-inactive');

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
              <td><span class="badge-status ${badgeClass}">${a.status}</span></td>
              <td><strong>${a.stops}</strong></td>
              <td class="text-end">
                <button class="btn btn-sm btn-coral-admin py-1 px-3 btn-assign-run" data-id="${a.id}">Assign Run</button>
              </td>
            </tr>
          `;
        });
      }
      $('#adminDeliveryAgentsTableBody').html(html);

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#adminAgentsPaginationWrapper',
        infoSelector: '#adminAgentsPaginationInfo',
        listSelector: '#adminAgentsPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'drivers',
        onPageChange: function (newPage) {
          renderAgents(filteredAgents, newPage);
        }
      });
    }

    function applyAdminAgentFilters() {
      const q = ($('#adminAgentSearchInput').val() || '').toLowerCase().trim();

      const filtered = defaultAgents.filter(a => {
        const nameStr = (a.name || '').toLowerCase();
        const idStr = (a.id || '').toLowerCase();
        const phoneStr = (a.phone || '').toLowerCase();
        const vehicleStr = (a.vehicle || '').toLowerCase();
        const statusStr = (a.status || '').toLowerCase();

        const matchesQ = !q || nameStr.includes(q) || idStr.includes(q) || phoneStr.includes(q) || vehicleStr.includes(q) || statusStr.includes(q);

        let matchesTab = true;
        if (currentAgentFilter === 'available') {
          matchesTab = statusStr.includes('available');
        } else if (currentAgentFilter === 'on-duty') {
          matchesTab = statusStr.includes('route') || statusStr.includes('duty');
        } else if (currentAgentFilter === 'inactive') {
          matchesTab = statusStr.includes('inactive') || statusStr.includes('off');
        }

        return matchesQ && matchesTab;
      });

      renderAgents(filtered, 1);
    }

    renderAgents(defaultAgents, 1);

    $('#adminAgentSearchInput').on('input', applyAdminAgentFilters);

    $('#adminAgentFilterGroup button').on('click', function () {
      $('#adminAgentFilterGroup button').removeClass('btn-dark active').addClass('btn-outline-secondary');
      $(this).removeClass('btn-outline-secondary').addClass('btn-dark active');
      currentAgentFilter = $(this).data('status') || 'all';
      applyAdminAgentFilters();
    });

    $(document).on('click', '.btn-assign-run', function () {
      const driverId = $(this).data('id');
      const driver = defaultAgents.find(d => d.id === driverId);
      if (driver) {
        $('#selectDeliveryDriver').val(`${driver.name} (${driver.vehicle.split('(')[0].trim()})`);
      }
      new bootstrap.Modal(document.getElementById('assignDeliveryModal')).show();
    });
  }

  // ===================================================
  // 1. PAGE: SELLERS MANAGEMENT CONTROLLER
  // ===================================================
  if ($('#adminSellersTableBody').length) {
    let sellers = JSON.parse(localStorage.getItem(STORAGE_SELLERS) || '[]');
    let currentSellerPage = 1;
    const sellerPageSize = 5;
    let filteredSellers = sellers;

    let currentSellerFilter = 'all';

    function renderSellersTable(items, page) {
      if (items !== undefined) filteredSellers = items;
      if (page !== undefined) currentSellerPage = page;

      const pInfo = ShopNowCommon.paginate(filteredSellers, currentSellerPage, sellerPageSize);
      currentSellerPage = pInfo.currentPage;

      let html = '';
      if (pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="7" class="text-center py-5 text-muted">No sellers found matching search or filter criteria.</td></tr>';
      } else {
        pInfo.pageItems.forEach((s, idx) => {
          html += `
            <tr>
              <td>${pInfo.startIndex + idx + 1}</td>
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
      }
      $('#adminSellersTableBody').html(html);

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#adminSellersPaginationWrapper',
        infoSelector: '#adminSellersPaginationInfo',
        listSelector: '#adminSellersPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'sellers',
        onPageChange: function (newPage) {
          renderSellersTable(filteredSellers, newPage);
        }
      });
    }

    function applySellerFilters() {
      const q = ($('#adminSellerSearchInput').val() || '').toLowerCase().trim();
      let list = sellers;

      if (currentSellerFilter !== 'all') {
        list = list.filter(s => (s.status || '').toLowerCase() === currentSellerFilter.toLowerCase());
      }

      if (q) {
        list = list.filter(s => {
          const store = (s.storeName || '').toLowerCase();
          const owner = (s.ownerName || '').toLowerCase();
          const sId = (s.id || '').toLowerCase();
          const email = (s.email || '').toLowerCase();
          const phone = (s.phone || '').toLowerCase();
          const addr = (s.address || '').toLowerCase();
          const pan = (s.pan || '').toLowerCase();
          const gst = (s.gst || '').toLowerCase();
          const stat = (s.status || '').toLowerCase();

          return store.includes(q) || owner.includes(q) || sId.includes(q) || email.includes(q) || phone.includes(q) || addr.includes(q) || pan.includes(q) || gst.includes(q) || stat.includes(q);
        });
      }

      renderSellersTable(list, 1);
    }

    renderSellersTable(sellers, 1);

    // Search and Status Tabs Filters
    $('#adminSellerSearchInput').on('input', applySellerFilters);

    $('#adminSellerFilterGroup button').on('click', function () {
      $('#adminSellerFilterGroup button').removeClass('btn-dark active').addClass('btn-outline-secondary');
      $(this).removeClass('btn-outline-secondary').addClass('btn-dark active');
      currentSellerFilter = $(this).data('status') || 'all';
      applySellerFilters();
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
        renderSellersTable(filteredSellers, currentSellerPage);
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
        renderSellersTable(filteredSellers, currentSellerPage);
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
      renderSellersTable(sellers, 1);
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
    let currentBuyerPage = 1;
    const buyerPageSize = 5;
    let currentBuyerFilter = 'all';
    let filteredBuyers = buyers;

    function renderBuyersTable(items, page) {
      if (items !== undefined) filteredBuyers = items;
      if (page !== undefined) currentBuyerPage = page;

      const pInfo = ShopNowCommon.paginate(filteredBuyers, currentBuyerPage, buyerPageSize);
      currentBuyerPage = pInfo.currentPage;

      let html = '';
      if (pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="7" class="text-center py-4 text-muted">No shoppers found matching criteria.</td></tr>';
      } else {
        pInfo.pageItems.forEach(b => {
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
      }
      $('#adminBuyersTableBody').html(html);

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#adminBuyersPaginationWrapper',
        infoSelector: '#adminBuyersPaginationInfo',
        listSelector: '#adminBuyersPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'shoppers',
        onPageChange: function (newPage) {
          renderBuyersTable(filteredBuyers, newPage);
        }
      });
    }

    function applyBuyerFilters() {
      const q = ($('#adminBuyerSearchInput').val() || '').toLowerCase().trim();
      let list = buyers;

      if (currentBuyerFilter !== 'all') {
        list = list.filter(b => (b.status || '').toLowerCase() === currentBuyerFilter.toLowerCase());
      }
      if (q) {
        list = list.filter(b => {
          const bId = (b.id || '').toLowerCase();
          const name = (b.name || '').toLowerCase();
          const email = (b.email || '').toLowerCase();
          const phone = (b.phone || '').toLowerCase();
          const addr = (b.address || '').toLowerCase();
          const stat = (b.status || '').toLowerCase();
          return bId.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q) || addr.includes(q) || stat.includes(q);
        });
      }
      renderBuyersTable(list, 1);
    }

    renderBuyersTable(buyers, 1);

    // Search and Status Tabs Filters
    $('#adminBuyerSearchInput').on('input', applyBuyerFilters);

    $('#adminBuyerFilterGroup button, .admin-card .btn-group button').on('click', function () {
      $('#adminBuyerFilterGroup button, .admin-card .btn-group button').removeClass('btn-dark active').addClass('btn-outline-secondary');
      $(this).removeClass('btn-outline-secondary').addClass('btn-dark active');
      currentBuyerFilter = $(this).data('status') || ($(this).text().trim().toLowerCase().includes('all') ? 'all' : ($(this).text().trim().toLowerCase().includes('block') ? 'blocked' : 'active'));
      applyBuyerFilters();
    });

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

    let currentAdminOrderPage = 1;
    const adminOrderPageSize = 5;
    let filteredAdminOrders = orders;

    function renderAdminOrdersTable(items, page) {
      if (items !== undefined) filteredAdminOrders = items;
      if (page !== undefined) currentAdminOrderPage = page;

      const pInfo = ShopNowCommon.paginate(filteredAdminOrders, currentAdminOrderPage, adminOrderPageSize);
      currentAdminOrderPage = pInfo.currentPage;

      let html = '';
      if (pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="7" class="text-center py-4 text-muted">No orders found matching criteria.</td></tr>';
      } else {
        pInfo.pageItems.forEach(ord => {
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
      }
      $('#adminOrdersTableBody').html(html);

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#adminOrdersPaginationWrapper',
        infoSelector: '#adminOrdersPaginationInfo',
        listSelector: '#adminOrdersPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'orders',
        onPageChange: function (newPage) {
          renderAdminOrdersTable(filteredAdminOrders, newPage);
        }
      });
    }

    let currentAdminOrderFilter = 'all';

    function applyAdminOrderFilters() {
      const q = ($('#adminOrderSearchInput').val() || '').toLowerCase().trim();
      let list = orders;

      if (currentAdminOrderFilter !== 'all') {
        list = list.filter(o => (o.status || '').toLowerCase() === currentAdminOrderFilter.toLowerCase());
      }

      if (q) {
        list = list.filter(o => {
          const ordId = (o.id || o.orderId || '').toLowerCase();
          const cust = (o.customer || o.customerName || '').toLowerCase();
          const prod = (o.product || (o.items && o.items[0]?.name) || '').toLowerCase();
          const agent = (o.agent || '').toLowerCase();
          const stat = (o.status || '').toLowerCase();
          const price = String(o.price || o.totalAmount || '');
          return ordId.includes(q) || cust.includes(q) || prod.includes(q) || agent.includes(q) || stat.includes(q) || price.includes(q);
        });
      }

      renderAdminOrdersTable(list, 1);
    }

    renderAdminOrdersTable(orders, 1);

    $('#adminOrderSearchInput').on('input', applyAdminOrderFilters);

    $('#adminOrderFilterGroup button').on('click', function () {
      $('#adminOrderFilterGroup button').removeClass('btn-dark active').addClass('btn-outline-secondary');
      $(this).removeClass('btn-outline-secondary').addClass('btn-dark active');
      currentAdminOrderFilter = $(this).data('status') || 'all';
      applyAdminOrderFilters();
    });

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

  // ===================================================
  // 9. PAGE: EXECUTIVE REPORTS & AUDIT LOGS
  // ===================================================
  if ($('#reportTransactionsTableBody').length || $('#btnExportAdminCSV').length) {
    // Current date reference (defaults to system time e.g. Oct 2026)
    const now = new Date();
    
    // Seed Comprehensive Orders Data if not fully populated
    let storedOrders = JSON.parse(localStorage.getItem('shopnow_orders') || '[]');
    
    // Base sample historical orders spanning Today, Last Week, Last Month, and Earlier
    const sampleAuditOrders = [
      { id: 'ORD-8091', date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15).toISOString(), customer: 'Rahul Deshmukh', product: 'Textured Cashmere Blend Sweater', amount: 1899, payment: 'UPI / PhonePe', status: 'Delivered', statusClass: 'delivered' },
      { id: 'ORD-8090', date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 45).toISOString(), customer: 'Priya Sharma', product: 'Over-Ear Noise Canceling Headphones', amount: 2999, payment: 'Credit Card', status: 'Shipped', statusClass: 'shipped' },
      { id: 'ORD-8089', date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 20).toISOString(), customer: 'Ananya Verma', product: 'Hydration Serum & Body Oil', amount: 890, payment: 'UPI / GPay', status: 'Processing', statusClass: 'pending' },
      { id: 'ORD-8085', date: new Date(now.getTime() - 2 * 86400000).toISOString(), customer: 'Aman Patel', product: 'Expandable Carry-On Suitcase', amount: 2499, payment: 'Net Banking', status: 'Delivered', statusClass: 'delivered' },
      { id: 'ORD-8082', date: new Date(now.getTime() - 4 * 86400000).toISOString(), customer: 'Sneha Kulkarni', product: 'Sculptural Ceramic Table Lamp', amount: 1450, payment: 'Debit Card', status: 'Delivered', statusClass: 'delivered' },
      { id: 'ORD-8078', date: new Date(now.getTime() - 6 * 86400000).toISOString(), customer: 'Rohan Mehta', product: 'Aeroflex Pro Runner Sneakers', amount: 1400, payment: 'Cash on Delivery', status: 'Shipped', statusClass: 'shipped' },
      { id: 'ORD-8071', date: new Date(now.getTime() - 10 * 86400000).toISOString(), customer: 'Vikram Joshi', product: 'Mini 360 Portable Tech Speaker', amount: 950, payment: 'UPI / Paytm', status: 'Delivered', statusClass: 'delivered' },
      { id: 'ORD-8064', date: new Date(now.getTime() - 15 * 86400000).toISOString(), customer: 'Neha Gupta', product: 'Structured Leather Shoulder Bag', amount: 1750, payment: 'Credit Card', status: 'Delivered', statusClass: 'delivered' },
      { id: 'ORD-8055', date: new Date(now.getTime() - 22 * 86400000).toISOString(), customer: 'Kavita Reddy', product: 'Over-Ear Noise Canceling Headphones', amount: 2999, payment: 'UPI / PhonePe', status: 'Delivered', statusClass: 'delivered' },
      { id: 'ORD-8042', date: new Date(now.getTime() - 28 * 86400000).toISOString(), customer: 'Arjun Nair', product: 'Textured Cashmere Blend Sweater', amount: 1899, payment: 'Debit Card', status: 'Delivered', statusClass: 'delivered' },
      { id: 'ORD-8025', date: new Date(now.getTime() - 35 * 86400000).toISOString(), customer: 'Renu Soni', product: 'Aeroflex Pro Runner Sneakers', amount: 1400, payment: 'Credit Card', status: 'Delivered', statusClass: 'delivered' },
      { id: 'ORD-8012', date: new Date(now.getTime() - 42 * 86400000).toISOString(), customer: 'Manish Tiwari', product: 'Mini 360 Portable Tech Speaker', amount: 950, payment: 'Cash on Delivery', status: 'Cancelled', statusClass: 'cancelled' }
    ];

    // Merge existing user orders from checkout with sample audit orders
    let allReportOrders = [...sampleAuditOrders];
    if (Array.isArray(storedOrders) && storedOrders.length > 0) {
      storedOrders.forEach((so, idx) => {
        let orderDate = so.createdAt || so.date;
        let isoDate;
        try {
          isoDate = orderDate ? new Date(orderDate).toISOString() : new Date().toISOString();
        } catch(e) {
          isoDate = new Date().toISOString();
        }
        const ordId = so.id || so.orderId || `ORD-LIVE-${idx + 1}`;
        if (!allReportOrders.some(ro => ro.id === ordId)) {
          allReportOrders.unshift({
            id: ordId,
            date: isoDate,
            customer: so.customer || so.customerName || so.userName || 'Shopper',
            product: so.product || (so.items && so.items[0]?.name) || 'Assorted Items',
            amount: Number(so.price || so.totalAmount || 1899),
            payment: so.paymentMethod || 'Online Payment',
            status: so.status || 'Delivered',
            statusClass: (so.status || 'delivered').toLowerCase()
          });
        }
      });
    }

    // Sort descending by date
    allReportOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    let activeFilterPreset = 'all';
    let filteredReportOrders = [...allReportOrders];
    let currentReportPage = 1;
    const reportPageSize = 5;

    // Helper: Format Date for UI
    function formatDisplayDateTime(isoStr) {
      try {
        const d = new Date(isoStr);
        return d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) + ', ' + d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return isoStr || 'N/A';
      }
    }

    // Pre-fill date inputs with current month range as sensible default
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    $('#reportEndDate').val(todayStr);

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    const startYyyy = thirtyDaysAgo.getFullYear();
    const startMm = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
    const startDd = String(thirtyDaysAgo.getDate()).padStart(2, '0');
    $('#reportStartDate').val(`${startYyyy}-${startMm}-${startDd}`);

    // Core Filter Execution Engine
    function applyReportDateFilter(preset, customStart, customEnd) {
      activeFilterPreset = preset;
      const refNow = new Date();
      let label = 'All Time Records';

      if (preset === 'today') {
        const startOfToday = new Date(refNow.getFullYear(), refNow.getMonth(), refNow.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(refNow.getFullYear(), refNow.getMonth(), refNow.getDate(), 23, 59, 59, 999);
        filteredReportOrders = allReportOrders.filter(o => {
          const d = new Date(o.date);
          return d >= startOfToday && d <= endOfToday;
        });
        label = `Today (${startOfToday.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })})`;
      } else if (preset === 'last-week') {
        const sevenDaysAgo = new Date(refNow.getTime() - 7 * 86400000);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        filteredReportOrders = allReportOrders.filter(o => {
          const d = new Date(o.date);
          return d >= sevenDaysAgo;
        });
        label = `Last 7 Days (Since ${sevenDaysAgo.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })})`;
      } else if (preset === 'last-month') {
        const thirtyDaysAgo = new Date(refNow.getTime() - 30 * 86400000);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        filteredReportOrders = allReportOrders.filter(o => {
          const d = new Date(o.date);
          return d >= thirtyDaysAgo;
        });
        label = `Last 30 Days (Since ${thirtyDaysAgo.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })})`;
      } else if (preset === 'custom') {
        let sDate = customStart ? new Date(customStart + 'T00:00:00') : new Date(0);
        let eDate = customEnd ? new Date(customEnd + 'T23:59:59') : new Date();
        if (sDate > eDate) {
          const tmp = sDate;
          sDate = eDate;
          eDate = tmp;
        }
        filteredReportOrders = allReportOrders.filter(o => {
          const d = new Date(o.date);
          return d >= sDate && d <= eDate;
        });
        label = `Custom Range: ${sDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} to ${eDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
      } else {
        // All Time
        filteredReportOrders = [...allReportOrders];
        label = 'All Time Records';
      }

      // Update UI Banner Labels
      $('#reportActivePeriodLabel').text(label);
      $('#reportFilteredRecordsCount').text(`${filteredReportOrders.length} transaction${filteredReportOrders.length === 1 ? '' : 's'}`);
      $('#reportGeneratedTimestamp').html(`<i class="bi bi-clock me-1"></i>Updated ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);

      // Update KPI Metrics Cards
      let totalGmv = 0;
      filteredReportOrders.forEach(o => {
        totalGmv += Number(o.amount || 0);
      });
      const totalCommission = Math.round(totalGmv * 0.10);
      const ordersCount = filteredReportOrders.length;
      const aov = ordersCount > 0 ? Math.round(totalGmv / ordersCount) : 0;

      $('#reportGrossVolume').text(`₹ ${totalGmv.toLocaleString('en-IN')}`);
      $('#reportTotalCommission').text(`₹ ${totalCommission.toLocaleString('en-IN')}`);
      $('#reportOrdersCount').text(ordersCount.toLocaleString('en-IN'));
      $('#reportAvgOrderValue').text(`₹ ${aov.toLocaleString('en-IN')}`);

      // Subtext adjustments
      if (preset === 'today') {
        $('#reportGmvSubtext').text('Today\'s captured GMV');
        $('#reportOrdersSubtext').text('Today\'s checkouts');
      } else if (preset === 'last-week') {
        $('#reportGmvSubtext').text('+14% vs previous week');
        $('#reportOrdersSubtext').text('7-day verified orders');
      } else if (preset === 'last-month') {
        $('#reportGmvSubtext').text('+22% vs previous month');
        $('#reportOrdersSubtext').text('30-day verified orders');
      } else {
        $('#reportGmvSubtext').text('+22% YoY platform growth');
        $('#reportOrdersSubtext').text('All verified checkouts');
      }

      // Re-render Transactions Table
      renderReportTable(filteredReportOrders, 1);
    }

    // Render Table Page
    function renderReportTable(items, page = 1) {
      if (items !== undefined) filteredReportOrders = items;
      currentReportPage = page;

      const pInfo = ShopNowCommon.paginate(filteredReportOrders, currentReportPage, reportPageSize);
      currentReportPage = pInfo.currentPage;

      let html = '';
      if (pInfo.pageItems.length === 0) {
        html = `
          <tr>
            <td colspan="8" class="text-center py-5">
              <div class="p-3 bg-light rounded-circle d-inline-block mb-2">
                <i class="bi bi-calendar-x text-muted" style="font-size: 2rem;"></i>
              </div>
              <h6 class="text-dark fw-bold mb-1">No transactions found for this date range</h6>
              <p class="text-muted extra-small mb-0">Try selecting "Last Month" or "All Time" to view consolidated historical audit records.</p>
            </td>
          </tr>
        `;
      } else {
        pInfo.pageItems.forEach(ord => {
          const comm = Math.round(Number(ord.amount || 0) * 0.10);
          const badgeClass = ord.statusClass || (ord.status === 'Delivered' ? 'delivered' : ord.status === 'Shipped' ? 'shipped' : ord.status === 'Cancelled' ? 'cancelled' : 'pending');

          html += `
            <tr>
              <td><strong class="text-coral font-monospace">${ord.id}</strong></td>
              <td class="small text-muted">${formatDisplayDateTime(ord.date)}</td>
              <td><strong class="text-dark">${ord.customer}</strong></td>
              <td class="small text-truncate" style="max-width: 220px;" title="${ord.product}">${ord.product}</td>
              <td><strong>₹ ${Number(ord.amount).toLocaleString('en-IN')}</strong></td>
              <td class="text-info fw-semibold">₹ ${comm.toLocaleString('en-IN')}</td>
              <td><span class="badge bg-light text-dark border extra-small">${ord.payment || 'Online'}</span></td>
              <td><span class="badge-status badge-status-${badgeClass}">${ord.status || 'Completed'}</span></td>
            </tr>
          `;
        });
      }

      $('#reportTransactionsTableBody').html(html);

      // Render Table Pagination
      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#reportPaginationWrapper',
        infoSelector: '#reportPaginationInfo',
        listSelector: '#reportPaginationList',
        currentPage: currentReportPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        pageSize: reportPageSize,
        itemLabel: 'records',
        onPageChange: function (newPage) {
          renderReportTable(filteredReportOrders, newPage);
        }
      });
    }

    // 1. Preset Buttons Click
    $('.report-preset-btn').on('click', function () {
      $('.report-preset-btn').removeClass('btn-coral-admin active').addClass('btn-outline-dark');
      $(this).removeClass('btn-outline-dark').addClass('btn-coral-admin active');
      const preset = $(this).data('preset');
      applyReportDateFilter(preset);
    });

    // 2. Custom Date Filter Apply
    $('#btnApplyDateFilter').on('click', function () {
      const s = $('#reportStartDate').val();
      const e = $('#reportEndDate').val();
      if (!s || !e) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Please select both Start Date and End Date', 'error');
        }
        return;
      }
      $('.report-preset-btn').removeClass('btn-coral-admin active').addClass('btn-outline-dark');
      applyReportDateFilter('custom', s, e);
    });

    // 3. Reset Filter
    $('#btnResetDateFilter').on('click', function () {
      $('.report-preset-btn').removeClass('btn-coral-admin active').addClass('btn-outline-dark');
      $('.report-preset-btn[data-preset="all"]').removeClass('btn-outline-dark').addClass('btn-coral-admin active');
      $('#reportEndDate').val(todayStr);
      $('#reportStartDate').val(`${startYyyy}-${startMm}-${startDd}`);
      applyReportDateFilter('all');
    });

    // ===================================================
    // CSV EXPORT GENERATOR
    // ===================================================
    function generateReportCSV() {
      if (!filteredReportOrders || filteredReportOrders.length === 0) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('No records available to export for the selected filter range.', 'error');
        }
        return;
      }

      const activeLabel = $('#reportActivePeriodLabel').text().replace(/,/g, ' ');
      const genTimestamp = new Date().toLocaleString('en-IN');

      let csv = '\uFEFF'; // UTF-8 BOM for Microsoft Excel compatibility
      csv += `ShopNow Executive Performance & Transaction Audit Report\r\n`;
      csv += `Filter Period:,"${activeLabel}"\r\n`;
      csv += `Generated On:,"${genTimestamp}"\r\n`;
      csv += `Total Transactions:,${filteredReportOrders.length}\r\n\r\n`;

      // Headers
      csv += `Order ID,Date & Time,Customer,Product / Items,Gross Amount (INR),Platform Commission 10% (INR),Payment Method,Status\r\n`;

      let sumGross = 0;
      let sumComm = 0;

      filteredReportOrders.forEach(o => {
        const gross = Number(o.amount || 0);
        const comm = Math.round(gross * 0.10);
        sumGross += gross;
        sumComm += comm;

        const safeProd = `"${String(o.product || '').replace(/"/g, '""')}"`;
        const safeCust = `"${String(o.customer || '').replace(/"/g, '""')}"`;
        const safeDate = `"${formatDisplayDateTime(o.date).replace(/"/g, '""')}"`;

        csv += `${o.id},${safeDate},${safeCust},${safeProd},${gross},${comm},"${o.payment || 'Online'}",${o.status || 'Delivered'}\r\n`;
      });

      // Total Row
      csv += `\r\nTOTALS,,,"${filteredReportOrders.length} Orders",${sumGross},${sumComm},,\r\n`;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const filename = `ShopNow_Report_${activeFilterPreset}_${todayStr}.csv`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`CSV Report "${filename}" generated and downloaded!`, 'success');
      }
    }

    // ===================================================
    // PDF EXPORT GENERATOR (Using jsPDF & AutoTable)
    // ===================================================
    function generateReportPDF() {
      if (!filteredReportOrders || filteredReportOrders.length === 0) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('No records available to export for the selected filter range.', 'error');
        }
        return;
      }

      const activeLabel = $('#reportActivePeriodLabel').text();
      let totalGmv = 0;
      filteredReportOrders.forEach(o => { totalGmv += Number(o.amount || 0); });
      const totalCommission = Math.round(totalGmv * 0.10);
      const ordersCount = filteredReportOrders.length;
      const aov = ordersCount > 0 ? Math.round(totalGmv / ordersCount) : 0;

      // Check if jsPDF is available via CDN
      if (window.jspdf && window.jspdf.jsPDF) {
        try {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF('p', 'pt', 'a4');

          // Header Brand Box
          doc.setFillColor(8, 23, 38); // Dark Navy #081726
          doc.rect(0, 0, 595.28, 75, 'F');

          // Brand Logo / Name
          doc.setTextColor(255, 83, 56); // Coral #ff5338
          doc.setFontSize(20);
          doc.setFont('helvetica', 'bold');
          doc.text('ShopNow', 40, 42);

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'normal');
          doc.text('Executive Platform Audit Report', 140, 42);

          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text('CONFIDENTIAL · FINANCIAL & MULTI-VENDOR GMV AUDIT', 140, 56);

          // Meta Information
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`Filter Period:`, 40, 105);
          doc.setFont('helvetica', 'normal');
          doc.text(`${activeLabel}`, 115, 105);

          doc.setFont('helvetica', 'bold');
          doc.text(`Generated On:`, 40, 120);
          doc.setFont('helvetica', 'normal');
          doc.text(`${new Date().toLocaleString('en-IN')}`, 125, 120);

          // Summary Stats Box (4 mini cards)
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(40, 135, 515, 50, 4, 4, 'FD');

          // Stat 1: Total GMV
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text('GROSS VOLUME', 55, 153);
          doc.setFontSize(12);
          doc.setTextColor(255, 83, 56);
          doc.setFont('helvetica', 'bold');
          doc.text(`INR ${totalGmv.toLocaleString('en-IN')}`, 55, 172);

          // Stat 2: Commission
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.text('PLATFORM COMMISSION', 185, 153);
          doc.setFontSize(12);
          doc.setTextColor(14, 165, 233);
          doc.setFont('helvetica', 'bold');
          doc.text(`INR ${totalCommission.toLocaleString('en-IN')}`, 185, 172);

          // Stat 3: Total Orders
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.text('TOTAL ORDERS', 345, 153);
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.text(`${ordersCount}`, 345, 172);

          // Stat 4: Avg Order Value
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.text('AVG ORDER VALUE', 450, 153);
          doc.setFontSize(12);
          doc.setTextColor(16, 185, 129);
          doc.setFont('helvetica', 'bold');
          doc.text(`INR ${aov.toLocaleString('en-IN')}`, 450, 172);

          // AutoTable Data Preparation
          const tableHeaders = [['Order ID', 'Date', 'Customer', 'Product', 'Amount (INR)', 'Fee (10%)', 'Status']];
          const tableRows = filteredReportOrders.map(o => [
            o.id,
            formatDisplayDateTime(o.date).split(',')[0],
            o.customer,
            o.product.length > 25 ? o.product.substring(0, 23) + '..' : o.product,
            `INR ${Number(o.amount).toLocaleString('en-IN')}`,
            `INR ${Math.round(Number(o.amount) * 0.10).toLocaleString('en-IN')}`,
            o.status || 'Delivered'
          ]);

          doc.autoTable({
            head: tableHeaders,
            body: tableRows,
            startY: 200,
            theme: 'grid',
            headStyles: {
              fillColor: [8, 23, 38],
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 8,
              cellPadding: 6
            },
            bodyStyles: {
              fontSize: 8,
              cellPadding: 5,
              textColor: [15, 23, 42]
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            },
            columnStyles: {
              0: { fontStyle: 'bold', textColor: [255, 83, 56], cellWidth: 65 },
              4: { halign: 'right', fontStyle: 'bold' },
              5: { halign: 'right', textColor: [14, 165, 233] },
              6: { halign: 'center' }
            },
            margin: { left: 40, right: 40 },
            didDrawPage: function (data) {
              // Page footer
              const str = `Page ${doc.internal.getNumberOfPages()}`;
              doc.setFontSize(8);
              doc.setTextColor(148, 163, 184);
              doc.text(str, 595.28 - 70, 841.89 - 25);
              doc.text('ShopNow E-Commerce Audit · Generated strictly for internal administration.', 40, 841.89 - 25);
            }
          });

          const filename = `ShopNow_Admin_Report_${activeFilterPreset}_${todayStr}.pdf`;
          doc.save(filename);

          if (typeof ShopNowCommon !== 'undefined') {
            ShopNowCommon.showToast(`PDF Report "${filename}" generated and downloaded!`, 'success');
          }
          return;
        } catch (err) {
          console.warn('jsPDF error, falling back to printable view:', err);
        }
      }

      // Printable View Fallback (If jsPDF CDN failed)
      window.print();
    }

    // Attach Export Event Listeners
    $('#btnExportAdminCSV, #btnExportTableCSV').on('click', generateReportCSV);
    $('#btnExportAdminPDF, #btnExportTablePDF, #btnExportAdminReport').on('click', generateReportPDF);

    // Initial Load - render all records
    applyReportDateFilter('all');
  }
});
