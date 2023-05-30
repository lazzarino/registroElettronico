<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    checkSession();
    $connection=openConnection("registro");
    $matricola=$connection->real_escape_string($_SESSION["matricola"]);
    
    $sql="SELECT voti.id, voti.matricola, voti.data, materie.materia, voti.voto FROM voti, materie WHERE matricola=$matricola AND voti.materia=materie.id";
    if($_REQUEST["codMateria"]!=-1)
    {
        $codMateria=$connection->real_escape_string($_REQUEST["codMateria"]);
        $sql.=" AND materie.id=$codMateria";
    }
    if(isset($_REQUEST["data"]))
    {
        $date=$connection->real_escape_string($_REQUEST["data"]);
        $sql.=" AND voti.data='".$date."'";
    }
    if(isset($_REQUEST["order"]))
    {
        $order=$connection->real_escape_string($_REQUEST["order"]);
        $sql.=" ORDER BY $order";
    }
    
    $data=eseguiQuery($connection,$sql);
    $connection->close();
    
    http_response_code(200);
    echo(json_encode($data));
?>