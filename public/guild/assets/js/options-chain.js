// ======================================================
//  GUILD OPTIONS CHAIN — TRAINING SIMULATION JS ENGINE
// ======================================================


// =========================
// TOPIC DATA
// =========================
const OC_TOPICS = {
  reading: {
    title: "Reading the Chain",
    text: `
The options chain is a table of contracts. Each row is one contract.
You are reading: strike, bid, ask, last, volume, and open interest.
In the Guild Simulator, you focus on how the contract price reacts
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
Calls benefit when price moves up (in the simulator).
Puts benefit when price moves down.
Real chains show calls on the left and puts on the right.
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
The contract price is what you pay per contract.
In the Guild Simulator, you practice recognizing how a small contract price
can move a large percentage when the underlying stock moves.
    `,
    notes: [
      "Contract price is the focus of the simulator.",
      "Small stock moves can create big % contract moves.",
      "Never click without knowing the contract price."
    ]
  },
  volumeoi: {
    title: "Volume & Open Interest",
    text: `
Volume shows how many contracts traded today.
Open interest shows how many contracts are currently open.
In the simulator, these help you identify “active” contracts.
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
In the Guild Simulator, you start with Delta and Theta:
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


// =========================
// RENDER TOPIC PANEL
// =========================
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
// REALISTIC OPTIONS CHAIN LAYOUT
// CALLS LEFT — STRIKE MIDDLE — PUTS RIGHT
// =========================
function getPlatformChainHTML(platform) {

  // Simulated rows
  const rows = [
    { strike: 100, callBid: 1.05, callAsk: 1.15, callLast: 1.10, callVol: 1240, putVol: 980,  putLast: 1.20, putAsk: 1.25, putBid: 1.15 },
    { strike: 101, callBid: 0.85, callAsk: 0.95, callLast: 0.90, callVol: 980,  putVol: 1100, putLast: 1.35, putAsk: 1.40, putBid: 1.30 },
    { strike: 102, callBid: 0.95, callAsk: 1.05, callLast: 1.00, callVol: 1800, putVol: 1400, putLast: 1.50, putAsk: 1.55, putBid: 1.45, highlight: true },
    { strike: 103, callBid: 0.65, callAsk: 0.75, callLast: 0.70, callVol: 720,  putVol: 1600, putLast: 1.70, putAsk: 1.75, putBid: 1.65 }
  ];

  const platformLabel = {
    webull: "Webull‑Style Simulation",
    robinhood: "Robinhood‑Style Simulation",
    chase: "Chase‑Style Simulation"
  }[platform];

  let html = `
    <p><strong>${platformLabel}:</strong> Calls on the left, strike in the middle, puts on the right.</p>

    <table>
      <tr>
        <th colspan="4">CALLS</th>
        <th>STRIKE</th>
        <th colspan="4">PUTS</th>
      </tr>

      <tr>
        <th>Bid</th>
        <th>Ask</th>
        <th>Last</th>
        <th>Vol</th>

        <th>Price</th>

        <th>Vol</th>
        <th>Last</th>
        <th>Ask</th>
        <th>Bid</th>
      </tr>
  `;

  rows.forEach(r => {
    html += `
      <tr class="${r.highlight ? "highlight-row" : ""}">
        <td>$${r.callBid.toFixed(2)}</td>
        <td>$${r.callAsk.toFixed(2)}</td>
        <td>$${r.callLast.toFixed(2)}</td>
        <td>${r.callVol}</td>

        <td><strong>${r.strike}</strong></td>

        <td>${r.putVol}</td>
        <td>$${r.putLast.toFixed(2)}</td>
        <td>$${r.putAsk.toFixed(2)}</td>
        <td>$${r.putBid.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `</table>`;

  return html;
}


// =========================
// RENDER PLATFORM CHAIN
// =========================
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
