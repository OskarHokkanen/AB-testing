# Docker Setup Guide

This guide will help you run the AB Testing Simulator in a Docker container.

## Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose (included with Docker Desktop)
- An OpenAI-compatible API key (for AI report generation)

## Quick Start

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd AB-testing
   ```

2. **Create a `.env` file with your API key:**
   ```bash
   echo "OPENAI_API_KEY=your-api-key-here" > .env
   ```

3. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database (first time only):**
   ```bash
   docker-compose exec web npx prisma db push
   docker-compose exec web npx prisma db seed
   ```

5. **Access the application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Docker Commands

### Starting the Application
```bash
# Start in detached mode (background)
docker-compose up -d

# Start with logs visible
docker-compose up

# Rebuild and start (after code changes)
docker-compose up --build -d
```

### Stopping the Application
```bash
# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove containers, and remove volumes (WARNING: deletes database)
docker-compose down -v
```

### Viewing Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f web
```

### Database Management
```bash
# Access Prisma Studio (database GUI)
docker-compose exec web npx prisma studio

# Run database migrations
docker-compose exec web npx prisma db push

# Seed the database with test data
docker-compose exec web npx prisma db seed

# Reset database (WARNING: deletes all data)
docker-compose exec web npx prisma db push --force-reset
docker-compose exec web npx prisma db seed
```

### Shell Access
```bash
# Access container shell
docker-compose exec web sh

# Access as root user
docker-compose exec -u root web sh
```

## Environment Variables

The following environment variables can be configured in your `.env` file:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI reports | Yes* | - |
| `DATABASE_URL` | SQLite database path | No | `file:./prisma/dev.db` |
| `NODE_ENV` | Node environment | No | `production` |


## Data Persistence

The Docker setup uses volumes to persist data between container restarts:

- **Database**: `./prisma/` directory is mounted to persist the SQLite database
- **Screenshots**: `./public/screenshots/` directory is mounted to persist generated screenshots

These directories are created automatically and will survive container restarts and rebuilds.

## Architecture

The Docker setup consists of:

1. **Multi-stage Build**:
   - `deps`: Installs Node.js dependencies
   - `builder`: Builds the Next.js application
   - `runner`: Production runtime with minimal footprint

2. **Chromium Installation**: Puppeteer requires Chromium for screenshot generation, which is installed in the production image

3. **Standalone Output**: Next.js standalone output mode creates a minimal production server

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, modify the `docker-compose.yml` file:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### Database Permission Issues
```bash
# Fix permissions on the database directory
chmod -R 777 ./prisma
docker-compose restart
```

### Puppeteer Screenshot Issues
If screenshots fail to generate:
```bash
# Check Chromium is installed
docker-compose exec web which chromium-browser

# Check logs for errors
docker-compose logs -f web
```

### Container Won't Start
```bash
# Check logs
docker-compose logs web

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### API Key Not Working
```bash
# Verify environment variables are loaded
docker-compose exec web env | grep API_KEY

# Restart containers after changing .env
docker-compose restart
```

## Production Deployment

For production deployments:

1. **Use stronger secrets**: Change admin password in seed script
2. **Configure environment**: Set proper environment variables
3. **Enable HTTPS**: Use a reverse proxy like Nginx or Traefik
4. **Set resource limits**: Add memory and CPU limits to docker-compose.yml
5. **Enable monitoring**: Add health checks and logging

Example production `docker-compose.yml` additions:
```yaml
services:
  web:
    # ... existing configuration ...
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Updating the Application

To update to a new version:

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up --build -d

# Check logs
docker-compose logs -f web
```

## Clean Slate Setup

To completely reset everything:

```bash
# Stop and remove containers, networks, and volumes
docker-compose down -v

# Remove old images
docker-compose rm -f
docker image prune -a

# Remove database and screenshots
rm -rf ./prisma/dev.db ./public/screenshots/*

# Rebuild and start fresh
docker-compose up --build -d

# Initialize database
docker-compose exec web npx prisma db push
docker-compose exec web npx prisma db seed
```

## Performance Optimization

### Build Time Optimization
- Dependencies are cached in the `deps` stage
- Only rebuilds when `package.json` changes
- Use BuildKit for faster builds:
  ```bash
  DOCKER_BUILDKIT=1 docker-compose build
  ```

### Runtime Optimization
- Alpine Linux base image (minimal size)
- Standalone Next.js output (smaller bundle)
- Multi-stage build removes build dependencies
- Non-root user for security

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure Docker has enough resources (Memory: 2GB+, Disk: 5GB+)
4. Check the main README.md for application-specific issues

## Development with Docker

For development, you can mount the source code:

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  web:
    build:
      context: .
      target: base  # Use base stage only
    command: npm run dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./prisma/dev.db
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - .:/app
      - /app/node_modules
      - ./prisma:/app/prisma
```

Run with:
```bash
docker-compose -f docker-compose.dev.yml up
```
