import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import supabase from "../lib/supabase";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function signIn() {
    if (!email) return;

    const { error } = await supabase.auth.signIn({ email });
    if (error) {
      console.error(error);
    } else {
      setIsSubmitted(true);
    }
  }

  return (
    <>
      <Head>
        <title>Login | Supa Secret Santa</title>
      </Head>
      <main className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-center text-7xl">🎅</h1>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          {isSubmitted ? (
            <p className="text-center text-lg">
              Please check your email to sign in
            </p>
          ) : (
            <form
              className="mt-8 space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                signIn();
              }}
            >
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: { withoutLayout: true } };
};

export default Login;
