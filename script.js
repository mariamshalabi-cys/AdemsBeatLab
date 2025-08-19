document.addEventListener('DOMContentLoaded', () => {
    const soundKits = {
        'Drums': {
            pad1: 'sounds/kick.mp3',
            pad2: 'sounds/snare.mps.mp3',
            pad3: 'sounds/hihat_closed.mp3',
            pad4: 'sounds/hihat_open.mp3',
            // Remember to fill in the rest and double-check paths!
        },
        'Bass': {
            pad1: 'sounds/synth_chord.mp3-2.mp3',
            // Fill in bass sounds
        },
        'Synth': {
            pad1: 'sounds/synth_chord.mp3',
            // Fill in synth sounds
        },
        'FX': {
            pad1: 'sounds/carti_SCHYEAH.mp3',
            pad2: 'sounds/carti_hahahah.mp3',
            pad3: 'sounds/carti_what.mp3',
            pad4: 'sounds/barbie.mp3',
        }
    };

    const pads = document.querySelectorAll('.pad');
    const kitButtons = document.querySelectorAll('.kit-button');
    let currentKit = 'Drums';

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
                setTimeout(() => {
                    pad.classList.remove('playing');
                }, 150);
            }
        });
    });

    loadKit(currentKit);
});
