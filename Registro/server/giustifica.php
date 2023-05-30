<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    checkSession();
    $connection=openConnection("registro");
    if(count($_REQUEST['id'])<=0)
    {
        http_response_code(400);
        die("Parametri ID mancanti");
    }
    else
    {
        $id=implode(",",$_REQUEST["id"]);
        $sql="UPDATE assenze SET giustificato=1 WHERE id IN ($id)";
        $data=eseguiQuery($connection,$sql);
        if($data==false)
        {
            http_response_code(500);
            die("Aggiornamento fallito");
        }
        http_response_code(200);
        echo(json_encode("Aggiornamento eseguito"));
    }
    $connection->close();
?>