# Vacancy Postulation Platform

A REST API built with **Node.js** and **NestJS** to manage employability vacancies and coder applications centrally.

## 📋 Table of Contents
- [Description](#description)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

## 📖 Description
This platform facilitates the job insertion of coders by centralizing vacancy publications and tracking applications. It allows:
- **Gestors** (Managers) to publish and manage vacancies.
- **Coders** to register, explore, and apply to vacancies.
- **Admins** to oversee the entire system.

## 🛠 Technologies
- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL (via [Supabase](https://supabase.com/))
- **ORM**: [TypeORM](https://typeorm.io/)
- **Documentation**: Swagger
- **Validation**: class-validator & class-transformer

## 📂 Project Structure
The project follows a modular architecture:

```
src/
├── app.module.ts        # Root module
├── main.ts              # Entry point
├── auth/                # Authentication module (JWT, API Key)
├── users/               # Users management (Coders, Admins, Gestors)
├── vacancies/           # Vacancies management
└── applications/        # Applications management
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- A generic PostgreSQL database or Supabase project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PlataformaPostulaciones
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see [.env.example](.env.example)):
   ```bash
   cp .env.example .env
   # Update .env with your credentials
   ```

4. Run the project:
   ```bash
   # Development
   npm run start:dev

   # Watch mode
   npm run start:dev
   ```

## 🔐 Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DB_HOST=your_db_host
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
```

## 📚 API Documentation
Once the server is running, access the Swagger documentation at:
`http://localhost:3000/api/docs`
