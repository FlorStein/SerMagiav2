# Ser Magia · Landing v1.1 (restaurada)
Incluye todas las secciones de la v1, más:
- **Animación** en el título del hero.
- **Fondo del hero** desde `assets/background-tarot.svg`.
- **Carta del Sol** a la vista completa (2:3, sin recortes).

Abrí `index.html` con Live Server o navegador. Editá `app.jsx` para contenido/fechas.

## Formspree (Formulario de contacto)
- Endpoint: configurado en `app.jsx` como `FORMSPREE_ENDPOINT`.
- Cómo configurarlo:
	- Creá una cuenta en Formspree con el correo `sermagia.tarot@gmail.com`.
	- Generá un formulario nuevo y copiá el ID del endpoint (formato `https://formspree.io/f/XXXXYYYY`).
	- Pegá esa URL en `FORMSPREE_ENDPOINT` dentro de `app.jsx`.
	- Verificá el correo y añadí tu dominio (si usás uno) en “Domains” para habilitar envíos desde la web.
- Los campos enviados incluyen `subject` y `_replyto` para que puedas responder directamente al email del remitente.

## Dominio propio (Hostinger + GitHub Pages)
Esta web es estática y está lista para GitHub Pages. El archivo `CNAME` ya apunta a `sermagia.com`.

1) Activar GitHub Pages en el repo
- En GitHub: Settings → Pages → Build and deployment.
- Source: "Deploy from a branch" → Branch `main` → `/ (root)`.
- Guardar. Esperá la publicación inicial.

2) Configurar DNS en Hostinger (sermagia.com)
- Registros A (para el dominio raíz):
	- `@` → `185.199.108.153`
	- `@` → `185.199.109.153`
	- `@` → `185.199.110.153`
	- `@` → `185.199.111.153`
- Registro CNAME (para `www`):
	- `www` → `florstein.github.io`

3) HTTPS
- En GitHub: Settings → Pages → tildar "Enforce HTTPS" cuando esté disponible.

4) Verificación rápida (Windows)
```powershell
nslookup sermagia.com
nslookup www.sermagia.com
```
Cuando ambos resuelvan y el sitio cargue, el certificado se emite solo.

5) Formspree Domains
- En Formspree, agregá `sermagia.com` en Settings → Domains para permitir envíos desde tu dominio.

### Alternativa: publicar directo en Hostinger
Si preferís subir archivos al hosting:
- En hPanel → Hosting → File Manager → `public_html/`.
- Subí todo el contenido del repo a `public_html/`.
- Borra/ajusta `CNAME` si no usás GitHub Pages.

### Errores comunes (pueden dejar el sitio inaccesible)
- Mezclar tipos para el mismo host: no pongas `A` y `CNAME` simultáneamente para `@` o para `www`.
- Duplicar `CNAME` de `www`: debe existir uno solo apuntando a `florstein.github.io`.
- Mantener antiguos `A` del proveedor (ej. `84.32.84.32`): elimina cualquier `A` heredado y usa solo los cuatro de GitHub Pages.
- TTL muy alto durante la migración: usa `300` y luego sube a `3600` al estabilizar.
