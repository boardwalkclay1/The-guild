document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".discipline-item");
  const panel = document.getElementById("disciplineContent");

  const sections = {
    emotional: `
      <h1>Emotional Discipline</h1>
      <p>Trading is not a battle against the market — it is a battle against yourself.</p>

      <h2>Fear</h2>
      <p>Fear appears when you lack structure. It makes you hesitate, exit too early, or avoid valid setups.</p>
      <img class="image-callout" src="/guild/training/img/discipline/fear.jpg">

      <h2>Greed</h2>
      <p>Greed whispers that you deserve more. It pushes you to break rules, overstay trades, and size too large.</p>
      <img class="image-callout" src="/guild/training/img/discipline/greed.jpg">

      <h2>Revenge</h2>
      <p>Revenge trading is the emotional spiral that destroys accounts. It is the refusal to accept loss.</p>
      <img class="image-callout" src="/guild/training/img/discipline/revenge.jpg">

      <h2>Euphoria</h2>
      <p>Winning feels good — too good. Euphoria is the most dangerous emotion because it makes you forget discipline.</p>
      <img class="image-callout" src="/guild/training/img/discipline/euphoria.jpg">
    `,

    phases: `
      <h1>The Emotional Phases of a Trader</h1>
      <p>Every trader walks the same path. Only the disciplined survive it.</p>

      <h2>Phase I — Awakening</h2>
      <p>Curiosity becomes excitement. Excitement becomes overconfidence.</p>
      <img class="image-callout" src="/guild/training/img/discipline/awakening.jpg">

      <h2>Phase II — First Losses</h2>
      <p>Shock. Denial. Frustration. Revenge. This is where most traders fall.</p>
      <img class="image-callout" src="/guild/training/img/discipline/losses.jpg">

      <h2>Phase III — Emotional Spiral</h2>
      <p>Fear takes over. You hesitate. You freeze. You stop trusting yourself.</p>
      <img class="image-callout" src="/guild/training/img/discipline/spiral.jpg">

      <h2>Phase IV — Breakthrough</h2>
      <p>You begin following rules. You stop forcing trades. You see structure.</p>
      <img class="image-callout" src="/guild/training/img/discipline/breakthrough.jpg">

      <h2>Phase V — Winning Phase</h2>
      <p>Winning feels like mastery — but it is the most dangerous moment.</p>
      <img class="image-callout" src="/guild/training/img/discipline/winning.jpg">

      <h2>Phase VI — True Discipline</h2>
      <p>You detach from outcomes. You execute without emotion. You become consistent.</p>
      <img class="image-callout" src="/guild/training/img/discipline/mastery.jpg">
    `,

    strategic: `
      <h1>Strategic Discipline</h1>
      <p>Your strategy is your sword. Your rules are your armor.</p>

      <h2>Risk Management</h2>
      <p>Risk is the only thing you control. Master it or perish.</p>

      <h2>Position Sizing</h2>
      <p>Small size keeps you alive. Large size kills you fast.</p>

      <h2>Trade Journaling</h2>
      <p>The Guild keeps records. Patterns reveal themselves only to those who track them.</p>

      <h2>Backtesting</h2>
      <p>Confidence comes from proof — not hope.</p>
    `,

    lifestyle: `
      <h1>Lifestyle Discipline</h1>
      <p>Your life outside the market affects your performance inside it.</p>

      <h2>Routine</h2>
      <p>Consistency in life creates consistency in trading.</p>

      <h2>Dopamine Control</h2>
      <p>Social media, gambling, and overstimulation destroy focus.</p>

      <h2>Environment</h2>
      <p>Your trading environment must be calm, clean, and controlled.</p>

      <h2>Money Habits</h2>
      <p>Bad financial habits outside the market bleed into your trading decisions.</p>
    `,

    withdrawal: `
      <h1>Taking Money Out of the Arena</h1>
      <p>Withdrawing profits feels strange at first — but it is the mark of a real trader.</p>

      <h2>Why It Feels Wrong</h2>
      <p>Your brain is addicted to seeing a big balance. Removing money feels like losing power.</p>

      <h2>Why It Must Be Done</h2>
      <p>Profits are not real until they leave the arena. Withdraw regularly.</p>

      <h2>The Guild Ritual</h2>
      <p>Every week or month, withdraw a portion of your gains. This builds confidence and discipline.</p>

      <img class="image-callout" src="/guild/training/img/discipline/withdraw.jpg">
    `
  };

  items.forEach(item => {
    item.addEventListener("click", () => {
      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      const key = item.getAttribute("data-discipline");
      panel.innerHTML = sections[key];
    });
  });
});
