// not-guessing.js

// =========================
// HINT TICKER
// =========================
const NG_HINTS = [
  "If you cannot explain the trade, you cannot take the trade.",
  "Guessing is gambling. Structure is safety.",
  "A trader without a plan is prey.",
  "Confirmation protects you from emotional entries.",
  "Risk defines survival.",
  "Chasing is the fastest way to lose money.",
  "Logic beats emotion every time."
];

function startNGHints() {
  const el = document.getElementById("ll-hints");
  if (!el) return;

  function setHint() {
    el.textContent = NG_HINTS[Math.floor(Math.random() * NG_HINTS.length)];
  }

  setHint();
  setInterval(setHint, 6000);
}

// =========================
// TOPIC DATA
// =========================
const NG_TOPICS = {
  "plan": {
    title: "Having a Plan",
    text: `
A trader with no plan is a gambler. A plan tells you exactly what you are
looking for: the setup, the trigger, the stop, the target, and the reason.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Forex_chart_example.png/640px-Forex_chart_example.png",
        alt: "Trading Plan Example"
      }
    ],
    notes: [
      "Your plan must be written before the trade.",
      "Your plan must include invalidation.",
      "Your plan must be repeatable."
    ]
  },
  "levels": {
    title: "Knowing Your Levels",
    text: `
If you don’t know where support and resistance are, you are trading blind.
Looking left reveals the true levels where price has reacted before.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Support_and_resistance.svg/640px-Support_and_resistance.svg.png",
        alt: "Support and Resistance"
      }
    ],
    notes: [
      "Levels come from past reactions.",
      "Higher timeframe levels override lower ones.",
      "Never enter without knowing your nearest level."
    ]
  },
  "confirmation": {
    title: "Waiting for Confirmation",
    text: `
Confirmation protects you from emotional entries. A level is not broken
until it closes beyond it. A trend is not reversed until structure shifts.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Candlestick_chart_scheme_03-en.svg/640px-Candlestick_chart_scheme_03-en.svg.png",
        alt: "Confirmation Example"
      }
    ],
    notes: [
      "Wicks are not confirmation.",
      "Volume matters.",
      "Structure must agree with your bias."
    ]
  },
  "risk": {
    title: "Defined Risk",
    text: `
If you don’t know where you are wrong, you are gambling. Defined risk means
you know exactly where your stop goes and why.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Moving_average_example.svg/640px-Moving_average_example.svg.png",
        alt: "Risk Example"
      }
    ],
    notes: [
      "Your stop must be logical, not emotional.",
      "Risk small enough to survive losing streaks.",
      "Never widen your stop."
    ]
  },
  "chasing": {
    title: "Not Chasing",
    text: `
Chasing is emotional trading. When you chase, you enter late, at the worst
possible price, with no plan and no edge.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Forex_chart_example.png/640px-Forex_chart_example.png",
        alt: "Chasing Example"
      }
    ],
    notes: [
      "If you missed it, you missed it.",
      "Wait for the next setup.",
      "Chasing destroys accounts."
    ]
  },
  "emotion": {
    title: "Removing Emotion",
    text: `
Emotion is the enemy of execution. Fear makes you hesitate. Greed makes you
chase. Anger makes you revenge trade. Discipline removes emotion.
    `,
    images: [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Candlestick_chart_scheme_03-en.svg/640px-Candlestick_chart_scheme_03-en.svg.png",
        alt: "Emotion Example"
      }
    ],
    notes: [
      "Follow your plan, not your feelings.",
      "Detach from the outcome.",
      "Your job is execution, not prediction."
    ]
  }
};

function renderTopic(key) {
  const detailEl = document.getElementById("ng-detail");
  if (!detailEl) return;

  const topic = NG_TOPICS[key];
  if (!topic) return;

  const notesHtml = topic.notes.map(n => `<li>${n}</li>`).join("");
  const imagesHtml = topic.images
    .map(img => `<img class="example-img" src="${img.src}" alt="${img
