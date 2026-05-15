/**
 * Utilidades para manipulación de strings
 */

export class UtilidadesString {
  /**
   * Capitaliza la primera letra de un string
   */
  static capitalizar(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Capitaliza cada palabra de un string
   */
  static capitalizarPalabras(str: string): string {
    if (!str) return '';
    return str
      .split(' ')
      .map(palabra => this.capitalizar(palabra))
      .join(' ');
  }

  /**
   * Convierte un string a formato título (cada palabra capitalizada)
   */
  static formatoTitulo(str: string): string {
    return this.capitalizarPalabras(str);
  }

  /**
   * Trunca un string a una longitud máxima y añade puntos suspensivos
   */
  static truncar(str: string, maxLength: number, sufijo: string = '...'): string {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - sufijo.length) + sufijo;
  }

  /**
   * Elimina espacios en blanco al inicio y final, y reduce espacios múltiples
   */
  static normalizarEspacios(str: string): string {
    if (!str) return '';
    return str.trim().replace(/\s+/g, ' ');
  }

  /**
   * Elimina todos los espacios de un string
   */
  static eliminarEspacios(str: string): string {
    if (!str) return '';
    return str.replace(/\s/g, '');
  }

  /**
   * Convierte un string a slug (URL amigable)
   */
  static slugify(str: string): string {
    if (!str) return '';
    return str
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  /**
   * Convierte camelCase a snake_case
   */
  static camelToSnake(str: string): string {
    if (!str) return '';
    return str.replace(/[A-Z]/g, letra => `_${letra.toLowerCase()}`);
  }

  /**
   * Convierte snake_case a camelCase
   */
  static snakeToCamel(str: string): string {
    if (!str) return '';
    return str.replace(/_([a-z])/g, (_, letra) => letra.toUpperCase());
  }

  /**
   * Convierte camelCase a kebab-case
   */
  static camelToKebab(str: string): string {
    if (!str) return '';
    return str.replace(/[A-Z]/g, letra => `-${letra.toLowerCase()}`);
  }

  /**
   * Genera un string aleatorio de longitud específica
   */
  static generarAleatorio(longitud: number = 8, caracteres?: string): string {
    const chars = caracteres || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    const charsLength = chars.length;
    
    for (let i = 0; i < longitud; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    
    return resultado;
  }

  /**
   * Genera un código alfanumérico con prefijo opcional
   */
  static generarCodigo(prefijo: string = '', longitud: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return prefijo + this.generarAleatorio(longitud, chars);
  }

  /**
   * Enmascara parte de un string (útil para emails, teléfonos)
   */
  static enmascarar(str: string, inicio: number = 3, fin: number = 3, caracter: string = '*'): string {
    if (!str || str.length <= inicio + fin) return str;
    
    const parteInicial = str.substring(0, inicio);
    const parteFinal = str.substring(str.length - fin);
    const mascara = caracter.repeat(str.length - inicio - fin);
    
    return parteInicial + mascara + parteFinal;
  }

  /**
   * Enmascara un email para mostrar parcialmente
   */
  static enmascararEmail(email: string): string {
    if (!email || !email.includes('@')) return email;
    
    const [usuario, dominio] = email.split('@');
    if (usuario.length <= 2) {
      return `${usuario[0]}***@${dominio}`;
    }
    
    return `${usuario.substring(0, 2)}${'*'.repeat(Math.max(usuario.length - 2, 3))}@${dominio}`;
  }

  /**
   * Formatea un número de teléfono peruano
   */
  static formatearTelefono(telefono: string): string {
    if (!telefono) return '';
    
    // Eliminar todo excepto números
    const limpio = telefono.replace(/\D/g, '');
    
    if (limpio.length === 9) {
      return `${limpio.substring(0, 3)} ${limpio.substring(3, 6)} ${limpio.substring(6)}`;
    }
    
    if (limpio.length === 11 && limpio.startsWith('51')) {
      return `+51 ${limpio.substring(2, 5)} ${limpio.substring(5, 8)} ${limpio.substring(8)}`;
    }
    
    return telefono;
  }

  /**
   * Extrae iniciales de un nombre completo
   */
  static obtenerIniciales(nombre: string, apellidos?: string): string {
    if (!nombre && !apellidos) return '';
    
    const iniciales: string[] = [];
    
    if (nombre) {
      iniciales.push(nombre.charAt(0).toUpperCase());
    }
    
    if (apellidos) {
      const partes = apellidos.split(' ');
      partes.forEach(parte => {
        if (parte) iniciales.push(parte.charAt(0).toUpperCase());
      });
    }
    
    return iniciales.join('');
  }

  /**
   * Formatea un nombre para mostrar (Apellidos, Nombre)
   */
  static formatearNombre(nombre: string, apellidos: string): string {
    if (!apellidos) return nombre || '';
    if (!nombre) return apellidos;
    return `${apellidos}, ${nombre}`;
  }

  /**
   * Escapa caracteres HTML especiales
   */
  static escaparHTML(str: string): string {
    if (!str) return '';
    
    const mapa: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    
    return str.replace(/[&<>"'/]/g, char => mapa[char] || char);
  }

  /**
   * Desescapa caracteres HTML
   */
  static desescaparHTML(str: string): string {
    if (!str) return '';
    
    const mapa: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#x27;': "'",
      '&#x2F;': '/',
    };
    
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, match => mapa[match] || match);
  }

  /**
   * Verifica si un string es un email válido
   */
  static esEmail(str: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(str);
  }

  /**
   * Verifica si un string es un UUID válido
   */
  static esUUID(str: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(str);
  }

  /**
   * Verifica si un string contiene solo números
   */
  static esNumerico(str: string): boolean {
    return /^\d+$/.test(str);
  }

  /**
   * Verifica si un string está vacío o solo tiene espacios
   */
  static estaVacio(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Compara dos strings ignorando mayúsculas/minúsculas y acentos
   */
  static compararIgnorandoAcentos(str1: string, str2: string): boolean {
    if (!str1 && !str2) return true;
    if (!str1 || !str2) return false;
    
    const normalizar = (s: string) =>
      s.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    
    return normalizar(str1) === normalizar(str2);
  }

  /**
   * Busca coincidencias difusas (fuzzy search simple)
   */
  static busquedaDifusa(texto: string, busqueda: string): number {
    if (!busqueda) return 1;
    if (!texto) return 0;
    
    const textoLower = texto.toLowerCase();
    const busquedaLower = busqueda.toLowerCase();
    
    if (textoLower === busquedaLower) return 1;
    if (textoLower.includes(busquedaLower)) return 0.8;
    
    // Contar caracteres coincidentes en orden
    let coincidencias = 0;
    let indiceBusqueda = 0;
    
    for (let i = 0; i < textoLower.length && indiceBusqueda < busquedaLower.length; i++) {
      if (textoLower[i] === busquedaLower[indiceBusqueda]) {
        coincidencias++;
        indiceBusqueda++;
      }
    }
    
    return coincidencias / Math.max(textoLower.length, busquedaLower.length);
  }

  /**
   * Resalta texto dentro de un string (para búsquedas)
   */
  static resaltarTexto(texto: string, busqueda: string, etiquetaInicio: string = '<mark>', etiquetaFin: string = '</mark>'): string {
    if (!busqueda || !texto) return texto || '';
    
    const regex = new RegExp(`(${this.escaparRegex(busqueda)})`, 'gi');
    return texto.replace(regex, `${etiquetaInicio}$1${etiquetaFin}`);
  }

  /**
   * Escapa caracteres especiales para uso en expresiones regulares
   */
  static escaparRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Divide un string en líneas y las procesa
   */
  static procesarLineas(texto: string, transformacion?: (linea: string) => string): string[] {
    if (!texto) return [];
    
    const lineas = texto.split('\n').map(linea => linea.trim()).filter(linea => linea);
    
    if (transformacion) {
      return lineas.map(transformacion);
    }
    
    return lineas;
  }

  /**
   * Crea un resumen de un texto largo
   */
  static crearResumen(texto: string, maxPalabras: number = 50): string {
    if (!texto) return '';
    
    const palabras = texto.split(/\s+/);
    
    if (palabras.length <= maxPalabras) return texto;
    
    return palabras.slice(0, maxPalabras).join(' ') + '...';
  }
}