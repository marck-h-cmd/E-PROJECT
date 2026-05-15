// Utilidad para importar datos desde CSV

export class ImportadorCSV {
  static parsearCSV(contenido: string): { headers: string[]; datos: any[] } {
    const lineas = contenido.split('\n').filter(linea => linea.trim());
    if (lineas.length === 0) {
      throw new Error('Archivo vacío');
    }

    const headers = this.parsearLinea(lineas[0]);
    const datos = lineas.slice(1).map(linea => {
      const valores = this.parsearLinea(linea);
      const fila: any = {};
      headers.forEach((header, index) => {
        fila[header.trim()] = valores[index]?.trim() || '';
      });
      return fila;
    });

    return { headers, datos };
  }

  static validarColumnasRequeridas(
    headers: string[],
    columnasRequeridas: string[]
  ): string[] {
    return columnasRequeridas.filter(
      col => !headers.map(h => h.toLowerCase()).includes(col.toLowerCase())
    );
  }

  private static parsearLinea(linea: string): string[] {
    const valores: string[] = [];
    let actual = '';
    let dentroDeComillas = false;

    for (let i = 0; i < linea.length; i++) {
      const char = linea[i];
      
      if (char === '"') {
        if (dentroDeComillas && linea[i + 1] === '"') {
          actual += '"';
          i++;
        } else {
          dentroDeComillas = !dentroDeComillas;
        }
      } else if (char === ',' && !dentroDeComillas) {
        valores.push(actual);
        actual = '';
      } else {
        actual += char;
      }
    }
    
    valores.push(actual);
    return valores;
  }
}