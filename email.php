<?php

$error = false;

//Get the from field, sanitize, and validate

if(!empty($_POST["guestemail"])){

  $fromField = $_POST["guestemail"];
  $fromSanitized = filter_var($fromField, FILTER_SANITIZE_EMAIL);

  if(!filter_var($fromSanitized, FILTER_VALIDATE_EMAIL))
    $error = true;

}
else
  $error = true;

//Get the subject
$subject = "Email from ".$_POST["guestname"];

//Get the message body
if(!empty($_POST["guestmessage"]))
  $body      = $_POST["guestmessage"];
else
  $error = true;

//Redirect based on whether there was an error
if($error){

  echo "Looks like something was wrong with one of your inputs?";

  exit;
}
else{

  $headers = "From: ".$fromField;

  $toField = "chrismgaeta@gmail.com";

  if(!mail($toField, $subject, $body, $headers))
    echo "Sorry, I couldn't send your email to Chris... Try again later?";

  else
    echo "Thanks for the email! Chris will get back to you soon.";

  exit;

}

?>
