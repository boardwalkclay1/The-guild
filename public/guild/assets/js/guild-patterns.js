// guild-patterns.js

// =========================
// 1. CORE HINTS (GLOSSARY)
// =========================
const GUILD_HINTS = [
  "A breakout without volume is a warning, not a signal.",
  "Reversal patterns matter most after extended trends.",
  "The second low in a double bottom must hold or the pattern is invalid.",
  "Flags form after strong moves, not inside choppy ranges.",
  "A trendline touch is not an entry by itself—wait for confirmation.",
  "Neckline breaks confirm most reversal patterns.",
  "The best patterns form at key support and resistance levels.",
  "Volume should confirm, not contradict, the pattern."
];

// =========================
// 2. CORE PATTERNS (FILES)
// =========================
// You create these images:
// /guild/assets/image/patterns/<id>.png
// Example: double-bottom.png, double-top.png, etc.
const CORE_PATTERNS = [
  {
    id: "double-bottom",
    name: "Double Bottom",
    level: 1,
    category: "Bullish Reversal",
    trendContext: "After a downtrend",
    image: "/guild/training/img/double-bottom.png",
    tags: ["bullish", "reversal", "foundational"],
    description: "Price makes two similar lows with a bounce in between, forming a W shape. It signals sellers are exhausted and buyers are stepping in.",
    structureRules: [
      "Forms after a clear downtrend.",
      "Two lows near the same price level.",
      "A bounce between the lows creates a neckline.",
      "Break and close above the neckline confirms the pattern."
    ],
    howToTrade: [
      "Wait for a close above the neckline.",
      "Enter on breakout or on a retest of the neckline.",
      "Place stop below the second low.",
      "Target = distance from lows to neckline projected upward."
    ],
    traps: [
      "Entering before the neckline breaks.",
      "Second low much lower than the first.",
      "No volume expansion on the breakout."
    ]
  },
  {
    id: "double-top",
    name: "Double Top",
    level: 1,
    category: "Bearish Reversal",
    trendContext: "After an uptrend",
    image: "/guild/training/img/double-top.png",
    tags: ["bearish", "reversal", "foundational"],
    description: "Price makes two similar highs with a drop in between, forming an M shape. It signals buyers are failing at the same level twice.",
    structureRules: [
      "Forms after a clear uptrend.",
      "Two highs near the same price level.",
      "A low between the highs creates a neckline.",
      "Break and close below the neckline confirms the pattern."
    ],
    howToTrade: [
      "Wait for a close below the neckline.",
      "Enter on breakdown or retest of the neckline from below.",
      "Place stop above the second high.",
      "Target = distance from highs to neckline projected downward."
    ],
    traps: [
      "Shorting too early before neckline break.",
      "Highs too far apart in time or price.",
      "No volume on the breakdown."
    ]
  },
  {
    id: "triple-top",
    name: "Triple Top",
    level: 1,
    category: "Bearish Reversal",
    trendContext: "After an uptrend",
    image: "/guild/training/img/triple-top.png",
    tags: ["bearish", "reversal"],
    description: "Price fails three times at the same resistance level, showing strong selling pressure and distribution.",
    structureRules: [
      "Forms after an uptrend.",
      "Three highs at roughly the same level.",
      "Support line (neckline) under the swing lows.",
      "Break below support confirms the pattern."
    ],
    howToTrade: [
      "Wait for a clean break below support.",
      "Enter on breakdown or retest of broken support.",
      "Place stop above the last high.",
      "Target = height of the pattern projected downward."
    ],
    traps: [
      "Confusing a range with a triple top.",
      "Entering before support breaks.",
      "Ignoring volume confirmation."
    ]
  },
  {
    id: "triple-bottom",
    name: "Triple Bottom",
    level: 1,
    category: "Bullish Reversal",
    trendContext: "After a downtrend",
    image: "/guild/training/img/triple-bottom.png",
    tags: ["bullish", "reversal"],
    description: "Price holds three times at the same support level, showing strong demand and accumulation.",
    structureRules: [
      "Forms after a downtrend.",
      "Three lows at roughly the same level.",
      "Resistance line above the swing highs.",
      "Break above resistance confirms the pattern."
    ],
    howToTrade: [
      "Wait for a break and close above resistance.",
      "Enter on breakout or retest of resistance as support.",
      "Place stop below the last low.",
      "Target = height of the pattern projected upward."
    ],
    traps: [
      "Entering before resistance breaks.",
      "Lows not aligned (too uneven).",
      "No volume on breakout."
    ]
  },
  {
    id: "cup-handle",
    name: "Cup & Handle",
    level: 1,
    category: "Bullish Continuation",
    trendContext: "In an uptrend or after a base",
    image: "/guild/training/img/cup-handle.png",
    tags: ["bullish", "continuation"],
    description: "Price forms a rounded bottom (cup) followed by a smaller pullback (handle). It signals reaccumulation before continuation higher.",
    structureRules: [
      "Cup is rounded, not a sharp V.",
      "Handle is a shallow pullback near the highs.",
      "Breakout above handle resistance confirms the pattern."
    ],
    howToTrade: [
      "Wait for breakout above handle resistance.",
      "Enter on breakout or retest of the breakout level.",
      "Place stop below the handle low.",
      "Target = depth of the cup projected upward."
    ],
    traps: [
      "Handle too deep or too long.",
      "Cup too sharp (V-shaped).",
      "Entering before handle forms."
    ]
  },
  {
    id: "head-shoulders",
    name: "Head & Shoulders",
    level: 1,
    category: "Bearish Reversal",
    trendContext: "After an uptrend",
    image: "/guild/training/img/head-shoulders.png",
    tags: ["bearish", "reversal", "classic"],
    description: "A peak (left shoulder), a higher peak (head), and a lower peak (right shoulder) with a neckline. It signals distribution and trend reversal.",
    structureRules: [
      "Forms after a clear uptrend.",
      "Head is higher than both shoulders.",
      "Neckline connects the swing lows.",
      "Break below neckline confirms the pattern."
    ],
    howToTrade: [
      "Wait for a close below the neckline.",
      "Enter on breakdown or retest of neckline from below.",
      "Place stop above the right shoulder.",
      "Target = distance from head to neckline projected downward."
    ],
    traps: [
      "Shoulders not reasonably symmetrical.",
      "Entering before neckline break.",
      "Ignoring volume (often lighter on right shoulder)."
    ]
  },
  {
    id: "inverse-head-shoulders",
    name: "Inverse Head & Shoulders",
    level: 1,
    category: "Bullish Reversal",
    trendContext: "After a downtrend",
    image: "/guild/training/img/inverse-head-shoulder.png",
    tags: ["bullish", "reversal", "classic"],
    description: "Three lows: shoulder, deeper head, and higher shoulder, with a neckline above. It signals accumulation and trend reversal upward.",
    structureRules: [
      "Forms after a clear downtrend.",
      "Head is lower than both shoulders.",
      "Neckline connects the swing highs.",
      "Break above neckline confirms the pattern."
    ],
    howToTrade: [
      "Wait for a close above the neckline.",
      "Enter on breakout or retest of neckline as support.",
      "Place stop below the right shoulder.",
      "Target = distance from head to neckline projected upward."
    ],
    traps: [
      "Shoulders extremely uneven.",
      "Entering before neckline break.",
      "No volume expansion on breakout."
    ]
  },
  {
    id: "rising-wedge",
    name: "Rising Wedge (Usually Bearish)",
    level: 1,
    category: "Bearish (often reversal or continuation)",
    trendContext: "After an uptrend or inside a move up",
    image: "/guild/training/img/rising-wedge.png",
    tags: ["bearish", "wedge", "momentum-loss"],
    description: "Price makes higher highs and higher lows, but the range narrows and momentum fades. Often breaks down.",
    structureRules: [
      "Both highs and lows are rising.",
      "Trendlines converge (wedge shape).",
      "Volume often decreases into the apex.",
      "Breakdown below lower trendline confirms."
    ],
    howToTrade: [
      "Wait for a break below the lower trendline.",
      "Enter on breakdown or retest of broken support.",
      "Place stop above the last swing high.",
      "Target = height of the wedge projected downward."
    ],
    traps: [
      "Confusing a channel with a wedge.",
      "Entering before breakdown.",
      "Ignoring the broader trend context."
    ]
  },
  {
    id: "falling-wedge",
    name: "Falling Wedge (Usually Bullish)",
    level: 1,
    category: "Bullish (often reversal or continuation)",
    trendContext: "After a downtrend or inside a move down",
    image: "/guild/training/img/falling-wedge.png",
    tags: ["bullish", "wedge", "momentum-loss"],
    description: "Price makes lower highs and lower lows, but the range narrows and selling pressure fades. Often breaks upward.",
    structureRules: [
      "Both highs and lows are falling.",
      "Trendlines converge (wedge shape).",
      "Volume often decreases into the apex.",
      "Breakout above upper trendline confirms."
    ],
    howToTrade: [
      "Wait for a break above the upper trendline.",
      "Enter on breakout or retest of broken resistance.",
      "Place stop below the last swing low.",
      "Target = height of the wedge projected upward."
    ],
    traps: [
      "Confusing a simple downtrend with a wedge.",
      "Entering before breakout.",
      "Ignoring volume confirmation."
    ]
  },
  {
    id: "rounding-bottom",
    name: "Rounding Bottom (Saucer)",
    level: 1,
    category: "Bullish Reversal",
    trendContext: "After a prolonged decline or base",
    image: "/guild/assets/image/patterns/rounding-bottom.png",
    tags: ["bullish", "reversal", "accumulation"],
    description: "Price slowly transitions from downtrend to uptrend with a smooth, rounded bottom. It reflects quiet accumulation over time.",
    structureRules: [
      "Long, smooth, rounded bottom (not a sharp V).",
      "Volatility often contracts near the lows.",
      "Breakout above resistance confirms the pattern."
    ],
    howToTrade: [
      "Identify the rounded base forming over time.",
      "Wait for a breakout above resistance at the rim.",
      "Place stop below recent higher low.",
      "Target = depth of the base projected upward."
    ],
    traps: [
      "Mistaking a choppy range for a saucer.",
      "Entering too early before the right side forms.",
      "Ignoring overall market trend."
    ]
  },
  {
    id: "rounding-top",
    name: "Rounding Top",
    level: 1,
    category: "Bearish Reversal",
    trendContext: "After a prolonged advance",
    image: "/guild/assets/image/patterns/rounding-top.png",
    tags: ["bearish", "reversal", "distribution"],
    description: "Price slowly transitions from uptrend to downtrend with a smooth, rounded top. It reflects quiet distribution over time.",
    structureRules: [
      "Long, smooth, rounded top (not a sharp spike).",
      "Momentum fades as price grinds sideways and lower.",
      "Breakdown below support confirms the pattern."
    ],
    howToTrade: [
      "Identify the rounded top forming over time.",
      "Wait for a breakdown below key support.",
      "Place stop above recent lower high.",
      "Target = height of the top projected downward."
    ],
    traps: [
      "Shorting too early inside the top.",
      "Confusing consolidation with topping.",
      "Ignoring volume and broader market context."
    ]
  }
];

