let bananas = 0;

let monkeys = 0;
let farmerMonkeys = 0;
let scholarMonkeys = 0;

let monkeyCost = 10;
let farmerCost = 25;
let scholarCost = 50;

let tech = {
  foraging: { level: 0, baseCost: 100, costMult: 1.5 },
  math: { level: 0, baseCost: 150, costMult: 1.6 }
};

// --- Tab Navigation Functions ---
function openTab(evt, tabName) {
    // Declare all variables
    let i, tabcontent, tabbuttons;

    // Get all elements with class="tab-content" and hide them
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // Get all elements with class="tab-button" and remove the "active" class
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function gatherBananas() {
  bananas++;
  log("You picked a banana! 🍌");
  updateDisplay();
}

function buyMonkey() {
  if (bananas >= monkeyCost) {
    bananas -= monkeyCost;
    monkeys++;
    monkeyCost = Math.floor(monkeyCost * 1.3);
    log("Basic monkey joined you! 🐒");
    updateDisplay();
  } else {
    log("Not enough bananas!");
  }
}

function buyFarmerMonkey() {
  if (bananas >= farmerCost) {
    bananas -= farmerCost;
    farmerMonkeys++;
    farmerCost = Math.floor(farmerCost * 1.4);
    log("Farmer monkey is ready to farm! 👨‍🌾🐵");
    updateDisplay();
  } else {
    log("Not enough bananas!");
  }
}

function buyScholarMonkey() {
  if (bananas >= scholarCost) {
    bananas -= scholarCost;
    scholarMonkeys++;
    scholarCost = Math.floor(scholarCost * 1.6);
    log("A scholar monkey starts thinking... 🧠🐒");
    // When Scholar Monkey is bought, reveal the Tech tab button
    document.getElementById("techTabButton").style.display = "block";
    // Optionally, automatically switch to the Tech tab
    // We'll simulate a click event to activate the tab
    const techTabButton = document.getElementById("techTabButton");
    openTab({ currentTarget: techTabButton }, 'techTab'); // Use 'techTab'
    updateDisplay();
  } else {
    log("Not enough bananas!");
  }
}

function buyTech(type) {
  const upgrade = tech[type];
  const currentLevel = upgrade.level;
  const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMult, currentLevel));
  if (bananas >= cost) {
    bananas -= cost;
    upgrade.level++;
    log(`Tech upgraded: ${type === "foraging" ? "Efficient Foraging" : "Banana Math"} (Level ${upgrade.level})`);
  } else {
    log("Not enough bananas for tech upgrade!");
  }
  updateDisplay();
}

function getBananasPerSecond() {
  let income = monkeys * 1 + farmerMonkeys * 2;
  if (tech.foraging.level > 0) {
    income *= (1 + 0.05 * tech.foraging.level);
  }
  if (tech.math.level > 0) {
    income += farmerMonkeys * (0.2 * tech.math.level);
  }
  return income;
}

function updateDisplay() {
  document.getElementById("bananas").innerText = Math.floor(bananas).toLocaleString();
  document.getElementById("monkeys").innerText = monkeys;
  document.getElementById("farmerMonkeys").innerText = farmerMonkeys;
  document.getElementById("scholarMonkeys").innerText = scholarMonkeys;
  document.getElementById("monkeyCost").innerText = monkeyCost;
  document.getElementById("farmerCost").innerText = farmerCost;
  document.getElementById("scholarCost").innerText = scholarCost;
  document.getElementById("incomePerSecond").innerText = getBananasPerSecond().toFixed(2);

  const forage = tech.foraging;
  const math = tech.math;
  const forageCost = Math.floor(forage.baseCost * Math.pow(forage.costMult, forage.level));
  const mathCost = Math.floor(math.baseCost * Math.pow(math.costMult, math.level));
  document.getElementById("foragingBtn").innerText =
    `Efficient Foraging (+5% income) – Level ${forage.level} – Cost: ${forageCost} bananas`;
  document.getElementById("mathBtn").innerText =
    `Banana Math (+10% Farmer income) – Level ${math.level} – Cost: ${mathCost} bananas`;
}

