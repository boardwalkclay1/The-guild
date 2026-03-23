// LEVEL 1 – Calm Market Pattern Trainer
// Hybrid: candles + pattern lines + explanations

const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");

let width, height, padding;
function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  width = rect.width;
  height = rect.height || 260;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  drawCurrentFrame();
});

// DOM elements
const patternNameEl = document.getElementById("patternName");
const patternDescriptionEl = document.getElementById("patternDescription");
const patternTaskEl = document.getElementById("patternTask");
const feedbackBox = document.getElementById("feedbackBox");
const statusCompletedEl = document.getElementById("statusCompleted");
const statusAccuracyEl = document.getElementById("statusAccuracy");
const fireFillEl = document.getElementById("fireFill");

const btnNextPattern = document.getElementById("btnNextPattern");
const btnShowHint = document.getElementById("btnShowHint");
const btnReplay = document.getElementById("btnReplay");
const tutorialOverlay = document.getElementById("tutorialOverlay");
const btnBeginTraining = document.getElementById("btnBeginTraining");

// Timer
const ROUND_TIME_MS = 20000;
let timerStart = null;
let timerInterval = null;

// Pattern state
let currentPattern = null;
let frame = 0;
let maxFrames = 120;
let drawingInterval = null;
let clickEnabled = false;
let completedCount = 0;
let totalAttempts = 0;
let correctAttempts = 0;

// Pattern definitions
const patterns = [
  {
    id: "double-bottom",
    name: "Double Bottom",
    description:
      "Price sells off, bounces, sells off again to a similar low, then breaks upward. It shows buyers defending the same level twice.",
    task:
      "Wait for the second bottom and the breakout above the middle high. Click where the breakout candle begins.",
    generator: generateDoubleBottom
  },
  {
    id: "double-top",
    name: "Double Top",
    description:
      "Price rallies, rejects, rallies again to a similar high, then breaks downward. It shows sellers defending the same level twice.",
    task:
      "Wait for the second top and the breakdown below the middle low. Click where the breakdown candle begins.",
    generator: generateDoubleTop
  },
  {
    id: "flag",
    name: "Bull Flag",
    description:
      "A strong move up, followed by a tight, downward‑sloping consolidation, then a continuation higher.",
    task:
      "Wait for the flag to complete and the breakout upward. Click where the breakout candle begins.",
    generator: generateFlag
  },
  {
    id: "rounding-bottom",
    name: "Rounding Bottom",
    description:
      "Price slowly curves from a downtrend into an uptrend, forming a bowl‑like shape before breaking higher.",
    task:
      "Wait for the curve to complete and the breakout above the prior resistance. Click where the breakout candle begins.",
    generator: generateRoundingBottom
  }
];

// Data for current pattern
let candles = [];
let patternLines = [];
let breakoutPoint = null; // {x, y, radius}

// Tutorial
btnBeginTraining.addEventListener("click", () => {
  tutorialOverlay.style.display = "none";
  startNewPattern();
});

// Controls
btnNextPattern.addEventListener("click", () => {
  startNewPattern();
});

btnReplay.addEventListener("click", () => {
  if (!currentPattern) return;
  startPatternDrawing(currentPattern);
});

btnShowHint.addEventListener("click", () => {
  if (!currentPattern || !breakoutPoint) return;
  feedbackBox.innerHTML =
    "Hint: Look for where the pattern <strong>breaks its structure</strong> — above resistance or below support.";
});

// Timer logic
function resetTimer() {
  timerStart = Date.now();
  updateFireMeter(1);
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - timerStart;
    const ratio = 1 - elapsed / ROUND_TIME_MS;
    if (ratio <= 0) {
      updateFireMeter(0);
      stopTimer();
      if (clickEnabled) {
        clickEnabled = false;
        feedbackBox.innerHTML =
          "<span style='color:#FF6347;'>Time expired. Watch the pattern again and try the next one.</span>";
      }
    } else {
      updateFireMeter(ratio);
    }
  }, 100);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateFireMeter(ratio) {
  const clamped = Math.max(0, Math.min(1, ratio));
  fireFillEl.style.height = clamped * 100 + "%";
}

