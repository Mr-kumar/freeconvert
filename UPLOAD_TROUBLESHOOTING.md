# Upload Troubleshooting Guide for FreeConvert

## Recently Fixed Issues (HTTP 422 Errors)

### What was causing the 422 error:

1. **Incorrect request format**: Backend endpoints were expecting `Dict` instead of proper Pydantic models
2. **Content-Type mismatch**: Presigned URL was strictly specifying ContentType, causing mismatch errors
3. **Poor error handling**: Error messages weren't being properly logged or displayed
4. **Missing MIME type detection**: Browser sometimes doesn't detect file type, causing failures

### Fixes Applied:

#### 1. Backend (/api/upload.py)

✅ Added proper Pydantic models for request validation:

- `ConfirmUploadRequest`
- `ConfirmUploadResponse`
- `CleanupUploadRequest`

#### 2. S3 Presigned URL Generation

✅ Removed strict ContentType requirement from presigned URL params

- Now allows frontend flexibility in setting Content-Type header
- More compatible with browsers that don't detect MIME types

#### 3. Frontend S3 Upload (api.ts)

✅ Improved error handling:

- Fallback MIME type detection based on file extension
- Detailed error logging from S3 responses
- Better error messages passed to UI

#### 4. File Upload Flow (useToolFlow.ts)

✅ Added comprehensive logging:

- MIME type inference with fallback logic
- Step-by-step upload process logging
- Better error messages for debugging

---

## Deployment Checklist for Render Backend

### 1. Environment Variables (.env or Render dashboard)

```
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379/0

# Application
DEBUG=False
ENVIRONMENT=production
MAX_FILE_SIZE_MB=100
S3_EXPIRY_SECONDS=3600

# CORS (important for Render backend with Vercel frontend)
CORS_ORIGINS=["https://your-frontend-domain.vercel.app", "https://yourdomain.com"]
```

### 2. AWS S3 Bucket Configuration

#### S3 Bucket CORS Policy (Critical!)

Go to AWS S3 → Your Bucket → Permissions → CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "https://your-frontend-domain.vercel.app",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag", "x-amz-meta-custom-header"],
    "MaxAgeSeconds": 3000
  }
]
```

#### S3 Bucket Policy

Make sure your bucket policy allows PutObject and GetObject operations.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR-ACCOUNT-ID:user/YOUR-IAM-USER"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/*",
        "arn:aws:s3:::your-bucket-name"
      ]
    }
  ]
}
```

### 3. Render Backend Configuration

#### Build Command

```bash
pip install -r requirements.txt
```

#### Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### Environment Setup

- Set all environment variables in Render Dashboard → Environment
- Ensure AWS credentials have proper S3 permissions
- Redis should be accessible (use Redis Cloud or similar)

---

## Debugging Steps

### 1. Check Logs in Browser Console

```javascript
// Open DevTools (F12) → Console tab
// You'll see detailed logs like:
// [Upload] Starting S3 upload: g.pdf (1024 bytes, application/pdf)
// [Upload] Successfully uploaded g.pdf to S3
```

### 2. Check Backend Logs

On Render, go to Logs and look for:

```
Generated presigned URL for session ...
Upload confirmed for session ...
```

### 3. Test Upload Manually

```bash
# Get presigned URL
curl -X POST http://localhost:8000/api/v1/upload/presigned-url \
  -H "Content-Type: application/json" \
  -d '{"file_name":"test.pdf","file_type":"application/pdf","file_size":1024}'

# Upload using the URL (replace with actual URL)
curl -X PUT "$PRESIGNED_URL" \
  -H "Content-Type: application/pdf" \
  --data-binary @test.pdf
```

---

## Common Issues & Solutions

### Issue: "HTTP 422: Unprocessable Entity"

**Cause**: Request format mismatch
**Solution**: Ensure backend is using Pydantic models (already fixed)

### Issue: "Failed to upload: HTTP 403"

**Cause**: AWS credentials don't have S3 permissions
**Solution**:

- Check IAM user permissions
- Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
- Test: `aws s3 ls s3://your-bucket-name/`

### Issue: "CORS error in browser"

**Cause**: S3 bucket doesn't allow cross-origin requests from frontend
**Solution**: Update S3 CORS policy with your frontend domain

### Issue: "Failed to upload: HTTP 404"

**Cause**: S3 bucket doesn't exist or name is wrong
**Solution**: Check S3_BUCKET_NAME in environment variables

### Issue: "Upload works locally but not on Render"

**Cause**: Environment variables not set in Render
**Solution**:

1. Go to Render Dashboard → Service → Environment
2. Add all required environment variables
3. Redeploy service

---

## Testing the Fix

### Local Testing

```bash
cd apps/web
npm run dev

# Open browser console and watch logs during upload
```

### Production Testing

1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Open browser DevTools → Console
4. Try uploading a file
5. Look for success logs in console

---

## Need Help?

Check these in order:

1. ✅ Browser Console Logs (F12)
2. ✅ Render Backend Logs
3. ✅ AWS S3 Bucket Configuration
4. ✅ Environment Variables
5. ✅ AWS IAM Permissions

---

**Last Updated**: February 9, 2026
**Version**: 2.0 (HTTP 422 fixes applied)
