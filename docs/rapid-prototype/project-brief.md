# assessment-prototype - Project Brief

**Created:** 2025-10-17
**Scaffolded by:** Atlas (Prototype Architect)

## Project Overview

A prototype for a back office planning system. Building out a new layout for assessing planning applications (focused primarily for pre-applications, but optimised for full applications).

## Tech Stack

- Framework: Next.js 15+ (App Router, Server Components)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v4+
- UI Components: Shadcn UI
- Mock Data: Type-safe infrastructure in lib/mock-data/

## Project Structure

```
assessment-prototype/
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles with Tailwind
├── components/
│   ├── ui/                     # Shadcn UI components
│   └── shared/                 # Shared custom components
├── lib/
│   ├── utils.ts                # Utility functions
│   └── mock-data/              # Mock data infrastructure
│       ├── index.ts            # Central export
│       ├── schemas/            # Type definitions
│       ├── users.ts            # Mock users
│       └── applications.ts     # Mock planning applications
├── public/                     # Static assets
├── docs/rapid-prototype/       # Living documentation
└── [config files]
```

## Initial Setup Decisions

- App Router for routing (Next.js 15)
- Server Components by default
- Strict TypeScript configuration with noUncheckedIndexedAccess
- Shadcn UI for component library (10 essential components installed)
- Centralized mock data system with planning application schemas

## Domain-Specific Setup

Mock data infrastructure includes:
- Planning application types (pre-application, full-application)
- Application statuses (pending, under-review, approved, rejected)
- Sample applications with realistic data
- User roles for planning officers

## Next Steps

1. Use Forge (Builder) to add features and components
2. Build out assessment layouts and workflows
3. Use Sentinel (QA Refactor) to review and optimize
4. Reference this brief for project context

## Key Features to Build

- Application listing and filtering
- Detailed application assessment views
- Status management and workflow
- Document management for applications
- Assignments and user management
