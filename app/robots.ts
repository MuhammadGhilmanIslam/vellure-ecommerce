import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: isProduction ? ['/admin/', '/api/', '/account/'] : ['/'], // Disallow all in dev/staging
    },
    sitemap: `${appUrl}/sitemap.xml`,
  }
}
