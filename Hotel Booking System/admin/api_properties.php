<?php
// admin/api_properties.php
// Basic REST API for properties used by the admin dashboard

ini_set('session.gc_maxlifetime', 36000);
session_set_cookie_params(36000);
session_start();

header('Content-Type: application/json');

require_once 'db.php'; // uses $conn from admin/db.php

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit();
}

// Helper: send JSON and exit
function send_json($payload) {
    echo json_encode($payload);
    exit();
}

// Ensure properties table exists; if not, create with a reasonable schema
function ensure_properties_table($conn) {
    $check = $conn->query("SHOW TABLES LIKE 'properties'");
    if (!$check || $check->num_rows === 0) {
        $createSQL = "CREATE TABLE IF NOT EXISTS properties (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) DEFAULT 0,
            location VARCHAR(255) DEFAULT NULL,
            city VARCHAR(100) DEFAULT NULL,
            country VARCHAR(100) DEFAULT NULL,
            property_type VARCHAR(100) DEFAULT NULL,
            bedrooms INT DEFAULT 0,
            bathrooms FLOAT DEFAULT 0,
            max_guests INT DEFAULT 1,
            status VARCHAR(50) DEFAULT 'inactive',
            featured TINYINT(1) DEFAULT 0,
            latitude DOUBLE DEFAULT NULL,
            longitude DOUBLE DEFAULT NULL,
            images TEXT DEFAULT NULL,
            amenities TEXT DEFAULT NULL,
            rating FLOAT DEFAULT 0,
            review_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        if (!$conn->query($createSQL)) {
            return false;
        }
    }
    return true;
}

if (!ensure_properties_table($conn)) {
    send_json(["success" => false, "message" => "Failed to ensure properties table: " . $conn->error]);
}

