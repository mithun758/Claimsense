import './globals.css'

export const metadata = {
  title: 'ClaimSense — Know What Your Policy Actually Covers',
  description: 'Upload your health insurance policy. See exactly what you are about to lose. Dispute it.',
  manifest: '/manifest.json',
  themeColor: '#0F6E56',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F6E56" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
