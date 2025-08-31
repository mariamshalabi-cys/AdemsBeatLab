document.addEventListener('DOMContentLoaded', () => {
    // --- DYNAMICALLY CREATE SEQUENCER STEPS (MOVED HERE) ---
    const stepsContainers = document.querySelectorAll('.steps-container');
    stepsContainers.forEach(container => {
        for (let i = 1; i <= 16; i++) {
            const step = document.createElement('div');
            step.classList.add('step');
            step.dataset.step = i;
            container.appendChild(step);
        }
    });

    // --- DATA ---
    const soundKits = {
        'Drums': {
            pad1: 'sounds/CKV1_Snare Art 1.wav', pad2: 'sounds/CKV1_Snare Art 2.wav',
            pad3: 'sounds/CKV1_Snare Art 3.wav', pad4: 'sounds/CKV1_Snare Art 4.wav',
            pad5: 'sounds/CKV1_Snare Art 5.wav', pad6: 'sounds/CKV1_Snare Art 6.wav',
            pad7: 'sounds/CKV1_Snare Art 7.wav', pad8: 'sounds/CKV1_Snare Art 8.wav',
            pad9: 'sounds/CKV1_Snare Flam Extra Soft 1.wav', pad10: 'sounds/CKV1_Snare Flam Loud 1.wav',
            pad11: 'sounds/CKV1_Snare Flam Medium 1.wav', pad12: 'sounds/CKV1_Snare Flam Soft 2.wav',
            pad13: 'sounds/CKV1_Snare Loud.wav', pad14: 'sounds/CKV1_Snare Medium.wav',
            pad15: 'sounds/CKV1_Snare Rimshot.wav', pad16: 'sounds/CKV1_Snare Soft.wav',
        },
        'Bass': {
            pad1: 'sounds/synth_chord.mp3', pad2: 'sounds/synth_arpeggio.mp3',
            pad3: 'sounds/bass_note_A.mp3', pad4: 'sounds/bass_note_G.mp3',
        },
        'Synth': {
            pad1: 'sounds/synth_chord.mp3', pad2: 'sounds/synth_arpeggio.mp3',
            pad3: 'sounds/synth_pad.mp3', pad4: 'sounds/synth_lead.mp3',
        },
        'FX': {
            pad1: 'sounds/carti_SCHYEAH.mp3', pad2: 'sounds/carti_hahahah.mp3',
            pad3: 'sounds/carti_what.mp3', pad4: 'sounds/barbie.mp3',
            pad5: 'sounds/engine_rev.mp3', pad6: 'sounds/tire_chirp.mp3',
            pad7: 'sounds/clown_horn.mp3',
        }
    };

    // --- DOM ELEMENTS ---
    const pads = document.querySelectorAll('.pad');
    const kitButtons = document.querySelectorAll('.kit-button');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const beatPad = document.querySelector('.beat-pad');
    const kitSelector = document.querySelector('.kit-selector');
    const sequencer = document.querySelector('.sequencer');
    const playStopBtn = document.getElementById('play-stop-button');
    const steps = document.querySelectorAll('.step'); // This will now work correctly
    const instrumentRows = document.querySelectorAll('.instrument-row');

    // --- STATE ---
    let currentKit = 'Drums';
    let isPlaying = false;
    let currentStep = 0;
    let tempo = 120;
    let intervalId = null; 

    // --- FUNCTIONS ---
    function playSound(soundPath) {
        if (!soundPath) {
            console.warn("Attempted to play an empty sound.");
            return;
        }
        const audio = new Audio(soundPath);
        audio.play();
    }

    function loadKit(kitName) {
        currentKit = kitName;
        const kit = soundKits[kitName] || {};
        pads.forEach((pad) => {
            const padNumber = pad.dataset.pad;
            const sound = kit[`pad${padNumber}`];
            pad.dataset.sound = sound || '';
        });
        kitButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.kit === kitName);
        });
    }

    function playSequence() {
        document.querySelectorAll('.step.playing').forEach(s => s.classList.remove('playing'));
        document.querySelectorAll(`.step[data-step="${currentStep + 1}"]`).forEach(s => s.classList.add('playing'));

        instrumentRows.forEach(row => {
            const stepInThisRow = row.querySelector(`.step[data-step="${currentStep + 1}"]`);
            
            if (stepInThisRow && stepInThisRow.classList.contains('active')) {
                const kitName = row.dataset.kit;
                const padNumber = row.dataset.pad;
                
                if (kitName && padNumber) {
                    const soundPath = soundKits[kitName][`pad${padNumber}`];
                    if (soundPath) {
                        playSound(soundPath);
                    }
                }
            }
        });
        
        currentStep = (currentStep + 1) % 16;
    }

    function togglePlayback() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playStopBtn.textContent = 'Stop';
            currentStep = 0;
            const stepInterval = (60 / tempo * 1000) / 4; 
            intervalId = setInterval(playSequence, stepInterval);
        } else {
            playStopBtn.textContent = 'Play';
            clearInterval(intervalId); 
            document.querySelectorAll('.step.playing').forEach(s => s.classList.remove('playing'));
        }
    }

    // --- EVENT LISTENERS ---
    kitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kit = button.dataset.kit;
            loadKit(kit);
        });
    });

    pads.forEach(pad => {
        pad.addEventListener('click', () => {
            if (pad.dataset.sound) {
                playSound(pad.dataset.sound);
                pad.classList.add('playing');
                setTimeout(() => pad.classList.remove('playing'), 150);
            }
        });
    });

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (mode === 'beat-pad') {
                if (isPlaying) togglePlayback(); 
                beatPad.classList.remove('hidden');
                kitSelector.classList.remove('hidden');
                sequencer.classList.add('hidden');
            } else {
                beatPad.classList.add('hidden');
                kitSelector.classList.add('hidden');
                sequencer.classList.remove('hidden');
                instrumentRows.forEach(row => row.classList.remove('hidden'));
            }
        });
    });

    playStopBtn.addEventListener('click', togglePlayback);

    steps.forEach(step => {
        step.addEventListener('click', () => {
            step.classList.toggle('active');
        });
    });

    // --- INITIALIZATION ---
    loadKit(currentKit);
    document.querySelector('.mode-btn[data-mode="beat-pad"]').click();
});
