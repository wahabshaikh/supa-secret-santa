import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header/Header";
import HeroContainer from "../components/HeroContainer";
import Participation from "../components/Participation";
import Snowfall from "react-snowfall";

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
                <Snowfall
                    // Changes the snowflake color
                    color="white"
                    // Applied to the canvas element
                    // Controls the number of snowflakes that are created (default 150)
                    snowflakeCount={200}
                />
            </Head>
            <Header />
            <HeroContainer />
            <Participation />
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return { props: { withoutLayout: true } };
};

export default Home;
