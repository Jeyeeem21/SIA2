# 📁 File Storage Setup for Railway

Railway uses **ephemeral filesystem** - uploaded files are deleted on each deployment. Here are your storage solutions:

---

## Option 1: Railway Volumes (Simple, Good for Small Apps)

### Pros:
- ✅ Easy to set up (no code changes)
- ✅ Cheap ($0.25/GB/month)
- ✅ Fast (attached to your instance)

### Cons:
- ❌ Limited to 50GB
- ❌ No CDN
- ❌ Harder to scale

### Setup:

1. **In Railway Dashboard:**
   - Go to your Laravel service
   - Click **"Settings"** → **"Volumes"**
   - Click **"New Volume"**
   - Mount path: `/app/storage/app/public`

2. **Link Storage:**
```bash
php artisan storage:link
```

3. **No Code Changes Needed!** Your existing code will work.

---

## Option 2: AWS S3 (Recommended for Production)

### Pros:
- ✅ Unlimited storage
- ✅ CDN integration (CloudFront)
- ✅ Industry standard
- ✅ Highly scalable

### Cons:
- ❌ Requires AWS account
- ❌ More configuration
- ❌ Costs more at scale

### Setup:

#### 1. Create S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com)
2. Click **"Create bucket"**
3. Name: `minsu-business-center-files`
4. Region: Choose closest to you
5. Uncheck "Block all public access" (for public files like avatars)
6. Create bucket

#### 2. Set Bucket Policy

Bucket → Permissions → Bucket Policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::minsu-business-center-files/*"
    }
  ]
}
```

#### 3. Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam)
2. Users → Add user → Name: `laravel-s3-user`
3. Attach policy: `AmazonS3FullAccess`
4. Create access key → Download credentials

#### 4. Install S3 Driver

```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
```

#### 5. Update Railway Variables

Add these to Railway environment variables:
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=minsu-business-center-files
AWS_URL=https://minsu-business-center-files.s3.amazonaws.com
AWS_USE_PATH_STYLE_ENDPOINT=false
```

#### 6. Update config/filesystems.php (Already Done!)

Laravel's default S3 config should work. Verify:
```php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
],
```

#### 7. No Code Changes Needed!

Your existing code using `Storage::disk('public')` will now use S3:
```php
// This will automatically upload to S3
Storage::disk('public')->put('avatars/user.jpg', $file);

// Get URL
Storage::disk('public')->url('avatars/user.jpg');
// Returns: https://your-bucket.s3.amazonaws.com/avatars/user.jpg
```

---

## Option 3: Cloudinary (Easiest for Images)

### Pros:
- ✅ Free tier (25GB storage, 25GB bandwidth)
- ✅ Automatic image optimization
- ✅ Image transformations (resize, crop, etc.)
- ✅ CDN included
- ✅ Easy to set up

### Cons:
- ❌ Primarily for images/videos
- ❌ Different API than Laravel's Storage

### Setup:

#### 1. Sign Up

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free)
3. Get your credentials from Dashboard

#### 2. Install Package

```bash
composer require cloudinary-labs/cloudinary-laravel
```

#### 3. Publish Config

```bash
php artisan vendor:publish --provider="CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider" --tag="cloudinary-laravel-config"
```

#### 4. Update Railway Variables

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 5. Use in Code

```php
// Upload
$uploadedFileUrl = cloudinary()->upload($request->file('avatar')->getRealPath())->getSecurePath();

// Upload with transformation
$uploadedFileUrl = cloudinary()->upload($request->file('avatar')->getRealPath(), [
    'folder' => 'avatars',
    'transformation' => [
        'width' => 200,
        'height' => 200,
        'crop' => 'fill'
    ]
])->getSecurePath();
```

---

## Comparison Table

| Feature | Railway Volume | AWS S3 | Cloudinary |
|---------|---------------|---------|------------|
| **Setup Difficulty** | ⭐ Easy | ⭐⭐⭐ Moderate | ⭐⭐ Easy |
| **Cost (Small)** | $0.25/GB | $0.023/GB | Free (25GB) |
| **CDN** | ❌ No | ✅ Yes (CloudFront) | ✅ Yes (Built-in) |
| **Max Storage** | 50GB | Unlimited | Unlimited |
| **Image Transform** | ❌ No | ❌ No | ✅ Yes |
| **Best For** | Development/Small | Production | Images/Videos |

---

## Recommended Setup by Scale

### 🏠 Small Business (< 1000 users)
**Railway Volumes**
- Cost: ~$5-10/month
- Easy to manage
- Sufficient for basic needs

### 🏢 Medium Business (1000-10000 users)
**AWS S3**
- Cost: ~$20-50/month
- Scalable
- Professional solution

### 🏭 Large Business (> 10000 users)
**AWS S3 + CloudFront CDN**
- Cost: Variable
- Maximum performance
- Global distribution

---

## Current File Upload Usage in Your App

Based on your codebase, these files are uploaded:

1. **User Avatars** (`avatar_url` field)
2. **Product Images** (if any)
3. **Invoice PDFs** (if generated)

### Example: Updating Avatar Upload

If you're using S3, your current code should work as-is:

```php
// In your controller
public function updateAvatar(Request $request)
{
    $path = $request->file('avatar')->store('avatars', 'public');
    
    // With S3, this automatically uploads to S3 and returns:
    // avatars/xyz123.jpg
    
    auth()->user()->update([
        'avatar_url' => Storage::disk('public')->url($path)
    ]);
    // Returns: https://your-bucket.s3.amazonaws.com/avatars/xyz123.jpg
}
```

---

## 🚨 Important Notes

### Before Deploying:

1. **Choose your storage solution** based on the comparison above
2. **Set `FILESYSTEM_DISK` in Railway** to match your choice:
   - Volume: `FILESYSTEM_DISK=local`
   - S3: `FILESYSTEM_DISK=s3`
   - Cloudinary: Use Cloudinary API directly

3. **Test file uploads** in development first
4. **Back up existing files** before switching

### After Deploying:

1. Test avatar upload functionality
2. Verify files are accessible via URL
3. Check file permissions
4. Monitor storage usage

---

## 🆘 Troubleshooting

### Files not uploading to S3?
```bash
# Check Railway logs for AWS errors
# Verify credentials are correct
# Ensure bucket policy allows uploads
```

### Getting 403 errors?
- Check bucket policy allows public read
- Verify IAM user has S3 permissions
- Ensure bucket region matches config

### Files not showing after upload?
- Check `FILESYSTEM_DISK` is set correctly
- Verify `AWS_URL` is correct
- Clear config cache: `php artisan config:clear`

---

## 💡 My Recommendation for Your App

**Start with Railway Volumes**, then migrate to S3 when:
- You have > 500 active users
- Storage exceeds 20GB
- You need better performance
- You want CDN benefits

**Why?** 
- ✅ Simpler setup (5 minutes)
- ✅ Lower initial cost
- ✅ Easy to migrate later
- ✅ No code changes needed

---

**Need help setting this up?** Let me know which option you choose and I can help configure it! 🚀
