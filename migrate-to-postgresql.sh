#!/bin/bash

# PostgreSQL Migration Script
# This script helps migrate from SQLite to PostgreSQL

set -e

echo "=================================="
echo "PostgreSQL Migration Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}This script will:${NC}"
echo "1. Backup your existing SQLite database (if it exists)"
echo "2. Stop current containers"
echo "3. Rebuild containers with PostgreSQL"
echo "4. Run database migrations"
echo ""
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 0
fi

# Step 1: Backup SQLite database
echo ""
echo -e "${GREEN}Step 1: Backing up SQLite database...${NC}"
if [ -f "prisma/dev.db" ]; then
    BACKUP_FILE="prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)"
    cp prisma/dev.db "$BACKUP_FILE"
    echo -e "${GREEN}✓ SQLite database backed up to: $BACKUP_FILE${NC}"
else
    echo -e "${YELLOW}No SQLite database found. Skipping backup.${NC}"
fi

# Step 2: Stop current containers
echo ""
echo -e "${GREEN}Step 2: Stopping current containers...${NC}"
docker-compose down
echo -e "${GREEN}✓ Containers stopped${NC}"

# Step 3: Remove old volumes (optional)
echo ""
read -p "Do you want to remove old volumes? This will delete SQLite data. (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    echo -e "${GREEN}✓ Volumes removed${NC}"
fi

# Step 4: Build new images
echo ""
echo -e "${GREEN}Step 3: Building new Docker images...${NC}"
docker-compose build --no-cache
echo -e "${GREEN}✓ Images built${NC}"

# Step 5: Start services
echo ""
echo -e "${GREEN}Step 4: Starting services...${NC}"
docker-compose up -d
echo -e "${GREEN}✓ Services started${NC}"

# Step 6: Wait for database to be ready
echo ""
echo -e "${GREEN}Step 5: Waiting for PostgreSQL to be ready...${NC}"
sleep 5

MAX_RETRIES=30
RETRY_COUNT=0
until docker-compose exec -T db pg_isready -U abtesting >/dev/null 2>&1 || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
    echo "Waiting for PostgreSQL... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}Error: PostgreSQL did not become ready in time${NC}"
    echo "Check logs with: docker-compose logs db"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Step 7: Generate Prisma Client
echo ""
echo -e "${GREEN}Step 6: Generating Prisma Client...${NC}"
docker-compose exec -T web npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"

# Step 8: Run migrations
echo ""
echo -e "${GREEN}Step 7: Running database migrations...${NC}"
docker-compose exec -T web npx prisma migrate deploy
echo -e "${GREEN}✓ Migrations completed${NC}"

# Step 9: Optional seed
echo ""
read -p "Do you want to seed the database with initial data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "package.json" ] && grep -q "\"seed\"" package.json; then
        docker-compose exec -T web npm run seed
        echo -e "${GREEN}✓ Database seeded${NC}"
    else
        echo -e "${YELLOW}No seed script found in package.json${NC}"
    fi
fi

# Final steps
echo ""
echo -e "${GREEN}=================================="
echo "Migration Complete!"
echo "==================================${NC}"
echo ""
echo "Your application is now running with PostgreSQL!"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify the application is working: docker-compose ps"
echo "2. Check logs: docker-compose logs -f web"
echo "3. Connect with DBeaver using these credentials:"
echo "   - Host: your-server-ip"
echo "   - Port: 5432"
echo "   - Database: abtesting"
echo "   - Username: abtesting"
echo "   - Password: abtesting_password"
echo ""
echo -e "${YELLOW}Security reminder:${NC}"
echo "⚠️  Change the default database credentials in production!"
echo "See POSTGRESQL_MIGRATION.md for details."
echo ""
echo -e "${GREEN}For Prisma Studio:${NC}"
echo "Run: docker-compose exec web npx prisma studio"
echo "Then create SSH tunnel: ssh -L 5555:localhost:5555 user@your-server"
echo "Access at: http://localhost:5555"
echo ""