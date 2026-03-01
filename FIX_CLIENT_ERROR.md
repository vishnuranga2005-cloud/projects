# Fix Client-Side Error on Vercel - Setup Guide

## Problem
You're seeing: **"Application error: a client-side exception has occurred while loading projects-livid-two.vercel.app"**

This is usually caused by **missing environment variables** in Vercel Dashboard.

## Solution: Add Environment Variables to Vercel

### Step-by-Step Instructions:

#### 1. Go to Vercel Dashboard
- Visit https://vercel.com/dashboard
- Select your **MediFlow** project

#### 2. Navigate to Environment Variables
- Click **Settings** (top navigation)
- Click **Environment Variables** (left sidebar)

#### 3. Add Required Variables

Click **Add New** for each variable and fill in:

**Variable 1: Supabase URL**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development
```
Get this from: Supabase Dashboard → Settings → API → Project URL

**Variable 2: Supabase Key**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development
```
Get this from: Supabase Dashboard → Settings → API → Anon Public Key

**Variable 3: Razorpay Key (Optional but recommended)**
```
Name: NEXT_PUBLIC_RAZORPAY_KEY_ID
Value: rzp_live_xxxxxxxxxxxxx
Environment: Production
```
Get this from: Razorpay Dashboard → Settings → API Keys

#### 4. Click "Save"

#### 5. Trigger Redeploy
After saving environment variables:
- Go to your Vercel project
- Click **Deployments**
- Find the latest deployment
- Click the **...** menu
- Select **Redeploy**

Or push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

## Verify It Works

Once redeployed:

1. **Check the error message** - It should now show you which env vars are missing (if any)
2. **Visit the health endpoint**: https://projects-livid-two.vercel.app/api/health
   - Should return: `{"status":"ok","timestamp":"...","environment":"production"}`
3. **Refresh the app**: https://projects-livid-two.vercel.app
   - Should load without errors now

## Where to Get Your Credentials

### Supabase
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (left sidebar)
4. Click **API**
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon (Public)** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Razorpay (Optional)
1. Go to https://dashboard.razorpay.com
2. Click **Settings** (top right)
3. Click **API Keys**
4. Copy your **Key ID**
   - **Key ID** → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - Use **Live Key** for production

## Troubleshooting

### Still seeing the error after redeploy?
1. **Wait 2-3 minutes** for the deployment to fully propagate
2. **Clear browser cache**: Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
3. **Hard refresh**: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
4. **Check environment variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify all values are correctly pasted (no extra spaces!)

### Error persists after environment vars are set?
1. Open **Browser DevTools** (`F12`)
2. Go to **Console** tab
3. Look for error messages
4. Share the exact error message with support

### Connection error / "Cannot reach Supabase"?
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct (should start with `https://`)
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is not truncated
3. Check if your Supabase project is still active (not paused)
4. Check Supabase status: https://status.supabase.com

## What Changed

I've added an **Error Boundary component** that will:
- Show helpful error messages
- Display setup instructions
- Point you to the exact steps needed

This replaces the cryptic default error with clear troubleshooting guidance.

## Quick Checklist

- [ ] Copied `NEXT_PUBLIC_SUPABASE_URL` from Supabase
- [ ] Copied `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase  
- [ ] Added both to Vercel Environment Variables
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Triggered a redeploy
- [ ] Waited 2-3 minutes for deployment
- [ ] Cleared browser cache
- [ ] Hard refreshed the page
- [ ] App loaded successfully! ✅

## After Setup Works

Your app will have:
✅ Full Supabase authentication
✅ Real-time database access
✅ User profiles
✅ Appointments system
✅ Medical records

## Still Need Help?

1. Check browser console for error details (`F12` → Console)
2. Verify Supabase project is not paused
3. Confirm all environment variable values are correct (no typos or extra spaces)
4. Check Vercel deployment logs: Dashboard → Deployments → Latest → Logs
