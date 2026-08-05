# Railway Deployment Error Fixes

## Problems Identified

### 1. React Hydration Error #421
- **Cause**: Invalid SVG favicon with incorrect viewBox attribute
- **Status**: ✅ FIXED (replaced with PNG favicon)

### 2. Backend 502 Bad Gateway
- **Cause**: Missing critical environment variables in Railway backend
- **Status**: ⚠️ NEEDS ACTION

---

## Backend Environment Variables - MISSING ITEMS

Your current Railway backend variables are **INCOMPLETE**. You're missing several critical variables:

### ✅ What You Have:
```
APP_KEY=base64:LWcv/1/FDOzqdswMMo2mMNJS4JM/+dImEFlrMhpMYJI=
DB_CONNECTION=mysql
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
```

### ❌ What You're MISSING (Critical):

```
APP_NAME=MinSU Business Center
APP_ENV=production
APP_DEBUG=false
APP_URL=https://YOUR-BACKEND-DOMAIN.up.railway.app
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
CACHE_STORE=database
QUEUE_CONNECTION=database
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
LOG_CHANNEL=stderr
LOG_LEVEL=error
LOG_STACK=single
BCRYPT_ROUNDS=12
MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS=noreply@businesscenter.app
MAIL_FROM_NAME=MinSU Business Center
```

### ❌ What You're MISSING (CORS - Most Important for 502):

```
CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND-DOMAIN.up.railway.app
SANCTUM_STATEFUL_DOMAINS=YOUR-FRONTEND-DOMAIN.up.railway.app
```

---

## Step-by-Step Fix Instructions

### Step 1: Add ALL Missing Environment Variables

Go to your **Laravel Backend service** in Railway:

1. Click on your backend service
2. Go to **Variables** tab
3. Click **"New Variable"** and add each one below:

#### Core App Variables:
```
Variable Name              | Value
---------------------------|------------------------------------------
APP_NAME                   | MinSU Business Center
APP_ENV                    | production
APP_DEBUG                  | false
APP_URL                    | https://businesscenterbackend.up.railway.app
```

#### Session & Cache:
```
SESSION_DRIVER             | database
SESSION_LIFETIME           | 120
SESSION_ENCRYPT            | false
CACHE_STORE                | database
QUEUE_CONNECTION           | database
```

#### Logging:
```
LOG_CHANNEL                | stderr
LOG_LEVEL                  | error
LOG_STACK                  | single
BROADCAST_CONNECTION       | log
FILESYSTEM_DISK            | local
```

#### Security:
```
BCRYPT_ROUNDS              | 12
```

#### Mail:
```
MAIL_MAILER                | log
MAIL_HOST                  | 127.0.0.1
MAIL_PORT                  | 2525
MAIL_USERNAME              | null
MAIL_PASSWORD              | null
MAIL_FROM_ADDRESS          | noreply@businesscenter.app
MAIL_FROM_NAME             | MinSU Business Center
```

#### CORS & Sanctum (CRITICAL for 502 fix):
```
CORS_ALLOWED_ORIGINS       | https://businesscenter.up.railway.app
SANCTUM_STATEFUL_DOMAINS   | businesscenter.up.railway.app
```

**Note**: Replace the domain names with your **actual** Railway domains if they're different.

---

### Step 2: Verify Your Frontend Variables

Go to your **React Frontend service** in Railway:

1. Click on your frontend service
2. Go to **Variables** tab
3. Verify you have:

```
Variable Name              | Value
---------------------------|------------------------------------------
VITE_API_URL               | https://businesscenterbackend.up.railway.app/api
```

---

### Step 3: Rebuild and Deploy

After adding all variables:

1. Railway will **automatically redeploy** both services
2. Wait 2-3 minutes for builds to complete
3. Check build logs for any errors

---

### Step 4: Check Laravel CORS Configuration

If 502 error persists, verify your Laravel CORS config:

```php
// File: laravel-backend/config/cors.php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('CORS_ALLOWED_ORIGINS', '*')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

### Step 5: Verify Sanctum Configuration

Check your `config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000')),
```

---

## Frontend Fix Applied

✅ **Fixed**: Replaced invalid SVG favicon with valid PNG base64 icon

The hydration error was caused by:
```html
<!-- ❌ INVALID -->
viewBox='0 0 100% 129px'

<!-- ✅ FIXED -->
Using PNG instead of problematic SVG
```

---

## Testing After Fixes

### Test 1: Backend Health Check
```
https://businesscenterbackend.up.railway.app/api/health
```
Should return: 200 OK

### Test 2: Frontend Loads
```
https://businesscenter.up.railway.app
```
Should load without React errors

### Test 3: CORS Works
- Open frontend URL
- Open browser console (F12)
- Try to login
- Should NOT see CORS errors

### Test 4: API Connection
- Login should work
- Dashboard should load data
- No 502 errors in network tab

---

## Common Errors After Fix

### Error: "Session mismatch"
**Solution**: Clear browser cookies and try again

### Error: "CSRF token mismatch"
**Solution**: 
1. Make sure `SANCTUM_STATEFUL_DOMAINS` is set correctly
2. No `https://` prefix on this variable
3. Clear cookies and retry

### Error: Still getting 502
**Solution**:
1. Check Railway logs for backend service
2. Look for PHP errors or database connection issues
3. Verify database is running and accessible
4. Check if migrations ran successfully

---

## Quick Checklist

- [ ] All environment variables added to backend
- [ ] CORS_ALLOWED_ORIGINS includes your frontend domain
- [ ] SANCTUM_STATEFUL_DOMAINS includes your frontend domain (no https://)
- [ ] APP_URL set to your backend domain
- [ ] VITE_API_URL in frontend points to backend
- [ ] Both services redeployed successfully
- [ ] Frontend loads without React errors
- [ ] Login works
- [ ] No 502 errors in browser console

---

## Need Help?

If issues persist after following these steps:

1. **Check Railway Logs**: 
   - Click on backend service → "Deployments" → Latest deployment → View logs
   
2. **Check Browser Console**:
   - F12 → Console tab → Look for specific error messages
   
3. **Check Network Tab**:
   - F12 → Network tab → Look for failed requests and their responses

---

**Last Updated**: Based on current deployment state
**Frontend Domain**: businesscenter.up.railway.app
**Backend Domain**: businesscenterbackend.up.railway.app
