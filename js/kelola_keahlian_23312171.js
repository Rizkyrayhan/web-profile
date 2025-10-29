// Data Keahlian
let dataKeahlian = [
    {
        nama: "Front-end Development",
        deskripsi: "HTML5, CSS3, JavaScript, React, Responsive Design",
        icon: "fa-laptop-code",
        visible: true
    },
    {
        nama: "Back-end Development",
        deskripsi: "PHP, Java, MySQL, REST API",
        icon: "fa-server",
        visible: true
    },
    {
        nama: "UI/UX Design",
        deskripsi: "Figma, Adobe XD, Prototyping, User Research",
        icon: "fa-pencil-ruler",
        visible: true
    }
];

// DOM Elements
const btnTambah = document.getElementById('btnTambah');
const modalOverlay = document.getElementById('modalOverlay');
const btnClose = document.getElementById('btnClose');
const btnBatal = document.getElementById('btnBatal');
const formKeahlian = document.getElementById('formKeahlian');
const modalTitle = document.getElementById('modalTitle');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const iconKeahlian = document.getElementById('iconKeahlian');
const iconPreview = document.getElementById('iconPreview');
const iconText = document.getElementById('iconText');

// Render Table
function renderTable(filter = '') {
    tableBody.innerHTML = '';
    
    const filteredData = dataKeahlian.filter(item => 
        item.nama.toLowerCase().includes(filter.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>Tidak ada data keahlian yang ditemukan</p>
                </td>
            </tr>
        `;
        return;
    }

    filteredData.forEach((item, index) => {
        const originalIndex = dataKeahlian.indexOf(item);
        const row = document.createElement('tr');
        if (!item.visible) {
            row.classList.add('hidden');
        }
        
        row.innerHTML = `
            <td>
                <i class="fas ${item.icon} icon-cell"></i>
            </td>
            <td>${item.nama}</td>
            <td>${item.deskripsi}</td>
            <td>
                <button class="btn-aksi btn-ubah" onclick="editKeahlian(${originalIndex})">
                    <i class="fas fa-edit"></i> Ubah
                </button>
                <button class="btn-aksi btn-hapus" onclick="hapusKeahlian(${originalIndex})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
                <button class="btn-aksi btn-toggle ${!item.visible ? 'hidden-state' : ''}" onclick="toggleVisibility(${originalIndex})">
                    <i class="fas ${item.visible ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    ${item.visible ? 'Sembunyikan' : 'Tampilkan'}
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Open Modal untuk Tambah
btnTambah.addEventListener('click', () => {
    modalTitle.textContent = 'Tambah Data Keahlian';
    formKeahlian.reset();
    document.getElementById('editIndex').value = '-1';
    iconPreview.className = 'fas';
    iconText.textContent = 'Preview icon akan muncul di sini';
    modalOverlay.classList.add('active');
});

// Close Modal
function closeModal() {
    modalOverlay.classList.remove('active');
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
        iconPreview.className = `fas ${selectedIcon}`;
        iconText.textContent = `Icon: ${selectedIcon}`;
    } else {
        iconPreview.className = 'fas';
        iconText.textContent = 'Preview icon akan muncul di sini';
    }
});

// Submit Form
formKeahlian.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const editIndex = parseInt(document.getElementById('editIndex').value);
    const nama = document.getElementById('namaKeahlian').value.trim();
    const deskripsi = document.getElementById('deskripsiKeahlian').value.trim();
    const icon = document.getElementById('iconKeahlian').value;
    
    if (!nama || !deskripsi || !icon) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }

    const keahlianData = {
        nama: nama,
        deskripsi: deskripsi,
        icon: icon,
        visible: true
    };

    if (editIndex === -1) {
        // Tambah baru
        dataKeahlian.push(keahlianData);
        alert('Data keahlian berhasil ditambahkan!');
    } else {
        // Update existing
        dataKeahlian[editIndex] = {
            ...keahlianData,
            visible: dataKeahlian[editIndex].visible
        };
        alert('Data keahlian berhasil diubah!');
    }
    
    renderTable(searchInput.value);
    closeModal();
});

// Edit Keahlian
function editKeahlian(index) {
    const item = dataKeahlian[index];
    
    modalTitle.textContent = 'Ubah Data Keahlian';
    document.getElementById('editIndex').value = index;
    document.getElementById('namaKeahlian').value = item.nama;
    document.getElementById('deskripsiKeahlian').value = item.deskripsi;
    document.getElementById('iconKeahlian').value = item.icon;
    
    // Update icon preview
    iconPreview.className = `fas ${item.icon}`;
    iconText.textContent = `Icon: ${item.icon}`;
    
    modalOverlay.classList.add('active');
}

// Hapus Keahlian
function hapusKeahlian(index) {
    const item = dataKeahlian[index];
    
    if (confirm(`Apakah Anda yakin ingin menghapus keahlian "${item.nama}"?`)) {
        dataKeahlian.splice(index, 1);
        renderTable(searchInput.value);
        alert('Data keahlian berhasil dihapus!');
    }
}

// Toggle Visibility
function toggleVisibility(index) {
    dataKeahlian[index].visible = !dataKeahlian[index].visible;
    renderTable(searchInput.value);
    
    const status = dataKeahlian[index].visible ? 'ditampilkan' : 'disembunyikan';
    alert(`Keahlian "${dataKeahlian[index].nama}" berhasil ${status}!`);
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
    renderTable(e.target.value);
});

// Initial Render
renderTable();