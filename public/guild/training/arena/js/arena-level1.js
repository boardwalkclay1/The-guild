// ===== CONFIG =====

const START_BALANCE = 100;
const ROUND_TIME_MS = 20000; // 20 seconds
const PRICE_TICK_MS = 350;   // price update interval

// Level 1 scenarios (4 total)
const scenarios = [
  // Scenario 0: Example (non-failing, shown in overlay only)
  {
    id: 0,
    type: "example",
    baseBid: 0.9,
    baseAsk: 1.1,
    volatility: 0.01
  },
  // Scenario 1: Fully guided (answers given)
  {
    id: 1,
    type: "guided",
    baseBid: 0.9,
    baseAsk: 1.1,
    volatility: 0.01
  },
  // Scenario 2: Hint-assisted
  {
    id: 2,
    type: "hint",
    baseBid: 0.8,
    baseAsk: 1.0,
    volatility: 0.02
  },
  // Scenario 3: Independent
  {
    id: 3,
    type: "independent",
    baseBid: 0.7,
    baseAsk: 0.9,
    volatility: 0.02
  },
  // Scenario 4: Independent
  {
    id: 4,
    type: "independent",
    baseBid: 0.5,
    baseAsk: 0.7,
    volatility: 0.03
  }
];

// ===== STATE =====

let balance = START_BALANCE;
let currentScenarioIndex = 0; // 0 = example, then 1..4
let phase = "example";        // "example" | "buy" | "sell"
let timerStart = null;
let timerInterval = null;
let priceInterval = null;

let bid = 0.9;
let ask = 1.1;
let mid = 1.0;

let ownedContracts = 0;
let entryPrice = 0;

let mistakes = 0;

// ===== DOM =====

const bidEl = document.getElementById("bidValue");
const midEl = document.getElementById("midValue");
const askEl = document.getElementById("askValue");

const fireFillEl = document.getElementById("fireFill");
const balanceEl = document.getElementById("balanceValue");

const openTicketBtn = document.getElementById("openTicketBtn");
const orderModule = document.getElementById("orderModule");
const orderPhaseLabel = document.getElementById("orderPhaseLabel");
const orderActionWord = document.getElementById("orderActionWord");
const contractsInput = document.getElementById("contractsInput");
const priceInput = document.getElementById("priceInput");
const orderTotalEl = document.getElementById("orderTotal");
const orderMessageEl = document.getElementById("orderMessage");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");

const overlay = document.getElementById("overlay");
const overlayContent = document.getElementById("overlayContent");

// ===== INIT =====

updateBalanceDisplay();
showExampleOverlay();

// ===== OVERLAY LOGIC =====

function showExampleOverlay() {
  const example = scenarios[0];
  const exampleMid = ((example.baseBid + example.baseAsk) / 2).toFixed(2);

  overlayContent.innerHTML = `
    <h2>The Million Dollar Move – Example</h2>
    <p>
      In this chamber, you will learn how to <strong>buy at the MID</strong> and
      <strong>sell at the MID</strong> while the price moves in real time.
    </p>
    <p>
      You start with <strong>$100</strong>. That is your entire account.
      You will see three numbers:
    </p>
    <p>
      <strong>BID</strong> – the lower price<br>
      <strong>ASK</strong> – the higher price<br>
      <strong>MID</strong> – the price in the middle. This is where you must strike.
    </p>
    <p>
      Example:<br>
      BID: $${example.baseBid.toFixed(2)}<br>
      ASK: $${example.baseAsk.toFixed(2)}<br>
      MID: <strong>$${exampleMid}</strong>
    </p>
    <p>
      If you buy 10 contracts at the MID ($${exampleMid}), you spend $${(10 * exampleMid).toFixed(2)}.
      If the MID later rises to $1.20 and you sell at the MID, you take profit on the difference.
    </p>
    <p>
      In the first trial, we will tell you the correct answers.
      You will type them in and hit <strong>Confirm Order</strong>.
    </p>
    <button class="gold-bar-btn overlay-btn" onclick="beginScenario(1)">
      BEGIN LEVEL 1
    </button>
  `;
  overlay.classList.add("open");
}

function showFailureOverlay(message) {
  overlayContent.innerHTML = `
    <h2>Trial Failed</h2>
    <p>${message}</p>
    <p>You must restart Level 1 from the beginning.</p>
    <button class="gold-bar-btn overlay-btn" onclick="restartLevel()">
      RESTART LEVEL 1
    </button>
  `;
  overlay.classList.add("open");
}

