<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    checkSession();
    $connection=openConnection("registro");
    $classe=$_SESSION["classe"];
    $sql="SELECT * FROM classi WHERE nome='".$classe."'";
    $data=eseguiQuery($connection,$sql);
    if(count($data)>0)
    {
        $materie=str_replace("[","",$data[0]["materie"]);
        $materie=str_replace("]","",$materie);
        $vetMaterie=explode(", ",$materie);
        $data=array();
        foreach($vetMaterie as $codMateria)
        {
            $sql="SELECT * FROM materie WHERE id=$codMateria";
            array_push($data,eseguiQuery($connection,$sql)[0]);
        }
        http_response_code(200);
        echo(json_encode($data));
    }
    else
    {
        http_response_code(500);
        die("Classe non trovata");
    }
    $connection->close();
?>