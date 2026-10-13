/* ShopNow seller – custom date-range calendar for the report pages.
   Replaces the static ".dr" date label with a button that opens a calendar:
   desktop = presets + 2 months, tablet = 1-2 months, phone = bottom sheet.
   The chosen range is shared by the three report pages and announced with the
   "sn:range" event ( event.detail = { from: Date, to: Date } ). */
(function () {
  'use strict';
  var host = document.querySelector('.dr');
  if (!host) return;

  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MS = MON.map(function (m) { return m.slice(0, 3); });
  var DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var KEY = 'sn:report-range';
  var DAY = 864e5;
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  var TODAY = today(), MIN = new Date(2024, 0, 1);
  function d0(y, m, d) { return new Date(y, m, d); }
  function same(a, b) { return a && b && a.getTime() === b.getTime(); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(d) { return pad(d.getDate()) + ' ' + MS[d.getMonth()] + ' ' + d.getFullYear(); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? d0(+m[1], +m[2] - 1, +m[3]) : null; }
  function label(a, b) {
    if (a.getFullYear() === b.getFullYear()) return pad(a.getDate()) + ' ' + MS[a.getMonth()] + ' – ' + pad(b.getDate()) + ' ' + MS[b.getMonth()] + ' ' + b.getFullYear();
    return fmt(a) + ' – ' + fmt(b);
  }
  function lastOf(y, m) { return d0(y, m + 1, 0); }

  var PRESETS = [
    ['Last 7 days', function () { return [new Date(TODAY - 6 * DAY), TODAY]; }],
    ['Last 30 days', function () { return [new Date(TODAY - 29 * DAY), TODAY]; }],
    ['This month', function () { return [d0(TODAY.getFullYear(), TODAY.getMonth(), 1), TODAY]; }],
    ['Last month', function () { var y = TODAY.getFullYear(), m = TODAY.getMonth() - 1; return [d0(y, m, 1), lastOf(y, m)]; }],
    ['Last 3 months', function () { return [d0(TODAY.getFullYear(), TODAY.getMonth() - 2, 1), TODAY]; }],
    ['Apr – Sep 2026', function () { return [d0(2026, 3, 1), d0(2026, 8, 30)]; }],
    ['This year', function () { return [d0(TODAY.getFullYear(), 0, 1), TODAY]; }]
  ];

  /* ---- state ---- */
  var saved = null;
  try { var raw = JSON.parse(localStorage.getItem(KEY) || 'null'); if (raw) saved = [parse(raw.from), parse(raw.to)]; } catch (e) { }
  var cur = saved && saved[0] && saved[1] ? saved : [d0(2026, 3, 1), d0(2026, 8, 30)];    // applied range
  var draft = [cur[0], cur[1]];                                                          // range being picked
  var view = d0(cur[0].getFullYear(), cur[0].getMonth(), 1);                              // first visible month
  var focus = cur[0], hover = null, openState = false;

  /* ---- DOM ---- */
  var icon = host.querySelector('svg') ? host.querySelector('svg').outerHTML : '';
  var wrap = document.createElement('div'); wrap.className = 'drw';
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'dr drb'; btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = icon + '<span class="drl"></span><i aria-hidden="true">⌄</i>';
  var pop = document.createElement('div');
  pop.className = 'dp'; pop.hidden = true; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'false'); pop.setAttribute('aria-label', 'Choose date range');
  var back = document.createElement('div'); back.className = 'dpb'; back.hidden = true;
  host.replaceWith(wrap); wrap.appendChild(btn); wrap.appendChild(pop); wrap.appendChild(back);
  var lbl = btn.querySelector('.drl');

  function setBtn() { lbl.textContent = label(cur[0], cur[1]); btn.setAttribute('aria-label', 'Date range: ' + label(cur[0], cur[1]) + '. Change'); }

  function monthHtml(y, m, idx) {
    var first = d0(y, m, 1), start = first.getDay(), days = lastOf(y, m).getDate(), h = '';
    h += '<div class="dpm dpm' + idx + '"><div class="dph">';
    if (idx === 0) {
      h += '<button type="button" class="dpn" data-nav="-1" aria-label="Previous month">‹</button>' +
        '<span class="dpsel"><select class="dpms" aria-label="Month">' + MON.map(function (n, i) { return '<option value="' + i + '"' + (i === m ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select>' +
        '<select class="dpys" aria-label="Year">' + yearOpts(y) + '</select></span>';
      h += '<button type="button" class="dpn dpn2" data-nav="1" aria-label="Next month">›</button>';
    } else {
      h += '<span class="dpt">' + MON[m] + ' ' + y + '</span><button type="button" class="dpn" data-nav="1" aria-label="Next month">›</button>';
    }
    h += '</div><div class="dpg" role="grid" aria-label="' + MON[m] + ' ' + y + '">' + DOW.map(function (w) { return '<span class="dpw" role="columnheader">' + w + '</span>'; }).join('');
    for (var i = 0; i < start; i++) h += '<span class="dpe"></span>';
    for (var d = 1; d <= days; d++) {
      var dt = d0(y, m, d), c = 'dpd', dis = dt > TODAY || dt < MIN, a = draft[0], b = draft[1] || (a && hover && !draft[1] ? hover : null), lo = a, hi = b;
      if (a && b && b < a) { lo = b; hi = a; }
      if (lo && hi && dt > lo && dt < hi) c += ' mid';
      if (same(dt, lo)) c += ' st' + (hi && !same(lo, hi) ? ' hasr' : '');
      if (same(dt, hi) && !same(lo, hi)) c += ' en';
      if (same(dt, lo) && same(lo, hi)) c += ' solo';
      if (same(dt, TODAY)) c += ' td';
      if (dt.getDay() === 0) c += ' sun'; if (dt.getDay() === 6) c += ' sat';
      var sel = (lo && hi && dt >= lo && dt <= hi) || same(dt, lo);
      h += '<button type="button" class="' + c + '" role="gridcell" data-d="' + iso(dt) + '" tabindex="' + (same(dt, focus) ? '0' : '-1') + '"' + (dis ? ' disabled' : '') + ' aria-selected="' + (sel ? 'true' : 'false') + '" aria-label="' + dt.getDate() + ' ' + MON[m] + ' ' + y + '">' + d + '</button>';
    }
    return h + '</div></div>';
  }
  function yearOpts(y) { var h = ''; for (var i = MIN.getFullYear(); i <= TODAY.getFullYear(); i++) h += '<option' + (i === y ? ' selected' : '') + '>' + i + '</option>'; return h; }

  function summary() {
    var a = draft[0], b = draft[1];
    if (!a) return 'Pick a start date';
    if (!b) return fmt(a) + ' – pick an end date';
    var lo = a <= b ? a : b, hi = a <= b ? b : a, n = Math.round((hi - lo) / DAY) + 1;
    return '<b>' + label(lo, hi) + '</b><span>' + n + ' day' + (n > 1 ? 's' : '') + '</span>';
  }
  function presetOn(p) { var r = p[1](); var a = draft[0], b = draft[1]; return a && b && same(a, r[0]) && same(b, r[1]); }

  function render(keepFocus) {
    var m2 = d0(view.getFullYear(), view.getMonth() + 1, 1);
    pop.innerHTML =
      '<div class="dph0"><b>Date range</b><button type="button" class="dpx" aria-label="Close">✕</button></div>' +
      '<div class="dpbody"><div class="dpp" role="group" aria-label="Quick ranges">' +
      PRESETS.map(function (p, i) { return '<button type="button" class="dpq' + (presetOn(p) ? ' on' : '') + '" data-p="' + i + '">' + p[0] + '</button>'; }).join('') + '</div>' +
      '<div class="dpc">' + monthHtml(view.getFullYear(), view.getMonth(), 0) + monthHtml(m2.getFullYear(), m2.getMonth(), 1) + '</div></div>' +
      '<div class="dpf"><div class="dps" aria-live="polite">' + summary() + '</div><div class="dpa"><button type="button" class="btn dpcl">Cancel</button><button type="button" class="btn pri dpok"' + (draft[0] && draft[1] ? '' : ' disabled') + '>Apply</button></div></div>';
    if (keepFocus) { var f = pop.querySelector('.dpd[tabindex="0"]'); if (f) f.focus(); }
  }

  function setView(d) { view = d0(d.getFullYear(), d.getMonth(), 1); }
  function visible(d) { var m = d.getFullYear() * 12 + d.getMonth(), v = view.getFullYear() * 12 + view.getMonth(); return m === v || m === v + 1; }
  function viewFor(a, b) {                      /* which month(s) to show for a range */
    var span = (b.getFullYear() * 12 + b.getMonth()) - (a.getFullYear() * 12 + a.getMonth());
    if (span < 1) return setView(a);
    setView(window.innerWidth < 760 ? b : d0(b.getFullYear(), b.getMonth() - 1, 1));
  }
  function ensureFocus() { if (!visible(focus)) focus = draft[1] && visible(draft[1]) ? draft[1] : d0(view.getFullYear(), view.getMonth(), 1); }
  function clampView() {
    var maxV = d0(TODAY.getFullYear(), TODAY.getMonth() - 1, 1), minV = d0(MIN.getFullYear(), MIN.getMonth(), 1);
    if (view > maxV) view = maxV; if (view < minV) view = minV;
  }

  function openPop() {
    draft = [cur[0], cur[1]]; hover = null; focus = cur[0];
    viewFor(cur[0], cur[1]);
    clampView(); ensureFocus(); render(false);
    pop.hidden = false; back.hidden = false; openState = true; btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('dp-open');
    place();
    var f = pop.querySelector('.dpd[tabindex="0"]') || pop.querySelector('.dpd:not([disabled])'); if (f) f.focus({ preventScroll: true });
  }
  function closePop(ret) {
    if (!openState) return;
    pop.hidden = true; back.hidden = true; openState = false; btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('dp-open'); pop.style.left = pop.style.right = '';
    if (ret) btn.focus();
  }
  /* keep the popover inside the viewport on desktop / tablet */
  function place() {
    pop.style.left = pop.style.right = '';
    if (window.innerWidth <= 640) return;
    var r = pop.getBoundingClientRect();
    if (r.left < 12) { pop.style.right = 'auto'; pop.style.left = (12 - wrap.getBoundingClientRect().left) + 'px'; }
    else if (r.right > window.innerWidth - 12) { pop.style.right = (r.right - (window.innerWidth - 12)) * -1 + 'px'; }
  }

  function apply() {
    var a = draft[0], b = draft[1]; if (!a || !b) return;
    if (b < a) { var t = a; a = b; b = t; }
    cur = [a, b]; setBtn();
    try { localStorage.setItem(KEY, JSON.stringify({ from: iso(a), to: iso(b) })); } catch (e) { }
    closePop(true); announce();
  }
  function announce() { document.dispatchEvent(new CustomEvent('sn:range', { detail: { from: cur[0], to: cur[1], label: label(cur[0], cur[1]) } })); }

  function pickDay(d) {
    if (!draft[0] || draft[1]) { draft = [d, null]; hover = null; }
    else if (d < draft[0]) { draft = [d, draft[0]]; }
    else draft = [draft[0], d];
    focus = d; render(true);
  }
  function moveFocus(d) {
    if (d > TODAY) d = TODAY; if (d < MIN) d = MIN;
    focus = d;
    if (!visible(d)) { var m = d.getFullYear() * 12 + d.getMonth(), v = view.getFullYear() * 12 + view.getMonth(); setView(m < v ? d : d0(d.getFullYear(), d.getMonth() - 1, 1)); clampView(); }
    render(true);
  }

  /* ---- events ---- */
  btn.addEventListener('click', function (e) { e.stopPropagation(); openState ? closePop(true) : openPop(); });
  back.addEventListener('click', function () { closePop(true); });
  document.addEventListener('click', function (e) { if (openState && !wrap.contains(e.target)) closePop(false); });
  window.addEventListener('resize', function () { if (openState) place(); });

  pop.addEventListener('click', function (e) {
    e.stopPropagation();
    var t = e.target.closest('button'); if (!t) return;
    if (t.classList.contains('dpd')) { pickDay(parse(t.dataset.d)); return; }
    if (t.dataset.nav) { view = d0(view.getFullYear(), view.getMonth() + (+t.dataset.nav), 1); clampView(); render(false); return; }
    if (t.classList.contains('dpq')) { var r = PRESETS[+t.dataset.p][1](); draft = [r[0], r[1]]; hover = null; focus = r[0]; viewFor(r[0], r[1]); clampView(); ensureFocus(); render(false); return; }
    if (t.classList.contains('dpok')) { apply(); return; }
    if (t.classList.contains('dpcl') || t.classList.contains('dpx')) closePop(true);
  });
  pop.addEventListener('change', function (e) {
    var m = pop.querySelector('.dpms'), y = pop.querySelector('.dpys');
    if (e.target === m || e.target === y) { view = d0(+y.value, +m.value, 1); clampView(); render(false); }
  });
  pop.addEventListener('mouseover', function (e) {
    var t = e.target.closest('.dpd'); if (!t || !draft[0] || draft[1]) return;
    var d = parse(t.dataset.d); if (!same(d, hover)) { hover = d; paintHover(); }
  });
  pop.addEventListener('mouseleave', function () { if (hover) { hover = null; paintHover(); } });
  function paintHover() {
    var a = draft[0], b = hover; if (!a) return;
    var lo = b && b < a ? b : a, hi = b && b < a ? a : b;
    [].slice.call(pop.querySelectorAll('.dpd')).forEach(function (el) {
      var d = parse(el.dataset.d);
      el.classList.toggle('mid', !!(hi && d > lo && d < hi));
      el.classList.toggle('hv', !!(hi && same(d, b) && !same(a, b)));
    });
  }
  pop.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closePop(true); return; }
    var t = e.target.closest ? e.target.closest('.dpd') : null; if (!t) return;
    var d = parse(t.dataset.d), n = null;
    if (e.key === 'ArrowLeft') n = new Date(d - DAY); else if (e.key === 'ArrowRight') n = new Date(+d + DAY);
    else if (e.key === 'ArrowUp') n = new Date(d - 7 * DAY); else if (e.key === 'ArrowDown') n = new Date(+d + 7 * DAY);
    else if (e.key === 'PageUp') n = d0(d.getFullYear(), d.getMonth() - 1, d.getDate()); else if (e.key === 'PageDown') n = d0(d.getFullYear(), d.getMonth() + 1, d.getDate());
    else if (e.key === 'Home') n = new Date(d - d.getDay() * DAY); else if (e.key === 'End') n = new Date(+d + (6 - d.getDay()) * DAY);
    if (n) { e.preventDefault(); moveFocus(n); }
  });
  /* simple focus trap while open (Tab cycles through the popover) */
  pop.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = [].slice.call(pop.querySelectorAll('button:not([disabled]):not([tabindex="-1"]),select')); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  setBtn();
  window.ShopNowRange = { get: function () { return { from: cur[0], to: cur[1] }; } };
  announce();
})();
