# 🚀 Vitalis OS - Quick Start Guide

Get up and running with Vitalis OS in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ installed and running
- Git

## 🏃‍♂️ Fast Setup (Development)

### 1. Install Dependencies

```bash
# Frontend
cd vitalis-web
npm install

# Backend
cd ../vitalis-api
npm install
```

### 2. Configure Environment

**Backend** - Create `vitalis-api/.env`:
```env
DATABASE_URL="postgresql://vitalis:vitalis_secure@localhost:5432/vitalis_db?schema=public"
JWT_SECRET="vitalis_2035_neural_secure_key_change_in_production"
FRONTEND_URL="http://localhost:3001"
PORT=3000
NODE_ENV=development
```

**Frontend** - Create `vitalis-web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Setup Database

```bash
cd vitalis-api

# Create database (if using psql)
# createdb vitalis_db -U vitalis

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Start Both Services

**Terminal 1 - Backend:**
```bash
cd vitalis-api
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd vitalis-web
npm run dev
```

### 5. Access Application

- 🌐 **Frontend Dashboard**: http://localhost:3001/dashboard
- 🔌 **API**: http://localhost:3000
- 📚 **API Docs (Swagger)**: http://localhost:3000/api/docs

---

## 🐳 Docker Setup (Production-Ready)

### Single Command Deploy

```bash
docker-compose up --build
```

This starts:
- PostgreSQL database (port 5432)
- Vitalis API (port 3000)
- Vitalis Web (port 3001)

Access at http://localhost:3001

---

## 🧪 Test the AI Diagnostic Module

### Using the API Directly

```bash
curl -X POST http://localhost:3000/diagnostics/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "clinicalNotes": "Patient exhibits high fever, lethargy, and vomiting"
  }'
```

### Using Swagger UI

1. Go to http://localhost:3000/api/docs
2. Click on `POST /diagnostics/analyze`
3. Click "Try it out"
4. Enter test data
5. Execute

---

## 📝 Create Your First User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vet@vitalis.ai",
    "password": "securePass123",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "VETERINARIAN"
  }'
```

---

## 🛠️ Common Issues

### Database Connection Failed
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -l`

### Port Already in Use
- Backend: Change PORT in `vitalis-api/.env`
- Frontend: Use `npm run dev -- -p 3002`

### Prisma Client Not Generated
```bash
cd vitalis-api
npx prisma generate
```

### CORS Errors
- Check FRONTEND_URL matches in backend `.env`
- Ensure both services are running

---

## 📖 Next Steps

1. Explore the **Dashboard** at `/dashboard`
2. Read the **API Documentation** at `/api/docs`
3. Review **Database Schema**: `vitalis-api/prisma/schema.prisma`
4. Check out **Components**: `vitalis-web/src/components/`

---

## 🆘 Need Help?

Check the main [README.md](./README.md) for:
- Full architecture details
- API endpoint reference
- Component documentation
- Testing guide

---

**Welcome to the future of veterinary care! 🧬**

