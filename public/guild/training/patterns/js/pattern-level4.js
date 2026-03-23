const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");

let width, height;
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

const patternTaskEl = document.getElementById("patternTask");
const patternDescriptionEl = document.getElementById("patternDescription");
const feedbackBox = document.getElementById("feedbackBox");
const statusCompletedEl = document.getElementById("statusCompleted");
const statusAccuracyEl = document.getElementById("statusAccuracy");
const fireFillEl = document.getElementById("fireFill");

const btnNextPattern = document.getElementById("btnNextPattern");
const btnHint = document.getElementById("btnHint");
const tutorialOverlay = document.getElementById("tutorialOverlay");
const btnBeginTraining = document.getElementById("btnBeginTraining");

const ROUND_TIME_MS = 12000;
let timerStart = null;
let timerInterval = null;

let currentTrial = null;
let frame = 0;
let maxFrames = 90;
let drawingInterval = null;
let clickEnabled = false;
let completedCount = 0;
let totalAttempts = 0;
let correctAttempts = 0;

let candles = [];
let patternLines = [];
let breakoutPoint = null;
let isFakePattern = false;

btnBeginTraining.addEventListener("click", () => {
  tutorialOverlay.style.display = "none";
  startNewTrial();
});

btnNextPattern.addEventListener("click", () => {
  startNewTrial();
});

btnHint.addEventListener("click", () => {
  feedbackBox.innerHTML =
    "Hint: Real patterns have <strong>clear structure</strong>. Fake ones are messy, inconsistent, or incomplete.";
});

canvas.addEventListener("click", (e) => {
  if (!clickEnabled) return;
  totalAttempts++;
  clickEnabled = false;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);

  if (isFakePattern) {
    feedbackBox.innerHTML =
      "<span style='color:#7CFC00;'>Correct.</span> You did not trust a fake structure.";
    correctAttempts++;
  } else if (breakoutPoint) {
    const dx = x - breakoutPoint.x;
    const dy = y - breakoutPoint.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const tolerance = breakoutPoint.radius * 1.8;
    if (dist <= tolerance) {
      feedbackBox.innerHTML =
        "<span style='color:#7CFC00;'>Clean strike.</span> You hit the breakout in the arena.";
      correctAttempts++;
    } else {
      feedbackBox.innerHTML =
        "<span style='color:#FF6347;'>Missed.</span> The real breakout was elsewhere. In the arena, that costs you.";
    }
  }

  completedCount++;
  stopTimer();
  updateStatus();
});

function startNewTrial() {
  stopTimer();
  clearInterval(drawingInterval);
  clickEnabled = false;
  feedbackBox.textContent =
    "Watch the chaos. If you see a real pattern complete, click the breakout. If it looks fake, do nothing.";

  const roll = Math.random();
  isFakePattern = roll < 0.35; // 35% fake
  if (isFakePattern) {
    currentTrial = { type: "fake" };
    patternTaskEl.textContent =
      "Some trials are fake. If the structure looks wrong, do not click.";
    patternDescriptionEl.textContent =
      "Fake patterns will have broken symmetry, inconsistent highs/lows, or no clear breakout.";
    const generated = generateFakePattern();
    candles = generated.candles;
    patternLines = generated.lines;
    breakoutPoint = null;
  } else {
    const realPatterns = [generateDoubleBottom, generateDoubleTop, generateFlag, generateRoundingBottom];
    const gen = realPatterns[Math.floor(Math.random() * realPatterns.length)];
    const generated = gen();
    candles = generated.candles;
    patternLines = generated.lines;
    breakoutPoint = generated.breakout;
    patternTaskEl.textContent =
      "This trial contains a real pattern. When you see the breakout, click it.";
    patternDescriptionEl.textContent =
      "Ignore noise. Focus on the structure and where it truly breaks.";
  }

  frame = 0;
  drawCurrentFrame();

  timerStart = Date.now();
  startTimer();

  drawingInterval = setInterval(() => {
    frame++;
    if (frame >= maxFrames) {
      clearInterval(drawingInterval);
      clickEnabled = true;
      feedbackBox.textContent =
        "Decision time. Strike if it’s real. Hold if it’s fake.";
    }
    drawCurrentFrame();
  }, 60);
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
        totalAttempts++;
        if (isFakePattern) {
          feedbackBox.innerHTML =
            "<span style='color:#7CFC00;'>You held your fire.</span> The pattern was fake.";
          correctAttempts++;
        } else {
          feedbackBox.innerHTML =
            "<span style='color:#FF6347;'>You hesitated.</span> The pattern was real and you missed it.";
        }
        completedCount++;
        updateStatus();
      }
    } else {
      updateFireMeter(ratio);
    }
  }, 80);
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

function drawCurrentFrame() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  if (!candles.length) return;

  const visibleCount = Math.floor(
    (Math.min(frame, maxFrames) / maxFrames) * candles.length
  );
  drawCandles(candles.slice(0, visibleCount));
  drawPatternLines(patternLines, visibleCount);

  if (!isFakePattern && breakoutPoint && frame >= maxFrames) {
    ctx.save();
    ctx.globalAlpha = 0.18;
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

    ctx.beginPath();
    ctx.moveTo(xCenter, highY);
    ctx.lineTo(xCenter, lowY);
    ctx.stroke();

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

// Real pattern generators – same as Level 1
function generateDoubleBottom() { /* copy from Level 1 */ }
function generateDoubleTop() { /* copy from Level 1 */ }
function generateFlag() { /* copy from Level 1 */ }
function generateRoundingBottom() { /* copy from Level 1 */ }

// Fake pattern generator – messy, no clear structure
function generateFakePattern() {
  const n = 40;
  const candles = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    const drift = (Math.random() - 0.5) * 2.5;
    const open = price;
    price += drift;
    const close = price;
    const high = Math.max(open, close) + Math.random() * 1.5;
    const low = Math.min(open, close) - Math.random() * 1.5;
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
  // random meaningless lines
  for (let i = 0; i < 3; i++) {
    const i1 = Math.floor(Math.random() * (n - 5));
    const i2 = i1 + 5 + Math.floor(Math.random() * 5);
    lines.push({
      x1: xForIndex(i1),
      y1: yFor(candles[i1].close),
      x2: xForIndex(i2),
      y2: yFor(candles[i2].close),
      maxIndex: n - 1
    });
  }

  return { candles, lines };
}

function updateStatus() {
  statusCompletedEl.textContent = `${completedCount} / 4`;
  if (totalAttempts === 0) {
    statusAccuracyEl.textContent = "–";
  } else {
    const acc = (correctAttempts / totalAttempts) * 100;
    statusAccuracyEl.textContent = acc.toFixed(0) + "%";
  }
}
