# Kalkulator Budget Ketidakpastian

Aplikasi web berbasis Next.js untuk mengelola database instrumen kalibrasi dan menghitung budget ketidakpastian pengukuran.

## Fitur Utama

### 1. Database Instrumen
- ✅ Kelola instrumen kalibrasi dengan informasi lengkap
- ✅ Tambah, edit, dan hapus instrumen
- ✅ Setiap instrumen mencakup:
  - Nama Instrumen
  - Brand
  - Tipe/Model
  - Nomor Seri
  - Besaran Ukur (Measurement Quantities)
  - Rentang Ukur (Measurement Ranges)
  - CMC (Calibration and Measurement Capability)
  - Drift
  - Calibration Uncertainty
- ✅ Data disimpan di local storage browser
- ✅ Contoh data instrumen otomatis tersedia

### 2. Kalkulator Budget Ketidakpastian
- ✅ Workflow pemilihan besaran ukur dan rentang pengukuran
- ✅ Tabel perhitungan otomatis dengan komponen default:
  - Sertifikat Kalibrasi Standar
  - Drift
  - Resolusi / Readability
  - Repeatability
- ✅ Tambah komponen kustom sesuai kebutuhan
- ✅ Perhitungan otomatis untuk:
  - Divisor (berdasarkan distribusi)
  - Ui (Uncertainty)
  - Ci (Sensitivity Coefficient)
  - UiCi
  - (UiCi)²
  - (UiCi)⁴/ni
- ✅ Hasil perhitungan:
  - Combined Standard Uncertainty (uc)
  - Effective Degrees of Freedom (veff)
  - Coverage Factor (k)
  - Expanded Uncertainty (U)

### 3. Template Management
- ✅ Simpan konfigurasi perhitungan sebagai template
- ✅ Muat template yang sudah tersimpan
- ✅ Edit dan hapus template
- ✅ Template spesifik untuk setiap besaran ukur dan rentang
- ✅ Mode Edit untuk modifikasi komponen
- ✅ Mode Normal dengan nilai U yang dapat diedit

### 4. User Interface
- ✅ Antarmuka dalam Bahasa Indonesia
- ✅ Mode terang dan gelap
- ✅ Desain responsif
- ✅ Navigasi yang intuitif

## Teknologi

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Theme**: next-themes
- **Storage**: Local Storage API

## Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd calibration-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser di [http://localhost:3000](http://localhost:3000)

## Build untuk Production

```bash
npm run build
npm start
```

## Struktur Proyek

```
calibration-calculator/
├── app/
│   ├── calculator/          # Halaman kalkulator
│   ├── database/            # Halaman database instrumen
│   ├── providers/           # Theme provider
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── calculator/          # Komponen kalkulator
│   │   ├── calculator-workflow.tsx
│   │   ├── uncertainty-calculator.tsx
│   │   ├── calculation-table.tsx
│   │   └── template-manager.tsx
│   ├── database/            # Komponen database
│   │   ├── instrument-list.tsx
│   │   └── instrument-form.tsx
│   ├── navigation.tsx       # Navigasi utama
│   └── theme-toggle.tsx     # Toggle tema
├── lib/
│   ├── calculations.ts      # Fungsi perhitungan
│   ├── storage.ts           # Local storage utilities
│   └── sample-data.ts       # Data contoh
├── types/
│   └── index.ts             # TypeScript type definitions
└── public/                  # Static assets
```

## Cara Penggunaan

### Mengelola Database Instrumen

1. Klik **"Database Instrumen"** di navigasi
2. Klik **"Tambah Instrumen"** untuk menambah instrumen baru
3. Isi informasi instrumen:
   - Data dasar (nama, brand, tipe, nomor seri)
   - Tambah besaran ukur
   - Untuk setiap besaran ukur, tambah rentang pengukuran
   - Isi nilai CMC, Drift, dan Calibration Uncertainty
4. Klik **"Simpan"**
5. Edit atau hapus instrumen dengan tombol yang tersedia

### Menggunakan Kalkulator

1. Klik **"Kalkulator Budget Ketidakpastian"** di navigasi
2. Pilih **Besaran yang Diukur** (contoh: DC Voltmeter)
3. Pilih **Rentang Ukur** yang sesuai
4. Klik **"Tampilkan Kalkulator"**
5. Masukkan nilai **U (Uncertainty)** untuk setiap komponen
6. Komponen default:
   - Sertifikat Kalibrasi Standar (Normal distribution)
   - Drift (Rectangular distribution)
   - Resolusi / Readability (Rectangular distribution)
   - Repeatability (Type A distribution)
7. Klik **"Tambah Komponen"** untuk menambah komponen kustom (dalam Mode Edit)
8. Lihat hasil perhitungan di bagian bawah

### Mengelola Template

1. Setelah mengkonfigurasi perhitungan, klik **"Kelola Template"**
2. Di tab **"Simpan Template"**:
   - Masukkan nama template
   - Klik **"Simpan Template Baru"**
3. Di tab **"Muat Template"**:
   - Lihat daftar template tersimpan
   - Klik ikon download untuk memuat template
   - Klik ikon trash untuk menghapus template
4. Gunakan **"Mode Edit"** untuk mengubah komponen, unit, atau distribusi
5. Gunakan **"Perhitungan Baru"** untuk memulai dari awal

## Distribusi Types

- **Normal**: Divisor = 2
- **Rectangular**: Divisor = 1.732
- **Type A**: Divisor = 1

## Formula Perhitungan

1. **Ui** = U / Divisor
2. **Ci** = 1 (selalu)
3. **UiCi** = Ui × Ci
4. **(UiCi)²** = UiCi²
5. **(UiCi)⁴/ni** = (UiCi)⁴ / ni

### Hasil Akhir:
- **uc** (Combined Standard Uncertainty) = √(Σ(UiCi)²)
- **veff** (Effective Degrees of Freedom) = uc⁴ / √(Σ((UiCi)⁴/ni))
- **k** (Coverage Factor) = 2
- **U** (Expanded Uncertainty) = k × uc

## Fitur Local Storage

Semua data disimpan secara lokal di browser Anda:
- Data instrumen: `calibration_instruments`
- Template: `uncertainty_templates`

Data tidak akan hilang kecuali Anda menghapus cache/storage browser.

## License

MIT
