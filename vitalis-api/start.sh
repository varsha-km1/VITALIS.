#!/bin/sh
set -e

echo "🚀 Vitalis OS - Startup Script"
echo "================================"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until nc -z postgres 5432; do
  echo "   Database not ready yet, retrying in 2s..."
  sleep 2
done
echo "✅ PostgreSQL is ready!"

# Wait for Redis to be ready
echo ""
echo "⏳ Waiting for Redis..."
until nc -z redis 6379; do
  echo "   Redis not ready yet, retrying in 2s..."
  sleep 2
done
echo "✅ Redis is ready!"

# Run Prisma migrations
echo ""
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client (in case it's missing)
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run database seed (idempotent - checks for existing data)
echo ""
echo "🌱 Seeding database (idempotent)..."
npx prisma db seed || echo "⚠️  Seed already complete or failed (continuing anyway)"

# Start the application
echo ""
echo "🎯 Starting Vitalis OS API..."
echo "================================"
npm run start:prod

