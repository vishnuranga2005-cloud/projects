# Development Setup - Next.js

Your project is now using **Next.js 15** for development and production.

## Running Development Server

### Correct Command:
```bash
npm run dev
```

This will start Next.js dev server on: **http://localhost:3000**

### What You'll See:
```
▲ Next.js 15.5.12
- Local:        http://localhost:3000
- Network:      http://192.168.101.6:3000
```

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Environment Setup for Development

### 1. Create `.env.local` file in project root:
```bash
cp .env.example .env.local
```

### 2. Add your credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890
NODE_ENV=development
```

Get credentials from:
- **Supabase URL & Key**: https://supabase.com/dashboard → Settings → API
- **Razorpay Key**: https://dashboard.razorpay.com → Settings → API Keys (optional)

### 3. Start development server:
```bash
npm run dev
```

Visit: http://localhost:3000

## Important Notes

- ⚠️ **Never commit `.env.local`** - It contains secrets
- ✅ Always add env vars to `.gitignore` (already done)
- 🔄 Restart dev server if you change environment variables
- 🏗️ Hot reload works automatically for code changes

## Troubleshooting

### Port 3000 already in use?
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

### Environment variables not loading?
```bash
# Make sure .env.local file exists
ls -la .env.local

# Restart dev server (Ctrl+C and run npm run dev again)
```

### Still seeing Vite?
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install

# Run dev again
npm run dev
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── api/                 # API routes
│       └── health/route.ts  # Health endpoint
├── page-components/         # Page components (renamed from pages/)
├── components/              # React components
├── contexts/                # React context providers
├── lib/                     # Utilities and libraries
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # Authentication logic
│   └── api.ts              # API client
└── ...
```

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes** to files in `src/`
3. **Hot reload** happens automatically
4. **Check console** for TypeScript errors
5. **Test in browser** at http://localhost:3000

## Testing Production Build

To test how the app will work in production:

```bash
# Build production version
npm run build

# Start production server
npm start

# Visit http://localhost:3000
```

Then deploy to Vercel (environment variables are set there).

## Support

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Check `FIX_CLIENT_ERROR.md` if you have deployment issues
