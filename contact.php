<?php
// Set content type to JSON for API-like responses
header('Content-Type: application/json');

// Allow CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get and validate input
    $name = isset($_POST["name"]) ? htmlspecialchars(trim($_POST["name"])) : '';
    $email = isset($_POST["email"]) ? htmlspecialchars(trim($_POST["email"])) : '';
    $subject = isset($_POST["subject"]) ? htmlspecialchars(trim($_POST["subject"])) : '';
    $message = isset($_POST["message"]) ? htmlspecialchars(trim($_POST["message"])) : '';

    // Enhanced validation
    $errors = [];

    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Name must be at least 2 characters long';
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please provide a valid email address';
    }

    if (empty($subject) || strlen($subject) < 5) {
        $errors[] = 'Subject must be at least 5 characters long';
    }

    if (empty($message) || strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => 'Validation failed', 'details' => $errors]);
        exit();
    }

    // Email configuration
    $to = "owshomarketplace@gmail.com";
    $email_subject = "New Contact Form Message: " . $subject;

    // Create professional email message
    $email_body = "<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0871bd, #fba208); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #0871bd; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🚀 New Message from Owsho Website</h2>
        </div>
        <div class='content'>
            <div class='info-box'>
                <h3>📧 Contact Information</h3>
                <p><strong>Name:</strong> {$name}</p>
                <p><strong>Email:</strong> {$email}</p>
                <p><strong>Subject:</strong> {$subject}</p>
            </div>
            <div class='info-box'>
                <h3>💬 Message</h3>
                <p>{$message}</p>
            </div>
            <div class='info-box'>
                <h3>📝 Additional Details</h3>
                <p><strong>Received:</strong> " . date('Y-m-d H:i:s') . "</p>
                <p><strong>IP Address:</strong> " . $_SERVER['REMOTE_ADDR'] . "</p>
                <p><strong>User Agent:</strong> " . $_SERVER['HTTP_USER_AGENT'] . "</p>
            </div>
        </div>
        <div class='footer'>
            <p>This message was sent from the Owsho Marketplace contact form.</p>
        </div>
    </div>
</body>
</html>";

    // Email headers for HTML
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Owsho Website <noreply@owsho.com>\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Attempt to send email
    $mail_sent = mail($to, $email_subject, $email_body, $headers);

    if ($mail_sent) {
        // Log successful submission (optional)
        error_log("Contact form submitted successfully from: $email");
        
        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your message! We\'ll get back to you within 24 hours.'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }

} catch (Exception $e) {
    // Log error
    error_log("Contact form error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Sorry, there was an error sending your message. Please try again later or contact us directly at owshomarketplace@gmail.com'
    ]);
}
?>