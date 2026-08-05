# MinSU Business Center - Laravel Backend

A comprehensive business management system built with Laravel 12, React, and Inertia.js.

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Set up database
php artisan migrate --seed

# Start development servers
npm run dev        # Frontend (Vite)
php artisan serve  # Backend (http://localhost:8000)
```

**Default Admin Login:**
- Email: `admin@businesscenter.com`
- Password: `admin123`

---

## 📦 Tech Stack

- **Backend**: Laravel 12 (PHP 8.3)
- **Frontend**: React 19 + TypeScript
- **UI**: Inertia.js + Tailwind CSS 4
- **Database**: MySQL / SQLite
- **Authentication**: Laravel Sanctum + Fortify
- **State Management**: TanStack Query

---

## 🚂 Railway Deployment

This application is ready for one-click deployment to Railway!

### Quick Deploy (5 minutes)

1. **Read the deployment guide:**
   - 📖 [`RAILWAY_QUICK_START.md`](./RAILWAY_QUICK_START.md) - Fast setup
   - 📚 [`RAILWAY_DEPLOYMENT_GUIDE.md`](./RAILWAY_DEPLOYMENT_GUIDE.md) - Detailed guide

2. **Deploy to Railway:**
   ```bash
   # Push to GitHub
   git push origin main
   
   # Go to railway.app and deploy from GitHub
   ```

3. **Add MySQL database** in Railway dashboard

4. **Set environment variables** (see deployment guide)

5. **Done!** Your app is live 🎉

### Deployment Documentation

- [`DEPLOYMENT_SUMMARY.md`](../DEPLOYMENT_SUMMARY.md) - Overview of deployment setup
- [`PRE_DEPLOYMENT_CHECKLIST.md`](./PRE_DEPLOYMENT_CHECKLIST.md) - Pre-flight checklist
- [`FILE_STORAGE_SETUP.md`](./FILE_STORAGE_SETUP.md) - Configure file uploads
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - Common issues & solutions

---

## 📁 Project Structure

```
laravel-backend/
├── app/
│   ├── Http/Controllers/      # API & Web Controllers
│   ├── Models/                # Eloquent Models
│   ├── Services/              # Business Logic
│   └── ...
├── database/
│   ├── migrations/            # Database Schema
│   └── seeders/               # Data Seeders
├── resources/
│   └── js/                    # React Components
├── routes/
│   ├── api.php               # API Routes
│   └── web.php               # Web Routes
├── .env.railway              # Production Environment
├── Procfile                  # Railway Start Command
├── railway.toml              # Railway Configuration
└── Procfile                  # Process Definition
```

---

## 🔐 Features

### Authentication & Authorization
- ✅ User login/logout
- ✅ Role-based access control (Admin, Staff, Customer)
- ✅ Two-factor authentication (2FA)
- ✅ Password reset
- ✅ API token authentication (Sanctum)

### Business Management
- ✅ Product management
- ✅ Inventory tracking
- ✅ Order processing
- ✅ Invoice generation
- ✅ Payment tracking
- ✅ Sales analytics
- ✅ Staff management
- ✅ Category management

### Toga Rental System
- ✅ Rental contracts
- ✅ Tenant management
- ✅ Payment tracking
- ✅ Maintenance logs
- ✅ Property management

---

## 🛠️ Development

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 18+
- MySQL 8.0+ or SQLite
- Git

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd laravel-backend
   ```

2. **Install dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Set up database:**
   ```bash
   # For SQLite (default)
   touch database/database.sqlite
   
   # Or configure MySQL in .env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Run migrations & seeders:**
   ```bash
   php artisan migrate --seed
   ```

6. **Build frontend:**
   ```bash
   npm run build
   ```

7. **Start development:**
   ```bash
   # Terminal 1: Backend
   php artisan serve
   
   # Terminal 2: Frontend (Hot reload)
   npm run dev
   ```

---

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
```

---

## 🔧 Available Commands

### Artisan Commands

```bash
# Database
php artisan migrate              # Run migrations
php artisan migrate:fresh --seed # Fresh database with seed data
php artisan db:seed              # Run seeders only

# Cache
php artisan config:cache         # Cache configuration
php artisan route:cache          # Cache routes
php artisan view:cache           # Cache views
php artisan cache:clear          # Clear application cache

# Development
php artisan serve                # Start dev server
php artisan tinker               # Interactive console
php artisan make:controller      # Generate controller
php artisan make:model           # Generate model
```

