document.addEventListener('DOMContentLoaded', () => {
    const soundKits = {
        'Drums': {
            pad1: 'sounds/drums/kick.wav',
            pad2: 'sounds/drums/snare.wav',
            pad3: 'sounds/drums/hihat.wav',
            pad4: 'sounds/drums/openhat.wav',
            // Fill in the rest of your sound paths
        },
        'Bass': {
            pad1: 'sounds/bass/bass_a.wav',
            // Fill in the rest of your sound paths
        },
        'Synth': {
            pad1: 'sounds/synth/synth_c.wav',
            // Fill in the rest of your sound paths
        },
        'FX': {
            pad1: 'sounds/fx/riser.wav',
            // Fill in the rest of your sound paths
        }
    };

    const pads = document.querySelectorAll('.pad');
    const kitButtons = document.querySelectorAll('.kit-button');
    let currentKit = 'Drums';

    function playSound(soundPath) {
        if (!soundPath) {
            console.log("Empty pad");
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
                }, 100);
            }
        });
    });

    loadKit(currentKit);
});
