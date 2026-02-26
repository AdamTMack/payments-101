// Payment Processing 101 — Scroll Manager
// Handles IntersectionObserver, scroll position tracking, progress bar, and section activation

(function() {
  'use strict';

  const SECTION_IDS = [
    'hero',
    'players',
    'lifecycle',
    'auth-capture-settlement',
    'card-present',
    'fees',
    'modern-platforms',
    'site-footer'
  ];

  let activeSection = null;
  let activeStep = null;

  // --- Progress Bar ---
  function updateProgressBar() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = Math.min((scrollTop / docHeight) * 100, 100);
    document.getElementById('progress-bar').style.width = progress + '%';
  }

  // --- Section Observer ---
  // Trigger zone shifted upward: diagram is fixed at viewport bottom,
  // so content reads in the top ~55%. Trigger at ~25-35% from top.
  function initSectionObserver() {
    var options = {
      root: null,
      rootMargin: '-25% 0px -55% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var sectionId = entry.target.id;
          if (sectionId !== activeSection) {
            activeSection = sectionId;
            document.dispatchEvent(new CustomEvent('sectionchange', {
              detail: { section: sectionId }
            }));
          }
        }
      });
    }, options);

    SECTION_IDS.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // --- Step Observer (for lifecycle and other multi-step sections) ---
  // Narrower trigger zone in the upper portion of the viewport
  function initStepObserver() {
    var options = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var stepId = entry.target.dataset.step;
          var sectionId = entry.target.closest('section').id;
          if (stepId !== activeStep) {
            activeStep = stepId;
            document.dispatchEvent(new CustomEvent('stepchange', {
              detail: { section: sectionId, step: stepId }
            }));
          }
        }
      });
    }, options);

    document.querySelectorAll('[data-step]').forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- Reveal Observer (entrance animations) ---
  function initRevealObserver() {
    var options = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.reveal').forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- Init ---
  function init() {
    window.addEventListener('scroll', updateProgressBar, { passive: true });
    updateProgressBar();
    initSectionObserver();
    initStepObserver();
    initRevealObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
