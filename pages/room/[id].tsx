import { User } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import supabase from "../../lib/supabase";

interface IRoom {
  user: User;
}

const Room: NextPage<IRoom> = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Room {id} | Supa Secret Santa</title>
      </Head>
      <h1 className="text-3xl font-bold underline">Room {id}</h1>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { user } };
};

export default Room;
