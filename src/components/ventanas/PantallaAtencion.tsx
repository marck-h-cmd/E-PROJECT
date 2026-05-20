'use client';

import * as React from 'react';
import { PanelDocenteActual } from './PanelDocenteActual';
import { PanelLlamarSiguiente } from './PanelLlamarSiguiente';
import { ColaDocentes } from './ColaDocentes';
import { ControlVentana } from './ControlVentana';
import { NotificacionToast } from '@/components/ui/NotificacionToast';
import { 
  BookOpen, 
  Building2, 
  Users2, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Grid,
  LayoutList,
  AlertTriangle,
  MapPin
} from 'lucide-react';

interface Docente {
  id: string;
  nombre: string;
  email: string;
  categoria: string;
  horaLlegada: string;
  horaInicio?: string;
  tiempoTranscurrido?: number;
  prioridad?: 'normal' | 'alta' | 'urgente';
  departamento?: string;
  posicionCola?: number;
}

interface PantallaAtencionProps {
  ventanaId: string;
  className?: string;
  onVolver?: () => void;
}

const COLORES_CURSO = [
  { bg: 'bg-blue-100',   border: 'border-l-blue-500',   text: 'text-blue-900',   badge: 'bg-blue-500'   },
  { bg: 'bg-green-100',  border: 'border-l-green-500',  text: 'text-green-900',  badge: 'bg-green-500'  },
  { bg: 'bg-purple-100', border: 'border-l-purple-500', text: 'text-purple-900', badge: 'bg-purple-500' },
  { bg: 'bg-amber-100',  border: 'border-l-amber-500',  text: 'text-amber-900',  badge: 'bg-amber-500'  },
  { bg: 'bg-rose-100',   border: 'border-l-rose-500',   text: 'text-rose-900',   badge: 'bg-rose-500'   },
  { bg: 'bg-teal-100',   border: 'border-l-teal-500',   text: 'text-teal-900',   badge: 'bg-teal-500'   },
  { bg: 'bg-orange-100', border: 'border-l-orange-500', text: 'text-orange-900', badge: 'bg-orange-500' },
  { bg: 'bg-cyan-100',   border: 'border-l-cyan-500',   text: 'text-cyan-900',   badge: 'bg-cyan-500'   },
];

