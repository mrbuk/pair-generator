let numberOfRounds = 5;

document.getElementById("numberOfRounds").addEventListener("change", (e) => {
  numberOfRounds = e.target.value
});

document.getElementById("generatePairs").addEventListener("click", () => {
    const nameList = document.getElementById("nameList").value.trim();
    const outputDiv = document.getElementById("output");
  
    // Clear previous output
    outputDiv.innerHTML = "";
  
    if (!nameList) {
      outputDiv.textContent = "Please enter at least two names.";
      return;
    }
  
    const names = nameList.split("\n").map(name => name.trim()).filter(name => name !== "");
  
    if (names.length < 2) {
      outputDiv.textContent = "Please enter at least two valid names.";
      return;
    }

    if ((names.length / 2) < numberOfRounds) {
      outputDiv.textContent = `Not enough names to find pairings for ${numberOfRounds} rounds` 
      return;
    }

    if (names.length % 2 != 0) {
        names.push("%SKIPPY%")
    }
 
  // Generate round-robin pairings for x rounds
  const rounds = generateRoundRobinPairs(names, numberOfRounds);

  // Display the rounds
  rounds.forEach((round, roundIndex) => {
    const roundDiv = document.createElement("div");
    roundDiv.className = "round";
    roundDiv.innerHTML = `<h3>Round ${roundIndex + 1}</h3>`;
    round.forEach(pair => {
      const pairDiv = document.createElement("div");
      pairDiv.className = "pair";
      if (pair[0] == "%SKIPPY%") {
        pairDiv.innerHTML = `<i>${pair[1]} skips this round</i>`;
      } else if (pair[1] == "%SKIPPY%") {
        pairDiv.innerHTML = `<i>${pair[0]} skips this round</i>`;
      } else {
        pairDiv.textContent = `${pair[0]} & ${pair[1]}`;
      }
      roundDiv.appendChild(pairDiv);
    });
    outputDiv.appendChild(roundDiv);
  });
});

/**
 * Generates unique round-robin pairings for the given number of rounds
 * @param {Array} names - The list of names
 * @param {number} totalRounds - The number of rounds
 * @returns {Array} - The list of rounds with unique pairings
 */
function generateRoundRobinPairs(names, totalRounds) {
  const rounds = [];
  const numNames = names.length;

  // Create a list of indices for round-robin rotation
  const indices = Array.from({ length: numNames }, (_, i) => i);

  for (let round = 0; round < totalRounds; round++) {
    const roundPairs = [];
    for (let i = 0; i < numNames / 2; i++) {
      const firstIndex = indices[i];
      const secondIndex = indices[numNames - 1 - i];
      roundPairs.push([names[firstIndex], names[secondIndex]]);
    }

    rounds.push(roundPairs);

    // Rotate the indices (round-robin rotation)
    const last = indices.pop();
    indices.splice(1, 0, last);
  }

  return rounds;
}