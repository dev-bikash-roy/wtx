export const metadata = {
  title: '404 - Page Not Found',
}

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="mt-4">Page not found</p>
            <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
              Go back home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
