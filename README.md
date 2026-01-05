# RIWI Vacancy Platform

https://github.com/Juandhm18/PlataformaPostulaciones

A comprehensive technical recruitment platform designed to connect talent with opportunities. This application empowers Managers to curate job listings and Coders to manage their professional applications through a secure, high-performance interface with a premium Night View aesthetic.

## Core Features

### Backend Architecture (NestJS)
- **Advanced Security**: 
    - Stateless JWT authentication for secure sessions.
    - Global API Key protection via x-api-key header.
    - Fine-grained Role-Based Access Control (RBAC) supporting Admin, Manager, and Coder.
- **Enterprise Logic**:
    - Capacity-aware vacancy management.
    - Automated application throttling (max 3 active per user).
    - Intelligent preventions for duplicate submissions.
- **Standardized Communication**: 
    - Global interceptors for unified JSON response formats.
    - Centralized exception handling for consistent error reporting.
- **API Documentation**: Fully integrated Swagger (OpenAPI) documentation.

### Frontend Experience (React + Vite)
- **Modern Infrastructure**: Powered by React 19 and Vite for lightning-fast delivery.
- **Night View Theme**: A premium, obsidian-and-gold design system engineered for visual comfort and elegance.
- **Responsive Design**: Fluid layouts that adapt seamlessly from mobile devices to desktop monitors.
- **Micro-interactions**: Subtle animations and transitions for an organic user experience.

## Technical Stack

- **Runtime**: Node.js
- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: TypeORM
- **Frontend**: React 19, TailwindCSS 4, TypeScript
- **Documentation**: Swagger UI

## Repository Structure

```text
/
├── frontend/               # React Application
│   ├── src/                # Component architecture and state management
│   └── index.css           # Global typography and Night View tokens
├── src/                    # Backend Source Code
│   ├── auth/               # Security layer (Guards & Strategies)
│   ├── vacancies/          # Job management services
│   ├── applications/       # Application lifecycle processing
│   ├── common/             # Interceptors and global filters
│   └── seed.ts             # Environment initialization script
├── README.md               # Technical documentation
└── package.json            # Configuration and dependencies
```

## Setup and Installation

### 1. Dependency Management
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Configuration
Create a .env file in the root directory based on .env.example:
```env
DB_URL="your_postgres_connection_string"
JWT_SECRET="your_secure_jwt_secret"
API_KEY="your_internal_api_key"
```

### 3. Database Initialization
Synchronize the schema and populate initial data:
```bash
npm run seed
```
**Default Access Credentials:**
- **Administrator**: admin@riwi.io / admin123
- **Manager**: gestor@riwi.io / gestor123

### 4. Running the Application
**Backend API:**
```bash
npm run start:dev
```
Access at: http://localhost:3000/api
Documentation: http://localhost:3000/api/docs

**Frontend Development:**
```bash
cd frontend
npm run dev
```
Access at: http://localhost:5173 (or assigned port)

## Docker Deployment

This project is fully dockerized for consistent environments across development and production.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Visual Guide & Step-by-Step

#### 1. Configuration
Ensure your `.env` file is present in the root directory. Docker Compose will use this file to configure the backend and database.

#### 2. Building and Starting
Run the following command in the root directory:
```bash
docker-compose up --build
```
This will:
- Build the backend image (NestJS).
- Build the frontend image (React + Nginx).
- Start a local PostgreSQL instance.

#### 3. Initialization
Once the containers are running, you need to seed the database (only the first time):
```bash
docker-compose exec backend npm run seed
```

#### 4. Accessing Services
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Database**: localhost:5432 (Internal to Docker network)

### Troubleshooting
If you encounter port conflicts, you can stop existing processes with:
```bash
# Kil processes on common ports
fuser -k 3000/tcp 5173/tcp 5432/tcp
```

## Business Logic Rules

1. **Capacity Enforcement**: The system automatically closes applications when a vacancy's applicant limit is reached.
2. **Duplicate Prevention**: Users are restricted from applying to the same position multiple times.
3. **Application Control**: A Coder may only have 3 active applications concurrently.
4. **Authorized Management**: Creation and editing of vacancies are strictly limited to Manager and Admin roles.
5. **Security Requirements**: Every request must include the valid x-api-key. Protected operations additionally require a Bearer JWT token.
