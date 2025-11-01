// DOM Elements
const btnTambahProyek = document.getElementById('btnTambahProyek');
const modalProyek = document.getElementById('modalProyek');
const closeModal = document.getElementById('closeModal');
const btnBatal = document.getElementById('btnBatal');
const formProyek = document.getElementById('formProyek');
const modalTitle = document.getElementById('modalTitle');
const bodyProyek = document.getElementById('bodyProyek');
const mobileProyekCards = document.getElementById('mobileProyekCards');
const searchProyek = document.getElementById('searchProyek');
const gambarInput = document.getElementById('gambarProyek');
const previewGambar = document.getElementById('previewGambar');
const imgPreview = document.getElementById('imgPreview');

// Base URL untuk API
const API_URL = 'php/lat9_Proyek_controller.php';

// Load data saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Function untuk load data dari database
async function loadData() {
    // Show loading state
    bodyProyek.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
                <p class="mt-2">Memuat data...</p>
            </td>
        </tr>
    `;
    mobileProyekCards.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
            <p class="mt-2">Memuat data...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_URL}?action=tampil`);
        const result = await response.json();
        
        if (result.success) {
            renderTable(result.data);
        } else {
            showError('Gagal memuat data: ' + result.message);
        }
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// Function untuk search data
let searchTimeout;
searchProyek.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const keyword = e.target.value.trim();
        
        try {
            const response = await fetch(`${API_URL}?action=cari&keyword=${encodeURIComponent(keyword)}`);
            const result = await response.json();
            
            if (result.success) {
                renderTable(result.data);
            } else {
                showError('Gagal mencari data: ' + result.message);
            }
        } catch (error) {
            showError('Error: ' + error.message);
        }
    }, 500);
});

