import { 
  format, 
  parse, 
  isValid, 
  addDays, 
  addWeeks, 
  addMonths, 
  differenceInMinutes,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWeekend,
  isBefore,
  isAfter,
  isEqual,
  getDay
} from 'date-fns';
import { es } from 'date-fns/locale';

export class UtilidadesFecha {
  static FORMATO_FECHA = 'dd/MM/yyyy';
  static FORMATO_HORA = 'HH:mm';
  static FORMATO_COMPLETO = 'dd/MM/yyyy HH:mm';
  static DIAS_SEMANA_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Formatear fecha
  static formatearFecha(fecha: Date | string, formato: string = this.FORMATO_FECHA): string {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    if (!isValid(date)) return 'Fecha inválida';
    return format(date, formato, { locale: es });
  }

  // Formatear hora
  static formatearHora(hora: string): string {
    return hora.substring(0, 5); // Asegurar formato HH:mm
  }

  // Parsear hora string a Date
  static parsearHora(hora: string, fechaBase: Date = new Date()): Date {
    return parse(hora, 'HH:mm', fechaBase);
  }

  // Calcular diferencia en minutos entre dos horas
  static diferenciaMinutos(horaInicio: string, horaFin: string): number {
    const inicio = this.parsearHora(horaInicio);
    const fin = this.parsearHora(horaFin);
    return differenceInMinutes(fin, inicio);
  }

  // Convertir minutos a formato horas
  static minutosAHoras(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas === 0) return `${mins}min`;
    if (mins === 0) return `${horas}h`;
    return `${horas}h ${mins}min`;
  }

  // Obtener nombre del día en español
  static nombreDia(diaSemana: string): string {
    const mapa: Record<string, string> = {
      'LUNES': 'Lunes',
      'MARTES': 'Martes',
      'MIERCOLES': 'Miércoles',
      'JUEVES': 'Jueves',
      'VIERNES': 'Viernes',
      'SABADO': 'Sábado',
      'DOMINGO': 'Domingo',
    };
    return mapa[diaSemana] || diaSemana;
  }

  // Generar rango de fechas para un período
  static generarDiasPeriodo(fechaInicio: Date, fechaFin: Date): Date[] {
    return eachDayOfInterval({ start: fechaInicio, end: fechaFin })
      .filter(fecha => !isWeekend(fecha)); // Solo días de semana
  }

  // Verificar si una hora está en un rango
  static horaEnRango(hora: string, inicio: string, fin: string): boolean {
    return hora >= inicio && hora <= fin;
  }

  // Generar franjas horarias
  static generarFranjasHorarias(
    horaInicio: string = '08:00',
    horaFin: string = '20:00',
    duracionMinutos: number = 60
  ): string[] {
    const franjas: string[] = [];
    let [hora, minuto] = horaInicio.split(':').map(Number);
    const [horaFinNum] = horaFin.split(':').map(Number);

    while (hora < horaFinNum) {
      const siguienteHora = hora + Math.floor(duracionMinutos / 60);
      const siguienteMinuto = minuto + (duracionMinutos % 60);
      
      const inicio = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
      const fin = `${String(siguienteHora).padStart(2, '0')}:${String(siguienteMinuto).padStart(2, '0')}`;
      
      franjas.push(`${inicio}-${fin}`);
      
      hora = siguienteHora;
      minuto = siguienteMinuto;
    }

    return franjas;
  }

  // Obtener el día de la semana actual
  static diaSemanaActual(): string {
    const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    return dias[getDay(new Date())];
  }

  // Validar formato de hora
  static validarFormatoHora(hora: string): boolean {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(hora);
  }
}