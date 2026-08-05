# 🎯 Getting Started - MinSU Business Center

Welcome! This guide will help you get up and running quickly.

---

## 🗂️ Documentation Index

Your project now has comprehensive documentation for deployment and development:

### 📖 Quick Reference
- **[README.md](./laravel-backend/README.md)** - Project overview & local development setup
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - This file (start here!)

### 🚂 Railway Deployment Guides
- **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** - 📌 **START HERE** for deployment overview
- **[RAILWAY_QUICK_START.md](./laravel-backend/RAILWAY_QUICK_START.md)** - ⚡ 5-minute deployment guide
- **[RAILWAY_DEPLOYMENT_GUIDE.md](./laravel-backend/RAILWAY_DEPLOYMENT_GUIDE.md)** - 📚 Detailed step-by-step guide
- **[PRE_DEPLOYMENT_CHECKLIST.md](./laravel-backend/PRE_DEPLOYMENT_CHECKLIST.md)** - ✅ Pre-flight checklist

### 🔧 Configuration & Support
- **[FILE_STORAGE_SETUP.md](./laravel-backend/FILE_STORAGE_SETUP.md)** - Configure file uploads for production
- **[TROUBLESHOOTING.md](./laravel-backend/TROUBLESHOOTING.md)** - 🐛 Common issues & solutions
- **[ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md)** - Default login credentials

---

## 🚀 What Do You Want To Do?

### Option 1: Deploy to Railway (Recommended First Step)

**Time Required:** 15-30 minutes

1. ✅ Read: [`DEPLOYMENT_SUMMARY.md`](./DEPLOYMENT_SUMMARY.md)
2. ✅ Check: [`PRE_DEPLOYMENT_CHECKLIST.md`](./laravel-backend/PRE_DEPLOYMENT_CHECKLIST.md)
3. ✅ Deploy: [`RAILWAY_QUICK_START.md`](./laravel-backend/RAILWAY_QUICK_START.md)
4. ✅ Configure Storage: [`FILE_STORAGE_SETUP.md`](./laravel-backend/FILE_STORAGE_SETUP.md)

**Result:** Your app running live on the internet! 🌐

---

### Option 2: Run Locally for Development

**Time Required:** 10-15 minutes

1. ✅ Read: [`README.md`](./laravel-backend/README.md)
2. ✅ Follow "Local Development" section
3. ✅ Access app at: `http://localhost:8000`

**Result:** Development environment ready on your machine! 💻

---

### Option 3: Both (Recommended)

1. First, deploy to Railway (see Option 1)
2. Then, set up local environment (see Option 2)
3. Make changes locally, push to deploy

**Result:** Best of both worlds! 🎉

---

## 📊 Project Overview

### What You Have

```
BusinessCenter/SIA/
│
├── laravel-backend/          # Laravel + React App
│   ├── app/                  # PHP Application Code
│   ├── resources/js/         # React Components
│   ├── database/             # Migrations & Seeders
│   ├── routes/               # API & Web Routes
│   │
│   ├── .env                  # Local environment (YOUR MACHINE)
│   ├── .env.railway          # Production environment (RAILWAY)
│   ├── Procfile              # Railway start command
│   ├── railway.toml          # Railway configuration
│   │
│   └── Documentation/
│       ├── README.md
│       ├── RAILWAY_QUICK_START.md
│       ├── RAILWAY_DEPLOYMENT_GUIDE.md
│       ├── FILE_STORAGE_SETUP.md
│       ├── PRE_DEPLOYMENT_CHECKLIST.md
│       └── TROUBLESHOOTING.md
│
├── DEPLOYMENT_SUMMARY.md     # Start here for deployment
├── GETTING_STARTED.md        # This file
└── ADMIN_CREDENTIALS.md      # Default login info
```

### What It Does

✅ **Business Management System** with:
- User authentication & authorization
- Product & inventory management
- Order processing & invoicing
- Payment tracking
- Sales analytics
- Staff management
- Toga rental system

---

## 🎯 Quick Start Workflows

### Workflow 1: "I want to see it live ASAP!"

```bash
# 1. Push to GitHub
cd laravel-backend
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to railway.app
# 3. Deploy from GitHub
# 4. Add MySQL database
# 5. Set environment variables (see RAILWAY_QUICK_START.md)
# 6. Done!
```

**Time:** ~15 minutes  
**Difficulty:** ⭐⭐☆☆☆ Easy

---

### Workflow 2: "I want to develop locally first"

```bash
cd laravel-backend

# 1. Install dependencies
composer install
npm install

# 2. Set up environment
cp .env.example .env
php artisan key:generate

# 3. Set up database
php artisan migrate --seed

# 4. Start servers
# Terminal 1:
php artisan serve

# Terminal 2:
npm run dev

# 5. Open browser: http://localhost:8000
```

**Time:** ~10 minutes  
**Difficulty:** ⭐⭐⭐☆☆ Moderate

---

### Workflow 3: "I deployed, now I want to make changes"

```bash
# 1. Make changes locally
code laravel-backend/

# 2. Test locally
php artisan serve
npm run dev

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin main

# 4. Railway automatically redeploys!
# Check Railway dashboard for deployment status
```

**Time:** ~5 minutes per update  
**Difficulty:** ⭐☆☆☆☆ Very Easy

---

## 🔐 Default Credentials

After deployment or local setup, login with:

```
URL: https://your-app.up.railway.app
Email: admin@businesscenter.com
Password: admin123
```

⚠️ **IMPORTANT:** Change this password immediately after first login!

See: [`ADMIN_CREDENTIALS.md`](./ADMIN_CREDENTIALS.md) for details.

---

## 💡 Common Questions

### Q: Do I need to deploy to use the app?
**A:** No! You can run it locally. But deployment makes it accessible online.

