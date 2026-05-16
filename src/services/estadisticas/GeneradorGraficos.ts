import { redis } from '@/lib/redis';

export interface DatosGrafico {
  tipo: 'barras' | 'linea' | 'pie' | 'radar' | 'heatmap';
  titulo: string;
  etiquetas: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }[];
  opciones?: any;
}

export class GeneradorGraficos {
  private readonly CACHE_TTL = 600; // 10 minutos

  /**
   * Genera datos para un gráfico de barras
   */
  async generarGraficoBarras(
    etiquetas: string[],
    valores: number[],
    titulo: string,
    colores?: string[]
  ): Promise<DatosGrafico> {
    return {
      tipo: 'barras',
      titulo,
      etiquetas,
      datasets: [{
        label: titulo,
        data: valores,
        backgroundColor: colores || this.generarColores(valores.length),
        borderColor: '#1a365d',
      }],
      opciones: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: titulo },
        },
      },
    };
  }

  /**
   * Genera datos para un gráfico de pastel
   */
  async generarGraficoPastel(
    etiquetas: string[],
    valores: number[],
    titulo: string
  ): Promise<DatosGrafico> {
    const colores = this.generarColores(valores.length);

    return {
      tipo: 'pie',
      titulo,
      etiquetas,
      datasets: [{
        label: titulo,
        data: valores,
        backgroundColor: colores,
      }],
      opciones: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: titulo },
        },
      },
    };
  }

  /**
   * Genera datos para un gráfico de líneas
   */
  async generarGraficoLinea(
    etiquetas: string[],
    datasets: { label: string; data: number[]; color?: string }[],
    titulo: string
  ): Promise<DatosGrafico> {
    return {
      tipo: 'linea',
      titulo,
      etiquetas,
      datasets: datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color || this.colorPorIndice(i),
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.1,
      })),
      opciones: {
        responsive: true,
        plugins: {
          title: { display: true, text: titulo },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    };
  }

  /**
   * Genera datos para un mapa de calor
   */
  async generarHeatmap(
    datos: Record<string, Record<string, number>>,
    titulo: string
  ): Promise<DatosGrafico> {
    const dias = Object.keys(datos);
    const horas = Object.keys(datos[dias[0]] || {});

    const valores: number[] = [];
    for (const dia of dias) {
      for (const hora of horas) {
        valores.push(datos[dia]?.[hora] || 0);
      }
    }

    return {
      tipo: 'heatmap',
      titulo,
      etiquetas: horas,
      datasets: [{
        label: 'Ocupación',
        data: valores,
        backgroundColor: this.generarEscalaColor(valores),
      }],
      opciones: {
        responsive: true,
        plugins: {
          title: { display: true, text: titulo },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const diaIndex = Math.floor(context.dataIndex / horas.length);
                const horaIndex = context.dataIndex % horas.length;
                return `${dias[diaIndex]} ${horas[horaIndex]}: ${context.raw} horarios`;
              },
            },
          },
        },
      },
    };
  }

  /**
   * Genera datos para un gráfico de avance
   */
  async generarGraficoAvance(
    categorias: string[],
    horasAsignadas: number[],
    horasRequeridas: number[]
  ): Promise<DatosGrafico> {
    return {
      tipo: 'barras',
      titulo: 'Avance por Categoría',
      etiquetas: categorias,
      datasets: [
        {
          label: 'Horas Asignadas',
          data: horasAsignadas,
          backgroundColor: '#3B82F6',
        },
        {
          label: 'Horas Requeridas',
          data: horasRequeridas,
          backgroundColor: '#EF4444',
        },
      ],
      opciones: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Avance de Asignación por Categoría' },
        },
        scales: {
          y: { beginAtZero: true, stacked: false },
        },
      },
    };
  }

  /**
   * Cachea un gráfico generado
   */
  async cachearGrafico(clave: string, grafico: DatosGrafico): Promise<void> {
    await redis.setex(
      `grafico:${clave}`,
      this.CACHE_TTL,
      JSON.stringify(grafico)
    );
  }

  /**
   * Obtiene un gráfico cacheado
   */
  async obtenerGraficoCacheado(clave: string): Promise<DatosGrafico | null> {
    const data = await redis.get(`grafico:${clave}`);
    return data ? JSON.parse(data) : null;
  }

  private generarColores(cantidad: number): string[] {
    const coloresBase = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
      '#14B8A6', '#E11D48', '#D946EF', '#0EA5E9', '#22C55E',
    ];

    return Array.from({ length: cantidad }, (_, i) => coloresBase[i % coloresBase.length]);
  }

  private colorPorIndice(indice: number): string {
    const colores = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
    return colores[indice % colores.length];
  }

  private generarEscalaColor(valores: number[]): string[] {
    const max = Math.max(...valores, 1);
    return valores.map(v => {
      const intensidad = Math.round((v / max) * 255);
      return `rgba(59, 130, 246, ${0.1 + (v / max) * 0.9})`;
    });
  }
}