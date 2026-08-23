import Head from "next/head";
import Playground from "../components/Playground/Playground";
import { METADATA } from "../constants";

const siteUrl = METADATA.siteUrl.replace(/\/$/, "");
const pageTitle = "Playground — Kingsley Aremu";
const pageDescription = "Interactive studies in typography, motion, WebGL and responsive visual systems.";

export default function PlaygroundPage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}/playground`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`${siteUrl}/playground`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:url" content={`${siteUrl}/playground`} />
      </Head>
      <Playground />
    </>
  );
}
