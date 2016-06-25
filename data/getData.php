<?php

require '../data/setup.php';

$resource = $_GET['endpoint'];

$ch = curl_init(); 

// set url 
curl_setopt($ch, CURLOPT_URL, $ENDPOINT . $resource); 

//return the transfer as a string 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

$request_headers = array();
$request_headers[] = 'Authorization: ' . "Bearer " . $API_TOKEN; 
curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);

// $output contains the output string 
$output = curl_exec($ch);
$data = json_decode($output); 

//Return JSON to requesting page
echo $output;
// close curl resource to free up system resources 
curl_close($ch);

?>