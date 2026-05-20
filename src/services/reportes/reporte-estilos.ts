/** Identidad visual UNT para reportes PDF (Puppeteer) */
export const REPORTE_COLORES = {
  azul: '#0f2d55',
  azulMedio: '#1e4a7a',
  dorado: '#c9a227',
  fondo: '#f8fafc',
  borde: '#e2e8f0',
  texto: '#1e293b',
  textoSuave: '#64748b',
  exito: '#059669',
  alerta: '#d97706',
  error: '#dc2626',
} as const;

export function escapeHtml(valor: unknown): string {
  if (valor === null || valor === undefined) return '—';
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function fechaGeneracionLarga(): string {
  return new Date().toLocaleString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function estilosBasePDF(): string {
  return `
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.45;
      color: ${REPORTE_COLORES.texto};
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .reporte-header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 3px solid ${REPORTE_COLORES.azul};
    }
    .reporte-header .marca {
      display: inline-block;
      background: linear-gradient(135deg, ${REPORTE_COLORES.azul} 0%, ${REPORTE_COLORES.azulMedio} 100%);
      color: #fff;
      font-weight: 800;
      font-size: 11pt;
      letter-spacing: 0.2em;
      padding: 6px 16px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .reporte-header .institucion {
      font-size: 8.5pt;
      color: ${REPORTE_COLORES.textoSuave};
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin: 0 0 4px;
    }
    .reporte-header h1 {
      color: ${REPORTE_COLORES.azul};
      font-size: 16pt;
      font-weight: 700;
      margin: 8px 0 4px;
    }
    .reporte-header .subtitulo {
      color: ${REPORTE_COLORES.textoSuave};
      font-size: 10pt;
      margin: 0;
    }
    .reporte-header .meta {
      font-size: 8pt;
      color: #94a3b8;
      margin-top: 10px;
    }
    .seccion-titulo {
      color: ${REPORTE_COLORES.azul};
      font-size: 11pt;
      font-weight: 700;
      margin: 22px 0 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid ${REPORTE_COLORES.dorado};
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 16px 0 20px;
    }
    .kpi-card {
      background: ${REPORTE_COLORES.fondo};
      border: 1px solid ${REPORTE_COLORES.borde};
      border-left: 4px solid ${REPORTE_COLORES.dorado};
      border-radius: 8px;
      padding: 12px 14px;
    }
    .kpi-card .kpi-label {
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${REPORTE_COLORES.textoSuave};
      font-weight: 600;
    }
    .kpi-card .kpi-value {
      font-size: 14pt;
      font-weight: 800;
      color: ${REPORTE_COLORES.azul};
      margin-top: 4px;
    }
    .caja-info {
      background: ${REPORTE_COLORES.fondo};
      border: 1px solid ${REPORTE_COLORES.borde};
      border-left: 4px solid ${REPORTE_COLORES.azul};
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .caja-info h3 {
      margin: 0 0 8px;
      color: ${REPORTE_COLORES.azul};
      font-size: 11pt;
    }
    .caja-info p { margin: 4px 0; font-size: 9pt; }
    .caja-alerta {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid ${REPORTE_COLORES.alerta};
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .caja-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-left: 4px solid ${REPORTE_COLORES.error};
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    table.reporte-tabla {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 18px;
      font-size: 8.5pt;
    }
    table.reporte-tabla thead th {
      background: ${REPORTE_COLORES.azul};
      color: #fff;
      padding: 9px 10px;
      text-align: left;
      font-weight: 600;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    table.reporte-tabla tbody td {
      padding: 7px 10px;
      border-bottom: 1px solid ${REPORTE_COLORES.borde};
      vertical-align: top;
    }
    table.reporte-tabla tbody tr:nth-child(even) td {
      background: #f8fafc;
    }
    .texto-vacio {
      color: #94a3b8;
      font-style: italic;
      padding: 12px 0;
    }
    .page-break { page-break-before: always; }
  `;
}

export function generarEncabezadoHTML(titulo: string, periodo?: string, subtitulo?: string): string {
  return `
    <header class="reporte-header">
      <div class="marca">UNT</div>
      <p class="institucion">Universidad Nacional de Trujillo</p>
      <p class="subtitulo">Escuela de Ingeniería de Sistemas — Gestión de Horarios</p>
      <h1>${escapeHtml(titulo)}</h1>
      ${periodo ? `<p class="subtitulo">Período académico: <strong>${escapeHtml(periodo)}</strong></p>` : ''}
      ${subtitulo ? `<p class="subtitulo">${escapeHtml(subtitulo)}</p>` : ''}
      <p class="meta">Generado el ${escapeHtml(fechaGeneracionLarga())}</p>
    </header>
  `;
}

export function generarKpiGrid(
  items: { label: string; value: string | number }[]
): string {
  return `
    <div class="kpi-grid">
      ${items
        .map(
          (k) => `
        <div class="kpi-card">
          <div class="kpi-label">${escapeHtml(k.label)}</div>
          <div class="kpi-value">${escapeHtml(k.value)}</div>
        </div>`
        )
        .join('')}
    </div>
  `;
}

export function generarSeccionTitulo(texto: string): string {
  return `<h2 class="seccion-titulo">${escapeHtml(texto)}</h2>`;
}

export function generarCajaInfo(titulo: string, lineas: string[]): string {
  return `
    <div class="caja-info">
      <h3>${escapeHtml(titulo)}</h3>
      ${lineas.map((l) => `<p>${l}</p>`).join('')}
    </div>
  `;
}

export function generarTablaHTML(headers: string[], filas: string[][]): string {
  const th = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('');
  const trs = filas
    .map(
      (fila) =>
        `<tr>${fila.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`
    )
    .join('');

  const vacio =
    filas.length === 0
      ? `<tr><td colspan="${headers.length}" class="texto-vacio">Sin registros</td></tr>`
      : trs;

  return `
    <table class="reporte-tabla">
      <thead><tr>${th}</tr></thead>
      <tbody>${vacio}</tbody>
    </table>
  `;
}

export function envolverDocumentoHTML(
  titulo: string,
  contenido: string,
  opciones?: { periodo?: string; subtitulo?: string }
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(titulo)}</title>
  <style>${estilosBasePDF()}</style>
</head>
<body>
  ${generarEncabezadoHTML(titulo, opciones?.periodo, opciones?.subtitulo)}
  <main>${contenido}</main>
</body>
</html>`;
}
