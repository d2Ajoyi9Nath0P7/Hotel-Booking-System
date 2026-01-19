<?php
include "db.php";

//track login system user
session_start();

if(isset($_POST['login']))
{
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Check empty fields
    if(empty($email) || empty($password)) 
    {
        echo "All fields are required!";
        exit();
    }

    // Validate email format
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) 
    {
        echo "Invalid email format!";
        exit();
    }

    // Prepare statement
    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email =?");
    
    if(!$stmt)
    {
        error_log("Prepare failed: " . $conn->error);
        echo "Database error.";
        exit();
    }
    $stmt->bind_param("s", $email);// bind the email parameter
    
    if(!$stmt->execute())
    {
        error_log("Execute failed: " . $stmt->error);
        echo "Database error.";
        $stmt->close();
        $conn->close();
        exit();
    }



    $stmt->store_result();


    /*
    echo "Input Email: [" . $email . "]<br>";


    $debug_res = $conn->query("SELECT email FROM users");
    echo "Emails currently in Database:<br>";
    while($row = $debug_res->fetch_assoc())
    {
        echo "- [" . $row['email'] . "]<br>";
    }
    die("--- End of Debug ---");
    */


    if($stmt->num_rows == 1)
    {
        $stmt -> bind_result($user_id, $user_name, $user_email, $hashPassword);
        $stmt -> fetch();

        // Verify password
        if(!empty($hashPassword) && password_verify($password, $hashPassword))
        {
            // Regenerate session ID to prevent session fixation
            session_regenerate_id(true);

            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $user_name;
            $_SESSION['user_email'] = $user_email;

            //
            $_SESSION['logged_in'] = true;

            // Redirect after successful login
            header("Location: Home.php");//jeykhane niye jete chai
            exit();
        }
        else
        {
            // Do not reveal whether email or password was incorrect
            header("Location: login.html");//jeykhane niye jete chai
            exit();
        }
    }
    else
    {
        //die("Checking for email: " . $email);
        //die("Number of rows found: " . $stmt->num_rows);
        

        // Do not reveal whether email or password was incorrect
        header("Location: login.html");//jeykhane niye jete chai
        exit();
    }

    $stmt->close();
    $conn->close();
}