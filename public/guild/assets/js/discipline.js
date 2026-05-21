const content = {
  physical: `
    <h1>Physical Discipline</h1>
    <p>Your body is the foundation of your trading performance. Weak body = weak execution.</p>

    <p>
      • Wake up by <strong>9:00 AM every day</strong><br>
      • Hydrate before touching your phone<br>
      • Keep your workspace clean and intentional<br>
      • No late nights before trading days<br>
      • No alcohol or chaos during trading weeks<br>
      • Stretch, breathe, and reset before the bell
    </p>

    <p>A disciplined body creates a disciplined mind.</p>
  `,

  emotional: `
    <h1>Emotional Discipline</h1>
    <p>The market exposes your emotions more than your strategy. Control yourself or the market will control you.</p>

    <p>
      • Never chase<br>
      • Never force trades<br>
      • Never trade angry, tired, or emotional<br>
      • Accept losses without spiraling<br>
      • Follow your plan even when it’s boring<br>
      • Detach from outcomes — focus on execution
    </p>

    <p>Emotional mastery separates Guild members from gamblers.</p>
  `,

  strategic: `
    <h1>Strategic Discipline</h1>
    <p>Strategy is preparation. Every Guild member studies the market like a battlefield.</p>

    <p>
      • Review your watchlist nightly<br>
      • Study chart patterns daily<br>
      • Track your wins and losses<br>
      • Know your setups before the bell rings<br>
      • Never enter a trade without a reason<br>
      • Respect timing — entries matter more than opinions
    </p>

    <p>Strategy is the sword. Discipline is the hand that wields it.</p>
  `,

  lifestyle: `
    <h1>Lifestyle Discipline</h1>
    <p>The Guild is a lifestyle. Your habits outside the market determine your success inside it.</p>

    <p>
      • Keep your finances organized<br>
      • Surround yourself with disciplined people<br>
      • Protect your mental space<br>
      • Limit distractions<br>
      • Build routines that support your goals<br>
      • Remove people who don’t respect your journey
    </p>

    <p>Wealth is built in your lifestyle long before it shows in your account.</p>
  `,

  focus: `
    <h1>Focus & Timing</h1>
    <p>Focus is a weapon. Timing is a skill. Together they create precision.</p>

    <p>
      • Be on time — the market rewards punctuality<br>
      • Study the night before so you enter the day prepared<br>
      • Keep your mind clear before the bell<br>
      • No distractions, no noise, no unnecessary conversations<br>
      • Protect your attention like it’s capital<br>
      • If your mind is scattered, you do not trade
    </p>

    <p>Focus is the edge most traders never develop.</p>
  `,

  mindset: `
    <h1>Guild Mindset</h1>
    <p>Your mindset determines your ceiling. The Guild mindset is built on clarity, discipline, and purpose.</p>

    <p>
      • You are responsible for your results<br>
      • You do not complain — you adjust<br>
      • You do not compare — you improve<br>
      • You do not seek validation — you seek mastery<br>
      • You stay committed even when others quit<br>
      • You stay loyal to the journey, not the emotions
    </p>

    <p>The Guild mindset is forged, not given.</p>
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
