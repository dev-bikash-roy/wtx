import '@/styles/tailwind.css'
import '@/app/globals.css'
import '@/app/mobile-optimizations.css'
import { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e40af',
}

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
  verification: {
    google: 'QwBfcIRPBl0Bk1l9FRWzhttOp7BIQwfwCkceCSwCPTg',
    other: {
      'msvalidate.01': '9996F9B1FA4005AF1E60F7688E0556A2',
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-4115163205031252',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200`} style={{ fontFamily: 'var(--font-be-vietnam-pro), sans-serif' }}>
        {/* Google Analytics - Deferred */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SZQJ2R3C2R"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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