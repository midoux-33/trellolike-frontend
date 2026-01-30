import '../styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Next.js App</title>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
