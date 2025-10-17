# Rapid Prototype Workflow Instructions

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project_root}/bmad/rapid-proto/workflows/rapid-prototype/workflow.yaml</critical>

<workflow>

<step n="1" goal="Determine execution mode and gather project info">

<check if="mode == 'quick'">
  <action>Use default project name: "prototype-{{date}}"</action>
  <action>Use current directory as target location</action>
  <action>Skip all optional questions</action>
  <action>Proceed directly to scaffolding with defaults</action>
</check>

<check if="mode != 'quick'">
  <ask response="project_name">What's the name of your prototype? (e.g., "my-dashboard", "booking-app")</ask>
  <ask response="project_description">Brief description (one sentence) of what this prototype does:</ask>
  <ask response="target_location">Where should I scaffold this? (default: current directory)</ask>
</check>

<action>Store project metadata for documentation</action>
<action>Validate target location exists or can be created</action>

</step>

<step n="2" goal="Scaffold Next.js project structure">

<action>Create Next.js 15 project with TypeScript and App Router</action>
<action>Run: npx create-next-app@latest {{project_name}} --typescript --tailwind --app --no-src-dir --import-alias "@/*"</action>

<critical>Project structure to create:</critical>

```
{{project_name}}/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles with Tailwind
├── components/
│   ├── ui/                  # Shadcn UI components
│   └── shared/              # Shared custom components
├── lib/
│   ├── utils.ts             # Utility functions
│   └── mock-data/           # Mock data infrastructure
│       ├── index.ts         # Central export
│       └── schemas/         # Type definitions
├── public/                  # Static assets
├── docs/
│   └── rapid-prototype/     # Living documentation
│       ├── project-brief.md
│       ├── build-log.md
│       ├── changes-log.md
│       ├── refactor-log.md
│       └── context-summary.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .gitignore
```

</step>

<step n="3" goal="Install and configure Shadcn UI">

<action>Initialize Shadcn UI in the project</action>
<action>Run: npx shadcn@latest init -d</action>
<action>Configure components.json with default settings</action>

<action>Install essential Shadcn components:</action>
- button
- card
- input
- label
- select
- dialog
- dropdown-menu
- avatar
- badge
- separator

<action>Run: npx shadcn@latest add button card input label select dialog dropdown-menu avatar badge separator</action>

</step>

<step n="4" goal="Configure Tailwind CSS v4+">

<action>Update tailwind.config.ts with custom theme:</action>

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

</step>

<step n="5" goal="Setup TypeScript strict mode">

<action>Update tsconfig.json for strict type checking:</action>

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

</step>

<step n="6" goal="Create mock data infrastructure">

<action>Create lib/mock-data/index.ts as central mock data hub:</action>

```typescript
// Mock Data Infrastructure
// All mock data exports are centralized here

export * from './schemas';
export * from './users';
export * from './products';
// Add more as needed
```

<action>Create lib/mock-data/schemas/index.ts for type definitions:</action>

```typescript
// Type-safe schemas for mock data

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

// Add more schemas as needed
```

<action>Create example mock data file lib/mock-data/users.ts:</action>

```typescript
import { User } from './schemas';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
  },
];
```

</step>

<step n="7" goal="Create living documentation system">

<action>Create docs/rapid-prototype/ directory</action>

<action>Create docs/rapid-prototype/project-brief.md:</action>

```markdown
# {{project_name}} - Project Brief

**Created:** {{date}}
**Scaffolded by:** Atlas (Prototype Architect)

## Project Overview

{{project_description}}

## Tech Stack

- Framework: Next.js 15+ (App Router, Server Components)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v4+
- UI Components: Shadcn UI
- Mock Data: Type-safe infrastructure in lib/mock-data/

## Project Structure

[Document the key folders and their purposes]

## Initial Setup Decisions

- App Router for routing
- Server Components by default
- Strict TypeScript configuration
- Shadcn UI for component library
- Centralized mock data system

## Next Steps

1. Use Forge (Builder) to add features and components
2. Use Sentinel (QA Refactor) to review and optimize
3. Reference this brief for project context
```

