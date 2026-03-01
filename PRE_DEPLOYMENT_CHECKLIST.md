# Pre-Deployment Checklist ✅

Complete these steps before deploying to Vercel.

## 1. Local Configuration Setup
- [ ] Copy `.env.example` to `.env.local`
  ```bash
  cp .env.example .env.local
  ```
- [ ] Open `.env.local` and fill in all your values:
  - [ ] `VITE_SUPABASE_URL` - From Supabase Dashboard → Settings → API
  - [ ] `VITE_SUPABASE_ANON_KEY` - From Supabase Dashboard
  - [ ] `VITE_RAZORPAY_KEY_ID` - From Razorpay Dashboard

## 2. Test Locally
- [ ] Run development server: `npm run dev`
- [ ] Run backend server: `npm run server` (in another terminal)
- [ ] Or run both: `npm run dev:all`
- [ ] Test navigation - click through all pages
- [ ] Test refresh - press F5 on different pages (should not 404)
- [ ] Check DevTools Console - no errors
- [ ] Test API calls - verify they work

## 3. Build and Test Production Build
- [ ] Run: `npm run build`
- [ ] Run: `npm run preview`
- [ ] Visit http://localhost:4173
- [ ] Test all pages work
- [ ] Test page refresh works
- [ ] No console errors

## 4. Git Setup
- [ ] Ensure `.env` and `.env.local` are in `.gitignore`
  ```bash
  echo ".env" >> .gitignore
  echo ".env.local" >> .gitignore
  ```
- [ ] Verify no environment files are tracked:
  ```bash
  git status | grep -i env
  ```
  (Should show nothing)

## 5. GitHub Push
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Setup Vercel deployment configuration"`
- [ ] Push: `git push origin main` (or your branch)

## 6. Vercel Account Setup
- [ ] Go to https://vercel.com
- [ ] Sign up/Login with GitHub
- [ ] Create new project or select existing
- [ ] Click "Import Git Repository"
- [ ] Select MediFlow repository

## 7. Vercel Project Configuration
- [ ] Framework: Should auto-detect "Vite"
- [ ] Build Command: Leave as default (uses vercel.json)
- [ ] Output Directory: Leave as default
- [ ] Install Command: Leave as default

## 8. Set Environment Variables in Vercel
Go to: **Project Settings → Environment Variables**

Add for **Production**:
```
VITE_SUPABASE_URL = <your_supabase_url>
VITE_SUPABASE_ANON_KEY = <your_supabase_anon_key>
VITE_API_BASE_URL = https://<your-project-name>.vercel.app
VITE_API_TIMEOUT = 30000
VITE_RAZORPAY_KEY_ID = <your_production_razorpay_key>
NODE_ENV = production
```

**Important:** 
- Do NOT include `VITE_API_BASE_URL=http://localhost:3001` in Production
- Replace `<your-project-name>` with your actual Vercel project name
- Use production Razorpay keys (not test keys)

## 9. Deploy
- [ ] Click **Deploy** button
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Check build logs for any errors
- [ ] Click domain link when deployment is done

## 10. Post-Deployment Verification

### Test Basic Access
- [ ] Visit https://your-project.vercel.app (from email)
- [ ] Page loads (not 404)
- [ ] No error messages

### Test Routing
- [ ] Click navigation menu items
- [ ] Each page loads correctly
- [ ] URLs change (e.g., /patient-dashboard)
- [ ] Press F5 refresh - page doesn't 404 ✅
- [ ] Go back in browser history - works
- [ ] Direct URL access works (e.g., paste URL in address bar)

### Test API
- [ ] Open DevTools → Network tab
- [ ] Refresh page
- [ ] Check for requests to `/api/health`
- [ ] Should see successful responses (200 status)
- [ ] Check for CORS errors (should be none)

### Test Features
- [ ] Login/Logout works
- [ ] Supabase authentication works
- [ ] Page navigation works
- [ ] Images/assets load
- [ ] Styles apply correctly

## 11. Custom Domain (Optional)
If using custom domain:
- [ ] In Vercel Project Settings → Domains
- [ ] Add your custom domain
- [ ] Configure DNS (follow Vercel instructions)
- [ ] Update `VITE_API_BASE_URL` to custom domain
- [ ] Redeploy

## 12. Monitoring
- [ ] Go to Vercel Dashboard → Analytics
- [ ] Monitor for errors
- [ ] Check build logs regularly
- [ ] Set up email notifications (Settings → Notifications)

## Troubleshooting

### Issue: Page refreshes give 404
**Solution:** Clear browser cache, check `vercel.json` rewrites are correct

### Issue: Supabase connection fails
**Solution:** 
1. Check env variables in Vercel Dashboard
2. Verify they match exactly (copy-paste carefully)
3. Test health endpoint: `https://your-project.vercel.app/api/health`

### Issue: Styles not loading / broken layout
**Solution:**
- Check DevTools → Network tab for failed CSS/JS files
- Ensure `base` in `vite.config.ts` is set to `/`

### Issue: API calls fail
**Solution:**
- Check `VITE_API_BASE_URL` is correct
- Verify network requests in DevTools
- Check if endpoints are in `api/` directory

## Support Resources

- 📖 Full guide: Read `VERCEL_DEPLOYMENT.md`
- 🔗 Vercel Docs: https://vercel.com/docs
- ⚙️ Vite Docs: https://vitejs.dev
- 🏠 React Docs: https://react.dev
- 🔐 Supabase Docs: https://supabase.com/docs

---

## Quick Reference Commands

```bash
# Build locally
npm run build

# Test production build
npm run preview

# Check git status
git status

# Push to GitHub
git push origin main

# View Vercel logs (use Vercel CLI)
vercel logs
```

---

**When all checks pass, your site is live!** 🎉

Visit your domain and share it with others.
