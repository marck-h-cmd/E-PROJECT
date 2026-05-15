import { NextRequest, NextResponse } from 'next/server';
import { ServicioAuditoria } from '@/services/auditoria/ServicioAuditoria';
import { createErrorResponse } from '@/lib/respuestas';

const servicioAuditoria = new ServicioAuditoria();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fechaDesde = searchParams.get('fechaDesde') 
      ? new Date(searchParams.get('fechaDesde')!) 
      : undefined;
    const fechaHasta = searchParams.get('fechaHasta') 
      ? new Date(searchParams.get('fechaHasta')!) 
      : undefined;
    const entidad = searchParams.get('entidad') || undefined;
    const accion = searchParams.get('accion') || undefined;

    const datos = await servicioAuditoria.exportarAuditoria({
      fechaDesde,
      fechaHasta,
      entidad,
      accion,
    });

    // Convertir a CSV
    const headers = Object.keys(datos[0] || {});
    let csv = headers.join(',') + '\n';
    
    for (const fila of datos) {
      const valores = headers.map(h => {
        const valor = (fila as any)[h] || '';
        return `"${String(valor).replace(/"/g, '""')}"`;
      });
      csv += valores.join(',') + '\n';
    }

    const fecha = new Date().toISOString().split('T')[0];
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="auditoria-${fecha}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exportando auditoría:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al exportar auditoría', 500);
  }
}