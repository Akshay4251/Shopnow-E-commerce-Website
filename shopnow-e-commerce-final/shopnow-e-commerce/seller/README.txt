ShopNow - Seller module
=======================
Open: seller/html/seller-dashboard.html   (every seller page links to every other seller page)

seller/html -> 28 pages
seller/css  -> one CSS per page + seller-responsive.css (shared, mobile/tablet/laptop)
seller/js   -> one JS per page + seller-responsive.js (shared: mobile menu, table cards)
seller/resources -> images / data for the seller module (empty for now)

Notes
- seller-profile and seller-update-password use Bootstrap, Bootstrap Icons and jQuery from a CDN (internet needed).
- "Log out" on those two pages goes to ../../common/html/login.html
  = shopnow-e-commerce/common/html/login.html (put the shared login page there).

Shipping (MockAPI)
- seller-shipping.html loads the "shipments" resource (plus "orders" and "deliveryAgents" for names / addresses).
- Mark as in transit / Mark out for delivery save with PUT /shipments/:id (status, shippedAt, agent).
- View opens seller-shipping-tracking.html?shipment=<shipment id> (also works with ?id=<order id>).
