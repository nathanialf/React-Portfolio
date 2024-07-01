import type { AppProps } from 'next/app'
// This uses just the google fonts name
import { Outfit } from 'next/font/google'
import React from 'react'
import '../styles/global.css'

const outfit = Outfit({
  weight: '400',
  subsets: ['latin']
})
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={outfit.className}>
      <Component {...pageProps} />
    </main> 
  )
}