// Pattern flow
function startNewPattern() {
  stopTimer();
  clickEnabled = false;
  feedbackBox.textContent =
    "Watch the pattern form. When it finishes, click the breakout or key decision point.";
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  currentPattern = pattern;
  patternNameEl.textContent = pattern.name;
  patternDescriptionEl.textContent = pattern.description;
  patternTaskEl.textContent = pattern.task;
  startPatternDrawing(pattern);
}

function startPatternDrawing(pattern) {
  stopTimer();
  clearInterval(drawingInterval);
  frame = 0;
  candles = [];
  patternLines = [];
  breakoutPoint = null;
  clickEnabled = false;
  drawCurrentFrame();

  const generated = pattern.generator();
  candles = generated.candles;
  patternLines = generated.lines;
  breakoutPoint = generated.breakout;

  drawingInterval = setInterval(() => {
    frame++;
    if (frame >= maxFrames) {
      clearInterval(drawingInterval);
      clickEnabled = true;
      resetTimer();
      startTimer();
      feedbackBox.innerHTML =
        "Pattern complete. <strong>Click the breakout / decision point</strong> on the chart.";
    }
    drawCurrentFrame();
  }, 60);
}

// Drawing
function drawCurrentFrame() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  // Background grid
  drawGrid();

  if (!candles.length) return;

  const visibleCount = Math.floor(
    (Math.min(frame, maxFrames) / maxFrames) * candles.length
  );

  drawCandles(candles.slice(0, visibleCount));
  drawPatternLines(patternLines, visibleCount);

  // If pattern complete and breakout known, optionally glow it faintly
  if (frame >= maxFrames && breakoutPoint) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(breakoutPoint.x, breakoutPoint.y, breakoutPoint.radius * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.restore();
  }
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  const stepX = width / 10;
  const stepY = height / 6;
  for (let x = 0; x <= width; x += stepX) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += stepY) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCandles(candleSlice) {
  const n = candleSlice.length;
  if (n === 0) return;
  const candleWidth = Math.max(4, width / (n * 1.8));
  const gap = candleWidth * 0.4;

  const prices = candleSlice.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  function yFor(price) {
    const t = (price - minPrice) / priceRange;
    return height - t * (height * 0.8) - height * 0.1;
  }

  candleSlice.forEach((c, i) => {
    const xCenter = (i + 0.5) * (candleWidth + gap) + 20;
    const openY = yFor(c.open);
    const closeY = yFor(c.close);
    const highY = yFor(c.high);
    const lowY = yFor(c.low);

    const bullish = c.close >= c.open;
    const bodyTop = bullish ? closeY : openY;
    const bodyBottom = bullish ? openY : closeY;

    ctx.save();
    ctx.strokeStyle = bullish ? "#32CD32" : "#FF6347";
    ctx.fillStyle = bullish ? "#32CD32" : "#FF6347";
    ctx.lineWidth = 1;

    // Wick
    ctx.beginPath();
    ctx.moveTo(xCenter, highY);
    ctx.lineTo(xCenter, lowY);
    ctx.stroke();

    // Body
    const bodyHeight = Math.max(2, bodyBottom - bodyTop);
    ctx.globalAlpha = 0.9;
    ctx.fillRect(
      xCenter - candleWidth / 2,
      bodyTop,
      candleWidth,
      bodyHeight
    );
    ctx.restore();
  });
}

function drawPatternLines(lines, visibleCount) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,215,0,0.8)";
  lines.forEach(line => {
    const maxIndex = visibleCount - 1;
    if (line.maxIndex !== undefined && line.maxIndex > maxIndex) return;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
  });
  ctx.restore();
}

