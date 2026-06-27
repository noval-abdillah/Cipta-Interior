<?php
/**
 * admin.php — Panel Admin PT Jayainterior Berkah Selalu
 *
 * Perbaikan dari versi sebelumnya:
 *  ✅ [BUG FIX] Nama kolom: image_path → image_url + image_filename (sesuai database.sql)
 *  ✅ [SECURITY] Validasi MIME type sungguhan via finfo
 *  ✅ [SECURITY] Token CSRF untuk semua form POST
 *  ✅ [SECURITY] Session-based rate limiting untuk login
 *  ✅ [SECURITY] session_regenerate_id() setelah login berhasil
 *  ✅ [SECURITY] Auto-buat .htaccess pelindung di folder uploads/
 *  ✅ [FIX] htmlspecialchars di output, bukan sebelum insert DB
 *  ✅ [FEATURE] Hapus file fisik saat item dihapus dari DB
 *  ✅ [UI] Tampilkan daftar portofolio aktif dengan tombol hapus
 */

session_start();

/* ─── KONFIGURASI ─── */
define('DB_HOST',    'localhost');
define('DB_NAME',    'pt_parhan');
define('DB_USER',    'root');       // ← ganti di produksi
define('DB_PASS',    '');           // ← ganti di produksi
define('UPLOAD_DIR', __DIR__ . '/uploads/portfolio/');
define('UPLOAD_URL', 'uploads/portfolio/');
define('MAX_MB',     5);
define('MAX_ATTEMPTS', 5);
define('WINDOW_SECS',  300);

/* ─── KONEKSI DB ─── */
try {
    $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4', DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    die('Koneksi database gagal. Periksa konfigurasi di admin.php.');
}

/* ─── HELPERS ─── */
function csrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}
function verifyCsrf(): bool {
    $tok = $_POST['csrf_token'] ?? '';
    return !empty($tok) && hash_equals($_SESSION['csrf_token'] ?? '', $tok);
}
function checkRateLimit(): bool {
    $now = time();
    $attempts = array_filter($_SESSION['login_attempts'] ?? [], fn($t) => ($now - $t) < WINDOW_SECS);
    if (count($attempts) >= MAX_ATTEMPTS) return false;
    $attempts[] = $now;
    $_SESSION['login_attempts'] = array_values($attempts);
    return true;
}
function ensureUploadDir(): void {
    if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
    $htaccess = UPLOAD_DIR . '.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess,
            "Options -Indexes\n<FilesMatch \"\.(php|php5|phtml|cgi|pl)$\">\n  Deny from all\n</FilesMatch>");
    }
}
function e(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

/* ─── AKSI ─── */
$message = '';
$msgType = 'error';

// Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if (!verifyCsrf()) {
        $message = 'Token keamanan tidak valid. Muat ulang halaman dan coba lagi.';
    } elseif (!checkRateLimit()) {
        $message = 'Terlalu banyak percobaan. Tunggu ' . (WINDOW_SECS/60) . ' menit.';
    } else {
        $user = trim($_POST['username'] ?? '');
        $pass = $_POST['password'] ?? '';
        $stmt = $pdo->prepare("SELECT id, password FROM admins WHERE username = ? AND is_active = 1 LIMIT 1");
        $stmt->execute([$user]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($pass, $admin['password'])) {
            $_SESSION['login_attempts'] = [];
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $admin['id'];
            $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?")->execute([$admin['id']]);
            session_regenerate_id(true);
            header('Location: admin.php');
            exit;
        } else {
            password_hash('dummy_timing', PASSWORD_BCRYPT); // anti-timing attack
            $message = 'Username atau password salah.';
        }
    }
}

// Upload portfolio
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload']) && isset($_SESSION['admin_logged_in'])) {
    if (!verifyCsrf()) {
        $message = 'Token keamanan tidak valid.';
    } else {
        ensureUploadDir();
        $title    = trim($_POST['title']       ?? '');
        $desc     = trim($_POST['description'] ?? '');
        $category = trim($_POST['category']    ?? '');
        $validCats = ['residensial','komersial','restoran','hotel','furnitur'];

        if (!$title) {
            $message = 'Judul proyek wajib diisi.';
        } elseif (!in_array($category, $validCats)) {
            $message = 'Kategori tidak valid.';
        } elseif (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $message = 'File gambar wajib diunggah.';
        } elseif ($_FILES['image']['size'] > MAX_MB * 1024 * 1024) {
            $message = 'Ukuran file maksimal ' . MAX_MB . ' MB.';
        } else {
            $file = $_FILES['image'];
            $allowedMime = ['image/jpeg','image/png','image/webp','image/gif'];
            $finfo   = finfo_open(FILEINFO_MIME_TYPE);
            $mime    = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);

            if (!in_array($mime, $allowedMime)) {
                $message = 'Format tidak didukung. Gunakan JPG, PNG, atau WEBP.';
            } else {
                $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $ext      = in_array($ext, ['jpg','jpeg','png','webp','gif']) ? $ext : 'jpg';
                $filename = uniqid('pf_', true) . '.' . $ext;
                $dest     = UPLOAD_DIR . $filename;

                if (!move_uploaded_file($file['tmp_name'], $dest)) {
                    $message = 'Gagal menyimpan file. Periksa permission folder.';
                } else {
                    $imageUrl = UPLOAD_URL . $filename;
                    // ✅ BUG FIX: gunakan image_url + image_filename (sesuai schema database.sql)
                    $stmt = $pdo->prepare(
                        "INSERT INTO portfolio (title, category, description, image_url, image_filename, status, created_by, created_at)
                         VALUES (?, ?, ?, ?, ?, 'active', ?, NOW())"
                    );
                    $stmt->execute([$title, $category, $desc, $imageUrl, $filename, $_SESSION['admin_id'] ?? null]);
                    $message = 'Portofolio berhasil ditambahkan!';
                    $msgType = 'success';
                }
            }
        }
    }
}

