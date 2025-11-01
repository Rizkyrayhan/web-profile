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
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $data ? htmlspecialchars($data['nama_proyek']) : 'Proyek Tidak Ditemukan'; ?></title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

    <!-- Navbar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="../lat9_Biodata_23312171.html" class="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition font-semibold">
                <i class="fas fa-arrow-left"></i> Kembali ke Biodata
            </a>
            <div class="flex items-center gap-2 text-gray-700">
                <i class="fas fa-laptop-code text-blue-600"></i>
                <span class="font-semibold">Detail Proyek</span>
            </div>
        </div>
    </nav>

    <?php if ($data): ?>
    
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
                <div class="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                    <?= htmlspecialchars($data['jenis_proyek']); ?>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in"><?= htmlspecialchars($data['nama_proyek']); ?></h1>
                <p class="text-lg opacity-90 max-w-2xl mx-auto"><?= htmlspecialchars($data['deskripsi']); ?></p>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
        <div class="max-w-6xl mx-auto">
            
            <!-- Info Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 mb-12">
                <!-- Tahun Card -->
                <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-calendar-alt text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 font-semibold">Tahun Proyek</p>
                            <p class="text-2xl font-bold text-gray-800"><?= htmlspecialchars($data['tahun_proyek']); ?></p>
                        </div>
                    </div>
                </div>

                <!-- Durasi Card -->
                <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-clock text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 font-semibold">Durasi</p>
                            <p class="text-2xl font-bold text-gray-800"><?= htmlspecialchars($data['durasi'] ?: '-'); ?></p>
                        </div>
                    </div>
                </div>

                <!-- Tim Card -->
                <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-users text-purple-600 text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 font-semibold">Tim</p>
                            <p class="text-sm font-bold text-gray-800 leading-tight">
                                <?= htmlspecialchars($data['tim'] ? (strlen($data['tim']) > 30 ? substr($data['tim'], 0, 30) . '...' : $data['tim']) : 'Solo Project'); ?>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- Left Column - Media -->
                <div class="lg:col-span-2 space-y-6">
                    
                    <?php if (!empty($data['gambar'])): ?>
                    <!-- Image Section -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div class="p-6 border-b">
                            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <i class="fas fa-image text-blue-600"></i>
                                Preview Proyek
                            </h2>
                        </div>
                        <div class="p-6">
                            <img src="../<?= htmlspecialchars($data['gambar']); ?>" 
                                 alt="<?= htmlspecialchars($data['nama_proyek']); ?>" 
                                 class="w-full rounded-lg shadow-md hover:shadow-xl transition">
                        </div>
                    </div>
                    <?php endif; ?>

                    <?php if (!empty($data['video'])): ?>
                    <!-- Video Section -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div class="p-6 border-b">
                            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <i class="fas fa-play-circle text-red-600"></i>
                                Video Demo
                            </h2>
                        </div>
                        <div class="p-6">
                            <div class="relative w-full" style="padding-bottom: 56.25%;">
                                <iframe src="<?= htmlspecialchars($data['video']); ?>" 
                                        class="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                                        frameborder="0" 
                                        allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>

                </div>

                <!-- Right Column - Details -->
                <div class="space-y-6">
                    
                    <!-- Deskripsi Detail -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-info-circle text-blue-600"></i>
                            Deskripsi Lengkap
                        </h2>
                        <p class="text-gray-700 leading-relaxed"><?= nl2br(htmlspecialchars($data['deskripsi'])); ?></p>
                    </div>

                    <!-- Tim Pengembang -->
                    <?php if (!empty($data['tim'])): ?>
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-users-cog text-purple-600"></i>
                            Tim Pengembang
                        </h2>
                        <?php 
                        $timArray = explode(',', $data['tim']);
                        foreach ($timArray as $member): 
                        ?>
                        <div class="flex items-center gap-3 py-2">
                            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                <?= strtoupper(substr(trim($member), 0, 1)); ?>
                            </div>
                            <span class="text-gray-700"><?= htmlspecialchars(trim($member)); ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>

                    <!-- Project Info -->
                    <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                            <i class="fas fa-clipboard-list"></i>
                            Informasi Proyek
                        </h2>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center pb-3 border-b border-white/20">
                                <span class="opacity-90">Jenis Proyek:</span>
                                <span class="font-bold"><?= htmlspecialchars($data['jenis_proyek']); ?></span>
                            </div>
                            <div class="flex justify-between items-center pb-3 border-b border-white/20">
                                <span class="opacity-90">Tahun:</span>
                                <span class="font-bold"><?= htmlspecialchars($data['tahun_proyek']); ?></span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="opacity-90">Durasi:</span>
                                <span class="font-bold"><?= htmlspecialchars($data['durasi'] ?: '-'); ?></span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Back Button -->
            <div class="mt-12 text-center">
                <a href="../lat9_Biodata_23312171.html" 
                   class="inline-flex items-center gap-2 px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <i class="fas fa-arrow-left"></i>
                    Kembali ke Biodata
                </a>
            </div>

        </div>
    </div>

    <?php else: ?>
    
    <!-- Not Found -->
    <div class="container mx-auto px-4 py-20">
        <div class="max-w-md mx-auto text-center">
            <div class="bg-white rounded-xl shadow-lg p-8">
                <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Proyek Tidak Ditemukan</h2>
                <p class="text-gray-600 mb-6">Data proyek dengan ID tersebut tidak tersedia di database.</p>
                <a href="../lat9_Biodata_23312171.html" 
                   class="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">
                    <i class="fas fa-arrow-left"></i>
                    Kembali ke Biodata
                </a>
            </div>
        </div>
    </div>

    <?php endif; ?>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4 text-center">
            <p class="text-sm opacity-75">© 2024 Pweb2 • Rizky Dwi Rayhan • 23312171</p>
        </div>
    </footer>

</body>
</html>