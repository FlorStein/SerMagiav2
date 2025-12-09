<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['nombre'], $data['email'], $data['mensaje'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$nombre = htmlspecialchars($data['nombre']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$asunto = htmlspecialchars($data['asunto'] ?? 'Consulta desde la web');
$mensaje = htmlspecialchars($data['mensaje']);

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

$to = 'sermagia.tarot@gmail.com';
$subject = "Nuevo mensaje: " . $asunto;
$body = "Nombre: $nombre\nEmail: $email\nAsunto: $asunto\n\nMensaje:\n$mensaje";
$headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email enviado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>