### Q: How much does Railway cost?
**A:** $5 free trial, then ~$6-9/month for small apps.

### Q: Can I use a different hosting provider?
**A:** Yes! The app works on AWS, DigitalOcean, Heroku, etc. Railway is just easiest.

### Q: What if deployment fails?
**A:** Check [`TROUBLESHOOTING.md`](./laravel-backend/TROUBLESHOOTING.md) for solutions.

### Q: How do I update the deployed app?
**A:** Just push to GitHub. Railway auto-redeploys!

### Q: Where are uploaded files stored?
**A:** See [`FILE_STORAGE_SETUP.md`](./laravel-backend/FILE_STORAGE_SETUP.md) for options.

---

## 🛠️ Required Tools

### For Local Development
- ✅ PHP 8.3+ ([php.net](https://php.net))
- ✅ Composer ([getcomposer.org](https://getcomposer.org))
- ✅ Node.js 18+ ([nodejs.org](https://nodejs.org))
- ✅ MySQL 8.0+ or SQLite
- ✅ Git ([git-scm.com](https://git-scm.com))

### For Railway Deployment
- ✅ Git
- ✅ GitHub account ([github.com](https://github.com))
- ✅ Railway account ([railway.app](https://railway.app))
- ✅ That's it! Railway handles PHP, Composer, Node, MySQL

---

## 📚 Learning Path

### New to Laravel?
1. Start with local development (Option 2 above)
2. Follow [Laravel Documentation](https://laravel.com/docs)
3. Explore the codebase in `laravel-backend/app/`

### New to Deployment?
1. Start with Railway deployment (Option 1 above)
2. Follow `RAILWAY_QUICK_START.md`
3. If issues arise, check `TROUBLESHOOTING.md`

### Experienced Developer?
1. Review `README.md` for project structure
2. Deploy to Railway in 5 minutes
3. Set up local development
4. Start building features!

---

## 🎨 Key Files Explained

### Configuration Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `.env` | Local config | Always (your machine) |
| `.env.railway` | Production config | Rarely (uses Railway variables) |
| `Procfile` | Start command | Only if changing startup process |
| `railway.toml` | Railway settings | Rarely (health checks, restart policy) |
| `composer.json` | PHP dependencies | When adding packages |
| `package.json` | Node dependencies | When adding packages |

### Documentation Files

| File | Purpose | Read When |
|------|---------|-----------|
| `README.md` | Project overview | First time setup |
| `DEPLOYMENT_SUMMARY.md` | Deployment overview | Before deploying |
| `RAILWAY_QUICK_START.md` | Fast deployment | Deploying to Railway |
| `RAILWAY_DEPLOYMENT_GUIDE.md` | Detailed deployment | Need more details |
| `FILE_STORAGE_SETUP.md` | Storage config | After deployment |
| `TROUBLESHOOTING.md` | Problem solving | When issues occur |

---

## ✅ Success Indicators

### Local Development Success
- [ ] `php artisan serve` runs without errors
- [ ] `npm run dev` compiles successfully
- [ ] Can access `http://localhost:8000`
- [ ] Can login with admin credentials
- [ ] Dashboard loads correctly

### Deployment Success
- [ ] Railway build completes
- [ ] No errors in Railway logs
- [ ] Public URL is accessible
- [ ] Can login with admin credentials
- [ ] API endpoints respond correctly

---

## 🚨 If Something Goes Wrong

### Local Development Issues
1. Check PHP version: `php -v` (needs 8.3+)
2. Check Composer: `composer --version`
3. Check Node: `node -v` (needs 18+)
4. Clear cache: `php artisan optimize:clear`
5. Check `README.md` troubleshooting section

### Deployment Issues
1. Check Railway logs (Railway dashboard)
2. Review `TROUBLESHOOTING.md`
3. Verify environment variables are set
4. Ask in Railway Discord: [discord.gg/railway](https://discord.gg/railway)

---

## 🎯 Next Steps

### Just Starting?
1. ✅ **Read this document** (you're here!)
2. ✅ Choose: Local dev OR deployment (or both!)
3. ✅ Follow the relevant guide
4. ✅ Login and explore the app

### Ready to Deploy?
1. ✅ Read [`DEPLOYMENT_SUMMARY.md`](./DEPLOYMENT_SUMMARY.md)
2. ✅ Complete [`PRE_DEPLOYMENT_CHECKLIST.md`](./laravel-backend/PRE_DEPLOYMENT_CHECKLIST.md)
3. ✅ Follow [`RAILWAY_QUICK_START.md`](./laravel-backend/RAILWAY_QUICK_START.md)
4. ✅ 🎉 Celebrate your live app!

### Ready to Develop?
1. ✅ Read [`README.md`](./laravel-backend/README.md)
2. ✅ Follow "Local Development" section
3. ✅ Explore the codebase
4. ✅ Start building features!

---

## 📞 Get Help

- **Documentation**: You're reading it! See index at top
- **Railway Help**: [discord.gg/railway](https://discord.gg/railway)
- **Laravel Help**: [laravel.com/docs](https://laravel.com/docs)
- **React Help**: [react.dev](https://react.dev)

---

## 🎉 You're Ready!

Everything is set up and documented. Choose your path:

### 🚀 Deploy Now
→ [`DEPLOYMENT_SUMMARY.md`](./DEPLOYMENT_SUMMARY.md)

### 💻 Develop Locally
→ [`README.md`](./laravel-backend/README.md)

### 🤔 Learn More
→ [`RAILWAY_DEPLOYMENT_GUIDE.md`](./laravel-backend/RAILWAY_DEPLOYMENT_GUIDE.md)

---

**Good luck with your project! 🚀**

*Questions? Check the documentation files or ask in Railway/Laravel communities!*
