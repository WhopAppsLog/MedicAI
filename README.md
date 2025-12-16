# MedicAI

Local development:

```bash
# install deps
npm install

# dev server
npm run dev

# build for production
npm run build

# preview the production build locally
npm run preview -- --port 5174
```

Vercel deployment:

- This repo is configured for a static Vercel build. `vercel.json` uses `@vercel/static-build` with `dist` as the output directory.
- Vercel will run `npm run vercel-build` (alias to `vite build`) and serve the `dist` folder.

If you want me to check the Vercel deployment status, I can try the Vercel CLI (requires authentication) or you can share the deployment URL.

Files of interest:
- `src/MedicAIFullClean.jsx` — cleaned full MedicAI component used by the app.
- `src/App.jsx` — app entry component.
- `vercel.json` — Vercel build config.
