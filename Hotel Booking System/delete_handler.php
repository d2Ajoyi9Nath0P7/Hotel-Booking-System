<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) 
{
    echo json_encode(['success' => false, 'message' => 'Unauthorized access!']);
    exit;
}

require_once 'db.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$action = $input['action'] ?? '';
$id = $input['id'] ?? 0;

$success = false;//check deletion status,first e delete kora hoi nai bole false
$message = '';

try 
{
    if (!$id) 
    {
        $message = 'Missing id parameter';
    } 
    else if ($action === 'delete_user')
    {
        $conn->begin_transaction();
        try
        {
            $stmt1 = $conn->prepare("DELETE FROM bookings WHERE user_id = ?");
            $stmt1->bind_param("i", $id);
            $stmt1->execute();

            $stmt2 = $conn->prepare("DELETE FROM users WHERE id = ?");
            $stmt2->bind_param("i", $id);


            if ($stmt2->execute()) 
            {
                if ($stmt2->affected_rows > 0) 
                {
                    $conn->commit(); //
                    $success = true;
                    $message = 'User and their related bookings deleted successfully';
                }
                else 
                {
                    $conn->rollback();
                    $message = 'No user found with that id';
                }
            }
            else {
                throw new Exception($stmt2->error);
            }
        }

        catch (Exception $e) 
        {
            $conn->rollback();
            $message = "Database error: " . $e->getMessage();
            error_log($message);
        }
    }
    else if ($action === 'delete_booking')
    {
        $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) 
        {
            if ($stmt->affected_rows > 0) 
            {
                $success = true;
                $message = 'Booking deleted';
            }
            else 
            {
                $message = 'No booking found with that id';
            }
        } 
        else
        {
            $message = "Database error (delete_booking): " . $stmt->error;
            error_log($message);
        }

    } 
    else if ($action === 'delete_property') 
    {
        // If you want to delete property and related bookings, do it in a transaction
        $conn->begin_transaction();
        try {
            $stmt = $conn->prepare("DELETE FROM properties WHERE id = ?");
            $stmt->bind_param("i", $id);
            if (!$stmt->execute()) {
                throw new Exception('Failed to delete property: ' . $stmt->error);
            }

            // Optionally remove bookings tied to this property (if your schema uses property_id)
            $stmt2 = $conn->prepare("DELETE FROM bookings WHERE property_id = ?");
            $stmt2->bind_param("i", $id);
            if (!$stmt2->execute()) 
            {
                throw new Exception('Failed to delete related bookings: ' . $stmt2->error);
            }

            // Check affected rows
            if ($stmt->affected_rows === 0 && $stmt2->affected_rows === 0) {
                // neither property nor bookings found
                $conn->rollback();
                $message = 'No property (or related bookings) found with that id';
            }
            else 
            {
                $conn->commit();
                $success = true;
                $message = 'Property and related bookings deleted';
            }
        } 
        catch (Exception $ex) 
        {
            $conn->rollback();
            $message = 'Database error (delete_property): ' . $ex->getMessage();
            error_log($message);
        }

    } 
    else {
        $message = 'Unknown action';
    }

} 
catch (Exception $e) 
{
    $success = false;
    $message = "Error: " . $e->getMessage();
    error_log($message);
}

echo json_encode(['success' => $success, 'message' => $message]);
$conn->close();

?>