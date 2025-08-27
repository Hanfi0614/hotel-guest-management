# Hotel Guest Management – Starter

A minimal, ready-to-run starter for the **Guest Management System** using **React + TypeScript + Vite + Tailwind** (client) and **PocketBase** (server).

## Project Structure
```
/hotel-guest-management
  /server           # PocketBase backend files (binary not included)
  /client           # React + TS + Vite frontend
  README.md
```

---

## 1) Backend (PocketBase)

1. Download PocketBase for your OS: https://pocketbase.io/
2. Place the binary inside `server/` and run:
   ```bash
   cd server
   ./pocketbase serve
   # Admin UI: http://127.0.0.1:8090/_/
   ```

3. In the Admin UI:
   - Create a collection **guests** with fields:
     - `first_name` (text, required)
     - `last_name`  (text, required)
     - `email`      (email, required, unique)
     - `phone`      (text)
     - `address`    (text)
     - `date_of_birth` (date)
     - *Note:* `id` and `created` are auto-generated
   - API Rules (for this assignment only): allow `list`, `view`, `create`, `update`, `delete` to **true**.
   - Add 3–5 sample guest records.

> Optionally, import `server/guests.pbschema.json` to pre-create the collection (Admin UI → Settings → Import collection).

---

## 2) Frontend (React + TS + Vite)

### Prerequisites
- Node.js 18+ and npm

### Setup & Run
```bash
cd client
npm install
npm run dev   # http://localhost:5173
```

If your PocketBase is running on a different URL, set it via `.env`:
```
VITE_PB_URL=http://127.0.0.1:8090
```

### Routes
- `/guests` – list + search + delete
- `/guests/new` – create
- `/guests/:id` – view/edit

---

## 3) Git
```bash
cd /path/to/hotel-guest-management
git init
git add .
git commit -m "init: pocketbase + react-ts + tailwind + basic CRUD"
```

---

## Notes
- This starter intentionally skips auth per requirements.
- Do **not** expose real credentials publicly in production repos.