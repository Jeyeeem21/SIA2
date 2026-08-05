# 🚀 Railway Quick Start

## One-Time Setup (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Wait for build to complete (~3-5 minutes)

### 3. Add MySQL Database
1. Click **"New"** → **"Database"** → **"Add MySQL"**
2. Done! Railway auto-connects it to your app

### 4. Set Variables (Copy-Paste This)
Click your Laravel service → **"Variables"** → **"Raw Editor"** → Paste:

```env
APP_NAME=MinSU Business Center
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:LWcv/1/FDOzqdswMMo2mMNJS4JM/+dImEFlrMhpMYJI=
SESSION_DRIVER=database
CACHE_STORE=database
LOG_LEVEL=error
```

### 5. Generate Public URL
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL and add one more variable:
```env
APP_URL=https://your-generated-url.up.railway.app
```

### 6. Redeploy
Click **"Deploy"** → Your app is live! 🎉

---

## 🧪 Test Your Deployment

**Login Test:**
```bash
curl -X POST https://your-app.up.railway.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@businesscenter.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "name": "System Administrator",
    "email": "admin@businesscenter.com",
    "role": "admin"
  },
  "token": "..."
}
```

---

## 🔐 Security Checklist

- [ ] Change admin password after first login
- [ ] Generate new APP_KEY: `php artisan key:generate --show`
- [ ] Verify APP_DEBUG=false
- [ ] Set up custom domain (optional)

---

## 📝 Default Admin Credentials

**Email:** `admin@businesscenter.com`  
**Password:** `admin123`

⚠️ **CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN!**

---

## 🔄 How to Update

Just push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway automatically redeploys! ✨

---

## 💡 Common Issues

**Build Failed?**
- Check Railway logs for specific errors
- Ensure MySQL database is added
- Verify all variables are set

**Can't Login?**
- Check if migrations ran (look for "Migrating" in logs)
- Verify AdminSeeder ran successfully
- Check database has users table with admin user

**500 Error?**
- Set `APP_DEBUG=true` temporarily to see error
- Check logs: Railway → Service → "View Logs"
- Ensure APP_KEY is set

---

## 📞 Need Help?

See the full guide: `RAILWAY_DEPLOYMENT_GUIDE.md`

Railway Discord: [discord.gg/railway](https://discord.gg/railway)

---

**Deployment Time: ~5-7 minutes** ⏱️
