# Inventory Pro — Sistem Manajemen Inventory

> **Versi:** 2.0  
> **Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase (Backend + Auth + Realtime)  
> **Deskripsi:** Sistem manajemen inventory universal yang dapat digunakan untuk berbagai jenis bisnis — FnB, retail, gadget, manufaktur, distributor, dan lainnya. Dilengkapi dengan autentikasi berbasis peran, transaksi barang masuk/keluar, monitoring stok real-time, analitik visual, laporan exportable, dan notifikasi otomatis.

---

## Daftar Isi

1. [Komponen](#komponen)
2. [Logika](#logika)
3. [Cara Kerja](#cara-kerja)
4. [Perkembangan ke Depan](#perkembangan-ke-depan)

---

## 1. Komponen

### 1.1. Struktur File & Direktori

```
src/
├── App.tsx                        # Entry-point routing aplikasi
├── main.tsx                       # Mount React ke DOM
├── index.css                      # Tailwind directives + custom design tokens
├── App.css                        # Style tambahan (jika ada)
├── vite-env.d.ts                  # Type declarations untuk Vite
│
├── components/
│   ├── NavLink.tsx                # Komponen link navigasi (jika digunakan)
│   ├── ProtectedRoute.tsx         # Guard route: redirect ke /login jika belum auth
│   │
│   ├── layout/
│   │   ├── AppLayout.tsx          # Layout utama aplikasi (sidebar + header + outlet)
│   │   └── AppSidebar.tsx         # Sidebar navigasi dengan daftar menu & logout
│   │
│   ├── stok/
│   │   ├── StokCharts.tsx         # Komponen grafik stok (AreaChart, PieChart, BarChart)
│   │   └── StokTable.tsx          # Tabel daftar stok dengan progress bar & status badge
│   │
│   └── ui/                        # 40+ komponen shadcn/ui (button, card, dialog, table, dll)
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── toast.tsx / toaster.tsx / sonner.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       └── ... (komponen UI lainnya)
│
├── hooks/
│   ├── useAuth.tsx                # Context provider autentikasi (login, register, logout, profile, role)
│   ├── use-toast.ts               # Hook toast notifikasi lokal
│   └── use-mobile.tsx             # Hook deteksi viewport mobile
│
├── integrations/
│   └── supabase/
│       ├── client.ts              # Inisialisasi Supabase client (auto-generated)
│       └── types.ts               # TypeScript types untuk schema database (auto-generated)
│
├── lib/
│   └── utils.ts                   # Helper cn() untuk merge Tailwind classes
│
├── pages/
│   ├── Login.tsx                  # Halaman login dengan branding split-screen
│   ├── Register.tsx               # Halaman registrasi akun baru
│   ├── Dashboard.tsx              # Halaman utama: ringkasan statistik + grafik + transaksi terbaru
│   ├── Home.tsx                   # Halaman home (landing setelah login)
│   ├── DataBarang.tsx             # Daftar semua barang inventory (CRUD)
│   ├── TambahBarang.tsx           # Form tambah barang baru
│   ├── EditBarang.tsx             # Form edit barang existing
│   ├── BarangMasuk.tsx            # Form transaksi barang masuk (multi-item)
│   ├── BarangKeluar.tsx           # Form transaksi barang keluar (multi-item, dengan cek stok)
│   ├── RiwayatTransaksi.tsx       # Daftar riwayat transaksi dengan filter & search
│   ├── LaporanPage.tsx            # Laporan barang masuk / keluar / stok + export PDF
│   ├── StokPage.tsx               # Monitoring stok real-time dengan grafik & tabel
│   ├── UserManagement.tsx         # Manajemen pengguna (admin panel)
│   ├── TambahUser.tsx             # Form tambah user (oleh admin)
│   ├── EditUser.tsx               # Form edit user
│   ├── NotFound.tsx               # Halaman 404
│   └── Index.tsx                  # Redirect atau halaman index
│
├── test/
│   ├── example.test.ts            # Contoh unit test (Vitest)
│   └── setup.ts                   # Setup testing environment
│
└── types/
    └── jspdf-autotable.d.ts      # Type declaration untuk plugin jspdf-autotable
```

### 1.2. Komponen UI (shadcn/ui)

Aplikasi ini menggunakan lebih dari **40 komponen shadcn/ui** yang telah dikustomisasi dengan tema dark navy professional. Beberapa komponen utama yang dipakai:

| Komponen | Penggunaan |
|----------|------------|
| `button` | Tombol aksi di seluruh aplikasi dengan varian `gradient`, `outline`, `ghost`, `gradientDanger` |
| `card` | Container untuk panel informasi, form, dan widget dashboard |
| `table` | Tabel data barang, transaksi, laporan, dan stok |
| `dialog` | Modal konfirmasi (misalnya hapus barang) |
| `toast` / `sonner` | Notifikasi sukses, error, dan info |
| `tabs` | Navigasi tab di halaman Laporan |
| `badge` | Status badge untuk stok (Normal, Rendah, Kritis) |
| `select` | Dropdown pilihan kategori, satuan, barang |
| `input` / `textarea` | Form input di tambah/edit barang dan transaksi |
| `scroll-area` | Scrollable area untuk konten panjang |
| `tooltip` | Tooltip pada ikon dan tombol |
| `separator` | Garis pemisah antar section |
| `dropdown-menu` | Menu dropdown notifikasi dan user |

### 1.3. Komponen Custom

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| `AppLayout` | `components/layout/AppLayout.tsx` | Layout shell utama: sidebar (desktop/mobile responsive), header (search, notifikasi, profil user), dan `<Outlet />` untuk konten dinamis |
| `AppSidebar` | `components/layout/AppSidebar.tsx` | Sidebar navigasi dengan 9 menu utama, indikator aktif, dan tombol logout |
| `ProtectedRoute` | `components/ProtectedRoute.tsx` | Route guard yang memeriksa session user; redirect ke `/login` jika tidak terautentikasi |
| `StokCharts` | `components/stok/StokCharts.tsx` | 3 jenis grafik Recharts: AreaChart (tren 14 hari), DonutChart (distribusi kategori), BarChart horizontal (top 8 pergerakan barang) |
| `StokTable` | `components/stok/StokTable.tsx` | Tabel stok dengan kolom: nama, kategori, stok, progress bar (relatif ke stok_max), dan status badge (Normal/Rendah/Kritis) |
| `useAuth` | `hooks/useAuth.tsx` | React Context untuk state autentikasi global: user, session, profile, role, signIn, signUp, signOut |

### 1.4. Halaman (Pages)

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Login | `/login` | Form login email+password, split-screen branding, toggle show password |
| Register | `/register` | Form registrasi: nama, username, email, password, konfirmasi password |
| Dashboard | `/dashboard` | Statistik real-time, widget kustomisasi, grafik tren mingguan, pie chart kategori, peringatan stok, transaksi terbaru |
| Home | `/home` | Halaman sambutan/overview setelah login |
| Data Barang | `/barang` | Tabel daftar barang dengan search, edit, hapus |
| Tambah Barang | `/barang/tambah` | Form input barang: kode, nama, kategori, satuan, stok, stok_min, stok_max, harga, deskripsi |
| Edit Barang | `/barang/edit/:id` | Form edit barang existing |
| Barang Masuk | `/transaksi/masuk` | Form transaksi masuk: supplier, tanggal, multi-item barang |
| Barang Keluar | `/transaksi/keluar` | Form transaksi keluar: penerima, tanggal, multi-item barang, dengan validasi cek stok |
| Riwayat Transaksi | `/transaksi/riwayat` | Daftar transaksi dengan filter (Semua/Masuk/Keluar) dan pencarian |
| Laporan | `/laporan` | 3 tab laporan (Masuk, Keluar, Stok) dengan export ke PDF via jsPDF + autotable |
| Stok | `/stok` | Monitoring stok dengan summary cards, 3 grafik analitik, dan tabel detail |
| User Management | `/admin/users` | Tabel user dengan statistik, edit role/status |
| Tambah User | `/admin/users/tambah` | Form tambah user |
| Edit User | `/admin/users/edit/:id` | Form edit user |
| Not Found | `*` | Halaman 404 |

---

## 2. Logika

### 2.1. Autentikasi & Autorisasi

**Sistem Autentikasi menggunakan Supabase Auth.**

1. **Login Flow:**
   - User memasukkan email dan password di halaman Login.
   - `useAuth.signIn()` memanggil `supabase.auth.signInWithPassword({ email, password })`.
   - Jika berhasil, session disimpan otomatis oleh Supabase (localStorage).
   - `onAuthStateChange` listener memicu pembaruan state `user`, `session`, dan pemanggilan `fetchProfile()`.

2. **Register Flow:**
   - User mengisi nama lengkap, username, email, password.
   - `useAuth.signUp()` memanggil `supabase.auth.signUp()` dengan `emailRedirectTo` dan metadata `full_name`, `username`.
   - Trigger `handle_new_user()` di database secara otomatis membuat record di tabel `profiles` dan `user_roles` (default role = `staff`).

3. **Session Management:**
   - `useAuth` memantau perubahan auth state via `supabase.auth.onAuthStateChange`.
   - Saat session berubah (login/logout), state `user`, `session`, `profile`, dan `role` diperbarui.
   - Logout memanggil `supabase.auth.signOut()` dan mereset semua state.

4. **Role-Based Access Control (RBAC):**
   - Role tersimpan di tabel `user_roles` (terpisah dari `profiles` untuk keamanan).
   - Role tersedia: `admin`, `staff`, `viewer`.
   - Row Level Security (RLS) policies di database membatasi akses berdasarkan role:
     - `admin`: full access (CRUD semua tabel, manage roles).
     - `staff`: bisa insert/update items & transactions, tapi tidak delete items atau manage users.
     - `viewer`: read-only access.
   - Fungsi PostgreSQL `has_role(_user_id, _role)` digunakan dalam RLS policies untuk mencegah rekursi.

### 2.2. State Management

| Aspek | Teknologi | Cara Kerja |
|-------|-----------|------------|
| Global Auth State | React Context (`useAuth`) | Menyimpan user, session, profile, role; tersedia di seluruh komponen anak |
| Server Data | React Query (QueryClient) | Menyediakan caching, refetching, dan state async untuk query Supabase |
| Local UI State | React useState/useEffect | Form inputs, toggle UI, search filters, widget visibility |
| Dashboard Widgets | localStorage | Preferensi tampilan widget disimpan di `localStorage` dengan key `dashboard-widgets` |
| Notifications | Supabase Realtime + useState | Notifikasi di-fetch dari database dan diperbarui secara real-time |

### 2.3. Validasi & Business Logic

| Fitur | Logika |
|-------|--------|
| **Tambah Barang** | Nama dan kode wajib diisi. Stok, stok_min, stok_max, harga di-parse ke number. Kode barang harus unik (constraint database). |
| **Barang Masuk** | Supplier wajib diisi. Setiap row item harus memilih barang dan quantity >= 1. Multi-item dalam satu transaksi. |
| **Barang Keluar** | Penerima wajib diisi. Sistem melakukan **cek stok** sebelum submit: jika quantity > stok tersedia, transaksi ditolak dengan toast error. |
| **Hapus Barang** | Konfirmasi dialog via `confirm()`. Delete cascade tidak aktif di items (transaksi terkait aman karena tidak ada constraint cascade). |
| **Stok Alerts** | Status stok dihitung client-side: `Kritis` (stok <= 50% stok_min), `Rendah` (stok <= stok_min), `Normal` (stok > stok_min). |
| **Registrasi** | Password minimal 6 karakter, konfirmasi password harus cocok. |
| **Login** | Email dan password wajib diisi. Error message dari Supabase ditampilkan via toast. |

### 2.4. Algoritma Grafik & Analitik

| Grafik | Data Source | Algoritma |
|--------|-------------|-----------|
| **Tren Transaksi Mingguan** | `transactions` table | Ambil transaksi 7 hari terakhir, group by hari, count transaksi masuk vs keluar per hari. |
| **Distribusi Kategori** | `items` + `categories` | Group items by category name, sum stok per kategori, hitung persentase relatif ke total stok. |
| **Tren Stok 14 Hari** | `transactions` + `transaction_items` | Ambil 14 hari terakhir, sum qty masuk dan keluar per hari, hitung net = masuk - keluar. |
| **Top 8 Pergerakan Barang** | `transaction_items` | Agregasi qty masuk & keluar per item selama 14 hari terakhir, sort by total activity (masuk + keluar), ambil top 8. |
| **Low Stock Alert** | `items` table | Filter items dengan `stok <= stok_min`, sort by persentase stok (stok/stok_min), tampilkan 5 item paling urgent. |

---

## 3. Cara Kerja

### 3.1. Arsitektur Sistem

```
┌───────────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  React 18 + TypeScript + Vite                          │  │
│  │  ├── React Router (Client-side routing)                │  │
│  │  ├── Tailwind CSS + shadcn/ui (Styling & Components)   │  │
│  │  ├── Recharts (Data Visualization)                     │  │
│  │  ├── jsPDF + autotable (PDF Export)                    │  │
│  │  ├── React Query (Server state management)             │  │
│  │  └── Supabase Client (Auth + Database + Realtime)      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                │
│                              ▼ HTTPS / WSS                   │
└──────────────────────────────┬────────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│                    SUPABASE BACKEND                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │  Authentication  │  │  PostgreSQL DB   │  │   Realtime  │  │
│  │  (auth.users)    │  │  (public schema) │  │   (WebSocket)│  │
│  └──────────────────┘  └──────────────────┘  └─────────────┘  │
│                               │                              │
│                               ▼ Row Level Security           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Triggers:                                   │  │
│  │  • handle_new_user() → auto-create profile + role       │  │
│  │  • update_stock_on_transaction() → auto-adjust stock    │  │
│  │  • check_low_stock() → auto-create notification         │  │
│  │  • update_updated_at_column() → auto-update timestamp   │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### 3.2. Flow Transaksi Barang Masuk

```
1. User navigasi ke halaman /transaksi/masuk
2. User mengisi:
   - Supplier / Sumber
   - Tanggal transaksi
   - Daftar barang (multi-item via dynamic rows):
     · Pilih barang dari dropdown → auto-fill satuan
     · Masukkan quantity
     · Keterangan (opsional)
3. Klik "Simpan Transaksi"
4. Frontend validasi:
   - Supplier tidak kosong
   - Semua item memilih barang dan qty >= 1
5. Insert ke tabel `transactions`:
   type: "masuk", status: "selesai", created_by: user.id
6. Insert ke tabel `transaction_items` untuk setiap row
7. TRIGGER `on_transaction_item_inserted` (database):
   - Membaca tipe transaksi (masuk/keluar)
   - Jika masuk: UPDATE items SET stok = stok + qty
   - Jika keluar: UPDATE items SET stok = stok - qty
8. Dashboard, StokPage, dan Riwayat otomatis update via Realtime subscription
```

### 3.3. Flow Transaksi Barang Keluar

```
1. User navigasi ke halaman /transaksi/keluar
2. User mengisi:
   - Penerima / Tujuan
   - Tanggal transaksi
   - Daftar barang (multi-item)
3. Frontend melakukan VALIDASI STOK:
   - Untuk setiap item, cek apakah qty <= stok tersedia
   - Jika stok tidak cukup → toast error, transaksi dibatalkan
4. Jika validasi lolos:
   - Insert ke `transactions` (type: "keluar")
   - Insert ke `transaction_items`
5. TRIGGER update stok berjalan (stok berkurang)
6. Jika stok item setelah transaksi <= stok_min:
   - TRIGGER `check_low_stock()` membuat notifikasi di tabel `notifications`
```

### 3.4. Flow Notifikasi Real-time

```
1. Saat aplikasi dimuat (AppLayout), sistem subscribe ke channel "notifications-realtime"
2. Channel listen ke event INSERT pada tabel `notifications`
3. Ketika stok barang turun di bawah stok_min:
   - Database trigger `check_low_stock()` insert row baru ke `notifications`
4. Realtime channel menerima event INSERT
5. `fetchNotifications()` dipanggil ulang → badge notifikasi di header bertambah
6. User bisa klik badge untuk melihat dropdown notifikasi
7. Klik notifikasi → markAsRead() update `is_read = true`
```

### 3.5. Flow Dashboard Kustomisasi

```
1. User klik ikon "Settings" (gear) di pojok kanan atas Dashboard
2. Panel widget settings muncul dengan toggle untuk 5 widget:
   - Kartu Statistik
   - Tren Mingguan
   - Distribusi Kategori
   - Transaksi Terbaru
   - Peringatan Stok
3. User klik toggle → widget visibility berubah
4. Preferensi disimpan ke localStorage key "dashboard-widgets"
5. Saat reload halaman, preferensi dibaca dari localStorage
```

### 3.6. Flow Laporan & Export PDF

```
1. User navigasi ke /laporan
2. Terdapat 3 tab: Barang Masuk, Barang Keluar, Laporan Stok
3. Data di-fetch dari database:
   - Masuk: transactions JOIN transaction_items JOIN items
   - Keluar: transactions JOIN transaction_items JOIN items
   - Stok: items table dengan status kalkulasi
4. User klik "Export PDF"
5. jsPDF membuat dokumen baru:
   - Header: "Laporan Inventory" + tanggal
   - Table: autoTable dengan kolom sesuai tab aktif
   - Styling: grid theme, custom header color (#0A2472)
6. File di-download otomatis dengan nama: laporan-{tab}-{tanggal}.pdf
```

### 3.7. Database Schema Detail

#### Tabel: `profiles`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK → auth.users) | 1:1 dengan user auth |
| full_name | TEXT | Nama lengkap user |
| username | TEXT (UNIQUE) | Username |
| avatar_url | TEXT | URL foto profil (opsional) |
| status | TEXT | active / inactive |
| created_at / updated_at | TIMESTAMPTZ | Timestamp auto |

#### Tabel: `user_roles`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK) | Reference ke auth.users |
| role | app_role ENUM | admin / staff / viewer |

#### Tabel: `categories`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto-generated |
| name | TEXT (UNIQUE) | Nama kategori |
| description | TEXT | Deskripsi kategori |

#### Tabel: `items` (Master Barang)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto-generated |
| kode | TEXT (UNIQUE) | Kode barang (contoh: BRG-001) |
| nama | TEXT | Nama barang |
| category_id | UUID (FK → categories) | Kategori barang |
| stok | INTEGER | Stok saat ini (auto-update via trigger) |
| stok_min | INTEGER | Batas minimum stok |
| stok_max | INTEGER | Batas maksimum stok |
| satuan | TEXT | Satuan: Kg, Liter, Pcs, Pack, Botol, Box |
| harga | NUMERIC | Harga satuan dalam Rupiah |
| deskripsi | TEXT | Deskripsi barang |
| created_by | UUID (FK) | User yang membuat |

#### Tabel: `transactions`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto-generated |
| type | transaction_type ENUM | masuk / keluar |
| tanggal | DATE | Tanggal transaksi |
| supplier_or_target | TEXT | Supplier (masuk) atau Penerima/Tujuan (keluar) |
| status | transaction_status ENUM | pending / selesai / dibatalkan |
| notes | TEXT | Catatan tambahan |
| created_by | UUID (FK) | User yang mencatat |

#### Tabel: `transaction_items`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto-generated |
| transaction_id | UUID (FK → transactions) | Reference transaksi |
| item_id | UUID (FK → items) | Reference barang |
| qty | INTEGER | Jumlah |
| satuan | TEXT | Satuan qty |
| keterangan | TEXT | Keterangan item |

#### Tabel: `notifications`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK, nullable) | Target user (null = broadcast) |
| title | TEXT | Judul notifikasi |
| message | TEXT | Isi pesan |
| type | TEXT | info / warning / danger |
| is_read | BOOLEAN | Status dibaca |

### 3.8. Row Level Security (RLS) Policies

Semua tabel di `public` schema memiliki RLS enabled. Berikut ringkasan policies:

| Tabel | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| profiles | All authenticated | Own profile | Own profile | — |
| user_roles | Own / Admin (via has_role) | Admin only | Admin only | Admin only |
| categories | All authenticated | Admin | Admin | Admin |
| items | All authenticated | Staff/Admin | Staff/Admin | Admin |
| transactions | All authenticated | Staff/Admin | Admin | — |
| transaction_items | All authenticated | Staff/Admin | — | — |
| notifications | Own / Broadcast | Staff/Admin | Own | — |

### 3.9. Design System & Theming

Aplikasi menggunakan **dark navy theme** yang professional dan industri-agnostic.

**Color Palette (CSS Custom Properties di `index.css`):**
```
--background: 230 60% 9%       #0B0F1E (Dark Navy Background)
--card: 232 38% 16%            #1A1F35 (Card Background)
--primary: 222 84% 24%         #0A2472 (Primary Navy)
--muted: 229 19% 22%           #2D3248 (Muted/Border)
--success: 168 42% 15%         #163D33 (Success Dark)
--warning: 21 79% 57%          #E07B39 (Warning Orange)
--destructive: 349 81% 25%     #720C22 (Danger Red)
--info: 217 91% 60%            #3B82F6 (Info Blue)
```

**Gradient Utilities:**
- `.bg-gradient-primary` — Navy gradient untuk sidebar dan kartu statistik utama
- `.bg-gradient-success` — Green gradient untuk kartu barang masuk
- `.bg-gradient-warning` — Orange gradient untuk kartu barang keluar
- `.bg-gradient-danger` — Red gradient untuk kartu stok rendah

---

## 4. Perkembangan ke Depan

### 4.1. Fitur yang Direncanakan

| # | Fitur | Prioritas | Deskripsi |
|---|-------|-----------|-----------|
| 1 | **Multi-Warehouse / Multi-Location** | Tinggi | Dukungan untuk mengelola stok di lebih dari satu gudang atau cabang. Menambah tabel `warehouses` dan kolom `warehouse_id` di items/transactions. |
| 2 | **Barcode / QR Code Scanner** | Tinggi | Integrasi kamera device untuk scan barcode/QR saat transaksi masuk/keluar, mempercepat input data. |
| 3 | **Purchase Order (PO) & Sales Order (SO)** | Tinggi | Fitur pre-transaksi: membuat PO ke supplier sebelum barang masuk, dan SO dari customer sebelum barang keluar. |
| 4 | **Supplier & Customer Master Data** | Menengah | Tabel terpisah untuk supplier dan customer dengan kontak, alamat, dan history transaksi per mitra. |
| 5 | **Inventory Audit & Stock Opname** | Menengah | Fitur stock opname (penyesuaian stok fisik vs sistem) dengan perhitungan selisih dan approval workflow. |
| 6 | **Advanced Reporting & Analytics** | Menengah | Laporan dengan filter periode custom, grafik profit/loss, turnover ratio, dan ABC analysis. |
| 7 | **Email & Push Notifications** | Menengah | Kirim notifikasi stok rendah via email atau push notification ke browser. |
| 8 | **Batch / Expiry Date Tracking** | Menengah | Tracking batch number dan tanggal kedaluwarsa untuk bisnis FnB dan farmasi. |
| 9 | **API Integration (Webhook)** | Rendah | Webhook untuk integrasi dengan sistem eksternal (accounting software, e-commerce platform). |
| 10 | **Mobile App (PWA / React Native)** | Rendah | Versi mobile dengan fitur offline-first untuk scanning dan transaksi di lapangan. |
| 11 | **Audit Log & Activity History** | Menengah | Pencatatan lengkap siapa yang mengubah apa, kapan, dan nilai sebelumnya. |
| 12 | **Data Export (Excel/CSV)** | Rendah | Export data ke format Excel/CSV selain PDF untuk kebutuhan analisis lanjutan. |
| 13 | **Print Label Barang** | Rendah | Generate dan print label barcode untuk barang. |
| 14 | **Dashboard Widget Drag & Drop** | Rendah | Kustomisasi layout dashboard dengan drag-and-drop widget. |
| 15 | **Multi-Language Support** | Rendah | Dukungan bahasa Inggris dan bahasa lainnya. |
| 16 | **Dark/Light Mode Toggle** | Rendah | Toggle tema terang dan gelap (saat ini hanya dark mode). |
| 17 | **Data Import (Bulk Upload)** | Menengah | Upload CSV/Excel untuk import barang, kategori, atau supplier secara massal. |
| 18 | **Role Permission Granular** | Menengah | Permission lebih detail (misal: staff hanya bisa transaksi masuk tapi tidak keluar). |
| 19 | **Harga Jual vs Harga Beli** | Menengah | Pisahkan harga beli (cost) dan harga jual untuk kalkulasi profit margin. |
| 20 | **Return / Refund Transaksi** | Menengah | Fitur retur barang masuk atau keluar dengan alasan. |

### 4.2. Teknis / Refactoring

| # | Item | Prioritas | Deskripsi |
|---|------|-----------|-----------|
| 1 | **Unit Test Coverage** | Tinggi | Menambah test coverage untuk hooks, components (React Testing Library), dan utility functions. |
| 2 | **E2E Testing (Playwright)** | Tinggi | Automasi pengujian end-to-end untuk flow kritis: login → transaksi masuk → cek stok → logout. |
| 3 | **TypeScript Strict Mode** | Menengah | Aktifkan `strict: true` di tsconfig untuk type safety yang lebih ketat. |
| 4 | **Zod Schema Validation** | Menengah | Implementasi Zod untuk validasi form di seluruh aplikasi (saat ini hanya validasi manual). |
| 5 | **React Query Optimization** | Menengah | Gunakan React Query untuk semua data fetching, dengan proper caching dan invalidation. |
| 6 | **Error Boundaries** | Menengah | Tambah React Error Boundaries untuk menangani crash di level komponen. |
| 7 | **Loading Skeletons** | Rendah | Ganti teks "Memuat..." dengan skeleton UI untuk pengalaman yang lebih baik. |
| 8 | **Virtual Scrolling** | Rendah | Untuk tabel dengan data besar (>1000 rows), implementasi virtual scrolling. |
| 9 | **Service Worker / PWA** | Rendah | Konversi ke PWA untuk offline capability dan install ke home screen. |
| 10 | **CI/CD Pipeline** | Rendah | Setup GitHub Actions untuk automated testing dan deployment. |

### 4.3. Skalabilitas Database

| # | Item | Prioritas | Deskripsi |
|---|------|-----------|-----------|
| 1 | **Indexing Strategy** | Tinggi | Tambah index pada kolom yang sering di-query: `items.kode`, `items.category_id`, `transactions.tanggal`, `transactions.type`, `transaction_items.transaction_id`. |
| 2 | **Materialized Views** | Menengah | Buat materialized view untuk dashboard summary agar mengurangi beban query real-time. |
| 3 | **Partitioning** | Rendah | Partition tabel `transactions` dan `transaction_items` per bulan/tahun untuk dataset yang sangat besar. |
| 4 | **Soft Delete** | Menengah | Implementasi soft delete untuk items dan transactions agar data historis tetap tersedia. |

---

## 5. Informasi Pengembangan

### 5.1. Stack Teknologi Lengkap

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Build Tool | Vite | 5.4.19 |
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.8.3 |
| Styling | Tailwind CSS | 3.4.17 |
| UI Components | shadcn/ui + Radix UI | Latest |
| Routing | React Router DOM | 6.30.1 |
| Charts | Recharts | 2.15.4 |
| PDF Export | jsPDF + jspdf-autotable | 4.1.0 / 5.0.7 |
| State Management | React Context + TanStack Query | 5.83.0 |
| Auth & Database | Supabase (supabase-js) | 2.95.3 |
| Date Utilities | date-fns | 3.6.0 |
| Form Handling | React Hook Form + Zod | 7.61.1 / 3.25.76 |
| Icons | Lucide React | 0.462.0 |
| Toast | Sonner | 1.7.4 |
| Testing | Vitest + Testing Library | 3.2.4 |

### 5.2. Skrip NPM

```bash
npm run dev          # Jalankan development server (Vite)
npm run build        # Build untuk production
npm run preview      # Preview build production
npm run lint         # Jalankan ESLint
npm run test         # Jalankan unit tests (Vitest)
npm run test:watch   # Jalankan unit tests dalam watch mode
```

### 5.3. Variabel Lingkungan

File `.env` berisi konfigurasi Supabase (auto-generated oleh Lovable):

```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-public-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

### 5.4. Migrasi Database

File migrasi berada di `supabase/migrations/`:

- `20260214130748_9ffd41c9-c881-4223-b071-9c3b4d90397d.sql` — Schema lengkap (tables, enums, triggers, RLS, policies, realtime, seed data)
- `20260214130831_cd0587fd-acc9-4b21-bd7d-7bb2fc1bc209.sql` — Perbaikan policy notifikasi

---

## 6. Catatan Keamanan

1. **Tidak ada role di client-side storage** — Role dicek via server-side RLS dan fungsi `has_role()`.
2. **Semua tabel memiliki RLS** — Tanpa policy yang benar, data tidak bisa diakses.
3. **Trigger auto-profil** — Saat user register via Supabase Auth, trigger `handle_new_user()` otomatis membuat profile dan assign role `staff`.
4. **No SQL Injection** — Semua query menggunakan Supabase client dengan parameterized queries.
5. **No sensitive keys in source** — Service role key dan database password tidak tersimpan di codebase (managed by Lovable Cloud).

---

**Inventory Pro — Dibangun untuk semua jenis bisnis. Kelola stok Anda dengan profesional.**
