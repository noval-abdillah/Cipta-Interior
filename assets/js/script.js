/* ══════════════════════════════════════════════════════════════
   script.js — Cipta Interior
   Versi  : 2.1.0
   Updated: 2026-06-28
   Scripter : Neirvall
   ══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   1. CONFIG
   ══════════════════════════════════════════════════════════════ */
const API        = '/api/api.php';
const DEMO       = false;          // true = tampilkan data dummy saat API gagal
const PT_EFFECT  = 'tv';          // 'tv' | 'glitch' | 'fade'
const PT_DUR_IN  = 420;           // ms – durasi overlay masuk
const PT_DUR_OUT = 700;           // ms – durasi overlay keluar
const TS_W       = 360 + 24;      // lebar satu kartu testimonial + gap

/* ══════════════════════════════════════════════════════════════
   2. TERJEMAHAN (i18n)
   ══════════════════════════════════════════════════════════════ */
const T = {
  id: {
    'splash.welcome'      : '— Selamat Datang —',
    'splash.tag'          : 'Interior Contractor &amp; Design Solutions',
    'splash.loading'      : 'Memuat halaman…',
    'nav.home'            : 'Beranda',
    'nav.about'           : 'Tentang Kami',
    'nav.services'        : 'Layanan',
    'nav.portfolio'       : 'Portofolio',
    'nav.process'         : 'Cara Kerja',
    'nav.contact'         : 'Kontak',
    'nav.admin'           : 'Admin Login',
    'hero.label'          : 'Interior Contractor Professional',
    'hero.title'          : 'Ruang yang <em>Bercerita</em><br>Karya yang Abadi',
    'hero.desc'           : 'Kami merancang dan mewujudkan ruang interior yang mencerminkan karakter, keindahan, dan fungsi. Dari konsep hingga penyelesaian, kami hadir untuk Anda.',
    'hero.btn1'           : 'Lihat Portofolio',
    'hero.btn2'           : 'Konsultasi Gratis',
    'hero.stat1'          : 'Proyek Selesai',
    'hero.stat2'          : 'Tahun Pengalaman',
    'hero.stat3'          : 'Klien Puas (%)',
    'hero.scroll'         : 'Scroll',
    'about.label'         : 'Tentang Kami',
    'about.title'         : 'Kepercayaan yang<br><em class="g">Terbangun Bertahun-tahun</em>',
    'about.badge'         : 'Tahun<br>Berpengalaman',
    'about.desc1'         : 'Cipta Interior adalah perusahaan kontraktor interior terkemuka di Jakarta. Dengan pengalaman lebih dari 15 tahun, kami telah menyelesaikan lebih dari 250 proyek residensial mewah hingga komersial skala besar.',
    'about.desc2'         : 'Tim desainer berpengalaman dan tenaga ahli terlatih kami berkomitmen menghadirkan kualitas terbaik dalam setiap detail pekerjaan, tepat waktu, dan sesuai anggaran.',
    'about.val1t'         : 'Kualitas Premium',
    'about.val1d'         : 'Material pilihan, pengerjaan presisi tinggi',
    'about.val2t'         : 'Tepat Waktu',
    'about.val2d'         : 'Komitmen penyelesaian sesuai jadwal',
    'about.val3t'         : 'Desain Unik',
    'about.val3d'         : 'Setiap proyek dirancang khusus untuk Anda',
    'about.val4t'         : 'Bergaransi',
    'about.val4d'         : 'Garansi pengerjaan hingga 2 tahun',
    'sv.label'            : 'Layanan Kami',
    'sv.title'            : 'Solusi Interior<br><em class="g">Lengkap untuk Anda</em>',
    'sv.desc'             : 'Layanan terpadu dari konsultasi desain hingga eksekusi penuh oleh tim profesional.',
    'sv1.title'           : 'Interior Residensial',
    'sv1.desc'            : 'Wujudkan hunian impian dengan desain elegan yang mencerminkan kepribadian Anda.',
    'sv2.title'           : 'Interior Komersial',
    'sv2.desc'            : 'Ruang kantor dan bisnis yang dirancang untuk produktivitas dan profesionalisme.',
    'sv3.title'           : 'Furnitur Custom',
    'sv3.desc'            : 'Furnitur berkualitas tinggi, dibuat khusus sesuai dimensi dan kebutuhan ruang Anda.',
    'sv4.title'           : 'Restoran &amp; Cafe',
    'sv4.desc'            : 'Atmosfer kuliner yang menggugah selera dan menciptakan pengalaman makan tak terlupakan.',
    'sv5.title'           : 'Hotel &amp; Hospitality',
    'sv5.desc'            : 'Desain hotel bintang yang menciptakan pengalaman menginap tak terlupakan bagi tamu.',
    'sv6.title'           : 'Renovasi Total',
    'sv6.desc'            : 'Transformasi penuh ruangan lama menjadi baru dengan perencanaan dan eksekusi profesional.',
    'pf.label'            : 'Portofolio',
    'pf.title'            : 'Karya Terbaik<br><em class="g">yang Berbicara</em>',
    'pf.empty'            : 'Belum ada karya dalam kategori ini.',
    'pf.f.all'            : 'Semua',
    'pf.f.res'            : 'Residensial',
    'pf.f.kom'            : 'Komersial',
    'pf.f.rst'            : 'Restoran &amp; Cafe',
    'pf.f.htl'            : 'Hotel',
    'pf.f.fur'            : 'Furnitur',
    'st.s1'               : 'Proyek Selesai',
    'st.s2'               : 'Tahun Pengalaman',
    'st.s3'               : 'Klien Puas',
    'st.s4'               : 'Tim Profesional',
    'pr.label'            : 'Cara Kerja',
    'pr.title'            : 'Bagaimana Kami<br><em class="g">Bekerja untuk Anda</em>',
    'pr.s1t'              : 'Konsultasi Gratis',
    'pr.s1d'              : 'Diskusi awal tanpa biaya untuk memahami kebutuhan, selera, dan anggaran Anda',
    'pr.s2t'              : 'Desain Mock Up',
    'pr.s2d'              : 'Tim merancang sketsa awal dan mock up layout ruangan sesuai konsep yang disepakati',
    'pr.s3t'              : 'Deal Harga',
    'pr.s3d'              : 'Penawaran harga transparan dan negosiasi hingga tercapai kesepakatan terbaik',
    'pr.s4t'              : 'Presentasi 3D',
    'pr.s4d'              : 'Render 3D lengkap dengan pilihan material, warna, dan estimasi biaya final',
    'pr.s5t'              : 'Eksekusi',
    'pr.s5d'              : 'Pengerjaan oleh tenaga profesional berpengalaman dengan material premium',
    'pr.s6t'              : 'Serah Terima',
    'pr.s6d'              : 'Inspeksi menyeluruh, finishing sempurna, dan serah terima proyek bergaransi',
    'team.label'          : 'Tim Kami',
    'team.title'          : 'Para <em class="g">Ahli di Balik</em> Karya',
    'team.r1'             : 'Direktur Utama',
    'team.r2'             : 'Lead Interior Designer',
    'team.r3'             : 'Project Manager',
    'team.r4'             : 'Senior Architect',
    'ts.label'            : 'Testimonial',
    'ts.title'            : 'Kata Klien <em class="g">Kami</em>',
    'cta.label'           : 'Mulai Proyek Anda',
    'cta.title'           : 'Siap Wujudkan<br><em class="g">Ruang Impian Anda?</em>',
    'cta.desc'            : 'Hubungi kami sekarang untuk konsultasi gratis. Tim ahli kami siap membantu mewujudkan interior impian Anda dengan layanan terbaik dan anggaran yang transparan.',
    'cta.btn1'            : 'Hubungi Kami',
    'cta.btn2'            : 'WhatsApp',
    'co.label'            : 'Hubungi Kami',
    'co.title'            : 'Mari <em class="g">Berdiskusi</em>',
    'co.desc'             : 'Kami siap melayani konsultasi dan menjawab pertanyaan Anda kapan saja.',
    'co.addr.lbl'         : 'Alamat',
    'co.addr.val'         : 'Jl. Tarumajaya Raya No.12, Setiamulya, Kec. Tarumajaya, Kabupaten Bekasi, Jawa Barat 17213',
    'co.phone.lbl'        : 'Telepon',
    'co.hours.lbl'        : 'Jam Operasional',
    'co.hours.val'        : 'Senin – Sabtu: 08.00 – 17.00 WIB',
    'co.hours.val.short'  : 'Sen – Sab: 08.00 – 17.00',
    'co.form.label'       : 'Kirim Pesan',
    'co.form.title'       : 'Form <em class="g">Konsultasi</em>',
    'co.form.name'        : 'Nama Lengkap',
    'co.form.name.ph'     : 'Nama Anda',
    'co.form.email.ph'    : 'email@anda.com',
    'co.form.phone'       : 'Nomor Telepon',
    'co.form.service'     : 'Jenis Layanan',
    'co.form.service.ph'  : 'Pilih layanan…',
    'co.form.msg'         : 'Pesan',
    'co.form.msg.ph'      : 'Ceritakan kebutuhan proyek Anda…',
    'co.form.submit'      : 'Kirim Pesan',
    'ft.desc'             : 'Kontraktor interior terpercaya dengan 15 tahun pengalaman menghadirkan ruang yang indah, fungsional, dan berkarakter di seluruh Indonesia.',
    'ft.col1'             : 'Layanan',
    'ft.col2'             : 'Perusahaan',
    'ft.col3'             : 'Kontak',
    'ft.l.about'          : 'Tentang Kami',
    'ft.l.process'        : 'Cara Kerja',
    'ft.l.team'           : 'Tim Kami',
    'ft.copy'             : '© 2026 Cipta Interior. All rights reserved.',
    'ft.made'             : 'Designed with <span style="color:var(--gold)">♦</span> in Jakarta',
    'login.sub'           : 'Panel Admin',
    'login.title'         : 'Login <em style="font-style:italic;color:var(--gold)">Admin</em>',
    'login.err'           : 'Username atau password salah.',
    'login.user'          : 'Username',
    'login.pass'          : 'Password',
    'login.btn'           : 'Masuk',
    'adm.sub'             : 'Dashboard Admin',
    'adm.title'           : 'Panel <em style="font-style:italic;color:var(--gold)">Manajemen</em>',
    'adm.tab1'            : 'Upload Karya',
    'adm.tab2'            : 'Kelola Portofolio',
    'adm.up.hint'         : 'Klik atau seret &amp; lepas foto di sini',
    'adm.up.title.lbl'    : 'Judul Proyek',
    'adm.up.title.ph'     : 'Contoh: Villa Modern Bintaro',
    'adm.up.cat'          : 'Kategori',
    'adm.up.desc.lbl'     : 'Deskripsi Singkat',
    'adm.up.desc.ph'      : 'Deskripsi singkat proyek ini…',
    'adm.up.btn'          : 'Tambah ke Portofolio',
    'adm.total'           : 'Total:',
    'float.cta'           : 'Konsultasi Gratis',
    'toast.sent'          : 'Pesan berhasil terkirim!',
    'toast.fill'          : 'Isi nama dan email terlebih dahulu!',
    'toast.email'         : 'Format email tidak valid!',
    'toast.conn'          : 'Error koneksi!',
    'toast.added'         : 'Berhasil ditambahkan!',
    'toast.del'           : 'Dihapus!',
    'toast.fill.up'       : 'Masukkan judul proyek!',
    'toast.img'           : 'Pilih foto terlebih dahulu!',
    'toast.size'          : 'Ukuran file maksimal 5 MB!',
    'toast.imgonly'       : 'Hanya file gambar yang diizinkan!',
  },
  en: {
    'splash.welcome'      : '— Welcome —',
    'splash.tag'          : 'Interior Contractor &amp; Design Solutions',
    'splash.loading'      : 'Loading page…',
    'nav.home'            : 'Home',
    'nav.about'           : 'About Us',
    'nav.services'        : 'Services',
    'nav.portfolio'       : 'Portfolio',
    'nav.process'         : 'Our Process',
    'nav.contact'         : 'Contact',
    'nav.admin'           : 'Admin Login',
    'hero.label'          : 'Professional Interior Contractor',
    'hero.title'          : 'Spaces that <em>Speak</em><br>Craftsmanship that Lasts',
    'hero.desc'           : 'We design and realize interior spaces that reflect character, beauty, and function. From concept to completion, we are here for you.',
    'hero.btn1'           : 'View Portfolio',
    'hero.btn2'           : 'Free Consultation',
    'hero.stat1'          : 'Projects Done',
    'hero.stat2'          : 'Years of Experience',
    'hero.stat3'          : 'Client Satisfaction (%)',
    'hero.scroll'         : 'Scroll',
    'about.label'         : 'About Us',
    'about.title'         : 'Trust Built Over<br><em class="g">Many Years</em>',
    'about.badge'         : 'Years of<br>Experience',
    'about.desc1'         : 'Cipta Interior is a leading interior contractor company in Jakarta. With over 15 years of experience, we have completed more than 250 residential and large-scale commercial projects.',
    'about.desc2'         : 'Our experienced design team and skilled professionals are committed to delivering the highest quality in every detail, on time, and within budget.',
    'about.val1t'         : 'Premium Quality',
    'about.val1d'         : 'Selected materials, high-precision workmanship',
    'about.val2t'         : 'On Time',
    'about.val2d'         : 'Committed to meeting every schedule',
    'about.val3t'         : 'Unique Design',
    'about.val3d'         : 'Every project designed especially for you',
    'about.val4t'         : 'Guaranteed',
    'about.val4d'         : 'Workmanship warranty up to 2 years',
    'sv.label'            : 'Our Services',
    'sv.title'            : 'Complete Interior<br><em class="g">Solutions for You</em>',
    'sv.desc'             : 'Integrated services from design consultation to full execution by a professional team.',
    'sv1.title'           : 'Residential Interior',
    'sv1.desc'            : 'Create your dream home with elegant design that reflects your personality.',
    'sv2.title'           : 'Commercial Interior',
    'sv2.desc'            : 'Office and business spaces designed for productivity and professionalism.',
    'sv3.title'           : 'Custom Furniture',
    'sv3.desc'            : 'High-quality furniture, made specifically to your room\'s dimensions and needs.',
    'sv4.title'           : 'Restaurant &amp; Cafe',
    'sv4.desc'            : 'Culinary atmosphere that stimulates the senses and creates an unforgettable dining experience.',
    'sv5.title'           : 'Hotel &amp; Hospitality',
    'sv5.desc'            : 'Star hotel design creating unforgettable experiences for every guest.',
    'sv6.title'           : 'Total Renovation',
    'sv6.desc'            : 'Full transformation of old spaces with professional planning and execution.',
    'pf.label'            : 'Portfolio',
    'pf.title'            : 'Our Best<br><em class="g">Works</em>',
    'pf.empty'            : 'No works in this category yet.',
    'pf.f.all'            : 'All',
    'pf.f.res'            : 'Residential',
    'pf.f.kom'            : 'Commercial',
    'pf.f.rst'            : 'Restaurant &amp; Cafe',
    'pf.f.htl'            : 'Hotel',
    'pf.f.fur'            : 'Furniture',
    'st.s1'               : 'Projects Done',
    'st.s2'               : 'Years of Experience',
    'st.s3'               : 'Happy Clients',
    'st.s4'               : 'Professional Team',
    'pr.label'            : 'How We Work',
    'pr.title'            : 'How We<br><em class="g">Work for You</em>',
    'pr.s1t'              : 'Free Consultation',
    'pr.s1d'              : 'No-cost initial discussion to understand your needs, taste, and budget',
    'pr.s2t'              : 'Mock Up Design',
    'pr.s2d'              : 'Team drafts initial sketches and mock up layouts based on agreed concept',
    'pr.s3t'              : 'Price Agreement',
    'pr.s3d'              : 'Transparent pricing and negotiation until the best deal is reached',
    'pr.s4t'              : '3D Presentation',
    'pr.s4d'              : 'Full 3D render with material options, colors, and final cost estimates',
    'pr.s5t'              : 'Execution',
    'pr.s5d'              : 'Work carried out by experienced professionals with premium materials',
    'pr.s6t'              : 'Handover',
    'pr.s6d'              : 'Thorough inspection, perfect finishing, and guaranteed project handover',
    'team.label'          : 'Our Team',
    'team.title'          : 'The <em class="g">Experts Behind</em> Every Work',
    'team.r1'             : 'Managing Director',
    'team.r2'             : 'Lead Interior Designer',
    'team.r3'             : 'Project Manager',
    'team.r4'             : 'Senior Architect',
    'ts.label'            : 'Testimonials',
    'ts.title'            : 'What Our <em class="g">Clients</em> Say',
    'cta.label'           : 'Start Your Project',
    'cta.title'           : 'Ready to Create Your<br><em class="g">Dream Space?</em>',
    'cta.desc'            : 'Contact us now for a free consultation. Our expert team is ready to help realize your dream interior with the best service and a transparent budget.',
    'cta.btn1'            : 'Contact Us',
    'cta.btn2'            : 'WhatsApp',
    'co.label'            : 'Contact Us',
    'co.title'            : 'Let\'s <em class="g">Discuss</em>',
    'co.desc'             : 'We are ready to serve consultations and answer your questions anytime.',
    'co.addr.lbl'         : 'Address',
    'co.addr.val'         : 'Jl. Tarumajaya Raya No.12, Setiamulya, Kec. Tarumajaya, Kabupaten Bekasi, Jawa Barat 17213',
    'co.phone.lbl'        : 'Phone',
    'co.hours.lbl'        : 'Business Hours',
    'co.hours.val'        : 'Monday – Saturday: 08:00 – 17:00 WIB',
    'co.hours.val.short'  : 'Mon – Sat: 08:00 – 17:00',
    'co.form.label'       : 'Send Message',
    'co.form.title'       : 'Consultation <em class="g">Form</em>',
    'co.form.name'        : 'Full Name',
    'co.form.name.ph'     : 'Your Name',
    'co.form.email.ph'    : 'email@yours.com',
    'co.form.phone'       : 'Phone Number',
    'co.form.service'     : 'Service Type',
    'co.form.service.ph'  : 'Choose service…',
    'co.form.msg'         : 'Message',
    'co.form.msg.ph'      : 'Tell us about your project needs…',
    'co.form.submit'      : 'Send Message',
    'ft.desc'             : 'Trusted interior contractor with 15 years of experience delivering beautiful, functional, and characterful spaces across Indonesia.',
    'ft.col1'             : 'Services',
    'ft.col2'             : 'Company',
    'ft.col3'             : 'Contact',
    'ft.l.about'          : 'About Us',
    'ft.l.process'        : 'Our Process',
    'ft.l.team'           : 'Our Team',
    'ft.copy'             : '© 2026 Cipta Interior. All rights reserved.',
    'ft.made'             : 'Designed with <span style="color:var(--gold)">♦</span> in Jakarta',
    'login.sub'           : 'Admin Panel',
    'login.title'         : 'Admin <em style="font-style:italic;color:var(--gold)">Login</em>',
    'login.err'           : 'Incorrect username or password.',
    'login.user'          : 'Username',
    'login.pass'          : 'Password',
    'login.btn'           : 'Sign In',
    'adm.sub'             : 'Admin Dashboard',
    'adm.title'           : 'Management <em style="font-style:italic;color:var(--gold)">Panel</em>',
    'adm.tab1'            : 'Upload Work',
    'adm.tab2'            : 'Manage Portfolio',
    'adm.up.hint'         : 'Click or drag &amp; drop photo here',
    'adm.up.title.lbl'    : 'Project Title',
    'adm.up.title.ph'     : 'Example: Modern Villa Bintaro',
    'adm.up.cat'          : 'Category',
    'adm.up.desc.lbl'     : 'Brief Description',
    'adm.up.desc.ph'      : 'Brief description of this project…',
    'adm.up.btn'          : 'Add to Portfolio',
    'adm.total'           : 'Total:',
    'float.cta'           : 'Free Consultation',
    'toast.sent'          : 'Message sent successfully!',
    'toast.fill'          : 'Please fill in name and email!',
    'toast.email'         : 'Invalid email format!',
    'toast.conn'          : 'Connection error!',
    'toast.added'         : 'Successfully added!',
    'toast.del'           : 'Deleted!',
    'toast.fill.up'       : 'Please enter a project title!',
    'toast.img'           : 'Please select a photo first!',
    'toast.size'          : 'Maximum file size is 5 MB!',
    'toast.imgonly'       : 'Only image files are allowed!',
  }
};

