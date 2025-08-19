document.addEventListener('DOMContentLoaded', () => {
    // --- SOUND KITS DATA ---
    const soundKits = {
        'Drums': {
            pad1: 'sounds/drums/kick.wav',
            pad2: 'sounds/drums/snare.wav',
            // ... etc for 16 pads
        },
        'Bass': {
            pad1: 'sounds/bass/bass_a.wav',
            // ... etc
        },
        'Synth': {
            pad1: 'sounds/synth/synth_c.wav',
            // ... etc
        },
        'FX': {
            pad1: 'sounds/fx/riser.wav',
            // ... etc
        }
    };

    // --- VARIABLES ---
    const pads = document.querySelectorAll('.pad');
    const kitButtons = document.querySelectorAll('.kit-button');
    let currentKit = 'Drums'; // Default kit

    // --- FUNCTIONS ---
    function playSound(soundPath) {
        const audio = new Audio(soundPath);
        audio.play();
    }
    
    function loadKit(kitName) {
        currentKit = kitName;
        pads.forEach((pad, index) => {
            const padNumber = index + 1;
            const sound = soundKits[kitName][`pad${padNumber}`];
            pad.dataset.sound = sound || ''; // Set sound or leave empty if not defined
        });

        // Update active button style
        kitButtons.forEach(button => {
            if (button.dataset.kit === kitName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // --- EVENT LISTENERS ---
    
    // Kit selector buttons
    kitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kit = button.dataset.kit;
            loadKit(kit);
        });
    });

    // Beat pad clicks
    pads.forEach(pad => {
        pad.addEventListener('click', () => {
            if (pad.dataset.sound) {
                playSound(pad.dataset.sound);
                
                // Visual feedback
                pad.classList.add('playing');
                setTimeout(() => {
                    pad.classList.remove('playing');
                }, 100);
            }
        });
    });

    // --- INITIALIZATION ---
    loadKit(currentKit); // Load the default kit on page load
});
