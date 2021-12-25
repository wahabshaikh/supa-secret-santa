import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header/Header";
import HeroContainer from "../components/HeroContainer";
import Participation from "../components/Participation";

const Home: NextPage = () => {
    return (
        <div className="bg-blue">
            <Head>
                <title>Supa Secret Santa</title>
                <meta
                    name="description"
                    content="With the spirit of the holiday season, we bring to you an opportunity to be a Secret Santa (with a twist) for your loved ones, online."
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
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
                ,
                <a
                    className="mx-1 font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#F96F65] via-[#F66F63] to-[#FD5395]"
                    href="https://twitter.com/yourboimti"
                    target="_blank"
                    rel="noreferrer"
                >
                    Imtiaz
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
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return { props: { withoutLayout: true } };
};

export default Home;
