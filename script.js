// ======================================
// SISTEM INFORMASI KEPEGAWAIAN HOTEL
// ======================================

// Mengambil elemen HTML
const tabelPegawai = document.getElementById("tabelPegawai");
const modal = document.getElementById("modalPegawai");
const form = document.getElementById("formPegawai");

const btnTambah = document.getElementById("btnTambah");
const menuTambah = document.getElementById("menuTambah");
const btnTutup = document.getElementById("btnTutup");
const btnBatal = document.getElementById("btnBatal");

const cariPegawai = document.getElementById("cariPegawai");
const filterDepartemen = document.getElementById("filterDepartemen");
const filterStatus = document.getElementById("filterStatus");

// ======================================
// DATA AWAL PEGAWAI
// ======================================

const dataContoh = [
    {
        id: 1,
        nama: "Andi Pratama",
        nik: "5301010101010001",
        email: "andi@gmail.com",
        hp: "081234567890",
        jabatan: "Resepsionis",
        departemen: "Front Office",
        tanggalMasuk: "2024-01-10",
        status: "Aktif"
    },
    {
        id: 2,
        nama: "Siti Rahma",
        nik: "5301010202020002",
        email: "siti@gmail.com",
        hp: "082345678901",
        jabatan: "Housekeeping",
        departemen: "Housekeeping",
        tanggalMasuk: "2023-06-15",
        status: "Aktif"
    },
    {
        id: 3,
        nama: "Budi Santoso",
        nik: "5301010303030003",
        email: "budi@gmail.com",
        hp: "083456789012",
        jabatan: "Chef / Koki",
        departemen: "Food & Beverage",
        tanggalMasuk: "2022-03-20",
        status: "Aktif"
    },
    {
        id: 4,
        nama: "Maria Lestari",
        nik: "5301010404040004",
        email: "maria@gmail.com",
        hp: "085678901234",
        jabatan: "Security",
        departemen: "Security",
        tanggalMasuk: "2024-08-01",
        status: "Nonaktif"
    },
    {
        id: 5,
        nama: "John Fernandes",
        nik: "5301010505050005",
        email: "john@gmail.com",
        hp: "087890123456",
        jabatan: "General Manager",
        departemen: "Management",
        tanggalMasuk: "2021-02-12",
        status: "Aktif"
    }
];

// ======================================
// LOCAL STORAGE
// ======================================

let pegawai = JSON.parse(
    localStorage.getItem("dataPegawaiHotel")
) || dataContoh;

function simpanData() {
    localStorage.setItem(
        "dataPegawaiHotel",
        JSON.stringify(pegawai)
    );
}

// ======================================
// FUNGSI MENGAMANKAN TAMPILAN TEKS
// ======================================

function aman(teks) {
    return String(teks ?? "").replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[karakter]);
}

// ======================================
// MENAMPILKAN DATA PEGAWAI
// ======================================

