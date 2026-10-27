# CLAUDE.md

Personal website built with Next.js (App Router), React 19, TypeScript, Tailwind v4 and shadcn/ui. Tooling is pnpm, Biome and Vitest.

## How to Work

Act like a senior developer: make decisions with confidence, own the result, and hold the work to a high bar.

1. **Plan first.** Before writing code, read the relevant files, understand how they fit together, and decide on an approach. For anything beyond a small change, outline the plan (files to touch, why, and any risks) before starting.
2. **Be decisive.** When there's a sensible default, pick it and say why in a sentence; don't present a list of options. Only ask a question when the answer would actually change what you build. If you think a request is a bad idea, say so directly and propose something better.
3. **Check your work.** When you finish, review your own diff the way a reviewer would, then run `pnpm biome:fix`, `pnpm lint`, `pnpm test`, and `pnpm build` if you touched routing or config. Fix any failures before calling the task done.
4. **Report honestly.** Say what changed, what you verified, and anything you skipped or are unsure of. Don't claim something works if you haven't checked it.

## Commands

- `pnpm dev`: start the dev server (Turbopack)
- `pnpm build`: production build
- `pnpm test`: run Vitest
- `pnpm test:coverage`: run tests with coverage
- `pnpm lint` / `pnpm format`: Biome lint and format checks (both run in the pre-commit hook)
- `pnpm biome:fix`: auto-fix lint and formatting

## Project Structure

Code goes in folders grouped by purpose under `src/`. Each folder has an `index.ts` barrel that re-exports its contents, and you import through the `~/` alias (e.g. `import { Card } from '~/ui'`).

- `app/`: Next.js routes, layouts and global CSS
- `components/`: app-specific components
- `ui/`: reusable UI primitives (shadcn/react-bits)
- `routes/`: page-level compositions
- `constants/`: constant values (URLs, config)
- `types/`: shared types
- `utils/` and `lib/`: helpers and setup

Every component gets its own folder, so its test can sit next to it:

```
src/components/Header/
  Header.tsx
  Header.spec.tsx
```

When you add a component, export it from its folder's `index.ts`.

## TypeScript Rules

- **Use only `type`, never `interface`.** The one exception is global declaration merging (e.g. `declare global { interface Window { ... } }`), which needs `interface`.
- Don't use `any`. Prefer `unknown` and narrow it.
- Use `import type` / inline `type` for type-only imports.

## Components

- Write components as arrow functions that take a destructured props object.
- Declare the props type directly above the component and name it `ComponentNameProps`:

```tsx
type HeaderProps = {
  title: string;
  subtitle?: string;
};

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (/* ... */);
};
```

- Use named exports, not default exports, except where Next.js requires a default export (`page.tsx`, `layout.tsx`, etc.).

## Testing

- Name tests `ComponentName.spec.tsx` (or `.spec.ts`) and keep them next to the file they test.
- Use Vitest and React Testing Library. Query by role or text the way a user would, not by implementation details.

## Biome

- All code must pass `pnpm lint` and `pnpm format` with no errors or warnings, and no `biome-ignore` unless you can justify it in a comment.
- Code style: single quotes (JS and JSX), 2-space indentation, sorted imports, sorted JSX attributes and object keys.
- After making changes, run `pnpm biome:fix` and then `pnpm lint` to verify.

## Quality and Performance

- Keep components small and focused, and put reusable logic in hooks or `utils/`.
- Keep values out of components: put magic numbers and strings in `constants/`.
- Avoid unnecessary re-renders. Keep state as local as possible, don't create new objects or functions in render when that would break memoization downstream, and use `useMemo`/`useCallback` only where they help measurably.
- Clean up effects (event listeners, animations, GSAP/Vanta instances, timers).
- Use `next/image` for images and lazy-load heavy or below-the-fold content.
- Prefer CSS/Tailwind for animation over JS when it's practical.
- Don't add dependencies when a small amount of code will do.
- Write accessible markup: semantic elements, alt text and keyboard support.
