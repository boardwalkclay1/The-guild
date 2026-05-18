// ====== CONFIG & CONSTANTS ======
const strikePrice = 100;
const basePremium = 5;          // “Monday” richness
const upperStrike = 110;
const lowerStrike = 90;
const CONTRACT_SIZE = 100;

let portfolioBalance = 10000;
let tradeHistory = [10000];

const newsEvents = [
  { text: "Fed hints at surprise rate move.", effect: -3 },
  { text: "Earnings crush expectations, volume spikes.", effect: 4 },
  { text: "Macro data spooks the whole market.", effect: -4 },
  { text: "AI sector catches a fresh upgrade wave.", effect: 3 },
  { text: "Volatility index jumps—fear creeping in.", effect: -2 },
  { text: "GDP print comes in hotter than forecast.", effect: 2 },
  { text: "Unemployment drops, risk-on mood builds.", effect: 3 },
  { text: "Geopolitical headline hits the tape.", effect: -3 }
];

const strategyDescriptions = {
  call: `<strong>📘 Buy Call:</strong><br>- You’re betting the stock rips higher.<br>- Upside is open, downside is just the premium.<br>- Great when you expect a strong move up, not a slow grind.`,
  put: `<strong>📘 Buy Put:</strong><br>- You’re betting the stock gets smoked.<br>- Profit when price dives below strike.<br>- Clean way to short without blowing up on margin.`,
  straddle: `<strong>📘 Straddle:</strong><br>- Buy a call and a put at the same strike.<br>- You don’t care which way it moves—just that it moves big.<br>- Dies slowly if the stock goes nowhere and time decay eats you.`,
  collar: `<strong>📘 Collar:</strong><br>- Own stock, buy a put, sell a call on top.<br>- You cap your upside and your downside on purpose.<br>- Classic “protect the bag” move when you’re already in the name.`,
  sell_call: `<strong>📘 Sell Call:</strong><br>- You’re renting out your upside for premium.<br>- Great if you think price chills or drifts down.<br>- Dangerous if the stock moons—you’re on the hook.`,
  sell_put: `<strong>📘 Sell Put:</strong><br>- You’re getting paid to promise you’ll buy lower.<br>- Works if price holds or drifts up.<br>- If it nukes, you’re catching the falling knife by contract.`
};

const mentorLines = [
  "Every click is a rep. Don’t chase perfection—chase understanding.",
  "Watch how volatility changes the path. That’s where options really live.",
  "If you don’t know your max loss, you’re not trading—you’re gambling.",
  "Straddles love chaos. If nothing happens, they quietly bleed out.",
  "Selling options feels like free money—until it doesn’t. Respect the risk.",
  "Your first job isn’t to win big. It’s to stay in the game.",
  "Collars are boring on purpose. Boring keeps portfolios alive.",
  "If a move surprises you, log it. Patterns show up faster than you think.",
  "Don’t fall in love with green numbers. They can vanish in one candle.",
  "Red trades are tuition. Just don’t pay the same lesson twice.",
  "High volatility is like a storm—beautiful, but it doesn’t care about you.",
  "If you’re guessing, size small. If you’re convicted, still size small.",
  "The chart is the arena. Your emotions are the real opponent.",
  "Premium is the price of a seat at the table. Use it wisely.",
  "You don’t need to trade every setup. You need to crush the right ones.",
  "When in doubt, slow down. Rushed trades are usually donations.",
  "Track your portfolio curve, not just single trades. That’s the real score.",
  "If a strategy confuses you, don’t size it—study it.",
  "The Guild doesn’t reward recklessness. It rewards discipline and reps.",
  "You’re not behind. You’re just earlier in the grind than you think.",
  "Stop losses aren’t weakness—they’re armor for the next round.",
  "Time decay is silent. Learn to hear it anyway."
];

const mentorImages = [
  "/market/img/gmi-1.jpg",
  "/market/img/gmi-2.jpg",
  "/market/img/gmi-3.jpg",
  "/market/img/gmi-4.jpg",
  "/market/img/gmi-5.jpg"
];

// ====== STATE ======
let simCount = 0;
let portfolioChartInstance;
let stockChartInstance;

// live round state
let currentPath = [];
let currentHeadlines = [];
let currentStep = 0;
let totalSteps = 30;
let liveInterval = null;
let liveRunning = false;

let openTrades = []; // {id,type,entryStep,entryPriceOpt,strike,basePremium,qty,stopLossPct,closed,pl}
let tradeIdCounter = 1;

