// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.querySelector('.calendar');

  // Seed for random number generation
  const seed = 12345; // Change this to any number you want to use as a seed
  let seedRandom = (function(seed) {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  })(seed);

  // Create an array of doors with their corresponding content
  let doorsWithContent = Array.from({ length: 24 }, (_, i) => ({
    door: i + 1,
    content: `Content for day ${i + 1}`
  }));

  // Shuffle the doorsWithContent array using the Fisher-Yates algorithm with seeded random
  for (let i = doorsWithContent.length - 1; i > 0; i--) {
    const j = Math.floor(seedRandom() * (i + 1));
    [doorsWithContent[i], doorsWithContent[j]] = [doorsWithContent[j], doorsWithContent[i]];
  }

  // Loop through the shuffled array to create the doors
  doorsWithContent.forEach(({ door, content }) => {
    const doorElement = document.createElement('div');
    doorElement.classList.add('door');

    const doorInner = document.createElement('div');
    doorInner.classList.add('door-inner');

    const doorFront = document.createElement('div');
    doorFront.classList.add('door-front');
    doorFront.textContent = door; // Display the fixed day number

    const doorBack = document.createElement('div');
    doorBack.classList.add('door-back');
    doorBack.textContent = content; // Display corresponding content from the shuffled array

    doorInner.appendChild(doorFront);
    doorInner.appendChild(doorBack);
    doorElement.appendChild(doorInner);
    calendar.appendChild(doorElement);

    doorElement.addEventListener('click', () => {
      if (!doorElement.classList.contains('open')) {
        doorElement.classList.toggle('open');
      } else {
        setTimeout(() => {
          doorElement.classList.add('hidden'); // Hide the door after opening
        }, 600); // Match the duration of the CSS transition
      }
    });
  });
});