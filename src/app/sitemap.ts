import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tmtdating.vercel.app'
  
  const locales = ['en', 'vi', 'ko']
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/matches', priority: 0.9, changeFrequency: 'hourly' },
    { path: '/list-matches', priority: 0.8, changeFrequency: 'daily' },
    { path: '/chat', priority: 0.7, changeFrequency: 'hourly' },
    { path: '/profile', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/profile/edit', priority: 0.5, changeFrequency: 'weekly' },
    { path: '/auth', priority: 0.4, changeFrequency: 'monthly' },
  ]
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Add locale-specific routes
  locales.forEach(locale => {
    routes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
        priority: route.priority,
      })
    })
  })

  // Add static pages
  sitemapEntries.push(
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    }
  )
  
  return sitemapEntries
}
