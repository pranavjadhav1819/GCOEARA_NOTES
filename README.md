<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=GCOEARA%20Notes%20Portal&fontSize=50&fontColor=fff&animation=twinkling&fontAlignY=40&desc=Your%20College%20Study%20Hub%20%F0%9F%8E%93&descAlignY=65&descSize=20" width="100%"/>

<br/>

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

<br/>

![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

<br/>

> 🎓 **A full-stack notes sharing portal for GCOEARA students**
> Upload, browse, and download Notes, PYQs & Important Questions by Year and Branch.

<br/>

[![⭐ Star this repo](https://img.shields.io/github/stars/pranavjadhav1819/GCOEARA_NOTES?style=social)](https://github.com/pranavjadhav1819/GCOEARA_NOTES)
[![🍴 Fork](https://img.shields.io/github/forks/pranavjadhav1819/GCOEARA_NOTES?style=social)](https://github.com/pranavjadhav1819/GCOEARA_NOTES/fork)

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [☁️ Deployment](#️-deployment)
- [👤 Admin Setup](#-admin-setup)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

<div align="center">

| 🔐 Authentication | 📚 Notes Management | 🗂️ Smart Filtering |
|:---:|:---:|:---:|
| Register & Login | Upload PDFs, DOC, PPT | Filter by Year & Branch |
| JWT Token Auth | Download with tracking | Filter by Type (Notes/PYQ/IMP) |
| Role-based Access | Delete your own uploads | Search by Title & Subject |
| Admin Panel | File size validation | Pagination support |

</div>

<br/>

- 🎓 **Year-wise & Branch-wise** notes organization
- 📄 **Multiple file formats** — PDF, DOC, DOCX, PPT, PPTX, JPG, PNG
- 🔒 **Secure file storage** via Supabase Storage
- 📊 **Download tracking** for each note
- 👑 **Admin controls** — manage all uploads
- 📱 **Responsive frontend** — works on all devices
- ⚡ **Rate limiting** on auth endpoints — brute-force protection
- 🛡️ **Helmet.js** security headers

---

## 🛠️ Tech Stack

<div align="center">

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Multer](https://img.shields.io/badge/-Multer-FF6600?style=flat-square)
![bcryptjs](https://img.shields.io/badge/-bcryptjs-003A70?style=flat-square)

### Frontend
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### DevOps & Tools
![Render](https://img.shields.io/badge/-Render-46E3B7?style=flat-square&logo=render&logoColor=white)
![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white)
![dotenv](https://img.shields.io/badge/-dotenv-ECD53F?style=flat-square)

</div>

---

## 📁 Project Structure

```
gcoerak-notes-portal/
├── 📂 backend/
│   ├── 📂 config/
│   │   ├── constants.js       # Years, Branches, Types config
│   │   └── db.js              # Supabase client setup
│   ├── 📂 controllers/
│   │   ├── authController.js  # Register, Login, Me
│   │   ├── noteController.js  # Upload, List, Download, Delete
│   │   └── metaController.js  # Years, Branches, Types metadata
│   ├── 📂 middleware/
│   │   ├── auth.js            # JWT protect & adminOnly
│   │   ├── errorHandler.js    # Global error handling
│   │   └── upload.js          # Multer memory storage config
│   ├── 📂 models/
│   │   ├── User.js            # Supabase user operations
│   │   └── Note.js            # Supabase note operations
│   ├── 📂 routes/
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   └── metaRoutes.js
│   ├── 📂 utils/
│   │   ├── generateToken.js   # JWT token generator
│   │   └── seedAdmin.js       # Admin account bootstrapper
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── 📂 frontend/
│   ├── 📂 css/
│   │   └── style.css
│   ├── 📂 js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── config.js
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── nav.js
│   │   ├── register.js
│   │   └── upload.js
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── upload.html
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- A [Supabase](https://supabase.com) account (free)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/pranavjadhav1819/GCOEARA_NOTES.git
cd GCOEARA_NOTES
```

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

### 3️⃣ Setup Supabase Database

Go to your Supabase project → **SQL Editor** → Run this:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  branch VARCHAR(50) DEFAULT NULL,
  year VARCHAR(20) DEFAULT NULL,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  description VARCHAR(500) DEFAULT '',
  year VARCHAR(20) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  stored_file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploader_name VARCHAR(80) NOT NULL,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_year_branch_type ON notes(year, branch, type);

CREATE OR REPLACE FUNCTION increment_note_downloads(note_id UUID)
RETURNS void AS $$
  UPDATE notes SET downloads = downloads + 1 WHERE id = note_id;
$$ LANGUAGE sql;
```

Then go to **Storage** → Create a **Public Bucket** named `notes-files`.

### 4️⃣ Configure Environment

```bash
cp .env.example .env
# Fill in your real values in .env
```

### 5️⃣ Run Locally

```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) 🎉

---

## 🔐 Environment Variables

Create `backend/.env` with these values:

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=replace_with_long_random_string_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5000
MAX_FILE_SIZE_MB=20
ALLOWED_EMAIL_DOMAIN=gcoeara.ac.in
ADMIN_NAME=Your Name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPassword123
```

> ⚠️ **Never commit your `.env` file to GitHub!**

---

## 📡 API Endpoints

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register new student |
| `POST` | `/login` | Public | Login & get JWT token |
| `GET` | `/me` | Private | Get current user info |

### 📚 Notes — `/api/notes`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | List notes (with filters) |
| `GET` | `/:id` | Public | Get single note |
| `GET` | `/:id/download` | Public | Download note file |
| `POST` | `/` | Private | Upload new note |
| `DELETE` | `/:id` | Private | Delete note |

### 🗂️ Meta — `/api/meta`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | Get years, branches, types |

### Query Parameters for `GET /api/notes`

```
?year=2nd Year
?branch=computer
?type=notes          # notes | pyq | imp
?subject=DBMS
?q=database
?page=1
?limit=20
```

---

## ☁️ Deployment

### Deploy on Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo and set:

| Setting | Value |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

4. Add all Environment Variables
5. Click **Deploy** ✅

---

## 👤 Admin Setup

Set `ADMIN_*` variables in `.env` then run:

```bash
npm run seed:admin
```

---

## 🗂️ Supported Branches

| Code | Branch |
|------|--------|
| `computer` | Computer Engineering |
| `entc` | E&TC Engineering |
| `mechanical` | Mechanical Engineering |
| `automobile` | Automobile Engineering |
| `instrumentation` | Instrumentation Engineering |
| `civil` | Civil Engineering |

---

## 📎 Supported File Types

```
PDF  |  DOC  |  DOCX  |  PPT  |  PPTX  |  JPG  |  JPEG  |  PNG
```

Max file size: **20 MB**

---

## 🤝 Contributing

```bash
git checkout -b feature/AmazingFeature
git commit -m "Add AmazingFeature"
git push origin feature/AmazingFeature
# Open a Pull Request
```

---

## 👨‍💻 Author

<div align="center">

**Pranav Jadhav**

[![GitHub](https://img.shields.io/badge/GitHub-pranavjadhav1819-181717?style=for-the-badge&logo=github)](https://github.com/pranavjadhav1819)
[![Email](https://img.shields.io/badge/Email-jadhav.pranav.1819@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jadhav.pranav.1819@gmail.com)

*Government College of Engineering & Research, Avasari Khurd (GCOEARA)*

</div>

---

## 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=twinkling" width="100%"/>

**Made with ❤️ for GCOEARA Students**

⭐ **Star this repo if it helped you!** ⭐

</div>
