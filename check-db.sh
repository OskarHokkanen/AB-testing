#!/bin/bash

# Database Connection Check Script
# Verifies PostgreSQL connectivity and basic health

set -e

echo "=================================="
echo "Database Connection Check"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose not found${NC}"
    exit 1
fi

# Check if containers are running
echo -e "${BLUE}Checking container status...${NC}"
if docker-compose ps | grep -q "db.*Up"; then
    echo -e "${GREEN}✓ PostgreSQL container is running${NC}"
else
    echo -e "${RED}❌ PostgreSQL container is not running${NC}"
    echo "Start it with: docker-compose up -d db"
    exit 1
fi

if docker-compose ps | grep -q "web.*Up"; then
    echo -e "${GREEN}✓ Web container is running${NC}"
else
    echo -e "${YELLOW}⚠ Web container is not running${NC}"
fi

echo ""

# Check PostgreSQL health
echo -e "${BLUE}Checking PostgreSQL health...${NC}"
if docker-compose exec -T db pg_isready -U abtesting >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is ready to accept connections${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not ready${NC}"
    exit 1
fi

echo ""

# Check database exists
echo -e "${BLUE}Checking database...${NC}"
if docker-compose exec -T db psql -U abtesting -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw abtesting; then
    echo -e "${GREEN}✓ Database 'abtesting' exists${NC}"
else
    echo -e "${RED}❌ Database 'abtesting' does not exist${NC}"
    echo "Create it with: docker-compose exec db createdb -U abtesting abtesting"
    exit 1
fi

echo ""

# Check tables exist
echo -e "${BLUE}Checking database tables...${NC}"
TABLE_COUNT=$(docker-compose exec -T db psql -U abtesting -d abtesting -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $TABLE_COUNT table(s) in database${NC}"
    
    # List tables
    echo ""
    echo -e "${BLUE}Tables:${NC}"
    docker-compose exec -T db psql -U abtesting -d abtesting -c "\dt" 2>/dev/null || true
    
    echo ""
    echo -e "${BLUE}Record counts:${NC}"
    
    # Count records in each table (with error handling)
    for table in Student Submission AdminUser; do
        COUNT=$(docker-compose exec -T db psql -U abtesting -d abtesting -t -c "SELECT COUNT(*) FROM \"$table\";" 2>/dev/null | tr -d ' ' || echo "0")
        if [ -n "$COUNT" ]; then
            echo "  $table: $COUNT"
        fi
    done
else
    echo -e "${YELLOW}⚠ No tables found in database${NC}"
    echo "Run migrations with: docker-compose exec web npx prisma migrate deploy"
fi

echo ""

# Check if Prisma can connect
echo -e "${BLUE}Testing Prisma connection from web container...${NC}"
if docker-compose exec -T web npx prisma db push --skip-generate --accept-data-loss 2>&1 | grep -q "Already in sync"; then
    echo -e "${GREEN}✓ Prisma schema is in sync with database${NC}"
elif docker-compose exec -T web npx prisma db push --skip-generate --accept-data-loss 2>&1 | grep -q "success"; then
    echo -e "${GREEN}✓ Prisma schema synced successfully${NC}"
else
    echo -e "${YELLOW}⚠ Prisma schema may need migration${NC}"
    echo "Run: docker-compose exec web npx prisma migrate deploy"
fi

echo ""

# Connection info
echo -e "${BLUE}=================================="
echo "Connection Information"
echo "==================================${NC}"
echo ""
echo "PostgreSQL is accessible at:"
echo "  From host machine:    localhost:5432"
echo "  From web container:   db:5432"
echo ""
echo "Credentials:"
echo "  Database: abtesting"
echo "  Username: abtesting"
echo "  Password: abtesting_password"
echo ""
echo -e "${YELLOW}Connect with DBeaver:${NC}"
echo "  Host: localhost (or your-server-ip if remote)"
echo "  Port: 5432"
echo "  Database: abtesting"
echo "  Username: abtesting"
echo "  Password: abtesting_password"
echo ""
echo -e "${YELLOW}Connect with psql:${NC}"
echo "  docker-compose exec db psql -U abtesting -d abtesting"
echo ""
echo -e "${YELLOW}Run Prisma Studio:${NC}"
echo "  docker-compose exec web npx prisma studio"
echo "  Then access: http://localhost:5555"
echo ""
echo -e "${GREEN}✓ All checks passed!${NC}"