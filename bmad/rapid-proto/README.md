# Rapid Prototype

Zero-friction Next.js prototype scaffolding system with standardized tech stack, automated mock data infrastructure, and context-aware documentation for seamless AI agent collaboration.

## Overview

The **Rapid Prototype** module eliminates all the friction from spinning up Next.js prototypes. No more repetitive setup, inconsistent structures, or context loss between sessions. Just clean architecture, standardized patterns, and intelligent agents that track everything.

**The Challenge It Solves:**
- ❌ Repetitive manual setup for every prototype
- ❌ Inconsistent folder structures across projects
- ❌ Mock data scattered everywhere
- ❌ AI agents losing context between sessions
- ❌ Difficult pivots with no change tracking

**The Solution:**
- ✅ Instant scaffolding with standardized tech stack
- ✅ Organized structure that scales
- ✅ Type-safe mock data infrastructure
- ✅ Living documentation for perfect handoffs
- ✅ Context tracking that keeps agents in sync

## Installation

```bash
bmad install rapid-proto
```

Or run the BMAD Method installer and select "Compile Agents" to build the module.

## Components

### Agents (3)

#### 1. **Atlas** - Prototype Architect 🏗️
**Role:** Master scaffolder and setup orchestrator

**What Atlas Does:**
- Scaffolds complete Next.js 15 projects instantly
- Sets up TypeScript strict mode, Tailwind v4, Shadcn UI
- Creates mock data infrastructure
- Initializes living documentation system
- Generates project briefs for team alignment

**Commands:**
- `*scaffold` - Full interactive setup with questions
- `*quick-start` - Instant scaffold with smart defaults
- `*status` - Show current project structure
- `*pivot` - Document major direction changes
- `*handoff` - Generate context for Builder

**When to use Atlas:**
Starting a new prototype or setting up project foundations.

---

#### 2. **Forge** - Builder ⚒️
**Role:** Feature implementation specialist

**What Forge Does:**
- Builds components, pages, and features
- Integrates mock data with UI
- Reads project context before starting work
- Documents every change to build-log.md
- Maintains type safety and patterns

**Commands:**
- `*component` - Create UI components
- `*page` - Build new pages with routing
- `*feature` - Implement complete features
- `*mock-data` - Create/update mock data
- `*integrate` - Connect data to components
- `*fix` - Fix bugs and log resolutions
- `*context` - Read current project state
- `*log` - Show build history

**When to use Forge:**
Building features, creating components, or implementing functionality.

---

#### 3. **Sentinel** - QA Refactor 🛡️
**Role:** Quality assurance and code guardian

**What Sentinel Does:**
- Reviews code for best practices
- Refactors for performance and maintainability
- Fixes TypeScript type safety issues
- Adds tests for critical paths
- Documents all improvements to refactor-log.md

**Commands:**
- `*review` - Review recent changes
- `*refactor` - Improve code quality
- `*types` - Fix TypeScript issues
- `*test` - Add or improve tests
- `*optimize` - Performance optimization
- `*audit` - Full quality audit
- `*lint` - Fix code style
- `*report` - Generate quality metrics

**When to use Sentinel:**
After building features, before major milestones, or when quality needs attention.

---

### Workflows (1)

#### **rapid-prototype** - Main Scaffolding Workflow

**Purpose:** Automated Next.js prototype setup

**What it creates:**
- Next.js 15 project (App Router, Server Components)
- TypeScript strict mode configuration
- Tailwind CSS v4+ with custom theme
- Shadcn UI with essential components
- Mock data infrastructure (lib/mock-data/)
- Living documentation system (docs/rapid-prototype/)
- Git repository with initial commit

**Execution Modes:**
- **Interactive:** Asks questions about project details
- **Quick:** Instant scaffold with smart defaults

**Output Structure:**
```
your-prototype/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # Shadcn components
│   └── shared/            # Custom components
├── lib/
│   ├── utils.ts
│   └── mock-data/         # Type-safe mock data
├── docs/
│   └── rapid-prototype/   # Living docs
│       ├── project-brief.md
│       ├── build-log.md
│       ├── changes-log.md
│       ├── refactor-log.md
│       └── context-summary.md
└── [standard Next.js files]
```

