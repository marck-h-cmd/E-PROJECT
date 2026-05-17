import { PrismaClient, Rol, EstadoPeriodo } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Iniciando corrección de datos...');

  // 1. Crear o actualizar usuario Admin
  const passwordHash = await bcrypt.hash('unt123456', 12);
  const adminEmail = 'admin@unitru.edu.pe';

  const admin = await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      activo: true,
      rol: Rol.ADMINISTRADOR,
    },
    create: {
      email: adminEmail,
      password: passwordHash,
      nombre: 'Admin',
      apellidos: 'UNT',
      rol: Rol.ADMINISTRADOR,
      activo: true,
      verificado: true,
    },
  });

  console.log(`✅ Usuario Admin configurado: ${admin.email}`);

  // 2. Asegurar que haya un período activo
  const periodoExistente = await prisma.periodoAcademico.findFirst({
    where: { activo: true }
  });

  if (!periodoExistente) {
    const periodo = await prisma.periodoAcademico.create({
      data: {
        nombre: '2024-II (ACTIVO)',
        fechaInicio: new Date('2024-09-01'),
        fechaFin: new Date('2025-01-31'),
        estado: EstadoPeriodo.ACTIVO,
        activo: true,
        configuraciones: {
          create: {
            horasMaxDiariasDocente: 8,
            horasMaxContinuas: 4,
            descansoMinEntreHoras: 1,
            ordenCategorias: ['PRINCIPAL', 'ASOCIADO', 'AUXILIAR', 'CONTRATADO', 'INVITADO']
          }
        }
      }
    });
    console.log(`✅ Período activo creado: ${periodo.nombre}`);
  } else {
    await prisma.periodoAcademico.update({
      where: { id: periodoExistente.id },
      data: { 
        activo: true,
        estado: EstadoPeriodo.ACTIVO
      }
    });
    console.log(`✅ Período existente activado: ${periodoExistente.nombre}`);
  }

  console.log('🎉 Corrección completada con éxito');
}

main()
  .catch((e) => {
    console.error('❌ Error corrigiendo datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
