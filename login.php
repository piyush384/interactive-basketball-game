<?php
session_start();

// Check if the user is already logged in
if (isset($_SESSION['username'])) {
    header('Location: game.php'); // Redirect to game if already logged in
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    if (!empty($username)) {
        $_SESSION['username'] = htmlspecialchars($username); // Store username in session
        header('Location: game.php'); // Redirect to game page
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        form {
            text-align: center;
        }
        input[type="text"] {
            padding: 10px;
            margin: 10px 0;
            width: 200px;
        }
        input[type="submit"] {
            padding: 10px 20px;
        }
    </style>
</head>
<body>

    <form method="POST">
        <h2>Login to Start the Game</h2>
        <input type="text" name="username" placeholder="Enter your name" required>
        <input type="submit" value="Start Game">
    </form>

</body>
</html>
