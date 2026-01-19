<?php
    session_start();
    header('Content-Type: application/json');

    if(!isset($_SESSION['admin_id']))
        {
            echo json_encode(['success' => false, 'message' => 'Unauthorized access!']);
            exit;
        }

        require_once '../db.php';
        $inputJSON = file_get_contents('php://input');//packet khule 
        $input = json_decode($inputJSON, true);
        $id = $input['id'] ?? 0;

        // এটি যোগ করে Network Tab এর Response চেক করুন
       // echo json_encode(['debug_received_id' => $id]);

        if (!$id) 
        {
            echo json_encode(['success' => false, 'message' => 'Invalid booking ID']);
            exit;
        }

        try 
        {
        // ৩. SQL কুয়েরি রান করা (Prepared Statement ব্যবহার করে)
            $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
            $stmt->bind_param("i", $id);

            if ($stmt->execute()) 
            {
                if ($stmt->affected_rows > 0) 
                {
                    echo json_encode(['success' => true, 'message' => 'Booking deleted successfully']);
                }
                else 
                {
                    echo json_encode(['success' => false, 'message' => 'No booking found with this ID']);
                }
            } 
            else 
            {
                throw new Exception($stmt->error);
            }
        }

        catch (Exception $e) 
        {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }


        $conn->close();
?>