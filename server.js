/**
 * CV Web — Servidor Express
 * Sirve el sitio estático con cabeceras de seguridad y rutas limpias.
 */

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');

// ===== Trust proxy (para deploys detrás de load balancer) =====
app.set('trust proxy', 1);

// ===== Compression (gzip / brotli) =====
app.use(compression());

// ===== Security headers via helmet =====
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // permite imagenes de Drive en certificados externos
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// ===== Rutas limpias =====
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/proyectos', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'proyectos.html'));
});

// Alias en inglés por si alguien linkea /projects
app.get('/projects', (req, res) => {
  res.redirect(301, '/proyectos');
});

// ===== Static files (CSS, JS, imágenes, docx) con cache largo =====
app.use(
  express.static(PUBLIC_DIR, {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
      } else if (filePath.endsWith('.svg') || filePath.endsWith('.png')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('.docx')) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  })
);

// ===== Health check (Render, Railway, Fly.io) =====
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== 404 handler =====
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

// ===== Boot =====
app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`CV Web up: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
