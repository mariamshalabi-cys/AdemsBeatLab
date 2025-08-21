document.addEventListener('DOMContentLoaded', () => {
    const soundKits = {
        'Drums': {
            pad1: 'sounds/kick.mp3',
            pad2: 'sounds/snare.mp3',
            pad3: 'sounds/hihat_closed.mp3',
            pad4: 'sounds/hihat_open.mp3',
            pad5: 'sounds/lighter.mp3',
            pad6: 'sounds/clap.mp3',
            pad7: 'sounds/cowbell.mp3',
            pad8: 'sounds/shaker.mp3',
            pad9: 'sounds/crash.mp3',
            pad10: 'sounds/ride.mp3',
            pad11: 'sounds/tom.mp3',
            pad12: 'sounds/rimshot.mp3',
            pad13: 'sounds/perc1.mp3',
            pad14: 'sounds/perc2.mp3',
            pad15: 'sounds/perc3.mp3',
            pad16: 'sounds/perc4.mp3',
        },
        'Bass': {
            pad1: 'sounds/synth_chord.mp3',
            pad2: 'sounds/synth_arpeggio.mp3',
            pad3: 'sounds/bass_note_A.mp3',
            pad4: 'sounds/bass_note_G.mp3',
        },
        'Synth': {
            pad1: 'sounds/synth_chord.mp3',
            pad2: 'sounds/synth_arpeggio.mp3',
            pad3: 'sounds/synth_pad.mp3',
            pad4: 'sounds/synth_lead.mp3',
        },
        'FX': {
            pad1: 'sounds/carti_SCHYEAH.mp3',
            pad2: 'sounds/carti_hahahah.mp3',
            pad3: 'sounds/carti_what.mp3',
            pad4: 'sounds/barbie.mp3',
            pad5: 'sounds/engine_rev.mp3',
            pad6: 'sounds/tire_chirp.mp3',
            pad7: 'sounds/clown_horn.mp3',
        }
    };

    const pads = document.querySelectorAll('.pad');
    const kitButtons = document.querySelectorAll('.kit-button');
    let currentKit = 'Drums';

    const modeButtons = document.querySelectorAll('.mode-btn');
    const beatPad = document.querySelector('.beat-pad');
    const kitSelector = document.querySelector('.kit-selector');
    const sequencer = document.querySelector('.sequencer');
    const playStopBtn = document.getElementById('play-stop-button');
    const steps = document.querySelectorAll('.step');
    const instrumentRows = document.querySelectorAll('.instrument-row');

    let isPlaying = false;
    let currentStep = 0;
    let tempo = 120;

    function playSound(soundPath) {
        if (!soundPath) {
            console.log("Empty pad clicked.");
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

    function showSequencerKit(kitName) {
        instrumentRows.forEach(row => {
            row.classList.add('hidden');
            if (row.dataset.kit === kitName) {
                row.classList.remove('hidden');
            }
        });
    }

    function playSequence() {
        if (!isPlaying) return;

        steps.forEach(step => step.classList.remove('playing'));

        const currentSteps = document.querySelectorAll(`.step[data-step="${currentStep + 1}"]`);
        currentSteps.forEach(step => step.classList.add('playing'));

        const visibleRow = document.querySelector(`.instrument-row:not(.hidden)`);
        if (visibleRow) {
            const kitName = visibleRow.dataset.kit;
            const currentKitData = soundKits[kitName];
            const currentStepEl = visibleRow.querySelector(`.step[data-step="${currentStep + 1}"]`);
            if (currentStepEl && currentStepEl.classList.contains('active')) {
                const padNumber = parseInt(currentStepEl.dataset.step);
                const soundPath = currentKitData[`pad${padNumber}`];
                if (soundPath) {
                    playSound(soundPath);
                }
            }
        }
        
        currentStep = (currentStep + 1) % 16;
        setTimeout(playSequence, (60 / tempo) * 1000);
    }
    
    kitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kit = button.dataset.kit;
            loadKit(kit);
            showSequencerKit(kit);
        });
    });

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
                showSequencerKit(currentKit);
            }
        });
    });

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

    steps.forEach(step => {
        step.addEventListener('click', () => {
            step.classList.toggle('active');
        });
    });

    loadKit(currentKit);
    showSequencerKit(currentKit);
});
