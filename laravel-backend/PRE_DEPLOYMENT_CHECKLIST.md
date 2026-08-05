# ✅ Pre-Deployment Checklist

Complete this checklist before deploying to Railway to ensure a smooth deployment.

---

## 📋 Code Preparation

### 1. Environment Configuration
- [ ] `.env.railway` file exists with correct Railway variable references
- [ ] `APP_KEY` is set (run `php artisan key:generate --show` if needed)
- [ ] `APP_DEBUG=false` in production environment
- [ ] Database connection uses Railway variables (`${{MYSQLHOST}}`, etc.)

### 2. Dependencies
- [ ] Run `composer install` successfully locally
- [ ] Run `npm install` successfully locally
- [ ] All required PHP extensions are listed in `nixpacks.toml`
- [ ] No missing dependencies in `composer.json`

### 3. Database
- [ ] All migrations are up to date
- [ ] Seeders are working (test: `php artisan db:seed`)
- [ ] AdminSeeder creates the default admin user
- [ ] No database-specific queries that break on MySQL

### 4. Build Process
- [ ] Frontend builds successfully: `npm run build`
- [ ] No TypeScript/JavaScript errors
- [ ] Vite config is correct for production
- [ ] Public assets are in correct directories

---

## 🔒 Security

### Critical Security Items
- [ ] `APP_DEBUG=false` in `.env.railway`
- [ ] Strong `APP_KEY` is set
- [ ] Default admin password will be changed after first login
- [ ] `.env` file is in `.gitignore` (don't commit secrets!)
- [ ] No hardcoded credentials in code
- [ ] CORS settings are configured if using separate frontend

### Security Best Practices
- [ ] Rate limiting is enabled for API routes
- [ ] Input validation on all forms
- [ ] SQL injection protection (using Eloquent/Query Builder)
- [ ] XSS protection enabled
- [ ] CSRF protection for web routes

---

## 🗂️ File Structure

### Required Files
- [ ] `Procfile` - Railway start command
- [ ] `railway.toml` - Railway configuration (optional but recommended)
- [ ] `.env.railway` - Production environment variables
- [ ] `.railwayignore` - Files to exclude from deployment
- [ ] `composer.json` - PHP dependencies
- [ ] `package.json` - Node dependencies

### Deployment Documentation
- [ ] `RAILWAY_DEPLOYMENT_GUIDE.md` - Full deployment guide
- [ ] `RAILWAY_QUICK_START.md` - Quick reference
- [ ] `FILE_STORAGE_SETUP.md` - Storage configuration guide
- [ ] `ADMIN_CREDENTIALS.md` - Default credentials documented

---

## 🧪 Testing

### Local Testing
- [ ] Application runs locally: `php artisan serve`
- [ ] Login works with test credentials
- [ ] API endpoints respond correctly
- [ ] Database queries work on MySQL (not just SQLite)
- [ ] Frontend connects to backend API

### API Testing
```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@businesscenter.com","password":"admin123"}'
```
- [ ] Login endpoint returns token
- [ ] Protected endpoints require authentication
- [ ] Error responses are proper JSON

---

## 🎯 Git Repository

### Git Setup
- [ ] Repository initialized: `git init`
- [ ] All files staged: `git add .`
- [ ] Initial commit created
- [ ] Remote repository added (GitHub/GitLab/etc.)
- [ ] Code pushed to main branch

### Git Hygiene
- [ ] `.gitignore` excludes sensitive files
- [ ] No `.env` file in repository
- [ ] No `node_modules/` in repository
- [ ] No `vendor/` in repository
- [ ] Commit messages are descriptive

```bash
# Verify no sensitive files
git status

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 🚂 Railway Account

### Account Setup
- [ ] Railway account created at [railway.app](https://railway.app)
- [ ] GitHub connected to Railway
- [ ] Payment method added (if past free tier)
- [ ] Understand Railway pricing (~$5-10/month expected)

---

## 📊 Post-Deployment Verification Plan

Prepare to verify these after deployment:

### Immediate Checks (First 5 minutes)
- [ ] Build completed successfully
- [ ] No error logs during deployment
- [ ] Application is running (not crashed)
- [ ] Public URL is accessible
- [ ] Home page loads

### Functional Tests (Next 10 minutes)
- [ ] Database tables exist
- [ ] Admin user was seeded
- [ ] Login with admin credentials works
- [ ] API endpoints return correct responses
- [ ] File uploads work (if applicable)

### Performance Checks
- [ ] Response time < 2 seconds
- [ ] No memory errors in logs
- [ ] No database connection issues

---

## 🎨 Frontend (React/Inertia)

### Build Configuration
- [ ] `vite.config.ts` has correct production settings
- [ ] Assets are versioned/hashed
- [ ] Base URL is configurable
- [ ] Build output goes to `public/build`

### Inertia Setup
- [ ] Inertia middleware is registered
- [ ] React dependencies are installed
- [ ] SSR is disabled (or properly configured)

---

## 📧 Optional Services (Can Configure Later)

### Email Service
- [ ] Mail driver chosen (SendGrid, Mailgun, SES, etc.)
- [ ] SMTP credentials obtained
- [ ] Test email sent successfully
- [ ] `MAIL_*` variables in Railway

### File Storage
- [ ] Storage solution chosen (Volume, S3, Cloudinary)
- [ ] Credentials configured (if external)
- [ ] Test file upload works
- [ ] Public URLs are accessible

### Redis (Optional)
- [ ] Redis plugin added in Railway (if needed)
- [ ] Cache driver set to `redis`
- [ ] Session driver set to `redis` (optional)
- [ ] Queue driver set to `redis` (optional)

---

## 💰 Cost Estimation

### Expected Monthly Costs
- Laravel App (512MB RAM): ~$3-5
- MySQL Database (256MB RAM): ~$2-3
- Storage Volume (5GB): ~$1.25
- **Total**: ~$6-9/month

### Free Tier
- Railway offers $5 free credit
- Good for testing/small apps
- No credit card required initially

---

## 🚨 Common Issues to Avoid

### ❌ Don't Do These
- [ ] ~~Set `APP_DEBUG=true` in production~~
- [ ] ~~Commit `.env` file to git~~
- [ ] ~~Use SQLite in production~~
- [ ] ~~Hardcode database credentials~~
- [ ] ~~Skip migrations in build~~
- [ ] ~~Ignore file permission errors~~

### ✅ Do These Instead
- [x] Use `APP_DEBUG=false`
- [x] Use environment variables
- [x] Use MySQL database
- [x] Reference Railway variables
- [x] Run migrations automatically
- [x] Set proper file permissions (775)

---

## 📝 Environment Variables Checklist

Copy this to Railway Variables (Raw Editor):

```env
# Required
APP_NAME=MinSU Business Center
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:LWcv/1/FDOzqdswMMo2mMNJS4JM/+dImEFlrMhpMYJI=

# Database (Auto-configured by Railway MySQL)
DB_CONNECTION=mysql
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_DATABASE=${{MYSQLDATABASE}}
DB_USERNAME=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Logging
LOG_CHANNEL=stderr
LOG_LEVEL=error

# Will add after domain generated
# APP_URL=https://your-app.up.railway.app
```

---

## 🎯 Ready to Deploy?

If you've checked all the critical items above, you're ready!

### Final Steps:
1. Commit and push all changes to GitHub
2. Follow `RAILWAY_QUICK_START.md` for deployment
3. Use `RAILWAY_DEPLOYMENT_GUIDE.md` for detailed instructions
4. Configure file storage using `FILE_STORAGE_SETUP.md`

---

## 📞 Support Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Laravel Docs**: [laravel.com/docs](https://laravel.com/docs)
- **This Project's Issues**: [Your GitHub Repo Issues]

---

## 🎉 Deployment Success Criteria

You'll know deployment was successful when:

✅ Build logs show "Deployment successful"  
✅ No error logs in Railway  
✅ Public URL returns your app  
✅ Can login with admin credentials  
✅ API endpoints respond correctly  
✅ Database has data  

**Once all checked, you're live! 🚀**

---

**Estimated Time to Deploy**: 15-30 minutes (first time)

**Last Updated**: $(date)
