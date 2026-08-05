# 🔧 Railway Deployment Troubleshooting Guide

Common issues and their solutions when deploying to Railway.

---

## 🚨 Build Errors

### Error: "Composer install failed"

**Symptoms:**
```
ERROR: composer install failed with exit code 1
```

**Solutions:**
1. **Check PHP version requirement:**
   ```bash
   # In composer.json, verify:
   "require": {
       "php": "^8.2"  // Matches nixpacks.toml php83
   }
   ```

2. **Update composer.lock:**
   ```bash
   composer update --lock
   git add composer.lock
   git commit -m "Update composer.lock"
   git push
   ```

3. **Check for missing extensions:**
   - Add to `nixpacks.toml` under `nixPkgs`
   - Common: `php83Extensions.gd`, `php83Extensions.zip`

---

### Error: "Permission denied on storage/"

**Symptoms:**
```
file_put_contents(storage/framework/cache/...): Failed to open stream: Permission denied
```

**Solution:**
Update `nixpacks.toml` start command:
```toml
[start]
cmd = "chmod -R 775 storage bootstrap/cache && php artisan config:cache && ..."
```

Already fixed in your config! ✅

---

### Error: "Node modules not found"

**Symptoms:**
```
ERROR: Cannot find module 'vite'
```

**Solutions:**
1. **Verify package.json exists**
2. **Check build command includes:**
   ```bash
   npm install
   npm run build
   ```

3. **Add to nixpacks.toml:**
   ```toml
   [phases.build]
   cmds = [
       "npm install",
       "npm run build",
       "composer install --no-dev --optimize-autoloader"
   ]
   ```

---

## 🗄️ Database Errors

### Error: "Database connection refused"

**Symptoms:**
```
SQLSTATE[HY000] [2002] Connection refused
```

**Solutions:**

1. **Verify MySQL plugin is added:**
   - Railway Dashboard → New → Database → MySQL
   - Wait for it to be "Active"

2. **Check environment variables:**
   - Go to Laravel service → Variables
   - Ensure these exist (auto-created by Railway):
     ```
     MYSQLHOST
     MYSQLPORT
     MYSQLDATABASE
     MYSQLUSER
     MYSQLPASSWORD
     ```

3. **Verify .env.railway uses correct references:**
   ```env
   DB_HOST=${{MYSQLHOST}}  # Not hardcoded!
   DB_PORT=${{MYSQLPORT}}
   DB_DATABASE=${{MYSQLDATABASE}}
   DB_USERNAME=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   ```

4. **Link services if needed:**
   - Railway should auto-link MySQL and Laravel service
   - Check "Variables" tab shows MySQL variables

---

### Error: "Access denied for user"

**Symptoms:**
```
SQLSTATE[HY000] [1045] Access denied for user 'root'@'...'
```

**Solutions:**

1. **Don't hardcode credentials!**
   ```env
   # ❌ WRONG
   DB_USERNAME=root
   DB_PASSWORD=mypassword
   
   # ✅ CORRECT
   DB_USERNAME=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   ```

2. **Delete and recreate MySQL plugin:**
   - Railway may have failed to set up credentials
   - Delete MySQL service
   - Add new MySQL service
   - Redeploy Laravel service

---

### Error: "Base table or view not found"

**Symptoms:**
```
SQLSTATE[42S02]: Base table or view not found: 1146 Table 'railway.users' doesn't exist
```

**Solutions:**

1. **Check migrations ran:**
   - Look in Railway logs for "Migrating: ..."
   - Should see migration output during deployment

2. **Verify start command includes migrations:**
   ```toml
   [start]
   cmd = "... && php artisan migrate --force && ..."
   ```
   Already in your config! ✅

3. **Manually run migrations:**
   - Railway → MySQL service → Connect
   - Or Railway CLI:
     ```bash
     railway run php artisan migrate --force
     ```

4. **Check migration files:**
   ```bash
   ls database/migrations/
   # Ensure migration files exist
   ```

---

## 🔐 Authentication Errors

### Error: "No application encryption key"

**Symptoms:**
```
RuntimeException: No application encryption key has been specified.
```

**Solutions:**

1. **Set APP_KEY in Railway:**
   ```bash
   # Generate locally
   php artisan key:generate --show
   
   # Copy output (base64:...)
   # Add to Railway Variables:
   APP_KEY=base64:YOUR_GENERATED_KEY_HERE
   ```

