# Supabase Connection Fix Guide

## Error: "Unable to connect to the server"

Your Supabase connection is failing. This guide will help you fix it.

### Quick Fixes (Try These First)

1. **Check Your Internet Connection**
   - Make sure you're connected to the internet
   - Try pingrng a website: `ping google.com`

2. **Verify Environment Variables**
   ```bash
   # Check that your .env file has the correct values:
   cat .env
   ```
   
   Your `.env` should have:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Restart Your Development Server**
   ```bash
   # Stop: Press Ctrl+C
   # Then restart:
   npm run dev
   ```

### Main Issue: Supabase Project is Paused

**This is likely the problem** - if your Supabase free-tier project is idle for 7 days, it automatically pauses.

#### Solution:
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `stmoxyncopmamxzlapjj`
3. Go to **Project Settings** → **General**
4. Look for **Paused** status
5. Click **Resume Project** if it's paused
6. Wait 2-3 minutes for the project to wake up
7. Refresh your browser

### Alternative: Use a Different Supabase Project

If your current project is permanently paused or you want a fresh start:

1. Create a new Supabase project:
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Get the new **Project URL** and **Anon Key**

2. Update your `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-new-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-new-anon-key
   ```

3. Restart dev server: `npm run dev`

### Verify Connection After Fixing

Test that your Supabase is working:

```bash
# Test basic connectivity
curl -i "https://your-project.supabase.co/rest/v1" \
  -H "apikey: your-anon-key"
```

You should see a response (not a timeout).

### Still Not Working?

Check these:

1. **Invalid API Key**
   - Go to Supabase Dashboard → **Project Settings** → **API**
   - Copy the correct **Anon Key**
   - Update your `.env`

2. **Check Supabase Status**
   - Visit [Supabase Status](https://status.supabase.com/)
   - Check if there are any ongoing issues

3. **Network/Firewall Issues**
   ```bash
   # Check if you can reach Supabase
   ping stmoxyncopmamxzlapjj.supabase.co
   ```

4. **Browser Console Errors**
   - Open DevTools: **F12** (or Cmd+Option+I on Mac)
   - Go to **Console** tab
   - Look for error messages with details
   - Share the full error text for debugging

### Recovery: Clear Browser Cache

Sometimes cached data causes issues:

```bash
# Or clear cache manually:
# 1. Open DevTools (F12)
# 2. Application → Storage → Clear site data
# 3. Refresh the page
```

### For Production

Before deploying to production:

1. Upgrade to a paid Supabase project
2. Set your environment variables in your hosting platform (Vercel, Netlify, etc.)
3. Never commit `.env` files with real API keys to Git

## Current Implementation (Done)

The app has been updated with:
- ✅ Automatic retry logic with exponential backoff
- ✅ Better error messages for network issues
- ✅ Connection error tracking in auth context
- ✅ Offline-graceful fallback mode

## Support

If none of these steps work:
1. Check your email for any Supabase notifications
2. Visit Supabase support: https://supabase.com/docs
3. Check the browser console for the exact error message
