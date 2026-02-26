// Payment Processing 101 — Diagram Controller
// Manages SVG diagram states, transitions, and animations based on active section/step

(function() {
  'use strict';

  function container() { return document.getElementById('diagram-container'); }
  function allNodes() { return document.querySelectorAll('.diagram-node'); }
  function allPaths() { return document.querySelectorAll('.diagram-path'); }
  function allOverlays() { return document.querySelectorAll('.platform-overlay'); }

  // --- Diagram visibility ---
  function showDiagram() {
    var el = container();
    if (el) {
      el.classList.remove('hidden');
      el.style.opacity = '1';
    }
  }

  function hideDiagram() {
    var el = container();
    if (el) el.classList.add('hidden');
  }

  // --- State Reset ---
  function resetAll() {
    allNodes().forEach(function(n) {
      n.classList.remove('active', 'dimmed', 'active-settlement');
    });
    allPaths().forEach(function(p) {
      p.classList.remove('active-path', 'active-settlement-path', 'animating', 'animating-settlement', 'dimmed');
    });
    allOverlays().forEach(function(o) {
      o.classList.remove('visible');
    });
    showDiagram();
  }

  // --- Helpers ---
  function activateNodes(names) {
    allNodes().forEach(function(n) {
      if (names.indexOf(n.dataset.player) !== -1) {
        n.classList.add('active');
        n.classList.remove('dimmed');
      } else {
        n.classList.add('dimmed');
        n.classList.remove('active');
      }
    });
  }

  function activatePaths(names, animate) {
    allPaths().forEach(function(p) {
      if (names.indexOf(p.dataset.path) !== -1) {
        p.classList.add('active-path');
        if (animate) p.classList.add('animating');
        p.classList.remove('dimmed');
      } else {
        p.classList.add('dimmed');
        p.classList.remove('active-path', 'animating');
      }
    });
  }

  function showOverlay(platform) {
    allOverlays().forEach(function(o) {
      if (o.dataset.platform === platform) {
        o.classList.add('visible');
      } else {
        o.classList.remove('visible');
      }
    });
  }

  // --- Section Handlers ---
  var sectionHandlers = {
    'hero': function() {
      resetAll();
      hideDiagram();
    },

    'players': function() {
      resetAll();
    },

    'lifecycle': function() {
      resetAll();
    },

    'auth-capture-settlement': function() {
      resetAll();
    },

    'card-present': function() {
      resetAll();
      activateNodes(['customer', 'business', 'gateway']);
    },

    'fees': function() {
      resetAll();
      hideDiagram();
    },

    'modern-platforms': function() {
      resetAll();
    },

    'site-footer': function() {
      resetAll();
      hideDiagram();
    }
  };

  // --- Step Handlers ---
  var stepHandlers = {
    // Players section: highlight one player at a time
    'player-customer': function() { resetAll(); activateNodes(['customer']); },
    'player-business': function() { resetAll(); activateNodes(['business']); },
    'player-business-bank': function() { resetAll(); activateNodes(['business-bank']); },
    'player-gateway': function() { resetAll(); activateNodes(['gateway']); },
    'player-processor': function() { resetAll(); activateNodes(['processor']); },
    'player-acquirer': function() { resetAll(); activateNodes(['acquirer']); },
    'player-card-network': function() { resetAll(); activateNodes(['card-network']); },
    'player-issuer': function() { resetAll(); activateNodes(['issuer']); },

    // Lifecycle steps 1-9
    'lifecycle-1': function() {
      resetAll();
      activateNodes(['customer', 'business']);
      activatePaths(['customer-to-business'], true);
    },
    'lifecycle-2': function() {
      resetAll();
      activateNodes(['customer', 'business', 'gateway']);
      activatePaths(['customer-to-business', 'business-to-gateway'], true);
    },
    'lifecycle-3': function() {
      resetAll();
      activateNodes(['gateway', 'processor']);
      activatePaths(['gateway-to-processor'], true);
    },
    'lifecycle-4': function() {
      resetAll();
      activateNodes(['processor', 'acquirer', 'card-network']);
      activatePaths(['processor-to-acquirer', 'acquirer-to-card-network'], true);
    },
    'lifecycle-5': function() {
      resetAll();
      activateNodes(['card-network', 'issuer']);
      activatePaths(['card-network-to-issuer'], true);
    },
    'lifecycle-6': function() {
      resetAll();
      activateNodes(['issuer', 'card-network', 'acquirer', 'processor', 'gateway']);
      activatePaths(['issuer-to-card-network', 'card-network-to-acquirer', 'acquirer-to-processor', 'processor-to-gateway'], true);
    },
    'lifecycle-7': function() {
      resetAll();
      activateNodes(['gateway', 'business', 'customer']);
      activatePaths(['gateway-to-business', 'business-to-customer'], true);
    },
    'lifecycle-8': function() {
      resetAll();
      allNodes().forEach(function(n) {
        if (['issuer', 'acquirer', 'business-bank'].indexOf(n.dataset.player) !== -1) {
          n.classList.add('active-settlement');
        } else {
          n.classList.add('dimmed');
        }
      });
      allPaths().forEach(function(p) {
        if (p.classList.contains('settlement-path')) {
          p.classList.add('active-settlement-path', 'animating-settlement');
          p.classList.remove('dimmed');
        } else {
          p.classList.add('dimmed');
        }
      });
    },
    'lifecycle-9': function() {
      resetAll();
      allNodes().forEach(function(n) {
        if (['acquirer', 'business-bank', 'business'].indexOf(n.dataset.player) !== -1) {
          n.classList.add('active-settlement');
        } else {
          n.classList.add('dimmed');
        }
      });
    },

    // Auth/Capture/Settlement sub-steps
    'acs-auth': function() {
      resetAll();
      activateNodes(['customer', 'business', 'gateway', 'processor', 'acquirer', 'card-network', 'issuer']);
      activatePaths([
        'customer-to-business', 'business-to-gateway', 'gateway-to-processor',
        'processor-to-acquirer', 'acquirer-to-card-network', 'card-network-to-issuer'
      ], true);
      allPaths().forEach(function(p) {
        if (p.classList.contains('settlement-path')) p.classList.add('dimmed');
      });
    },
    'acs-capture': function() {
      resetAll();
      activateNodes(['business', 'gateway', 'processor']);
      activatePaths(['business-to-gateway', 'gateway-to-processor'], true);
    },
    'acs-settlement': function() {
      resetAll();
      allNodes().forEach(function(n) {
        if (['issuer', 'card-network', 'acquirer', 'business-bank'].indexOf(n.dataset.player) !== -1) {
          n.classList.add('active-settlement');
        } else {
          n.classList.add('dimmed');
        }
      });
      allPaths().forEach(function(p) {
        if (p.classList.contains('settlement-path')) {
          p.classList.add('active-settlement-path', 'animating-settlement');
        } else {
          p.classList.add('dimmed');
        }
      });
    },

    // Modern platforms
    'platform-adyen': function() { resetAll(); showOverlay('adyen'); },
    'platform-stripe': function() { resetAll(); showOverlay('stripe'); },
    'platform-square': function() { resetAll(); showOverlay('square'); },
  };

  // --- Active step tracking ---
  var diagramTitle = document.getElementById('diagram-title');

  function updateActiveStep(stepId) {
    // Toggle step-active class on scroll-steps
    document.querySelectorAll('.scroll-step').forEach(function(el) {
      if (el.dataset.step === stepId) {
        el.classList.add('step-active');
      } else {
        el.classList.remove('step-active');
      }
    });

    // Update diagram drawer title
    if (diagramTitle) {
      var stepEl = document.querySelector('[data-step="' + stepId + '"]');
      var h3 = stepEl ? stepEl.querySelector('h3') : null;
      if (h3) {
        diagramTitle.textContent = h3.textContent;
        diagramTitle.classList.add('visible');
      } else {
        diagramTitle.classList.remove('visible');
      }
    }
  }

  function clearActiveStep() {
    document.querySelectorAll('.scroll-step').forEach(function(el) {
      el.classList.remove('step-active');
    });
    if (diagramTitle) diagramTitle.classList.remove('visible');
  }

  // --- Event Listeners ---
  document.addEventListener('sectionchange', function(e) {
    var handler = sectionHandlers[e.detail.section];
    if (handler) handler();
    // Clear active step when entering sections without steps (hero, fees, footer)
    if (['hero', 'fees', 'site-footer'].indexOf(e.detail.section) !== -1) {
      clearActiveStep();
    }
  });

  document.addEventListener('stepchange', function(e) {
    var handler = stepHandlers[e.detail.step];
    if (handler) handler();
    updateActiveStep(e.detail.step);
  });

  // --- Click-to-expand diagram ---
  (function() {
    var el = container();
    if (!el) return;

    var closeBtn = el.querySelector('.diagram-close');

    function expandDiagram() {
      el.classList.add('expanded');
    }

    function collapseDiagram() {
      el.classList.remove('expanded');
    }

    el.addEventListener('click', function(e) {
      if (e.target.closest('.diagram-node')) return;
      if (e.target.closest('.diagram-close')) return;
      if (el.classList.contains('expanded')) {
        collapseDiagram();
      } else {
        expandDiagram();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        collapseDiagram();
      });
    }

    window.addEventListener('scroll', function() {
      if (el.classList.contains('expanded')) {
        collapseDiagram();
      }
    }, { passive: true });

    document.addEventListener('click', function(e) {
      if (el.classList.contains('expanded') && !el.contains(e.target)) {
        collapseDiagram();
      }
    });
  })();
})();
