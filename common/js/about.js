/**
 * ===================================================
 * SHOPNOW - ABOUT PAGE JAVASCRIPT (FIGMA IMAGE 3 MATCHING)
 * Animated counter metrics using IntersectionObserver
 * ===================================================
 */

$(document).ready(function () {
  'use strict';

  function animateCounters() {
    $('.stat-counter').each(function () {
      const $this = $(this);
      const target = parseInt($this.data('target'));
      if ($this.hasClass('animated')) return;
      $this.addClass('animated');

      $({ count: 0 }).animate({ count: target }, {
        duration: 1600,
        easing: 'swing',
        step: function () {
          $this.text(Math.floor(this.count));
        },
        complete: function () {
          $this.text(target);
        }
      });
    });
  }

  // Run animation when visible
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const statsSection = document.querySelector('.about-stats-navy-bar');
    if (statsSection) observer.observe(statsSection);
  } else {
    animateCounters();
  }
});
