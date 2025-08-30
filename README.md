# Matcha - Modern Dating App

A modern, responsive dating application built with Next.js, featuring smart matching algorithms, video chat, and secure messaging.

## 🌟 Features

- **Smart Matching Algorithm**: Advanced compatibility matching based on preferences, age, and location
- **Video Chat**: Real-time video calling with STREAM technology
- **Secure Messaging**: End-to-end encrypted chat system by STREAM
- **Profile Management**: Comprehensive profile editing with preferences
- **Multi-language Support**: English, Vietnamese, and Korean
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 SEO Optimizations

This project includes comprehensive SEO optimizations:

### Meta Tags & Open Graph
- Dynamic meta titles and descriptions for each page
- Open Graph tags for social media sharing
- Twitter Card support
- Canonical URLs to prevent duplicate content

### Structured Data
- JSON-LD structured data for better search engine understanding
- WebApplication schema markup
- Organization and Website schemas

### Technical SEO
- XML sitemap with proper priorities and change frequencies
- Robots.txt with comprehensive crawling rules
- Performance optimizations (image compression, lazy loading)
- Security headers for better Core Web Vitals

### PWA Features
- Web App Manifest with proper icons and shortcuts
- Service Worker for offline functionality
- App-like experience with splash screens

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Basic functionality without internet
- **App Shortcuts**: Quick access to key features
- **Splash Screens**: Native app-like loading experience

## 🌐 Internationalization

- **Languages**: English, Vietnamese, Korean
- **Locale-specific SEO**: Meta tags and content for each language
- **Hreflang Tags**: Proper language targeting for search engines

## 🔧 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: STREAM
- **Video Chat**: STREAM
- **Internationalization**: next-intl
- **Animations**: GSAP
- **Icons**: Heroicons

## 📊 SEO Performance

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Search Engine Optimization
- **Meta Tags**: Complete implementation for all pages
- **Structured Data**: JSON-LD markup for rich snippets
- **Sitemap**: Dynamic XML sitemap with proper priorities
- **Robots.txt**: Comprehensive crawling directives

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/tranminhthang1606/TMT_Dating_App

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
pnpm run dev
```

## 🔑 Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# SEO Verification
GOOGLE_SITE_VERIFICATION=your_google_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code
YAHOO_VERIFICATION=your_yahoo_verification_code
```

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── components/     # Reusable components
│   │   ├── matches/        # Matching functionality
│   │   ├── chat/          # Video chat and messaging
│   │   ├── profile/       # User profiles
│   │   └── auth/          # Authentication
│   └── sitemap.ts         # Dynamic sitemap
├── components/
│   └── SEO/               # SEO components
├── lib/
│   ├── actions/           # Server actions
│   ├── helpers/           # Utility functions
│   └── supabase/          # Database client
└── store/                 # State management
```

## 🎯 SEO Best Practices Implemented

### 1. Meta Tags
- Dynamic titles and descriptions for each page
- Proper Open Graph implementation
- Twitter Card optimization
- Canonical URLs to prevent duplicate content

### 2. Structured Data
- JSON-LD markup for WebApplication
- Organization and Website schemas
- Rich snippets for better search visibility

### 3. Technical SEO
- XML sitemap with proper priorities
- Robots.txt with comprehensive rules
- Performance optimizations
- Security headers

### 4. Internationalization SEO
- Hreflang tags for language targeting
- Locale-specific meta tags
- Proper URL structure for multiple languages

### 5. PWA SEO
- Web App Manifest optimization
- Service Worker implementation
- App shortcuts for better UX

## 📈 Performance Monitoring

### Google Analytics Setup
```javascript
// Add to your analytics configuration
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'Matcha Dating App',
  page_location: window.location.href,
  custom_map: {
    'custom_parameter_1': 'user_type',
    'custom_parameter_2': 'match_count'
  }
});
```

### Core Web Vitals Monitoring
- Real User Monitoring (RUM) implementation
- Performance metrics tracking
- User experience optimization

## 🔍 Search Console Setup

1. **Verify Ownership**: Add verification codes to environment variables
2. **Submit Sitemap**: Submit `/sitemap.xml` to Google Search Console
3. **Monitor Performance**: Track search performance and Core Web Vitals
4. **Fix Issues**: Address any crawl errors or mobile usability issues

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables for Production
- Set all required environment variables in Vercel dashboard
- Configure custom domain with SSL
- Set up redirects for SEO

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first approach
- **Touch Interactions**: Optimized for touch devices
- **Performance**: Optimized for mobile networks
- **PWA**: Installable on mobile devices

## 🔒 Security & Privacy

- **HTTPS**: Enforced SSL/TLS encryption
- **Security Headers**: Comprehensive security headers
- **Data Protection**: GDPR compliant data handling
- **Privacy Policy**: Clear privacy information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@matcha-app.com or create an issue in this repository.

---

**Built with ❤️ using Next.js and modern web technologies**
