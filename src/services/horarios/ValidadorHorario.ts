import { prisma } from '@/lib/prisma';
import { DiaSemana, EstadoHorario, PeriodoAcademico } from '@prisma/client';
import { redis } from '@/lib/redis';

export interface ValidacionResult {
  valido: boolean;
  conflictos: ValidacionConflicto[];
  sugerencias?: string[];
}

export interface ValidacionConflicto {
  tipo: 'CRUCE_DOCENTE' | 'CRUCE_AMBIENTE' | 'CRUCE_GRUPO' | 
        'DISPONIBILIDAD_DOCENTE' | 'HORAS_EXCEDIDAS' | 
        'MANTENIMIENTO_AMBIENTE' | 'DIA_NO_LABORABLE' |
        'ORDEN_ATENCION' | 'HORAS_REQUERIDAS';
  mensaje: string;
  severidad: 'ERROR' | 'WARNING' | 'INFO';
  detalle?: any;
}

export class ValidadorHorario {
  async validarHorario(
    periodoId: string,
    docenteId: string,
    cursoId: string,
    ambienteId: string,
    grupoId: string | undefined,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFin: string,
    horarioIdExcluir?: string
  ): Promise<ValidacionResult> {
    const conflictos: ValidacionConflicto[] = [];

    // 1. Validar cruce de docente
    await this.validarCruceDocente(
      conflictos, periodoId, docenteId, diaSemana, horaInicio, horaFin, horarioIdExcluir
    );

    // 2. Validar cruce de ambiente
    await this.validarCruceAmbiente(
      conflictos, periodoId, ambienteId, diaSemana, horaInicio, horaFin, horarioIdExcluir
    );

    // 3. Validar cruce de grupo (si aplica)
    if (grupoId) {
      await this.validarCruceGrupo(
        conflictos, periodoId, grupoId, diaSemana, horaInicio, horaFin, horarioIdExcluir
      );
    }

    // 4. Validar disponibilidad del docente
    await this.validarDisponibilidadDocente(
      conflictos, docenteId, diaSemana, horaInicio, horaFin
    );

    // 5. Validar horas máximas diarias del docente
    await this.validarHorasMaximasDiarias(
      conflictos, periodoId, docenteId, diaSemana, horaInicio, horaFin
    );

    // 6. Validar mantenimiento de ambiente
    await this.validarMantenimientoAmbiente(
      conflictos, ambienteId, diaSemana, horaInicio, horaFin
    );

    // 7. Validar horas requeridas del curso
    await this.validarHorasRequeridasCurso(
      conflictos, periodoId, docenteId, cursoId
    );

    // 8. Validar que no sea día no laborable
    await this.validarDiaNoLaborable(
      conflictos, periodoId, diaSemana
    );

    return {
      valido: !conflictos.some(c => c.severidad === 'ERROR'),
      conflictos,
    };
  }

  private async validarCruceDocente(
    conflictos: ValidacionConflicto[],
    periodoId: string,
    docenteId: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFin: string,
    horarioIdExcluir?: string
  ) {
    const where: any = {
      periodoId,
      docenteId,
      diaSemana,
      estado: { notIn: ['CANCELADO' as EstadoHorario] },
      OR: [
        {
          horaInicio: { lt: horaFin },
          horaFin: { gt: horaInicio },
        },
      ],
    };

    if (horarioIdExcluir) {
      where.id = { not: horarioIdExcluir };
    }

    const cruces = await prisma.horario.findMany({
      where,
      include: {
        curso: { select: { nombre: true } },
        ambiente: { select: { nombre: true } },
      },
    });

    for (const cruce of cruces) {
      conflictos.push({
        tipo: 'CRUCE_DOCENTE',
        mensaje: `El docente ya tiene asignado el curso "${cruce.curso.nombre}" en el ambiente "${cruce.ambiente.nombre}" de ${cruce.horaInicio} a ${cruce.horaFin}`,
        severidad: 'ERROR',
        detalle: { horarioId: cruce.id },
      });
    }
  }

  private async validarCruceAmbiente(
    conflictos: ValidacionConflicto[],
    periodoId: string,
    ambienteId: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFin: string,
    horarioIdExcluir?: string
  ) {
    const where: any = {
      periodoId,
      ambienteId,
      diaSemana,
      estado: { notIn: ['CANCELADO' as EstadoHorario] },
      OR: [
        {
          horaInicio: { lt: horaFin },
          horaFin: { gt: horaInicio },
        },
      ],
    };

    if (horarioIdExcluir) {
      where.id = { not: horarioIdExcluir };
    }

    const cruces = await prisma.horario.findMany({
      where,
      include: {
        curso: { select: { nombre: true } },
        docente: {
          include: {
            usuario: { select: { nombre: true, apellidos: true } }
          }
        },
      },
    });

    for (const cruce of cruces) {
      conflictos.push({
        tipo: 'CRUCE_AMBIENTE',
        mensaje: `El ambiente ya está ocupado por el curso "${cruce.curso.nombre}" con el docente ${cruce.docente.usuario.nombre} ${cruce.docente.usuario.apellidos}`,
        severidad: 'ERROR',
        detalle: { horarioId: cruce.id },
      });
    }
  }

