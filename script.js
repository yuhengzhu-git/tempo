document.addEventListener('DOMContentLoaded', () => {
    const audioUpload = document.getElementById('audio-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const audioContainer = document.getElementById('audio-container');
    const audioPlayer = document.getElementById('audio-player');
    const speedSlider = document.getElementById('speed-slider');
    const speedDisplay = document.getElementById('speed-display');
    const speedBtns = document.querySelectorAll('.speed-btn');

    let currentObjectUrl = null;

    // Handle file upload
    audioUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Revoke old object URL to avoid memory leaks
            if (currentObjectUrl) {
                URL.revokeObjectURL(currentObjectUrl);
            }

            // Update UI
            fileNameDisplay.textContent = file.name;
            audioContainer.classList.remove('hidden');

            // Load file into audio player
            currentObjectUrl = URL.createObjectURL(file);
            audioPlayer.src = currentObjectUrl;
            
            // Apply current speed to new audio
            updateSpeed(speedSlider.value);
        } else {
            fileNameDisplay.textContent = 'No file chosen';
            audioContainer.classList.add('hidden');
            audioPlayer.src = '';
        }
    });

    // Handle speed slider change
    speedSlider.addEventListener('input', (e) => {
        updateSpeed(e.target.value);
    });

    // Handle quick speed buttons
    speedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const speed = btn.dataset.speed;
            speedSlider.value = speed;
            updateSpeed(speed);
        });
    });

    // Function to update playback speed and UI
    function updateSpeed(speedValue) {
        const speed = parseFloat(speedValue);
        
        // Update audio element
        audioPlayer.playbackRate = speed;
        
        // Update text display
        speedDisplay.textContent = speed.toFixed(2) + 'x';
        
        // Update active state on quick buttons
        speedBtns.forEach(btn => {
            if (parseFloat(btn.dataset.speed) === speed) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Ensure audio element keeps speed when ended/looped/played again
    audioPlayer.addEventListener('play', () => {
        audioPlayer.playbackRate = parseFloat(speedSlider.value);
    });
});
