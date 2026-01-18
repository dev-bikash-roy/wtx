import '@/styles/tailwind.css'
import '@/app/globals.css'
import { Metadata } from 'next'
import Script from 'next/script'
import ThemeProvider from './theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: {
    template: '%s | WTX News',
    default: 'WTX News - Global News, Politics, Sports & Lifestyle',
  },
  description: 'Stay informed with WTX News. Unbiased reporting, in-depth analysis, and the latest stories from around the word.',
  keywords: ['WTX News', 'Global News', 'Politics', 'Sports', 'Lifestyle', 'Breaking News'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'google-adsense-account': 'ca-pub-4115163205031252',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Favicon links for better compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SZQJ2R3C2R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SZQJ2R3C2R');
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'WTX News',
              url: 'https://wtxnews.co.uk',
              logo: {
                '@type': 'ImageObject',
                url: 'https://wtxnews.co.uk/wtx-logo.png',
                width: 600,
                height: 60
              },
              sameAs: [
                'https://www.facebook.com/wtxnews',
                'https://twitter.com/wtxnews',
                'https://www.instagram.com/wtxnews'
              ]
            })
          }}
        />

        <AuthProvider>
          <ThemeProvider>
            <div>{children}</div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html >
  )
}