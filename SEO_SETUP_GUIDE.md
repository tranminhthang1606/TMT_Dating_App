# 🔍 SEO Setup Guide - TMTDating

## 📋 **Google Search Console Setup**

### **Bước 1: Thêm Property**
1. Vào [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Nhập URL: `https://tmtdating.vercel.app`
4. Chọn "Domain" (khuyến nghị)

### **Bước 2: Xác minh quyền sở hữu**
1. Chọn phương thức "HTML tag"
2. Copy verification code
3. Thêm vào `.env.local`:
```env
GOOGLE_SITE_VERIFICATION=your_verification_code_here
```

### **Bước 3: Submit Sitemap**
1. Vào "Sitemaps" trong Search Console
2. Submit URL: `https://tmtdating.vercel.app/sitemap.xml`
3. Monitor indexing status

## 🔧 **Environment Variables Setup**

Tạo file `.env.local` với các biến sau:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Base URL for SEO
NEXT_PUBLIC_BASE_URL=https://tmtdating.vercel.app

# Search Engine Verification
GOOGLE_SITE_VERIFICATION=your_google_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code
YAHOO_VERIFICATION=your_yahoo_verification_code

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id
```

## 📊 **Google Analytics Setup (Optional)**

### **Bước 1: Tạo GA4 Property**
1. Vào [Google Analytics](https://analytics.google.com)
2. Tạo property mới cho TMTDating
3. Copy Measurement ID

### **Bước 2: Cấu hình**
1. Thêm `NEXT_PUBLIC_GA_MEASUREMENT_ID` vào `.env.local`
2. Analytics sẽ tự động track

## 🔍 **SEO Monitoring**

### **Core Web Vitals**
- Monitor trong Google Search Console
- Target: LCP < 2.5s, FID < 100ms, CLS < 0.1

### **Search Performance**
- Track keywords: "dating app", "find love", "online dating"
- Monitor click-through rates
- Check mobile usability

### **Indexing Status**
- Submit sitemap regularly
- Check for crawl errors
- Monitor indexing coverage

## 🚀 **Deployment Checklist**

### **Pre-deployment**
- [ ] Environment variables set
- [ ] Google verification code added
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

### **Post-deployment**
- [ ] Verify Google Search Console
- [ ] Submit sitemap
- [ ] Test meta tags
- [ ] Check structured data
- [ ] Monitor Core Web Vitals

## 📱 **Mobile SEO**

### **PWA Features**
- [ ] App installable on mobile
- [ ] Offline functionality works
- [ ] App shortcuts functional
- [ ] Splash screen displays correctly

### **Mobile Performance**
- [ ] Page loads under 3 seconds
- [ ] Touch interactions responsive
- [ ] No horizontal scrolling
- [ ] Font sizes readable

## 🔒 **Security & Privacy**

### **HTTPS**
- [ ] SSL certificate active
- [ ] All resources load over HTTPS
- [ ] No mixed content warnings

### **Privacy**
- [ ] Privacy policy page exists
- [ ] Terms of service page exists
- [ ] Cookie consent (if needed)
- [ ] GDPR compliance (if applicable)

## 📈 **Performance Optimization**

### **Image Optimization**
- [ ] Images compressed and optimized
- [ ] WebP format used where possible
- [ ] Lazy loading implemented
- [ ] Proper alt tags added

### **Code Optimization**
- [ ] JavaScript minified
- [ ] CSS minified
- [ ] Bundle size optimized
- [ ] Critical CSS inlined

## 🎯 **Local SEO (Optional)**

### **Location-based Features**
- [ ] Location schema markup
- [ ] Local keywords optimized
- [ ] Location-based matching
- [ ] Local business information

## 📞 **Support & Monitoring**

### **Error Monitoring**
- [ ] 404 errors tracked
- [ ] JavaScript errors monitored
- [ ] API failures logged
- [ ] Performance alerts set

### **Regular Maintenance**
- [ ] Weekly SEO performance review
- [ ] Monthly content updates
- [ ] Quarterly technical SEO audit
- [ ] Annual SEO strategy review

---

**🎉 Sau khi hoàn thành setup, website TMTDating sẽ được Google index và theo dõi hiệu suất SEO!**
