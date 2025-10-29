<?php
include 'lat7_koneksi.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$query = "SELECT * FROM tbproyek_23312171 WHERE id_proyek = $id";
$result = $koneksi->query($query);

if ($result && $result->num_rows > 0) {
    $data = $result->fetch_assoc();
} else {
    $data = null;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $data ? $data['nama_proyek'] : 'Proyek Tidak Ditemukan'; ?></title>
    <link rel="stylesheet" href="../css/lat4_Biodata_23312171.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <main class="main-content">
            <section class="card1">
                <?php if ($data): ?>
                    <h2><?= htmlspecialchars($data['nama_proyek']); ?></h2>
                    <ul>
                        <li><b>Jenis Proyek:</b> <?= htmlspecialchars($data['jenis_proyek']); ?></li>
                        <li><b>Tahun Proyek:</b> <?= htmlspecialchars($data['tahun_proyek']); ?></li>
                        <li><b>Durasi:</b> <?= htmlspecialchars($data['durasi']); ?></li>
                        <li><b>Tim:</b> <?= htmlspecialchars($data['tim']); ?></li>
                    </ul>

                    <h3>Deskripsi Lengkap</h3>
                    <p><?= nl2br(htmlspecialchars($data['deskripsi'])); ?></p>

                    <?php if (!empty($data['gambar'])): ?>
                        <h3>Gambar Proyek</h3>
                        <div class="gallery">
                            <img src="../<?= htmlspecialchars($data['gambar']); ?>" 
                                    alt="<?= htmlspecialchars($data['nama_proyek']); ?>" 
                                    style="width:200px; margin:8px; border-radius:12px;">
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($data['video'])): ?>
                        <h3>Video Proyek</h3>
                        <div class="video-wrapper" style="margin-top:12px;">
                            <iframe width="320" height="180" 
                                    src="<?= htmlspecialchars($data['video']); ?>" 
                                    title="Video Proyek" 
                                    frameborder="0" allowfullscreen></iframe>
                        </div>
                    <?php endif; ?>

                <?php else: ?>
                    <h2>Proyek tidak ditemukan.</h2>
                    <p>Data proyek dengan ID tersebut tidak tersedia di database.</p>
                <?php endif; ?>

                <div style="margin-top: 20px;">
                    <a href="../lat4_Biodata_23312171.html" class="btn-detail">
                        <i class="fas fa-arrow-left"></i> Kembali ke Biodata
                    </a>
                </div>
            </section>
        </main>
    </div>
</body>
</html>
