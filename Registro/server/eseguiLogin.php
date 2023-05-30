<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    $connection=openConnection("registro");
    if(!isset($_REQUEST["username"]))
    {
        http_response_code(400);
        die("Parametro mancante username");
    }
    else
    {
        $user=$connection->real_escape_string($_REQUEST["username"]);
    }
    if(!isset($_REQUEST["password"]))
    {
        http_response_code(400);
        die("Parametro mancante password");
    }
    else
    {
        $pass=$connection->real_escape_string($_REQUEST["password"]);
    }
    $sql="SELECT * FROM studenti WHERE user='".$user."'";
    $data=eseguiQuery($connection,$sql);
    if(count($data)>0)
    {
        if($data[0]["pass"]==$pass)
        {
            http_response_code(200);
            echo(json_encode("OK"));
            session_start();
            $_SESSION["matricola"]=$data[0]["matricola"];
            $_SESSION["scadenza"]=time()+TIMEOUT;
            $_SESSION["classe"]=$data[0]["classe"];
            setcookie(session_name(),session_id(),time()+TIMEOUT,"/");
        }
        else
        {
            http_response_code(401);
            die("Username o password errati");
        }
    }
    else
    {
        http_response_code(401);
        die("Username o password errati");
    }

    $connection->close();

?>