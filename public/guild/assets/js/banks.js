// BANKS.JS

const bankSelect = document.getElementById("bankSelect");
const bankEmbed = document.getElementById("bankEmbed");
const bankFrame = document.getElementById("bankFrame");
const directions = document.getElementById("directions");
const completeBtn = document.getElementById("completeBtn");
const xpMessage = document.getElementById("xpMessage");

bankSelect.addEventListener("change", () => {
  if (!bankSelect.value) return;

  // Load bank website
  bankFrame.src = bankSelect.value;
  bankEmbed.style.display = "block";

  // Show steps + completion button
  directions.style.display = "block";
  completeBtn.style.display = "block";
});

completeBtn.addEventListener("click", () => {
  // Award XP
  addXP(150);

  // Unlock badge
  unlockBadge("bank_setup");

  // Show confirmation
  xpMessage.style.display = "block";
});
