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

    let users = [];
    const openedBoxes = [];
    let nextBoxNumber = 1;
    
    const today = new Date();
    const currentDay = today.getDate(); 
    

    const seed = 2024;
    const doors = [...Array(24).keys()].map(i => i + 1);
     
    const randomizedNumbers = shuffleArray(doors, seed);
     
    function seededRandom(seed) {
         let x = Math.sin(seed++) * 10000;
         return x - Math.floor(x);
    }
    function shuffleArray(array, seed) {
         for (let i = array.length - 1; i > 0; i--) {
             const j = Math.floor(seededRandom(seed) * (i + 1));
             [array[i], array[j]] = [array[j], array[i]];
             seed++;
         }
         return array;
    }

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
        // Check if the box number is greater than today's date
        if (boxNumber > currentDay) {
            alert(`Det er ikke  ${boxNumber}. desember enda...`);
            return;
        }
    
        // Check if the clicked box is the next in the sequence
        if (boxNumber !== nextBoxNumber) {
            alert(`Neste luke er vell ${nextBoxNumber}? Velg den først!`);
            return;
        }
    
        // Check if the box is already opened
        if (!openedBoxes.includes(boxNumber)) {
            openedBoxes.push(boxNumber);
            box.classList.add('opened');
    
            const boxWrapper = box.parentElement; // Get the parent element (box-wrapper)
            flipUsersImages(boxWrapper); // Rotate images in the box-wrapper
    
            setTimeout(() => {
                const winnerIndex = Math.floor(Math.random() * users.length);
                const winner = users[winnerIndex];
                showWinner(winner, boxWrapper);
    
                // Update the next box number after the winner is chosen
                nextBoxNumber++;
            }, 3000);
        }
    };

    // Function to rotate images in the box-wrapper
    function flipUsersImages(boxWrapper) {
        let imageIndex = 0;
        const userImages = users.map(user => user.image); // Extract all user images

        const spinInterval = setInterval(() => {
            boxWrapper.style.backgroundImage = `url(${userImages[imageIndex % userImages.length]})`; // Rotate through images
            boxWrapper.style.backgroundSize = 'cover';
            boxWrapper.style.backgroundPosition = 'center';
            imageIndex++;
        }, 300); // Change image every 300 ms

        // After 3 seconds, stop the flip
        setTimeout(() => clearInterval(spinInterval), 3000);
    }

    // Function to show the winner with a spinning effect
    function showWinner(winner, boxWrapper) {
        winnerName.textContent = winner.name; // Set the winner name
        winnerImage.src = winner.image; // Set the winner's image
        chooseWinnerButton.style.display = 'block'; // Show the choose winner button
        redrawButton.style.display = 'block'; // Show the redraw button
        dialog.style.display = 'block'; // Show the dialog

        // Set the background of the clicked box to the winner's image
        boxWrapper.style.backgroundImage = `url(${winner.image})`;
        boxWrapper.style.backgroundSize = 'cover';
        boxWrapper.style.backgroundPosition = 'center';
    }

    // Function to close the dialog
    window.closeDialog = function() {
        dialog.style.display = 'none'; // Hide the dialog
        chooseWinnerButton.style.display = 'none'; // Hide buttons again
        redrawButton.style.display = 'none';
    };

    // Event listeners for buttons in the dialog
    chooseWinnerButton.addEventListener('click', function () {
        closeDialog();
    });

    redrawButton.addEventListener('click', function () {
        // Get the last clicked box and its wrapper
        const lastClickedBox = openedBoxes[openedBoxes.length - 1];
        const lastClickedBoxWrapper = document.querySelector(`.box-wrapper:nth-child(${lastClickedBox})`);

        // Reset the background image for spinning effect
        lastClickedBoxWrapper.style.backgroundImage = ''; 

        // Start spinning images again
        flipUsersImages(lastClickedBoxWrapper);

        // After the spinning animation, select a new winner
        setTimeout(() => {
            const newWinnerIndex = Math.floor(Math.random() * users.length);
            const newWinner = users[newWinnerIndex];
            showWinner(newWinner, lastClickedBoxWrapper); // Display new winner
        }, 3000); // Match the spin duration

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