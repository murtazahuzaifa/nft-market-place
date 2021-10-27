import '../styles/globals.css';
import Link from 'next/link';
import type { AppProps } from 'next/app';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className='border p' >
        <p className='text-4xl font-bold' >Metaverse Marketplace</p>
        <div className='flex mt-4'>
          <Link href="/"><a className='mr-6 text-pink-500' >Home</a></Link>
          <Link href="/create-item"><a className='mr-6 text-pink-500' >Sell Digital Asset</a></Link>
          <Link href="/my-assets"><a className='mr-6 text-pink-500' >My Digital Asset</a></Link>
          <Link href="/create-dashboard"><a className='mr-6 text-pink-500' >Creator Dashboard</a></Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}
export default MyApp
