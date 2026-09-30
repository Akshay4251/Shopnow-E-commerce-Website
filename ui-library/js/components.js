/* ============================================================
   SHOP UI — COMMON COMPONENT BEHAVIOR
   Requires jQuery. Include after jQuery, before your page script.
   Every helper below is opt-in: it only runs on elements that
   carry the matching data-attribute, so it's safe to include on
   every page regardless of which components that page uses.
   ============================================================ */
$(function () {

  /* ---------- Navbar: mobile menu toggle ---------- */
  $('.navbar__toggle').on('click', function () {
    $(this).closest('.navbar').find('.navbar__mobile-panel').toggleClass('is-open');
    const expanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', String(!expanded));
  });

  /* ---------- Modal ----------
     Open:  <button data-modal-open="idExample">Open</button>
     Close: <button data-modal-close> inside the modal, or click backdrop, or Esc
     Markup: #idExample.modal > .modal__dialog, plus a matching
             #idExample-backdrop.modal-backdrop sibling.
  */
  function openModal(id) {
    $('#' + id).addClass('is-open').attr('aria-hidden', 'false');
    $('#' + id + '-backdrop').addClass('is-open');
    $('body').css('overflow', 'hidden');
    $('#' + id).find('[autofocus], input, button').first().trigger('focus');
  }
  function closeModal($modal) {
    const id = $modal.attr('id');
    $modal.removeClass('is-open').attr('aria-hidden', 'true');
    $('#' + id + '-backdrop').removeClass('is-open');
    $('body').css('overflow', '');
  }
  $(document).on('click', '[data-modal-open]', function (e) {
    e.preventDefault();
    openModal($(this).data('modal-open'));
  });
  $(document).on('click', '[data-modal-close]', function (e) {
    e.preventDefault();
    closeModal($(this).closest('.modal'));
  });
  $(document).on('click', '.modal-backdrop', function () {
    closeModal($('#' + $(this).attr('id').replace('-backdrop', '')));
  });
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.modal.is-open').each(function () { closeModal($(this)); });
    }
  });

  /* ---------- Alerts: dismissible ---------- */
  $(document).on('click', '.alert__close', function () {
    $(this).closest('.alert').fadeOut(150, function () { $(this).remove(); });
  });

  /* ---------- Product card: wishlist toggle ---------- */
  $(document).on('click', '.product-card__wishlist', function () {
    $(this).toggleClass('is-active');
    const active = $(this).hasClass('is-active');
    $(this).find('i, svg').attr('data-active', active);
  });

  /* ---------- Form: simple required-field validation ----------
     Add data-validate to a <form>; fields with `required` get
     .is-invalid on blur/submit if empty, .is-valid otherwise.
  */
  $(document).on('blur', 'form[data-validate] [required]', function () {
    validateField($(this));
  });
  $(document).on('submit', 'form[data-validate]', function (e) {
    let valid = true;
    $(this).find('[required]').each(function () {
      if (!validateField($(this))) valid = false;
    });
    if (!valid) e.preventDefault();
  });
  function validateField($field) {
    const ok = $field.val() !== null && $field.val().toString().trim() !== '';
    $field.toggleClass('is-invalid', !ok).toggleClass('is-valid', ok);
    return ok;
  }

});

/* ============================================================
   Loading spinner overlay — plain JS, usable before jQuery
   loads or from any fetch/AJAX call.
   Usage:
     showLoading();               // full-page overlay
     ...call your fake API...
     hideLoading();
   ============================================================ */
function showLoading() {
  if (document.getElementById('global-spinner-overlay')) return;
  const el = document.createElement('div');
  el.id = 'global-spinner-overlay';
  el.className = 'spinner-overlay';
  el.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(el);
}
function hideLoading() {
  const el = document.getElementById('global-spinner-overlay');
  if (el) el.remove();
}