function showSuccessOverlay() {
  overlayContent.innerHTML = `
    <h2>Level 1 Complete</h2>
    <p>
      You have proven you can respect the MID, size your contracts, and act within time.
    </p>
    <p>
      The next chamber will be faster, wilder, and closer to the real arena.
    </p>
    <button class="gold-bar-btn overlay-btn" onclick="goToNextLevel()">
      ASCEND TO LEVEL 2
    </button>
  `;
  overlay.classList.add("open");
}

function closeOverlay() {
  overlay.classList.remove("open");
}

// ===== LEVEL FLOW =====

function beginScenario(index) {
  closeOverlay();
  currentScenarioIndex = index;
  mistakes = 0;
  ownedContracts = 0;
  entryPrice = 0;
  phase = "buy";

  const scenario = scenarios[index];
  bid = scenario.baseBid;
  ask = scenario.baseAsk;
  mid = (bid + ask) / 2;

  updatePriceDisplay();
  resetTimer();
  startTimer();
  startPriceEngine(scenario);

  orderModule.classList.remove("open");
  openTicketBtn.disabled = false;
  openTicketBtn.textContent = "OK — OPEN ORDER TICKET";
  orderMessageEl.textContent = "";
  contractsInput.value = "";
  priceInput.value = "";
  updateOrderTotal();
}

// Restart entire level (back to example)
function restartLevel() {
  stopTimer();
  stopPriceEngine();
  balance = START_BALANCE;
  updateBalanceDisplay();
  beginScenario(1); // start at first guided scenario
}

// After last scenario, go to Level 2 page
function goToNextLevel() {
  window.location.href = "arena-level2.html";
}

// ===== TIMER =====

