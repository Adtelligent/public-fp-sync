<?php
echo $_GET["uid"];

$arr_cookie_options = array (
    'expires' => time() + 60*60*24*30,
    'path' => '/',
    'domain' => '.pub1.site',
    'secure' => true,
    'httponly' => false, // false means give access to javascript access value
    'samesite' => 'None'
);
setcookie('openId', $_GET["uid"], $arr_cookie_options);
