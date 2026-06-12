<?php
/**
 * api.php — Backend API Cipta Interior
 * Fix: UPLOAD_DIR dipindah ke htdocs/uploads/portfolio/ (bukan di dalam folder api/)
 *      CORS diperluas untuk mendukung semua kondisi request
 *      Password hash di-reset via SQL terpisah
 */

/* ════════════════════════════════════════════
   KONFIGURASI
   ════════════════════════════════════════════ */
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
} else {
    // Default/fallback jika dikloning dari repo GitHub publik tanpa config.php
    define('DB_HOST',    'localhost');
    define('DB_NAME',    'pt_ciptainterior');
    define('DB_USER',    'root');
    define('DB_PASS',    '');
    define('JWT_SECRET', 'placeholder_sec_key_please_change_for_production_env');
}

define('DB_CHARSET', 'utf8mb4');
define('JWT_EXPIRE', 3600 * 8);

// FIX: UPLOAD_DIR sekarang di htdocs/uploads/portfolio/ — bukan di dalam api/
define('UPLOAD_DIR', dirname(__DIR__) . '/uploads/portfolio/');
define('UPLOAD_URL', 'https://ciptainterior.rf.gd/uploads/portfolio/');

define('MAX_FILE_SIZE', 5 * 1024 * 1024);
define('ALLOWED_MIME', ['image/jpeg','image/png','image/webp','image/gif']);
define('RATE_LIMIT_LOGIN', 10);

/* ═══════════════════════════════════════════
   HEADER & CORS
   ═══════════════════════════════════════════ */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

$allowed_origins = [
    'https://ciptainterior.rf.gd',
    'https://www.ciptainterior.rf.gd',
    'http://localhost',
    'http://127.0.0.1',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
} elseif (!$origin) {
    // Request langsung tanpa origin header — izinkan (misal dari PHP internal)
    header('Access-Control-Allow-Origin: *');
} else {
    http_response_code(403);
    echo json_encode(['success'=>false,'message'=>'Forbidden origin']);
    exit;
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ═══════════════════════════════════════════
   BUAT FOLDER UPLOAD + .htaccess PERMISSIVE
   ═══════════════════════════════════════════ */
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Tulis .htaccess di uploads/ dan uploads/portfolio/ agar gambar bisa diakses langsung
$_htaccess_allow =
    "Options -Indexes\n" .
    "SetHandler default-handler\n" .
    "<IfModule mod_authz_core.c>\n    Require all granted\n</IfModule>\n" .
    "<IfModule mod_access_compat.c>\n    Order allow,deny\n    Allow from all\n</IfModule>\n";

$_uploads_dir = dirname(UPLOAD_DIR) . DIRECTORY_SEPARATOR;
@file_put_contents($_uploads_dir . '.htaccess', $_htaccess_allow);
@file_put_contents(UPLOAD_DIR    . '.htaccess', $_htaccess_allow);

/* ═══════════════════════════════════════════
   KONEKSI DATABASE
   ═══════════════════════════════════════════ */
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            respond(500, false, 'Koneksi database gagal: ' . $e->getMessage());
        }
    }
    return $pdo;
}

/* ═══════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════ */
function respond(int $code, bool $success, string $message, array $data = []): void {
    http_response_code($code);
    $res = ['success' => $success, 'message' => $message];
    if (!empty($data)) $res = array_merge($res, $data);
    echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonBody(): array {
    $raw     = file_get_contents('php://input');
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function clean(string $s): string {
    return htmlspecialchars(strip_tags(trim($s)), ENT_QUOTES, 'UTF-8');
}

function validEmail(string $e): bool {
    return (bool) filter_var($e, FILTER_VALIDATE_EMAIL);
}

/* ─── JWT ─── */
function jwtEncode(array $payload): string {
    $h   = base64url_encode(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $p   = base64url_encode(json_encode($payload));
    $sig = base64url_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    return "$h.$p.$sig";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $sig] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) return null;
    $data = json_decode(base64url_decode($p), true);
    if (!$data || (isset($data['exp']) && $data['exp'] < time())) return null;
    return $data;
}

function base64url_encode(string $d): string {
    return rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
}
function base64url_decode(string $d): string {
    return base64_decode(strtr($d, '-_', '+/') . str_repeat('=', (4 - strlen($d) % 4) % 4));
}

function getToken(array $body = []): string {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)$/i', $auth, $m)) return $m[1];
    return $body['token'] ?? '';
}

function requireAdmin(array $body = []): array {
    $token   = getToken($body);
    $payload = $token ? jwtDecode($token) : null;
    if (!$payload || !in_array($payload['role'] ?? '', ['admin','superadmin'])) {
        respond(401, false, 'Tidak terautentikasi. Silakan login ulang.');
    }
    return $payload;
}

