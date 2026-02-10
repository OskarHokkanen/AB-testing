# PostgreSQL Migration - Quick Start Guide

## TL;DR - Get PostgreSQL Running in 5 Minutes

### On Your Remote Server:

```bash
# 1. Navigate to project
cd /path/to/AB-testing

# 2. Pull latest changes
git pull

# 3. Run migration script
chmod +x migrate-to-postgresql.sh
./migrate-to-postgresql.sh

# 4. Done! Check status
./check-db.sh
```

---

## Connect with DBeaver - 2 Minute Setup

### Option 1: Direct Connection (Quickest)

1. Open **DBeaver** → **Database** → **New Database Connection**
2. Select **PostgreSQL** → **Next**
3. Fill in:
   ```
   Host:     your-server-ip
   Port:     5432
   Database: abtesting
   Username: abtesting
   Password: abtesting_password
   ```
4. Click **Test Connection** → **Finish**

### Option 2: SSH Tunnel (More Secure)

1. Open **DBeaver** → **Database** → **New Database Connection**
2. Select **PostgreSQL** → **Next**
3. **Main Tab:**
   ```
   Host:     localhost
   Port:     5432
   Database: abtesting
   Username: abtesting
   Password: abtesting_password
   ```
4. **SSH Tab:**
   - ☑ Use SSH Tunnel
   - Host/IP: `your-server-ip`
   - Port: `22`
   - Username: `your-ssh-username`
   - Auth: Your SSH key or password
5. Click **Test Connection** → **Finish**

**Done!** You can now manage your database visually.

---

## Manual Migration (Without Script)

```bash
# Stop current services
docker-compose down

# Build with PostgreSQL
docker-compose build --no-cache

# Start services
docker-compose up -d

# Wait for database to be ready
sleep 15

# Run migrations
docker-compose exec web npx prisma migrate deploy

# Check status
docker-compose ps
```

---

## Verify Everything Works

```bash
# Run comprehensive check
./check-db.sh

# Or check manually:
docker-compose ps                                      # All containers running?
docker-compose exec db pg_isready -U abtesting        # Database ready?
docker-compose exec db psql -U abtesting -d abtesting # Can connect?
curl http://localhost:3002                            # App responding?
```

---

## Common Commands

### Access Database
```bash
# Via psql
docker-compose exec db psql -U abtesting -d abtesting

# Via Prisma Studio
docker-compose exec web npx prisma studio
# Then: ssh -L 5555:localhost:5555 user@server (on local machine)
# Open: http://localhost:5555
```

### Backup & Restore
```bash
# Backup
docker-compose exec db pg_dump -U abtesting abtesting > backup.sql

# Restore
docker-compose exec -T db psql -U abtesting abtesting < backup.sql
```

### View Logs
```bash
docker-compose logs -f db    # Database logs
docker-compose logs -f web   # App logs
```

### Restart Services
```bash
docker-compose restart       # Restart all
docker-compose restart db    # Restart database only
```

---

## Connection Details

```
Host:     localhost (same machine) or your-server-ip (remote)
Port:     5432
Database: abtesting
Username: abtesting
Password: abtesting_password

Connection String:
postgresql://abtesting:abtesting_password@localhost:5432/abtesting
```

⚠️ **Security Note:** Change `abtesting_password` in production!

---

## Troubleshooting

### Can't connect to database?
```bash
./check-db.sh                     # Run diagnostics
docker-compose logs db            # Check database logs
docker-compose ps                 # Check container status
docker-compose restart db         # Try restarting database
```

### DBeaver can't connect?
- ✅ Verify PostgreSQL port (5432) is accessible
- ✅ Check firewall settings
- ✅ Try SSH tunnel method instead
- ✅ Verify credentials are correct

### Migration failed?
```bash
docker-compose down               # Stop everything
docker-compose up -d db          # Start DB only
sleep 15                         # Wait for DB
docker-compose up -d web         # Start app
docker-compose exec web npx prisma migrate deploy
```

---

## What Changed?

| Before | After |
|--------|-------|
| SQLite (file-based) | PostgreSQL (server-based) |
| No remote access | Full remote access with DBeaver |
| Limited concurrency | Better multi-user support |
| Port: N/A | Port: 5432 |

---

## Need More Details?

- **Full Migration Guide:** [POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md)
- **Connection Reference:** [DATABASE_CONNECTION.md](DATABASE_CONNECTION.md)
- **Deployment Checklist:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Migration Summary:** [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)

---

## Production Security (Do This!)

```bash
# 1. Create .env file with strong password
cat > .env << EOF
POSTGRES_USER=abtesting
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_DB=abtesting
OPENAI_API_KEY=your_key_here
EOF

# 2. Update docker-compose.yml to use ${POSTGRES_PASSWORD}

# 3. Restart
docker-compose down
docker-compose up -d

# 4. Set up automated backups
echo "0 2 * * * cd /path/to/AB-testing && docker-compose exec db pg_dump -U abtesting abtesting | gzip > /backups/backup_\$(date +\%Y\%m\%d).sql.gz" | crontab -
```

---

**✅ That's it!** Your database is now PostgreSQL and accessible with DBeaver.

**Questions?** Check the detailed guides in the docs folder.