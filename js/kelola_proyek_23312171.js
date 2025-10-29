let dataProyek = [
    { nama: "Website LKP Prestasi", tahun: 2023, jenis: "Komersil", visible: true },
    { nama: "Aplikasi Mobile Uangko Master", tahun: 2024, jenis: "Tugas", visible: true },
    { nama: "Create Topology Network", tahun: 2024, jenis: "Project Akhir", visible: true }
];

const tableBody = document.getElementById('bodyProyek');
const modal = document.getElementById('modalProyek');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('formProyek');
const search = document.getElementById('searchProyek');
const btnTambah = document.getElementById('btnTambahProyek');
const btnBatal = document.getElementById('btnBatal');
const closeModal = document.getElementById('closeModal');

function renderTable(filter = '') {
    tableBody.innerHTML = '';
    const filtered = dataProyek.filter(p =>
        p.nama.toLowerCase().includes(filter.toLowerCase()) ||
        p.jenis.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="empty-state"><i class="fas fa-folder-open"></i><p>Tidak ada proyek ditemukan</p></td></tr>`;
        return;
    }

    filtered.forEach((p, i) => {
        const idx = dataProyek.indexOf(p);
        const row = document.createElement('tr');
        if (!p.visible) row.classList.add('hidden');
        row.innerHTML = `
            <td>${p.nama}</td>
            <td>${p.tahun}</td>
            <td>${p.jenis}</td>
            <td>
                <button class="btn-aksi btn-ubah" onclick="editProyek(${idx})"><i class="fas fa-edit"></i> Ubah</button>
                <button class="btn-aksi btn-hapus" onclick="hapusProyek(${idx})"><i class="fas fa-trash"></i> Hapus</button>
                <button class="btn-aksi btn-toggle ${!p.visible ? 'hidden-state' : ''}" onclick="toggleProyek(${idx})">
                    <i class="fas ${p.visible ? 'fa-eye-slash' : 'fa-eye'}"></i> ${p.visible ? 'Sembunyikan' : 'Tampilkan'}
                </button>
            </td>`;
        tableBody.appendChild(row);
    });
}

btnTambah.addEventListener('click', () => {
    modalTitle.textContent = "Tambah Daftar Proyek";
    form.reset();
    document.getElementById('editIndex').value = -1;
    modal.classList.add('active');
});

closeModal.onclick = () => modal.classList.remove('active');
btnBatal.onclick = () => modal.classList.remove('active');
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

form.addEventListener('submit', e => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('editIndex').value);
    const proyek = {
        nama: document.getElementById('namaProyek').value.trim(),
        tahun: document.getElementById('tahunProyek').value.trim(),
        jenis: document.getElementById('jenisProyek').value.trim(),
        tim: document.getElementById('timProyek').value.trim(),
        deskripsi: document.getElementById('deskripsiProyek').value.trim(),
        durasi: document.getElementById('durasiProyek').value.trim(),
        gambar: document.getElementById('gambarProyek').value.trim(),
        video: document.getElementById('videoProyek').value.trim(),
        visible: true
    };
    if (!proyek.nama || !proyek.tahun || !proyek.jenis) return alert('Mohon lengkapi data utama!');
    if (idx === -1) dataProyek.push(proyek);
    else dataProyek[idx] = { ...dataProyek[idx], ...proyek };
    modal.classList.remove('active');
    renderTable(search.value);
});

function editProyek(i) {
    const p = dataProyek[i];
    modalTitle.textContent = "Ubah Data Proyek";
    document.getElementById('editIndex').value = i;
    document.getElementById('namaProyek').value = p.nama;
    document.getElementById('tahunProyek').value = p.tahun;
    document.getElementById('jenisProyek').value = p.jenis;
    modal.classList.add('active');
}

function hapusProyek(i) {
    if (confirm(`Hapus proyek "${dataProyek[i].nama}"?`)) {
        dataProyek.splice(i, 1);
        renderTable(search.value);
    }
}

function toggleProyek(i) {
    dataProyek[i].visible = !dataProyek[i].visible;
    renderTable(search.value);
}

search.addEventListener('input', e => renderTable(e.target.value));
renderTable();
