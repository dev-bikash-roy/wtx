import '@/styles/tailwind.css'
import '@/app/globals.css'
import { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={beVietnamPro.className}>
      <body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        <AuthProvider>
          <ThemeProvider>
            <div>{children}</div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}