// Pattern generators
function generateDoubleBottom() {
  const n = 40;
  const candles = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    let drift = 0;
    if (i < 10) drift = -0.8;
    else if (i < 18) drift = 0.4;
    else if (i < 26) drift = -0.7;
    else drift = 1.0;
    const open = price;
    price += drift + (Math.random() - 0.5) * 0.6;
    const close = price;
    const high = Math.max(open, close) + Math.random() * 0.6;
    const low = Math.min(open, close) - Math.random() * 0.6;
    candles.push({ open, high, low, close });
  }

  const prices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  function yFor(price) {
    const t = (price - minPrice) / priceRange;
    return height - t * (height * 0.8) - height * 0.1;
  }

  const candleWidth = Math.max(4, width / (n * 1.8));
  const gap = candleWidth * 0.4;
  function xForIndex(i) {
    return (i + 0.5) * (candleWidth + gap) + 20;
  }

  const lines = [];
  const midHighIndex = 18;
  const breakoutIndex = 30;

  const supportY = yFor(minPrice + priceRange * 0.1);
  lines.push({
    x1: xForIndex(5),
    y1: supportY,
    x2: xForIndex(34),
    y2: supportY,
    maxIndex: breakoutIndex
  });

  const midHighY = yFor(candles[midHighIndex].high);
  lines.push({
    x1: xForIndex(midHighIndex),
    y1: midHighY,
    x2: xForIndex(midHighIndex + 1),
    y2: midHighY,
    maxIndex: breakoutIndex
  });

  const breakoutX = xForIndex(breakoutIndex);
  const breakoutY = yFor(candles[breakoutIndex].open);

  return {
    candles,
    lines,
    breakout: { x: breakoutX, y: breakoutY, radius: 10 }
  };
}

function generateDoubleTop() {
  const n = 40;
  const candles = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    let drift = 0;
    if (i < 10) drift = 0.8;
    else if (i < 18) drift = -0.4;
    else if (i < 26) drift = 0.7;
    else drift = -1.0;
    const open = price;
    price += drift + (Math.random() - 0.5) * 0.6;
    const close = price;
    const high = Math.max(open, close) + Math.random() * 0.6;
    const low = Math.min(open, close) - Math.random() * 0.6;
    candles.push({ open, high, low, close });
  }

  const prices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  function yFor(price) {
    const t = (price - minPrice) / priceRange;
    return height - t * (height * 0.8) - height * 0.1;
  }

  const candleWidth = Math.max(4, width / (n * 1.8));
  const gap = candleWidth * 0.4;
  function xForIndex(i) {
    return (i + 0.5) * (candleWidth + gap) + 20;
  }

  const lines = [];
  const midLowIndex = 18;
  const breakdownIndex = 30;

  const resistanceY = yFor(maxPrice - priceRange * 0.1);
  lines.push({
    x1: xForIndex(5),
    y1: resistanceY,
    x2: xForIndex(34),
    y2: resistanceY,
    maxIndex: breakdownIndex
  });

  const midLowY = yFor(candles[midLowIndex].low);
  lines.push({
    x1: xForIndex(midLowIndex),
    y1: midLowY,
    x2: xForIndex(midLowIndex + 1),
    y2: midLowY,
    maxIndex: breakdownIndex
  });

  const breakoutX = xForIndex(breakdownIndex);
  const breakoutY = yFor(candles[breakdownIndex].open);

  return {
    candles,
    lines,
    breakout: { x: breakoutX, y: breakoutY, radius: 10 }
  };
}

