import './globals.css'
import type { Metadata, Viewport } from 'next'
import ClientShell from '@/components/ClientShell'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'دليل | دليل الخدمات الحكومية السعودية',
  description: 'دليل شامل ومبسط لجميع الخدمات الحكومية الإلكترونية في المملكة العربية السعودية — خطوات، رسوم، متطلبات، وحلول المشاكل الشائعة.',
  metadataBase: new URL('https://daleel.services'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'دليل | Saudi Government Services Guide',
    description: 'Clear steps, updated fees, and troubleshooting for every government e-service in Saudi Arabia.',
    url: 'https://daleel.services',
    siteName: 'Daleel',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دليل | Saudi Government Services Guide',
    description: 'Clear steps, updated fees, and troubleshooting for every government e-service in Saudi Arabia.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-C8VYCYPLXD"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-C8VYCYPLXD');` }} />
      </head>
      <body>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  )
}
