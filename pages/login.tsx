import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import supabase from "../lib/supabase";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let toastId: string | undefined;
    if (isSubmitting) {
      toastId = toast.loading("Signing in...");
    }

    return () => toast.remove(toastId);
  }, [isSubmitting]);

  async function signIn() {
    setIsSubmitting(true);

    if (!email) {
      setIsSubmitting(false);
      toast.error("Please enter an email");
      return;
    }

    const { error } = await supabase.auth.signIn({ email });
    if (error) {
      console.error(error);
      toast.error(error.message);
      setIsSubmitting(false);
    } else {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setEmail("");
    }
  }

  return (
    <>
      <Head>
        <title>Login | Supa Secret Santa</title>
      </Head>
      <main className="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-9xl">🎅</h1>
        <div className="mt-8 max-w-md w-full space-y-8 bg-white px-4 py-5 md:p-6 rounded-md shadow-sm">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          {isSubmitted ? (
            <p className="text-center">Please check your email to sign in</p>
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
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  disabled={isSubmitting}
                >
                  Sign in
                </Button>
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
