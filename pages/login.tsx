import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Card from "../components/Card";
import supabase from "../lib/supabase";

const Login: NextPage = () => {
  const router = useRouter();
  const user = supabase.auth.user();

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

  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <>
      <Head>
        <title>Login | Supa Secret Santa</title>
      </Head>
      <main className="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Image
          height={128}
          width={128}
          src="/logo.png"
          alt="Supa Secret Santa"
        />

        <Card className="max-w-md w-full">
          <h2 className="text-3xl font-semibold text-gray-900 text-center">
            Sign in to your account
          </h2>

          {isSubmitted ? (
            <p className="mt-4 text-center">
              Please check your email to sign in
            </p>
          ) : (
            <form
              className="mt-8"
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
                  className="w-full mt-4"
                  disabled={isSubmitting}
                >
                  Sign in
                </Button>
              </div>
            </form>
          )}
        </Card>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: { withoutLayout: true } };
};

export default Login;
