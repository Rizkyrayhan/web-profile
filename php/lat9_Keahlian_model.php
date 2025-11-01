<?php
class Keahlian_model {
    private $koneksi;

    public function __construct($koneksi) {
        $this->koneksi = $koneksi;
    }

    // Tampil semua data menggunakan view
    public function tampilData() {
        $query = "SELECT * FROM vwkeahlian_23312171 WHERE visible = 1";
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
    public function tambahData($nama, $deskripsi, $icon) {
        $stmt = $this->koneksi->prepare("CALL sp_KEAHLIAN_TAMBAH_23312171(?, ?, ?)");
        $stmt->bind_param("sss", $nama, $deskripsi, $icon);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }

    // Ubah data menggunakan stored procedure
    public function ubahData($id, $nama, $deskripsi, $icon) {
        $stmt = $this->koneksi->prepare("CALL sp_KEAHLIAN_UBAH_23312171(?, ?, ?, ?)");
        $stmt->bind_param("isss", $id, $nama, $deskripsi, $icon);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }

    // Hapus data menggunakan stored procedure
    public function hapusData($id) {
        $stmt = $this->koneksi->prepare("CALL sp_KEAHLIAN_HAPUS_23312171(?)");
        $stmt->bind_param("i", $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }

    // Cari data menggunakan stored procedure
    public function cariData($keyword) {
        $stmt = $this->koneksi->prepare("CALL sp_KEAHLIAN_CARI_23312171(?)");
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
        $query = "SELECT * FROM tbkeahlian_23312171 WHERE id_keahlian = ?";
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
        $query = "UPDATE tbkeahlian_23312171 SET visible = NOT visible WHERE id_keahlian = ?";
        $stmt = $this->koneksi->prepare($query);
        $stmt->bind_param("i", $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
}
?>