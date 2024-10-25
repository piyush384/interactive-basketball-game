
const ball = document.querySelector('#ball');
const box = document.querySelector('.box');
const basket = document.querySelector('.basket');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const barriers = document.querySelectorAll('.barrier'); // Get all barriers
const webcamVideo = document.getElementById('webcam');

let gameInterval; // For game loop
let timerInterval; // For timer
let isPaused = false; // Game state
let isGameActive = false; // Indicates if the game is active
let timeLeft = 10; // Timer for 10 seconds

// Starting position of the ball
const initialBallPosition = {
    left: ball.offsetLeft,
    top: ball.offsetTop,
};

// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        webcamVideo.srcObject = stream;
        detectMotion();
    })
    .catch(error => {
        console.error('Error accessing webcam:', error);
    });

// Move ball away from mouse when hovering
box.addEventListener('mousemove', (e) => {
    if (!isGameActive || isPaused) return; // Ignore if not active or paused

    const boxRect = box.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    // Calculate the center of the ball
    const ballCenterX = ballRect.left + ballRect.width / 2;
    const ballCenterY = ballRect.top + ballRect.height / 2;

    // Distance between mouse and ball center
    const distanceX = e.clientX - ballCenterX;
    const distanceY = e.clientY - ballCenterY;

    // Move ball away if mouse is close to it
    if (Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100) {
        moveBallAway(distanceX, distanceY);
    }
});

// Detect motion using webcam
function detectMotion() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 500;  // Match the box width
    canvas.height = 500; // Match the box height

    let lastImageData;

    function captureFrame() {
        context.drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);
        const currentImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        if (lastImageData && isGameActive) {
            const diff = compareImages(lastImageData.data, currentImageData.data);
            if (diff > 50) { // Threshold for detecting movement
                moveBallAway(100, 100); // Move ball when motion is detected
            }
        }
        lastImageData = currentImageData;

        requestAnimationFrame(captureFrame);
    }

    captureFrame();
}

// Compare two image data arrays
function compareImages(lastData, currentData) {
    let diff = 0;
    for (let i = 0; i < lastData.length; i += 4) {
        const r = Math.abs(lastData[i] - currentData[i]);
        const g = Math.abs(lastData[i + 1] - currentData[i + 1]);
        const b = Math.abs(lastData[i + 2] - currentData[i + 2]);
        diff += r + g + b; // Summing up the color differences
    }
    return diff / (lastData.length / 4); // Average difference
}

// Move ball away based on distance from mouse or motion detected
function moveBallAway(distanceX, distanceY) {
    const moveX = distanceX > 0 ? -10 : 10;
    const moveY = distanceY > 0 ? -10 : 10;

    let newX = ball.offsetLeft + moveX;
    let newY = ball.offsetTop + moveY;

    // Ensure the ball stays within the box boundaries
    if (newX < 0) newX = 0;
    if (newX > box.clientWidth - ball.clientWidth) newX = box.clientWidth - ball.clientWidth;
    if (newY < 0) newY = 0;
    if (newY > box.clientHeight - ball.clientHeight) newY = box.clientHeight - ball.clientHeight;

    ball.style.left = newX + 'px';
    ball.style.top = newY + 'px';

    checkCollisions(); // Check for collisions with basket and barriers
}

// Check collisions with basket and barriers
function checkCollisions() {
    const ballRect = ball.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    // Check collision with the basket
    if (ballRect.bottom > basketRect.top && 
        ballRect.top < basketRect.bottom &&
        ballRect.left < basketRect.right &&
        ballRect.right > basketRect.left) {
        // Ball hits the basket
        updateScore();
        changeBasketColor(); // Change the basket color
        resetBallPosition();  // Reset ball to the starting position
    }

    // Check collision with barriers
    barriers.forEach(barrier => {
        const barrierRect = barrier.getBoundingClientRect();
        if (ballRect.top < barrierRect.bottom && 
            ballRect.bottom > barrierRect.top &&
            ballRect.left < barrierRect.right &&
            ballRect.right > barrierRect.left) {
            // Ball hits the barrier, move it back
            moveBallBack();
        }
    });
}

// Change basket color to light green
function changeBasketColor() {
    basket.style.backgroundColor = 'lightgreen';
}

// Update the score via AJAX
function updateScore() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (this.status === 200) {
            scoreDisplay.textContent = 'Score: ' + this.responseText;
        }
    };
    xhr.send('incrementScore=1');
}

// Move the ball back to its starting position
function resetBallPosition() {
    ball.style.left = initialBallPosition.left + 'px';
    ball.style.top = initialBallPosition.top + 'px'; // Reset to the original position
}

// Move ball back if it hits a barrier
function moveBallBack() {
    resetBallPosition(); // Reset to the starting position
}

// Start the game
function startGame() {
    if (!isGameActive) {
        isGameActive = true; // Set game active
        timeLeft = 10; // Reset timer to 10 seconds
        timerDisplay.textContent = 'Time: ' + timeLeft;
        
        gameInterval = setInterval(moveBarriers, 1000); // Move barriers every second
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = 'Time: ' + timeLeft;
            if (timeLeft <= 0) {
                endGame(); // End game when time is up
            }
        }, 1000);
    }
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    isGameActive = false; // Set game inactive
    alert('Time is up! Your score is: ' + scoreDisplay.textContent.split(': ')[1]);
}

// Pause the game
function pauseGame() {
    isPaused = !isPaused; // Toggle pause state
}

// Move barriers randomly within the box
function moveBarriers() {
    barriers.forEach(barrier => {
        const randomX = Math.floor(Math.random() * (box.clientWidth - barrier.clientWidth));
        const randomY = Math.floor(Math.random() * (box.clientHeight - barrier.clientHeight));
        barrier.style.left = randomX + 'px';
        barrier.style.top = randomY + 'px';
    });
}

// Event listeners for buttons
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('restartBtn').addEventListener('click', () => {
    resetBallPosition();
    scoreDisplay.textContent = 'Score: 0'; // Reset score display
    endGame(); // End current game
});

