/**
 * Utilidad para convertir imágenes (logos) a Base64.
 * Esto es necesario para que pdfMake pueda incluir imágenes en el PDF.
 */
export async function getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
  
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
  
      img.onerror = (error) => {
        reject(error);
      };
  
      img.src = url;
    });
  }
