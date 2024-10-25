<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header('Location: login.php'); // Redirect to login if not logged in
    exit;
}

// Logout functionality
if (isset($_GET['logout'])) {
    session_destroy(); // Destroy the session
    header('Location: login.php'); // Redirect to login page
    exit;
}

// Reset score to zero on page refresh
$_SESSION['score'] = 0;

// Check if the score has been updated via AJAX (when the ball touches the basket)
if (isset($_POST['incrementScore'])) {
    $_SESSION['score'] += 1;
    echo $_SESSION['score'];  // Return the updated score to JavaScript
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basketball in a Box - Interactive</title>
    <link href="style.css" rel="stylesheet">

</head>
<body>

    <div class="container">
        <div class="title">
            <h2>Interactive Basketball Game</h2>
            <p>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</p>
            <p>Move your mouse close to the ball. The ball will avoid you! Try to get the ball in the basket!</p>
        </div>

        <div id="score">Score: <?php echo $_SESSION['score']; ?></div>
        <div id="timer">Time: 10</div>

        <div class="box">
            <video id="webcam" autoplay playsinline muted></video>
            <div class="basket">Basket</div>
            <div class="ball" id="ball"></div>
            <div class="barrier" id="barrier1" style="top: 150px; left: 20%;"></div>
            <div class="barrier" id="barrier2" style="top: 50px; left: 50%;"></div>
            <div class="barrier" id="barrier3" style="top: 150px; left: 80%;"></div>
        </div>

        <!-- Buttons -->
        <div class="button-container">
            <button id="startBtn">Start</button>
            <button id="pauseBtn">Pause</button>
            <button id="restartBtn">Restart</button>
        </div>

        <!-- Logout link -->
        <div>
            <a href="?logout=true">Logout</a>
        </div>
    </div>

    <script src="script.js"></script>

</body>
</html>
