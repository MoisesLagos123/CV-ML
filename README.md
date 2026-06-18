# CV Web (Node) — Moisés Lagos F.

Versión del CV web servida con **Express**, con página dedicada a proyectos
personales (`/proyectos`) destacando OmniFlow.

## Estructura

```
deploy-node/
├── server.js                    ← servidor Express
├── package.json
├── Procfile                     ← Heroku / Railway
├── render.yaml                  ← Render.com
├── .gitignore
├── README.md
└── public/                      ← contenido estático
    ├── index.html               ← CV principal
    ├── proyectos.html           ← Página dedicada a proyectos
    ├── 404.html
    ├── cv-moises-lagos.docx     ← CV descargable
    ├── favicon.svg
    ├── omniflow-icon.png        ← icono del proyecto OmniFlow
    ├── robots.txt
    └── sitemap.xml
```

## Rutas

| URL | Sirve | Caché |
|---|---|---|
| `/` | `public/index.html` | 5 min |
| `/proyectos` | `public/proyectos.html` | 5 min |
| `/projects` | redirige 301 → `/proyectos` | — |
| `/healthz` | JSON `{ status: "ok" }` | — |
| `/cv-moises-lagos.docx` | descarga del CV | 24 h |
| `/favicon.svg`, `/omniflow-icon.png` | favicons / imágenes | 1 año (immutable) |
| `*` | `public/404.html` (status 404) | — |

## Características de seguridad

`server.js` aplica vía `helmet`:
- `Content-Security-Policy` estricto
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (cuando hay HTTPS)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restrictivo

`compression` aplica gzip / brotli automáticamente.

---

## Probar local

```bash
cd deploy-node
npm install
npm start
```

Abrir [http://localhost:3000](http://localhost:3000).

Para autoreload en desarrollo:
```bash
npm run dev    # node --watch
```

---

## Despliegue

### Opción A — Render.com (recomendado, free tier, 1 click)

1. Subir `deploy-node/` a un repo GitHub.
2. Ir a [render.com/dashboard](https://dashboard.render.com) → **New** → **Web Service**.
3. Conectar el repo. Render detecta `render.yaml` y configura todo automáticamente.
4. Click **Create Web Service**. Listo. URL: `https://cv-web-moises-lagos.onrender.com`.

Free tier duerme tras 15 min de inactividad y tarda ~30 seg en despertar.
Para evitarlo: subir a paid tier (~$7/mes) o configurar un cron externo de keep-alive.

### Opción B — Railway

1. Subir a GitHub.
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**.
3. Railway detecta Node automáticamente y usa `npm start`. Sin config extra.
4. URL custom en Settings.

### Opción C — Fly.io

```bash
# Instalar flyctl
curl -L https://fly.io/install.sh | sh

cd deploy-node
fly launch          # crea fly.toml interactivamente
fly deploy
```

URL: `https://<app-name>.fly.dev`.

### Opción D — Vercel (sirve Express como serverless)

```bash
npm i -g vercel
cd deploy-node
vercel
```

Vercel detecta Node y convierte el server a Functions. Funciona pero
para sitio estático es overkill. Para Express puro, mejor Render/Railway.

### Opción E — VPS propio (Hetzner / Hostinger / DigitalOcean)

```bash
# En el servidor
git clone <tu-repo>
cd deploy-node
npm install --production

# Con PM2 para keep-alive
sudo npm install -g pm2
pm2 start server.js --name cv-web
pm2 startup
pm2 save

# Detrás de nginx (para SSL + HTTP/2)
# /etc/nginx/sites-available/cv.conf:
#   server {
#     server_name moiseslagos.dev;
#     location / { proxy_pass http://localhost:3000; }
#   }
# sudo certbot --nginx -d moiseslagos.dev
```

---

## Antes de desplegar — checklist

- [ ] Reemplazar `https://moiseslagos.dev` placeholder por tu dominio en:
  - `public/index.html` (canonical, og:url, JSON-LD)
  - `public/proyectos.html` (canonical, og:url)
  - `public/robots.txt` (Sitemap)
  - `public/sitemap.xml` (loc)
- [ ] Rellenar URLs de GitHub y LinkedIn en `public/index.html`
- [ ] Verificar permisos públicos de los 3 certificados en Google Drive
- [ ] Verificar que `https://github.com/MoisesLagos123/omnifow` esté público (si no, ajustar el link en `proyectos.html`)
- [ ] Generar `og-image.png` (1200×630) y subirlo a `public/`

---

## Actualizar el CV docx

Cuando cambies el `.docx` (desde el script `generate_cv.js` en la carpeta padre):

```bash
cp '../Cv – Moisés Lagos (2026).docx' public/cv-moises-lagos.docx
git add public/cv-moises-lagos.docx
git commit -m "Update CV docx"
git push
```

Render/Railway redepliegan automáticamente.

---

## Diferencias vs `deploy/` (versión estática)

| Aspecto | `deploy/` | `deploy-node/` |
|---|---|---|
| Servidor | Cualquier host estático | Express + Node 20 |
| Páginas | `index.html` única | `/` + `/proyectos` + futuras |
| Cabeceras | `_headers` (Netlify) / `vercel.json` | `helmet` programático |
| Redirects | No | `/projects` → `/proyectos` |
| Health check | No | `/healthz` |
| Compression | Depende del host | `compression` middleware |
| Mejor para | Netlify Drop, GitHub Pages | Render, Railway, VPS propio |
