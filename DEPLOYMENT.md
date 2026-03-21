# Difilex v4 — Deployment met Persistente Opslag

## Hoe het werkt

Wanneer je in de Editor op **⬆ Publish** klikt:
1. De content wordt als JSON-bestand opgeslagen op de server (`data/published.json`)
2. Er wordt automatisch een backup gemaakt (max 20 backups in `data/backups/`)
3. Elke bezoeker laadt de gepubliceerde content van de server

**Drafts** (auto-saved tijdens bewerken) blijven in de browser (localStorage).

```
difilex/
├── data/                    ← PERSISTENT (niet in git)
│   ├── published.json       ← Gepubliceerde content
│   └── backups/             ← Automatische backups (max 20)
├── dist/                    ← Gebouwde frontend
├── server/index.js          ← Express server
├── src/App.jsx              ← Difilex applicatie
└── ...
```

---

## Snelstart (eigen server)

```bash
# 1. Uitpakken
unzip difilex-v4-deploy.zip
cd difilex-deploy

# 2. Installeren
npm install

# 3. API key instellen
cp .env.example .env
nano .env   # Vul ANTHROPIC_API_KEY=sk-ant-... in

# 4. Bouwen
npm run build

# 5. Starten
npm start
```

Open http://localhost:3001. Login met wachtwoord `admin`, kies Editor, voeg content toe, klik Publish → content is nu permanent opgeslagen.

---

## Development (lokaal testen)

```bash
npm install

# Terminal 1: server (voor API + content opslag)
node server/index.js

# Terminal 2: frontend (hot reload)
npm run dev
```

Open http://localhost:5173

---

## Productie op VPS

### Met PM2:

```bash
npm install
npm run build
cp .env.example .env && nano .env

# Start met PM2
npm install -g pm2
pm2 start server/index.js --name difilex
pm2 startup && pm2 save
```

### Met Nginx + SSL:

```nginx
server {
    listen 80;
    server_name difilex.jouwdomein.nl;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 20M;
    }
}
```

```bash
sudo certbot --nginx -d difilex.jouwdomein.nl
```

---

## Docker

```bash
cp .env.example .env && nano .env

docker build -t difilex .
docker run -d -p 3001:3001 \
  --env-file .env \
  -v difilex-data:/app/data \
  --name difilex \
  --restart unless-stopped \
  difilex
```

De `-v difilex-data:/app/data` zorgt ervoor dat de data bewaard blijft als de container opnieuw wordt gestart.

---

## Backup & Restore

**Automatisch:** Elke keer dat je publiceert wordt een backup gemaakt in `data/backups/`.

**Handmatig backup:**
```bash
cp data/published.json ~/backups/difilex-$(date +%Y%m%d).json
```

**Restore:**
```bash
cp ~/backups/difilex-20260321.json data/published.json
# Herstart de server
pm2 restart difilex
```

---

## Environment variabelen

| Variabele | Verplicht | Beschrijving |
|---|---|---|
| `ANTHROPIC_API_KEY` | Voor AI | Claude API key |
| `PORT` | Nee | Server poort (standaard 3001) |

---

## Veelgestelde vragen

**Waar staat de gepubliceerde content?**
In `data/published.json` op de server. Dit bestand wordt aangemaakt bij de eerste Publish.

**Kan ik content bewerken op een ander apparaat?**
Ja. Login op elk apparaat, ga naar Editor. Je draft is lokaal (per browser), maar zodra je Publish klikt wordt het centraal opgeslagen.

**Hoe wijzig ik het wachtwoord?**
Zoek in `src/App.jsx` naar `pw:"admin"` en vervang. Daarna: `npm run build` en herstart.

**Werkt dit op Vercel?**
Vercel heeft geen persistent filesystem. Gebruik voor Vercel een externe database (Supabase, Vercel KV, of Vercel Blob).
