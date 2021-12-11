import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabase";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        authStateChangeHandler(event, session);

        if (event === "SIGNED_IN") {
          router.push("/dashboard");
        }

        if (event === "SIGNED_OUT") {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  async function authStateChangeHandler(
    event: AuthChangeEvent,
    session: Session | null
  ) {
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  }

  return (
    <>
      {pageProps.withoutLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}
