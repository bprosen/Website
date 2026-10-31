# bprosen.dev

The personal site of Ben Edgar-Prosen, a Software Developer at Taiv in Winnipeg. It's a single, statically generated page with an interactive globe, a scroll-linked work timeline, and a light and dark theme.

**Live:** [bprosen.dev](https://bprosen.dev)

## Highlights

- **Interactive globe.** Land and visitor dots are drawn on a `<canvas>`, and the markers are DOM elements moved with compositor-only transforms. The render loop keeps its state in refs (no React re-renders per frame) and stops when the globe is off screen. You can drag it with a mouse or by touch, or spin it with the arrow keys. On phones, vertical swipes still scroll the page.
- **Fast by default.** Every route is pre-rendered as static HTML. Images are served through `next/image` and lazy-loaded. Gameplay clips are MP4s that only download and play while visible. Measured with Chrome emulating a slow phone (4× CPU throttling, 4 Mbps): about 405 KB on first load, main content in about 0.7 s, and no layout shift.
- **Shareable sections.** `/work`, `/about` and `/contact` render the same page and jump to their section. As you scroll, the URL and tab title follow the section you're reading, using `history.replaceState`.
- **Theming.** The light and dark themes are built on CSS variables. A small inline script applies the saved theme before first paint, so there's no flash. Switching themes plays a circular reveal using the View Transitions API.
- **Accessible.** Text passes WCAG AA contrast in both themes. The page has a skip link, visible focus rings and labeled controls, and every animation respects `prefers-reduced-motion`.
- **Recent visitors.** `POST /api/visitors` reads Vercel's geo headers, rounds each location to a 1° cell (about 100 km), and stores it in Upstash Redis. It skips recording when Do Not Track or Global Privacy Control is set.

## Stack

Next.js (App Router), React 19, TypeScript, Tailwind CSS v4 and shadcn/ui. Tooling is pnpm, Biome and Vitest with React Testing Library.

## Getting started

```bash
pnpm install
pnpm dev
```

The visitors API needs Upstash Redis credentials. Copy `.env.example` to `.env` and fill in `UPSTASH_KV_REST_API_URL` and `UPSTASH_KV_REST_API_TOKEN`. Without them, the API returns an empty list and the site works normally.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm test` | Run the test suite in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:ui` | Open the Vitest UI with coverage |
| `pnpm lint` / `pnpm format` | Biome checks (both run in the pre-commit hook and CI) |
| `pnpm biome:fix` | Auto-fix lint and formatting |

## Project structure

```
src/
  app/         Routes, layout, API route, icons, share image, robots and sitemap
  api/         Network layer: requestJson and per-endpoint functions
  assets/      Fonts used to render the share image
  components/  One folder per component, each with a spec
  constants/   Copy, links, tuning values and theme constants, one module per concern
  hooks/       Shared React hooks
  lib/         Class-name helper, share-image asset loading and test setup
  routes/      Page compositions
  types/       Shared domain types
  ui/          shadcn/ui primitives (flat files, as the shadcn CLI generates them)
  utils/       Pure, tested logic (globe projection, motion, sections, theme)
```

## Testing

Every component, hook, util and API route has a spec next to it. The suite has 482 tests, with 99% statement and 96% branch coverage of `components`, `hooks`, `utils`, `api`, `constants` and `routes` (`app`, `lib`, `ui` and `types` are tested but excluded from the coverage report). The globe's physics and projection are pure functions, so they're unit-tested directly, and integrity specs check that every referenced image exists at its declared size.

## Conventions

The code style and project rules are in [`CLAUDE.md`](./CLAUDE.md). In short: `type` over `interface`, arrow-function components, imports through barrels, no comments, and all network requests go through `src/api`.

## License

[MIT](./LICENSE)
