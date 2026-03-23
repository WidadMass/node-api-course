const { readDB, writeDB } = require('./db');
const url = require('url');

// --- Helpers ---

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
  return statusCode;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(); }
    });
  });
}

// --- Handlers ---

async function handleGetBooks(req, res) {
  const parsed = url.parse(req.url, true);
  const db = await readDB();
  let books = db.books;

  // Bonus : filtrage par disponibilité ?available=true|false
  if (parsed.query.available !== undefined) {
    const wantAvailable = parsed.query.available === 'true';
    books = books.filter(b => b.available === wantAvailable);
  }

  return sendJSON(res, 200, { success: true, count: books.length, data: books });
}

async function handleGetBookById(res, id) {
  const db = await readDB();
  const book = db.books.find(b => b.id === id);
  if (book) {
    return sendJSON(res, 200, { success: true, data: book });
  }
  return sendJSON(res, 404, { success: false, error: 'Livre introuvable' });
}

async function handlePostBook(req, res) {
  let input;
  try { input = await parseBody(req); }
  catch { return sendJSON(res, 400, { success: false, error: 'JSON invalide' }); }

  if (!input.title || !input.author || !input.year) {
    return sendJSON(res, 400, { success: false, error: 'Les champs title, author et year sont requis' });
  }

  const db = await readDB();
  const newId = db.books.length ? Math.max(...db.books.map(b => b.id)) + 1 : 1;
  const newBook = { id: newId, title: input.title, author: input.author, year: input.year, available: true };
  db.books.push(newBook);
  await writeDB(db);
  return sendJSON(res, 201, { success: true, data: newBook });
}

// Bonus : DELETE /books/:id
async function handleDeleteBook(res, id) {
  const db = await readDB();
  const index = db.books.findIndex(b => b.id === id);
  if (index === -1) {
    return sendJSON(res, 404, { success: false, error: 'Livre introuvable' });
  }
  const deleted = db.books.splice(index, 1)[0];
  await writeDB(db);
  return sendJSON(res, 200, { success: true, data: deleted });
}

// --- Router principal ---

async function router(req, res) {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const method = req.method;
  const timestamp = new Date().toISOString();
  let status;

  try {
    if (method === 'GET' && (pathname === '/books' || pathname === '/books/')) {
      status = await handleGetBooks(req, res);
    } else if (method === 'GET' && pathname.startsWith('/books/')) {
      const id = parseInt(pathname.split('/')[2]);
      if (isNaN(id)) {
        status = sendJSON(res, 404, { success: false, error: 'ID invalide' });
      } else {
        status = await handleGetBookById(res, id);
      }
    } else if (method === 'POST' && pathname === '/books') {
      status = await handlePostBook(req, res);
    } else if (method === 'DELETE' && pathname.startsWith('/books/')) {
      const id = parseInt(pathname.split('/')[2]);
      if (isNaN(id)) {
        status = sendJSON(res, 404, { success: false, error: 'ID invalide' });
      } else {
        status = await handleDeleteBook(res, id);
      }
    } else {
      status = sendJSON(res, 404, { success: false, error: 'Route non trouvée' });
    }
  } catch (err) {
    status = sendJSON(res, 500, { success: false, error: 'Erreur interne' });
    console.error(err);
  }

  console.log(`[${timestamp}] ${method} ${pathname} -> ${status}`);
}

module.exports = router;
