document.addEventListener('DOMContentLoaded', function () {

    // Firebase App (the core Firebase SDK)
    const firebaseConfig = {
      apiKey: "AIzaSyD4Fa9e7yzZM1QxsBkXhW_Si-Btug7Jk0g",
      authDomain: "christmascalendar-947a4.firebaseapp.com",
      projectId: "christmascalendar-947a4",
      storageBucket: "christmascalendar-947a4.firebasestorage.app",
      messagingSenderId: "237737049916",
      appId: "1:237737049916:web:30f73710bdebf16279e839"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

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

     let users = [];

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
            flipUsersImages(boxWrapper); // Rotate images in the box-wrapper

            setTimeout(() => {
                const winnerIndex = Math.floor(Math.random() * users.length);
                const winner = users[winnerIndex];
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

    function flipUsersImages(boxWrapper) {
        let imageIndex = 0;
        const userImages = users.map(user => user.image); // Extract all user images

        const spinInterval = setInterval(() => {
            boxWrapper.style.backgroundImage = `url(${userImages[imageIndex % userImages.length]})` // Show the next image
            imageIndex++;
        }, 300); // Change image every 300 ms

        // After 3 seconds, stop the flip and display the final winner
        setTimeout(() => clearInterval(spinInterval), 3000); // Spin for 3 seconds
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

    // Function to fetch and display users
    async function fetchUsers() {
        try {
            const snapshot = await db.collection("users").get();
            users = []; // Clear previous data in case of re-fetching

            snapshot.forEach((doc) => {
                const user = doc.data();
                users.push({
                    id: doc.id,
                    name: user.name,
                    image: user.image,
                    dayWon: user.dayWon
                });
            });

            console.log("Users fetched:", users); // You can log the users to check them
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    }

    // Call the function to fetch users when the page loads
    window.onload = function() {
        fetchUsers();
    };
});