/* ══════════════════════════════════════════════════════════════
   3. DATA DEMO (fallback saat API tidak tersedia)
   ══════════════════════════════════════════════════════════════ */
const DEMO_PF = [];

const DEMO_TS = {
  id: [
    { name:'Budi Santoso',   role:'CEO, PT Maju Bersama',      project:'Kantor Jakarta Selatan',  photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text:'Cipta Interior mengubah kantor kami menjadi ruang yang luar biasa. Tim profesional, tepat waktu, dan hasilnya melampaui ekspektasi kami.', stars:5 },
    { name:'Siti Rahayu',    role:'Pemilik Rumah, Bintaro',    project:'Villa Bintaro Sektor 9',   photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', text:'Kamar tidur dan ruang tamu kami kini terasa seperti hotel bintang lima. Desainernya sangat memahami selera dan kebutuhan kami.', stars:5 },
    { name:'Ahmad Wijaya',   role:'Owner, Restoran Nusantara', project:'Restoran 2 Lantai Depok',  photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text:'Restoran kami langsung ramai setelah direnovasi. Atmosfer yang mereka ciptakan benar-benar menambah nilai bisnis kami secara signifikan.', stars:5 },
    { name:'Dewi Handayani', role:'Direktur HR, Tech Corp',    project:'Kitchen Set Bekasi Barat', photo:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', text:'Proses kerja sangat terstruktur dan komunikatif. Setiap detail diperhatikan dengan seksama. Sangat puas dengan hasilnya!', stars:5 },
  ],
  en: [
    { name:'Budi Santoso',   role:'CEO, PT Maju Bersama',      project:'South Jakarta Office',     photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text:'Cipta Interior transformed our office into an extraordinary space. Professional team, on time, and the results exceeded our expectations.', stars:5 },
    { name:'Siti Rahayu',    role:'Homeowner, Bintaro',        project:'Villa Bintaro Sektor 9',   photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', text:'Our bedroom and living room now feel like a five-star hotel. The designer truly understood our taste and needs perfectly.', stars:5 },
    { name:'Ahmad Wijaya',   role:'Owner, Restoran Nusantara', project:'2-Floor Restaurant Depok', photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text:'Our restaurant has been packed since the renovation. The atmosphere they created truly added significant value to our business.', stars:5 },
    { name:'Dewi Handayani', role:'HR Director, Tech Corp',    project:'Kitchen Set West Bekasi',  photo:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', text:'The work process was very structured and communicative. Every detail was carefully considered. Highly satisfied with the results!', stars:5 },
  ]
};

/* ══════════════════════════════════════════════════════════════
   4. STATE GLOBAL
   ══════════════════════════════════════════════════════════════ */
let pf          = [];          // data portofolio dari API
let curF        = 'all';       // filter aktif
let tsOff       = 0;           // offset slide testimonial
let selFile     = null;        // file yang dipilih untuk upload
let loggedIn    = false;       // status login admin
let lbxIdx      = 0;           // lightbox current index
let lbxArr      = [];          // lightbox current array (filtered portfolio)

let currentLang  = localStorage.getItem('cipta_lang')  || 'id';
let currentTheme = localStorage.getItem('cipta_theme') || 'dark';

/* ══════════════════════════════════════════════════════════════
   5. UTILITAS
   ══════════════════════════════════════════════════════════════ */

/** Escape HTML untuk output aman */
function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Ambil terjemahan berdasarkan key */
function t(key) {
  return (T[currentLang] && T[currentLang][key] !== undefined)
    ? T[currentLang][key]
    : (T['id'][key] !== undefined ? T['id'][key] : key);
}

/* ══════════════════════════════════════════════════════════════
   6. TEMA
   ══════════════════════════════════════════════════════════════ */
function initTheme() {
  applyTheme(currentTheme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('cipta_theme', currentTheme);
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  const meta = document.querySelector('meta[name="theme-color"]');
  const color = theme === 'dark' ? '#090805' : '#faf7f2';
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  if (meta) meta.content  = color;
  const metaId = document.getElementById('meta-theme');
  if (metaId) metaId.content = color;
}

/* ══════════════════════════════════════════════════════════════
   7. BAHASA (i18n)
   ══════════════════════════════════════════════════════════════ */
function initLang() {
  applyLang(currentLang);
}

function toggleLang() {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  localStorage.setItem('cipta_lang', currentLang);
  applyLang(currentLang);
  renderTS();   // re-render testimonial dalam bahasa baru
}

function applyLang(lang) {
  const dict = T[lang];
  const label = document.getElementById('lang-label');
  if (label) label.textContent = lang.toUpperCase();
  document.documentElement.lang = lang;

  if (dict) {
    // Teks biasa
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    // Placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) el.placeholder = dict[key].replace(/&amp;/g, '&');
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   8. BOOT — window.load
   ══════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  initTheme();
  initLang();

  /* ── Splash: tunggu minimal 3800 ms ── */
  const _splashMinEnd = Date.now() + 3800;
  function dismissSplash() {
    const sp = document.getElementById('splash');
    if (!sp || sp._dismissed) return;
    const rem = _splashMinEnd - Date.now();
    if (rem > 0) { setTimeout(dismissSplash, rem); return; }
    sp._dismissed = true;
    sp.style.animation = 'splashOut .7s ease forwards';
    sp.addEventListener('animationend', () => sp.remove(), { once: true });
  }
  window._splashTimer = setTimeout(dismissSplash, 3800);

  /* ── Init modul ── */
  initCursor();
  initScroll();
  initReveal();
  initCounters();
  initBASlider();
  initDrag();
  initFileUpload();

  /* ── Portfolio ── */
  loadPF().then(dismissSplash);

  /* ── Filter portofolio ── */
  document.querySelectorAll('.pf-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pf-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      curF = btn.dataset.f;
      renderPF();
    });
  });

  /* ── Tutup modal saat klik backdrop ── */
  document.querySelectorAll('.modal-bg').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
  });

  /* ── Tutup lightbox saat klik backdrop ── */
  const lbx = document.getElementById('lbx');
  if (lbx) {
    lbx.addEventListener('click', e => { if (e.target === lbx) closeLbx(); });
  }

  /* ── Escape key: tutup semua overlay ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-bg.open').forEach(m => closeModal(m.id));
      closeLbx();
      closeNav();
    }
  });

  /* ── Testimonial ── */
  renderTS();
});

