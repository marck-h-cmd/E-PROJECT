import { PrismaClient, Rol, CategoriaDocente, TipoAmbiente, DiaSemana, EstadoPeriodo, EstadoHorario } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando generación de datos semilla...');

  // ==================== LIMPIEZA ====================
  await prisma.seleccionTemporal.deleteMany();
  await prisma.envioNotificacion.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.atencionVentana.deleteMany();
  await prisma.ventanaAtencion.deleteMany();
  await prisma.validacionHorario.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.estudiante.deleteMany();
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

  // ==================== USUARIOS ====================
  const passwordHash = await bcrypt.hash('unt123456', 12);

  const adminUser = await prisma.usuario.create({
    data: { email: 'admin@unitru.edu.pe', password: passwordHash, nombre: 'Administrador', apellidos: 'Sistema', rol: Rol.ADMINISTRADOR, verificado: true }
  });
  const operadorUser = await prisma.usuario.create({
    data: { email: 'operador@unitru.edu.pe', password: passwordHash, nombre: 'Operador', apellidos: 'Sistema', rol: Rol.OPERADOR, verificado: true }
  });
  const superAdminUser = await prisma.usuario.create({
    data: { email: 'superadmin@unitru.edu.pe', password: passwordHash, nombre: 'Super', apellidos: 'Admin', rol: Rol.SUPER_ADMIN, verificado: true }
  });
  const monitorUser = await prisma.usuario.create({
    data: { email: 'monitor@unitru.edu.pe', password: passwordHash, nombre: 'Monitor', apellidos: 'Sistema', rol: Rol.MONITOR, verificado: true }
  });

  console.log('✅ Usuarios creados');

  // ==================== DOCENTES (según PDF) ====================
  const docentesData = [
    // Ciclo I
    { email: 'marcelino.torres@unitru.edu.pe', nombre: 'Marcelino', apellidos: 'Torres Villanueva', codigo: 'DOC001', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Ing. de Sistemas' },
    { email: 'alberto.mendoza@unitru.edu.pe', nombre: 'Alberto', apellidos: 'Mendoza de los Santos', codigo: 'DOC002', categoria: CategoriaDocente.ASOCIADO, departamento: 'Ing. de Sistemas' },
    { email: 'paul.cotrina@unitru.edu.pe', nombre: 'Paul', apellidos: 'Cotrina Castellanos', codigo: 'DOC003', categoria: CategoriaDocente.ASOCIADO, departamento: 'Ing. de Sistemas' },
    { email: 'bertha.urtecho@unitru.edu.pe', nombre: 'Bertha', apellidos: 'Urtecho Zavaleta', codigo: 'DOC004', categoria: CategoriaDocente.AUXILIAR, departamento: 'CC. Psicológicas' },
    { email: 'jose.ponte@unitru.edu.pe', nombre: 'José Luis', apellidos: 'Ponte Bejarano', codigo: 'DOC005', categoria: CategoriaDocente.ASOCIADO, departamento: 'Matemáticas' },
    { email: 'jorge.rios@unitru.edu.pe', nombre: 'Jorge Luis', apellidos: 'Ríos Gonzales', codigo: 'DOC006', categoria: CategoriaDocente.AUXILIAR, departamento: 'Lengua Nacional y Literatura' },
    { email: 'segundo.guibar@unitru.edu.pe', nombre: 'Segundo', apellidos: 'Guíbar Obeso', codigo: 'DOC007', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Matemáticas' },
    { email: 'miguel.ipanaque@unitru.edu.pe', nombre: 'Miguel', apellidos: 'Ipanaque Zapata', codigo: 'DOC008', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Estadística' },
    { email: 'martha.cardoso@unitru.edu.pe', nombre: 'Martha', apellidos: 'Cardoso', codigo: 'DOC009', categoria: CategoriaDocente.AUXILIAR, departamento: 'Estadística' },

    // Ciclo III
    { email: 'zoraida.vidal@unitru.edu.pe', nombre: 'Zoraida', apellidos: 'Vidal Melgarejo', codigo: 'DOC010', categoria: CategoriaDocente.ASOCIADO, departamento: 'Ing. de Sistemas' },
    { email: 'everson.agreda@unitru.edu.pe', nombre: 'Everson David', apellidos: 'Agreda Gamboa', codigo: 'DOC011', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Ing. de Sistemas' },
    { email: 'juan.obando@unitru.edu.pe', nombre: 'Juan Carlos', apellidos: 'Obando Roldán', codigo: 'DOC012', categoria: CategoriaDocente.ASOCIADO, departamento: 'Ing. de Sistemas' },
    { email: 'marcos.ferrer@unitru.edu.pe', nombre: 'Marcos', apellidos: 'Ferrer Reyna', codigo: 'DOC013', categoria: CategoriaDocente.ASOCIADO, departamento: 'Matemáticas' },
    { email: 'teresita.rojas@unitru.edu.pe', nombre: 'Teresita', apellidos: 'Rojas García', codigo: 'DOC014', categoria: CategoriaDocente.AUXILIAR, departamento: 'Estadística' },
    { email: 'juan.carrascal@unitru.edu.pe', nombre: 'Juan', apellidos: 'Carrascal Cabanillas', codigo: 'DOC015', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Administración' },
    { email: 'vilma.mendez@unitru.edu.pe', nombre: 'Vilma', apellidos: 'Méndez Gil', codigo: 'DOC016', categoria: CategoriaDocente.ASOCIADO, departamento: 'Física' },
    { email: 'sheyla.laura@unitru.edu.pe', nombre: 'Sheyla', apellidos: 'Laura Escobedo Rodríguez', codigo: 'DOC017', categoria: CategoriaDocente.AUXILIAR, departamento: 'CC. Psicológicas' },

    // Ciclo V
    { email: 'luis.boy@unitru.edu.pe', nombre: 'Luis', apellidos: 'Boy Chavil', codigo: 'DOC018', categoria: CategoriaDocente.ASOCIADO, departamento: 'Ing. de Sistemas' },
    { email: 'robert.sanchez@unitru.edu.pe', nombre: 'Robert Jerry', apellidos: 'Sánchez Ticona', codigo: 'DOC019', categoria: CategoriaDocente.AUXILIAR, departamento: 'Ing. de Sistemas' },
    { email: 'cesar.arellano@unitru.edu.pe', nombre: 'César', apellidos: 'Arellano Salazar', codigo: 'DOC020', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Ing. de Sistemas' },
    { email: 'camilo.suarez@unitru.edu.pe', nombre: 'Camilo', apellidos: 'Suárez Rebaza', codigo: 'DOC021', categoria: CategoriaDocente.ASOCIADO, departamento: 'Ing. de Sistemas' },
    { email: 'marcos.baca@unitru.edu.pe', nombre: 'Marcos', apellidos: 'Baca López', codigo: 'DOC022', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Ingeniería Industrial' },
    { email: 'ana.cuadra@unitru.edu.pe', nombre: 'Ana', apellidos: 'Cuadra Mitzuquray', codigo: 'DOC023', categoria: CategoriaDocente.AUXILIAR, departamento: 'Contabilidad y Finanzas' },

    // Ciclo VII
    { email: 'juan.santos@unitru.edu.pe', nombre: 'Juan Pedro', apellidos: 'Santos Fernández', codigo: 'DOC024', categoria: CategoriaDocente.PRINCIPAL, departamento: 'Ing. de Sistemas' },
    { email: 'ricardo.mendoza@unitru.edu.pe', nombre: 'Ricardo', apellidos: 'Mendoza Rivera', codigo: 'DOC025', categoria: CategoriaDocente.ASOCIADO, departamento: 'Ing. de Sistemas' },
    { email: 'oscar.alcantara@unitru.edu.pe', nombre: 'Óscar Romel', apellidos: 'Alcántara Moreno', codigo: 'DOC026', categoria: CategoriaDocente.AUXILIAR, departamento: 'Ing. de Sistemas' },
    { email: 'jhoe.gonzalez@unitru.edu.pe', nombre: 'Jhon', apellidos: 'Gonzalez Vasquez', codigo: 'DOC027', categoria: CategoriaDocente.CONTRATADO, departamento: 'Ing. Industrial' },

    // Ciclo IX
    { email: 'jose.gomez@unitru.edu.pe', nombre: 'José', apellidos: 'Gómez Ávila', codigo: 'DOC028', categoria: CategoriaDocente.ASOCIADO, departamento: 'Ing. de Sistemas' },
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
        fechaIngreso: new Date('2010-01-01'),
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

    docentes.push({
      ...docente,
      nombre: docenteData.nombre,
      apellidos: docenteData.apellidos,
    });
  }

  console.log(`✅ ${docentes.length} docentes creados`);

  // ==================== CURSOS (según PDF por ciclo) ====================

  // CICLO I
  const ciclo1Cursos = [
    { codigo: 'EE-102', nombre: 'Introducción a la Programación', creditos: 4, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 2, ciclo: 1 },
    { codigo: 'EE-101', nombre: 'Introducción a la Ingeniería de Sistemas', creditos: 2, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-103', nombre: 'Desarrollo Personal', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-101', nombre: 'Desarrollo del Pensamiento Lógico Matemático', creditos: 4, horasTeoria: 1, horasPractica: 4, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-102', nombre: 'Lectura Crítica y Redacción de Textos Académicos', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-104', nombre: 'Introducción al Análisis Matemático', creditos: 5, horasTeoria: 2, horasPractica: 4, horasLaboratorio: 0, ciclo: 1 },
    { codigo: 'EG-105', nombre: 'Estadística General', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 1 },
  ];

  // CICLO III
  const ciclo3Cursos = [
    { codigo: 'EE-302', nombre: 'Programación Orientada a Objetos II', creditos: 5, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 4, ciclo: 3 },
    { codigo: 'EE-301', nombre: 'Sistémica', creditos: 4, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 2, ciclo: 3 },
    { codigo: 'EL-301', nombre: 'Ingeniería Gráfica', creditos: 3, horasTeoria: 1, horasPractica: 1, horasLaboratorio: 2, ciclo: 3 },
    { codigo: 'EP-303', nombre: 'Matemática Aplicada', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 3 },
    { codigo: 'EP-302', nombre: 'Estadística Aplicada', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 3 },
    { codigo: 'EP-301', nombre: 'Administración General', creditos: 2, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 3 },
    { codigo: 'EP-304', nombre: 'Física Electrónica', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 3 },
    { codigo: 'EL-302', nombre: 'Psicología Organizacional', creditos: 2, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 3 },
  ];

  // CICLO V
  const ciclo5Cursos = [
    { codigo: 'EE-501', nombre: 'Ingeniería de Datos I', creditos: 4, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 3, ciclo: 5 },
    { codigo: 'EE-502', nombre: 'Sistemas de Información', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'EE-503', nombre: 'Transformación Digital', creditos: 3, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'EE-504', nombre: 'Tecnología Web', creditos: 4, horasTeoria: 1, horasPractica: 1, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'EE-505', nombre: 'Arquitectura de Computadoras', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'EE-506', nombre: 'Teleinformática', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'EP-501', nombre: 'Investigación de Operaciones', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 5 },
    { codigo: 'EP-502', nombre: 'Contabilidad Gerencial', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 5 },
  ];

  // CICLO VII
  const ciclo7Cursos = [
    { codigo: 'EE-701', nombre: 'Ingeniería de Software I', creditos: 4, horasTeoria: 2, horasPractica: 1, horasLaboratorio: 3, ciclo: 7 },
    { codigo: 'EE-702', nombre: 'Redes y Comunicaciones I', creditos: 4, horasTeoria: 1, horasPractica: 1, horasLaboratorio: 3, ciclo: 7 },
    { codigo: 'EE-703', nombre: 'Negocios Electrónicos', creditos: 2, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 0, ciclo: 7 },
    { codigo: 'EE-704', nombre: 'Gestión de Servicios de TI', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 7 },
    { codigo: 'EE-705', nombre: 'Metodología de la Investigación Científica', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
    { codigo: 'EE-706', nombre: 'Administración de Base de Datos', creditos: 4, horasTeoria: 1, horasPractica: 1, horasLaboratorio: 3, ciclo: 7 },
    { codigo: 'EE-707', nombre: 'Planeamiento Estratégico de TI', creditos: 4, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 7 },
    { codigo: 'EP-701', nombre: 'Cadena de Suministros', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
  ];

  // CICLO IX
  const ciclo9Cursos = [
    { codigo: 'EE-901', nombre: 'Tesis I', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 9 },
    { codigo: 'EE-902', nombre: 'Analítica de Negocios', creditos: 3, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 9 },
    { codigo: 'EE-903', nombre: 'Auditoría Informática', creditos: 4, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 9 },
    { codigo: 'EE-904', nombre: 'Gestión de Proyectos de TI', creditos: 4, horasTeoria: 1, horasPractica: 2, horasLaboratorio: 2, ciclo: 9 },
    { codigo: 'EE-905', nombre: 'Emprendimiento Tecnológico', creditos: 3, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 2, ciclo: 9 },
    { codigo: 'EE-906', nombre: 'Ingeniería Web', creditos: 4, horasTeoria: 1, horasPractica: 1, horasLaboratorio: 3, ciclo: 9 },
    { codigo: 'EE-907', nombre: 'Computación en la Nube', creditos: 4, horasTeoria: 1, horasPractica: 1, horasLaboratorio: 3, ciclo: 9 },
    { codigo: 'EL-901', nombre: 'Hackeo Ético', creditos: 3, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 2, ciclo: 9 },
  ];

  const todosLosCursos = [...ciclo1Cursos, ...ciclo3Cursos, ...ciclo5Cursos, ...ciclo7Cursos, ...ciclo9Cursos];

  const cursos = [];
  for (const cursoData of todosLosCursos) {
    const curso = await prisma.curso.create({
      data: {
        ...cursoData,
        grupos: {
          create: [
            { nombre: 'A', capacidad: 40 },
            { nombre: 'B', capacidad: 40 },
          ]
        }
      },
      include: {
        grupos: true
      }
    });
    cursos.push(curso);
  }

  console.log(`✅ ${cursos.length} cursos creados`);

  // ==================== ASIGNACIONES CURSO-DOCENTE ====================

  const asignaciones = [
    // CICLO I
    { cursoNombre: 'Introducción a la Programación', docenteNombre: 'Marcelino Torres Villanueva', horasAsignadas: 6 },
    { cursoNombre: 'Introducción a la Programación', docenteNombre: 'Paul Cotrina Castellanos', horasAsignadas: 4 },
    { cursoNombre: 'Introducción a la Ingeniería de Sistemas', docenteNombre: 'Alberto Mendoza de los Santos', horasAsignadas: 3 },
    { cursoNombre: 'Desarrollo Personal', docenteNombre: 'Bertha Urtecho Zavaleta', horasAsignadas: 4 },
    { cursoNombre: 'Desarrollo del Pensamiento Lógico Matemático', docenteNombre: 'José Luis Ponte Bejarano', horasAsignadas: 5 },
    { cursoNombre: 'Lectura Crítica y Redacción de Textos Académicos', docenteNombre: 'Jorge Luis Ríos Gonzales', horasAsignadas: 4 },
    { cursoNombre: 'Introducción al Análisis Matemático', docenteNombre: 'Segundo Guíbar Obeso', horasAsignadas: 6 },
    { cursoNombre: 'Estadística General', docenteNombre: 'Miguel Ipanaque Zapata', horasAsignadas: 2 },
    { cursoNombre: 'Estadística General', docenteNombre: 'Martha Cardoso', horasAsignadas: 4 },

    // CICLO III
    { cursoNombre: 'Programación Orientada a Objetos II', docenteNombre: 'Zoraida Vidal Melgarejo', horasAsignadas: 14 },
    { cursoNombre: 'Sistémica', docenteNombre: 'Everson David Agreda Gamboa', horasAsignadas: 9 },
    { cursoNombre: 'Ingeniería Gráfica', docenteNombre: 'Juan Carlos Obando Roldán', horasAsignadas: 8 },
    { cursoNombre: 'Matemática Aplicada', docenteNombre: 'Marcos Ferrer Reyna', horasAsignadas: 5 },
    { cursoNombre: 'Estadística Aplicada', docenteNombre: 'Teresita Rojas García', horasAsignadas: 9 },
    { cursoNombre: 'Administración General', docenteNombre: 'Juan Carrascal Cabanillas', horasAsignadas: 4 },
    { cursoNombre: 'Física Electrónica', docenteNombre: 'Vilma Méndez Gil', horasAsignadas: 5 },
    { cursoNombre: 'Psicología Organizacional', docenteNombre: 'Sheyla Laura Escobedo Rodríguez', horasAsignadas: 4 },

    // CICLO V
    { cursoNombre: 'Ingeniería de Datos I', docenteNombre: 'Luis Boy Chavil', horasAsignadas: 12 },
    { cursoNombre: 'Sistemas de Información', docenteNombre: 'Juan Carlos Obando Roldán', horasAsignadas: 10 },
    { cursoNombre: 'Transformación Digital', docenteNombre: 'Everson David Agreda Gamboa', horasAsignadas: 6 },
    { cursoNombre: 'Tecnología Web', docenteNombre: 'Robert Jerry Sánchez Ticona', horasAsignadas: 11 },
    { cursoNombre: 'Arquitectura de Computadoras', docenteNombre: 'César Arellano Salazar', horasAsignadas: 9 },
    { cursoNombre: 'Teleinformática', docenteNombre: 'Camilo Suárez Rebaza', horasAsignadas: 7 },
    { cursoNombre: 'Investigación de Operaciones', docenteNombre: 'Marcos Baca López', horasAsignadas: 5 },
    { cursoNombre: 'Contabilidad Gerencial', docenteNombre: 'Ana Cuadra Mitzuquray', horasAsignadas: 5 },

    // CICLO VII
    { cursoNombre: 'Ingeniería de Software I', docenteNombre: 'Juan Pedro Santos Fernández', horasAsignadas: 6 },
    { cursoNombre: 'Ingeniería de Software I', docenteNombre: 'Robert Jerry Sánchez Ticona', horasAsignadas: 6 },
    { cursoNombre: 'Redes y Comunicaciones I', docenteNombre: 'César Arellano Salazar', horasAsignadas: 11 },
    { cursoNombre: 'Negocios Electrónicos', docenteNombre: 'Everson David Agreda Gamboa', horasAsignadas: 2 },
    { cursoNombre: 'Gestión de Servicios de TI', docenteNombre: 'Alberto Mendoza de los Santos', horasAsignadas: 7 },
    { cursoNombre: 'Metodología de la Investigación Científica', docenteNombre: 'Paul Cotrina Castellanos', horasAsignadas: 4 },
    { cursoNombre: 'Administración de Base de Datos', docenteNombre: 'Ricardo Mendoza Rivera', horasAsignadas: 8 },
    { cursoNombre: 'Planeamiento Estratégico de TI', docenteNombre: 'Óscar Romel Alcántara Moreno', horasAsignadas: 11 },
    { cursoNombre: 'Cadena de Suministros', docenteNombre: 'Jhon Gonzalez Vasquez', horasAsignadas: 4 },

    // CICLO IX
    { cursoNombre: 'Tesis I', docenteNombre: 'Juan Pedro Santos Fernández', horasAsignadas: 6 },
    { cursoNombre: 'Tesis I', docenteNombre: 'Ricardo Mendoza Rivera', horasAsignadas: 6 },
    { cursoNombre: 'Analítica de Negocios', docenteNombre: 'Ricardo Mendoza Rivera', horasAsignadas: 5 },
    { cursoNombre: 'Auditoría Informática', docenteNombre: 'Alberto Mendoza de los Santos', horasAsignadas: 7 },
    { cursoNombre: 'Gestión de Proyectos de TI', docenteNombre: 'José Gómez Ávila', horasAsignadas: 9 },
    { cursoNombre: 'Emprendimiento Tecnológico', docenteNombre: 'Óscar Romel Alcántara Moreno', horasAsignadas: 6 },
    { cursoNombre: 'Ingeniería Web', docenteNombre: 'Marcelino Torres Villanueva', horasAsignadas: 8 },
    { cursoNombre: 'Computación en la Nube', docenteNombre: 'José Gómez Ávila', horasAsignadas: 8 },
    { cursoNombre: 'Hackeo Ético', docenteNombre: 'Camilo Suárez Rebaza', horasAsignadas: 6 },
  ];

  for (const asignacion of asignaciones) {
    const curso = cursos.find(c => c.nombre === asignacion.cursoNombre);
    const docente = docentes.find(d => `${d.nombre} ${d.apellidos}` === asignacion.docenteNombre);

    if (curso && docente) {
      await prisma.cursoDocente.create({
        data: {
          cursoId: curso.id,
          docenteId: docente.id,
          horasAsignadas: asignacion.horasAsignadas,
        }
      });
    } else {
      console.log(`⚠️ No se encontró: Curso="${asignacion.cursoNombre}", Docente="${asignacion.docenteNombre}"`);
    }
  }

  console.log(`✅ Asignaciones curso-docente creadas`);

  // ==================== AMBIENTES (según PDF) ====================
  const ambientesData = [
    // Aulas de Posgrado
    { codigo: 'A-301', nombre: 'Posgrado A-301', tipo: TipoAmbiente.AULA, capacidad: 40 },
    { codigo: 'A-303', nombre: 'Posgrado A-303', tipo: TipoAmbiente.AULA, capacidad: 40 },
    { codigo: 'A-307', nombre: 'Posgrado A-307', tipo: TipoAmbiente.AULA, capacidad: 45 },
    { codigo: 'A-311', nombre: 'Posgrado A-311', tipo: TipoAmbiente.AULA, capacidad: 40 },

    // Laboratorios
    { codigo: 'Lab-1', nombre: 'Laboratorio 1', tipo: TipoAmbiente.LABORATORIO, capacidad: 30 },
    { codigo: 'Lab-2', nombre: 'Laboratorio 2', tipo: TipoAmbiente.LABORATORIO, capacidad: 30 },
    { codigo: 'Lab-3', nombre: 'Laboratorio 3', tipo: TipoAmbiente.LABORATORIO, capacidad: 30 },
    { codigo: 'Lab-4', nombre: 'Laboratorio 4', tipo: TipoAmbiente.LABORATORIO, capacidad: 30 },
    { codigo: 'Lab-Fisica', nombre: 'Laboratorio de Física', tipo: TipoAmbiente.LABORATORIO, capacidad: 25 },
    { codigo: 'Lab-Taller', nombre: 'Taller de Confecciones', tipo: TipoAmbiente.LABORATORIO, capacidad: 35 },
    { codigo: 'Lab-I', nombre: 'Laboratorio I', tipo: TipoAmbiente.LABORATORIO, capacidad: 30 },
    { codigo: 'Lab-II', nombre: 'Laboratorio II', tipo: TipoAmbiente.LABORATORIO, capacidad: 30 },

    // Auditorio
    { codigo: 'AUD', nombre: 'Audiovisuales', tipo: TipoAmbiente.AUDITORIO, capacidad: 80 },
  ];

  for (const ambienteData of ambientesData) {
    await prisma.ambiente.create({ data: ambienteData });
  }

  console.log(`✅ ${ambientesData.length} ambientes creados`);

  // ==================== PERÍODO ACADÉMICO ====================
  const periodo = await prisma.periodoAcademico.create({
    data: {
      nombre: '2026-I',
      fechaInicio: new Date('2026-04-13'),
      fechaFin: new Date('2026-08-08'),
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

  console.log('✅ Período académico 2026-I creado');

  // ==================== DISPONIBILIDAD DE DOCENTES ====================
  const dias: DiaSemana[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  for (const docente of docentes) {
    for (const dia of dias) {
      await prisma.disponibilidadDocente.create({
        data: {
          docenteId: docente.id,
          diaSemana: dia,
          horaInicio: '08:00',
          horaFin: '18:00',
          prioridad: 1
        }
      });
    }
  }

  console.log('✅ Disponibilidad de docentes creada');

  // ==================== ESTUDIANTES ====================
  const estudiantesData = [
    { codigo: '1020100126', nombre: 'Carlos Alberto', apellidos: 'Sánchez Ruiz', email: 'csanchez@unitru.edu.pe', dni: '71234561', ciclo: 1 },
    { codigo: '1020100226', nombre: 'Ana Lucía', apellidos: 'Torres Paredes', email: 'atorres@unitru.edu.pe', dni: '71234562', ciclo: 1 },
    { codigo: '1020100326', nombre: 'Roberto Carlos', apellidos: 'García Mendoza', email: 'rgarcia@unitru.edu.pe', dni: '71234563', ciclo: 1 },
    { codigo: '1020100426', nombre: 'María Fernanda', apellidos: 'López Castro', email: 'mlopez@unitru.edu.pe', dni: '71234564', ciclo: 1 },
    { codigo: '1020100526', nombre: 'Diego Armando', apellidos: 'Morales Villa', email: 'dmorales@unitru.edu.pe', dni: '71234565', ciclo: 1 },
    { codigo: '1020100626', nombre: 'Valeria Andrea', apellidos: 'Rojas Pineda', email: 'vrojas@unitru.edu.pe', dni: '71234566', ciclo: 3 },
    { codigo: '1020100726', nombre: 'Javier Alejandro', apellidos: 'Castro Herrera', email: 'jcastro@unitru.edu.pe', dni: '71234567', ciclo: 3 },
    { codigo: '1020100826', nombre: 'Daniela Fernanda', apellidos: 'Mendoza Ríos', email: 'dmendoza@unitru.edu.pe', dni: '71234568', ciclo: 5 },
    { codigo: '1020100926', nombre: 'Sebastián', apellidos: 'Flores Vargas', email: 'sflores@unitru.edu.pe', dni: '71234569', ciclo: 7 },
    { codigo: '1020101026', nombre: 'Camila', apellidos: 'Nuñez Rojas', email: 'cnunez@unitru.edu.pe', dni: '71234570', ciclo: 9 },
  ];

  const estudiantes = [];
  for (const est of estudiantesData) {
    const estudiante = await prisma.estudiante.create({
      data: est
    });
    estudiantes.push(estudiante);
  }

  console.log(`✅ ${estudiantes.length} estudiantes creados`);

  // ==================== MATRÍCULAS ====================
  for (const estudiante of estudiantes) {
    // Matricular al estudiante en cursos de su ciclo
    const cursosDelCiclo = cursos.filter(c => c.ciclo === estudiante.ciclo);

    for (const curso of cursosDelCiclo) {
      if (curso.grupos.length > 0) {
        const grupo = curso.grupos[Math.floor(Math.random() * curso.grupos.length)];
        await prisma.matricula.create({
          data: {
            estudianteId: estudiante.id,
            cursoId: curso.id,
            grupoId: grupo.id,
            periodoId: periodo.id,
            estado: 'ACTIVO'
          }
        });
      }
    }
  }

  console.log(`✅ Matrículas creadas`);

  // ==================== HORARIOS BASE (opcional, para tener datos de ejemplo) ====================
  // Nota: Los horarios completos se generarían desde la interfaz de selección temporal
  // Aquí creamos algunos horarios de ejemplo para el ciclo I

  const ambientes = await prisma.ambiente.findMany();
  const ambientesMap = new Map(ambientes.map(a => [a.nombre, a]));

  // Ejemplo: Crear algunos horarios para el ciclo I - Lunes
  const cursosCiclo1 = cursos.filter(c => c.ciclo === 1);
  const docentesCiclo1 = docentes.filter(d =>
    ['Marcelino Torres Villanueva', 'Alberto Mendoza de los Santos', 'Paul Cotrina Castellanos',
      'Bertha Urtecho Zavaleta', 'José Luis Ponte Bejarano'].includes(`${d.nombre} ${d.apellidos}`)
  );

  // Horario de muestra: Introducción a la Programación - Lunes 7-8am
  const cursoProgramacion = cursosCiclo1.find(c => c.nombre === 'Introducción a la Programación');
  const docenteMarcelino = docentesCiclo1.find(d => `${d.nombre} ${d.apellidos}` === 'Marcelino Torres Villanueva');
  const grupoA = cursoProgramacion?.grupos[0];
  const aula307 = ambientesMap.get('Posgrado A-307');

  if (cursoProgramacion && docenteMarcelino && grupoA && aula307) {
    await prisma.horario.create({
      data: {
        periodoId: periodo.id,
        cursoId: cursoProgramacion.id,
        docenteId: docenteMarcelino.id,
        grupoId: grupoA.id,
        ambienteId: aula307.id,
        diaSemana: DiaSemana.LUNES,
        horaInicio: '07:00',
        horaFin: '09:00',
        estado: EstadoHorario.PUBLICADO,
        publicado: true,
        creadoPor: adminUser.id,
        fechaConfirmacion: new Date(),
        confirmadoPor: adminUser.id
      }
    });
    console.log('✅ Horario de ejemplo creado');
  }

  // ==================== REPORTE FINAL ====================
  console.log('\n🎉 ========== DATOS SEMILLA GENERADOS ==========');
  console.log(`📊 Resumen:`);
  console.log(`   👨‍🏫 Docentes: ${docentes.length}`);
  console.log(`   📚 Cursos: ${cursos.length}`);
  console.log(`   🏛️ Ambientes: ${ambientesData.length}`);
  console.log(`   👨‍🎓 Estudiantes: ${estudiantes.length}`);
  console.log(`   📅 Período: 2026-I (13 Abril - 08 Agosto 2026)`);
  console.log('=============================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error generando datos semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });