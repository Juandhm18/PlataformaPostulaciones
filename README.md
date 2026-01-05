# Vacancy Postulation Platform

A robust REST API built with NestJS to manage employability vacancies and the application process, featuring a role-based access control system and a lightweight frontend client.

## 🚀 Features

### Backend (NestJS)
*   **Modular Architecture**: Organized into `Auth`, `Users`, `Vacancies`, and `Applications` modules.
*   **Database Integration**: Tech stack includes **TypeORM** and **PostgreSQL** (compatible with Supabase).
*   **Authentication & Security**:
    *   **JWT Strategies**: Secure user sessions.
    *   **API Key**: Additional layer for sensitive endpoints.
    *   **RBAC**: Custom Guards (`RolesGuard`) and Decorators (`@Roles`) for Admin, Gestor, and Coder permissions.
    *   **Password Hashing**: Implemented with BCrypt.
*   **Business Logic**:
    *   **Vacancies**: CRUD operations restricted to Managers/Admins, with Applicant limits.
    *   **Applications**: Coder application flow with duplicate checks and strict limits (max 3 active applications).
*   **Validation**: Robust DTOs using `class-validator`.
*   **Docs**: Auto-generated **Swagger** documentation.

### Frontend
*   **Client**: Simple HTML/JS client located in `client/` directory.
*   **UI**: Styled with **TailwindCSS**.
*   **Capabilities**: Login/Register, View Vacancies, Apply (as Coder), Create Vacancy (as Manager).

## 🛠️ Tech Stack
*   **Framework**: [NestJS](https://nestjs.com/)
*   **Language**: TypeScript
*   **Database**: PostgreSQL / Supabase
*   **ORM**: TypeORM
*   **Frontend**: HTML5, Vanilla JS, TailwindCSS

## 📂 Project Structure

```bash
src/
├── auth/           # Authentication logic (strategies, guards, decorators)
├── users/          # User management
├── vacancies/      # Vacancy CRUD and logic
├── applications/   # Application handling and business rules
├── database/       # Seeders
├── common/         # Global interceptors and filters
└── main.ts         # Entry point (Swagger & CORS setup)
client/             # Frontend application
```

## ⚡ Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory. You can use `.env.example` as a reference:
```bash
cp .env.example .env
```
Ensure you provide a valid `DB_URL` (PostgreSQL connection string) or fill in the individual DB fields.

### 3. Database Seeding
To initialize the database with default users (Admin & Manager):
```bash
npm run seed
```
*   **Admin**: `admin@riwi.io` / `admin123`
*   **Gestor**: `gestor@riwi.io` / `gestor123`

### 4. Running the Application
Start the development server:
```bash
npm run start:dev
```
 The API will be running at `http://localhost:3000/api`.

### 5. Running the Frontend
Simply open the `client/index.html` file in your preferred browser.
*Note: Ensure the backend is running first.*

## 📚 Documentation
Interactive API documentation via Swagger is available at:
`http://localhost:3000/api/docs`

## 🧪 Testing
Run unit tests for services:
```bash
npm run test
```
