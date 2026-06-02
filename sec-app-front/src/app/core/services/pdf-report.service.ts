import { Injectable } from '@angular/core';
import { DutyAssignment } from '../models/duty-assignment.model';
import { formatDate } from '@angular/common';
import { getBase64ImageFromURL } from '../utils/image-to-base64.util';

// @ts-ignore
import * as pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({ providedIn: 'root' })
export class PdfReportService {

  constructor() {
    const pdfm = (pdfMake as any).default || (pdfMake as any);
    const pdff = (pdfFonts as any).default || (pdfFonts as any);
    const vfs = pdff.pdfMake ? pdff.pdfMake.vfs : (pdff.vfs || pdff);
    pdfm.vfs = vfs;
  }

  private formatPhone(phone: string): string {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  async generateDutyRosterPdf(startDate: string, assignments: DutyAssignment[], preparer?: any, approver?: any, action: 'download' | 'print' = 'download') {
    // 1. Cargar Logos Institucionales
    let logoSemmaBase64 = '';
    let logoPNBase64 = '';
    
    try {
        logoSemmaBase64 = await getBase64ImageFromURL('/img/logos/logo-semma.JPG');
        logoPNBase64 = await getBase64ImageFromURL('/img/logos/PN.jpg');
    } catch (e) {
        console.warn('No se pudieron cargar los logos para el PDF', e);
    }

    // 2. Preparar fechas
    const d = new Date(startDate + 'T12:00:00'); 
    const sunday = new Date(d);
    sunday.setDate(d.getDate() + 6);
    const rangeStr = `SEMANA DEL ${formatDate(d, 'dd', 'es-DO')} AL ${formatDate(sunday, 'dd \'DE\' MMMM yyyy', 'es-DO')}`.toUpperCase();
    
    const shiftNames = Array.from(new Set(assignments.map(a => a.shiftName)));
    
    // 3. Estructura del Documento
    const content: any[] = [
      // CABECERA INSTITUCIONAL
      {
        columns: [
          logoSemmaBase64 ? { image: logoSemmaBase64, width: 65 } : { text: '', width: 65 },
          {
            stack: [
                { text: 'HOSPITAL DOCENTE SEMMA SANTO DOMINGO', style: 'hospitalName' },
                { text: 'DEPARTAMENTO DE SEGURIDAD', style: 'deptName' },
                { canvas: [{ type: 'line', x1: 50, y1: 5, x2: 350, y2: 5, lineWidth: 1.5, color: '#1a4f8b' }] },
                { text: 'LISTA DE SERVICIO OFICIAL', style: 'reportTitle', margin: [0, 8, 0, 0] },
                { text: rangeStr, style: 'weekRange' }
            ],
            width: '*'
          },
          logoPNBase64 ? { image: logoPNBase64, width: 60 } : { text: '', width: 60 }
        ],
        margin: [0, 0, 0, 25]
      }
    ];

    // CUERPO POR TURNO
    shiftNames.forEach(shiftName => {
      const items = assignments
        .filter(a => a.shiftName === shiftName)
        .sort((a, b) => a.agentName.localeCompare(b.agentName));

      content.push({ 
        table: {
            widths: ['*'],
            body: [[{ text: shiftName.toUpperCase(), style: 'shiftHeader' }]]
        },
        margin: [0, 5, 0, 0]
      });
      
      const tableBody: any[][] = [
        [
          { text: 'No.', style: 'tableHeader' },
          { text: 'RANGO', style: 'tableHeader' },
          { text: 'NOMBRE COMPLETO', style: 'tableHeader' },
          { text: 'INST.', style: 'tableHeader' },
          { text: 'PUESTO / ZONA', style: 'tableHeader' },
          { text: 'TELÉFONO', style: 'tableHeader' }
        ]
      ];

      items.forEach((item, index) => {
        tableBody.push([
          { text: (index + 1).toString(), alignment: 'center', style: 'tableCell' },
          { text: item.agentRank, alignment: 'center', style: 'tableCell' },
          { text: item.agentName, bold: true, style: 'tableCell' },
          { text: item.agentInstitution, alignment: 'center', style: 'tableCell' },
          { text: item.dutyPostName, style: 'tableCell' },
          { text: this.formatPhone(item.agentPhone), alignment: 'center', style: 'tableCell' }
        ]);
      });

      content.push({
        table: {
          headerRows: 1,
          widths: [22, 60, '*', 45, 130, 75],
          body: tableBody
        },
        layout: {
            fillColor: (rowIndex: number) => (rowIndex % 2 === 0 && rowIndex !== 0) ? '#f9f9f9' : null,
            hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 1.5 : 0.5,
            vLineWidth: (i: number, node: any) => (i === 0 || i === node.table.widths.length) ? 1.5 : 0.5,
            hLineColor: () => '#aaaaaa',
            vLineColor: () => '#aaaaaa'
        },
        margin: [0, 0, 0, 15]
      });
    });

    // BLOQUE DE FIRMAS
    content.push({
      columns: [
        {
          stack: [
            { text: 'PREPARADO POR:', fontSize: 8, bold: true, margin: [0, 30, 0, 30], alignment: 'center' },
            { canvas: [{ type: 'line', x1: 30, y1: 0, x2: 180, y2: 0, lineWidth: 1 }] },
            { text: preparer?.fullName || '__________________________', bold: true, margin: [0, 5, 0, 0] },
            { text: `${preparer?.rank || 'Rango'}, ${preparer?.position || 'Sub-Encargado'}`, fontSize: 8 },
            { text: 'Seguridad HDSSD', fontSize: 8, color: '#666' }
          ],
          alignment: 'center'
        },
        {
          stack: [
            { text: 'VISADO / APROBADO POR:', fontSize: 8, bold: true, margin: [0, 30, 0, 30], alignment: 'center' },
            { canvas: [{ type: 'line', x1: 30, y1: 0, x2: 180, y2: 0, lineWidth: 1 }] },
            { text: approver?.fullName || '__________________________', bold: true, margin: [0, 5, 0, 0] },
            { text: `${approver?.rank || 'Rango'}, ${approver?.position || 'Encargado'}`, fontSize: 8 },
            { text: 'Seguridad HDSSD', fontSize: 8, color: '#666' }
          ],
          alignment: 'center'
        }
      ],
      margin: [0, 30, 0, 0]
    });

    const docDefinition: any = {
      content: content,
      background: [
        {
            text: 'HDSSD - OFICIAL',
            color: '#eeeeee',
            opacity: 0.3,
            fontSize: 60,
            bold: true,
            italics: true,
            angle: 45,
            alignment: 'center',
            margin: [0, 300, 0, 0]
        }
      ],
      footer: (currentPage: number, pageCount: number) => {
        return {
            columns: [
                { text: `Generado el: ${formatDate(new Date(), 'dd/MM/yyyy hh:mm a', 'es-DO')}`, fontSize: 7, margin: [30, 10], color: '#888' },
                { text: `Página ${currentPage} de ${pageCount}`, fontSize: 7, alignment: 'right', margin: [30, 10], color: '#888' }
            ]
        };
      },
      styles: {
        hospitalName: { fontSize: 13, bold: true, alignment: 'center', color: '#1a4f8b' },
        deptName: { fontSize: 10, bold: true, alignment: 'center', color: '#333' },
        reportTitle: { fontSize: 11, bold: true, alignment: 'center', decoration: 'underline' },
        weekRange: { fontSize: 10, bold: true, alignment: 'center', margin: [0, 2, 0, 10] },
        shiftHeader: { fillColor: '#1a4f8b', color: 'white', bold: true, fontSize: 10, alignment: 'center', margin: [0, 2, 0, 2] },
        tableHeader: { fillColor: '#e9ecef', bold: true, alignment: 'center', fontSize: 8, color: '#333' },
        tableCell: { fontSize: 8.5, margin: [0, 3, 0, 3] }
      },
      defaultStyle: { fontSize: 8.5 },
      pageMargins: [30, 30, 30, 40]
    };

    const lib = (pdfMake as any).default || (pdfMake as any);
    if (typeof lib.createPdf === 'function') {
        const pdfDoc = lib.createPdf(docDefinition);
        if (action === 'print') {
            pdfDoc.print();
        } else {
            pdfDoc.download(`Lista_Servicio_HDSSD_${startDate}.pdf`);
        }
    }
  }
}
