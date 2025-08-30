import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({
  title,
  description = 'Modern dating app to help you find true love with smart matching, video chat, and secure messaging',
  keywords = 'dating, match, love, relationship, dating app, find love, online dating, TMTDating',
  image = '/og-image.svg',
  url = 'https://tmtdating.vercel.app',
  type = 'website'
}: SEOHeadProps) {
  const defaultTitle = title || 'TMTDating - Modern Dating App';
  const fullTitle = title ? `${title} | TMTDating` : defaultTitle;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="TMTDating Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="TMTDating" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@tmtdating_app" />
      <meta name="twitter:site" content="@tmtdating_app" />
      
      {/* PWA Meta Tags */}
      <meta name="theme-color" content="#ec4899" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="TMTDating" />
      <meta name="application-name" content="TMTDating" />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content="#ec4899" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
    </Head>
  );
}
