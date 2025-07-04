![Frame 1](https://github.com/user-attachments/assets/a09f27a3-df62-44ff-b473-da9db32107d8)

# 🚀 JobTracker – Lacak Semua Lamaran Kerjamu di Satu Tempat

## 📌 Description

**JobTracker** adalah aplikasi web yang dibuat khusus buat kamu yang lagi aktif cari kerja dan sering bingung buat manajemen semua lamaran yang udah dikirim. Daripada melakukan pencatatan manual di Excel atau catatan HP yang terkadang membuat pusing, sekarang kamu bisa simpan semuanya di satu tempat dengan rapi dan gampang diakses.

Dengan JobTracker, kamu bisa mencatat detail setiap lamaran: dari nama perusahaan, posisi yang dilamar, status lamaran, sampai tanggal wawancara. Kamu juga bisa lihat statistik lamaranmu dalam bentuk grafik, biar kamu tahu sudah seberapa jauh usaha kamu dalam proses pencarian kerja.

Gak cuma itu, aplikasi ini juga punya fitur notifikasi otomatis ke Telegram supaya kamu nggak lupa jadwal wawancara. Semuanya bisa kamu atur sendiri sesuai kebutuhan termasuk kategori lokasi, status lamaran, dan sumber informasi lowongan.

JobTracker dibangun dengan teknologi modern supaya tampilannya responsif, cepat, dan mudah digunakan baik di desktop maupun mobile.



## ⚙️ Technologies used

| Bagian            | Teknologi / Tools                               |
|-------------------|--------------------------------------------------|
| Framework         | Next.js (App Router)                            |
| Bahasa            | TypeScript                                      |
| Styling           | Tailwind CSS                                    |
| UI Components     | shadcn/ui                                       |
| Database          | PostgreSQL              |
| ORM               | Drizzle ORM                                     |
| Otentikasi        | JWT + httpOnly Cookies                          |
| Fetching & State  | SWR                                             |
| Notifikasi        |Telegram Bot API            |
| Form & Validasi   | React Hook Form                                 |
| Deployment        | Vercel                                          |



## ✨ Features

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



## 🧪 Setup instructions

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

## 🤖 AI Support Explanation
**Dalam** proses pengembangan JobTracker, saya menggunakan teknologi AI dari IBM Granite untuk mempercepat dan mempermudah penulisan kode backend maupun frontend. Model ini sangat membantu dalam menyelesaikan tugas-tugas pemrograman dengan menggunakan pendekatan Few-Shot dan Zero-Shot, yang meminimalkan kebutuhan coding manual dari awal.

#### 🧠 Few-Shot Learning
Contohnya dapat dilihat pada pembuatan endpoint API untuk login pengguna di file route.ts. Model IBM Granite mampu menghasilkan kode yang:

- Menerima dan memverifikasi email serta password pengguna.

- Mencocokkan kredensial dengan database menggunakan ORM Drizzle.

- Menghasilkan token JWT dan menyimpannya di cookie httpOnly.

- Memberikan respon API yang sesuai, lengkap dengan penanganan error menggunakan try-catch.

Pendekatan few-shot ini memanfaatkan beberapa contoh prompt untuk membuat model lebih akurat dalam membangun logika autentikasi yang aman dan siap produksi.

📸 Contoh Implementasi:
![few-shot](https://github.com/user-attachments/assets/61585c48-27ca-4cff-b944-b9c822016c57)


#### ⚡ Zero-Shot Learning
Model juga dimanfaatkan untuk menghasilkan komponen frontend seperti halaman HomePage.tsx, tanpa perlu memberikan contoh kode sebelumnya. Cukup dengan instruksi teks biasa, model berhasil:

- Mengambil status login pengguna dari endpoint /api/auth/me menggunakan useSWR.

- Menampilkan atau menyembunyikan tombol "Masuk ke Dashboard" secara otomatis sesuai status login.

- Mengelola komponen bersyarat dengan clean code dan struktur React yang rapi.

📸 Contoh Implementasi:
![zero-prompt](https://github.com/user-attachments/assets/93a5dc0b-5d12-4562-b739-f5d75efc1a6c)


Untuk melihat contoh lebih lengkap:

🌐 [Link Google Colab](https://colab.research.google.com/drive/10pGFInWg4kf0swmV_hSAevhDvVsVf0Te?usp=sharing)

---

## 📢 Penting: Atur Webhook Telegram (Setelah Deploy)

Setelah kamu deploy ke Vercel, atur webhook bot Telegram hanya satu kali:

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
