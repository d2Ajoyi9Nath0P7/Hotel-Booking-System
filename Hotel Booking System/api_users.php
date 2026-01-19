<?php
// api_users.php - Fetch users from database for admin dashboard
ini_set('session.gc_maxlifetime', 36000);
session_set_cookie_params(36000);
session_start();

include 'db.php';


if(!isset($_SESSION['admin_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized access'
    ]);
    exit();
}

// Helper: ensure role/status columns exist (if running on MySQL 8+, ADD COLUMN IF NOT EXISTS works)
function ensure_user_role_status_columns($conn) {
    // Check if 'role' column exists
    $res = $conn->query("SHOW COLUMNS FROM users LIKE 'role'");
    $hasRole = ($res && $res->num_rows > 0);
    $res2 = $conn->query("SHOW COLUMNS FROM users LIKE 'status'");
    $hasStatus = ($res2 && $res2->num_rows > 0);

    if (!$hasRole || !$hasStatus) {
        // Try to add columns safely
        $alterSql = "";
        if (!$hasRole) $alterSql .= " ADD COLUMN role VARCHAR(50) DEFAULT 'user'";
        if (!$hasStatus) $alterSql .= ($alterSql ? ',' : '') . " ADD COLUMN status VARCHAR(50) DEFAULT 'active'";
        if ($alterSql) {
            $sql = "ALTER TABLE users" . $alterSql;
            $conn->query($sql); // ignore failure, optional
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update user
    // Parse body
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $role = isset($input['role']) ? $input['role'] : null;
    $status = isset($input['status']) ? $input['status'] : null;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'User id is required']);
        $conn->close();
        exit();
    }

    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        $conn->close();
        exit();
    }

    // Check duplicate email excluding this user
    if ($email !== '') {
        $check = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1");
        $check->bind_param('si', $email, $id);
        $check->execute();
        $check->store_result();
        if ($check->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Email already used by another account']);
            $check->close();
            $conn->close();
            exit();
        }
        $check->close();
    }

    // Ensure role/status columns exist if updating them
    if ($role !== null || $status !== null) {
        ensure_user_role_status_columns($conn);
    }

    // Build update query dynamically
    $fields = [];
    $types = '';
    $values = [];

    if ($name !== '') { $fields[] = 'name = ?'; $types .= 's'; $values[] = $name; }
    if ($email !== '') { $fields[] = 'email = ?'; $types .= 's'; $values[] = $email; }
    if ($role !== null) { $fields[] = 'role = ?'; $types .= 's'; $values[] = $role; }
    if ($status !== null) { $fields[] = 'status = ?'; $types .= 's'; $values[] = $status; }

    if (empty($fields)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        $conn->close();
        exit();
    }

    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
    $types .= 'i';
    $values[] = $id;

    $stmt = $conn->prepare($sql);
    $bind_names[] = $types;
    // bind params dynamically
    for ($i = 0; $i < count($values); $i++) {
        $bind_name = 'bind' . $i;
        $$bind_name = $values[$i];
        $bind_names[] = &$$bind_name;
    }
    call_user_func_array([$stmt, 'bind_param'], $bind_names);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'User updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'No changes made or user not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create a new user (admin action)
    $input = json_decode(file_get_contents('php://input'), true);
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $role = isset($input['role']) ? $input['role'] : 'user';
    $status = isset($input['status']) ? $input['status'] : 'active';

    if ($name === '' || $email === '') {
        echo json_encode(['success' => false, 'message' => 'Name and email are required']);
        $conn->close();
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        $conn->close();
        exit();
    }

    // Check for duplicate email
    $check = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $check->bind_param('s', $email);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        $check->close();
        $conn->close();
        exit();
    }
    $check->close();

    // Make a temporary password for the user (admin can reset later)
    try {
        $tempPass = bin2hex(random_bytes(4));
    } catch (Exception $e) {
        $tempPass = 'changeme';
    }
    $hash = password_hash($tempPass, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $name, $email, $hash);

    if ($stmt->execute()) {
        $id = $stmt->insert_id;
        echo json_encode(['success' => true, 'message' => 'User created', 'id' => $id, 'temp_password' => $tempPass]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Insert failed: ' . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
    exit();
}

// If id provided, return single user
if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    // Check if role/status columns exist
    $res = $conn->query("SHOW COLUMNS FROM users LIKE 'role'");
    $hasRole = ($res && $res->num_rows > 0);
    $res2 = $conn->query("SHOW COLUMNS FROM users LIKE 'status'");
    $hasStatus = ($res2 && $res2->num_rows > 0);

    $fields = 'ID, NAME, EMAIL, CREATE_AT';
    if ($hasRole) $fields .= ', role';
    if ($hasStatus) $fields .= ', status';

    $stmt = $conn->prepare("SELECT $fields FROM users WHERE ID = ? LIMIT 1");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        $stmt->close();
        $conn->close();
        exit();
    }

    $user = [
        'id' => $row['ID'],
        'name' => $row['NAME'],
        'email' => $row['EMAIL'],
        'role' => $hasRole ? $row['role'] : 'User',
        'status' => $hasStatus ? $row['status'] : 'active',
        'joinDate' => $row['CREATE_AT']
    ];

    echo json_encode(['success' => true, 'data' => $user]);
    $stmt->close();
    $conn->close();
    exit();
}

// Default: return users list
$query = "
          SELECT ID, NAME, EMAIL, CREATE_AT 
          FROM users 
          ORDER BY CREATE_AT DESC
          ";
$result = $conn->query($query);

if(!$result) 
{
    echo json_encode([
        'success' => false,
        'message' => 'Database query failed: ' . $conn->error
    ]);
    exit();
}

$users = [];

while($row = $result->fetch_assoc()) 
{
    $users[] = [
        'id' => $row['ID'],
        'name' => $row['NAME'],
        'email' => $row['EMAIL'],
        'role' => 'User', // Default role since your table doesn't have a role column
        'status' => 'active', // Default status since your table doesn't have a status column
        'joinDate' => $row['CREATE_AT']
    ];
}

echo json_encode([
    'success' => true,
    'data' => $users,
    'count' => count($users)
]);

$conn->close();
?>