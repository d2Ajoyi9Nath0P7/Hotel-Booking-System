<?php

//database connection
include "db.php";
//login system user track rakhar jonno i mean temporary data store korar jonno
session_start();

    //registration form submit korle
     if(isset($_POST['register']))
    {
        //extra space remove korar jonno trim use kora hocche
        $name = trim($_POST['name']);
        $email = trim($_POST['email']);

        /*
        echo $name."<br>";
        echo $email."<br>";
        */

        /*
        //optional field handling
        if(isset($_POST['phone']))//phone field exist korle
        {
            $phone = trim($_POST['phone']);
        }
        else
        {
            $phone = "";/////////////////////
        }*/

        //confirm password: User er typing mistake catch korar jonno
        $password = $_POST["password"];
        $confirmPassword = $_POST["confirm_password"];
        //$hashPassword = password_hash($password,PASSWORD_DEFAULT);

        //jodi user kono value empty chere dey tahole
        if(empty($name) || empty($email) || empty($password)) 
        {
            echo "All fields are required!";
            exit();
        }

        //Password Length Check
        if(strlen($password) < 6) 
        {
            echo "Password must be at least 6 characters!";
            exit();
        }

        //typing mistake catch korar jonno
        if($password !== $confirmPassword) 
        {
            echo "Passwords do not match!";
            exit();
        }

        //Email duplicate check
        //check_stmt diye query contron kore
        $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?"); //SQL injection er jonno prepared statement use kora hocche
        $check_stmt->bind_param("s", $email);
        $check_stmt->execute();
        $check_stmt->store_result();
    
        if($check_stmt->num_rows > 0) 
        {
            echo "Email already registered! Please login.";
            $check_stmt->close();
            exit();
        }
        $check_stmt->close();

        echo "Password validation passed!<br>";

        //hashing the password before storing it in the database
        $hashPassword = password_hash($password,PASSWORD_DEFAULT);

        $stmt = $conn->prepare("
        INSERT INTO users(name,email,password)
        VALUES(?,?,?)");

        $stmt->bind_param("sss",$name,$email,$hashPassword);

        if($stmt->execute())
        {
            $stmt->close();
            $conn->close();
    
            echo "Registration successful!";
            header("Location: login.html?registration=success");
            exit();
        }
        else
        {
            echo "Error: ".$stmt->error;
        }

        $stmt->close();//safe from memory leak
        $conn->close();
    }