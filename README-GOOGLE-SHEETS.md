# 📅 Actualización Automática de Agenda desde Google Sheets

## ✅ Problema Resuelto

Corregí el problema de **timing** que impedía que los eventos de Google Sheets se cargaran. Ahora la app espera a que termine la carga antes de renderizar.

## 🔧 Cambios Realizados

### 1. `js/agenda-loader.js`
- Ahora expone una `Promise` global (`window.AGENDA_LOADER_PROMISE`)
- Mejorados los logs de consola con emojis (✅ éxito, ❌ error)
- Agregado `console.table()` para ver los eventos cargados

### 2. `app.js`
- Espera a que termine `AGENDA_LOADER_PROMISE` antes de renderizar
- Si la carga falla o tarda mucho, usa el fallback hardcodeado
- Usa `window.AGENDA_EVENTOS` actualizado en tiempo de render

### 3. `test-sheets.html` (NUEVO)
- Página de diagnóstico para probar la conexión con Google Sheets
- Muestra errores detallados y sugerencias de solución
- Verifica el formato del CSV

---

## 📝 Cómo Actualizar la Agenda

### ⏱️ **Tiempo de actualización esperado:**

| Acción | Tiempo típico | Notas |
|--------|---------------|-------|
| Editar Google Sheet | Inmediato | |
| Google publica CSV actualizado | **30-60 segundos** | Con auto-refresh |
| Tu web refleja el cambio | **30-90 segundos** | **SIN recargar página** |

**✨ Mejoras implementadas:**
- ✅ **Cache-busting agresivo**: Timestamp único en cada carga
- ✅ **Auto-refresh cada 30 segundos**: Detecta cambios automáticamente
- ✅ **Actualización sin recargar**: React se actualiza solo cuando detecta cambios
- ✅ **Performance optimizada**: Solo hace refresh en producción (no en localhost)

### Paso 1: Configurar Google Sheets

1. **Abrí tu Google Sheet** con la tabla de eventos
2. Asegurate de que tenga estas columnas (en este orden):
   ```
   fecha | hora | titulo | subtitulo | cupos | estado | link_reservar | link_consultar | imagen
   ```

3. **Ejemplo de datos:**
   ```
   Sáb 16 Nov | 18:00 | Vinito y Tarot | Microcentro | 6 | Quedan 6 | | |
   Vie 29 Nov | 19:00 | Vinito y Tarot a domicilio | | 10-30 | Cupos 10–30 | | |
   ```

### Paso 2: Publicar en la Web

1. En Google Sheets: **Archivo → Compartir → Publicar en la web**
2. Seleccioná la **hoja específica** (ej: "Hoja 1" o "Agenda")
3. En **"Formato"**, elegí: **Valores separados por comas (.csv)**
4. Click en **"Publicar"**
5. **Copiá el enlace** (debe terminar en `output=csv`)

### Paso 3: Configurar la URL en el Código

**Opción A: Editar `js/agenda-loader.js` (recomendado para producción)**

Abrí `js/agenda-loader.js` y pegá tu URL en la línea 14:

```javascript
var SHEET_CSV_URL = window.SER_MAGIA_SHEET_CSV_URL || "TU_URL_AQUI.csv";
```

**Opción B: Configurar en `index.html` (sin tocar JS)**

Agregá antes de `<script src="./js/agenda-loader.js">`:

```html
<script>
  window.SER_MAGIA_SHEET_CSV_URL = "TU_URL_AQUI.csv";
</script>
<script defer src="./js/agenda-loader.js"></script>
```

### Paso 4: Probar la Carga

1. **Abrí** `test-sheets.html` en el navegador
2. Verificá que se vea:
   - ✅ "Conexión exitosa"
   - ✅ "X evento(s) encontrado(s)"
   - Tabla con tus eventos

3. Si hay errores, seguí las sugerencias que muestra

### Paso 5: Ver en la Página Principal

1. **Limpiá la caché** del navegador:
   - Windows: `Ctrl + Shift + Delete`
   - Mac: `Cmd + Shift + Delete`
   - Marcá "Imágenes y archivos en caché"

2. Abrí `index.html` (o tu sitio en producción)

3. **Abrí la consola** del navegador (F12 → Console)

4. Deberías ver:
   ```
   [Agenda Loader] ✅ Eventos cargados desde Google Sheets: X
   ```

---

## 🐛 Resolución de Problemas

