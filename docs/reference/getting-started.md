# Getting Started with Shadcn Blocks

## Overview

Shadcn Blocks is a library of pre-built React components styled with Tailwind CSS and shadcn/ui.

## Prerequisites

- React
- Tailwind CSS
- shadcn/ui

Projects must have two files:
1. `components.json` — CLI configuration
2. `globals.css` — CSS variables for theming

## Installation

### CLI (Recommended)

```bash
npx shadcn add @kata-shadcn/hero1
```

Alternative package managers:

```bash
pnpm dlx shadcn add @kata-shadcn/hero1
yarn dlx shadcn add @kata-shadcn/hero1
bunx shadcn add @kata-shadcn/hero1
```

Requires `components.json` configured for the Kata registry with `REGISTRY_TOKEN` in `.env`. See README for setup.

### Copy & Paste

Copy source code from the Code tab on block pages. Requires:
- Manual NPM package installation
- Separate installation of component dependencies

## CLI Advantages

- Respects project-specific `components.json` settings
- Selects appropriate UI libraries (Radix or Base UI)
- Handles dependencies automatically
- Installs required npm packages

## Project Setup

### Tailwind Configuration

```bash
npm install @tailwindcss/typography tw-animate-css
```

Download the provided `globals.css` file containing CSS variables for light and dark mode.