<action>Create docs/rapid-prototype/build-log.md:</action>

```markdown
# Build Log

Track all features, components, and pages built by Forge (Builder).

## Format
**Date** | **Feature/Component** | **Description** | **Files Changed**

---

## Initial Scaffold - {{date}}

- **Scaffolded by:** Atlas (Prototype Architect)
- **Project:** {{project_name}}
- **Structure:** Next.js 15 + TypeScript + Tailwind + Shadcn UI
- **Status:** Ready for development

---
```

<action>Create docs/rapid-prototype/changes-log.md:</action>

```markdown
# Changes & Fixes Log

Track all bug fixes and modifications.

## Format
**Date** | **Issue** | **Resolution** | **Files Changed**

---

_No changes yet - initial scaffold complete._

---
```

<action>Create docs/rapid-prototype/refactor-log.md:</action>

```markdown
# Refactor Log

Track all code improvements and refactors by Sentinel (QA Refactor).

## Format
**Date** | **Refactor** | **Rationale** | **Impact**

---

_No refactors yet - awaiting initial implementation._

---
```

<action>Create docs/rapid-prototype/context-summary.md:</action>

```markdown
# Context Summary

**Last Updated:** {{date}}
**Current State:** Initial scaffold complete

## Quick Overview

- **Project:** {{project_name}}
- **Description:** {{project_description}}
- **Tech Stack:** Next.js 15, TypeScript, Tailwind v4, Shadcn UI

## What's Been Built

- Initial Next.js scaffold with App Router
- Shadcn UI components installed
- Mock data infrastructure created
- Living documentation system initialized

## What's Next

Ready for feature development. Use Forge (Builder) to start adding components and pages.

## Recent Activity

- {{date}}: Project scaffolded by Atlas

---

**For Agents:**
- Read project-brief.md for project context
- Read build-log.md for implementation history
- Read refactor-log.md for code quality improvements
- Update this summary after significant changes
```

</step>

<step n="8" goal="Initialize git repository">

<action>Initialize git in project directory</action>
<action>Run: git init</action>
<action>Create initial commit with scaffold</action>
<action>Run: git add . && git commit -m "Initial scaffold by Atlas (Rapid Prototype)"</action>

</step>

<step n="9" goal="Install dependencies and verify setup">

<action>Install all npm packages</action>
<action>Run: npm install</action>

<action>Verify build works</action>
<action>Run: npm run build</action>

<check if="build fails">
  <action>Fix any build errors</action>
  <action>Document fixes in changes-log.md</action>
  <action>Retry build</action>
</check>

</step>

<step n="10" goal="Generate handoff summary">

<action>Display completion summary:</action>

```
✅ Prototype Scaffolded: {{project_name}}
📁 Location: {{target_location}}/{{project_name}}
🏗️ Structure: Next.js 15 + TypeScript + Tailwind v4 + Shadcn UI
📋 Documentation: docs/rapid-prototype/
🔄 Git: Initialized with initial commit
```

<action>Show next steps:</action>

**Next Steps:**

1. **Start development server:**
   ```
   cd {{project_name}}
   npm run dev
   ```

2. **Build features with Forge:**
   - Use `*component` to create UI components
   - Use `*page` to add new pages
   - Use `*feature` for complete features

3. **Review quality with Sentinel:**
   - Use `*review` for code review
   - Use `*refactor` for improvements
   - Use `*test` to add tests

**Context Files Created:**
- `docs/rapid-prototype/project-brief.md` - Project overview
- `docs/rapid-prototype/build-log.md` - Implementation tracking
- `docs/rapid-prototype/context-summary.md` - Current state

**Ready to build!** 🚀

</step>

</workflow>
