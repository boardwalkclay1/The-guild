const ruleInfo = {
  1: `
    <h2>1. Study Before You Trade</h2>
    <p>
      The market is a battlefield. Entering without preparation is the same as charging in blind.
      Every Guild member studies before they strike.
    </p>

    <p><strong>What to study daily:</strong></p>
    <ul>
      <li>Premarket levels</li>
      <li>Gap ups / gap downs</li>
      <li>Key support and resistance</li>
      <li>Trend direction on multiple timeframes</li>
      <li>Volume behavior</li>
    </ul>

    <p>
      When you study, you remove uncertainty.  
      When you remove uncertainty, you remove fear.  
      When you remove fear, you execute like a Guildmaster.
    </p>
  `,

  2: `
    <h2>2. Respect Even Numbers</h2>
    <p>
      Whole numbers act like magnets.  
      They attract price, traders, algorithms, and liquidity.
    </p>

    <p><strong>Why they matter:</strong></p>
    <ul>
      <li>Large orders sit at even numbers</li>
      <li>Retail traders place stops there</li>
      <li>Algorithms trigger at these levels</li>
      <li>Breakouts and reversals often begin here</li>
    </ul>

    <p>
      When price approaches an even number, prepare for impact.  
      When it touches, prepare to strike.
    </p>
  `,

  3: `
    <h2>3. The Trend Is Your Commander</h2>
    <p>
      The trend is the most powerful force in the market.  
      Fighting it is financial suicide.
    </p>

    <p><strong>Trend rules:</strong></p>
    <ul>
      <li>Above the 9/20 EMA = strength</li>
      <li>Below the 9/20 EMA = weakness</li>
      <li>Higher highs + higher lows = uptrend</li>
      <li>Lower highs + lower lows = downtrend</li>
    </ul>

    <p>
      Your job is not to predict the trend.  
      Your job is to follow it.
    </p>
  `,

  4: `
    <h2>4. Always Know Your Exit</h2>
    <p>
      Most traders lose not because of entries — but because they never planned their exit.
    </p>

    <p><strong>You must know:</strong></p>
    <ul>
      <li>Your stop loss</li>
      <li>Your profit target</li>
      <li>Your invalidation level</li>
      <li>Your time stop (how long you will wait)</li>
    </ul>

    <p>
      A trader without an exit is a gambler.  
      A Guild member exits with precision.
    </p>
  `,

  5: `
    <h2>5. Quantity</h2>
    <p>
      Quantity is not about greed — it is about control.  
      Too many contracts destroy discipline.
    </p>

    <p><strong>Guild Quantity Rules:</strong></p>
    <ul>
      <li>Start with 1 contract</li>
      <li>Scale only after consistency</li>
      <li>Never size up emotionally</li>
      <li>Never size up after a loss</li>
    </ul>

    <p>
      Quantity amplifies everything — including your mistakes.  
      Master quantity, and you master survival.
    </p>
  `,

  6: `
    <h2>6. The Weekdays</h2>
    <p>
      Each day of the week has its own personality.  
      The Guild studies these rhythms.
    </p>

    <p><strong>Market Behavior by Day:</strong></p>
    <ul>
      <li><strong>Monday:</strong> Slow, choppy, discovery day</li>
      <li><strong>Tuesday:</strong> Strongest trend day</li>
      <li><strong>Wednesday:</strong> Reversal day</li>
      <li><strong>Thursday:</strong> Continuation day</li>
      <li><strong>Friday:</strong> Volatile, traps everywhere</li>
    </ul>

    <p>
      When you understand the rhythm of the week,  
      you stop fighting the market and start flowing with it.
    </p>
  `
};

/* Inject rule info when a rule is clicked */
document.addEventListener("DOMContentLoaded", () => {
  const rules = document.querySelectorAll(".rule");
  const details = document.getElementById("rule-details");

  rules.forEach(rule => {
    rule.addEventListener("click", () => {
      const id = rule.dataset.rule;
      details.innerHTML = `
        <div class="rule-detail-box">
          ${ruleInfo[id]}
        </div>
      `;
    });
  });
});
