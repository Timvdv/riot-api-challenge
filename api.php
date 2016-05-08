<?php

$api_key = "your-api-key-here";

if(isset($_GET["summoner"]))
{
        echo json_encode(returnData("https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/".$_GET["summoner"]."?api_key=".$api_key));
}

if(isset($_GET["summoner_id"]))
{
        echo json_encode(returnData("https://euw.api.pvp.net/api/lol/euw/v2.2/matchlist/by-summoner/".$_GET["summoner_id"]."?api_key=".$api_key));
}

if(isset($_GET["match_id"]))
{
        echo json_encode(returnData("https://euw.api.pvp.net/api/lol/euw/v2.2/match/".$_GET["match_id"]."?api_key=".$api_key));
}

function returnData($url)
{
        // create curl resource 
        $ch = curl_init(); 

        // set url 
        curl_setopt($ch, CURLOPT_URL, $url); 

        //return the transfer as a string 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

        // $output contains the output string 
        $json = curl_exec($ch); 

        // close curl resource to free up system resources 
        curl_close($ch);

        return $json;
}
