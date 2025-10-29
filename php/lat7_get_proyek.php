<?php
include 'lat7_koneksi.php';
header('Content-Type: application/json');

$query = "SELECT * FROM tbproyek_23312171 WHERE visible = 1 ORDER BY tahun_proyek DESC";
$result = $koneksi->query($query);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
