const car = {
    make: "Ford",
    model: "Mustang GT",
    year: 2015,
    color: "Triple Yellow",
    horsepower: "460 HP",
    nickname: "Peely"
};

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

const soundsToSequence = [
    { id: 'kickBtn', name: 'kick.mp3', label: 'Kick' },
    { id: 'snareBtn', name: 'snare.mp3', label: 'Snare' },
    { id: 'hihatClosedBtn', name: 'hihat_closed.mp3', label: 'Hi-Hat' },
    { id: 'synthChordBtn', name: 'synth_chord.mp3', label: 'Synth' },
    { id: 'cartiWhatBtn', name: 'carti_what.mp3', label: 'What' },
    { id: 'engineRevBtn', name: 'engine_rev.mp3', label: 'Engine' },
    { id: 'lighterBtn', name: 'lighter.mp3', label: 'Lighter' },
    { id: 'sillySoundBtn', name: 'clown_horn.mp3', label: 'Joke' }
];

const NUM_STEPS = 8;
const sequencerState = {};
let isPlaying = false;
let currentStep = 0;
let playbackInterval;

function loadSounds() {
    soundsToSequence.forEach(sound => {
        sounds[sound.id] = new Audio(`sounds/${sound.name}`);
        sounds[sound.id].load();
    });
}

function playSound(buttonId) {
    if (sounds[buttonId]) {
        sounds[buttonId].currentTime = 0;
        sounds[buttonId].play().catch(e => console.error("Error playing sound:", e));
    }
}

function createSequencer() {
    const sequencerDiv = document.getElementById('sequencer');

    soundsToSequence.forEach(sound => {
        const row = document.createElement('div');
        row.className = 'sequencer-row';

        const label = document.createElement('div');
        label.className = 'sequencer-label';
        label.textContent = sound.label;
        row.appendChild(label);

        sequencerState[sound.id] = [];
        for (let i = 0; i < NUM_STEPS; i++) {
            const cell = document.createElement('div');
            cell.className = 'sequencer-cell';
            cell.dataset.soundId = sound.id;
            cell.dataset.step = i;
            cell.addEventListener('click', () => {
                cell.classList.toggle('active');
                sequencerState[sound.id][i] = cell.classList.contains('active');
            });
            row.appendChild(cell);
            sequencerState[sound.id][i] = false;
        }

        sequencerDiv.appendChild(row);
    });
}

function playSequence() {
    if (isPlaying) {
        clearInterval(playbackInterval);
        isPlaying = false;
        updateMessage("Beat stopped.");
        return;
    }

    isPlaying = true;
    currentStep = 0;
    updateMessage("Playing beat...");

    playbackInterval = setInterval(() => {
        if (currentStep < NUM_STEPS) {
            soundsToSequence.forEach(sound => {
                if (sequencerState[sound.id][currentStep]) {
                    playSound(sound.id);
                }
            });

            document.querySelectorAll('.sequencer-cell').forEach(cell => {
                cell.classList.remove('playing');
            });
            document.querySelectorAll(`[data-step="${currentStep}"]`).forEach(cell => {
                cell.classList.add('playing');
            });

            currentStep++;
        } else {
            clearInterval(playbackInterval);
            isPlaying = false;
            updateMessage("Beat finished.");
            document.querySelectorAll('.sequencer-cell').forEach(cell => {
                cell.classList.remove('playing');
            });
        }
    }, 500);
}

function clearSequence() {
    document.querySelectorAll('.sequencer-cell').forEach(cell => {
        cell.classList.remove('active');
        cell.classList.remove('playing');
    });
    for (const soundId in sequencerState) {
        for (let i = 0; i < NUM_STEPS; i++) {
            sequencerState[soundId][i] = false;
        }
    }
    if (isPlaying) {
        clearInterval(playbackInterval);
        isPlaying = false;
    }
    updateMessage("Beat sequence cleared.");
}

function updateMessage(message) {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = message;
}

function setupAllListeners() {
    document.getElementById('playBtn').addEventListener('click', playSequence);
    document.getElementById('clearBtn').addEventListener('click', clearSequence);
}

document.addEventListener('DOMContentLoaded', () => {
    displayCarInfo();
    loadSounds();
    createSequencer();
    setupAllListeners();
});
