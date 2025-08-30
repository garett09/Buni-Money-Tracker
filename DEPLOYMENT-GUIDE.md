# 🚀 Buni Money Tracker - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Font Configuration
- **Local Development**: Uses system fonts (`-apple-system`, `BlinkMacSystemFont`)
- **Production**: Falls back to Inter font from Google Fonts
- **iOS Devices**: Will use native San Francisco fonts
- **Other Platforms**: Clean, modern fallback fonts

### ✅ Environment Variables
Make sure these are set in your Vercel dashboard:

```bash
JWT_SECRET=your-super-secret-jwt-key-here
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

## 🎯 Deployment Steps

### 1. **Prepare Your Repository**
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. **Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect the configuration from `vercel.json`

### 3. **Set Environment Variables**
In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the three required variables:
   - `JWT_SECRET`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 4. **Redeploy**
After setting environment variables:
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment

## 🎨 Font Behavior by Platform

| Platform | Font Used | Source |
|----------|-----------|---------|
| **macOS/iOS** | San Francisco | System font |
| **Windows** | Segoe UI | System font |
| **Android** | Roboto | System font |
| **Web (Fallback)** | Inter | Google Fonts |
| **Generic** | Helvetica Neue, Arial | System fonts |

## 🔧 Technical Details

### Font Loading Strategy
```css
/* 1. Try local SF Pro fonts first */
src: local('SF Pro Display'), local('SFProDisplay-Regular');

/* 2. Fall back to system fonts */
font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter", ...

/* 3. Google Fonts as web fallback */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Build Configuration
- **Frontend**: Vite build with `dist` output directory
- **Backend**: Node.js serverless functions
- **Static Assets**: Automatically served by Vercel

## 🚨 Troubleshooting

### Font Issues
If fonts don't load properly:
1. Check browser console for font errors
2. Verify Google Fonts import is working
3. System fonts should work as fallback

### API Issues
If backend doesn't work:
1. Verify environment variables are set
2. Check Vercel function logs
3. Ensure Upstash Redis is accessible

### Build Issues
If deployment fails:
1. Check `vercel.json` configuration
2. Verify all dependencies are in `package.json`
3. Check build logs in Vercel dashboard

## 🎉 Post-Deployment

### Test Your Deployment
1. **Login/Signup**: Test user authentication
2. **Add Transactions**: Test income/expense functionality
3. **Dashboard**: Verify charts and statistics load
4. **Mobile**: Test on iOS/Android devices

### Performance
- **Fonts**: Load instantly on supported platforms
- **API**: Fast response times with Upstash Redis
- **UI**: Smooth iOS-style animations

## 📱 Mobile Experience

### iOS Devices
- **Native San Francisco fonts** for authentic iOS look
- **Smooth animations** with iOS-style easing
- **Glassmorphism effects** optimized for iOS

### Android Devices
- **Roboto fonts** for native Android feel
- **Material Design** compatible animations
- **Responsive layout** for all screen sizes

## 🔄 Updates

To update your deployed app:
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel automatically redeploys

---

**Your Buni Money Tracker is now ready for production! 🎊**

The app will work seamlessly across all platforms with the appropriate fonts and styling for each device type.
