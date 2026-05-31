import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HorarioCalendarItem } from '@/components/horarios/HorarioWeeklyCalendar';

const PDF_COLORES_CURSO = [
  { bg: [219, 234, 254], text: [30, 58, 138] }, // Blue
  { bg: [220, 252, 231], text: [20, 83, 45] },  // Green
  { bg: [243, 232, 255], text: [88, 28, 135] }, // Purple
  { bg: [254, 243, 199], text: [120, 53, 4] },  // Amber
  { bg: [255, 228, 230], text: [136, 19, 55] }, // Rose
  { bg: [204, 251, 241], text: [19, 78, 74] },  // Teal
  { bg: [255, 237, 213], text: [124, 45, 18] }, // Orange
  { bg: [207, 250, 254], text: [21, 94, 117] }, // Cyan
];

const getPdfColorForCurso = (cursoCodigo: string) => {
  let hash = 0;
  for (let i = 0; i < cursoCodigo.length; i++) {
    hash = cursoCodigo.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PDF_COLORES_CURSO.length;
  return PDF_COLORES_CURSO[index];
};

export async function exportarHorarioPDF(
  horarios: HorarioCalendarItem[],
  titulo: string,
  subtitulo: string
): Promise<void> {
  // Crear documento apaisado (landscape)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Títulos
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, 148, 12, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitulo, 148, 18, { align: 'center' });

  const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  const diasLabel: Record<string, string> = {
    LUNES: 'LUNES',
    MARTES: 'MARTES',
    MIERCOLES: 'MIÉRCOLES',
    JUEVES: 'JUEVES',
    VIERNES: 'VIERNES',
    SABADO: 'SÁBADO'
  };

  const parseTime = (t: string) => parseInt(t.split(':')[0], 10);

  // Agrupar en lanes (carriles) por día
  const dayLanesMap: Record<string, HorarioCalendarItem[][]> = {};
  dias.forEach(d => {
    const dayClasses = horarios.filter(h => h.diaSemana === d && h.estado !== 'CANCELADO');
    const lanes: HorarioCalendarItem[][] = [];
    const sortedClasses = [...dayClasses].sort((a, b) => parseTime(a.horaInicio) - parseTime(b.horaInicio));

    sortedClasses.forEach(c => {
      const start = parseTime(c.horaInicio);
      const end = parseTime(c.horaFin);

      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        const hasOverlap = lanes[i].some(existing => {
          const estart = parseTime(existing.horaInicio);
          const eend = parseTime(existing.horaFin);
          return Math.max(start, estart) < Math.min(end, eend);
        });
        if (!hasOverlap) {
          lanes[i].push(c);
          placed = true;
          break;
        }
      }
      if (!placed) {
        lanes.push([c]);
      }
    });

    if (lanes.length === 0) {
      lanes.push([]);
    }
    dayLanesMap[d] = lanes;
  });

  // Mapear columnas virtuales: HORA + lanes de cada día
  const colMap: Array<{ day: string; laneIndex: number }> = [];
  dias.forEach(d => {
    const lanes = dayLanesMap[d];
    lanes.forEach((_, idx) => {
      colMap.push({ day: d, laneIndex: idx });
    });
  });

  // Construir cabecera con colSpans
  const headRow = [
    { content: 'HORA', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
    ...dias.map(d => ({
      content: diasLabel[d],
      colSpan: dayLanesMap[d].length,
      styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const }
    }))
  ];

  // Construir grilla de celdas (14 filas para horas 7:00 a 21:00)
  const grid: any[][] = Array.from({ length: 14 }, () => Array(1 + colMap.length).fill(null));

  for (let r = 0; r < 14; r++) {
    const startHour = 7 + r;
    const endHour = startHour + 1;
    const horaText = `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
    
    grid[r][0] = { 
      content: horaText, 
      styles: { 
        fontStyle: 'bold' as const, 
        fillColor: [241, 245, 249], 
        textColor: [100, 116, 139],
        fontSize: 7.5,
        halign: 'center' as const,
        valign: 'middle' as const
      } 
    };

    for (let colIdx = 1; colIdx <= colMap.length; colIdx++) {
      const { day, laneIndex } = colMap[colIdx - 1];
      const laneClasses = dayLanesMap[day][laneIndex];
      const startingClass = laneClasses.find(c => parseTime(c.horaInicio) === startHour);

      if (startingClass) {
        const duration = parseTime(startingClass.horaFin) - parseTime(startingClass.horaInicio);
        const colScheme = getPdfColorForCurso(startingClass.curso.codigo);
        
        // Marcar celdas cubiertas por el rowspan
        for (let k = 1; k < duration; k++) {
          if (r + k < 14) {
            grid[r + k][colIdx] = 'SPANNED';
          }
        }

        const isLab = startingClass.ambiente ? startingClass.ambiente.codigo.toUpperCase().includes('LAB') : false;
        const docName = startingClass.docente?.usuario 
          ? `${startingClass.docente.usuario.nombre} ${startingClass.docente.usuario.apellidos.charAt(0)}.`
          : '';
        const ambCodigo = startingClass.ambiente ? startingClass.ambiente.codigo : 'No asignado';

        grid[r][colIdx] = {
          content: `${startingClass.curso.codigo}\n${startingClass.curso.nombre}\n[${isLab ? 'LAB' : 'TEORÍA'}]\nAmb: ${ambCodigo}\n${docName}${startingClass.grupo?.nombre ? ` (Gr. ${startingClass.grupo.nombre})` : ''}`,
          rowSpan: duration,
          styles: {
            fillColor: colScheme.bg,
            textColor: colScheme.text,
            valign: 'middle' as const,
            halign: 'center' as const,
            fontSize: colMap.length > 8 ? 6 : colMap.length > 5 ? 7 : 7.5,
            fontStyle: 'bold' as const
          }
        };
      } else if (grid[r][colIdx] !== 'SPANNED') {
        grid[r][colIdx] = { 
          content: '', 
          styles: { 
            fillColor: [255, 255, 255] 
          } 
        };
      }
    }
  }

  // Filtrar las celdas cubiertas para la estructura final del body
  const body: any[][] = [];
  for (let r = 0; r < 14; r++) {
    const rowData: any[] = [];
    for (let c = 0; c <= colMap.length; c++) {
      const cell = grid[r][c];
      if (cell !== 'SPANNED') {
        rowData.push(cell);
      }
    }
    body.push(rowData);
  }

  // Generar la tabla usando jsPDF autoTable
  autoTable(doc, {
    startY: 24,
    head: [headRow],
    body: body,
    theme: 'grid',
    styles: {
      cellPadding: colMap.length > 8 ? 1 : 1.5,
      lineColor: [226, 232, 240], // border-slate-200
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [26, 54, 93], // #1a365d
      textColor: [255, 255, 255],
      fontSize: 8.5
    },
    columnStyles: {
      0: { cellWidth: 25 }
    }
  });

  // Pie de página
  const fecha = new Date().toLocaleString('es-PE');
  const paginas = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Generado el: ${fecha}`, 14, 202);
    doc.text(`Página ${i} de ${paginas}`, 280, 202, { align: 'right' });
  }

  doc.save('horario_academico.pdf');
}
