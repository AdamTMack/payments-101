// Payment Processing 101 — Detail Panel
// Click-to-explore slide-in panel with enriched content, cross-references, and practical guidance

(function() {
  'use strict';

  var panelContent = {
    'customer': {
      title: 'Customer',
      aliases: 'Also called: Cardholder, Buyer, Consumer',
      body: '<p>The person purchasing goods, services, or digital entitlements from a Business. They provide payment using a credit card, debit card, or other payment method.</p>',
      example: 'When you tap your card at a coffee shop, you are the Customer in this system.',
      appearsIn: [
        { label: 'Step 1: The Customer Decides to Buy', target: 'lifecycle-1' },
        { label: 'Step 2: Payment Details Reach the Gateway', target: 'lifecycle-2' },
        { label: 'Step 7: Customer Sees the Result', target: 'lifecycle-7' },
        { label: 'Card Present vs. Card Not Present', target: 'card-present' }
      ],
      connectedTo: [
        { player: 'business', label: 'Business (pays for goods/services)' }
      ],
      inPractice: [
        'Customers can dispute charges through their issuing bank (chargebacks)',
        'Card-not-present transactions shift fraud liability to the merchant',
        'Strong customer authentication (SCA) is required in some regions'
      ]
    },
    'business': {
      title: 'Business',
      aliases: 'Also called: Merchant, Seller, Vendor',
      body: '<p>The legal entity selling goods, services, or digital entitlements to the Customer. They need to receive payment from the Customer in order to fulfill their order.</p>',
      example: 'The coffee shop accepting your card payment is the Business. They could be a solo operator or a Fortune 500 company \u2014 the payment system treats them the same way.',
      appearsIn: [
        { label: 'Step 1: The Customer Decides to Buy', target: 'lifecycle-1' },
        { label: 'Step 2: Payment Details Reach the Gateway', target: 'lifecycle-2' },
        { label: 'Step 7: Customer Sees the Result', target: 'lifecycle-7' },
        { label: 'Step 9: Funds Arrive at the Business', target: 'lifecycle-9' },
        { label: 'Card Present vs. Card Not Present', target: 'card-present' },
        { label: 'Where the Fees Come From', target: 'fees' }
      ],
      connectedTo: [
        { player: 'customer', label: 'Customer (receives payment from)' },
        { player: 'business-bank', label: 'Business Bank (settlement destination)' },
        { player: 'gateway', label: 'Payment Gateway (sends payment data to)' }
      ],
      inPractice: [
        'Merchant Category Code (MCC) affects interchange rates',
        'PCI compliance level depends on transaction volume',
        'Chargeback ratios above ~1% can result in fines or account termination'
      ]
    },
    'business-bank': {
      title: 'Business Bank Account',
      aliases: 'Also called: Merchant Account, Settlement Account',
      body: '<p>When the Customer pays the Business, the funds ultimately need to be deposited into a bank account owned by the Business. This is where the money actually lands after the entire payment process completes.</p>',
      example: 'The coffee shop\'s checking account at their local bank. Settlement funds arrive here, typically 1-3 business days after the transaction.',
      appearsIn: [
        { label: 'Step 9: Funds Arrive at the Business', target: 'lifecycle-9' }
      ],
      connectedTo: [
        { player: 'business', label: 'Business (account owner)' },
        { player: 'acquirer', label: 'Acquirer (deposits settlement funds)' }
      ],
      inPractice: [
        'Settlement timing varies: next-day, T+2, or weekly batches',
        'Reconciliation between transactions and deposits is a major operational task',
        'Some platforms (Stripe, Square) offer instant or next-day payouts for a fee'
      ]
    },
    'gateway': {
      title: 'Payment Gateway',
      aliases: 'Also called: Gateway Provider',
      body: '<p>A service that securely captures and transmits payment information from the point-of-sale system or checkout interface to the payment processor. It handles encryption and security of sensitive card data during transmission.</p><p>The gateway provides the payment surfaces that customers interact with \u2014 physical terminals, online checkout forms, and in-app payment screens.</p>',
      example: 'When you see a checkout form on a website asking for your card number, that form is provided by the Payment Gateway. It encrypts your card details before sending them downstream.',
      appearsIn: [
        { label: 'Step 2: Payment Details Reach the Gateway', target: 'lifecycle-2' },
        { label: 'Step 3: Gateway Encrypts and Forwards', target: 'lifecycle-3' },
        { label: 'Step 6: Authorization Response Travels Back', target: 'lifecycle-6' },
        { label: 'Step 7: Customer Sees the Result', target: 'lifecycle-7' },
        { label: 'Card Present vs. Card Not Present', target: 'card-present' }
      ],
      connectedTo: [
        { player: 'business', label: 'Business (receives payment details from)' },
        { player: 'processor', label: 'Processor (forwards auth requests to)' }
      ],
      inPractice: [
        'Does it support tokenization and PCI-DSS scope reduction?',
        'What payment surfaces does it offer (web, mobile, in-store)?',
        'Does it provide built-in fraud detection tools?',
        'What is the checkout conversion rate compared to alternatives?'
      ]
    },
    'processor': {
      title: 'Payment Processor',
      aliases: 'Also called: Payment Service Provider, PSP',
      body: '<p>A service that handles the technical aspects of the transaction \u2014 validating payment information, obtaining authorization from the issuing bank, and managing communication between the acquiring and issuing banks.</p>',
      example: 'Think of the processor as the translator and traffic controller. It takes the encrypted payment data and routes it through the correct channels to get an answer: approved or declined.',
      appearsIn: [
        { label: 'Step 3: Gateway Encrypts and Forwards', target: 'lifecycle-3' },
        { label: 'Step 4: Processor Routes to the Network', target: 'lifecycle-4' },
        { label: 'Step 6: Authorization Response Travels Back', target: 'lifecycle-6' }
      ],
      connectedTo: [
        { player: 'gateway', label: 'Gateway (receives auth requests from)' },
        { player: 'acquirer', label: 'Acquirer (routes to card network via)' }
      ],
      inPractice: [
        'Does the processor support local acquiring in your key markets?',
        'What is their authorization approval rate?',
        'Do they offer smart routing and fallback processing?',
        'What reporting and analytics are available?'
      ]
    },
    'acquirer': {
      title: 'Acquiring Bank',
      aliases: 'Also called: Acquirer, Merchant Bank',
      body: '<p>The financial institution that holds the merchant\'s acquiring account, receives payments on its behalf, processes each transaction, and settles the funds into the merchant\'s Business Bank Account.</p>',
      example: 'The acquirer is the Business\'s representative in the banking network. They vouch for the merchant and handle the settlement of funds on their behalf.',
      appearsIn: [
        { label: 'Step 4: Processor Routes to the Network', target: 'lifecycle-4' },
        { label: 'Step 6: Authorization Response Travels Back', target: 'lifecycle-6' },
        { label: 'Step 8: Settlement Begins', target: 'lifecycle-8' },
        { label: 'Step 9: Funds Arrive at the Business', target: 'lifecycle-9' }
      ],
      connectedTo: [
        { player: 'processor', label: 'Processor (receives routed transactions)' },
        { player: 'card-network', label: 'Card Network (connects to issuer via)' },
        { player: 'business-bank', label: 'Business Bank (deposits settled funds)' }
      ],
      inPractice: [
        'Acquiring licenses are region-specific \u2014 check coverage in your markets',
        'Direct acquiring vs. third-party acquiring affects settlement speed',
        'Acquirer relationship determines your interchange qualification'
      ]
    },
    'card-network': {
      title: 'Card Network',
      aliases: 'Also called: Card Scheme, Card Brand (Visa, Mastercard, Amex, Discover)',
      body: '<p>Organizations that establish the rules, standards, and infrastructure for processing transactions using their branded payment instruments (credit and debit cards). They operate the rails that connect acquiring banks to issuing banks worldwide.</p>',
      example: 'Visa and Mastercard don\'t issue cards or hold your money \u2014 they operate the network that connects the banks on both sides of every transaction.',
      appearsIn: [
        { label: 'Step 4: Processor Routes to the Network', target: 'lifecycle-4' },
        { label: 'Step 5: Card Network Reaches the Issuer', target: 'lifecycle-5' },
        { label: 'Step 6: Authorization Response Travels Back', target: 'lifecycle-6' },
        { label: 'Step 8: Settlement Begins', target: 'lifecycle-8' },
        { label: 'Where the Fees Come From', target: 'fees' }
      ],
      connectedTo: [
        { player: 'acquirer', label: 'Acquirer (receives transactions from)' },
        { player: 'issuer', label: 'Issuer (routes authorization requests to)' }
      ],
      inPractice: [
        'Scheme fees (assessments) are set by the network and non-negotiable',
        'Network tokenization can improve authorization rates',
        'Different networks have different rules for chargebacks and disputes',
        'Amex and Discover operate as both network and issuer'
      ]
    },
    'issuer': {
      title: 'Customer\'s Bank',
      aliases: 'Also called: Issuing Bank, Issuer, Card Issuer',
      body: '<p>The financial institution that issued the payment card to the customer. They are responsible for authorizing or declining the transaction based on the customer\'s account status, available funds, fraud indicators, and other risk factors.</p>',
      example: 'If you have a Chase Visa card, Chase is the Issuing Bank. When you tap your card, Chase is the one deciding whether to approve or decline the transaction.',
      appearsIn: [
        { label: 'Step 5: Card Network Reaches the Issuer', target: 'lifecycle-5' },
        { label: 'Step 6: Authorization Response Travels Back', target: 'lifecycle-6' },
        { label: 'Step 8: Settlement Begins', target: 'lifecycle-8' },
        { label: 'Authorization vs. Capture vs. Settlement', target: 'auth-capture-settlement' }
      ],
      connectedTo: [
        { player: 'card-network', label: 'Card Network (receives auth requests via)' }
      ],
      inPractice: [
        'Issuer risk scoring is the primary driver of declines',
        'Soft declines can sometimes be retried successfully',
        'Interchange fees are set by the issuer\'s network',
        'The issuer handles the customer side of chargebacks'
      ]
    }
  };

  var panel = document.getElementById('detail-panel');
  var overlay = document.getElementById('detail-panel-overlay');
  var titleEl = document.getElementById('panel-title');
  var aliasesEl = document.getElementById('panel-aliases');
  var bodyEl = document.getElementById('panel-body');

  function openPanel(playerId) {
    var content = panelContent[playerId];
    if (!content) return;

    titleEl.textContent = content.title;
    aliasesEl.textContent = content.aliases;

    var html = content.body;

    if (content.example) {
      html += '<div class="panel-example">' + content.example + '</div>';
    }

    if (content.appearsIn && content.appearsIn.length) {
      html += '<div class="panel-section"><div class="panel-section-label">Appears in</div>';
      content.appearsIn.forEach(function(item) {
        html += '<a class="panel-link" data-scroll-target="' + item.target + '">' + item.label + '</a>';
      });
      html += '</div>';
    }

    if (content.connectedTo && content.connectedTo.length) {
      html += '<div class="panel-section"><div class="panel-section-label">Connected to</div>';
      content.connectedTo.forEach(function(item) {
        html += '<a class="panel-connected" data-open-player="' + item.player + '">' + item.label + '</a>';
      });
      html += '</div>';
    }

    if (content.inPractice && content.inPractice.length) {
      html += '<div class="panel-section"><div class="panel-section-label">In practice</div>';
      html += '<div class="panel-practice"><ul>';
      content.inPractice.forEach(function(q) {
        html += '<li>' + q + '</li>';
      });
      html += '</ul></div></div>';
    }

    bodyEl.innerHTML = html;
    panel.classList.add('open');
    overlay.classList.add('visible');
  }

  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('visible');
  }

  // Listen for clicks on diagram nodes (both main diagram and inline mobile nodes)
  document.addEventListener('click', function(e) {
    var node = e.target.closest('.diagram-node, .inline-node');
    if (node && node.dataset.player) {
      openPanel(node.dataset.player);
      return;
    }
  });

  // Handle panel cross-reference clicks
  bodyEl.addEventListener('click', function(e) {
    var scrollLink = e.target.closest('[data-scroll-target]');
    if (scrollLink) {
      var target = scrollLink.dataset.scrollTarget;
      closePanel();
      var el = document.querySelector('[data-step="' + target + '"]') ||
               document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    var playerLink = e.target.closest('[data-open-player]');
    if (playerLink) {
      openPanel(playerLink.dataset.openPlayer);
      panel.scrollTop = 0;
      return;
    }
  });

  // Close panel
  var closeBtn = document.querySelector('.panel-close');
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (overlay) overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePanel();
  });
})();
