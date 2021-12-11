import { User } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import supabase from "../lib/supabase";

interface IDashboard {
  user: User;
}

const Dashboard: NextPage<IDashboard> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Dashboard | Supa Secret Santa</title>
      </Head>
      <h1 className="text-3xl font-bold underline">Dashboard</h1>
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

export default Dashboard;
