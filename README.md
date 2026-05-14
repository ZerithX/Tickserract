# 🎟️ Tickserract

Aplikasi pemesanan tiket acara modern yang memungkinkan pengguna mencari, melihat detail acara, dan membeli tiket secara *real-time*.

## 🛠 Tech Stack

**Frontend:**
- [React](https://reactjs.org/) / [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn UI](https://ui.shadcn.com/)

**Backend:**
- [Hono](https://hono.dev/)
- [Bun](https://bun.sh/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/)

## ⚙️ Prerequisites

Pastikan kamu sudah menginstal beberapa *tools* berikut di mesin lokalmu:
- [Bun](https://bun.sh/) (v1.0+)
- PostgreSQL berjalan di lokal atau via Docker

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   bun install
   ```

2. **Setup Environment**
   ```bash
   cp apps/be/.env.example apps/be/.env
   ```
   Isi `DATABASE_URL` di `apps/be/.env` dengan koneksi PostgreSQL kamu.

3. **Database Push**
   ```bash
   bun db:push
   ```

4. **Run Development**
   ```bash
   bun dev
   ```
   API akan berjalan di `http://localhost:8080` dan Web di `http://localhost:5173` (Vite).


## 📁 Project Structure

Proyek ini menggunakan arsitektur *Monorepo* dengan Bun Workspaces.

```text
├── apps/
│   ├── be/                      # Hono Backend Services
│   │   ├── src/
│   │   │   ├── db/
│   │   │   │   ├── schema.ts     # Schema Drizzle (Users, Events, Orders)
│   │   │   │   └── index.ts      # Database connection
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts       # Endpoint Autentikasi
│   │   │   │   ├── events.ts     # Endpoint pencarian & detail acara
│   │   │   │   └── orders.ts     # Endpoint transaksi/checkout tiket
│   │   │   ├── middlewares/      # JWT auth, error handling
│   │   │   └── index.ts          # Entry point & export type AppType (RPC)
│   │   ├── drizzle.config.ts     # Konfigurasi manajemen skema & API database
│   │   └── package.json
│   │
│   └── fe/                      # React / Next.js Frontend
│       ├── src/
│       │   ├── app/              # Routing Halaman (Next.js App Router)
│       │   │   ├── (public)/     # Landing page, /events/[id]
│       │   │   └── (dashboard)/  # /my-tickets, /checkout
│       │   ├── components/       # Reusable UI (TicketCard, Shadcn components)
│       │   ├── lib/              # Hono RPC client initialization
│       │   └── hooks/            # Data fetching hooks (TanStack Query)
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/                     # Shared Logic & Configs
│   ├── shared/                   # Validasi Zod schemas (dipakai di api & web)
│   └── tsconfig/                 # Konfigurasi tsconfig.json terpusat
│
├── bun.lockb
├── package.json                  # Root workspace config
└── README.md
```

## 📝 Commit Standard
Proyek ini mengikuti spesifikasi Conventional Commits untuk pesan komit pada pengembangan fitur maupun perbaikan *bug*.
- `feat: add checkout ticket endpoint`
- `fix: resolve race condition on ticket booking`
- `docs: update api specification`