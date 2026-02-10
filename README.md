# FreeConvert - Professional File Processing SaaS

A modern, scalable file processing platform built with a professional stack.

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: Vercel (Next.js)
- **Backend**: Render (FastAPI)
- **Database**: Neon (PostgreSQL)
- **Storage**: Supabase (S3-compatible)
- **Queue**: Upstash (Redis)
- **Worker**: Koyeb (Celery)

### **Services**
```
Frontend (Vercel) → Backend (Render) → Queue (Upstash) → Worker (Koyeb)
                     ↓                    ↓
                Database (Neon)    Storage (Supabase)
```

## 🚀 Quick Start

### **1. Environment Variables**

Copy the environment variables from `.env.production` to each service:

#### **Render (Backend)**
```bash
DATABASE_URL=postgresql://...
REDIS_URL=rediss://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=uploads
S3_ENDPOINT_URL=https://...
SECRET_KEY=@@@Manishanti@@@09876
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS=["https://freeconvert.in", "https://freeconvert-web.vercel.app"]
ALLOWED_FILE_TYPES=["application/pdf", "image/jpeg", "image/png", "image/jpg"]
MAX_FILE_SIZE_MB=100
S3_EXPIRY_SECONDS=3600
```

#### **Koyeb (Worker)**
Use the `koyeb.yaml` file for deployment.

#### **Vercel (Frontend)**
```bash
NEXT_PUBLIC_API_URL=https://your-app.onrender.com
NEXT_PUBLIC_S3_BUCKET_NAME=uploads
```

### **2. Database Setup**

Run migrations on Neon:
```bash
cd apps/backend
alembic upgrade head
```

### **3. Supabase Setup**

1. Enable S3 Interoperability in Storage > Settings
2. Configure CORS for your domains
3. Get access keys from Storage > Settings

### **4. Deploy**

#### **Backend (Render)**
1. Connect GitHub repo
2. Set build command: `cd apps/backend && pip install -r requirements.txt`
3. Set start command: `cd apps/backend && uvicorn app.main:app --host 0.0.0.0 --port 8000`

#### **Worker (Koyeb)**
1. Use `koyeb.yaml` configuration
2. Deploy as Worker service
3. Set region to Singapore (sgp)

#### **Frontend (Vercel)**
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

## 📋 Features

- ✅ **File Upload**: Secure uploads to Supabase S3
- ✅ **File Processing**: Compression, merging, conversion
- ✅ **Background Jobs**: Celery workers for processing
- ✅ **Real-time Status**: Job tracking and progress
- ✅ **Secure Downloads**: Temporary presigned URLs
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Scalable Architecture**: Professional stack

## 🔧 Development

### **Local Setup**
```bash
# Install dependencies
cd apps/backend
pip install -r requirements.txt

# Set environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload

# Start worker (separate terminal)
celery -A app.workers.celery_app worker --loglevel=info
```

### **API Endpoints**

#### **Upload**
- `POST /api/v1/upload/presigned-url` - Get upload URL
- `POST /api/v1/upload/confirm-upload` - Confirm upload
- `DELETE /api/v1/upload/cleanup-upload` - Clean up file

#### **Jobs**
- `POST /api/v1/job/start` - Start processing job
- `GET /api/v1/job/{job_id}/status` - Get job status
- `GET /api/v1/job/{job_id}/download` - Get download URL

#### **System**
- `GET /health` - Health check
- `GET /` - API info

## 🏆 Professional Features

### **Security**
- JWT authentication
- CORS protection
- Secure file handling
- Environment-based config

### **Performance**
- Redis caching
- Background processing
- Optimized S3 operations
- Efficient database queries

### **Monitoring**
- Structured logging
- Health checks
- Error tracking
- Performance metrics

### **Scalability**
- Horizontal scaling
- Queue-based processing
- Auto-scaling workers
- Load balancing

## 📊 Monitoring

### **Health Checks**
- Backend: `/health`
- Database: Connection status
- Redis: Connection status
- S3: Bucket access

### **Logs**
- Application logs
- Worker logs
- Error logs
- Performance logs

## 🛠️ Troubleshooting

### **Common Issues**

#### **Upload Fails**
- Check S3 credentials
- Verify CORS settings
- Check file size limits
- Review network connectivity

#### **Worker Not Processing**
- Check Redis connection
- Verify worker logs
- Check queue status
- Review job configuration

#### **Database Errors**
- Run migrations
- Check connection string
- Verify permissions
- Review query performance

## 📈 Scaling

### **Backend Scaling**
- Add more Render instances
- Use load balancer
- Optimize database queries
- Add caching layers

### **Worker Scaling**
- Add more Koyeb workers
- Use auto-scaling
- Optimize task processing
- Monitor queue length

### **Database Scaling**
- Use connection pooling
- Add read replicas
- Optimize queries
- Consider sharding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the troubleshooting section
2. Review the logs
3. Create an issue on GitHub
4. Contact the development team

---

**Built with ❤️ using professional tools**
