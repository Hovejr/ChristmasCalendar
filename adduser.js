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
        resetForm(); // Reset the form after successful addition
    } catch (error) {
        console.error("Error adding user: ", error);
        displayMessage("Error adding user.");
    }
}

// Function to delete a user from Firestore
async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) {
        return; // Exit if the user cancels the confirmation
    }

    try {
        await db.collection("users").doc(userId).delete();
        console.log(`User with ID ${userId} deleted successfully.`);
        displayMessage("User deleted successfully!");
        // No need to call displayUsers() here if using real-time listener
    } catch (error) {
        console.error("Error deleting user: ", error);
        displayMessage("Error deleting user.");
    }
}

// Function to display users in the list with real-time updates
function displayUsers() {
    const userList = document.getElementById('users');
    userList.innerHTML = ''; // Clear current list

    // Set up a real-time listener
    db.collection("users").onSnapshot((snapshot) => {
        userList.innerHTML = ''; // Clear the list before re-rendering

        snapshot.forEach((doc) => {
            const user = doc.data();
            const listItem = document.createElement('li');
            listItem.style.display = 'flex'; // Use flexbox for alignment
            listItem.style.alignItems = 'center'; // Center items vertically
            listItem.style.justifyContent = 'space-between'; // Space between content and buttons

            // Determine whether to show the Delete button
            const deleteButtonHTML = (!user.dayWon) 
                ? `<button onclick="deleteUser('${doc.id}')">Delete</button>` 
                : ""; // No button if dayWon has a value

            listItem.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="${user.image}" alt="${user.name}" class="winner-image" />
                    <strong style="margin-left: 10px;">${user.name}</strong>
                </div>
                <div>
                    ${deleteButtonHTML}
                </div>
            `;
            userList.appendChild(listItem);
        });
    }, (error) => {
        console.error("Error fetching users: ", error);
        displayMessage("Error fetching users.");
    });
}

// Function to reset the form inputs and UI elements
function resetForm() {
    // Reset the name input field
    document.getElementById('name').value = '';

    // Reset the cropped image preview
    const croppedPreview = document.getElementById('cropped-preview');
    croppedPreview.src = '';
    croppedPreview.classList.add('hidden'); // Hide the cropped preview

    // Reset the original image input field
    const imageInput = document.getElementById('image');
    imageInput.value = '';

    // If a Cropper instance exists, destroy it to clean up
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    // Optionally, hide the crop overlay if it's visible
    const cropOverlay = document.getElementById('crop-overlay');
    cropOverlay.style.display = 'none';
}

// Function to handle form submission
document.getElementById('user-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value.trim();
    const imageFile = document.getElementById('cropped-preview').src;

    // Validate inputs
    if (!name) {
        displayMessage("Please enter a name.");
        return;
    }

    if (!imageFile) {
        displayMessage("Please upload and crop an image.");
        return;
    }

    // Add user to Firestore
    await addUser(name, imageFile);
    // No need to call displayUsers() here if using real-time listener
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

const imageInput = document.getElementById('image');
const cropOverlay = document.getElementById('crop-overlay');
const imagePreview = document.getElementById('image-preview');
const confirmCropButton = document.getElementById('confirm-crop-button');
const cancelCropButton = document.getElementById('cancel-crop-button');
const croppedPreview = document.getElementById('cropped-preview');
const croppedPreviewContainer = document.querySelector('#cropped-preview');

let cropper;

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            cropOverlay.style.display = 'flex';

            // Destroy any existing Cropper instance
            if (cropper) {
                cropper.destroy();
            }

            // Initialize Cropper.js
            cropper = new Cropper(imagePreview, {
                aspectRatio: 1,
                viewMode: 1,
            });
        };
        reader.readAsDataURL(file);
    }
});

confirmCropButton.addEventListener('click', () => {
    if (cropper) {
        // Resize the cropped canvas to a smaller dimension
        const targetWidth = 300; // Set the desired width (you can adjust this value)
        const targetHeight = 300; // Set the desired height (you can adjust this value)

        // Get a resized version of the cropped canvas
        const canvas = cropper.getCroppedCanvas({
            width: targetWidth,
            height: targetHeight,
        });

        // Reduce the image quality for further optimization (optional)
        croppedPreview.src = canvas.toDataURL('image/jpeg', 0.7); // Quality set to 0.7 (adjustable)
        croppedPreview.classList.remove('hidden');
        cropOverlay.style.display = 'none';

        // Destroy the cropper instance after cropping
        cropper.destroy();
        cropper = null;
    }
});

cancelCropButton.addEventListener('click', () => {
    cropOverlay.style.display = 'none';
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
});