<?php
    header("content-type:application/json; charset=utf-8");
	require("PHPMailer.php");
	require("SMTP.php");
	require("environment.php");
    if(isset($_REQUEST["email"]))
	{
		$indirizzo = $_REQUEST["email"];
	}
	else
	{
		http_response_code(400);
		die("Parametro mancante email");
	}
    $newPassword = rand(10000000, 99999999);
    echo(json_encode($newPassword));

    $mailer = new PHPMailer\PHPMailer\PHPMailer();
    $mailer->IsSMTP();
    $mailer->SMTPDebug = 1;
    $mailer->Host = "smtp.gmail.com";
	$mailer->SMTPSecure = "tls";
	$mailer->Port = 587;
    $mailer->SMTPAuth = true;
	$mailer->Username = MAIL_ADDRESS;
	$mailer->Password = MAIL_PASSWORD;
    $mailer->setFrom(MAIL_ADDRESS);
	$mailer->addAddress($indirizzo);

    $mailer->Subject = "Nuova password";
	$fileName = "../message.html";
    $fh = fopen($fileName, "r");
	$body = "Questa è la nuova password: <b>$newPassword</b>";

    if($fh)
	{
		$body = fread($fh, filesize($fileName));
		// Vai dentro $body, cerchi __password e lo sostituisci con $newPassword creando una nuova stringa che vai ad assegnare a $body
		$body = str_replace("__password", $newPassword, $body);
		fclose($fh);
	}
    $mailer->Body = $body;
	$mailer->isHTML(true);
    if($mailer->send())
	{
		http_response_code(200);
		echo(json_encode("Mail inviata"));
	}
    else
	{
		http_response_code(550);
		echo(json_encode("Errore invio mail " . $mailer->ErrorInfo));
	}
?>