// ====== MENTOR ======
function rotateMentorLine() {
  simCount++;
  const lineIndex = simCount % mentorLines.length;
  const imgIndex = Math.floor(lineIndex / 4) % mentorImages.length;

  const mentorTextEl = document.getElementById("mentorText");
  const mentorImgEl = document.getElementById("mentorImg");
  const mentorBubble = document.getElementById("mentorBubble");

  mentorTextEl.innerText = mentorLines[lineIndex];
  mentorImgEl.style.backgroundImage = `url('${mentorImages[imgIndex]}')`;

  mentorBubble.classList.remove("fade-in-mentor");
  void mentorBubble.offsetWidth;
  mentorBubble.classList.add("fade-in-mentor");
}

// ====== UI HELPERS ======
function updateStrategyExplanation() {
  const strategy = document.getElementById("strategy").value;
  document.getElementById("strategyInfo").innerHTML = strategyDescriptions[strategy];
}

function getVolatilityRange(level) {
  return { low: 1.0, medium: 2.5, high: 5.0 }[level] || 2.5;
}

function getRandomMovement(volatility, bias = 0) {
  return (Math.random() - 0.5) * 2 * volatility + bias;
}

// difficultyPhase: 1 = trend up, 2 = chop, 3 = trend down
function simulateStockPath(startPrice, steps, volatility, difficultyPhase = 1) {
  let price = startPrice;
  const path = [price];
  const headlines = [];

  let bias = 0;
  if (difficultyPhase === 1) bias = 0.4;
  if (difficultyPhase === 2) bias = 0;
  if (difficultyPhase === 3) bias = -0.4;

  for (let i = 0; i < steps; i++) {
    let movement = getRandomMovement(volatility, bias);

    if (Math.random() < 0.35) {
      const news = newsEvents[Math.floor(Math.random() * newsEvents.length)];
      movement += news.effect;
      headlines.push(`T${i + 1}: ${news.text}`);
    } else {
      headlines.push(`T${i + 1}: No major headline—just order flow.`);
    }

    price += movement;
    price = Math.max(10, Math.min(price, 500));
    path.push(Number(price.toFixed(2)));
  }

  return { path, headlines };
}

// ====== OPTION PRICING ======
function payoff(stockPrice, strategy) {
  switch (strategy) {
    case "call": return Math.max(stockPrice - strikePrice, 0) - basePremium;
    case "put": return Math.max(strikePrice - stockPrice, 0) - basePremium;
    case "straddle":
      return Math.max(stockPrice - strikePrice, 0) +
             Math.max(strikePrice - stockPrice, 0) - 2 * basePremium;
    case "collar":
      return Math.min(Math.max(stockPrice - lowerStrike, 0), upperStrike - lowerStrike) - basePremium;
    case "sell_call":
      return -(Math.max(stockPrice - strikePrice, 0)) + basePremium;
    case "sell_put":
      return -(Math.max(strikePrice - stockPrice, 0)) + basePremium;
    default: return 0;
  }
}

// “Monday-expensive then decay” mark price
function optionMarketPrice(stockPrice, strategy, step, totalSteps, basePrem) {
  const tLeft = Math.max(totalSteps - step, 0);
  const timeFactor = tLeft / totalSteps; // 1 → 0
  const intrinsicCall = Math.max(stockPrice - strikePrice, 0);
  const intrinsicPut = Math.max(strikePrice - stockPrice, 0);

  switch (strategy) {
    case "call":
      return intrinsicCall + basePrem * timeFactor;
    case "put":
      return intrinsicPut + basePrem * timeFactor;
    case "straddle":
      return intrinsicCall + intrinsicPut + 2 * basePrem * timeFactor;
    default:
      return payoff(stockPrice, strategy) + basePrem * timeFactor;
  }
}

// ====== PORTFOLIO ======
function initializePortfolio() {
  const stored = localStorage.getItem('guildPortfolioBalance');
  const history = localStorage.getItem('guildPortfolioHistory');
  portfolioBalance = stored ? parseFloat(stored) : 10000;
  tradeHistory = history ? JSON.parse(history) : [portfolioBalance];
  updatePortfolioDisplay();
  updatePortfolioChart();
}

function updatePortfolioDisplay() {
  document.getElementById("portfolio").innerHTML =
    `💼 Guild Portfolio: <strong>$${portfolioBalance.toFixed(2)}</strong>`;
}

function applyTradeResult(profit) {
  portfolioBalance += profit;
  portfolioBalance = Math.max(0, portfolioBalance);
  tradeHistory.push(portfolioBalance);
  localStorage.setItem('guildPortfolioBalance', portfolioBalance);
  localStorage.setItem('guildPortfolioHistory', JSON.stringify(tradeHistory));
  updatePortfolioDisplay();
  updatePortfolioChart();
}

function resetPortfolio() {
  portfolioBalance = 10000;
  tradeHistory = [10000];
  localStorage.setItem('guildPortfolioBalance', portfolioBalance);
  localStorage.setItem('guildPortfolioHistory', JSON.stringify(tradeHistory));
  updatePortfolioDisplay();
  updatePortfolioChart();
  openTrades = [];
  updateOpenPositionsDisplay();
}

