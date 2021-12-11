import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login | Supa Sceret Santa</title>
      </Head>
      <h1 className="text-3xl font-bold underline">Login</h1>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: { withoutLayout: true } };
};

export default Login;
