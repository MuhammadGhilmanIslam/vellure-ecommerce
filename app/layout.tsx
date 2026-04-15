import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Vellure — Where Elegance Meets Intention',
    template: '%s | Vellure',
  },
  description:
    'Vellure is a premium multi-category lifestyle e-commerce platform. Curated products, editorial design, intentional experience.',
  keywords: ['Vellure', 'premium fashion', 'lifestyle', 'e-commerce', 'curated'],
  openGraph: {
    title: 'Vellure — Where Elegance Meets Intention',
    description: 'Premium multi-category lifestyle store with an editorial experience.',
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="antialiased font-body bg-ag-bg text-ag-text">
        {children}
      </body>
    </html>
  )
}
