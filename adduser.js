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
          listItem.style.display = 'flex'; // Use flexbox for alignment
          listItem.style.alignItems = 'center'; // Center items vertically
          listItem.style.justifyContent = 'space-between'; // Space between content and buttons
  
          listItem.innerHTML = `
              <div style="display: flex; align-items: center;">
                  <img src="${user.image}" alt="${user.name}" class="winner-image" />
                  <strong style="margin-left: 10px;">${user.name}</strong> <!-- Added margin for spacing -->
              </div>
              <div>
                  <button onclick="editUser('${doc.id}', '${user.name}', '${user.image}')">Edit</button>
                  <button onclick="deleteUser('${doc.id}')">Delete</button>
              </div>
          `;
          userList.appendChild(listItem);
      });
  }
  
  // Function to handle form submission
  document.getElementById('user-form').addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent form submission
  
      const name = document.getElementById('name').value;
      const imageFile = document.getElementById('cropped-preview').src;
  
      // Convert image to base64
  
      // Add user to Firestore
      addUser(name, imageFile);
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
    }
});

  
  cancelCropButton.addEventListener('click', () => {
      cropOverlay.style.display = 'none';
      if (cropper) {
          cropper.destroy();
      }
  });
  
