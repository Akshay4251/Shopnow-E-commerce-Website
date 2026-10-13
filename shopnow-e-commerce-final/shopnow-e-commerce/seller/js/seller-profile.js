/* Seller – Seller Profile page
   Data: shopnow_current_user (when the logged-in user is a seller), otherwise a demo seller
   kept in shopnow_seller_demo. Photo: shopnow_seller_photo. */
$(function () {
  const KEY = 'shopnow_current_user';
  const DEMO_KEY = 'shopnow_seller_demo';
  const PHOTO_KEY = 'shopnow_seller_photo';

  const DEMO = {
    role: 'seller',
    name: 'Riya Sharma',
    email: 'riya@riyahomestudio.in',
    phone: '+91 98765 43210',
    businessName: 'Riya Home Studio',
    taxId: '27ABCDE1234F1Z5',
    businessAddress: '24, Linking Road, Bandra West, Mumbai 400050',
    bankAccount: 'XXXX 4821',
    password: 'seller123',
    createdAt: '2024-01-12'
  };

  /* ---------- storage ---------- */
  function readJSON(k) {
    try { const v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : null; }
    catch (e) { return null; }
  }
  function isSeller(u) { return !!u && (u.role === 'seller' || (!u.role && u.businessName)); }
  function normalize(u) {
    return Object.assign({}, u, {
      name: u.name || u.fullName || '',
      email: u.email || '',
      phone: u.phone || '',
      businessName: u.businessName || u.business || '',
      taxId: u.taxId || u.gst || '',
      businessAddress: u.businessAddress || u.address || '',
      bankAccount: u.bankAccount || '',
      createdAt: u.createdAt || u.memberSince || '2024-01-12'
    });
  }
  const logged = readJSON(KEY);
  const storeKey = isSeller(logged) ? KEY : DEMO_KEY;
  let user = normalize(isSeller(logged) ? logged : Object.assign({}, DEMO, readJSON(DEMO_KEY) || {}));

  function save() {
    try { localStorage.setItem(storeKey, JSON.stringify(user)); return true; }
    catch (e) { return false; }
  }

  /* ---------- helpers ---------- */
  function initials(name) {
    const p = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return 'S';
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }
  function maskBank(v) {
    const d = (v || '').replace(/\D/g, '');
    return d.length >= 4 ? 'XXXX ' + d.slice(-4) : (v || '—');
  }
  function fmtDate(s) {
    const d = new Date(s);
    return isNaN(d) ? '—' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  let tt;
  function toast(msg, isError) {
    const $t = $('#toast').text(msg).toggleClass('error', !!isError).addClass('show');
    clearTimeout(tt);
    tt = setTimeout(() => $t.removeClass('show'), 2800);
  }

  /* ---------- render ---------- */
  function render() {
    const ini = initials(user.name);
    $('#hdrInitials, #avatarInitials').text(ini);
    $('#hdrName').text(user.name || 'Seller');
    $('#hdrBusiness').text(user.businessName || 'Seller account');
    $('#sideName').text(user.name || '—');
    $('#sideBusiness').text(user.businessName || '—');
    $('#memberSince').text(fmtDate(user.createdAt));

    $('#vName').text(user.name || '—');
    $('#vEmail').text(user.email || '—');
    $('#vPhone').text(user.phone || '—');
    $('#vBusiness').text(user.businessName || '—');
    $('#vTax').text(user.taxId || '—');
    $('#vAddress').text(user.businessAddress || '—');
    $('#vBank').text(user.bankAccount ? maskBank(user.bankAccount) : '—');

    const photo = localStorage.getItem(PHOTO_KEY);
    if (photo) {
      $('#avatarImg, #hdrImg').attr('src', photo).prop('hidden', false);
      $('#avatarInitials, #hdrInitials').hide();
      $('#photoRemoveBtn').prop('disabled', false);
    } else {
      $('#avatarImg, #hdrImg').prop('hidden', true).removeAttr('src');
      $('#avatarInitials, #hdrInitials').show();
      $('#photoRemoveBtn').prop('disabled', true);
    }
  }

  /* ---------- edit mode ---------- */
  function setErr($input, msg) {
    const $f = $input.closest('.sn-field');
    $f.toggleClass('invalid', !!msg);
    $f.find('.sn-err').text(msg || '');
    return !msg;
  }
  function openEdit() {
    $('#fName').val(user.name);
    $('#fEmail').val(user.email);
    $('#fPhone').val(user.phone);
    $('#fBusiness').val(user.businessName);
    $('#fTax').val(user.taxId);
    $('#fAddress').val(user.businessAddress);
    $('#fBank').val(user.bankAccount);
    $('.sn-field').removeClass('invalid').find('.sn-err').text('');
    $('#viewMode').prop('hidden', true);
    $('#editMode').prop('hidden', false);
    $('#editBtn').prop('hidden', true);
    $('#fName').trigger('focus');
  }
  function closeEdit() {
    $('#editMode').prop('hidden', true);
    $('#viewMode').prop('hidden', false);
    $('#editBtn').prop('hidden', false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $('#editBtn').on('click', openEdit);
  $('#cancelBtn').on('click', closeEdit);
  $('#editMode').on('input', 'input', function () { $(this).closest('.sn-field').removeClass('invalid'); });

  function validate() {
    const phone = $('#fPhone').val().trim();
    const digits = phone.replace(/\D/g, '');
    const tax = $('#fTax').val().trim();
    const bank = $('#fBank').val().trim();
    return [
      setErr($('#fName'), $('#fName').val().trim().length < 2 ? 'Enter your full name.' : ''),
      setErr($('#fEmail'), !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#fEmail').val().trim()) ? 'Enter a valid email address.' : ''),
      setErr($('#fPhone'), (digits.length < 7 || digits.length > 15 || !/^[+\d\s()-]+$/.test(phone)) ? 'Enter a valid phone number.' : ''),
      setErr($('#fBusiness'), $('#fBusiness').val().trim().length < 2 ? 'Enter your business name.' : ''),
      setErr($('#fTax'), !/^[0-9A-Za-z]{15}$/.test(tax) ? 'Tax ID must be 15 letters or digits.' : ''),
      setErr($('#fAddress'), $('#fAddress').val().trim().length < 5 ? 'Enter your business address.' : ''),
      setErr($('#fBank'), !(/^[\dXx*\s-]{4,24}$/.test(bank) && /\d{4}\s*$/.test(bank)) ? 'Enter your account number (ending in 4 digits).' : '')
    ].every(Boolean);
  }

  $('#editMode').on('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      toast('Please fix the highlighted fields.', true);
      $('.sn-field.invalid input').first().trigger('focus');
      return;
    }
    user = Object.assign({}, user, {
      name: $('#fName').val().trim(),
      email: $('#fEmail').val().trim(),
      phone: $('#fPhone').val().trim(),
      businessName: $('#fBusiness').val().trim(),
      taxId: $('#fTax').val().trim().toUpperCase(),
      businessAddress: $('#fAddress').val().trim(),
      bankAccount: $('#fBank').val().trim()
    });
    if (!save()) { toast('Could not save changes. Check your browser storage.', true); return; }
    render();
    closeEdit();
    toast('Profile saved.');
  });

  /* ---------- photo: change / remove ---------- */
  $('#photoBtn').on('click', () => $('#photoInput').trigger('click'));
  $('#photoInput').on('change', function () {
    const f = this.files[0];
    if (!f) return;
    if (!/^image\/(png|jpeg)$/.test(f.type)) { toast('Choose a JPG or PNG image.', true); this.value = ''; return; }
    if (f.size > 2 * 1024 * 1024) { toast('Photo must be 2 MB or smaller.', true); this.value = ''; return; }
    const r = new FileReader();
    r.onload = function () {
      try { localStorage.setItem(PHOTO_KEY, r.result); render(); toast('Photo updated.'); }
      catch (err) { toast('Could not store photo.', true); }
    };
    r.readAsDataURL(f);
    this.value = '';
  });
  $('#photoRemoveBtn').on('click', function () {
    localStorage.removeItem(PHOTO_KEY);
    render();
    toast('Photo removed.');
  });

  /* ---------- account menu + logout ---------- */
  $('#menuBtn').on('click', function (e) {
    e.stopPropagation();
    const open = $('#menuList').prop('hidden');
    $('#menuList').prop('hidden', !open);
    $(this).attr('aria-expanded', open);
  });
  $(document).on('click', function () { $('#menuList').prop('hidden', true); $('#menuBtn').attr('aria-expanded', false); });
  $(document).on('keydown', function (e) { if (e.key === 'Escape') $('#menuList').prop('hidden', true); });
  $('#logoutBtn').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem(KEY);
    window.location.href = '../../common/html/login.html';
  });

  render();
});
