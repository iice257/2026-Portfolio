import Head from "next/head";
import { METADATA, PROFILE_LINKS } from "../../constants";

const cleanUrl = METADATA.siteUrl.replace(/\/$/, "");

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${cleanUrl}/#person`,
    name: METADATA.author,
    alternateName: "Kingsley Aremu",
    url: cleanUrl,
    image: METADATA.image,
    jobTitle: METADATA.jobTitle,
    description: METADATA.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    knowsAbout: [
      "Full-stack web development",
      "React",
      "Next.js",
      "React Native",
      "AI agent tooling",
      "Frontend performance",
      "Creative engineering",
    ],
    sameAs: PROFILE_LINKS,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${cleanUrl}/#website`,
    url: cleanUrl,
    name: METADATA.title,
    description: METADATA.description,
    publisher: {
      "@id": `${cleanUrl}/#person`,
    },
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${cleanUrl}/#profile`,
    url: cleanUrl,
    name: METADATA.title,
    description: METADATA.description,
    mainEntity: {
      "@id": `${cleanUrl}/#person`,
    },
  },
];

const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

const Meta = () => (
  <Head>
    <title>{METADATA.title}</title>
    <meta name="description" content={METADATA.description} />
    <meta name="keywords" content={METADATA.keywords} />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="bingbot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="application-name" content={METADATA.title} />
    <meta name="creator" content={METADATA.author} />
    <meta name="publisher" content={METADATA.author} />
    <meta name="category" content="portfolio" />
    <meta name="classification" content="Full-stack developer portfolio" />
    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="language" content={METADATA.language} />
    <meta name="author" content={METADATA.author} />
    <meta name="theme-color" content={METADATA.themeColor} />
    <meta httpEquiv="content-language" content="en" />
    <link rel="canonical" href={METADATA.siteUrl} />
    <link rel="alternate" hrefLang="en" href={METADATA.siteUrl} />
    <link rel="alternate" hrefLang="x-default" href={METADATA.siteUrl} />

    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content={METADATA.title} />
    <meta property="og:description" content={METADATA.description} />
    <meta property="og:image" content={METADATA.image} />
    <meta property="og:image:alt" content={`${METADATA.author} portfolio preview`} />
    <meta property="og:url" content={METADATA.siteUrl} />
    <meta property="og:site_name" content={METADATA.title} />
    <meta property="profile:first_name" content="Kingsley" />
    <meta property="profile:last_name" content="Aremu" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={METADATA.title} />
    <meta name="twitter:description" content={METADATA.description} />
    <meta name="twitter:url" content={METADATA.siteUrl} />
    <meta name="twitter:image" content={METADATA.image} />
    <meta name="twitter:image:alt" content={`${METADATA.author} portfolio preview`} />
    {METADATA.twitterHandle ? (
      <>
        <meta name="twitter:site" content={METADATA.twitterHandle} />
        <meta name="twitter:creator" content={METADATA.twitterHandle} />
      </>
    ) : null}

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />

    <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon.svg" />
    <meta name="msapplication-TileColor" content="#0a0a0a" />
    <link rel="manifest" href="/manifest.json" />
  </Head>
);

export default Meta;
