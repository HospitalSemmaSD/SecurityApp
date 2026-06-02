import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  /**
   * Exporta un array de objetos a un archivo Excel (.xlsx)
   * @param data Los datos a exportar
   * @param headers Los nombres amigables de las columnas en español
   * @param keys Las propiedades correspondientes en el objeto JSON
   * @param fileName Nombre final del archivo (sin extensión)
   * @param sheetName Nombre de la hoja de trabajo
   */
  exportToExcel(data: any[], headers: string[], keys: string[], fileName: string, sheetName: string = 'Datos') {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar a Excel.');
      return;
    }

    // 1. Mapear datos a filas estructuradas utilizando los encabezados
    const formattedData = data.map(item => {
      const row: any = {};
      headers.forEach((header, index) => {
        const key = keys[index];
        row[header] = item[key] !== undefined && item[key] !== null ? item[key] : '';
      });
      return row;
    });

    // 2. Crear una hoja de trabajo (Worksheet)
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 3. Auto-ajustar el ancho de las columnas basándose en el contenido
    const maxColumnWidths = headers.map(header => {
      let maxLength = header.length;
      formattedData.forEach(row => {
        const value = String(row[header] || '');
        if (value.length > maxLength) {
          maxLength = value.length;
        }
      });
      return { wch: maxLength + 3 }; // Margen de seguridad
    });
    worksheet['!cols'] = maxColumnWidths;

    // 4. Crear un libro de trabajo (Workbook) y guardar el archivo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}
