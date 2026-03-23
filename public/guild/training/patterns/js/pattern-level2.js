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
const tutorialOverlay = document.getElementById("tutorialOverlay");
const btnBeginTraining = document.getElementById("btnBeginTraining");
const choiceButtons = Array.from(document.querySelectorAll(".pattern-choice"));

const ROUND_TIME_MS = 15000;
let timerStart = null;
let timerInterval = null;

let currentPattern = null;
let frame = 0;
let maxFrames = 120;
let drawingInterval = null;
let answerLocked = false;
let completedCount = 0;
let totalAttempts = 0;
let correctAttempts = 0;

let candles = [];
let patternLines = [];

const patterns = [
  {
    id: "double-bottom",
    name: "Double Bottom",
    description:
      "Two similar lows with a middle high. Buyers defend the same level twice before breaking upward.",
    generator: generateDoubleBottom
  },
  {
    id: "double-top",
    name: "Double Top",
    description:
      "Two similar highs with a middle low. Sellers defend the same level twice before breaking downward.",
    generator: generateDoubleTop
  },
  {
    id: "flag",
    name: "Bull Flag",
    description:
      "A strong move up, then a tight downward consolidation, then continuation higher.",
    generator: generateFlag
  },
  {
    id: "rounding-bottom",
    name: "Rounding Bottom",
    description:
      "A slow curve from downtrend to uptrend, forming a bowl before breaking higher.",
    generator: generateRoundingBottom
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
    "Hint: Watch the <strong>overall shape</strong> – is it forming two peaks, two valleys, a bowl, or a flag?";
});

choiceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!currentPattern || answerLocked) return;
    totalAttempts++;
    answerLocked = true;
    const chosenId = btn.getAttribute("data-id");
    if (chosenId === currentPattern.id) {
      correctAttempts++;
      completedCount++;
      feedbackBox.innerHTML =
        "<span style='color:#7CFC00;'>Correct. You recognized the pattern before it completed.</span>";
    } else {
      feedbackBox.innerHTML =
        `<span style='color:#FF6347;'>Incorrect.</span> It was <strong>${currentPattern.name}</strong>. Study its shape and try again.`;
    }
    revealPatternInfo();
    stopTimer();
    updateStatus();
  });
});

function startNewTrial() {
  stopTimer();
  clearInterval(drawingInterval);
  answerLocked = false;
  feedbackBox.textContent =
    "Watch the pattern form. Choose the pattern before the timer burns out.";
  patternNameEl.textContent = "Hidden";
  patternDescriptionEl.textContent =
    "You will see the name and explanation after you answer.";
  patternTaskEl.textContent =
    "Choose the pattern based on its shape as it forms.";

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  currentPattern = pattern;

  const generated = pattern.generator();
  candles = generated.candles;
  patternLines = generated.lines;

  frame = 0;
  drawCurrentFrame();

  const revealFrame = Math.floor(maxFrames * 0.8);

  timerStart = Date.now();
  startTimer();

  drawingInterval = setInterval(() => {
    frame++;
    if (frame >= maxFrames) {
      clearInterval(drawingInterval);
      if (!answerLocked) {
        answerLocked = true;
        feedbackBox.innerHTML =
          `<span style='color:#FF6347;'>Time expired.</span> It was <strong>${currentPattern.name}</strong>.`;
        revealPatternInfo();
        updateStatus();
      }
    }
    drawCurrentFrame();
  }, 70);
}

function revealPatternInfo() {
  if (!currentPattern) return;
  patternNameEl.textContent = currentPattern.name;
  patternDescriptionEl.textContent = currentPattern.description;
  patternTaskEl.textContent =
    "Remember this shape. In real markets, you will see it forming before it completes.";
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - timerStart;
    const ratio = 1 - elapsed / ROUND_TIME_MS;
    if (ratio <= 0) {
      updateFireMeter(0);
      stopTimer();
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

// Generators – same as Level 1 (copy from patterns-level1.js)
function generateDoubleBottom() { /* copy same implementation */ }
function generateDoubleTop() { /* copy same implementation */ }
function generateFlag() { /* copy same implementation */ }
function generateRoundingBottom() { /* copy same implementation */ }

function updateStatus() {
  statusCompletedEl.textContent = `${completedCount} / 4`;
  if (totalAttempts === 0) {
    statusAccuracyEl.textContent = "–";
  } else {
    const acc = (correctAttempts / totalAttempts) * 100;
    statusAccuracyEl.textContent = acc.toFixed(0) + "%";
  }
}
