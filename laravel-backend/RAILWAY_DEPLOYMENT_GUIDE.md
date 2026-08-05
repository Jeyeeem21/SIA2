# 🚂 Railway Deployment Guide - MinSU Business Center

This guide will walk you through deploying your Laravel application to Railway.

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Railway account ([railway.app](https://railway.app))
- [ ] Git installed on your machine
- [ ] Your code pushed to a GitHub repository

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Prepare for Railway deployment"
```

2. **Push to GitHub**:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your Laravel repository
6. Railway will automatically detect your Procfile

---

### Step 3: Add MySQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically create a MySQL database and generate credentials
4. The database variables will be automatically available to your Laravel service

---

### Step 4: Configure Environment Variables

Click on your Laravel service → **Variables** tab → **Add variables**:

#### Required Variables:

```env
APP_NAME=MinSU Business Center
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:LWcv/1/FDOzqdswMMo2mMNJS4JM/+dImEFlrMhpMYJI=
```

#### Database Variables (Auto-configured):
Railway automatically provides these when you add MySQL:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`

Your app will read them automatically from the `.env.railway` file!

#### Optional but Recommended:

```env
LOG_LEVEL=error
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

---

### Step 5: Set Up Public Domain

1. In your Laravel service settings, go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Railway will provide a public URL like `your-app.up.railway.app`
4. Copy this URL and add it as an environment variable:
```env
APP_URL=https://your-app.up.railway.app
```

---

### Step 6: Deploy!

Railway will automatically:
1. ✅ Detect Laravel project
2. ✅ Install PHP dependencies via Composer
3. ✅ Set file permissions correctly
4. ✅ Run migrations
5. ✅ Seed the admin user
6. ✅ Start the Laravel server

Watch the deployment logs in the **"Deployments"** tab.

---

## 🔍 Verify Deployment

Once deployed, test these endpoints:

1. **Health Check**: 
   ```
   https://your-app.up.railway.app
   ```

2. **API Login**:
   ```bash
   curl -X POST https://your-app.up.railway.app/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@businesscenter.com","password":"admin123"}'
   ```

3. **Check Admin Credentials**:
   - See `ADMIN_CREDENTIALS.md` for default login details

---

## ⚙️ Configuration Files Explained

### `Procfile`
Tells Railway how to start your app:
- Installs PHP dependencies (Composer)
- Sets correct file permissions
- Runs config cache for better performance
- Runs migrations automatically
- Seeds admin user
- Starts Laravel server on Railway's assigned port

### `railway.toml`
Railway-specific configuration:
- Health check settings (ensures app is running)
- Restart policy (auto-restart on failures)
- Timeout configurations

### `.env.railway`
Contains production environment variables with Railway-specific placeholders like `${{MYSQLHOST}}`

---

## 🔐 Security Recommendations

### 1. Regenerate APP_KEY (Important!)
```bash
php artisan key:generate --show
```
Copy the output and update the `APP_KEY` variable in Railway.

### 2. Change Default Admin Password
After first deployment, login and change the default admin password:
- Email: `admin@businesscenter.com`
- Default Password: `admin123`

### 3. Enable HTTPS Only
In Railway settings, ensure "Force HTTPS" is enabled (it usually is by default).

### 4. Set APP_DEBUG=false
Never set `APP_DEBUG=true` in production!

---

## 📁 File Storage Considerations

⚠️ **Important**: Railway uses ephemeral filesystem. Files uploaded (like avatars) will be deleted on each deployment!

### Solution Options:

#### Option 1: Railway Volumes (Recommended for Small Files)
1. In Railway, go to your service → **"Settings"** → **"Volumes"**
2. Add volume: Mount path `/app/storage/app/public`
3. Update `.env.railway`:
```env
FILESYSTEM_DISK=local
```

#### Option 2: AWS S3 (Recommended for Production)
1. Create an S3 bucket
2. Install AWS SDK:
```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
```
3. Add to `.env.railway`:
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_bucket_name
AWS_URL=https://your_bucket.s3.amazonaws.com
```

#### Option 3: Cloudinary (Easy & Free Tier)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Install package:
```bash
composer require cloudinary-labs/cloudinary-laravel
```
3. Configure in Railway variables

---

## 🐛 Troubleshooting

### Deployment Failed

**Check Build Logs:**
1. Go to Railway → Your service → **"Deployments"**
2. Click on the failed deployment
3. Check logs for errors

**Common Issues:**

#### 1. "Permission denied" errors
Railway automatically handles permissions via the Procfile. If you still get errors, check the Railway logs for specific permission issues.

#### 2. Database connection failed
- Ensure MySQL plugin is added
- Check that `DB_*` variables reference the MySQL plugin correctly
- Verify the MySQL service is running

#### 3. "Encryption key not found"
- Make sure `APP_KEY` is set in Railway variables
- Run `php artisan key:generate --show` locally and copy the key

#### 4. Migration errors
- Check the build logs for specific migration errors
- You might need to adjust migrations for production MySQL vs local SQLite

---

## 📊 Monitoring & Logs

### View Application Logs:
1. Railway Dashboard → Your service
2. Click **"View Logs"**
3. Filter by log level (error, info, etc.)

### Database Access:
Railway provides a MySQL client in the database plugin:
1. Click on MySQL service
2. Go to **"Connect"** tab
3. Use provided connection string or Railway's built-in query tool

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your main branch!

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway will:
1. Detect the push
2. Rebuild the application
3. Run migrations automatically
4. Deploy with zero downtime

---

## 💰 Pricing Considerations

- **Free Trial**: $5 free credit (no credit card required)
- **Hobby Plan**: $5/month + usage
- **Pro Plan**: $20/month + usage

**Estimated Monthly Cost** (Small App):
- Laravel App: ~$3-5
- MySQL Database: ~$2-3
- **Total**: ~$5-8/month

Monitor usage in Railway → **"Usage"** tab

---

## 🆘 Need Help?

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Laravel Docs**: [laravel.com/docs](https://laravel.com/docs)

---

## ✅ Post-Deployment Checklist

- [ ] Application is accessible via public URL
- [ ] Database migrations ran successfully
- [ ] Admin seeder created default user
- [ ] Can login with admin credentials
- [ ] API endpoints are working
- [ ] Changed default admin password
- [ ] Set up file storage solution
- [ ] Configured custom domain (optional)
- [ ] Set up monitoring/alerts (optional)
- [ ] Configured mail service (if needed)

---

## 🎯 Next Steps

1. **Custom Domain** (Optional):
   - Go to Railway → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Set Up Email Service**:
   - Use services like SendGrid, Mailgun, or AWS SES
   - Update `MAIL_*` variables in Railway

3. **Enable Queue Workers** (For background jobs):
   - Add a new service in Railway
   - Use command: `php artisan queue:work --tries=3`

4. **Add Redis** (For better caching):
   - Add Redis plugin in Railway
   - Update cache driver to `redis`

---

**Happy Deploying! 🚀**
