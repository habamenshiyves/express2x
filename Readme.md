# 🏥 Simplified Medical Management System

[![Node.js Version](https://img.shields.io/badge/node-%3E=14.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E=12-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#)
[![Made with](https://img.shields.io/badge/made%20with-Node.js-yellowgreen)](#)

> A lightweight web application for managing medical data, vital signs, and consultations – tailored for nurses and doctors.

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Technologies Used](#-technologies-used)
- [⚙️ Prerequisites](#️-prerequisites)
- [📦 Installation and Setup](#-installation-and-setup)
- [👥 Creating Initial Users](#-creating-initial-users)
- [▶️ Running the Application](#️-running-the-application)
- [📁 Project Structure (Simplified)](#-project-structure-simplified)

---

## 🚀 Features

- **🔐 Role-Based Authentication**
  - Login / Logout for users
  - Feature access depends on role (nurse or doctor)

- **🩺 Nurse Dashboard** (`/nurse.html`)
  - Record patient vital signs (temperature, blood pressure, weight, heart rate, age)
  - View the list of all patients

- **👨‍⚕️ Doctor Dashboard** (`/doctor.html`)
  - View all recorded vital signs (with nurse name)
  - Record consultations (observations, recommendations, prescriptions)
  - List patients with at least one consultation
  - Dashboard with monthly vital sign entries per patient

- **🖥️ Basic Frontend UI** for backend interactions

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL  
- **Authentication**: `bcrypt` for password hashing, `express-session` for sessions  
- **Frontend**: HTML, CSS, JavaScript (Fetch API)

---

## ⚙️ Prerequisites

- Node.js ≥ 14 (you are using v20.10.0)
- npm (comes with Node.js)
- PostgreSQL database server

---

## 📦 Installation and Setup

1. **Clone or copy** the project files.

2. **Navigate to the server folder:**
   ```bash
   cd path/to/your/project/server
