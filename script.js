document.addEventListener('DOMContentLoaded', () => {
    const soundKits = {
        'Drums': {
            pad1: 'sounds/kick.mp3',
            pad2: 'sounds/snare.mp3', // checked manually
            pad3: 'sounds/hihat_closed.mp3',
            pad4: 'sounds/hihat_closed.mp3.mp3', //checked manually
            pad5: 'sounds/lighter.mp3',
            pad6: 'sounds/clap.mp3', // assuming this is a clap sound
            pad7: 'sounds/cowbell.mp3', // assuming this is a cowbell sound
            pad8: 'sounds/shaker.mp3', // assuming this is a shaker sound
            pad9: 'sounds/crash.mp3', // assuming this is a crash sound
            pad10: 'sounds/ride.mp3', // assuming this is a ride sound
            pad11: 'sounds/tom.mp3', // assuming this is a tom sound
            pad12: 'sounds/rimshot.mp3', // assuming this is a rimshot sound
            pad13: 'sounds/perc1.mp3', // a placeholder for a percussion sound
            pad14: 'sounds/perc2.mp3', // a placeholder for a percussion sound
            pad15: 'sounds/perc3.mp3', // a placeholder for a percussion sound
            pad16: 'sounds/perc4.mp3', // a placeholder for a percussion sound
        },
        'Bass': {
            pad1: 'sounds/synth_chord.mp3', // Corrected from synth_chord.mp3-2.mp3
            pad2: 'sounds/bass_note_A.mp3', // Placeholder
            pad3: 'sounds/bass_note_G.mp3', // Placeholder
            pad4: 'sounds/bass_note_F.mp3', // Placeholder
        },
        'Synth': {
            pad1: 'sounds/synth_chord.mp3', // manual check
            pad2: 'sounds/synth_chord.mp3-2', // manual check
            pad3: 'sounds/synth_pad.mp3', // Placeholder
            pad4: 'sounds/synth_lead.mp3', // Placeholder
        },
        'FX': {
            pad1: 'sounds/carti_SCHYEAH.mp3',
            pad2: 'sounds/carti_hahahah.mp3',
            pad3: 'sounds/carti_what.mp3',
            pad4: 'sounds/barbie.mp3',
            pad5: 'sounds/engine_rev.mp3',
            pad6: 'sounds/tire_chirp.mp3',
            pad7: 'sounds/clown_horn.mp3',
            // You can fill in the rest of these pads
        }
    };

    const pads = document.querySelectorAll('.pad');
    const kitButtons = document.querySelectorAll('.kit-button');
    let currentKit = 'Drums';

    // Sequencer elements
    const modeButtons = document.querySelectorAll('.mode-btn');
    const beatPad = document.querySelector('.beat-pad');
    const kitSelector = document.querySelector('.kit-selector');
    const sequencer = document.querySelector('.sequencer');
    const playStopBtn = document.getElementById('play-stop-button');
    const steps = document.querySelectorAll('.step');
    const instrumentRows = document.querySelectorAll('.instrument-row');

    let isPlaying = false;
    let currentStep = 0;
    let tempo = 120; // Beats Per Minute

    // Function to handle sound playback for both modes
    function playSound(soundPath) {
        if (!soundPath) {
            console.log("Empty pad clicked.");
            return;
        }
        const audio = new Audio(soundPath);
        audio.play();
    }
    
    // Function to load the sound kit for the pads
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

    // Function to handle the sequencing logic
    function playSequence() {
        if (!isPlaying) return;

        // Reset previous step highlight
        steps.forEach(step => step.classList.remove('playing'));

        // Highlight the current step
        const currentSteps = document.querySelectorAll(`.step[data-step="${currentStep + 1}"]`);
        currentSteps.forEach(step => step.classList.add('playing'));

        // Play sounds for active steps
        instrumentRows.forEach(row => {
            const currentKitData = soundKits[currentKit]; // Use the currently selected kit
            const currentStepEl = row.querySelector(`.step[data-step="${currentStep + 1}"]`);
            
            if (currentStepEl && currentStepEl.classList.contains('active')) {
                const soundPath = currentKitData[`pad${currentStep + 1}`];
                if (soundPath) {
                    playSound(soundPath);
                }
            }
        });

        // Move to the next step
        currentStep = (currentStep + 1) % 16;
        setTimeout(playSequence, (60 / tempo) * 1000);
    }
    
    // EVENT LISTENERS

    // Kit Selector Buttons
    kitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kit = button.dataset.kit;
            loadKit(kit);
        });
    });

    // Beat Pad Click
    pads.forEach(pad => {
        pad.addEventListener('click', () => {
            if (pad.dataset.sound) {
                playSound(pad.dataset.sound);
                pad.classList.add('playing');
                setTimeout(() => {
                    pad.classList.remove('playing');
                }, 150);
            }
        });
    });

    // Mode Switcher Buttons
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (mode === 'beat-pad') {
                beatPad.classList.remove('hidden');
                kitSelector.classList.remove('hidden');
                sequencer.classList.add('hidden');
                if(isPlaying) {
                    isPlaying = false;
                    playStopBtn.textContent = 'Play';
                    steps.forEach(step => step.classList.remove('playing'));
                }
            } else {
                beatPad.classList.add('hidden');
                kitSelector.classList.add('hidden');
                sequencer.classList.remove('hidden');
            }
        });
    });

    // Sequencer Play/Stop Button
    playStopBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playStopBtn.textContent = isPlaying ? 'Stop' : 'Play';
        if (isPlaying) {
            currentStep = 0;
            playSequence();
        } else {
            steps.forEach(step => step.classList.remove('playing'));
        }
    });

    // Sequencer Step Toggling
    steps.forEach(step => {
        step.addEventListener('click', () => {
            step.classList.toggle('active');
        });
    });

    // Initial load
    loadKit(currentKit);
});