/* ─── Rate Limiting ─── */
function checkRateLimit(string $action, string $ip): void {
    $db     = getDB();
    $now    = time();
    $window = 900;

    $db->prepare("DELETE FROM rate_limit WHERE created_at < ?")->execute([$now - $window]);

    $stmt = $db->prepare("SELECT COUNT(*) FROM rate_limit WHERE action=? AND ip=? AND created_at > ?");
    $stmt->execute([$action, $ip, $now - $window]);
    if ((int)$stmt->fetchColumn() >= RATE_LIMIT_LOGIN) {
        respond(429, false, 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.');
    }

    $db->prepare("INSERT INTO rate_limit (action, ip, created_at) VALUES (?,?,?)")
       ->execute([$action, $ip, $now]);
}

/* ═══════════════════════════════════════════
   ROUTER
   ═══════════════════════════════════════════ */
$method = $_SERVER['REQUEST_METHOD'];
$body   = [];
$action = '';

if ($method === 'GET') {
    $action = $_GET['action'] ?? '';
} elseif ($method === 'POST') {
    $body   = getJsonBody();
    $action = $body['action'] ?? ($_POST['action'] ?? '');
} else {
    respond(405, false, 'Metode tidak diizinkan.');
}

switch ($action) {
    case 'login':            handleLogin($body);             break;
    case 'get_portfolio':    handleGetPortfolio();           break;
    case 'upload_portfolio': handleUploadPortfolio();        break;
    case 'delete_portfolio': handleDeletePortfolio($body);   break;
    case 'send_contact':     handleSendContact($body);       break;
    case 'get_image':        handleGetImage();               break;
    default:
        respond(400, false, "Action '$action' tidak dikenal.");
}

/* ═══════════════════════════════════════════
   HANDLER: LOGIN
   ═══════════════════════════════════════════ */
function handleLogin(array $body): void {
    $ip       = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    checkRateLimit('login', $ip);

    $username = clean($body['username'] ?? '');
    $password = $body['password'] ?? '';

    if (!$username || !$password) {
        respond(400, false, 'Username dan password wajib diisi.');
    }

    $db   = getDB();
    $stmt = $db->prepare("SELECT id, username, password, role FROM admins WHERE username = ? AND is_active = 1 LIMIT 1");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password'])) {
        password_hash('dummy', PASSWORD_BCRYPT); // timing attack prevention
        respond(401, false, 'Username atau password salah.');
    }

    $payload = [
        'sub'      => $admin['id'],
        'username' => $admin['username'],
        'role'     => $admin['role'],
        'iat'      => time(),
        'exp'      => time() + JWT_EXPIRE,
    ];
    $token = jwtEncode($payload);

    $db->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?")->execute([$admin['id']]);

    respond(200, true, 'Login berhasil.', ['token' => $token, 'username' => $admin['username'], 'role' => $admin['role']]);
}

/* ═══════════════════════════════════════════
   HANDLER: GET IMAGE (PHP Proxy)
   FIX: serve langsung dari UPLOAD_DIR yang baru
   ═══════════════════════════════════════════ */
function handleGetImage(): void {
    // Hapus header JSON dulu
    header_remove('Content-Type');

    $f = basename($_GET['f'] ?? '');
    if (!$f || !preg_match('/^[\w\-]+\.(jpg|jpeg|png|webp|gif)$/i', $f)) {
        http_response_code(400); exit;
    }

    $path = UPLOAD_DIR . $f;
    if (!file_exists($path) || !is_file($path)) {
        http_response_code(404); exit;
    }

    $extMap = ['jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png','webp'=>'image/webp','gif'=>'image/gif'];
    $ext    = strtolower(pathinfo($f, PATHINFO_EXTENSION));
    $mime   = $extMap[$ext] ?? '';

    if (!$mime) { http_response_code(403); exit; }

    header('Content-Type: ' . $mime);
    header('Content-Length: ' . filesize($path));
    header('Cache-Control: public, max-age=31536000, immutable');
    header('X-Content-Type-Options: nosniff');
    readfile($path);
    exit;
}

/* ═══════════════════════════════════════════
   HANDLER: GET PORTFOLIO
   ═══════════════════════════════════════════ */
function imageProxyUrl(string $filename): string {
    // FIX: URL gambar langsung dari uploads/, tidak lewat proxy PHP lagi
    // karena folder uploads/ sudah punya .htaccess permissive
    return UPLOAD_URL . $filename;
}

function normalizeImageUrl(string $url): string {
    if (empty($url)) return '';
    $filename = basename(parse_url($url, PHP_URL_PATH) ?: $url);
    if (!$filename) return $url;
    return UPLOAD_URL . $filename;
}

