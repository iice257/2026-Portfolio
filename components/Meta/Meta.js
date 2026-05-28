import Head from "next/head";
import { METADATA, PROFILE_LINKS } from "../../constants";
import { featuredProjects, highlightedProject, majorProjects } from "../../data/projects";

const cleanUrl = METADATA.siteUrl.replace(/\/$/, "");
const primaryProjects = [...featuredProjects, highlightedProject, ...majorProjects];
const searchQueries = METADATA.topSearchQueries.join(", ");
const educationAreas = METADATA.educationAreas.join(", ");
const retrievalHints = METADATA.exaRetrievalHints.join(" ");
const siteNavigation = [
  { name: "Home", url: cleanUrl },
  { name: "Projects", url: `${cleanUrl}/projects` },
  { name: "Skills", url: `${cleanUrl}/#skills` },
  { name: "Experience", url: `${cleanUrl}/#experience` },
  { name: "Contact", url: `${cleanUrl}/#contact` },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${cleanUrl}/#person`,
    name: METADATA.author,
    alternateName: [METADATA.shortName, METADATA.username],
    url: cleanUrl,
    image: METADATA.image,
    jobTitle: METADATA.jobTitle,
    description: METADATA.description,
    email: METADATA.email,
    identifier: METADATA.username,
    nationality: {
      "@type": "Country",
      name: METADATA.country,
    },
    homeLocation: {
      "@type": "Place",
      name: METADATA.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: METADATA.city,
        addressRegion: METADATA.region,
        addressCountry: "NG",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: METADATA.city,
      addressRegion: METADATA.region,
      addressCountry: "NG",
    },
    knowsAbout: [...METADATA.focusAreas, ...METADATA.educationAreas],
    knowsLanguage: ["English"],
    hasOccupation: {
      "@type": "Occupation",
      name: METADATA.jobTitle,
      skills: METADATA.focusAreas.join(", "),
    },
    mainEntityOfPage: {
      "@id": `${cleanUrl}/#profile`,
    },
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
    potentialAction: {
      "@type": "SearchAction",
      target: `${cleanUrl}/projects?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
    about: {
      "@id": `${cleanUrl}/#person`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: METADATA.image,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${cleanUrl}/#featured-projects`,
    name: "Featured projects by Kingsley Afolabi Aremu",
    description:
      "Flagship portfolio projects spanning AI productivity, private productivity tools, AI-agent workflows, image restoration, agent operations, and portfolio systems.",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: primaryProjects.length,
    itemListElement: primaryProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: project.slug
        ? `${cleanUrl}/projects${featuredProjects.some((item) => item.slug === project.slug) ? `/${project.slug}` : ""}`
        : `${cleanUrl}/projects`,
      item: {
        "@type": "CreativeWork",
        name: project.name,
        description: project.longDescription || project.description,
        keywords: project.tech?.join(", "),
        sameAs: [project.url, project.liveUrl].filter((url) => url && url !== "#"),
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${cleanUrl}/#education-areas`,
    name: "Education, coursework, and learning areas for Kingsley Afolabi Aremu",
    description:
      "Course and study areas represented for search engines, AI retrieval systems, and backend portfolio context.",
    hasDefinedTerm: METADATA.educationAreas.map((area) => ({
      "@type": "DefinedTerm",
      name: area,
      inDefinedTermSet: `${cleanUrl}/#education-areas`,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": `${cleanUrl}/#site-navigation`,
    name: siteNavigation.map((item) => item.name),
    url: siteNavigation.map((item) => item.url),
  },
];

const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

const Meta = () => (
  <Head>
    <title>{METADATA.title}</title>
    <meta name="description" content={METADATA.description} />
    <meta name="keywords" content={METADATA.keywords} />
    <meta name="subject" content="Full-stack engineer portfolio, frontend engineering, React, Next.js, React Native, AI agent tooling, automation, creative engineering" />
    <meta name="abstract" content={METADATA.description} />
    <meta name="topic" content="Software engineering portfolio" />
    <meta name="summary" content={METADATA.description} />
    <meta name="retrieval-summary" content={METADATA.retrievalSummary} />
    <meta name="exa-search-context" content={retrievalHints} />
    <meta name="target" content="software engineering recruiters, technical founders, product teams, AI tooling teams, frontend engineering leads" />
    <meta name="search-queries" content={searchQueries} />
    <meta name="education" content={educationAreas} />
    <meta name="coursework" content={educationAreas} />
    <meta name="learning-areas" content={educationAreas} />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="bingbot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="application-name" content={METADATA.title} />
    <meta name="creator" content={METADATA.author} />
    <meta name="publisher" content={METADATA.author} />
    <meta name="owner" content={METADATA.author} />
    <meta name="designer" content={METADATA.author} />
    <meta name="reply-to" content={METADATA.email} />
    <meta name="category" content="portfolio" />
    <meta name="classification" content="Full-stack engineer portfolio" />
    <meta name="coverage" content="Worldwide" />
    <meta name="distribution" content="Global" />
    <meta name="rating" content="General" />
    <meta name="revisit-after" content="7 days" />
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

    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicons/favicon.ico" />
    <meta name="msapplication-TileColor" content="#0a0a0a" />
    <link rel="manifest" href="/manifest.json" />
  </Head>
);

export default Meta;