const getColorForCurso = (cursoId: string) => {
  let hash = 0;
  for (let i = 0; i < cursoId.length; i++) {
    hash = cursoId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORES_CURSO.length;
  return COLORES_CURSO[index];
};

export function PantallaAtencion({ ventanaId, className, onVolver }: PantallaAtencionProps) {
  // Estados de carga y ventana
  const [loading, setLoading] = React.useState(true);
  const [ventana, setVentana] = React.useState<any>(null);
  const [estadoVentana, setEstadoVentana] = React.useState<'inactiva' | 'activa' | 'pausada' | 'finalizada'>('inactiva');
  const [colaDocentes, setColaDocentes] = React.useState<any[]>([]);
  const [notificaciones, setNotificaciones] = React.useState<any[]>([]);
  const [tiempoAtencion, setTiempoAtencion] = React.useState(0);
  const [tiempoVentana, setTiempoVentana] = React.useState(0);
  
  // Docente en atención y su carga/horarios
  const [docenteActual, setDocenteActual] = React.useState<any>(null);
  const [atencionActualId, setAtencionActualId] = React.useState<string | null>(null);
  const [cursosCarga, setCursosCarga] = React.useState<any[]>([]);
  const [horariosBorrador, setHorariosBorrador] = React.useState<any[]>([]);
  const [allHorariosDocente, setAllHorariosDocente] = React.useState<any[]>([]);
  const [horariosAmbiente, setHorariosAmbiente] = React.useState<any[]>([]);
  
  // Opciones para combos
  const [ambientes, setAmbientes] = React.useState<any[]>([]);
  const [grupos, setGrupos] = React.useState<any[]>([]);

  // Tipo de vista del Workspace: 'calendario' (grilla) o 'tarjetas' (lista)
  const [vistaWorkspace, setVistaWorkspace] = React.useState<'calendario' | 'tarjetas'>('calendario');

  // Estado del formulario de programación
  const [formState, setFormState] = React.useState({
    id: '', // Vacío si es nuevo
    cursoId: '',
    grupoId: '',
    ambienteId: '',
    diaSemana: 'LUNES',
    horaInicio: '08:00',
    horaFin: '10:00'
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  const HORAS_NUM = Array.from({ length: 14 }, (_, i) => i + 7); // 7 to 20
  
  const HORAS = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const DIA_LABEL: Record<string, string> = {
    LUNES: 'LUNES',
    MARTES: 'MARTES',
    MIERCOLES: 'MIÉRCOLES',
    JUEVES: 'JUEVES',
    VIERNES: 'VIERNES',
  };

  // Fetch inicial
  const cargarDatosVentana = React.useCallback(async () => {
    try {
      // 1. Obtener ventana
      const resVentana = await fetch(`/api/ventanas-atencion/${ventanaId}`);
      if (!resVentana.ok) throw new Error('Error al cargar la ventana');
      const dataVentana = await resVentana.json();
      setVentana(dataVentana.data);
      
      // Mapear estado
      const est = dataVentana.data.estado;
      if (est === 'PROGRAMADA') setEstadoVentana('inactiva');
      else if (est === 'ABIERTA' || est === 'EN_CURSO') setEstadoVentana('activa');
      else if (est === 'CERRADA') setEstadoVentana('finalizada');
      else if (est === 'CANCELADA') setEstadoVentana('finalizada');

      // 2. Obtener cola
      const resCola = await fetch(`/api/ventanas-atencion/${ventanaId}/cola`);
      if (resCola.ok) {
        const dataCola = await resCola.json();
        setColaDocentes(dataCola.data.cola || []);
        
        // Buscar si hay alguien en atención
        const enAtencion = dataCola.data.cola.find((a: any) => a.estado === 'EN_ATENCION');
        if (enAtencion) {
          setDocenteActual(enAtencion.docente);
          setAtencionActualId(enAtencion.id);
          
          // Calcular tiempo transcurrido desde horaInicio si existe
          if (enAtencion.horaInicio) {
            const diff = Math.floor((new Date().getTime() - new Date(enAtencion.horaInicio).getTime()) / 1000);
            setTiempoAtencion(diff > 0 ? diff : 0);
          }
        } else {
          setDocenteActual(null);
          setAtencionActualId(null);
          setTiempoAtencion(0);
        }
      }

      // 3. Obtener notificaciones de ausencias justificadas
      const resNotifs = await fetch('/api/notificaciones?tipo=SISTEMA&limit=50');
      if (resNotifs.ok) {
        const dataNotifs = await resNotifs.json();
        setNotificaciones(dataNotifs.data || []);
      }

      // 4. Obtener ambientes activos
      const resAmbientes = await fetch('/api/ambientes?limit=100&activo=true');
      if (resAmbientes.ok) {
        const dataAmbientes = await resAmbientes.json();
        setAmbientes(dataAmbientes.data || []);
      }

    } catch (err) {
      console.error(err);
      NotificacionToast.error('No se pudieron cargar los datos de la ventana');
    } finally {
      setLoading(false);
    }
  }, [ventanaId]);

  // Cargar cursos del docente en atención
  React.useEffect(() => {
    if (!docenteActual) {
      setCursosCarga([]);
      setHorariosBorrador([]);
      setAllHorariosDocente([]);
      return;
    }

    const cargarCargaYHorarios = async () => {
      try {
        // Cargar cursos asignados (carga académica)
        const resCursos = await fetch(`/api/carga-academica?docenteId=${docenteActual.id}`);
        if (resCursos.ok) {
          const dataCursos = await resCursos.json();
          setCursosCarga(dataCursos.data || []);
        }

        // Cargar todos los horarios del docente en el periodo
        const resHorarios = await fetch(`/api/horarios?docenteId=${docenteActual.id}&periodoId=${ventana?.periodoId}&limit=100`);
        if (resHorarios.ok) {
          const dataHorarios = await resHorarios.json();
          const items = dataHorarios.data || [];
          setAllHorariosDocente(items);
          // Filtrar por estado BORRADOR
          const borradors = items.filter((h: any) => h.estado === 'BORRADOR');
          setHorariosBorrador(borradors);
        }
      } catch (err) {
        console.error(err);
      }
    };

    cargarCargaYHorarios();
  }, [docenteActual, ventana?.periodoId]);

  // Cargar horarios del ambiente seleccionado para control en vivo de cruces
  React.useEffect(() => {
    if (!formState.ambienteId || !ventana?.periodoId) {
      setHorariosAmbiente([]);
      return;
    }

    const cargarHorariosAmbiente = async () => {
      try {
        const res = await fetch(`/api/horarios?ambienteId=${formState.ambienteId}&periodoId=${ventana.periodoId}&limit=100`);
        if (res.ok) {
          const json = await res.json();
          setHorariosAmbiente(json.data || []);
        }
      } catch (e) {
        console.error(e);
      }
    };

    cargarHorariosAmbiente();
  }, [formState.ambienteId, ventana?.periodoId]);

  // Cargar grupos cuando cambia el curso seleccionado en el formulario
  React.useEffect(() => {
    if (!formState.cursoId) {
      setGrupos([]);
      return;
    }

    const cargarGrupos = async () => {
      try {
        const resGrupos = await fetch(`/api/grupos?cursoId=${formState.cursoId}&activo=true&limit=100`);
        if (resGrupos.ok) {
          const dataGrupos = await resGrupos.json();
          setGrupos(dataGrupos.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    cargarGrupos();
  }, [formState.cursoId]);

  React.useEffect(() => {
    cargarDatosVentana();
  }, [cargarDatosVentana]);

  // Temporizadores
  React.useEffect(() => {
    if (!docenteActual || estadoVentana !== 'activa') return;
    const intervalo = setInterval(() => setTiempoAtencion(prev => prev + 1), 1000);
    return () => clearInterval(intervalo);
  }, [docenteActual, estadoVentana]);

  React.useEffect(() => {
    if (estadoVentana !== 'activa') return;
    const intervalo = setInterval(() => setTiempoVentana(prev => prev + 1), 1000);
    return () => clearInterval(intervalo);
  }, [estadoVentana]);

  // Acciones de ventana
  const handleIniciarVentana = async () => {
    try {
      const res = await fetch(`/api/ventanas-atencion/${ventanaId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'abrir' })
      });
      if (res.ok) {
        setEstadoVentana('activa');
        NotificacionToast.exito('Ventana de atención iniciada correctamente');
        cargarDatosVentana();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al iniciar la ventana');
      }
    } catch (err: any) {
      NotificacionToast.error(err.message);
    }
  };

  const handlePausarVentana = () => {
    setEstadoVentana('pausada');
    NotificacionToast.info('Ventana pausada');
  };

  const handleReanudarVentana = () => {
    setEstadoVentana('activa');
    NotificacionToast.info('Ventana reanudada');
  };

  const handleFinalizarVentana = async () => {
    try {
      const res = await fetch(`/api/ventanas-atencion/${ventanaId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'cerrar' })
      });
      if (res.ok) {
        setEstadoVentana('finalizada');
        NotificacionToast.exito('Ventana finalizada');
        cargarDatosVentana();
      } else {
        throw new Error('Error al finalizar ventana');
      }
    } catch (err: any) {
      NotificacionToast.error(err.message);
    }
  };

  // Llamar al siguiente docente
  const handleLlamarDocente = async () => {
    try {
      const res = await fetch(`/api/ventanas-atencion/${ventanaId}/llamar-siguiente`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        if (data.data.ventanaCerrada) {
          NotificacionToast.info(data.data.mensaje);
          setEstadoVentana('finalizada');
        } else {
          NotificacionToast.exito(`Docente llamado: ${data.data.atencion.docente.usuario.nombre}`);
        }
        cargarDatosVentana();
      } else {
        throw new Error(data.message || 'Error al llamar siguiente docente');
      }
    } catch (err: any) {
      NotificacionToast.error(err.message);
    }
  };

  // Marcar docente ausente
  const handleCancelarAtencion = async () => {
    if (!atencionActualId) return;
    try {
      const res = await fetch(`/api/ventanas-atencion/${ventanaId}/marcar-ausente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atencionId: atencionActualId })
      });
      if (res.ok) {
        NotificacionToast.advertencia('Atención marcada como AUSENTE');
        setDocenteActual(null);
        setAtencionActualId(null);
        setTiempoAtencion(0);
        cargarDatosVentana();
      } else {
        throw new Error('Error al marcar docente como ausente');
      }
    } catch (err: any) {
      NotificacionToast.error(err.message);
    }
  };

  // Finalizar atención de docente
  const handleFinalizarAtencion = async () => {
    if (!atencionActualId) return;
    try {
      const res = await fetch(`/api/ventanas-atencion/${ventanaId}/finalizar-atencion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atencionId: atencionActualId })
      });
      if (res.ok) {
        NotificacionToast.exito('Atención de docente finalizada correctamente');
        setDocenteActual(null);
        setAtencionActualId(null);
        setTiempoAtencion(0);
        cargarDatosVentana();
      } else {
        throw new Error('Error al finalizar atención');
      }
    } catch (err: any) {
      NotificacionToast.error(err.message);
    }
  };

  // Guardar (Crear o Editar) bloque horario
  const handleGuardarBloque = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const { id, cursoId, grupoId, ambienteId, diaSemana, horaInicio, horaFin } = formState;

    if (!cursoId || !ambienteId || !diaSemana || !horaInicio || !horaFin) {
      setFormError('Por favor complete todos los campos obligatorios.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        periodoId: ventana.periodoId,
        cursoId,
        docenteId: docenteActual.id,
        ambienteId,
        diaSemana,
        horaInicio,
        horaFin
      };

      if (grupoId) payload.grupoId = grupoId;

      let res;
      if (isEditing && id) {
        res = await fetch(`/api/horarios/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/horarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();

      if (res.ok) {
        NotificacionToast.exito(isEditing ? 'Bloque horario actualizado' : 'Bloque horario registrado exitosamente');
        
        // Reset form
        setFormState({
          id: '',
          cursoId: '',
          grupoId: '',
          ambienteId: '',
          diaSemana: 'LUNES',
          horaInicio: '08:00',
          horaFin: '10:00'
        });
        setIsEditing(false);
        
        // Recargar horarios del docente
        const resHorarios = await fetch(`/api/horarios?docenteId=${docenteActual.id}&periodoId=${ventana.periodoId}&limit=100`);
        if (resHorarios.ok) {
          const dataHorarios = await resHorarios.json();
          const items = dataHorarios.data || [];
          setAllHorariosDocente(items);
          const borradors = items.filter((h: any) => h.estado === 'BORRADOR');
          setHorariosBorrador(borradors);
        }
      } else {
        setFormError(data.message || 'Error al validar o registrar horario');
      }
    } catch (err: any) {
      setFormError('Error de red al registrar horario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cargar bloque para edición
  const handleEditarBloque = (bloque: any) => {
    setFormState({
      id: bloque.id,
      cursoId: bloque.cursoId,
      grupoId: bloque.grupoId || '',
      ambienteId: bloque.ambienteId,
      diaSemana: bloque.diaSemana,
      horaInicio: bloque.horaInicio,
      horaFin: bloque.horaFin
    });
    setIsEditing(true);
    setFormError(null);
  };

  // Eliminar bloque horario
  const handleEliminarBloque = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este bloque horario del borrador?')) return;
    try {
      const res = await fetch(`/api/horarios/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        NotificacionToast.exito('Bloque horario eliminado');
        setHorariosBorrador(prev => prev.filter(h => h.id !== id));
        setAllHorariosDocente(prev => prev.filter(h => h.id !== id));
        if (formState.id === id) {
          setFormState({
            id: '',
            cursoId: '',
            grupoId: '',
            ambienteId: '',
            diaSemana: 'LUNES',
            horaInicio: '08:00',
            horaFin: '10:00'
          });
          setIsEditing(false);
        }
      } else {
        throw new Error('No se pudo eliminar el bloque horario');
      }
    } catch (err: any) {
      NotificacionToast.error(err.message);
    }
  };

  // Confirmar Selección de Horarios
  const handleConfirmarSeleccion = async () => {
    if (!docenteActual || !ventana) return;
    try {
      const res = await fetch(`/api/ventanas-atencion/${ventanaId}/confirmar-horarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docenteId: docenteActual.id,
          periodoId: ventana.periodoId
        })
      });
      const data = await res.json();
      if (res.ok) {
        NotificacionToast.exito('Horarios confirmados y notificaciones enviadas correctamente');
        // Finalizar la atención en el backend
        await handleFinalizarAtencion();
      } else {
        throw new Error(data.message || 'Error al confirmar selección');
      }
    } catch (err: any) {
      NotificacionToast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // Validador Dinámico / En Vivo
  // -------------------------------------------------------------
  const validacionEnVivo = React.useMemo(() => {
    const { id, cursoId, ambienteId, diaSemana, horaInicio, horaFin } = formState;
    
    if (!cursoId || !ambienteId || !diaSemana || !horaInicio || !horaFin) {
      return {
        listo: false,
        docenteOk: true,
        ambienteOk: true,
        horasOk: true,
        rangoOk: true,
        mensajeDocente: 'Complete los campos para validar la disponibilidad del docente.',
        mensajeAmbiente: 'Complete los campos para validar la disponibilidad del aula.',
        mensajeHoras: 'Seleccione un curso para verificar las horas asignadas.',
        mensajeRango: 'Defina un rango de horas válido.',
      };
    }

    const startHour = parseInt(horaInicio.split(':')[0], 10);
    const endHour = parseInt(horaFin.split(':')[0], 10);
    const duracion = endHour - startHour;

    // 1. Validar rango
    const rangoOk = duracion > 0 && startHour >= 7 && endHour <= 21;
    const mensajeRango = rangoOk 
      ? `Horario válido (${duracion} horas)` 
      : 'La hora de fin debe ser posterior a la de inicio (rango permitido de 7am a 9pm)';

    // 2. Validar cruce de Docente
    const cruceDoc = allHorariosDocente.find((h: any) => {
      if (id && h.id === id) return false;
      if (h.diaSemana !== diaSemana) return false;
      if (h.estado === 'CANCELADO') return false;
      const hInicio = parseInt(h.horaInicio.split(':')[0], 10);
      const hFin = parseInt(h.horaFin.split(':')[0], 10);
      return Math.max(hInicio, startHour) < Math.min(hFin, endHour);
    });
    const docenteOk = !cruceDoc;
    const mensajeDocente = docenteOk 
      ? 'Docente libre en este horario'
      : `El docente ya tiene asignado ${cruceDoc.curso.codigo} (${cruceDoc.horaInicio} - ${cruceDoc.horaFin})`;

    // 3. Validar cruce de Ambiente
    const cruceAmb = horariosAmbiente.find((h: any) => {
      if (id && h.id === id) return false;
      if (h.diaSemana !== diaSemana) return false;
      if (h.estado === 'CANCELADO') return false;
      const hInicio = parseInt(h.horaInicio.split(':')[0], 10);
      const hFin = parseInt(h.horaFin.split(':')[0], 10);
      return Math.max(hInicio, startHour) < Math.min(hFin, endHour);
    });
    const ambienteOk = !cruceAmb;
    const mensajeAmbiente = ambienteOk
      ? 'Ambiente libre en este horario'
      : `El ambiente ya está ocupado por ${cruceAmb.curso.codigo} (${cruceAmb.horaInicio} - ${cruceAmb.horaFin})`;

    // 4. Validar límite de horas del curso
    const cursoCarga = cursosCarga.find(item => item.curso.id === cursoId);
    const horasAsignadas = cursoCarga?.horasAsignadas || 0;
    
    const horasProgramadas = allHorariosDocente
      .filter((h: any) => h.cursoId === cursoId && h.estado !== 'CANCELADO' && (!id || h.id !== id))
      .reduce((sum: number, h: any) => {
        const hInicio = parseInt(h.horaInicio.split(':')[0], 10);
        const hFin = parseInt(h.horaFin.split(':')[0], 10);
        return sum + (hFin - hInicio);
      }, 0);

    const totalConNuevo = horasProgramadas + (rangoOk ? duracion : 0);
    const horasOk = totalConNuevo <= horasAsignadas;
    const mensajeHoras = horasOk
      ? `Carga horaria correcta (${horasProgramadas + duracion}h de ${horasAsignadas}h asignadas)`
      : `Se superaría el límite de horas asignadas (${totalConNuevo}h de ${horasAsignadas}h asignadas)`;

    return {
      listo: true,
      docenteOk,
      ambienteOk,
      horasOk,
      rangoOk,
      mensajeDocente,
      mensajeAmbiente,
      mensajeHoras,
      mensajeRango,
    };
  }, [formState, allHorariosDocente, horariosAmbiente, cursosCarga]);

  // Horas por día reales para el footer de la grilla
  const getHorasDia = (dia: string) => {
    return allHorariosDocente
      .filter((h: any) => h.diaSemana === dia && h.estado !== 'CANCELADO')
      .reduce((sum: number, h: any) => {
        const inicio = parseInt(h.horaInicio.split(':')[0], 10);
        const fin = parseInt(h.horaFin.split(':')[0], 10);
        return sum + (fin - inicio);
      }, 0);
  };

  // Horas totales semanales asignadas en borrador
  const totalHorasSemana = React.useMemo(() => {
    return allHorariosDocente
      .filter((h: any) => h.estado !== 'CANCELADO')
      .reduce((sum: number, h: any) => {
        const inicio = parseInt(h.horaInicio.split(':')[0], 10);
        const fin = parseInt(h.horaFin.split(':')[0], 10);
        return sum + (fin - inicio);
      }, 0);
  }, [allHorariosDocente]);

  // Cursos únicos para mostrar en la leyenda
  const cursosUnicos = React.useMemo(() => {
    const map = new Map<string, { codigo: string; nombre: string }>();
    allHorariosDocente.forEach((h: any) => {
      if (h.estado !== 'CANCELADO') {
        map.set(h.curso.codigo, { codigo: h.curso.codigo, nombre: h.curso.nombre });
      }
    });
    return Array.from(map.values());
  }, [allHorariosDocente]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Mapeos para los subcomponentes
  const siguienteDocente = colaDocentes.find((a: any) => a.estado === 'ESPERANDO');
  
  const docenteActualAdaptado = docenteActual ? {
    id: docenteActual.id,
    nombre: `${docenteActual.usuario.nombre} ${docenteActual.usuario.apellidos}`,
    email: docenteActual.usuario.email,
    categoria: docenteActual.categoria,
    horaInicio: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }), 
    tiempoTranscurrido: tiempoAtencion,
  } : null;

  const siguienteDocenteAdaptado = siguienteDocente ? {
    id: siguienteDocente.docente.id,
    nombre: `${siguienteDocente.docente.usuario.nombre} ${siguienteDocente.docente.usuario.apellidos}`,
    email: siguienteDocente.docente.usuario.email,
    categoria: siguienteDocente.docente.categoria,
    horaLlegada: 'En cola', 
    posicionCola: siguienteDocente.posicion,
  } : null;

  const docentesColaMapeado = colaDocentes.map((a: any) => {
    const justificacion = notificaciones.find((n: any) => 
      n.metadata?.atencionId === a.id && n.metadata?.ventanaId === ventanaId
    );
    return {
      id: a.docente.id,
      atencionId: a.id,
      nombre: `${a.docente.usuario.nombre} ${a.docente.usuario.apellidos}`,
      email: a.docente.usuario.email,
      categoria: a.docente.categoria,
      horaLlegada: a.horaLlegada ? new Date(a.horaLlegada).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : 'En espera',
      prioridad: 'normal' as const,
      estado: a.estado,
      observaciones: justificacion?.metadata || null,
      justificacionConfirmada: justificacion?.estado === 'LEIDA',
      fechaIngreso: a.docente.fechaIngreso,
    };
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Botón Volver y Info de Ventana */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{ventana?.nombre}</h1>
            <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2 py-1 rounded">
              Categoría: {ventana?.categoria}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Periodo Académico: <span className="font-semibold text-gray-700">{ventana?.periodo?.nombre}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onVolver && (
            <button
              onClick={onVolver}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-600 transition-colors"
            >
              Volver a la Lista
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats de Cola */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Users2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total en Cola</p>
            <p className="text-lg font-bold text-gray-900">{colaDocentes.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">En Espera</p>
            <p className="text-lg font-bold text-gray-900">
              {colaDocentes.filter(a => a.estado === 'ESPERANDO').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <div className="p-2 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Atendidos</p>
            <p className="text-lg font-bold text-gray-900">
              {colaDocentes.filter(a => a.estado === 'ATENDIDO').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Ausentes</p>
            <p className="text-lg font-bold text-gray-900">
              {colaDocentes.filter(a => a.estado === 'AUSENTE').length}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de 3 columnas de control y cola */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ControlVentana
          estado={estadoVentana}
          tiempoTranscurrido={tiempoVentana}
          onIniciar={handleIniciarVentana}
          onPausar={handlePausarVentana}
          onReanudar={handleReanudarVentana}
          onFinalizar={handleFinalizarVentana}
        />

        <div className="space-y-6">
          <PanelDocenteActual
            docente={docenteActualAdaptado}
            onFinalizar={handleConfirmarSeleccion} 
            onCancelar={handleCancelarAtencion}
          />
          {estadoVentana === 'activa' && !docenteActual && (
            <PanelLlamarSiguiente
              docenteSiguiente={siguienteDocenteAdaptado}
              onLlamar={handleLlamarDocente}
            />
          )}
        </div>

        <ColaDocentes 
          docentes={docentesColaMapeado} 
          ventanaId={ventanaId}
          onJustificacionConfirmada={() => cargarDatosVentana()}
        />
      </div>

      {/* WORKSPACE: Selección de Horarios para el Docente en Atención */}
      {docenteActual && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mt-8">
          <div className="border-b bg-gray-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary-600" />
                Workspace de Programación: {docenteActual.usuario.nombre} {docenteActual.usuario.apellidos}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Asignación de asignaturas, grupos y ambientes en borrador para confirmación.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Toggle de Vista */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setVistaWorkspace('calendario')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    vistaWorkspace === 'calendario'
                      ? 'bg-white shadow text-[#1a365d]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" />
                  Calendario
                </button>
                <button
                  type="button"
                  onClick={() => setVistaWorkspace('tarjetas')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    vistaWorkspace === 'tarjetas'
                      ? 'bg-white shadow text-[#1a365d]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutList className="h-3.5 w-3.5" />
                  Tarjetas
                </button>
              </div>

              <button
                onClick={handleConfirmarSeleccion}
                disabled={horariosBorrador.length === 0}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmar Selección ({horariosBorrador.length} bloques)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
            {/* Formulario de Asignación (Cols 4) */}
            <div className="lg:col-span-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {isEditing ? 'Editar Bloque Horario' : 'Nuevo Bloque Horario'}
              </h3>

              <form onSubmit={handleGuardarBloque} className="space-y-4">
                {/* Seleccionar Curso */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Asignatura / Curso *
                  </label>
                  <select
                    value={formState.cursoId}
                    onChange={(e) => setFormState({ ...formState, cursoId: e.target.value, grupoId: '' })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar curso...</option>
                    {cursosCarga.map((item) => {
                      // Calcular horas programadas
                      const horasProgramadas = allHorariosDocente
                        .filter((h: any) => h.cursoId === item.curso.id && h.estado !== 'CANCELADO' && (!formState.id || h.id !== formState.id))
                        .reduce((sum: number, h: any) => {
                          const hInicio = parseInt(h.horaInicio.split(':')[0], 10);
                          const hFin = parseInt(h.horaFin.split(':')[0], 10);
                          return sum + (hFin - hInicio);
                        }, 0);
                      const disponible = item.horasAsignadas - horasProgramadas;

                      return (
                        <option key={item.curso.id} value={item.curso.id}>
                          {item.curso.codigo} - {item.curso.nombre} (Disponibles: {disponible}h de {item.horasAsignadas}h)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Seleccionar Grupo */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Grupo / Sección
                  </label>
                  <select
                    value={formState.grupoId}
                    onChange={(e) => setFormState({ ...formState, grupoId: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent disabled:opacity-50"
                    disabled={!formState.cursoId}
                  >
                    <option value="">Seleccionar grupo (opcional)...</option>
                    {grupos.map((grupo) => (
                      <option key={grupo.id} value={grupo.id}>
                        Grupo {grupo.nombre} (Cap: {grupo.capacidad})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seleccionar Ambiente */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ambiente / Aula / Laboratorio *
                  </label>
                  <select
                    value={formState.ambienteId}
                    onChange={(e) => setFormState({ ...formState, ambienteId: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar ambiente...</option>
                    {ambientes.map((amb) => (
                      <option key={amb.id} value={amb.id}>
                        [{amb.tipo}] {amb.codigo} - {amb.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seleccionar Día */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Día de la Semana *
                  </label>
                  <select
                    value={formState.diaSemana}
                    onChange={(e) => setFormState({ ...formState, diaSemana: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                    required
                  >
                    {DIAS.map((dia) => (
                      <option key={dia} value={dia}>
                        {DIA_LABEL[dia]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Horas Inicio y Fin */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Hora Inicio *
                    </label>
                    <select
                      value={formState.horaInicio}
                      onChange={(e) => setFormState({ ...formState, horaInicio: e.target.value })}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                      required
                    >
                      {HORAS.slice(0, -1).map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Hora Fin *
                    </label>
                    <select
                      value={formState.horaFin}
                      onChange={(e) => setFormState({ ...formState, horaFin: e.target.value })}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                      required
                    >
                      {HORAS.slice(1).map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* VALIDADOR DINÁMICO EN VIVO */}
                {formState.cursoId && formState.ambienteId && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
                      Estado de Validación en Vivo:
                    </h4>
                    
                    <div className="space-y-2 text-xs">
                      {/* Rango de Horas */}
                      <div className="flex items-start gap-2">
                        {validacionEnVivo.rangoOk ? (
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-semibold ${validacionEnVivo.rangoOk ? 'text-green-800' : 'text-red-700'}`}>
                            Rango Horario
                          </p>
                          <p className="text-[10px] text-slate-500">{validacionEnVivo.mensajeRango}</p>
                        </div>
                      </div>

                      {/* Disponibilidad Docente */}
                      <div className="flex items-start gap-2 border-t pt-2 border-slate-100">
                        {validacionEnVivo.docenteOk ? (
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-semibold ${validacionEnVivo.docenteOk ? 'text-green-800' : 'text-red-700'}`}>
                            Disponibilidad del Docente
                          </p>
                          <p className="text-[10px] text-slate-500">{validacionEnVivo.mensajeDocente}</p>
                        </div>
                      </div>

                      {/* Disponibilidad Ambiente */}
                      <div className="flex items-start gap-2 border-t pt-2 border-slate-100">
                        {validacionEnVivo.ambienteOk ? (
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-semibold ${validacionEnVivo.ambienteOk ? 'text-green-800' : 'text-red-700'}`}>
                            Disponibilidad del Ambiente
                          </p>
                          <p className="text-[10px] text-slate-500">{validacionEnVivo.mensajeAmbiente}</p>
                        </div>
                      </div>

                      {/* Horas del Curso */}
                      <div className="flex items-start gap-2 border-t pt-2 border-slate-100">
                        {validacionEnVivo.horasOk ? (
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-semibold ${validacionEnVivo.horasOk ? 'text-green-800' : 'text-red-700'}`}>
                            Límite de Horas Curso
                          </p>
                          <p className="text-[10px] text-slate-500">{validacionEnVivo.mensajeHoras}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormState({
                          id: '',
                          cursoId: '',
                          grupoId: '',
                          ambienteId: '',
                          diaSemana: 'LUNES',
                          horaInicio: '08:00',
                          horaFin: '10:00'
                        });
                        setFormError(null);
                      }}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || (formState.cursoId !== '' && formState.ambienteId !== '' && (!validacionEnVivo.docenteOk || !validacionEnVivo.ambienteOk || !validacionEnVivo.horasOk || !validacionEnVivo.rangoOk))}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1a365d] hover:bg-[#254d84] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    ) : isEditing ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {isEditing ? 'Actualizar' : 'Agregar'}
                  </button>
                </div>
              </form>
            </div>

            {/* Calendario / Lista de Horarios Programados en Borrador (Cols 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* LEYENDA */}
              {cursosUnicos.length > 0 && (
                <div className="flex flex-wrap gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 items-center">
                  <div className="flex items-center gap-1.5 mr-2 shrink-0">
                     <BookOpen className="w-4 h-4 text-slate-400" />
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asignaturas:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cursosUnicos.map(c => {
                      const col = getColorForCurso(c.codigo);
                      return (
                        <div key={c.codigo} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                          <span className={`w-2 h-2 rounded-full ${col.badge}`}></span>
                          <span><strong className="text-slate-900">{c.codigo}</strong>: {c.nombre}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {vistaWorkspace === 'tarjetas' ? (
                /* ================= VISTA TARJETAS ================= */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Horarios Programados en Borrador
                    </h3>
                    <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Semana: {totalHorasSemana}h registradas
                    </span>
                  </div>

                  {horariosBorrador.length === 0 ? (
                    <div className="border border-dashed rounded-xl p-12 text-center text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-30 text-primary-600" />
                      <p className="font-semibold text-sm">No hay bloques de horario en borrador</p>
                      <p className="text-xs text-gray-400 mt-1">Usa el formulario de la izquierda para registrar el primer bloque.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {horariosBorrador.map((bloque) => {
                        const col = getColorForCurso(bloque.curso.codigo);
                        return (
                          <div
                            key={bloque.id}
                            className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4 border-l-4 ${col.border}`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white shadow-sm ${col.badge}`}>
                                  {bloque.curso.codigo}
                                </span>
                                <span className="font-bold text-sm text-gray-900">
                                  {bloque.curso.nombre}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs text-gray-600 mt-2">
                                <div className="flex items-center gap-1">
                                  <Users2 className="h-3.5 w-3.5 text-gray-400" />
                                  <span>Grupo: {bloque.grupo?.nombre || 'General'}</span>
                                </div>
                                <div className="flex items-center gap-1 col-span-2">
                                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="truncate">Ambiente: {bloque.ambiente.codigo} - {bloque.ambiente.nombre}</span>
                                </div>
                                <div className="flex items-center gap-1 font-semibold text-[#1a365d]">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>
                                    {bloque.diaSemana.charAt(0) + bloque.diaSemana.slice(1).toLowerCase()} {bloque.horaInicio} - {bloque.horaFin}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border">
                              <button
                                onClick={() => handleEditarBloque(bloque)}
                                className="p-2 text-slate-500 hover:text-[#1a365d] hover:bg-white rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleEliminarBloque(bloque.id)}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* ================= VISTA CALENDARIO GRID ================= */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Cuadrícula Horaria del Docente (Borrador + Confirmados)
                    </h3>
                    <span className="bg-[#1a365d] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      Total Semana: {totalHorasSemana}h
                    </span>
                  </div>

                  <div className="shadow-lg rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse min-w-[800px] table-fixed">
                        <thead className="bg-[#1a365d] text-white">
                          <tr>
                            <th className="py-3 px-3 text-center font-semibold w-20 border-b border-slate-700">HORA</th>
                            {DIAS.map(d => (
                              <th key={d} className="py-3 px-2 text-center font-bold tracking-wider border-b border-slate-700">
                                {DIA_LABEL[d]}
                              </th>
                            ))}
                            <th className="py-3 px-3 text-center font-semibold w-20 border-b border-slate-700">HORA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {HORAS_NUM.map((horaNum, rowIndex) => {
                            // Verificar si esta hora está cubierta por un rowSpan de arriba
                            const isCoveredByRowspan = allHorariosDocente.some(h => {
                              if (h.estado === 'CANCELADO') return false;
                              const inicio = parseInt(h.horaInicio.split(':')[0], 10);
                              const fin = parseInt(h.horaFin.split(':')[0], 10);
                              // Esta hora está en MEDIO de una clase (no es el inicio)
                              return inicio < horaNum && fin > horaNum;
                            });

                            // Calcular rowSpan de la celda HORA basado en clase que empieza aquí
                            const classStartingHere = allHorariosDocente.find(h => {
                              if (h.estado === 'CANCELADO') return false;
                              return parseInt(h.horaInicio.split(':')[0], 10) === horaNum;
                            });

                            const horaRowSpan = classStartingHere
                              ? parseInt(classStartingHere.horaFin.split(':')[0], 10) - horaNum
                              : 1;

                            return (
                              <tr 
                                key={horaNum} 
                                className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/30"}
                              >
                                {/* HORA Izquierda - solo si no está cubierta por rowSpan */}
                                {!isCoveredByRowspan && (
                                  <td 
                                    rowSpan={horaRowSpan} 
                                    className="py-2.5 px-2 text-center border-r border-slate-200 bg-slate-100 text-slate-500 font-mono text-xs whitespace-nowrap"
                                  >
                                    {`${horaNum.toString().padStart(2, '0')}:00`}
                                    {horaRowSpan > 1 && (
                                      <>
                                        <br/>
                                        <span className="text-[10px] opacity-70">
                                          {`${(horaNum + horaRowSpan).toString().padStart(2, '0')}:00`}
                                        </span>
                                      </>
                                    )}
                                  </td>
                                )}

                                {/* Días Semanales */}
                                {DIAS.map(dia => {
                                  // Verificar si está cubierto
                                  const isCovered = allHorariosDocente.some(h => {
                                    if (h.diaSemana !== dia) return false;
                                    if (h.estado === 'CANCELADO') return false;
                                    const inicio = parseInt(h.horaInicio.split(':')[0], 10);
                                    const fin = parseInt(h.horaFin.split(':')[0], 10);
                                    return inicio < horaNum && fin > horaNum;
                                  });

                                  if (isCovered) return null;

                                  // Clases que inician a esta hora
                                  const startingClasses = allHorariosDocente.filter(h => {
                                    if (h.diaSemana !== dia) return false;
                                    if (h.estado === 'CANCELADO') return false;
                                    const inicio = parseInt(h.horaInicio.split(':')[0], 10);
                                    return inicio === horaNum;
                                  });

                                  if (startingClasses.length > 0) {
                                    const maxDuration = Math.max(...startingClasses.map(h => {
                                      const inicio = parseInt(h.horaInicio.split(':')[0], 10);
                                      const fin = parseInt(h.horaFin.split(':')[0], 10);
                                      return fin - inicio;
                                    }), 1);

                                    return (
                                      <td 
                                        key={`${dia}-${horaNum}`} 
                                        rowSpan={maxDuration}
                                        className="p-0 border-r border-b border-slate-200 align-top relative"
                                      >
                                        <div className="flex flex-col h-full w-full">
                                          {startingClasses.map(h => {
                                            const col = getColorForCurso(h.curso.codigo);
                                            const esLab = h.ambiente.codigo.toUpperCase().includes('LAB') || h.ambiente.tipo === 'LABORATORIO';
                                            const isBorrador = h.estado === 'BORRADOR';

                                            return (
                                              <div 
                                                key={h.id}
                                                className={`relative flex flex-col p-2.5 h-full w-full border-l-4 transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer flex-1 ${col.bg} ${col.border} ${col.text}`}
                                              >
                                                <div className="flex justify-between items-start gap-1 mb-1.5">
                                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-sm shrink-0 ${col.badge}`}>
                                                    {esLab ? 'LAB' : 'TEORÍA'}
                                                  </span>
                                                  <span className="text-[9px] font-mono font-semibold whitespace-nowrap bg-white/40 px-1 rounded">
                                                    {h.horaInicio} - {h.horaFin}
                                                  </span>
                                                </div>

                                                <div className="font-bold text-xs leading-none mb-0.5">{h.curso.codigo}</div>
                                                <div className="text-[10px] leading-tight line-clamp-1 opacity-95 mb-1.5" title={h.curso.nombre}>
                                                  {h.curso.nombre}
                                                </div>

                                                <div className="mt-auto flex flex-col gap-0.5 text-[9px] opacity-85 font-medium pt-1.5 border-t border-black/5">
                                                  <div className="flex items-center gap-1">
                                                    <Users2 className="w-3 h-3 text-slate-400 shrink-0" />
                                                    <span>{h.grupo?.nombre ? `Gr. ${h.grupo.nombre}` : 'Sin Gr.'}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                                    <span className="truncate">{h.ambiente.codigo}</span>
                                                  </div>
                                                </div>

                                                {/* Controles de Edición en el Bloque (Sólo si está en Borrador) */}
                                                {isBorrador && (
                                                  <div className="absolute top-1.5 right-1.5 flex items-center bg-white/70 p-0.5 rounded shadow-sm opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditarBloque(h);
                                                      }}
                                                      title="Editar"
                                                      className="p-0.5 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                                                    >
                                                      <Edit2 className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEliminarBloque(h.id);
                                                      }}
                                                      title="Eliminar"
                                                      className="p-0.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                                                    >
                                                      <Trash2 className="w-3 h-3" />
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </td>
                                    );
                                  }

                                  return (
                                    <td 
                                      key={`${dia}-${horaNum}`} 
                                      className="p-0 border-r border-b border-slate-200 align-top transition-colors bg-white hover:bg-slate-50/50 min-h-[50px]"
                                    />
                                  );
                                })}

                                {/* HORA Derecha - solo si no está cubierta por rowSpan */}
                                {!isCoveredByRowspan && (
                                  <td 
                                    rowSpan={horaRowSpan} 
                                    className="py-2.5 px-2 text-center border-l border-slate-200 bg-slate-100 text-slate-500 font-mono text-xs whitespace-nowrap"
                                  >
                                    {`${horaNum.toString().padStart(2, '0')}:00`}
                                    {horaRowSpan > 1 && (
                                      <>
                                        <br/>
                                        <span className="text-[10px] opacity-70">
                                          {`${(horaNum + horaRowSpan).toString().padStart(2, '0')}:00`}
                                        </span>
                                      </>
                                    )}
                                  </td>
                                )}
                              </tr>
                            );
                          })}

                          {/* FILA DE TOTALES POR DÍA */}
                          <tr className="bg-slate-800 text-white font-bold text-xs uppercase">
                            <td className="py-3 px-2 text-center border-r border-slate-700">TOTAL</td>
                            {DIAS.map(dia => (
                              <td key={dia} className="py-3 px-2 text-center border-r border-slate-700">
                                {getHorasDia(dia)}h
                              </td>
                            ))}
                            <td className="py-3 px-2 text-center">TOTAL</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}