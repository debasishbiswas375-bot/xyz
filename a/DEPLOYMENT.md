# Accountesy Deployment Guide

This guide covers multiple deployment options for your Accountesy SaaS application.

## 🚀 Quick Deployment Options

### 1. Docker (Recommended for Production)

**Prerequisites:**
- Docker and Docker Compose installed
- `.env` file configured

**Steps:**
```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy with Docker
./deploy.sh docker
# Or
./deploy.sh 1

# Manual Docker deployment
docker-compose up -d --build
```

**Access:** `http://localhost:8000`

### 2. Railway (Easiest Cloud Deployment)

**Prerequisites:**
- Railway account
- Railway CLI

**Steps:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

**Configuration:**
- Environment variables set in Railway dashboard
- Automatic builds from GitHub
- Custom domain: `your-app.railway.app`

### 3. Render (Great for Free Tier)

**Prerequisites:**
- Render account
- GitHub repository

**Steps:**
1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy automatically

**Environment Variables (in Render):**
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Heroku (Classic Option)

**Prerequisites:**
- Heroku account
- Heroku CLI

**Steps:**
```bash
# Login to Heroku
heroku login

# Create app
heroku create accountesy

# Set environment variables
heroku config:set SUPABASE_URL=your_supabase_url
heroku config:set SUPABASE_KEY=your_supabase_key
heroku config:set SUPABASE_SERVICE_KEY=your_supabase_service_key
heroku config:set SECRET_KEY=your_secret_key

# Deploy
git push heroku main
```

### 5. Platform.sh (Enterprise)

**Steps:**
1. Create Platform.sh account
2. Connect repository
3. Configure environment variables
4. Deploy automatically

## 🔧 Environment Setup

### Required Environment Variables

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT Configuration
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Database Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note project URL and keys

2. **Run Database Schema:**
   ```sql
   -- Copy contents of supabase_schema.sql
   -- Run in Supabase SQL editor
   ```

3. **Configure Storage:**
   - Create storage buckets for uploads
   - Set up RLS policies

## 🌐 Production Configuration

### SSL/HTTPS Setup

**Nginx Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://accountesy:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Domain Configuration

1. **DNS Settings:**
   - A record: `@` → server IP
   - A record: `www` → server IP
   - CNAME: `api` → `@`

2. **SSL Certificate:**
   - Let's Encrypt (free)
   - Cloudflare (recommended)
   - Custom certificate

### Performance Optimization

1. **Caching:**
   - Static files: 1 year
   - API responses: 5 minutes
   - Database queries: Redis

2. **CDN:**
   - Cloudflare (recommended)
   - AWS CloudFront
   - Fastly

3. **Monitoring:**
   - Application logs
   - Error tracking
   - Performance metrics

## 🔒 Security Checklist

### Production Security

- [ ] Environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] Database credentials secured
- [ ] File upload restrictions
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Security headers added
- [ ] Regular backups enabled

### Security Headers

```python
# Add to FastAPI app
app.add_middleware(
    SecurityHeaders,
    headers={
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
    }
)
```

## 📊 Monitoring & Logging

### Application Monitoring

1. **Logging:**
   ```python
   import logging
   
   logging.basicConfig(
       level=logging.INFO,
       format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
   )
   ```

2. **Error Tracking:**
   - Sentry (recommended)
   - Rollbar
   - Bugsnag

3. **Performance Monitoring:**
   - New Relic
   - Datadog
   - AppDynamics

### Health Checks

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy Accountesy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
          
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          npm install
          npm run build
          
      - name: Deploy to Production
        run: |
          # Your deployment commands
```

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancer:**
   - Nginx
   - HAProxy
   - AWS ALB

2. **Database:**
   - Read replicas
   - Connection pooling
   - Caching layer

3. **Application:**
   - Multiple instances
   - Container orchestration
   - Auto-scaling

### Performance Optimization

1. **Database Optimization:**
   - Indexing strategy
   - Query optimization
   - Connection pooling

2. **Caching Strategy:**
   - Redis for sessions
   - Memcached for data
   - CDN for static assets

3. **File Storage:**
   - AWS S3
   - Google Cloud Storage
   - Azure Blob Storage

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Python version
   - Verify Node.js version
   - Clear cache: `npm cache clean --force`

2. **Database Connection:**
   - Verify Supabase URL
   - Check API keys
   - Test connection manually

3. **File Upload Issues:**
   - Check file size limits
   - Verify permissions
   - Test with small files

4. **SSL Certificate:**
   - Verify domain ownership
   - Check certificate validity
   - Test SSL configuration

### Debug Commands

```bash
# Check Docker logs
docker-compose logs accountesy

# Test application locally
python main.py

# Check environment variables
printenv | grep SUPABASE

# Test database connection
python -c "from app.db.database import get_supabase; print(get_supabase())"
```

## 📞 Support

For deployment assistance:
- Check the [README.md](./README.md)
- Review the [troubleshooting section](#-troubleshooting)
- Create an issue in the repository
- Contact support@accountesy.com

---

**Happy Deploying! 🚀**
