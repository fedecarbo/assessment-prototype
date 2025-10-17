# Rapid Prototype - Standalone Ready-to-Use Module

**🚀 Zero-friction Next.js prototype scaffolding with AI agents**

This is a **pre-compiled, standalone** version of the Rapid Prototype module. Everything is ready to use immediately - no installation or compilation needed!

## What Is This?

A complete AI-powered prototyping system with three specialized agents:

- **🏗️ Atlas (Prototype Architect)** - Scaffolds Next.js prototypes instantly
- **⚒️ Forge (Builder)** - Builds features, components, and pages
- **🛡️ Sentinel (QA Refactor)** - Reviews, refactors, and optimizes

## Quick Start (30 seconds)

### 1. Open this folder in VS Code

```bash
cd rapid-proto-standalone
code .
```

### 2. Start Claude Code and load an agent

Type any of these slash commands:

```
/atlas      # Load Atlas to scaffold prototypes
/forge      # Load Forge to build features
/sentinel   # Load Sentinel to review code
```

### 3. Start scaffolding!

Once Atlas is loaded:

```
*quick-start    # Instant scaffold with defaults
# OR
*scaffold       # Interactive setup with questions
```

That's it! 🎉

---

## Complete Usage Guide

### Atlas - Prototype Architect 🏗️

**Load:** `/atlas`

**What Atlas does:**
- Scaffolds complete Next.js 15 projects
- Sets up TypeScript strict mode
- Installs Tailwind v4 + Shadcn UI
- Creates mock data infrastructure
- Generates living documentation

**Commands:**
- `*scaffold` - Full interactive setup
- `*quick-start` - Instant with defaults
- `*status` - Show project structure
- `*pivot` - Document direction changes
- `*handoff` - Context for Forge

**Example workflow:**
```
/atlas
*quick-start
# Creates: prototype-2025-10-07/
```

---

### Forge - Builder ⚒️

**Load:** `/forge`

**What Forge does:**
- Builds components and pages
- Integrates mock data
- Reads context from Atlas
- Documents everything built
- Maintains type safety

**Commands:**
- `*component` - Create UI component
- `*page` - Build new page
- `*feature` - Complete feature
- `*mock-data` - Create mock data
- `*integrate` - Connect data to UI
- `*fix` - Fix bugs
- `*context` - Show current state
- `*log` - Build history

**Example workflow:**
```
/forge
*context            # Read what Atlas built
*component button   # Create a button
*page dashboard     # Add dashboard page
*log                # See what's been built
```

---

### Sentinel - QA Refactor 🛡️

**Load:** `/sentinel`

**What Sentinel does:**
- Reviews code quality
- Refactors for best practices
- Fixes TypeScript issues
- Adds tests
- Optimizes performance

**Commands:**
- `*review` - Review recent changes
- `*refactor` - Improve code
- `*types` - Fix TypeScript
- `*test` - Add tests
- `*optimize` - Performance
- `*audit` - Full quality check
- `*lint` - Code style
- `*report` - Quality metrics

**Example workflow:**
```
/sentinel
*review      # Review what Forge built
*refactor    # Improve code quality
*test        # Add tests
*report      # Quality report
```

---

## The Context Handoff System

**The Magic:** Agents stay in sync via living documentation!

### How it works:

1. **Atlas scaffolds** → Creates `docs/rapid-prototype/project-brief.md`
2. **Forge reads brief** → Builds features → Logs to `build-log.md`
3. **Sentinel reads log** → Refactors → Logs to `refactor-log.md`
4. **Next session** → Any agent reads `context-summary.md` → Continues seamlessly

### Documentation files created:

```
docs/rapid-prototype/
├── project-brief.md      # Project overview
├── build-log.md          # Features built by Forge
├── changes-log.md        # Bug fixes
├── refactor-log.md       # Quality improvements
└── context-summary.md    # Current state snapshot
```

**Result:** Perfect handoffs, zero context loss!