// Hapus item
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id']) && isset($_SESSION['admin_logged_in'])) {
    if (!verifyCsrf()) {
        $message = 'Token keamanan tidak valid.';
    } else {
        $id = (int)($_POST['delete_id'] ?? 0);
        if ($id > 0) {
            $stmt = $pdo->prepare("SELECT image_filename, image_url FROM portfolio WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if ($row) {
                $filename = $row['image_filename'] ?: basename($row['image_url'] ?? '');
                $filePath = UPLOAD_DIR . $filename;
                if ($filename && file_exists($filePath)) {
                    unlink($filePath);
                }
                $pdo->prepare("DELETE FROM portfolio WHERE id = ?")->execute([$id]);
                $message = 'Item berhasil dihapus.';
                $msgType = 'success';
            } else {
                $message = 'Item tidak ditemukan.';
            }
        }
    }
}

// Ambil daftar portfolio
$portfolioItems = [];
if (isset($_SESSION['admin_logged_in'])) {
    $stmt = $pdo->query("SELECT id, title, category, image_url FROM portfolio WHERE status='active' ORDER BY created_at DESC");
    $portfolioItems = $stmt->fetchAll();
}

$csrf = csrfToken();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Admin Panel — PT Jayainterior Berkah Selalu</title>
    <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Segoe UI',sans-serif;background:#f0f2f0;min-height:100vh;padding:2rem 1rem}
        .wrap{max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem}
        .card{background:#fff;padding:1.75rem;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
        .brand{text-align:center;margin-bottom:1.5rem}
        .brand .logo{display:inline-flex;align-items:center;gap:10px;text-decoration:none}
        .brand .ico{width:40px;height:40px;background:#090805;display:flex;align-items:center;justify-content:center;
            font-family:serif;font-size:.95rem;font-weight:700;color:#c9a96e;border-radius:4px}
        .brand .nm{font-size:1rem;font-weight:700;color:#1a1a1a;line-height:1.1}
        .brand .sub{font-size:.65rem;letter-spacing:.12em;color:#c9a96e;text-transform:uppercase}
        h2{font-size:1.1rem;color:#1a1a1a;margin-bottom:1.25rem;padding-bottom:.6rem;border-bottom:2px solid #090805}
        h3{font-size:.875rem;color:#555;margin-bottom:.75rem;display:flex;align-items:center;gap:.4rem}
        .form-group{margin-bottom:.9rem}
        label{display:block;margin-bottom:.3rem;color:#555;font-size:.8rem;font-weight:600}
        input[type=text],input[type=password],select,textarea{
            width:100%;padding:.6rem .8rem;border:1.5px solid #e0e0e0;border-radius:6px;
            font-size:.9rem;transition:border-color .2s;font-family:inherit;color:#333}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#c9a96e}
        input[type=file]{font-size:.82rem;padding:.35rem 0;border:none;color:#555}
        .hint{font-size:.75rem;color:#999;margin-top:.2rem}
        .btn{width:100%;padding:.7rem;border:none;border-radius:6px;cursor:pointer;
            font-size:.9rem;font-weight:600;transition:all .2s;margin-top:.25rem}
        .btn-primary{background:#090805;color:#fff}
        .btn-primary:hover{background:#333}
        .msg{padding:.7rem 1rem;border-radius:6px;margin-bottom:1rem;font-size:.85rem;text-align:center;font-weight:500}
        .msg.error{background:#fde8e8;color:#c0392b;border:1px solid #f5c6cb}
        .msg.success{background:#e8f5e9;color:#2e7d32;border:1px solid #c8e6c9}
        .logout-link{display:block;text-align:center;margin-top:1rem;color:#e74c3c;
            text-decoration:none;font-size:.82rem;font-weight:500}
        .logout-link:hover{text-decoration:underline}
        .pf-list{display:flex;flex-direction:column;gap:.5rem;max-height:320px;overflow-y:auto}
        .pf-row{display:flex;align-items:center;gap:.75rem;padding:.6rem .75rem;
            background:#fafafa;border:1px solid #eee;border-radius:6px}
        .pf-thumb{width:48px;height:48px;object-fit:cover;border-radius:5px;flex-shrink:0;background:#eee}
        .pf-info{flex:1;min-width:0}
        .pf-info .nm{font-size:.85rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .pf-info .ct{font-size:.72rem;color:#888;text-transform:capitalize;margin-top:1px}
        .del-btn{flex-shrink:0;padding:.3rem .65rem;font-size:.75rem;font-weight:600;background:#fde8e8;
            color:#c0392b;border:1px solid #f5c6cb;border-radius:4px;cursor:pointer;transition:all .2s}
        .del-btn:hover{background:#c0392b;color:#fff}
        .pf-empty{text-align:center;color:#bbb;padding:2rem;font-size:.875rem}
        .count-badge{display:inline-flex;align-items:center;justify-content:center;
            background:#f0e8d5;color:#8a6c3a;font-size:.7rem;font-weight:700;
            min-width:20px;height:20px;padding:0 6px;border-radius:10px;margin-left:6px}
    </style>
</head>
<body>
<div class="wrap">

    <div class="brand">
        <a href="index.html" class="logo">
            <div class="ico">JB</div>
            <div>
                <div class="nm">PT Jayainterior</div>
                <div class="sub">Admin Panel</div>
            </div>
        </a>
    </div>

    <?php if (!isset($_SESSION['admin_logged_in'])): ?>

    <div class="card">
        <h2>🔒 Login Admin</h2>
        <?php if ($message): ?>
            <div class="msg <?= e($msgType) ?>"><?= e($message) ?></div>
        <?php endif; ?>
        <form method="POST" action="">
            <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autocomplete="username" autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            <button type="submit" name="login" class="btn btn-primary">Masuk</button>
        </form>
    </div>

    <?php else: ?>

    <!-- Card Upload -->
    <div class="card">
        <h2>➕ Upload Portofolio</h2>
        <?php if ($message): ?>
            <div class="msg <?= e($msgType) ?>"><?= e($message) ?></div>
        <?php endif; ?>
        <form method="POST" action="" enctype="multipart/form-data">
            <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>">
            <div class="form-group">
                <label for="title">Judul Proyek *</label>
                <input type="text" id="title" name="title" required placeholder="Contoh: Villa Modern Bintaro">
            </div>
            <div class="form-group">
                <label for="category">Kategori *</label>
                <select id="category" name="category" required>
                    <option value="">-- Pilih Kategori --</option>
                    <option value="residensial">Residensial</option>
                    <option value="komersial">Komersial</option>
                    <option value="restoran">Restoran &amp; Cafe</option>
                    <option value="hotel">Hotel</option>
                    <option value="furnitur">Furnitur</option>
                </select>
            </div>
            <div class="form-group">
                <label for="description">Deskripsi</label>
                <textarea id="description" name="description" rows="2" placeholder="Deskripsi singkat proyek…"></textarea>
            </div>
            <div class="form-group">
                <label for="image">Gambar Proyek * </label>
                <input type="file" id="image" name="image" accept="image/jpeg,image/png,image/webp" required>
                <div class="hint">JPG, PNG, WEBP — maksimal <?= MAX_MB ?> MB</div>
            </div>
            <button type="submit" name="upload" class="btn btn-primary">Upload &amp; Simpan</button>
        </form>
    </div>

    <!-- Card Kelola -->
    <div class="card">
        <h2>📁 Kelola Portofolio <span class="count-badge"><?= count($portfolioItems) ?></span></h2>
        <div class="pf-list">
            <?php if (empty($portfolioItems)): ?>
                <div class="pf-empty">Belum ada item portofolio.</div>
            <?php else: ?>
                <?php foreach ($portfolioItems as $item): ?>
                <div class="pf-row">
                    <img class="pf-thumb"
                         src="<?= e($item['image_url']) ?>"
                         alt="<?= e($item['title']) ?>"
                         onerror="this.style.opacity='.25'">
                    <div class="pf-info">
                        <div class="nm"><?= e($item['title']) ?></div>
                        <div class="ct"><?= e($item['category']) ?></div>
                    </div>
                    <form method="POST" action=""
                          onsubmit="return confirm('Hapus \'<?= addslashes(e($item['title'])) ?>\'?\nFile gambar juga akan ikut terhapus.')">
                        <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>">
                        <input type="hidden" name="delete_id" value="<?= (int)$item['id'] ?>">
                        <button type="submit" class="del-btn">Hapus</button>
                    </form>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        <a href="?action=logout" class="logout-link">Logout</a>
    </div>

    <?php endif; ?>

</div>
</body>
</html>