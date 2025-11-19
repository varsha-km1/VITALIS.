const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Idempotency Check: Exit early if data already exists
  const existingTenant = await prisma.tenant.findFirst({
    where: { name: 'Default Veterinary Clinic' },
  });

  if (existingTenant) {
    console.log('⚠️  Database already seeded. Skipping to prevent duplication.');
    console.log('   To re-seed, manually delete existing data first.');
    return;
  }

  // 1. Create Default Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Default Veterinary Clinic',
      subdomain: 'default',
    },
  });
  console.log('✅ Created default tenant');

  // 2. Create Admin User (check if exists first)
  const adminEmail = 'admin@vitalis.ai';
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: 'Dr. Sarah Connor',
        firstName: 'Sarah',
        lastName: 'Connor',
        role: Role.ADMIN,
        tenantId: tenant.id,
      },
    });
    console.log('✅ Created admin user');
  } else {
    console.log('ℹ️  Admin user already exists, skipping...');
  }

  // 3. Create Sample Veterinarian
  const vetEmail = 'vet@vitalis.ai';
  let vet = await prisma.user.findUnique({
    where: { email: vetEmail },
  });

  if (!vet) {
    const hashedPassword = await bcrypt.hash('vet123', 12);
    vet = await prisma.user.create({
      data: {
        email: vetEmail,
        password: hashedPassword,
        fullName: 'Dr. James Wilson',
        firstName: 'James',
        lastName: 'Wilson',
        role: Role.VETERINARIAN,
        tenantId: tenant.id,
      },
    });
    console.log('✅ Created veterinarian user');
  } else {
    console.log('ℹ️  Veterinarian user already exists, skipping...');
  }

  // 4. Create Sample Patients
  const patients = [
    {
      name: 'Max',
      species: 'Canine',
      breed: 'Golden Retriever',
      age: 5,
      ownerId: 'owner-001',
      ownerName: 'John Smith',
      ownerContact: '+1-555-0101',
      medicalHistory: 'Vaccinated, no known allergies',
    },
    {
      name: 'Luna',
      species: 'Feline',
      breed: 'Siamese',
      age: 3,
      ownerId: 'owner-002',
      ownerName: 'Emily Davis',
      ownerContact: '+1-555-0102',
      medicalHistory: 'Indoor cat, regular checkups',
    },
    {
      name: 'Rex',
      species: 'Canine',
      breed: 'German Shepherd',
      age: 7,
      ownerId: 'owner-003',
      ownerName: 'Michael Johnson',
      ownerContact: '+1-555-0103',
      medicalHistory: 'Hip dysplasia, on medication',
    },
  ];

  for (const patientData of patients) {
    const existing = await prisma.patient.findFirst({
      where: {
        name: patientData.name,
        tenantId: tenant.id,
      },
    });

    if (!existing) {
      await prisma.patient.create({
        data: {
          ...patientData,
          tenantId: tenant.id,
        },
      });
      console.log(`✅ Created patient: ${patientData.name}`);
    } else {
      console.log(`ℹ️  Patient ${patientData.name} already exists, skipping...`);
    }
  }

  console.log('\n🎉 Database seeding completed successfully!\n');
  console.log('📋 Login Credentials:');
  console.log('   Admin: admin@vitalis.ai / admin123');
  console.log('   Vet: vet@vitalis.ai / vet123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