2. **Verify in Railway:**
   - Service → Variables → Search "APP_KEY"
   - Should be: `base64:....` (not empty!)

3. **Redeploy after adding:**
   - Railway should auto-redeploy
   - Or manually: Deployments → Redeploy

---

### Error: "CSRF token mismatch"

**Symptoms:**
```
419 | Page Expired
```

**Solutions:**

1. **Set APP_URL correctly:**
   ```env
   APP_URL=https://your-actual-railway-domain.up.railway.app
   ```

2. **Check session driver:**
   ```env
   SESSION_DRIVER=database  # Not file!
   SESSION_DOMAIN=.railway.app
   ```

3. **Verify APP_ENV:**
   ```env
   APP_ENV=production  # Not local!
   ```

---

### Error: "Can't login - 401 Unauthorized"

**Symptoms:**
- Login form submits but returns 401
- Or redirects back to login

**Solutions:**

1. **Check admin user was seeded:**
   - Look in logs for "Seeding: AdminSeeder"
   - If missing, check seeder runs in start command

2. **Verify credentials:**
   ```
   Email: admin@businesscenter.com
   Password: admin123
   ```

3. **Check database has users:**
   - Railway → MySQL → Connect
   - Run: `SELECT * FROM users;`

4. **Manually seed if needed:**
   ```bash
   railway run php artisan db:seed --class=AdminSeeder --force
   ```

---

## 🌐 Networking Errors

### Error: "Application not accessible"

**Symptoms:**
- URL shows "Application Error"
- Or times out

**Solutions:**

1. **Check deployment status:**
   - Railway → Deployments
   - Should show "Active" (green)
   - Not "Building" or "Crashed"

2. **Verify port binding:**
   - nixpacks.toml should have:
     ```toml
     cmd = "... php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"
     ```
   - Railway sets `PORT` automatically

3. **Check logs for errors:**
   - Railway → View Logs
   - Look for PHP errors or crashes

4. **Verify domain is generated:**
   - Settings → Networking → Public Networking
   - Should show a railway.app domain

---

### Error: "Mixed content warnings"

**Symptoms:**
```
Mixed Content: The page was loaded over HTTPS, but requested an insecure resource
```

**Solutions:**

1. **Force HTTPS in .env.railway:**
   ```env
   APP_URL=https://your-app.up.railway.app  # https, not http!
   ```

2. **Add to AppServiceProvider:**
   ```php
   public function boot()
   {
       if ($this->app->environment('production')) {
           \URL::forceScheme('https');
       }
   }
   ```

---

## 📁 File Storage Errors

### Error: "Uploaded files disappear after deploy"

**Symptoms:**
- Upload works
- After redeploy, files are gone

**This is EXPECTED!** Railway uses ephemeral filesystem.

**Solutions:**

1. **Add Railway Volume:**
   - Service → Settings → Volumes
   - Mount: `/app/storage/app/public`
   
2. **Or use S3/Cloudinary:**
   - See `FILE_STORAGE_SETUP.md` for details

---

### Error: "File upload failed"

**Symptoms:**
```
The file could not be uploaded.
```

**Solutions:**

1. **Check file permissions:**
   ```toml
   [start]
   cmd = "chmod -R 775 storage && ..."
   ```

2. **Verify storage link:**
   - Add to build command:
     ```bash
     php artisan storage:link
     ```

3. **Check upload limits:**
   - Railway default: 100MB
   - PHP default: 2MB (increase if needed)

---

## 🐌 Performance Issues

### Issue: "Slow response times"

**Symptoms:**
- Pages load slowly (> 3 seconds)
- API responses delayed

**Solutions:**

1. **Enable caching:**
   ```env
   CACHE_STORE=database  # Or redis
   SESSION_DRIVER=database
   ```

2. **Add Redis for better performance:**
   - Railway → New → Database → Redis
   - Update .env.railway:
     ```env
     CACHE_STORE=redis
     SESSION_DRIVER=redis
     REDIS_HOST=${{REDIS_HOST}}
     REDIS_PORT=${{REDIS_PORT}}
     ```

3. **Optimize queries:**
   - Check for N+1 queries
   - Add database indexes
   - Use eager loading

4. **Increase resources:**
   - Railway → Settings → Resources
   - Upgrade to 1GB RAM if needed

