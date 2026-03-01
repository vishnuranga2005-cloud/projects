# Vercel Deployment Guide for MediFlow

## Overview
This guide will help you deploy MediFlow to Vercel with proper configuration for all links and features to work correctly.

## Prerequisites
- Vercel account (free tier available)
- GitHub repository with your MediFlow code
- Environment variables from Supabase
- Domain (optional, Vercel provides a default domain)

## Step 1: Prepare Your Repository

Make sure all these files are in your root directory:
- ✅ `vercel.json` - Vercel configuration (already updated)
- ✅ `vite.config.ts` - Vite build configuration (already updated)
- ✅ `package.json` - Dependencies and scripts
- ✅ `index.html` - HTML entry point (already updated)
- ✅ `api/health.js` - Vercel serverless function for health checks

## Step 2: Set Environment Variables in Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your project (or create new)
3. Go to **Settings > Environment Variables**
4. Add the following environment variables:

```
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
VITE_API_BASE_URL=https://<your-project>.vercel.app
VITE_RAZORPAY_KEY_ID=<your_razorpay_key>
NODE_ENV=production
```

**Where to find these:**
- **Supabase URL & Key**: Supabase Dashboard → Project Settings → API
- **Domain**: Will be https://your-project-vercel.app (shown in Vercel dashboard)
- **Razorpay Key**: Razorpay Dashboard → Settings → API Keys

## Step 3: Deploy

### Option A: Deploy from GitHub (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Connect your GitHub account
4. Select your MediFlow repository
5. Vercel will automatically detect your settings from `vercel.json`
6. Click **Deploy**

### Option B: Deploy using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project root
vercel --prod
```

## Step 4: Verify Deployment

After deployment completes:

1. **Check your domain**: Visit https://your-project.vercel.app
2. **Test health check**: https://your-project.vercel.app/api/health
   - Should return: `{ "status": "ok", "timestamp": "...", "environment": "production" }`
3. **Test routing**: Navigate through the app
   - All routes should work without 404 errors
   - Refreshing the page should not break navigation
4. **Check console**: Open browser DevTools and verify:
   - No CORS errors
   - No 404 errors
   - Supabase connecting correctly

## Configuration Explanation

### vercel.json
- **buildCommand**: Runs `npm run build` to create production build
- **outputDirectory**: Points to `dist/` where Vite outputs built files
- **cleanUrls**: Removes `.html` extensions from URLs
- **trailingSlash**: Removes trailing slashes from URLs
- **rewrites**: Routes all non-API requests to `/index.html` for SPA routing

### vite.config.ts
- **base**: Set to `/` for root domain deployments
- **build**: Optimized build settings
- **rollupOptions**: Splits vendor code for faster loading
- **proxy**: Dev server proxies `/api` requests to local Express server

## Important Notes

### About the Express Server
- Your local Express server (`server/index.js`) runs on port 3001
- In production (Vercel), use the serverless function at `/api/health.js`
- For other API endpoints, add them as serverless functions in the `api/` directory

### For API Endpoints
If you need additional API endpoints:
1. Create files in `api/` directory: `api/endpoint-name.js`
2. Deploy to Vercel
3. Access via: `https://your-domain.vercel.app/api/endpoint-name`

Example:
```javascript
// api/users.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Users endpoint' });
  } else {
    res.status(405).end();
  }
}
```

## Troubleshooting

### Problem: 404 errors when navigating
**Solution**: Verify `vercel.json` has the rewrite rule that sends all requests to `/index.html`

### Problem: Supabase connection fails
**Solution**: 
- Check environment variables are set in Vercel Dashboard
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase project is not paused

### Problem: External links return 404
**Solution**: Make sure absolute URLs in your app use the correct domain

### Problem: API requests fail
**Solution**: 
- Update `VITE_API_BASE_URL` to your actual Vercel domain
- Check API endpoints exist in `api/` directory

## Custom Domain Setup

To use a custom domain:
1. In Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions from Vercel
4. Update `VITE_API_BASE_URL` to use your custom domain

## Production Checklist

- [ ] Environment variables set in Vercel Dashboard
- [ ] Supabase credentials verified
- [ ] `vercel.json` updated with rewrites
- [ ] `vite.config.ts` has correct base path
- [ ] All API endpoints converted to serverless functions
- [ ] Custom domain configured (if applicable)
- [ ] Tested all routes work with page refresh
- [ ] Tested API calls work in production
- [ ] Razorpay configuration set for production

## Useful Vercel Commands

```bash
# Preview deployment
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel remove
```

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
