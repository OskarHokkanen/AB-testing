# PostgreSQL Migration - Deployment Checklist

## Pre-Migration Checklist

- [ ] **Backup existing SQLite database**
  ```bash
  cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)
  ```

- [ ] **Document current data** (if any)
  - Number of students
  - Number of submissions
  - Admin accounts

- [ ] **Pull latest changes from repository**
  ```bash
  git pull origin main
  ```

- [ ] **Review changes**
  ```bash
  git log --oneline -10
  git diff HEAD~1
  ```

## Migration Steps

### Step 1: Stop Current Services
- [ ] Stop running containers
  ```bash
  docker-compose down
  ```

- [ ] Verify containers are stopped
  ```bash
  docker-compose ps
  ```

### Step 2: Update Environment Variables (Optional but Recommended)

- [ ] Create `.env` file with secure credentials (if not using defaults)
  ```bash
  cat > .env << EOF
  POSTGRES_USER=abtesting
  POSTGRES_PASSWORD=change_this_password_in_production
  POSTGRES_DB=abtesting
  DATABASE_URL=postgresql://abtesting:change_this_password_in_production@db:5432/abtesting
  OPENAI_API_KEY=your_openai_key_here
  ANTHROPIC_API_KEY=your_anthropic_key_here
  EOF
  ```

- [ ] Update `docker-compose.yml` to use environment variables (if using custom credentials)

### Step 3: Build and Start Services

- [ ] Build new Docker images (with PostgreSQL)
  ```bash
  docker-compose build --no-cache
  ```

- [ ] Start PostgreSQL service first
  ```bash
  docker-compose up -d db
  ```

- [ ] Wait for PostgreSQL to be ready (15-30 seconds)
  ```bash
  sleep 15
  docker-compose exec db pg_isready -U abtesting
  ```

### Step 4: Run Database Migrations

- [ ] Start web service
  ```bash
  docker-compose up -d web
  ```

- [ ] Generate Prisma Client
  ```bash
  docker-compose exec web npx prisma generate
  ```

- [ ] Run Prisma migrations
  ```bash
  docker-compose exec web npx prisma migrate deploy
  ```

- [ ] (Optional) Seed database with test data
  ```bash
  docker-compose exec web npm run seed
  ```

### Step 5: Verification

- [ ] Check all containers are running
  ```bash
  docker-compose ps
  ```

- [ ] Run database health check
  ```bash
  ./check-db.sh
  ```

- [ ] Check database tables exist
  ```bash
  docker-compose exec db psql -U abtesting -d abtesting -c "\dt"
  ```

- [ ] Verify record counts
  ```bash
  docker-compose exec db psql -U abtesting -d abtesting -c "SELECT COUNT(*) FROM \"Student\";"
  docker-compose exec db psql -U abtesting -d abtesting -c "SELECT COUNT(*) FROM \"Submission\";"
  docker-compose exec db psql -U abtesting -d abtesting -c "SELECT COUNT(*) FROM \"AdminUser\";"
  ```

- [ ] Test application accessibility
  ```bash
  curl http://localhost:3002/
  # or visit http://your-server-ip:3002 in browser
  ```

- [ ] Test login functionality (try logging in as admin or student)

- [ ] Test database connection from application
  - Try creating a submission
  - Try viewing admin dashboard

## Post-Migration Verification

### Application Testing
- [ ] Student login works
- [ ] Design customization works
- [ ] Submission creation works
- [ ] AI report generation works
- [ ] Screenshot capture works
- [ ] Admin dashboard accessible
- [ ] Admin can view all submissions
- [ ] Submission history displays correctly

### Database Access Testing
- [ ] Can connect with psql CLI
  ```bash
  docker-compose exec db psql -U abtesting -d abtesting
  ```

- [ ] Can launch Prisma Studio
  ```bash
  docker-compose exec web npx prisma studio
  ```

- [ ] (Optional) Can connect with DBeaver
  - Host: your-server-ip
  - Port: 5432
  - Database: abtesting
  - Username: abtesting
  - Password: abtesting_password

## DBeaver Connection Setup

### Method 1: Direct Connection
- [ ] Open DBeaver
- [ ] New Connection → PostgreSQL
- [ ] Enter connection details:
  - Host: `your-server-ip` or `localhost`
  - Port: `5432`
  - Database: `abtesting`
  - Username: `abtesting`
  - Password: `abtesting_password`
- [ ] Test Connection
- [ ] Save

### Method 2: SSH Tunnel (Recommended for Remote Servers)
- [ ] Open DBeaver
- [ ] New Connection → PostgreSQL
- [ ] **Main Tab:**
  - Host: `localhost`
  - Port: `5432`
  - Database: `abtesting`
  - Username: `abtesting`
  - Password: `abtesting_password`
- [ ] **SSH Tab:**
  - ☑ Use SSH Tunnel
  - Host/IP: `your-server-ip`
  - Port: `22`
  - Username: `your-ssh-username`
  - Auth Method: Public Key or Password
  - Private Key: `~/.ssh/id_rsa` (if using key)
- [ ] Test Connection
- [ ] Save

### DBeaver Verification
- [ ] Can see all tables (Student, Submission, AdminUser)
- [ ] Can view table data
- [ ] Can execute queries
- [ ] Can export data

