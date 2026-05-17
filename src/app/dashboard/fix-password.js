const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 12);
  const result = await prisma.usuario.updateMany({
    where: { email: 'admin@unitru.edu.pe' },
    data: { password: hash }
  });
  console.log('Actualizado:', result);
  await prisma.$disconnect();
}

main().catch(console.error);