import { redis } from '@/lib/redis';
import { AppError } from '@/services/auth/AuthService';

export interface PlantillaNotificacion {
  id: string;
  nombre: string;
  tipo: string;
  canal: string;
  asunto?: string;
  cuerpo: string;
  variables: string[];
  creadaEn: string;
  actualizadaEn?: string;
}

export class GestorPlantillas {
  private readonly PLANTILLAS_KEY = 'config:plantillas:notificaciones';

  async listarPlantillas(tipo?: string, canal?: string): Promise<PlantillaNotificacion[]> {
    const data = await redis.get(this.PLANTILLAS_KEY);
    let plantillas: PlantillaNotificacion[] = data ? JSON.parse(data) : [];

    if (tipo) {
      plantillas = plantillas.filter(p => p.tipo === tipo);
    }
    if (canal) {
      plantillas = plantillas.filter(p => p.canal === canal);
    }

    return plantillas;
  }

  async obtenerPlantilla(id: string): Promise<PlantillaNotificacion> {
    const plantillas = await this.listarPlantillas();
    const plantilla = plantillas.find(p => p.id === id);

    if (!plantilla) {
      throw new AppError('Plantilla no encontrada', 404, 'PLANTILLA_NOT_FOUND');
    }

    return plantilla;
  }

  async crearPlantilla(datos: Omit<PlantillaNotificacion, 'id' | 'creadaEn'>): Promise<PlantillaNotificacion> {
    const plantillas = await this.listarPlantillas();

    const nuevaPlantilla: PlantillaNotificacion = {
      id: Date.now().toString(),
      ...datos,
      creadaEn: new Date().toISOString(),
    };

    plantillas.push(nuevaPlantilla);
    await redis.set(this.PLANTILLAS_KEY, JSON.stringify(plantillas));

    return nuevaPlantilla;
  }

  async actualizarPlantilla(id: string, datos: Partial<PlantillaNotificacion>): Promise<PlantillaNotificacion> {
    const plantillas = await this.listarPlantillas();
    const indice = plantillas.findIndex(p => p.id === id);

    if (indice === -1) {
      throw new AppError('Plantilla no encontrada', 404, 'PLANTILLA_NOT_FOUND');
    }

    plantillas[indice] = {
      ...plantillas[indice],
      ...datos,
      actualizadaEn: new Date().toISOString(),
      id, // Asegurar que no se sobrescriba el ID
    };

    await redis.set(this.PLANTILLAS_KEY, JSON.stringify(plantillas));

    return plantillas[indice];
  }

  async eliminarPlantilla(id: string): Promise<void> {
    const plantillas = await this.listarPlantillas();
    const filtradas = plantillas.filter(p => p.id !== id);

    if (filtradas.length === plantillas.length) {
      throw new AppError('Plantilla no encontrada', 404, 'PLANTILLA_NOT_FOUND');
    }

    await redis.set(this.PLANTILLAS_KEY, JSON.stringify(filtradas));
  }

  /**
   * Procesa una plantilla reemplazando variables
   */
  procesarPlantilla(plantilla: PlantillaNotificacion, variables: Record<string, string>): string {
    let resultado = plantilla.cuerpo;

    for (const [clave, valor] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${clave}\\}\\}`, 'g');
      resultado = resultado.replace(regex, valor || '');
    }

    // Reemplazar variables no proporcionadas con espacio vacío
    resultado = resultado.replace(/\{\{[\w]+\}\}/g, '');

    return resultado;
  }

  /**
   * Obtiene las variables disponibles en una plantilla
   */
  extraerVariables(cuerpo: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(cuerpo)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  /**
   * Valida que todas las variables requeridas estén presentes
   */
  validarVariables(plantilla: PlantillaNotificacion, variables: Record<string, string>): string[] {
    const faltantes: string[] = [];

    for (const variable of plantilla.variables) {
      if (!variables[variable]) {
        faltantes.push(variable);
      }
    }

    return faltantes;
  }

  /**
   * Obtiene plantillas predefinidas del sistema
   */
  async inicializarPlantillasPorDefecto(): Promise<void> {
    const existentes = await this.listarPlantillas();
    if (existentes.length > 0) return;

    const plantillasPorDefecto: Omit<PlantillaNotificacion, 'id' | 'creadaEn'>[] = [
      {
        nombre: 'Confirmación de Horario',
        tipo: 'CONFIRMACION_HORARIO',
        canal: 'CORREO',
        asunto: 'Horario confirmado - {{periodo}}',
        cuerpo: `
          <h3>Horario Confirmado</h3>
          <p>Estimado/a {{nombreDocente}}:</p>
          <p>Su horario para el período <strong>{{periodo}}</strong> ha sido confirmado.</p>
          <p>Curso: <strong>{{curso}}</strong></p>
          <p>Horario: <strong>{{horario}}</strong></p>
          <p>Ambiente: <strong>{{ambiente}}</strong></p>
          <p>Saludos cordiales,</p>
          <p>Escuela de Ingeniería de Sistemas - UNT</p>
        `,
        variables: ['nombreDocente', 'periodo', 'curso', 'horario', 'ambiente'],
      },
      {
        nombre: 'Recordatorio de Ventana',
        tipo: 'VENTANA_ATENCION',
        canal: 'WHATSAPP',
        cuerpo: '📋 *Recordatorio*\n\nEstimado/a {{nombreDocente}},\n\nLe recordamos que la ventana de atención *{{ventana}}* está abierta.\n\nSu posición en la cola: {{posicion}}\n\n📅 Fecha: {{fecha}}',
        variables: ['nombreDocente', 'ventana', 'posicion', 'fecha'],
      },
      {
        nombre: 'Cambio de Horario',
        tipo: 'CAMBIO_HORARIO',
        canal: 'TELEGRAM',
        cuerpo: '<b>📋 Cambio de Horario</b>\n\nEstimado/a {{nombreDocente}},\n\nSu horario ha sido modificado:\n\nCurso: <b>{{curso}}</b>\nHorario anterior: {{horarioAnterior}}\nNuevo horario: <b>{{nuevoHorario}}</b>\n\nPor favor, verifique los cambios en el sistema.',
        variables: ['nombreDocente', 'curso', 'horarioAnterior', 'nuevoHorario'],
      },
    ];

    for (const plantilla of plantillasPorDefecto) {
      await this.crearPlantilla(plantilla);
    }
  }
}