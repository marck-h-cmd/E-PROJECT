import { PrismaClient, Rol, CategoriaDocente, TipoAmbiente } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando generación de datos semilla...');

  // ✅ Limpiar datos en orden correcto (respetando foreign keys)
  await prisma.seleccionTemporal.deleteMany();
  await prisma.envioNotificacion.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.atencionVentana.deleteMany();
  await prisma.ventanaAtencion.deleteMany();
  await prisma.validacionHorario.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.matricula.deleteMany();        // ✅ ANTES de grupo
  await prisma.estudiante.deleteMany();       // ✅ ANTES de grupo
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

  await prisma.usuario.create({
    data: {
      email: 'admin@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Administrador',
      apellidos: 'Sistema',
      rol: Rol.ADMINISTRADOR,
      verificado: true,
    }
  });

  await prisma.usuario.create({
    data: {
      email: 'operador@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Operador',
      apellidos: 'Sistema',
      rol: Rol.OPERADOR,
      verificado: true,
    }
  });

  await prisma.usuario.create({
    data: {
      email: 'superadmin@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Super',
      apellidos: 'Admin',
      rol: Rol.SUPER_ADMIN,
      verificado: true,
    }
  });

  await prisma.usuario.create({
    data: {
      email: 'monitor@unitru.edu.pe',
      password: passwordHash,
      nombre: 'Monitor',
      apellidos: 'Sistema',
      rol: Rol.MONITOR,
      verificado: true,
    }
  });

  console.log('✅ Usuarios creados');

  // Crear docentes
  const docentesData = [
    { email: 'juan.perez@unitru.edu.pe', nombre: 'Juan', apellidos: 'Pérez García', codigo: 'DOC001', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Dpto. de Ing. Sistemas' },
    { email: 'maria.lopez@unitru.edu.pe', nombre: 'María', apellidos: 'López Torres', codigo: 'DOC002', categoria: CategoriaDocente.ASOCIADO, departamento: 'Dpto. de Matemáticas' },
    { email: 'carlos.rodriguez@unitru.edu.pe', nombre: 'Carlos', apellidos: 'Rodríguez Sánchez', codigo: 'DOC003', categoria: CategoriaDocente.AUXILIAR, departamento: 'Dpto. de Estadística' },
    { email: 'ana.martinez@unitru.edu.pe', nombre: 'Ana', apellidos: 'Martínez Díaz', codigo: 'DOC004', categoria: CategoriaDocente.CONTRATADO, departamento: 'Dpto. de Física' },
    { email: 'pedro.garcia@unitru.edu.pe', nombre: 'Pedro', apellidos: 'García Fernández', codigo: 'DOC005', categoria: CategoriaDocente.INVITADO, departamento: 'Dpto. de Lengua y Literatura' },
    { email: 'laura.fernandez@unitru.edu.pe', nombre: 'Laura', apellidos: 'Fernández Rojas', codigo: 'DOC006', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Dpto. de Ciencias Sicológicas' },
    { email: 'ricardo.sanchez@unitru.edu.pe', nombre: 'Ricardo', apellidos: 'Sánchez Mendoza', codigo: 'DOC007', categoria: CategoriaDocente.ASOCIADO, departamento: 'Dpto. de Ciencias Sociales' },
    { email: 'patricia.ramirez@unitru.edu.pe', nombre: 'Patricia', apellidos: 'Ramírez Castro', codigo: 'DOC008', categoria: CategoriaDocente.AUXILIAR, departamento: 'Dpto. de Filosofía y Arte' },
    { email: 'jorge.morales@unitru.edu.pe', nombre: 'Jorge', apellidos: 'Morales Vega', codigo: 'DOC009', categoria: CategoriaDocente.CONTRATADO, departamento: 'Dpto. de Administración' },
    { email: 'carmen.reyes@unitru.edu.pe', nombre: 'Carmen', apellidos: 'Reyes Ortiz', codigo: 'DOC010', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Dpto. de Economía' },
    { email: 'miguel.ortega@unitru.edu.pe', nombre: 'Miguel', apellidos: 'Ortega Silva', codigo: 'DOC011', categoria: CategoriaDocente.ASOCIADO, departamento: 'Dpto. de Ing. Industrial' },
    { email: 'isabel.castro@unitru.edu.pe', nombre: 'Isabel', apellidos: 'Castro Herrera', codigo: 'DOC012', categoria: CategoriaDocente.AUXILIAR, departamento: 'Dpto. de Ing. Ambiental' },
    { email: 'fernando.molina@unitru.edu.pe', nombre: 'Fernando', apellidos: 'Molina Ruiz', codigo: 'DOC013', categoria: CategoriaDocente.CONTRATADO, departamento: 'Dpto. de Derecho' },
    { email: 'veronica.diaz@unitru.edu.pe', nombre: 'Verónica', apellidos: 'Díaz Flores', codigo: 'DOC014', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Dpto. de Comunicación Social' },
    { email: 'roberto.jimenez@unitru.edu.pe', nombre: 'Roberto', apellidos: 'Jiménez Ríos', codigo: 'DOC015', categoria: CategoriaDocente.ASOCIADO, departamento: 'Dpto. de Educación' },
    { email: 'gloria.gutierrez@unitru.edu.pe', nombre: 'Gloria', apellidos: 'Gutiérrez Paredes', codigo: 'DOC016', categoria: CategoriaDocente.AUXILIAR, departamento: 'Dpto. de Contabilidad y Finanzas' },
    { email: 'andres.navarro@unitru.edu.pe', nombre: 'Andrés', apellidos: 'Navarro Romero', codigo: 'DOC017', categoria: CategoriaDocente.CONTRATADO, departamento: 'Dpto. de Ing. Sistemas' },
    { email: 'silvia.aguilar@unitru.edu.pe', nombre: 'Silvia', apellidos: 'Aguilar Méndez', codigo: 'DOC018', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Dpto. de Matemáticas' },
    { email: 'daniel.soto@unitru.edu.pe', nombre: 'Daniel', apellidos: 'Soto Vargas', codigo: 'DOC019', categoria: CategoriaDocente.ASOCIADO, departamento: 'Dpto. de Estadística' },
    { email: 'elena.paredes@unitru.edu.pe', nombre: 'Elena', apellidos: 'Paredes León', codigo: 'DOC020', categoria: CategoriaDocente.AUXILIAR, departamento: 'Dpto. de Física' },
    { email: 'pablo.cruz@unitru.edu.pe', nombre: 'Pablo', apellidos: 'Cruz Huamán', codigo: 'DOC021', categoria: CategoriaDocente.CONTRATADO, departamento: 'Dpto. de Ciencias Sicológicas' },
    { email: 'monica.chavez@unitru.edu.pe', nombre: 'Mónica', apellidos: 'Chávez Rivas', codigo: 'DOC022', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Dpto. de Ciencias Sociales' },
    { email: 'raul.medina@unitru.edu.pe', nombre: 'Raúl', apellidos: 'Medina Franco', codigo: 'DOC023', categoria: CategoriaDocente.ASOCIADO, departamento: 'Dpto. de Filosofía y Arte' },
    { email: 'lorena.vasquez@unitru.edu.pe', nombre: 'Lorena', apellidos: 'Vásquez Campos', codigo: 'DOC024', categoria: CategoriaDocente.AUXILIAR, departamento: 'Dpto. de Administración' },
    { email: 'enrique.salazar@unitru.edu.pe', nombre: 'Enrique', apellidos: 'Salazar Luna', codigo: 'DOC025', categoria: CategoriaDocente.CONTRATADO, departamento: 'Dpto. de Ing. Sistemas' },
    { email: 'paola.velasquez@unitru.edu.pe', nombre: 'Paola', apellidos: 'Velásquez Tello', codigo: 'DOC026', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Dpto. de Ing. Sistemas' },
    { email: 'oscar.moreno@unitru.edu.pe', nombre: 'Oscar', apellidos: 'Moreno Delgado', codigo: 'DOC027', categoria: CategoriaDocente.ASOCIADO, departamento: 'Dpto. de Ing. Sistemas' },
    { email: 'teresa.cabrera@unitru.edu.pe', nombre: 'Teresa', apellidos: 'Cabrera Fuentes', codigo: 'DOC028', categoria: CategoriaDocente.AUXILIAR, departamento: 'Dpto. de Ing. Sistemas' },
    { email: 'manuel.romero@unitru.edu.pe', nombre: 'Manuel', apellidos: 'Romero Quispe', codigo: 'DOC029', categoria: CategoriaDocente.CONTRATADO, departamento: 'Dpto. de Ing. Sistemas' },
    { email: 'sofia.maldonado@unitru.edu.pe', nombre: 'Sofía', apellidos: 'Maldonado Pineda', codigo: 'DOC030', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Dpto. de Ing. Sistemas' },
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

  console.log(`✅ ${docentes.length} docentes creados`);

  // Crear cursos
  const cursosData = [
    // I Ciclo
    { codigo: 'EG-101', nombre: 'Desarrollo del Pensamiento Lógico Matemático', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-102', nombre: 'Lectura Crítica y Redacción de Textos Académicos', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-103', nombre: 'Desarrollo Personal', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-104', nombre: 'Introducción al Análisis Matemático', creditos: 4, horasTeoria: 3, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-105', nombre: 'Estadística General', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 1 },
    { codigo: 'EE-101', nombre: 'Introducción a la Ingeniería de Sistemas', creditos: 2, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EE-102', nombre: 'Introducción a la Programación', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EL-101', nombre: 'Técnicas de comunicación eficaz', creditos: 1, horasTeoria: 1, horasPractica: 0, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EL-102', nombre: 'Taller de Música', creditos: 1, horasTeoria: 0, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EL-103', nombre: 'Taller de Liderazgo y trabajo en equipo', creditos: 1, horasTeoria: 1, horasPractica: 1, horasLaboratorio: 0, ciclo: 1 },
    // II Ciclo
    { codigo: 'EG-201', nombre: 'Ética, Convivencia Humana y Ciudadanía', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 2 },
    { codigo: 'EG-202', nombre: 'Sociedad, Cultura y Ecología', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 2 },
    { codigo: 'EG-203', nombre: 'Cultura Investigativa y Pensamiento Crítico', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 2 },
    { codigo: 'EG-204', nombre: 'Análisis Matemático', creditos: 4, horasTeoria: 3, horasPractica: 2, horasLaboratorio: 0, ciclo: 2 },
    { codigo: 'EG-205', nombre: 'Física General', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 2 },
    { codigo: 'EE-201', nombre: 'Programación Orientada a Objetos I', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 2 },
    { codigo: 'EL-201', nombre: 'Taller de Manejo de TIC', creditos: 1, horasTeoria: 0, horasPractica: 2, horasLaboratorio: 0, ciclo: 2 },
    { codigo: 'EL-202', nombre: 'Taller de Danzas Folklóricas', creditos: 1, horasTeoria: 0, horasPractica: 2, horasLaboratorio: 0, ciclo: 2 },
    { codigo: 'EL-203', nombre: 'Taller de Deporte', creditos: 1, horasTeoria: 0, horasPractica: 2, horasLaboratorio: 0, ciclo: 2 },
    // III Ciclo
    { codigo: 'EP-301', nombre: 'Administración General', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 3 },
    { codigo: 'EE-301', nombre: 'Sistémica', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 3 },
    { codigo: 'EP-302', nombre: 'Estadística Aplicada', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 3 },
    { codigo: 'EP-303', nombre: 'Matemática Aplicada', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 3 },
    { codigo: 'EP-304', nombre: 'Física Electrónica', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 3 },
    { codigo: 'EE-302', nombre: 'Programación Orientada a Objetos II', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 3 },
    { codigo: 'EL-301', nombre: 'Ingeniería Gráfica', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 1, ciclo: 3 },
    { codigo: 'EL-302', nombre: 'Sicología Organizacional', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 3 },
    // IV Ciclo
    { codigo: 'EP-401', nombre: 'Economía General', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 4 },
    { codigo: 'EE-401', nombre: 'Diseño Web', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 1, ciclo: 4 },
    { codigo: 'EP-402', nombre: 'Pensamiento de Diseño', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 4 },
    { codigo: 'EP-403', nombre: 'Gestión por Procesos', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 4 },
    { codigo: 'EE-402', nombre: 'Sistemas Digitales', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 4 },
    { codigo: 'EE-403', nombre: 'Estructura de Datos Orientado a Objetos', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 4 },
    { codigo: 'EL-401', nombre: 'Computación Gráfica y Visual', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 1, ciclo: 4 },
    { codigo: 'EL-402', nombre: 'Plataformas Tecnológicas', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 4 },
    // V Ciclo
    { codigo: 'EP-501', nombre: 'Contabilidad Gerencial', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 5 },
    { codigo: 'EE-501', nombre: 'Tecnologías Web', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 1, ciclo: 5 },
    { codigo: 'EP-502', nombre: 'Investigación de Operaciones', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 5 },
    { codigo: 'EE-502', nombre: 'Ingeniería de Datos I', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'EE-503', nombre: 'Arquitectura y Organización de Computadoras', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 5 },
    { codigo: 'EE-504', nombre: 'Sistemas de Información', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'EL-501', nombre: 'Teleinformática', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 5 },
    { codigo: 'EL-502', nombre: 'Transformación Digital', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 5 },
    // VI Ciclo
    { codigo: 'EP-601', nombre: 'Finanzas Corporativas', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 6 },
    { codigo: 'EE-601', nombre: 'Sistemas Inteligentes', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 6 },
    { codigo: 'EP-602', nombre: 'Ingeniería Económica', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 6 },
    { codigo: 'EE-602', nombre: 'Ingeniería de Datos II', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 6 },
    { codigo: 'EE-603', nombre: 'Sistemas Operativos', creditos: 3, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 2, ciclo: 6 },
    { codigo: 'EE-604', nombre: 'Ingeniería de Requerimientos', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 6 },
    { codigo: 'EL-601', nombre: 'Ingeniería Ambiental', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 6 },
    { codigo: 'EL-602', nombre: 'Gestión del Talento Humano', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 6 },
    // VII Ciclo
    { codigo: 'EP-701', nombre: 'Cadena de Suministro', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
    { codigo: 'EE-701', nombre: 'Gestión de Servicios de TIC', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
    { codigo: 'EI-701', nombre: 'Metodología de la Investigación Científica', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
    { codigo: 'EE-702', nombre: 'Planeamiento Estratégico de la Información', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
    { codigo: 'EE-703', nombre: 'Redes y Comunicaciones I', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 7 },
    { codigo: 'EE-704', nombre: 'Ingeniería del Software I', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 7 },
    { codigo: 'EL-701', nombre: 'Administración de Base de Datos', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 7 },
    { codigo: 'EL-702', nombre: 'Negocios Electrónicos', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
    // VIII Ciclo
    { codigo: 'EP-801', nombre: 'Marketing y Medios Sociales', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 8 },
    { codigo: 'EE-801', nombre: 'Seguridad de la Información', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 8 },
    { codigo: 'EE-802', nombre: 'Internet de las Cosas', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 8 },
    { codigo: 'EE-803', nombre: 'Inteligencia de Negocios', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 8 },
    { codigo: 'EE-804', nombre: 'Redes y Comunicaciones II', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 8 },
    { codigo: 'EE-805', nombre: 'Ingeniería del Software II', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 8 },
    { codigo: 'EL-801', nombre: 'Deontología y Derecho Informático', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 8 },
    { codigo: 'EL-802', nombre: 'Arquitectura basada en Microservicios', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 8 },
    // IX Ciclo
    { codigo: 'EE-901', nombre: 'Gestión de Proyectos de TIC', creditos: 1, horasTeoria: 1, horasPractica: 0, horasLaboratorio: 0, ciclo: 9 },
    { codigo: 'EE-902', nombre: 'Auditoría Informática', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 9 },
    { codigo: 'EI-901', nombre: 'Tesis I', creditos: 4, horasTeoria: 2, horasPractica: 4, horasLaboratorio: 0, ciclo: 9 },
    { codigo: 'EE-903', nombre: 'Analítica de Negocios', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 9 },
    { codigo: 'EE-904', nombre: 'Computación en la Nube', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 9 },
    { codigo: 'EE-905', nombre: 'Ingeniería Web', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 9 },
    { codigo: 'EL-901', nombre: 'Emprendedurismo Tecnológico', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 9 },
    { codigo: 'EL-902', nombre: 'Hackeo Ético', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 9 },
    // X Ciclo
    { codigo: 'EE-X01', nombre: 'Sistemas de Información Empresarial', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 10 },
    { codigo: 'EE-X02', nombre: 'Gobierno de TIC', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 10 },
    { codigo: 'EI-X01', nombre: 'Tesis II', creditos: 4, horasTeoria: 2, horasPractica: 4, horasLaboratorio: 0, ciclo: 10 },
    { codigo: 'EE-X03', nombre: 'Arquitectura Empresarial', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 10 },
    { codigo: 'EP-X01', nombre: 'Responsabilidad Social Corporativa', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 10 },
    { codigo: 'EE-X04', nombre: 'Aplicaciones Móviles', creditos: 3, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 1, ciclo: 10 },
    { codigo: 'EE-X05', nombre: 'Prácticas Pre Profesionales', creditos: 4, horasTeoria: 0, horasPractica: 8, horasLaboratorio: 0, ciclo: 10 },
  ];

  const cursos = [];
  for (const cursoData of cursosData) {
    const curso = await prisma.curso.create({
      data: {
        ...cursoData,
        grupos: {
          create: [
            { nombre: 'A', capacidad: 35 },
            { nombre: 'B', capacidad: 35 },
            { nombre: 'C', capacidad: 35 },
          ]
        }
      }
    });
    cursos.push(curso);
  }

  console.log(`✅ ${cursos.length} cursos creados con 3 grupos cada uno`);

  // Asignar cursos a docentes
  const asignaciones = [];
  for (let i = 0; i < cursos.length; i++) {
    const numDocentes = (i % 3 === 0) ? 2 : 1;
    const docente1Index = i % docentes.length;
    const curso = cursos[i];
    const horasReales = curso.horasTeoria + curso.horasPractica + curso.horasLaboratorio;
    const horasAsignadas = horasReales;

   asignaciones.push({
  cursoIndex: i,
  docenteIndex: docente1Index,
  horasAsignadas: numDocentes === 2 
    ? Math.ceil(horasReales / 2) 
    : horasReales
});

if (numDocentes === 2) {
  asignaciones.push({
    cursoIndex: i,
    docenteIndex: docente1Index,
    horasAsignadas: Math.floor(horasReales / 2)  // ← el resto
  });
}
}

  for (const asignacion of asignaciones) {
    await prisma.cursoDocente.create({
      data: {
        cursoId: cursos[asignacion.cursoIndex].id,
        docenteId: docentes[asignacion.docenteIndex].id,
        horasAsignadas: asignacion.horasAsignadas,
      }
    });
  }

  console.log(`✅ ${asignaciones.length} asignaciones curso-docente creadas`);

  // Crear ambientes
  const ambientesData = [
    { codigo: 'A101', nombre: 'Aula 101', tipo: TipoAmbiente.AULA, capacidad: 40 },
    { codigo: 'A102', nombre: 'Aula 102', tipo: TipoAmbiente.AULA, capacidad: 40 },
    { codigo: 'A103', nombre: 'Aula 103', tipo: TipoAmbiente.AULA, capacidad: 40 },
    { codigo: 'A104', nombre: 'Aula 104', tipo: TipoAmbiente.AULA, capacidad: 35 },
    { codigo: 'A201', nombre: 'Aula 201', tipo: TipoAmbiente.AULA, capacidad: 35 },
    { codigo: 'A202', nombre: 'Aula 202', tipo: TipoAmbiente.AULA, capacidad: 35 },
    { codigo: 'L301', nombre: 'Laboratorio de Cómputo 1', tipo: TipoAmbiente.LABORATORIO, capacidad: 30 },
    { codigo: 'L302', nombre: 'Laboratorio de Cómputo 2', tipo: TipoAmbiente.LABORATORIO, capacidad: 30 },
    { codigo: 'L303', nombre: 'Laboratorio de Redes', tipo: TipoAmbiente.LABORATORIO, capacidad: 25 },
    { codigo: 'L304', nombre: 'Laboratorio de Electrónica', tipo: TipoAmbiente.LABORATORIO, capacidad: 25 },
    { codigo: 'AUD1', nombre: 'Auditorio Principal', tipo: TipoAmbiente.AUDITORIO, capacidad: 150 },
    { codigo: 'SC01', nombre: 'Sala de Conferencias 1', tipo: TipoAmbiente.SALA_CONFERENCIAS, capacidad: 50 },
  ];

  for (const ambienteData of ambientesData) {
    await prisma.ambiente.create({ data: ambienteData });
  }

  console.log(`✅ ${ambientesData.length} ambientes creados`);

  // Crear período académico 2026-I
  const periodo = await prisma.periodoAcademico.create({
    data: {
      nombre: '2026-I',
      fechaInicio: new Date('2026-03-01'),
      fechaFin: new Date('2026-07-31'),
      estado: 'ACTIVO',
      activo: true,           // ✅ Activo directamente
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

  console.log('✅ Período académico 2026-I creado y ACTIVO');

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

  // Crear estudiantes
  const estudiantesData = [
    { codigo: '1020100126', nombre: 'Carlos Alberto', apellidos: 'Sánchez Ruiz', email: 'csanchez@unitru.edu.pe', dni: '71234561' },
    { codigo: '1020100226', nombre: 'Ana Lucía', apellidos: 'Torres Paredes', email: 'atorres@unitru.edu.pe', dni: '71234562' },
    { codigo: '1020100326', nombre: 'Roberto Carlos', apellidos: 'García Mendoza', email: 'rgarcia@unitru.edu.pe', dni: '71234563' },
    { codigo: '1020100426', nombre: 'María Fernanda', apellidos: 'López Castro', email: 'mlopez@unitru.edu.pe', dni: '71234564' },
    { codigo: '1020100526', nombre: 'Diego Armando', apellidos: 'Morales Villa', email: 'dmorales@unitru.edu.pe', dni: '71234565' },
    { codigo: '1050200125', nombre: 'Jimena Sofía', apellidos: 'Rojas Ortiz', email: 'jsofia@unitru.edu.pe', dni: '72234561' },
    { codigo: '1050200225', nombre: 'Kevin Bryan', apellidos: 'Chávez Rivas', email: 'kchavez@unitru.edu.pe', dni: '72234562' },
    { codigo: '1050200325', nombre: 'Paola Andrea', apellidos: 'Vásquez Tello', email: 'pvasquez@unitru.edu.pe', dni: '72234563' },
    { codigo: '1080300124', nombre: 'Luis Miguel', apellidos: 'Pineda Rojas', email: 'lpineda@unitru.edu.pe', dni: '73234561' },
    { codigo: '1080300224', nombre: 'Elena Victoria', apellidos: 'Salazar Luna', email: 'esalazar@unitru.edu.pe', dni: '73234562' },
  ];

  const creadosEstudiantes = [];
  for (const est of estudiantesData) {
    const estudiante = await prisma.estudiante.create({
      data: {
        ...est,
        ciclo: Math.floor(Math.random() * 10) + 1,
      }
    });
    creadosEstudiantes.push(estudiante);
  }

  // Matricular estudiantes
  const todosLosCursos = await prisma.curso.findMany({ include: { grupos: true } });

  for (const curso of todosLosCursos) {
    if (curso.grupos.length > 0) {
      const numMatriculados = Math.floor(Math.random() * 3) + 3;
      const estudiantesSorteados = [...creadosEstudiantes]
        .sort(() => 0.5 - Math.random())
        .slice(0, numMatriculados);

      for (const est of estudiantesSorteados) {
        const grupo = curso.grupos[Math.floor(Math.random() * curso.grupos.length)];
        await prisma.matricula.create({
          data: {
            estudianteId: est.id,
            cursoId: curso.id,
            grupoId: grupo.id,
            periodoId: periodo.id,
            estado: 'ACTIVO'
          }
        });
      }
    }
  }

  console.log(`✅ ${creadosEstudiantes.length} estudiantes creados y matriculados`);
  console.log('🎉 Datos semilla generados exitosamente');
  console.log(`📊 Resumen: ${docentes.length} docentes, ${cursos.length} cursos, ${ambientesData.length} ambientes`);
  console.log(`📅 Período: 2026-I (Marzo - Julio 2026) — ACTIVO`);
}

main()
  .catch((e) => {
    console.error('❌ Error generando datos semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });