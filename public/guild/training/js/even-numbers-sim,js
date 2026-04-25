// CONFIG
const START_PRICE = 10.20;
const ENTRY_PRICE = 10.00;
const EXIT_PRICE = 10.50;
const TICK_MS = 400;
const ENTRY_BAND = 0.02; // +/- around 10.00
const EXIT_BAND = 0.02;  // +/- around 10.50
const EXIT_WINDOW_SECONDS = 20;
const XP_REWARD = 200;
const BADGE_KEY = "even_numbers_mastery";

let price = START_PRICE;
let phase = "entry"; // "entry" | "exit" | "done"
let tickInterval = null;
let exitTimerInterval = null;
let exitTimeLeft = EXIT_WINDOW_SECONDS;
let enteredCorrectly = false;
let exitedCorrectly = false;

const priceDisplay = document.getElementById("priceDisplay");
const phaseDisplay = document.getElementById("phaseDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const statusText = document.getElementById("statusText");
const xpBanner = document.getElementById("xpBanner");

const enterBtn = document.getElementById("enterBtn");
const exitBtn = document.getElementById("exitBtn");
const restartBtn = document.getElementById("restartBtn");

function formatPrice(v) {
  return "$" + v.toFixed(2);
}

function updateUI() {
  priceDisplay.textContent = formatPrice(price);

  if (phase === "entry") {
    phaseDisplay.textContent = "Waiting for Entry";
  } else if (phase === "exit") {
    phaseDisplay.textContent = "Managing Exit";
  } else {
    phaseDisplay.textContent = "Complete";
  }

  if (phase === "exit") {
    timerDisplay.textContent = exitTimeLeft + "s";
  } else {
    timerDisplay.textContent = "--";
  }
}

function startEntryPhase() {
  phase = "entry";
  enteredCorrectly = false;
  exitedCorrectly = false;
  exitTimeLeft = EXIT_WINDOW_SECONDS;
  enterBtn.disabled = true;
  exitBtn.disabled = true;
  xpBanner.textContent = "";
  statusText.innerHTML =
    `Wait for price to touch <strong>${formatPrice(ENTRY_PRICE)}</strong> on the way down, then hit ENTER.`;

  price = START_PRICE;
  updateUI();

  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(tickEntryTick, TICK_MS);
}

function tickEntryTick() {
  // Drift downward with small randomness
  const step = 0.01 + Math.random() * 0.02;
  price = Math.max(ENTRY_PRICE - 0.05, price - step);

  updateUI();

  const inBand =
    price <= ENTRY_PRICE + ENTRY_BAND &&
    price >= ENTRY_PRICE - ENTRY_BAND;

  if (inBand) {
    enterBtn.disabled = false;
    statusText.innerHTML =
      `PRICE AT EVEN NUMBER — hit <strong>ENTER</strong> to open your contract.`;
  } else {
    enterBtn.disabled = true;
  }

  // If we drift too far below without entry, fail this run
  if (price < ENTRY_PRICE - ENTRY_BAND && !enteredCorrectly) {
    statusText.innerHTML = `You missed the even number. Restart and try again.`;
    clearInterval(tickInterval);
    phase = "done";
    updateUI();
  }
}

function startExitPhase() {
  phase = "exit";
  exitTimeLeft = EXIT_WINDOW_SECONDS;
  exitBtn.disabled = true;
  statusText.innerHTML =
    `Now ride the move up. Exit at <strong>${formatPrice(EXIT_PRICE)}</strong> when price hits the level.`;

  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(tickExitTick, TICK_MS);

  if (exitTimerInterval) clearInterval(exitTimerInterval);
  exitTimerInterval = setInterval(() => {
    exitTimeLeft--;
    if (exitTimeLeft <= 0) {
      clearInterval(exitTimerInterval);
      clearInterval(tickInterval);
      phase = "done";
      exitBtn.disabled = true;
      statusText.innerHTML = `Time expired at the top. You hesitated. Restart and try again.`;
    }
    updateUI();
  }, 1000);
}

function tickExitTick() {
  // Drift upward with noise
  const step = 0.01 + Math.random() * 0.03;
  price = Math.min(EXIT_PRICE + 0.08, price + step);

  // Add small jitter
  price += (Math.random() - 0.5) * 0.02;

  updateUI();

  const inBand =
    price <= EXIT_PRICE + EXIT_BAND &&
    price >= EXIT_PRICE - EXIT_BAND;

  if (inBand) {
    exitBtn.disabled = false;
    statusText.innerHTML =
      `PRICE AT TARGET — hit <strong>EXIT</strong> to close your contract.`;
  } else {
    exitBtn.disabled = true;
  }
}

enterBtn.addEventListener("click", () => {
  if (phase !== "entry" || enterBtn.disabled) return;

  const inBand =
    price <= ENTRY_PRICE + ENTRY_BAND &&
    price >= ENTRY_PRICE - ENTRY_BAND;

  if (!inBand) {
    statusText.innerHTML = `You did not enter at the even number. Restart and try again.`;
    clearInterval(tickInterval);
    phase = "done";
    updateUI();
    return;
  }

  enteredCorrectly = true;
  statusText.innerHTML =
    `Entry locked at ${formatPrice(price)}. Now wait for the move to ${formatPrice(EXIT_PRICE)} and exit.`;
  clearInterval(tickInterval);
  startExitPhase();
});

exitBtn.addEventListener("click", () => {
  if (phase !== "exit" || exitBtn.disabled) return;

  const inBand =
    price <= EXIT_PRICE + EXIT_BAND &&
    price >= EXIT_PRICE - EXIT_BAND;

  if (!inBand) {
    statusText.innerHTML = `You exited away from the target. Restart and try again.`;
    clearInterval(tickInterval);
    clearInterval(exitTimerInterval);
    phase = "done";
    updateUI();
    return;
  }

  exitedCorrectly = true;
  clearInterval(tickInterval);
  clearInterval(exitTimerInterval);
  phase = "done";
  updateUI();

  statusText.innerHTML =
    `Perfect strike. You entered at the even number and exited at the target.`;

  awardEvenNumberXP();
});

restartBtn.addEventListener("click", () => {
  if (tickInterval) clearInterval(tickInterval);
  if (exitTimerInterval) clearInterval(exitTimerInterval);
  startEntryPhase();
});

function awardEvenNumberXP() {
  // XP + badge via localStorage (xp.js / badges.js can also read these)
  let currentXP = parseInt(localStorage.getItem("guild_xp") || "0");
  currentXP += XP_REWARD;
  if (currentXP > 200) currentXP = 200; // cap for now as requested
  localStorage.setItem("guild_xp", currentXP);

  localStorage.setItem(BADGE_KEY, "earned");

  xpBanner.textContent = `+${XP_REWARD} XP earned. Total XP: ${currentXP}. Even Numbers badge unlocked.`;

  // Optional: rank logic (every 40 XP)
  const rank = Math.floor(currentXP / 40);
  if (rank > 0) {
    xpBanner.textContent += ` Rank: ${rank}.`;
  }
}

// INIT
startEntryPhase();
