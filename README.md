
# The Pocket Producer — Release 1.1 (Full Project)

## What’s inside
- Vite + React + TypeScript + Tailwind (minimal UI kit)
- Clickable tags on cards; Pros/Cons rendering
- Simplified compass splash; pastel peach accent
- Netlify-ready (`base: '/'`) with SPA routing via `public/_redirects`
- `@` path alias mapped to `/src`

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
# output in dist/
```

## Deploy to Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Optional env var: `NODE_VERSION=20`
- For deep links: `_redirects` file already included

## Notes
- Add your thumbnails under `public/thumbnails` and reference them as `/thumbnails/your-file.webp`.
- Add favicons to `public/` and reference them in `index.html` if desired.
