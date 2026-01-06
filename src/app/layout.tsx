import { 
  Metadata,
  Viewport
} from 'next'
// This uses just the google fonts name
import { Outfit, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import '../styles/global.css'
import React from 'react'
 
export const metadata: Metadata = {
  title: {
    template: '%s | DEFNF',
    default: 'Nathanial Fine'
  },
  description: 'Personal Website',
  icons: '/favicon.ico'
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
 
const MyApp = ({ children }: {children: React.ReactNode}) => {
  return (
    <html className={`${outfit.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  )
}

export default MyApp;
