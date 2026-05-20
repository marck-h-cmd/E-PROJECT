import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HorarioCalendarItem } from '@/components/horarios/HorarioWeeklyCalendar';

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
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, 148, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitulo, 148, 22, { align: 'center' });

  // Preparar estructura de datos para autoTable
  const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  const horas = Array.from({ length: 14 }, (_, i) => i + 7); // 7 to 20 (7:00-21:00)

  // Crear matriz de la tabla
  const body: any[][] = [];
  
  horas.forEach(h => {
    const horaFormateada = `${h.toString().padStart(2, '0')}:00 - ${(h+1).toString().padStart(2, '0')}:00`;
    const fila: any[] = [horaFormateada];
    
    dias.forEach(d => {
      // Filtrar horarios que caigan en esta franja horaria
      const horariosCelta = horarios.filter(horario => {
        const start = parseInt(horario.horaInicio.split(':')[0], 10);
        const end = parseInt(horario.horaFin.split(':')[0], 10);
        return horario.diaSemana === d && start <= h && end > h; // Intersecta la hora
      });
      
      if (horariosCelta.length > 0) {
        // Unir datos de los cursos en esta celda
        const contenido = horariosCelta.map(hc => 
          `${hc.curso.codigo}\n${hc.ambiente.codigo}\n${hc.docente.usuario.nombre} ${hc.docente.usuario.apellidos.charAt(0)}.`
        ).join('\n---\n');
        fila.push(contenido);
      } else {
        fila.push('');
      }
    });
    body.push(fila);
  });

  // Dibujar tabla
  autoTable(doc, {
    startY: 30,
    head: [['HORA', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES']],
    body: body,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: 'middle',
      halign: 'center',
    },
    headStyles: {
      fillColor: [30, 64, 175], // unt-blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30, fillColor: [240, 244, 248] }, // Columna de hora
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });

  // Pie de página con fecha
  const fecha = new Date().toLocaleString('es-PE');
  const paginas = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Generado el: ${fecha}`, 14, 200);
    doc.text(`Página ${i} de ${paginas}`, 280, 200, { align: 'right' });
  }

  // Descargar
  doc.save('horario_academico.pdf');
}