### NPM Scripts

```bash
npm run dev          # Start Vite dev server (hot reload)
npm run build        # Build for production
npm run build:ssr    # Build with SSR support
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run types        # Check TypeScript types
```

---

## 📊 API Documentation

### Authentication

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@businesscenter.com",
  "password": "admin123"
}

Response:
{
  "user": { ... },
  "token": "1|..."
}
```

### Protected Endpoints

```http
GET /api/user
Authorization: Bearer <token>

GET /api/products
Authorization: Bearer <token>

# More endpoints in routes/api.php
```

---

## 🔐 Security

### Best Practices Implemented

- ✅ CSRF protection
- ✅ XSS protection
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ Rate limiting on API routes
- ✅ Secure password hashing (bcrypt)
- ✅ API token authentication
- ✅ Environment-based configuration
- ✅ Input validation & sanitization

### Security Checklist

- [ ] Change default admin password after first login
- [ ] Generate new `APP_KEY` for production
- [ ] Set `APP_DEBUG=false` in production
- [ ] Use HTTPS in production
- [ ] Configure CORS properly
- [ ] Enable 2FA for admin accounts
- [ ] Regular security updates

---

## 🌍 Deployment

### Supported Platforms

- ✅ **Railway** (Recommended) - See deployment guides
- ✅ **AWS** (EC2, Elastic Beanstalk)
- ✅ **DigitalOcean** (App Platform, Droplet)
- ✅ **Heroku**
- ✅ **Laravel Vapor** (Serverless)

### Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure database connection
- [ ] Set up file storage (S3, Cloudinary, etc.)
- [ ] Configure mail service
- [ ] Set up SSL/TLS certificate
- [ ] Configure caching (Redis recommended)
- [ ] Set up monitoring & logging
- [ ] Configure backups

---

## 📈 Performance Optimization

### Implemented Optimizations

- ✅ Query optimization with eager loading
- ✅ Database indexing
- ✅ Response caching
- ✅ Asset minification & bundling
- ✅ Image optimization
- ✅ Gzip compression
- ✅ Database connection pooling

### Recommended for Production

- Add Redis for caching & sessions
- Enable OPcache for PHP
- Use CDN for static assets
- Implement queue workers for long tasks
- Set up database read replicas (if needed)

---

## 🐛 Troubleshooting

See [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) for common issues and solutions.

### Quick Fixes

**Permission errors:**
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

**Clear all caches:**
```bash
php artisan optimize:clear
```

**Regenerate autoloader:**
```bash
composer dump-autoload
```

---

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

```bash
# Format code
npm run format
./vendor/bin/pint

# Check types
npm run types

# Run linter
npm run lint
```

---

## 📄 License

This project is proprietary and confidential.

---

## 🆘 Support

- **Documentation**: See `/docs` folder or deployment guides
- **Issues**: [GitHub Issues](your-repo-url/issues)
- **Railway Help**: [discord.gg/railway](https://discord.gg/railway)
- **Laravel Help**: [laravel.com/docs](https://laravel.com/docs)

---

## 🎯 Roadmap

### Current Version (1.0)
- ✅ Core business management features
- ✅ Authentication & authorization
- ✅ API endpoints
- ✅ Admin dashboard
- ✅ Toga rental system

### Planned Features
- [ ] Advanced analytics & reporting
- [ ] Multi-tenant support
- [ ] Mobile app integration
- [ ] Real-time notifications
- [ ] Advanced inventory forecasting
- [ ] Automated email notifications
- [ ] Export functionality (PDF, Excel)
- [ ] Multi-language support

---

## 👥 Credits

**Developed by:** MinSU Business Center Team

**Built with:**
- [Laravel](https://laravel.com) - PHP Framework
- [React](https://react.dev) - UI Library
- [Inertia.js](https://inertiajs.com) - Modern Monolith
- [Tailwind CSS](https://tailwindcss.com) - Utility CSS
- [Railway](https://railway.app) - Deployment Platform

---

## 📞 Contact

For questions or support, please contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** 2026-08-05  
**Status:** Production Ready 🚀