// Normalize DB row to the shape dashboard.js expects
function normalize_property_row($row) {
    // Images and amenities stored as JSON text in DB
    $row['images'] = isset($row['images']) && $row['images'] !== null && $row['images'] !== '' ? json_decode($row['images'], true) : [];
    $row['amenities'] = isset($row['amenities']) && $row['amenities'] !== null && $row['amenities'] !== '' ? json_decode($row['amenities'], true) : [];
    $row['featured'] = isset($row['featured']) ? (bool)$row['featured'] : false;
    $row['price'] = isset($row['price']) ? (float)$row['price'] : 0;
    $row['bedrooms'] = isset($row['bedrooms']) ? (int)$row['bedrooms'] : 0;
    $row['bathrooms'] = isset($row['bathrooms']) ? (float)$row['bathrooms'] : 0;
    $row['max_guests'] = isset($row['max_guests']) ? (int)$row['max_guests'] : 1;
    $row['rating'] = isset($row['rating']) ? (float)$row['rating'] : 0;
    $row['review_count'] = isset($row['review_count']) ? (int)$row['review_count'] : 0;
    return $row;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $id = (int) $_GET['id'];
            $stmt = $conn->prepare("SELECT * FROM properties WHERE id = ? LIMIT 1");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $res = $stmt->get_result();
            $row = $res->fetch_assoc();
            if (!$row) {
                send_json(["success" => false, "message" => "Property not found"]);
            }
            $row = normalize_property_row($row);
            send_json(["success" => true, "data" => $row]);
        } else {
            $result = $conn->query("SELECT * FROM properties ORDER BY id DESC");
            if (!$result) {
                send_json(["success" => false, "message" => "DB query failed: " . $conn->error]);
            }
            $props = [];
            while ($r = $result->fetch_assoc()) {
                $props[] = normalize_property_row($r);
            }
            send_json(["success" => true, "data" => $props, "count" => count($props)]);
        }

    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['title']) || trim($input['title']) === '') {
            send_json(["success" => false, "message" => "Title is required"]);
        }

        $images = isset($input['images']) && is_array($input['images']) ? json_encode(array_values($input['images'])) : null;
        $amenities = isset($input['amenities']) && is_array($input['amenities']) ? json_encode(array_values($input['amenities'])) : null;
        $featured = isset($input['featured']) && $input['featured'] ? 1 : 0;

        $stmt = $conn->prepare("INSERT INTO properties (title, description, price, location, city, country, property_type, bedrooms, bathrooms, max_guests, status, featured, latitude, longitude, images, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $title = $input['title'];
        $description = isset($input['description']) ? $input['description'] : null;
        $price = isset($input['price']) ? (float)$input['price'] : 0;
        $location = isset($input['location']) ? $input['location'] : null;
        $city = isset($input['city']) ? $input['city'] : null;
        $country = isset($input['country']) ? $input['country'] : null;
        $ptype = isset($input['property_type']) ? $input['property_type'] : null;
        $bedrooms = isset($input['bedrooms']) ? (int)$input['bedrooms'] : 0;
        $bathrooms = isset($input['bathrooms']) ? (float)$input['bathrooms'] : 0;
        $max_guests = isset($input['max_guests']) ? (int)$input['max_guests'] : 1;
        $status = isset($input['status']) ? $input['status'] : 'inactive';
        $latitude = isset($input['latitude']) && $input['latitude'] !== null && $input['latitude'] !== '' ? (float)$input['latitude'] : null;
        $longitude = isset($input['longitude']) && $input['longitude'] !== null && $input['longitude'] !== '' ? (float)$input['longitude'] : null;

        $stmt->bind_param('ssdssssiddsisdds', $title, $description, $price, $location, $city, $country, $ptype, $bedrooms, $bathrooms, $max_guests, $status, $featured, $latitude, $longitude, $images, $amenities);

        if (!$stmt->execute()) {
            send_json(["success" => false, "message" => "Insert failed: " . $stmt->error]);
        }

        $insertedId = $stmt->insert_id;
        send_json(["success" => true, "message" => "Property created", "id" => $insertedId]);

    } elseif ($method === 'PUT') {
        // Expect JSON body with id
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['id'])) {
            send_json(["success" => false, "message" => "Property id is required"]);
        }
        $id = (int)$input['id'];

        // Build update dynamically
        $fields = [];
        $values = [];
        $types = '';

        $map = [
            'title' => 's', 'description' => 's', 'price' => 'd', 'location' => 's', 'city' => 's', 'country' => 's', 'property_type' => 's', 'bedrooms' => 'i', 'bathrooms' => 'd', 'max_guests' => 'i', 'status' => 's', 'featured' => 'i', 'latitude' => 'd', 'longitude' => 'd', 'images' => 's', 'amenities' => 's'
        ];

        foreach ($map as $k => $t) {
            if (isset($input[$k])) {
                $fields[] = "$k = ?";
                if (($k === 'images' || $k === 'amenities') && is_array($input[$k])) {
                    $values[] = json_encode(array_values($input[$k]));
                } elseif ($k === 'featured') {
                    $values[] = $input[$k] ? 1 : 0;
                } else {
                    $values[] = $input[$k];
                }
                $types .= $t;
            }
        }

        if (empty($fields)) {
            send_json(["success" => false, "message" => "No fields to update"]);
        }

        $sql = "UPDATE properties SET " . implode(', ', $fields) . " WHERE id = ?";
        $types .= 'i';
        $values[] = $id;

        $stmt = $conn->prepare($sql);
        $bind_names = [];
        $bind_names[] = $types;
        for ($i = 0; $i < count($values); $i++) {
            $bind_name = 'bind' . $i;
            $$bind_name = $values[$i];
            $bind_names[] = &$$bind_name;
        }
        call_user_func_array([$stmt, 'bind_param'], $bind_names);

        if (!$stmt->execute()) {
            send_json(["success" => false, "message" => "Update failed: " . $stmt->error]);
        }

        send_json(["success" => true, "message" => "Property updated"]);

    } elseif ($method === 'DELETE') {
        // Accept id param in query
        parse_str(file_get_contents("php://input"), $delVars);
        $id = isset($_GET['id']) ? (int)$_GET['id'] : (isset($delVars['id']) ? (int)$delVars['id'] : 0);
        if (!$id) {
            send_json(["success" => false, "message" => "Property id is required"]);
        }
        $stmt = $conn->prepare("DELETE FROM properties WHERE id = ?");
        $stmt->bind_param('i', $id);
        if (!$stmt->execute()) {
            send_json(["success" => false, "message" => "Delete failed: " . $stmt->error]);
        }
        send_json(["success" => true, "message" => "Property deleted"]);
    } else {
        send_json(["success" => false, "message" => "Unsupported method"]);
    }
} catch (Exception $e) {
    send_json(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>