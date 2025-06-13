let bananas = 0;
let wood = 0;
let creativity = 0;
let ore = 0;

let monkeys = 0; // Represents total unallocated monkeys (whole number)

// Allocated monkeys by job (whole numbers)
let allocatedMonkeys = {
    forager: 0,
    woodcutter: 0,
    scholar: 0,
    miner: 0
};

// Capacities for resources (these will also be treated as floats now)
let bananaCapacity = 5000;
let woodCapacity = 5000;
let creativityCapacity = 1000;
let oreCapacity = 1000;

// Building variables
let treeHuts = 0;
let treeHutCost = 2; // Initial cost of the FIRST tree hut
let treeHutMonkeysGranted = 2; // Whole number
let treeHutSellPriceRatio = 0.5;

let bananaGroves = 0;
let bananaGroveCost = 10; // This is a float
let bananaGroveIncome = 0.55;
let bananaGroveSellPriceRatio = 0.5;


let tech = {
  foraging: { level: 0, baseCost: 100, costMult: 1.5 },
  math: { level: 0, baseCost: 150, costMult: 1.6 }
};

// Job descriptions for tooltips
const jobTooltips = {
    forager: "+5 Bananas /sec",
    woodcutter: "+0.08 Wood /sec",
    scholar: "+0.15 Creativity /sec",
    miner: "+0.20 Ore /sec"
};