// Placeholder for more advanced patterns later
const ADVANCED_PATTERNS = []; // you can append Level 2–4 here later

const ALL_PATTERNS = [...CORE_PATTERNS, ...ADVANCED_PATTERNS];

// =========================
// 3. RENDERING + INTERACTION
// =========================
function renderPatternList(patterns) {
  const listEl = document.getElementById("pattern-list");
  if (!listEl) return;
  listEl.innerHTML = "";

  patterns.forEach(p => {
    const item = document.createElement("button");
    item.className = "pattern-item";
    item.dataset.id = p.id;
    item.innerHTML = `
      <div class="pattern-name">${p.name}</div>
      <div class="pattern-meta">${p.category} • Level ${p.level}</div>
    `;
    listEl.appendChild(item);
  });
}

function renderPatternDetail(pattern) {
  const detailEl = document.getElementById("pattern-detail");
  if (!detailEl) return;
  if (!pattern) {
    detailEl.innerHTML = `<div class="placeholder-box">Select a pattern to see details.</div>`;
    return;
  }

  detailEl.innerHTML = `
    <h2>${pattern.name}</h2>
    <p class="pattern-context">${pattern.category} • ${pattern.trendContext}</p>
    <div class="pattern-image-wrap">
      <img src="${pattern.image}" alt="${pattern.name}" class="pattern-image" />
    </div>
    <p class="pattern-description">${pattern.description}</p>

    <h3>What makes it this pattern</h3>
    <ul class="pattern-list">
      ${pattern.structureRules.map(r => `<li>${r}</li>`).join("")}
    </ul>

    <h3>How to trade it</h3>
    <ul class="pattern-list">
      ${pattern.howToTrade.map(r => `<li>${r}</li>`).join("")}
    </ul>

    <h3>Common traps</h3>
    <ul class="pattern-list">
      ${pattern.traps.map(r => `<li>${r}</li>`).join("")}
    </ul>

    <div class="pattern-actions">
      <button class="guild-btn" id="pattern-sim-btn">Open Simulator</button>
    </div>
  `;
}

function setupPatternInteractions() {
  const listEl = document.getElementById("pattern-list");
  const searchEl = document.getElementById("pattern-search");

  if (!listEl) return;

  // Initial render
  renderPatternList(ALL_PATTERNS);
  renderPatternDetail(null);

  // Click handler
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".pattern-item");
    if (!btn) return;
    const id = btn.dataset.id;
    const pattern = ALL_PATTERNS.find(p => p.id === id);
    renderPatternDetail(pattern);
  });

  // Search
  if (searchEl) {
    searchEl.addEventListener("input", () => {
      const q = searchEl.value.toLowerCase();
      const filtered = ALL_PATTERNS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
      renderPatternList(filtered);
      renderPatternDetail(null);
    });
  }
}

// =========================
// 4. HINTS TICKER
// =========================
function startHintsTicker() {
  const hintEl = document.getElementById("pattern-hints");
  if (!hintEl) return;

  function setRandomHint() {
    const hint = GUILD_HINTS[Math.floor(Math.random() * GUILD_HINTS.length)];
    hintEl.textContent = hint;
  }

  setRandomHint();
  setInterval(setRandomHint, 7000);
}

// =========================
// 5. INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  setupPatternInteractions();
  startHintsTicker();
});
