# Vercel Deployment Guide for Buni Money Tracker

## Prerequisites

1. **Upstash Redis Account**: Sign up at [upstash.com](https://upstash.com) for free
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) for free
3. **GitHub Repository**: Your code should be pushed to GitHub

## Step 1: Set up Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Choose a region close to your users
4. Copy the following credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

## Step 3: Environment Variables

In your Vercel project settings, add these environment variables:

```
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

**Important**: 
- Generate a strong JWT_SECRET (at least 32 characters)
- Never commit these secrets to your repository

## Step 4: Update API Base URL

After deployment, update the API base URL in `app/lib/api.ts`:

```typescript
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-actual-vercel-app.vercel.app'  // Replace with your actual Vercel URL
  : 'http://localhost:3000';
```

## Step 5: Deploy

1. Click "Deploy" in Vercel
2. Wait for the deployment to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Features After Deployment

✅ **User Management**: Unlimited user accounts can be created
✅ **Data Persistence**: All transactions are stored in Redis database
✅ **Multi-device Support**: Users can access their data from any device
✅ **Data Consistency**: All data is tied to user accounts
✅ **Secure Authentication**: JWT-based authentication with Redis storage

## Testing the Deployment

1. Visit your deployed app
2. Create a new account using the signup form
3. Add some income and expense transactions
4. Log out and log back in - your data should persist
5. Try accessing from a different device/browser - data should be consistent

## Troubleshooting

### Common Issues:

1. **"Unauthorized" errors**: Check that JWT_SECRET is set correctly
2. **Database connection errors**: Verify Upstash Redis credentials
3. **API not working**: Ensure API_BASE URL is updated to your Vercel domain

### Environment Variables Not Working:
- Make sure to redeploy after adding environment variables
- Check that variable names match exactly (case-sensitive)

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, 100 serverless function executions
- **Upstash Redis**: Free tier includes 10,000 requests/day, 256MB storage
- For most personal use cases, the free tiers should be sufficient

## Security Notes

- All user passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- All API endpoints require authentication
- User data is isolated by user ID in Redis

## Scaling

If you need to scale beyond free tiers:
- Upgrade Vercel Pro for more bandwidth and functions
- Upgrade Upstash for more requests and storage
- Consider adding a proper database (PostgreSQL) for complex queries
