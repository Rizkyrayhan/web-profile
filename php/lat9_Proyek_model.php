<?php
class Proyek_model {
    private $koneksi;

    public function __construct($koneksi) {
        $this->koneksi = $koneksi;
    }

    // Tampil semua data menggunakan view
    public function tampilData() {
        $query = "SELECT * FROM vwproyek_23312171 WHERE visible = 1";
        $result = $this->koneksi->query($query);
        
        $data = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        return $data;
    }

    // Tambah data menggunakan stored procedure
    public function tambahData($nama, $tahun, $jenis, $tim, $deskripsi, $durasi, $gambar, $video) {
        $stmt = $this->koneksi->prepare("CALL sp_PROYEK_TAMBAH_23312171(?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sissssss", $nama, $tahun, $jenis, $tim, $deskripsi, $durasi, $gambar, $video);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }

    // Ubah data menggunakan stored procedure
    public function ubahData($id, $nama, $tahun, $jenis, $tim, $deskripsi, $durasi, $gambar, $video) {
        $stmt = $this->koneksi->prepare("CALL sp_PROYEK_UBAH_23312171(?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isissssss", $id, $nama, $tahun, $jenis, $tim, $deskripsi, $durasi, $gambar, $video);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }

    // Hapus data menggunakan stored procedure
    public function hapusData($id) {
        // Ambil data gambar terlebih dahulu untuk dihapus filenya
        $data = $this->getDataById($id);
        
        $stmt = $this->koneksi->prepare("CALL sp_PROYEK_HAPUS_23312171(?)");
        $stmt->bind_param("i", $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        // Hapus file gambar jika ada
        if ($result && $data && !empty($data['gambar'])) {
            $filePath = '../' . $data['gambar'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
        
        return $result;
    }

    // Cari data menggunakan stored procedure
    public function cariData($keyword) {
        $stmt = $this->koneksi->prepare("CALL sp_PROYEK_CARI_23312171(?)");
        $stmt->bind_param("s", $keyword);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $data = [];
        
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                if ($row['visible'] == 1) {
                    $data[] = $row;
                }
            }
        }
        
        $stmt->close();
        return $data;
    }

    // Get data by ID
    public function getDataById($id) {
        $query = "SELECT * FROM tbproyek_23312171 WHERE id_proyek = ?";
        $stmt = $this->koneksi->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        $stmt->close();
        
        return $data;
    }

    // Toggle visibility
    public function toggleVisibility($id) {
        $query = "UPDATE tbproyek_23312171 SET visible = NOT visible WHERE id_proyek = ?";
        $stmt = $this->koneksi->prepare($query);
        $stmt->bind_param("i", $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }

    // Upload gambar
    public function uploadGambar($file) {
        $targetDir = "../img/";
        
        // Buat folder jika belum ada
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        
        $fileName = time() . '_' . basename($file["name"]);
        $targetFile = $targetDir . $fileName;
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
        
        // Check if image file is actual image
        $check = getimagesize($file["tmp_name"]);
        if ($check === false) {
            return ["success" => false, "message" => "File bukan gambar!"];
        }
        
        // Check file size (max 5MB)
        if ($file["size"] > 5000000) {
            return ["success" => false, "message" => "Ukuran file terlalu besar! Maksimal 5MB"];
        }
        
        // Allow certain file formats
        if (!in_array($imageFileType, ["jpg", "jpeg", "png", "gif"])) {
            return ["success" => false, "message" => "Hanya file JPG, JPEG, PNG & GIF yang diperbolehkan!"];
        }
        
        // Upload file
        if (move_uploaded_file($file["tmp_name"], $targetFile)) {
            return ["success" => true, "path" => "img/" . $fileName];
        } else {
            return ["success" => false, "message" => "Gagal mengupload file!"];
        }
    }
}
?>