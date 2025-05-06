# Cyzygy Backend Assessment

This repository contains a RESTful API built as part of the **Cyzygy** fullstack assessment. It features an admin user management system where authenticated users can create, update, and delete posts and comments.

## 🚀 Features

- 🔐 JWT-based user authentication and authorization
- ✍️ CRUD operations for posts and comments
- 🧑 Role-based access control (users can only manage their own resources)
- ⚙️ Modular MVC project structure
- 📚 API documentation with Swagger UI
- ✅ Request validation and centralized error handling

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT** for authentication
- **Swagger UI** for API docs

---

## 📦 Installation

### 1. **Clone the repo**

```bash
git clone https://github.com/Oluwayelu/cyzygy-backend-assessment.git
cd cyzygy-backend-assessment
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Setup your .env.development.local**

```env
# PORT
PORT = 4000

# DATABASE
MONGODB_URL = mongodb://127.0.0.1:27017/cyzygy

# TOKEN
SECRET_KEY = secretKey

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true
```

### 4. **Start the server**

```bash
npm run dev
```

## 📄 API Documentation

```bash
http://localhost:4000/api-docs
```
