// Utilidad para exportar datos a Excel
// En una implementación real, se usaría una librería como exceljs

export class ExportadorExcel {
  static async generarExcel(datos: any[], columnas: string[], titulo: string): Promise<Buffer> {
    // Implementación simplificada
    // En producción, usar exceljs o similar
    
    let csv = columnas.join(',') + '\n';
    
    for (const fila of datos) {
      const valores = columnas.map(col => {
        const valor = fila[col] || '';
        // Escapar comas y comillas
        return `"${String(valor).replace(/"/g, '""')}"`;
      });
      csv += valores.join(',') + '\n';
    }

    return Buffer.from(csv, 'utf-8');
  }

  static generarNombreArchivo(tipo: string): string {
    const fecha = new Date().toISOString().split('T')[0];
    return `${tipo}_${fecha}.csv`;
  }
}