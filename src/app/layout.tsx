import { 
  Metadata,
  Viewport
} from 'next'
// This uses just the google fonts name
import { Outfit } from 'next/font/google'
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
  subsets: ['latin']
})
 
const MyApp = ({ children }: {children: React.ReactNode}) => {
  return (
    <html>
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  )
}

export default MyApp;
