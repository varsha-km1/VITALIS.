# Vitalis API 🔌

The neural backbone of Vitalis OS - a NestJS-powered backend with AI diagnostic capabilities.

## Features

- **AI Diagnostic Engine**: Real-time clinical analysis
- **JWT Authentication**: Secure user management
- **Prisma ORM**: Type-safe database access
- **Swagger Docs**: Auto-generated API documentation
- **E2E Testing**: Comprehensive test coverage

## Development

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

API: [http://localhost:3000](http://localhost:3000)  
Docs: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Tech Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Passport JWT
- Swagger/OpenAPI

## Environment

Create `.env`:
```env
DATABASE_URL="postgresql://vitalis:vitalis_secure@localhost:5432/vitalis_db"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:3001"
PORT=3000
```

## Testing

```bash
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

