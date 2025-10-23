# 💳 CreditSea – Full Stack Assignment

### 🚀 Credit Report Management Dashboard

A full-stack web application to **upload, parse, view, and manage credit reports** (Experian XML format).  
Developed as part of the **CreditSea Internship Assignment**.

---

## 🧠 Overview

This application allows users to:

- Upload **Experian Credit Report XML** files
- Parse and store extracted data in **MongoDB**
- Display parsed details such as **Basic Details: ,Report summary and Credit Accounts Information:**
- Includes **robust error handling** and **Winston-based logging**
- Supports **integration testing** using Jest, Supertest, and MongoMemoryServer

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite) + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (via Mongoose) |
| **File Parsing** | xml2js |
| **Testing** | Jest + Supertest + MongoMemoryServer |
| **Logging** | Winston |
| **Language** | JavaScript (CommonJS) |

---

## ⚙️ Features

### 🔹 Backend
- Upload Experian XML credit reports via REST API
- Parse XML → JSON using `xml2js`
- Extract **basic user info**, **credit summary**
- Store data in MongoDB
- Fetch all reports or a specific one by ID
- Delete uploaded reports
- Includes:
  - Centralized error handling middleware
  - Structured logging with **Winston**
  - **Integration tests** for every route

### 🔹 Frontend
- Built with **React (Vite)** and **Tailwind CSS**
- Pages:
  - **Reports List** – view uploaded reports
  - **Upload Page** – upload Experian XML file
  - **Report Details** – show full details
- Responsive & clean UI using Poppins font
- Supports **file validation** (XML only)
- **Delete reports** directly from the frontend
- Smart data display (Active/Closed accounts, dynamic tables)

---
## ⚡️ Setup Instructions

### 🖥 Backend Setup

1️⃣ Navigate to backend folder:
```bash
cd backend
```

2️⃣ Install dependencies:
```bash
npm install
```

3️⃣ Create .env file:

PORT=
MONGO_URI=


4️⃣ Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1️⃣ Navigate to frontend folder:
```bash
cd frontend
```


2️⃣ Install dependencies:
```bash
npm install
```


3️⃣ Start development server:
```bash
npm run dev
```

### Testing
Integration testing uses Jest, Supertest, and MongoMemoryServer.

1️⃣ Navigate to backend folder:
```bash
cd backend
```

2️⃣ Run tests:
```bash
npm test
```