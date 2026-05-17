const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('unt123456', 12);

  await prisma.usuario.upsert({
    where: { email: 'admin@unitru.edu.pe' },
    update: { password: passwordHash, activo: true },
    create: {
      email: 'admin@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Administrador',
      apellidos: 'Sistema',
      rol: 'ADMINISTRADOR',
      verificado: true,
      activo: true,
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'operador@unitru.edu.pe' },
    update: { password: passwordHash, activo: true },
    create: {
      email: 'operador@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Operador',
      apellidos: 'Sistema',
      rol: 'OPERADOR',
      verificado: true,
      activo: true,
    },
  });

  let periodo = await prisma.periodoAcademico.findFirst({ where: { nombre: '2026-I' } });
  if (!periodo) {
    periodo = await prisma.periodoAcademico.create({
      data: {
        nombre: '2026-I',
        fechaInicio: new Date('2026-03-01'),
        fechaFin: new Date('2026-07-15'),
        estado: 'ACTIVO',
        activo: true,
      },
    });
  } else {
    periodo = await prisma.periodoAcademico.update({
      where: { id: periodo.id },
      data: { activo: true, estado: 'ACTIVO' },
    });
  }

  const ordenCategorias = ['PRINCIPAL', 'ASOCIADO', 'AUXILIAR', 'CONTRATADO', 'INVITADO'];
  const configExistente = await prisma.configuracionPeriodo.findUnique({
    where: { periodoId: periodo.id },
  });
  if (!configExistente) {
    await prisma.configuracionPeriodo.create({
      data: { periodoId: periodo.id, ordenCategorias },
    });
  }

  console.log('Seed mínimo completado: admin, operador, período 2026-I');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
