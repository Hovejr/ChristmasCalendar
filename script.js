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

    // Create boxes dynamically with user images
    randomizedNumbers.forEach(boxNumber => {
        const box = document.createElement('div');
        const randomUser = users[Math.floor(Math.random() * users.length)]; // Pick a random user for the box

        box.className = 'box-wrapper';
        box.innerHTML = `
            <div class="box" onclick="boxClicked(${boxNumber})">${boxNumber}</div>
            <img src="${randomUser.image}" alt="User's Image" class="box-image" />
        `;
        boxContainer.appendChild(box);
    });

    // Function to handle box clicks
    window.boxClicked = function(boxNumber) {
        if (!openedBoxes.includes(boxNumber)) {
            openedBoxes.push(boxNumber);
            // Simulate fetching a winner and spin between three images
            const winner = { name: `Person ${boxNumber}`, image: 'img/3.jpg' }; // Placeholder data
            showWinner(winner);
        }
    };

    // Function to show the winner with a spinning effect
    function showWinner(winner) {
        winnerName.textContent = "Spinning...";
        winnerImage.src = ''; // Clear the image initially

        const images = [
            'img/1.jpg',
            'img/2.jpg',
            'img/3.jpg'
        ];
        let spinCount = 0;

        const spinInterval = setInterval(() => {
            winnerImage.src = images[spinCount % images.length];
            spinCount++;
        }, 300); // Change image every 300 ms

        setTimeout(() => {
            clearInterval(spinInterval); // Stop the spinning
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