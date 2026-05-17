import { prisma } from '../src/lib/prisma';

async function main() {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, email: true, password: true, activo: true, rol: true }
  });
  console.log('Usuarios encontrados:', usuarios.length);
  usuarios.forEach(u => {
    console.log({
      email: u.email,
      tienePassword: !!u.password,
      preview: u.password ? u.password.substring(0, 30) : 'NULL/VACÍO',
      activo: u.activo,
    });
  });
  await prisma.$disconnect();
}
main().catch(console.error);
