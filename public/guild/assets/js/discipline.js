const content = {
  physical: `
    <h1>Physical Discipline</h1>
    <p>Your body is your first trading tool. If your body is weak, tired, or unfocused — your decisions will be too.</p>

    <p>
      • Wake up by <strong>9:00 AM every single day</strong><br>
      • Hydrate before touching your phone<br>
      • Keep your workspace clean and intentional<br>
      • No late nights before trading days<br>
      • No alcohol, partying, or chaos during trading weeks
    </p>

    <p>A disciplined body creates a disciplined mind.</p>
  `,

  emotional: `
    <h1>Emotional Discipline</h1>
    <p>The market exposes your emotions more than your strategy. Fear, greed, hesitation, revenge — these are the real enemies.</p>

    <p>
      • Never chase<br>
      • Never force trades<br>
      • Never trade angry, tired, or emotional<br>
      • Accept losses without spiraling<br>
      • Follow your plan even when it’s boring
    </p>

    <p>Emotional mastery is what separates Guild members from gamblers.</p>
  `,

  strategic: `
    <h1>Strategic Discipline</h1>
    <p>Strategy is not guessing — it is preparation. Every Guild member must study the market like a battlefield.</p>

    <p>
      • Review your watchlist nightly<br>
      • Study chart patterns daily<br>
      • Track your wins and losses<br>
      • Know your setups before the bell rings<br>
      • Never enter a trade without a reason
    </p>

    <p>Strategy is the sword. Discipline is the hand that wields it.</p>
  `,

  lifestyle: `
    <h1>Lifestyle Discipline</h1>
    <p>The Guild is not a hobby — it is a lifestyle. Your habits outside the market determine your success inside it.</p>

    <p>
      • Keep your finances organized<br>
      • Surround yourself with disciplined people<br>
      • Protect your mental space<br>
      • Limit distractions<br>
      • Build routines that support your goals
    </p>

    <p>Wealth is not built in the market — it is built in your lifestyle.</p>
  `
};

const items = document.querySelectorAll(".discipline-item");
const panel = document.getElementById("disciplineContent");

items.forEach(item => {
  item.addEventListener("click", () => {
    items.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const key = item.dataset.discipline;
    panel.innerHTML = content[key];
  });
});