---

### Issue: "Memory limit exceeded"

**Symptoms:**
```
PHP Fatal error: Allowed memory size of X bytes exhausted
```

**Solutions:**

1. **Increase PHP memory:**
   - Create `php.ini` in project root:
     ```ini
     memory_limit = 256M
     upload_max_filesize = 20M
     post_max_size = 20M
     ```

2. **Optimize code:**
   - Avoid loading large datasets into memory
   - Use chunking for large queries
   - Stream responses for large files

---

## 🔄 Deployment Issues

### Issue: "Deployment stuck on 'Building'"

**Symptoms:**
- Build doesn't progress
- Hangs for > 10 minutes

**Solutions:**

1. **Cancel and retry:**
   - Railway → Deployments → Cancel
   - Push a small change to trigger rebuild

2. **Check for infinite loops:**
   - Review build commands in nixpacks.toml
   - Ensure no blocking commands

3. **Reduce build complexity:**
   - Remove unnecessary build steps
   - Cache dependencies if possible

---

### Issue: "Failed to deploy: Healthcheck timeout"

**Symptoms:**
```
Deployment failed: Healthcheck timed out after 300s
```

**Solutions:**

1. **Check application starts:**
   - Review logs for startup errors
   - Ensure migrations complete quickly

2. **Increase timeout (railway.json):**
   ```json
   {
     "deploy": {
       "healthcheckTimeout": 600
     }
   }
   ```

3. **Simplify startup:**
   - Move heavy operations out of startup
   - Use queue workers for long tasks

---

## 📧 Email Errors

### Error: "Mail not sending"

**Symptoms:**
- Password reset emails not arriving
- Notification emails missing

**Solutions:**

1. **Check mail driver:**
   ```env
   MAIL_MAILER=log  # For development/testing
   # OR
   MAIL_MAILER=smtp  # For production
   ```

2. **Configure SMTP (production):**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_username
   MAIL_PASSWORD=your_password
   MAIL_FROM_ADDRESS=noreply@yourdomain.com
   ```

3. **Test email configuration:**
   ```bash
   railway run php artisan tinker
   > Mail::raw('Test', fn($msg) => $msg->to('test@example.com')->subject('Test'));
   ```

---

## 🔍 Debugging Tips

### Enable Debug Mode (Temporarily!)

**Only for troubleshooting, then disable!**

```env
APP_DEBUG=true
APP_ENV=local
```

This will show detailed error messages.

**⚠️ NEVER leave debug enabled in production!**

---

### View Detailed Logs

**In Railway:**
```
Railway → Your Service → View Logs
```

**Locally test production config:**
```bash
# Copy Railway variables to .env.testing
cp .env.example .env.testing

# Set database to local MySQL
# Run migrations
php artisan migrate --env=testing

# Test
php artisan serve --env=testing
```

---

### Common Log Errors to Search For

```bash
# In Railway logs, search for:
"error"
"exception"
"failed"
"could not"
"unable to"
"denied"
```

---

## 🆘 Still Stuck?

### 1. Check Railway Status
Visit [status.railway.app](https://status.railway.app)

### 2. Railway Discord
[discord.gg/railway](https://discord.gg/railway) - Very responsive community

### 3. Railway Docs
[docs.railway.app](https://docs.railway.app) - Comprehensive documentation

### 4. Laravel Logs
Check `storage/logs/laravel.log` via Railway:
```bash
railway run cat storage/logs/laravel.log
```

---

## 📋 Debugging Checklist

When things go wrong, check these in order:

- [ ] Railway dashboard shows "Active" deployment
- [ ] MySQL plugin is added and active
- [ ] All environment variables are set
- [ ] APP_KEY is set correctly
- [ ] APP_DEBUG is false
- [ ] Logs show successful migration
- [ ] Logs show successful seeding
- [ ] Database has users table
- [ ] Admin user exists in database
- [ ] No errors in Railway logs
- [ ] Public domain is generated
- [ ] APP_URL matches public domain

---

**Most Common Fixes:**
1. 🔑 Set APP_KEY
2. 🗄️ Verify MySQL plugin is added
3. 🔐 Use Railway variable references (not hardcoded)
4. 📁 Check file permissions (chmod 775)
5. 🔄 Redeploy after config changes

---

*Happy debugging! 🐛🔍*
