# Database Connection Quick Reference

## PostgreSQL Connection Details

### Default Credentials (Development & Testing)
⚠️ **Change these in production!**

```
Host:     localhost (local) or your-server-ip (remote)
Port:     5432 (production) / 5433 (development)
Database: abtesting
Username: abtesting
Password: abtesting_password
```

### Connection String Format
```
postgresql://abtesting:abtesting_password@localhost:5432/abtesting
```

## Connecting with DBeaver

### Method 1: Direct Connection (Simple)

1. **Open DBeaver** → New Database Connection → PostgreSQL
2. **Fill in connection details:**
   - Host: `your-server-ip`
   - Port: `5432`
   - Database: `abtesting`
   - Username: `abtesting`
   - Password: `abtesting_password`
3. **Test Connection** → **Finish**

### Method 2: SSH Tunnel (Secure - Recommended for Production)

1. **Open DBeaver** → New Database Connection → PostgreSQL
2. **Main Tab:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `abtesting`
   - Username: `abtesting`
   - Password: `abtesting_password`
3. **SSH Tab:**
   - ✓ Use SSH Tunnel
   - Host/IP: `your-server-ip`
   - Port: `22`
   - User Name: `your-ssh-username`
   - Authentication Method: Public Key or Password
   - Private Key: `~/.ssh/id_rsa` (or your key path)
4. **Test Connection** → **Finish**

## Connecting with Other Tools

### pgAdmin

1. Right-click **Servers** → Register → Server
2. **General Tab:** Name: `AB Testing Server`
3. **Connection Tab:**
   - Host: `your-server-ip`
   - Port: `5432`
   - Maintenance database: `abtesting`
   - Username: `abtesting`
   - Password: `abtesting_password`
4. **SSH Tunnel Tab** (if using SSH):
   - Use SSH tunneling: Yes
   - Tunnel host: `your-server-ip`
   - Tunnel port: `22`
   - Username: `your-ssh-username`

### Prisma Studio (Built-in)

**On Remote Server:**
```bash
docker-compose exec web npx prisma studio
```

**On Local Machine (create tunnel):**
```bash
ssh -L 5555:localhost:5555 user@your-server-ip
```

**Open in Browser:**
```
http://localhost:5555
```

### psql (Command Line)

**Direct connection:**
```bash
psql -h your-server-ip -p 5432 -U abtesting -d abtesting
```

**Via Docker:**
```bash
docker-compose exec db psql -U abtesting -d abtesting
```

**Via SSH tunnel:**
```bash
# Terminal 1: Create tunnel
ssh -L 5432:localhost:5432 user@your-server-ip

# Terminal 2: Connect via tunnel
psql -h localhost -p 5432 -U abtesting -d abtesting
```

## Common SQL Commands

### View all tables
```sql
\dt
```

### View table structure
```sql
\d Student
\d Submission
\d AdminUser
```

### Count records
```sql
SELECT COUNT(*) FROM "Student";
SELECT COUNT(*) FROM "Submission";
SELECT COUNT(*) FROM "AdminUser";
```

### View recent submissions
```sql
SELECT id, "studentId", "conversionRate", "createdAt" 
FROM "Submission" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

### View all students with submission counts
```sql
SELECT s."studentId", s.name, s."submissionCount", COUNT(sub.id) as actual_submissions
FROM "Student" s
LEFT JOIN "Submission" sub ON s."studentId" = sub."studentId"
GROUP BY s.id, s."studentId", s.name, s."submissionCount"
ORDER BY s."createdAt" DESC;
```

### Clear all data (⚠️ Destructive!)
```sql
TRUNCATE TABLE "Submission", "Student", "AdminUser" CASCADE;
```

## Docker Database Management

### View database logs
```bash
docker-compose logs -f db
```

### Check database status
```bash
docker-compose ps db
docker-compose exec db pg_isready -U abtesting
```

### Restart database
```bash
docker-compose restart db
```

### Backup database
```bash
# Create backup
docker-compose exec db pg_dump -U abtesting abtesting > backup_$(date +%Y%m%d_%H%M%S).sql

# Create compressed backup
docker-compose exec db pg_dump -U abtesting abtesting | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore database
```bash
# From SQL file
docker-compose exec -T db psql -U abtesting abtesting < backup.sql

# From compressed file
gunzip -c backup.sql.gz | docker-compose exec -T db psql -U abtesting abtesting
```

### Reset database (⚠️ Deletes all data!)
```bash
docker-compose exec web npx prisma migrate reset
```

## Production Security Checklist

- [ ] Change default database password
- [ ] Use environment variables for credentials
- [ ] Don't expose PostgreSQL port (5432) to public internet
- [ ] Use SSL/TLS for database connections
- [ ] Set up regular automated backups
- [ ] Use SSH tunneling for remote connections
- [ ] Implement database access logging
- [ ] Use strong passwords (16+ characters, mixed case, numbers, symbols)
- [ ] Restrict database user permissions (principle of least privilege)
- [ ] Keep PostgreSQL updated with security patches

## Troubleshooting

### Cannot connect to database

**Check 1: Is PostgreSQL running?**
```bash
docker-compose ps
docker-compose logs db
```

**Check 2: Is the port accessible?**
```bash
# On server
netstat -tuln | grep 5432

# From local machine
telnet your-server-ip 5432
```

**Check 3: Firewall settings**
```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 5432/tcp

# CentOS/RHEL
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-port=5432/tcp
```

### Connection refused

- Ensure PostgreSQL container is running: `docker-compose up -d db`
- Check if port is exposed in `docker-compose.yml`
- Verify firewall allows connections on port 5432

### Authentication failed

- Double-check username and password
- Verify credentials match those in `docker-compose.yml`
- Check if user exists: `docker-compose exec db psql -U postgres -c "\du"`

### Database does not exist

```bash
# Create database manually
docker-compose exec db createdb -U abtesting abtesting

# Or recreate with Prisma
docker-compose exec web npx prisma migrate deploy
```

## Need Help?

- See detailed migration guide: [POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md)
- Docker instructions: [DOCKER.md](DOCKER.md)
- Main README: [README.md](README.md)