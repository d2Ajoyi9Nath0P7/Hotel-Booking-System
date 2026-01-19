<?php
header('Content-Type: application/json');
ini_set('session.gc_maxlifetime', 36000);
session_set_cookie_params(36000);
session_start();

// Require admin session
if(!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

include '../db.php'; // uses $conn

$input = json_decode(file_get_contents('php://input'), true);
if(!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

// Basic required field
if(!isset($input['title']) || trim($input['title']) === '') {
    echo json_encode(['success' => false, 'message' => 'Title is required']);
    exit();
}

// Normalize inputs and defaults
$title = trim($input['title']);
$description = isset($input['description']) ? $input['description'] : null;
$price = isset($input['price']) ? floatval($input['price']) : 0.0;
$location = isset($input['location']) ? $input['location'] : null;
$city = isset($input['city']) ? $input['city'] : null;
$country = isset($input['country']) ? $input['country'] : null;
$property_type = isset($input['property_type']) ? $input['property_type'] : null;
$bedrooms = isset($input['bedrooms']) ? intval($input['bedrooms']) : 0;
$bathrooms = isset($input['bathrooms']) ? floatval($input['bathrooms']) : 0.0;
$max_guests = isset($input['max_guests']) ? intval($input['max_guests']) : 1;
$status = isset($input['status']) ? $input['status'] : 'inactive';
$featured = isset($input['featured']) && ($input['featured'] == true || $input['featured'] == 1) ? 1 : 0;
$latitude = isset($input['latitude']) && $input['latitude'] !== '' ? floatval($input['latitude']) : NULL;
$longitude = isset($input['longitude']) && $input['longitude'] !== '' ? floatval($input['longitude']) : NULL;

// images/amenities: accept array or newline-separated string
$images = null;
if (isset($input['images'])) {
    if (is_array($input['images'])) $images = json_encode(array_values($input['images']));
    elseif (is_string($input['images'])) {
        $lines = array_filter(array_map('trim', explode("\n", $input['images'])));
        $images = json_encode(array_values($lines));
    }
}
$amenities = null;
if (isset($input['amenities'])) {
    if (is_array($input['amenities'])) $amenities = json_encode(array_values($input['amenities']));
    elseif (is_string($input['amenities'])) {
        $lines = array_filter(array_map('trim', explode("\n", $input['amenities'])));
        $amenities = json_encode(array_values($lines));
    }
}

// Use prepared statement for safety
$stmt = $conn->prepare("INSERT INTO properties (title, description, price, location, city, country, property_type, bedrooms, bathrooms, max_guests, status, featured, latitude, longitude, images, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param('ssdssssiddsisdds', $title, $description, $price, $location, $city, $country, $property_type, $bedrooms, $bathrooms, $max_guests, $status, $featured, $latitude, $longitude, $images, $amenities);

if ($stmt->execute()) {
    $insertedId = $stmt->insert_id;
    // Fetch inserted row to return normalized data
    $stmt->close();

    $q = $conn->prepare("SELECT * FROM properties WHERE id = ? LIMIT 1");
    $q->bind_param('i', $insertedId);
    $q->execute();
    $res = $q->get_result();
    $row = $res->fetch_assoc();
    $q->close();

    // Normalize images/amenities
    $row['images'] = isset($row['images']) && $row['images'] !== null && $row['images'] !== '' ? json_decode($row['images'], true) : [];
    $row['amenities'] = isset($row['amenities']) && $row['amenities'] !== null && $row['amenities'] !== '' ? json_decode($row['amenities'], true) : [];

    echo json_encode(['success' => true, 'id' => $insertedId, 'data' => $row]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
    $stmt->close();
}

$conn->close();
?>