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

  // Seed default delivery orders in Indian Metro Cities & INR across multiple dates
  const defaultDeliveryOrders = [
    // --- TODAY (Oct 24, 2026) ---
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
      createdAt: '2026-10-24T10:15:00Z',
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
      createdAt: '2026-10-24T09:40:00Z',
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
      createdAt: '2026-10-24T08:50:00Z',
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
      createdAt: '2026-10-24T08:15:00Z',
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
      createdAt: '2026-10-24T07:45:00Z',
      itemsCount: 1,
      orderContents: 'Organic Essential Oils Pack',
      specialInstructions: 'Ring doorbell twice upon delivery.',
      amount: 1250.00,
      earnings: 110.00,
      duration: '15 mins'
    },
    {
      id: 'ORD-98099',
      customer: 'Ananya Iyer',
      phone: '+91 98402 33419',
      email: 'ananya.i@example.in',
      address: '22 Usman Road, T. Nagar, Chennai 600017',
      pickupLocation: 'Chennai Express Hub, Guindy, Chennai',
      dropoffLocation: '22 Usman Road, Flat 3C',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '09:15 AM',
      date: 'Oct 24, 2026',
      createdAt: '2026-10-24T06:30:00Z',
      itemsCount: 2,
      orderContents: 'Silk Handloom Saree, Organic Incense Set',
      specialInstructions: 'Call customer upon arrival.',
      amount: 4200.00,
      earnings: 210.00,
      duration: '22 mins'
    },

    // --- THIS WEEK / PAST 7 DAYS (Oct 18 - Oct 23, 2026) ---
    {
      id: 'ORD-98098',
      customer: 'Rajesh Nair',
      phone: '+91 98471 22849',
      email: 'rajesh.n@example.in',
      address: '74 Marine Drive, Kochi 682031',
      pickupLocation: 'Kochi Port Logistics Park, Kochi',
      dropoffLocation: '74 Marine Drive, Apt 902',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '03:15 PM',
      date: 'Oct 23, 2026',
      createdAt: '2026-10-23T14:20:00Z',
      itemsCount: 1,
      orderContents: 'Waterproof Adventure Backpack (45L)',
      specialInstructions: 'Security check at main gate.',
      amount: 1850.00,
      earnings: 130.00,
      duration: '25 mins'
    },
    {
      id: 'ORD-98097',
      customer: 'Sneha Kulkarni',
      phone: '+91 98230 44921',
      email: 'sneha.k@example.in',
      address: '12 Viman Nagar, Pune 411014',
      pickupLocation: 'East Pune Warehouse Hub, Pune',
      dropoffLocation: '12 Viman Nagar, Row House 4',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '11:45 AM',
      date: 'Oct 23, 2026',
      createdAt: '2026-10-23T11:00:00Z',
      itemsCount: 3,
      orderContents: 'Stainless Steel Cookware Set & Kitchen Knife',
      specialInstructions: 'Leave with neighbor if door locked.',
      amount: 2199.00,
      earnings: 140.00,
      duration: '19 mins'
    },
    {
      id: 'ORD-98096',
      customer: 'Rohan Kapoor',
      phone: '+91 98112 77481',
      email: 'rohan.k@example.in',
      address: 'Tower 4, DLF Cyber City, Phase 2, Gurgaon 122002',
      pickupLocation: 'North Logistics Depot, Okhla, New Delhi',
      dropoffLocation: 'Tower 4, 11th Floor Reception, Cyber City',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '05:30 PM',
      date: 'Oct 22, 2026',
      createdAt: '2026-10-22T16:10:00Z',
      itemsCount: 2,
      orderContents: 'Ergonomic Mesh Office Chair, Monitor Stand',
      specialInstructions: 'Office delivery. Requires visitor pass.',
      amount: 5490.00,
      earnings: 240.00,
      duration: '32 mins'
    },
    {
      id: 'ORD-98095',
      customer: 'Tanvi Deshmukh',
      phone: '+91 98205 66129',
      email: 'tanvi.d@example.in',
      address: '304 Hiranandani Gardens, Powai, Mumbai 400076',
      pickupLocation: 'Central Suburb Hub, Kanjurmarg, Mumbai',
      dropoffLocation: '304 Hiranandani Gardens, Somerset A-502',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '11:20 AM',
      date: 'Oct 22, 2026',
      createdAt: '2026-10-22T10:30:00Z',
      itemsCount: 1,
      orderContents: 'Aromatherapy Diffuser & Lavender Oil',
      specialInstructions: 'Do not ring bell, newborn sleeping.',
      amount: 1750.00,
      earnings: 115.00,
      duration: '21 mins'
    },
    {
      id: 'ORD-98094',
      customer: 'Aditya Joshi',
      phone: '+91 98450 11984',
      email: 'aditya.j@example.in',
      address: '100 Feet Rd, Indiranagar, Bengaluru 560038',
      pickupLocation: 'HAL Logistics Facility, Bengaluru',
      dropoffLocation: '100 Feet Rd, Villa 8, Indiranagar',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '02:40 PM',
      date: 'Oct 21, 2026',
      createdAt: '2026-10-21T13:45:00Z',
      itemsCount: 2,
      orderContents: 'Wireless Gaming Mouse & Mechanical Keyboard',
      specialInstructions: 'Deliver directly to buyer.',
      amount: 3200.00,
      earnings: 160.00,
      duration: '26 mins'
    },
    {
      id: 'ORD-98093',
      customer: 'Kavita Menon',
      phone: '+91 98490 88203',
      email: 'kavita.m@example.in',
      address: 'Cyber Towers Lane, Hitec City, Hyderabad 500081',
      pickupLocation: 'Madhapur Fulfillment Center, Hyderabad',
      dropoffLocation: 'Cyber Towers Lane, Apt 6B',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '12:35 PM',
      date: 'Oct 20, 2026',
      createdAt: '2026-10-20T12:00:00Z',
      itemsCount: 1,
      orderContents: 'Cold Pressed Virgin Coconut Oil (1L)',
      specialInstructions: 'Hand over to security desk.',
      amount: 899.00,
      earnings: 85.00,
      duration: '16 mins'
    },
    {
      id: 'ORD-98092',
      customer: 'Manish Gupta',
      phone: '+91 98300 44192',
      email: 'manish.g@example.in',
      address: 'Sector 5, Salt Lake City, Kolkata 700091',
      pickupLocation: 'East Kolkata Logistics Hub, Kolkata',
      dropoffLocation: 'Sector 5, Block EP, Flat 12',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '04:10 PM',
      date: 'Oct 19, 2026',
      createdAt: '2026-10-19T15:20:00Z',
      itemsCount: 3,
      orderContents: 'Smart Fitness Tracker Watch, Gym Gloves',
      specialInstructions: 'Confirm OTP at delivery.',
      amount: 4600.00,
      earnings: 200.00,
      duration: '28 mins'
    },
    {
      id: 'ORD-98091',
      customer: 'Pooja Rao',
      phone: '+91 98452 77014',
      email: 'pooja.r@example.in',
      address: 'ITPB Main Road, Whitefield, Bengaluru 560066',
      pickupLocation: 'Whitefield Distribution Hub, Bengaluru',
      dropoffLocation: 'Prestige Ozone, Villa 42, Whitefield',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '12:05 PM',
      date: 'Oct 18, 2026',
      createdAt: '2026-10-18T11:15:00Z',
      itemsCount: 2,
      orderContents: 'Pure Copper Water Pitcher, Herbal Teas',
      specialInstructions: 'Drop at porch table.',
      amount: 2350.00,
      earnings: 145.00,
      duration: '22 mins'
    },

    // --- LAST WEEK (Oct 11 - Oct 17, 2026) ---
    {
      id: 'ORD-98085',
      customer: 'Karthik Reddy',
      phone: '+91 98491 55021',
      email: 'karthik.r@example.in',
      address: 'Road No. 12, Banjara Hills, Hyderabad 500034',
      pickupLocation: 'Jubilee Hills Logistics Node, Hyderabad',
      dropoffLocation: 'Road No. 12, Hill View Enclave 3A',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '04:45 PM',
      date: 'Oct 17, 2026',
      createdAt: '2026-10-17T16:00:00Z',
      itemsCount: 2,
      orderContents: 'Leather Weekender Travel Bag, Passport Wallet',
      specialInstructions: 'Leave with resident caretaker.',
      amount: 3800.00,
      earnings: 190.00,
      duration: '27 mins'
    },
    {
      id: 'ORD-98084',
      customer: 'Meera Nambiar',
      phone: '+91 98401 99234',
      email: 'meera.n@example.in',
      address: 'Gandhi Nagar 2nd Main, Adyar, Chennai 600020',
      pickupLocation: 'South Chennai Hub, Guindy, Chennai',
      dropoffLocation: 'Gandhi Nagar 2nd Main, Apt 101',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '11:00 AM',
      date: 'Oct 16, 2026',
      createdAt: '2026-10-16T10:20:00Z',
      itemsCount: 1,
      orderContents: 'Ceramic Pour-Over Coffee Dripper',
      specialInstructions: 'Ring bell on arrival.',
      amount: 1290.00,
      earnings: 100.00,
      duration: '18 mins'
    },
    {
      id: 'ORD-98083',
      customer: 'Siddharth Jain',
      phone: '+91 98200 88412',
      email: 'siddharth.j@example.in',
      address: 'Gulmohar Cross Rd 10, Juhu, Mumbai 400049',
      pickupLocation: 'Western Express Warehouse, Andheri, Mumbai',
      dropoffLocation: 'Sea Breeze Mansion, 4th Floor, Juhu',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '03:10 PM',
      date: 'Oct 15, 2026',
      createdAt: '2026-10-15T14:10:00Z',
      itemsCount: 4,
      orderContents: 'Premium Chef Knife Set, Teak Cutting Board',
      specialInstructions: 'Direct customer handover requested.',
      amount: 6200.00,
      earnings: 260.00,
      duration: '35 mins'
    },
    {
      id: 'ORD-98082',
      customer: 'Divya Pillai',
      phone: '+91 98220 33490',
      email: 'divya.p@example.in',
      address: 'Mayur Colony, Kothrud, Pune 411038',
      pickupLocation: 'West Pune Depot, Karve Road, Pune',
      dropoffLocation: 'Mayur Colony, Building B-14',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '12:15 PM',
      date: 'Oct 14, 2026',
      createdAt: '2026-10-14T11:30:00Z',
      itemsCount: 1,
      orderContents: 'Handcrafted Soy Wax Scented Candles',
      specialInstructions: 'Safe drop at door mat.',
      amount: 950.00,
      earnings: 90.00,
      duration: '17 mins'
    },
    {
      id: 'ORD-98081',
      customer: 'Harsh Vardhan',
      phone: '+91 98101 22910',
      email: 'harsh.v@example.in',
      address: 'Press Enclave Road, Saket, New Delhi 110017',
      pickupLocation: 'South Delhi Distribution Hub, New Delhi',
      dropoffLocation: 'Press Enclave Road, Pocket C-8',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '01:45 PM',
      date: 'Oct 13, 2026',
      createdAt: '2026-10-13T13:00:00Z',
      itemsCount: 2,
      orderContents: 'True Wireless Noise-Cancelling Earbuds',
      specialInstructions: 'Deliver to recipient personally.',
      amount: 2999.00,
      earnings: 155.00,
      duration: '24 mins'
    },
    {
      id: 'ORD-98080',
      customer: 'Ritu Chawla',
      phone: '+91 98188 66201',
      email: 'ritu.c@example.in',
      address: 'The Magnolias, Golf Course Road, Gurgaon 122009',
      pickupLocation: 'Gurgaon Central Logistics Point, Gurgaon',
      dropoffLocation: 'Tower 2, Apt 1801, Golf Course Road',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '04:30 PM',
      date: 'Oct 12, 2026',
      createdAt: '2026-10-12T15:40:00Z',
      itemsCount: 2,
      orderContents: 'Pure Wool Handwoven Pashmina Shawl',
      specialInstructions: 'High value package, handle with extreme care.',
      amount: 4100.00,
      earnings: 195.00,
      duration: '23 mins'
    },

    // --- LAST MONTH / EARLIER (Sep 25 - Oct 10, 2026) ---
    {
      id: 'ORD-98075',
      customer: 'Varun Bhat',
      phone: '+91 98453 00192',
      email: 'varun.b@example.in',
      address: 'Residency Road, MG Road Area, Bengaluru 560025',
      pickupLocation: 'Central CBD Sorting Center, Bengaluru',
      dropoffLocation: 'Residency Road, Suite 501',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '01:00 PM',
      date: 'Oct 09, 2026',
      createdAt: '2026-10-09T12:15:00Z',
      itemsCount: 2,
      orderContents: 'Smart Home Security Camera, Door Sensor',
      specialInstructions: 'Ring chime on delivery.',
      amount: 3450.00,
      earnings: 170.00,
      duration: '25 mins'
    },
    {
      id: 'ORD-98074',
      customer: 'Shalini Bose',
      phone: '+91 98311 77209',
      email: 'shalini.b@example.in',
      address: 'Park Street, Mullick Bazar, Kolkata 700016',
      pickupLocation: 'South Central Hub, Kolkata',
      dropoffLocation: 'Park Street, Heritage Court 2B',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '03:30 PM',
      date: 'Oct 05, 2026',
      createdAt: '2026-10-05T14:50:00Z',
      itemsCount: 1,
      orderContents: 'Handcrafted Leather Journal & Ink Set',
      specialInstructions: 'Drop with front security.',
      amount: 1890.00,
      earnings: 125.00,
      duration: '20 mins'
    },
    {
      id: 'ORD-98073',
      customer: 'Arvind Swamy',
      phone: '+91 98403 55102',
      email: 'arvind.s@example.in',
      address: '100 Feet Bypass Road, Velachery, Chennai 600042',
      pickupLocation: 'Velachery Logistics Hub, Chennai',
      dropoffLocation: '100 Feet Bypass, Pearl Haven Flat 6A',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '10:50 AM',
      date: 'Oct 01, 2026',
      createdAt: '2026-10-01T10:00:00Z',
      itemsCount: 3,
      orderContents: 'Cordless Vacuum Cleaner & HEPA Filters',
      specialInstructions: 'Elevator access available in building.',
      amount: 5120.00,
      earnings: 230.00,
      duration: '31 mins'
    },
    {
      id: 'ORD-98072',
      customer: 'Deepa Agarwal',
      phone: '+91 98290 11845',
      email: 'deepa.a@example.in',
      address: 'Subhash Marg, C-Scheme, Jaipur 302001',
      pickupLocation: 'Jaipur Central Depot, Jaipur',
      dropoffLocation: 'Subhash Marg, Anand Vihar House 12',
      status: 'Delivered',
      statusClass: 'delivered',
      eta: '05:00 PM',
      date: 'Sep 27, 2026',
      createdAt: '2026-09-27T16:20:00Z',
      itemsCount: 2,
      orderContents: 'Blue Pottery Vase, Brass Pooja Thali',
      specialInstructions: 'Fragile ceramic items.',
      amount: 2750.00,
      earnings: 150.00,
      duration: '22 mins'
    }
  ];

  const currentAgent = (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null) || JSON.parse(localStorage.getItem('shopnow_current_user') || 'null');

  function initDeliveryOrders() {
    let existing = JSON.parse(localStorage.getItem(STORAGE_DELIVERY_ORDERS) || 'null');
    // If empty or containing legacy US orders or fewer than 10 orders (needs multi-date enriched dataset), reseed
    if (!existing || existing.length < 10 || (existing[0] && existing[0].address && existing[0].address.includes('Springfield, OR'))) {
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
    let currentAssignedPage = 1;
    const assignedPageSize = 5;
    let filteredAssignedOrders = orders;

    const activeCount = orders.filter(o => o.status !== 'Delivered').length;
    const readyPickup = orders.filter(o => o.status === 'Pending').length;
    if ($('#badgeTotalActive').length) {
      $('#badgeTotalActive').text(activeCount);
    }
    if ($('#badgeReadyPickup').length) {
      $('#badgeReadyPickup').text(readyPickup > 9 ? readyPickup : '0' + readyPickup);
    }

    function renderAssignedTable(items, page) {
      if (items !== undefined) filteredAssignedOrders = items;
      if (page !== undefined) currentAssignedPage = page;

      const pInfo = ShopNowCommon.paginate(filteredAssignedOrders, currentAssignedPage, assignedPageSize);
      currentAssignedPage = pInfo.currentPage;

      let html = '';
      if (!items || pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="6" class="text-center py-5 text-muted">No orders currently assigned to your route.</td></tr>';
      } else {
        pInfo.pageItems.forEach(ord => {
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

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#deliveryAssignedPaginationWrapper',
        infoSelector: '#deliveryAssignedPaginationInfo',
        listSelector: '#deliveryAssignedPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'assignments',
        onPageChange: function (newPage) {
          renderAssignedTable(filteredAssignedOrders, newPage);
        }
      });
    }

    renderAssignedTable(orders, 1);

    // Search and Status Filters
    function filterAssignedOrders() {
      const q = ($('#assignedOrdersSearchInput').val() || '').toLowerCase().trim();
      const status = $('#assignedOrdersStatusFilter').val();

      const filtered = orders.filter(ord => {
        const ordId = (ord.id || ord.orderId || '').toLowerCase();
        const cust = (ord.customer || ord.buyerName || '').toLowerCase();
        const addr = (ord.address || '').toLowerCase();
        const matchesQ = ordId.includes(q) || cust.includes(q) || addr.includes(q);
        const matchesStatus = (status === 'all') || ((ord.status || '').toLowerCase() === status.toLowerCase());
        return matchesQ && matchesStatus;
      });

      renderAssignedTable(filtered, 1);
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
    let currentHistoryPage = 1;
    const historyPageSize = 5;
    let filteredHistoryOrders = orders;

    function renderHistoryTable(items, page) {
      if (items !== undefined) filteredHistoryOrders = items;
      if (page !== undefined) currentHistoryPage = page;

      const pInfo = ShopNowCommon.paginate(filteredHistoryOrders, currentHistoryPage, historyPageSize);
      currentHistoryPage = pInfo.currentPage;

      let html = '';
      if (!items || pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="6" class="text-center py-4 text-muted">No historical delivery records found matching criteria.</td></tr>';
      } else {
        pInfo.pageItems.forEach(ord => {
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

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#deliveryHistoryPaginationWrapper',
        infoSelector: '#deliveryHistoryPaginationInfo',
        listSelector: '#deliveryHistoryPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'results',
        onPageChange: function (newPage) {
          renderHistoryTable(filteredHistoryOrders, newPage);
        }
      });
    }

    renderHistoryTable(orders, 1);

    function applyHistoryFilters() {
      const q = ($('#historySearchInput').val() || '').toLowerCase().trim();
      const status = $('#historyStatusFilter').val();
      const filtered = orders.filter(o => {
        const id = (o.id || o.orderId || '').toLowerCase();
        const cust = (o.customer || o.buyerName || '').toLowerCase();
        const addr = (o.address || '').toLowerCase();
        const matchesQ = id.includes(q) || cust.includes(q) || addr.includes(q);
        const matchesStatus = (status === 'all') || ((o.status || '').toLowerCase() === status.toLowerCase());
        return matchesQ && matchesStatus;
      });
      renderHistoryTable(filtered, 1);
    }

    $('#historySearchInput').on('input', applyHistoryFilters);
    $('#historyStatusFilter').on('change', applyHistoryFilters);

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
  // 8. PAGE: REPORTS CONTROLLER (Dynamic KPIs, Charts & File Exports)
  // ===================================================
  if ($('#deliveryVolumeChart').length || $('#btnExportReportsPdf').length || $('.report-preset-btn').length) {
    let allReportDeliveries = [];
    let filteredReportDeliveries = [];
    let activePreset = 'last-week';
    let volumeChartInstance = null;
    let statusChartInstance = null;
    const refAnchorDate = new Date('2026-10-24T23:59:59');

    function parseDeliveryDate(order) {
      if (order.createdAt) {
        const d = new Date(order.createdAt);
        if (!isNaN(d.getTime())) return d;
      }
      if (order.date) {
        const d = new Date(order.date);
        if (!isNaN(d.getTime())) return d;
      }
      return new Date('2026-10-24T12:00:00');
    }

    // Dynamic Filter Engine
    function applyReportsDateFilter(preset, customStart, customEnd) {
      activePreset = preset;
      let label = 'Last 7 Days (Oct 18 - Oct 24, 2026)';

      if (preset === 'today') {
        const startOfDay = new Date('2026-10-24T00:00:00');
        const endOfDay = new Date('2026-10-24T23:59:59');
        filteredReportDeliveries = allReportDeliveries.filter(o => {
          const d = parseDeliveryDate(o);
          return d >= startOfDay && d <= endOfDay;
        });
        label = "Today's Deliveries (Oct 24, 2026)";
      } else if (preset === 'last-week') {
        const sevenDaysAgo = new Date(refAnchorDate.getTime() - 7 * 86400000);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        filteredReportDeliveries = allReportDeliveries.filter(o => {
          const d = parseDeliveryDate(o);
          return d >= sevenDaysAgo && d <= refAnchorDate;
        });
        label = 'Last 7 Days (Oct 18 - Oct 24, 2026)';
      } else if (preset === 'last-month') {
        const thirtyDaysAgo = new Date(refAnchorDate.getTime() - 30 * 86400000);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        filteredReportDeliveries = allReportDeliveries.filter(o => {
          const d = parseDeliveryDate(o);
          return d >= thirtyDaysAgo && d <= refAnchorDate;
        });
        label = `Last 30 Days (${thirtyDaysAgo.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - Oct 24, 2026)`;
      } else if (preset === 'custom') {
        let sDate = customStart ? new Date(customStart + 'T00:00:00') : new Date(0);
        let eDate = customEnd ? new Date(customEnd + 'T23:59:59') : new Date();
        if (sDate > eDate) {
          const tmp = sDate;
          sDate = eDate;
          eDate = tmp;
        }
        filteredReportDeliveries = allReportDeliveries.filter(o => {
          const d = parseDeliveryDate(o);
          return d >= sDate && d <= eDate;
        });
        label = `Custom Range: ${sDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} to ${eDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
      } else {
        // all
        filteredReportDeliveries = [...allReportDeliveries];
        label = 'All Time Delivery Records';
      }

      // Sort by newest first
      filteredReportDeliveries.sort((a, b) => parseDeliveryDate(b) - parseDeliveryDate(a));

      // Update Filter Banner UI
      $('#reportActivePeriodLabel').text(label);
      $('#reportFilteredRecordsCount').text(`${filteredReportDeliveries.length} deliver${filteredReportDeliveries.length === 1 ? 'y' : 'ies'}`);
      $('#reportGeneratedTimestamp').html(`<i class="bi bi-clock me-1"></i>Updated ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);

      // Update KPIs, Charts, and Table
      updateReportKPIs(preset);
      updateReportCharts(preset);
      renderReportDeliveriesTable(filteredReportDeliveries);
    }

    // Dynamic KPI Cards Calculation
    function updateReportKPIs(preset) {
      const total = filteredReportDeliveries.length;
      const deliveredCount = filteredReportDeliveries.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
      const successRate = total > 0 ? ((deliveredCount / total) * 100).toFixed(1) : '100.0';

      $('#kpiSuccessRate').text(`${successRate}%`);
      $('#kpiSuccessBadge').html(
        `<i class="bi bi-arrow-up-right"></i> ${Number(successRate) >= 95 ? '+4.2%' : '+1.8%'} vs fleet avg`
      );

      $('#kpiTotalDeliveries').text(total);
      if (preset === 'today') {
        $('#kpiTotalSubtitle').text("Completed today's shifts");
      } else if (preset === 'last-week') {
        $('#kpiTotalSubtitle').text('Completed in 7-day period');
      } else if (preset === 'last-month') {
        $('#kpiTotalSubtitle').text('Completed in 30-day period');
      } else {
        $('#kpiTotalSubtitle').text('Completed consignments');
      }

      // Calculate Average Duration
      let durSum = 0;
      let durCount = 0;
      filteredReportDeliveries.forEach(o => {
        if (o.duration) {
          const parsed = parseInt(o.duration, 10);
          if (!isNaN(parsed) && parsed > 0) {
            durSum += parsed;
            durCount++;
          }
        }
      });
      const avgDuration = durCount > 0 ? Math.round(durSum / durCount) : 22;
      $('#kpiAvgCompletion').text(`${avgDuration}m`);
      $('#kpiAvgSpeedBadge').html(
        `<i class="bi bi-speedometer2"></i> ${avgDuration <= 24 ? '5m ahead of SLA target' : 'Within standard SLA pacing'}`
      );

      // Calculate Rider Payout / Earnings
      let totalEarnings = 0;
      filteredReportDeliveries.forEach(o => {
        totalEarnings += Number(o.earnings || 120);
      });
      $('#kpiAgentEarnings').text(`₹ ${totalEarnings.toLocaleString('en-IN')}`);
      const avgPayout = total > 0 ? Math.round(totalEarnings / total) : 0;
      $('#kpiRatingSubtitle').text(`Avg ₹${avgPayout} / drop · Rating: 4.9 ★`);
    }

    // Dynamic Charts Renderer
    function updateReportCharts(preset) {
      const total = filteredReportDeliveries.length;
      const deliveredCount = filteredReportDeliveries.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
      const inTransitCount = filteredReportDeliveries.filter(o => {
        const st = (o.status || '').toLowerCase();
        return st.includes('transit') || st.includes('out');
      }).length;
      const pendingCount = filteredReportDeliveries.filter(o => {
        const st = (o.status || '').toLowerCase();
        return st.includes('pending') || st.includes('fail') || st.includes('cancel');
      }).length;

      // Update Doughnut Legends & Center Rate
      const onTimePct = total > 0 ? Math.round((deliveredCount / total) * 100) : 100;
      $('#donutCenterRate').text(`${onTimePct}%`);

      const delivPct = total > 0 ? Math.round((deliveredCount / total) * 100) : 0;
      const transPct = total > 0 ? Math.round((inTransitCount / total) * 100) : 0;
      const pendPct = total > 0 ? Math.max(0, 100 - delivPct - transPct) : 0;

      $('#legendDeliveredPct').text(`${delivPct}%`);
      $('#legendDeliveredCount').text(`(${deliveredCount})`);
      $('#legendInTransitPct').text(`${transPct}%`);
      $('#legendInTransitCount').text(`(${inTransitCount})`);
      $('#legendPendingPct').text(`${pendPct}%`);
      $('#legendPendingCount').text(`(${pendingCount})`);

      // 1. Render Status Doughnut Chart
      const statusCanvas = document.getElementById('deliveryStatusChart');
      if (statusCanvas && typeof Chart !== 'undefined') {
        if (statusChartInstance) {
          statusChartInstance.destroy();
          statusChartInstance = null;
        }

        const dataVals = total > 0 ? [deliveredCount, inTransitCount, pendingCount] : [1];
        const bgColors = total > 0 ? ['#ff5338', '#081726', '#cbd5e1'] : ['#e2e8f0'];

        statusChartInstance = new Chart(statusCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Delivered', 'In Transit / Out', 'Pending / Other'],
            datasets: [{
              data: dataVals,
              backgroundColor: bgColors,
              borderColor: '#ffffff',
              borderWidth: 2,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '74%',
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: total > 0,
                backgroundColor: '#081726',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#ff5338',
                borderWidth: 1,
                padding: 8
              }
            }
          }
        });
      }

      // 2. Render Delivery Volume Bar Chart
      let labels = [];
      let completedData = [];
      let targetData = [];

      if (preset === 'today') {
        labels = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];
        // Slot counts based on today's orders
        const slotCounts = [0, 0, 0, 0, 0, 0];
        filteredReportDeliveries.forEach(o => {
          const d = parseDeliveryDate(o);
          const h = d.getHours();
          if (h < 10) slotCounts[0]++;
          else if (h < 12) slotCounts[1]++;
          else if (h < 14) slotCounts[2]++;
          else if (h < 16) slotCounts[3]++;
          else if (h < 18) slotCounts[4]++;
          else slotCounts[5]++;
        });
        completedData = slotCounts;
        targetData = [1, 2, 2, 2, 2, 1];
        $('#volumeChartSubtitle').text("Hourly delivery completion vs courier dispatch quota");
      } else if (preset === 'last-week') {
        labels = ['Sun 18', 'Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24'];
        const dayMap = { 18: 0, 19: 1, 20: 2, 21: 3, 22: 4, 23: 5, 24: 6 };
        completedData = [0, 0, 0, 0, 0, 0, 0];
        filteredReportDeliveries.forEach(o => {
          const d = parseDeliveryDate(o);
          const dateNum = d.getDate();
          if (dayMap[dateNum] !== undefined) {
            completedData[dayMap[dateNum]]++;
          }
        });
        targetData = [2, 3, 3, 3, 4, 3, 4];
        $('#volumeChartSubtitle').text("7-day daily delivery completion vs route target");
      } else if (preset === 'last-month') {
        labels = ['Sep 25 - 30', 'Oct 01 - 06', 'Oct 07 - 12', 'Oct 13 - 18', 'Oct 19 - 24'];
        completedData = [2, 3, 4, 5, 10];
        targetData = [3, 4, 5, 6, 10];
        $('#volumeChartSubtitle').text("5-week volume progression across Pan-India delivery zones");
      } else {
        // custom or all
        labels = ['Zone A (Mumbai)', 'Zone B (Bengaluru)', 'Zone C (Delhi NCR)', 'Zone D (Pune)', 'Zone E (Chennai)'];
        completedData = [6, 5, 4, 4, 3];
        targetData = [7, 6, 5, 5, 4];
        $('#volumeChartSubtitle').text("Consolidated volume completion across city logistics routes");
      }

      const volumeCanvas = document.getElementById('deliveryVolumeChart');
      if (volumeCanvas && typeof Chart !== 'undefined') {
        if (volumeChartInstance) {
          volumeChartInstance.destroy();
          volumeChartInstance = null;
        }

        volumeChartInstance = new Chart(volumeCanvas, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Completed Drops',
                data: completedData,
                backgroundColor: '#ff5338',
                borderRadius: 4,
                maxBarThickness: 32
              },
              {
                label: 'Route Target',
                data: targetData,
                backgroundColor: '#081726',
                borderRadius: 4,
                maxBarThickness: 32
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#081726',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#ff5338',
                borderWidth: 1,
                padding: 10
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
              },
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1, font: { size: 11 } },
                grid: { color: 'rgba(0,0,0,0.06)' }
              }
            }
          }
        });
      }
    }

    // Dynamic Deliveries Breakdown Table
    function renderReportDeliveriesTable(items) {
      let html = '';
      if (!items || items.length === 0) {
        html = `
          <tr>
            <td colspan="8" class="text-center py-5">
              <div class="p-3 bg-light rounded-circle d-inline-block mb-2">
                <i class="bi bi-calendar-x text-muted" style="font-size: 2rem;"></i>
              </div>
              <h6 class="text-dark fw-bold mb-1">No deliveries found for this date range</h6>
              <p class="text-muted extra-small mb-0">Select "Last Week", "Last Month", or "All Time" to view consolidated courier logs.</p>
            </td>
          </tr>
        `;
      } else {
        items.forEach(o => {
          const ordId = o.id || o.orderId || 'ORD-98100';
          const eta = o.eta || '12:00 PM';
          const dateStr = o.date || 'Oct 24, 2026';
          const cust = o.customer || 'Customer';
          const phone = o.phone || '';
          const dropoff = o.dropoffLocation || o.address || 'Drop-off address';
          const amount = Number(o.amount || 0).toLocaleString('en-IN');
          const payout = Number(o.earnings || 120).toLocaleString('en-IN');
          const dur = o.duration || '20 mins';
          const status = o.status || 'Delivered';

          let statusClass = o.statusClass || 'delivered';
          const sLower = status.toLowerCase();
          if (sLower.includes('transit')) statusClass = 'in-transit';
          else if (sLower.includes('pending')) statusClass = 'pending';
          else if (sLower.includes('out')) statusClass = 'out-for-delivery';
          else if (sLower.includes('fail') || sLower.includes('cancel')) statusClass = 'cancelled';

          html += `
            <tr>
              <td><strong class="text-coral font-monospace">${ordId}</strong></td>
              <td>
                <div class="fw-semibold text-dark">${dateStr}</div>
                <div class="extra-small text-muted"><i class="bi bi-clock me-1"></i>ETA: ${eta}</div>
              </td>
              <td>
                <div class="fw-bold text-dark">${cust}</div>
                <div class="extra-small text-muted">${phone}</div>
              </td>
              <td>
                <div class="text-truncate text-secondary" style="max-width: 220px;" title="${dropoff}">
                  <i class="bi bi-geo-alt-fill text-coral me-1"></i>${dropoff}
                </div>
              </td>
              <td><strong>₹ ${amount}</strong></td>
              <td><strong class="text-success">₹ ${payout}</strong></td>
              <td><span class="badge bg-light text-dark border"><i class="bi bi-stopwatch me-1"></i>${dur}</span></td>
              <td><span class="badge-status badge-status-${statusClass}">${status}</span></td>
            </tr>
          `;
        });
      }

      $('#reportDeliveriesTableBody').html(html);
      $('#reportDeliveriesCountInfo').text(`Showing ${items.length} order${items.length === 1 ? '' : 's'}`);
    }

    // ===================================================
    // CSV EXPORT GENERATOR (Actual Browser File Download)
    // ===================================================
    function generateDeliveriesCSV(customTitle, specificItems) {
      const items = specificItems || filteredReportDeliveries;
      if (!items || items.length === 0) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('No records available to export for the selected filter range.', 'error');
        }
        return;
      }

      const activeLabel = $('#reportActivePeriodLabel').text() || 'Delivery Performance';
      const timestamp = new Date().toLocaleString('en-IN');
      const filenameDate = new Date().toISOString().slice(0, 10);
      const title = customTitle || 'ShopNow Courier Fleet Performance & Deliveries Audit Report';

      let csv = `\uFEFF${title}\r\n`;
      csv += `Filter Interval:,"${activeLabel}"\r\n`;
      csv += `Generated On:,"${timestamp}"\r\n`;
      csv += `Courier Agent:,"${currentAgent ? currentAgent.name || currentAgent.email : 'Fleet Courier Agent'}"\r\n`;
      csv += `Total Deliveries Exported:,${items.length}\r\n\r\n`;

      // Header row
      csv += `Order ID,Delivery Date,ETA,Customer,Contact Phone,Drop-off Location,Order Value (INR),Rider Payout (INR),Duration,Status\r\n`;

      let sumAmount = 0;
      let sumEarnings = 0;
      let sumMinutes = 0;
      let validDurations = 0;

      items.forEach(o => {
        const amt = Number(o.amount || 0);
        const earn = Number(o.earnings || 120);
        sumAmount += amt;
        sumEarnings += earn;

        const dur = parseInt(o.duration || '20', 10);
        if (!isNaN(dur)) {
          sumMinutes += dur;
          validDurations++;
        }

        const safeId = o.id || o.orderId || '';
        const safeDate = `"${(o.date || '').replace(/"/g, '""')}"`;
        const safeEta = `"${(o.eta || '').replace(/"/g, '""')}"`;
        const safeCust = `"${(o.customer || '').replace(/"/g, '""')}"`;
        const safePhone = `"${(o.phone || '').replace(/"/g, '""')}"`;
        const safeLoc = `"${(o.dropoffLocation || o.address || '').replace(/"/g, '""')}"`;
        const safeDur = `"${(o.duration || '20 mins').replace(/"/g, '""')}"`;
        const safeStatus = `"${(o.status || 'Delivered').replace(/"/g, '""')}"`;

        csv += `${safeId},${safeDate},${safeEta},${safeCust},${safePhone},${safeLoc},${amt},${earn},${safeDur},${safeStatus}\r\n`;
      });

      const avgMins = validDurations > 0 ? Math.round(sumMinutes / validDurations) : 22;
      csv += `\r\nTOTALS,,,,,"Consolidated Summary",${sumAmount},${sumEarnings},"${avgMins} mins avg",\r\n`;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const filename = `ShopNow_Delivery_Report_${activePreset}_${filenameDate}.csv`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`CSV Report "${filename}" generated & downloaded!`, 'success');
      }
    }

    // ===================================================
    // PDF EXPORT GENERATOR (Using jsPDF & AutoTable)
    // ===================================================
    function generateDeliveriesPDF(customTitle, specificItems) {
      const items = specificItems || filteredReportDeliveries;
      if (!items || items.length === 0) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('No records available to export for the selected filter range.', 'error');
        }
        return;
      }

      const activeLabel = $('#reportActivePeriodLabel').text() || 'Delivery Performance';
      const reportTitle = customTitle || 'Courier Fleet Operational Performance & Delivery Audit';
      const filenameDate = new Date().toISOString().slice(0, 10);
      const filename = `ShopNow_Delivery_Report_${activePreset}_${filenameDate}.pdf`;

      // Check if jsPDF CDN is loaded
      if (window.jspdf && window.jspdf.jsPDF) {
        try {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF('p', 'pt', 'a4');

          // Header Navy Box
          doc.setFillColor(8, 23, 38); // Dark Navy #081726
          doc.rect(0, 0, 595.28, 75, 'F');

          // Brand Logo & Header
          doc.setTextColor(255, 83, 56); // Coral #ff5338
          doc.setFontSize(22);
          doc.setFont('helvetica', 'bold');
          doc.text('ShopNow', 40, 42);

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(13);
          doc.setFont('helvetica', 'normal');
          doc.text(reportTitle, 150, 42);

          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text('OFFICIAL LOGISTICS DISPATCH & RIDER SETTLEMENT AUDIT', 150, 56);

          // Meta Information
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Filter Period:', 40, 105);
          doc.setFont('helvetica', 'normal');
          doc.text(activeLabel, 115, 105);

          doc.setFont('helvetica', 'bold');
          doc.text('Generated On:', 40, 120);
          doc.setFont('helvetica', 'normal');
          doc.text(new Date().toLocaleString('en-IN'), 125, 120);

          doc.setFont('helvetica', 'bold');
          doc.text('Courier Agent:', 340, 105);
          doc.setFont('helvetica', 'normal');
          doc.text(`${currentAgent ? currentAgent.name || currentAgent.email : 'Fleet Delivery Partner'}`, 425, 105);

          doc.setFont('helvetica', 'bold');
          doc.text('Region Hub:', 340, 120);
          doc.setFont('helvetica', 'normal');
          doc.text('Pan-India Metro Logistics Network', 415, 120);

          // 4 Summary Metrics Box
          const deliveredCount = items.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
          const successPct = items.length > 0 ? ((deliveredCount / items.length) * 100).toFixed(1) : '100.0';
          let sumEarnings = 0;
          let sumDur = 0;
          items.forEach(o => {
            sumEarnings += Number(o.earnings || 120);
            sumDur += parseInt(o.duration || '20', 10) || 20;
          });
          const avgDur = items.length > 0 ? Math.round(sumDur / items.length) : 22;

          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(40, 135, 515, 50, 4, 4, 'FD');

          // Metric 1: Success Rate
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text('SUCCESS RATE', 55, 155);
          doc.setFontSize(14);
          doc.setTextColor(255, 83, 56);
          doc.setFont('helvetica', 'bold');
          doc.text(`${successPct}%`, 55, 173);

          // Metric 2: Total Deliveries
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.text('TOTAL DELIVERIES', 185, 155);
          doc.setFontSize(14);
          doc.setTextColor(8, 23, 38);
          doc.setFont('helvetica', 'bold');
          doc.text(`${items.length}`, 185, 173);

          // Metric 3: Avg Duration
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.text('AVG COMPLETION', 320, 155);
          doc.setFontSize(14);
          doc.setTextColor(8, 23, 38);
          doc.setFont('helvetica', 'bold');
          doc.text(`${avgDur} mins`, 320, 173);

          // Metric 4: Rider Payout
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.text('TOTAL RIDER PAYOUT', 440, 155);
          doc.setFontSize(14);
          doc.setTextColor(22, 163, 74); // Green
          doc.setFont('helvetica', 'bold');
          doc.text(`INR ${sumEarnings.toLocaleString('en-IN')}`, 440, 173);

          // AutoTable of Deliveries
          const tableHeaders = [
            ['Order ID', 'Date & ETA', 'Customer', 'Drop-off Location', 'Consignment', 'Payout', 'Duration', 'Status']
          ];

          const tableRows = items.map(o => [
            o.id || o.orderId || 'ORD-98100',
            `${o.date || 'Oct 24'}\nETA: ${o.eta || '12:00 PM'}`,
            `${o.customer || 'Customer'}\n${o.phone || ''}`,
            (o.dropoffLocation || o.address || 'Drop-off address').substring(0, 32),
            `INR ${Number(o.amount || 0).toLocaleString('en-IN')}`,
            `INR ${Number(o.earnings || 120).toLocaleString('en-IN')}`,
            o.duration || '20 mins',
            o.status || 'Delivered'
          ]);

          doc.autoTable({
            head: tableHeaders,
            body: tableRows,
            startY: 200,
            margin: { left: 40, right: 40 },
            theme: 'striped',
            headStyles: {
              fillColor: [8, 23, 38],
              textColor: [255, 255, 255],
              fontSize: 8,
              fontStyle: 'bold',
              cellPadding: 6
            },
            bodyStyles: {
              fontSize: 8,
              cellPadding: 5,
              textColor: [30, 41, 59]
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            },
            columnStyles: {
              0: { fontStyle: 'bold', textColor: [255, 83, 56], cellWidth: 65 },
              1: { cellWidth: 70 },
              2: { cellWidth: 80 },
              3: { cellWidth: 105 },
              4: { cellWidth: 60, halign: 'right' },
              5: { cellWidth: 50, halign: 'right', fontStyle: 'bold', textColor: [22, 163, 74] },
              6: { cellWidth: 45, halign: 'center' },
              7: { cellWidth: 40, halign: 'center', fontStyle: 'bold' }
            },
            didDrawPage: function (data) {
              // Footer
              doc.setFontSize(8);
              doc.setTextColor(148, 163, 184);
              const str = `ShopNow Logistics Audit · Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`;
              doc.text(str, 40, doc.internal.pageSize.height - 20);
              doc.text('Confidential courier operational log', doc.internal.pageSize.width - 180, doc.internal.pageSize.height - 20);
            }
          });

          doc.save(filename);

          if (typeof ShopNowCommon !== 'undefined') {
            ShopNowCommon.showToast(`PDF Report "${filename}" generated & downloaded!`, 'success');
          }
          return;
        } catch (err) {
          console.warn('[Reports] jsPDF autoTable rendering notice:', err);
        }
      }

      // Printable HTML Fallback if jsPDF is blocked
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        let printHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1e293b; }
              .header { border-bottom: 2px solid #ff5338; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; }
              .logo { color: #ff5338; font-size: 24px; font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
              th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
              th { background: #081726; color: #ffffff; }
              tr:nth-child(even) { background: #f8fafc; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo">ShopNow</div>
                <div>${reportTitle}</div>
              </div>
              <div style="text-align: right; font-size: 12px; color: #64748b;">
                <div>Filter: ${activeLabel}</div>
                <div>Generated: ${new Date().toLocaleString('en-IN')}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date & ETA</th>
                  <th>Customer</th>
                  <th>Drop-off Location</th>
                  <th>Amount (INR)</th>
                  <th>Payout (INR)</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
        `;
        items.forEach(o => {
          printHtml += `
            <tr>
              <td><strong>${o.id || o.orderId}</strong></td>
              <td>${o.date || ''} (${o.eta || ''})</td>
              <td>${o.customer || ''}</td>
              <td>${o.dropoffLocation || o.address || ''}</td>
              <td>₹ ${Number(o.amount || 0).toLocaleString('en-IN')}</td>
              <td style="color: #16a34a; font-weight: bold;">₹ ${Number(o.earnings || 120).toLocaleString('en-IN')}</td>
              <td>${o.duration || '20 mins'}</td>
              <td>${o.status || 'Delivered'}</td>
            </tr>
          `;
        });
        printHtml += `
              </tbody>
            </table>
            <script>window.onload = function() { window.print(); };<\/script>
          </body>
          </html>
        `;
        printWindow.document.write(printHtml);
        printWindow.document.close();
      }
    }

    // ===================================================
    // Specialized Recent Audit Reports Handlers
    // ===================================================
    function handleRecentReportExport(type, format) {
      let reportName = 'Weekly Efficiency Audit';
      let subset = [...allReportDeliveries];

      if (type === 'efficiency') {
        reportName = 'Weekly Courier Efficiency & Route Turnaround Audit';
        // Past 7 days
        const sevenDaysAgo = new Date(refAnchorDate.getTime() - 7 * 86400000);
        subset = allReportDeliveries.filter(o => parseDeliveryDate(o) >= sevenDaysAgo);
      } else if (type === 'fuel') {
        reportName = 'Fuel Allowance & Kilometers Distance Analysis';
        subset = allReportDeliveries.slice(0, 8);
      } else if (type === 'ratings') {
        reportName = 'Customer CSAT Satisfaction & Punctuality Scorecard';
        subset = allReportDeliveries.filter(o => (o.status || '').toLowerCase() === 'delivered');
      } else if (type === 'fleet') {
        reportName = 'Monthly Courier SLA & Vehicle Compliance Review';
        subset = [...allReportDeliveries];
      }

      if (format === 'csv') {
        generateDeliveriesCSV(reportName, subset);
      } else {
        generateDeliveriesPDF(reportName, subset);
      }
    }

    // ===================================================
    // Event Listeners for Filters & Exports
    // ===================================================

    // 1. Filter Preset Pills (Today, Last Week, Last Month, All Time)
    $(document).on('click', '.report-preset-btn', function () {
      $('.report-preset-btn').removeClass('btn-coral-delivery active').addClass('btn-outline-dark');
      $(this).removeClass('btn-outline-dark').addClass('btn-coral-delivery active');
      const preset = $(this).data('preset');
      applyReportsDateFilter(preset);
    });

    // 2. Custom Date Interval Apply Button
    $(document).on('click', '#btnApplyDateFilter', function () {
      const s = $('#reportStartDate').val();
      const e = $('#reportEndDate').val();
      if (!s || !e) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Please select both "From" and "To" dates.', 'error');
        }
        return;
      }
      $('.report-preset-btn').removeClass('btn-coral-delivery active').addClass('btn-outline-dark');
      applyReportsDateFilter('custom', s, e);
    });

    // 3. Reset Filter Button
    $(document).on('click', '#btnResetDateFilter', function () {
      $('#reportStartDate').val('');
      $('#reportEndDate').val('');
      $('.report-preset-btn').removeClass('btn-coral-delivery active').addClass('btn-outline-dark');
      $('.report-preset-btn[data-preset="last-week"]').removeClass('btn-outline-dark').addClass('btn-coral-delivery active');
      applyReportsDateFilter('last-week');
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Date filters reset to default "Last Week".', 'info');
      }
    });

    // 4. Header & Table CSV Export Buttons
    $(document).on('click', '#btnExportReportsCsv, #btnExportTableCSV', function () {
      generateDeliveriesCSV();
    });

    // 5. Header & Table PDF Export Buttons
    $(document).on('click', '#btnExportReportsPdf, #btnExportTablePDF', function () {
      generateDeliveriesPDF();
    });

    // 6. Recent Reports Export Buttons (CSV & PDF)
    $(document).on('click', '.btn-export-recent-csv', function () {
      const reportType = $(this).data('type') || 'efficiency';
      handleRecentReportExport(reportType, 'csv');
    });

    $(document).on('click', '.btn-export-recent-pdf', function () {
      const reportType = $(this).data('type') || 'efficiency';
      handleRecentReportExport(reportType, 'pdf');
    });

    // 7. Efficiency Settings Action
    $('#btnApplyEfficiencySettings').on('click', function () {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('AI Route Optimization & Delivery Priority applied to fleet queue!', 'success');
      }
    });

    // ===================================================
    // Initialization: Sync with MockAPI & Render
    // ===================================================
    allReportDeliveries = getAgentOrders();

    if (typeof ShopNowAPI !== 'undefined' && typeof ShopNowAPI.getOrders === 'function') {
      ShopNowAPI.getOrders().then(remoteOrders => {
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          const existingIds = new Set(allReportDeliveries.map(o => String(o.id || o.orderId)));
          remoteOrders.forEach(ro => {
            const rId = String(ro.id || ro.orderId);
            if (!existingIds.has(rId)) {
              allReportDeliveries.push({
                id: rId.startsWith('ORD-') ? rId : 'ORD-' + rId,
                customer: ro.customer || ro.buyerName || 'Valued Customer',
                phone: ro.phone || '+91 98201 45892',
                email: ro.email || 'customer@example.in',
                address: ro.address || ro.shippingAddress || 'Andheri East, Mumbai',
                pickupLocation: 'ShopNow Central Hub, Mumbai',
                dropoffLocation: ro.address || 'Drop-off address',
                status: ro.status || 'Delivered',
                statusClass: (ro.status || 'delivered').toLowerCase(),
                eta: '12:00 PM',
                date: ro.date || 'Oct 24, 2026',
                createdAt: ro.createdAt || (ro.date ? new Date(ro.date).toISOString() : new Date().toISOString()),
                itemsCount: 1,
                orderContents: ro.product || 'Standard Parcel',
                specialInstructions: 'Safe drop at door.',
                amount: Number(ro.amount || 1499),
                earnings: Math.round(Number(ro.amount || 1499) * 0.08) || 120,
                duration: '22 mins'
              });
              existingIds.add(rId);
            }
          });
        }
        applyReportsDateFilter('last-week');
      }).catch(err => {
        console.warn('[Reports] API orders fetch notice:', err);
        applyReportsDateFilter('last-week');
      });
    } else {
      applyReportsDateFilter('last-week');
    }
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
