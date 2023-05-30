<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    if(!isset($_REQUEST["lun"]))
    {
        http_response_code(400);
        die("Parametro lun mancante");
    }
    if(!isset($_REQUEST["dom"]))
    {
        http_response_code(400);
        die("Paramerto dom mancante");
    }
    $connection=openConnection("registro");
    checkSession();
    $lun=$_REQUEST["lun"];
    $dom=$_REQUEST["dom"];
    
    $sql="SELECT a.id, a.data, m.materia, a.argomento FROM argomenti a, materie m WHERE classe='".$_SESSION["classe"]."' AND a.data BETWEEN '".$lun."' AND '".$dom."' AND a.materia=m.id";
    $data=eseguiQuery($connection,$sql);
    http_response_code(200);
    echo(json_encode($data));
    $connection->close();
?>