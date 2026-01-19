<?php
    $conn = new mysqli("localhost", "root", "root", "bookingsystem");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "
    SELECT id,booking_reference,property_id,user_id,check_in_date,check_out_date,total_price,guests, total_price, status
    FROM bookings
    ORDER BY id DESC
    ";
    $result = $conn->query($sql);

    $data = array();


    
    if(!$result) 
    {
        header('Content-Type: application/json');
        die(json_encode(["error" => "SQL Error: " . $conn->error]));
    }

    if($result->num_rows > 0)
    {
        while($row = $result->fetch_assoc()) 
        {
            $data[] = $row;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($data);
    $conn->close();
?>