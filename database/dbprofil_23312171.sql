CREATE DATABASE dbprofil_23312171;
USE dbprofil_23312171;

CREATE TABLE tbkeahlian_23312171 (
    id_keahlian INT AUTO_INCREMENT PRIMARY KEY,
    nama_keahlian VARCHAR(100) NOT NULL,
    deskripsi TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE tbproyek_23312171 (
    id_proyek INT AUTO_INCREMENT PRIMARY KEY,
    nama_proyek VARCHAR(150) NOT NULL,
    tahun_proyek INT NOT NULL,
    jenis_proyek VARCHAR(100) NOT NULL,
    tim TEXT,
    deskripsi TEXT,
    durasi VARCHAR(50),
    gambar VARCHAR(255),
    video VARCHAR(255),
    visible BOOLEAN DEFAULT TRUE
);

INSERT INTO tbkeahlian_23312171 (nama_keahlian, deskripsi, icon) VALUES
('Front-end Development', 'HTML5, CSS3, JavaScript, React, Responsive Design', 'fa-laptop-code'),
('Back-end Development', 'PHP, Java, MySQL, REST API', 'fa-server'),
('UI/UX Design', 'Figma, Adobe XD, Prototyping, User Research', 'fa-pencil-ruler');

INSERT INTO tbproyek_23312171 (nama_proyek, tahun_proyek, jenis_proyek, tim, deskripsi, durasi, gambar, video) VALUES
('Website LKP Prestasi', 2023, 'Komersil', 'Rizky Dwi Rayhan, Ahmad, Sahroni', 'LMS modern untuk LKP dengan dashboard interaktif dan quiz system.', '1 bulan', 'img/project1.png', 'https://www.youtube.com/embed/1vRTO5QGgqA'),
('Aplikasi Mobile Uangko Master', 2024, 'Tugas', 'Rizky Dwi Rayhan', 'Aplikasi keuangan pribadi berbasis Flutter untuk manajemen transaksi.', '1 minggu', 'img/project2.png', 'https://www.youtube.com/embed/1vRTO5QGgqA'),
('Create Topology Network', 2024, 'Project Akhir', 'Rizky Dwi Rayhan, Muhammad Irfai, Rafi Ramadhani', 'Tool simulasi konfigurasi jaringan menggunakan Cisco Packet Tracer.', '3 minggu', 'img/project3.png', 'https://www.youtube.com/embed/1vRTO5QGgqA');

-- View Keahlian dan Proyek
CREATE VIEW vwkeahlian_23312171 AS
SELECT * FROM tbkeahlian_23312171
ORDER BY nama_keahlian ASC;

CREATE VIEW vwproyek_23312171 AS
SELECT * FROM tbproyek_23312171
ORDER BY tahun_proyek DESC, nama_proyek ASC;

-- Stored Procedure Tambah, Ubah, Hapus, Cari
DELIMITER //

CREATE PROCEDURE sp_KEAHLIAN_TAMBAH_23312171(
    IN p_nama VARCHAR(100),
    IN p_deskripsi TEXT,
    IN p_icon VARCHAR(50)
)
BEGIN
    INSERT INTO tbkeahlian_23312171 (nama_keahlian, deskripsi, icon)
    VALUES (p_nama, p_deskripsi, p_icon);
END //

CREATE PROCEDURE sp_KEAHLIAN_UBAH_23312171(
    IN p_id INT,
    IN p_nama VARCHAR(100),
    IN p_deskripsi TEXT,
    IN p_icon VARCHAR(50)
)
BEGIN
    UPDATE tbkeahlian_23312171
    SET nama_keahlian = p_nama, deskripsi = p_deskripsi, icon = p_icon
    WHERE id_keahlian = p_id;
END //

CREATE PROCEDURE sp_KEAHLIAN_HAPUS_23312171(IN p_id INT)
BEGIN
    DELETE FROM tbkeahlian_23312171 WHERE id_keahlian = p_id;
END //

CREATE PROCEDURE sp_KEAHLIAN_CARI_23312171(IN p_keyword VARCHAR(100))
BEGIN
    SELECT * FROM tbkeahlian_23312171
    WHERE nama_keahlian LIKE CONCAT('%', p_keyword, '%')
    OR deskripsi LIKE CONCAT('%', p_keyword, '%');
END //

CREATE PROCEDURE sp_PROYEK_TAMBAH_23312171(
    IN p_nama VARCHAR(150),
    IN p_tahun INT,
    IN p_jenis VARCHAR(100),
    IN p_tim TEXT,
    IN p_deskripsi TEXT,
    IN p_durasi VARCHAR(50),
    IN p_gambar VARCHAR(255),
    IN p_video VARCHAR(255)
)
BEGIN
    INSERT INTO tbproyek_23312171 (nama_proyek, tahun_proyek, jenis_proyek, tim, deskripsi, durasi, gambar, video)
    VALUES (p_nama, p_tahun, p_jenis, p_tim, p_deskripsi, p_durasi, p_gambar, p_video);
END //

CREATE PROCEDURE sp_PROYEK_UBAH_23312171(
    IN p_id INT,
    IN p_nama VARCHAR(150),
    IN p_tahun INT,
    IN p_jenis VARCHAR(100),
    IN p_tim TEXT,
    IN p_deskripsi TEXT,
    IN p_durasi VARCHAR(50),
    IN p_gambar VARCHAR(255),
    IN p_video VARCHAR(255)
)
BEGIN
    UPDATE tbproyek_23312171
    SET nama_proyek = p_nama, tahun_proyek = p_tahun, jenis_proyek = p_jenis,
        tim = p_tim, deskripsi = p_deskripsi, durasi = p_durasi,
        gambar = p_gambar, video = p_video
    WHERE id_proyek = p_id;
END //

CREATE PROCEDURE sp_PROYEK_HAPUS_23312171(IN p_id INT)
BEGIN
    DELETE FROM tbproyek_23312171 WHERE id_proyek = p_id;
END //

CREATE PROCEDURE sp_PROYEK_CARI_23312171(IN p_keyword VARCHAR(100))
BEGIN
    SELECT * FROM tbproyek_23312171
    WHERE nama_proyek LIKE CONCAT('%', p_keyword, '%')
    OR jenis_proyek LIKE CONCAT('%', p_keyword, '%')
    OR deskripsi LIKE CONCAT('%', p_keyword, '%');
END //

DELIMITER ;
