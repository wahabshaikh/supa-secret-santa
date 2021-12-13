import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Supa Secret Santa</title>
        <meta
          name="description"
          content="With the spirit of the holiday season, we bring to you a Supabase powered platform to be a Secret Santa for your loved ones, online."
        />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-aut shadow-sm md:rounded-md backdrop-blur-xl bg-red-100/90">
          <div className="px-4 py-5 p-6 space-y-4">
            <h1 className="text-center inline-flex flex-col items-center justify-center font-heading text-7xl text-red-500">
              <span>🎅</span>
              Welcome to Supa Secret Santa
            </h1>
            <p className="text-xl text-gray-800 text-center">
              With the spirit of the holiday season, we bring to you a{" "}
              <a
                className="text-green-600"
                href="https://supabase.io"
                rel="noopener noreferrer"
              >
                Supabase
              </a>{" "}
              powered platform to be a Secret Santa for your loved ones, online.
            </p>
            <Link href="/login">
              <a className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2">
                Get Started
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: { withoutLayout: true } };
};

export default Home;
