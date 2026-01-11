import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { METADATA } from "../constants";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 | {METADATA.title}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex flex-col min-h-screen bg-paper dark:bg-void transition-colors duration-500 text-ink dark:text-ash">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-9xl font-bold tracking-tighter text-black dark:text-white mb-4">
            404
          </h1>
          <p className="text-xl md:text-2xl text-ink/60 dark:text-ash/60 mb-8 font-light">
            The page you aren&apos;t looking for.
          </p>
          <Link href="/" className="px-6 py-3 bg-ink dark:bg-white text-white dark:text-black font-medium rounded-full hover:opacity-90 transition-opacity">
            Return Home
          </Link>
        </main>
        <Footer />
      </div>
    </>
  );
}
