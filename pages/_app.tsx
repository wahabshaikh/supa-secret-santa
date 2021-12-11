import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {pageProps.withoutLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}
