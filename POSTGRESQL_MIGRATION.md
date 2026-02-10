# PostgreSQL Migration Guide

This project has been migrated from SQLite to PostgreSQL for better production deployment and remote database management.

## What Changed

### 1. Database Provider
- **Before:** SQLite (file-based database)
- **After:** PostgreSQL (client-server database)

### 2. Docker Compose
Both `docker-compose.yml` (production) and `docker-compose.dev.yml` (development) now include:
- A PostgreSQL service (`db`) running PostgreSQL 16 Alpine
- Updated `DATABASE_URL` environment variable
- PostgreSQL data persistence via Docker volumes
- Health checks for the database service

### 3. Database Credentials
**Default credentials (change these in production!):**
- Username: `abtesting`
- Password: `abtesting_password`
- Database: `abtesting`
- Port: `5432` (production), `5433` (development - exposed to host)

## Migration Steps

### For New Deployments (No Existing Data)

1. **Pull the latest changes on your remote server:**
   ```bash
   cd /path/to/AB-testing
   git pull
   ```

2. **Stop and remove old containers:**
   ```bash
   docker-compose down
   ```

3. **Remove old SQLite volume (optional backup first):**
   ```bash
   # Backup SQLite database if you have data
   cp prisma/dev.db prisma/dev.db.backup
   ```

4. **Build and start the new services:**
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

5. **Run Prisma migrations:**
   ```bash
   docker-compose exec web npx prisma migrate deploy
   ```

6. **Verify the database is working:**
   ```bash
   docker-compose exec web npx prisma studio
   ```
   Then access Prisma Studio via SSH tunnel (see below).

### For Existing Deployments (With Data to Migrate)

If you have existing data in SQLite that you want to migrate:

1. **Export data from SQLite** (before stopping containers):
   ```bash
   # Create a backup/export script
   docker-compose exec web npx prisma db push
   # You may need to write a custom script to export data
   ```

2. **Follow steps 1-5 from "New Deployments" above**

3. **Import data to PostgreSQL:**
   ```bash
   # Use a custom migration script or manually re-seed
   docker-compose exec web npm run seed
   ```

## Connecting with DBeaver

Now that you're using PostgreSQL, connecting with DBeaver is straightforward:

### Option 1: Direct Connection (if port is exposed)

1. Open DBeaver
2. Create new connection → PostgreSQL
3. Connection settings:
   - Host: `your-server-ip`
   - Port: `5432`
   - Database: `abtesting`
   - Username: `abtesting`
   - Password: `abtesting_password`
4. Test connection and save

### Option 2: SSH Tunnel (More Secure)

1. Open DBeaver
2. Create new connection → PostgreSQL
3. **Main tab:**
   - Host: `localhost` (or `db` if connecting from within Docker network)
   - Port: `5432`
   - Database: `abtesting`
   - Username: `abtesting`
   - Password: `abtesting_password`
4. **SSH tab:**
   - Use SSH Tunnel: ✓
   - Host/IP: `your-server-ip`
   - Port: `22`
   - Username: `your-ssh-username`
   - Authentication: Private key or password
5. Test connection and save

### Option 3: Prisma Studio (Built-in GUI)

```bash
# On your remote server
docker-compose exec web npx prisma studio

# On your local machine (create SSH tunnel)
ssh -L 5555:localhost:5555 user@your-server

# Open in browser
http://localhost:5555
```

## Database Management

### View Logs
```bash
# PostgreSQL logs
docker-compose logs db

# Application logs
docker-compose logs web
```

### Access PostgreSQL CLI
```bash
docker-compose exec db psql -U abtesting -d abtesting
```

### Backup Database
```bash
# Create a backup
docker-compose exec db pg_dump -U abtesting abtesting > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker-compose exec -T db psql -U abtesting abtesting < backup.sql
```

### Reset Database
```bash
docker-compose exec web npx prisma migrate reset
```

## Production Security Recommendations

⚠️ **Important:** Change default credentials in production!

1. **Create a `.env` file** (don't commit to git):
   ```bash
   POSTGRES_USER=your_secure_username
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_DB=abtesting
   ```

2. **Update docker-compose.yml** to use environment variables:
   ```yaml
   db:
     environment:
       - POSTGRES_USER=${POSTGRES_USER}
       - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
       - POSTGRES_DB=${POSTGRES_DB}
   
   web:
     environment:
       - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
   ```

3. **Don't expose PostgreSQL port** to the public internet (remove the `ports` section from the `db` service if not needed)

4. **Use SSL/TLS** for database connections in production

5. **Regular backups** - Set up automated backup scripts

## Troubleshooting

### "Connection refused" error
- Ensure the database container is running: `docker-compose ps`
- Check database health: `docker-compose exec db pg_isready -U abtesting`
- View logs: `docker-compose logs db`

### Migration fails
- Ensure database is running and healthy
- Check DATABASE_URL is correct
- Try: `docker-compose exec web npx prisma migrate resolve --rolled-back [migration-name]`

### Can't connect with DBeaver
- Verify PostgreSQL port is exposed (check docker-compose.yml)
- Check firewall settings on your server
- Verify credentials are correct
- Use SSH tunnel if direct connection fails

## Rollback to SQLite (Emergency)

If you need to rollback:

1. Checkout previous commit: `git checkout [previous-commit-hash]`
2. Stop containers: `docker-compose down`
3. Restore SQLite backup: `cp prisma/dev.db.backup prisma/dev.db`
4. Start containers: `docker-compose up -d`

## Notes

- PostgreSQL data is stored in a Docker volume (`postgres_data` for production, `postgres_data_dev` for development)
- The data persists even when containers are stopped or removed
- To completely remove data: `docker-compose down -v` (⚠️ this deletes all data!)