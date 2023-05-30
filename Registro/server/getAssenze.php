<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    checkSession();
    $connection=openConnection("registro");
    $matricola=$connection->real_escape_string($_SESSION["matricola"]);

    $sql="SELECT * FROM assenze WHERE matricola=$matricola";
    if(isset($_REQUEST["data"]))
    {
        $date=$connection->real_escape_string($_REQUEST["data"]);
        $sql.=" AND data='".$date."'";
    }
    $data=eseguiQuery($connection,$sql);
    $connection->close();
    http_response_code(200);
    echo(json_encode($data));
?>