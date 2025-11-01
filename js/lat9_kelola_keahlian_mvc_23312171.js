// DOM Elements
const btnTambah = document.getElementById('btnTambah');
const modalOverlay = document.getElementById('modalOverlay');
const btnClose = document.getElementById('btnClose');
const btnBatal = document.getElementById('btnBatal');
const formKeahlian = document.getElementById('formKeahlian');
const modalTitle = document.getElementById('modalTitle');
const tableBody = document.getElementById('tableBody');
const mobileCards = document.getElementById('mobileCards');
const searchInput = document.getElementById('searchInput');
const iconKeahlian = document.getElementById('iconKeahlian');
const iconPreview = document.getElementById('iconPreview');
const iconText = document.getElementById('iconText');

// Base URL untuk API
const API_URL = 'php/lat9_Keahlian_controller.php';

// Load data saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Function untuk load data dari database
async function loadData() {
    // Show loading state
    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
                <p class="mt-2">Memuat data...</p>
            </td>
        </tr>
    `;
    mobileCards.innerHTML = `
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
searchInput.addEventListener('input', (e) => {
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
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-8">
                    <i class="fas fa-search text-4xl text-gray-400"></i>
                    <p class="mt-2 text-gray-500">Tidak ada data keahlian yang ditemukan</p>
                </td>
            </tr>
        `;
        
        mobileCards.innerHTML = `
            <div class="text-center py-8 col-span-full">
                <i class="fas fa-search text-4xl text-gray-400"></i>
                <p class="mt-2 text-gray-500">Tidak ada data keahlian yang ditemukan</p>
            </div>
        `;
        return;
    }

    // Desktop Table
    data.forEach((item) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        
        row.innerHTML = `
            <td class="px-4 py-3 text-center border-b">
                <i class="fas ${item.icon} text-2xl text-blue-600"></i>
            </td>
            <td class="px-4 py-3 border-b font-semibold">${escapeHtml(item.nama_keahlian)}</td>
            <td class="px-4 py-3 border-b">${escapeHtml(item.deskripsi)}</td>
            <td class="px-4 py-3 border-b">
                <div class="flex gap-2 justify-center flex-wrap">
                    <button class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm" onclick="editKeahlian(${item.id_keahlian})">
                        <i class="fas fa-edit"></i> Ubah
                    </button>
                    <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm" onclick="hapusKeahlian(${item.id_keahlian}, '${escapeHtml(item.nama_keahlian)}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    // Mobile Cards View
    mobileCards.innerHTML = '';
    data.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition';
        
        card.innerHTML = `
            <div class="flex items-start gap-4 mb-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas ${item.icon} text-2xl text-blue-600"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-800 text-lg mb-1">${escapeHtml(item.nama_keahlian)}</h3>
                    <p class="text-sm text-gray-600">${escapeHtml(item.deskripsi)}</p>
                </div>
            </div>
            <div class="flex gap-2 mt-4">
                <button class="flex-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm font-medium" onclick="editKeahlian(${item.id_keahlian})">
                    <i class="fas fa-edit"></i> Ubah
                </button>
                <button class="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-medium" onclick="hapusKeahlian(${item.id_keahlian}, '${escapeHtml(item.nama_keahlian)}')">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        `;
        
        mobileCards.appendChild(card);
    });
}

// Open Modal untuk Tambah
btnTambah.addEventListener('click', () => {
    modalTitle.textContent = 'Tambah Data Keahlian';
    formKeahlian.reset();
    document.getElementById('editId').value = '';
    iconPreview.className = 'fas';
    iconText.textContent = 'Preview icon akan muncul di sini';
    modalOverlay.classList.remove('hidden');
});

// Close Modal
function closeModal() {
    modalOverlay.classList.add('hidden');
    formKeahlian.reset();
}

btnClose.addEventListener('click', closeModal);
btnBatal.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Icon Preview
iconKeahlian.addEventListener('change', (e) => {
    const selectedIcon = e.target.value;
    if (selectedIcon) {
        iconPreview.className = `fas ${selectedIcon} text-blue-600`;
        iconText.textContent = `Icon: ${selectedIcon}`;
    } else {
        iconPreview.className = 'fas';
        iconText.textContent = 'Preview icon akan muncul di sini';
    }
});

// Submit Form (Tambah / Ubah)
formKeahlian.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const editId = document.getElementById('editId').value;
    const nama = document.getElementById('namaKeahlian').value.trim();
    const deskripsi = document.getElementById('deskripsiKeahlian').value.trim();
    const icon = document.getElementById('iconKeahlian').value;
    
    if (!nama || !deskripsi || !icon) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('icon', icon);

    if (editId) {
        // Update
        formData.append('action', 'ubah');
        formData.append('id', editId);
    } else {
        // Tambah
        formData.append('action', 'tambah');
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            closeModal();
            loadData();
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Edit Keahlian
async function editKeahlian(id) {
    try {
        const response = await fetch(`${API_URL}?action=detail&id=${id}`);
        const result = await response.json();
        
        if (result.success) {
            const item = result.data;
            
            modalTitle.textContent = 'Ubah Data Keahlian';
            document.getElementById('editId').value = item.id_keahlian;
            document.getElementById('namaKeahlian').value = item.nama_keahlian;
            document.getElementById('deskripsiKeahlian').value = item.deskripsi;
            document.getElementById('iconKeahlian').value = item.icon;
            
            // Update icon preview
            iconPreview.className = `fas ${item.icon} text-blue-600`;
            iconText.textContent = `Icon: ${item.icon}`;
            
            modalOverlay.classList.remove('hidden');
        } else {
            alert('Gagal memuat data: ' + result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Hapus Keahlian
async function hapusKeahlian(id, nama) {
    if (!confirm(`Apakah Anda yakin ingin menghapus keahlian "${nama}"?`)) {
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
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Helper function untuk show error
function showError(message) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center py-8">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                <p class="mt-2 text-red-600">${message}</p>
            </td>
        </tr>
    `;
    
    mobileCards.innerHTML = `
        <div class="text-center py-8 col-span-full">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
            <p class="mt-2 text-red-600">${message}</p>
        </div>
    `;
}