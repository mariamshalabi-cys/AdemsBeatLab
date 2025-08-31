document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const soundKits = {
        'Drums': {
            pad1: 'sounds/kick.mp3', pad2: 'sounds/snare.mp3',
            pad3: 'sounds/hihat_closed.mp3', pad4: 'sounds/hihat_open.mp3',
            pad5: 'sounds/lighter.mp3', pad6: 'sounds/clap.mp3',
            pad7: 'sounds/cowbell.mp3', pad8: 'sounds/shaker.mp3',
            pad9: 'sounds/crash.mp3', pad10: 'sounds/ride.mp3',
            pad11: 'sounds/tom.mp3', pad12: 'sounds/rimshot.mp3',
            pad13: 'sounds/perc1.mp3', pad14: 'sounds/perc2.mp3',
            pad15: 'sounds/perc3.mp3', pad16: 'sounds/perc4.mp3',
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
    const steps = document.querySelectorAll('.step');
    const instrumentRows = document.querySelectorAll('.instrument-row');

    // --- STATE ---
    let currentKit = 'Drums';
    let isPlaying = false;
    let currentStep = 0;
    let tempo = 120;
    let intervalId = null; // To store the timer

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
        // Highlight the current step column
        document.querySelectorAll('.step.playing').forEach(s => s.classList.remove('playing'));
        document.querySelectorAll(`.step[data-step="${currentStep + 1}"]`).forEach(s => s.classList.add('playing'));

        // Loop through EVERY instrument row to check for active steps
        instrumentRows.forEach(row => {
            const stepInThisRow = row.querySelector(`.step[data-step="${currentStep + 1}"]`);
            
            // If the step is on, play its sound
            if (stepInThisRow && stepInThisRow.classList.contains('active')) {
                const kitName = row.dataset.kit;
                const padNumber = row.dataset.pad; // Assumes your HTML row has a data-pad attribute
                
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
            const stepInterval = (60 / tempo * 1000) / 4; // 16th notes
            intervalId = setInterval(playSequence, stepInterval);
        } else {
            playStopBtn.textContent = 'Play';
            clearInterval(intervalId); // Stop the loop
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
                if (isPlaying) togglePlayback(); // Stop playback if switching away
                beatPad.classList.remove('hidden');
                kitSelector.classList.remove('hidden');
                sequencer.classList.add('hidden');
            } else { // Switching to sequencer mode
                beatPad.classList.add('hidden');
                kitSelector.classList.add('hidden');
                sequencer.classList.remove('hidden');

                // Make sure all instrument rows are visible
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
    // Set initial view to beat-pad
    document.querySelector('.mode-btn[data-mode="beat
