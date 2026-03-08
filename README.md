# DocMind — RAG Document Assistant

Ask anything from your documents using semantic search powered by **Gemini text-embedding-004** and **Claude Sonnet**. 100% free.

## Stack

| Layer | Technology |
|---|---|
| Embeddings | Google Gemini text-embedding-004 (free tier) |
| LLM | Claude Sonnet 4 |
| PDF parsing | Mozilla pdf.js (in-browser) |
| Vector search | Cosine similarity (pure JS) |
| Frontend | React + Vite |

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open http://localhost:5173

## Project structure

```
src/
  components/
    hooks/
      useAutoResizeTextarea.js   # Auto-growing textarea hook
      useFileInput.js            # File selection + validation hook
    ui/
      Badge.jsx                  # Pill badge component
      Button.jsx                 # Button with variants
    Navbar.jsx                   # Fixed nav with dark/light toggle + mobile menu
  lib/
    ThemeContext.jsx              # Global theme provider + tokens
    rag.js                       # Gemini embedding, cosine sim, Claude answer
  pages/
    Landing.jsx                  # Marketing landing page
    AppPage.jsx                  # RAG chat interface (phase 2)
  styles/
    index.css                    # Global reset, animations, utilities
  App.jsx                        # Router
  main.jsx                       # Entry point
```

## First commit steps

```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/docmind-rag.git
git add .
git commit -m "feat: project scaffold with landing page, routing, and theme system"
git branch -M main
git push -u origin main
```

## Roadmap

- [x] Landing page with scroll reveals
- [x] Collapsible mobile nav
- [x] Dark / light mode toggle
- [x] Shared theme context
- [x] RAG utility functions (Gemini embedding, cosine sim, Claude answer)
- [ ] Full chat interface with document upload
- [ ] Gemini embedding pipeline wired to UI
- [ ] Persistent storage via Supabase pgvector
