# 🚀 JobTracker – Lacak Semua Lamaran Kerjamu di Satu Tempat

## 📌 Deskripsi

**JobTracker** adalah aplikasi web yang dibuat khusus buat kamu yang lagi aktif cari kerja dan sering bingung buat manajemen semua lamaran yang udah dikirim. Daripada melakukan pencatatan manual di Excel atau catatan HP yang terkadang membuat pusing, sekarang kamu bisa simpan semuanya di satu tempat dengan rapi dan gampang diakses.

Dengan JobTracker, kamu bisa mencatat detail setiap lamaran: dari nama perusahaan, posisi yang dilamar, status lamaran, sampai tanggal wawancara. Kamu juga bisa lihat statistik lamaranmu dalam bentuk grafik, biar kamu tahu sudah seberapa jauh usaha kamu dalam proses pencarian kerja.

Gak cuma itu, aplikasi ini juga punya fitur notifikasi otomatis ke Telegram supaya kamu nggak lupa jadwal wawancara. Semuanya bisa kamu atur sendiri sesuai kebutuhan termasuk kategori lokasi, status lamaran, dan sumber informasi lowongan.

JobTracker dibangun dengan teknologi modern supaya tampilannya responsif, cepat, dan mudah digunakan baik di desktop maupun mobile.

## ⚙️ Teknologi yang Digunakan

| Bagian           | Teknologi / Tools      |
| ---------------- | ---------------------- |
| Framework        | Next.js (App Router)   |
| Bahasa           | TypeScript             |
| Styling          | Tailwind CSS           |
| UI Components    | shadcn/ui              |
| Database         | PostgreSQL             |
| ORM              | Drizzle ORM            |
| Otentikasi       | JWT + httpOnly Cookies |
| Fetching & State | SWR                    |
| Notifikasi       | Telegram Bot API       |
| Form & Validasi  | React Hook Form        |
| Deployment       | Vercel                 |

## ✨ Fitur Utama

- 🔐 **Login & Registrasi Aman**  
  Autentikasi memakai JWT dan cookie untuk keamanan.

- 📊 **Dasbor Statistik**  
  Lihat total lamaran, wawancara, tawaran kerja, dan penolakan dalam bentuk grafik.

- 📋 **CRUD Lamaran Kerja**  
  Tambah, edit, hapus, dan lihat detail lamaran lewat form yang simpel.

- 🏷️ **Kategori Kustom**  
  Lokasi, status, dan sumber lamaran bisa kamu atur sendiri.

- 🔍 **Pencarian & Filter**  
  Cari dan filter lamaran secara real-time langsung dari backend.

- 👁️ **Quick View Panel**  
  Lihat detail lamaran tanpa perlu pindah halaman.

- 🤖 **Pengingat Wawancara via Telegram**  
  Dapat notifikasi otomatis H-2 dan H-1 sebelum wawancara.

- 🚀 **Rute Terproteksi**  
  Dashboard hanya bisa diakses pengguna yang sudah login.

## 🧪 Cara Instalasi dan Menjalankan Proyek

### 1. Clone Repositori

```bash
git clone <URL_REPOSITORI_ANDA>
cd job-tracker
```

### 2. Instal Semua Dependensi

```bash
yarn install
# or
npm install
```

### 3. Konfigurasi File Environment

Buat file `.env.local` dan isi seperti ini:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres"
JWT_SECRET="SCREAT_KEY"
TELEGRAM_BOT_TOKEN="TOKEN_BOT_TELEGRAM"
CRON_SECRET="SCREAT_KEY_CRON_JOB"
```

### 4. Jalankan Migrasi Database

```bash
yarn drizzle:push
# or
npm run drizzle:push
```

### 5. (Opsional) Isi Database Awal

```bash
yarn db:seed
# or
npm run db:seed
```

### 6. Jalankan Proyek

```bash
yarn dev
# or
npm run dev
```

Aplikasi akan jalan di `http://localhost:3000`.

## 📢 Penting: Atur Webhook Telegram (Setelah Deploy)

Setelah deploy ke Vercel, atur webhook bot Telegram hanya satu kali:

```
https://api.telegram.org/bot<TOKEN_ANDA>/setWebhook?url=<URL_VERCEL_ANDA>/api/bot/webhook
```

Contoh:

```
https://api.telegram.org/bot12345:ABCDE/setWebhook?url=https://jobtracker.vercel.app/api/bot/webhook
```

---

## 🔗 Link Deployment

Kamu bisa mencoba aplikasi JobTracker versi live di sini:

🌐 [https://job-tracker-ahmadabyan.vercel.app](https://job-tracker-ahmadabyan.vercel.app)

---

## 📄 Lisensi

Proyek ini menggunakan lisensi MIT. Silakan gunakan dan modifikasi sesuai kebutuhan kamu.

---

Kalau kamu suka proyek ini, boleh banget di-⭐️ dan dibagikan ke teman-teman yang juga lagi cari kerja!  
Untuk saran, kritik, atau kontribusi, feel free untuk buat pull request atau open issue ya.
