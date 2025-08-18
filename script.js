// Car Information
const car = {
    make: "Ford",
    model: "Mustang GT",
    year: 2015,
    color: "Triple Yellow",
    horsepower: "460 HP",
    nickname: "Peely"
};

// Function to display car info
function displayCarInfo() {
    const carInfoDiv = document.getElementById('car-info');
    carInfoDiv.innerHTML = `
        <p><strong>Make:</strong> ${car.make}</p>
        <p><strong>Model:</strong> ${car.model}</p>
        <p><strong>Year:</strong> ${car.year}</p>
        <p><strong>Color:</strong> ${car.color}</p>
        <p><strong>Power:</strong> ${car.horsepower}</p>
        <p><strong>My Favorite Ride:</strong> ${car.nickname}</p>
    `;
}

// Object to hold Audio instances for sounds
const sounds = {};

// Load all sounds
function loadSounds() {
    const soundButtons = document.querySelectorAll('.beat-button');
    soundButtons.forEach(button => {
        const soundFileName = button.dataset.sound;
        if (soundFileName) {
            sounds[button.id] = new Audio(`sounds/${soundFileName}`);
            sounds[button.id].load();
        }
    });
}

// Function to play a sound
function playSound(buttonId) {
    if (sounds[buttonId]) {
        sounds[buttonId].currentTime = 0;
        sounds[buttonId].play().catch(e => console.error("Error playing sound:", e));
    }
}

// Attach event listeners to beat pad buttons
function setupBeatPad() {
    const beatPadDiv = document.getElementById('beat-pad');
    beatPadDiv.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.beat-button');
        if (clickedButton) {
            playSound(clickedButton.id);
            handleSpecialInteractions(clickedButton.id);
        }
    });
}

// --- Special Interactions Logic ---
let buttonClickSequence = [];
const secretSequence = ['cartiWhatBtn', 'engineRevBtn', 'secretMsgBtn'];

function handleSpecialInteractions(buttonId) {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = '';

    buttonClickSequence.push(buttonId);
    if (buttonClickSequence.length > secretSequence.length) {
        buttonClickSequence.shift();
    }

    if (JSON.stringify(buttonClickSequence) === JSON.stringify(secretSequence)) {
        messageArea.textContent = "To my amazing man: You make my heart race faster than your Mustang. Happy Birthday, my love! ❤️";
        buttonClickSequence = [];
    }

    if (buttonId === 'lighterBtn') {
        setTimeout(() => {
            messageArea.textContent = "💨 Time for some high-octane inspiration, eh? 😉";
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayCarInfo();
    loadSounds();
    setupBeatPad();
});
