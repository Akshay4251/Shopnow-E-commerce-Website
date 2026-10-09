/*
 * ShopNow SEARCH BAR (common to all modules: customer, seller, admin, delivery agent)
 *  - Focus on empty box  -> recent searches (last 5, kept separately per module, with "Clear")
 *  - Typing              -> live suggestions (debounced, stale responses ignored): "Search for …" + matches
 *  - Keyboard            -> ArrowUp/ArrowDown to move, Enter to choose, Escape to close
 *  - Submit / Enter      -> the module's results page with ?q=<term>  (empty search is ignored)
 *  - Results page        -> the box is pre-filled from ?q=
 *
 * Mount: put <div data-shopnow-search></div> inside your own header (optional data-placeholder="...").
 * Module: set <body data-module="seller"> (or "admin", "agent"; leave off for customer).
 *         The bar needs Bootstrap 5 + Bootstrap Icons + css/search-common.css.
 *
 * Public API:
 *   ShopNow.search({ q, page, pageSize, ... })   (customer also accepts category, minPrice, maxPrice, rating, sort)
 *     customer     -> { total, page, pages, pageSize, categories:[...], items:[{id,brand,name,category,price,rating}] }
 *     seller/admin/agent -> { total, page, pages, pageSize, items:[{type,label,sub,href}] }
 *   ShopNow.initSearch()  (called automatically by search-common.js)
 * Backend contract: see README.md
 */
