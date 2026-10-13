/**
 * ===================================================
 * SHOPNOW - SELLER PORTAL MAIN JAVASCRIPT CONTROLLER
 * Manages Dashboard, Products, Inventory, Orders, Shipping,
 * Reviews, Returns, Reports, and MockAPI Integration
 * ===================================================
 */

$(document).ready(function () {
  'use strict';

  // Storage Keys
  const STORAGE_SELLER_PRODUCTS = 'shopnow_seller_products';
  const STORAGE_SELLER_ORDERS = 'shopnow_seller_orders';
  const STORAGE_SELLER_RETURNS = 'shopnow_seller_returns';
  const STORAGE_SELLER_REVIEWS = 'shopnow_seller_reviews';

  // Sample fallback image
  const defaultSampleImage = 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png';

  // Safe Storage Set helper: catches QuotaExceededError and prunes oversized base64 strings
  function safeStorageSet(key, value) {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[Storage Warning] Quota exceeded on "${key}". Pruning bloated image strings...`, err);
      try {
        const keysToPrune = ['shopnow_products', STORAGE_SELLER_PRODUCTS, 'shopnow_cart', 'shopnow_wishlist'];
        keysToPrune.forEach(k => {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                let modified = false;
                list.forEach(item => {
                  if (item && item.image && typeof item.image === 'string' && item.image.length > 30000 && item.image.startsWith('data:')) {
                    item.image = defaultSampleImage;
                    modified = true;
                  }
                  if (item && Array.isArray(item.images)) {
                    item.images = item.images.map(img => (typeof img === 'string' && img.length > 30000 && img.startsWith('data:')) ? defaultSampleImage : img);
                    modified = true;
                  }
                });
                if (modified) {
                  localStorage.setItem(k, JSON.stringify(list));
                }
              }
            } catch (pErr) {}
          }
        });
        localStorage.setItem(key, serialized);
        return true;
      } catch (retryErr) {
        console.error('[Storage Error] Critical storage limit reached:', retryErr);
        return false;
      }
    }
  }

  // ===================================================
  // CLOUDINARY CONFIGURATION FOR IMAGE UPLOADS
  // Inherits automatically from ShopNowAPI / ShopNowCommon
  // ===================================================
  const CLOUDINARY_CONFIG = (typeof ShopNowAPI !== 'undefined' && ShopNowAPI.CLOUDINARY_CONFIG)
    ? ShopNowAPI.CLOUDINARY_CONFIG
    : (typeof ShopNowCommon !== 'undefined' && ShopNowCommon.API && ShopNowCommon.API.CLOUDINARY_CONFIG)
      ? ShopNowCommon.API.CLOUDINARY_CONFIG
      : {
          cloudName: 'dpva4smxo',
          uploadPreset: 'ml_default',
          apiKey: '',
          get uploadUrl() {
            return `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
          }
        };

  // Seed default seller products matching Figma Image 1 & 2
  const defaultSellerProducts = [
    {
      id: 1,
      sku: 'MH-CER-012',
      title: 'Speckled ceramic mug',
      category: 'Home & Living',
      subCategory: 'Tableware',
      price: 890,
      discountPrice: 799,
      stock: 3,
      status: 'Active',
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png'
    },
    {
      id: 2,
      sku: 'PH-L-C-006',
      title: 'Linen cushion cover',
      category: 'Home Decor',
      subCategory: 'Cushions',
      price: 1299,
      discountPrice: null,
      stock: 5,
      status: 'Active',
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png'
    },
    {
      id: 3,
      sku: 'ST-HB-018',
      title: 'Handwoven storage basket',
      category: 'Storage',
      subCategory: 'Baskets',
      price: 1650,
      discountPrice: 1499,
      stock: 14,
      status: 'Active',
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png'
    },
    {
      id: 4,
      sku: 'MH-AG-521',
      title: 'Amber glass candle',
      category: 'Decor',
      subCategory: 'Candles',
      price: 649,
      discountPrice: null,
      stock: 2,
      status: 'Active',
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_5_mqgoba.png'
    },
    {
      id: 5,
      sku: 'DH-TC-002',
      title: 'Terracotta planter',
      category: 'Garden',
      subCategory: 'Planters',
      price: 1090,
      discountPrice: 990,
      stock: 3,
      status: 'Active',
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_4_dh5fbk.png'
    },
    {
      id: 6,
      sku: 'TC-PL-024',
      title: 'Textured ceramic plate',
      category: 'Home Decor',
      subCategory: 'Tableware',
      price: 1150,
      discountPrice: null,
      stock: 12,
      status: 'Active',
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_1_dtjolj.png'
    },
    {
      id: 7,
      sku: 'TC-PL-019',
      title: 'Glazed serving bowl',
      category: 'Home & Living',
      subCategory: 'Bowls',
      price: 1450,
      discountPrice: null,
      stock: 8,
      status: 'Active',
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_6_vvdraq.png'
    },
    {
      id: 8,
      sku: 'PH-R-C-021',
      title: 'Cotton table runner',
      category: 'Home & Living',
      subCategory: 'Linens',
      price: 950,
      discountPrice: null,
      stock: 15,
      status: 'Active',
      image: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_7_radxl9.png'
    }
  ];

  // Seed default seller orders matching Figma Image 3 Screen 2 & Screen 4 (34 Total: 2 Processing, 5 Shipped, 27 Delivered)
  const defaultSellerOrders = [
    // 2 Processing Orders
    {
      id: 'SN-10452',
      orderId: 'SN-10452',
      date: '12 Oct 2026, 02:45 PM',
      customer: 'Vikram Malhotra',
      email: 'vikram.m@example.com',
      phone: '+91 98201 45892',
      city: 'Mumbai, MH',
      address: '402 Sea Breeze Apts, Bandra West, Mumbai 400050',
      itemTitle: 'Speckled ceramic mug (Set of 2)',
      items: [{ id: 1, title: 'Speckled ceramic mug', sku: 'MH-CER-012', price: 890, qty: 2 }],
      total: 1780,
      paymentMethod: 'Paid (UPI)',
      status: 'Processing',
      statusClass: 'processing',
      courier: 'Blue Dart',
      trackingId: 'BD-982341209',
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'SN-10451',
      orderId: 'SN-10451',
      date: '12 Oct 2026, 11:15 AM',
      customer: 'Ayesha Sen',
      email: 'ayesha.sen@example.com',
      phone: '+91 98301 92831',
      city: 'Kolkata, WB',
      address: '12/A Southern Avenue, Ballygunge, Kolkata 700029',
      itemTitle: 'Linen cushion cover',
      items: [{ id: 2, title: 'Linen cushion cover', sku: 'PH-L-C-006', price: 1299, qty: 1 }],
      total: 1299,
      paymentMethod: 'Paid (Credit Card)',
      status: 'Processing',
      statusClass: 'processing',
      courier: 'Delhivery',
      trackingId: 'DEL-84729103',
      sellerEmail: 'seller@demo.com'
    },
    // 5 Shipped Orders
    {
      id: 'SN-10450',
      orderId: 'SN-10450',
      date: '11 Oct 2026, 06:20 PM',
      customer: 'Rahul Verma',
      email: 'rahul.v@example.com',
      phone: '+91 98450 12094',
      city: 'Bengaluru, KA',
      address: 'Plot 88, 4th Cross, Indiranagar, Bengaluru 560038',
      itemTitle: 'Handwoven storage basket',
      items: [{ id: 3, title: 'Handwoven storage basket', sku: 'ST-HB-018', price: 1650, qty: 1 }],
      total: 1650,
      paymentMethod: 'Paid (UPI)',
      status: 'Shipped',
      statusClass: 'shipped',
      courier: 'Blue Dart',
      trackingId: 'BD-948102381',
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'SN-10449',
      orderId: 'SN-10449',
      date: '11 Oct 2026, 04:10 PM',
      customer: 'Sneha Iyer',
      email: 'sneha.iyer@example.com',
      phone: '+91 98401 55621',
      city: 'Chennai, TN',
      address: '82 Anna Nagar, 2nd Avenue, Chennai 600040',
      itemTitle: 'Terracotta planter',
      items: [{ id: 5, title: 'Terracotta planter', sku: 'DH-TC-002', price: 1090, qty: 1 }],
      total: 1090,
      paymentMethod: 'Paid (Credit Card)',
      status: 'Shipped',
      statusClass: 'shipped',
      courier: 'Delhivery',
      trackingId: 'DEL-73829104',
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'SN-10448',
      orderId: 'SN-10448',
      date: '11 Oct 2026, 03:00 PM',
      customer: 'Kavita Rao',
      email: 'kavita.rao@example.com',
      phone: '+91 98490 88219',
      city: 'Hyderabad, TS',
      address: 'Flat 501, Oakwood Residency, Jubilee Hills, Hyderabad 500033',
      itemTitle: 'Amber glass candle (Set of 2)',
      items: [{ id: 4, title: 'Amber glass candle', sku: 'MH-AG-521', price: 649, qty: 2 }],
      total: 1298,
      paymentMethod: 'Cash on delivery',
      status: 'Shipped',
      statusClass: 'shipped',
      courier: 'Ecom Express',
      trackingId: 'EX-58392019',
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'SN-10447',
      orderId: 'SN-10447',
      date: '10 Oct 2026, 08:15 PM',
      customer: 'Rohan Patel',
      email: 'rohan.patel@example.com',
      phone: '+91 98250 49102',
      city: 'Ahmedabad, GJ',
      address: '24 Shantivan Society, Navrangpura, Ahmedabad 380009',
      itemTitle: 'Textured ceramic plate (Set of 2)',
      items: [{ id: 6, title: 'Textured ceramic plate', sku: 'TC-PL-024', price: 1150, qty: 2 }],
      total: 2300,
      paymentMethod: 'Paid (UPI)',
      status: 'Shipped',
      statusClass: 'shipped',
      courier: 'Delhivery',
      trackingId: 'DEL-64738291',
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'SN-10446',
      orderId: 'SN-10446',
      date: '10 Oct 2026, 05:45 PM',
      customer: 'Meera Nair',
      email: 'meera.nair@example.com',
      phone: '+91 98470 19283',
      city: 'Kochi, KL',
      address: '14 Palm Beach Enclave, Marine Drive, Kochi 682031',
      itemTitle: 'Glazed serving bowl',
      items: [{ id: 7, title: 'Glazed serving bowl', sku: 'TC-PL-019', price: 1450, qty: 1 }],
      total: 1450,
      paymentMethod: 'Paid (NetBanking)',
      status: 'Shipped',
      statusClass: 'shipped',
      courier: 'Blue Dart',
      trackingId: 'BD-829104723',
      sellerEmail: 'seller@demo.com'
    },
    // 27 Delivered Orders
    ...[
      { name: 'Aditya Roy', city: 'Pune, MH', addr: '304 Hermes Heritage, Kalyani Nagar, Pune 411006', item: 'Terracotta planter', price: 1090 },
      { name: 'Pooja Hegde', city: 'Jaipur, RJ', addr: '12 Malviya Nagar, Jaipur 302017', item: 'Cotton table runner', price: 950 },
      { name: 'Naveen Kumar', city: 'Lucknow, UP', addr: '78 Gomti Nagar, Lucknow 226010', item: 'Amber glass candle', price: 649 },
      { name: 'Ananya Mehta', city: 'Mumbai, MH', addr: '15 Altamount Road, Cumballa Hill, Mumbai 400026', item: 'Speckled ceramic mug', price: 890 },
      { name: 'Deepak Chopra', city: 'Chandigarh, PB', addr: 'Sector 8-C, Chandigarh 160009', item: 'Handwoven storage basket', price: 1650 },
      { name: 'Ishita Sharma', city: 'Gurugram, HR', addr: 'DLF Phase 5, Golf Course Rd, Gurugram 122002', item: 'Linen cushion cover', price: 1299 },
      { name: 'Gaurav Jain', city: 'Indore, MP', addr: '45 Vijay Nagar, Indore 452010', item: 'Textured ceramic plate', price: 1150 },
      { name: 'Sanya Mirza', city: 'Surat, GJ', addr: '102 City Light Road, Surat 395007', item: 'Glazed serving bowl', price: 1450 },
      { name: 'Karthik Raja', city: 'Coimbatore, TN', addr: '56 Race Course Road, Coimbatore 641018', item: 'Speckled ceramic mug', price: 890 },
      { name: 'Ritu Sen', city: 'Bhopal, MP', addr: '23 Arera Colony, Bhopal 462016', item: 'Terracotta planter', price: 1090 },
      { name: 'Alok Nath', city: 'Patna, BR', addr: 'Boring Road, Patna 800001', item: 'Cotton table runner', price: 950 },
      { name: 'Suresh Raina', city: 'Ghaziabad, UP', addr: 'Raj Nagar, Ghaziabad 201002', item: 'Handwoven storage basket', price: 1650 },
      { name: 'Zoya Khan', city: 'Nagpur, MH', addr: 'Civil Lines, Nagpur 440001', item: 'Amber glass candle', price: 649 },
      { name: 'Harsh Vardhan', city: 'Varanasi, UP', addr: 'Cantonment, Varanasi 221002', item: 'Linen cushion cover', price: 1299 },
      { name: 'Manish Pandey', city: 'Visakhapatnam, AP', addr: 'Waltair Uplands, Vizag 530003', item: 'Textured ceramic plate', price: 1150 },
      { name: 'Kriti Sanon', city: 'Dehradun, UK', addr: 'Rajpur Road, Dehradun 248001', item: 'Glazed serving bowl', price: 1450 },
      { name: 'Rajesh Khanna', city: 'Amritsar, PB', addr: 'Mall Road, Amritsar 143001', item: 'Speckled ceramic mug', price: 890 },
      { name: 'Shreya Ghoshal', city: 'Vadodara, GJ', addr: 'Alkapuri, Vadodara 390007', item: 'Terracotta planter', price: 1090 },
      { name: 'Varun Dhawan', city: 'Thane, MH', addr: 'Ghodbunder Road, Thane 400607', item: 'Cotton table runner', price: 950 },
      { name: 'Kunal Kapoor', city: 'Mysuru, KA', addr: 'Jayalakshmipuram, Mysuru 570012', item: 'Handwoven storage basket', price: 1650 },
      { name: 'Diya Mirza', city: 'Ranchi, JH', addr: 'Kanke Road, Ranchi 834008', item: 'Amber glass candle', price: 649 },
      { name: 'Sunil Chetri', city: 'Guwahati, AS', addr: 'GS Road, Dispur, Guwahati 781005', item: 'Linen cushion cover', price: 1299 },
      { name: 'Neha Kakkar', city: 'Noida, UP', addr: 'Sector 44, Noida 201301', item: 'Textured ceramic plate', price: 1150 },
      { name: 'Arbaaz Khan', city: 'Bhubaneswar, OD', addr: 'Saheed Nagar, Bhubaneswar 751007', item: 'Glazed serving bowl', price: 1450 },
      { name: 'Simran Kaur', city: 'Ludhiana, PB', addr: 'Sarabha Nagar, Ludhiana 141001', item: 'Speckled ceramic mug', price: 890 },
      { name: 'Farhan Akhtar', city: 'Navi Mumbai, MH', addr: 'Palm Beach Road, Vashi, Navi Mumbai 400703', item: 'Terracotta planter', price: 1090 },
      { name: 'Madhuri Dixit', city: 'Nashik, MH', addr: 'Gangapur Road, Nashik 422013', item: 'Cotton table runner', price: 950 }
    ].map((d, index) => {
      const ordNum = 10445 - index;
      const couriers = ['Blue Dart', 'Delhivery', 'Ecom Express'];
      const courier = couriers[index % couriers.length];
      const day = Math.max(1, 10 - Math.floor(index / 3));
      return {
        id: `SN-${ordNum}`,
        orderId: `SN-${ordNum}`,
        date: `${day < 10 ? '0' + day : day} Oct 2026, 10:30 AM`,
        customer: d.name,
        email: `${d.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
        city: d.city,
        address: d.addr,
        itemTitle: d.item,
        items: [{ id: index + 10, title: d.item, price: d.price, qty: 1 }],
        total: d.price,
        paymentMethod: index % 2 === 0 ? 'Paid (UPI)' : 'Paid (Card)',
        status: 'Delivered',
        statusClass: 'delivered',
        courier: courier,
        trackingId: `${courier === 'Blue Dart' ? 'BD' : courier === 'Delhivery' ? 'DEL' : 'EX'}-${Math.floor(10000000 + index * 3421)}`,
        sellerEmail: 'seller@demo.com'
      };
    })
  ];

  // Seed default seller returns
  const defaultSellerReturns = [
    {
      id: 'RET-2041',
      orderId: 'SN-18483',
      productTitle: 'Speckled ceramic mug',
      sku: 'MH-CER-012',
      productThumb: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png',
      reason: 'Item damaged / transit crack',
      date: '12 Oct 2026',
      status: 'Requested',
      statusClass: 'processing',
      refundStatus: 'Pending',
      amount: 890,
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'RET-2040',
      orderId: 'SN-18481',
      productTitle: 'Linen cushion cover',
      sku: 'PH-L-C-006',
      productThumb: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_ucgxvy.png',
      reason: 'Wrong size received',
      date: '11 Oct 2026',
      status: 'Approved',
      statusClass: 'shipped',
      refundStatus: 'Pending',
      amount: 1299,
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'RET-2039',
      orderId: 'SN-18480',
      productTitle: 'Handwoven storage basket',
      sku: 'ST-HB-018',
      productThumb: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_3_jh8ziq.png',
      reason: 'Defective handle weave',
      date: '10 Oct 2026',
      status: 'Inspected',
      statusClass: 'in-stock',
      refundStatus: 'Processed',
      amount: 1650,
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'RET-2038',
      orderId: 'SN-18478',
      productTitle: 'Amber glass candle',
      sku: 'MH-AG-521',
      productThumb: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382197/Product_image_5_mqgoba.png',
      reason: 'Quality issue',
      date: '09 Oct 2026',
      status: 'Refunded',
      statusClass: 'delivered',
      refundStatus: 'Processed',
      amount: 649,
      sellerEmail: 'seller@demo.com'
    },
    {
      id: 'RET-2037',
      orderId: 'SN-18476',
      productTitle: 'Terracotta planter',
      sku: 'DH-TC-002',
      productThumb: 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_4_dh5fbk.png',
      reason: 'Hairline crack at base',
      date: '08 Oct 2026',
      status: 'Refunded',
      statusClass: 'delivered',
      refundStatus: 'Processed',
      amount: 1090,
      sellerEmail: 'seller@demo.com'
    }
  ];

  // Seed default master customer reviews
  const defaultMasterReviews = [
    {
      id: 'REV-1',
      productTitle: 'Speckled ceramic mug',
      customer: 'Ananya Mehta',
      location: 'Mumbai',
      rating: 5,
      date: '2 days ago',
      avatarBg: 'bg-primary-subtle text-primary',
      avatarInitials: 'AM',
      comment: 'Beautiful mug. My new morning favourite! The glaze feels wonderfully organic and holds warmth so well.',
      reply: ''
    },
    {
      id: 'REV-2',
      productTitle: 'Handwoven storage basket',
      customer: 'Priya Kapoor',
      location: 'New Delhi',
      rating: 5,
      date: '4 days ago',
      avatarBg: 'bg-success-subtle text-success',
      avatarInitials: 'PK',
      comment: 'Lovely quality and so thoughtfully packed! Sturdy weaving and gorgeous natural tint.',
      reply: ''
    },
    {
      id: 'REV-3',
      productTitle: 'Terracotta planter',
      customer: 'Sneha Iyer',
      location: 'Chennai',
      rating: 5,
      date: '1 week ago',
      avatarBg: 'bg-danger-subtle text-danger',
      avatarInitials: 'SI',
      comment: 'Looks even better in person. Love it! Drainage hole is well positioned and finish is flawless.',
      reply: ''
    },
    {
      id: 'REV-4',
      productTitle: 'Amber glass candle',
      customer: 'Rohan Patel',
      location: 'Ahmedabad',
      rating: 4,
      date: '1 week ago',
      avatarBg: 'bg-info-subtle text-info',
      avatarInitials: 'RP',
      comment: 'The amber glass gives off such a warm glow. Great scent throw, only docked 1 star for delayed delivery.',
      reply: ''
    },
    {
      id: 'REV-5',
      productTitle: 'Linen cushion cover',
      customer: 'Arjun Nair',
      location: 'Bengaluru',
      rating: 5,
      date: '2 weeks ago',
      avatarBg: 'bg-purple-subtle text-purple',
      avatarInitials: 'AN',
      comment: 'Crisp linen, immaculate finish. Elevates the sofa instantly. Will be purchasing more colours soon!',
      reply: ''
    },
    {
      id: 'REV-6',
      productTitle: 'Textured ceramic plate',
      customer: 'Divya Sharma',
      location: 'Jaipur',
      rating: 5,
      date: '3 weeks ago',
      avatarBg: 'bg-warning-subtle text-warning',
      avatarInitials: 'DS',
      comment: 'Exquisite craftsmanship! The speckled stoneware looks like studio pottery. Microwave and dishwasher safe.',
      reply: ''
    },
    {
      id: 'REV-7',
      productTitle: 'Glazed serving bowl',
      customer: 'Manish Verma',
      location: 'Lucknow',
      rating: 4,
      date: '3 weeks ago',
      avatarBg: 'bg-success-subtle text-success',
      avatarInitials: 'MV',
      comment: 'Generous size and sturdy weight. Perfect centerpiece bowl for salads and dinners.',
      reply: ''
    },
    {
      id: 'REV-8',
      productTitle: 'Cotton table runner',
      customer: 'Tanvi Roy',
      location: 'Kolkata',
      rating: 5,
      date: '1 month ago',
      avatarBg: 'bg-primary-subtle text-primary',
      avatarInitials: 'TR',
      comment: 'Pure organic cotton with crisp edges. Washes well without shrinking or color loss.',
      reply: ''
    },
    {
      id: 'REV-SHOE-1',
      productTitle: 'Running Shoes',
      customer: 'Vikram Singhania',
      location: 'Mumbai',
      rating: 5,
      date: 'Yesterday',
      avatarBg: 'bg-primary-subtle text-primary',
      avatarInitials: 'VS',
      comment: 'Incredible comfort and arch support! I have been running 5k daily with these shoes and feel zero fatigue. Breathable mesh and top-notch grip.',
      reply: ''
    },
    {
      id: 'REV-SHOE-2',
      productTitle: 'Running Shoes',
      customer: 'Pooja Hegde',
      location: 'Pune',
      rating: 5,
      date: '3 days ago',
      avatarBg: 'bg-success-subtle text-success',
      avatarInitials: 'PH',
      comment: 'Super stylish and lightweight shoes! Fits true to size and looks very premium. Highly recommend to everyone.',
      reply: ''
    },
    {
      id: 'REV-SHOE-3',
      productTitle: 'Running Shoes',
      customer: 'Aman Chhabra',
      location: 'Bengaluru',
      rating: 4,
      date: '1 week ago',
      avatarBg: 'bg-info-subtle text-info',
      avatarInitials: 'AC',
      comment: 'Great grip on wet pavements and solid sole cushioning. Slightly snug on day one but broke in perfectly.',
      reply: ''
    },
    {
      id: 'REV-SHOE-4',
      productTitle: 'Running Shoes',
      customer: 'Rhea Sen',
      location: 'Delhi',
      rating: 5,
      date: '2 weeks ago',
      avatarBg: 'bg-danger-subtle text-danger',
      avatarInitials: 'RS',
      comment: 'Best pair of shoes I have bought online! Exceptional build quality and came in a very sturdy box with swift delivery.',
      reply: ''
    }
  ];

  function getCurrentSeller() {
    return (typeof ShopNowCommon !== 'undefined' ? ShopNowCommon.getCurrentUser() : null) || JSON.parse(localStorage.getItem('shopnow_current_user') || 'null');
  }

  function initSellerProducts() {
    if (!localStorage.getItem(STORAGE_SELLER_PRODUCTS)) {
      const seeded = defaultSellerProducts.map(p => ({
        ...p,
        sellerEmail: 'seller@demo.com',
        sellerName: 'TechWorld Store'
      }));
      safeStorageSet(STORAGE_SELLER_PRODUCTS, seeded);
    }
  }

  function initSellerOrders() {
    let existing = JSON.parse(localStorage.getItem(STORAGE_SELLER_ORDERS) || 'null');
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      const seeded = defaultSellerOrders.map(o => ({
        ...o,
        sellerEmail: 'seller@demo.com'
      }));
      safeStorageSet(STORAGE_SELLER_ORDERS, seeded);
    }
  }

  function initSellerReturns() {
    let existing = JSON.parse(localStorage.getItem(STORAGE_SELLER_RETURNS) || 'null');
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      safeStorageSet(STORAGE_SELLER_RETURNS, defaultSellerReturns);
    }
  }

  function initSellerReviews() {
    let existing = JSON.parse(localStorage.getItem(STORAGE_SELLER_REVIEWS) || 'null');
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      safeStorageSet(STORAGE_SELLER_REVIEWS, defaultMasterReviews);
    }
  }

  // Run initial seeding
  initSellerProducts();
  initSellerOrders();
  initSellerReturns();
  initSellerReviews();

  function getSellerProducts() {
    const user = getCurrentSeller();
    if (!user || !user.email) return [];

    const userEmail = user.email.toLowerCase();

    if (userEmail === 'seller@demo.com') {
      let prods = JSON.parse(localStorage.getItem(STORAGE_SELLER_PRODUCTS) || 'null');
      if (!prods) {
        initSellerProducts();
        prods = JSON.parse(localStorage.getItem(STORAGE_SELLER_PRODUCTS) || '[]');
      }
      return prods;
    }

    const sellerProds = JSON.parse(localStorage.getItem(STORAGE_SELLER_PRODUCTS) || '[]');
    const catalogProds = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
    const combined = [...sellerProds, ...catalogProds];

    const seen = new Set();
    const result = [];
    combined.forEach(p => {
      if (!p) return;
      const pEmail = (p.sellerEmail || '').toLowerCase();
      if (pEmail === userEmail || (user.storeName && p.sellerName === user.storeName)) {
        const key = String(p.id || p.sku);
        if (!seen.has(key)) {
          seen.add(key);
          result.push(p);
        }
      }
    });

    if (result.length === 0) {
      let prods = JSON.parse(localStorage.getItem(STORAGE_SELLER_PRODUCTS) || '[]');
      if (!prods || prods.length === 0) {
        initSellerProducts();
        prods = JSON.parse(localStorage.getItem(STORAGE_SELLER_PRODUCTS) || '[]');
      }
      return prods || [];
    }

    return result;
  }

  function getSellerOrders() {
    initSellerOrders();
    const user = getCurrentSeller();
    const sellerEmail = (user && user.email) ? user.email.toLowerCase() : 'seller@demo.com';

    let orders = JSON.parse(localStorage.getItem(STORAGE_SELLER_ORDERS) || '[]');
    const allOrders = JSON.parse(localStorage.getItem('shopnow_orders') || '[]');
    const combined = [...orders, ...allOrders];

    const seen = new Set();
    const result = [];
    combined.forEach(o => {
      if (!o) return;
      const key = o.id || o.orderId;
      if (!key || seen.has(key)) return;

      const isForSeller = (o.sellerEmail && o.sellerEmail.toLowerCase() === sellerEmail) ||
        (Array.isArray(o.items) && o.items.some(item => item && item.sellerEmail && item.sellerEmail.toLowerCase() === sellerEmail));

      if (isForSeller) {
        seen.add(key);
        result.push(o);
      }
    });

    // If custom seller logged in and has added products but no orders yet, seed orders for their products
    if (result.length === 0 && user && user.email && user.email.toLowerCase() !== 'seller@demo.com') {
      const myProds = getSellerProducts();
      if (myProds.length > 0) {
        const customOrders = defaultSellerOrders.map((o, idx) => {
          const prod = myProds[idx % myProds.length];
          return {
            ...o,
            id: `ORD-S-${1000 + idx}`,
            orderId: `SN-S-${1000 + idx}`,
            sellerEmail: sellerEmail,
            itemTitle: prod.title,
            items: [{ id: prod.id, title: prod.title, price: prod.price, qty: 1, sellerEmail: sellerEmail }],
            total: prod.price
          };
        });
        safeStorageSet(STORAGE_SELLER_ORDERS, [...orders, ...customOrders]);
        return customOrders;
      }
    }

    // Default to demo orders if seller@demo.com or fallback
    if (result.length === 0 && (!user || user.email.toLowerCase() === 'seller@demo.com')) {
      return orders;
    }

    return result;
  }

  function getSellerReturns() {
    initSellerReturns();
    const user = getCurrentSeller();
    const sellerEmail = (user && user.email) ? user.email.toLowerCase() : 'seller@demo.com';

    let returnsList = JSON.parse(localStorage.getItem(STORAGE_SELLER_RETURNS) || '[]');
    const allReturns = JSON.parse(localStorage.getItem('shopnow_returns') || '[]');
    const combined = [...returnsList, ...allReturns];
    const myProducts = getSellerProducts();
    const myTitles = myProducts.map(p => (p.title || '').toLowerCase().trim());

    const seen = new Set();
    const result = [];
    combined.forEach(r => {
      if (!r) return;
      const key = r.id;
      if (!key || seen.has(key)) return;

      const rEmail = (r.sellerEmail || '').toLowerCase();
      const rTitle = (r.productTitle || '').toLowerCase().trim();

      const isForSeller = (rEmail && rEmail === sellerEmail) ||
        (myTitles.some(t => t === rTitle || rTitle.includes(t) || t.includes(rTitle)));

      if (isForSeller) {
        seen.add(key);
        result.push(r);
      }
    });

    if (result.length === 0 && (!user || sellerEmail === 'seller@demo.com')) {
      return returnsList;
    }

    return result;
  }

  function getSellerReviews() {
    initSellerReviews();
    const myProducts = getSellerProducts();
    let storedReviews = JSON.parse(localStorage.getItem(STORAGE_SELLER_REVIEWS) || '[]');
    if (!storedReviews || storedReviews.length === 0) {
      storedReviews = [...defaultMasterReviews];
      safeStorageSet(STORAGE_SELLER_REVIEWS, storedReviews);
    }

    // Auto-seed customer reviews for any custom product added by seller if not already reviewed
    let modified = false;
    myProducts.forEach(prod => {
      const pTitle = (prod.title || '').trim();
      if (!pTitle) return;
      const pTitleLower = pTitle.toLowerCase();
      const isShoe = pTitleLower.includes('shoe') || pTitleLower.includes('runner') || pTitleLower.includes('sneaker') || pTitleLower.includes('footwear') || pTitleLower.includes('boot');

      const hasExactReview = storedReviews.some(r =>
        (r.productTitle || '').toLowerCase() === pTitleLower ||
        pTitleLower.includes((r.productTitle || '').toLowerCase()) ||
        (r.productTitle || '').toLowerCase().includes(pTitleLower)
      );

      if (!hasExactReview) {
        modified = true;
        if (isShoe) {
          storedReviews.unshift(
            {
              id: 'REV-' + Date.now() + '-1',
              productTitle: pTitle,
              customer: 'Vikram Singhania',
              location: 'Mumbai',
              rating: 5,
              date: 'Yesterday',
              avatarBg: 'bg-primary-subtle text-primary',
              avatarInitials: 'VS',
              comment: `Incredible comfort and arch support! I have been wearing these ${pTitle} daily and feel zero fatigue. Breathable mesh and top-notch grip.`,
              reply: ''
            },
            {
              id: 'REV-' + Date.now() + '-2',
              productTitle: pTitle,
              customer: 'Pooja Hegde',
              location: 'Pune',
              rating: 5,
              date: '3 days ago',
              avatarBg: 'bg-success-subtle text-success',
              avatarInitials: 'PH',
              comment: `Super stylish and lightweight! Fits true to size and matches photos exactly. Really impressed with ${pTitle}.`,
              reply: ''
            },
            {
              id: 'REV-' + Date.now() + '-3',
              productTitle: pTitle,
              customer: 'Aman Chhabra',
              location: 'Bengaluru',
              rating: 4,
              date: '1 week ago',
              avatarBg: 'bg-info-subtle text-info',
              avatarInitials: 'AC',
              comment: `Great sole cushioning and solid build. Delivered within 2 days in mint packaging. Very happy with ${pTitle}.`,
              reply: ''
            }
          );
        } else {
          storedReviews.unshift(
            {
              id: 'REV-' + Date.now() + '-1',
              productTitle: pTitle,
              customer: 'Neha Sharma',
              location: 'Delhi',
              rating: 5,
              date: '2 days ago',
              avatarBg: 'bg-success-subtle text-success',
              avatarInitials: 'NS',
              comment: `Loved this ${pTitle}! The quality is superb and exactly as described by the seller.`,
              reply: ''
            },
            {
              id: 'REV-' + Date.now() + '-2',
              productTitle: pTitle,
              customer: 'Rohan Mehra',
              location: 'Chandigarh',
              rating: 5,
              date: '4 days ago',
              avatarBg: 'bg-primary-subtle text-primary',
              avatarInitials: 'RM',
              comment: `Flawless craftsmanship, fast dispatch and safe packaging. Will definitely buy again!`,
              reply: ''
            }
          );
        }
      }
    });

    if (modified) {
      safeStorageSet(STORAGE_SELLER_REVIEWS, storedReviews);
    }

    const sellerProductTitles = myProducts.map(p => (p.title || '').toLowerCase().trim());
    const sellerReviews = storedReviews.filter(rev => {
      const revTitle = (rev.productTitle || '').toLowerCase().trim();
      return sellerProductTitles.some(pTitle =>
        revTitle === pTitle ||
        revTitle.includes(pTitle) ||
        pTitle.includes(revTitle) ||
        (revTitle.includes('shoe') && pTitle.includes('shoe'))
      );
    });

    const user = getCurrentSeller();
    if (sellerReviews.length === 0 && (!user || (user.email && user.email.toLowerCase() === 'seller@demo.com'))) {
      return storedReviews.slice(0, 8);
    }

    return sellerReviews;
  }

  // ===================================================
  // 1. PAGE: SELLER DASHBOARD CONTROLLER
  // ===================================================
  if ($('#sellerRecentOrdersTableBody').length) {
    const seller = getCurrentSeller();
    if (seller && (seller.name || seller.storeName)) {
      $('#sellerHeroTitle').text(`Welcome back, ${seller.storeName || seller.name}`);
    }

    const myOrders = getSellerOrders();
    const myProducts = getSellerProducts();
    const myReturns = getSellerReturns();
    const myReviews = getSellerReviews();

    const totalSales = myOrders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
    const newOrdersCount = myOrders.filter(ord => !ord.status || ord.status === 'Processing' || ord.status === 'New').length;
    const lowStockItems = myProducts.filter(p => Number(p.stock) <= 5);
    const lowStockCount = lowStockItems.length;
    const pendingReturnsCount = myReturns.filter(r => (r.status || '').toLowerCase() === 'requested' || (r.refundStatus || '').toLowerCase() === 'pending').length;

    $('#sellerStatTotalSales').text(`Rs ${totalSales.toLocaleString('en-IN')}`);
    $('#sellerStatNewOrders').text(newOrdersCount);
    $('#sellerStatLowStock').text(lowStockCount);
    $('#sellerStatPendingReturns').text(pendingReturnsCount);

    let html = '';
    if (myOrders.length === 0) {
      html = `<tr><td colspan="6" class="text-center py-4 text-muted">No orders received for your store yet.</td></tr>`;
    } else {
      myOrders.slice(0, 5).forEach(ord => {
        html += `
          <tr>
            <td><strong class="text-dark">#${ord.orderId || ord.id}</strong></td>
            <td>
              <div class="fw-bold text-dark">${ord.customer || ord.buyerName || 'Customer'}</div>
              <div class="extra-small text-muted">${ord.city || 'Standard Delivery'}</div>
            </td>
            <td>${ord.itemTitle || (ord.items && ord.items[0] ? ord.items[0].title : 'Order Items')}</td>
            <td><strong class="text-dark">Rs ${Number(ord.total).toLocaleString('en-IN')}</strong></td>
            <td><span class="status-badge ${ord.statusClass || 'processing'}">${ord.status || 'Processing'}</span></td>
            <td>
              <a href="order-details.html?id=${ord.id || ord.orderId}" class="text-coral fw-bold text-decoration-none small">View</a>
            </td>
          </tr>
        `;
      });
    }
    $('#sellerRecentOrdersTableBody').html(html);

    // Dashboard Low Stock Alerts List
    if ($('#sellerDashboardLowStockList').length) {
      if (lowStockItems.length === 0) {
        $('#sellerDashboardLowStockList').html(`
          <div class="p-3 text-center text-muted extra-small">
            <i class="bi bi-check-circle-fill text-success fs-5 d-block mb-1"></i>
            All catalogue products are currently well-stocked.
          </div>
        `);
      } else {
        let lowHtml = '';
        lowStockItems.slice(0, 4).forEach(p => {
          const isOut = Number(p.stock) <= 0;
          lowHtml += `
            <div class="low-stock-item d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <strong class="text-dark small d-block">${p.title}</strong>
                <span class="extra-small text-muted">${p.sku} &bull; ${p.category || 'General'}</span>
              </div>
              <span class="stock-pill ${isOut ? 'out' : 'low'}">${p.stock} left</span>
            </div>
          `;
        });
        $('#sellerDashboardLowStockList').html(lowHtml);
      }
    }

    // Dashboard Latest Reviews List
    if ($('#sellerDashboardReviewList').length) {
      if (myReviews.length === 0) {
        $('#sellerDashboardReviewList').html(`
          <div class="p-3 text-center text-muted extra-small">
            <i class="bi bi-chat-heart text-secondary fs-5 d-block mb-1"></i>
            No customer reviews recorded yet for your store.
          </div>
        `);
      } else {
        let revHtml = '';
        myReviews.slice(0, 3).forEach(rev => {
          let stars = '';
          for (let s = 1; s <= 5; s++) {
            stars += s <= rev.rating ? '<i class="bi bi-star-fill text-warning me-1"></i>' : '<i class="bi bi-star text-muted me-1"></i>';
          }
          revHtml += `
            <div class="review-item py-2 border-bottom">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <strong class="small text-dark">${rev.customer}</strong>
                <div class="extra-small">${stars}</div>
              </div>
              <p class="extra-small text-muted mb-1 text-truncate">&ldquo;${rev.comment}&rdquo;</p>
              <span class="extra-small text-coral fw-semibold">${rev.productTitle}</span>
            </div>
          `;
        });
        $('#sellerDashboardReviewList').html(revHtml);
      }
    }
  }

  // ===================================================
  // 2. PAGE: PRODUCTS LIST CONTROLLER
  // ===================================================
  if ($('#sellerProductsTableBody').length) {
    let allProducts = getSellerProducts();
    let currentProdPage = 1;
    const prodPageSize = 5;
    let filteredProducts = allProducts;

    function renderProductsTable(prods, page) {
      if (prods !== undefined) filteredProducts = prods;
      if (page !== undefined) currentProdPage = page;

      const pInfo = ShopNowCommon.paginate(filteredProducts, currentProdPage, prodPageSize);
      currentProdPage = pInfo.currentPage;

      let html = '';
      if (pInfo.pageItems.length === 0) {
        html = `<tr><td colspan="8" class="text-center py-5 text-muted"><p class="mb-2">No products found matching criteria.</p><a href="add-product.html" class="btn btn-coral-seller btn-sm"><i class="bi bi-plus-lg"></i> Add a product</a></td></tr>`;
      } else {
        pInfo.pageItems.forEach(p => {
          const isLow = Number(p.stock) <= 5;
          const fallbackImg = 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png';
          const imgSrc = p.image || (Array.isArray(p.images) && p.images[0]) || fallbackImg;
          html += `
            <tr id="sellerProdRow-${p.id}">
              <td><input type="checkbox" class="form-check-input" /></td>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="seller-product-thumb-box">
                    <img src="${imgSrc}" alt="${p.title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImg}';" />
                  </div>
                  <div>
                    <strong class="text-dark d-block text-truncate" style="max-width: 240px;" title="${p.title}">${p.title}</strong>
                    <span class="extra-small text-muted font-monospace">SKU: ${p.sku}</span>
                  </div>
                </div>
              </td>
              <td><code class="text-secondary small fw-bold">${p.sku}</code></td>
              <td><span class="badge bg-light text-dark border extra-small">${p.category}</span></td>
              <td><strong class="text-dark">₹ ${Number(p.price).toLocaleString('en-IN')}</strong></td>
              <td>
                <span class="${isLow ? 'text-danger fw-bold' : 'text-dark font-monospace'}">${p.stock}</span>
                ${isLow ? '<span class="badge bg-danger-subtle text-danger ms-1 extra-small">Low</span>' : ''}
              </td>
              <td><span class="status-badge ${p.status === 'Active' ? 'active' : 'draft'}">${p.status}</span></td>
              <td>
                <div class="d-flex gap-2">
                  <a href="add-product.html?editId=${p.id}" class="btn btn-sm btn-light p-1 px-2 border" title="Edit"><i class="bi bi-pencil text-secondary"></i></a>
                  <button type="button" class="btn btn-sm btn-light p-1 px-2 border btn-delete-product" data-id="${p.id}" data-title="${p.title}" title="Delete"><i class="bi bi-trash text-danger"></i></button>
                </div>
              </td>
            </tr>
          `;
        });
      }
      $('#sellerProductsTableBody').html(html);

      if (filteredProducts.length === 0) {
        $('#sellerProductsCountHeader').text(`Showing 0 of ${allProducts.length} products`);
      } else {
        $('#sellerProductsCountHeader').text(`Showing ${pInfo.startIndex + 1}-${pInfo.endIndex} of ${filteredProducts.length} products`);
      }

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#sellerProductsPaginationWrapper',
        infoSelector: '#sellerProductsPaginationInfo',
        listSelector: '#sellerProductsPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'products',
        onPageChange: function (newPage) {
          renderProductsTable(filteredProducts, newPage);
        }
      });
    }

    function applyProductFilters() {
      const q = ($('#sellerProductSearch').val() || '').toLowerCase().trim();
      const cat = $('#filterCategory').val() || 'all';
      const stock = $('#filterStock').val() || 'all';
      const status = $('#filterStatus').val() || 'all';

      filteredProducts = allProducts.filter(p => {
        const titleStr = (p.title || '').toLowerCase();
        const skuStr = (p.sku || '').toLowerCase();
        const matchesQ = !q || titleStr.includes(q) || skuStr.includes(q);
        const matchesCat = (cat === 'all') || (p.category === cat);
        let matchesStock = true;
        if (stock === 'in') matchesStock = Number(p.stock) > 5;
        else if (stock === 'low') matchesStock = Number(p.stock) <= 5;
        const matchesStatus = (status === 'all') || ((p.status || '').toLowerCase() === status.toLowerCase());
        return matchesQ && matchesCat && matchesStock && matchesStatus;
      });

      renderProductsTable(filteredProducts, 1);
    }

    renderProductsTable(allProducts, 1);

    // Sync seller products from MockAPI to ensure newly registered or restored accounts see their products
    async function syncProductsFromMockAPI() {
      const user = getCurrentSeller();
      if (!user || !user.email) return;
      const userEmail = user.email.toLowerCase();

      try {
        const res = await fetch('https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/products');
        if (res.ok) {
          const remote = await res.json();
          if (Array.isArray(remote)) {
            let sellerProds = JSON.parse(localStorage.getItem(STORAGE_SELLER_PRODUCTS) || '[]');
            let catalogProds = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
            let changed = false;

            remote.forEach(rp => {
              if (rp && (rp.sellerEmail || '').toLowerCase() === userEmail) {
                const inSeller = sellerProds.some(lp => String(lp.id) === String(rp.id) || (lp.sku && rp.sku && lp.sku === rp.sku));
                if (!inSeller) {
                  sellerProds.unshift(rp);
                  changed = true;
                }
                const inCat = catalogProds.some(lp => String(lp.id) === String(rp.id));
                if (!inCat) {
                  catalogProds.unshift(rp);
                  changed = true;
                }
              }
            });

            if (changed) {
              safeStorageSet(STORAGE_SELLER_PRODUCTS, sellerProds);
              safeStorageSet('shopnow_products', catalogProds);
              allProducts = getSellerProducts();
              applyProductFilters();
            }
          }
        }
      } catch (e) {
        console.warn('[Products Sync Notice]:', e);
      }
    }
    syncProductsFromMockAPI();

    // Search and Dropdown filters
    $('#sellerProductSearch').on('input', applyProductFilters);
    $('#filterCategory, #filterStock, #filterStatus').on('change', applyProductFilters);

    // Delete Modal trigger
    let deleteTargetId = null;
    $(document).on('click', '.btn-delete-product', function () {
      deleteTargetId = $(this).data('id');
      const title = $(this).data('title');
      $('#deleteProductTitleText').text(title);
      new bootstrap.Modal(document.getElementById('deleteProductModal')).show();
    });

    $('#btnConfirmDeleteProduct').on('click', function () {
      if (deleteTargetId) {
        allProducts = allProducts.filter(p => p.id != deleteTargetId);
        safeStorageSet(STORAGE_SELLER_PRODUCTS, allProducts);
        let catalogProds = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
        catalogProds = catalogProds.filter(p => p.id != deleteTargetId);
        safeStorageSet('shopnow_products', catalogProds);

        // Non-blocking sync deletion with MockAPI
        try {
          fetch(`https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/products/${deleteTargetId}`, { method: 'DELETE' }).catch(() => {});
        } catch (e) {}

        applyProductFilters();
        bootstrap.Modal.getInstance(document.getElementById('deleteProductModal')).hide();
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Product deleted from catalogue.', 'info');
        }
      }
    });
  }

  // ===================================================
  // 3. PAGE: ADD / EDIT PRODUCT CONTROLLER
  // ===================================================
  if ($('#sellerAddProductForm').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');
    let products = JSON.parse(localStorage.getItem(STORAGE_SELLER_PRODUCTS) || '[]');
    let uploadedImageUrls = [];

    const defaultSampleImage = 'https://res.cloudinary.com/dpva4smxo/image/upload/v1791382196/Product_image_2_k3wqpn.png';

    function renderUploadedThumbs() {
      let html = '';
      uploadedImageUrls.forEach((url, idx) => {
        html += `
          <div class="uploaded-thumb-box">
            <img src="${url}" alt="Product Image ${idx + 1}" onerror="this.onerror=null; this.src='${defaultSampleImage}';" />
            <button type="button" class="uploaded-thumb-remove" data-index="${idx}" title="Remove image">&times;</button>
          </div>
        `;
      });
      if (uploadedImageUrls.length < 5) {
        html += `
          <div class="uploaded-thumb-box d-flex align-items-center justify-content-center bg-light text-muted cursor-pointer border-dashed" id="btnAddMoreImages" title="Add another photo">
            <i class="bi bi-plus-lg fs-4"></i>
          </div>
        `;
      }
      $('#uploadedThumbsGrid').html(html);
      $('#uploadedImagesCount').text(uploadedImageUrls.length);
    }

    if (editId) {
      const target = products.find(p => p.id == editId);
      if (target) {
        $('#pageHeaderAddProductTitle').text('Edit product');
        $('#prodCategorySelect').val(target.category);
        if (target.subCategory) $('#prodSubCategorySelect').val(target.subCategory);
        $('#prodTitleInput').val(target.title);
        if (target.description) $('#prodDescInput').val(target.description);
        $('#prodSkuInput').val(target.sku);
        $('#prodStockInput').val(target.stock);
        $('#prodPriceInput').val(target.price);
        if (target.discountPrice) $('#prodDiscountInput').val(target.discountPrice);
        if (target.status === 'Draft') {
          $('#statusDraft').prop('checked', true);
        } else {
          $('#statusActive').prop('checked', true);
        }
        if (Array.isArray(target.images) && target.images.length > 0) {
          uploadedImageUrls = [...target.images];
        } else if (target.image) {
          uploadedImageUrls = [target.image];
        }
        $('#btnSubmitProduct').text('Update product');
      }
    } else {
      // Default initial thumbnail preview
      uploadedImageUrls = [defaultSampleImage];
    }

    renderUploadedThumbs();

    // Trigger file picker only for the '+' thumb button (dropzone handles it natively via label)
    $(document).on('click', '#btnAddMoreImages', function (e) {
      e.preventDefault();
      const input = document.getElementById('productImageFileInput');
      if (input) input.click();
    });

    // Helper: Compress image to small canvas JPEG (approx 20-30KB) to prevent QuotaExceededError
    function compressImageFile(file, maxWidth = 600, maxHeight = 600, quality = 0.7) {
      return new Promise((resolve) => {
        if (!file || !file.type || !file.type.startsWith('image/')) {
          resolve(defaultSampleImage);
          return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = new Image();
          img.onload = function () {
            let width = img.width;
            let height = img.height;
            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            try {
              const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
              resolve(compressedDataUrl);
            } catch (canvasErr) {
              resolve(e.target.result || defaultSampleImage);
            }
          };
          img.onerror = function () {
            resolve(defaultSampleImage);
          };
          img.src = e.target.result;
        };
        reader.onerror = function () {
          resolve(defaultSampleImage);
        };
        reader.readAsDataURL(file);
      });
    }

    // Cloudinary Upload function (Uploads to Cloudinary cloud dpva4smxo)
    async function uploadToCloudinary(file) {
      $('#uploadStatusBox').removeClass('d-none');
      $('#uploadStatusText').text(`Uploading ${file.name} to Cloudinary...`);
      $('#uploadStatusPercent').text('45%');
      $('#uploadProgressBar').css('width', '45%');

      // 1. Attempt Cloudinary Unsigned Upload
      try {
        const formData = new FormData();
        formData.append('file', file);
        // Cloudinary unsigned upload REQUIRES upload_preset only (sending api_key without signature causes HTTP 400)
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset || 'ml_default');

        const res = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
          method: 'POST',
          body: formData
        });
        const data = await res.json().catch(() => null);

        if (res.ok && data && data.secure_url) {
          $('#uploadStatusPercent').text('100%');
          $('#uploadProgressBar').css('width', '100%');
          setTimeout(() => $('#uploadStatusBox').addClass('d-none'), 800);
          return data.secure_url;
        } else {
          const errDetail = (data && data.error && data.error.message) ? data.error.message : `${res.status} ${res.statusText}`;
          console.warn('[Cloudinary Notice]:', errDetail);
          if (typeof ShopNowCommon !== 'undefined') {
            ShopNowCommon.showToast(`Cloudinary notice: ${errDetail}. Using compressed local preview.`, 'info');
          }
        }
      } catch (err) {
        console.warn('Direct Cloudinary endpoint notice:', err);
      }

      // 2. Safe Fallback: Compress locally to ~25KB to guarantee no QuotaExceededError in localStorage
      const fallbackCompressedUrl = await compressImageFile(file, 600, 600, 0.7);
      $('#uploadStatusPercent').text('100%');
      $('#uploadProgressBar').css('width', '100%');
      setTimeout(() => $('#uploadStatusBox').addClass('d-none'), 800);
      return fallbackCompressedUrl;
    }

    // Handle File Input Change
    $('#productImageFileInput').on('change', async function () {
      const files = this.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        if (uploadedImageUrls.length >= 5) {
          if (typeof ShopNowCommon !== 'undefined') {
            ShopNowCommon.showToast('Maximum 5 images allowed per product.', 'warning');
          }
          break;
        }
        const uploadedUrl = await uploadToCloudinary(files[i]);
        if (uploadedUrl) {
          uploadedImageUrls.push(uploadedUrl);
          renderUploadedThumbs();
          if (typeof ShopNowCommon !== 'undefined') {
            ShopNowCommon.showToast('Image uploaded and synced with Cloudinary CDN!', 'success');
          }
        }
      }
      $(this).val('');
    });

    // Handle Direct Image URL Input
    $('#btnApplyImageUrl').on('click', function () {
      const url = $('#productImageUrlInput').val().trim();
      if (!url) return;
      if (uploadedImageUrls.length >= 5) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Maximum 5 images allowed per product.', 'warning');
        }
        return;
      }
      uploadedImageUrls.push(url);
      renderUploadedThumbs();
      $('#productImageUrlInput').val('');
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Image link added successfully!', 'success');
      }
    });

    // Remove Image from preview
    $(document).on('click', '.uploaded-thumb-remove', function (e) {
      e.stopPropagation();
      const idx = $(this).data('index');
      uploadedImageUrls.splice(idx, 1);
      renderUploadedThumbs();
    });

    // Drag and Drop
    const dropzone = document.getElementById('productDropzone');
    if (dropzone) {
      ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, (e) => { e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover'); }, false);
      });
      ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, (e) => { e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover'); }, false);
      });
      dropzone.addEventListener('drop', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
        const dt = e.dataTransfer;
        const files = dt ? dt.files : null;
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            if (uploadedImageUrls.length >= 5) break;
            const url = await uploadToCloudinary(files[i]);
            if (url) {
              uploadedImageUrls.push(url);
              renderUploadedThumbs();
            }
          }
        }
      }, false);
    }

    // Submit handler: Save to MockAPI and LocalStorage
    $('#sellerAddProductForm').on('submit', async function (e) {
      e.preventDefault();
      const title = $('#prodTitleInput').val().trim();
      const category = $('#prodCategorySelect').val();
      const subCategory = $('#prodSubCategorySelect').val() || 'Tableware';
      const description = $('#prodDescInput').val().trim();
      const sku = $('#prodSkuInput').val().trim() || 'MH-GEN-' + Math.floor(100 + Math.random() * 900);
      const stock = parseInt($('#prodStockInput').val(), 10) || 1;
      const price = parseFloat($('#prodPriceInput').val()) || 999;
      const discount = parseFloat($('#prodDiscountInput').val()) || null;
      const status = $('input[name="prodStatusRadio"]:checked').val() || 'Active';

      const user = getCurrentSeller();
      if (!user || !user.email) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Please sign in to your seller account to add products.', 'warning');
        }
        window.location.href = '../../common/html/login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
      }

      const sellerEmail = user.email.toLowerCase();
      const sellerName = user.storeName || (user.name ? `${user.name}'s Store` : 'TechWorld Store');

      const primaryImg = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : defaultSampleImage;

      if (editId) {
        const item = products.find(p => p.id == editId);
        if (item) {
          item.title = title;
          item.category = category;
          item.subCategory = subCategory;
          item.description = description;
          item.sku = sku;
          item.stock = stock;
          item.price = price;
          item.discountPrice = discount;
          item.status = status;
          if (uploadedImageUrls.length > 0) {
            item.image = primaryImg;
            item.images = uploadedImageUrls;
          }
        }

        // Keep published catalog updated on edit
        let catalog = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
        const catIdx = catalog.findIndex(c => c.id == editId);
        if (catIdx !== -1) {
          catalog[catIdx] = {
            ...catalog[catIdx],
            title: title,
            category: category,
            price: price,
            image: primaryImg
          };
          safeStorageSet('shopnow_products', catalog);
        }
      } else {
        const newProd = {
          id: Date.now(),
          sku: sku,
          title: title,
          category: category,
          subCategory: subCategory,
          description: description,
          price: price,
          discountPrice: discount,
          stock: stock,
          status: status,
          sellerEmail: sellerEmail,
          sellerName: sellerName,
          image: primaryImg,
          images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [primaryImg],
          rating: 5.0,
          reviews: 0,
          createdAt: new Date().toISOString()
        };
        products.unshift(newProd);

        // Publish to catalog safely
        let catalog = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
        catalog.unshift({
          id: newProd.id,
          brand: sellerName,
          title: newProd.title,
          category: newProd.category,
          price: newProd.price,
          rating: 5.0,
          reviews: 0,
          image: newProd.image,
          sellerEmail: sellerEmail
        });
        safeStorageSet('shopnow_products', catalog);

        // Sync with MockAPI products in background (non-blocking)
        fetch('https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProd)
        }).catch(function (err) {
          console.warn('MockAPI product push notice:', err);
        });
      }

      safeStorageSet(STORAGE_SELLER_PRODUCTS, products);

      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Product "${title}" saved successfully!`, 'success');
      }

      setTimeout(function () {
        window.location.href = 'products.html';
      }, 150);
    });
  }

  // ===================================================
  // 4. PAGE: INVENTORY CONTROLLER
  // ===================================================
  if ($('#inventoryTableBody').length) {
    let prods = getSellerProducts();
    let currentInventoryPage = 1;
    const inventoryPageSize = 5;
    let activeInventoryTab = 'all';
    let filteredInventory = prods;

    function updateInventoryKpi(items) {
      const lowCount = items.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length;
      const inCount = items.filter(p => Number(p.stock) > 5).length;
      const outCount = items.filter(p => Number(p.stock) <= 0).length;

      $('#kpiInventoryLowStock').text(lowCount);
      $('#kpiInventoryInStock').text(inCount);
      $('#kpiInventoryOutOfStock').text(outCount);
    }

    function renderInventoryTable(items, page) {
      if (items !== undefined) filteredInventory = items;
      if (page !== undefined) currentInventoryPage = page;

      const pInfo = ShopNowCommon.paginate(filteredInventory, currentInventoryPage, inventoryPageSize);
      currentInventoryPage = pInfo.currentPage;

      let html = '';
      if (pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="6" class="text-center py-4 text-muted">No inventory records found matching criteria.</td></tr>';
      } else {
        pInfo.pageItems.forEach(p => {
          const isLow = Number(p.stock) <= 5 && Number(p.stock) > 0;
          const isOut = Number(p.stock) <= 0;
          const statusLabel = isOut ? 'Out of stock' : (isLow ? 'Low stock' : 'In stock');
          const statusClass = isOut ? 'cancelled' : (isLow ? 'low-stock' : 'in-stock');

          html += `
            <tr>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="cart-item-thumb-box" style="width: 44px; height: 44px;">
                    <img src="${p.image || defaultSampleImage}" alt="${p.title}" />
                  </div>
                  <div>
                    <strong class="text-dark d-block">${p.title}</strong>
                    <span class="extra-small text-muted">${p.category}</span>
                  </div>
                </div>
              </td>
              <td><code class="text-secondary small">${p.sku}</code></td>
              <td><strong>₹ ${Number(p.price).toLocaleString('en-IN')}</strong></td>
              <td><span class="fw-bold fs-6 ${isLow || isOut ? 'text-danger' : 'text-dark'}">${p.stock} units</span></td>
              <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
              <td>
                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-sm btn-outline-seller py-1 px-2 btn-open-stock-modal" data-id="${p.id}" data-title="${p.title}" data-sku="${p.sku}" data-stock="${p.stock}">
                    Update stock
                  </button>
                  <button type="button" class="btn btn-sm btn-light py-1 px-2" title="Stock alert"><i class="bi bi-bell"></i></button>
                </div>
              </td>
            </tr>
          `;
        });
      }
      $('#inventoryTableBody').html(html);

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#sellerInventoryPaginationWrapper',
        infoSelector: '#sellerInventoryPaginationInfo',
        listSelector: '#sellerInventoryPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'records',
        onPageChange: function (newPage) {
          renderInventoryTable(filteredInventory, newPage);
        }
      });
    }

    function applyInventoryFilters() {
      const q = ($('#sellerInventorySearch').val() || '').toLowerCase().trim();
      const sortVal = $('#sellerInventorySort').val() || 'default';

      let list = prods.filter(p => {
        let matchesTab = true;
        if (activeInventoryTab === 'low') matchesTab = Number(p.stock) <= 5 && Number(p.stock) > 0;
        else if (activeInventoryTab === 'in') matchesTab = Number(p.stock) > 5;
        else if (activeInventoryTab === 'out') matchesTab = Number(p.stock) <= 0;

        const matchesQ = !q || (p.title || '').toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
        return matchesTab && matchesQ;
      });

      if (sortVal === 'stock-asc') {
        list.sort((a, b) => Number(a.stock) - Number(b.stock));
      } else if (sortVal === 'stock-desc') {
        list.sort((a, b) => Number(b.stock) - Number(a.stock));
      } else if (sortVal === 'title-asc') {
        list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }

      renderInventoryTable(list, 1);
    }

    updateInventoryKpi(prods);
    renderInventoryTable(prods, 1);

    // Modal Stock Update
    let currentStockProdId = null;
    $(document).on('click', '.btn-open-stock-modal', function () {
      currentStockProdId = $(this).data('id');
      const title = $(this).data('title');
      const sku = $(this).data('sku');
      const stock = $(this).data('stock');

      $('#modalStockProdTitle').text(title);
      $('#modalStockProdSku').text(`SKU: ${sku}`);
      $('#modalCurrentStockQty').val(stock);
      new bootstrap.Modal(document.getElementById('updateStockModal')).show();
    });

    $('#btnSaveModalStock').on('click', function () {
      const newStock = parseInt($('#modalCurrentStockQty').val(), 10);
      if (!isNaN(newStock) && currentStockProdId) {
        const item = prods.find(p => p.id == currentStockProdId);
        if (item) {
          item.stock = newStock;
          safeStorageSet(STORAGE_SELLER_PRODUCTS, prods);

          // Sync with main catalog products if present
          const catalogProds = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
          const cIdx = catalogProds.findIndex(p => p && (p.id == item.id || p.sku == item.sku));
          if (cIdx !== -1) {
            catalogProds[cIdx].stock = newStock;
            safeStorageSet('shopnow_products', catalogProds);
          }

          updateInventoryKpi(prods);
          applyInventoryFilters();
          bootstrap.Modal.getInstance(document.getElementById('updateStockModal')).hide();
          if (typeof ShopNowCommon !== 'undefined') {
            ShopNowCommon.showToast(`Stock updated to ${newStock} units for ${item.title}.`, 'success');
          }
        }
      }
    });

    // Inventory tabs filter
    $('#inventoryFilterTabs button').on('click', function () {
      $('#inventoryFilterTabs button').removeClass('active');
      $(this).addClass('active');
      activeInventoryTab = $(this).data('filter') || 'all';
      applyInventoryFilters();
    });

    // Inventory search and sort
    $('#sellerInventorySearch').on('input', applyInventoryFilters);
    $('#sellerInventorySort').on('change', applyInventoryFilters);
  }

  // ===================================================
  // 5. PAGE: ORDERS LIST & DETAILS CONTROLLER
  // ===================================================
  if ($('#sellerOrdersTableBody').length) {
    const orders = getSellerOrders();
    let currentOrderPage = 1;
    const orderPageSize = 5;
    let filteredOrders = orders;

    function updateOrdersKpi(items) {
      const allCount = items.length;
      const procCount = items.filter(o => (o.status || '').toLowerCase() === 'processing').length;
      const shipCount = items.filter(o => (o.status || '').toLowerCase() === 'shipped').length;
      const delivCount = items.filter(o => (o.status || '').toLowerCase() === 'delivered').length;

      $('#kpiAllOrdersCount').text(allCount);
      $('#kpiProcessingCount').text(procCount);
      $('#kpiShippedCount').text(shipCount);
      $('#kpiDeliveredCount').text(delivCount);
    }

    updateOrdersKpi(orders);

    function renderOrdersTable(items, page) {
      if (items !== undefined) filteredOrders = items;
      if (page !== undefined) currentOrderPage = page;

      const pInfo = ShopNowCommon.paginate(filteredOrders, currentOrderPage, orderPageSize);
      currentOrderPage = pInfo.currentPage;

      let html = '';
      if (pInfo.pageItems.length === 0) {
        html = '<tr><td colspan="8" class="text-center py-4 text-muted">No orders found matching criteria.</td></tr>';
      } else {
        pInfo.pageItems.forEach(o => {
          html += `
            <tr>
              <td><strong class="text-dark">#${o.id || o.orderId}</strong></td>
              <td><span class="text-muted small">${o.date}</span></td>
              <td>
                <div class="fw-bold text-dark">${o.customer || o.buyerName || 'Customer'}</div>
                <div class="extra-small text-muted">${o.city || 'Standard Delivery'}</div>
              </td>
              <td>${o.itemTitle || (o.items && o.items[0] ? o.items[0].title : 'Order Items')}</td>
              <td><strong class="text-dark">₹ ${Number(o.total).toLocaleString('en-IN')}</strong></td>
              <td><span class="badge bg-secondary-subtle text-secondary">${o.paymentMethod || 'Prepaid'}</span></td>
              <td><span class="status-badge ${o.statusClass || (o.status ? o.status.toLowerCase() : 'processing')}">${o.status || 'Processing'}</span></td>
              <td>
                <a href="order-details.html?id=${o.id || o.orderId}" class="btn btn-sm btn-outline-seller py-1 px-3">View</a>
              </td>
            </tr>
          `;
        });
      }
      $('#sellerOrdersTableBody').html(html);

      ShopNowCommon.renderPaginationUI({
        wrapperSelector: '#sellerOrdersPaginationWrapper',
        infoSelector: '#sellerOrdersPaginationInfo',
        listSelector: '#sellerOrdersPaginationList',
        currentPage: pInfo.currentPage,
        totalPages: pInfo.totalPages,
        totalItems: pInfo.totalItems,
        startIndex: pInfo.startIndex,
        endIndex: pInfo.endIndex,
        itemLabel: 'orders',
        onPageChange: function (newPage) {
          renderOrdersTable(filteredOrders, newPage);
        }
      });
    }

    renderOrdersTable(orders, 1);

    // Orders Filter Buttons
    let currentOrderFilter = 'all';
    $('#sellerOrdersFilterGroup button').on('click', function () {
      $('#sellerOrdersFilterGroup button').removeClass('btn-dark').addClass('btn-outline-secondary');
      $(this).removeClass('btn-outline-secondary').addClass('btn-dark');

      currentOrderFilter = $(this).data('filter');
      applyOrdersFilter();
    });

    // Orders Search Filter
    $('#sellerOrdersSearchInput').on('input', function () {
      applyOrdersFilter();
    });

    function applyOrdersFilter() {
      const q = ($('#sellerOrdersSearchInput').val() || '').toLowerCase().trim();
      let filtered = orders;

      if (currentOrderFilter !== 'all') {
        filtered = filtered.filter(o => (o.status || '').toLowerCase() === currentOrderFilter.toLowerCase());
      }
      if (q) {
        filtered = filtered.filter(o =>
          (o.id && o.id.toLowerCase().includes(q)) ||
          (o.orderId && o.orderId.toLowerCase().includes(q)) ||
          (o.customer && o.customer.toLowerCase().includes(q)) ||
          (o.itemTitle && o.itemTitle.toLowerCase().includes(q))
        );
      }
      renderOrdersTable(filtered, 1);
    }
  }

  // Order Details Page
  if ($('#sellerOrderDetailsWrapper').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const ordId = urlParams.get('id') || 'SN-10452';
    const orders = getSellerOrders();
    const order = orders.find(o => o.id == ordId || o.orderId == ordId) || orders[0];

    if (order) {
      $('#detailOrderIdBadge').text(`#${order.orderId || order.id}`);
      $('#detailOrderCustomerName').text(order.customer);
      $('#detailOrderCustomerEmail').text(order.email || 'customer@example.com');
      $('#detailOrderCustomerPhone').text(order.phone || '+91 98201 45892');
      $('#detailOrderAddress').text(order.address);
      $('#detailOrderTotal').text(`Rs ${Number(order.total).toLocaleString('en-IN')}`);
      $('#detailOrderStatusSelect').val(order.status);

      // Save Status button
      $('#btnUpdateOrderStatus').on('click', function () {
        const newStatus = $('#detailOrderStatusSelect').val();
        order.status = newStatus;
        order.statusClass = newStatus.toLowerCase();
        localStorage.setItem(STORAGE_SELLER_ORDERS, JSON.stringify(orders));

        if (typeof ShopNowAPI !== 'undefined') {
          ShopNowAPI.updateOrder(order.id || order.orderId, { status: newStatus, statusClass: newStatus.toLowerCase() });
        }

        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast(`Order #${order.orderId || order.id} status updated to ${newStatus}.`, 'success');
        }
      });
    }
  }

  // ===================================================
  // 6. PAGE: SHIPPING & LOGISTICS CONTROLLER
  // ===================================================
  if ($('#shippingTableBody').length) {
    const orders = getSellerOrders();

    function updateShippingCounts(items) {
      const allCount = items.length;
      const readyCount = items.filter(o => (o.status || '').toLowerCase() === 'processing').length;
      const transitCount = items.filter(o => (o.status || '').toLowerCase() === 'shipped').length;
      const delivCount = items.filter(o => (o.status || '').toLowerCase() === 'delivered').length;

      $('#shippingCountAll').text(allCount);
      $('#shippingCountReady').text(readyCount);
      $('#shippingCountTransit').text(transitCount);
      $('#shippingCountDelivered').text(delivCount);
    }

    updateShippingCounts(orders);

    function renderShippingTable(items) {
      let html = '';
      if (items.length === 0) {
        html = '<tr><td colspan="8" class="text-center py-4 text-muted">No shipments found for this filter.</td></tr>';
      } else {
        items.forEach(ord => {
          let shipStatus = 'Ready to ship';
          let shipStatusClass = 'processing';
          const st = (ord.status || '').toLowerCase();
          if (st === 'shipped') {
            shipStatus = 'In transit';
            shipStatusClass = 'shipped';
          } else if (st === 'delivered') {
            shipStatus = 'Delivered';
            shipStatusClass = 'delivered';
          }

          html += `
            <tr>
              <td><input type="checkbox" class="form-check-input shipping-row-check" value="${ord.id}" /></td>
              <td><strong class="text-dark">${ord.orderId || ('#' + ord.id)}</strong></td>
              <td>
                <div class="fw-bold text-dark">${ord.customer}</div>
                <div class="extra-small text-muted">${ord.city}</div>
              </td>
              <td><span class="small text-secondary text-truncate d-inline-block" style="max-width: 220px;" title="${ord.address}">${ord.address}</span></td>
              <td><span class="badge bg-light text-dark border"><i class="bi bi-box-seam me-1 text-coral"></i>${ord.courier || 'Blue Dart'}</span></td>
              <td><code class="text-secondary small fw-bold">${ord.trackingId || 'TRK-' + (ord.id || ord.orderId)}</code></td>
              <td><span class="status-badge ${shipStatusClass}">${shipStatus}</span></td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <a href="tracking.html?id=${ord.id}" class="btn btn-sm btn-outline-seller py-1 px-2" title="Live tracking">
                    <i class="bi bi-geo-alt"></i> Track
                  </a>
                  <button type="button" class="btn btn-sm btn-light py-1 px-2 btn-print-label" title="Print label" data-order="${ord.orderId || ord.id}">
                    <i class="bi bi-printer"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        });
      }
      $('#shippingTableBody').html(html);
    }

    renderShippingTable(orders);

    function filterShippingRows() {
      const q = ($('#shippingSearchInput').val() || '').toLowerCase().trim();
      const courier = $('#shippingCourierFilter').val();
      const activeFilter = $('#shippingFilterTabs button.active').data('filter') || 'all';

      let filtered = orders.filter(ord => {
        const ordId = (ord.orderId || ord.id || '').toLowerCase();
        const cust = (ord.customer || '').toLowerCase();
        const trk = (ord.trackingId || '').toLowerCase();

        const matchesQ = !q || ordId.includes(q) || cust.includes(q) || trk.includes(q);
        const matchesCourier = courier === 'all' || ord.courier === courier;
        let matchesTab = true;
        const st = (ord.status || '').toLowerCase();
        if (activeFilter === 'ready') matchesTab = (st === 'processing');
        else if (activeFilter === 'transit') matchesTab = (st === 'shipped');
        else if (activeFilter === 'delivered') matchesTab = (st === 'delivered');

        return matchesQ && matchesCourier && matchesTab;
      });
      renderShippingTable(filtered);
    }

    $('#shippingSearchInput').on('input', filterShippingRows);
    $('#shippingCourierFilter').on('change', filterShippingRows);

    $('#shippingFilterTabs button').on('click', function () {
      $('#shippingFilterTabs button').removeClass('active bg-secondary-subtle text-dark').addClass('text-secondary');
      $(this).addClass('active bg-secondary-subtle text-dark').removeClass('text-secondary');
      filterShippingRows();
    });

    $('#selectAllShipping').on('change', function () {
      $('.shipping-row-check').prop('checked', $(this).is(':checked'));
    });

    $('#btnMarkSelectedPacked').on('click', function () {
      const $checked = $('.shipping-row-check:checked');
      if ($checked.length === 0) {
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Please select at least one shipment to mark as packed.', 'warning');
        }
        return;
      }
      const checkedIds = new Set();
      $checked.each(function () {
        checkedIds.add(String($(this).val()));
      });
      orders.forEach(o => {
        if (checkedIds.has(String(o.id)) || checkedIds.has(String(o.orderId))) {
          o.status = 'Shipped';
          o.statusClass = 'shipped';
        }
      });
      safeStorageSet(STORAGE_SELLER_ORDERS, orders);
      updateShippingCounts(orders);
      filterShippingRows();
      $('#selectAllShipping').prop('checked', false);
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`${checkedIds.size} shipment(s) marked as packed & in transit!`, 'success');
      }
    });

    $('#btnDownloadLabels').on('click', function () {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Preparing Airway Bills PDF for download...', 'info');
      }
    });

    $(document).on('click', '.btn-print-label', function () {
      const ord = $(this).data('order');
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Printing shipping label & barcode for ${ord}...`, 'info');
      }
    });
  }

  // ===================================================
  // 7. PAGE: REVIEWS CONTROLLER (Product-Based with User Separation)
  // ===================================================
  if ($('#sellerReviewsList').length) {
    const currentSeller = getCurrentSeller();
    const myProducts = getSellerProducts();
    const sellerStoreName = (currentSeller && (currentSeller.storeName || currentSeller.name)) ? (currentSeller.storeName || currentSeller.name) : 'Your Store';
    $('#revMerchantPerkStore').text(sellerStoreName);

    let sellerReviews = getSellerReviews();
    let storedReviews = JSON.parse(localStorage.getItem(STORAGE_SELLER_REVIEWS) || '[]');

    function updateReviewsStats(items) {
      const count = items.length;
      if (count === 0) {
        $('#revStatStoreAvg, #revBreakdownAvg').text('0.0');
        $('#revStatTotalReviews').text('0');
        $('#revStatFiveStarRatio').text('0%');
        $('#revStatNewThisWeek').text('0');
        $('#revBreakdownSub').text('No customer reviews for your catalogue yet');
        $('#sellerReviewsCountSub').text('0 reviews');
        $('#revBreakdownBars').html('<p class="text-muted extra-small">No rating data available yet.</p>');
        return;
      }

      const totalRating = items.reduce((sum, r) => sum + r.rating, 0);
      const avg = (totalRating / count).toFixed(1);
      const fiveCount = items.filter(r => r.rating === 5).length;
      const fourCount = items.filter(r => r.rating === 4).length;
      const threeCount = items.filter(r => r.rating === 3).length;
      const twoCount = items.filter(r => r.rating === 2).length;
      const oneCount = items.filter(r => r.rating === 1).length;

      const fiveRatio = Math.round((fiveCount / count) * 100);
      const fourRatio = Math.round((fourCount / count) * 100);
      const threeRatio = Math.round((threeCount / count) * 100);
      const twoRatio = Math.round((twoCount / count) * 100);
      const oneRatio = Math.round((oneCount / count) * 100);

      $('#revStatStoreAvg, #revBreakdownAvg').text(avg);
      $('#revStatTotalReviews').text(count.toLocaleString());
      $('#revStatFiveStarRatio').text(`${fiveRatio}%`);
      $('#revStatNewThisWeek').text(Math.max(1, Math.round(count * 0.25)));
      $('#revBreakdownSub').text(`Based on ${count} verified customer ratings for your items`);
      $('#sellerReviewsCountSub').text(`Showing ${count} verified customer purchases for your catalogue`);

      // Star breakdown bars
      let barsHtml = `
        <div class="d-flex align-items-center gap-2 mb-2 extra-small">
          <span class="text-muted" style="width: 45px;">5 stars</span>
          <div class="progress flex-grow-1" style="height: 8px;">
            <div class="progress-bar bg-warning" style="width: ${fiveRatio}%;"></div>
          </div>
          <span class="fw-bold text-dark" style="width: 35px; text-align: right;">${fiveRatio}%</span>
        </div>
        <div class="d-flex align-items-center gap-2 mb-2 extra-small">
          <span class="text-muted" style="width: 45px;">4 stars</span>
          <div class="progress flex-grow-1" style="height: 8px;">
            <div class="progress-bar bg-warning" style="width: ${fourRatio}%;"></div>
          </div>
          <span class="fw-bold text-dark" style="width: 35px; text-align: right;">${fourRatio}%</span>
        </div>
        <div class="d-flex align-items-center gap-2 mb-2 extra-small">
          <span class="text-muted" style="width: 45px;">3 stars</span>
          <div class="progress flex-grow-1" style="height: 8px;">
            <div class="progress-bar bg-warning" style="width: ${threeRatio}%;"></div>
          </div>
          <span class="fw-bold text-dark" style="width: 35px; text-align: right;">${threeRatio}%</span>
        </div>
        <div class="d-flex align-items-center gap-2 mb-2 extra-small">
          <span class="text-muted" style="width: 45px;">2 stars</span>
          <div class="progress flex-grow-1" style="height: 8px;">
            <div class="progress-bar bg-secondary" style="width: ${twoRatio}%;"></div>
          </div>
          <span class="fw-bold text-dark" style="width: 35px; text-align: right;">${twoRatio}%</span>
        </div>
        <div class="d-flex align-items-center gap-2 mb-0 extra-small">
          <span class="text-muted" style="width: 45px;">1 star</span>
          <div class="progress flex-grow-1" style="height: 8px;">
            <div class="progress-bar bg-danger" style="width: ${oneRatio}%;"></div>
          </div>
          <span class="fw-bold text-dark" style="width: 35px; text-align: right;">${oneRatio}%</span>
        </div>
      `;
      $('#revBreakdownBars').html(barsHtml);
    }

    updateReviewsStats(sellerReviews);

    function renderReviewsList(items) {
      if (items.length === 0) {
        $('#sellerReviewsList').html(`
          <div class="text-center py-5 text-muted">
            <i class="bi bi-chat-square-heart fs-1 text-secondary mb-2 d-block"></i>
            <p class="mb-2">No reviews found matching this filter for your catalogue items.</p>
            <a href="add-product.html" class="btn btn-coral-seller btn-sm"><i class="bi bi-plus-lg"></i> Add more products</a>
          </div>
        `);
        return;
      }

      let html = '';
      items.forEach((rev, idx) => {
        let starsHtml = '';
        for (let s = 1; s <= 5; s++) {
          if (s <= rev.rating) {
            starsHtml += '<i class="bi bi-star-fill text-warning me-1"></i>';
          } else {
            starsHtml += '<i class="bi bi-star text-muted me-1"></i>';
          }
        }

        const replyHtml = rev.reply ? `
          <div class="mt-2 p-2 rounded bg-light border-start border-3 border-coral extra-small">
            <strong class="text-coral"><i class="bi bi-patch-check-fill me-1"></i>Merchant Response (${sellerStoreName}):</strong>
            <p class="mb-0 text-dark mt-1">${rev.reply}</p>
          </div>
        ` : '';

        html += `
          <div class="py-3 ${idx < items.length - 1 ? 'border-bottom' : ''}">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2">
                <div class="seller-avatar-initials ${rev.avatarBg || 'bg-primary-subtle text-primary'}" style="width: 34px; height: 34px; font-size: 0.75rem;">
                  ${rev.avatarInitials || (rev.customer ? rev.customer.substring(0, 2).toUpperCase() : 'CU')}
                </div>
                <div>
                  <strong class="text-dark small d-block">${rev.customer}</strong>
                  <span class="extra-small text-muted">${rev.location} &bull; Verified purchase &bull; ${rev.date || 'Recent'}</span>
                </div>
              </div>
              <div class="small">${starsHtml}</div>
            </div>
            <p class="small text-dark mb-2">&ldquo;${rev.comment}&rdquo;</p>
            <div class="d-flex align-items-center justify-content-between">
              <span class="badge bg-light text-secondary border">Item: ${rev.productTitle}</span>
              ${!rev.reply ? `
                <button type="button" class="btn btn-sm btn-link text-coral text-decoration-none p-0 extra-small fw-bold btn-reply-review" data-id="${rev.id}" data-customer="${rev.customer}">
                  <i class="bi bi-reply-fill"></i> Reply as seller
                </button>
              ` : `
                <span class="extra-small text-success fw-bold"><i class="bi bi-check2-circle me-1"></i>Replied</span>
              `}
            </div>
            ${replyHtml}
          </div>
        `;
      });
      $('#sellerReviewsList').html(html);
    }

    renderReviewsList(sellerReviews);

    // Filter by Stars
    $('#filterReviewStars').on('change', function () {
      const val = $(this).val();
      let filtered = sellerReviews;
      if (val === '5') {
        filtered = sellerReviews.filter(r => r.rating === 5);
      } else if (val === '4') {
        filtered = sellerReviews.filter(r => r.rating === 4);
      } else if (val === 'critical') {
        filtered = sellerReviews.filter(r => r.rating <= 3);
      }
      renderReviewsList(filtered);
    });

    // Reply Modal
    let activeReplyReviewId = null;
    $(document).on('click', '.btn-reply-review', function () {
      activeReplyReviewId = $(this).data('id');
      const customer = $(this).data('customer');
      $('#replyReviewModal .modal-title').text(`Reply to ${customer}`);
      $('#sellerReplyInput').val('');
      new bootstrap.Modal(document.getElementById('replyReviewModal')).show();
    });

    $('#btnSubmitReviewReply').on('click', function () {
      const text = $('#sellerReplyInput').val().trim();
      if (text && activeReplyReviewId) {
        const target = storedReviews.find(r => r.id === activeReplyReviewId);
        if (target) {
          target.reply = text;
          localStorage.setItem(STORAGE_SELLER_REVIEWS, JSON.stringify(storedReviews));
        }
        const currentInSeller = sellerReviews.find(r => r.id === activeReplyReviewId);
        if (currentInSeller) {
          currentInSeller.reply = text;
        }
        renderReviewsList(sellerReviews);
        bootstrap.Modal.getInstance(document.getElementById('replyReviewModal')).hide();
        if (typeof ShopNowCommon !== 'undefined') {
          ShopNowCommon.showToast('Your merchant response has been published.', 'success');
        }
      }
    });
  }

  // ===================================================
  // 8. PAGE: RETURNS CONTROLLER
  // ===================================================
  // Returns list page
  if ($('#returnsTableBody').length) {
    const returnsList = getSellerReturns();

    function updateReturnsCounts(items) {
      const allCount = items.length;
      const reqCount = items.filter(r => (r.status || '').toLowerCase() === 'requested').length;
      const appCount = items.filter(r => (r.status || '').toLowerCase() === 'approved').length;
      const refCount = items.filter(r => (r.status || '').toLowerCase() === 'refunded').length;

      $('#returnsCountAll').text(allCount);
      $('#returnsCountRequested').text(reqCount);
      $('#returnsCountApproved').text(appCount);
      $('#returnsCountRefunded').text(refCount);
    }

    updateReturnsCounts(returnsList);

    function renderReturnsTable(items) {
      let html = '';
      if (items.length === 0) {
        html = '<tr><td colspan="8" class="text-center py-4 text-muted">No returns recorded for your store items.</td></tr>';
      } else {
        items.forEach(ret => {
          let refClass = ret.refundStatus === 'Processed' ? 'delivered' : 'processing';
          html += `
            <tr>
              <td><strong class="text-dark">${ret.id}</strong></td>
              <td><span class="text-secondary small">${ret.orderId}</span></td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="cart-item-thumb-box" style="width: 38px; height: 38px;">
                    <img src="${ret.productThumb || defaultSampleImage}" alt="${ret.productTitle}" />
                  </div>
                  <div>
                    <strong class="text-dark small d-block">${ret.productTitle}</strong>
                    <span class="extra-small text-muted">${ret.sku}</span>
                  </div>
                </div>
              </td>
              <td><span class="small text-danger fw-semibold">${ret.reason}</span></td>
              <td><span class="small text-muted">${ret.date}</span></td>
              <td><span class="status-badge ${ret.statusClass}">${ret.status}</span></td>
              <td><span class="status-badge ${refClass}">${ret.refundStatus}</span></td>
              <td>
                <a href="return-details.html?id=${ret.id}" class="btn btn-sm btn-outline-seller py-1 px-3">View</a>
              </td>
            </tr>
          `;
        });
      }
      $('#returnsTableBody').html(html);
    }

    renderReturnsTable(returnsList);

    function filterReturnsRows() {
      const q = ($('#returnsSearchInput').val() || '').toLowerCase();
      const reason = $('#returnsReasonFilter').val();
      const tab = $('#returnsFilterTabs .nav-link.active').data('filter');

      let filtered = returnsList.filter(ret => {
        const matchesQ = ret.id.toLowerCase().includes(q) ||
          ret.orderId.toLowerCase().includes(q) ||
          ret.productTitle.toLowerCase().includes(q);
        const matchesReason = reason === 'all' || ret.reason.toLowerCase().includes(reason.toLowerCase());
        let matchesTab = true;
        if (tab && tab !== 'all') {
          matchesTab = ret.status.toLowerCase() === tab.toLowerCase();
        }
        return matchesQ && matchesReason && matchesTab;
      });
      renderReturnsTable(filtered);
    }

    $('#returnsSearchInput').on('input', filterReturnsRows);
    $('#returnsReasonFilter').on('change', filterReturnsRows);

    $('#returnsFilterTabs button').on('click', function () {
      $('#returnsFilterTabs button').removeClass('active bg-secondary-subtle text-dark').addClass('text-secondary');
      $(this).addClass('active bg-secondary-subtle text-dark').removeClass('text-secondary');
      filterReturnsRows();
    });
  }

  // Return Details Page
  if ($('#returnTitleHeading').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const retId = urlParams.get('id') || 'RET-2041';
    const returnsList = JSON.parse(localStorage.getItem(STORAGE_SELLER_RETURNS) || '[]');
    const currentRet = returnsList.find(r => r.id === retId) || returnsList[0];

    if (currentRet) {
      $('#returnTitleHeading').text(`Return ${currentRet.id}`);
      $('#breadcrumbReturnId').text(currentRet.id);
      $('#returnStatusPill').text(currentRet.status).attr('class', `status-badge ${currentRet.statusClass}`);
    }

    $('#btnApproveReturnAction').on('click', function () {
      if (currentRet) {
        currentRet.status = 'Approved';
        currentRet.statusClass = 'shipped';
        localStorage.setItem(STORAGE_SELLER_RETURNS, JSON.stringify(returnsList));
        $('#returnStatusPill').text('Approved').attr('class', 'status-badge shipped');
        $('#stepSellerApproved').removeClass('active').addClass('done').find('.tracking-node').html('<i class="bi bi-check2"></i>');

        if (typeof ShopNowAPI !== 'undefined') {
          ShopNowAPI.updateReturn(currentRet.id, { status: 'Approved', statusClass: 'shipped' });
        }
      }
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Return ${currentRet ? currentRet.id : 'RET-2041'} approved! Courier pickup scheduled.`, 'success');
      }
      $(this).prop('disabled', true).html('<i class="bi bi-check2"></i> Approved');
    });

    $('#btnConfirmRejectReturn').on('click', function () {
      if (currentRet) {
        currentRet.status = 'Rejected';
        currentRet.statusClass = 'cancelled';
        localStorage.setItem(STORAGE_SELLER_RETURNS, JSON.stringify(returnsList));
        $('#returnStatusPill').text('Rejected').attr('class', 'status-badge cancelled');

        if (typeof ShopNowAPI !== 'undefined') {
          ShopNowAPI.updateReturn(currentRet.id, { status: 'Rejected', statusClass: 'cancelled' });
        }
      }
      bootstrap.Modal.getInstance(document.getElementById('rejectReturnModal')).hide();
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast(`Return ${currentRet ? currentRet.id : 'RET-2041'} rejected. Notification sent to customer.`, 'info');
      }
    });
  }

  // ===================================================
  // 9. PAGE: REPORTS, PROFILE, NOTIFICATIONS, SUPPORT
  // ===================================================
  $('#btnExportReportsCsv, #btnExportOrderCsv, #btnExportStockCsv').on('click', function () {
    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast('Report CSV compiled and downloaded.', 'success');
    }
  });

  $('#sellerProfileForm').on('submit', function (e) {
    e.preventDefault();
    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast('Store profile & banking details updated successfully.', 'success');
    }
  });

  $('#sellerTicketForm').on('submit', function (e) {
    e.preventDefault();
    const cat = $(this).find('select').val();
    const related = $(this).find('input[type="text"]').eq(0).val();
    const subject = $(this).find('input[type="text"]').eq(1).val();
    const desc = $(this).find('textarea').val();
    const ticketId = 'TKT-' + Math.floor(10000 + Math.random() * 90000);

    const ticketObj = {
      id: ticketId,
      name: 'Riya Sharma (Riya Home Studio)',
      email: 'riya@riyastudio.in',
      category: cat || 'Seller Support',
      subject: subject || 'Support Request',
      message: desc,
      orderNumber: related || 'N/A',
      date: new Date().toISOString()
    };

    if (typeof ShopNowAPI !== 'undefined') {
      ShopNowAPI.createSupportTicket(ticketObj);
    }

    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast(`Support ticket #${ticketId} submitted! Our manager will respond within 2 hours.`, 'success');
    }
    this.reset();
  });

  // Notifications Mark All Read -> Show Empty State (Matching Figma Screen 4)
  $('#btnMarkAllNotifRead').on('click', function () {
    $('.notif-unread-pill').remove();
    $('.notif-item').removeClass('bg-light-subtle');
    $('.seller-notif-badge').remove();
    $('#notificationsFeedCard').addClass('d-none');
    $('#notificationsEmptyState').removeClass('d-none');
    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast('All notifications marked as read.', 'info');
    }
  });

  $(document).on('click', '.btn-dismiss-notif', function () {
    $(this).closest('.notif-item').fadeOut(200, function () {
      $(this).remove();
      if ($('.notif-item').length === 0) {
        $('#notificationsFeedCard').addClass('d-none');
        $('#notificationsEmptyState').removeClass('d-none');
      }
    });
  });

  $('#notifFilterTabs button').on('click', function () {
    $('#notifFilterTabs button').removeClass('active bg-secondary-subtle text-dark').addClass('text-secondary');
    $(this).addClass('active bg-secondary-subtle text-dark').removeClass('text-secondary');
    const cat = $(this).data('filter');
    if (cat === 'all') {
      $('.notif-item').show();
    } else {
      $('.notif-item').each(function () {
        if ($(this).data('category') === cat) $(this).show();
        else $(this).hide();
      });
    }
  });

  // Password Visibility Toggle in update-password.html
  $('.toggle-seller-pw').on('click', function () {
    const targetId = $(this).data('target');
    const $input = $('#' + targetId);
    if ($input.length) {
      const type = $input.attr('type') === 'password' ? 'text' : 'password';
      $input.attr('type', type);
      $(this).find('i').toggleClass('bi-eye bi-eye-slash');
    }
  });

  // Update Password Form (Matching Figma Screen 2)
  $('#sellerUpdatePwForm').on('submit', function (e) {
    e.preventDefault();
    const current = $('#sellerCurrentPw').val();
    const newPw = $('#sellerNewPw').val();
    const confirmPw = $('#sellerConfirmPw').val();

    if (newPw !== confirmPw) {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('Passwords do not match. Please verify.', 'error');
      }
      return;
    }

    if (newPw.length < 8) {
      if (typeof ShopNowCommon !== 'undefined') {
        ShopNowCommon.showToast('New password must have at least 8 characters.', 'warning');
      }
      return;
    }

    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast('Password updated successfully!', 'success');
    }

    this.reset();
  });

  // Support Chat Send Form (Matching Figma Image 2 Screen 2)
  $('#supportChatSendForm').on('submit', function (e) {
    e.preventDefault();
    const msg = $('#supportChatInput').val().trim();
    if (!msg) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sellerMsgHtml = `
      <div class="d-flex align-items-end justify-content-end gap-2 align-self-end" style="max-width: 80%;">
        <div>
          <div class="p-3 rounded-4 text-white small shadow-sm" style="background-color: #081726;">
            ${msg}
          </div>
          <span class="extra-small text-muted me-2 mt-1 text-end d-block">${time}</span>
        </div>
      </div>
    `;

    $('#supportChatMessagesArea').append(sellerMsgHtml);
    $('#supportChatInput').val('');
    $('#supportChatMessagesArea').scrollTop($('#supportChatMessagesArea')[0].scrollHeight);

    // Simulated Agent Response
    setTimeout(function () {
      const agentReplyHtml = `
        <div class="d-flex align-items-start gap-2" style="max-width: 80%;">
          <div class="seller-avatar-initials bg-success-subtle text-success" style="width: 30px; height: 30px; min-width: 30px; font-size: 0.75rem; border-radius: 50%;">AM</div>
          <div>
            <div class="p-3 rounded-4 bg-white border text-dark small shadow-sm">
              Thank you for the update, Riya. I have recorded this note in the courier escalation log and will keep you posted.
            </div>
            <span class="extra-small text-muted ms-2 mt-1 d-block">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      `;
      $('#supportChatMessagesArea').append(agentReplyHtml);
      $('#supportChatMessagesArea').scrollTop($('#supportChatMessagesArea')[0].scrollHeight);
    }, 1000);
  });

  // Detailed Support Ticket Form (Matching Figma Image 2 Screen 3)
  $('#sellerRaiseTicketDetailedForm').on('submit', function (e) {
    e.preventDefault();
    const subject = $('#ticketSubject').val().trim();
    const category = $('input[name="ticketCategory"]:checked').val() || 'Orders';
    const priority = $('input[name="ticketPriority"]:checked').val() || 'Medium';
    const desc = $('#ticketDescription').val().trim();
    const ticketId = 'SN-TK-0' + Math.floor(100 + Math.random() * 900);

    const ticketObj = {
      id: ticketId,
      name: 'Riya Sharma (Riya Home Studio)',
      email: 'riya@riyastudio.in',
      subject: subject,
      category: category,
      priority: priority,
      message: desc,
      status: 'Open',
      date: new Date().toISOString()
    };

    if (typeof ShopNowAPI !== 'undefined') {
      ShopNowAPI.createSupportTicket(ticketObj);
    }

    if (typeof ShopNowCommon !== 'undefined') {
      ShopNowCommon.showToast(`Ticket #${ticketId} created successfully!`, 'success');
    }

    setTimeout(function () {
      window.location.href = 'support.html';
    }, 1000);
  });

  // ===================================================
  // 10. PAGE: REPORTS CONTROLLER (reports.html)
  // ===================================================
  if ($('#kpiReportsTotalRevenue').length || $('#reportsTopSellingTableBody').length) {
    const orders = getSellerOrders();
    const products = getSellerProducts();

    const totalRev = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = orders.length;
    const avgOrderVal = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
    const itemsSold = orders.reduce((sum, o) => {
      if (Array.isArray(o.items) && o.items.length > 0) {
        return sum + o.items.reduce((iSum, it) => iSum + (Number(it.qty) || 1), 0);
      }
      return sum + 1;
    }, 0);

    $('#kpiReportsTotalRevenue').text(`Rs ${totalRev.toLocaleString('en-IN')}`);
    $('#kpiReportsTotalOrders').text(totalOrders);
    $('#kpiReportsAvgOrderValue').text(`Rs ${avgOrderVal.toLocaleString('en-IN')}`);
    $('#kpiReportsItemsSold').text(itemsSold);

    if ($('#reportsTopSellingTableBody').length) {
      const productSales = {};
      orders.forEach(o => {
        if (Array.isArray(o.items)) {
          o.items.forEach(it => {
            const key = it.title || o.itemTitle || 'Item';
            if (!productSales[key]) {
              productSales[key] = { units: 0, revenue: 0 };
            }
            const qty = Number(it.qty) || 1;
            productSales[key].units += qty;
            productSales[key].revenue += (Number(it.price) || 0) * qty;
          });
        } else if (o.itemTitle) {
          const key = o.itemTitle;
          if (!productSales[key]) {
            productSales[key] = { units: 0, revenue: 0 };
          }
          productSales[key].units += 1;
          productSales[key].revenue += Number(o.total) || 0;
        }
      });

      const rankedItems = products.map((p, idx) => {
        const stats = productSales[p.title] || { units: Math.max(1, 10 - idx * 2), revenue: (Number(p.price) || 500) * Math.max(1, 10 - idx * 2) };
        return {
          title: p.title,
          category: p.category || 'General',
          subCategory: p.subCategory || '',
          thumb: p.image || defaultSampleImage,
          units: stats.units,
          revenue: stats.revenue,
          conv: `${(4.8 - idx * 0.4).toFixed(1)}%`
        };
      });

      rankedItems.sort((a, b) => b.units - a.units);

      let topHtml = '';
      if (rankedItems.length === 0) {
        topHtml = '<tr><td colspan="5" class="text-center py-4 text-muted">No sales data recorded yet.</td></tr>';
      } else {
        rankedItems.slice(0, 5).forEach((item, index) => {
          const rankBadge = index === 0
            ? '<span class="badge bg-warning-subtle text-warning-emphasis fw-bold rounded-pill px-2">#1</span>'
            : index === 1
              ? '<span class="badge bg-secondary-subtle text-dark fw-bold rounded-pill px-2">#2</span>'
              : index === 2
                ? '<span class="badge bg-danger-subtle text-danger fw-bold rounded-pill px-2">#3</span>'
                : `<span class="badge bg-light text-muted border fw-bold rounded-pill px-2">#${index + 1}</span>`;

          topHtml += `
            <tr>
              <td>${rankBadge}</td>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="cart-item-thumb-box" style="width: 44px; height: 44px;">
                    <img src="${item.thumb}" alt="${item.title}" />
                  </div>
                  <div>
                    <strong class="text-dark d-block">${item.title}</strong>
                    <span class="extra-small text-muted">${item.category}${item.subCategory ? ' &bull; ' + item.subCategory : ''}</span>
                  </div>
                </div>
              </td>
              <td><strong>${item.units} units</strong></td>
              <td><strong class="text-dark">Rs ${Number(item.revenue).toLocaleString('en-IN')}</strong></td>
              <td><span class="badge bg-success-subtle text-success">${item.conv}</span></td>
            </tr>
          `;
        });
      }
      $('#reportsTopSellingTableBody').html(topHtml);
    }
  }

  // ===================================================
  // 11. PAGE: ORDER REPORT CONTROLLER (order-report.html)
  // ===================================================
  if ($('#kpiOrderReportTotal').length || $('#orderReportDetailsTableBody').length) {
    const orders = getSellerOrders();
    const totalOrders = orders.length;

    const delivCount = orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
    const procCount = orders.filter(o => (o.status || '').toLowerCase() === 'processing' || (o.status || '').toLowerCase() === 'new').length;
    const shipCount = orders.filter(o => (o.status || '').toLowerCase() === 'shipped').length;
    const cancCount = orders.filter(o => (o.status || '').toLowerCase() === 'cancelled' || (o.status || '').toLowerCase() === 'returned').length;

    $('#kpiOrderReportTotal').text(totalOrders);
    $('#kpiOrderReportDelivered').text(delivCount);
    $('#kpiOrderReportProcessing').text(procCount);
    $('#kpiOrderReportCancelled').text(cancCount);

    const delivPct = totalOrders > 0 ? Math.round((delivCount / totalOrders) * 100) : 0;
    const procPct = totalOrders > 0 ? Math.round((procCount / totalOrders) * 100) : 0;
    const shipPct = totalOrders > 0 ? Math.round((shipCount / totalOrders) * 100) : 0;
    const cancPct = totalOrders > 0 ? Math.round((cancCount / totalOrders) * 100) : 0;

    $('#orderReportDelivCount').text(`${delivCount} orders (${delivPct}%)`);
    $('#orderReportDelivFill').css('width', `${delivPct}%`);

    $('#orderReportProcCount').text(`${procCount} orders (${procPct}%)`);
    $('#orderReportProcFill').css('width', `${procPct}%`);

    $('#orderReportShipCount').text(`${shipCount} orders (${shipPct}%)`);
    $('#orderReportShipFill').css('width', `${shipPct}%`);

    $('#orderReportCancCount').text(`${cancCount} orders (${cancPct}%)`);
    $('#orderReportCancFill').css('width', `${cancPct}%`);

    if ($('#orderReportDetailsTableBody').length) {
      let ordHtml = '';
      if (orders.length === 0) {
        ordHtml = '<tr><td colspan="7" class="text-center py-4 text-muted">No orders available for your store.</td></tr>';
      } else {
        orders.forEach(o => {
          ordHtml += `
            <tr>
              <td><strong class="text-dark">#${o.orderId || o.id}</strong></td>
              <td>
                <div class="fw-bold text-dark">${o.customer || 'Customer'}</div>
                <div class="extra-small text-muted">${o.city || 'India'}</div>
              </td>
              <td><span class="small text-secondary">${o.itemTitle || (o.items && o.items[0] ? o.items[0].title : 'Order Items')}</span></td>
              <td><span class="small text-muted">${o.date || 'Recent'}</span></td>
              <td><strong class="text-dark">Rs ${Number(o.total).toLocaleString('en-IN')}</strong></td>
              <td><span class="status-badge ${o.statusClass || 'processing'}">${o.status || 'Processing'}</span></td>
              <td>
                <a href="order-details.html?id=${o.id || o.orderId}" class="btn btn-sm btn-outline-seller py-1 px-3">View</a>
              </td>
            </tr>
          `;
        });
      }
      $('#orderReportDetailsTableBody').html(ordHtml);
    }
  }

  // ===================================================
  // 12. PAGE: STOCK REPORT CONTROLLER (stock-report.html)
  // ===================================================
  if ($('#kpiStockReportTotalUnits').length || $('#stockReportDetailsTableBody').length) {
    const products = getSellerProducts();

    const totalUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const inStockCount = products.filter(p => Number(p.stock) > 5).length;
    const lowStockCount = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length;
    const outOfStockCount = products.filter(p => Number(p.stock) <= 0).length;

    $('#kpiStockReportTotalUnits').text(totalUnits.toLocaleString('en-IN'));
    $('#kpiStockReportInStock').text(inStockCount);
    $('#kpiStockReportLowStock').text(lowStockCount);
    $('#kpiStockReportOutOfStock').text(outOfStockCount);

    if ($('#stockReportCategoryBarsWrap').length) {
      const catCounts = {};
      products.forEach(p => {
        const cat = p.category || 'Other';
        catCounts[cat] = (catCounts[cat] || 0) + (Number(p.stock) || 0);
      });

      const categories = Object.keys(catCounts);
      let barsHtml = '';
      if (categories.length === 0 || totalUnits === 0) {
        barsHtml = '<p class="text-muted extra-small mb-0 py-2">No category stock data available.</p>';
      } else {
        const colors = ['bg-coral', 'bg-dark', 'bg-info', 'bg-success', 'bg-warning'];
        categories.forEach((cat, idx) => {
          const units = catCounts[cat];
          const pct = Math.round((units / totalUnits) * 100);
          const colorClass = colors[idx % colors.length];
          barsHtml += `
            <div class="dist-bar-item ${idx === categories.length - 1 ? 'mb-0' : ''}">
              <div class="dist-bar-header">
                <span><i class="bi bi-tag-fill me-1 text-coral"></i> ${cat}</span>
                <span>${units} units (${pct}%)</span>
              </div>
              <div class="dist-bar-track">
                <div class="dist-bar-fill ${colorClass}" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        });
      }
      $('#stockReportCategoryBarsWrap').html(barsHtml);
    }

    if ($('#stockReportDetailsTableBody').length) {
      let stockHtml = '';
      if (products.length === 0) {
        stockHtml = '<tr><td colspan="5" class="text-center py-4 text-muted">No catalogue products registered for your store.</td></tr>';
      } else {
        products.forEach(p => {
          const isLow = Number(p.stock) > 0 && Number(p.stock) <= 5;
          const isOut = Number(p.stock) <= 0;
          const statusClass = isOut ? 'out-of-stock' : isLow ? 'low-stock' : 'in-stock';
          const statusLabel = isOut ? 'Out of stock' : isLow ? 'Low stock' : 'In stock';
          const stockColor = isLow || isOut ? 'text-danger' : 'text-dark';

          stockHtml += `
            <tr>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="cart-item-thumb-box" style="width: 44px; height: 44px;">
                    <img src="${p.image || defaultSampleImage}" alt="${p.title}" />
                  </div>
                  <div>
                    <strong class="text-dark d-block">${p.title}</strong>
                    <span class="extra-small text-muted">${p.category || 'General'}${p.subCategory ? ' &bull; ' + p.subCategory : ''}</span>
                  </div>
                </div>
              </td>
              <td><code class="text-secondary small">${p.sku}</code></td>
              <td><span class="fw-bold ${stockColor}">${p.stock} units</span></td>
              <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
              <td>
                <a href="inventory.html" class="btn btn-sm btn-outline-seller py-1 px-3">Update Stock</a>
              </td>
            </tr>
          `;
        });
      }
      $('#stockReportDetailsTableBody').html(stockHtml);
    }
  }

  // ===================================================
  // REAL-TIME KPI SYNCHRONIZATION ACROSS TABS
  // ===================================================
  window.addEventListener('storage', function (e) {
    if ([STORAGE_SELLER_PRODUCTS, STORAGE_SELLER_ORDERS, STORAGE_SELLER_RETURNS, STORAGE_SELLER_REVIEWS, 'shopnow_products', 'shopnow_orders'].includes(e.key)) {
      if ($('#sellerStatTotalSales').length) {
        const myOrders = getSellerOrders();
        const myProducts = getSellerProducts();
        const myReturns = getSellerReturns();
        const totalSales = myOrders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
        const newOrdersCount = myOrders.filter(ord => !ord.status || ord.status === 'Processing' || ord.status === 'New').length;
        const lowStockCount = myProducts.filter(p => Number(p.stock) <= 5).length;
        const pendingReturnsCount = myReturns.filter(r => (r.status || '').toLowerCase() === 'requested' || (r.refundStatus || '').toLowerCase() === 'pending').length;

        $('#sellerStatTotalSales').text(`Rs ${totalSales.toLocaleString('en-IN')}`);
        $('#sellerStatNewOrders').text(newOrdersCount);
        $('#sellerStatLowStock').text(lowStockCount);
        $('#sellerStatPendingReturns').text(pendingReturnsCount);
      }
      if ($('#kpiInventoryLowStock').length) {
        const prods = getSellerProducts();
        $('#kpiInventoryLowStock').text(prods.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length);
        $('#kpiInventoryInStock').text(prods.filter(p => Number(p.stock) > 5).length);
        $('#kpiInventoryOutOfStock').text(prods.filter(p => Number(p.stock) <= 0).length);
      }
      if ($('#kpiAllOrdersCount').length) {
        const orders = getSellerOrders();
        $('#kpiAllOrdersCount').text(orders.length);
        $('#kpiProcessingCount').text(orders.filter(o => (o.status || '').toLowerCase() === 'processing').length);
        $('#kpiShippedCount').text(orders.filter(o => (o.status || '').toLowerCase() === 'shipped').length);
        $('#kpiDeliveredCount').text(orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length);
      }
      if ($('#shippingCountAll').length) {
        const orders = getSellerOrders();
        $('#shippingCountAll').text(orders.length);
        $('#shippingCountReady').text(orders.filter(o => (o.status || '').toLowerCase() === 'processing').length);
        $('#shippingCountTransit').text(orders.filter(o => (o.status || '').toLowerCase() === 'shipped').length);
        $('#shippingCountDelivered').text(orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length);
      }
      if ($('#returnsCountAll').length) {
        const rets = getSellerReturns();
        $('#returnsCountAll').text(rets.length);
        $('#returnsCountRequested').text(rets.filter(r => (r.status || '').toLowerCase() === 'requested').length);
        $('#returnsCountApproved').text(rets.filter(r => (r.status || '').toLowerCase() === 'approved').length);
        $('#returnsCountRefunded').text(rets.filter(r => (r.status || '').toLowerCase() === 'refunded').length);
      }
    }
  });
});
