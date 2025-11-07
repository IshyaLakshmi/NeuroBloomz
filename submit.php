<?php
// submit.php
// Lightweight form handler using PHP mail()
// Sends contact form submissions to neurobloomz@outlook.com and ishyadinesh@outlook.com

$recipients = 'neurobloomz@outlook.com,ishyadinesh@outlook.com';

// Basic header-injection prevention
function sanitize_header_field($value) {
    return preg_replace("/\r|\n|%0A|%0D/", ' ', trim($value));
}

// Read POST values
$name_raw = isset($_POST['user_name']) ? $_POST['user_name'] : '';
$email_raw = isset($_POST['user_email']) ? $_POST['user_email'] : '';
$message_raw = isset($_POST['user_message']) ? $_POST['user_message'] : '';

$name = trim($name_raw);
$email = trim($email_raw);
$message = trim($message_raw);

// Basic validation
if (empty($message)) {
    header('Location: contact.html?sent=0&error=empty_message');
    exit;
}

// sanitize
$from_name = sanitize_header_field($name ?: 'Website visitor');
$from_email = filter_var($email, FILTER_SANITIZE_EMAIL);

if ($from_email && !filter_var($from_email, FILTER_VALIDATE_EMAIL)) {
    header('Location: contact.html?sent=0&error=invalid_email');
    exit;
}

$subject = 'Website contact form submission' . ($from_name ? " from {$from_name}" : '');

$body_lines = [];
$body_lines[] = "Name: " . ($name ?: '(not provided)');
$body_lines[] = "Email: " . ($email ?: '(not provided)');
$body_lines[] = "-----";
$body_lines[] = strip_tags($message);
$body_lines[] = "-----";
$body_lines[] = "Page: " . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '');
$body_lines[] = "Sent: " . date('Y-m-d H:i:s T');

$body = implode("\r\n", $body_lines);

$from_header_email = $from_email ?: 'no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost');
$from_header_name = $from_name;

$from_header_email = sanitize_header_field($from_header_email);
$from_header_name = sanitize_header_field($from_header_name);

$headers = [];
$headers[] = "From: {$from_header_name} <{$from_header_email}>";
$headers[] = "Reply-To: {$from_header_email}";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers_str = implode("\r\n", $headers);

$success = mail($recipients, $subject, $body, $headers_str);

if ($success) {
    header('Location: thank-you.html?sent=1');
    exit;
} else {
    header('Location: contact.html?sent=0&error=mail_failed');
    exit;
}
?>
