require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// GET / : page d'accueil HTML
app.get('/', (req, res) => {
  res.send(`<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mini Bibliotheque API (Prisma)</title>
  <style>
    * { box-sizing: border-box; margin: 0; }
    body { min-height: 100vh; display: grid; place-items: center; font-family: system-ui, sans-serif; background: #f0fdf4; color: #1f2937; }
    .card { width: min(600px, 90vw); background: #fff; border-radius: 14px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
    h1 { font-size: 1.5rem; margin-bottom: 12px; }
    p { color: #6b7280; margin-bottom: 16px; }
    code { background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 4px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>API Mini-Bibliotheque (Prisma)</h1>
    <p>Endpoints disponibles :</p>
    <ul>
      <li><code>GET  /bibliotheque</code> — findAll() — Liste des livres</li>
      <li><code>GET  /bibliotheque/:id</code> — findById() — Livre par ID</li>
      <li><code>POST /bibliotheque</code> — create() — Ajouter un livre</li>
    </ul>
  </div>
</body>
</html>`);
});

// GET /bibliotheque : findAll()
app.get('/bibliotheque', async (req, res) => {
  const livres = await prisma.livre.findMany();
  res.json({ success: true, data: livres });
});

// GET /bibliotheque/:id : findById()
app.get('/bibliotheque/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const livre = await prisma.livre.findUnique({ where: { id } });
  if (livre) {
    res.json({ success: true, data: livre });
  } else {
    res.status(404).json({ success: false, error: 'Livre introuvable' });
  }
});

// POST /bibliotheque : create()
app.post('/bibliotheque', async (req, res) => {
  const { titre, auteur } = req.body;
  if (!titre || !auteur) {
    return res.status(400).json({ success: false, error: 'Champs titre et auteur requis' });
  }
  const livre = await prisma.livre.create({ data: { titre, auteur } });
  res.status(201).json({ success: true, data: livre });
});

// 404 global
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route non trouvee' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur mini-bibliothèque (Prisma) sur http://localhost:${PORT}`);
});

