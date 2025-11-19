# VITALIS OS 🧬

> **Veterinary Intelligence & Triage Automated Life-support System**  
> The world's most advanced Veterinary AI SaaS platform.

---

## 🌟 Vision

Vitalis OS brings cutting-edge medical AI technology—currently available only to humans—to veterinary care. With hyper-futuristic interfaces, real-time AI diagnostics, and predictive analytics, we're transforming how veterinarians care for animals.

## 🎨 Design Philosophy

**"Bioluminescent Futurism"** — Deep onyx backgrounds illuminated by data-driven "life streams" of neon cyans and organic purples. Built with Glassmorphism 3.0, physics-based animations, and holographic UI elements.

## 🏗️ Architecture

### Frontend (`vitalis-web`)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Features**: 
  - Holographic dashboard with real-time AI insights
  - GPU-accelerated motion components
  - Dark glassmorphic interface with neon accents

### Backend (`vitalis-api`)
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **AI Module**: Smart diagnostic analysis engine
- **API Docs**: Swagger/OpenAPI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Development Setup

1. **Clone and Install**
```bash
# Install frontend dependencies
cd vitalis-web
npm install

# Install backend dependencies
cd ../vitalis-api
npm install
```

2. **Database Setup**
```bash
cd vitalis-api

# Configure your DATABASE_URL in .env file
# Example: DATABASE_URL="postgresql://vitalis:vitalis_secure@localhost:5432/vitalis_db?schema=public"

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

3. **Start Development Servers**
```bash
# Terminal 1 - Start Backend (Port 3000)
cd vitalis-api
npm run start:dev

# Terminal 2 - Start Frontend (Port 3001)
cd vitalis-web
npm run dev
```

4. **Access the Application**
- 🌐 **Frontend**: http://localhost:3001
- 🔌 **API**: http://localhost:3000
- 📚 **API Docs**: http://localhost:3000/api/docs

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Individual Docker Builds
```bash
# Build API
docker build -f Dockerfile.api -t vitalis-api .

# Build Web
docker build -f Dockerfile.web -t vitalis-web .

# Run with docker run (requires PostgreSQL)
docker run -p 3000:3000 vitalis-api
docker run -p 3001:3001 vitalis-web
```

## 🧪 Testing

### Backend Tests
```bash
cd vitalis-api

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

### Frontend Tests
```bash
cd vitalis-web

# Run tests (if configured)
npm test
```

## 📁 Project Structure

```
VetOS/
├── vitalis-web/              # Next.js Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # UI Components
│   │   │   ├── ui/           # Atomic components (Button, Input)
│   │   │   └── hologram/     # 3D/Motion components
│   │   ├── lib/              # Utilities
│   │   └── hooks/            # Custom React hooks
│   └── package.json
│
├── vitalis-api/              # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # Authentication (JWT)
│   │   │   ├── patients/     # Patient management
│   │   │   ├── diagnostics/  # AI diagnostic engine
│   │   │   └── appointments/ # Scheduling
│   │   ├── infra/
│   │   │   └── database/     # Prisma service
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
│
├── docker-compose.yml        # Multi-service orchestration
├── Dockerfile.api            # API container
├── Dockerfile.web            # Web container
└── README.md
```

## 🔑 Key Features

### 🤖 AI Diagnostic Module
The core AI engine analyzes clinical notes and patient data to provide:
- **Real-time severity classification** (LOW, MODERATE, CRITICAL)
- **Confidence scoring** for diagnostic accuracy
- **Automated recommendations** for treatment protocols
- **Historical analysis** with diagnostic report storage

**API Endpoint**: `POST /diagnostics/analyze`

```json
{
  "patientId": "uuid",
  "clinicalNotes": "Patient exhibits fever, lethargy..."
}
```

### 🔐 Authentication System
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing with bcrypt
- Protected API routes

### 🐾 Patient Management
- Complete patient records with medical history
- Owner information tracking
- Diagnostic report linking
- Species and breed tracking

### 📅 Appointment System
- Scheduling with veterinarian assignment
- Status tracking (SCHEDULED, COMPLETED, CANCELLED)
- Upcoming appointment queries

## 🎯 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive JWT
- `GET /auth/profile` - Get current user (protected)

### Patients
- `POST /patients` - Create patient record
- `GET /patients` - List all patients
- `GET /patients/:id` - Get patient with diagnostics
- `PATCH /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Diagnostics
- `POST /diagnostics/analyze` - Submit for AI analysis
- `GET /diagnostics/patient/:patientId` - Get patient's reports
- `GET /diagnostics/:id` - Get specific report

### Appointments
- `POST /appointments` - Schedule appointment
- `GET /appointments` - List all appointments
- `GET /appointments/upcoming` - Get upcoming only

## 🔧 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vitalis_db"
JWT_SECRET="your-secret-key-change-in-production"
FRONTEND_URL="http://localhost:3001"
PORT=3000
NODE_ENV=development
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🛡️ Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation with class-validator
- SQL injection protection via Prisma
- Password hashing with bcrypt (12 rounds)
- JWT token expiration (24h)

## 📊 Database Schema

### Models
- **User** - System users (veterinarians, staff)
- **Patient** - Animal patients with owner info
- **DiagnosticReport** - AI analysis results
- **Appointment** - Scheduling data

See `vitalis-api/prisma/schema.prisma` for full schema.

## 🎨 UI Components

### VitalisButton
A GPU-accelerated button with:
- Physics-based spring animations
- Glassmorphic styling
- Ambient glow effects
- Variants: primary, hazard, ghost

### Dashboard
- 12-column grid layout
- Real-time AI insights stream
- Animated metric cards
- System status indicators

## 📈 Performance

- **Frontend**: Static generation + ISR for optimal loading
- **Backend**: Connection pooling with Prisma
- **Docker**: Multi-stage builds for minimal image size
- **Animations**: GPU-accelerated via Framer Motion

## 🚧 Future Enhancements

- [ ] Real-time WebSocket integration for live monitoring
- [ ] Computer vision for X-ray/MRI analysis
- [ ] Voice-to-text clinical note capture
- [ ] Predictive health monitoring with ML models
- [ ] Integration with medical devices (IoT)
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a production-ready SaaS platform. For contributions:
1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Submit a pull request

## 📄 License

Proprietary - Vitalis Technologies © 2035

---

**Built with 💙 for the future of veterinary care.**

*"Extending human-grade AI medical technology to every animal on Earth."*