---

## Tech Stack

- **Framework:** Next.js 15+ (App Router, Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4+
- **UI Components:** Shadcn UI (pre-installed essentials)
- **Data:** Type-safe mock data infrastructure

## Quick Start

### 1. Load Atlas (Prototype Architect)

```
Load the prototype-architect agent
```

### 2. Scaffold Your Prototype

**Option A - Quick Start (instant):**
```
*quick-start
```

**Option B - Interactive (with questions):**
```
*scaffold
```

### 3. Start Development Server

```bash
cd your-prototype-name
npm run dev
```

### 4. Build Features with Forge

```
Load the builder agent
*component    # Create a new component
*page         # Add a new page
*feature      # Build a complete feature
```

### 5. Ensure Quality with Sentinel

```
Load the qa-refactor agent
*review       # Review recent code
*refactor     # Improve quality
*test         # Add tests
```

## The Context Handoff System

The secret to seamless agent collaboration:

### Documentation Files

All prototypes maintain living documentation in `docs/rapid-prototype/`:

1. **project-brief.md** - Project overview and context
2. **build-log.md** - Features and components built by Forge
3. **changes-log.md** - Bug fixes and modifications
4. **refactor-log.md** - Quality improvements by Sentinel
5. **context-summary.md** - Current state snapshot

### How It Works

1. **Atlas** scaffolds → Creates project-brief.md
2. **Forge** reads brief → Builds features → Logs to build-log.md
3. **Sentinel** reads build-log → Refactors → Logs to refactor-log.md
4. **Next session:** Any agent reads context-summary.md → Continues seamlessly

**Result:** Zero context loss, perfect handoffs, agents always in sync.

## Module Structure

```
bmad/rapid-proto/
├── agents/
│   ├── prototype-architect.agent.yaml    # Atlas
│   ├── builder.agent.yaml                # Forge
│   └── qa-refactor.agent.yaml            # Sentinel
├── workflows/
│   └── rapid-prototype/
│       ├── workflow.yaml
│       ├── instructions.md
│       └── checklist.md
├── _module-installer/
│   └── install-module-config.yaml
├── config.yaml
└── README.md
```

## Configuration

Module configuration: `bmad/rapid-proto/config.yaml`

**Key Settings:**
- `module_code`: rapid-proto
- `tech_stack`: Next.js 15, TypeScript, Tailwind v4, Shadcn UI
- `context_system`: Documentation paths for agent handoffs
- `output_folder`: Default location for generated docs

## Examples

### Example 1: Quick Prototype for Dashboard

```
1. Load Atlas
2. *quick-start
3. cd prototype-2025-10-07
4. npm run dev
5. Load Forge
6. *page dashboard
7. *component stats-card
8. Load Sentinel
9. *review
```

**Result:** Dashboard prototype with stats card, reviewed and optimized in minutes.

### Example 2: Booking App with Multiple Features

```
1. Load Atlas
2. *scaffold
   - Name: booking-app
   - Description: Hotel booking prototype
3. Load Forge
4. *feature booking-form
5. *feature availability-calendar
6. *mock-data bookings
7. Load Sentinel
8. *refactor
9. *test
```

**Result:** Booking app with forms, calendar, mock data, refactored and tested.

## Development Roadmap

- [x] Core scaffolding workflow
- [x] Three specialized agents (Atlas, Forge, Sentinel)
- [x] Living documentation system
- [ ] Template library for common patterns
- [ ] Component generator with variants
- [ ] Mock API server integration
- [ ] Testing workflow automation
- [ ] Deployment pipeline templates

## Contributing

To extend this module:

1. Add new workflow patterns using `create-workflow`
2. Enhance agent capabilities via YAML updates
3. Add scaffold templates to workflows/rapid-prototype/templates/
4. Improve documentation patterns

## Author

Created by Fede on 2025-10-07

Built with the BMAD Method 🚀