// ====== CHARTS ======
function renderChart(ctxId, label, data, color, yLabel) {
  const ctx = document.getElementById(ctxId).getContext('2d');

  if (ctxId === 'portfolioChart' && portfolioChartInstance) portfolioChartInstance.destroy();
  if (ctxId === 'payoffChart' && stockChartInstance) stockChartInstance.destroy();

  const newChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: data.length }, (_, i) => i),
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: { title: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Time Step' } },
        y: { title: { display: true, text: yLabel } }
      }
    }
  });

  if (ctxId === 'portfolioChart') portfolioChartInstance = newChart;
  if (ctxId === 'payoffChart') stockChartInstance = newChart;
}

function updatePortfolioChart() {
  renderChart('portfolioChart', 'Portfolio Growth', tradeHistory, '#28a745', 'Portfolio Value ($)');
}

function renderStockChart(prices, labelSuffix = "") {
  renderChart('payoffChart', `Stock Price Path ${labelSuffix}`, prices, '#00aaff', 'Stock Price ($)');
}

// ====== OPEN POSITIONS ======
function updateOpenPositionsDisplay(currentPrice = null, step = null) {
  const container = document.getElementById("openPositions");
  if (!openTrades.length) {
    container.innerHTML = "No open contracts. Start a live round, then fire a call, put, or straddle.";
    return;
  }

  let html = `<h3>🎯 Open Contracts</h3><ul style="text-align:left; max-width:700px; margin:8px auto 0;">`;
  openTrades.forEach(trade => {
    if (trade.closed) return;
    let livePL = 0;
    let mark = trade.entryPriceOpt;
    if (currentPrice !== null && step !== null) {
      mark = optionMarketPrice(currentPrice, trade.type, step, totalSteps, trade.basePremium);
      livePL = (mark - trade.entryPriceOpt) * CONTRACT_SIZE * trade.qty;
    }
    html += `<li>
      #${trade.id} – ${trade.type.toUpperCase()} @ strike $${trade.strike}, qty ${trade.qty}<br>
      Entry: $${trade.entryPriceOpt.toFixed(2)} | Mark: $${mark.toFixed(2)} |
      Live P/L: <span style="color:${livePL >= 0 ? 'lime' : 'red'};">$${livePL.toFixed(2)}</span>
    </li>`;
  });
  html += `</ul>`;
  container.innerHTML = html;
}

function openPosition(type) {
  if (!liveRunning) return;
  if (!currentPath.length) return;

  const step = currentStep;
  const price = currentPath[step];
  const stopLossPct = parseFloat(document.getElementById("stopLoss").value) || 30;

  const mark = optionMarketPrice(price, type, step, totalSteps, basePremium);
  const cost = mark * CONTRACT_SIZE;

  if (cost > portfolioBalance) return;

  portfolioBalance -= cost;
  updatePortfolioDisplay();

  const trade = {
    id: tradeIdCounter++,
    type,
    entryStep: step,
    entryPriceOpt: mark,
    strike: strikePrice,
    basePremium,
    qty: 1,
    stopLossPct,
    closed: false,
    pl: 0
  };

  openTrades.push(trade);
  updateOpenPositionsDisplay(price, step);
}

function closeTrade(trade, currentPrice, step) {
  if (trade.closed) return 0;
  const mark = optionMarketPrice(currentPrice, trade.type, step, totalSteps, trade.basePremium);
  const exitValue = mark * CONTRACT_SIZE * trade.qty;
  const entryValue = trade.entryPriceOpt * CONTRACT_SIZE * trade.qty;
  const pl = exitValue - entryValue;
  trade.closed = true;
  trade.pl = pl;
  portfolioBalance += exitValue;
  return pl;
}

function closeAllPositions() {
  if (!currentPath.length) {
    openTrades = [];
    updateOpenPositionsDisplay();
    return;
  }
  const price = currentPath[currentStep];
  let totalPL = 0;
  openTrades.forEach(trade => {
    totalPL += closeTrade(trade, price, currentStep);
  });
  applyTradeResult(totalPL);
  updateOpenPositionsDisplay(price, currentStep);
}

function enforceStops(currentPrice, step) {
  openTrades.forEach(trade => {
    if (trade.closed) return;
    const mark = optionMarketPrice(currentPrice, trade.type, step, totalSteps, trade.basePremium);
    const entryValue = trade.entryPriceOpt * CONTRACT_SIZE * trade.qty;
    const liveValue = mark * CONTRACT_SIZE * trade.qty;
    const pl = liveValue - entryValue;
    const stopLoss = -Math.abs(trade.stopLossPct / 100 * entryValue);
    if (pl <= stopLoss) {
      closeTrade(trade, currentPrice, step);
    }
  });
}

