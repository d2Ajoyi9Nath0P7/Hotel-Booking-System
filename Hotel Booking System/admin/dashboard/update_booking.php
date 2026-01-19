<?php
header('Content-Type: application/json');
require_once 'db_connection.php'; // আপনার ডাটাবেস কানেকশন ফাইল

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['action']) && $data['action'] === 'update_booking') 
{
    $id = $data['id'];
    // ফর্মে যে নামগুলো থাকবে সেগুলো এখানে ধরুন
    $customer_name = $data['customer_name'];
    $car_id = $data['car_id'];
    $status = $data['status'];

    // SQL Query (Prepared Statement ব্যবহার করা নিরাপদ)
    $sql = "UPDATE bookings SET customer_name = ?, car_id = ?, status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->execute([$customer_name, $car_id, $status, $id])) {
        echo json_encode(['success' => true, 'message' => 'Booking updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database update failed']);
    }
}
else {
    echo json_encode(['success' => false, 'message' => 'Invalid Request']);
}
?>