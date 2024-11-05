document.addEventListener('DOMContentLoaded', function () {
    const boxContainer = document.getElementById('box-container');
    const currentDate = document.getElementById('current-date');
    const factBox = document.getElementById('fact-box');
    const dialog = document.getElementById('dialog');
    const winnerName = document.getElementById('winner-name');
    const winnerImage = document.getElementById('winner-image');

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
            // Simulate fetching a winner
            const winner = { name: `Person ${boxNumber}`, image: 'path/to/winner/image.jpg' }; // Placeholder data
            showWinner(winner);
        }
    };

    // Function to show the winner
    function showWinner(winner) {
        winnerName.textContent = winner.name;
        winnerImage.src = winner.image; // Set the winner's image
        dialog.style.display = 'block'; // Show the dialog
    }

    // Function to close the dialog
    window.closeDialog = function() {
        dialog.style.display = 'none'; // Hide the dialog
    };

    // Event listeners for buttons in the dialog
    document.getElementById('choose-winner').addEventListener('click', function () {
        alert("Winner chosen!"); // Placeholder for your logic
        closeDialog();
    });

    document.getElementById('redraw').addEventListener('click', function () {
        alert("Redraw initiated!"); // Placeholder for your logic
        closeDialog();
    });
});