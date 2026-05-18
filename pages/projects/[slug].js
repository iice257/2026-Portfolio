import { useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { featuredProjects } from "../../data/projects";
import { METADATA } from "../../constants";
import Footer from "@/components/Footer/Footer";
import ProjectVisual from "@/components/Projects/ProjectVisual";
import ShuffleText from "@/components/ReactBits/ShuffleText";

export async function getStaticPaths() {
  const paths = featuredProjects.map((project) => ({
    params: { slug: project.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const project = featuredProjects.find((item) => item.slug === params.slug);
  const projectIndex = featuredProjects.findIndex((item) => item.slug === params.slug);

  return {
    props: {
      project,
      projectIndex,
      prevProject: projectIndex > 0 ? featuredProjects[projectIndex - 1] : null,
      nextProject: projectIndex < featuredProjects.length - 1 ? featuredProjects[projectIndex + 1] : null,
    },
  };
}

const DetailBlock = ({ label, title, children }) => (
  <article className="py-10 border-t" style={{ borderColor: "var(--border)" }}>
    <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
      {label}
    </p>
    <h2 className="text-display-sm font-light mb-5" style={{ color: "var(--fg-primary)" }}>
      {title}
    </h2>
    <p className="text-editorial font-light leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
      {children}
    </p>
  </article>
);

const ProjectNumberCarousel = ({ projects, currentIndex }) => {
  const currentProject = projects[currentIndex];

  return (
    <div
      className="project-number-carousel mb-4"
      tabIndex={0}
      aria-label={`Project ${String(currentIndex + 1).padStart(2, "0")}: ${currentProject.name}`}
    >
      <span className="project-number-current text-display-2xl font-thin" aria-hidden="true">
        {String(currentIndex + 1).padStart(2, "0")}
      </span>
      <div className="project-number-track">
        {projects.map((item, itemIndex) => {
          const isCurrent = itemIndex === currentIndex;
          const content = (
            <>
              <span className="block text-display-sm leading-none">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block text-micro normal-case tracking-normal">
                {item.name}
              </span>
            </>
          );

          if (isCurrent) {
            return (
              <div key={item.slug} className="project-number-item is-current">
                {content}
              </div>
            );
          }

          return (
            <Link key={item.slug} href={`/projects/${item.slug}`} className="project-number-item">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const ProjectMediaPreview = ({ project, variant = "desktop", priority = false }) => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const videoSrc = variant === "desktop" ? project.desktopVideo : project.mobileVideo;
  const isMobile = variant === "mobile";

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPaused(false)).catch(() => setIsPaused(true));
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  return (
    <div className={`project-media-preview ${isMobile ? "is-mobile" : "is-desktop"}`}>
      <div className="project-media-frame">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload={priority ? "auto" : "metadata"}
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden">
            <ProjectVisual project={project} priority={priority} compact={isMobile} />
            <div className="project-media-overlay" aria-hidden="true">
              <span>{isMobile ? "Mobile" : "Desktop"}</span>
            </div>
          </div>
        )}

        {videoSrc && (
          <button
            type="button"
            className="project-media-control"
            onClick={togglePlayback}
            aria-label={`${isPaused ? "Play" : "Pause"} ${project.name} preview`}
          >
            <span>{isPaused ? "Play" : "Pause"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default function ProjectDetail({ project, projectIndex, prevProject, nextProject }) {
  if (!project) return null;

  const canonicalUrl = `${METADATA.siteUrl.replace(/\/$/, "")}/projects/${project.slug}`;
  const projectActions = [
    project.url !== "#" ? { label: "View on GitHub", href: project.url } : null,
    project.liveUrl ? { label: "View website", href: project.liveUrl } : null,
  ].filter(Boolean);
  const projectJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${canonicalUrl}#project`,
    name: project.name,
    headline: project.subtitle,
    description: project.longDescription,
    url: canonicalUrl,
    creator: {
      "@type": "Person",
      name: METADATA.author,
      url: METADATA.siteUrl,
    },
    keywords: project.tech.join(", "),
    sameAs: [project.url, project.liveUrl].filter((url) => url && url !== "#"),
  }).replace(/</g, "\\u003c");

  return (
    <>
      <Head>
        <title>{`${project.name} | ${METADATA.author}`}</title>
        <meta name="description" content={project.longDescription} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${project.name} | ${METADATA.author}`} />
        <meta property="og:description" content={project.longDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={METADATA.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.name} | ${METADATA.author}`} />
        <meta name="twitter:description" content={project.longDescription} />
        <meta name="twitter:image" content={METADATA.image} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: projectJsonLd }}
        />
      </Head>

      <main id="main-content" className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
        <section className="section-container pt-40 pb-16">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <Link href="/projects" className="project-action-link">
              <span>All projects</span>
            </Link>
            {projectActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-link"
              >
                <span>{action.label}</span>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8">
              <ProjectNumberCarousel projects={featuredProjects} currentIndex={projectIndex} />
              <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
                {project.category}
              </p>
              <h1
                className="project-detail-title font-extralight mb-6"
                style={{ color: "var(--fg-primary)" }}
              >
                <ShuffleText text={project.name} duration={0.52} shuffleTimes={4} textAlign="left" className="block whitespace-nowrap" />
              </h1>
              <p className="text-editorial font-light mb-8 max-w-3xl" style={{ color: "var(--fg-secondary)" }}>
                {project.longDescription}
              </p>
            </div>
            <div className="lg:col-span-4 lg:pt-[5.5rem]">
              <ProjectMediaPreview project={project} variant="mobile" priority />
            </div>
          </div>
        </section>

        <section className="section-container-wide pb-20">
          <ProjectMediaPreview project={project} variant="desktop" priority />
        </section>

        <section className="section-container pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-4">
              <div className="sticky top-32">
                <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
                  Tools used
                </p>
                <div className="space-y-3">
                  {project.toolsUsed.map((tool) => (
                    <p key={tool} className="text-body-md" style={{ color: "var(--fg-primary)" }}>
                      {tool}
                    </p>
                  ))}
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <DetailBlock label="Concept" title="Product idea">
                {project.concept}
              </DetailBlock>
              <DetailBlock label="Problem" title="What it solves">
                {project.problem}
              </DetailBlock>
              <DetailBlock label="Solution" title="How it works">
                {project.solution}
              </DetailBlock>
              <DetailBlock label="Developer notes" title="My read on it">
                {project.developerNotes || project.notes}
              </DetailBlock>
            </div>
          </div>
        </section>

        <section className="section-container py-16" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="grid grid-cols-2 gap-8">
            {prevProject ? (
              <Link href={`/projects/${prevProject.slug}`} className="project-nav-link group is-prev items-center gap-5">
                <span className="project-nav-caret" aria-hidden="true">
                  ‹
                </span>
                <span>
                  <span className="text-micro block mb-2 opacity-60">Previous</span>
                  <span className="text-body-xl font-light transition-transform duration-300 inline-block">
                    {prevProject.name}
                  </span>
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link href={`/projects/${nextProject.slug}`} className="project-nav-link group is-next items-center justify-end gap-5 text-right">
                <span>
                  <span className="text-micro block mb-2 opacity-60">Next</span>
                  <span className="text-body-xl font-light transition-transform duration-300 inline-block">
                    {nextProject.name}
                  </span>
                </span>
                <span className="project-nav-caret" aria-hidden="true">
                  ›
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
