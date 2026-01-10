import { 
  Metadata,
  Viewport
} from 'next'
// This uses just the google fonts name
import { Outfit, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import '../styles/global.css'
import React from 'react'
 
export const metadata: Metadata = {
  metadataBase: new URL('https://defnf.com'),
  title: {
    template: '%s | DEFNF',
    default: 'Nathanial Fine'
  },
  description: 'Freelance software developer creating bespoke software solutions',
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon.png?v=2', type: 'image/png', sizes: '64x64' },
    ],
    apple: '/favicon.png?v=2',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    title: 'Nathanial Fine',
    description: 'Freelance software developer creating bespoke software solutions',
    url: 'https://defnf.com',
    siteName: 'DEFNF',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Nathanial Fine',
    description: 'Freelance software developer creating bespoke software solutions',
  },
}

export const viewport: Viewport = {
  themeColor: '#9fc2c2',
}

const outfit = Outfit({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
})

const playfair = Playfair_Display({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const jetbrains = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
})
 
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nathanial Fine',
  url: 'https://defnf.com',
  jobTitle: 'Freelance Software Developer',
  description: 'Freelance software developer creating bespoke software solutions',
}

const MyApp = ({ children }: {children: React.ReactNode}) => {
  return (
    <html className={`${outfit.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  )
}

export default MyApp;
