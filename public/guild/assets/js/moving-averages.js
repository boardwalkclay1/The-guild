// moving-averages.js

// =========================
// HINT TICKER
// =========================
const MA_HINTS = [
  "The 20 EMA shows short-term momentum.",
  "The 50 SMA reveals the medium-term trend.",
  "The 200 SMA defines the long-term direction.",
  "Golden Cross = strength. Death Cross = weakness.",
  "Moving averages work best in trending markets.",
  "Price above the 200 SMA is generally bullish.",
  "Crossovers need volume confirmation."
];

function startMAHints() {
  const el = document.getElementById("ma-hints");
  if (!el) return;

  function setHint() {
    el.textContent = MA_HINTS[Math.floor(Math.random() * MA_HINTS.length)];
  }

  setHint();
  setInterval(setHint, 6000);
}

// =========================
// QUIZ ENGINE
// =========================
const MA_QUIZ = [
  {
    q: "What does the 20 EMA represent?",
    options: [
      "Short-term momentum",
      "Long-term trend",
      "Market volatility",
      "Support and resistance"
    ],
    answer: 0
  },
  {
    q: "What is a Golden Cross?",
    options: [
      "20 EMA crossing below 50 EMA",
      "50 SMA crossing below 200 SMA",
      "Shorter MA crossing above a longer MA",
      "A bullish candlestick pattern"
    ],
    answer: 2
  },
  {
    q: "Which MA is best for long-term trend direction?",
    options: [
      "20 EMA",
      "50 SMA",
      "200 SMA",
      "9 EMA"
    ],
    answer: 2
  },
  {
    q: "What confirms a moving average crossover?",
    options: [
      "Low volume",
      "Volume expansion",
      "Random spikes",
      "A single candle wick"
    ],
    answer: 1
  }
];

let currentQuestion = 0;

function loadQuestion() {
  const qBox = document.getElementById("ma-question");
  const optBox = document.getElementById("ma-options");
  const nextBtn = document.getElementById("ma-next-btn");
  const result = document.getElementById("ma-result");

  const item = MA_QUIZ[currentQuestion];

  qBox.textContent = item.q;
  optBox.innerHTML = "";
  result.textContent = "";
  nextBtn.style.display = "none";

  item.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "ma-option";
    btn.textContent = opt;

    btn.addEventListener("click", () => {
      if (i === item.answer) {
        result.textContent = "Correct!";
        result.style.color = "#4CAF50";
      } else {
        result.textContent = "Incorrect — review the lesson.";
        result.style.color = "#FF5252";
      }

      nextBtn.style.display = "block";
    });

    optBox.appendChild(btn);
  });
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= MA_QUIZ.length) {
    document.getElementById("ma-question").textContent = "Quiz Complete!";
    document.getElementById("ma-options").innerHTML = "";
    document.getElementById("ma-next-btn").style.display = "none";
    return;
  }
  loadQuestion();
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  startMAHints();
  loadQuestion();
  document.getElementById("ma-next-btn").addEventListener("click", nextQuestion);
});
