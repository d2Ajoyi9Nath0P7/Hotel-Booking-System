<?php
header('Content-Type: application/json');
ini_set('session.gc_maxlifetime', 36000);
session_set_cookie_params(36000);
session_start();

if(!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit();
}

include '../db.php'; // admin DB connection

$input = json_decode(file_get_contents('php://input'), true);
if(!$input) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit();
}

$required = ['user_id','property_id','check_in_date','check_out_date','guests'];
foreach($required as $r) {
    if(!isset($input[$r]) || $input[$r] === '') {
        echo json_encode(['success' => false, 'error' => 'Missing field: ' . $r]);
        exit();
    }
}

$user_id = intval($input['user_id']);
$property_id = intval($input['property_id']);
$check_in = $input['check_in_date'];
$check_out = $input['check_out_date'];
$guests = intval($input['guests']);

if(strtotime($check_in) < strtotime('today')) {
    echo json_encode(['success' => false, 'error' => 'Check-in date cannot be in the past.']);
    exit();
}

if(strtotime($check_out) <= strtotime($check_in)) {
    echo json_encode(['success' => false, 'error' => 'Check-out must be after check-in.']);
    exit();
}

// Fetch property price
$stmt = $conn->prepare("SELECT price FROM properties WHERE id = ? LIMIT 1");
$stmt->bind_param('i', $property_id);
$stmt->execute();
$res = $stmt->get_result();
$property = $res->fetch_assoc();
$stmt->close();

if(!$property) {
    echo json_encode(['success' => false, 'error' => 'Property not found']);
    exit();
}

$price = floatval($property['price']);
$nights = intval((strtotime($check_out) - strtotime($check_in)) / (60*60*24));
if($nights <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid date range']);
    exit();
}

$total_price = $price * $nights;
if($total_price <= 0) {
    echo json_encode(['success' => false, 'error' => 'Calculated total price invalid']);
    exit();
}

$booking_reference = 'ADM' . time() . rand(100, 999);
$status = isset($input['status']) ? $input['status'] : 'confirmed';

// Insert booking
$stmt = $conn->prepare("INSERT INTO bookings (booking_reference, property_id, user_id, check_in_date, check_out_date, guests, nights, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param('siissiids', $booking_reference, $property_id, $user_id, $check_in, $check_out, $guests, $nights, $total_price, $status);

if($stmt->execute()) {
    echo json_encode(['success' => true, 'booking_id' => $stmt->insert_id, 'booking_reference' => $booking_reference]);
} else {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>