(function ($) {
  'use strict';
  var ShopNow = window.ShopNow;
  var cfg = ShopNow.config;
  var esc = ShopNow.esc;

  var ICONS = { product: 'bi-tag', order: 'bi-box-seam', user: 'bi-person', seller: 'bi-shop', delivery: 'bi-truck' };

  /** Settings for the module this page belongs to. */
  function mod() {
    var name = ShopNow.getModule();
    if (name === 'customer') {
      return { name: name, placeholder: 'Search products, brands and categories',
               resultsPage: cfg.resultsPage, recentKey: cfg.recentKey };
    }
    return $.extend({ name: name }, cfg.modules[name]);
  }

  /** Only follow simple relative page names coming from an API (blocks javascript: and other schemes). */
  function safeHref(h) { return /^[\w.\/-]+(\?[\w=&%.,-]*)?$/.test(h || '') ? h : null; }

  ShopNow.search = function (params) {
    var m = mod();
    return ShopNow.api('GET', m.name === 'customer' ? '/api/products' : m.searchUrl, params || {});
  };

  /* ----- recent searches (stored per browser, per module) ----- */
  function getRecent(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; } }
  function addRecent(key, q) {
    var list = getRecent(key).filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); });
    list.unshift(q);
    try { localStorage.setItem(key, JSON.stringify(list.slice(0, 5))); } catch (e) {}
  }
  function clearRecent(key) { try { localStorage.removeItem(key); } catch (e) {} }

  function searchHtml(M, placeholder) {
    var ph = esc(placeholder || M.placeholder);
    return '<form class="search-form" id="searchForm" action="' + esc(M.resultsPage.split('?')[0]) + '" method="get" role="search">' +
      '<i class="bi bi-search"></i>' +
      '<input class="form-control" id="searchInput" type="search" name="q" autocomplete="off" maxlength="100" ' +
        'placeholder="' + ph + '" aria-label="' + ph + '" ' +
        'role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="searchSuggest">' +
      '<button class="go" type="submit" aria-label="Search"><i class="bi bi-arrow-right"></i></button>' +
      '<div class="suggest d-none" id="searchSuggest" role="listbox"></div>' +
    '</form>';
  }

  ShopNow.initSearch = function () {
    var M = mod();
    // Drop <div data-shopnow-search></div> anywhere in your own header; the search bar is rendered inside it.
    var $mount = $('[data-shopnow-search]').first();
    if ($mount.length && !$('#searchForm').length) $mount.html(searchHtml(M, $mount.attr('data-placeholder')));

    var $in = $('#searchInput'), $box = $('#searchSuggest'), $form = $('#searchForm');
    if (!$in.length) return;
    var items = [], active = -1, timer = null, xhr = null;

    var prefill = new URLSearchParams(location.search).get('q');
    if (prefill) $in.val(prefill);

    function resultsUrl(q) {
      return M.resultsPage + (M.resultsPage.indexOf('?') > -1 ? '&' : '?') + 'q=' + encodeURIComponent(q);
    }
    function go(q) {
      q = $.trim(q);
      if (!q) { $in.trigger('focus'); return; }
      addRecent(M.recentKey, q);
      location.href = resultsUrl(q);
    }
    function choose(it) {
      if (it.href) { var h = safeHref(it.href); if (h) location.href = h; }
      else go(it.query);
    }

    function close() {
      $box.addClass('d-none').empty();
      $in.attr('aria-expanded', 'false').removeAttr('aria-activedescendant');
      items = []; active = -1;
    }
    function setActive(i) {
      active = i;
      $box.find('li').removeClass('active').attr('aria-selected', 'false');
      if (i < 0) { $in.removeAttr('aria-activedescendant'); return; }
      var $li = $box.find('li').eq(i).addClass('active').attr('aria-selected', 'true');
      $in.attr('aria-activedescendant', $li.attr('id'));
      $li[0].scrollIntoView({ block: 'nearest' });
    }
    function render(list, heading, clearable) {
      items = list; active = -1;
      if (!list.length) { close(); return; }
      var html = '';
      if (heading) html += '<div class="sg-head"><span>' + heading + '</span>' + (clearable ? '<a href="#" class="sg-clear">Clear</a>' : '') + '</div>';
      html += '<ul>' + list.map(function (it, i) {
        return '<li role="option" id="sg-' + i + '" data-i="' + i + '" aria-selected="false">' +
          '<i class="bi ' + it.icon + '"></i><span class="t">' + esc(it.label) + '</span>' +
          (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</li>';
      }).join('') + '</ul>';
      $box.html(html).removeClass('d-none');
      $in.attr('aria-expanded', 'true');
    }
    function showRecent() {
      render(getRecent(M.recentKey).map(function (q) { return { icon: 'bi-clock-history', label: q, query: q }; }), 'Recent searches', true);
    }

    /** Turn the API answer into the dropdown list. */
    function buildList(q, res) {
      var list = [{ icon: 'bi-search', label: 'Search for “' + q + '”', query: q }];
      if (M.name === 'customer') {
        (res.categories || []).forEach(function (c) {
          list.push({ icon: 'bi-grid', label: c, sub: 'Category', href: cfg.resultsPage + '?category=' + encodeURIComponent(c) });
        });
        (res.products || []).forEach(function (p) {
          list.push({ icon: 'bi-tag', label: p.name, sub: p.category, href: cfg.productPage + '?id=' + p.id });
        });
      } else {
        (res.results || []).forEach(function (r) {
          list.push({ icon: ICONS[r.type] || 'bi-search', label: r.label, sub: r.sub, href: r.href });
        });
      }
      return list;
    }
    function suggest(q) {
      if (xhr) xhr.abort();
      var url = M.name === 'customer' ? '/api/search/suggestions' : M.suggestUrl;
      xhr = ShopNow.api('GET', url, { q: q }).done(function (res) {
        if ($.trim($in.val()) !== q) return; // user kept typing: ignore stale response
        render(buildList(q, res));
      }).fail(function (x, status) {
        if (status !== 'abort') render(buildList(q, {})); // still searchable if suggestions fail
      });
    }

    $in.on('input', function () {
      clearTimeout(timer);
      var q = $.trim($in.val());
      if (!q) { if (xhr) xhr.abort(); showRecent(); return; }
      timer = setTimeout(function () { suggest(q); }, 250);
    });
    $in.on('focus', function () { if (!$.trim($in.val())) showRecent(); });
    $in.on('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (!items.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((active + 1) % items.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active <= 0 ? items.length - 1 : active - 1); }
      else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(items[active]); }
    });
    $form.on('submit', function (e) { e.preventDefault(); go($in.val()); });

    $box.on('mousedown', function (e) { e.preventDefault(); });          // keep focus in the input while clicking
    $box.on('click', 'li', function () { choose(items[+$(this).data('i')]); });
    $box.on('click', '.sg-clear', function (e) { e.preventDefault(); clearRecent(M.recentKey); close(); });
    $(document).on('click', function (e) { if (!$(e.target).closest('#searchForm').length) close(); });
  };
})(jQuery);
