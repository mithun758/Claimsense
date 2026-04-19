import './globals.css'

export const metadata = {
  title: 'ClaimSense — Know What Your Policy Actually Covers',
  description: 'Upload your health insurance policy. See exactly what you are about to lose. Dispute it.',
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F6E56',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    teal: {
                      50: '#E1F5EE',
                      100: '#C3EBD7',
                      200: '#87D7AF',
                      300: '#4BC387',
                      400: '#1AAF6A',
                      500: '#0F6E56',
                      600: '#0F6E56',
                      700: '#0B5A46',
                      800: '#084736',
                      900: '#043326',
                    }
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
