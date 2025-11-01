<?php
include 'lat7_koneksi.php';
include 'lat9_Keahlian_model.php';

header('Content-Type: application/json');

$model = new Keahlian_model($koneksi);
$action = isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : '');

$response = [
    'success' => false,
    'message' => '',
    'data' => []
];

try {
    switch ($action) {
        case 'tampil':
            $data = $model->tampilData();
            $response['success'] = true;
            $response['data'] = $data;
            break;

        case 'tambah':
            $nama = $_POST['nama'] ?? '';
            $deskripsi = $_POST['deskripsi'] ?? '';
            $icon = $_POST['icon'] ?? '';

            if (empty($nama) || empty($deskripsi) || empty($icon)) {
                $response['message'] = 'Semua field wajib diisi!';
            } else {
                $result = $model->tambahData($nama, $deskripsi, $icon);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Data keahlian berhasil ditambahkan!';
                } else {
                    $response['message'] = 'Gagal menambahkan data!';
                }
            }
            break;

        case 'ubah':
            $id = $_POST['id'] ?? 0;
            $nama = $_POST['nama'] ?? '';
            $deskripsi = $_POST['deskripsi'] ?? '';
            $icon = $_POST['icon'] ?? '';

            if (empty($id) || empty($nama) || empty($deskripsi) || empty($icon)) {
                $response['message'] = 'Semua field wajib diisi!';
            } else {
                $result = $model->ubahData($id, $nama, $deskripsi, $icon);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Data keahlian berhasil diubah!';
                } else {
                    $response['message'] = 'Gagal mengubah data!';
                }
            }
            break;

        case 'hapus':
            $id = $_POST['id'] ?? 0;

            if (empty($id)) {
                $response['message'] = 'ID tidak valid!';
            } else {
                $result = $model->hapusData($id);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Data keahlian berhasil dihapus!';
                } else {
                    $response['message'] = 'Gagal menghapus data!';
                }
            }
            break;

        case 'cari':
            $keyword = $_GET['keyword'] ?? '';
            
            if (empty($keyword)) {
                $data = $model->tampilData();
            } else {
                $data = $model->cariData($keyword);
            }
            
            $response['success'] = true;
            $response['data'] = $data;
            break;

        case 'detail':
            $id = $_GET['id'] ?? 0;
            
            if (empty($id)) {
                $response['message'] = 'ID tidak valid!';
            } else {
                $data = $model->getDataById($id);
                if ($data) {
                    $response['success'] = true;
                    $response['data'] = $data;
                } else {
                    $response['message'] = 'Data tidak ditemukan!';
                }
            }
            break;

        case 'toggle':
            $id = $_POST['id'] ?? 0;
            
            if (empty($id)) {
                $response['message'] = 'ID tidak valid!';
            } else {
                $result = $model->toggleVisibility($id);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Status visibility berhasil diubah!';
                } else {
                    $response['message'] = 'Gagal mengubah status visibility!';
                }
            }
            break;

        default:
            $response['message'] = 'Action tidak valid!';
            break;
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
?>