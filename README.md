# 🌾 KisanConnect — Seedha Kisan, Seedha Daam

> **Eliminating middlemen. Empowering farmers. Direct farm-to-buyer marketplace.**

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

---

## 🚨 The Problem

Indian farmers lose **30-40% of their income** to middlemen (arhtiyas) who control pricing and payments. Farmers have no direct access to buyers, no price transparency, and no payment security.

---

## ✅ Our Solution — KisanConnect

A full-stack web platform where **farmers list crops directly** and **buyers purchase directly** — no middlemen, instant payments, fair prices.

---

## 🎯 Key Features

### 🧑‍🌾 For Farmers
- **Dashboard** — List crops, track orders, manage earnings
- **Wallet** — Payments released automatically after buyer pickup
- **Profile** — Verified farmer badge, stats, farm details
- **Forum** — Community Q&A with fellow farmers

### 🛒 For Buyers
- **Marketplace** — Browse crops with price comparison
- **Smart Filters** — Filter by category, location, price
- **Order System** — UPI Payment or Cash on Pickup
- **Price Trends** — 6-month demand forecasting charts

### 🌐 Platform
- **Multilingual** — English, Hindi, Punjabi support
- **Mobile Responsive** — Built for farmers on phones
- **Secure Auth** — JWT-based login and register
- **Real-time Data** — MongoDB Atlas cloud database

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Charts | Recharts |
| i18n | i18next |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Backend Setup

```bash
git clone https://github.com/aditi00223/-kisanConnect.git
cd -kisanConnect
npm install
```

Create `.env` file in root folder:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

```bash
npm start
```
Backend runs at **http://localhost:5000**

### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```
Frontend runs at **http://localhost:3003**

---

## 🌟 Impact

- 👨‍🌾 Helps farmers get **fair prices** without middlemen
- 💰 Farmers keep **100% of their earnings**
- 📱 Works on **mobile** for rural farmers
- 🌐 Available in **Hindi and Punjabi** for local farmers
- 🔒 **Secure payments** with UPI integration

---

## 📌 Project Status

🟢 **Fully Working** — Frontend + Backend + Database fully integrated

---

> Built with ❤️ for Indian farmers 🌾
> *"Seedha Kisan, Seedha Daam"*