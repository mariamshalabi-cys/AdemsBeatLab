// Function to handle the sequencing logic
function playSequence() {
    if (!isPlaying) return;

    // Reset previous step highlight
    steps.forEach(step => step.classList.remove('playing'));

    // Highlight the current step
    const currentSteps = document.querySelectorAll(`.step[data-step="${currentStep + 1}"]`);
    currentSteps.forEach(step => step.classList.add('playing'));

    // Play sounds for active steps in ALL rows
    instrumentRows.forEach(row => {
        const kitName = row.dataset.kit;
        const currentKitData = soundKits[kitName];
        const currentStepEl = row.querySelector(`.step[data-step="${currentStep + 1}"]`);
        
        if (currentStepEl && currentStepEl.classList.contains('active')) {
            const padNumber = parseInt(currentStepEl.dataset.step);
            const soundPath = currentKitData[`pad${padNumber}`];
            if (soundPath) {
                playSound(soundPath);
            }
        }
    });
    
    // Move to the next step
    currentStep = (currentStep + 1) % 16;
    setTimeout(playSequence, (60 / tempo) * 1000);
}
