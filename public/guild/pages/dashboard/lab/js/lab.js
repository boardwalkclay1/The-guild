// public/guild/pages/dashboard/lab/js/hybrid-lab.js
// Single-file Hybrid Lab engine: auto-inject orb, toolbox, signals, news, clock, pattern scan.
// Attach this to any dashboard page that has stock iframes and ticker IDs.

(function () {
  // =========================
  // CONFIG
  // =========================
  var LAB_CONFIG = {
    pageIndex: 1,                 // you can override via data-attribute if needed
    tickers: [],                  // if empty, we’ll try to infer from DOM
    newsHeadlines: [
      'Guild Hybrid Lab initialized.',
      'Scanning candlestick patterns across active tickers.',
      'Bullish and bearish engulfing patterns monitored in real time.',
      'Hammer, Doji, and Inside Bar detection enabled.',
      'Top 5 signals will link directly to their charts.'
    ]
  };

  // =========================
  // UTILITIES
  // =========================
  function $(sel) {
    return document.querySelector(sel);
  }
  function $all(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  function createEl(tag, opts) {
    var el = document.createElement(tag);
    if (!opts) return el;
    if (opts.className) el.className = opts.className;
    if (opts.id) el.id = opts.id;
    if (opts.text) el.textContent = opts.text;
    if (opts.html) el.innerHTML = opts.html;
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (k) {
        el.setAttribute(k, opts.attrs[k]);
      });
    }
    return el;
  }

  // Smooth scroll helper
  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // =========================
  // CLOCK
  // =========================
  function initClock(container) {
    function update() {
      var now = new Date();
      var time = now.toLocaleTimeString('en-US', { hour12: true });
      container.textContent = time;
    }
    update();
    setInterval(update, 1000);
  }

  // =========================
  // NEWS TICKER
  // =========================
  function initNewsTicker(container, headlines) {
    if (!headlines || !headlines.length) return;
    var span = createEl('span');
    span.textContent = headlines.join('  •  ');
    container.innerHTML = '';
    container.appendChild(span);
  }

  // =========================
  // PATTERN DETECTION (STUB, REAL LOGIC READY)
  // =========================
  // candles: [{open, high, low, close}, ...] last = most recent
  function detectBullishEngulfing(candles) {
    if (!candles || candles.length < 2) return false;
    var prev = candles[candles.length - 2];
    var curr = candles[candles.length - 1];
    var prevRed = prev.close < prev.open;
    var currGreen = curr.close > curr.open;
    var engulfBody = curr.open <= prev.close && curr.close >= prev.open;
    return prevRed && currGreen && engulfBody;
  }

  function detectBearishEngulfing(candles) {
    if (!candles || candles.length < 2) return false;
    var prev = candles[candles.length - 2];
    var curr = candles[candles.length - 1];
    var prevGreen = prev.close > prev.open;
    var currRed = curr.close < curr.open;
    var engulfBody = curr.open >= prev.close && curr.close <= prev.open;
    return prevGreen && currRed && engulfBody;
  }

  // TODO: hammer, shooting star, doji, inside bar, etc.
  function scanTickerPatterns(ticker, candles) {
    var matches = [];
    if (detectBullishEngulfing(candles)) {
      matches.push({ pattern: 'Bullish Engulfing', strength: 90 });
    }
    if (detectBearishEngulfing(candles)) {
      matches.push({ pattern: 'Bearish Engulfing', strength: 90 });
    }
    return matches;
  }

  // For now, fake candles. Replace with real OHLC fetch.
  function getCandlesForTicker(ticker) {
    // You’ll plug in your real data source here.
    return Promise.resolve([
      { open: 100, high: 105, low: 98, close: 99 },
      { open: 98, high: 104, low: 97, close: 103 }
    ]);
  }

  function scanAllTickers(pageIndex, tickers) {
    var promises = tickers.map(function (t) {
      return getCandlesForTicker(t).then(function (candles) {
        var matches = scanTickerPatterns(t, candles);
        return matches.map(function (m) {
          return {
            ticker: t,
            pattern: m.pattern,
            strength: m.strength,
            page: pageIndex
          };
        });
      });
    });

    return Promise.all(promises).then(function (results) {
      return results.reduce(function (acc, arr) {
        return acc.concat(arr);
      }, []);
    });
  }

  // =========================
  // HIGHLIGHT / OVERLAYS (BASIC)
  // =========================
  function highlightChart(ticker) {
    var el = document.getElementById('chart-' + ticker);
    if (!el) return;
    el.classList.add('hybrid-lab-highlight');
    setTimeout(function () {
      el.classList.remove('hybrid-lab-highlight');
    }, 2000);
  }

  // =========================
  // ORB + TOOLBOX + SIGNALS
  // =========================
  function createOrbUI() {
    // Top bar
    var topbar = createEl('header', { className: 'hybrid-lab-topbar' });
    var news = createEl('div', { className: 'hybrid-lab-news', id: 'HybridLabNews' });
    var clock = createEl('div', { className: 'hybrid-lab-clock', id: 'HybridLabClock', text: '--:--:--' });
    topbar.appendChild(news);
    topbar.appendChild(clock);
    document.body.insertBefore(topbar, document.body.firstChild);

    // Orb layer
    var orbLayer = createEl('div', { className: 'hybrid-lab-orb-layer' });
    document.body.appendChild(orbLayer);

    // Orb
    var orb = createEl('div', { className: 'hybrid-lab-orb', id: 'HybridLabOrb' });
    var orbInner = createEl('div', { className: 'hybrid-lab-orb-inner', text: '⚡' });
    orb.appendChild(orbInner);
    orbLayer.appendChild(orb);

    // Panel
    var panel = createEl('div', { className: 'hybrid-lab-orb-panel hybrid-lab-hidden', id: 'HybridLabPanel' });
    panel.innerHTML = [
      '<h3>Hybrid Lab Toolbox</h3>',
      '<div class="hybrid-lab-section">',
      '  <h4>Candlestick Signals</h4>',
      '  <button class="hybrid-lab-tool" data-pattern="bullish-engulfing">Bullish Engulfing</button>',
      '  <button class="hybrid-lab-tool" data-pattern="bearish-engulfing">Bearish Engulfing</button>',
      '  <button class="hybrid-lab-tool" data-pattern="hammer">Hammer</button>',
      '  <button class="hybrid-lab-tool" data-pattern="shooting-star">Shooting Star</button>',
      '  <button class="hybrid-lab-tool" data-pattern="doji">Doji</button>',
      '  <button class="hybrid-lab-tool" data-pattern="inside-bar">Inside Bar</button>',
      '</div>',
      '<div class="hybrid-lab-section">',
      '  <h4>Structure & Lines</h4>',
      '  <button class="hybrid-lab-tool" data-overlay="trendline">Trendline</button>',
      '  <button class="hybrid-lab-tool" data-overlay="triangle">Triangle</button>',
      '  <button class="hybrid-lab-tool" data-overlay="flag">Flag</button>',
      '  <button class="hybrid-lab-tool" data-overlay="wedge">Wedge</button>',
      '  <button class="hybrid-lab-tool" data-overlay="head-shoulders">Head & Shoulders</button>',
      '</div>',
      '<div class="hybrid-lab-section">',
      '  <h4>Top 5 Signals</h4>',
      '  <ul id="HybridLabSignals" class="hybrid-lab-signals"></ul>',
      '</div>'
    ].join('');
    orbLayer.appendChild(panel);

    // Orb toggle
    orb.addEventListener('click', function () {
      panel.classList.toggle('hybrid-lab-hidden');
    });

    return {
      news: news,
      clock: clock,
      orb: orb,
      panel: panel,
      signalsList: $('#HybridLabSignals')
    };
  }

  function fillSignals(signals, currentPage, signalsList) {
    if (!signalsList) return;
    var pageSignals = signals
      .filter(function (s) { return s.page === currentPage; })
      .sort(function (a, b) { return b.strength - a.strength; })
      .slice(0, 5);

    signalsList.innerHTML = '';
    if (!pageSignals.length) {
      signalsList.innerHTML = '<li>No signals detected yet.</li>';
      return;
    }

    pageSignals.forEach(function (sig) {
      var li = createEl('li');
      li.innerHTML =
        '<strong>' + sig.ticker + '</strong> — ' +
        sig.pattern + ' (' + sig.strength + ') ' +
        '<span class="hybrid-lab-signal-link" data-ticker="' + sig.ticker + '">View chart</span>';
      signalsList.appendChild(li);
    });

    signalsList.addEventListener('click', function (e) {
      var target = e.target;
      if (!target.classList.contains('hybrid-lab-signal-link')) return;
      var ticker = target.getAttribute('data-ticker');
      if (!ticker) return;
      var chart = document.getElementById('chart-' + ticker);
      if (!chart) return;
      scrollToEl(chart);
      highlightChart(ticker);
    });
  }

  // =========================
  // STYLE INJECTION
  // =========================
  function injectStyles() {
    if (document.getElementById('HybridLabStyles')) return;
    var css = `
      .hybrid-lab-topbar {
        position:fixed;
        top:0;
        left:0;
        right:0;
        z-index:9998;
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:6px 12px;
        background:#050505;
        border-bottom:1px solid #333;
        font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        font-size:0.85rem;
      }
      body { padding-top:32px; }
      .hybrid-lab-news {
        overflow:hidden;
        white-space:nowrap;
        color:#ccc;
      }
      .hybrid-lab-news span {
        display:inline-block;
        padding-left:100%;
        animation:hybridLabTicker 30s linear infinite;
      }
      @keyframes hybridLabTicker {
        0% { transform:translateX(0); }
        100% { transform:translateX(-100%); }
      }
      .hybrid-lab-clock {
        color:#D4AF37;
      }
      .hybrid-lab-orb-layer {
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        pointer-events:none;
        z-index:9999;
      }
      .hybrid-lab-orb {
        position:fixed;
        right:24px;
        bottom:24px;
        width:64px;
        height:64px;
        border-radius:50%;
        background:radial-gradient(circle at 30% 30%, #fff8d0, #D4AF37 40%, #5b430f 100%);
        box-shadow:0 0 18px rgba(212,175,55,0.8);
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;
        pointer-events:auto;
        animation:hybridLabOrbBreath 3s ease-in-out infinite;
      }
      .hybrid-lab-orb-inner {
        font-size:1.6rem;
        color:#000;
      }
      @keyframes hybridLabOrbBreath {
        0%,100% { transform:translateY(0) scale(1); box-shadow:0 0 14px rgba(212,175,55,0.7); }
        50% { transform:translateY(-3px) scale(1.05); box-shadow:0 0 22px rgba(212,175,55,1); }
      }
      .hybrid-lab-orb-panel {
        position:fixed;
        right:24px;
        bottom:100px;
        width:280px;
        max-height:70vh;
        background:#050505;
        border:1px solid #333;
        border-radius:14px;
        box-shadow:0 0 24px rgba(0,0,0,0.8);
        padding:10px 12px;
        pointer-events:auto;
        overflow-y:auto;
        font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        font-size:0.8rem;
      }
      .hybrid-lab-hidden { display:none; }
      .hybrid-lab-orb-panel h3 {
        margin:0 0 6px;
        font-size:0.95rem;
        color:#D4AF37;
      }
      .hybrid-lab-section {
        margin-top:8px;
      }
      .hybrid-lab-section h4 {
        margin:0 0 4px;
        font-size:0.8rem;
        color:#ccc;
      }
      .hybrid-lab-tool {
        display:inline-block;
        margin:3px 4px;
        padding:3px 7px;
        font-size:0.75rem;
        border-radius:999px;
        border:1px solid #444;
        background:#111;
        color:#eee;
        cursor:pointer;
      }
      .hybrid-lab-tool:hover {
        border-color:#D4AF37;
        color:#D4AF37;
      }
      .hybrid-lab-signals {
        list-style:none;
        padding:0;
        margin:4px 0 0;
      }
      .hybrid-lab-signals li {
        margin-bottom:4px;
      }
      .hybrid-lab-signal-link {
        color:#D4AF37;
        cursor:pointer;
        text-decoration:underline;
      }
      .hybrid-lab-highlight {
        box-shadow:0 0 0 2px #D4AF37, 0 0 18px #D4AF37 !important;
        transition:box-shadow 0.3s ease;
      }
    `;
    var style = document.createElement('style');
    style.id = 'HybridLabStyles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // =========================
  // TICKER DISCOVERY
  // =========================
  function discoverTickers() {
    if (LAB_CONFIG.tickers && LAB_CONFIG.tickers.length) return LAB_CONFIG.tickers;
    var blocks = $all('[id^="chart-"]');
    var tickers = blocks.map(function (b) {
      return b.id.replace('chart-', '');
    });
    LAB_CONFIG.tickers = tickers;
    return tickers;
  }

  // =========================
  // INIT
  // =========================
  function initHybridLab() {
    injectStyles();

    var ui = createOrbUI();
    initClock(ui.clock);
    initNewsTicker(ui.news, LAB_CONFIG.newsHeadlines);

    var tickers = discoverTickers();
    if (!tickers.length) return;

    scanAllTickers(LAB_CONFIG.pageIndex, tickers).then(function (signals) {
      fillSignals(signals, LAB_CONFIG.pageIndex, ui.signalsList);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHybridLab);
  } else {
    initHybridLab();
  }
})();
