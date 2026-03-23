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

const patternNameEl = document.getElementById("patternName");
const patternDescriptionEl = document.getElementById("patternDescription");
const patternTaskEl = document.getElementById("patternTask");
const feedbackBox = document.getElementById("feedbackBox");
const statusCompletedEl = document.getElementById("statusCompleted");
const statusAccuracyEl = document.getElementById("statusAccuracy");
const fireFillEl = document.getElementById("fireFill");

const btnNextPattern = document.getElementById("btnNextPattern");
const btnHint = document.getElementById("btnHint");
const btnClearLine = document.getElementById("btnClearLine");
const tutorialOverlay = document.getElementById("tutorialOverlay");
const btnBeginTraining = document.getElementById("btnBeginTraining");

const ROUND_TIME_MS = 20000;
let timerStart = null;
let timerInterval = null;

let currentPattern = null;
let frame = 0;
let maxFrames = 120;
let drawingInterval = null;
let drawingEnabled = false;
let completedCount = 0;
let totalAttempts = 0;
let correctAttempts = 0;

let candles = [];
let patternLines = [];
let idealLine = null; // {x1,y1,x2,y2}
let userLine = null;
let clickPoints = [];

const patterns = [
  {
    id: "double-bottom",
    name: "Double Bottom",
    description:
      "Draw the neckline: the horizontal level between the two lows, where the breakout occurs.",
    generator: generateDoubleBottom,
    lineType: "neckline"
  },
  {
    id: "double-top",
    name: "Double Top",
    description:
      "Draw the neckline: the horizontal level between the two highs, where the breakdown occurs.",
    generator: generateDoubleTop,
    lineType: "neckline"
  },
  {
    id: "flag",
    name: "Bull Flag",
    description:
      "Draw the upper boundary of the flag – the line that price must break to continue higher.",
    generator: generateFlag,
    lineType: "flag"
  },
  {
    id: "rounding-bottom",
    name: "Rounding Bottom",
    description:
      "Draw the resistance line above the bowl that price must break to confirm the reversal.",
    generator: generateRoundingBottom,
    lineType: "resistance"
  }
];

btnBeginTraining.addEventListener("click", () => {
  tutorialOverlay.style.display = "none";
  startNewTrial();
});

btnNextPattern.addEventListener("click", () => {
  startNewTrial();
});

btnHint.addEventListener("click", () => {
  feedbackBox.innerHTML =
    "Hint: Your line should sit where price <strong>changes state</strong> – from range to breakout or breakdown.";
});

btnClearLine.addEventListener("click", () => {
  userLine = null;
  clickPoints = [];
  feedbackBox.textContent = "Click two points to draw your key line.";
  drawCurrentFrame();
});

canvas.addEventListener("click", (e) => {
  if (!drawingEnabled) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);
  clickPoints.push({ x, y });
  if (clickPoints.length === 2) {
    userLine = {
      x1: clickPoints[0].x,
      y1: clickPoints[0].y,
      x2: clickPoints[1].x,
      y2: clickPoints[1].y
    };
    drawingEnabled = false;
    evaluateLine();
  } else {
    feedbackBox.textContent = "Now click the second point of your line.";
  }
  drawCurrentFrame();
});

function startNewTrial() {
  stopTimer();
  clearInterval(drawingInterval);
  drawingEnabled = false;
  userLine = null;
  clickPoints = [];
  feedbackBox.textContent =
    "Watch the pattern. When it completes, draw the key line with two clicks.";

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  currentPattern = pattern;
  patternNameEl.textContent = pattern.name;
  patternDescriptionEl.textContent = pattern.description;
  patternTaskEl.textContent =
    "Wait for the pattern to complete, then draw the key line with two clicks.";

  const generated = pattern.generator();
  candles = generated.candles;
  patternLines = generated.lines;
  idealLine = generated.keyLine; // we’ll add this to generators

  frame = 0;
  drawCurrentFrame();

  timerStart = Date.now();
  startTimer();

  drawingInterval = setInterval(() => {
    frame++;
    if (frame >= maxFrames) {
      clearInterval(drawingInterval);
      drawingEnabled = true;
      feedbackBox.textContent =
        "Pattern complete. Click two points to draw your key line.";
    }
    drawCurrentFrame();
  }, 60);
}

function evaluateLine() {
  if (!idealLine || !userLine) return;
  totalAttempts++;

  function lineDistance(l1, l2) {
    const mid1 = { x: (l1.x1 + l1.x2) / 2, y: (l1.y1 + l1.y2) / 2 };
    const mid2 = { x: (l2.x1 + l2.x2) / 2, y: (l2.y1 + l2.y2) / 2 };
    const dx = mid1.x - mid2.x;
    const dy = mid1.y - mid2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  const dist = lineDistance(idealLine, userLine);
  const tolerance = width * 0.08;

  if (dist <= tolerance) {
    correctAttempts++;
    completedCount++;
    feedbackBox.innerHTML =
      "<span style='color:#7CFC00;'>Strong structure. Your line is aligned with the key level.</span>";
  } else {
    feedbackBox.innerHTML =
      "<span style='color:#FF6347;'>Off structure.</span> Compare your line to the ideal one and adjust your eye.";
  }

  stopTimer();
  updateStatus();
  drawCurrentFrame();
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - timerStart;
    const ratio = 1 - elapsed / ROUND_TIME_MS;
    if (ratio <= 0) {
      updateFireMeter(0);
      stopTimer();
      if (drawingEnabled) {
        drawingEnabled = false;
        feedbackBox.innerHTML =
          "<span style='color:#FF6347;'>Time expired.</span> Study the ideal line and try again.";
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

  if (idealLine) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,215,0,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(idealLine.x1, idealLine.y1);
    ctx.lineTo(idealLine.x2, idealLine.y2);
    ctx.stroke();
    ctx.restore();
  }

  if (userLine) {
    ctx.save();
    ctx.strokeStyle = "#00BFFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(userLine.x1, userLine.y1);
    ctx.lineTo(userLine.x2, userLine.y2);
    ctx.stroke();
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

// Generators – same as Level 1, but each returns keyLine as well
function generateDoubleBottom() { /* add keyLine: neckline */ }
function generateDoubleTop() { /* add keyLine: neckline */ }
function generateFlag() { /* add keyLine: upper flag boundary */ }
function generateRoundingBottom() { /* add keyLine: resistance */ }

function updateStatus() {
  statusCompletedEl.textContent = `${completedCount} / 4`;
  if (totalAttempts === 0) {
    statusAccuracyEl.textContent = "–";
  } else {
    const acc = (correctAttempts / totalAttempts) * 100;
    statusAccuracyEl.textContent = acc.toFixed(0) + "%";
  }
}
