# Hotel Guest Management – Final Mini Project

A complete **Hotel Guest Management System** built with:
- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** PocketBase



## ✨ Features
- Add, Edit, Delete, View guests
- Search & filter guest list
- Phone must be **10 digits**
- Date of Birth is **required** (must be a past date)
- Toast notifications for actions
- Navy theme (`#111154`)
- Confirmation modal before delete
- Top navigation bar (Home / Guests)



## 📂 Project Structure
```
hotel-guest-management/
├─ client/   # React app
├─ server/   # PocketBase backend
└─ README.md
```



## 🗄 Backend (PocketBase)

Run PocketBase:

```bash
cd server
./pocketbase serve     # Windows: .\pocketbase.exe serve
```

- Admin UI: [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)
- REST API: [http://127.0.0.1:8090/api/](http://127.0.0.1:8090/api/)

### Admin Credentials (for evaluation)
```
Email:    mohamedhanfi0614@gmail.com
Password: @hanfi2000
```

### Guests Collection Fields
- `first_name` (text, required)  
- `last_name` (text, required)  
- `email` (email, required)  
- `phone` (text)  
- `address` (text, optional)  
- `date_of_birth` (date)  

---

## 💻 Frontend (React + Vite)

Run the React app:

```bash
cd client
npm install
npm run dev
```

Open in browser: [http://localhost:5173](http://localhost:5173)

If PocketBase runs on a different URL, create `client/.env`:

```
VITE_PB_URL=http://127.0.0.1:8090
```



## 🔗 Routes
- `/` → Home  
- `/guests` → List, Search, Delete  
- `/guests/new` → Add new guest  
- `/guests/:id` → Edit guest  



## 📝 Git Workflow
```bash
git init
git add .
git commit -m "Initial commit: Hotel Guest Management"
git branch -M main
git remote add origin https://github.com/Hanfi0614/hotel-guest-management.git
git push -u origin main
```

