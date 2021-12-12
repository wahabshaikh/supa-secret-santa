import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image"
import { useRouter } from 'next/router'
import styles from '../styles/home.module.css'



const Home: NextPage = () => {

  const router = useRouter()

  const buttonClicked = () => {
    router.push('/login')
  }

  return (
    <>
      <Head>
        <title>Supa Sceret Santa</title>
      </Head>
      
      <div style={background}>
        <div style={container}>
          <Image src="/static/green-shape.png" alt="green geometric shape" width={850} height={900} />
          <div style={centered}>
            <h1 className={styles.headerText}>Welcome to Supa Secret Santa</h1>
            <p className={styles.headerDescription}>Use Supa Secret Santa to arrange secret santa games with your family, friends and coworkers. Create an account, invite others, let everyone write their wishlist and begin the game of secret santa!</p>
            <button onClick={buttonClicked} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-1" style={buttonStyle}>Get Started</button>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: { withoutLayout: true } };
};

const background = {
  backgroundImage: "url('https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
  width:"100%",
  height:"100vmax"
}

const container = {
  position: 'relative',
  textAlign: 'center',
  color: 'white',
  height:'100%',
}

const centered = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
}

const buttonStyle = {
  marginTop: '2em'
}

export default Home;
