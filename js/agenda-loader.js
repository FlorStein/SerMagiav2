
/**
 * Agenda Loader (Google Sheets → window.AGENDA_EVENTOS)
 * ----------------------------------------------------
 * Cómo usar:
 * 1) Hacé una copia de data/agenda-template.xlsx en tu Google Drive.
 * 2) Abrila en Google Sheets y completá filas.
 * 3) Menú: Archivo → Compartir → Publicar en la web → Hoja 1 → Formato: Valores separados por comas (.csv).
 * 4) Copiá el enlace público (termina en .csv) y pegalo en SHEET_CSV_URL abajo.
 * 5) Subí de nuevo el sitio. Listo: la sección "Próximas fechas" se llenará sola.
 */
(function(){
  // ⚠️ Pegá acá tu URL pública de CSV de Google Sheets (Archivo → Publicar en la web)
  var SHEET_CSV_URL = window.SER_MAGIA_SHEET_CSV_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNJARxZ_CBiwnjGUDOonIqTqRp8xjrtfhltQRp-ptEbcga2Qxb9Apg2ecALLLM8g/pub?gid=396204798&single=true&output=csv";

  // Si no está configurada, no hacemos nada (app.js usará el fallback hardcodeado)
  if (!SHEET_CSV_URL || SHEET_CSV_URL.indexOf("http") !== 0) {
    console.warn("[Agenda Loader] SHEET_CSV_URL no configurada. Usando eventos por defecto definidos en app.js.");
    return;
  }

  // Cache-busting agresivo: timestamp único en cada carga para forzar actualización inmediata
  // Como los datos son pocos (3-5 eventos), podemos hacer esto sin problemas de performance
  var cacheBuster = Date.now(); // Cambia en cada carga
  var separator = SHEET_CSV_URL.indexOf('?') > -1 ? '&' : '?';
  SHEET_CSV_URL = SHEET_CSV_URL + separator + 't=' + cacheBuster;

  // CSV simple → JSON
  function csvToArray(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(row => {
      // Manejo básico de comillas
      const cols = [];
      let cur = "", inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === '"' && row[i+1] === '"') { cur += '"'; i++; continue; }
        if (ch === '"') { inQuotes = !inQuotes; continue; }
        if (ch === "," && !inQuotes) { cols.push(cur); cur = ""; continue; }
        cur += ch;
      }
      cols.push(cur);
      const obj = {};
      headers.forEach((h, idx) => obj[h] = (cols[idx] || "").trim());
      return obj;
    });
  }

  function normalizeRow(r){
    // Espera columnas: fecha, hora, titulo, subtitulo, cupos, estado, link_reservar, link_consultar, imagen
    // Texto "f" (fecha corta + hora) y "t" (título) son los que usa el componente actual
    var fechaTxt = (r.fecha || "").trim();
    var horaTxt  = (r.hora  || "").trim();
    var titulo   = (r.titulo || "").trim();
    var subtitulo= (r.subtitulo || "").trim();
    var cupos    = (r.cupos || "").trim();
    var estado   = (r.estado || "").trim();
    var f = [fechaTxt, horaTxt].filter(Boolean).join(" · ");

    return {
      f: f || titulo,                        // "Sáb 16 Nov · 18:00"
      t: titulo + (subtitulo ? " – " + subtitulo : ""), // "Vinito y Tarot – Microcentro"
      cupos: estado ? estado : cupos,       // "Abierta inscripción" o "Quedan 6"
      reservar: r.link_reservar || "",
      consultar: r.link_consultar || "",
      imagen: r.imagen || ""
    };
  }

  // Exponer una Promise que otros scripts puedan await
  window.AGENDA_LOADER_PROMISE = fetch(SHEET_CSV_URL, { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    })
    .then(csv => {
      const rows = csvToArray(csv);
      const eventos = rows
        .filter(r => (r.titulo || "").trim() !== "")
        .map(normalizeRow);
      if (eventos.length) {
        window.AGENDA_EVENTOS = eventos;
        console.info("[Agenda Loader] ✅ Eventos cargados desde Google Sheets:", eventos.length);
        console.table(eventos); // Para debug: ver eventos en consola
        
        // Disparar evento personalizado para que React se entere del cambio
        window.dispatchEvent(new CustomEvent('agendaUpdated', { detail: eventos }));
        
        return eventos;
      } else {
        console.warn("[Agenda Loader] Sheet válida pero sin eventos. Usando fallback.");
        return null;
      }
    })
    .catch(err => {
      console.error("[Agenda Loader] ❌ Error al cargar CSV:", err);
      console.error("[Agenda Loader] Verificá que la hoja esté publicada y la URL sea correcta.");
      return null;
    });
  
  // Auto-refresh cada 30 segundos para detectar cambios rápidamente
  // Solo en producción (cuando no estamos en modo desarrollo)
  if (!window.location.hostname.match(/localhost|127\.0\.0\.1/)) {
    setInterval(function() {
      var refreshUrl = SHEET_CSV_URL.split('&t=')[0] + '&t=' + Date.now();
      fetch(refreshUrl, { cache: "no-store" })
        .then(res => res.text())
        .then(csv => {
          const rows = csvToArray(csv);
          const eventos = rows
            .filter(r => (r.titulo || "").trim() !== "")
            .map(normalizeRow);
          if (eventos.length && JSON.stringify(eventos) !== JSON.stringify(window.AGENDA_EVENTOS)) {
            window.AGENDA_EVENTOS = eventos;
            console.info("[Agenda Loader] 🔄 Eventos actualizados automáticamente:", eventos.length);
            window.dispatchEvent(new CustomEvent('agendaUpdated', { detail: eventos }));
          }
        })
        .catch(function() {
          // Silencioso: no mostrar errores en auto-refresh
        });
    }, 30000); // Cada 30 segundos
  }
})();
