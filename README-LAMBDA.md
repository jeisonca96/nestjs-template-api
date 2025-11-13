# 🚀 AWS Lambda - Simple Deployment

## Quick Deploy to Production

This branch is configured for **simple, automatic deployment** to AWS Lambda:

```
Commit to Master → Auto-Deploy to Production
```

---

## 📋 Setup in 3 Steps

### 1. Configure AWS & Environment

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URL and secrets
```

### 2. Configure GitHub Secrets

Add these in **GitHub → Settings → Secrets**:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DATABASES_MONGO_URL`
- `JWT_SECRET`

### 3. Deploy

**Option A: Automatic (Recommended)**
```bash
git add .
git commit -m "deploy: your changes"
git push origin master
```
✨ **GitHub Actions deploys automatically!**

**Option B: Manual**
```bash
npm run lambda:deploy
```

---

## 🛠️ Commands

```bash
# Local development
npm run lambda:offline        # Test Lambda locally (port 3000)
npm run start:dev            # Traditional dev server

# Deployment
npm run lambda:deploy        # Deploy to production
npm run lambda:logs          # View logs
npm run lambda:remove        # Remove deployment

# Testing
npm test                     # Run tests
npm run test:e2e            # E2E tests
```

---

## 📝 Configuration

### Required Environment Variables

```env
DATABASES_MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
```

### Optional Settings

```env
AWS_REGION=us-east-1         # Default region
S3_BUCKET_NAME=your-bucket   # For file uploads
```

### Customize Lambda Settings

Edit `serverless.yml`:
```yaml
provider:
  region: us-east-1          # Change region
  memorySize: 512            # Adjust memory
  timeout: 30                # Adjust timeout
```

---

## 📊 Deployment Flow

1. **Push to master** → Triggers GitHub Actions
2. **Run tests** → Ensures code quality
3. **Build app** → Creates optimized bundle
4. **Deploy to AWS** → Updates Lambda function
5. **Smoke tests** → Verifies deployment
6. **Done!** → API is live

---

## 🔍 Monitor Your API

### View Logs
```bash
npm run lambda:logs
```

### AWS Console
- CloudWatch → Logs → `/aws/lambda/nestjs-template-api-prod-main`
- Lambda → Functions → `nestjs-template-api-prod-main`

### Test Endpoints
```bash
# Get your API URL from deployment output, then:
curl https://your-api-url/health
curl https://your-api-url/api/docs
```

---

## 💰 Cost Estimate

| Monthly Requests | Cost |
|-----------------|------|
| 100,000 | ~$0.50 |
| 1,000,000 | ~$4.50 |
| 10,000,000 | ~$44 |

**Optimizations included:**
- ✅ ARM64 architecture (20% savings)
- ✅ Optimized memory (512MB)
- ✅ Connection caching
- ✅ Code optimization

---

## 🎯 Production-Ready Features

✅ Auto-scaling  
✅ Zero downtime deployments  
✅ Automatic health checks  
✅ CloudWatch monitoring  
✅ Error tracking  
✅ Cost-optimized  
✅ Secure by default  

---

## 📚 More Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[README.LAMBDA.md](./README.LAMBDA.md)** - Complete Lambda guide
- **[LAMBDA_QUICK_REFERENCE.md](./LAMBDA_QUICK_REFERENCE.md)** - Quick commands

---

## ⚡ Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env

# 3. Test locally
npm run lambda:offline

# 4. Deploy
npm run lambda:deploy
```

**Your API is now live on AWS Lambda! 🎉**

---

## 🆘 Troubleshooting

**Deployment fails?**
- Verify AWS credentials
- Check `.env` variables
- Review logs: `npm run lambda:logs`

**Database connection error?**
- Whitelist `0.0.0.0/0` in MongoDB Atlas
- Verify connection string in `.env`

**Need help?** See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)

---

**Made with ❤️ for serverless deployment**