function generateFlag() {
  const n = 40;
  const candles = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    let drift = 0;
    if (i < 10) drift = 1.2;
    else if (i < 26) drift = -0.3;
    else drift = 1.0;
    const open = price;
    price += drift + (Math.random() - 0.5) * 0.5;
    const close = price;
    const high = Math.max(open, close) + Math.random() * 0.5;
    const low = Math.min(open, close) - Math.random() * 0.5;
    candles.push({ open, high, low, close });
  }

  const prices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  function yFor(price) {
    const t = (price - minPrice) / priceRange;
    return height - t * (height * 0.8) - height * 0.1;
  }

  const candleWidth = Math.max(4, width / (n * 1.8));
  const gap = candleWidth * 0.4;
  function xForIndex(i) {
    return (i + 0.5) * (candleWidth + gap) + 20;
  }

  const lines = [];
  const flagStart = 10;
  const flagEnd = 26;
  const topY = yFor(maxPrice - priceRange * 0.15);
  const bottomY = topY + 18;

  lines.push({
    x1: xForIndex(flagStart),
    y1: topY,
    x2: xForIndex(flagEnd),
    y2: topY + 10,
    maxIndex: flagEnd
  });
  lines.push({
    x1: xForIndex(flagStart),
    y1: bottomY,
    x2: xForIndex(flagEnd),
    y2: bottomY + 10,
    maxIndex: flagEnd
  });

  const breakoutIndex = 30;
  const breakoutX = xForIndex(breakoutIndex);
  const breakoutY = yFor(candles[breakoutIndex].open);

  return {
    candles,
    lines,
    breakout: { x: breakoutX, y: breakoutY, radius: 10 }
  };
}

function generateRoundingBottom() {
  const n = 40;
  const candles = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const curve = -4 * (t - 0.5) * (t - 0.5) + 1; // inverted parabola
    const drift = (curve - 0.5) * 1.2;
    const open = price;
    price += drift + (Math.random() - 0.5) * 0.4;
    const close = price;
    const high = Math.max(open, close) + Math.random() * 0.4;
    const low = Math.min(open, close) - Math.random() * 0.4;
    candles.push({ open, high, low, close });
  }

  const prices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  function yFor(price) {
    const t = (price - minPrice) / priceRange;
    return height - t * (height * 0.8) - height * 0.1;
  }

  const candleWidth = Math.max(4, width / (n * 1.8));
  const gap = candleWidth * 0.4;
  function xForIndex(i) {
    return (i + 0.5) * (candleWidth + gap) + 20;
  }

  const lines = [];
  const leftIndex = 6;
  const rightIndex = 32;
  const resistanceY = yFor(maxPrice - priceRange * 0.2);

  lines.push({
    x1: xForIndex(leftIndex),
    y1: resistanceY,
    x2: xForIndex(rightIndex),
    y2: resistanceY,
    maxIndex: rightIndex
  });

  const breakoutIndex = 34;
  const breakoutX = xForIndex(breakoutIndex);
  const breakoutY = yFor(candles[breakoutIndex].open);

  return {
    candles,
    lines,
    breakout: { x: breakoutX, y: breakoutY, radius: 10 }
  };
}

// Click handling
canvas.addEventListener("click", (e) => {
  if (!clickEnabled || !breakoutPoint) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);

  totalAttempts++;

  const dx = x - breakoutPoint.x;
  const dy = y - breakoutPoint.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= breakoutPoint.radius * 1.6) {
    correctAttempts++;
    completedCount++;
    feedbackBox.innerHTML =
      "<span style='color:#7CFC00;'>Clean read. You marked the key decision point.</span>";
    clickEnabled = false;
    stopTimer();
    updateStatus();
    if (completedCount >= 4) {
      feedbackBox.innerHTML +=
        " <br/>You have completed Level 1’s quota. You are ready for harder patterns.";
    }
  } else {
    feedbackBox.innerHTML =
      "<span style='color:#FF6347;'>Off target. Watch where the structure actually breaks, then try another pattern.</span>";
    updateStatus();
  }
});

function updateStatus() {
  statusCompletedEl.textContent = `${completedCount} / 4`;
  if (totalAttempts === 0) {
    statusAccuracyEl.textContent = "–";
  } else {
    const acc = (correctAttempts / totalAttempts) * 100;
    statusAccuracyEl.textContent = acc.toFixed(0) + "%";
  }
}

// Start in tutorial mode; training begins after overlay button
