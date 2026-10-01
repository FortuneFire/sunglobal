<?php

header('Content-Type: application/json; charset=utf-8');

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

$hubspotServiceKey = getenv('HUBSPOT_SERVICE_KEY');

$hubspotInterestProperty = 'sunglobal_interest';
$hubspotMessageProperty  = 'sunglobal_enquiry';
$hubspotConsentProperty  = 'sunglobal_consent';

/*
|--------------------------------------------------------------------------
| Helper: JSON response
|--------------------------------------------------------------------------
*/

function respond(int $statusCode, bool $success, string $message): void
{
    http_response_code($statusCode);

    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Basic request validation
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Method not allowed.');
}

/*
|--------------------------------------------------------------------------
| Environment validation
|--------------------------------------------------------------------------
*/

if (!$hubspotServiceKey) {
    error_log('Sun Global form error: HUBSPOT_SERVICE_KEY is not configured.');

    respond(
        500,
        false,
        'The form is currently unavailable. Please contact us directly.'
    );
}

/*
|--------------------------------------------------------------------------
| Honeypot spam protection
|--------------------------------------------------------------------------
|
| This field should remain empty for normal users.
|
*/

$honeypot = trim($_POST['website'] ?? '');

if ($honeypot !== '') {
    respond(400, false, 'Unable to process your request.');
}

/*
|--------------------------------------------------------------------------
| Get form values
|--------------------------------------------------------------------------
*/

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$interest = trim($_POST['interest'] ?? '');
$message = trim($_POST['message'] ?? '');
$consent = trim($_POST['consent'] ?? '');

/*
|--------------------------------------------------------------------------
| Validate required fields
|--------------------------------------------------------------------------
*/

if ($name === '') {
    respond(422, false, 'Please enter your full name.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Please enter a valid email address.');
}

if ($phone === '') {
    respond(422, false, 'Please enter your phone number.');
}

$allowedInterests = [
    'Protection & Insurance',
    'Investments',
    'Retirement Planning',
    'Structured Investments',
    'Portfolio Review',
    'General Enquiry'
];

if (!in_array($interest, $allowedInterests, true)) {
    respond(422, false, 'Please select a valid enquiry type.');
}

if ($consent !== 'yes') {
    respond(422, false, 'Please confirm that you agree to be contacted.');
}

/*
|--------------------------------------------------------------------------
| Split name
|--------------------------------------------------------------------------
*/

$nameParts = preg_split('/\s+/', $name);

$firstName = $nameParts[0] ?? '';

$lastName = '';

if (count($nameParts) > 1) {
    $lastName = implode(' ', array_slice($nameParts, 1));
}

/*
|--------------------------------------------------------------------------
| HubSpot contact properties
|--------------------------------------------------------------------------
*/

$properties = [
    'firstname' => $firstName,
    'lastname' => $lastName,
    'email' => $email,
    'phone' => $phone,

    $hubspotInterestProperty => $interest,
    $hubspotMessageProperty => $message,
    $hubspotConsentProperty => 'yes'
];

/*
|--------------------------------------------------------------------------
| HubSpot API request
|--------------------------------------------------------------------------
*/

$requestBody = [
    'inputs' => [
        [
            'properties' => $properties,
            'id' => $email,
            'idProperty' => 'email'
        ]
    ]
];

$ch = curl_init(
    'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert'
);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,

    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $hubspotServiceKey,
        'Content-Type: application/json',
        'Accept: application/json'
    ],

    CURLOPT_POSTFIELDS => json_encode($requestBody),

    CURLOPT_TIMEOUT => 15,
    CURLOPT_CONNECTTIMEOUT => 10
]);

$response = curl_exec($ch);

$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

/*
|--------------------------------------------------------------------------
| Handle connection errors
|--------------------------------------------------------------------------
*/

if ($response === false) {
    error_log(
        'Sun Global HubSpot connection error: ' . $curlError
    );

    respond(
        500,
        false,
        'We could not connect to our enquiry system. Please try again.'
    );
}

/*
|--------------------------------------------------------------------------
| Decode HubSpot response
|--------------------------------------------------------------------------
*/

$responseData = json_decode($response, true);

if ($httpCode < 200 || $httpCode >= 300) {

    error_log(
        'Sun Global HubSpot API error [' .
        $httpCode .
        ']: ' .
        $response
    );

    respond(
        500,
        false,
        'We could not submit your enquiry. Please try again.'
    );
}

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

respond(
    200,
    true,
    'Your consultation request has been received.'
);