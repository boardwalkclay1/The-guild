// options-chain.js

// =========================
// TOPIC DATA
// =========================
const OC_TOPICS = {
  reading: {
    title: "Reading the Chain",
    text: `
The options chain is a table of contracts. Each row is one contract.
You are mainly reading: strike, expiration, bid, ask, last, volume, and open interest.
In the Guild Simulator, you focus on understanding how the contract price reacts
when the underlying stock moves.
    `,
    notes: [
      "Each row = one contract.",
      "Strike = price level of the contract.",
      "Bid/Ask = what buyers/sellers are offering.",
      "Last = most recent trade price."
    ]
  },
  callsputs: {
    title: "Calls vs Puts",
    text: `
Calls are contracts that benefit when price moves up (in the simulator).
Puts are contracts that benefit when price moves down.
The chain usually shows calls on one side and puts on the other, or in separate tabs.
    `,
    notes: [
      "Calls = bullish exposure in the simulator.",
      "Puts = bearish exposure in the simulator.",
      "You always know which side you are on before you click."
    ]
  },
  contract: {
    title: "Contract Price",
    text: `
The contract price is what you pay per contract (multiplied by the contract size in real markets).
In the Guild Simulator, you practice recognizing how a small contract price can move
a large percentage when the underlying stock moves.
    `,
    notes: [
      "Contract price is what you focus on in the simulator.",
      "Small changes in the stock can create big % moves in the contract.",
      "You never click without knowing the contract price."
    ]
  },
  volumeoi: {
    title: "Volume & Open Interest",
    text: `
Volume shows how many contracts traded today.
Open interest shows how many contracts are currently open.
In the simulator, you use these to practice spotting which contracts are “active.”
    `,
    notes: [
      "High volume = lots of trading activity.",
      "High open interest = many open positions.",
      "Illiquid contracts are harder to enter/exit."
    ]
  },
  greeks: {
    title: "Greeks (Lite)",
    text: `
Greeks describe how the contract reacts to different forces.
In the Guild Simulator, you start with Delta and Theta only:
Delta ≈ how much the contract moves when the stock moves.
Theta ≈ how much the contract decays over time.
    `,
    notes: [
      "Delta ≈ sensitivity to price movement.",
      "Theta ≈ time decay.",
      "You do not need every Greek to start learning."
    ]
  }
};

function renderOCTopic(key) {
  const detailEl = document.getElementById("oc-detail");
  if (!detailEl) return;

  const topic = OC_TOPICS[key];
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

function setupOCTopics() {
  const buttons = document.querySelectorAll(".oc-topic-btn");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderOCTopic(btn.dataset.topic);
    });
  });

  renderOCTopic("reading");
}

// =========================
// PLATFORM CHAIN VIEWS (SIMULATED)
// =========================
function getPlatformChainHTML(platform) {
  // Same data, different presentation emphasis
  const baseRows = `
    <tr>
      <th>Strike</th>
      <th>Bid</th>
      <th>Ask</th>
      <th>Last</th>
      <th>Volume</th>
      <th>Open Interest</th>
    </tr>
    <tr>
      <td>100</td>
      <td>$0.95</td>
      <td>$1.05</td>
      <td>$1.00</td>
      <td>1,240</td>
      <td>3,500</td>
    </tr>
    <tr>
      <td>101</td>
      <td>$0.70</td>
      <td>$0.80</td>
      <td>$0.75</td>
      <td>980</td>
      <td>2,900</td>
    </tr>
    <tr class="highlight-row">
      <td><strong>102</strong></td>
      <td><strong>$0.95</strong></td>
      <td><strong>$1.05</strong></td>
      <td><strong>$1.00</strong></td>
      <td><strong>1,800</strong></td>
      <td><strong>4,200</strong></td>
    </tr>
    <tr>
      <td>103</td>
      <td>$0.55</td>
      <td>$0.65</td>
      <td>$0.60</td>
      <td>720</td>
      <td>1,900</td>
    </tr>
  `;

  if (platform === "webull") {
    return `
      <p><strong>Webull‑Style Simulation:</strong> Compact rows, dense data, focus on bid/ask and volume.</p>
      <table>${baseRows}</table>
    `;
  }

  if (platform === "robinhood") {
    return `
      <p><strong>Robinhood‑Style Simulation:</strong> Cleaner spacing, emphasis on contract price and % move.</p>
      <table>${baseRows}</table>
      <p style="margin-top:10px;">
        In many real apps, you also see a column for % change.  
        In the simulator, imagine the highlighted contract is the one you are tracking.
      </p>
    `;
  }

  // chase
  return `
    <p><strong>Chase‑Style Simulation:</strong> More traditional brokerage layout, clear labels, focus on risk.</p>
    <table>${baseRows}</table>
    <p style="margin-top:10px;">
      Traditional broker layouts often emphasize clarity and risk disclosure.  
      In the simulator, you practice reading the same data regardless of layout.
    </p>
  `;
}

