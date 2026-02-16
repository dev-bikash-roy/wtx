import '@/styles/tailwind.css'
import '@/app/globals.css'
import '@/app/mobile-optimizations.css'
import { Metadata } from 'next'
import Script from 'next/script'
import { Be_Vietnam_Pro } from 'next/font/google'
import ThemeProvider from './theme-provider'

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
  preload: true,
})

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
  metadataBase: new URL('https://wtxnews.co.uk'),
  other: {
    'google-adsense-account': 'ca-pub-4115163205031252',
    'charset': 'utf-8',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Character encoding - MUST be first for Lighthouse */}
        <meta charSet="utf-8" />
        
        {/* Preconnect to critical origins only - reduced from 7 to 3 */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://wtxnews.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Mobile-specific optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />

        {/* Google Site Verification */}
        <meta name="google-site-verification" content="QwBfcIRPBl0Bk1l9FRWzhttOp7BIQwfwCkceCSwCPTg" />

        {/* Bing/Microsoft Site Verification */}
        <meta name="msvalidate.01" content="9996F9B1FA4005AF1E60F7688E0556A2" />

        {/* Favicon links for better compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className={`${beVietnamPro.variable} bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200`} style={{ fontFamily: 'var(--font-be-vietnam-pro), sans-serif' }}>
        {/* Google Analytics - Deferred */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SZQJ2R3C2R"
          strategy="worker"
        />
        <Script id="google-analytics" strategy="worker">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SZQJ2R3C2R', {
              page_path: window.location.pathname,
            });
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

        <ThemeProvider>
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html >
  )
}