import Head from "next/head";
import { METADATA } from "../constants";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Projects from "@/components/Projects/Projects";
import Skills from "@/components/Skills/Skills";
import Contact from "@/components/Contact/Contact";

export default function Home() {
  return (
    <>
      <Head>
        <title>{METADATA.title}</title>
        <meta name="description" content={METADATA.description} />
      </Head>

      <div className="flex flex-col min-h-screen bg-paper dark:bg-void transition-colors duration-500 text-ink dark:text-ash font-sans selection:bg-accent-light/30 dark:selection:bg-accent-dark/30">
        <Header />
        <main className="flex-grow">
          <Hero />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
