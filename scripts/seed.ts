import { PrismaClient, Rol, CategoriaDocente, TipoAmbiente } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando generación de datos semilla...');

  // Limpiar datos existentes en orden
  await prisma.seleccionTemporal.deleteMany();
  await prisma.envioNotificacion.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.atencionVentana.deleteMany();
  await prisma.ventanaAtencion.deleteMany();
  await prisma.validacionHorario.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.disponibilidadDocente.deleteMany();
  await prisma.restriccionAmbiente.deleteMany();
  await prisma.mantenimientoAmbiente.deleteMany();
  await prisma.preferenciasNotificacion.deleteMany();
  await prisma.cursoDocente.deleteMany();
  await prisma.grupo.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.docente.deleteMany();
  await prisma.sesion.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.configuracionPeriodo.deleteMany();
  await prisma.diaNoLaborable.deleteMany();
  await prisma.ambiente.deleteMany();
  await prisma.periodoAcademico.deleteMany();
  await prisma.registroAuditoria.deleteMany();

  console.log('✅ Datos anteriores limpiados');

  // Crear usuarios
  const passwordHash = await bcrypt.hash('unt123456', 12);
  
  const adminUser = await prisma.usuario.create({
    data: {
      email: 'admin@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Administrador',
      apellidos: 'Sistema',
      rol: Rol.ADMINISTRADOR,
      verificado: true,
    }
  });

  const operadorUser = await prisma.usuario.create({
    data: {
      email: 'operador@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Operador',
      apellidos: 'Sistema',
      rol: Rol.OPERADOR,
      verificado: true,
    }
  });

  const superAdminUser = await prisma.usuario.create({
    data: {
      email: 'superadmin@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Super',
      apellidos: 'Admin',
      rol: Rol.SUPER_ADMIN,
      verificado: true,
    }
  });

  console.log('✅ Usuarios creados');

  // Crear docentes de ejemplo
  const docentesData = [
    {
      email: 'juan.perez@unitru.edu.pe',
      nombre: 'Juan',
      apellidos: 'Pérez García',
      codigo: 'DOC001',
      categoria: CategoriaDocente.PRINCIPAL,
      departamento: 'Ingeniería de Software'
    },
    {
      email: 'maria.lopez@unitru.edu.pe',
      nombre: 'María',
      apellidos: 'López Torres',
      codigo: 'DOC002',
      categoria: CategoriaDocente.ASOCIADO,
      departamento: 'Ciencias de la Computación'
    },
    {
      email: 'carlos.rodriguez@unitru.edu.pe',
      nombre: 'Carlos',
      apellidos: 'Rodríguez Sánchez',
      codigo: 'DOC003',
      categoria: CategoriaDocente.AUXILIAR,
      departamento: 'Ingeniería de Software'
    },
    {
      email: 'ana.martinez@unitru.edu.pe',
      nombre: 'Ana',
      apellidos: 'Martínez Díaz',
      codigo: 'DOC004',
      categoria: CategoriaDocente.CONTRATADO,
      departamento: 'Redes y Comunicaciones'
    },
    {
      email: 'pedro.garcia@unitru.edu.pe',
      nombre: 'Pedro',
      apellidos: 'García Fernández',
      codigo: 'DOC005',
      categoria: CategoriaDocente.INVITADO,
      departamento: 'Sistemas de Información'
    }
  ];

  const docentes = [];
  for (const docenteData of docentesData) {
    const user = await prisma.usuario.create({
      data: {
        email: docenteData.email,
        password: passwordHash,
        nombre: docenteData.nombre,
        apellidos: docenteData.apellidos,
        rol: Rol.DOCENTE,
        verificado: true,
      }
    });

    const docente = await prisma.docente.create({
      data: {
        usuarioId: user.id,
        codigo: docenteData.codigo,
        categoria: docenteData.categoria,
        departamento: docenteData.departamento,
        telefono: '999123456',
        preferenciasNotificacion: {
          create: {
            correoActivo: true,
            whatsappActivo: true,
            telegramActivo: false,
            sistemaActivo: true,
          }
        }
      }
    });

    docentes.push(docente);
  }

  console.log('✅ Docentes creados');

  // Crear cursos
  const cursosData = [
    { codigo: 'IS101', nombre: 'Introducción a la Programación', creditos: 4, horasTeoria: 2, horasPractica: 4, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'IS201', nombre: 'Estructura de Datos', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 2 },
    { codigo: 'IS301', nombre: 'Base de Datos', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 3 },
    { codigo: 'IS401', nombre: 'Ingeniería de Software', creditos: 4, horasTeoria: 3, horasPractica: 2, horasLaboratorio: 0, ciclo: 4 },
    { codigo: 'IS501', nombre: 'Sistemas Operativos', creditos: 3, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'IS601', nombre: 'Redes de Computadoras', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 6 },
    { codigo: 'IS701', nombre: 'Inteligencia Artificial', creditos: 4, horasTeoria: 3, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
    { codigo: 'IS801', nombre: 'Gestión de Proyectos TI', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 8 },
  ];

  const cursos = [];
  for (const cursoData of cursosData) {
    const curso = await prisma.curso.create({
      data: {
        ...cursoData,
        grupos: {
          create: [
            { nombre: 'A', capacidad: 30 },
            { nombre: 'B', capacidad: 30 },
          ]
        }
      }
    });
    cursos.push(curso);
  }

  console.log('✅ Cursos creados con grupos');

  // Asignar cursos a docentes
  const asignaciones = [
    { cursoIndex: 0, docenteIndex: 0, horasAsignadas: 6 },
    { cursoIndex: 0, docenteIndex: 1, horasAsignadas: 4 },
    { cursoIndex: 1, docenteIndex: 1, horasAsignadas: 6 },
    { cursoIndex: 1, docenteIndex: 2, horasAsignadas: 4 },
    { cursoIndex: 2, docenteIndex: 2, horasAsignadas: 6 },
    { cursoIndex: 2, docenteIndex: 3, horasAsignadas: 4 },
    { cursoIndex: 3, docenteIndex: 3, horasAsignadas: 5 },
    { cursoIndex: 3, docenteIndex: 4, horasAsignadas: 5 },
    { cursoIndex: 4, docenteIndex: 0, horasAsignadas: 4 },
    { cursoIndex: 4, docenteIndex: 4, horasAsignadas: 4 },
  ];

  for (const asignacion of asignaciones) {
    await prisma.cursoDocente.create({
      data: {
        cursoId: cursos[asignacion.cursoIndex].id,
        docenteId: docentes[asignacion.docenteIndex].id,
        horasAsignadas: asignacion.horasAsignadas,
      }
    });
  }

  console.log('✅ Asignaciones curso-docente creadas');

  // Crear ambientes
  const ambientesData = [
    { codigo: 'A101', nombre: 'Aula 101', tipo: TipoAmbiente.AULA, capacidad: 40 },
    { codigo: 'A102', nombre: 'Aula 102', tipo: TipoAmbiente.AULA, capacidad: 40 },
    { codigo: 'A201', nombre: 'Aula 201', tipo: TipoAmbiente.AULA, capacidad: 35 },
    { codigo: 'L301', nombre: 'Laboratorio de Cómputo 1', tipo: TipoAmbiente.LABORATORIO, capacidad: 25 },
    { codigo: 'L302', nombre: 'Laboratorio de Cómputo 2', tipo: TipoAmbiente.LABORATORIO, capacidad: 25 },
    { codigo: 'L303', nombre: 'Laboratorio de Redes', tipo: TipoAmbiente.LABORATORIO, capacidad: 20 },
    { codigo: 'AUD1', nombre: 'Auditorio Principal', tipo: TipoAmbiente.AUDITORIO, capacidad: 100 },
    { codigo: 'SC01', nombre: 'Sala de Conferencias 1', tipo: TipoAmbiente.SALA_CONFERENCIAS, capacidad: 50 },
  ];

  for (const ambienteData of ambientesData) {
    await prisma.ambiente.create({ data: ambienteData });
  }

  console.log('✅ Ambientes creados');

  // Crear período académico
  const periodo = await prisma.periodoAcademico.create({
    data: {
      nombre: '2024-II',
      fechaInicio: new Date('2024-09-01'),
      fechaFin: new Date('2025-01-31'),
      estado: 'BORRADOR',
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

  console.log('✅ Período académico creado');

  // Crear disponibilidad de docentes
  const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  for (const docente of docentes) {
    for (const dia of dias) {
      await prisma.disponibilidadDocente.create({
        data: {
          docenteId: docente.id,
          diaSemana: dia as any,
          horaInicio: '08:00',
          horaFin: '14:00',
          prioridad: 1
        }
      });
    }
  }

  console.log('✅ Disponibilidad de docentes creada');
  console.log('🎉 Datos semilla generados exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error generando datos semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });