<?php
    header('Content-Type: application/json');
    
    $conn = new mysqli("localhost", "root", "root", "bookingsystem");

    if ($conn->connect_error) {
        echo json_encode([]);
        exit();
    }

    $activities = array();

    try {
        // Get recent bookings (last 5)
        $bookingSql = "SELECT id, booking_reference, user_id, property_id, check_in_date, status, created_at 
                       FROM bookings 
                       ORDER BY created_at DESC 
                       LIMIT 3";
        $bookingResult = $conn->query($bookingSql);
        
        if ($bookingResult && $bookingResult->num_rows > 0) {
            while ($row = $bookingResult->fetch_assoc()) {
                $activities[] = array(
                    'type' => 'booking',
                    'title' => 'New Booking #' . ($row['booking_reference'] ?? $row['id']),
                    'description' => 'Booking created for property ID: ' . $row['property_id'],
                    'time' => getTimeAgo($row['created_at'])
                );
            }
        }

        // Get recent user registrations (last 5)
        $userSql = "SELECT id, name, email, created_at 
                    FROM users 
                    ORDER BY created_at DESC 
                    LIMIT 2";
        $userResult = $conn->query($userSql);
        
        if ($userResult && $userResult->num_rows > 0) {
            while ($row = $userResult->fetch_assoc()) {
                $activities[] = array(
                    'type' => 'user',
                    'title' => 'New User Registration',
                    'description' => $row['name'] . ' (' . $row['email'] . ') joined',
                    'time' => getTimeAgo($row['created_at'])
                );
            }
        }

        // Sort activities by time (newest first)
        usort($activities, function($a, $b) {
            return strcmp($b['time'], $a['time']);
        });

        // Limit to 5 most recent
        $activities = array_slice($activities, 0, 5);

    } catch (Exception $e) {
        // Return empty array on error
        $activities = array();
    }

    echo json_encode($activities);
    $conn->close();

    // Helper function to calculate time ago
    function getTimeAgo($datetime) {
        if (empty($datetime)) {
            return 'Just now';
        }

        $timestamp = strtotime($datetime);
        $currentTime = time();
        $diff = $currentTime - $timestamp;

        if ($diff < 60) {
            return 'Just now';
        } elseif ($diff < 3600) {
            $mins = floor($diff / 60);
            return $mins . ' minute' . ($mins > 1 ? 's' : '') . ' ago';
        } elseif ($diff < 86400) {
            $hours = floor($diff / 3600);
            return $hours . ' hour' . ($hours > 1 ? 's' : '') . ' ago';
        } elseif ($diff < 604800) {
            $days = floor($diff / 86400);
            return $days . ' day' . ($days > 1 ? 's' : '') . ' ago';
        } else {
            return date('M d, Y', $timestamp);
        }
    }
?>
