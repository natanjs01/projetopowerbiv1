// Service Worker - PWA Online-Only Mode
// Versão: 1.0.1
// Modo: Sempre Online (sem cache offline)

const CACHE_NAME = 'portal-bi-v1.0.1';
const urlsToCache = [];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Cache criado (vazio - modo online)');
            return cache.addAll(urlsToCache);
        })
    );
    
    // Ativa imediatamente sem esperar
    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Assume controle imediatamente
    return self.clients.claim();
});

// Fetch - Sempre busca da rede (Network First - Online Only)
self.addEventListener('fetch', (event) => {
    // Ignorar requisições para domínios externos (CDN, APIs, etc)
    const url = new URL(event.request.url);
    const isExternal = url.origin !== self.location.origin;
    
    // Se for externo, deixar passar sem interceptar
    if (isExternal) {
        return;
    }
    
    // Interceptar apenas requisições do próprio domínio
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Sempre retorna a resposta da rede
                return response;
            })
            .catch((error) => {
                // Se falhar (sem internet), mostra mensagem de erro
                console.error('[Service Worker] Falha na requisição:', error);
                
                // Retorna página de erro offline apenas para navegação HTML
                if (event.request.mode === 'navigate') {
                    return new Response(
                        `<!DOCTYPE html>
                        <html lang="pt-BR">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Sem Conexão - Portal BI</title>
                            <style>
                                body {
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    min-height: 100vh;
                                    margin: 0;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    text-align: center;
                                    padding: 20px;
                                }
                                .container {
                                    max-width: 500px;
                                }
                                h1 {
                                    font-size: 4rem;
                                    margin: 0 0 20px 0;
                                }
                                h2 {
                                    font-size: 1.5rem;
                                    margin: 0 0 10px 0;
                                    font-weight: 600;
                                }
                                p {
                                    font-size: 1rem;
                                    opacity: 0.9;
                                    margin-bottom: 30px;
                                }
                                button {
                                    background: white;
                                    color: #667eea;
                                    border: none;
                                    padding: 12px 30px;
                                    font-size: 1rem;
                                    border-radius: 50px;
                                    cursor: pointer;
                                    font-weight: 600;
                                    transition: transform 0.2s;
                                }
                                button:hover {
                                    transform: scale(1.05);
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>📡</h1>
                                <h2>Sem Conexão com a Internet</h2>
                                <p>O Portal BI requer conexão com a internet para funcionar. Verifique sua conexão e tente novamente.</p>
                                <button onclick="window.location.reload()">🔄 Tentar Novamente</button>
                            </div>
                        </body>
                        </html>`,
                        {
                            headers: { 'Content-Type': 'text/html' }
                        }
                    );
                }
                
                // Para outros tipos de requisição, apenas rejeita
                return Promise.reject(error);
            })
    );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
