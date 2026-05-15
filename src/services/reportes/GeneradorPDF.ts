import puppeteer from 'puppeteer';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/services/auth/AuthService';

export interface ReporteConfig {
  titulo: string;
  orientacion?: 'portrait' | 'landscape';
  formato?: 'A4' | 'Letter' | 'Legal';
  margenes?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

export class GeneradorPDF {
  private browser: any = null;

  async inicializar() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: process.env.PUPPETEER_HEADLESS !== 'false',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
    }
    return this.browser;
  }

  async cerrar() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async generarPDF(html: string, config: ReporteConfig): Promise<Buffer> {
    try {
      const browser = await this.inicializar();
      const page = await browser.newPage();

      // Configurar viewport
      await page.setViewport({
        width: config.orientacion === 'landscape' ? 1120 : 800,
        height: config.orientacion === 'landscape' ? 800 : 1120,
        deviceScaleFactor: 1,
      });

      // Cargar HTML
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      // Estilos adicionales para impresión
      await page.addStyleTag({
        content: `
          @page {
            size: ${config.formato || 'A4'} ${config.orientacion || 'portrait'};
            margin-top: ${config.margenes?.top || '20mm'};
            margin-right: ${config.margenes?.right || '15mm'};
            margin-bottom: ${config.margenes?.bottom || '20mm'};
            margin-left: ${config.margenes?.left || '15mm'};
          }
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
          }
          .page-break {
            page-break-before: always;
          }
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `,
      });

      // Generar PDF
      const pdf = await page.pdf({
        format: config.formato || 'A4',
        landscape: config.orientacion === 'landscape',
        printBackground: true,
        margin: {
          top: config.margenes?.top || '20mm',
          right: config.margenes?.right || '15mm',
          bottom: config.margenes?.bottom || '20mm',
          left: config.margenes?.left || '15mm',
        },
      });

      await page.close();
      return Buffer.from(pdf);
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw new AppError('Error al generar el PDF', 500, 'PDF_GENERATION_ERROR');
    }
  }

  generarEncabezado(titulo: string, periodo?: string): string {
    return `
      <div class="header" style="text-align: center; margin-bottom: 20px; border-bottom: 3px solid #1a365d; padding-bottom: 15px;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 10px;">
          <div style="font-size: 24px; font-weight: bold; color: #1a365d;">UNT</div>
        </div>
        <h2 style="color: #1a365d; margin: 5px 0;">Sistema de Gestión de Horarios</h2>
        <h3 style="color: #4a5568; margin: 5px 0;">Escuela de Ingeniería de Sistemas</h3>
        <h1 style="color: #1a365d; margin: 10px 0;">${titulo}</h1>
        ${periodo ? `<p style="color: #4a5568;">Período: ${periodo}</p>` : ''}
        <p style="color: #718096; font-size: 9pt;">Generado el: ${new Date().toLocaleDateString('es-PE', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
    `;
  }

  generarPiePagina(): string {
    return `
      <div class="footer" style="position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8pt; color: #a0aec0; border-top: 1px solid #e2e8f0; padding-top: 5px;">
        <span>Escuela de Ingeniería de Sistemas - Universidad Nacional de Trujillo</span>
        <span style="margin-left: 20px;">Página <span class="pageNumber"></span></span>
      </div>
    `;
  }

  generarTabla(headers: string[], filas: string[][], estilos?: string): string {
    const headerHTML = headers.map(h => `<th style="background: #1a365d; color: white; padding: 8px; text-align: left; font-size: 9pt;">${h}</th>`).join('');
    const filasHTML = filas.map(fila => 
      `<tr>${fila.map(celda => `<td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 9pt;">${celda}</td>`).join('')}</tr>`
    ).join('');

    return `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; ${estilos || ''}">
        <thead>
          <tr>${headerHTML}</tr>
        </thead>
        <tbody>
          ${filasHTML}
        </tbody>
      </table>
    `;
  }
}