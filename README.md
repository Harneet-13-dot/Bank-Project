# 💸 PayFlow — Banking & Transaction App

A full-stack banking application where users can **send money, request money, and manage transactions securely** with a modern UI.

---

## 🚀 Features

### 🔐 Authentication
- User Registration & Login
- JWT-based authentication
- Secure cookie handling

### 💸 Send Money
- Send money using **username/email**
- Built-in **user verification (no wrong transfers)**
- Idempotency support (prevents duplicate transactions)

### 📥 Request Money
- Request money from users
- Accept / Reject requests
- Automatic transaction on acceptance

### 🔍 Smart User Search (NEW 🔥)
- Search users by username/email
- Verify before sending/requesting
- Clean preview UI with verified badge

### 🔔 Notifications System
- Bell icon with pending requests
- Dropdown preview
- Accept / Reject directly

### 🎨 UI/UX
- Dark mode 🌙
- Premium dashboard design
- Toast notifications (no ugly alerts ❌)

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## 📂 Project Structure
Backend/
├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── services/

Frontend/
├── src/
│ ├── components/
│ ├── features/
│ ├── pages/
│ └── api/


---

## ⚙️ Installation

### 1. Clone Repository

git clone https://github.com/your-username/payflow.git
cd payflow

2. Backend Setup
cd Backend
npm install

Create .env file:

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

Run backend:
npm run dev


3. Frontend Setup
cd Frontend
npm install
npm run dev


🔥 API Endpoints
**Auth**
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me (getting user detail for icon and name at top right corner)

**Transactions**
POST /api/transactions
GET /api/transactions

**Request Money**
POST /api/request
GET /api/request/incoming
POST /api/request/:id/accept
POST /api/request/:id/reject

**User Search** (using direct username in place or account_id)
GET /api/user/getAccount?query=username

