<?php
ini_set('session.gc_maxlifetime', 36000);
session_set_cookie_params(36000);
session_start();

include 'db.php';

if($_SERVER["REQUEST_METHOD"] == "POST")
{
    $user_name = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password  = isset($_POST['password']) ? $_POST['password'] : '';

    if(empty($user_name) || empty($password))
    {
        header("Location: admin-login.html?error=empty");
        exit();
    }

    $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->bind_param("s", $user_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result && $result->num_rows === 1)
    {
        $row = $result->fetch_assoc();
        $storedHash = $row['password'];

        $passwordMatches = false;
        if (password_verify($password, $storedHash)) {
            $passwordMatches = true;
        } elseif ($password === $storedHash) {
            $passwordMatches = true;
        }

        if ($passwordMatches) {

            session_unset();        // পুরাতন session data মুছে দাও
            session_destroy();      // পুরাতন session শেষ করো
            session_start();        // নতুন session শুর




            session_regenerate_id(true);
            $_SESSION['admin_id'] = $row['id'];
            $_SESSION['admin_username'] = $row['username'];

            header("Location: dashboard/index.php");
            exit();
        }
        else 
        {
            header("Location: admin-login.html?error=wrong_password");  // .php থেকে .html করলাম
            exit();
        }
    }
    else
    {
        header("Location: admin-login.html?error=no_user");  // error= এর পরে no_user যোগ করলাম
        exit();
    }
}
?>