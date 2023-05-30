<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    checkSession();
    if(isset($_SESSION["matricola"]))
    {
        $matr=$_SESSION["matricola"];
        $connecion=openConnection("registro");
        $sql="select * from studenti where matricola = $matr";
        $data=eseguiQuery($connecion,$sql);
        if(count($data)>0)
        {
            http_response_code(200);
            echo(json_encode($data[0]));
        }
        else
        {
            http_response_code(400);
            die("Matricola non trovata");
        }
        $connecion->close();
    }
    else
    {
        http_response_code(403);
        die("Parametro sessione matricola mancante");
    }

?>