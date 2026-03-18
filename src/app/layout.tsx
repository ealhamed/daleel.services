import './globals.css'
import type { Metadata } from 'next'
import ClientShell from '@/components/ClientShell'

export const metadata: Metadata = {
  title: 'دليل | دليل الخدمات الحكومية السعودية',
  description: 'دليل شامل ومبسط لجميع الخدمات الحكومية الإلكترونية في المملكة العربية السعودية — خطوات، رسوم، متطلبات، وحلول المشاكل الشائعة.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>" />
        {/* Google Analytics — replace G-C8VYCYPLXD with your GA4 measurement ID */}
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
