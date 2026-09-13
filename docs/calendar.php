<?php
/*
 * Server-seitiger Proxy + Cache für den Google-Kalender "Veranstaltungen AS! Gothia".
 *
 * Warum: Google liefert die .ics-Datei ohne CORS-Header aus -> ein direkter
 * Abruf aus dem Browser (von www.gothia-graz.at) wird blockiert. Dieser Proxy
 * holt den Kalender serverseitig, speichert ihn kurz zwischen und liefert ihn
 * von der EIGENEN Domain aus. Vorteil zusätzlich: der Besucher verbindet sich
 * nur mit gothia-graz.at, nicht direkt mit Google (datenschutzfreundlich).
 */

$ICS_URL = 'https://calendar.google.com/calendar/ical/'
    . 'c0fd677e5a63edd668f9dd71cefc7060286a8025dd9fe520a61779a287ca314f'
    . '%40group.calendar.google.com/public/basic.ics';

$CACHE = __DIR__ . '/calendar-cache.ics';
$TTL   = 1800; // 30 Minuten

header('Content-Type: text/calendar; charset=utf-8');
header('Cache-Control: public, max-age=' . $TTL);

// 1) Frischer Cache vorhanden? -> direkt ausliefern
if (is_readable($CACHE) && (time() - filemtime($CACHE) < $TTL)) {
    readfile($CACHE);
    exit;
}

// 2) Neu von Google holen
$data = false;
if (function_exists('curl_init')) {
    $ch = curl_init($ICS_URL);
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_USERAGENT      => 'Gothia-Website-Calendar/1.0',
    ));
    $data = curl_exec($ch);
    curl_close($ch);
}
if ($data === false && ini_get('allow_url_fopen')) {
    $data = @file_get_contents($ICS_URL);
}

// 3) Erfolgreich + gültig? -> cachen und ausliefern
if ($data !== false && strpos($data, 'BEGIN:VCALENDAR') !== false) {
    @file_put_contents($CACHE, $data);
    echo $data;
    exit;
}

// 4) Google nicht erreichbar -> falls vorhanden alten Cache ausliefern
if (is_readable($CACHE)) {
    readfile($CACHE);
    exit;
}

// 5) Letzter Fallback: leerer, gültiger Kalender (Seite bleibt funktionsfähig)
echo "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Gothia//Kalender-Proxy//DE\r\nEND:VCALENDAR\r\n";
