import { useCallback, useEffect, useRef, useState } from "react";
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
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState(null);
  const previewProject = hoveredProjectIndex !== null ? projects[hoveredProjectIndex] : currentProject;
  const otherProjects = projects
    .map((item, itemIndex) => ({ item, itemIndex }))
    .filter(({ itemIndex }) => itemIndex !== currentIndex);

  return (
    <div
      className="project-number-carousel mb-4"
      tabIndex={0}
      aria-label={`Project ${String(currentIndex + 1).padStart(2, "0")}: ${currentProject.name}`}
      onMouseLeave={() => setHoveredProjectIndex(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHoveredProjectIndex(null);
        }
      }}
    >
      <div className="project-number-current-stack">
        <span className="project-number-current text-display-2xl" aria-hidden="true">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="project-number-category" aria-live="polite">
          <span key={previewProject.slug} className="project-number-category-text">
            {previewProject.category}
          </span>
        </span>
      </div>

      <div className="project-number-track" aria-label="Other featured projects">
        {otherProjects.map(({ item, itemIndex }) => (
          <Link
            key={item.slug}
            href={`/projects/${item.slug}`}
            className="project-number-item"
            onMouseEnter={() => setHoveredProjectIndex(itemIndex)}
            onFocus={() => setHoveredProjectIndex(itemIndex)}
          >
            {String(itemIndex + 1).padStart(2, "0")}
          </Link>
        ))}
      </div>
    </div>
  );
};

const PROJECT_TITLE_SIZES = {
  "formmate-ai": "clamp(6.6rem, 18.5cqw, 12rem)",
  pastevault: "clamp(7.1rem, 20cqw, 13rem)",
  "ai-agent-skills": "clamp(5.9rem, 16.5cqw, 10.8rem)",
  "restore-ai": "clamp(7.2rem, 20.5cqw, 13.2rem)",
};

const ProjectMediaPreview = ({ project, variant = "desktop", priority = false }) => {
  const videoRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMonochrome, setIsMonochrome] = useState(true);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const videoSrc = variant === "desktop" ? project.desktopVideo : project.mobileVideo;
  const isMobile = variant === "mobile";

  const showControls = useCallback(() => {
    if (!videoSrc) return;

    window.clearTimeout(controlsTimerRef.current);
    setAreControlsVisible(true);
    controlsTimerRef.current = window.setTimeout(() => {
      setAreControlsVisible(false);
    }, 2200);
  }, [videoSrc]);

  useEffect(() => {
    showControls();

    return () => {
      window.clearTimeout(controlsTimerRef.current);
    };
  }, [showControls]);

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
    <div
      className={`project-media-preview ${isMobile ? "is-mobile" : "is-desktop"}`}
      onMouseMove={showControls}
      onMouseEnter={showControls}
      onPointerDown={showControls}
      onFocus={showControls}
    >
      <div className={`project-media-frame ${isMonochrome ? "is-monochrome" : ""}`}>
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
          <div className={`project-media-controls ${areControlsVisible ? "is-visible" : ""}`}>
            <button
              type="button"
              className="project-media-playback"
              onClick={togglePlayback}
              aria-label={`${isPaused ? "Play" : "Pause"} ${project.name} preview`}
            >
              <span className={`project-media-playback-icon ${isPaused ? "is-play" : "is-pause"}`} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`project-media-control ${isMonochrome ? "is-active" : ""}`}
              onClick={() => setIsMonochrome((value) => !value)}
              aria-pressed={isMonochrome}
              aria-label={`${isMonochrome ? "Disable" : "Enable"} black and white filter for ${project.name} preview`}
            >
              <span>{isMonochrome ? "Turn B/W Off" : "Turn B/W On"}</span>
            </button>
          </div>
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
        <section className="section-container pt-32 pb-12">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <Link href="/projects" className="project-action-link">
              <span>All projects</span>
            </Link>
            <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
            <div className="project-detail-copy lg:col-span-8 lg:self-end">
              <ProjectNumberCarousel projects={featuredProjects} currentIndex={projectIndex} />
              <h1
                className="project-detail-title font-extralight mb-5"
                style={{
                  color: "var(--fg-primary)",
                  "--project-title-size": PROJECT_TITLE_SIZES[project.slug],
                }}
              >
                <ShuffleText text={project.name} duration={0.52} shuffleTimes={4} textAlign="left" className="block whitespace-nowrap" />
              </h1>
              <p className="text-editorial font-light max-w-3xl" style={{ color: "var(--fg-secondary)" }}>
                {project.longDescription}
              </p>
            </div>
            <div className="lg:col-span-4">
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
              <Link href={`/projects/${prevProject.slug}`} className="project-nav-link group is-prev justify-self-start items-center gap-4">
                <span className="project-nav-caret" aria-hidden="true">
                  &lsaquo;
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
              <Link href={`/projects/${nextProject.slug}`} className="project-nav-link group is-next justify-self-end items-center justify-end gap-4 text-right">
                <span>
                  <span className="text-micro block mb-2 opacity-60">Next</span>
                  <span className="text-body-xl font-light transition-transform duration-300 inline-block">
                    {nextProject.name}
                  </span>
                </span>
                <span className="project-nav-caret" aria-hidden="true">
                  &rsaquo;
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
