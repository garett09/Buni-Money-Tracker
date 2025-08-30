# 🚀 Deployment Guide - Buni Money Tracker

This guide will help you deploy your Buni Money Tracker to Vercel with Upstash Redis for cloud data storage.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Upstash Account** - Sign up at [upstash.com](https://upstash.com)
3. **GitHub Repository** - Push your code to GitHub

## 🔧 Step 1: Set Up Upstash Redis

### 1.1 Create Upstash Database
1. Go to [Upstash Console](https://console.upstash.com/)
2. Click **"Create Database"**
3. Choose **"Global"** region for better performance
4. Select **"Free"** tier (perfect for personal use)
5. Give it a name: `buni-money-tracker`
6. Click **"Create"**

### 1.2 Get Connection Details
1. Click on your database
2. Go to **"Details"** tab
3. Copy the following values:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**

## 🚀 Step 2: Deploy to Vercel

### 2.1 Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the repository: `Buni-Money-Tracker`

### 2.2 Configure Environment Variables
In Vercel project settings, add these environment variables:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

**To add environment variables:**
1. Go to your Vercel project
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Add each variable with the values from Upstash

### 2.3 Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Your app will be available at: `https://your-project-name.vercel.app`

## 🔐 Step 3: Security Setup

### 3.1 Generate JWT Secret
Use a strong, random JWT secret:
```bash
# Generate a random secret
openssl rand -base64 32
```

### 3.2 Update Environment Variables
Make sure to use a strong JWT secret in production:
```env
JWT_SECRET=your-generated-secret-here
```

## 📱 Step 4: Test Your Deployment

### 4.1 Create Test Accounts
1. Visit your deployed URL
2. Create Adrian's account:
   - Name: Adrian
   - Email: adrian@example.com
   - Password: (choose secure password)

3. Create Gabby's account:
   - Name: Gabby
   - Email: gabby@example.com
   - Password: (choose secure password)

### 4.2 Test Features
- ✅ User registration and login
- ✅ Add income transactions
- ✅ Add expense transactions
- ✅ View dashboard with charts
- ✅ Delete transactions
- ✅ Data separation between users

## 🔄 Step 5: Continuous Deployment

### 5.1 Automatic Deployments
- Every push to `main` branch will trigger a new deployment
- Vercel will automatically build and deploy your changes

### 5.2 Custom Domain (Optional)
1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed

## 📊 Step 6: Monitor Your App

### 6.1 Vercel Analytics
- View deployment logs in Vercel dashboard
- Monitor performance and errors

### 6.2 Upstash Monitoring
- Monitor Redis usage in Upstash console
- Check database performance and storage

## 🛠️ Development vs Production

### Local Development
```bash
# Install dependencies
npm install

# Start both servers
npm start
```

### Production
- Automatically deployed to Vercel
- Uses Upstash Redis for data storage
- Environment variables configured in Vercel

## 🔧 Troubleshooting

### Common Issues

**1. Environment Variables Not Working**
- Check Vercel environment variables are set correctly
- Redeploy after adding new variables

**2. Redis Connection Issues**
- Verify Upstash credentials are correct
- Check if database is active in Upstash console

**3. Build Failures**
- Check Vercel build logs
- Ensure all dependencies are in package.json

**4. CORS Issues**
- Backend is configured to allow all origins
- Should work automatically

## 📈 Scaling

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Upstash**: 10,000 requests/day
- Perfect for personal use!

### Upgrade Options
- **Vercel Pro**: $20/month for more bandwidth
- **Upstash Pro**: $0.2/100K requests for higher limits

## 🎯 Final Checklist

- [ ] Upstash Redis database created
- [ ] Environment variables set in Vercel
- [ ] Code pushed to GitHub
- [ ] Vercel project deployed
- [ ] Test accounts created
- [ ] All features working
- [ ] Custom domain configured (optional)

## 🎉 You're Live!

Your Buni Money Tracker is now live in the cloud! 

- **Adrian and Gabby** can access it from anywhere
- **Data is safely stored** in Upstash Redis
- **Automatic backups** and scaling
- **Professional deployment** on Vercel

**Your app URL**: `https://your-project-name.vercel.app`

Happy money tracking! 💰