/* ══════════════════════════════════════════════════════════════
   9. CURSOR KUSTOM
   ══════════════════════════════════════════════════════════════ */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const c = document.getElementById('cur');
  const r = document.getElementById('cur-r');
  if (!c || !r) return;

  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    c.style.left = e.clientX + 'px';
    c.style.top  = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.14;
    ry += (e.clientY - ry) * 0.14;
  });

  (function tick() {
    r.style.left = rx + 'px';
    r.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a, button, .pf-item, .sv-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      c.style.transform = 'translate(-50%,-50%) scale(2.2)';
      r.style.opacity   = '.25';
    });
    el.addEventListener('mouseleave', () => {
      c.style.transform = 'translate(-50%,-50%) scale(1)';
      r.style.opacity   = '.5';
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   10. SCROLL — navbar + progress bar + tombol back-to-top
   ══════════════════════════════════════════════════════════════ */
function initScroll() {
  const nav = document.getElementById('nav');
  const tb  = document.getElementById('top-btn');
  const pb  = document.getElementById('progress-bar');
  let ticking = false;

  function onScroll() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('scrolled', scrolled > 80);
    if (tb)  tb.classList.toggle('vis', scrolled > 500);
    if (pb)  pb.style.width = (total > 0 ? (scrolled / total * 100) : 0) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  if (tb) tb.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════════════════════════════════════════════
   11. REVEAL ANIMATION (IntersectionObserver)
   ══════════════════════════════════════════════════════════════ */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const delay = el.classList.contains('d3') ? 300
                  : el.classList.contains('d2') ? 200
                  : el.classList.contains('d1') ? 100 : 0;
      setTimeout(() => el.classList.add('up'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.rv').forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   12. COUNTER ANIMASI
   ══════════════════════════════════════════════════════════════ */
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const tgt = +el.dataset.cnt;
      const dur = 1600;
      const step = tgt / (dur / 16);
      let cur = 0;
      const ti = setInterval(() => {
        cur += step;
        if (cur >= tgt) { cur = tgt; clearInterval(ti); }
        el.textContent = Math.floor(cur);
      }, 16);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-cnt]').forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   13. NAVIGASI MOBILE
   ══════════════════════════════════════════════════════════════ */
function openNav()  {
  const ol = document.getElementById('nav-ol');
  if (ol) { ol.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeNav() {
  const ol = document.getElementById('nav-ol');
  if (ol) { ol.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ══════════════════════════════════════════════════════════════
   14. MODAL
   ══════════════════════════════════════════════════════════════ */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ══════════════════════════════════════════════════════════════
   15. LIGHTBOX PORTOFOLIO
   ══════════════════════════════════════════════════════════════ */
function pfItemClick(el) {
  // Get current filtered array
  lbxArr = curF === 'all' ? pf : pf.filter(p => p.category === curF);
  
  // Find index in current array
  const clickedImg = el.dataset.img;
  lbxIdx = lbxArr.findIndex(item => item.image === clickedImg);
  if (lbxIdx === -1) lbxIdx = 0; // fallback
  
  // Open lightbox with current item
  const item = lbxArr[lbxIdx];
  openLbx(item.image, item.title, item.category, item.description || '');
}

function openLbx(img, title, cat, desc) {
  const lbx = document.getElementById('lbx');
  if (!lbx) return;

  const imgEl   = document.getElementById('lbx-img');
  const titleEl = document.getElementById('lbx-title');
  const catEl   = document.getElementById('lbx-cat');
  const descEl  = document.getElementById('lbx-desc');
  const tagCat  = document.getElementById('lbx-tag-cat');

  if (imgEl)   imgEl.src             = img  || '';
  if (titleEl) titleEl.textContent   = title || 'ciptainterior_';
  if (catEl)   catEl.textContent     = cat  || '';
  if (descEl)  descEl.textContent    = desc || '';
  if (tagCat)  tagCat.textContent    = cat ? '#' + cat.toLowerCase().replace(/\s+/g, '') : '#ciptainterior';

  lbx.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLbx() {
  const lbx = document.getElementById('lbx');
  if (lbx) { lbx.classList.remove('open'); document.body.style.overflow = ''; }
}

function lbxNav(dir) {
  if (!lbxArr.length) return;
  
  lbxIdx += dir;
  
  // Loop navigation
  if (lbxIdx < 0) lbxIdx = lbxArr.length - 1;
  if (lbxIdx >= lbxArr.length) lbxIdx = 0;
  
  const item = lbxArr[lbxIdx];
  if (item) {
    openLbx(item.image, item.title, item.category, item.description || '');
  }
}

/* ══════════════════════════════════════════════════════════════
   16. PORTFOLIO — load & render
   ══════════════════════════════════════════════════════════════ */
async function loadPF() {
  try {
    const r = await fetch(`${API}?action=get_portfolio`);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    pf = (d.success && Array.isArray(d.data)) ? d.data : (DEMO ? DEMO_PF : []);
  } catch {
    pf = DEMO ? DEMO_PF : [];
  }
  renderPF();
  updateAdmList();
}

function renderPF() {
  const g = document.getElementById('pf-grid');
  if (!g) return;

  const list = curF === 'all' ? pf : pf.filter(p => p.category === curF);

  if (!list.length) {
    g.innerHTML = `<div class="pf-empty"><i class="fas fa-images"></i>${t('pf.empty')}</div>`;
    return;
  }

  // Pola layout masonry: wide & tall bergantian
  const layouts = ['', 'wide', '', 'tall', '', ''];
  g.innerHTML = list.map((it, i) => {
    const cls = layouts[i % layouts.length];
    const fallback = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=60';
    return `<div class="pf-item ${cls}"
      data-img="${esc(it.image)}"
      data-title="${esc(it.title)}"
      data-cat="${esc(it.category)}"
      data-desc="${esc(it.description || '')}"
      onclick="pfItemClick(this)">
      <img src="${esc(it.image)}" alt="${esc(it.title)}" loading="lazy"
           onerror="this.onerror=null;this.src='${fallback}'">
      <div class="pf-item-ol">
        <div class="pf-item-cat">${esc(it.category)}</div>
        <div class="pf-item-name">${esc(it.title)}</div>
        <div class="pf-item-desc">${esc(it.description || '')}</div>
      </div>
      <div class="pf-eye"><i class="fas fa-expand"></i></div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   17. TESTIMONIAL
   ══════════════════════════════════════════════════════════════ */
function renderTS() {
  const tr = document.getElementById('ts-track');
  if (!tr) return;
  const data = DEMO_TS[currentLang] || DEMO_TS.id;

  tr.innerHTML = data.map((ts, i) => `
    <div class="ts-card${i === tsOff ? ' active' : ''}">
      <div class="ts-stars">${'★'.repeat(ts.stars)}</div>
      <div class="ts-q">"</div>
      <p class="ts-text">${esc(ts.text)}</p>
      <div class="ts-auth">
        <img class="ts-av-img" src="${esc(ts.photo)}" alt="${esc(ts.name)}"
             onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="ts-av" style="display:none">${ts.name.charAt(0)}</div>
        <div>
          <div class="ts-aname">${esc(ts.name)}</div>
          <div class="ts-arole">${esc(ts.role)}</div>
          <div class="ts-project">
            <i class="fas fa-home" style="margin-right:3px;font-size:.5rem"></i>${esc(ts.project)}
          </div>
        </div>
      </div>
    </div>`).join('');

  updateTS();
}

function updateTS() {
  const tr = document.getElementById('ts-track');
  if (!tr) return;
  tr.style.transform = `translateX(-${tsOff * TS_W}px)`;
  tr.querySelectorAll('.ts-card').forEach((c, i) => c.classList.toggle('active', i === tsOff));
}

function tsNav(dir) {
  const data = DEMO_TS[currentLang] || DEMO_TS.id;
  tsOff = Math.max(0, Math.min(tsOff + dir, data.length - 1));
  updateTS();
}

/* ══════════════════════════════════════════════════════════════
   18. DRAG TESTIMONIAL (touch & mouse)
   ══════════════════════════════════════════════════════════════ */
function initDrag() {
  const tw = document.querySelector('.ts-track-wrap');
  if (!tw) return;
  let sx = 0, dragging = false;

  tw.addEventListener('touchstart', e => { sx = e.touches[0].clientX; dragging = true; }, { passive: true });
  tw.addEventListener('touchend',   e => {
    if (!dragging) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) tsNav(dx < 0 ? 1 : -1);
    dragging = false;
  });
  tw.addEventListener('mousedown', e => { sx = e.clientX; dragging = true; });
  tw.addEventListener('mouseup',   e => {
    if (!dragging) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 40) tsNav(dx < 0 ? 1 : -1);
    dragging = false;
  });
}

/* ══════════════════════════════════════════════════════════════
   19. BEFORE / AFTER SLIDER
   ══════════════════════════════════════════════════════════════ */
function initBASlider() {
  const slider   = document.getElementById('ba-slider');
  const afterDiv = document.getElementById('ba-after-div');
  const afterImg = document.getElementById('ba-after-img');
  if (!slider || !afterDiv || !afterImg) return;

  function setPos(pct) {
    pct = Math.max(3, Math.min(97, pct));
    afterDiv.style.width = pct + '%';
    afterImg.style.width = slider.offsetWidth + 'px';
    afterImg.style.left  = '0px';
  }

  function getPercent(clientX) {
    const rect = slider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  // Set lebar awal gambar setelah layout selesai
  setTimeout(() => {
    afterImg.style.width    = slider.offsetWidth + 'px';
    afterImg.style.maxWidth = 'none';
  }, 100);

  let dragging = false;
  slider.addEventListener('mousedown',  e => { dragging = true; setPos(getPercent(e.clientX)); e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (dragging) setPos(getPercent(e.clientX)); });
  document.addEventListener('mouseup',   () => { dragging = false; });
  slider.addEventListener('touchstart',  e => { dragging = true; setPos(getPercent(e.touches[0].clientX)); }, { passive: true });
  document.addEventListener('touchmove', e => { if (dragging) setPos(getPercent(e.touches[0].clientX)); }, { passive: true });
  document.addEventListener('touchend',  () => { dragging = false; });
  window.addEventListener('resize', () => { afterImg.style.width = slider.offsetWidth + 'px'; });

  setPos(50);
}

/* ══════════════════════════════════════════════════════════════
   20. LOGIN ADMIN
   ══════════════════════════════════════════════════════════════ */
async function doLogin() {
  const u      = document.getElementById('lu');
  const p      = document.getElementById('lp');
  const btn    = document.getElementById('login-btn');
  const errBox = document.getElementById('login-err');
  if (!u || !p || !btn || !errBox) return;

  errBox.style.display = 'none';
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>';

  try {
    const r = await fetch(API, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ action: 'login', username: u.value.trim(), password: p.value })
    });
    const d = await r.json();
    if (d.success) {
      sessionStorage.setItem('cipta_tok', d.token || '');
      loggedIn = true;
      closeModal('m-login');
      openModal('m-admin');
      await loadPF(); // <--- PERBAIKAN: Muat ulang data portofolio setelah login
    } else {
      errBox.style.display = 'block';
    }
  } catch {
    // Fallback demo (HANYA jika DEMO=true, hindari di produksi)
    if (DEMO && u.value.trim() === 'admin' && p.value === 'admin123') {
      loggedIn = true;
      closeModal('m-login');
      openModal('m-admin');
      await loadPF(); // <--- PERBAIKAN: Muat ulang data portofolio setelah login
    } else {
      errBox.style.display = 'block';
    }
  }

  btn.disabled = false;
  btn.innerHTML = `<span data-i18n="login.btn">${t('login.btn')}</span> <i class="fas fa-sign-in-alt" style="margin-left:8px"></i>`;
}

function adminLogout() {
  loggedIn = false;
  sessionStorage.removeItem('cipta_tok');
  closeModal('m-admin');
}

/* ══════════════════════════════════════════════════════════════
   21. TAB ADMIN
   ══════════════════════════════════════════════════════════════ */
function adTab(name, el) {
  document.querySelectorAll('.adm-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.adm-pane').forEach(pane => pane.classList.remove('active'));
  el.classList.add('active');
  const pane = document.getElementById('adp-' + name);
  if (pane) pane.classList.add('active');
}

/* ══════════════════════════════════════════════════════════════
   22. FILE UPLOAD (drag & drop + input)
   ══════════════════════════════════════════════════════════════ */
function initFileUpload() {
  const area = document.getElementById('up-area');
  if (!area) return;

  area.addEventListener('dragover',  e => { e.preventDefault(); area.classList.add('over'); });
  area.addEventListener('dragleave', () => area.classList.remove('over'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('over');
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) {
      validateAndPreview(f);
    } else {
      showToast(t('toast.imgonly'), true);
    }
  });
  area.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') document.getElementById('fi-img')?.click();
  });
}

/** Dipanggil dari oninput="handleFile(this)" di HTML */
function handleFile(inp) {
  const f = inp.files[0];
  if (!f) return;
  if (f.size > 5 * 1024 * 1024) {
    showToast(t('toast.size'), true);
    inp.value = '';
    return;
  }
  validateAndPreview(f);
}

function validateAndPreview(f) {
  if (!f.type.startsWith('image/')) { showToast(t('toast.imgonly'), true); return; }
  if (f.size > 5 * 1024 * 1024)    { showToast(t('toast.size'), true);    return; }
  selFile = f;
  const prev   = document.getElementById('up-prev');
  const reader = new FileReader();
  reader.onload = e => {
    if (prev) { prev.src = e.target.result; prev.style.display = 'block'; }
  };
  reader.readAsDataURL(f);
}

/* ══════════════════════════════════════════════════════════════
   23. UPLOAD PORTOFOLIO
   ══════════════════════════════════════════════════════════════ */
async function uploadItem() {
  const titleEl = document.getElementById('up-title');
  const catEl   = document.getElementById('up-cat');
  const descEl  = document.getElementById('up-desc');
  const btn     = document.getElementById('upload-btn');
  if (!titleEl || !catEl || !btn) return;

  const title = titleEl.value.trim();
  const cat   = catEl.value;
  const desc  = descEl ? descEl.value.trim() : '';

  if (!title)   { showToast(t('toast.fill.up'), true); return; }
  if (!selFile) { showToast(t('toast.img'),     true); return; }

  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>';

  const fd = new FormData();
  fd.append('action',      'upload_portfolio');
  fd.append('title',       title);
  fd.append('category',    cat);
  fd.append('description', desc);
  fd.append('image',       selFile);
  fd.append('token',       sessionStorage.getItem('cipta_tok') || '');

  try {
    const r = await fetch(API, { method: 'POST', body: fd });
    const d = await r.json();
    if (d.success) {
      await loadPF();
      resetUpForm();
      showToast(t('toast.added'));
    } else {
      showToast(d.message || t('toast.conn'), true);
    }
  } catch {
    showToast(t('toast.conn'), true);
  }

  btn.disabled  = false;
  btn.innerHTML = `<i class="fas fa-plus" style="margin-right:8px"></i><span data-i18n="adm.up.btn">${t('adm.up.btn')}</span>`;
}

function resetUpForm() {
  const fields = ['up-title', 'up-desc'];
  fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const prev  = document.getElementById('up-prev');
  const input = document.getElementById('fi-img');
  if (prev)  prev.style.display = 'none';
  if (input) input.value = '';
  selFile = null;
}

/* ══════════════════════════════════════════════════════════════
   24. DAFTAR ADMIN PORTOFOLIO
   ══════════════════════════════════════════════════════════════ */
function updateAdmList() {
  const list = document.getElementById('adm-list');
  const cnt  = document.getElementById('adm-count');
  if (!list) return;
  if (cnt) cnt.textContent = pf.length;

  if (!pf.length) {
    list.innerHTML = `<div class="adm-loading">${currentLang === 'en' ? 'No items yet.' : 'Belum ada item.'}</div>`;
    return;
  }

  list.innerHTML = pf.map(it => `
    <div class="adm-item" id="ali-${Number(it.id)}">
      <img class="adm-thumb" src="${esc(it.image)}" alt="${esc(it.title)}"
           onerror="this.onerror=null;this.style.opacity='.3'">
      <div class="adm-info">
        <div class="nm">${esc(it.title)}</div>
        <div class="ct">${esc(it.category)}</div>
      </div>
      <button class="adm-del" onclick="delItem(${Number(it.id)})" title="Hapus">
        <i class="fas fa-trash"></i>
      </button>
    </div>`).join('');
}

async function delItem(id) {
  const msg = currentLang === 'en'
    ? 'Delete this item from portfolio?'
    : 'Hapus item ini dari portofolio?';
  if (!confirm(msg)) return;

  try {
    const r = await fetch(API, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ action: 'delete_portfolio', id, token: sessionStorage.getItem('cipta_tok') || '' })
    });
    const d = await r.json();
    if (d.success) {
      await loadPF();
      showToast(t('toast.del'));
    } else {
      showToast(d.message || t('toast.conn'), true);
    }
  } catch {
    showToast(t('toast.conn'), true);
  }
}

/* ══════════════════════════════════════════════════════════════
   25. FORM KONTAK
   ══════════════════════════════════════════════════════════════ */
async function submitContact() {
  const n = document.getElementById('cn')?.value.trim() || '';
  const e = document.getElementById('ce')?.value.trim() || '';
  const p = document.getElementById('cp')?.value.trim() || '';
  const s = document.getElementById('cs')?.value        || '';
  const m = document.getElementById('cm')?.value.trim() || '';

  if (!n || !e)                                    { showToast(t('toast.fill'),  true); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))      { showToast(t('toast.email'), true); return; }

  try {
    const r = await fetch(API, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ action: 'send_contact', name: n, email: e, phone: p, service: s, message: m })
    });
    const d = await r.json();
    if (d.success) {
      showToast(t('toast.sent'));
      ['cn', 'ce', 'cp', 'cm'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const cs = document.getElementById('cs');
      if (cs) cs.value = '';
    } else {
      showToast(d.message || t('toast.conn'), true);
    }
  } catch {
    showToast(t('toast.conn'), true);
  }
}

/* ══════════════════════════════════════════════════════════════
   26. TOAST NOTIFIKASI
   ══════════════════════════════════════════════════════════════ */
function showToast(msg, err = false) {
  const tt = document.getElementById('toast');
  if (!tt) return;
  const icon = err ? 'fa-exclamation' : 'fa-check';
  tt.innerHTML  = `<span class="toast-icon"><i class="fas ${icon}"></i></span><span class="toast-msg">${msg}</span>`;
  tt.className  = err ? 'err' : '';
  tt.classList.add('show');
  clearTimeout(tt._timer);
  tt._timer = setTimeout(() => tt.classList.remove('show'), 3800);
}

/* ══════════════════════════════════════════════════════════════
   27. PAGE TRANSITION SYSTEM
   Menangani DUA jenis navigasi:
   A) Link antar halaman (.html)  → animasi keluar lalu pindah halaman
   B) Anchor sama halaman (#id)   → animasi lalu smooth scroll
   Efek: 'tv' | 'glitch' | 'fade'  (diatur via PT_EFFECT di atas)
   ══════════════════════════════════════════════════════════════ */
(function initPageTransition() {

  /* ── Buat overlay ── */
  function buildOverlay() {
    const old = document.getElementById('pt-overlay');
    if (old) old.remove();

    const ov = document.createElement('div');
    ov.id = 'pt-overlay';
    ov.classList.add('fx-' + PT_EFFECT);

    if (PT_EFFECT === 'glitch') {
      const shifts = [-10, 14, -6, 20, -16, 8, -12, 18, -4, 10];
      const delays = [0, .025, .01, .04, .015, .03, .008, .02, .05, .012];
      let top = 0;
      for (let i = 0; i < 10; i++) {
        const h  = i === 9 ? 100 - top : Math.round(6 + Math.random() * 6);
        const sl = document.createElement('div');
        sl.className = 'pt-slice';
        sl.style.cssText = `top:${top}%;height:${h}%;--sx:${shifts[i]}px;animation-delay:${delays[i]}s`;
        ov.appendChild(sl);
        top += h;
        if (top >= 100) break;
      }
      ['r', 'b'].forEach(c => {
        const rgb = document.createElement('div');
        rgb.className = 'pt-rgb ' + c;
        ov.appendChild(rgb);
      });
    }

    if (PT_EFFECT === 'fade') {
      ['top', 'bottom'].forEach(pos => {
        const c = document.createElement('div');
        c.className = 'pt-curtain ' + pos;
        ov.appendChild(c);
      });
    }

    document.body.prepend(ov);
    return ov;
  }

  /* ── Phase-IN: overlay menutupi layar, panggil onMid di tengah ── */
  window.gsapEnter = function (onMid) {
    return new Promise(resolve => {
      const ov = buildOverlay();
      requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('pt-phase-in')));
      setTimeout(() => { if (onMid) onMid(); }, PT_DUR_IN * 0.6);
      setTimeout(() => {
        ov.classList.remove('pt-phase-in');
        ov.classList.add('pt-phase-out');
        setTimeout(() => { ov.remove(); resolve(); }, PT_DUR_OUT + 80);
      }, PT_DUR_IN + 30);
    });
  };

  /* ── Animasi KELUAR lalu pindah ke URL ── */
  function navigateTo(url) {
    const ov = buildOverlay();
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('pt-phase-in')));
    // Simpan preferensi agar terbawa ke halaman baru
    localStorage.setItem('cipta_theme', currentTheme);
    localStorage.setItem('cipta_lang',  currentLang);
    setTimeout(() => { window.location.href = url; }, PT_DUR_IN + 30);
  }

  /* ── Entrance saat halaman dimuat ── */
  function playEntrance() {
    const ov = buildOverlay();
    if (PT_EFFECT === 'tv') {
      ov.style.transform = 'scaleY(1)';
    } else if (PT_EFFECT === 'fade') {
      const top = ov.querySelector('.pt-curtain.top');
      const bot = ov.querySelector('.pt-curtain.bottom');
      if (top) top.style.height = '50%';
      if (bot) bot.style.height = '50%';
    } else if (PT_EFFECT === 'glitch') {
      ov.querySelectorAll('.pt-slice').forEach(s => { s.style.transform = 'scaleX(1)'; });
      ov.querySelectorAll('.pt-rgb').forEach(r => { r.style.opacity = '1'; });
    }
    setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ov.classList.add('pt-phase-out');
        setTimeout(() => { if (ov.parentNode) ov.remove(); }, PT_DUR_OUT + 100);
      }));
    }, 200);
  }

  /* ── Tangani SEMUA klik link via event delegation ── */
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    // Abaikan: tab baru, link eksternal, protokol khusus, clients overlay
    if (link.target === '_blank') return;
    if (/^(https?:|\/\/|mailto:|tel:|javascript:)/.test(href)) return;
    if (href === '#clients') return;

    // ── A) Navigasi ke halaman HTML lain ──
    // Deteksi: mengandung .html ATAU tidak dimulai dengan # dan bukan ?
    const isPage = href.includes('.html') ||
                   (!href.startsWith('#') && !href.startsWith('?') && href.length > 1);

    if (isPage) {
      e.preventDefault();
      closeNav();
      navigateTo(href);
      return;
    }

    // ── B) Anchor di halaman yang sama ──
    if (href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeNav();
      window.gsapEnter(() => {
        target.scrollIntoView({ behavior: 'instant' });
        window.scrollBy(0, -76);
      });
    }
  });

  /* ── Entrance: halaman index tunggu splash, halaman lain langsung ── */
  if (document.getElementById('splash')) {
    // index.html — splash berlangsung 3800ms
    setTimeout(playEntrance, 4100);
  } else {
    // about.html, services.html, dll — langsung buka
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(playEntrance, 80));
    } else {
      setTimeout(playEntrance, 80);
    }
  }

})();

/* ══════════════════════════════════════════════════════════════
   28. REVEAL ANIMATION SEKUNDER (dipakai oleh halaman lain)
   IntersectionObserver sederhana tanpa GSAP
   ══════════════════════════════════════════════════════════════ */
(function initRevealAnimations() {
  function run() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el    = e.target;
        const delay = el.classList.contains('d3') ? 300
                    : el.classList.contains('d2') ? 200
                    : el.classList.contains('d1') ? 100 : 0;
        setTimeout(() => el.classList.add('up'), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();

/* ══════════════════════════════════════════════════════════════
   29. CLIENTS OVERLAY (GSAP animated)
   ══════════════════════════════════════════════════════════════ */
(function initClientsOverlay() {

  const overlay   = document.getElementById('clients-overlay');
  const closeBtn  = document.getElementById('cl-ov-close');
  const header    = overlay ? overlay.querySelector('.cl-ov-header')  : null;
  const marqueeEl = overlay ? overlay.querySelector('.cl-ov-marquee') : null;
  const cards     = overlay ? overlay.querySelectorAll('.cl-ov-card') : [];
  const trust     = overlay ? overlay.querySelector('.cl-ov-trust')   : null;
  let isOpen = false;

  // Hanya jalankan jika GSAP tersedia
  if (typeof gsap === 'undefined' || !overlay) return;

  function buildOpenTl() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(header,    { opacity: 1, y: 0, duration: .6 }, .1)
      .to(marqueeEl, { opacity: 1, y: 0, duration: .5 }, .25)
      .to(cards,     { opacity: 1, y: 0, duration: .55, stagger: .07 }, .3)
      .to(trust,     { opacity: 1, y: 0, duration: .5 }, .55);
    return tl;
  }

  function buildCloseTl(onComplete) {
    const tl = gsap.timeline({ onComplete, defaults: { ease: 'power3.in' } });
    tl.to([trust, marqueeEl], { opacity: 0, y: 15, duration: .25, stagger: .05 })
      .to(cards,  { opacity: 0, y: 20, duration: .3, stagger: .04 }, '-=.2')
      .to(header, { opacity: 0, y: 20, duration: .3 }, '-=.2');
    return tl;
  }

  function resetOverlayState() {
    gsap.set(header,    { opacity: 0, y: 30 });
    gsap.set(marqueeEl, { opacity: 0, y: 20 });
    gsap.set(cards,     { opacity: 0, y: 40 });
    gsap.set(trust,     { opacity: 0, y: 20 });
  }

  window.openClientsOverlay = function (e) {
    if (e) e.preventDefault();
    if (isOpen) return;
    isOpen = true;

    resetOverlayState();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const layers = document.querySelectorAll('#gsap-curtain .gc-layer');
    const brand  = document.querySelector('#gsap-curtain .gc-brand');

    const tl = gsap.timeline();
    tl.set(layers, { yPercent: 100 })
      .set(brand,  { opacity: 0 })
      .to(layers[0], { yPercent: 0, duration: .4, ease: 'power3.inOut' })
      .to(layers[1], { yPercent: 0, duration: .4, ease: 'power3.inOut' }, '-=.3')
      .to(layers[2], { yPercent: 0, duration: .4, ease: 'power3.inOut' }, '-=.3')
      .to(layers,    { yPercent: -100, duration: .5, ease: 'power3.inOut', stagger: .06 }, '+=.05')
      .add(() => { buildOpenTl(); }, '-=.3');
  };

  window.closeClientsOverlay = function () {
    if (!isOpen) return;
    buildCloseTl(() => {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      isOpen = false;
      gsap.set(document.querySelectorAll('#gsap-curtain .gc-layer'), { yPercent: 100 });
    });
  };

  if (closeBtn) closeBtn.addEventListener('click', window.closeClientsOverlay);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) window.closeClientsOverlay();
  });

  // Flip kartu saat diklik (mobile-friendly)
  overlay.addEventListener('click', function (e) {
    const card = e.target.closest('.cl-ov-card');
    if (card && !e.target.closest('.cl-ov-close')) {
      card.classList.toggle('flipped');
    }
  });

  /** Ganti placeholder logo dengan gambar nyata.
   *  Panggil dari HTML: window.setClientLogo('1', 'path/logo.png') */
  window.setClientLogo = function (clientId, imgSrc) {
    const box = document.getElementById('cl-logo-' + clientId);
    if (box) box.innerHTML = `<img src="${imgSrc}" alt="Client Logo">`;
  };

})();

/* ══════════════════════════════════════════════════════════════
   MOBILE & PERFORMANCE OPTIMIZATIONS v2.1
   ══════════════════════════════════════════════════════════════ */

/* ── 1. SWIPE GESTURE untuk Lightbox (Android/iPhone) ── */
(function initLightboxSwipe() {
  const lbx = document.getElementById('lbx');
  if (!lbx) return;

  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50;

  lbx.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lbx.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    // Hanya swipe horizontal yang dihitung
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0 && typeof lbxNav === 'function') lbxNav(1);   // swipe kiri → next
      if (dx > 0 && typeof lbxNav === 'function') lbxNav(-1);  // swipe kanan → prev
    }
  }, { passive: true });
})();

/* ── 2. SWIPE GESTURE untuk Testimonial Slider ── */
(function initTestimonialSwipe() {
  const track = document.querySelector('.ts-track');
  if (!track) return;

  let startX = 0;
  const THRESHOLD = 40;

  track.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - startX;
    if (Math.abs(dx) > THRESHOLD) {
      if (dx < 0 && typeof tsNext === 'function') tsNext();
      if (dx > 0 && typeof tsPrev === 'function') tsPrev();
    }
  }, { passive: true });
})();

/* ── 3. PREVENT DOUBLE-TAP ZOOM pada tombol di iOS ── */
(function preventDoubleTapZoom() {
  let lastTap = 0;
  document.addEventListener('touchend', e => {
    const now = Date.now();
    const el  = e.target.closest('button, a, .btn-g, .btn-o, .pf-filter');
    if (el && now - lastTap < 300) e.preventDefault();
    lastTap = now;
  }, { passive: false });
})();

/* ── 4. LAZY LOAD IMAGES dengan IntersectionObserver ── */
(function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }
      observer.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });

  document.querySelectorAll('img[data-src]').forEach(img => io.observe(img));
})();

/* ── 5. PERBAIKI SCROLL pada Nav Overlay di iOS ── */
(function fixNavOverlayScroll() {
  const navOl = document.getElementById('nav-ol');
  if (!navOl) return;

  let startY = 0;
  navOl.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
  }, { passive: true });

  navOl.addEventListener('touchmove', e => {
    const { scrollTop, scrollHeight, clientHeight } = navOl;
    const currentY = e.touches[0].clientY;
    const isAtTop = scrollTop === 0 && currentY > startY;
    const isAtBot = scrollTop + clientHeight >= scrollHeight && currentY < startY;
    if (isAtTop || isAtBot) e.preventDefault();
  }, { passive: false });
})();

/* ── 6. META THEME-COLOR dinamis saat dark/light toggle ── */
// Sudah ditangani oleh applyTheme() di atas — ini sebagai safeguard
(function ensureThemeColor() {
  const saved = localStorage.getItem('cipta_theme');
  const meta  = document.querySelector('meta[name="theme-color"]');
  if (meta && saved) {
    meta.content = saved === 'dark' ? '#090805' : '#2a7fd4';
  }
})();

/* ── 7. PERFORMANCE: debounce resize handler ── */
(function initResponsiveHandler() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Re-init testimonial width jika viewport berubah (mis. orientasi HP)
      if (typeof renderTS === 'function') renderTS();
    }, 250);
  }, { passive: true });
})();

/* ── 8. CONTACT FORM — validasi & UX mobile ── */
window.submitContact = window.submitContact || function submitContact() {
  const name  = (document.getElementById('cn')  || {}).value || '';
  const email = (document.getElementById('ce')  || {}).value || '';
  const phone = (document.getElementById('cp')  || {}).value || '';
  const svc   = (document.getElementById('cs')  || {}).value || '';
  const msg   = (document.getElementById('cm')  || {}).value || '';

  // Validasi dasar
  if (!name.trim() || !email.trim()) {
    showToast(t('toast.fill'));
    return;
  }
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) {
    showToast(t('toast.email'));
    return;
  }

  // Bangun pesan WhatsApp sebagai fallback jika tidak ada API
  const waMsg = encodeURIComponent(
    `Halo Cipta Interior,\n\nNama: ${name}\nEmail: ${email}\nTelp: ${phone}\nLayanan: ${svc}\n\n${msg}`
  );

  // Coba kirim ke API jika tersedia
  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'contact', name, email, phone, service: svc, message: msg })
  })
  .then(r => r.json())
  .then(d => {
    if (d.ok) {
      showToast(t('toast.sent'));
      ['cn','ce','cp','cs','cm'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    } else {
      window.open(`https://wa.me/6285890060856?text=${waMsg}`, '_blank');
    }
  })
  .catch(() => {
    // Jika API tidak ada, langsung buka WhatsApp
    window.open(`https://wa.me/6285890060856?text=${waMsg}`, '_blank');
  });
};