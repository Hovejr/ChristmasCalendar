document.addEventListener('DOMContentLoaded', function () {
    const boxContainer = document.getElementById('box-container');
    const currentDate = document.getElementById('current-date');
    const factBox = document.getElementById('fact-box');
    const dialog = document.getElementById('dialog');
    const winnerName = document.getElementById('winner-name');
    const winnerImage = document.getElementById('winner-image');
    const chooseWinnerButton = document.getElementById('choose-winner');
    const redrawButton = document.getElementById('redraw');

    const teamId = 1; // Example team ID
    const openedBoxes = [];
    const randomizedNumbers = [...Array(24).keys()].map(i => i + 1); // Random numbers from 1 to 24

    randomizedNumbers.sort(() => Math.random() - 0.5); // Shuffle numbers

    // Initialize current date
    currentDate.textContent = `I dag er det: ${new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })}`;

    // Create boxes
    randomizedNumbers.forEach(boxNumber => {
        const box = document.createElement('div');
        box.className = 'box-wrapper';
        box.innerHTML = `
            <div class="box" onclick="boxClicked(${boxNumber})">${boxNumber}</div>
        `;
        boxContainer.appendChild(box);
    });

    // Fetch and display facts (simulated)
    fetchFact();

    // Function to fetch facts (this is just a simulated function)
    function fetchFact() {
        setTimeout(() => {
            factBox.textContent = "This is an interesting fact!";
        }, 2000);
    }

    // Function to handle box clicks
    window.boxClicked = function(boxNumber) {
        if (!openedBoxes.includes(boxNumber)) {
            openedBoxes.push(boxNumber);
            // Simulate fetching a winner and spin between three images
            const winner = { name: `Person ${boxNumber}`, image: '3.jpg' }; // Placeholder data
            showWinner(winner);
        }
    };

    // Function to show the winner with a spinning effect
    function showWinner(winner) {
        winnerName.textContent = "Spinning...";
        winnerImage.src = ''; // Clear the image initially

        // Simulate the spinning effect with 3 images
        const images = [
            '1.jpg',
            '2.jpg',
            '3.jpg'
        ];
        let spinCount = 0;

        const spinInterval = setInterval(() => {
            winnerImage.src = images[spinCount % images.length];
            spinCount++;
        }, 300); // Change image every 300 ms

        // After 3 seconds, show the winner
        setTimeout(() => {
            clearInterval(spinInterval); // Stop the spinning
            winnerName.textContent = winner.name; // Set the winner name
            winnerImage.src = winner.image; // Set the winner's image
            chooseWinnerButton.style.display = 'block'; // Show the choose winner button
            redrawButton.style.display = 'block'; // Show the redraw button
            dialog.style.display = 'block'; // Show the dialog
        }, 3000); // Spin for 3 seconds
    }

    // Function to close the dialog
    window.closeDialog = function() {
        dialog.style.display = 'none'; // Hide the dialog
        chooseWinnerButton.style.display = 'none'; // Hide buttons again
        redrawButton.style.display = 'none';
    };

    // Event listeners for buttons in the dialog
    chooseWinnerButton.addEventListener('click', function () {
        alert("Winner chosen!"); // Placeholder for your logic
        closeDialog();
    });

    redrawButton.addEventListener('click', function () {
        alert("Redraw initiated!"); // Placeholder for your logic
        closeDialog();
    });
});