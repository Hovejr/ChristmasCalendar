document.addEventListener('DOMContentLoaded', function () {

    // **Preload Images (Optional but Recommended)**
    const preloadImages = () => {
        for (let i = 1; i <= 11; i++) { // Loads bg1.png to bg11.png
            const img = new Image();
            img.src = `img/bg${i}.png`;
        }
        // Optionally preload default background
        const defaultImg = new Image();
        defaultImg.src = `img/default-bg.png`;
    };
    preloadImages();

    // Initialize Firebase
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

    // DOM Elements
    const boxContainer = document.getElementById('box-container');
    const dialog = document.getElementById('dialog');
    const winnerName = document.getElementById('winner-name');
    const winnerImage = document.getElementById('winner-image');
    const chooseWinnerButton = document.getElementById('choose-winner');
    const redrawButton = document.getElementById('redraw');

    // Variables
    let users = [];
    let potentialWinners = []; // Global variable for potential winners
    const openedBoxes = [];
    let nextBoxNumber = 1;

    // **Change: Set a Random Background Image on Each Refresh**
    const calendar = document.querySelector('.calendar');
    const randomNumber = Math.floor(Math.random() * 11) + 1; // Generates a number between 1 and 11
    const imagePath = `img/bg${randomNumber}.png`;
    console.log(`Random background number: ${randomNumber}`);
    console.log(`Image path: ${imagePath}`);

    // Set the random background image
    calendar.style.backgroundImage = `url('${imagePath}')`;
    calendar.style.backgroundSize = 'cover'; // Ensure the image covers the entire background
    calendar.style.backgroundPosition = 'center'; // Center the background image

    // Seeded Random Function (remains unchanged)
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

    // Create Boxes (remains unchanged)
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

    // Function to handle box clicks (remains unchanged)
    window.boxClicked = function (box, boxNumber) {
        // Note: Remove or modify any day-based restrictions if necessary
        if (boxNumber > 25) { // Adjusted if needed
            alert(`Det er ikke ${boxNumber}. desember enda...`);
            return;
        }

        if (boxNumber !== nextBoxNumber) {
            alert(`Neste luke er vell ${nextBoxNumber}? Velg den først!`);
            return;
        }

        if (!openedBoxes.includes(boxNumber)) {
            openedBoxes.push(boxNumber);
            box.classList.add('opened');

            const boxWrapper = box.parentElement;

            flipUsersImages(boxWrapper, potentialWinners);

            setTimeout(() => {
                if (potentialWinners.length === 0) {
                    alert("All users have already won! No more winners available.");
                    return;
                }

                const winnerIndex = Math.floor(Math.random() * potentialWinners.length);
                const winner = potentialWinners[winnerIndex];
                showWinner(winner, boxWrapper);
                nextBoxNumber++;
            }, 3000);
        }
    };

    // Function to rotate images in the box-wrapper (remains unchanged)
    function flipUsersImages(boxWrapper, potentialWinners) {
        let imageIndex = 0;
        const userImages = potentialWinners.map(user => user.image);

        const spinInterval = setInterval(() => {
            if (userImages.length === 0) return; // Prevent errors if no images
            boxWrapper.style.backgroundImage = `url(${userImages[imageIndex % userImages.length]})`;
            boxWrapper.style.backgroundSize = 'cover';
            boxWrapper.style.backgroundPosition = 'center';
            imageIndex++;
        }, 300);

        setTimeout(() => clearInterval(spinInterval), 3000);
    }

    // Function to show the winner with a spinning effect (remains unchanged)
    function showWinner(winner, boxWrapper) {
        winnerName.textContent = winner.name;
        winnerImage.src = winner.image;
        chooseWinnerButton.style.display = 'block';
        redrawButton.style.display = 'block';
        dialog.style.display = 'block';

        boxWrapper.style.backgroundImage = `url(${winner.image})`;
        boxWrapper.style.backgroundSize = 'cover';
        boxWrapper.style.backgroundPosition = 'center';

        // Remove the winner from the potentialWinners list
        potentialWinners = potentialWinners.filter(user => user.id !== winner.id);
    }

    // Function to close the dialog (remains unchanged)
    window.closeDialog = function() {
        dialog.style.display = 'none';
        chooseWinnerButton.style.display = 'none';
        redrawButton.style.display = 'none';
    };

    // Event Listener for Choose Winner Button (remains unchanged)
    chooseWinnerButton.addEventListener('click', async function () {
        const lastClickedBoxNumber = openedBoxes[openedBoxes.length - 1];
        const winnerNameValue = winnerName.textContent;
        const winningUser = users.find(user => user.name === winnerNameValue);

        if (winningUser) {
            try {
                await db.collection("users").doc(winningUser.id).update({
                    dayWon: lastClickedBoxNumber
                });
                console.log(`Successfully updated dayWon for user ${winningUser.name} to ${lastClickedBoxNumber}`);
            } catch (error) {
                console.error("Error updating dayWon in Firestore: ", error);
            }
        } else {
            console.error("Winning user not found.");
        }

        closeDialog();
    });

    // Event Listener for Redraw Button (remains unchanged)
    redrawButton.addEventListener('click', function () {
        const lastClickedBoxNumber = openedBoxes[openedBoxes.length - 1];

        const lastClickedBoxWrapper = [...document.querySelectorAll('.box-wrapper')].find(wrapper => {
            return wrapper.querySelector('.box').textContent == lastClickedBoxNumber;
        });

        if (lastClickedBoxWrapper) {
            lastClickedBoxWrapper.style.backgroundImage = '';
            flipUsersImages(lastClickedBoxWrapper, potentialWinners);

            setTimeout(() => {
                if (potentialWinners.length === 0) {
                    alert("All users have already won! No more winners available.");
                    return;
                }
                const newWinnerIndex = Math.floor(Math.random() * potentialWinners.length);
                const newWinner = potentialWinners[newWinnerIndex];
                showWinner(newWinner, lastClickedBoxWrapper);
            }, 3000);
        }

        closeDialog();
    });

    // Function to Fetch Users from Firestore (remains unchanged)
    async function fetchUsers() {
        try {
            const snapshot = await db.collection("users").get();
            users = [];

            snapshot.forEach((doc) => {
                const user = doc.data();
                users.push({
                    id: doc.id,
                    name: user.name,
                    image: user.image,
                    dayWon: user.dayWon
                });
            });

            potentialWinners = users.filter(user => !user.dayWon);
            console.log("Users fetched:", users);

            let highestDayWon = 0;

            users.forEach(user => {
                if (user.dayWon) {
                    const dayWon = user.dayWon;

                    const boxWrapper = [...document.querySelectorAll('.box-wrapper')].find(wrapper => {
                        return wrapper.querySelector('.box').textContent == dayWon;
                    });

                    if (boxWrapper) {
                        const box = boxWrapper.querySelector('.box');
                        box.classList.add('opened');
                        boxWrapper.style.backgroundImage = `url(${user.image})`;
                        boxWrapper.style.backgroundSize = 'cover';
                        boxWrapper.style.backgroundPosition = 'center';

                        openedBoxes.push(dayWon);

                        if (dayWon > highestDayWon) {
                            highestDayWon = dayWon;
                        }
                    }
                }
            });

            nextBoxNumber = highestDayWon + 1;
            console.log(`Next box number to be opened is ${nextBoxNumber}`);
            
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    }

    // Fetch users when the window loads
    window.onload = function() {
        fetchUsers();
    };

});