// support-resistance.js

// =========================
// HINT TICKER
// =========================
const SR_HINTS = [
  "Support is stronger when it has been tested multiple times.",
  "Resistance breaks with volume — not hope.",
  "A level is not broken until it closes beyond it.",
  "Support becomes resistance after a breakdown.",
  "Resistance becomes support after a breakout.",
  "Price reacts to zones, not perfect lines.",
  "The more obvious the level, the more powerful the reaction."
];

function startSRHints() {
  const el = document.getElementById("sr-hints");
  if (!el) return;

  function setHint() {
    el.textContent = SR_HINTS[Math.floor(Math.random() * SR_HINTS.length)];
  }

  setHint();
  setInterval(setHint, 6000);
}

// =========================
// QUIZ ENGINE
// =========================
const SR_QUIZ = [
  {
    q: "What is support?",
    options: [
      "A level where price tends to stop falling.",
      "A level where price tends to stop rising.",
      "A trendline drawn above price.",
      "A moving average crossover."
    ],
    answer: 0
  },
  {
    q: "What usually confirms a resistance breakout?",
    options: [
      "Low volume.",
      "A wick above resistance.",
      "A close above resistance with volume.",
      "A random spike."
    ],
    answer: 2
  },
  {
    q: "What often happens when support breaks?",
    options: [
      "Price teleports upward.",
      "Support becomes resistance.",
      "Nothing changes.",
      "Price becomes unpredictable."
    ],
    answer: 1
  }
];

function renderQuiz() {
  const quizEl = document.getElementById("sr-quiz");
  const resultEl = document.getElementById("quiz-result");
  if (!quizEl) return;

  quizEl.innerHTML = "";

  SR_QUIZ.forEach((item, index) => {
    const qBox = document.createElement("div");
    qBox.className = "quiz-question";

    qBox.innerHTML = `<strong>${index + 1}. ${item.q}</strong>`;

    item.options.forEach((opt, i) => {
      const optEl = document.createElement("div");
      optEl.className = "quiz-option";
      optEl.textContent = opt;

      optEl.addEventListener("click", () => {
        if (i === item.answer) {
          resultEl.textContent = "Correct!";
          resultEl.style.color = "#4CAF50";
        } else {
          resultEl.textContent = "Incorrect — review the lesson.";
          resultEl.style.color = "#FF5252";
        }
      });

      qBox.appendChild(optEl);
    });

    quizEl.appendChild(qBox);
  });
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  startSRHints();
  renderQuiz();
});
