"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var passwordHash, adminUser, operadorUser, superAdminUser, docentesData, docentes, _i, docentesData_1, docenteData, user, docente, cursosData, cursos, _a, cursosData_1, cursoData, curso, asignaciones, _b, asignaciones_1, asignacion, ambientesData, _c, ambientesData_1, ambienteData, periodo, dias, _d, docentes_1, docente, _e, dias_1, dia;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    console.log('🌱 Iniciando generación de datos semilla...');
                    // Limpiar datos existentes en orden
                    return [4 /*yield*/, prisma.seleccionTemporal.deleteMany()];
                case 1:
                    // Limpiar datos existentes en orden
                    _f.sent();
                    return [4 /*yield*/, prisma.envioNotificacion.deleteMany()];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, prisma.notificacion.deleteMany()];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, prisma.atencionVentana.deleteMany()];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, prisma.ventanaAtencion.deleteMany()];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, prisma.validacionHorario.deleteMany()];
                case 6:
                    _f.sent();
                    return [4 /*yield*/, prisma.horario.deleteMany()];
                case 7:
                    _f.sent();
                    return [4 /*yield*/, prisma.disponibilidadDocente.deleteMany()];
                case 8:
                    _f.sent();
                    return [4 /*yield*/, prisma.restriccionAmbiente.deleteMany()];
                case 9:
                    _f.sent();
                    return [4 /*yield*/, prisma.mantenimientoAmbiente.deleteMany()];
                case 10:
                    _f.sent();
                    return [4 /*yield*/, prisma.preferenciasNotificacion.deleteMany()];
                case 11:
                    _f.sent();
                    return [4 /*yield*/, prisma.cursoDocente.deleteMany()];
                case 12:
                    _f.sent();
                    return [4 /*yield*/, prisma.grupo.deleteMany()];
                case 13:
                    _f.sent();
                    return [4 /*yield*/, prisma.curso.deleteMany()];
                case 14:
                    _f.sent();
                    return [4 /*yield*/, prisma.docente.deleteMany()];
                case 15:
                    _f.sent();
                    return [4 /*yield*/, prisma.sesion.deleteMany()];
                case 16:
                    _f.sent();
                    return [4 /*yield*/, prisma.usuario.deleteMany()];
                case 17:
                    _f.sent();
                    return [4 /*yield*/, prisma.configuracionPeriodo.deleteMany()];
                case 18:
                    _f.sent();
                    return [4 /*yield*/, prisma.diaNoLaborable.deleteMany()];
                case 19:
                    _f.sent();
                    return [4 /*yield*/, prisma.ambiente.deleteMany()];
                case 20:
                    _f.sent();
                    return [4 /*yield*/, prisma.periodoAcademico.deleteMany()];
                case 21:
                    _f.sent();
                    return [4 /*yield*/, prisma.registroAuditoria.deleteMany()];
                case 22:
                    _f.sent();
                    console.log('✅ Datos anteriores limpiados');
                    return [4 /*yield*/, bcryptjs_1.default.hash('unt123456', 12)];
                case 23:
                    passwordHash = _f.sent();
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                email: 'admin@unitru.edu.pe',
                                password: passwordHash,
                                nombre: 'Administrador',
                                apellidos: 'Sistema',
                                rol: client_1.Rol.ADMINISTRADOR,
                                verificado: true,
                            }
                        })];
                case 24:
                    adminUser = _f.sent();
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                email: 'operador@unitru.edu.pe',
                                password: passwordHash,
                                nombre: 'Operador',
                                apellidos: 'Sistema',
                                rol: client_1.Rol.OPERADOR,
                                verificado: true,
                            }
                        })];
                case 25:
                    operadorUser = _f.sent();
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                email: 'superadmin@unitru.edu.pe',
                                password: passwordHash,
                                nombre: 'Super',
                                apellidos: 'Admin',
                                rol: client_1.Rol.SUPER_ADMIN,
                                verificado: true,
                            }
                        })];
                case 26:
                    superAdminUser = _f.sent();
                    console.log('✅ Usuarios creados');
                    docentesData = [
                        {
                            email: 'juan.perez@unitru.edu.pe',
                            nombre: 'Juan',
                            apellidos: 'Pérez García',
                            codigo: 'DOC001',
                            categoria: client_1.CategoriaDocente.PRINCIPAL,
                            departamento: 'Ingeniería de Software'
                        },
                        {
                            email: 'maria.lopez@unitru.edu.pe',
                            nombre: 'María',
                            apellidos: 'López Torres',
                            codigo: 'DOC002',
                            categoria: client_1.CategoriaDocente.ASOCIADO,
                            departamento: 'Ciencias de la Computación'
                        },
                        {
                            email: 'carlos.rodriguez@unitru.edu.pe',
                            nombre: 'Carlos',
                            apellidos: 'Rodríguez Sánchez',
                            codigo: 'DOC003',
                            categoria: client_1.CategoriaDocente.AUXILIAR,
                            departamento: 'Ingeniería de Software'
                        },
                        {
                            email: 'ana.martinez@unitru.edu.pe',
                            nombre: 'Ana',
                            apellidos: 'Martínez Díaz',
                            codigo: 'DOC004',
                            categoria: client_1.CategoriaDocente.CONTRATADO,
                            departamento: 'Redes y Comunicaciones'
                        },
                        {
                            email: 'pedro.garcia@unitru.edu.pe',
                            nombre: 'Pedro',
                            apellidos: 'García Fernández',
                            codigo: 'DOC005',
                            categoria: client_1.CategoriaDocente.INVITADO,
                            departamento: 'Sistemas de Información'
                        }
                    ];
                    docentes = [];
                    _i = 0, docentesData_1 = docentesData;
                    _f.label = 27;
                case 27:
                    if (!(_i < docentesData_1.length)) return [3 /*break*/, 31];
                    docenteData = docentesData_1[_i];
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                email: docenteData.email,
                                password: passwordHash,
                                nombre: docenteData.nombre,
                                apellidos: docenteData.apellidos,
                                rol: client_1.Rol.DOCENTE,
                                verificado: true,
                            }
                        })];
                case 28:
                    user = _f.sent();
                    return [4 /*yield*/, prisma.docente.create({
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
                        })];
                case 29:
                    docente = _f.sent();
                    docentes.push(docente);
                    _f.label = 30;
                case 30:
                    _i++;
                    return [3 /*break*/, 27];
                case 31:
                    console.log('✅ Docentes creados');
                    cursosData = [
                        { codigo: 'IS101', nombre: 'Introducción a la Programación', creditos: 4, horasTeoria: 2, horasPractica: 4, horasLaboratorio: 0, ciclo: 1 },
                        { codigo: 'IS201', nombre: 'Estructura de Datos', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 2 },
                        { codigo: 'IS301', nombre: 'Base de Datos', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 3 },
                        { codigo: 'IS401', nombre: 'Ingeniería de Software', creditos: 4, horasTeoria: 3, horasPractica: 2, horasLaboratorio: 0, ciclo: 4 },
                        { codigo: 'IS501', nombre: 'Sistemas Operativos', creditos: 3, horasTeoria: 2, horasPractica: 0, horasLaboratorio: 2, ciclo: 5 },
                        { codigo: 'IS601', nombre: 'Redes de Computadoras', creditos: 4, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 2, ciclo: 6 },
                        { codigo: 'IS701', nombre: 'Inteligencia Artificial', creditos: 4, horasTeoria: 3, horasPractica: 2, horasLaboratorio: 0, ciclo: 7 },
                        { codigo: 'IS801', nombre: 'Gestión de Proyectos TI', creditos: 3, horasTeoria: 2, horasPractica: 2, horasLaboratorio: 0, ciclo: 8 },
                    ];
                    cursos = [];
                    _a = 0, cursosData_1 = cursosData;
                    _f.label = 32;
                case 32:
                    if (!(_a < cursosData_1.length)) return [3 /*break*/, 35];
                    cursoData = cursosData_1[_a];
                    return [4 /*yield*/, prisma.curso.create({
                            data: __assign(__assign({}, cursoData), { grupos: {
                                    create: [
                                        { nombre: 'A', capacidad: 30 },
                                        { nombre: 'B', capacidad: 30 },
                                    ]
                                } })
                        })];
                case 33:
                    curso = _f.sent();
                    cursos.push(curso);
                    _f.label = 34;
                case 34:
                    _a++;
                    return [3 /*break*/, 32];
                case 35:
                    console.log('✅ Cursos creados con grupos');
                    asignaciones = [
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
                    _b = 0, asignaciones_1 = asignaciones;
                    _f.label = 36;
                case 36:
                    if (!(_b < asignaciones_1.length)) return [3 /*break*/, 39];
                    asignacion = asignaciones_1[_b];
                    return [4 /*yield*/, prisma.cursoDocente.create({
                            data: {
                                cursoId: cursos[asignacion.cursoIndex].id,
                                docenteId: docentes[asignacion.docenteIndex].id,
                                horasAsignadas: asignacion.horasAsignadas,
                            }
                        })];
                case 37:
                    _f.sent();
                    _f.label = 38;
                case 38:
                    _b++;
                    return [3 /*break*/, 36];
                case 39:
                    console.log('✅ Asignaciones curso-docente creadas');
                    ambientesData = [
                        { codigo: 'A101', nombre: 'Aula 101', tipo: client_1.TipoAmbiente.AULA, capacidad: 40 },
                        { codigo: 'A102', nombre: 'Aula 102', tipo: client_1.TipoAmbiente.AULA, capacidad: 40 },
                        { codigo: 'A201', nombre: 'Aula 201', tipo: client_1.TipoAmbiente.AULA, capacidad: 35 },
                        { codigo: 'L301', nombre: 'Laboratorio de Cómputo 1', tipo: client_1.TipoAmbiente.LABORATORIO, capacidad: 25 },
                        { codigo: 'L302', nombre: 'Laboratorio de Cómputo 2', tipo: client_1.TipoAmbiente.LABORATORIO, capacidad: 25 },
                        { codigo: 'L303', nombre: 'Laboratorio de Redes', tipo: client_1.TipoAmbiente.LABORATORIO, capacidad: 20 },
                        { codigo: 'AUD1', nombre: 'Auditorio Principal', tipo: client_1.TipoAmbiente.AUDITORIO, capacidad: 100 },
                        { codigo: 'SC01', nombre: 'Sala de Conferencias 1', tipo: client_1.TipoAmbiente.SALA_CONFERENCIAS, capacidad: 50 },
                    ];
                    _c = 0, ambientesData_1 = ambientesData;
                    _f.label = 40;
                case 40:
                    if (!(_c < ambientesData_1.length)) return [3 /*break*/, 43];
                    ambienteData = ambientesData_1[_c];
                    return [4 /*yield*/, prisma.ambiente.create({ data: ambienteData })];
                case 41:
                    _f.sent();
                    _f.label = 42;
                case 42:
                    _c++;
                    return [3 /*break*/, 40];
                case 43:
                    console.log('✅ Ambientes creados');
                    return [4 /*yield*/, prisma.periodoAcademico.create({
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
                        })];
                case 44:
                    periodo = _f.sent();
                    console.log('✅ Período académico creado');
                    dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
                    _d = 0, docentes_1 = docentes;
                    _f.label = 45;
                case 45:
                    if (!(_d < docentes_1.length)) return [3 /*break*/, 50];
                    docente = docentes_1[_d];
                    _e = 0, dias_1 = dias;
                    _f.label = 46;
                case 46:
                    if (!(_e < dias_1.length)) return [3 /*break*/, 49];
                    dia = dias_1[_e];
                    return [4 /*yield*/, prisma.disponibilidadDocente.create({
                            data: {
                                docenteId: docente.id,
                                diaSemana: dia,
                                horaInicio: '08:00',
                                horaFin: '14:00',
                                prioridad: 1
                            }
                        })];
                case 47:
                    _f.sent();
                    _f.label = 48;
                case 48:
                    _e++;
                    return [3 /*break*/, 46];
                case 49:
                    _d++;
                    return [3 /*break*/, 45];
                case 50:
                    console.log('✅ Disponibilidad de docentes creada');
                    console.log('🎉 Datos semilla generados exitosamente');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error generando datos semilla:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
