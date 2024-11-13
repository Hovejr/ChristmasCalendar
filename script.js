document.addEventListener('DOMContentLoaded', function () {
    const firebaseConfig = {
      apiKey: "AIzaSyD4Fa9e7yzZM1QxsBkXhW_Si-Btug7Jk0g",
      authDomain: "christmascalendar-947a4.firebaseapp.com",
      projectId: "christmascalendar-947a4",
      storageBucket: "christmascalendar-947a4.firebasestorage.app",
      messagingSenderId: "237737049916",
      appId: "1:237737049916:web:30f73710bdebf16279e839"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    let users = [];

    const boxContainer = document.getElementById('box-container');
    const dialog = document.getElementById('dialog');
    const winnerName = document.getElementById('winner-name');
    const winnerImage = document.getElementById('winner-image');
    const chooseWinnerButton = document.getElementById('choose-winner');
    const redrawButton = document.getElementById('redraw');

    const openedBoxes = [];
    const randomizedNumbers = [...Array(24).keys()].map(i => i + 1); // Random numbers from 1 to 24

    randomizedNumbers.sort(() => Math.random() - 0.5); // Shuffle numbers

    // Create boxes dynamically
    randomizedNumbers.forEach(boxNumber => {
        const box = document.createElement('div');
        box.className = 'box-wrapper';
        box.innerHTML = `
            <div class="box" onclick="boxClicked(${boxNumber})">${boxNumber}</div>
        `;
        boxContainer.appendChild(box);
    });

    // Function to handle box clicks
    window.boxClicked = function(boxNumber) {
        if (!openedBoxes.includes(boxNumber)) {
            openedBoxes.push(boxNumber);
            // Simulate flipping between users' images
            flipUsersImages();
        }
    };

    // Function to flip between users' images
    function flipUsersImages() {
        winnerName.textContent = "Spinning...";
        winnerImage.src = ''; // Clear the image initially

        let spinCount = 0;
        const images = users.map(user => user.image); // Extract all user images

        const spinInterval = setInterval(() => {
            winnerImage.src = images[spinCount % images.length]; // Show the next image
            spinCount++;
        }, 300); // Change image every 300 ms

        // After 3 seconds, stop the flip and display the final winner
        setTimeout(() => {
            clearInterval(spinInterval); // Stop the spinning

            // Choose a random winner from users
            const winnerIndex = Math.floor(Math.random() * users.length);
            const winner = users[winnerIndex];

            winnerName.textContent = winner.name; // Set the winner name
            winnerImage.src = winner.image; // Set the winner's image
            chooseWinnerButton.style.display = 'block'; // Show the buttons
            redrawButton.style.display = 'block';
            dialog.style.display = 'block'; // Show the dialog
        }, 3000); // Spin for 3 seconds
    }

    // Close the dialog
    window.closeDialog = function() {
        dialog.style.display = 'none';
        chooseWinnerButton.style.display = 'none';
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
    // Function to fetch users and store them in the local variable
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