// Render Table
function renderTable(data) {
    // Desktop Table View
    bodyProyek.innerHTML = '';

    if (data.length === 0) {
        bodyProyek.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8">
                    <i class="fas fa-folder-open text-4xl text-gray-400"></i>
                    <p class="mt-2 text-gray-500">Tidak ada proyek ditemukan</p>
                </td>
            </tr>
        `;
        
        mobileProyekCards.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-folder-open text-4xl text-gray-400"></i>
                <p class="mt-2 text-gray-500">Tidak ada proyek ditemukan</p>
            </div>
        `;
        return;
    }

    // Desktop Table
    data.forEach((item) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        
        // Gambar
        let gambarHtml = '<i class="fas fa-image text-3xl text-gray-400"></i>';
        if (item.gambar) {
            gambarHtml = `<img src="${item.gambar}" alt="${escapeHtml(item.nama_proyek)}" class="w-16 h-16 object-cover rounded">`;
        }
        
        row.innerHTML = `
            <td class="px-4 py-3 text-center border-b">${gambarHtml}</td>
            <td class="px-4 py-3 border-b font-semibold">${escapeHtml(item.nama_proyek)}</td>
            <td class="px-4 py-3 border-b text-center">${item.tahun_proyek}</td>
            <td class="px-4 py-3 border-b">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    ${escapeHtml(item.jenis_proyek)}
                </span>
            </td>
            <td class="px-4 py-3 border-b">
                <div class="flex gap-2 justify-center flex-wrap">
                    <button class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm" onclick="lihatDetail(${item.id_proyek})">
                        <i class="fas fa-eye"></i> Detail
                    </button>
                    <button class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm" onclick="editProyek(${item.id_proyek})">
                        <i class="fas fa-edit"></i> Ubah
                    </button>
                    <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm" onclick="hapusProyek(${item.id_proyek}, '${escapeHtml(item.nama_proyek)}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </td>
        `;
        
        bodyProyek.appendChild(row);
    });

    // Mobile Cards View
    mobileProyekCards.innerHTML = '';
    data.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
        
        // Gambar untuk mobile
        let gambarHtml = `
            <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                <i class="fas fa-image text-5xl text-gray-400"></i>
            </div>
        `;
        if (item.gambar) {
            gambarHtml = `<img src="${item.gambar}" alt="${escapeHtml(item.nama_proyek)}" class="w-full h-48 object-cover">`;
        }
        
        card.innerHTML = `
            ${gambarHtml}
            <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-gray-800 text-lg">${escapeHtml(item.nama_proyek)}</h3>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">${item.tahun_proyek}</span>
                </div>
                <div class="mb-3">
                    <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        ${escapeHtml(item.jenis_proyek)}
                    </span>
                </div>
                <p class="text-sm text-gray-600 mb-4 line-clamp-2">${escapeHtml(item.deskripsi || 'Tidak ada deskripsi')}</p>
                <div class="grid grid-cols-3 gap-2">
                    <button class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs font-medium" onclick="lihatDetail(${item.id_proyek})">
                        <i class="fas fa-eye"></i> Detail
                    </button>
                    <button class="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-xs font-medium" onclick="editProyek(${item.id_proyek})">
                        <i class="fas fa-edit"></i> Ubah
                    </button>
                    <button class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs font-medium" onclick="hapusProyek(${item.id_proyek}, '${escapeHtml(item.nama_proyek)}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
        
        mobileProyekCards.appendChild(card);
    });
}

// Open Modal untuk Tambah
btnTambahProyek.addEventListener('click', () => {
    modalTitle.textContent = 'Tambah Daftar Proyek';
    formProyek.reset();
    document.getElementById('editId').value = '';
    document.getElementById('gambarLama').value = '';
    previewGambar.classList.add('hidden');
    modalProyek.classList.remove('hidden');
});

// Close Modal
function closeModalFunc() {
    modalProyek.classList.add('hidden');
    formProyek.reset();
    previewGambar.classList.add('hidden');
}

closeModal.addEventListener('click', closeModalFunc);
btnBatal.addEventListener('click', closeModalFunc);

modalProyek.addEventListener('click', (e) => {
    if (e.target === modalProyek) {
        closeModalFunc();
    }
});

// Preview Gambar
gambarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Validasi tipe file
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Format file tidak valid! Gunakan JPG, PNG, atau GIF.');
            gambarInput.value = '';
            previewGambar.classList.add('hidden');
            return;
        }
        
        // Validasi ukuran file (max 5MB)
        if (file.size > 5000000) {
            alert('Ukuran file terlalu besar! Maksimal 5MB.');
            gambarInput.value = '';
            previewGambar.classList.add('hidden');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            imgPreview.src = e.target.result;
            previewGambar.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        previewGambar.classList.add('hidden');
    }
});

// Submit Form (Tambah / Ubah)
formProyek.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const editId = document.getElementById('editId').value;
    const nama = document.getElementById('namaProyek').value.trim();
    const tahun = document.getElementById('tahunProyek').value.trim();
    const jenis = document.getElementById('jenisProyek').value;
    const tim = document.getElementById('timProyek').value.trim();
    const deskripsi = document.getElementById('deskripsiProyek').value.trim();
    const durasi = document.getElementById('durasiProyek').value.trim();
    const video = document.getElementById('videoProyek').value.trim();
    const gambarFile = gambarInput.files[0];
    const gambarLama = document.getElementById('gambarLama').value;
    
    if (!nama || !tahun || !jenis) {
        alert('Nama proyek, tahun, dan jenis wajib diisi!');
        return;
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('tahun', tahun);
    formData.append('jenis', jenis);
    formData.append('tim', tim);
    formData.append('deskripsi', deskripsi);
    formData.append('durasi', durasi);
    formData.append('video', video);

    if (editId) {
        // Update
        formData.append('action', 'ubah');
        formData.append('id', editId);
        formData.append('gambar_lama', gambarLama);
    } else {
        // Tambah
        formData.append('action', 'tambah');
    }

    // Tambahkan file gambar jika ada
    if (gambarFile) {
        formData.append('gambar', gambarFile);
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            closeModalFunc();
            loadData();
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Lihat Detail Proyek
async function lihatDetail(id) {
    try {
        const response = await fetch(`${API_URL}?action=detail&id=${id}`);
        const result = await response.json();
        
        if (result.success) {
            const item = result.data;
            
            let detailHtml = `
                <div class="space-y-3">
                    <h3 class="text-xl font-bold text-blue-800">${escapeHtml(item.nama_proyek)}</h3>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Tahun:</strong> ${item.tahun_proyek}</div>
                        <div><strong>Jenis:</strong> ${escapeHtml(item.jenis_proyek)}</div>
                        <div><strong>Durasi:</strong> ${escapeHtml(item.durasi || '-')}</div>
                        <div class="col-span-2"><strong>Tim:</strong> ${escapeHtml(item.tim || '-')}</div>
                    </div>
                    <div>
                        <strong>Deskripsi:</strong>
                        <p class="text-gray-700 mt-1">${escapeHtml(item.deskripsi || '-')}</p>
                    </div>
            `;
            
            if (item.gambar) {
                detailHtml += `
                    <div>
                        <strong>Gambar:</strong>
                        <img src="${item.gambar}" alt="${escapeHtml(item.nama_proyek)}" class="mt-2 w-full max-w-md rounded border">
                    </div>
                `;
            }
            
            if (item.video) {
                detailHtml += `
                    <div>
                        <strong>Video Demo:</strong>
                        <iframe src="${item.video}" class="mt-2 w-full h-64 rounded" frameborder="0" allowfullscreen></iframe>
                    </div>
                `;
            }
            
            detailHtml += '</div>';
            
            // Tampilkan dalam modal atau alert
            const detailModal = document.createElement('div');
            detailModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
            detailModal.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">Detail Proyek</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    ${detailHtml}
                </div>
            `;
            document.body.appendChild(detailModal);
            
            detailModal.addEventListener('click', (e) => {
                if (e.target === detailModal) {
                    detailModal.remove();
                }
            });
        } else {
            alert('Gagal memuat detail: ' + result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Edit Proyek
async function editProyek(id) {
    try {
        const response = await fetch(`${API_URL}?action=detail&id=${id}`);
        const result = await response.json();
        
        if (result.success) {
            const item = result.data;
            
            modalTitle.textContent = 'Ubah Data Proyek';
            document.getElementById('editId').value = item.id_proyek;
            document.getElementById('namaProyek').value = item.nama_proyek;
            document.getElementById('tahunProyek').value = item.tahun_proyek;
            document.getElementById('jenisProyek').value = item.jenis_proyek;
            document.getElementById('timProyek').value = item.tim || '';
            document.getElementById('deskripsiProyek').value = item.deskripsi || '';
            document.getElementById('durasiProyek').value = item.durasi || '';
            document.getElementById('videoProyek').value = item.video || '';
            document.getElementById('gambarLama').value = item.gambar || '';
            
            // Preview gambar yang sudah ada
            if (item.gambar) {
                imgPreview.src = item.gambar;
                previewGambar.classList.remove('hidden');
            } else {
                previewGambar.classList.add('hidden');
            }
            
            modalProyek.classList.remove('hidden');
        } else {
            alert('Gagal memuat data: ' + result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Hapus Proyek
async function hapusProyek(id, nama) {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${nama}"?\n\nData dan gambar akan dihapus permanen.`)) {
        return;
    }

    const formData = new FormData();
    formData.append('action', 'hapus');
    formData.append('id', id);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            loadData();
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Helper function untuk escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

// Helper function untuk show error
function showError(message) {
    bodyProyek.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-8">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                <p class="mt-2 text-red-600">${message}</p>
            </td>
        </tr>
    `;
    
    mobileProyekCards.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
            <p class="mt-2 text-red-600">${message}</p>
        </div>
    `;
}