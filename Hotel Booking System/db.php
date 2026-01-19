<?php
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "bookingsystem";

    $conn = new mysqli($servername,$username,$password,$dbname); // connection object

    if($conn->connect_error)
    {
        error_log("DB Connection Failed: ".$conn->connect_error);
        die("Connection Failed : ".$conn->connect_error);
    }
?>