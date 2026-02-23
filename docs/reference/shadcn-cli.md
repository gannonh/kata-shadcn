# Shadcn CLI

## Overview

Integration with shadcn CLI v3.0, featuring namespaced registries and private registry authentication for accessing pro blocks and components.

## Setup

### 1. Configure components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-vega",
  "rsc": false,
  "registries": {
    "@kata-shadcn": {
      "url": "https://shadcn-registry-eight.vercel.app/r/{name}.json",
      "headers": {
        "x-registry-token": "${REGISTRY_TOKEN}"
      }
    }
  }
}
```

### 2. Set REGISTRY_TOKEN

Add `REGISTRY_TOKEN=<token>` to `.env` (obtain from the registry admin).

### 3. Install Components

```bash
npx shadcn add @kata-shadcn/hero1
npx shadcn add @kata-shadcn/pricing3
```

## Supported Technologies

shadcn/ui, Tailwind CSS, React, Astro, Next.js, Figma
