import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { Router, useRouter } from "next/router";
import supabase from "../lib/supabase";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { Toaster } from "react-hot-toast";
import ProgressBar from "@badrap/bar-of-progress";

export default function CustomApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    // Progress bar
    const progress = new ProgressBar({
        size: 3,
        color: "red",
        className: "bar-of-progress",
        delay: 100,
    });

    Router.events.on("routeChangeStart", progress.start);
    Router.events.on("routeChangeComplete", () => {
        progress.finish();
        window.scrollTo(0, 0);
    });
    Router.events.on("routeChangeError", progress.finish);

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
            <Toaster />
        </>
    );
}
