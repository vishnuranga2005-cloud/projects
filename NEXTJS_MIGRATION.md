# Next.js Migration & Vercel Deployment Guide

## Overview
Your MediFlow application has been successfully converted from Vite React to Next.js for better Vercel compatibility and performance.

## What Changed

### ✅ Migrated Components
- **Framework**: Vite React → Next.js 15
- **Build Tool**: Vite → Next.js native build
- **Routing**: Client-side → Next.js App Router
- **Environment Variables**: `VITE_*` → `NEXT_PUBLIC_*`
- **API Routes**: Custom Express server → Next.js API Routes
- **Styling**: Tailwind CSS (maintained)

### 📁 New Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page/main app
│   ├── globals.css        # Global styles
│   └── api/
│       └── health/
│           └── route.ts   # Health check endpoint
├── pages/                 # Page components (unchanged)
├── components/            # Components (unchanged)
├── contexts/              # React contexts (unchanged)
├── lib/                   # Utilities
│   ├── api.ts             # Updated for Next.js
│   ├── supabase.ts        # Updated for Next.js
│   └── razorpay.ts        # (unchanged)
├── i18n/                  # Translations (unchanged)
└── types/                 # TypeScript types (unchanged)
```

### 🔄 Files Updated
- `package.json` - Next.js dependencies
- `tsconfig.json` - Next.js TypeScript config
- `next.config.js` - Next.js configuration (new)
- `vercel.json` - Simplified for Next.js
- `.env.example` - Uses `NEXT_PUBLIC_*` variables
- `tailwind.config.js` - Updated for Next.js
- `src/lib/api.ts` - Uses `process.env.NEXT_PUBLIC_*`
- `src/lib/supabase.ts` - Uses `process.env.NEXT_PUBLIC_*`
- `.gitignore` - Added `.next/` and `.vercel/`

## Environment Variables

### Development (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890
NODE_ENV=development
```

### Production (Vercel Dashboard)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_production_key
NODE_ENV=production
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local and add your actual values
```

### 3. Run Development Server
```bash
npm run dev
```
Visit http://localhost:3000 in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

## Deployment to Vercel

### Method 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Select "Import Git Repository"
4. Connect your GitHub account
5. Select the MediFlow repository
6. Vercel will auto-detect Next.js
7. Add environment variables in "Environment Variables" section
8. Click **Deploy**

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Environment Variables in Vercel

**Step-by-step in Vercel Dashboard:**

1. Go to your project → **Settings**
2. Navigate to **Environment Variables**
3. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL
   - Select all environments (Production, Preview, Development)
4. Repeat for other variables
5. Redeploy after adding variables

**Variables to add:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL` (your Vercel domain)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` (production key)
- `NODE_ENV=production`

## API Routes

### Health Check Endpoint
- **Local**: `http://localhost:3000/api/health`
- **Production**: `https://your-project.vercel.app/api/health`

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-01T10:30:00Z",
  "environment": "production"
}
```

### Adding Custom API Routes
Create files in `src/app/api/`:

```typescript
// src/app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ users: [] })
}
```

Access at: `/api/users`

## Key Differences from Vite

| Feature | Vite | Next.js |
|---------|------|---------|
| Web server | Vite dev server | Next.js dev server |
| Build output | `/dist` | `/.next` |
| CSS import | Via JS | CSS Modules / Tailwind |
| API endpoints | Express server | `/app/api` |
| Environment vars | `VITE_*` | `NEXT_PUBLIC_*` |
| Routing | React Router | Next.js built-in |
| Static files | `/public` | `/public` |

## Performance Benefits with Next.js

✅ **Image Optimization**: Next.js Image component
✅ **Font Optimization**: Automatic font optimization
✅ **Code Splitting**: Automatic and route-based
✅ **CSS Optimization**: Automatic CSS minification
✅ **Built-in Analytics**: Vercel Web Vitals
✅ **Server Components**: Better performance (optional)
✅ **Edge Functions**: Deploy to CDN edge locations

## Testing Locally

```bash
# Development
npm run dev

# Build and preview production
npm run build
npm start

# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: Restart dev server after installing packages
```bash
npm install
npm run dev
```

### Issue: Environment variables not working
**Solution**: 
- Verify variable name starts with `NEXT_PUBLIC_`
- Restart dev server
- Check `.env.local` file exists with correct values

### Issue: Supabase connection fails
**Solution**:
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is not paused

### Issue: API routes return 404
**Solution**:
- Check file is in `src/app/api/` directory
- Ensure `route.ts` is exported as default
- Verify route path matches URL pattern

### Issue: Styles not loading
**Solution**:
- Check `src/app/globals.css` is imported in layout
- Verify Tailwind paths in `tailwind.config.js`
- Clear `.next` folder: `rm -rf .next`

## Deploying Updates

After making changes:

```bash
# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Update features"
git push

# Vercel will auto-deploy on push (if using GitHub integration)
```

## Important Notes

- **Do NOT commit** `.env` or `.env.local`
- **Always use** `NEXT_PUBLIC_` prefix for client-side vars
- **Server-side only** vars don't need prefix
- **Images** in `/public` are cached by Vercel
- **Logs** available in Vercel Dashboard → Functions

## Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript errors
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Support

- Check server logs: `vercel logs`
- View build logs in Vercel Dashboard
- Check browser console (F12) for errors
- Test API: Postman or `curl http://localhost:3000/api/health`

---

**Next.js is now configured and ready for Vercel deployment!** 🚀
