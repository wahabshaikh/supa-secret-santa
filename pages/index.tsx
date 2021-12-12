import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Supa Sceret Santa</title>
      </Head>
      <h1 className="text-3xl font-bold underline">Home</h1>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: { withoutLayout: true } };
};

export default Home;
