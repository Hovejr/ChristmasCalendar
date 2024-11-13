document.addEventListener('DOMContentLoaded', function () {
    const boxContainer = document.getElementById('box-container');
    const dialog = document.getElementById('dialog');
    const winnerName = document.getElementById('winner-name');
    const winnerImage = document.getElementById('winner-image');
    const chooseWinnerButton = document.getElementById('choose-winner');
    const redrawButton = document.getElementById('redraw');

    const images = [
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg'
    ];

    const teamId = 1; // Example team ID
    const openedBoxes = [];
    const randomizedNumbers = [...Array(24).keys()].map(i => i + 1); // Random numbers from 1 to 24

    randomizedNumbers.sort(() => Math.random() - 0.5); // Shuffle numbers

    

    // Create boxes
    randomizedNumbers.forEach(boxNumber => {
        const boxWrapper = document.createElement('div');
        boxWrapper.className = 'box-wrapper';

        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = boxNumber;
        boxWrapper.appendChild(box);

        // Click event for the box
        box.addEventListener('click', () => boxClicked(box, boxNumber));

        boxContainer.appendChild(boxWrapper);
    });


    // Function to handle box clicks
    window.boxClicked = function (box, boxNumber) {
        if (!openedBoxes.includes(boxNumber)) {
            openedBoxes.push(boxNumber);
            box.classList.add('opened');
            const boxWrapper = box.parentElement; // Get the parent element (box-wrapper)
            rotateImages(boxWrapper); // Rotate images in the box-wrapper

            setTimeout(() => {
                const winner = { name: `Person ${boxNumber}`, image: 'img/3.jpg' }; // Mock winner data
                showWinner(winner);
            }, 3000);
        }
    };

// Function to rotate images in the box-wrapper
function rotateImages(boxWrapper) {
    let imageIndex = 0;
    const rotationInterval = setInterval(() => {
        boxWrapper.style.backgroundImage = `url(${images[imageIndex % images.length]})`;
        imageIndex++;
    }, 300);

    // Stop image rotation after 3 seconds
    setTimeout(() => clearInterval(rotationInterval), 3000);
}


    // Function to show the winner with a spinning effect
    function showWinner(winner) {
        winnerName.textContent = winner.name; // Set the winner name
            winnerImage.src = winner.image; // Set the winner's image
            chooseWinnerButton.style.display = 'block'; // Show the choose winner button
            redrawButton.style.display = 'block'; // Show the redraw button
            dialog.style.display = 'block'; // Show the dialog
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