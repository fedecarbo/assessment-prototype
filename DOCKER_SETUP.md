# Docker Setup Guide

This guide explains how to work on this project across two computers: your personal computer (without Docker) and your work computer (with Docker).

## Overview

- **Personal Computer**: Use native Node.js and npm
- **Work Computer**: Use Docker to run the application

Both setups provide the same development experience with hot-reload support.

---

## Prerequisites

### Personal Computer
- Node.js 18+ installed
- npm installed

### Work Computer
- Docker installed
- Docker Compose installed

---

## First-Time Setup

### On Personal Computer

1. Clone the repository (if not already done):
   ```bash
   git clone <repository-url>
   cd assessment-prototype
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open browser: [http://localhost:3000](http://localhost:3000)

### On Work Computer

1. Clone the repository (if not already done):
   ```bash
   git clone <repository-url>
   cd assessment-prototype
   ```

2. Start Docker development environment:
   ```bash
   docker-compose up
   ```

   The first time will take a few minutes as it downloads the base image and installs dependencies.

3. Open browser: [http://localhost:3000](http://localhost:3000)

---

## Daily Workflow

### Personal Computer

```bash
# Start development
npm run dev

# That's it! Your code changes will hot-reload automatically.
```

### Work Computer

```bash
# Start development (rebuilds if needed)
docker-compose up

# Or run in background
docker-compose up -d

# View logs (if running in background)
docker-compose logs -f

# Stop containers
docker-compose down
```

---

## Switching Between Computers

### Going from Personal → Work Computer

1. On personal computer, commit and push your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. On work computer, pull the latest changes:
   ```bash
   git pull
   ```

3. Start Docker (it will automatically pick up changes):
   ```bash
   docker-compose up
   ```

**Note**: You don't need to rebuild unless `package.json` changed.

### Going from Work → Personal Computer

1. On work computer, stop Docker and commit changes:
   ```bash
   docker-compose down
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. On personal computer, pull the latest changes:
   ```bash
   git pull
   ```

3. If `package.json` changed, reinstall dependencies:
   ```bash
   npm install
   ```

4. Start development:
   ```bash
   npm run dev
   ```

---

## When to Rebuild Docker

You only need to rebuild the Docker container when:
- `package.json` changes (new dependencies added/removed)
- `Dockerfile` changes
- Something seems broken and you want a fresh start

```bash
# Rebuild and start
docker-compose up --build

# Or force a complete rebuild
docker-compose build --no-cache
docker-compose up
```

---

## Common Commands Reference

### Personal Computer
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run linter
```

### Work Computer
```bash
docker-compose up                    # Start containers
docker-compose up -d                 # Start in background
docker-compose down                  # Stop containers
docker-compose up --build            # Rebuild and start
docker-compose logs -f               # View logs
docker-compose exec dev sh           # Access container shell
```

---

## Important Notes

### Git Workflow
- Always commit Docker files (`Dockerfile`, `docker-compose.yml`, `.dockerignore`)
- Never commit `node_modules/` or `.next/` (already in `.gitignore`)
- Both computers share the same Git repository

### Port Conflicts
If port 3000 is already in use:

**Personal Computer:**
```bash
# Specify a different port
PORT=3001 npm run dev
```

**Work Computer:**
Edit `docker-compose.yml` and change the ports mapping:
```yaml
ports:
  - "3001:3000"  # Maps host port 3001 to container port 3000
```

### Node Modules
- **Personal Computer**: `node_modules` stored locally
- **Work Computer**: `node_modules` stored in Docker volume (not on your filesystem)
- This prevents conflicts when switching between environments

---

## Troubleshooting

### Personal Computer Issues

**Problem**: `npm run dev` fails
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Port 3000 already in use
```bash
# Solution: Find and kill the process
# On Mac/Linux:
lsof -ti:3000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Work Computer Issues

**Problem**: Build fails with "npm ci" error or exit code 1
```bash
# Solution: Ensure package-lock.json exists and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**Problem**: Docker container won't start
```bash
# Solution 1: Stop all containers and start fresh
docker-compose down
docker-compose up

# Solution 2: Rebuild everything
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**Problem**: Changes not reflecting in browser
```bash
# Solution 1: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

# Solution 2: Restart Docker
docker-compose restart

# Solution 3: Check if volumes are mounted correctly
docker-compose down
docker-compose up
```

**Problem**: "Permission denied" errors
```bash
# Solution: Remove containers and volumes
docker-compose down -v
docker-compose up
```

**Problem**: Docker is slow or using too much disk space
```bash
# Clean up unused Docker resources
docker system prune -a --volumes

# Warning: This removes ALL unused containers, networks, and images
```

### General Issues

**Problem**: Different behavior between environments
- Ensure both environments are using the same Node.js version
- Check that all environment variables are set consistently
- Verify `package.json` is the same on both computers (run `git pull`)

**Problem**: Build fails after switching computers
```bash
# Personal Computer:
rm -rf node_modules .next
npm install
npm run dev

# Work Computer:
docker-compose down
docker-compose build --no-cache
docker-compose up
```

---

## Environment Variables

If you need environment variables (e.g., API keys):

### Personal Computer
Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_KEY=your_key_here
```

### Work Computer
Add environment variables to `docker-compose.yml`:
```yaml
services:
  dev:
    environment:
      - NEXT_PUBLIC_API_KEY=your_key_here
```

Or use a `.env` file (Docker Compose will automatically load it):
```bash
# .env file
NEXT_PUBLIC_API_KEY=your_key_here
```

**Important**: Never commit `.env` or `.env.local` files with sensitive data!

---

## Testing Production Build

### Personal Computer
```bash
npm run build
npm run start
```

### Work Computer
```bash
# Start production container
docker-compose --profile production up prod

# Access at http://localhost:3000
```

---

## Quick Reference Cheat Sheet

| Task | Personal Computer | Work Computer |
|------|-------------------|---------------|
| Start dev | `npm run dev` | `docker-compose up` |
| Stop dev | `Ctrl+C` | `docker-compose down` |
| Install deps | `npm install` | Automatic in Docker |
| Clean start | `rm -rf node_modules && npm install` | `docker-compose up --build` |
| View logs | Terminal output | `docker-compose logs -f` |
| Access shell | N/A | `docker-compose exec dev sh` |

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## Summary

You now have a flexible setup that allows you to:
- Work seamlessly on both computers
- Use native npm on your personal computer
- Use Docker on your work computer
- Switch between environments without conflicts
- Maintain the same development experience everywhere

Happy coding!
