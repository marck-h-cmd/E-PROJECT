/**
 * Utilidad para generar colores aleatorios y paletas de colores
 * Útil para gráficos, etiquetas de cursos, docentes, etc.
 */

export interface ColorHSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ColorHex {
  hex: string; // #RRGGBB
}

export class GeneradorColor {
  // Paleta de colores predefinida para categorías
  static readonly PALETA_CATEGORIAS: Record<string, string> = {
    'PRINCIPAL': '#1E40AF',   // Azul oscuro
    'ASOCIADO': '#047857',    // Verde oscuro
    'AUXILIAR': '#B45309',    // Naranja oscuro
    'CONTRATADO': '#7C3AED',  // Púrpura
    'INVITADO': '#BE185D',    // Rosa oscuro
  };

  // Paleta de colores para tipos de ambiente
  static readonly PALETA_AMBIENTES: Record<string, string> = {
    'AULA': '#2563EB',              // Azul
    'LABORATORIO': '#DC2626',       // Rojo
    'AUDITORIO': '#7C3AED',         // Púrpura
    'SALA_CONFERENCIAS': '#059669', // Verde esmeralda
  };

  // Colores para estados
  static readonly PALETA_ESTADOS: Record<string, string> = {
    'BORRADOR': '#6B7280',            // Gris
    'ACTIVO': '#10B981',              // Verde
    'CONFIRMADO': '#3B82F6',          // Azul
    'PUBLICADO': '#8B5CF6',           // Púrpura
    'CANCELADO': '#EF4444',           // Rojo
    'FINALIZADO': '#F59E0B',          // Ámbar
    'PENDIENTE': '#F59E0B',           // Amarillo
    'ENVIADA': '#10B981',             // Verde
    'FALLIDA': '#EF4444',             // Rojo
    'LEIDA': '#6B7280',               // Gris
  };