function tampilkanPegawai() {

    const kataKunci = cariPegawai.value.toLowerCase();
    const departemen = filterDepartemen.value;
    const status = filterStatus.value;

    const hasil = pegawai.filter(p => {

        const cocokNama =
            p.nama.toLowerCase().includes(kataKunci);

        const cocokNIK =
            p.nik.toLowerCase().includes(kataKunci);

        const cocokDepartemen =
            departemen === "" || p.departemen === departemen;

        const cocokStatus =
            status === "" || p.status === status;

        return (cocokNama || cocokNIK) &&
            cocokDepartemen && cocokStatus;
    });

    tabelPegawai.innerHTML = "";

    document.getElementById("pesanKosong").hidden =
        hasil.length !== 0;

    hasil.forEach((p, index) => {

        const baris = document.createElement("tr");

        baris.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <span class="employee-name">
                    ${aman(p.nama)}
                </span>
                <span class="employee-email">
                    ${aman(p.email)}
                </span>
            </td>

            <td>${aman(p.nik)}</td>

            <td>${aman(p.jabatan)}</td>

            <td>${aman(p.departemen)}</td>

            <td>${aman(p.hp)}</td>

            <td>
                <span class="status ${
                    p.status === "Aktif" ? "aktif" : "nonaktif"
                }">
                    ${aman(p.status)}
                </span>
            </td>

            <td>
                <div class="action-buttons">
                    <button class="btn-edit"
                        data-action="edit"
                        data-id="${Number(p.id)}">
                        Edit
                    </button>

                    <button class="btn-delete"
                        data-action="hapus"
                        data-id="${Number(p.id)}">
                        Hapus
                    </button>
                </div>
            </td>
        `;

        tabelPegawai.appendChild(baris);
    });

    perbaruiStatistik();
}

// ======================================
// STATISTIK DASHBOARD
// ======================================

function perbaruiStatistik() {

    const total = pegawai.length;

    const aktif = pegawai.filter(
        p => p.status === "Aktif"
    ).length;

    const nonaktif = pegawai.filter(
        p => p.status === "Nonaktif"
    ).length;

    const departemen = new Set(
        pegawai.map(p => p.departemen)
    ).size;

    document.getElementById("totalPegawai").textContent = total;

    document.getElementById("pegawaiAktif").textContent = aktif;

    document.getElementById("pegawaiNonaktif").textContent = nonaktif;

    document.getElementById("totalDepartemen").textContent =
        departemen;
}

// ======================================
// MEMBUKA FORM TAMBAH PEGAWAI
// ======================================

function bukaForm() {

    form.reset();

    document.getElementById("pegawaiId").value = "";

    document.getElementById("judulForm").textContent =
        "Tambah Pegawai";

    modal.classList.add("show");
}

btnTambah.addEventListener("click", bukaForm);
menuTambah.addEventListener("click", bukaForm);

// ======================================
// MENUTUP FORM
// ======================================

function tutupForm() {
    modal.classList.remove("show");
    form.reset();
}

btnTutup.addEventListener("click", tutupForm);
btnBatal.addEventListener("click", tutupForm);

// Klik luar modal untuk menutup
modal.addEventListener("click", function(e) {
    if (e.target === modal) {
        tutupForm();
    }
});

// ======================================
// TAMBAH DAN EDIT DATA PEGAWAI
// ======================================

form.addEventListener("submit", function(e) {

    e.preventDefault();

    const id = document.getElementById("pegawaiId").value;

    const dataBaru = {
        id: id ? Number(id) : Date.now(),

        nama: document.getElementById("nama").value.trim(),

        nik: document.getElementById("nik").value.trim(),

        email: document.getElementById("email").value.trim(),

        hp: document.getElementById("hp").value.trim(),

        jabatan: document.getElementById("jabatan").value,

        departemen: document.getElementById("departemen").value,

        tanggalMasuk: document.getElementById("tanggalMasuk").value,

        status: document.getElementById("status").value
    };

    // Memeriksa NIK yang sama
    const nikSudahAda = pegawai.some(p =>
        p.nik === dataBaru.nik && p.id !== dataBaru.id
    );

    if (nikSudahAda) {
        alert("NIK sudah terdaftar! Gunakan NIK yang berbeda.");
        return;
    }

    if (id) {

        // UPDATE DATA
        const index = pegawai.findIndex(
            p => p.id === Number(id)
        );

        if (index !== -1) {
            pegawai[index] = dataBaru;
            alert("Data pegawai berhasil diperbarui!");
        }

    } else {

        // CREATE DATA
        pegawai.push(dataBaru);
        alert("Pegawai berhasil ditambahkan!");
    }

    simpanData();
    tampilkanPegawai();
    tutupForm();
});

// ======================================
// EDIT DAN HAPUS DATA
// ======================================

tabelPegawai.addEventListener("click", function(e) {

    const tombol = e.target.closest("button[data-action]");

    if (!tombol) return;

    const id = Number(tombol.dataset.id);

    const aksi = tombol.dataset.action;

    const p = pegawai.find(item => item.id === id);

    if (!p) return;

    if (aksi === "edit") {

        // Mengisi form dengan data lama
        document.getElementById("pegawaiId").value = p.id;

        document.getElementById("nama").value = p.nama;

        document.getElementById("nik").value = p.nik;

        document.getElementById("email").value = p.email;

        document.getElementById("hp").value = p.hp;

        document.getElementById("jabatan").value = p.jabatan;

        document.getElementById("departemen").value =
            p.departemen;

        document.getElementById("tanggalMasuk").value =
            p.tanggalMasuk;

        document.getElementById("status").value = p.status;

        document.getElementById("judulForm").textContent =
            "Edit Data Pegawai";

        modal.classList.add("show");
    }

    if (aksi === "hapus") {

        const yakin = confirm(
            `Apakah kamu yakin ingin menghapus pegawai ${p.nama}?`
        );

        if (yakin) {

            pegawai = pegawai.filter(
                item => item.id !== id
            );

            simpanData();
            tampilkanPegawai();

            alert("Data pegawai berhasil dihapus!");
        }
    }
});

// ======================================
// PENCARIAN DAN FILTER
// ======================================

cariPegawai.addEventListener(
    "input",
    tampilkanPegawai
);

filterDepartemen.addEventListener(
    "change",
    tampilkanPegawai
);

filterStatus.addEventListener(
    "change",
    tampilkanPegawai
);

// ======================================
// EXPORT DATA KE CSV
// ======================================

document.getElementById("btnExport")
    .addEventListener("click", function() {

        if (pegawai.length === 0) {
            alert("Tidak ada data pegawai untuk diekspor.");
            return;
        }

        const kolom = [
            "Nama",
            "NIK",
            "Email",
            "Nomor HP",
            "Jabatan",
            "Departemen",
            "Tanggal Masuk",
            "Status"
        ];

        const baris = pegawai.map(p => [
            p.nama,
            p.nik,
            p.email,
            p.hp,
            p.jabatan,
            p.departemen,
            p.tanggalMasuk,
            p.status
        ]);

        function formatCSV(nilai) {
            return '"' + String(nilai ?? "").replace(/"/g, '""') + '"';
        }

        const isiCSV = [kolom, ...baris]
            .map(row => row.map(formatCSV).join(","))
            .join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + isiCSV],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "Data-Pegawai-Hotel.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    });

// ======================================
// TANGGAL HARI INI
// ======================================

document.getElementById("tanggalHariIni")
    .textContent = new Date().toLocaleDateString(
        "id-ID",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

// ======================================
// MENJALANKAN APLIKASI
// ======================================

tampilkanPegawai();