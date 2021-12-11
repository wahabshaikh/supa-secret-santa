import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Room: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Room {id} | Supa Sceret Santa</title>
      </Head>
      <h1 className="text-3xl font-bold underline">Room {id}</h1>
    </>
  );
};

export default Room;
