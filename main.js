const startButton = document.getElementById("start-timer");
const timerList = document.getElementById("timer-list");
const activeTimersSection = document.querySelector(".active-timers-section");
const end_span = document.querySelector("#end_span");

let timers = []; // Array to store all timers

// Function to start a new timer
startButton.addEventListener("click", () => {
    const hours = parseInt(document.querySelector("#hours").value) || 0;
    const minutes = parseInt(document.querySelector("#minutes").value) || 0;
    const seconds = parseInt(document.querySelector("#seconds").value) || 0;

    // Validate input
    if (hours === 0 && minutes === 0 && seconds === 0) {
        alert("Please set a valid time!");
        return;
    }

    const totalTime = hours * 3600 + minutes * 60 + seconds;

    // Create a new timer object
    const timer = {
        id: Date.now(),
        remainingTime: totalTime,
        interval: null,
        audio: new Audio("y2mate-com-harry-potter-ringtone-bgm-tone-54095.mp3"), // Assign unique audio
    };

    timers.push(timer);
    addTimerToList(timer);

    // Show the active timers section and hide the "no timers" message
    activeTimersSection.style.display = "block";
    end_span.style.display = "none";
});

// Function to add a timer to the DOM
function addTimerToList(timer) {
    const timerContainer = document.createElement("li");
    timerContainer.classList.add("timer-container");
    timerContainer.setAttribute("data-id", timer.id);

    timerContainer.innerHTML = `
        <span id="timeLeft">Time Left :</span>
        <span class="time-display">${formatTime(timer.remainingTime)}</span>
        <div class="timer-controls">
            <button class="stop-button">Delete</button>
        </div>
    `;

    timerList.appendChild(timerContainer);

    timer.interval = setInterval(() => {
        timer.remainingTime -= 1;

        if (timer.remainingTime <= 0) {
            clearInterval(timer.interval);
            timerEnded(timer.id);
        } else {
            updateTimerDisplay(timer.id, timer.remainingTime);
        }
    }, 1000);

    timerContainer.querySelector(".stop-button").addEventListener("click", () => stopTimer(timer.id));
}

// Function to update the timer display
function updateTimerDisplay(timerId, remainingTime) {
    const timerContainer = document.querySelector(`.timer-container[data-id="${timerId}"]`);
    if (timerContainer) {
        timerContainer.querySelector(".time-display").textContent = formatTime(remainingTime);
    }
}

// Function to handle timer ending
function timerEnded(timerId) {
    const timer = timers.find((t) => t.id === timerId);
    const timerContainer = document.querySelector(`.timer-container[data-id="${timerId}"]`);

    if (timerContainer) {
        timerContainer.classList.add("ended");
        timerContainer.querySelector(".time-display").textContent = "Time’s Up!";
        timerContainer.querySelector(".time-display").style.color = "#34344A";
        timerContainer.querySelector('#timeLeft').textContent = '';
        timerContainer.style.backgroundColor = "#F0F757";
        timerContainer.querySelector(".stop-button").textContent = "Stop";
        timerContainer.querySelector(".stop-button").style.backgroundColor = "#34344A";
        timerContainer.querySelector(".stop-button").style.color = "white";

        if (timer) {
            timer.audio.play();
        }
    }
}

// Function to stop a timer
function stopTimer(timerId) {
    const timerIndex = timers.findIndex((t) => t.id === timerId);
    if (timerIndex !== -1) {
        const timer = timers[timerIndex];
        clearInterval(timer.interval);

        const timerContainer = document.querySelector(`.timer-container[data-id="${timerId}"]`);
        if (timerContainer) {
            timerContainer.remove();
        }

        if (timer.audio) {
            timer.audio.pause();
            timer.audio.currentTime = 0;
        }

        timers.splice(timerIndex, 1);

        // If no timers are left, show "no timers" message and hide the active timers section
        if (timers.length === 0) {
            activeTimersSection.style.display = "none";
            end_span.style.display = "block";
        }
    }
}

// Function to format time in hh:mm:ss
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
