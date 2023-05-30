<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    $connection=openConnection("registro");

    if(isset($_REQUEST["matricola"]))
    {
        $matricola=$_REQUEST["matricola"];
    }
    else
    {
        checkSession();
        $matricola=$_SESSION["matricola"];
    }


    $sql="UPDATE studenti SET pass='".$_REQUEST["password"]."' WHERE matricola='".$matricola."'";
    $data=eseguiQuery($connection,$sql);
    http_response_code(200);
    echo(json_encode($data));
    $connection->close();
?>