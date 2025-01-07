// Base URL for JSON Server
const baseURL = "http://localhost:3000/pups";

// DOM Elements
const dogBar = document.getElementById("dog-bar");
const dogInfo = document.getElementById("dog-info");
const filterButton = document.getElementById("good-dog-filter");

// State
let allDogs = [];
let filterOn = false;

// Fetch all dogs and render
const fetchDogs = () => {
  fetch(baseURL)
    .then((response) => response.json())
    .then((dogs) => {
      allDogs = dogs;
      renderDogBar(dogs);
    })
    .catch((error) => console.error("Error fetching dogs:", error));
};

// Render the dog bar
const renderDogBar = (dogs) => {
  dogBar.innerHTML = ""; // Clear existing spans
  dogs.forEach((dog) => {
    const dogSpan = document.createElement("span");
    dogSpan.textContent = dog.name;
    dogSpan.addEventListener("click", () => displayDogInfo(dog));
    dogBar.appendChild(dogSpan);
  });
};

// Display dog info in #dog-info
const displayDogInfo = (dog) => {
  dogInfo.innerHTML = `
    <img src="${dog.image}" alt="${dog.name}">
    <h2>${dog.name}</h2>
    <button>${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
  `;
  const toggleButton = dogInfo.querySelector("button");
  toggleButton.addEventListener("click", () => toggleDogGoodness(dog));
};

// Toggle good/bad dog and update server
const toggleDogGoodness = (dog) => {
  const updatedDog = { ...dog, isGoodDog: !dog.isGoodDog };

  fetch(`${baseURL}/${dog.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isGoodDog: updatedDog.isGoodDog }),
  })
    .then((response) => response.json())
    .then((updatedDog) => {
      // Update state and UI
      allDogs = allDogs.map((d) =>
        d.id === updatedDog.id ? updatedDog : d
      );
      if (filterOn) {
        renderDogBar(allDogs.filter((d) => d.isGoodDog));
      } else {
        renderDogBar(allDogs);
      }
      displayDogInfo(updatedDog);
    })
    .catch((error) => console.error("Error updating dog:", error));
};

// Handle filtering good dogs
filterButton.addEventListener("click", () => {
  filterOn = !filterOn;
  filterButton.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
  const filteredDogs = filterOn
    ? allDogs.filter((dog) => dog.isGoodDog)
    : allDogs;
  renderDogBar(filteredDogs);
});

// Initialize the app
fetchDogs();