// ====== MODES ======
function startSimulation() {
  const mode = document.getElementById("mode").value;
  if (mode === "quick") {
    runQuickSim();
  } else {
    startLiveRound();
  }
}

function runQuickSim() {
  if (liveInterval) clearInterval(liveInterval);
  liveRunning = false;

  const strategy = document.getElementById("strategy").value;
  const startPrice = parseFloat(document.getElementById("startPrice").value);
  const steps = parseInt(document.getElementById("steps").value);
  const volatility = getVolatilityRange(document.getElementById("volatility").value);

  const phase = (simCount % 3) + 1;
  const { path: stockPath, headlines } = simulateStockPath(startPrice, steps, volatility, phase);
  const finalPrice = stockPath[stockPath.length - 1];
  const profitPerShare = payoff(finalPrice, strategy);
  const profit = profitPerShare * CONTRACT_SIZE;

  document.getElementById("news").innerHTML =
    `<h3>📰 Tape Recap</h3><ul style="text-align:left; max-width:700px; margin:8px auto 0;">` +
    headlines.map(h => `<li>${h}</li>`).join('') +
    `</ul>`;

  document.getElementById("result").innerHTML = `
    📊 Final Stock Price: <strong>$${finalPrice.toFixed(2)}</strong><br>
    🧠 Strategy Focus: <strong>${strategy.replace("_", " ").toUpperCase()}</strong><br>
    💵 P/L on this run (1 contract): <strong style="color:${profit >= 0 ? 'lime' : 'red'};">$${profit.toFixed(2)}</strong>
  `;

  renderStockChart(stockPath, `(Quick ${strategy.toUpperCase()})`);
  applyTradeResult(profit);
  rotateMentorLine();
}

function startLiveRound() {
  if (liveInterval) clearInterval(liveInterval);
  liveRunning = false;
  openTrades = [];
  updateOpenPositionsDisplay();

  const startPrice = parseFloat(document.getElementById("startPrice").value);
  totalSteps = parseInt(document.getElementById("steps").value) || 30;
  const volatility = getVolatilityRange(document.getElementById("volatility").value);

  const phase = (simCount % 3) + 1;
  const { path, headlines } = simulateStockPath(startPrice, totalSteps, volatility, phase);
  currentPath = path;
  currentHeadlines = headlines;
  currentStep = 0;

  document.getElementById("news").innerHTML =
    `<h3>📰 Tape Recap (Live)</h3><ul style="text-align:left; max-width:700px; margin:8px auto 0;" id="liveNewsList"></ul>`;

  document.getElementById("result").innerHTML = `
    ⏱ Live round armed. Price will move for ~${totalSteps} seconds. Place trades, respect your stop, and watch decay.
  `;

  renderStockChart([currentPath[0]], "(Live)");

  liveRunning = true;
  const tickMs = 1000; // 1 second per step

  liveInterval = setInterval(() => {
    if (currentStep >= totalSteps) {
      clearInterval(liveInterval);
      liveRunning = false;
      settleLiveRound();
      rotateMentorLine();
      return;
    }

    const price = currentPath[currentStep];
    const subPath = currentPath.slice(0, currentStep + 1);
    renderStockChart(subPath, "(Live)");

    const newsList = document.getElementById("liveNewsList");
    if (newsList && currentHeadlines[currentStep]) {
      const li = document.createElement("li");
      li.textContent = currentHeadlines[currentStep];
      newsList.appendChild(li);
    }

    enforceStops(price, currentStep);
    updateOpenPositionsDisplay(price, currentStep);

    document.getElementById("result").innerHTML = `
      ⏱ Tick ${currentStep + 1}/${totalSteps} | Spot: <strong>$${price.toFixed(2)}</strong><br>
      Open contracts auto‑respect stop loss. You can still close everything manually.
    `;

    currentStep++;
  }, tickMs);
}

function settleLiveRound() {
  const finalPrice = currentPath[currentPath.length - 1];
  let totalPL = 0;
  openTrades.forEach(trade => {
    if (!trade.closed) {
      totalPL += closeTrade(trade, finalPrice, totalSteps);
    } else {
      totalPL += trade.pl;
    }
  });

  applyTradeResult(totalPL);
  updateOpenPositionsDisplay(finalPrice, totalSteps);

  document.getElementById("result").innerHTML = `
    ✅ Round complete.<br>
    📊 Final Stock Price: <strong>$${finalPrice.toFixed(2)}</strong><br>
    💵 Total P/L from live contracts: <strong style="color:${totalPL >= 0 ? 'lime' : 'red'};">$${totalPL.toFixed(2)}</strong>
  `;
}

// ====== INIT ======
window.onload = function () {
  updateStrategyExplanation();
  initializePortfolio();
  updateOpenPositionsDisplay();
};
