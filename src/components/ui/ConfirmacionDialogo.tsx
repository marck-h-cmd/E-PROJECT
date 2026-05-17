'use client';

import * as React from 'react';
import { ModalConfirmacion } from './ModalConfirmacion';

type TipoConfirmacion = 'info' | 'warning' | 'success' | 'danger';

interface OpcionesConfirmacion {
  titulo: string;
  mensaje: string;
  tipo?: TipoConfirmacion;
  textoConfirmar?: string;
  textoCancelar?: string;
}

interface ContextoConfirmacion {
  confirmar: (opciones: OpcionesConfirmacion) => Promise<boolean>;
}

const ConfirmacionContext = React.createContext<ContextoConfirmacion | undefined>(
  undefined
);

export function ProveedorConfirmacion({ children }: { children: React.ReactNode }) {
  const [abierto, setAbierto] = React.useState(false);
  const [opciones, setOpciones] = React.useState<OpcionesConfirmacion>({
    titulo: '',
    mensaje: '',
  });
  const resolverRef = React.useRef<((valor: boolean) => void) | null>(null);

  const confirmar = React.useCallback((opciones: OpcionesConfirmacion) => {
    setOpciones(opciones);
    setAbierto(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirmar = () => {
    resolverRef.current?.(true);
    setAbierto(false);
  };

  const handleCancelar = () => {
    resolverRef.current?.(false);
    setAbierto(false);
  };

  return (
    <ConfirmacionContext.Provider value={{ confirmar }}>
      {children}
      <ModalConfirmacion
        abierto={abierto}
        onCerrar={handleCancelar}
        onConfirmar={handleConfirmar}
        titulo={opciones.titulo}
        mensaje={opciones.mensaje}
        tipo={opciones.tipo}
        textoConfirmar={opciones.textoConfirmar}
        textoCancelar={opciones.textoCancelar}
      />
    </ConfirmacionContext.Provider>
  );
}

export function useConfirmacion() {
  const context = React.useContext(ConfirmacionContext);
  if (!context) {
    throw new Error('useConfirmacion debe usarse dentro de ProveedorConfirmacion');
  }
  return context;
}