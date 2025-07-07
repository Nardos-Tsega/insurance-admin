import type { AppProps } from 'next/app';
import '../styles/globals.css'; // adjust path as needed

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}