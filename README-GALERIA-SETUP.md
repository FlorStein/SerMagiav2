# 📸 Configuración de la Galería de Fotos

## 🔍 Problema Actual

La API de Google Apps Script configurada está devolviendo una página de error HTML en lugar del JSON esperado. Por eso ves el mensaje:

```
Ocurrió un error cargando la galería.
```

## ✅ Solución Rápida: Usar IDs Manuales

### Paso 1: Obtener los IDs de tus fotos en Google Drive

1. **Abrí Google Drive** donde tenés las fotos guardadas
2. Para cada foto:
   - **Click derecho** → **Obtener enlace**
   - **Asegurate de que sea**: "Cualquier persona con el enlace"
   - Copiá el enlace, se verá algo como:
     ```
     https://drive.google.com/file/d/1ABC123xyz456/view?usp=sharing
     ```
   - El **ID es la parte entre `/d/` y `/view`**: `1ABC123xyz456`

### Paso 2: Agregar los IDs en el código

1. **Abrí** `galeria-vinito.html`
2. **Buscá la línea ~269** donde dice `const IMAGE_IDS = [`
3. **Agregá tus IDs** dentro del array, por ejemplo:

```javascript
const IMAGE_IDS = [
  '1ABC123xyz456',        // Foto del encuentro 1
  '1DEF789abc123',        // Foto del encuentro 2
  '1GHI456def789',        // Foto del encuentro 3
  '1JKL012ghi345',        // Foto del encuentro 4
  // Agregá más según necesites
];
```

### Paso 3: Probar

1. **Guardá** el archivo
2. **Recargá** `galeria-vinito.html` en el navegador
3. Deberías ver tus fotos en la galería

---

## 🚀 Solución Definitiva: Google Apps Script

Si querés que la galería se actualice automáticamente desde una carpeta de Google Drive, seguí estos pasos:

### Paso 1: Crear el Script en Google Apps Script

1. **Andá a**: https://script.google.com/
2. Click en **"+ Nuevo proyecto"**
3. **Pegá este código**:

```javascript
function doGet() {
  // Reemplazá este ID con el ID de tu carpeta de Google Drive
  const FOLDER_ID = 'TU_ID_DE_CARPETA_AQUI';
  
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const images = [];
    
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getMimeType();
      
      // Solo procesar imágenes
      if (mimeType.indexOf('image/') === 0) {
        images.push({
          name: file.getName(),
          url: 'https://drive.google.com/uc?export=view&id=' + file.getId()
        });
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(images))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Paso 2: Obtener el ID de tu carpeta de Google Drive

1. **Abrí** la carpeta donde tenés las fotos en Google Drive
2. **Mirá la URL** del navegador, se verá algo como:
   ```
   https://drive.google.com/drive/folders/1XYZ789folder123
   ```
3. El **ID es la parte después de `/folders/`**: `1XYZ789folder123`
4. **Reemplazá** `TU_ID_DE_CARPETA_AQUI` en el script con tu ID

### Paso 3: Desplegar el Script

1. En Google Apps Script, click en **"Implementar"** (o "Deploy") → **"Nueva implementación"**
2. Click en el ícono de ⚙️ → **"Aplicación web"**
3. **Configurá**:
   - **Descripción**: "API de Galería Ser Magia"
   - **Ejecutar como**: "Yo (tu@email.com)"
   - **Quién tiene acceso**: **"Cualquier usuario"** ⚠️ IMPORTANTE
4. Click en **"Implementar"**
5. **Autorizá** los permisos que te pida
6. **Copiá** la URL que te da (debe terminar en `/exec`)

### Paso 4: Actualizar tu sitio web

1. **Abrí** `galeria-vinito.html`
2. **Buscá la línea ~266** donde dice `const DRIVE_API_URL = '';`
3. **Pegá tu URL**:

```javascript
const DRIVE_API_URL = 'https://script.google.com/macros/s/TU_NUEVA_URL_AQUI/exec';
```

4. **Guardá** el archivo
5. **Recargá** la página

### Paso 5: Verificar que funciona

1. **Abrí** la URL del script directamente en el navegador
2. Deberías ver un JSON como:
   ```json
   [
     {
       "name": "foto1.jpg",
       "url": "https://drive.google.com/uc?export=view&id=1ABC..."
     },
     {
       "name": "foto2.jpg",
       "url": "https://drive.google.com/uc?export=view&id=1DEF..."
     }
   ]
   ```

3. Si ves esto, **¡funciona!** 🎉

---

## 🐛 Solución de Problemas

### ❌ "Authorization required"

**Causa**: El script no está desplegado como público

**Solución**:
1. En Google Apps Script → **"Implementar"** → **"Administrar implementaciones"**
2. Click en ✏️ (editar)
3. En **"Quién tiene acceso"** → cambiar a **"Cualquier usuario"**
4. **Guardar** → **Obtener nueva URL**

### ❌ "Exception: Cannot find folder"

**Causa**: El ID de la carpeta es incorrecto

**Solución**:
1. Verificá que copiaste el ID correcto de la URL de Drive
2. Asegurate de tener permisos de lectura en esa carpeta

### ❌ La galería carga pero no muestra fotos

**Causa**: Las fotos no tienen permisos públicos

**Solución**:
1. En Google Drive, seleccioná todas las fotos
2. **Click derecho** → **Obtener enlace**
3. Cambiar a **"Cualquier persona con el enlace"**

---

## 🎨 Personalización

### Ordenar fotos por fecha (más nuevas primero)

En el script de Apps Script, después de crear el array `images`, agregá:

```javascript
images.sort((a, b) => {
  return b.name.localeCompare(a.name);
});
```

### Limitar cantidad de fotos

```javascript
// Solo las últimas 12 fotos
const MAX_IMAGES = 12;
return ContentService
  .createTextOutput(JSON.stringify(images.slice(0, MAX_IMAGES)))
  .setMimeType(ContentService.MimeType.JSON);
```

### Agregar nombres personalizados

En lugar de usar el nombre del archivo, podés agregar metadata o usar un archivo de configuración.

---

## 📝 Resumen

**Opción 1** (Rápida): Usar `IMAGE_IDS` con IDs manuales
- ✅ Fácil y rápido
- ❌ Hay que actualizar el código cada vez que agregás fotos

**Opción 2** (Recomendada): Google Apps Script
- ✅ Actualización automática
- ✅ Solo subís fotos a la carpeta de Drive
- ⚠️ Requiere configuración inicial (5-10 minutos)

---

## ✅ Estado Actual

- ✅ La API se deshabilitó temporalmente para evitar errores
- ✅ El código está listo para usar `IMAGE_IDS` manuales
- ⏳ Necesitás configurar los IDs o crear el script según esta guía

---

¿Necesitás ayuda con algún paso? ¡Consultá! 🪄✨
