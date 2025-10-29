<?php
include 'lat7_koneksi.php';
header('Content-Type: application/json');

$query = "SELECT * FROM tbkeahlian_23312171 WHERE visible = 1 ORDER BY nama_keahlian ASC";
$result = $koneksi->query($query);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
