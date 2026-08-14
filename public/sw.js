self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response(
        `<!doctype html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>KAMI-EXTENSION</title>
            <style>
              html, body {
                margin: 0;
                min-height: 100%;
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #f8fafc 0%, #eefbf6 45%, #f5f3ff 100%);
                color: #0f172a;
              }
              body {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 24px;
              }
              .card {
                width: min(100%, 500px);
                text-align: center;
                background: rgba(255,255,255,0.82);
                border: 1px solid rgba(148, 163, 184, 0.35);
                border-radius: 28px;
                padding: 32px 24px;
                box-shadow: 0 25px 80px rgba(15, 23, 42, 0.12);
              }
              .badge {
                display: inline-block;
                margin-bottom: 16px;
                padding: 6px 12px;
                border-radius: 999px;
                background: #d1fae5;
                color: #065f46;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.2em;
                text-transform: uppercase;
              }
              h1 {
                font-size: clamp(2rem, 5vw, 2.8rem);
                margin: 0 0 12px;
              }
              p {
                margin: 0;
                line-height: 1.6;
                color: #475569;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="badge">KAMI-EXTENSION</div>
              <h1>Connectez-vous pour voir le contenu</h1>
              <p>Vous êtes actuellement hors ligne. Revenez en ligne puis rechargez l’application pour accéder à votre espace.</p>
            </div>
          </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    })
  );
});