function renderPlatformChain() {
  const select = document.getElementById("platformSelect");
  const container = document.getElementById("platformChain");
  if (!select || !container) return;

  container.innerHTML = getPlatformChainHTML(select.value);

  select.addEventListener("change", () => {
    container.innerHTML = getPlatformChainHTML(select.value);
  });
}

// =========================
// QUIZ ENGINE
// =========================
const OC_QUIZ = [
  {
    q: "What does each row in the options chain represent?",
    options: [
      "A single contract with a specific strike and expiration.",
      "A different stock.",
      "A different broker.",
      "A random price level."
    ],
    answer: 0
  },
  {
    q: "In the simulator, what does the contract price represent?",
    options: [
      "The amount you focus on when practicing how contracts move.",
      "The stock’s full price.",
      "Broker fees.",
      "Account balance."
    ],
    answer: 0
  },
  {
    q: "What does volume tell you?",
    options: [
      "How many contracts traded today.",
      "How many shares exist.",
      "How many brokers are online.",
      "How many accounts are funded."
    ],
    answer: 0
  },
  {
    q: "What does Delta roughly describe in this training?",
    options: [
      "How much the contract reacts when the stock moves.",
      "How many days until expiration.",
      "How many traders are online.",
      "How much commission is charged."
    ],
    answer: 0
  },
  {
    q: "Why do we show multiple platform styles?",
    options: [
      "So you can recognize the same information in different layouts.",
      "To advertise brokers.",
      "To change prices.",
      "To hide risk."
    ],
    answer: 0
  }
];

let ocIndex = 0;

function loadOCQuestion() {
  const qBox = document.getElementById("oc-question");
  const optBox = document.getElementById("oc-options");
  const nextBtn = document.getElementById("oc-next-btn");
  const result = document.getElementById("oc-result");

  const item = OC_QUIZ[ocIndex];

  qBox.textContent = item.q;
  optBox.innerHTML = "";
  result.textContent = "";
  nextBtn.style.display = "none";

  item.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "oc-option";
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

function nextOCQuestion() {
  ocIndex++;

  const qBox = document.getElementById("oc-question");
  const optBox = document.getElementById("oc-options");
  const nextBtn = document.getElementById("oc-next-btn");
  const result = document.getElementById("oc-result");

  if (ocIndex >= OC_QUIZ.length) {
    qBox.textContent = "Quiz Complete!";
    optBox.innerHTML = "";
    nextBtn.style.display = "none";
    result.textContent = "You’ve completed the Options Chain training quiz.";
    result.style.color = "#D4AF37";
    return;
  }

  loadOCQuestion();
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  setupOCTopics();
  renderPlatformChain();
  loadOCQuestion();

  const nextBtn = document.getElementById("oc-next-btn");
  if (nextBtn) nextBtn.addEventListener("click", nextOCQuestion);
});
