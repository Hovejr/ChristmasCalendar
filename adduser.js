// Import the necessary Firebase modules (if using module syntax)
// Otherwise, ensure these scripts are included in your HTML file

// Firebase App (the core Firebase SDK)
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

// Function to convert image file to base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Function to add a user to Firestore
async function addUser(name, image) {
    const dayWon = ""; // Default value, will be updated when the winner is chosen
    try {
        const docRef = await db.collection("users").add({
            name: name,
            image: image,
            dayWon: dayWon
        });
        console.log("User added with ID: ", docRef.id);
        displayMessage("User added successfully!");
    } catch (error) {
        console.error("Error adding user: ", error);
        displayMessage("Error adding user.");
    }
}

// Function to display users in the list
async function displayUsers() {
    const userList = document.getElementById('users');
    userList.innerHTML = ''; // Clear current list

    const snapshot = await db.collection("users").get();
    snapshot.forEach((doc) => {
        const user = doc.data();
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${user.name}</strong> - 
            <img src="${user.image}" alt="${user.name}" style="width: 50px; height: 50px; border-radius: 50%;"/> - 
            ${user.dayWon}
            <button onclick="editUser('${doc.id}', '${user.name}', '${user.image}')">Edit</button>
            <button onclick="deleteUser('${doc.id}')">Delete</button>
        `;
        userList.appendChild(listItem);
    });
}

// Function to handle form submission
document.getElementById('user-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const imageFile = document.getElementById('image').files[0];

    // Convert image to base64
    const imageBase64 = await getBase64(imageFile);

    // Add user to Firestore
    addUser(name, imageBase64);
    displayUsers(); // Refresh user list after adding
});

// Load users on page load
window.onload = function() {
    displayUsers(); // Display users when the page loads
};

// Display message function
function displayMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    setTimeout(() => {
        messageDiv.innerText = '';
    }, 3000);
}