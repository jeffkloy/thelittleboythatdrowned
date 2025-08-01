# The Little Boy That Drowned — React 19 + Vite + TypeScript

A React 19.1 application preserving the original visual design, content, and layout. Deployed to GitHub Pages under the repository subpath.

## Tech Stack

- React 19.1 (function components + hooks)
- Vite (dev/build)
- TypeScript (strict-ready)
- React Router (BrowserRouter with basename)
- GitHub Pages (gh-pages branch via GitHub Actions)
- Accessibility-focused mobile menu (aria-expanded, focus management, ESC, scrim, scroll lock)

## Project Structure

- `public/`
  - `poems/` — Markdown poems (includes `poems.json`)
  - `analyses/` — Markdown analyses
  - `404.html` — SPA fallback for GitHub Pages
- `src/`
  - `components/` — Header, Particles, TagFilters, PoemList, PoemView
  - `hooks/` — `usePoems`, `usePoem`
  - `lib/` — `markdown.ts` (parsers)
  - `styles/` — `globals.css` (copied from original `styles.css`)
  - `App.tsx`, `main.tsx`

## Local Development

1. Install dependencies:
   npm install

2. Start dev server:
   npm run dev

3. Open the local URL shown in the terminal (e.g. http://localhost:5173/thelittleboythatdrowned/)

If you see the Vite starter screen, ensure `src/App.tsx` and `src/main.tsx` are the versions in this repo and that `src/styles/globals.css` exists.

## Build and Preview

1. Build:
   npm run build

2. Preview production build:
   npm run preview

## Deployment (GitHub Pages)

- Base path configured in [`vite.config.ts`](vite.config.ts) to `/thelittleboythatdrowned/`.
- SPA fallback at [`public/404.html`](public/404.html).
- GitHub Action at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys to `gh-pages` on push to `main`.

To trigger deployment:
- Commit and push to `main`. The workflow will build and publish to `gh-pages`.

If using a custom domain (CNAME):
- Add `CNAME` file in `public/` and adjust `vite.config.ts` `base` to `'/'`. Update the 404 redirect script accordingly.

## Data

- Poems list loaded from `public/poems/poems.json` (array of `{ filename, tags }`).
- Poem content fetched from `public/poems/{filename}`.
- Analysis content fetched from `public/analyses/{Title} - Analysis.md` (optional).
- Markdown parsing implemented in [`src/lib/markdown.ts`](src/lib/markdown.ts).

## Accessibility

- Hamburger menu: aria-controls, aria-expanded, ESC to close, focus moved to menu on open and back to button on close, outside click via scrim, scroll lock on html/body.

## Performance

- Next-poem prefetch on selection to reduce perceived latency.
- Consider future enhancements: lazy-load analysis UI, code-split views, and prefetch hints.

## Scripts

- `dev` — start Vite dev server
- `build` — build production bundle
- `preview` — preview production build
- `lint`, `format`, `typecheck` — to be added if ESLint/Prettier/TS strict are enabled

## Roadmap / TODO

- Enable TS strict in `tsconfig.json` and add `eslint.config.js` and Prettier config with corresponding npm scripts.
- Add code-splitting for analysis view with `React.lazy`.
- Document cross-browser testing results and any follow-up fixes.