  // Paleta de 20 colores distintivos para gráficos
  static readonly PALETA_GRAFICOS: string[] = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
    '#14B8A6', '#E11D48', '#8B5CF6', '#D946EF', '#0EA5E9',
    '#22C55E', '#EAB308', '#A855F7', '#64748B', '#DC2626',
  ];

  /**
   * Genera un color hexadecimal aleatorio
   */
  static generarHexAleatorio(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return this.rgbToHex({ r, g, b });
  }

  /**
   * Genera un color HSL aleatorio
   */
  static generarHSLAleatorio(saturacion?: number, luminosidad?: number): ColorHSL {
    return {
      h: Math.floor(Math.random() * 360),
      s: saturacion ?? Math.floor(Math.random() * 30) + 50, // 50-80
      l: luminosidad ?? Math.floor(Math.random() * 20) + 40, // 40-60
    };
  }

  /**
   * Convierte HSL a RGB
   */
  static hslToRgb(hsl: ColorHSL): ColorRGB {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  /**
   * Convierte RGB a Hexadecimal
   */
  static rgbToHex(rgb: ColorRGB): string {
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
  }

  /**
   * Convierte Hexadecimal a RGB
   */
  static hexToRgb(hex: string): ColorRGB {
    const limpio = hex.replace('#', '');
    return {
      r: parseInt(limpio.substring(0, 2), 16),
      g: parseInt(limpio.substring(2, 4), 16),
      b: parseInt(limpio.substring(4, 6), 16),
    };
  }

  /**
   * Convierte RGB a HSL
   */
  static rgbToHsl(rgb: ColorRGB): ColorHSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Aclara un color hexadecimal
   */
  static aclarar(hex: string, porcentaje: number = 20): string {
    const rgb = this.hexToRgb(hex);
    const factor = 1 + porcentaje / 100;
    
    return this.rgbToHex({
      r: Math.min(255, Math.round(rgb.r * factor)),
      g: Math.min(255, Math.round(rgb.g * factor)),
      b: Math.min(255, Math.round(rgb.b * factor)),
    });
  }

  /**
   * Oscurece un color hexadecimal
   */
  static oscurecer(hex: string, porcentaje: number = 20): string {
    const rgb = this.hexToRgb(hex);
    const factor = 1 - porcentaje / 100;
    
    return this.rgbToHex({
      r: Math.max(0, Math.round(rgb.r * factor)),
      g: Math.max(0, Math.round(rgb.g * factor)),
      b: Math.max(0, Math.round(rgb.b * factor)),
    });
  }

  /**
   * Genera una paleta de colores armónica
   */
  static generarPaletaArmonica(
    colorBase: string,
    cantidad: number = 5,
    tipo: 'analoga' | 'complementaria' | 'triadica' | 'monocromatica' = 'analoga'
  ): string[] {
    const hsl = this.rgbToHsl(this.hexToRgb(colorBase));
    const colores: string[] = [];

    switch (tipo) {
      case 'analoga':
        for (let i = 0; i < cantidad; i++) {
          const h = (hsl.h + i * (30 / cantidad) - 30) % 360;
          colores.push(this.rgbToHex(this.hslToRgb({ h: h < 0 ? h + 360 : h, s: hsl.s, l: hsl.l })));
        }
        break;

      case 'complementaria':
        colores.push(colorBase);
        colores.push(this.rgbToHex(this.hslToRgb({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l })));
        break;

      case 'triadica':
        for (let i = 0; i < 3; i++) {
          colores.push(this.rgbToHex(this.hslToRgb({ h: (hsl.h + i * 120) % 360, s: hsl.s, l: hsl.l })));
        }
        break;

      case 'monocromatica':
        for (let i = 0; i < cantidad; i++) {
          const l = Math.max(10, Math.min(90, hsl.l + (i - Math.floor(cantidad / 2)) * (80 / cantidad)));
          colores.push(this.rgbToHex(this.hslToRgb({ h: hsl.h, s: hsl.s, l })));
        }
        break;
    }

    return colores;
  }

  /**
   * Genera colores para un conjunto de elementos (cursos, docentes, etc.)
   */
  static generarColoresParaElementos(
    ids: string[],
    saturacion: number = 65,
    luminosidad: number = 55
  ): Record<string, string> {
    const colores: Record<string, string> = {};
    
    ids.forEach((id, index) => {
      const h = (index * (360 / ids.length)) % 360;
      const hsl: ColorHSL = { h, s: saturacion, l: luminosidad };
      colores[id] = this.rgbToHex(this.hslToRgb(hsl));
    });

    return colores;
  }

  /**
   * Obtiene un color de la paleta de gráficos por índice
   */
  static colorGrafico(indice: number): string {
    return this.PALETA_GRAFICOS[indice % this.PALETA_GRAFICOS.length];
  }

  /**
   * Obtiene color para una categoría de docente
   */
  static colorCategoria(categoria: string): string {
    return this.PALETA_CATEGORIAS[categoria] || this.generarHexAleatorio();
  }

  /**
   * Obtiene color para un tipo de ambiente
   */
  static colorAmbiente(tipo: string): string {
    return this.PALETA_AMBIENTES[tipo] || this.generarHexAleatorio();
  }

  /**
   * Obtiene color para un estado
   */
  static colorEstado(estado: string): string {
    return this.PALETA_ESTADOS[estado] || '#6B7280';
  }

  /**
   * Calcula el contraste (blanco o negro) para un color de fondo
   */
  static colorContraste(hex: string, claro: string = '#FFFFFF', oscuro: string = '#000000'): string {
    const rgb = this.hexToRgb(hex);
    const luminosidad = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminosidad > 0.5 ? oscuro : claro;
  }

  /**
   * Mezcla dos colores
   */
  static mezclarColores(color1: string, color2: string, proporcion: number = 0.5): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    return this.rgbToHex({
      r: Math.round(rgb1.r * (1 - proporcion) + rgb2.r * proporcion),
      g: Math.round(rgb1.g * (1 - proporcion) + rgb2.g * proporcion),
      b: Math.round(rgb1.b * (1 - proporcion) + rgb2.b * proporcion),
    });
  }

  /**
   * Genera un gradiente entre dos colores
   */
  static generarGradiente(colorInicio: string, colorFin: string, pasos: number): string[] {
    const gradiente: string[] = [];
    
    for (let i = 0; i < pasos; i++) {
      const proporcion = i / (pasos - 1);
      gradiente.push(this.mezclarColores(colorInicio, colorFin, proporcion));
    }
    
    return gradiente;
  }

  /**
   * Verifica si un color es válido
   */
  static esColorValido(color: string): boolean {
    const regex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    return regex.test(color);
  }

  /**
   * Normaliza un color a formato hexadecimal de 6 dígitos
   */
  static normalizarColor(color: string): string {
    const limpio = color.replace('#', '');
    
    if (limpio.length === 3) {
      return `#${limpio[0]}${limpio[0]}${limpio[1]}${limpio[1]}${limpio[2]}${limpio[2]}`.toUpperCase();
    }
    
    return `#${limpio}`.toUpperCase();
  }

  /**
   * Convierte color a formato RGBA
   */
  static toRgba(hex: string, alpha: number = 1): string {
    const rgb = this.hexToRgb(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }
}