---

## Tech Stack

Each prototype scaffolded by Atlas includes:

- **Framework:** Next.js 15 (App Router, Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4+
- **UI:** Shadcn UI (button, card, input, dialog, etc.)
- **Data:** Type-safe mock data infrastructure

---

## Complete Workflow Example

### Building a Dashboard App

```bash
# 1. Load Atlas and scaffold
/atlas
*scaffold
# Name: dashboard-app
# Description: Admin dashboard prototype

# 2. Navigate to the new project
cd dashboard-app
npm run dev

# 3. Load Forge and build features
/forge
*context              # Understand what Atlas created
*component stats-card # Create stats card component
*page dashboard       # Build dashboard page
*mock-data stats      # Create stats mock data
*integrate            # Connect data to components

# 4. Load Sentinel for quality
/sentinel
*review               # Review Forge's work
*refactor             # Improve code quality
*types                # Fix any TypeScript issues
*test                 # Add tests

# Done! Dashboard with stats, data, tests, and quality code
```

---

## Project Structure

```
rapid-proto-standalone/
├── .claude/
│   └── commands/
│       ├── atlas.md       # /atlas command
│       ├── forge.md       # /forge command
│       └── sentinel.md    # /sentinel command
├── bmad/
│   ├── core/
│   │   └── tasks/
│   │       └── workflow.xml       # Workflow engine
│   └── rapid-proto/
│       ├── agents/
│       │   ├── prototype-architect.md  # Atlas (compiled)
│       │   ├── builder.md              # Forge (compiled)
│       │   └── qa-refactor.md          # Sentinel (compiled)
│       ├── workflows/
│       │   └── rapid-prototype/
│       │       ├── workflow.yaml
│       │       ├── instructions.md
│       │       └── checklist.md
│       ├── config.yaml
│       └── README.md
├── docs/                  # Output folder for docs
└── README.md             # This file
```

---

## Duplicating for New Projects

**This folder is your template!** Duplicate it whenever you want to start fresh:

```bash
# Windows
xcopy rapid-proto-standalone new-project-folder /E /I

# Mac/Linux
cp -r rapid-proto-standalone new-project-folder
```

Each copy is completely independent with all agents ready to use.

---

## Tips & Best Practices

### For Best Results:

1. **Always start with Atlas** - Let it scaffold the foundation
2. **Use Forge for implementation** - It tracks context automatically
3. **Run Sentinel periodically** - Quality checks prevent tech debt
4. **Check context files** - They keep agents in sync
5. **One agent at a time** - Complete tasks before switching

### Agent Switching:

```
# Working with Atlas
/atlas
*scaffold

# Switch to Forge
/forge
*context    # Picks up where Atlas left off
*component

# Switch to Sentinel
/sentinel
*review     # Reviews what Forge built
```

---

## Troubleshooting

### Agent won't load?

Make sure you're in the `rapid-proto-standalone` folder:
```bash
cd rapid-proto-standalone
code .
```

### Config not found?

Agents look for `{project-root}/bmad/rapid-proto/config.yaml`. The project root is this folder.

### Workflow errors?

Ensure `bmad/core/tasks/workflow.xml` exists. It's the workflow execution engine.

---

## What's Included

✅ **3 Pre-compiled agents** (Atlas, Forge, Sentinel)
✅ **Complete workflow system** (rapid-prototype)
✅ **Slash commands** (/atlas, /forge, /sentinel)
✅ **Workflow execution engine** (workflow.xml)
✅ **Living documentation templates**
✅ **Full module configuration**
✅ **Ready to duplicate and reuse**

---

## Next Steps

**Ready to build?**

1. Open this folder in VS Code
2. Type `/atlas` in Claude Code
3. Run `*quick-start`
4. Start coding! 🚀

---

**Built with BMAD Method**
**Created by:** Fede
**Date:** 2025-10-07

*Happy prototyping!* ⚡
