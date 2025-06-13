let bananas = 0;
let wood = 0;

let monkeys = 0; // Represents total unallocated monkeys

// Allocated monkeys by job
let allocatedMonkeys = {
    forager: 0,
    farmer: 0,
    woodcutter: 0,
    scholar: 0
};

// Capacities for resources
let bananaCapacity = 5000;
let woodCapacity = 5000;

// Building variables
let treeHuts = 0;
let treeHutCost = 100;
let treeHutMonkeysGranted = 2;
let treeHutSellPriceRatio = 0.5;

let bananaGroves = 0;
let bananaGroveCost = 100;
let bananaGroveIncome = 0.55;
let bananaGroveSellPriceRatio = 0.5;


let tech = {
  foraging: { level: 0, baseCost: 100, costMult: 1.5 },
  math: { level: 0, baseCost: 150, costMult: 1.6 }
};

// --- Tab Navigation Functions ---
function openTab(evt, tabName) {
    let i, tabcontent, tabbuttons;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) { // Corrected loop condition from previous version
        tabbuttons[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function gatherBananas() {
  bananas++;
  log("You picked a banana! 🍌");
  updateDisplay();
}

function gatherWood() {
  wood++;
  log("You chopped some wood! 🪵");
  updateDisplay();
}

function buyBuilding(type) {
    if (type === 'treeHut') {
        if (wood >= treeHutCost) {
            wood -= treeHutCost;
            treeHuts++;
            monkeys += treeHutMonkeysGranted;
            treeHutCost = Math.floor(treeHutCost * 1.5);
            log(`Built a Tree Hut! (+${treeHutMonkeysGranted} Monkeys) 🏡🐒`);
            updateDisplay();
        } else {
            log("Not enough wood for a Tree Hut!");
        }
    } else if (type === 'bananaGrove') {
        if (bananas >= bananaGroveCost) {
            bananas -= bananaGroveCost;
            bananaGroves++;
            bananaGroveCost = Math.floor(bananaGroveCost * 1.3);
            log(`Planted a Banana Grove! (+${bananaGroveIncome} Bananas/sec) 🌿`);
            updateDisplay();
        } else {
            log("Not enough bananas for a Banana Grove!");
        }
    }
}

function sellBuilding(type) {
    if (type === 'treeHut') {
        if (treeHuts > 0) {
            treeHuts--;
            monkeys -= treeHutMonkeysGranted;
            if (monkeys < 0) monkeys = 0;

            const refund = Math.floor(treeHutCost * treeHutSellPriceRatio);
            wood += refund;
            treeHutCost = Math.floor(treeHutCost / 1.5);
            log(`Sold a Tree Hut! (Refunded ${refund} Wood) 🏡`);
            updateDisplay();
        } else {
            log("No Tree Huts to sell!");
        }
    } else if (type === 'bananaGrove') {
        if (bananaGroves > 0) {
            bananaGroves--;
            const refund = Math.floor(bananaGroveCost * bananaGroveSellPriceRatio);
            bananas += refund;
            bananaGroveCost = Math.floor(bananaGroveCost / 1.3);
            log(`Sold a Banana Grove! (Refunded ${refund} Bananas) 🌿`);
            updateDisplay();
        } else {
            log("No Banana Groves to sell!");
        }
    }
}


// Unified hover functions for all building BUY prices/effects
function showBuildingCost(type) {
    const tooltip = document.getElementById("buildingTooltip");
    let costText = "";
    let effectText = "";
    let costResource = "";

    if (type === 'treeHut') {
        costText = treeHutCost;
        costResource = "Wood";
        effectText = `+${treeHutMonkeysGranted} Monkeys`;
    } else if (type === 'bananaGrove') {
        costText = bananaGroveCost;
        costResource = "Bananas";
        effectText = `+${bananaGroveIncome.toFixed(2)} Bananas/sec`;
    }

    tooltip.innerText = `Cost: ${costText} ${costResource}\nEffect: ${effectText}`;
    tooltip.style.display = "block";

    const button = event.target;
    const rect = button.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + "px";
    tooltip.style.top = rect.top + "px";
}

// Unified hover function for building SELL price
function showBuildingSellPrice(type) {
    const tooltip = document.getElementById("buildingTooltip");
    let sellPrice = 0;
    let sellResource = "";
    let currentCount = 0;

    if (type === 'treeHut') {
        sellPrice = Math.floor(treeHutCost * treeHutSellPriceRatio);
        sellResource = "Wood";
        currentCount = treeHuts;
    } else if (type === 'bananaGrove') {
        sellPrice = Math.floor(bananaGroveCost * bananaGroveSellPriceRatio);
        sellResource = "Bananas";
        currentCount = bananaGroves;
    }

    if (currentCount > 0) {
         tooltip.innerText = `Sell for: ${sellPrice} ${sellResource}`;
    } else {
        tooltip.innerText = `None to sell!`;
    }

    tooltip.style.display = "block";

    const button = event.target;
    const rect = button.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + "px";
    tooltip.style.top = rect.top + "px";
}

function hideBuildingCost() {
    document.getElementById("buildingTooltip").style.display = "none";
}


function allocateMonkey(job, amount) {
    if (amount > 0) { // Allocating
        if (monkeys >= amount) {
            monkeys -= amount;
            allocatedMonkeys[job] += amount;
            log(`Allocated ${amount} monkey(s) to ${job}s.`);
            if (job === 'scholar' && document.getElementById("techTabButton").style.display === "none") {
                document.getElementById("techTabButton").style.display = "block";
                const techTabButton = document.getElementById("techTabButton");
                if (!techTabButton.classList.contains('active')) {
                    openTab({ currentTarget: techTabButton }, 'techTab');
                }
            }
        } else {
            log("Not enough unallocated monkeys!");
        }
    } else { // De-allocating
        if (allocatedMonkeys[job] >= Math.abs(amount)) {
            monkeys += Math.abs(amount);
            allocatedMonkeys[job] -= Math.abs(amount);
            log(`De-allocated ${Math.abs(amount)} monkey(s) from ${job}s.`);
        } else {
            log(`No ${job} monkeys to de-allocate!`);
        }
    }
    updateDisplay();
}

function clearAllocations() {
    for (const job in allocatedMonkeys) {
        if (allocatedMonkeys.hasOwnProperty(job)) {
            monkeys += allocatedMonkeys[job];
            allocatedMonkeys[job] = 0;
        }
    }
    log("All monkeys de-allocated!");
    updateDisplay();
}


// --- Income and Consumption Calculations ---
function getBananasPerSecond() {
  let income = allocatedMonkeys.forager * 1 + allocatedMonkeys.farmer * 2;
  income += bananaGroves * bananaGroveIncome;

  if (tech.foraging.level > 0) {
    income *= (1 + 0.05 * tech.foraging.level);
  }
  if (tech.math.level > 0) {
    income += allocatedMonkeys.farmer * (0.2 * tech.math.level);
  }
  return income;
}

function getWoodPerSecond() {
    return allocatedMonkeys.woodcutter * 1;
}

function getBananaConsumptionPerSecond() {
    let totalMonkeysInJobs = allocatedMonkeys.forager + allocatedMonkeys.farmer + allocatedMonkeys.woodcutter + allocatedMonkeys.scholar;
    return totalMonkeysInJobs * 5;
}


function updateDisplay() {
  const currentBananaIncome = getBananasPerSecond();
  const currentWoodIncome = getWoodPerSecond();
  const currentBananaConsumption = getBananaConsumptionPerSecond();
  const netBananaIncome = currentBananaIncome - currentBananaConsumption;

  // --- MODIFIED LINES FOR 2 DECIMAL PLACES ---
  document.getElementById("bananas").innerText = bananas.toFixed(2);
  document.getElementById("bananaCapacity").innerText = bananaCapacity.toFixed(2);
  document.getElementById("netBananas").innerText = (netBananaIncome >= 0 ? "+" : "") + netBananaIncome.toFixed(2);


  document.getElementById("wood").innerText = wood.toFixed(2);
  document.getElementById("woodCapacity").innerText = woodCapacity.toFixed(2);
  document.getElementById("netWood").innerText = (currentWoodIncome >= 0 ? "+" : "") + currentWoodIncome.toFixed(2);
  // --- END MODIFIED LINES ---

  const totalMonkeys = monkeys + allocatedMonkeys.forager + allocatedMonkeys.farmer + allocatedMonkeys.woodcutter + allocatedMonkeys.scholar;
  document.getElementById("totalMonkeys").innerText = totalMonkeys;

  // Update Building quantities in The Pit
  document.getElementById("bananaGroves").innerText = `(${bananaGroves})`;
  document.getElementById("treeHuts").innerText = `(${treeHuts})`;


  // Update allocation display in Troop tab
  document.getElementById("unallocatedMonkeys").innerText = monkeys;
  document.getElementById("totalAllocatedMonkeys").innerText = totalMonkeys;

  document.getElementById("allocatedForagers").innerText = `(${allocatedMonkeys.forager})`;
  document.getElementById("allocatedFarmers").innerText = `(${allocatedMonkeys.farmer})`;
  document.getElementById("allocatedWoodcutters").innerText = `(${allocatedMonkeys.woodcutter})`;
  document.getElementById("allocatedScholars").innerText = `(${allocatedMonkeys.scholar})`;


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

function resetProgress() {
  if (confirm("Are you sure you want to reset all progress? This cannot be undone!")) {
    localStorage.removeItem('monkeyAscensionSave');
    bananas = 0;
    wood = 0;
    monkeys = 0;
    allocatedMonkeys = {
        forager: 0,
        farmer: 0,
        woodcutter: 0,
        scholar: 0
    };
    bananaCapacity = 5000;
    woodCapacity = 5000;
    treeHuts = 0;
    treeHutCost = 100;
    treeHutMonkeysGranted = 2;
    treeHutSellPriceRatio = 0.5;
    bananaGroves = 0;
    bananaGroveCost = 100;
    bananaGroveIncome = 0.55;
    bananaGroveSellPriceRatio = 0.5;
    tech = {
      foraging: { level: 0, baseCost: 100, costMult: 1.5 },
      math: { level: 0, baseCost: 150, costMult: 1.6 }
    };

    document.getElementById("techTabButton").style.display = "none";

    const thePitTabButton = document.querySelector('.tab-button[onclick*="thePitTab"]');
    openTab({ currentTarget: thePitTabButton }, 'thePitTab');

    log("Game progress has been reset!");
    updateDisplay();
  }
}

function saveGame() {
  const state = {
    bananas,
    wood,
    monkeys,
    allocatedMonkeys,
    bananaCapacity,
    woodCapacity,
    treeHuts,
    treeHutCost,
    treeHutMonkeysGranted,
    treeHutSellPriceRatio,
    bananaGroves,
    bananaGroveCost,
    bananaGroveIncome,
    bananaGroveSellPriceRatio,
    tech,
    activeTab: document.querySelector('.tab-content.active')?.id || 'thePitTab'
  };
  localStorage.setItem('monkeyAscensionSave', JSON.stringify(state));
}

function loadGame() {
  const state = JSON.parse(localStorage.getItem('monkeyAscensionSave'));
  if (state) {
    bananas = state.bananas;
    wood = state.wood || 0;
    monkeys = state.monkeys;
    allocatedMonkeys = state.allocatedMonkeys || {forager: 0, farmer: 0, woodcutter: 0, scholar: 0};
    bananaCapacity = state.bananaCapacity || 5000;
    woodCapacity = state.woodCapacity || 5000;
    treeHuts = state.treeHuts || 0;
    treeHutCost = state.treeHutCost || 100;
    treeHutMonkeysGranted = state.treeHutMonkeysGranted || 2;
    treeHutSellPriceRatio = state.treeHutSellPriceRatio || 0.5;
    bananaGroves = state.bananaGroves || 0;
    bananaGroveCost = state.bananaGroveCost || 100;
    bananaGroveIncome = state.bananaGroveIncome || 0.55;
    bananaGroveSellPriceRatio = state.bananaGroveSellPriceRatio || 0.5;

    tech = state.tech;

    if (allocatedMonkeys.scholar > 0) {
      document.getElementById("techTabButton").style.display = "block";
    }

    const initialTab = state.activeTab || 'thePitTab';
    const initialTabButton = document.querySelector(`.tab-button[onclick*="'${initialTab}'"]`);

    if (initialTabButton) {
        openTab({ currentTarget: initialTabButton }, initialTab);
    } else {
        const defaultTabButton = document.querySelector('.tab-button[onclick*="thePitTab"]');
        if (defaultTabButton) {
            openTab({ currentTarget: defaultTabButton }, 'thePitTab');
        }
    }
  } else {
    const defaultTabButton = document.querySelector('.tab-button[onclick*="thePitTab"]');
    if (defaultTabButton) {
        openTab({ currentTarget: defaultTabButton }, 'thePitTab');
    }
  }
}

setInterval(() => {
    const consumption = getBananaConsumptionPerSecond();
    const income = getBananasPerSecond();
    const netBanana = income - consumption;
    const netWood = getWoodPerSecond();

    bananas += netBanana;
    if (bananas > bananaCapacity) bananas = bananaCapacity;
    if (bananas < 0) bananas = 0;

    wood += netWood;
    if (wood > woodCapacity) wood = woodCapacity;
    if (wood < 0) wood = 0;

    updateDisplay();
}, 1000);

setInterval(saveGame, 5000);

window.onload = function () {
  loadGame();
  updateDisplay();
};
