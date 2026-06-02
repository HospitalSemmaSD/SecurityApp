export class FormDataUtil {
  /**
   * Convierte un objeto plano (generalmente form.getRawValue()) a FormData,
   * aplicando reglas consistentes de formateo de fechas y omisión de nulos.
   */
  static toFormData(values: any, fileKey?: string, file?: File | null): FormData {
    const formData = new FormData();

    Object.keys(values).forEach(key => {
      let value = values[key];

      // 1. Manejo de Fechas (Formateo estricto a YYYY-MM-DD)
      if (value instanceof Date) {
        value = this.formatDate(value);
      } else if (this.isLikelyDateString(key, value)) {
        value = this.parseAndFormatDate(value);
      }

      // 2. Omisión de valores nulos o vacíos (según GEMINI.md)
      if (this.isValidValue(value) && key !== fileKey) {
        formData.append(key, typeof value === 'string' ? value.trim() : value);
      }
    });

    // 3. Append del archivo físico si existe
    if (fileKey && file) {
      formData.append(fileKey, file, file.name);
    }

    return formData;
  }

  private static isValidValue(value: any): boolean {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  }

  private static isLikelyDateString(key: string, value: any): boolean {
    if (typeof value !== 'string') return false;
    const lowerKey = key.toLowerCase();
    return lowerKey.includes('date') || lowerKey.includes('birthday') || lowerKey.includes('birth');
  }

  private static formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private static parseAndFormatDate(value: string): string {
    // 1. Manejo de formato ddMMyyyy (ngx-mask con dropSpecialCharacters: true)
    if (/^\d{8}$/.test(value)) {
      const d = value.substring(0, 2);
      const m = value.substring(2, 4);
      const y = value.substring(4, 8);
      return `${y}-${m}-${d}`;
    }

    // 2. Manejo de formato dd/MM/yyyy (ngx-mask con dropSpecialCharacters: false)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const parts = value.split('/');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    const date = new Date(value);
    return !isNaN(date.getTime()) ? this.formatDate(date) : value;
  }
}
