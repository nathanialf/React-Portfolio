import '../styles/global.css'
// This uses just the google fonts name
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  weight: '400',
  subsets: ['latin']
})
 
export default function MyApp({ Component, pageProps }) {
  return (
    <main className={outfit.className}>
      <Component {...pageProps} />
    </main>
  )
}