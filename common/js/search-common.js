/*
 * ShopNow common core – shared by EVERY module (customer, seller, admin, delivery agent).
 * No header here: each team keeps its own header. This file only provides
 * the small ShopNow helper object and starts the common features
 * (search bar + optional logout). search.js (and logout.js) must be loaded after this file.
 */
(function ($) {
  "use strict";

  var ShopNow = (window.ShopNow = {
    // Change these once if a team uses different file names.
    config: {
      loginPage: "login.html",
      resultsPage: "search-product.html",
      productPage: "product.html",
      recentKey: "shopnow_recent_searches",

      // One entry per non-customer module. The customer module uses the settings above.
      // resultsPage = the module's own results page; the search adds &q=<term> (or ?q=).
      modules: {
        seller: {
          placeholder: "Search your products and orders",
          resultsPage: "search-results.html?module=seller",
          suggestUrl: "/api/seller/search/suggestions",
          searchUrl: "/api/seller/search",
          recentKey: "shopnow_recent_seller",
        },
        admin: {
          placeholder: "Search users, sellers and orders",
          resultsPage: "search-results.html?module=admin",
          suggestUrl: "/api/admin/search/suggestions",
          searchUrl: "/api/admin/search",
          recentKey: "shopnow_recent_admin",
        },
        agent: {
          placeholder: "Search by order number, PIN code or area",
          resultsPage: "search-results.html?module=agent",
          suggestUrl: "/api/agent/search/suggestions",
          searchUrl: "/api/agent/search",
          recentKey: "shopnow_recent_agent",
        },
      },
    },

    /** Which module this page belongs to: customer | seller | admin | agent.
     *  Set  <body data-module="seller">  once per page (or data-module on the search placeholder). Default: customer. */
    getModule: function () {
      var m =
        $("[data-shopnow-search]").first().attr("data-module") ||
        $("body").attr("data-module") ||
        "customer";
      if (m !== "customer" && !ShopNow.config.modules[m]) {
        if (window.console)
          console.warn(
            'ShopNow: unknown module "' + m + '", using customer search.',
          );
        return "customer";
      }
      return m;
    },

    esc: function (s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c];
      });
    },

    /** JSON request helper. For GET, `body` is sent as query-string params. */
    api: function (method, url, body) {
      var opts = { url: url, method: method, dataType: "json" };
      if (body !== undefined) {
        if (method === "GET") opts.url = url + "?" + $.param(body);
        else {
          opts.data = JSON.stringify(body);
          opts.contentType = "application/json";
        }
      }
      return $.ajax(opts);
    },

    /** Small toast (needs Bootstrap JS). Falls back to alert-free no-op if Bootstrap is missing. */
    toast: function (msg, type) {
      if (!window.bootstrap) return;
      if (!$("#appToast").length) {
        $("body").append(
          '<div class="toast-container position-fixed top-0 end-0 p-3" style="z-index:1100">' +
            '<div id="appToast" class="toast align-items-center border-0" role="status" aria-live="polite">' +
            '<div class="d-flex"><div class="toast-body" id="appToastBody"></div>' +
            '<button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div></div>',
        );
      }
      var $t = $("#appToast");
      $t.removeClass("text-bg-success text-bg-danger").addClass(
        type === "error" ? "text-bg-danger" : "text-bg-success",
      );
      $("#appToastBody").text(msg);
      bootstrap.Toast.getOrCreateInstance($t[0], { delay: 3500 }).show();
    },
    /** Show a toast on the NEXT page load. */
    flash: function (msg) {
      try {
        sessionStorage.setItem("shopnow_flash", msg);
      } catch (e) {}
    },
    showFlash: function () {
      try {
        var m = sessionStorage.getItem("shopnow_flash");
        if (m) {
          sessionStorage.removeItem("shopnow_flash");
          ShopNow.toast(m);
        }
      } catch (e) {}
    },
  });

  $(function () {
    if (ShopNow.initSearch) ShopNow.initSearch(); // search.js
    if (ShopNow.initLogout) ShopNow.initLogout(); // logout.js
    ShopNow.showFlash();
  });
})(jQuery);
