# Book AI

Book AI is a Next.js app for chatting with books using AI-driven conversations.

Current project status: base UI scaffold with shadcn/ui integration and a starter home page.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- ESLint + Prettier

## Requirements

- Node.js 20+
- pnpm 10+

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Open the app:

```text
http://localhost:3000
```

## Scripts

- `pnpm dev` - Run local dev server
- `pnpm build` - Create production build
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint checks
- `pnpm format` - Format code with Prettier

## Project Structure

```text
app/
	layout.tsx      # Root layout and metadata
	page.tsx        # Home page
components/
	ui/             # shadcn/ui components
lib/
	utils.ts        # Shared utilities
public/           # Static assets
```

## Formatting and Linting

This project uses:

- ESLint for code quality
- Prettier for formatting via `.prettierrc`

Run both before commits:

```bash
pnpm lint
pnpm format
```
