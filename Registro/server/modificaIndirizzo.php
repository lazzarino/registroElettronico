<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    checkSession();
    if(!isset($_REQUEST["citta"]))
    {
        http_response_code(400);
        die("Parametro citta mancante");
    }
    if(!isset($_REQUEST["indirizzo"]))
    {
        http_response_code(400);
        die("Paramtro indirizzo mancante");
    }
    $citta=$connection->real_escape_string($_REQUEST["citta"])
    $indirizzo=$_REQUEST["indirizzo"]

    $connection=openConnection("registro");
    $sql="UPDATE studenti SET residenza=$citta, indirizzo='".$indirizzo."' WHERE matricola=$_SESSION['matricola']";
    $data=eseguiQuery($connection,$sql);
    http_response_code(200);
    echo(json_encode($data));

    $connection->close();
?>