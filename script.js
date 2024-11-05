// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.querySelector('.calendar');
    const dialog = document.getElementById('dialog');
    const chooseWinnerButton = document.getElementById('chooseWinner');
    const redrawButton = document.getElementById('redraw');
    let currentDoorElement; // To keep track of the currently opened door

    // Seed for random number generation
    const seed = 12345; // Change this to any number you want to use as a seed
    let seedRandom = (function(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    })(seed);

    // Create an array of doors with their corresponding content
    let doorsWithContent = Array.from({ length: 24 }, (_, i) => ({
        door: i + 1,
        content: `Content for day ${i + 1}`
    }));

    // Shuffle the doorsWithContent array using the Fisher-Yates algorithm with seeded random
    for (let i = doorsWithContent.length - 1; i > 0; i--) {
        const j = Math.floor(seedRandom() * (i + 1));
        [doorsWithContent[i], doorsWithContent[j]] = [doorsWithContent[j], doorsWithContent[i]];
    }

    // Loop through the shuffled array to create the doors
    doorsWithContent.forEach(({ door, content }) => {
        const doorElement = document.createElement('div');
        doorElement.classList.add('door');

        const doorInner = document.createElement('div');
        doorInner.classList.add('door-inner');

        const doorFront = document.createElement('div');
        doorFront.classList.add('door-front');
        doorFront.textContent = door; // Display the fixed day number

        const doorBack = document.createElement('div');
        doorBack.classList.add('door-back');
        doorBack.textContent = content; // Display corresponding content from the shuffled array

        doorInner.appendChild(doorFront);
        doorInner.appendChild(doorBack);
        doorElement.appendChild(doorInner);
        calendar.appendChild(doorElement);

        doorElement.addEventListener('click', () => {
            if (!doorElement.classList.contains('open')) {
                doorElement.classList.toggle('open');
                dialog.style.display = 'block'; // Show dialog when the door opens
                currentDoorElement = doorElement; // Keep track of the currently opened door
            }
        });
    });

    // Choose Winner functionality
    chooseWinnerButton.addEventListener('click', () => {
        if (currentDoorElement) {
            currentDoorElement.style.backgroundColor = '#FFD700'; // Change background to gold for the winning door
            currentDoorElement.classList.add('winner'); // Optionally add a class for styling
        }
        dialog.style.display = 'none'; // Hide the dialog
    });

    // Redraw functionality
    redrawButton.addEventListener('click', () => {
        dialog.style.display = 'none'; // Hide the dialog
        if (currentDoorElement) {
            currentDoorElement.classList.remove('open'); // Close the door visually
            currentDoorElement.style.backgroundColor = '#ff0000'; // Reset background color for the door
        }
    });
});