## Security Hardening (Production)

- [ ] **Change default database password**
  - Update `POSTGRES_PASSWORD` in docker-compose.yml or .env
  - Update `DATABASE_URL` accordingly
  - Restart containers: `docker-compose down && docker-compose up -d`

- [ ] **Restrict PostgreSQL port exposure**
  - Remove `ports` section from `db` service in docker-compose.yml (if not needed for external access)
  - Or use firewall to restrict access

- [ ] **Set up firewall rules**
  ```bash
  # Ubuntu/Debian
  sudo ufw allow 22/tcp       # SSH
  sudo ufw allow 3002/tcp     # Application
  sudo ufw enable
  
  # Only allow PostgreSQL from specific IPs (optional)
  sudo ufw allow from YOUR_IP_ADDRESS to any port 5432
  ```

- [ ] **Configure SSL/TLS for database** (for production)

- [ ] **Set up regular backups**
  ```bash
  # Add to crontab
  0 2 * * * cd /path/to/AB-testing && docker-compose exec db pg_dump -U abtesting abtesting | gzip > /backups/abtesting_$(date +\%Y\%m\%d).sql.gz
  ```

- [ ] **Set up log rotation**

- [ ] **Monitor disk usage**
  ```bash
  docker system df
  df -h
  ```

## Backup Strategy

### Manual Backup
- [ ] Create backup script
  ```bash
  cat > backup-db.sh << 'EOF'
  #!/bin/bash
  BACKUP_DIR="./backups"
  mkdir -p $BACKUP_DIR
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  docker-compose exec db pg_dump -U abtesting abtesting | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz
  echo "Backup created: $BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
  EOF
  chmod +x backup-db.sh
  ```

- [ ] Test backup
  ```bash
  ./backup-db.sh
  ```

### Automated Backup (Cron)
- [ ] Set up daily automated backups
  ```bash
  crontab -e
  # Add: 0 2 * * * /path/to/AB-testing/backup-db.sh
  ```

## Monitoring Setup

- [ ] Set up container health monitoring
  ```bash
  watch docker-compose ps
  ```

- [ ] Set up log monitoring
  ```bash
  docker-compose logs -f
  ```

- [ ] (Optional) Set up external monitoring (Prometheus, Grafana, etc.)

## Rollback Plan (If Needed)

If something goes wrong:

1. [ ] Stop new services
   ```bash
   docker-compose down
   ```

2. [ ] Checkout previous version
   ```bash
   git log --oneline -10  # Find previous commit
   git checkout <previous-commit-hash>
   ```

3. [ ] Restore SQLite backup
   ```bash
   cp prisma/dev.db.backup.* prisma/dev.db
   ```

4. [ ] Start old services
   ```bash
   docker-compose up -d
   ```

## Documentation

- [ ] Update team documentation with new connection details
- [ ] Share DBeaver connection instructions with instructors
- [ ] Document backup procedures
- [ ] Update runbooks/playbooks

## Final Checks

- [ ] All containers running: `docker-compose ps`
- [ ] Application accessible: http://your-server-ip:3002
- [ ] Database accessible via DBeaver
- [ ] Backups configured and tested
- [ ] Security hardening completed
- [ ] Team notified of changes
- [ ] Documentation updated

## Quick Reference Commands

### Check Status
```bash
./check-db.sh                          # Comprehensive health check
docker-compose ps                      # Container status
docker-compose logs -f db              # Database logs
docker-compose logs -f web             # Application logs
```

### Database Access
```bash
docker-compose exec db psql -U abtesting -d abtesting    # CLI access
docker-compose exec web npx prisma studio                # Prisma Studio
```

### Backup & Restore
```bash
./backup-db.sh                                           # Create backup
docker-compose exec db pg_dump -U abtesting abtesting > backup.sql
docker-compose exec -T db psql -U abtesting abtesting < backup.sql
```

### Restart Services
```bash
docker-compose restart db              # Restart database only
docker-compose restart web             # Restart application only
docker-compose restart                 # Restart all services
```

## Troubleshooting Reference

| Issue | Command | Documentation |
|-------|---------|---------------|
| Connection refused | `./check-db.sh` | POSTGRESQL_MIGRATION.md |
| Can't connect with DBeaver | Check firewall, verify credentials | DATABASE_CONNECTION.md |
| Migration failed | `docker-compose logs web` | POSTGRESQL_MIGRATION.md |
| Database won't start | `docker-compose logs db` | POSTGRESQL_MIGRATION.md |
| Need to rollback | Follow Rollback Plan above | MIGRATION_SUMMARY.md |

## Support Resources

- **Migration Guide:** `POSTGRESQL_MIGRATION.md`
- **Connection Reference:** `DATABASE_CONNECTION.md`
- **Migration Summary:** `MIGRATION_SUMMARY.md`
- **Docker Guide:** `DOCKER.md`
- **Main README:** `README.md`

---

## Migration Status

- **Start Date:** _____________
- **Completed Date:** _____________
- **Performed By:** _____________
- **Status:** ☐ Success ☐ Failed ☐ Rolled Back
- **Notes:** _____________________________________________

---

**✅ Migration Complete!** You can now manage your database easily with DBeaver or other PostgreSQL tools.