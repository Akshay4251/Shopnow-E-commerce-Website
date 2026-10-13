$(function () {
  const KEY = 'shopnow_current_user', DEMO_KEY = 'shopnow_seller_demo', PHOTO_KEY = 'shopnow_seller_photo';
  function readJSON(k) { try { const v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function isSeller(u) { return !!u && (u.role === 'seller' || (!u.role && u.businessName)); }
  const logged = readJSON(KEY), storeKey = isSeller(logged) ? KEY : DEMO_KEY;
  let user = isSeller(logged) ? logged : Object.assign({ role: 'seller', name: 'Riya Sharma', businessName: 'Riya Home Studio', password: 'seller123' }, readJSON(DEMO_KEY) || {});
  const name = user.name || user.fullName || 'Seller';
  function initials(n) { const p = n.trim().split(/\s+/).filter(Boolean); return p.length ? (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase() : 'S'; }
  $('#hdrInitials').text(initials(name)); $('#hdrName').text(name); $('#hdrBusiness').text(user.businessName || 'Seller account');
  const photo = localStorage.getItem(PHOTO_KEY);
  if (photo) { $('#hdrImg').attr('src', photo).prop('hidden', false); $('#hdrInitials').hide(); }
  let tt;
  function toast(msg, err) { const $t = $('#toast').text(msg).toggleClass('error', !!err).addClass('show'); clearTimeout(tt); tt = setTimeout(() => $t.removeClass('show'), 2800); }
  $('#menuBtn').on('click', function (e) { e.stopPropagation(); const open = $('#menuList').prop('hidden'); $('#menuList').prop('hidden', !open); $(this).attr('aria-expanded', open); });
  $(document).on('click', function () { $('#menuList').prop('hidden', true); $('#menuBtn').attr('aria-expanded', false); });
  $(document).on('keydown', function (e) { if (e.key === 'Escape') $('#menuList').prop('hidden', true); });
  $('#logoutBtn').on('click', function (e) { e.preventDefault(); localStorage.removeItem(KEY); window.location.href = '../../common/html/login.html'; });

  $('.sn-eye').on('click', function () {
    const $i = $('#' + $(this).data('for')), show = $i.attr('type') === 'password';
    $i.attr('type', show ? 'text' : 'password');
    $(this).attr('aria-label', show ? 'Hide password' : 'Show password').find('i').toggleClass('bi-eye', !show).toggleClass('bi-eye-slash', show);
  });
  function setErr($i, msg) { const $f = $i.closest('.sn-field'); $f.toggleClass('invalid', !!msg); $f.find('.sn-err').text(msg || ''); return !msg; }
  function checks(p, cur) { return { len: p.length >= 8, case: /[a-z]/.test(p) && /[A-Z]/.test(p), num: /\d/.test(p), diff: !!p && p !== cur }; }
  function refresh() {
    const p = $('#pNew').val(), c = checks(p, $('#pCur').val());
    let score = 0;
    Object.keys(c).forEach(function (k) { const ok = c[k]; if (ok) score++; $('#rules li[data-r="' + k + '"]').toggleClass('ok', ok).find('i').attr('class', 'bi ' + (ok ? 'bi-check-circle-fill' : 'bi-circle')); });
    if (/[^A-Za-z0-9]/.test(p) && p.length >= 8) score = Math.min(4, score + 0);
    const pct = p ? score * 25 : 0, lbl = !p ? 'Enter a new password' : score <= 1 ? 'Weak' : score <= 3 ? 'Fair' : 'Strong';
    $('#meter').css({ width: pct + '%', background: score <= 1 ? '#d92d20' : score <= 3 ? '#f79009' : '#12b76a' });
    $('#meterLbl').text(lbl); return c;
  }
  $('#pwForm').on('input', 'input', function () { $(this).closest('.sn-field').removeClass('invalid'); refresh(); });
  $('#pwForm').on('submit', function (e) {
    e.preventDefault();
    const cur = $('#pCur').val(), nw = $('#pNew').val(), con = $('#pCon').val(), c = refresh();
    const res = [
      setErr($('#pCur'), !cur ? 'Enter your current password.' : (user.password && cur !== user.password ? 'Current password is incorrect.' : '')),
      setErr($('#pNew'), !nw ? 'Enter a new password.' : !(c.len && c.case && c.num) ? 'Password does not meet the requirements.' : !c.diff ? 'New password must be different from the current one.' : ''),
      setErr($('#pCon'), con !== nw ? 'Passwords do not match.' : '')
    ];
    if (!res.every(Boolean)) { toast('Please fix the highlighted fields.', true); $('.sn-field.invalid input').first().trigger('focus'); return; }
    user = Object.assign({}, user, { password: nw });
    try { localStorage.setItem(storeKey, JSON.stringify(user)); } catch (err) { toast('Could not save password.', true); return; }
    this.reset(); refresh(); $('#ok').prop('hidden', false); toast('Password updated.'); window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  refresh();
});
