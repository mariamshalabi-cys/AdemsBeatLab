document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTORS ---
    const padModeBtn = document.getElementById('pad-mode-btn');
    const sequencerModeBtn = document.getElementById('sequencer-mode-btn');
    const padModeContainer = document.getElementById('pad-mode-container');
    const sequencerContainer = document.getElementById('sequencer-mode-container');

    // ==================================================================
    // PAD MODE LOGIC & STATE
    // ==================================================================
    const padSoundKits = {
        'Drums': {
            pad1: 'sounds/kick.mp3',
            pad2: 'sounds/snare.mps.mp3',
        },
        'Bass': {},
        'Synth': {},
        'FX': {
            pad1: 'sounds/carti_SCHYEAH.mp3',
        }
    };
    const pads = document.querySelectorAll('.pad');
    const kitButtons = document.querySelectorAll('.kit-button');
    let currentKit = 'Drums';

    function playPadSound(soundPath) {
        if (!soundPath) return;
        new Audio(soundPath).play();
    }
    
    function loadKit(kitName) {
        currentKit = kitName;
        const kit = padSoundKits[kitName] || {};
        pads.forEach((pad) => {
            const padNumber = pad.dataset.pad;
            const sound = kit[`pad${padNumber}`];
            pad.dataset.sound = sound || '';
        });
        kitButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.kit === kitName);
        });
    }

    kitButtons.forEach(button => {
        button.addEventListener('click', () => loadKit(button.dataset.kit));
    });

    pads.forEach(pad => {
        pad.addEventListener('click', () => {
            if (pad.dataset.sound) {
                playPadSound(pad.dataset.sound);
                pad.classList.add('playing');
                setTimeout(() => pad.classList.remove('playing'), 150);
            }
        });
    });

    // ==================================================================
    // SEQUENCER MODE LOGIC & STATE
    // ==================================================================
    const NUM_STEPS = 16;
    const instruments = [
        { name: 'Kick', soundPath: 'sounds/kick.mp3' },
        { name: 'Snare', soundPath: 'sounds/snare.mps.mp3' },
        { name: 'Hi-Hat', soundPath: 'sounds/hihat_closed.mp3' },
        { name: 'Open-Hat', soundPath: 'sounds/hihat_open.mp3' }
    ];
    const sequencerGrid = document.querySelector('.sequencer');
    const playStopButton = document.querySelector('#play-stop-button');
    let sequenceData, isPlaying = false, currentStep = 0, tempo = 120, intervalId = null;
    let isGridCreated = false;

    function createGrid() {
        if (isGridCreated) return;
        sequenceData = instruments.map(() => Array(NUM_STEPS).fill(false));
        sequencerGrid.innerHTML = '';
        instruments.forEach((instrument, rowIndex) => {
            const row = document.createElement('div');
            row.classList.add('instrument-row');
            for (let stepIndex = 0; stepIndex < NUM_STEPS; stepIndex++) {
                const step = document.createElement('div');
                step.classList.add('step');
                step.dataset.row = rowIndex;
                step.dataset.step = stepIndex;
                row.appendChild(step);
            }
            sequencerGrid.appendChild(row);
        });
        isGridCreated = true;
    }

    function toggleStep(e) {
        if (!e.target.classList.contains('step')) return;
        const row = e.target.dataset.row;
        const step = e.target.dataset.step;
        sequenceData[row][step] = !sequenceData[row][step];
        e.target.classList.toggle('active', sequenceData[row][step]);
    }

    function playLoop() {
        const intervalTime = 60000 / tempo / 4;
        intervalId = setInterval(() => {
            instruments.forEach((instrument, rowIndex) => {
                if (sequenceData[rowIndex][currentStep]) {
                    new Audio(instrument.soundPath).play();
                }
            });
            const lastStep = (currentStep - 1 + NUM_STEPS) % NUM_STEPS;
            document.querySelectorAll(`[data-step="${lastStep}"]`).forEach(el => el.classList.remove('playing'));
            document.querySelectorAll(`[data-step="${currentStep}"]`).forEach(el => el.classList.add('playing'));
            currentStep = (currentStep + 1) % NUM_STEPS;
        }, intervalTime);
    }

    function togglePlayback() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            currentStep = 0;
            playLoop();
            playStopButton.textContent = 'Stop';
        } else {
            clearInterval(intervalId);
            playStopButton.textContent = 'Play';
            document.querySelectorAll('.step.playing').forEach(el => el.classList.remove('playing'));
        }
    }

    playStopButton.addEventListener('click', togglePlayback);
    sequencerGrid.addEventListener('click', toggleStep);

    // ==================================================================
    // MODE SWITCHING LOGIC
    // ==================================================================
    function setMode(mode) {
        if (mode === 'pad') {
            padModeContainer.classList.remove('hidden');
            sequencerContainer.classList.add('hidden');
            padModeBtn.classList.add('active');
            sequencerModeBtn.classList.remove('active');
        } else { // Sequencer mode
            createGrid(); 
            padModeContainer.classList.add('hidden');
            sequencerContainer.classList.remove('hidden');
            padModeBtn.classList.remove('active');
            sequencerModeBtn.classList.add('active');
        }
    }

    padModeBtn.addEventListener('click', () => setMode('pad'));
    sequencerModeBtn.addEventListener('click', () => setMode('sequencer'));

    // --- INITIALIZATION ---
    loadKit(currentKit);
    setMode('pad');
});
