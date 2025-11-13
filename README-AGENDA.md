
# Ser Magia · Agenda editable con Google Sheets

## ¿Qué cambia?
La sección **“Próximas fechas”** ahora se alimenta automáticamente desde una Google Sheet (sin tocar código).

## Cómo configurarlo (3 pasos)
1. Abrí `data/agenda-template.xlsx`, subilo a tu Google Drive y abrilo con **Google Sheets**. Completá o editá filas.
2. En Google Sheets: **Archivo → Compartir → Publicar en la web**. Elegí la *Hoja 1* y el formato **CSV**. Copiá el enlace (termina en `.csv`).
3. En `js/agenda-loader.js`, pegá ese enlace en `SHEET_CSV_URL` (o definí `window.SER_MAGIA_SHEET_CSV_URL` antes del script). Subí el sitio.

> Si no configurás la sheet, la web usará los 3 eventos de ejemplo hardcodeados como fallback.

## Estructura de columnas (Google Sheets)
- `fecha` (ej. `Sáb 16 Nov`)
- `hora` (ej. `18:00`)
- `titulo` (ej. `Vinito y Tarot`)
- `subtitulo` (ej. `Microcentro`)
- `cupos` (ej. `Quedan 6`)
- `estado` (ej. `Abierta inscripción` — opcional; si está, reemplaza `cupos`)
- `link_reservar` (URL WhatsApp o similar)
- `link_consultar` (URL mailto, WhatsApp u otro)
- `imagen` (opcional — reservado para futuras mejoras)

## ¿Puedo ocultar botones?
Sí. Si dejás vacío `link_reservar` o `link_consultar`, el botón no se mostrará.

## ¿Y si quiero volver al modo manual?
Dejá `SHEET_CSV_URL` vacío. El sitio mostrará los 3 eventos hardcodeados.

—
Hecho con cariño 💫
