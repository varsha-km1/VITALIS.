# Vitalis OS - Deployment Guide

## 🚀 Production Deployment Checklist

This guide ensures enterprise-grade deployment with security, reliability, and HIPAA compliance.

---

## Pre-Deployment Requirements

### Infrastructure
- [ ] PostgreSQL 15+ (Managed service recommended: AWS RDS, Google Cloud SQL)
- [ ] Container orchestration (Kubernetes, AWS ECS, or Docker Swarm)
- [ ] Load balancer with SSL termination
- [ ] Object storage for file uploads (S3, GCS)
- [ ] Redis cluster for caching (optional but recommended)

### Security
- [ ] SSL/TLS certificates (Let's Encrypt or commercial CA)
- [ ] Secrets management (AWS Secrets Manager, HashiCorp Vault)
- [ ] Network security groups/firewall rules
- [ ] DDoS protection (Cloudflare, AWS Shield)

### Monitoring
- [ ] Application Performance Monitoring (DataDog, New Relic)
- [ ] Log aggregation (ELK stack, CloudWatch)
- [ ] Uptime monitoring (Pingdom, UptimeRobot)
- [ ] Error tracking (Sentry)

---

## Step 1: Environment Configuration

### Backend (.env)

```bash
# Database (Use managed PostgreSQL in production)
DATABASE_URL="postgresql://username:password@hostname:5432/vitalis_prod?schema=public&sslmode=require"

# Authentication
JWT_SECRET="<GENERATE_STRONG_SECRET_512_BITS>"  # Use: openssl rand -base64 64
JWT_EXPIRATION="1h"

# Application
NODE_ENV=production
PORT=3000
FRONTEND_URL="https://app.vitalis.ai"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# SMTP (for notifications)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="<SENDGRID_API_KEY>"

# File Storage
AWS_S3_BUCKET="vitalis-prod-uploads"
AWS_REGION="us-east-1"
```

### Frontend (.env.production)

```bash
NEXT_PUBLIC_API_URL=https://api.vitalis.ai
NEXT_PUBLIC_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## Step 2: Database Preparation

### Enable SSL Connection

```bash
# Update connection string
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Run Migrations

```bash
cd vitalis-api
npx prisma migrate deploy
```

### Enable Transparent Data Encryption (TDE)

```sql
-- For PostgreSQL with TDE extension
ALTER DATABASE vitalis_prod SET encryption = on;
```

### Create Database Backups

```bash
# Automated daily backups (example using AWS RDS)
aws rds create-db-snapshot \
  --db-instance-identifier vitalis-prod \
  --db-snapshot-identifier vitalis-backup-$(date +%Y%m%d)
```

---

## Step 3: Docker Build Optimization

### Production Dockerfile (Backend)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/docs', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/main.js"]
```

### Build Images

```bash
# Backend
docker build -t vitalis-api:1.0.0 -f Dockerfile.api .

# Frontend
docker build -t vitalis-web:1.0.0 -f Dockerfile.web .

# Tag for registry
docker tag vitalis-api:1.0.0 your-registry/vitalis-api:1.0.0
docker push your-registry/vitalis-api:1.0.0
```

---

## Step 4: Kubernetes Deployment

### Backend Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vitalis-api
  namespace: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: vitalis-api
  template:
    metadata:
      labels:
        app: vitalis-api
        version: v1.0.0
    spec:
      containers:
      - name: api
        image: your-registry/vitalis-api:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: vitalis-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: vitalis-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/docs
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/docs
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: vitalis-api
  namespace: production
spec:
  selector:
    app: vitalis-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Secrets Management

```bash
# Create Kubernetes secrets
kubectl create secret generic vitalis-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=jwt-secret="your-secret" \
  -n production
```

---

## Step 5: Load Balancer & SSL

### Nginx Configuration

```nginx
upstream vitalis_api {
    least_conn;
    server api-1.internal:3000;
    server api-2.internal:3000;
    server api-3.internal:3000;
}

upstream vitalis_web {
    server web-1.internal:3001;
    server web-2.internal:3001;
}

server {
    listen 443 ssl http2;
    server_name api.vitalis.ai;

    ssl_certificate /etc/ssl/certs/vitalis.crt;
    ssl_certificate_key /etc/ssl/private/vitalis.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;

    location / {
        proxy_pass http://vitalis_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name app.vitalis.ai;

    ssl_certificate /etc/ssl/certs/vitalis.crt;
    ssl_certificate_key /etc/ssl/private/vitalis.key;

    location / {
        proxy_pass http://vitalis_web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Step 6: Monitoring & Logging

### Health Check Endpoints

```typescript
// vitalis-api/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('database'),
    ]);
  }
}
```

### Prometheus Metrics

```typescript
// Install: npm install @willsoto/nestjs-prometheus prom-client

// app.module.ts
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: '/metrics',
    }),
  ],
})
```

### Log Aggregation

```typescript
// Install: npm install winston

// logger.config.ts
import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## Step 7: Backup & Disaster Recovery

### Automated Backups

```bash
#!/bin/bash
# backup.sh - Run daily via cron

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Database backup
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_$DATE.sql"

# Upload to S3
aws s3 cp "$BACKUP_DIR/db_$DATE.sql" s3://vitalis-backups/db/

# Retain 30 days
find $BACKUP_DIR -name "db_*.sql" -mtime +30 -delete
```

### Disaster Recovery Plan

1. **RTO (Recovery Time Objective)**: 1 hour
2. **RPO (Recovery Point Objective)**: 15 minutes
3. **Backup Strategy**: 
   - Continuous replication to standby database
   - Hourly snapshots (retained 24 hours)
   - Daily backups (retained 30 days)
   - Weekly backups (retained 1 year)

---

## Step 8: Security Hardening

### Enable WAF (Web Application Firewall)

```yaml
# AWS WAF Rules
- SQLInjectionRule: BLOCK
- XSSRule: BLOCK
- RateLimitRule: 2000 requests per 5 minutes
- GeoBlockingRule: Allow only US, CA, EU
```

### Database Security

```sql
-- Create read-only user for analytics
CREATE USER vitalis_readonly WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE vitalis_prod TO vitalis_readonly;
GRANT USAGE ON SCHEMA public TO vitalis_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO vitalis_readonly;

-- Revoke public access
REVOKE ALL ON DATABASE vitalis_prod FROM PUBLIC;
```

### Secrets Rotation

```bash
# Rotate JWT secret every 90 days
aws secretsmanager rotate-secret \
  --secret-id prod/vitalis/jwt-secret \
  --rotation-lambda-arn arn:aws:lambda:...
```

---

## Step 9: Performance Optimization

### Database Indexing

```sql
-- Add composite indexes for common queries
CREATE INDEX idx_patient_tenant_created ON "Patient" ("tenantId", "createdAt" DESC);
CREATE INDEX idx_diagnostic_patient_severity ON "DiagnosticReport" ("patientId", "severity", "createdAt" DESC);
CREATE INDEX idx_audit_user_timestamp ON "AuditLog" ("userId", "timestamp" DESC);

-- Analyze tables
ANALYZE "Patient";
ANALYZE "DiagnosticReport";
ANALYZE "User";
```

### Redis Caching

```typescript
// Install: npm install @nestjs/cache-manager cache-manager-redis-store

// cache.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 3600,
    }),
  ],
})
```

---

## Step 10: Go-Live Checklist

### Pre-Launch
- [ ] Load testing completed (target: 10,000 concurrent users)
- [ ] Security audit passed (OWASP Top 10)
- [ ] HIPAA compliance verified
- [ ] Backup/restore tested
- [ ] SSL certificates installed and validated
- [ ] DNS configured (A/AAAA records, CDN)
- [ ] Monitoring dashboards configured
- [ ] Runbook created for on-call team

### Launch Day
- [ ] Database migrations applied
- [ ] Health checks passing
- [ ] SSL redirects working
- [ ] Error rates within threshold (<0.1%)
- [ ] Response times acceptable (p95 < 200ms)
- [ ] Uptime monitoring active

### Post-Launch
- [ ] Monitor error rates for 24 hours
- [ ] Review audit logs for anomalies
- [ ] Verify backup success
- [ ] Update documentation
- [ ] Team retrospective

---

## Rollback Procedure

If critical issues arise:

```bash
# 1. Rollback Kubernetes deployment
kubectl rollout undo deployment/vitalis-api -n production

# 2. Rollback database migrations (if needed)
npx prisma migrate resolve --rolled-back <migration-name>

# 3. Verify health
kubectl get pods -n production
curl https://api.vitalis.ai/health
```

---

## Support & Maintenance

### Monitoring URLs
- **Uptime**: https://status.vitalis.ai
- **Metrics**: https://grafana.vitalis.ai
- **Logs**: https://logs.vitalis.ai

### Emergency Contacts
- **On-Call Engineer**: pagerduty.com/vitalis
- **DBA**: database-team@vitalis.ai
- **Security**: security@vitalis.ai

---

**Deployment Guide Version**: 1.0  
**Last Updated**: January 2024  
**Next Review**: April 2024

