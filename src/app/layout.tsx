import '@/styles/tailwind.css'
import '@/app/globals.css'
import { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import Script from 'next/script'
import ThemeProvider from './theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | WTX News',
    default: 'WTX News - Global News, Politics, Sports & Lifestyle',
  },
  description: 'Stay informed with WTX News. Unbiased reporting, in-depth analysis, and the latest stories from around the word.',
  keywords: ['WTX News', 'Global News', 'Politics', 'Sports', 'Lifestyle', 'Breaking News'],
  icons: {
    icon: 'https://wtxnews.com/wp-content/uploads/2025/12/WTX-News-Icon-1.png',
    shortcut: 'https://wtxnews.com/wp-content/uploads/2025/12/WTX-News-Icon-1.png',
    apple: 'https://wtxnews.com/wp-content/uploads/2025/12/WTX-News-Icon-1.png',
  },
  other: {
    'google-adsense-account': 'ca-pub-4115163205031252',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={beVietnamPro.className}>
      <body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
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

        <AuthProvider>
          <ThemeProvider>
            <div>{children}</div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}