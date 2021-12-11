import { User } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import supabase from "../lib/supabase";

interface IProfile {
  user: User;
}

const Profile: NextPage<IProfile> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Profile | Supa Secret Santa</title>
      </Head>
      <h1 className="text-3xl font-bold underline">Profile</h1>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
      redirect: { destination: "/login", permanent: "false" },
    };
  }

  return { props: { user } };
};

export default Profile;
