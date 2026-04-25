// not-guessing.js

// =========================
// TOPIC DATA
// =========================
const NG_TOPICS = {
  plan: {
    title: "Having a Plan",
    text: `
Guessing is what happens when you enter a trade without a written plan.
A real plan answers three things before you ever click:
what you are entering, where you are entering, and why you are entering.
In the Guild, you train to make every entry a deliberate execution, not a coin flip.
    `,
    notes: [
      "You know your entry, target, and stop before you enter.",
      "You can explain your trade in one or two clear sentences.",
      "If you cannot explain it, you do not take it."
    ]
  },
  levels: {
    title: "Knowing Your Levels",
    text: `
Random entries are gambling. Planned entries are built around levels.
You mark support, resistance, and key zones first — then you wait for price to come to you.
You are not chasing candles; you are reacting to structure you already mapped.
    `,
    notes: [
      "Levels come from past price action, not feelings.",
      "You know where price is on the map before you act.",
      "If price is in the middle of nowhere, you wait."
    ]
  },
  confirmation: {
    title: "Waiting for Confirmation",
    text: `
Gambling is acting on the first impulse. Discipline is waiting for confirmation.
Confirmation can be a candle close, a retest, volume, or a pattern completing.
In the Guild, you train to let the market prove your idea before you commit.
    `,
    notes: [
      "You define what confirmation looks like ahead of time.",
      "You do not enter just because price touched a level once.",
      "You accept missing a move if it never confirms."
    ]
  },
  risk: {
    title: "Defined Risk",
    text: `
If you do not know how much you can lose, you are gambling.
Defined risk means you know your maximum loss before you enter.
You size your position so that a losing trade is acceptable, not catastrophic.
    `,
    notes: [
      "You know your stop level before entry.",
      "You size the trade based on risk, not greed.",
      "One trade can never destroy your account in your plan."
    ]
  },
  chasing: {
    title: "Not Chasing",
    text: `
Chasing is entering after the move has already happened because you are afraid of missing out.
This is pure emotion — not logic.
In the Guild, you train to let moves go if you were not prepared before they started.
    `,
    notes: [
      "If you discover the move on social media, you are probably late.",
      "You do not enter just because something is moving fast.",
      "You would rather miss a move than chase into a trap."
    ]
  },
  emotion: {
    title: "Removing Emotion",
    text: `
Fear and greed are what turn trading into gambling.
You reduce emotion by having rules, following them, and accepting both wins and losses.
The Guild mindset: execute the plan, review the result, refine the plan — repeat.
    `,
    notes: [
      "You do not increase size out of anger or revenge.",
      "You do not hold losers because you “hope” they come back.",
      "You judge yourself on following the plan, not on one trade’s outcome."
    ]
  }
};

function renderNGTopic(key) {
  const detailEl = document.getElementById("ng-detail");
  if (!detailEl) return;

  const topic = NG_TOPICS[key];
  if (!topic) return;

  const notesHtml = topic.notes.map(n => `<li>${n}</li>`).join("");

  detailEl.innerHTML = `
    <h3>${topic.title}</h3>
    <p>${topic.text}</p>
    <div class="callout">
      <strong>Key Points:</strong>
      <ul>${notesHtml}</ul>
    </div>
  `;
}

function setupNGTopics() {
  const buttons = document.querySelectorAll(".ng-topic-btn");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderNGTopic(btn.dataset.topic);
    });
  });

  // default
  renderNGTopic("plan");
}

// =========================
// QUIZ ENGINE
// =========================
const NG_QUIZ = [
  {
    q: "What makes a trade a plan instead of a guess?",
    options: [
      "Having a clear entry, target, and stop before entering.",
      "Entering as soon as you feel excited.",
      "Following what social media says.",
      "Using the biggest size possible."
    ],
    answer: 0
  },
  {
    q: "Why do you mark levels before entering a trade?",
    options: [
      "To know where price has reacted before.",
      "To make the chart look pretty.",
      "To confuse other traders.",
      "To avoid using a stop."
    ],
    answer: 0
  },
  {
    q: "What is confirmation in this training?",
    options: [
      "Evidence from price action that supports your idea.",
      "A random candle you like.",
      "A rumor you heard.",
      "A feeling that something will move."
    ],
    answer: 0
  },
  {
    q: "What does defined risk mean?",
    options: [
      "You know how much you can lose before you enter.",
      "You never lose.",
      "You double down when you are wrong.",
      "You only trade when you feel lucky."
    ],
    answer: 0
  },
  {
    q: "What is chasing?",
    options: [
      "Entering late because you are afraid of missing out.",
      "Entering at your planned level.",
      "Waiting for confirmation.",
      "Reducing size after a loss."
    ],
    answer: 0
  },
  {
    q: "How do you reduce emotion in trading?",
    options: [
      "By following a written plan and accepting both wins and losses.",
      "By ignoring your rules when you feel confident.",
      "By increasing size after every loss.",
      "By trading only when you are angry."
    ],
    answer: 0
  }
];

let ngIndex = 0;

function loadNGQuestion() {
  const qBox = document.getElementById("ng-question");
  const optBox = document.getElementById("ng-options");
  const nextBtn = document.getElementById("ng-next-btn");
  const result = document.getElementById("ng-result");

  if (!qBox || !optBox || !nextBtn || !result) return;

  const item = NG_QUIZ[ngIndex];

  qBox.textContent = item.q;
  optBox.innerHTML = "";
  result.textContent = "";
  nextBtn.style.display = "none";

  item.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "ng-option";
    btn.textContent = opt;

    btn.addEventListener("click", () => {
      if (i === item.answer) {
        result.textContent = "Correct!";
        result.style.color = "#4CAF50";
      } else {
        result.textContent = "Incorrect — review the concepts above.";
        result.style.color = "#FF5252";
      }
      nextBtn.style.display = "block";
    });

    optBox.appendChild(btn);
  });
}

function nextNGQuestion() {
  ngIndex++;

  const qBox = document.getElementById("ng-question");
  const optBox = document.getElementById("ng-options");
  const nextBtn = document.getElementById("ng-next-btn");
  const result = document.getElementById("ng-result");

  if (!qBox || !optBox || !nextBtn || !result) return;

  if (ngIndex >= NG_QUIZ.length) {
    qBox.textContent = "Quiz Complete!";
    optBox.innerHTML = "";
    nextBtn.style.display = "none";
    result.textContent = "You’ve completed the Not Guessing, Not Gambling quiz.";
    result.style.color = "#D4AF37";
    return;
  }

  loadNGQuestion();
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  setupNGTopics();
  loadNGQuestion();

  const nextBtn = document.getElementById("ng-next-btn");
  if (nextBtn) nextBtn.addEventListener("click", nextNGQuestion);
});