### ❌ "Error al cargar CSV"

**Causas posibles:**
- La hoja **no está publicada** en la web
- El enlace es incorrecto
- Restricciones de privacidad en la hoja

**Solución:**
1. Verificá que el enlace termine en `output=csv`
2. Abrí el enlace directamente en el navegador → debe mostrar texto CSV
3. Si ves "Access Denied", volvé a publicar la hoja

### ⚠️ "Sheet válida pero sin eventos"

**Causas:**
- Todas las filas están vacías
- Falta la columna `titulo`
- Hay espacios en blanco en los nombres de columnas

**Solución:**
- Verificá que la primera fila tenga exactamente:
  ```
  fecha,hora,titulo,subtitulo,cupos,estado,link_reservar,link_consultar,imagen
  ```
- Asegurate de tener al menos una fila con `titulo` no vacío

### 🔄 Los cambios no se ven

**Tiempo normal: 30-90 segundos** (con auto-refresh)

**Cómo funciona ahora:**
1. Editás la hoja de Google Sheets
2. **Esperás 30-60 segundos** (Google publica el CSV)
3. El sitio **detecta automáticamente** el cambio (polling cada 30 seg)
4. La sección "Próximas fechas" **se actualiza sola** (sin recargar)

**Ver en vivo:**
- Abrí la consola del navegador (F12)
- Editá la Google Sheet
- En ~60 segundos verás: `[Agenda Loader] 🔄 Eventos actualizados automáticamente: X`
- La lista se actualiza automáticamente

**Si no funciona:**
1. Verificá la consola del navegador (F12) para errores
2. Asegurate de que la hoja esté publicada
3. Probá `test-sheets.html` para diagnóstico

---

## 🎨 Personalización

### Cambiar Columnas del CSV

Si querés usar nombres diferentes, editá la función `normalizeRow` en `js/agenda-loader.js`:

```javascript
function normalizeRow(r) {
  var fechaTxt = (r.tu_columna_fecha || "").trim();
  var horaTxt  = (r.tu_columna_hora  || "").trim();
  // ...
}
```

### Agregar más campos

Los eventos tienen estas propiedades que podés usar en `app.js`:

```javascript
{
  f: "Sáb 16 Nov · 18:00",        // fecha + hora combinadas
  t: "Vinito y Tarot",            // título
  cupos: "Quedan 6",              // cupos/estado
  reservar: "URL_reservar",       // opcional
  consultar: "URL_consultar",     // opcional
  imagen: "URL_imagen"            // opcional
}
```

---

## 🚀 Comandos Útiles

### Probar localmente

```powershell
# Con http-server (Node.js)
npx http-server -c-1 .

# Con Python 3
python -m http.server 8080
```

Luego abrí: http://localhost:8080/test-sheets.html

### Ver logs en consola

Abrí DevTools (F12) → Console y buscá:
- `[Agenda Loader]` → Estado de carga
- Tabla con eventos cargados

---

## 📊 Ejemplo de Google Sheet Completo

| fecha | hora | titulo | subtitulo | cupos | estado | link_reservar | link_consultar | imagen |
|-------|------|--------|-----------|-------|--------|---------------|----------------|--------|
| Sáb 16 Nov | 18:00 | Vinito y Tarot | Microcentro | 6 | Quedan 6 | https://wa.link/ylh91z | | |
| Vie 29 Nov | 19:00 | Vinito y Tarot a domicilio | | 10-30 | Cupos 10–30 | https://wa.link/ylh91z | #contacto | |
| Sáb 14 Dic | 10:00 | Formación Tarot | Módulo 1 | | Abierta inscripción | https://wa.link/ylh91z | #contacto | |

---

## ✨ Ventajas de Este Sistema

✅ **Actualización sin código**: Editá la hoja y listo  
✅ **Fallback automático**: Si falla la carga, usa eventos por defecto  
✅ **Debug fácil**: Logs claros en consola  
✅ **Sin caché**: Siempre pide la versión más reciente  
✅ **Página de test**: Diagnosticá problemas rápidamente  

---

## 📞 Soporte

Si tenés problemas:
1. Abrí `test-sheets.html` y copiá el error
2. Abrí la consola del navegador (F12) y copiá los logs
3. Verificá que la URL termine en `output=csv`
4. Probá abrir la URL directamente en el navegador

---

**Última actualización:** 29 de octubre de 2025  
**Versión:** 1.8.17
