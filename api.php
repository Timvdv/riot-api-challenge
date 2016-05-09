<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$api_key = "your-api-key-here";
$region = "euw";

if(isset($_GET["region"]))
{
        $region = $_GET["region"];
}

if(isset($_GET["summoner"]))
{
        echo returnData("https://".$region.".api.pvp.net/api/lol/".$region."/v1.4/summoner/by-name/".$_GET["summoner"]."?api_key=".$api_key);
}

if(isset($_GET["summoner_id"]))
{
        echo returnData("https://".$region.".api.pvp.net/api/lol/".$region."/v2.2/matchlist/by-summoner/".$_GET["summoner_id"]."?api_key=".$api_key);
}

if(isset($_GET["match_id"]))
{
        echo returnData("https://".$region.".api.pvp.net/api/lol/".$region."/v2.2/match/".$_GET["match_id"]."?api_key=".$api_key);
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