  private async validarCruceGrupo(
    conflictos: ValidacionConflicto[],
    periodoId: string,
    grupoId: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFin: string,
    horarioIdExcluir?: string
  ) {
    const where: any = {
      periodoId,
      grupoId,
      diaSemana,
      estado: { notIn: ['CANCELADO' as EstadoHorario] },
      OR: [
        {
          horaInicio: { lt: horaFin },
          horaFin: { gt: horaInicio },
        },
      ],
    };

    if (horarioIdExcluir) {
      where.id = { not: horarioIdExcluir };
    }

    const cruces = await prisma.horario.findMany({
      where,
      include: {
        curso: { select: { nombre: true } },
      },
    });

    for (const cruce of cruces) {
      conflictos.push({
        tipo: 'CRUCE_GRUPO',
        mensaje: `El grupo ya tiene programado el curso "${cruce.curso.nombre}" en este horario`,
        severidad: 'ERROR',
        detalle: { horarioId: cruce.id },
      });
    }
  }

  private async validarDisponibilidadDocente(
    conflictos: ValidacionConflicto[],
    docenteId: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFin: string
  ) {
    // Verificar si el docente marcó este horario como no disponible
    const restriccion = await prisma.disponibilidadDocente.findFirst({
      where: {
        docenteId,
        diaSemana,
        horaInicio: { lte: horaInicio },
        horaFin: { gte: horaFin },
        prioridad: 3, // Prioridad baja = no disponible
      },
    });

    if (restriccion) {
      conflictos.push({
        tipo: 'DISPONIBILIDAD_DOCENTE',
        mensaje: 'El docente no está disponible en este horario',
        severidad: 'WARNING',
      });
    }
  }

  private async validarHorasMaximasDiarias(
    conflictos: ValidacionConflicto[],
    periodoId: string,
    docenteId: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFin: string
  ) {
    // Obtener configuración del período
    const config = await prisma.configuracionPeriodo.findUnique({
      where: { periodoId },
    });

    const horasMaximas = config?.horasMaxDiariasDocente || 8;

    // Calcular horas del nuevo horario
    const horasNuevoHorario = this.calcularHoras(horaInicio, horaFin);

    // Obtener horas ya asignadas en el día
    const horariosExistentes = await prisma.horario.findMany({
      where: {
        periodoId,
        docenteId,
        diaSemana,
        estado: { not: 'CANCELADO' },
      },
    });

    let horasAsignadas = 0;
    for (const h of horariosExistentes) {
      horasAsignadas += this.calcularHoras(h.horaInicio, h.horaFin);
    }

    if (horasAsignadas + horasNuevoHorario > horasMaximas) {
      conflictos.push({
        tipo: 'HORAS_EXCEDIDAS',
        mensaje: `El docente excedería el límite de ${horasMaximas} horas diarias (tiene ${horasAsignadas}h asignadas)`,
        severidad: 'ERROR',
      });
    }
  }

  private async validarMantenimientoAmbiente(
    conflictos: ValidacionConflicto[],
    ambienteId: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFin: string
  ) {
    // Verificar si hay mantenimiento programado
    const ahora = new Date();
    const mantenimiento = await prisma.mantenimientoAmbiente.findFirst({
      where: {
        ambienteId,
        fechaInicio: { lte: ahora },
        fechaFin: { gte: ahora },
        completado: false,
      },
    });

    if (mantenimiento) {
      conflictos.push({
        tipo: 'MANTENIMIENTO_AMBIENTE',
        mensaje: `El ambiente está en mantenimiento: ${mantenimiento.descripcion}`,
        severidad: 'ERROR',
      });
    }
  }

  private async validarHorasRequeridasCurso(
    conflictos: ValidacionConflicto[],
    periodoId: string,
    docenteId: string,
    cursoId: string
  ) {
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      include: {
        cursosDocente: {
          where: { docenteId },
        },
      },
    });

    if (!curso || !curso.cursosDocente[0]) return;

    const horasRequeridas = curso.horasTeoria + curso.horasPractica + curso.horasLaboratorio;

    // Calcular horas ya asignadas del docente a este curso
    const horariosAsignados = await prisma.horario.findMany({
      where: {
        periodoId,
        docenteId,
        cursoId,
        estado: { not: 'CANCELADO' },
      },
    });

    let horasAsignadas = 0;
    for (const h of horariosAsignados) {
      horasAsignadas += this.calcularHoras(h.horaInicio, h.horaFin);
    }

    if (horasAsignadas >= horasRequeridas) {
      conflictos.push({
        tipo: 'HORAS_REQUERIDAS',
        mensaje: `El docente ya tiene asignadas ${horasAsignadas}h de las ${horasRequeridas}h requeridas para este curso`,
        severidad: 'WARNING',
      });
    }
  }

  private async validarDiaNoLaborable(
    conflictos: ValidacionConflicto[],
    periodoId: string,
    diaSemana: DiaSemana
  ) {
    // Verificar si el día está en la lista de no laborables
    // Esta es una validación simplificada, en producción se cruzaría con fechas
    const diasNoLaborables = await prisma.diaNoLaborable.findMany({
      where: {
        periodoId,
        fecha: {
          gte: new Date(),
        },
      },
      take: 1, // Solo necesitamos saber si existe alguno
    });

    // Nota: Esta validación requeriría conocer la fecha exacta
    // Se implementará completamente en iteraciones posteriores
  }

  private calcularHoras(horaInicio: string, horaFin: string): number {
    const [hiH, hiM] = horaInicio.split(':').map(Number);
    const [hfH, hfM] = horaFin.split(':').map(Number);
    return (hfH + hfM / 60) - (hiH + hiM / 60);
  }
}