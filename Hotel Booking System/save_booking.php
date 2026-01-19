<?php
//response json hisebe asbe
header('Content-Type: application/json');

//database connection
include "db.php";

//session start
session_start();

// Check if user is logged in
if(!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) 
{
    echo json_encode([
        "success" => false,
        "error" => 'Please login to make a booking'
    ]);
    exit();
}


// Get logged in user ID
//database e booking save korar jonno jante hobe kon user booking korche
$user_id = $_SESSION['user_id'];

// Get POST data
$input = file_get_contents('php://input');//frontend theke data asbe
$data = json_decode($input, true);//frontend theke asha data php array te e convert korbe jeno easily use kora jay


// Validate data
if(!$data) 
{
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit();
}

// Validate required fields
if(!isset($data['checkInDate']) || !isset($data['checkOutDate']) || !isset($data['guests']) || !isset($data['nights']) || !isset($data['totalPrice'])) 
{
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);//json format e frontend e response pathabe
    exit();
}

// Extract data
$property_id = 1; // Your property ID
$booking_reference = 'BK' . time() . rand(100, 999);//unique number generate korar jonno
$check_in_date = $data['checkInDate'];

if(strtotime($check_in_date) < strtotime('today'))
{
    echo json_encode([
        'success' => false,
        'error' => 'Check-in date cannot be in the past.'
    ]);
    exit();
}
$check_out_date = $data['checkOutDate'];
$guests = intval($data['guests']);
$nights = intval($data['nights']);
$total_price = floatval($data['totalPrice']);
if($total_price <= 0)
{
    echo json_encode([
        'success' => false,
        'error' => 'Total price cannot be negative.'
    ]);
    exit();
}
$status = 'confirmed';

// Insert into database

//Safe from SQL Injection er jonno prepared statement use kora hocche
$stmt = $conn->prepare("
    INSERT INTO bookings (
        booking_reference, property_id, user_id,check_in_date, check_out_date, guests, nights, 
        total_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

//
$stmt->bind_param(
    "siissiids",  // s=string, i=integer, d=double
    $booking_reference, $property_id, $user_id,$check_in_date, $check_out_date, $guests, $nights,$total_price, $status
);

if($stmt->execute()) 
{
    echo json_encode([
        'success' => true,
        'booking_id' => $stmt->insert_id,
        'booking_reference' => $booking_reference,
        'message' => 'Booking confirmed successfully!'
    ]);
}
else 
{
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>