<?php
    header("content-type:application/json; charset=utf-8");
    require("MySQLi.php");
    checkSession();
    $connection=openConnection("registro");
    
    $immagine=$_FILES["image"];
    $filename=basename($immagine["name"]);

    ///echo(json_encode($immagine["name"]));


	$size=$immagine["size"];
    $mimeType=$immagine["type"];
    $ext = pathinfo($filename,PATHINFO_EXTENSION);
    $source_file = $immagine["tmp_name"];
    $target_file = "uploads/$filename";

    move_uploaded_file($source_file, $target_file);

    $nameImg=$connection->real_escape_string($immagine["name"]);

    $sql="UPDATE studenti ";
    $sql.="SET immagine='".$nameImg."' ";
    $sql.="WHERE matricola='".$_SESSION['matricola']."'";
    $data=eseguiQuery($connection,$sql);

    $connection->close();
    http_response_code(200);
    echo(json_encode("OK"));
?>