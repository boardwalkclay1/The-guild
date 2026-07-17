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
// TOPIC DETAIL DATA
// =========================
const MA_TOPICS = {
  "20ema": {
    title: "20 EMA – Short-Term Momentum",
    text: `
The 20-period Exponential Moving Average (20 EMA) reacts quickly to price.
It shows short-term momentum and is often used to trail stops or time entries
in the direction of the current move.

When price rides above the 20 EMA in an uptrend, pullbacks into it often act
as dynamic support. When price rides below it in a downtrend, it often acts
as dynamic resistance.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Moving_average_example.svg/640px-Moving_average_example.svg.png",
        alt: "20 EMA Schematic"
      }
    ],
    notes: [
      "Best used on intraday and swing timeframes.",
      "Works well when the market is already trending.",
      "Avoid using it alone in choppy, sideways markets."
    ]
  },

  "50sma": {
    title: "50 SMA – Swing Trend",
    text: `
The 50-period Simple Moving Average (50 SMA) is a classic swing-trend filter.
It smooths out more noise than the 20 EMA and shows the medium-term direction.

In strong trends, price will often respect the 50 SMA on pullbacks.
Many traders watch this level, which makes reactions around it more meaningful.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Forex_chart_example.png/640px-Forex_chart_example.png",
        alt: "50 SMA on Real Chart"
      }
    ],
    notes: [
      "Commonly used on daily charts for swing trading.",
      "Pullbacks to the 50 SMA in an uptrend can be high-probability entries.",
      "Losing the 50 SMA with volume can signal trend weakening."
    ]
  },

  "200sma": {
    title: "200 SMA – Market Regime",
    text: `
The 200-period Simple Moving Average (200 SMA) defines the long-term regime.
Institutions and funds watch this line. Price above it is generally considered
bullish; price below it is generally considered bearish.

It does not give fast signals, but it tells you which side of the market
you should prefer for higher-probability trades.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Moving_average_example.svg/640px-Moving_average_example.svg.png",
        alt: "200 SMA Schematic"
      }
    ],
    notes: [
      "Used heavily on daily and weekly charts.",
      "Major breaks of the 200 SMA often mark big shifts in trend.",
      "Best used as a bias filter, not a precise entry tool."
    ]
  },

  "golden": {
    title: "Golden Cross",
    text: `
A Golden Cross occurs when a shorter moving average crosses above a longer one.
The classic version is the 50 SMA crossing above the 200 SMA.

It signals that momentum has shifted from bearish to bullish on a higher timeframe.
It is more powerful when it happens after a long downtrend or base, and when volume
expands on the move up.
    `,
    images: [
      {
        src: "/guild/training/img/golden-cross.png",
        alt: "Golden Cross"
      }
    ],
    notes: [
      "Best used as confirmation, not an early entry.",
      "Stronger when aligned with improving market breadth and volume.",
      "False signals are common in choppy markets."
    ]
  },

  "death": {
    title: "Death Cross",
    text: `
A Death Cross is the opposite of a Golden Cross: a shorter moving average
crosses below a longer one. The classic version is the 50 SMA crossing below
the 200 SMA.

It signals that momentum has shifted from bullish to bearish. Like the Golden Cross,
it is more meaningful after a long uptrend, especially if volume expands on the way down.
    `,
    images: [
      {
        src: "/guild/training/img/death-cross.png",
        alt: "Death Cross"
      }
    ],
    notes: [
      "Often lags the actual top — it is a confirmation, not a prediction.",
      "Useful for risk management and de-risking long-term positions.",
      "Can whipsaw in sideways markets."
    ]
  },
  
    notes: [
      "Look for multiple touches with clear reactions.",
      "Combine with volume and structure (higher highs / lower lows).",
      "Avoid forcing trades just because price touches an MA once."
    ]
  }
};

// =========================
// RENDER TOPIC
// =========================
function renderTopic(topicKey) {
  const detailEl = document.getElementById("ma-detail");
  if (!detailEl) return;

  const topic = MA_TOPICS[topicKey];
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
  const buttons = document.querySelectorAll(".ma-topic-btn");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTopic(btn.dataset.topic);
    });
  });

  renderTopic("20ema");
}

// =========================
// QUIZ ENGINE
// =========================
const MA_QUIZ = [
  {
    q: "Which moving average is best for short-term momentum?",
    options: ["20 EMA", "50 SMA", "200 SMA", "9 EMA only on weekly charts"],
    answer: 0
  },
  {
    q: "What is the classic Golden Cross?",
    options: [
      "20 EMA crossing above 50 SMA",
      "50 SMA crossing above 200 SMA",
      "200 SMA crossing above 50 SMA",
      "Any MA crossing any other MA"
    ],
    answer: 1
  },
  {
    q: "What does the 200 SMA primarily tell you?",
    options: [
      "Exact entry points",
      "Short-term volatility",
      "Long-term market regime",
      "Only intraday scalps"
    ],
    answer: 2
  },
  {
    q: "When do moving averages work best?",
    options: [
      "In strong trends",
      "In random chop",
      "Only during news events",
      "Only on 1-minute charts"
    ],
    answer: 0
  },
  {
    q: "What confirms a crossover signal?",
    options: [
      "Low volume and small candles",
      "Volume expansion and trend context",
      "One random wick",
      "A single doji candle"
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

  if (!qBox || !optBox || !nextBtn || !result) return;

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
        result.textContent = "Incorrect — review the lesson above.";
        result.style.color = "#FF5252";
      }
      nextBtn.style.display = "block";
    });

    optBox.appendChild(btn);
  });
}

function nextQuestion() {
  currentQuestion++;

  const qBox = document.getElementById("ma-question");
  const optBox = document.getElementById("ma-options");
  const nextBtn = document.getElementById("ma-next-btn");
  const result = document.getElementById("ma-result");

  if (currentQuestion >= MA_QUIZ.length) {
    qBox.textContent = "Quiz Complete!";
    optBox.innerHTML = "";
    nextBtn.style.display = "none";
    result.textContent = "You’ve completed the Moving Averages quiz.";
    result.style.color = "#D4AF37";
    return;
  }

  loadQuestion();
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  startMAHints();
  setupTopicInteractions();
  loadQuestion();

  const nextBtn = document.getElementById("ma-next-btn");
  if (nextBtn) nextBtn.addEventListener("click", nextQuestion);
});
