import { prisma } from '@/lib/prisma';
import { ImportadorCSV } from '@/lib/importadorCSV';
import { ServicioDocente } from './ServicioDocente';
import { CategoriaDocente } from '@prisma/client';

export interface ResultadoImportacion {
  exitosos: number;
  fallidos: number;
  errores: { fila: number; mensaje: string }[];
  docentesCreados: any[];
}

export class ImportadorDocentes {
  private servicioDocente: ServicioDocente;
  private readonly COLUMNAS_REQUERIDAS = [
    'codigo',
    'email',
    'nombre',
    'apellidos',
    'categoria',
  ];

  constructor() {
    this.servicioDocente = new ServicioDocente();
  }

  /**
   * Importa docentes desde un archivo CSV
   */
  async importarDesdeCSV(
    contenido: string,
    sobrescribir: boolean = false
  ): Promise<ResultadoImportacion> {
    const resultado: ResultadoImportacion = {
      exitosos: 0,
      fallidos: 0,
      errores: [],
      docentesCreados: [],
    };

    try {
      const { headers, datos } = ImportadorCSV.parsearCSV(contenido);

      // Validar columnas requeridas
      const faltantes = ImportadorCSV.validarColumnesRequeridas(
        headers,
        this.COLUMNAS_REQUERIDAS
      );

      if (faltantes.length > 0) {
        throw new Error(`Columnas faltantes: ${faltantes.join(', ')}`);
      }

      // Procesar cada fila
      for (let i = 0; i < datos.length; i++) {
        const fila = datos[i];
        const numeroFila = i + 2; // +2 porque la fila 1 es el header

        try {
          await this.procesarFila(fila, numeroFila, resultado, sobrescribir);
        } catch (error: any) {
          resultado.fallidos++;
          resultado.errores.push({
            fila: numeroFila,
            mensaje: error.message || 'Error desconocido',
          });
        }
      }
    } catch (error: any) {
      throw new Error(`Error al procesar archivo: ${error.message}`);
    }

    return resultado;
  }

  /**
   * Procesa una fila individual
   */
  private async procesarFila(
    fila: any,
    numeroFila: number,
    resultado: ResultadoImportacion,
    sobrescribir: boolean
  ): Promise<void> {
    // Validar datos requeridos
    const codigo = fila.codigo?.trim();
    const email = fila.email?.trim();
    const nombre = fila.nombre?.trim();
    const apellidos = fila.apellidos?.trim();
    const categoria = this.validarCategoria(fila.categoria?.trim());

    if (!codigo || !email || !nombre || !apellidos || !categoria) {
      throw new Error('Faltan datos requeridos (código, email, nombre, apellidos, categoría)');
    }

    // Validar formato de email
    if (!this.validarEmail(email)) {
      throw new Error(`Email inválido: ${email}`);
    }

    // Validar categoría
    if (!categoria) {
      throw new Error(`Categoría inválida: ${fila.categoria}`);
    }

    // Verificar si ya existe
    const codigoExiste = await this.verificarExistencia(codigo, email);

    if (codigoExiste) {
      if (sobrescribir) {
        // Actualizar existente
        const docenteExistente = await prisma.docente.findFirst({
          where: { OR: [{ codigo }, { usuario: { email } }] },
        });

        if (docenteExistente) {
          await this.servicioDocente.actualizar(docenteExistente.id, {
            nombre,
            apellidos,
            categoria: categoria as CategoriaDocente,
            departamento: fila.departamento?.trim(),
            telefono: fila.telefono?.trim(),
            whatsapp: fila.whatsapp?.trim(),
          });
          resultado.exitosos++;
          return;
        }
      } else {
        throw new Error(`Ya existe un docente con código ${codigo} o email ${email}`);
      }
    }

    // Crear nuevo docente
    const docente = await this.servicioDocente.crear({
      codigo,
      email,
      nombre,
      apellidos,
      categoria: categoria as CategoriaDocente,
      departamento: fila.departamento?.trim(),
      telefono: fila.telefono?.trim(),
      whatsapp: fila.whatsapp?.trim(),
    });

    resultado.exitosos++;
    resultado.docentesCreados.push({
      codigo,
      nombre: `${nombre} ${apellidos}`,
      email,
      passwordTemporal: docente.passwordTemporal,
    });
  }

  /**
   * Exporta docentes a formato CSV
   */
  async exportarACSV(filtros?: any): Promise<string> {
    const docentes = await prisma.docente.findMany({
      where: filtros || {},
      include: {
        usuario: {
          select: {
            email: true,
            nombre: true,
            apellidos: true,
            activo: true,
          },
        },
      },
      orderBy: { codigo: 'asc' },
    });

    const headers = [
      'codigo',
      'email',
      'nombre',
      'apellidos',
      'categoria',
      'departamento',
      'telefono',
      'whatsapp',
      'activo',
    ];

    let csv = headers.join(',') + '\n';

    for (const docente of docentes) {
      const fila = [
        docente.codigo,
        docente.usuario.email,
        docente.usuario.nombre,
        docente.usuario.apellidos,
        docente.categoria,
        docente.departamento || '',
        docente.telefono || '',
        docente.whatsapp || '',
        docente.usuario.activo ? 'SI' : 'NO',
      ];
      csv += fila.map(v => `"${v}"`).join(',') + '\n';
    }

    return csv;
  }

  /**
   * Valida una categoría de docente
   */
  private validarCategoria(categoria: string): string | null {
    const categoriasValidas = ['PRINCIPAL', 'ASOCIADO', 'AUXILIAR', 'CONTRATADO', 'INVITADO'];
    const normalizada = categoria?.toUpperCase()?.trim();

    // Intentar mapear nombres comunes
    const mapeo: Record<string, string> = {
      'PRINCIPAL': 'PRINCIPAL',
      'ASOCIADO': 'ASOCIADO',
      'AUXILIAR': 'AUXILIAR',
      'CONTRATADO': 'CONTRATADO',
      'INVITADO': 'INVITADO',
      'JEFE DE PRACTICA': 'AUXILIAR',
      'JEFE DE PRÁCTICA': 'AUXILIAR',
      'NOMBRADO': 'PRINCIPAL',
      'VISITANTE': 'INVITADO',
    };

    return mapeo[normalizada] || null;
  }

  /**
   * Valida formato de email
   */
  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Verifica si ya existe un docente con ese código o email
   */
  private async verificarExistencia(codigo: string, email: string): Promise<boolean> {
    const existente = await prisma.docente.findFirst({
      where: {
        OR: [
          { codigo },
          { usuario: { email } },
        ],
      },
      select: { id: true },
    });

    return !!existente;
  }

  /**
   * Genera una plantilla CSV de ejemplo
   */
  static generarPlantillaCSV(): string {
    const headers = [
      'codigo',
      'email',
      'nombre',
      'apellidos',
      'categoria',
      'departamento',
      'telefono',
      'whatsapp',
    ];

    const ejemplo = [
      'DOC001',
      'juan.perez@unitru.edu.pe',
      'Juan',
      'Pérez García',
      'PRINCIPAL',
      'Ingeniería de Software',
      '999123456',
      '51999123456',
    ];

    return headers.join(',') + '\n' + ejemplo.join(',') + '\n';
  }
}