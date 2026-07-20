import Head from "next/head";
import Playground from "../components/Playground/Playground";

export default function PlaygroundPage() {
  return (
    <>
      <Head>
        <title>Playground — Kingsley Aremu</title>
        <meta name="description" content="Interactive studies in typography, motion, WebGL and responsive visual systems." />
      </Head>
      <Playground />
    </>
  );
}
