<?php

require '../data/setup.php';

$resource = $_GET['endpoint'];
$json_string = $_GET['json_string'];
                                                                                                   
$ch = curl_init(); 

// set url 
curl_setopt($ch, CURLOPT_URL, $ENDPOINT . $resource);                                                                      
curl_setopt($ch, CURLOPT_POST, 1);                                                                     
curl_setopt($ch, CURLOPT_POSTFIELDS, $json_string);                                                                  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: ' . "Bearer " . $API_TOKEN, 'Content-Type: application/json', 'Content-Length: ' . strlen($json_string)));                                                                                                                  
$output = curl_exec($ch);
echo $output . $json_string;

// close curl resource to free up system resources 
curl_close($ch);
?>