// --- Tab Navigation Functions ---
function openTab(evt, tabName) {
    let i, tabcontent, tabbuttons;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function gatherBananas() {
  bananas++; // Increment as float
  log("You picked a banana! 🍌");
  updateDisplay();
}

function gatherWood() {
    if (bananas >= 100) { // Compare against float
        bananas -= 100; // Subtract float
        wood++; // Increment as float
        log("You chopped some wood for 100.00 bananas! 🪵"); // Display with decimals in log
        updateDisplay();
    } else {
        log("Not enough bananas to gather wood (Costs 100.00 bananas)!");
    }
}

function buyBuilding(type) {
    if (type === 'treeHut') {
        const costToPay = treeHutCost; // This is the cost for the hut being purchased NOW

        if (wood >= costToPay) { // Compare against float
            wood -= costToPay; // Subtract float
            treeHuts++;
            monkeys += treeHutMonkeysGranted;

            // Calculate the cost for the *next* Tree Hut purchase
            if (treeHuts === 1) { // Just bought the first one (which cost 2), so next one (the 2nd) costs 2 * 500% (x6)
                treeHutCost = 2 * 6; // Cost for the second hut
            } else { // Just bought the second or more, so the next one (3rd onwards) costs current * 150% (x1.5)
                treeHutCost = treeHutCost * 1.5; // Cost for the third or subsequent hut
            }
            log(`Built a Tree Hut! (+${treeHutMonkeysGranted} Monkeys) 🏡🐒`);
            updateDisplay();
        } else {
            log("Not enough wood for a Tree Hut!");
        }
    } else if (type === 'bananaGrove') {
        // Ensure comparison is against the float value
        if (bananas >= bananaGroveCost) {
            bananas -= bananaGroveCost; // Subtract float
            bananaGroves++;
            bananaGroveCost = bananaGroveCost * 1.11; // No rounding
            log(`Planted a Banana Grove! (+${bananaGroveIncome.toFixed(2)} Bananas/sec) 🌿`);
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

            const refund = treeHutCost * treeHutSellPriceRatio; // Refund is based on current next-purchase cost

            // Revert treeHutCost for the *next* purchase based on *new* treeHuts count
            if (treeHuts === 0) { // Just sold the last one, next will be the first
                treeHutCost = 2;
            } else if (treeHuts === 1) { // Just sold down to 1, next will be the second
                treeHutCost = 2 * 6; // Next will cost 12
            } else { // Still 2 or more, next will be previous cost / 1.5
                treeHutCost = treeHutCost / 1.5;
            }

            wood += refund; // Add float
            log(`Sold a Tree Hut! (Refunded ${refund.toFixed(2)} Wood) 🏡`); // Display with decimals
            updateDisplay();
        } else {
            log("No Tree Huts to sell!");
        }
    } else if (type === 'bananaGrove') {
        if (bananaGroves > 0) {
            bananaGroves--;
            // Refund based on the actual float cost
            const refund = bananaGroveCost * bananaGroveSellPriceRatio;
            bananas += refund; // Add float
            bananaGroveCost = bananaGroveCost / 1.11; // No rounding
            log(`Sold a Banana Grove! (Refunded ${refund.toFixed(2)} Bananas) 🌿`); // Display with decimals
            updateDisplay();
        } else {
            log("No Banana Groves to sell!");
        }
    }
}


// Unified hover functions for all building BUY prices/effects
function showBuildingCost(type) {
    const tooltip = document.getElementById("gameTooltip");
    let costText = "";
    let effectText = "";
    let costResource = "";
    let calculatedCostForTooltip = 0;

    if (type === 'treeHut') {
        calculatedCostForTooltip = treeHutCost; // Use float value
        costResource = "Wood";
        // Updated effect text for all monkeys consuming 4.5 bananas/sec
        effectText = `+${treeHutMonkeysGranted} Monkeys\nAll monkeys consume 4.50 Bananas/sec each.`;
    } else if (type === 'bananaGrove') {
        if (bananaGroves === 0) {
            calculatedCostForTooltip = 10;
        } else {
            calculatedCostForTooltip = bananaGroveCost * 1.11; // No rounding
        }
        costResource = "Bananas";
        effectText = `+${bananaGroveIncome.toFixed(2)} Bananas/sec`;
    }

    // Always use toFixed(2) for display of all costs/refunds in tooltips
    tooltip.innerText = `Cost: ${calculatedCostForTooltip.toFixed(2)} ${costResource}\nEffect: ${effectText}`;
    tooltip.style.display = "block";

    const button = event.target;
    const rect = button.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + "px";
    tooltip.style.top = rect.top + "px";
}

// Unified hover function for building SELL price
function showBuildingSellPrice(type) {
    const tooltip = document.getElementById("gameTooltip");
    let sellPrice = 0;
    let sellResource = "";
    let currentCount = 0;

    if (type === 'treeHut') {
        // Use float value for refund calculation
        sellPrice = treeHutCost * treeHutSellPriceRatio;
        sellResource = "Wood";
        currentCount = treeHuts;
    } else if (type === 'bananaGrove') {
        // Use float value for refund calculation
        sellPrice = bananaGroveCost * bananaGroveSellPriceRatio;
        sellResource = "Bananas";
        currentCount = bananaGroves;
    }

    if (currentCount > 0) {
           tooltip.innerText = `Sell for: ${sellPrice.toFixed(2)} ${sellResource}`;
    } else {
        tooltip.innerText = `None to sell!`;
    }

    tooltip.style.display = "block";

    const button = event.target;
    const rect = button.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + "px";
    tooltip.style.top = rect.top + "px";
}

// New function for gather button tooltips
function showGatherTooltip(type) {
    const tooltip = document.getElementById("gameTooltip");
    let tooltipText = "";

    if (type === 'banana') {
        tooltipText = "+1.00 Banana";
    } else if (type === 'wood') {
        tooltipText = "+1.00 Wood\nCost: 100.00 Bananas";
    }

    tooltip.innerText = tooltipText;
    tooltip.style.display = "block";

    const button = event.target;
    const rect = button.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + "px";
    tooltip.style.top = rect.top + "px";
}

// Show tooltip for jobs
function showJobTooltip(jobType) {
    const tooltip = document.getElementById("gameTooltip");
    tooltip.innerText = jobTooltips[jobType];
    tooltip.style.display = "block";

    const button = event.target;
    const rect = button.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + "px";
    tooltip.style.top = rect.top + "px";
}

// Renamed for generality
function hideTooltip() {
    document.getElementById("gameTooltip").style.display = "none";
}


function allocateMonkey(job, amount) {
    if (amount > 0) { // Allocating
        if (monkeys >= amount) {
            monkeys -= amount; // Monkey counts are whole numbers
            allocatedMonkeys[job] += amount; // Monkey counts are whole numbers
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
            monkeys += Math.abs(amount); // Monkey counts are whole numbers
            allocatedMonkeys[job] -= Math.abs(amount); // Monkey counts are whole numbers
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
            monkeys += allocatedMonkeys[job]; // Monkey counts are whole numbers
            allocatedMonkeys[job] = 0; // Monkey counts are whole numbers
        }
    }
    log("All monkeys de-allocated!");
    updateDisplay();
}

// Helper function to get total monkeys (allocated + unallocated)
function getTotalMonkeys() {
    return monkeys + allocatedMonkeys.forager + allocatedMonkeys.woodcutter + allocatedMonkeys.scholar + allocatedMonkeys.miner;
}

// --- Income and Consumption Calculations ---
function getBananasPerSecond() {
  let income = allocatedMonkeys.forager * 5;
  income += bananaGroves * bananaGroveIncome;

  if (tech.foraging.level > 0) {
    income *= (1 + 0.05 * tech.foraging.level);
  }
  return income;
}

function getWoodPerSecond() {
    return allocatedMonkeys.woodcutter * 0.08;
}

function getCreativityPerSecond() {
    return allocatedMonkeys.scholar * 0.15;
}

function getOrePerSecond() {
    return allocatedMonkeys.miner * 0.20;
}

// Updated: Banana consumption based on ALL monkeys
function getBananaConsumptionPerSecond() {
    let totalAllMonkeys = getTotalMonkeys();
    return totalAllMonkeys * 4.5; // Each monkey eats 4.5 bananas/sec
}


function updateDisplay() {
  const currentBananaIncome = getBananasPerSecond();
  const currentWoodIncome = getWoodPerSecond();
  const currentCreativityIncome = getCreativityPerSecond();
  const currentOreIncome = getOrePerSecond();
  const currentBananaConsumption = getBananaConsumptionPerSecond();
  const netBananaIncome = currentBananaIncome - currentBananaConsumption;

  // Resource values, capacities, and net incomes always displayed with 2 decimals
  document.getElementById("bananas").innerText = bananas.toFixed(2);
  document.getElementById("bananaCapacity").innerText = bananaCapacity.toFixed(2);
  document.getElementById("netBananas").innerText = (netBananaIncome >= 0 ? "+" : "") + netBananaIncome.toFixed(2) + "/sec";


  document.getElementById("wood").innerText = wood.toFixed(2);
  document.getElementById("woodCapacity").innerText = woodCapacity.toFixed(2);
  document.getElementById("netWood").innerText = (currentWoodIncome >= 0 ? "+" : "") + currentWoodIncome.toFixed(2) + "/sec";

  document.getElementById("creativity").innerText = creativity.toFixed(2);
  document.getElementById("creativityCapacity").innerText = creativityCapacity.toFixed(2);
  document.getElementById("netCreativity").innerText = (currentCreativityIncome >= 0 ? "+" : "") + currentCreativityIncome.toFixed(2) + "/sec";

  document.getElementById("ore").innerText = ore.toFixed(2);
  document.getElementById("oreCapacity").innerText = oreCapacity.toFixed(2);
  document.getElementById("netOre").innerText = (currentOreIncome >= 0 ? "+" : "") + currentOreIncome.toFixed(2) + "/sec";


  const totalMonkeys = getTotalMonkeys(); // Get total monkeys using helper
  // Monkey counts are whole numbers
  document.getElementById("totalMonkeys").innerText = totalMonkeys;

  // Building quantities in The Pit are whole numbers
  document.getElementById("bananaGroves").innerText = `(${bananaGroves})`;
  document.getElementById("treeHuts").innerText = `(${treeHuts})`;


  // Update allocation display in Troop tab (monkey counts are whole numbers)
  document.getElementById("unallocatedMonkeys").innerText = monkeys;
  document.getElementById("totalAllocatedMonkeys").innerText = totalMonkeys;

  document.getElementById("allocatedForagers").innerText = `(${allocatedMonkeys.forager})`;
  document.getElementById("allocatedWoodcutters").innerText = `(${allocatedMonkeys.woodcutter})`;
  document.getElementById("allocatedScholars").innerText = `(${allocatedMonkeys.scholar})`;
  document.getElementById("allocatedMiners").innerText = `(${allocatedMonkeys.miner})`;


  const forage = tech.foraging;
  const math = tech.math;
  // Tech costs displayed with 2 decimals
  const forageCost = (forage.baseCost * Math.pow(forage.costMult, forage.level)).toFixed(2);
  const mathCost = (math.baseCost * Math.pow(math.costMult, math.level)).toFixed(2);
  document.getElementById("foragingBtn").innerText =
    `Efficient Foraging (+5% income) – Level ${forage.level} – Cost: ${forageCost} bananas`;
  document.getElementById("mathBtn").innerText = `Banana Math (Effect Changed - See Below) – Level ${math.level} – Cost: ${mathCost} bananas`; // Will update math tech effect later if needed
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
    creativity = 0;
    ore = 0;

    monkeys = 0;
    allocatedMonkeys = {
        forager: 0,
        woodcutter: 0,
        scholar: 0,
        miner: 0
    };
    bananaCapacity = 5000;
    woodCapacity = 5000;
    creativityCapacity = 1000;
    oreCapacity = 1000;

    treeHuts = 0;
    treeHutCost = 2; // Reset to initial cost
    treeHutMonkeysGranted = 2;
    treeHutSellPriceRatio = 0.5;
    bananaGroves = 0;
    bananaGroveCost = 10; // Reset to initial cost (float)
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
    creativity,
    ore,
    monkeys,
    allocatedMonkeys,
    bananaCapacity,
    woodCapacity,
    creativityCapacity,
    oreCapacity,
    treeHuts,
    treeHutCost, // Save as float
    treeHutMonkeysGranted,
    treeHutSellPriceRatio,
    bananaGroves,
    bananaGroveCost, // Save as float
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
    creativity = state.creativity || 0;
    ore = state.ore || 0;

    monkeys = state.monkeys;
    // Ensure all allocatedMonkeys properties exist even if not in save (for new properties)
    allocatedMonkeys = {
        forager: state.allocatedMonkeys.forager || 0,
        woodcutter: state.allocatedMonkeys.woodcutter || 0,
        scholar: state.allocatedMonkeys.scholar || 0,
        miner: state.allocatedMonkeys.miner || 0
    };
    bananaCapacity = state.bananaCapacity || 5000;
    woodCapacity = state.woodCapacity || 5000;
    creativityCapacity = state.creativityCapacity || 1000;
    oreCapacity = state.oreCapacity || 1000;

    treeHuts = state.treeHuts || 0;
    // Load treeHutCost as is; default to 2 if undefined
    treeHutCost = state.treeHutCost !== undefined ? state.treeHutCost : 2;
    treeHutMonkeysGranted = state.treeHutMonkeysGranted || 2;
    bananaGroves = state.bananaGroves || 0;
    // Load bananaGroveCost as is; default to 10 if undefined
    bananaGroveCost = state.bananaGroveCost !== undefined ? state.bananaGroveCost : 10;
    bananaGroveIncome = state.bananaGroveIncome || 0.55;

    // Check if these properties exist in the loaded state, if not, set defaults
    treeHutSellPriceRatio = state.treeHutSellPriceRatio !== undefined ? state.treeHutSellPriceRatio : 0.5;
    bananaGroveSellPriceRatio = state.bananaGroveSellPriceRatio !== undefined ? state.bananaGroveSellPriceRatio : 0.5;


    tech = state.tech; // Assuming tech structure doesn't change drastically between loads

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
    const netCreativity = getCreativityPerSecond();
    const netOre = getOrePerSecond();

    bananas += netBanana;
    // No Math.floor() here for resources, let them be floats
    if (bananas > bananaCapacity) bananas = bananaCapacity;
    if (bananas < 0) bananas = 0; // Don't let resources go negative

    wood += netWood;
    if (wood > woodCapacity) wood = woodCapacity;
    if (wood < 0) wood = 0;

    creativity += netCreativity;
    if (creativity > creativityCapacity) creativity = creativityCapacity;
    if (creativity < 0) creativity = 0;

    ore += netOre;
    if (ore > oreCapacity) ore = oreCapacity;
    if (ore < 0) ore = 0;

    updateDisplay();
}, 1000);

setInterval(saveGame, 5000);

window.onload = function () {
  loadGame();
  updateDisplay();
};