function handleGetPortfolio(): void {
    $db   = getDB();
    $cat  = clean($_GET['category'] ?? '');
    $page = max(1, (int)($_GET['page'] ?? 1));
    $per  = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
    $off  = ($page - 1) * $per;

    $sql    = "SELECT id, title, category, description, image_url AS image, created_at FROM portfolio WHERE status='active'";
    $params = [];

    if ($cat) {
        $sql     .= " AND category = ?";
        $params[] = $cat;
    }

    $sql     .= " ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?";
    $params[] = $per;
    $params[] = $off;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $items = $stmt->fetchAll();

    $items = array_map(function ($row) {
        $row['image'] = normalizeImageUrl($row['image'] ?? '');
        return $row;
    }, $items);

    $countSql = "SELECT COUNT(*) FROM portfolio WHERE status='active'" . ($cat ? " AND category=?" : "");
    $cStmt    = $db->prepare($countSql);
    $cStmt->execute($cat ? [$cat] : []);
    $total = (int) $cStmt->fetchColumn();

    respond(200, true, '', [
        'data'      => $items,
        'total'     => $total,
        'page'      => $page,
        'per_page'  => $per,
        'last_page' => (int) ceil($total / $per),
    ]);
}

/* ═══════════════════════════════════════════
   HANDLER: UPLOAD PORTFOLIO
   ═══════════════════════════════════════════ */
function handleUploadPortfolio(): void {
    requireAdmin($_POST);

    $title    = clean($_POST['title']       ?? '');
    $category = clean($_POST['category']    ?? '');
    $desc     = clean($_POST['description'] ?? '');

    if (!$title)    respond(400, false, 'Judul proyek wajib diisi.');
    if (!$category) respond(400, false, 'Kategori wajib dipilih.');

    $validCats = ['residensial','komersial','restoran','hotel','furnitur'];
    if (!in_array($category, $validCats)) respond(400, false, 'Kategori tidak valid.');

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        respond(400, false, 'File gambar wajib diunggah.');
    }

    $file = $_FILES['image'];
    if ($file['size'] > MAX_FILE_SIZE) respond(400, false, 'Ukuran file maksimal 5 MB.');

    $extMap  = ['jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png','webp'=>'image/webp','gif'=>'image/gif'];
    $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (function_exists('finfo_open')) {
        $finfo    = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
    } else {
        $mimeType = $extMap[$fileExt] ?? 'application/octet-stream';
    }

    if (!in_array($mimeType, ALLOWED_MIME)) {
        respond(400, false, 'Format tidak didukung. Gunakan JPG, PNG, atau WEBP.');
    }

    $ext      = strtolower(in_array($fileExt, ['jpg','jpeg','png','webp','gif']) ? $fileExt : 'jpg');
    $filename = str_replace('.', '_', uniqid('pf_', true)) . '.' . $ext;
    $dest     = UPLOAD_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        respond(500, false, 'Gagal menyimpan file. Periksa permission folder uploads/.');
    }
    @chmod($dest, 0644);

    $imageUrl = 'uploads/portfolio/' . $filename;

    $db   = getDB();
    $stmt = $db->prepare(
        "INSERT INTO portfolio (title, category, description, image_url, image_filename, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'active', NOW())"
    );
    $stmt->execute([$title, $category, $desc, $imageUrl, $filename]);
    $newId = $db->lastInsertId();

    respond(201, true, 'Portofolio berhasil ditambahkan.', [
        'data' => [
            'id'          => $newId,
            'title'       => $title,
            'category'    => $category,
            'description' => $desc,
            'image'       => UPLOAD_URL . $filename,
        ]
    ]);
}

/* ═══════════════════════════════════════════
   HANDLER: DELETE PORTFOLIO
   ═══════════════════════════════════════════ */
function handleDeletePortfolio(array $body): void {
    requireAdmin($body);

    $id = (int)($body['id'] ?? 0);
    if (!$id) respond(400, false, 'ID tidak valid.');

    $db   = getDB();
    $stmt = $db->prepare("SELECT image_filename FROM portfolio WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();

    if (!$row) respond(404, false, 'Item tidak ditemukan.');

    $filePath = UPLOAD_DIR . $row['image_filename'];
    if ($row['image_filename'] && file_exists($filePath)) {
        unlink($filePath);
    }

    $db->prepare("DELETE FROM portfolio WHERE id = ?")->execute([$id]);
    respond(200, true, 'Item berhasil dihapus.');
}

/* ═══════════════════════════════════════════
   HANDLER: SEND CONTACT
   ═══════════════════════════════════════════ */
function handleSendContact(array $body): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    checkRateLimit('contact', $ip);

    $name    = clean($body['name']    ?? '');
    $email   = clean($body['email']   ?? '');
    $phone   = clean($body['phone']   ?? '');
    $service = clean($body['service'] ?? '');
    $message = clean($body['message'] ?? '');

    if (!$name)              respond(400, false, 'Nama wajib diisi.');
    if (!$email)             respond(400, false, 'Email wajib diisi.');
    if (!validEmail($email)) respond(400, false, 'Format email tidak valid.');

    $db   = getDB();
    $stmt = $db->prepare(
        "INSERT INTO contacts (name, email, phone, service, message, ip_address, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())"
    );
    $stmt->execute([$name, $email, $phone, $service, $message, $ip]);

    respond(201, true, 'Pesan Anda telah diterima. Kami akan segera menghubungi Anda.');
}