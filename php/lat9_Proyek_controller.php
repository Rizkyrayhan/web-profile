<?php
include 'lat7_koneksi.php';
include 'lat9_Proyek_model.php';

header('Content-Type: application/json');

$model = new Proyek_model($koneksi);
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
            $tahun = $_POST['tahun'] ?? '';
            $jenis = $_POST['jenis'] ?? '';
            $tim = $_POST['tim'] ?? '';
            $deskripsi = $_POST['deskripsi'] ?? '';
            $durasi = $_POST['durasi'] ?? '';
            $video = $_POST['video'] ?? '';

            if (empty($nama) || empty($tahun) || empty($jenis)) {
                $response['message'] = 'Nama proyek, tahun, dan jenis wajib diisi!';
                break;
            }

            // Handle upload gambar
            $gambarPath = '';
            if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] == 0) {
                $uploadResult = $model->uploadGambar($_FILES['gambar']);
                if ($uploadResult['success']) {
                    $gambarPath = $uploadResult['path'];
                } else {
                    $response['message'] = $uploadResult['message'];
                    break;
                }
            }

            $result = $model->tambahData($nama, $tahun, $jenis, $tim, $deskripsi, $durasi, $gambarPath, $video);
            if ($result) {
                $response['success'] = true;
                $response['message'] = 'Data proyek berhasil ditambahkan!';
            } else {
                $response['message'] = 'Gagal menambahkan data!';
            }
            break;

        case 'ubah':
            $id = $_POST['id'] ?? 0;
            $nama = $_POST['nama'] ?? '';
            $tahun = $_POST['tahun'] ?? '';
            $jenis = $_POST['jenis'] ?? '';
            $tim = $_POST['tim'] ?? '';
            $deskripsi = $_POST['deskripsi'] ?? '';
            $durasi = $_POST['durasi'] ?? '';
            $video = $_POST['video'] ?? '';
            $gambarLama = $_POST['gambar_lama'] ?? '';

            if (empty($id) || empty($nama) || empty($tahun) || empty($jenis)) {
                $response['message'] = 'ID, nama proyek, tahun, dan jenis wajib diisi!';
                break;
            }

            // Handle upload gambar baru
            $gambarPath = $gambarLama;
            if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] == 0) {
                // Hapus gambar lama jika ada
                if (!empty($gambarLama)) {
                    $oldFile = '../' . $gambarLama;
                    if (file_exists($oldFile)) {
                        unlink($oldFile);
                    }
                }

                $uploadResult = $model->uploadGambar($_FILES['gambar']);
                if ($uploadResult['success']) {
                    $gambarPath = $uploadResult['path'];
                } else {
                    $response['message'] = $uploadResult['message'];
                    break;
                }
            }

            $result = $model->ubahData($id, $nama, $tahun, $jenis, $tim, $deskripsi, $durasi, $gambarPath, $video);
            if ($result) {
                $response['success'] = true;
                $response['message'] = 'Data proyek berhasil diubah!';
            } else {
                $response['message'] = 'Gagal mengubah data!';
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
                    $response['message'] = 'Data proyek berhasil dihapus!';
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