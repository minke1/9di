# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router with TypeScript, Tailwind CSS 4, and shadcn/ui components. It's a board/task management application with Supabase backend integration and markdown editing capabilities.

**GitHub Repository**: https://github.com/minke1/9di.git

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

**Important**: After changing `.env.local` environment variables, restart the dev server for changes to take effect.

## Git Workflow

**Remote Repository**: https://github.com/minke1/9di.git

### Pushing Changes to GitHub

```bash
# Check status and stage files
git status
git add .

# Commit with descriptive message
git commit -m "Your commit message"

# Push to GitHub
git push origin master
```

When committing code, always reference the GitHub repository URL above for push operations.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 + SCSS modules (mixed approach)
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Database**: Supabase
- **Toast Notifications**: Sonner (not shadcn/ui toast hook)
- **Markdown Editor**: @uiw/react-markdown-editor

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with SideNavigation & Toaster
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx           # About page
│   └── create/page.tsx          # Create page with BasicBoard
├── components/
│   └── ui/
│       ├── [component].tsx      # shadcn/ui base components
│       └── common/              # Custom composite components
│           ├── navigation/      # SideNavigation component
│           ├── dialog/          # MarkdownDialog with Supabase integration
│           ├── calendar/        # LabelCalendar component
│           └── board/           # BasicBoard component
├── lib/
│   └── utils.ts                 # Utility functions (cn helper)
├── utils/
│   └── supabase.ts              # Supabase client singleton
└── styles/
    └── globals.css              # Global Tailwind styles
```

### Key Architectural Patterns

**1. Component Styling Strategy**
- **shadcn/ui components**: Pure Tailwind with `cn()` utility
- **Custom components**: SCSS modules (e.g., `MarkdownDialog.module.scss`)
- **Naming convention**: BEM-like in SCSS (`.dialog__titleBox__input`)

**2. Supabase Integration**
- Centralized client at `src/utils/supabase.ts`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Client-side usage only (currently no server-side data fetching)
- Database table: `todos` (schema: `title`, `content`)

**3. Toast Notifications**
- Uses `sonner` library, NOT shadcn/ui's `useToast` hook
- Import: `import { toast } from "sonner"`
- Usage: `toast.error()`, `toast.success()`, `toast.info()`
- Toaster component mounted in root layout

**4. Path Aliases**
- `@/*` → `./src/*` (configured in tsconfig.json)
- shadcn/ui specific aliases in components.json:
  - `@/components` → components directory
  - `@/lib/utils` → utility functions
  - `@/components/ui` → UI components

**5. Font Configuration**
- Uses Next.js `next/font` with Google Fonts
- Primary: Roboto (weights: 400-900)
- Monospace: Geist Mono
- CSS variables: `--font-roboto`, `--font-geist-mono`

## Environment Setup

Required environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Critical**: Next.js requires `NEXT_PUBLIC_` prefix for client-side environment variables. The prefix `REACT_APP_` will NOT work.

## Component Guidelines

### Adding shadcn/ui Components
shadcn/ui is configured with:
- Style: "new-york"
- Base color: "slate"
- Icon library: lucide-react
- CSS variables: enabled

Components are added to `src/components/ui/` and should follow shadcn/ui conventions.

### Client vs Server Components
- **Client components** (marked with `"use client"`):
  - All interactive components using hooks
  - Components using Supabase client
  - MarkdownDialog, SideNavigation
- **Server components** (default):
  - Layout and page files without interactivity
  - Currently minimal server-side data fetching

### Dialog Pattern
`MarkdownDialog` demonstrates the composite pattern:
- Uses shadcn/ui Dialog primitives (DialogTrigger, DialogContent, etc.)
- Integrates custom components (LabelCalendar, MarkdownEditor)
- Handles Supabase mutations with error handling
- Uses Sonner for toast notifications

## Database Schema

Current Supabase table structure:

**todos**
- `title`: string
- `content`: string (markdown content)

Insert pattern used in MarkdownDialog.tsx:
```typescript
const { data, error, status } = await supabase
  .from('todos')
  .insert([{ title, content }])
  .select()
```

## Common Patterns

### Error Handling with Toast
```typescript
if (!validation) {
  toast.error("Error message");
  return;
}

const { data, error } = await supabase.from('table').insert(data);

if (error) {
  toast.error(error.message);
  return;
}

toast.success('Success message');
```

### SCSS Module Import
```typescript
import styles from "./Component.module.scss";
// Usage: className={styles.className}
```

### Mixed Tailwind + SCSS
Components may use both approaches:
- Tailwind for utility styling
- SCSS modules for component-specific complex styles
