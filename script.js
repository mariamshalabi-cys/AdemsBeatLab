console.log("--- SCRIPT START ---");

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- DOMContentLoaded event fired. Script is now running. ---");

    // --- DOM ELEMENT SELECTORS ---
    console.log("Querying for DOM elements...");
    const padModeBtn = document.getElementById('pad-mode-btn');
    console.log("padModeBtn:", padModeBtn);
    
    const sequencerModeBtn = document.getElementById('sequencer-mode-btn');
    console.log("sequencerModeBtn:", sequencerModeBtn);

    const padModeContainer = document.getElementById('pad-mode-container');
    console.log("padModeContainer:", padModeContainer);

    const sequencerContainer = document.getElementById('sequencer-mode-container');
    console.log("sequencerContainer:", sequencerContainer);

    const sequencerGrid = document.querySelector('.sequencer');
    console.log("sequencerGrid:", sequencerGrid);

    const playStopButton = document.querySelector('#play-stop-button');
    console.log("playStopButton:", playStopButton);


    // --- SEQUENCER MODE LOGIC ---
    let isGridCreated = false;

    function createGrid() {
        console.log("--- createGrid() function CALLED. ---");

        if (isGridCreated) {
            console.log("Grid already created. Exiting function.");
            return;
        }

        if (!sequencerGrid) {
            console.error("CRITICAL ERROR: The 'sequencerGrid' element is null. Cannot build the grid.");
            return;
        }

        console.log("Attempting to clear and build the grid now...");
        sequencerGrid.innerHTML = ''; // Clear it first
        for (let i = 0; i < 4; i++) { // Simplified to 4 rows for testing
            const row = document.createElement('div');
            row.classList.add('instrument-row');
            for (let j = 0; j < 16; j++) {
                const step = document.createElement('div');
                step.classList.add('step');
                row.appendChild(step);
            }
            sequencerGrid.appendChild(row);
        }
        isGridCreated = true;
        console.log("--- Grid creation FINISHED. You should see it now. ---");
    }

    // --- MODE SWITCHING LOGIC ---
    function setMode(mode) {
        console.log(`--- setMode() function CALLED with mode: '${mode}' ---`);
        if (mode === 'pad') {
            padModeContainer.classList.remove('hidden');
            sequencerContainer.classList.add('hidden');
            padModeBtn.classList.add('active');
            sequencerModeBtn.classList.remove('active');
            console.log("Switched to Pad Mode.");
        } else { // Sequencer mode
            console.log("Attempting to switch to Sequencer Mode.");
            createGrid(); 
            padModeContainer.classList.add('hidden');
            sequencerContainer.classList.remove('hidden');
            padModeBtn.classList.remove('active');
            sequencerModeBtn.classList.add('active');
            console.log("Switched to Sequencer Mode.");
        }
    }

    padModeBtn.addEventListener('click', () => setMode('pad'));
    sequencerModeBtn.addEventListener('click', () => setMode('sequencer'));

    // --- INITIALIZATION ---
    console.log("--- Initializing page state... ---");
    setMode('pad');
    console.log("--- Page Initialized. ---");
});
