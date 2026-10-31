# Contributing

This is a personal site, but it is built like a team codebase. These are the rules the code follows. Biome, TypeScript and the test suite enforce most of them, and the pre-commit hook runs the checks.

## Setup

```bash
pnpm install
cp .env.example .env.local   # optional: the visitor globe needs Upstash credentials
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm biome:fix
pnpm lint
pnpm test
pnpm build
```

## Project layout

Code lives in folders grouped by purpose under `src/`. Each folder has an `index.ts` barrel, and imports go through the `~/` alias (`import { Button } from '~/ui'`).

| Folder | Holds |
| --- | --- |
| `app/` | Next.js routes, layouts, metadata and global CSS |
| `api/` | Every network request, built on the shared `requestJson` helper. Nothing else calls `fetch`. |
| `components/` | App-specific components, one folder each, with the spec beside the component |
| `ui/` | shadcn/ui primitives. Use one of these before writing a new control. |
| `routes/` | Page-level compositions |
| `constants/` | Copy, URLs, config and every magic number, split by domain |
| `types/` | Shared domain types |
| `hooks/` | Shared React hooks |
| `utils/` | Pure, tested logic |
| `lib/` | Setup code and the shared test helpers |

## TypeScript

- Use `type`, never `interface`. The only exception is global declaration merging.
- No `any`. Take `unknown` and narrow it with a `parseX` or `isX` function.
- Use `import type` for type-only imports.
- Shared domain types live in `src/types`. Types used by one module stay in that module, unexported.
- Prefer literal unions to `string` when the set of values is closed.

## Components

- Arrow functions that take a destructured props object.
- The props type sits directly above the component and is named `ComponentNameProps`, with keys in alphabetical order.
- Named exports only, except where Next.js requires a default export (`page.tsx`, `layout.tsx`, and so on).
- Keep components small. Move reusable logic into a hook or a function in `utils/`.
- Use semantic elements, alt text and full keyboard support. Every interactive element shows the shared focus outline.

## Naming

| Kind | Pattern |
| --- | --- |
| Predicates | `isX`, `hasX` |
| Parsing untrusted input | `parseX` |
| Pure derivations | `xFor`, `xFrom`, `toX` |
| Display strings | `formatX` |
| Constants | `SCREAMING_SNAKE`, domain first, unit last (`AUTO_SCROLL_RESUME_MS`) |
| Copy constants | `_HEADING`, `_BODY`, `_LABEL`. `_TITLE` is only for document and meta titles. |
| Class-name constants | `_CLASS` suffix |
| Refs | `xRef` |
| Handlers | `handleX` inside a component, `onX` for props |

Numbers that carry a unit say so in the name: `Ms`, `Px`, `Deg`, `PerSecond`, `Ratio`. Code and copy use US spelling. Identifiers never name a person; they describe what the thing is.

## Styling

- Tailwind v4. Design tokens, breakpoints and easings are defined once in `src/app/globals.css`.
- Use semantic tokens (`background`, `foreground`, `accent`) rather than raw palette colors.
- Static classes are a plain string. Anything combined or conditional goes through `cn()`.
- Biome sorts class names. Run `pnpm biome:fix` instead of ordering them by hand.
- Prefer CSS for animation. When JavaScript drives motion, it respects `prefers-reduced-motion` and the site's pause control.

## Logic

- Use `const` arrow functions, with guard clauses and early returns.
- Use `for…of` for side effects and `map`/`filter` for transforms. Never `.forEach`.
- Use `??` for defaults. No nested ternaries.
- Every effect cleans up after itself: listeners, observers, timers and animation frames.
- Don't add a dependency when a few lines of code will do.

## Comments

Don't write them. If code needs a comment to be understood, rename or split it until it doesn't. The only exceptions are tool directives that have to be comments, like a justified `biome-ignore`.

## Tests

- Every component, hook, util and route has a `Name.spec.ts(x)` beside it.
- Use Vitest and React Testing Library. Query the way a user would, by role, label or text, and assert with jest-dom matchers.
- Import expected copy and config from `~/constants` instead of retyping it.
- Shared fakes come from `src/lib/testing.ts`: `stubIntersectionObserver`, `stubAnimationFrames`, `stubMediaQueries`, `stubReducedMotion` and `stubFetchJson`. The global setup in `src/lib/setupTests.ts` resets them after every test.
- Use `userEvent.setup()` for interactions and `it.each` for three or more parallel cases. Never sleep.
