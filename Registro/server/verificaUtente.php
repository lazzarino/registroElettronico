<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    if(!isset($_REQUEST["user"]))
    {
        http_response_code(400);
        die("Parametro mancante user");
    }
    $connection=openConnection("registro");
    $sql="SELECT * FROM studenti WHERE user='".$_REQUEST["user"]."'";
    $data=eseguiQuery($connection,$sql);
    if(count($data)==0)
    {
        http_response_code(403);
        die("User non trovato");
    }
    else
    {
        http_response_code(200);
        echo(json_encode($data));
    }
    $connection->close();
?>