function resetTimer() {
  timerStart = Date.now();
  updateFireMeter(1);
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - timerStart;
    const ratio = 1 - elapsed / ROUND_TIME_MS;
    if (ratio <= 0) {
      updateFireMeter(0);
      stopTimer();
      fail("You hesitated in the Arena. Time expired.");
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
  fireFillEl.style.height = (clamped * 100) + "%";
}

// ===== PRICE ENGINE =====

function startPriceEngine(scenario) {
  stopPriceEngine();
  priceInterval = setInterval(() => {
    const v = scenario.volatility;
    // small random walk
    bid += (Math.random() - 0.5) * v;
    ask += (Math.random() - 0.5) * v;

    // keep ask above bid
    if (ask <= bid + 0.02) {
      ask = bid + 0.02;
    }

    mid = (bid + ask) / 2;
    updatePriceDisplay();
  }, PRICE_TICK_MS);
}

function stopPriceEngine() {
  if (priceInterval) {
    clearInterval(priceInterval);
    priceInterval = null;
  }
}

function updatePriceDisplay() {
  bidEl.textContent = `$${bid.toFixed(2)}`;
  midEl.textContent = `$${mid.toFixed(2)}`;
  askEl.textContent = `$${ask.toFixed(2)}`;
}

// ===== BALANCE =====

function updateBalanceDisplay() {
  balanceEl.textContent = `$${balance.toFixed(2)}`;
}

// ===== ORDER MODULE =====

openTicketBtn.addEventListener("click", () => {
  orderModule.classList.add("open");
  openTicketBtn.disabled = true;
  orderMessageEl.textContent = "";
  contractsInput.value = "";
  priceInput.value = "";
  updateOrderTotal();

  if (phase === "buy") {
    orderPhaseLabel.textContent = "BUY PHASE";
    orderActionWord.textContent = "BUY";
  } else {
    orderPhaseLabel.textContent = "SELL PHASE";
    orderActionWord.textContent = "SELL";
  }

  // Guided scenario: tell them the answers
  const scenario = scenarios[currentScenarioIndex];
  if (scenario.type === "guided" && phase === "buy") {
    const suggestedContracts = 10;
    const suggestedPrice = mid.toFixed(2);
    orderMessageEl.innerHTML =
      `For this first trial, enter <strong>${suggestedContracts}</strong> contracts at the MID <strong>$${suggestedPrice}</strong>.`;
  }
});

contractsInput.addEventListener("input", updateOrderTotal);
priceInput.addEventListener("input", updateOrderTotal);

function updateOrderTotal() {
  const c = parseInt(contractsInput.value || "0", 10);
  const p = parseFloat(priceInput.value || "0");
  const total = c * p;
  orderTotalEl.textContent = `$${total.toFixed(2)}`;
}

confirmOrderBtn.addEventListener("click", () => {
  const c = parseInt(contractsInput.value || "0", 10);
  const p = parseFloat(priceInput.value || "0");

  if (!c || c <= 0 || isNaN(p) || p <= 0) {
    orderMessageEl.textContent = "Enter a valid contract amount and price.";
    return;
  }

  const scenario = scenarios[currentScenarioIndex];
  const midNow = parseFloat(mid.toFixed(2));
  const total = c * p;

  if (phase === "buy") {
    handleBuyPhase(scenario, c, p, midNow, total);
  } else {
    handleSellPhase(scenario, c, p, midNow, total);
  }
});

// ===== BUY PHASE =====

function handleBuyPhase(scenario, c, p, midNow, total) {
  // Must be MID
  if (parseFloat(p.toFixed(2)) !== midNow) {
    mistakes++;
    handleMistake(scenario, "You must enter the MID price to be filled.");
    return;
  }

  // Must have enough balance
  if (total > balance + 0.0001) {
    mistakes++;
    handleMistake(scenario, "You don't have enough gold for that many contracts.");
    return;
  }

  // Success
  ownedContracts = c;
  entryPrice = p;
  balance -= total;
  updateBalanceDisplay();

  orderMessageEl.innerHTML = `<span style="color:#7CFC00;">Perfect Entry — Filled at MID.</span>`;
  stopTimer();

  // Price reacts upward
  bid += 0.05;
  ask += 0.05;
  mid = (bid + ask) / 2;
  updatePriceDisplay();

  // After a short rise, reset timer and move to sell phase
  setTimeout(() => {
    resetTimer();
    startTimer();
    phase = "sell";
    orderPhaseLabel.textContent = "SELL PHASE";
    orderActionWord.textContent = "SELL";
    orderMessageEl.textContent = "Now sell your contracts at the MID to lock in profit.";
    contractsInput.value = ownedContracts;
    priceInput.value = mid.toFixed(2);
    updateOrderTotal();
  }, 800);
}

// ===== SELL PHASE =====

function handleSellPhase(scenario, c, p, midNow, total) {
  // Must not sell more than owned
  if (c > ownedContracts) {
    mistakes++;
    handleMistake(scenario, "You cannot sell more contracts than you own.");
    return;
  }

  // Must be MID
  if (parseFloat(p.toFixed(2)) !== midNow) {
    mistakes++;
    handleMistake(scenario, "You must exit at the MID to keep your edge.");
    return;
  }

  // Success
  const proceeds = c * p;
  const cost = c * entryPrice;
  const profit = proceeds - cost;
  balance += proceeds;
  ownedContracts -= c;
  updateBalanceDisplay();
  stopTimer();

  orderMessageEl.innerHTML =
    `<span style="color:#7CFC00;">Clean Exit — You took $${profit.toFixed(2)} in profit.</span>`;

  // Move to next scenario or finish level
  setTimeout(() => {
    if (currentScenarioIndex < 4) {
      beginScenario(currentScenarioIndex + 1);
    } else {
      stopPriceEngine();
      showSuccessOverlay();
    }
  }, 1200);
}

// ===== MISTAKE HANDLING =====

function handleMistake(scenario, baseMessage) {
  const type = scenario.type;
  let hint = baseMessage;

  if (type === "guided") {
    // Guided: we basically tell them exactly what to do
    const midNow = mid.toFixed(2);
    hint += " For this trial, use the MID exactly as shown.";
  } else if (type === "hint") {
    if (mistakes === 1) {
      hint += " Hint: The MID is the number between BID and ASK.";
    } else if (mistakes === 2) {
      hint += " Hint: You can only spend up to your remaining gold balance.";
    } else if (mistakes >= 3) {
      fail("You ignored the hints. The Arena resets.");
      return;
    }
  } else if (type === "independent") {
    if (mistakes === 2) {
      hint += " Hint: Respect the MID and your balance. Think before you strike.";
    } else if (mistakes >= 3) {
      fail("Too many mistakes. The Arena resets.");
      return;
    }
  }

  orderMessageEl.textContent = hint;
}

// ===== FAIL =====

function fail(message) {
  stopTimer();
  stopPriceEngine();
  orderModule.classList.remove("open");
  showFailureOverlay(message);
}
