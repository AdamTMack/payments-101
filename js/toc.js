// Payment Processing 101 — Floating TOC
// Minimal table-of-contents overlay with active section tracking

(function() {
  'use strict';

  var toggle = document.getElementById('toc-toggle');
  var menu = document.getElementById('toc-menu');
  if (!toggle || !menu) return;

  var links = menu.querySelectorAll('a[data-section]');

  function openMenu() {
    menu.classList.remove('toc-hidden');
  }

  function closeMenu() {
    menu.classList.add('toc-hidden');
  }

  function isOpen() {
    return !menu.classList.contains('toc-hidden');
  }

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('click', function(e) {
    if (isOpen() && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  links.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  document.addEventListener('sectionchange', function(e) {
    var active = e.detail.section;
    links.forEach(function(link) {
      if (link.dataset.section === active) {
        link.classList.add('toc-active');
      } else {
        link.classList.remove('toc-active');
      }
    });
  });
})();
