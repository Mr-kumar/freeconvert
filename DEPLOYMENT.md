# 🚀 Professional Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- All service accounts (Neon, Supabase, Upstash, Render, Koyeb, Vercel)
- Environment variables ready
- GitHub repository connected

## 🏗️ Service Setup

### **1. Neon (Database)**
```bash
# 1. Create Neon project
# 2. Get connection string
# 3. Run migrations
cd apps/backend
alembic upgrade head
```

### **2. Supabase (Storage)**
```bash
# 1. Create Supabase project
# 2. Enable S3 Interoperability
#    - Go to Storage > Settings > S3 Interoperability
#    - Click "Enable"
#    - Get access keys
# 3. Configure CORS
#    - Storage > Settings > CORS
#    - Add origins: ["https://freeconvert.in", "https://freeconvert-web.vercel.app"]
#    - Methods: GET, POST, PUT, DELETE, HEAD
#    - Headers: *
#    - Expose Headers: ETag
```

### **3. Upstash (Redis)**
```bash
# 1. Create Upstash Redis database
# 2. Get connection string (use rediss:// for SSL)
# 3. Set eviction policy to "noeviction"
# 4. Enable TLS
```

### **4. Render (Backend)**
```bash
# 1. Create Web Service
# 2. Connect GitHub repo
# 3. Settings:
#    - Root Directory: apps/backend
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn app.main:app --host 0.0.0.0 --port 8000
#    - Health Check: /health
# 4. Environment Variables (copy from .env.production)
# 5. Deploy
```

### **5. Koyeb (Worker)**
```bash
# 1. Create Worker service
# 2. Use koyeb.yaml configuration
# 3. Settings:
#    - Type: WORKER
#    - Region: Singapore (sgp)
#    - Instance: nano
#    - Health Check: Disabled
# 4. Environment Variables (same as Render)
# 5. Deploy
```

### **6. Vercel (Frontend)**
```bash
# 1. Connect GitHub repo
# 2. Settings:
#    - Build Command: npm run build
#    - Output Directory: out
#    - Install Command: npm install
# 3. Environment Variables:
#    - NEXT_PUBLIC_API_URL=https://your-app.onrender.com
#    - NEXT_PUBLIC_S3_BUCKET_NAME=uploads
# 4. Deploy
```

## 🔧 Environment Variables

### **Render & Koyeb (Backend & Worker)**
```bash
DATABASE_URL=postgresql://neondb_owner:npg_iT8qFoPuQKG4@ep-icy-darkness-aitc1lax-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
REDIS_URL=rediss://default:AW71AAIncDI0ZTNhZjIxNjFiNWE0MDhhYWFmMzg2MDBhOWY5MWI0OXAyMjg0MDU@factual-ox-28405.upstash.io:6379
AWS_ACCESS_KEY_ID=60d7b42db0473b02c9ab7ce66633b339
AWS_SECRET_ACCESS_KEY=9db0c8161ffdfa5aa0c907aa74197e89dcfa9b3fe8a0e3205931e3af8f70836e
AWS_REGION=us-east-1
S3_BUCKET_NAME=uploads
S3_ENDPOINT_URL=https://cvguwhejqzfiftimjjzt.storage.supabase.co/storage/v1/s3
SECRET_KEY=@@@Manishanti@@@09876
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS=["https://freeconvert.in", "https://freeconvert-web.vercel.app"]
ALLOWED_FILE_TYPES=["application/pdf", "image/jpeg", "image/png", "image/jpg"]
MAX_FILE_SIZE_MB=100
S3_EXPIRY_SECONDS=3600
```

### **Vercel (Frontend)**
```bash
NEXT_PUBLIC_API_URL=https://your-app.onrender.com
NEXT_PUBLIC_S3_BUCKET_NAME=uploads
```

## ✅ Verification Checklist

### **After Deployment**

#### **1. Backend Health**
```bash
curl https://your-app.onrender.com/health
# Expected: {"status": "healthy", "service": "freeconvert-backend"}
```

#### **2. Worker Status**
```bash
# Check Koyeb logs
# Expected: [info] celery@freeconvert-worker ready
```

#### **3. Database Connection**
```bash
# Check Render logs
# Expected: No database connection errors
```

#### **4. Redis Connection**
```bash
# Check logs
# Expected: No Redis connection errors
```

#### **5. S3 Upload**
```bash
# Test file upload
# Expected: Files uploaded to Supabase storage
```

#### **6. Full Flow**
```bash
# Test complete upload → process → download flow
# Expected: All steps working without errors
```

## 🚨 Common Issues & Solutions

### **Database Connection Failed**
```bash
# Check DATABASE_URL format
# Ensure SSL is enabled
# Verify Neon database is active
```

### **Redis Connection Failed**
```bash
# Use rediss:// (with s for SSL)
# Check Upstash Redis is active
# Verify TLS is enabled
```

### **S3 Upload Failed**
```bash
# Check S3 credentials
# Verify S3_ENDPOINT_URL is correct
# Ensure CORS is configured
# Check bucket permissions
```

### **Worker Not Starting**
```bash
# Check Koyeb logs
# Verify environment variables
# Ensure Celery configuration is correct
```

### **Frontend API Errors**
```bash
# Check NEXT_PUBLIC_API_URL
# Verify CORS origins
# Check backend health
```

## 🔄 CI/CD Pipeline

### **GitHub Actions (Optional)**
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl -X POST https://api.render.com/v1/services/...
      - name: Deploy to Koyeb
        run: koyeb deploy ...
```

## 📊 Monitoring

### **Health Checks**
- Backend: `/health`
- Database: Connection status
- Redis: Connection status
- S3: Bucket access

### **Log Monitoring**
- Render logs
- Koyeb logs
- Vercel logs
- Error tracking

### **Performance Metrics**
- Response times
- Upload speeds
- Processing times
- Error rates

## 🛠️ Maintenance

### **Regular Tasks**
- Monitor logs daily
- Check queue lengths
- Update dependencies
- Backup database
- Review security settings

### **Scaling**
- Add more workers if queue builds up
- Scale backend if traffic increases
- Optimize database queries
- Add caching layers

## 🎯 Production Best Practices

### **Security**
- Use HTTPS everywhere
- Rotate secrets regularly
- Monitor for suspicious activity
- Keep dependencies updated

### **Performance**
- Optimize images and files
- Use CDN for static assets
- Implement caching strategies
- Monitor resource usage

### **Reliability**
- Implement retry logic
- Use circuit breakers
- Set up alerts
- Have backup systems

---

**🎉 Your professional FreeConvert SaaS is now live!**
