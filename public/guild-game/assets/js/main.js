// =========================
// GLOBAL GAME STATE
// =========================

const gameState = {
  level: 1,
  playerHP: 100,
  dragonHP: 100,
  potions: {
    heal: 3,
    shield: 2,
    boost: 1
  },
  shieldActive: false,
  boostActive: false
};

// =========================
// DOM ELEMENTS
// =========================

const bg = document.getElementById("bg");
const dragonImg = document.getElementById("dragon-img");
const levelTitle = document.getElementById("level-title");
const storyBox = document.getElementById("story-box");
const playerHPBar = document.getElementById("player-hp");
const dragonHPBar = document.getElementById("dragon-hp");
const feedback = document.getElementById("feedback");

const flowLeft = document.getElementById("flow-left");
const flowRight = document.getElementById("flow-right");
const midInput = document.getElementById("mid-input");
const midBtn = document.getElementById("mid-btn");

const potionBtns = document.querySelectorAll(".potion-btn");

// =========================
// LEVEL LOADER
// =========================

function loadLevel(num) {
  import(`./levels/level${num}.js`)
    .then(module => {
      const level = module.default;

      // Apply level data
      bg.style.backgroundImage = `url('${level.bg}')`;
      dragonImg.src = level.dragonImg;
      levelTitle.textContent = level.name;
      storyBox.textContent = level.story;

      // Set flows (bid/ask disguised)
      flowLeft.textContent = level.flow.left.toFixed(2);
      flowRight.textContent = level.flow.right.toFixed(2);

      // Reset HP
      gameState.dragonHP = level.dragonHP;
      updateBars();
    });
}

function updateBars() {
  playerHPBar.style.width = gameState.playerHP + "%";
  dragonHPBar.style.width = gameState.dragonHP + "%";
}

// =========================
// MID PRICE ATTACK
// =========================

midBtn.addEventListener("click", () => {
  const level = window.currentLevelData;
  const val = parseFloat(midInput.value);

  if (isNaN(val)) {
    feedback.textContent = "Enter a strike value.";
    feedback.style.color = "#FF5252";
    return;
  }

  const mid = (level.flow.left + level.flow.right) / 2;
  const diff = Math.abs(val - mid);

  if (diff <= level.tolerance) {
    let dmg = level.baseDamage;

    if (gameState.boostActive) {
      dmg *= 2;
      gameState.boostActive = false;
    }

    gameState.dragonHP -= dmg;
    feedback.textContent = "Critical strike!";
    feedback.style.color = "#4CAF50";
  } else {
    let dmg = level.dragonDamage;

    if (gameState.shieldActive) {
      dmg *= 0.5;
      gameState.shieldActive = false;
    }

    gameState.playerHP -= dmg;
    feedback.textContent = "Your strike was weak. The beast retaliates.";
    feedback.style.color = "#FFB300";
  }

  updateBars();
  midInput.value = "";

  if (gameState.dragonHP <= 0) {
    nextLevel();
  }

  if (gameState.playerHP <= 0) {
    gameOver();
  }
});

// =========================
// POTIONS
// =========================

potionBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;

    if (gameState.potions[type] <= 0) {
      feedback.textContent = "You are out of that potion.";
      feedback.style.color = "#FF5252";
      return;
    }

    gameState.potions[type]--;

    if (type === "heal") {
      gameState.playerHP = Math.min(100, gameState.playerHP + 30);
      feedback.textContent = "Stability restored.";
    }

    if (type === "shield") {
      gameState.shieldActive = true;
      feedback.textContent = "Risk Guard activated.";
    }

    if (type === "boost") {
      gameState.boostActive = true;
      feedback.textContent = "Momentum Surge ready.";
    }

    updateBars();
  });
});

// =========================
// LEVEL PROGRESSION
// =========================

function nextLevel() {
  gameState.level++;
  if (gameState.level > 10) {
    victory();
    return;
  }
  loadLevel(gameState.level);
}

function gameOver() {
  alert("You were defeated. The Market Beast overwhelms you.");
  location.reload();
}

function victory() {
  alert("You have conquered all Market Beasts. You are now a Guild Master.");
  location.reload();
}

// =========================
// INIT
// =========================

loadLevel(1);
