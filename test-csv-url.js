// Script de prueba rápida para verificar la carga de Google Sheets
// Ejecutá: node test-csv-url.js

const https = require('https');
const http = require('http');

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNJARxZ_CBiwnjGUDOonIqTqRp8xjrtfhltQRp-ptEbcga2Qxb9Apg2ecALLLM8g/pub?gid=396204798&single=true&output=csv";

console.log("🔍 Probando URL de Google Sheets...\n");
console.log("URL:", SHEET_URL, "\n");

function fetchWithRedirects(url, maxRedirects = 5) {
  const protocol = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    protocol.get(url, (res) => {
      console.log(`📡 Respuesta HTTP: ${res.statusCode} ${res.statusMessage}`);
      
      // Seguir redirecciones
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (maxRedirects === 0) {
          reject(new Error('Demasiadas redirecciones'));
          return;
        }
        console.log(`↪️  Redirigiendo a: ${res.headers.location}\n`);
        fetchWithRedirects(res.headers.location, maxRedirects - 1).then(resolve).catch(reject);
        return;
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

fetchWithRedirects(SHEET_URL)
  .then(csv => {
    console.log("\n📄 CSV recibido:");
    console.log("─".repeat(60));
    console.log(csv.substring(0, 500));
    if (csv.length > 500) {
      console.log("\n... (truncado, total:", csv.length, "caracteres)");
    }
    console.log("─".repeat(60));
    
    // Parsear
    const lines = csv.trim().split(/\r?\n/);
    const headers = lines[0].split(",");
    console.log("\n📊 Columnas encontradas:", headers);
    console.log("📈 Cantidad de filas (incluyendo header):", lines.length);
    
    const eventos = lines.slice(1).filter(line => {
      const cols = line.split(",");
      return cols.some(c => c.trim() !== "");
    });
    
    console.log("✅ Filas con datos:", eventos.length);
    
    if (eventos.length > 0) {
      console.log("\n🎉 ¡Éxito! La hoja tiene eventos.");
    } else {
      console.log("\n⚠️ Advertencia: No se encontraron eventos (todas las filas están vacías)");
    }
  })
  .catch(err => {
    console.error("\n❌ Error:", err.message);
    console.error("\n💡 Posibles causas:");
    console.error("   - La hoja no está publicada en la web");
    console.error("   - El enlace es incorrecto");
    console.error("   - Problemas de conexión");
    console.error("\n📝 Verificá que:");
    console.error("   1. El enlace termine en 'output=csv'");
    console.error("   2. La hoja esté publicada públicamente");
    console.error("   3. Podás abrir el enlace en tu navegador");
  });
