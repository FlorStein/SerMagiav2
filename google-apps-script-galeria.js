// Google Apps Script para exponer imágenes de Google Drive con fechas
// Deployar como Web App con acceso "Cualquiera"

function doGet() {
  const FOLDER_ID = '1Bxd0wn9JAverBu6A6rfpUJasNLcXKESj'; // Tu carpeta de Google Drive
  
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const images = [];
    
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getMimeType();
      
      // Solo incluir imágenes
      if (mimeType.indexOf('image') !== -1) {
        images.push({
          name: file.getName(),
          url: 'https://drive.google.com/uc?export=view&id=' + file.getId(),
          createdTime: file.getDateCreated().toISOString(), // Fecha de creación en formato ISO
          modifiedTime: file.getLastUpdated().toISOString() // Fecha de modificación
        });
      }
    }
    
    // Ordenar por fecha de carga/modificación (más reciente primero)
    images.sort(function(a, b) {
      return new Date(b.modifiedTime) - new Date(a.modifiedTime);
    });
    
    // Devolver JSON
    return ContentService
      .createTextOutput(JSON.stringify(images))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // En caso de error, devolver mensaje de error en JSON
    return ContentService
      .createTextOutput(JSON.stringify({
        error: true,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función de prueba (opcional, para probar desde el editor)
function testDoGet() {
  const result = doGet();
  Logger.log(result.getContent());
}
