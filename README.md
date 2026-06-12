# Cipta Interior — Custom Furniture & Kitchen Set Bekasi

Cipta Interior adalah website profil bisnis profesional sekaligus platform manajemen portofolio interaktif untuk penyedia jasa desain interior dan kontraktor pembuatan kitchen set custom di wilayah Bekasi, Cikarang, dan Jabodetabek.

Website ini dirancang secara premium dengan visual estetik modern, transisi halus (*micro-animations*), serta dioptimalkan secara mendalam untuk performa tinggi dan keunggulan SEO lokal (*Local SEO*) guna bersaing di peringkat teratas mesin pencari.

---

## 🚀 Fitur Utama

### 1. Desain Frontend Premium
* **Interaktivitas Modern:** Slider sebelum-sesudah (*before-after slider*), galeri portofolio dinamis dengan filter kategori, testimonial slider, dan transisi hover yang memukau.
* **Aksesibilitas & Kompatibilitas:** Lulus audit aksesibilitas (A11y), dilengkapi penutup tag modal ramah *screen-reader*, serta mendukung rendering blur backdrop (`backdrop-filter`) di semua browser utama termasuk Safari.
* **Geo-Targeting Meta Tags:** Dilengkapi tag koordinat geografis presisi workshop (Tarumajaya, Bekasi) untuk mendominasi pencarian lokal.

### 2. Panel Admin & Backend API Aman
* **Manajemen Portofolio Mandiri:** Panel admin (`/admin/admin.php`) memungkinkan pemilik bisnis mengunggah hasil proyek terbaru tanpa menyentuh kode HTML.
* **Keamanan Maksimal:** API backend (`/api/api.php`) dilindungi oleh sistem token **JWT (JSON Web Token)**, pembatasan laju percobaan masuk (*Rate Limiting*), proteksi CORS, dan verifikasi MIME unggahan gambar yang sangat ketat (maksimal 5MB).

### 3. Struktur SEO & Integrasi Blog Lokal
* **Optimasi Schema JSON-LD Google:** Terdapat data terstruktur terperinci dari Google (`HomeAndConstructionBusiness` & `WebSite` Schema) untuk mendaftarkan nama situs kustom *"Cipta Interior"* dan memunculkan rating bintang di halaman hasil pencarian.
* **Halaman Blog SEO Lokal:** Dilengkapi direktori `/blog/` dengan artikel ramah perayap target Bekasi/Cikarang guna membangun *Domain Authority* organik.
* **Robots & Sitemap:** Berkas `robots.txt` ramah terhadap bot pencari AI terbaru (seperti ChatGPT, Perplexity, Googlebot) dan `sitemap.xml` yang valid tanpa error parsing.

---

## 📁 Struktur Folder Proyek

```bash
├── admin/
│   ├── admin.php           # Panel Dashboard Manajemen Portofolio
│   └── .htaccess           # Proteksi keamanan akses direktori admin
├── api/
│   ├── api.php             # Jantung API (Login, JWT Auth, Database, Fetch/Upload)
│   └── .htaccess           # Pengaturan izin Header & CORS
├── assets/
│   ├── css/
│   │   └── style.css       # File style utama (Layout, Animasi, Media Query)
│   ├── js/
│   │   └── script.js       # Logika Frontend (Slider, Navigasi, Render AJAX)
│   └── img/                # Aset logo, ikon, dan gambar statis
├── blog/                   # Direktori Artikel Blog SEO Lokal
│   ├── harga-kitchen-set-bekasi-2026.html
│   ├── jasa-interior-cikarang.html
│   └── kitchen-set-hpl-vs-kayu-solid.html
├── uploads/
│   └── portfolio/          # Direktori penyimpanan gambar portofolio hasil unggahan admin
├── index.html              # Halaman Utama (Homepage)
├── about.html              # Halaman Tentang Kami
├── services.html           # Halaman Layanan
├── portofolio.html         # Halaman Galeri Portofolio Lengkap
├── client.html             # Halaman Klien / Ulasan
├── contact.html            # Halaman Hubungi Kami
├── sitemap.xml             # XML Peta Situs untuk Google Search Console
├── robots.txt              # Aturan Akses Mesin Pencari & Bot AI
└── googlecbac9b8989967e25.html # Berkas Verifikasi Kepemilikan Google
```

---

## 🛠️ Persyaratan Sistem & Deploy

* **Web Server:** Apache (disarankan karena didukung berkas `.htaccess` konfigurasi penulisan ulang URL).
* **PHP Version:** PHP 7.4 ke atas.
* **Database:** MySQL / MariaDB (Konfigurasi koneksi diatur pada konstanta awal berkas `api/api.php`).
* **Hosting:** Kompatibel dengan semua jenis hosting cPanel maupun hosting gratis seperti InfinityFree.

---

## ✍️ Kontributor & Pengembang
* **Noval Abdillah** (Pemilik Repositori & Pengembang Utama)
