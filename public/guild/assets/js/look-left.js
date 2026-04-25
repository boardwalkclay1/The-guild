// =========================
// LOOK LEFT — FULL JS ENGINE
// =========================

// =========================
// HINT TICKER
// =========================
const LL_HINTS = [
  "Look left to find where price reacted before.",
  "The market remembers every battle between buyers and sellers.",
  "True support and resistance come from past reactions.",
  "Higher timeframes override lower timeframes.",
  "If you don’t know where you are, look left.",
  "The left side of the chart tells the truth.",
  "Price reacts to zones, not perfect lines."
];

function startLLHints() {
  const el = document.getElementById("ll-hints");
  if (!el) return;

  function setHint() {
    el.textContent = LL_HINTS[Math.floor(Math.random() * LL_HINTS.length)];
  }

  setHint();
  setInterval(setHint, 6000);
}

// =========================
// TOPIC DETAIL DATA
// =========================
const LL_TOPICS = {
  "1m": {
    title: "1‑Minute Look Left",
    text: `
The 1‑minute chart shows micro‑structure: tiny bounces, scalper reactions,
and liquidity pockets. These levels are weak by themselves, but powerful
when they align with higher timeframes.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Forex_chart_example.png/640px-Forex_chart_example.png",
        alt: "1m Look Left"
      }
    ],
    notes: [
      "Use 1m levels only for scalping.",
      "Never trust a 1m level unless it aligns with 5m or 15m.",
      "1m shows where algorithms and scalpers react."
    ]
  },

  "5m": {
    title: "5‑Minute Look Left",
    text: `
The 5‑minute chart is the backbone of intraday trading. It shows real
reaction zones, intraday support/resistance, and the structure of the move.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Candlestick_chart_scheme_03-en.svg/640px-Candlestick_chart_scheme_03-en.svg.png",
        alt: "5m Look Left"
      }
    ],
    notes: [
      "Most day traders use 5m for entries.",
      "5m levels are stronger than 1m.",
      "Combine 5m with 15m for confirmation."
    ]
  },

  "15m": {
    title: "15‑Minute Look Left",
    text: `
The 15‑minute chart filters noise and shows the true intraday trend.
Its levels are respected by both day traders and swing traders.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Support_and_resistance.svg/640px-Support_and_resistance.svg.png",
        alt: "15m Look Left"
      }
    ],
    notes: [
      "15m levels often act as intraday turning points.",
      "Use 15m to confirm 5m entries.",
      "Breakouts on 15m matter more than 1m/5m."
    ]
  },

  "1h": {
    title: "1‑Hour Look Left",
    text: `
The 1‑hour chart shows swing structure. These levels are powerful and
often mark the true support/resistance zones for multi‑day moves.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Forex_chart_example.png/640px-Forex_chart_example.png",
        alt: "1h Look Left"
      }
    ],
    notes: [
      "1h levels override all intraday levels.",
      "Swing traders rely heavily on 1h structure.",
      "Use 1h to determine the direction of the day."
    ]
  },

  "4h": {
    title: "4‑Hour Look Left",
    text: `
The 4‑hour chart reveals major swing zones and institutional reaction points.
These levels are extremely strong and often define the weekly trend.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Moving_average_example.svg/640px-Moving_average_example.svg.png",
        alt: "4h Look Left"
      }
    ],
    notes: [
      "4h levels are respected across markets.",
      "Use 4h to understand the bigger picture.",
      "4h breakouts often lead to multi‑day moves."
    ]
  },

  "1d": {
    title: "Daily Look Left",
    text: `
The daily chart is the king of structure. Daily support and resistance
are the most powerful levels on your chart. They define the true trend.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Forex_chart_example.png/640px-Forex_chart_example.png",
        alt: "Daily Look Left"
      }
    ],
    notes: [
      "Daily levels override all intraday levels.",
      "Institutions trade off daily structure.",
      "Always check daily before entering any trade."
    ]
  }
};

// =========================
// RENDER TOPIC
// =========================
function renderTopic(key) {
  const detailEl = document.getElementById("ll-detail");
  if (!detailEl) return;

  const topic = LL_TOPICS[key];
  if (!topic) return;

  const notesHtml = topic.notes.map(n => `<li>${n}</li>`).join("");
  const imagesHtml = topic.images
    .map(img => `<img class="example-img" src="${img.src}" alt="${img.alt}">`)
    .join("");

  detailEl.innerHTML = `
    <h3>${topic.title}</h3>
    <p>${topic.text}</p>
    ${imagesHtml}
    <div class="callout">
      <strong>Key Points:</strong>
      <ul>${notesHtml}</ul>
    </div>
  `;
}

// =========================
// TOPIC BUTTON INTERACTIONS
// =========================
function setupTopicInteractions() {
  const buttons = document.querySelectorAll(".ll-topic-btn");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTopic(btn.dataset.topic);
    });
  });

  // Default load
  renderTopic("1m");
}

// =========================
// QUIZ ENGINE
// =========================
const LL_QUIZ = [
  {
    q: "What does 'Look Left' reveal?",
    options: [
      "Past reactions that form true support/resistance",
      "Future predictions",
      "Indicator signals",
      "Random noise"
    ],
    answer: 0
  },
  {
    q: "Which timeframe overrides all intraday levels?",
    options: [
      "1‑minute",
      "5‑minute",
      "15‑minute",
      "Daily"
    ],
    answer: 3
  },
  {
    q: "Why do traders look left before entering a trade?",
    options: [
      "To predict the future",
      "To see past reactions and real levels",
      "To find indicators",
      "To guess direction"
    ],
    answer: 1
  },
  {
    q: "Which timeframe shows the strongest support/resistance?",
    options: [
      "1m",
      "5m",
      "15m",
      "Daily"
    ],
    answer: 3
  }
];

// =========================
// QUIZ RENDER + LOGIC
// =========================
function startLLQuiz() {
  const quizBox = document.getElementById("ll-quiz");
  if (!quizBox) return;

  let index = 0;
  let score = 0;

  function renderQuestion() {
    const q = LL_QUIZ[index];
    quizBox.innerHTML = `
      <div class="ll-q">${q.q}</div>
      <div class="ll-options">
        ${q.options
          .map(
            (opt, i) =>
              `<button class="ll-opt" data-i="${i}">${opt}</button>`
          )
          .join("")}
      </div>
      <div class="ll-progress">Question ${index + 1} of ${LL_QUIZ.length}</div>
    `;

    document.querySelectorAll(".ll-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const choice = parseInt(btn.dataset.i);
        if (choice === q.answer) score++;
        index++;

        if (index < LL_QUIZ.length) {
          renderQuestion();
        } else {
          finishQuiz();
        }
      });
    });
  }

  function finishQuiz() {
    quizBox.innerHTML = `
      <div class="ll-result">
        You scored <strong>${score}</strong> out of <strong>${LL_QUIZ.length}</strong>.
      </div>
    `;

    // Award XP + badge if perfect
    if (score === LL_QUIZ.length) {
      let xp = parseInt(localStorage.getItem("guild_xp") || "0");
      xp += 100;
      localStorage.setItem("guild_xp", xp);
      localStorage.setItem("look_left_mastery", "earned");

      quizBox.innerHTML += `
        <div class="ll-reward">+100 XP — Look Left Badge Earned</div>
      `;
    }
  }

  renderQuestion();
}

// =========================
// INIT
// =========================
startLLHints();
setupTopicInteractions();
startLLQuiz();
