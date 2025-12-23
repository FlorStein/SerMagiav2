#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Minificar CSS dentro de <style> tags en HTML
function minifyInlineCSS(htmlContent) {
  return htmlContent.replace(/<style>([\s\S]*?)<\/style>/g, (match, css) => {
    // Remover espacios innecesarios
    let minified = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentarios
      .replace(/\s+/g, ' ') // Múltiples espacios a uno
      .replace(/\s*([{}:;,])\s*/g, '$1') // Espacios alrededor de símbolos
      .trim();
    return `<style>${minified}</style>`;
  });
}

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

html = minifyInlineCSS(html);

fs.writeFileSync(htmlPath, html);
console.log('[minify-html-css] ✅ CSS inline minificado en index.html');
