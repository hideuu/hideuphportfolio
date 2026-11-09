<?php
// Send contact messages through Resend.
// Return JSON for fetch requests or redirect normal form submissions.

declare(strict_types=1);

// Keep PHP errors out of JSON responses and public output.
ini_set('display_errors', '0');

// Use local configuration when present; otherwise read deployment variables.
$config = file_exists(__DIR__ . '/config.php')
    ? require __DIR__ . '/config.php'
    : [
        'resend_api_key' => getenv('RESEND_API_KEY') ?: '',
        'to_email'       => getenv('CONTACT_TO_EMAIL') ?: 'andyhamon2005@gmail.com',
        'from_email'     => getenv('CONTACT_FROM_EMAIL') ?: 'Portfolio <onboarding@resend.dev>',
    ];

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, string $message, int $status = 200): void
{
    global $wantsJson;

    if ($wantsJson) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode(['success' => $ok, 'message' => $message]);
    } else {
        header('Location: ../contact.html?status=' . ($ok ? 'sent' : 'error'));
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

if ($config['resend_api_key'] === '') {
    error_log('RESEND_API_KEY is not set.');
    respond(false, 'The contact form is not set up yet. Please email me directly.', 500);
}

// Treat a filled honeypot as spam without revealing the check.
if (!empty($_POST['botcheck'])) {
    respond(true, "Message sent. I'll reply soon.");
}

// Limit successful submissions to one per session every 60 seconds.
session_start();
if (isset($_SESSION['last_sent']) && time() - $_SESSION['last_sent'] < 60) {
    respond(false, 'Please wait a minute before sending another message.', 429);
}

$name    = trim((string) ($_POST['name'] ?? ''));
$email   = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    respond(false, 'Please fill in all fields.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 422);
}
if (mb_strlen($name) > 100 || mb_strlen($message) > 5000) {
    respond(false, 'Your message is too long.', 422);
}

// Escape submitted text before inserting it into the HTML email.
$safeName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
$sentAt      = (new DateTime('now', new DateTimeZone('Asia/Manila')))->format('F j, Y g:i A');

$html = <<<HTML
<div style="font-family: Arial, sans-serif; font-size: 15px; color: #0a0a0a;">
    <h2 style="margin: 0 0 16px;">New message from your portfolio</h2>
    <p><strong>Name:</strong> {$safeName}</p>
    <p><strong>Email:</strong> {$safeEmail}</p>
    <p><strong>Sent:</strong> {$sentAt} (Manila)</p>
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;">
    <p>{$safeMessage}</p>
</div>
HTML;

$payload = [
    'from'     => $config['from_email'],
    'to'       => [$config['to_email']],
    'reply_to' => $email,  // Route replies to the sender.
    'subject'  => "Portfolio message from {$name}",
    'html'     => $html,
    'text'     => "Name: {$name}\nEmail: {$email}\nSent: {$sentAt} (Manila)\n\n{$message}",
];

$curl = curl_init('https://api.resend.com/emails');
curl_setopt_array($curl, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $config['resend_api_key'],
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS     => json_encode($payload),
]);

$response = curl_exec($curl);
$status   = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curlError = curl_error($curl);
curl_close($curl);

if ($response === false || $status < 200 || $status >= 300) {
    // Keep provider error details in server logs.
    error_log('Resend error (' . $status . '): ' . ($curlError ?: $response));
    respond(false, 'Something went wrong. Please try again or email me directly.', 502);
}

$_SESSION['last_sent'] = time();
respond(true, "Message sent. I'll reply soon.");