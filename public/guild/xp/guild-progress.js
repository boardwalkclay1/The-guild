// guild-progress.js
// GLOBAL XP + BADGE ENGINE FOR THE ENTIRE GUILD

// =========================
// XP SYSTEM
// =========================
function getGuildXP() {
  return parseInt(localStorage.getItem("guild_xp") || "0");
}

function addGuildXP(amount) {
  const current = getGuildXP();
  const updated = current + amount;
  localStorage.setItem("guild_xp", updated);
  updateGuildHUD();
}

// =========================
// BADGE SYSTEM
// =========================
function earnBadge(badgeName) {
  localStorage.setItem("badge_" + badgeName, "earned");
  updateGuildHUD();
}

function hasBadge(badgeName) {
  return localStorage.getItem("badge_" + badgeName) === "earned";
}

// =========================
// BADGE LIST (GLOBAL)
// Add new badges here as you create modules
// =========================
const GUILD_BADGES = [
  { id: "not_guessing_mastery", label: "Not Guessing" },
  { id: "support_resistance_mastery", label: "Support & Resistance" },
  { id: "moving_averages_mastery", label: "Moving Averages" },
  { id: "look_left_mastery", label: "Look Left" },
  { id: "options_chain_mastery", label: "Options Chain" },
  { id: "guild_fam_mastery", label: "Guild Family" },
  { id: "oracle_mastery", label: "Market Oracle" }
];

// =========================
// HUD RENDERER
// =========================
function updateGuildHUD() {
  const xpEl = document.getElementById("guildXP");
  const badgeEl = document.getElementById("guildBadges");

  if (xpEl) xpEl.textContent = "XP: " + getGuildXP();

  if (badgeEl) {
    badgeEl.innerHTML = "";
    GUILD_BADGES.forEach(b => {
      if (hasBadge(b.id)) {
        const badge = document.createElement("div");
        badge.className = "guild-badge";
        badge.textContent = b.label;
        badgeEl.appendChild(badge);
      }
    });
  }
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", updateGuildHUD);
