# Vitalis OS - Enterprise Architecture

## 🏗️ System Architecture Overview

Vitalis OS is a **multi-tenant, HIPAA-compliant, AI-powered** veterinary SaaS platform built for enterprise deployment.

---

## 📐 Architecture Layers

### 1. **Presentation Layer** (Frontend)
- **Technology**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Hooks, Context API
- **API Client**: Typed fetch wrapper with JWT authentication
- **Design**: Bioluminescent Futurism (Glassmorphism 3.0)

### 2. **Application Layer** (Backend API)
- **Framework**: NestJS (Node.js, TypeScript)
- **Architecture**: Modular monolith with domain-driven design
- **Authentication**: Passport JWT strategy
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

### 3. **Data Layer**
- **Database**: PostgreSQL 15+
- **ORM**: Prisma (Type-safe queries)
- **Migrations**: Prisma Migrate
- **Connection Pooling**: PgBouncer (recommended for production)

### 4. **Infrastructure Layer**
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Docker Compose (Dev), Kubernetes (Production)
- **Monitoring**: Health checks on all services
- **Logging**: Winston (recommended)

---

## 🔒 Multi-Tenancy Architecture

### Tenant Isolation Strategy

Vitalis OS implements **Row-Level Multi-Tenancy** (shared database, shared schema):

```
Tenant (Clinic)
├── Users (Veterinarians, Nurses, Admins)
├── Patients (Animals)
│   ├── Diagnostic Reports
│   └── Appointments
└── Audit Logs
```

**Key Features**:
- All data operations filtered by `tenantId`
- JWT tokens include `tenantId` claim
- Database indexes on `tenantId` for performance
- Cross-tenant access prevented at service layer

**Security Guarantees**:
1. User can only access data from their tenant
2. JWT validation ensures tenant context
3. Prisma queries automatically scoped to tenant
4. Audit logs track all cross-boundary attempts

---

## 🛡️ Security Architecture

### Authentication Flow

```
1. User submits credentials
   ↓
2. AuthService validates against database
   ↓
3. Bcrypt verifies password hash (12 rounds)
   ↓
4. JWT signed with payload: { sub, email, role, tenantId }
   ↓
5. Token returned to client (expires in 1h)
   ↓
6. Client includes token in Authorization header
   ↓
7. JwtStrategy validates and extracts user context
   ↓
8. @UseGuards(JwtAuthGuard) protects routes
```

### Authorization Levels

| Role | Permissions |
|------|------------|
| **ADMIN** | Full system access, tenant management |
| **VETERINARIAN** | Patient CRUD, diagnostics, appointments |
| **NURSE** | Patient view, appointment scheduling |
| **TECHNICIAN** | Diagnostic reports read-only |

---

## 🧠 AI Architecture

### Diagnostic Engine

**Current Implementation** (Simulated):
```typescript
Input: Clinical symptoms (text)
  ↓
Keyword Analysis (bleeding, collapse, fever, etc.)
  ↓
Severity Classification (LOW/MODERATE/CRITICAL/FATAL)
  ↓
Confidence Score (85-99%)
  ↓
Medical Recommendation (treatment protocol)
  ↓
Database Persistence + Audit Log
```

**Production Integration Path**:
1. **Natural Language Processing**: OpenAI GPT-4 API
2. **Medical Imaging**: TensorFlow.js for X-ray analysis
3. **Predictive Models**: Custom ML models (Python microservice)
4. **Real-time Inference**: gRPC for low-latency communication

---

## 📊 Database Schema

### Core Models

```prisma
Tenant (1) ──┬──> (N) User
             ├──> (N) Patient ──┬──> (N) DiagnosticReport
             │                  └──> (N) Appointment
             └──> Audit Logs

User ────> (N) AuditLog
```

### Indexes for Performance

- `User`: `(tenantId, email)`, `(tenantId, role)`
- `Patient`: `(tenantId, species)`, `(tenantId, createdAt)`
- `AuditLog`: `(userId, timestamp)`, `(action, timestamp)`

---

## 🔍 HIPAA Compliance

### Implemented Controls

| HIPAA Rule | Implementation |
|------------|----------------|
| **§ 164.312(b) Audit Controls** | AuditLog model tracks all operations |
| **§ 164.312(a)(1) Access Control** | RBAC with JWT |
| **§ 164.312(c)(1) Integrity** | PostgreSQL constraints, Prisma validation |
| **§ 164.312(d) Encryption** | TLS in transit, PG TDE at rest (ready) |
| **§ 164.308(a)(5)(ii) Logon Monitoring** | Failed login attempts tracked |

### Audit Trail

Every sensitive operation logs:
- **Who**: userId
- **What**: action (CREATE_DIAGNOSTIC, VIEW_PATIENT)
- **When**: timestamp (ISO 8601)
- **Where**: ipAddress
- **Resource**: Table:ID

---

## 🚀 Deployment Architecture

### Development

```yaml
docker-compose.yml
├── postgres (port 5432)
│   └── healthcheck: pg_isready
├── api (port 3000)
│   ├── depends_on: postgres (healthy)
│   └── healthcheck: /api/docs
└── web (port 3001)
    ├── depends_on: api (healthy)
    └── healthcheck: homepage
```

### Production (Kubernetes)

```
Ingress (HTTPS) ──> Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Frontend Pods    API Pods        Database
   (Next.js)        (NestJS)       (CloudSQL)
        │                │                │
   [3 replicas]    [5 replicas]    [HA Cluster]
```

**Additional Production Components**:
- **Redis**: Session storage, caching
- **CloudSQL**: Managed PostgreSQL with automated backups
- **Cloud Storage**: File uploads (X-rays, documents)
- **Cloud CDN**: Static asset delivery
- **Cloud Armor**: DDoS protection

---

## 📈 Scalability Considerations

### Vertical Scaling (Current)
- Docker Compose with resource limits
- Single database instance

### Horizontal Scaling (Production)
1. **API Layer**: Stateless containers (scale to 100+ pods)
2. **Database**: Read replicas for analytics queries
3. **Caching**: Redis for frequently accessed data
4. **File Storage**: Object storage (S3/GCS)

### Performance Targets
- **API Response**: <100ms (p95)
- **AI Inference**: <2s (diagnostic analysis)
- **Database Queries**: <50ms (indexed queries)
- **Frontend Load**: <1s (LCP)

---

## 🔧 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 | Server-side rendering, routing |
| UI Library | React 18 | Component framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Animation | Framer Motion | GPU-accelerated animations |
| Backend | NestJS | Enterprise Node.js framework |
| Database | PostgreSQL 15 | Relational data storage |
| ORM | Prisma | Type-safe database client |
| Auth | Passport JWT | Token-based authentication |
| Validation | class-validator | DTO validation |
| Docs | Swagger | API documentation |
| Containerization | Docker | Application packaging |

---

## 🎯 Future Enhancements

### Phase 2
- [ ] WebSocket integration for real-time vitals
- [ ] Mobile app (React Native)
- [ ] Telemedicine video calls
- [ ] Prescription management

### Phase 3
- [ ] Computer vision for X-ray/MRI analysis
- [ ] Wearable device integration (IoT)
- [ ] Predictive health monitoring
- [ ] Multi-language support

### Phase 4
- [ ] Blockchain for medical records
- [ ] Federated learning for AI models
- [ ] Global clinic network
- [ ] Research data marketplace

---

## 📚 References

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)

---

**Last Updated**: January 2024  
**Architecture Version**: 1.0.0  
**Maintained By**: Vitalis Engineering Team

