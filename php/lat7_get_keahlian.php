<?php
include 'lat7_koneksi.php';
header('Content-Type: application/json');

// Menggunakan VIEW yang sudah dibuat
$query = "SELECT * FROM vwkeahlian_23312171 WHERE visible = 1";
$result = $koneksi->query($query);

$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
?>