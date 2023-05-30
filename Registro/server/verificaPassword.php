<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    if(!isset($_REQUEST["password"]))
    {
        http_response_code(400);
        die("Parametro mancante password");
    }
    $connection=openConnection("registro");
    $sql="SELECT * FROM studenti WHERE pass='".$_REQUEST["password"]."'";
    $data=eseguiQuery($connection,$sql);
    if(count($data)==0)
    {
        http_response_code(403);
        die("Password non esistente");
    }
    else
    {
        http_response_code(200);
        echo(json_encode($data));
    }
    $connection->close();
?>