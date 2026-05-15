/**
 * Utilidades para manipulación de arrays
 */

export class UtilidadesArray {
  /**
   * Elimina elementos duplicados de un array
   */
  static eliminarDuplicados<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  /**
   * Elimina duplicados basado en una propiedad específica
   */
  static eliminarDuplicadosPor<T>(array: T[], clave: keyof T): T[] {
    const seen = new Set();
    return array.filter(item => {
      const value = item[clave];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  /**
   * Divide un array en chunks de tamaño específico
   */
  static chunk<T>(array: T[], size: number): T[][] {
    if (!array.length || size < 1) return [];
    
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Mezcla un array aleatoriamente (Fisher-Yates shuffle)
   */
  static shuffle<T>(array: T[]): T[] {
    const resultado = [...array];
    for (let i = resultado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
  }

  /**
   * Ordena un array por una propiedad específica
   */
  static ordenarPor<T>(array: T[], clave: keyof T, orden: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      if (a[clave] < b[clave]) return orden === 'asc' ? -1 : 1;
      if (a[clave] > b[clave]) return orden === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Ordena un array por múltiples propiedades
   */
  static ordenarPorMultiples<T>(array: T[], criterios: { clave: keyof T; orden: 'asc' | 'desc' }[]): T[] {
    return [...array].sort((a, b) => {
      for (const criterio of criterios) {
        const { clave, orden } = criterio;
        if (a[clave] < b[clave]) return orden === 'asc' ? -1 : 1;
        if (a[clave] > b[clave]) return orden === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Agrupa un array por una propiedad
   */
  static agruparPor<T>(array: T[], clave: keyof T): Record<string, T[]> {
    return array.reduce((grupos, item) => {
      const valor = String(item[clave]);
      if (!grupos[valor]) {
        grupos[valor] = [];
      }
      grupos[valor].push(item);
      return grupos;
    }, {} as Record<string, T[]>);
  }

  /**
   * Agrupa por una función de agrupación
   */
  static agruparPorFn<T>(array: T[], fn: (item: T) => string): Record<string, T[]> {
    return array.reduce((grupos, item) => {
      const clave = fn(item);
      if (!grupos[clave]) {
        grupos[clave] = [];
      }
      grupos[clave].push(item);
      return grupos;
    }, {} as Record<string, T[]>);
  }

  /**
   * Encuentra la intersección de dos arrays
   */
  static interseccion<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter(item => set2.has(item));
  }

  /**
   * Encuentra la diferencia entre dos arrays (elementos en array1 que no están en array2)
   */
  static diferencia<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter(item => !set2.has(item));
  }

  /**
   * Encuentra la unión de dos arrays (sin duplicados)
   */
  static union<T>(array1: T[], array2: T[]): T[] {
    return this.eliminarDuplicados([...array1, ...array2]);
  }

  /**
   * Encuentra la diferencia simétrica entre dos arrays
   */
  static diferenciaSimetrica<T>(array1: T[], array2: T[]): T[] {
    const set1 = new Set(array1);
    const set2 = new Set(array2);
    
    const diff1 = array1.filter(item => !set2.has(item));
    const diff2 = array2.filter(item => !set1.has(item));
    
    return [...diff1, ...diff2];
  }

  /**
   * Aplana un array de arrays
   */
  static aplanar<T>(array: T[][]): T[] {
    return array.reduce((flat, current) => flat.concat(current), []);
  }

  /**
   * Aplana un array de forma profunda (recursiva)
   */
  static aplanarProfundo(array: any[]): any[] {
    return array.reduce((flat, item) => {
      return flat.concat(Array.isArray(item) ? this.aplanarProfundo(item) : item);
    }, []);
  }

  /**
   * Obtiene un elemento aleatorio del array
   */
  static aleatorio<T>(array: T[]): T | undefined {
    if (!array.length) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Obtiene múltiples elementos aleatorios sin repetición
   */
  static aleatorios<T>(array: T[], cantidad: number): T[] {
    if (cantidad >= array.length) return this.shuffle(array);
    return this.shuffle(array).slice(0, cantidad);
  }

  /**
   * Rota los elementos de un array n posiciones
   */
  static rotar<T>(array: T[], posiciones: number): T[] {
    const len = array.length;
    if (!len) return [];
    
    const rotacion = ((posiciones % len) + len) % len;
    return [...array.slice(rotacion), ...array.slice(0, rotacion)];
  }

  /**
   * Particiona un array en dos: los que cumplen y los que no
   */
  static particionar<T>(array: T[], predicado: (item: T) => boolean): [T[], T[]] {
    return array.reduce(
      ([cumplen, noCumplen], item) => {
        return predicado(item) 
          ? [[...cumplen, item], noCumplen] 
          : [cumplen, [...noCumplen, item]];
      },
      [[], []] as [T[], T[]]
    );
  }

  /**
   * Cuenta la frecuencia de cada elemento
   */
  static frecuencia<T>(array: T[]): Map<T, number> {
    return array.reduce((mapa, item) => {
      mapa.set(item, (mapa.get(item) || 0) + 1);
      return mapa;
    }, new Map<T, number>());
  }

  /**
   * Obtiene los elementos más frecuentes
   */
  static masFrecuentes<T>(array: T[], n: number = 1): T[] {
    const frecuencia = this.frecuencia(array);
    return Array.from(frecuencia.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(entry => entry[0]);
  }

  /**
   * Crea un rango de números
   */
  static rango(inicio: number, fin: number, paso: number = 1): number[] {
    const resultado: number[] = [];
    if (paso > 0) {
      for (let i = inicio; i <= fin; i += paso) {
        resultado.push(i);
      }
    } else if (paso < 0) {
      for (let i = inicio; i >= fin; i += paso) {
        resultado.push(i);
      }
    }
    return resultado;
  }

  /**
   * Mueve un elemento de una posición a otra
   */
  static mover<T>(array: T[], desde: number, hasta: number): T[] {
    const resultado = [...array];
    const [elemento] = resultado.splice(desde, 1);
    resultado.splice(hasta, 0, elemento);
    return resultado;
  }

  /**
   * Intercambia dos elementos de posición
   */
  static intercambiar<T>(array: T[], indice1: number, indice2: number): T[] {
    const resultado = [...array];
    [resultado[indice1], resultado[indice2]] = [resultado[indice2], resultado[indice1]];
    return resultado;
  }

  /**
   * Verifica si dos arrays son iguales (mismos elementos en mismo orden)
   */
  static sonIguales<T>(array1: T[], array2: T[]): boolean {
    if (array1.length !== array2.length) return false;
    return array1.every((item, index) => item === array2[index]);
  }

  /**
   * Verifica si dos arrays tienen los mismos elementos (sin importar orden)
   */
  static mismosElementos<T>(array1: T[], array2: T[]): boolean {
    if (array1.length !== array2.length) return false;
    const set1 = new Set(array1);
    return array2.every(item => set1.has(item));
  }

  /**
   * Encuentra el elemento máximo por una propiedad
   */
  static maxPor<T>(array: T[], clave: keyof T): T | undefined {
    if (!array.length) return undefined;
    return array.reduce((max, item) => item[clave] > max[clave] ? item : max, array[0]);
  }

  /**
   * Encuentra el elemento mínimo por una propiedad
   */
  static minPor<T>(array: T[], clave: keyof T): T | undefined {
    if (!array.length) return undefined;
    return array.reduce((min, item) => item[clave] < min[clave] ? item : min, array[0]);
  }

  /**
   * Suma los valores de una propiedad
   */
  static sumarPor<T>(array: T[], clave: keyof T): number {
    return array.reduce((suma, item) => suma + (Number(item[clave]) || 0), 0);
  }

  /**
   * Calcula el promedio de los valores de una propiedad
   */
  static promedioPor<T>(array: T[], clave: keyof T): number {
    if (!array.length) return 0;
    return this.sumarPor(array, clave) / array.length;
  }

  /**
   * Pagina un array manualmente
   */
  static paginar<T>(array: T[], pagina: number = 1, porPagina: number = 20): {
    datos: T[];
    total: number;
    pagina: number;
    totalPaginas: number;
  } {
    const total = array.length;
    const totalPaginas = Math.ceil(total / porPagina);
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    
    return {
      datos: array.slice(inicio, fin),
      total,
      pagina,
      totalPaginas,
    };
  }

  /**
   * Convierte un array en un objeto indexado por una clave
   */
  static indexarPor<T>(array: T[], clave: keyof T): Record<string, T> {
    return array.reduce((indice, item) => {
      const key = String(item[clave]);
      indice[key] = item;
      return indice;
    }, {} as Record<string, T>);
  }

  /**
   * Aplica una función a cada elemento y aplana el resultado
   */
  static flatMap<T, U>(array: T[], fn: (item: T) => U[]): U[] {
    return array.reduce((resultado, item) => {
      return resultado.concat(fn(item));
    }, [] as U[]);
  }

  /**
   * Toma elementos mientras se cumpla una condición
   */
  static tomarMientras<T>(array: T[], predicado: (item: T) => boolean): T[] {
    const resultado: T[] = [];
    for (const item of array) {
      if (!predicado(item)) break;
      resultado.push(item);
    }
    return resultado;
  }

  /**
   * Omite elementos mientras se cumpla una condición
   */
  static omitirMientras<T>(array: T[], predicado: (item: T) => boolean): T[] {
    let omitiendo = true;
    return array.filter(item => {
      if (omitiendo && predicado(item)) return false;
      omitiendo = false;
      return true;
    });
  }
}