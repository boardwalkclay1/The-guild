const START_BALANCE = 100;
const ROUND_TIME_MS = 20000;
const PRICE_TICK_MS = 280;

// Level 2: faster, wider, more real
const scenarios = [
  // Example overlay only
  {
    id: 0,
    type: "example",
    baseBid: 1.2,
    baseAsk: 1.4,
    volatility: 0.03
  },
  // Guided (answers given)
  {
    id: 1,
    type: "guided",
    baseBid: 1.2,
    baseAsk: 1.4,
    volatility: 0.03
  },
  // Hint-assisted
  {
    id: 2,
    type: "hint",
    baseBid: 0.9,
    baseAsk: 1.2,
    volatility: 0.04
  },
  // Independent
  {
    id: 3,
    type: "independent",
    baseBid: 0.7,
    baseAsk: 1.0,
    volatility: 0.05
  },
  // Independent
  {
    id: 4,
    type: "independent",
    baseBid: 0.5,
    baseAsk: 0.9,
    volatility: 0.06
  }
];

let balance = START_BALANCE;
let currentScenarioIndex = 0;
let phase = "example";
let timerStart = null;
let timerInterval = null;
let priceInterval = null;

let bid = 1.2;
let ask = 1.4;
let mid = 1.3;

let ownedContracts = 0;
let entryPrice = 0;
let mistakes = 0;

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

updateBalanceDisplay();
showExampleOverlay();

function showExampleOverlay() {
  const example = scenarios[0];
  const exampleMid = ((example.baseBid + example.baseAsk) / 2).toFixed(2);

  overlayContent.innerHTML = `
    <h2>Level 2 – The Real Market</h2>
    <p>
      The market now moves faster. Spreads widen and collapse. You must still
      strike at the <strong>MID</strong>.
    </p>
    <p>
      Example:<br>
      BID: $${example.baseBid.toFixed(2)}<br>
      ASK: $${example.baseAsk.toFixed(2)}<br>
      MID: <strong>$${exampleMid}</strong>
    </p>
    <p>
      You still start with <strong>$100</strong>. The rules are the same:
      buy at the MID, sell at the MID, and respect the timer.
    </p>
    <button class="gold-bar-btn overlay-btn" onclick="beginScenario(1)">
      BEGIN LEVEL 2
    </button>
  `;
  overlay.classList.add("open");
}

function showFailureOverlay(message) {
  overlayContent.innerHTML = `
    <h2>Trial Failed</h2>
    <p>${message}</p>
    <p>You must restart Level 2 from the beginning.</p>
    <button class="gold-bar-btn overlay-btn" onclick="restartLevel()">
      RESTART LEVEL 2
    </button>
  `;
  overlay.classList.add("open");
}

function showSuccessOverlay() {
  overlayContent.innerHTML = `
    <h2>Level 2 Complete</h2>
    <p>
      You have survived a more realistic market. The next chamber is the true Arena.
    </p>
    <button class="gold-bar-btn overlay-btn" onclick="goToNextLevel()">
      ASCEND TO LEVEL 3
    </button>
  `;
  overlay.classList.add("open");
}

function closeOverlay() {
  overlay.classList.remove("open");
}

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

function restartLevel() {
  stopTimer();
  stopPriceEngine();
  balance = START_BALANCE;
  updateBalanceDisplay();
  beginScenario(1);
}

function goToNextLevel() {
  window.location.href = "arena-level3.html";
}

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

function startPriceEngine(scenario) {
  stopPriceEngine();
  priceInterval = setInterval(() => {
    const v = scenario.volatility;
    bid += (Math.random() - 0.5) * v;
    ask += (Math.random() - 0.5) * v;

    if (ask <= bid + 0.05) {
      ask = bid + 0.05;
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

function updateBalanceDisplay() {
  balanceEl.textContent = `$${balance.toFixed(2)}`;
}

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

  const scenario = scenarios[currentScenarioIndex];
  if (scenario.type === "guided" && phase === "buy") {
    const suggestedContracts = 5;
    const suggestedPrice = mid.toFixed(2);
    orderMessageEl.innerHTML =
      `For this first trial of Level 2, enter <strong>${suggestedContracts}</strong> contracts at the MID <strong>$${suggestedPrice}</strong>.`;
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

function handleBuyPhase(scenario, c, p, midNow, total) {
  if (parseFloat(p.toFixed(2)) !== midNow) {
    mistakes++;
    handleMistake(scenario, "You must enter the MID price to be filled.");
    return;
  }

  if (total > balance + 0.0001) {
    mistakes++;
    handleMistake(scenario, "You don't have enough gold for that many contracts.");
    return;
  }

  ownedContracts = c;
  entryPrice = p;
  balance -= total;
  updateBalanceDisplay();

  orderMessageEl.innerHTML = `<span style="color:#7CFC00;">Perfect Entry — Filled at MID.</span>`;
  stopTimer();

  bid += 0.07;
  ask += 0.07;
  mid = (bid + ask) / 2;
  updatePriceDisplay();

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

function handleSellPhase(scenario, c, p, midNow, total) {
  if (c > ownedContracts) {
    mistakes++;
    handleMistake(scenario, "You cannot sell more contracts than you own.");
    return;
  }

  if (parseFloat(p.toFixed(2)) !== midNow) {
    mistakes++;
    handleMistake(scenario, "You must exit at the MID to keep your edge.");
    return;
  }

  const proceeds = c * p;
  const cost = c * entryPrice;
  const profit = proceeds - cost;
  balance += proceeds;
  ownedContracts -= c;
  updateBalanceDisplay();
  stopTimer();

  orderMessageEl.innerHTML =
    `<span style="color:#7CFC00;">Clean Exit — You took $${profit.toFixed(2)} in profit.</span>`;

  setTimeout(() => {
    if (currentScenarioIndex < 4) {
      beginScenario(currentScenarioIndex + 1);
    } else {
      stopPriceEngine();
      showSuccessOverlay();
    }
  }, 1200);
}

function handleMistake(scenario, baseMessage) {
  const type = scenario.type;
  let hint = baseMessage;

  if (type === "guided") {
    const midNow = mid.toFixed(2);
    hint += ` Use the MID exactly as shown: $${midNow}.`;
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

function fail(message) {
  stopTimer();
  stopPriceEngine();
  orderModule.classList.remove("open");
  showFailureOverlay(message);
}
