# 🏨 Hotel Management System with AI Forecasting

## 📌 Project Overview

This project represents a full-stack Hotel Management System developed to automate hotel operations, including room administration, booking management, customer services, and payment handling. The system further incorporates a machine learning-based forecasting component to estimate future booking demand and support data-driven managerial decisions.

---

## 🚀 Key Features

* Room Management (Available, Occupied, Maintenance)
* Booking System with date validation and conflict avoidance
* Customer Management Module
* Payment System with precise revenue monitoring
* Dashboard featuring real-time analytics and visualization
* AI-Based Forecasting for estimating future bookings

---

## 🛠 Tech Stack

### Frontend

* React.js
* Axios
* Recharts (Data Visualization)

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Machine Learning

* Time-Series Forecasting Model (External API / Python-based service)

---

## 🗄 Database Schema

### Main Tables:

* **customers** → Maintains customer information
* **rooms** → Maintains room details and pricing
* **bookings** → Maintains booking records and status
* **payments** → Maintains payment transactions

### Relationships:

* One **customer** → Multiple **bookings**
* One **room** → Multiple **bookings**
* One **booking** → One **payment**

---

## 📡 API Documentation

| Method | Endpoint                   | Description                       |
| ------ | -------------------------- | --------------------------------- |
| GET    | /api/bookings              | Retrieve all bookings             |
| POST   | /api/bookings              | Create a new booking              |
| PUT    | /api/bookings/cancel/:id   | Cancel a booking                  |
| PUT    | /api/bookings/complete/:id | Complete booking & record payment |
| GET    | /api/rooms                 | Retrieve all rooms                |
| PUT    | /api/rooms/status/:id      | Modify room status                |
| GET    | /api/customers             | Retrieve all customers            |
| GET    | /api/dashboard/revenue     | Retrieve revenue statistics       |
| GET    | /api/dashboard/room-stats  | Retrieve room statistics          |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/hotel-management-system.git
cd hotel-management-system
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 ML Integration

The system incorporates a time-series forecasting model to estimate future booking demand. The model is trained using historical booking data collected from datasets (e.g., Kaggle).

### Workflow:

1. Historical booking data is gathered and processed.
2. The forecasting model generates future booking predictions.
3. The backend retrieves prediction outputs through an API.
4. The frontend dashboard presents predictions using graphical charts.

### Purpose:

* Supports demand forecasting
* Assists hotel management in resource planning
* Enhances decision-making efficiency

---

## 🔮 Future Enhancements

* Online booking system for customers
* Payment gateway integration (e.g., eSewa, Khalti)
* Multi-user authentication (Admin, Staff)
* Advanced AI models for improved prediction accuracy
* Mobile application version

---

## 📚 References

* Kaggle Datasets
* PostgreSQL Documentation
* React.js Documentation
* Node.js & Express Documentation
* Machine Learning Concepts
