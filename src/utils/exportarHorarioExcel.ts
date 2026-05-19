import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { HorarioCalendarItem } from '@/components/horarios/HorarioWeeklyCalendar';

export async function exportarHorarioExcel(
  horarios: HorarioCalendarItem[],
  titulo: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sistema de Horarios UNT';
  workbook.created = new Date();

  // HOJA 1: CALENDARIO
  const wsCalendario = workbook.addWorksheet('Calendario');
  
  wsCalendario.mergeCells('A1:F1');
  const tituloCell = wsCalendario.getCell('A1');
  tituloCell.value = titulo;
  tituloCell.font = { size: 16, bold: true };
  tituloCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsCalendario.getRow(1).height = 30;

  const dias = ['HORA', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
  const headerRow = wsCalendario.addRow(dias);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }; // unt-blue
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });

  wsCalendario.getColumn(1).width = 15;
  for(let i=2; i<=6; i++) {
    wsCalendario.getColumn(i).width = 25;
  }

  const horas = Array.from({ length: 14 }, (_, i) => i + 7);
  const diasKeys = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

  horas.forEach(h => {
    const horaFormateada = `${h.toString().padStart(2, '0')}:00 - ${(h+1).toString().padStart(2, '0')}:00`;
    const row = wsCalendario.addRow([horaFormateada]);
    row.height = 45;
    
    row.getCell(1).font = { bold: true };
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    
    diasKeys.forEach((d, index) => {
      const colIndex = index + 2;
      const cell = row.getCell(colIndex);
      
      const horariosCelda = horarios.filter(horario => {
        const start = parseInt(horario.horaInicio.split(':')[0], 10);
        const end = parseInt(horario.horaFin.split(':')[0], 10);
        return horario.diaSemana === d && start <= h && end > h;
      });

      if (horariosCelda.length > 0) {
        cell.value = horariosCelda.map(hc => `${hc.curso.codigo} \n ${hc.ambiente.codigo}`).join('\n---\n');
        cell.alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
      }
      
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });


  // HOJA 2: LISTADO DETALLADO
  const wsListado = workbook.addWorksheet('Listado');
  wsListado.columns = [
    { header: 'Código Curso', key: 'codigo', width: 15 },
    { header: 'Curso', key: 'curso', width: 35 },
    { header: 'Ciclo', key: 'ciclo', width: 10 },
    { header: 'Docente', key: 'docente', width: 35 },
    { header: 'Ambiente', key: 'ambiente', width: 15 },
    { header: 'Día', key: 'dia', width: 15 },
    { header: 'Inicio', key: 'inicio', width: 10 },
    { header: 'Fin', key: 'fin', width: 10 },
    { header: 'Grupo', key: 'grupo', width: 15 },
  ];

  wsListado.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
  });

  horarios.forEach(h => {
    wsListado.addRow({
      codigo: h.curso.codigo,
      curso: h.curso.nombre,
      ciclo: h.curso.ciclo,
      docente: `${h.docente.usuario.nombre} ${h.docente.usuario.apellidos}`,
      ambiente: h.ambiente.codigo,
      dia: h.diaSemana,
      inicio: h.horaInicio,
      fin: h.horaFin,
      grupo: h.grupo?.nombre || '-',
    });
  });

  // Generar buffer y guardar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'horario_academico.xlsx');
}
