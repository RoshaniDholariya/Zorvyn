# 💰 Finance Data Processing & Access Control Backend

A backend system for managing financial records with role-based access control, built using **Node.js, Express, PostgreSQL, and Prisma**.

---

## 🚀 Live Demo

🔗 **Deployed API:**
`https://your-deployment-link.com/api-docs`

---

## 📌 Project Overview

This project is a backend system designed for a **finance dashboard** where users can manage financial records based on their roles.

It demonstrates:

* API design
* Data modeling
* Role-based access control
* Aggregation logic for dashboards
* Clean backend architecture

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT
* **API Documentation:** Swagger (OpenAPI)

---

## 📂 Project Structure

```
src/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── routes/
 ├── utils/
 └── app.js
prisma/
 └── schema.prisma
server.js
```

---

## 🔐 Roles & Permissions

| Role    | Permissions                       |
| ------- | --------------------------------- |
| Viewer  | View data only                    |
| Analyst | View records + dashboard          |
| Admin   | Full access (CRUD + user control) |

---

## 📊 Features

### 1. User Management

* Register/Login users
* Assign roles
* Activate/Deactivate users

### 2. Financial Records

* Create, update, delete records
* Filter by category, type, date
* Supports income and expense tracking

### 3. Dashboard APIs

* Total income
* Total expenses
* Net balance
* Aggregated summaries

### 4. Access Control

* Role-based middleware
* Secure endpoints using JWT

### 5. Validation & Error Handling

* Proper HTTP status codes
* Input validation
* Error messages

---

## 🔗 API Endpoints

### 🔐 Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### 💰 Records

* `POST /api/records` (Admin)
* `GET /api/records`
* `PUT /api/records/:id` (Admin)
* `DELETE /api/records/:id` (Admin)

### 📊 Dashboard

* `GET /api/dashboard`

---

## 🧪 API Testing (Swagger)

Swagger UI available at:

```
/api-docs
```

Steps:

1. Register user
2. Login to get JWT
3. Click "Authorize"
4. Add token → `Bearer <token>`
5. Test APIs

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```
git clone <your-repo-link>
cd backend
```

### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables

Create `.env` file:

```
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/finance_db
JWT_SECRET=your_secret_key
```

### 4. Prisma Setup

```
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run Server

```
npm run dev
```

---

## 🧠 Assumptions Made

* Each record belongs to a single user
* Admin is responsible for data management
* Analysts do not modify data
* Authentication is handled using JWT
* Database is PostgreSQL

---

## ⚖️ Trade-offs

* Did not implement frontend (backend-focused assignment)
* Used simple role-based control instead of complex RBAC policies
* No pagination for simplicity (can be added)
* No rate limiting (optional enhancement)

---

## ⭐ Additional Enhancements

* Swagger API documentation
* Clean modular architecture
* Prisma ORM for type-safe queries
* JWT-based authentication
* Role-based middleware

---

## 🚀 Future Improvements

* Add pagination & search
* Add refresh tokens
* Add unit testing
* Add frontend dashboard
* Deploy using Docker

---

## 👩‍💻 Author

Roshni Dholariya

---

## 📌 Notes

This project is developed as part of an internship assignment to demonstrate backend development skills including system design, API development, and access control implementation.
