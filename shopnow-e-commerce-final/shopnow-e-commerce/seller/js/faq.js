(function () {
  const escapeHtml = (value) => {
    const div = document.createElement('div');
    div.textContent = String(value ?? '');
    return div.innerHTML;
  };

  const faqList = document.getElementById('faqList');
  const faqError = document.getElementById('faqError');

  function renderFaqs(faqs) {
    if (!Array.isArray(faqs) || faqs.length === 0) {
      faqError.classList.remove('d-none');
      return;
    }

    faqList.innerHTML = faqs
      .map((faq) => `
        <details class="faq-item">
          <summary><span>${escapeHtml(faq.question)}</span><i class="bi bi-plus-lg" aria-hidden="true"></i></summary>
          <div class="faq-answer"><p>${escapeHtml(faq.answer)}</p></div>
        </details>
      `)
      .join('');

    faqError.classList.add('d-none');
  }

  function loadFaqs() {
    const fallbackFaqs = [
      {
        question: 'How can I add a new product to my ShopNow store?',
        answer: 'Use the Add product button on the seller dashboard to open the product form. Fill in the product details, pricing, inventory, and media, then save the listing to make it live on the marketplace.'
      },
      {
        question: 'How can I check the stock available for my products?',
        answer: 'Open the Inventory page or Stock report to review available quantities for each product. Products with five or fewer units are flagged as low stock, and products with zero units are shown as out of stock.'
      },
      {
        question: 'Where can I see the orders placed by my customers?',
        answer: 'Recent orders appear in the Recent orders section on your dashboard. For a complete list, open the Orders page and use filters by status, date, or payment state to find the order you need.'
      },
      {
        question: 'How are my total sales and order count calculated?',
        answer: 'Total sales is the combined revenue of recorded customer orders, while order count is the total number of orders received. The Reports section also shows revenue, average order value, and trend-based insights for your selected date range.'
      },
      {
        question: 'How do I know when a product needs restocking?',
        answer: 'The dashboard low-stock alert highlights products with five or fewer units remaining. You can also check the Inventory page and Stock report for an up-to-date summary of in-stock, low-stock, and out-of-stock items.'
      },
      {
        question: 'Where can I review sales, orders and inventory reports?',
        answer: 'Open the Reports section to access the Sales report, Order report, and Stock report. Use the date filter and report shortcuts to compare performance across the time period you need.'
      },
      {
        question: 'How can I download or save a report?',
        answer: 'Inside any report, use the Export option and choose CSV for spreadsheet format or PDF for a printable file. The browser will then download the report, or open the print dialog for saving as a PDF.'
      },
      {
        question: 'How can I see and respond to customer return requests?',
        answer: 'Open the Returns page from the seller navigation to review all return requests. Each request includes the order details, reason, return status, and actions you can take before approving or rejecting it.'
      },
      {
        question: 'How do I track shipments and update delivery status?',
        answer: 'Use the Shipping page to review outbound shipments and the Tracking page to check delivery progress. Once a package is in transit, you can update shipping information and confirm when an order is delivered.'
      },
      {
        question: 'How can I update my shop profile and account details?',
        answer: 'Open your Profile page from the seller navigation to review your store information, business details, and account preferences. You can update contact information and personal shop settings whenever needed.'
      }
    ];

    const loadJson = () => fetch('../resources/faq.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('FAQ resource not found');
        }
        return response.json();
      })
      .catch(() => fallbackFaqs);

    return loadJson().then(renderFaqs);
  }

  window.ShopNowSellerData = window.ShopNowSellerData || {};
  window.ShopNowSellerData.loadFaq = function () {
    return loadFaqs();
  };

  loadFaqs();
})();
