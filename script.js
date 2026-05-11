document.addEventListener('DOMContentLoaded', () => {
    const audioUpload = document.getElementById('audio-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const audioContainer = document.getElementById('audio-container');
    const audioPlayer = document.getElementById('audio-player');
    const restartBtn = document.getElementById('restart-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
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
            
            // Reset custom UI
            playPauseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            progressBar.value = 0;
            currentTimeDisplay.textContent = '0:00';
            
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

    // Custom Player Logic
    const playIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    const pauseIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

    restartBtn.addEventListener('click', () => {
        if (!audioPlayer.src) return;
        audioPlayer.currentTime = 0;
    });

    playPauseBtn.addEventListener('click', () => {
        if (!audioPlayer.src) return;
        
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = pauseIcon;
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = playIcon;
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (!audioPlayer.duration) return;
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('ended', () => {
        playPauseBtn.innerHTML = playIcon;
        progressBar.value = 0;
        currentTimeDisplay.textContent = '0:00';
    });

    progressBar.addEventListener('input', (e) => {
        if (!audioPlayer.duration) return;
        const seekTime = (e.target.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

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