function log(msg) {
  const logBox = document.getElementById("logBox");
  const currentLogs = logBox.innerHTML.trim().split('<br>');
  const newMsg = msg;

  currentLogs.unshift(newMsg);
  if (currentLogs.length > 15) currentLogs.length = 15;

  logBox.innerHTML = currentLogs.join('<br>');
}

// Function to reset all game progress
function resetProgress() {
  if (confirm("Are you sure you want to reset all progress? This cannot be undone!")) {
    localStorage.removeItem('monkeyAscensionSave'); // Clear saved game
    // Reset all game variables to their initial state
    bananas = 0;
    monkeys = 0;
    farmerMonkeys = 0;
    scholarMonkeys = 0;
    monkeyCost = 10;
    farmerCost = 25;
    scholarCost = 50;
    tech = {
      foraging: { level: 0, baseCost: 100, costMult: 1.5 },
      math: { level: 0, baseCost: 150, costMult: 1.6 }
    };

    // Reset tab visibility and active state
    document.getElementById("techTabButton").style.display = "none"; // Hide tech tab button
    // Ensure "Monkeys" tab is active and visible content
    // Find the first tab button (Monkeys) and simulate a click
    const monkeysTabButton = document.querySelector('.tab-button[onclick*="monkeysTab"]');
    openTab({ currentTarget: monkeysTabButton }, 'monkeysTab');

    log("Game progress has been reset!"); // Log the reset
    updateDisplay(); // Update display to show reset values
  }
}

// Save & Load
function saveGame() {
  const state = {
    bananas,
    monkeys,
    farmerMonkeys,
    scholarMonkeys,
    monkeyCost,
    farmerCost,
    scholarCost,
    tech,
    // Save current active tab so it can be restored on load
    activeTab: document.querySelector('.tab-content.active')?.id || 'monkeysTab'
  };
  localStorage.setItem('monkeyAscensionSave', JSON.stringify(state));
}

function loadGame() {
  const state = JSON.parse(localStorage.getItem('monkeyAscensionSave'));
  if (state) {
    bananas = state.bananas;
    monkeys = state.monkeys;
    farmerMonkeys = state.farmerMonkeys;
    scholarMonkeys = state.scholarMonkeys;
    monkeyCost = state.monkeyCost;
    farmerCost = state.farmerCost;
    scholarCost = state.scholarCost;
    tech = state.tech;

    // Restore tech tab button visibility
    if (scholarMonkeys > 0) {
      document.getElementById("techTabButton").style.display = "block";
    }

    // Restore active tab
    const initialTab = state.activeTab || 'monkeysTab';
    const initialTabButton = document.querySelector(`.tab-button[onclick*="'${initialTab}'"]`);

    if (initialTabButton) {
        // We simulate the event object for openTab
        openTab({ currentTarget: initialTabButton }, initialTab);
    } else {
        // Fallback to default if somehow the saved tab button doesn't exist
        const defaultTabButton = document.querySelector('.tab-button[onclick*="monkeysTab"]');
        if (defaultTabButton) {
            openTab({ currentTarget: defaultTabButton }, 'monkeysTab');
        }
    }
  } else {
    // If no save data, ensure the default "Monkeys" tab is active initially
    const defaultTabButton = document.querySelector('.tab-button[onclick*="monkeysTab"]');
    if (defaultTabButton) {
        openTab({ currentTarget: defaultTabButton }, 'monkeysTab');
    }
  }
}

setInterval(saveGame, 5000);

setInterval(() => {
  bananas += getBananasPerSecond();
  updateDisplay();
}, 1000);

window.onload = function () {
  loadGame(); // This will also handle setting the initial tab via loadGame()
  updateDisplay();
};
