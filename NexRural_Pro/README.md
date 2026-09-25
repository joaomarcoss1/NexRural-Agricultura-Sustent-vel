# NexRural — Agricultura Sustentável (ODS 2)

Aplicação web (SPA) desenvolvida em **React + Vite**, dando continuidade ao projeto iniciado na Nota 1 (HTML5, CSS3 e Bootstrap), com foco no **ODS 2 — Fome Zero e Agricultura Sustentável**. A plataforma apoia agricultores familiares com informações climáticas, uma biblioteca de práticas sustentáveis e um canal de contato.

## Funcionalidades

- **Navegação SPA** com React Router (`HashRouter`), sem recarregar a página.
- **Consulta climática em tempo real** via [Open-Meteo API](https://open-meteo.com/) (Fetch API + tratamento de JSON), com estados de carregamento e de erro.
- **Biblioteca de recursos sustentáveis** com busca (tolerante a acentos), filtro de favoritos e modal de detalhes.
- **Favoritos persistentes** usando `localStorage` (gerenciamento de estado via Context API).
- **Formulário de contato** com validação client-side e feedback ao usuário.
- **Modo escuro/claro** com toggle global via Context API.
- **Layout responsivo**, testado em telas desktop e mobile.

## Stack técnica

- React 19 + Vite 8
- React Router DOM 7
- Context API para estado global (tema, favoritos)
- CSS custom (grid/flexbox, media queries)
- Fetch API + Open-Meteo (dados climáticos públicos, sem necessidade de chave)

## Como executar localmente

```bash
cd NexRural_Pro
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

## Publicação (deploy)

O projeto está configurado para publicação automática no **GitHub Pages** via GitHub Actions (`.github/workflows/deploy-pages.yml`): a cada push nas branches de desenvolvimento, o workflow instala as dependências, gera o build (`npm run build`) e publica o conteúdo de `NexRural_Pro/dist`.

Passo único necessário no GitHub (feito pelo dono do repositório): em **Settings → Pages → Build and deployment → Source**, selecionar **"GitHub Actions"**.

O projeto também pode ser publicado manualmente em **Vercel** ou **Netlify**: basta apontar o diretório raiz do build para `NexRural_Pro`, comando de build `npm run build` e diretório de saída `dist` (o arquivo `vercel.json` já inclui o rewrite de SPA necessário para o Vercel).

## Estrutura do projeto

```
NexRural_Pro/
├── src/
│   ├── components/   # Componentes reutilizáveis (cards, navbar, footer, modal)
│   ├── context/       # Context API (tema, favoritos)
│   ├── hooks/          # Hooks customizados (useFetch)
│   ├── pages/          # Páginas da SPA (Home, Sobre, Recursos, Consulta, Contato)
│   ├── routes/         # Configuração de rotas
│   ├── services/       # Integração com a API externa (Open-Meteo)
│   ├── utils/          # Funções utilitárias (validação de formulário)
│   └── data/            # Dados estáticos (biblioteca de recursos)
└── public/             # Favicon e assets estáticos
```
