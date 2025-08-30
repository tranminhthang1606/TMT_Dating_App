# 🚀 Deployment Checklist - TMTDating App

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
- [ ] Create `.env.local` file with production values
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set `NEXT_PUBLIC_BASE_URL` to your Vercel domain
- [ ] Set `NEXT_PUBLIC_STREAM_API_KEY` (if using Stream Chat)
- [ ] Set `STREAM_API_SECRET` (if using Stream Chat)

### 2. Database Setup
- [ ] Ensure Supabase database is properly configured
- [ ] Check all tables exist: `users`, `matches`, `likes`
- [ ] Verify RLS (Row Level Security) policies
- [ ] Test database connections

### 3. SEO Assets Verification
- [ ] ✅ Open Graph image: `/public/og-image.svg`
- [ ] ✅ Favicon: `/public/favicon.svg`
- [ ] ✅ App icons: `/public/icon-192x192.svg`, `/public/icon-512x512.svg`
- [ ] ✅ Manifest: `/public/manifest.json`
- [ ] ✅ Robots.txt: `/public/robots.txt`
- [ ] ✅ Browser config: `/public/browserconfig.xml`

### 4. Build Verification
- [ ] ✅ `npm run build` - Successful
- [ ] ✅ No critical errors
- [ ] ✅ All pages compile correctly
- [ ] ✅ Static assets generated

## 🚀 Deployment Steps

### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 2: Configure Environment Variables in Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all variables from `.env.local`

### Step 3: Custom Domain (Optional)
1. Go to Vercel Dashboard > Domains
2. Add your custom domain
3. Configure DNS settings
4. Wait for SSL certificate

## 🔍 Post-Deployment Verification

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] Profile editing works
- [ ] Matching functionality works
- [ ] Chat functionality works
- [ ] Mobile responsiveness

### 2. SEO Verification
- [ ] Visit `https://your-domain.vercel.app/sitemap.xml`
- [ ] Check meta tags with browser dev tools
- [ ] Test Open Graph with Facebook Debugger
- [ ] Verify Twitter Cards
- [ ] Check structured data with Google Rich Results Test

### 3. Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test mobile performance
- [ ] Verify PWA installation

### 4. Search Engine Setup

#### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Verify ownership (HTML tag method)
4. Submit sitemap: `https://your-domain.vercel.app/sitemap.xml`
5. Monitor indexing status

#### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Submit sitemap
4. Monitor performance

### 5. Analytics Setup

#### Google Analytics
```