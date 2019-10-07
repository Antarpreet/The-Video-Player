document.addEventListener("DOMContentLoaded", function () { initialiseplayer(); }, false);

let player;
let interval;
let duration;

/**
 * This function initializes the player
 */
function initialiseplayer() {
    let volume = document.getElementById('volume');
    let progressBar = document.getElementById('progress-bar');
    player = document.getElementById('media-video');
    player.controls = false;
    volume.innerHTML = player.volume * 100;

    // player event listener for progress bar
    player.addEventListener('timeupdate', updateProgressBar, false);
    progressBar.addEventListener('click', progressBarSeek, false);

    // player event listener for play event
    player.addEventListener('play', function () {
        let playPauseButton = document.getElementById('play-pause-button');
        changeButtonType(playPauseButton, 'Pause');
    }, false);

    // player event listener for pause event
    player.addEventListener('pause', function () {
        let playPauseButton = document.getElementById('play-pause-button');
        changeButtonType(playPauseButton, 'Play');
    }, false);

    // player event listener for volume change
    player.addEventListener('volumechange', function (e) {
        let muteButton = document.getElementById('mute-button');
        if (player.muted) changeButtonType(muteButton, 'Unmute');
        else changeButtonType(muteButton, 'Mute');
    }, false);

    // player event listener for loading metadata
    player.addEventListener('loadedmetadata', loadedMetaDataEvent, false);

    // player event listener for scroll event
    player.addEventListener('mousewheel', scrollEvent, false);
    player.addEventListener('DOMMouseScroll', scrollEvent, false);

    let clicks = 0;
    let timer;
    // player event listener for click event
    player.addEventListener('click', function () {
        clicks++;
        if (clicks === 1) {
            timer = setTimeout(function () {
                togglePlayPause();
                clicks = 0;
            }, 200);
        } else {
            clearTimeout(timer);
            clicks = 0;
        }

    }, false);

    player.addEventListener('dblclick', fullScreenMedia, false);
}

function progressBarSeek(event) {
    console.log(event);
}

/**
 * This function runs on loadedMetaData Event for video player
 *
 * @param event (Event) HTML loadedmetadata event
 */
function loadedMetaDataEvent(event) {
    console.log(event);
    let durationElement = document.getElementById('duration');
    duration = getHHMMSS(player.duration);
    durationElement.innerHTML = '00:00:00/' + getHHMMSS(player.duration);

    let resolutionList = document.getElementById('resolution-list');
    let option = document.createElement('option');
    let textNode = document.createTextNode(player.videoHeight + 'p');
    option.appendChild(textNode);
    resolutionList.appendChild(option);
}

/**
 * This function runs on scroll event on the player
 *
 * @param event (WheelEvent) HTML mousewheel event
 */
function scrollEvent(event) {
    let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    let volume = document.getElementById('volume');

    if (player.muted) {
        let muteButton = document.getElementById('mute-button');
        changeButtonType(muteButton, 'Mute');
        player.muted = false;
    }

    if (delta == 1 && player.volume < 1) { player.volume += 0.1; }
    if (delta == -1 && player.volume >= 0.1) { player.volume -= 0.1; }

    player.volume = parseFloat(player.volume).toFixed(1);
    volume.innerHTML = player.volume * 100;
    event.preventDefault();
}

/**
 * This function returns time in HH:MM:SS format
 *
 * @param time (Number)(Float) Time in seconds
 */
function getHHMMSS(time) {
    let sec_num = parseInt(time, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

/**
 * This function updates the progress bar
 */
function updateProgressBar() {
    let progressBar = document.getElementById('progress-bar');
    let percentage = Math.floor((100 / player.duration) *
        player.currentTime);
    let currentTime = getHHMMSS(player.currentTime);
    let durationElement = document.getElementById('duration');
    durationElement.innerHTML = currentTime + '/' + duration;
    progressBar.value = percentage;
    progressBar.innerHTML = percentage + '% played';
}

/**
 * This function toggles play and pause of the video
 */
function togglePlayPause() {
    let playPauseButton = document.getElementById('play-pause-button');
    if (player.paused || player.ended) {
        changeButtonType(playPauseButton, 'Pause');
        player.play();
    }
    else {
        changeButtonType(playPauseButton, 'Play');
        player.pause();
    }
}

/**
 * This function stops the video and sets current played time to 0
 */
function stopPlayer() {
    let playPauseButton = document.getElementById('play-pause-button');
    changeButtonType(playPauseButton, 'Play');
    player.pause();
    player.currentTime = 0;
}

/**
 * This function changes the volume of the video
 *
 * @param direction (String) '+'/'-' to increase/decrease volume respectively
 */
function changeVolume(direction) {
    let volume = document.getElementById('volume');

    if (player.muted) {
        let muteButton = document.getElementById('mute-button');
        changeButtonType(muteButton, 'Mute');
        player.muted = false;
    }

    if (direction === '+') {
        player.volume += player.volume == 1 ? 0 : 0.1;
    } else if (direction === '-') {
        player.volume -= (player.volume == 0 ? 0 : 0.1);
    }
    player.volume = parseFloat(player.volume).toFixed(1);
    volume.innerHTML = player.volume * 100;
}

/**
 * This function mutes the video
 */
function toggleMute() {
    let muteButton = document.getElementById('mute-button');
    if (player.muted) {
        changeButtonType(muteButton, 'Mute');
        player.muted = false;
    }
    else {
        changeButtonType(muteButton, 'Unmute');
        player.muted = true;
    }
}

/**
 * This function replays the video from start
 */
function replayMedia() {
    resetPlayer();
    player.play();
}

/**
 * This function resets the player to intial state
 */
function resetPlayer() {
    let playPauseButton = document.getElementById('play-pause-button');
    let progressBar = document.getElementById('progress-bar');
    progressBar.value = 0;
    player.currentTime = 0;
    player.poster = './test.jpg';
    changeButtonType(playPauseButton, 'Play');
}

/**
 * This function opens the video in fullscreen mode
 */
function fullScreenMedia() {
    if (player.requestFullscreen) {
        player.requestFullscreen();
    } else if (player.mozRequestFullScreen) {
        player.mozRequestFullScreen();
    } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen();
    } else if (player.msRequestFullscreen) {
        player.msRequestFullscreen();
    }
}

/**
 * This function forwards the video
 *
 * @param increment (Number) Time to forward video by in seconds
 */
function forwardVideo(increment) {
    player.currentTime += increment;
}

/**
 * This function rewinds the video
 *
 * @param increment (Number) Time to rewind video by in seconds
 */
function rewindVideo(increment) {
    player.currentTime -= increment;
}

/**
 * This function changes the button type
 *
 * @param customButton (Button Element) Button to change content of
 * @param value (String) Change the button content with this value
 */
function changeButtonType(customButton, value) {
    customButton.title = value;
    customButton.innerHTML = value;
    customButton.className = value;
}