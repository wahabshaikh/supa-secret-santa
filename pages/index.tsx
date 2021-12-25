import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header/Header";
import HeroContainer from "../components/HeroContainer";
import Participation from "../components/Participation";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Supa Secret Santa</title>
                <meta
                    name="description"
                    content="With the spirit of the holiday season, we bring to you a Supabase powered platform to be a Secret Santa for your loved ones, online."
                />
                <link
                    rel="shortcut icon"
                    href="favicon.ico"
                    type="image/x-icon"
                />
            </Head>
            <Header />
            <HeroContainer />
            <Participation />
            <div className="text-white text-center pb-10">
                Made with ❤ by{" "}
                <a
                    className="mx-1 font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#F96F65] via-[#F66F63] to-[#FD5395]"
                    href="https://twitter.com/wahabshaikh_"
                    target="_blank"
                    rel="noreferrer"
                >
                    Wahab
                </a>
                and
                <a
                    className="mx-1 font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#F96F65] via-[#F66F63] to-[#FD5395]"
                    href="https://twitter.com/KROTUS8"
                    target="_blank"
                    rel="noreferrer"
                >
                    Ketan
                </a>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return { props: { withoutLayout: true } };
};

export default Home;
