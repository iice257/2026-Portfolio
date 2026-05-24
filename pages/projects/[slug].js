import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { featuredProjects } from "../../data/projects";
import { METADATA } from "../../constants";
import Footer from "@/components/Footer/Footer";
import ProjectVisual from "@/components/Projects/ProjectVisual";
import ShuffleText from "@/components/ReactBits/ShuffleText";
import { useCursor } from "../../context/CursorContext";

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
  const otherProjects = projects
    .map((item, itemIndex) => ({ item, itemIndex }))
    .filter(({ itemIndex }) => itemIndex !== currentIndex);

  return (
    <div
      className="project-number-carousel mb-4"
      tabIndex={0}
      aria-label={`Project ${String(currentIndex + 1).padStart(2, "0")}: ${currentProject.name}`}
    >
      <div className="project-number-current-stack">
        <span className="project-number-current text-display-2xl" aria-hidden="true">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="project-number-track" aria-label="Other featured projects">
        {otherProjects.map(({ item, itemIndex }) => (
          <Link
            key={item.slug}
            href={`/projects/${item.slug}`}
            className="project-number-item"
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

const IconLoop = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 2.8 21 6.8l-4 4" />
    <path d="M3 11V9.8a3 3 0 0 1 3-3h15" />
    <path d="M7 21.2l-4-4 4-4" />
    <path d="M21 13v1.2a3 3 0 0 1-3 3H3" />
  </svg>
);

const IconFullscreen = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
  </svg>
);

const ProjectMediaPreview = ({ project, variant = "desktop", priority = false, onOpen, onHover, onLeave }) => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMonochrome, setIsMonochrome] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [activeControl, setActiveControl] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoSrc = variant === "desktop" ? project.desktopVideo : project.mobileVideo;
  const isMobile = variant === "mobile";

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      setPrefersReducedMotion(motionQuery.matches);
      if (motionQuery.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPaused(true);
      }
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => motionQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.loop = isLooping;
  }, [isLooping]);

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

  const toggleLoop = () => {
    const video = videoRef.current;
    if (!video) return;

    setIsLooping((current) => {
      const next = !current;
      video.loop = next;
      video.currentTime = 0;
      if (!isPaused && !prefersReducedMotion) {
        video.play().catch(() => setIsPaused(true));
      }
      return next;
    });
  };

  const openFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    const fullscreenTarget = video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen;
    fullscreenTarget?.call(video)?.catch?.(() => {});
  };

  const openPreview = () => {
    onOpen?.(variant);
  };

  return (
    <div
      className={`project-media-preview ${isMobile ? "is-mobile" : "is-desktop"}`}
      onMouseEnter={() => {
        onHover?.("Click to open");
      }}
      onMouseLeave={onLeave}
    >
      <div
        className={`project-media-frame ${isMonochrome ? "is-monochrome" : ""}`}
        role="button"
        tabIndex={0}
        data-cursor-label="Click to open"
        data-cursor-variant="project"
        onClick={openPreview}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPreview();
          }
        }}
        aria-label={`Open ${isMobile ? "mobile" : "desktop"} preview for ${project.name}`}
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={videoSrc}
            autoPlay={!prefersReducedMotion}
            muted
            loop={isLooping}
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

        <span className="mockup-expand-icon" aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
            <path d="M3 3l6 6M21 3l-6 6M21 21l-6-6M3 21l6-6" />
          </svg>
        </span>

        {videoSrc && (
          <div
            className={`project-media-controls active-${activeControl || "play"}`}
            onClick={(event) => event.stopPropagation()}
            onMouseLeave={() => setActiveControl(null)}
          >
            <button
              type="button"
              className="project-media-controls-label"
              onClick={(event) => event.stopPropagation()}
              aria-label={`${project.name} video controls`}
            >
              <span>Video controls</span>
            </button>
            <button
              type="button"
              className={`project-media-control-button is-loop ${isLooping ? "is-active" : ""}`}
              onClick={toggleLoop}
              onMouseEnter={() => setActiveControl("loop")}
              onFocus={() => setActiveControl("loop")}
              aria-label={`${isLooping ? "Disable" : "Enable"} looping for ${project.name} preview`}
              aria-pressed={isLooping}
            >
              <IconLoop />
            </button>
            <button
              type="button"
              className={`project-media-control-button is-playback ${isPaused ? "is-paused" : "is-playing"}`}
              onClick={togglePlayback}
              onMouseEnter={() => setActiveControl("play")}
              onFocus={() => setActiveControl("play")}
              aria-label={`${isPaused ? "Play" : "Pause"} ${project.name} preview`}
              aria-pressed={!isPaused}
            >
              <span className={`project-media-playback-icon ${isPaused ? "is-play" : "is-pause"}`} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="project-media-control-button is-fullscreen"
              onClick={openFullscreen}
              onMouseEnter={() => setActiveControl("fullscreen")}
              onFocus={() => setActiveControl("fullscreen")}
              aria-label={`Open ${project.name} preview fullscreen`}
            >
              <IconFullscreen />
            </button>
            <button
              type="button"
              className={`project-media-control-button is-bw ${isMonochrome ? "is-monochrome" : "is-color"}`}
              onClick={() => setIsMonochrome((value) => !value)}
              onMouseEnter={() => setActiveControl("bw")}
              onFocus={() => setActiveControl("bw")}
              aria-pressed={isMonochrome}
              aria-label={`${isMonochrome ? "Disable" : "Enable"} black and white filter for ${project.name} preview`}
            >
              <span className={`project-media-bw-icon ${isMonochrome ? "is-monochrome" : "is-color"}`} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const lightboxStripTransition = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1],
};

const lightboxStripVariants = {
  enter: (direction) => ({
    x: direction >= 0 ? "100%" : "-100%",
    opacity: 0.74,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction >= 0 ? "-100%" : "100%",
    opacity: 0.74,
  }),
};

const lightboxPanelVariants = {
  enter: (direction) => (
    direction === 0
      ? { y: 24, scale: 0.98, opacity: 0 }
      : { x: direction >= 0 ? "11%" : "-11%", y: 0, scale: 0.985, opacity: 0.76 }
  ),
  center: {
    x: "0%",
    y: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction) => (
    direction === 0
      ? { y: 18, scale: 0.98, opacity: 0 }
      : { x: direction >= 0 ? "-11%" : "11%", y: 0, scale: 0.985, opacity: 0.76 }
  ),
};

const ProjectMediaLightbox = ({ project, variant, direction = 0, onClose, onNavigate }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate(1);
      if (event.key === "ArrowLeft") onNavigate(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate]);

  const videoSrc = variant === "desktop" ? project.desktopVideo : project.mobileVideo;
  const isMobile = variant === "mobile";
  const previewKey = `${project.slug}-${variant}`;

  const openFullscreen = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const fullscreenTarget = video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen;
    fullscreenTarget?.call(video)?.catch?.(() => {});
  };

  return (
    <motion.div
      className="mockup-lightbox"
      data-cursor-label="Click to close"
      data-cursor-variant="project"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} ${isMobile ? "mobile" : "desktop"} preview`}
    >
      <button type="button" className="mockup-lightbox-nav is-prev" onClick={(event) => { event.stopPropagation(); onNavigate(-1); }} aria-label="Previous mockup">
        <span aria-hidden="true">&lsaquo;</span>
      </button>
      <AnimatePresence custom={direction}>
      <motion.div
        key={`panel-${previewKey}`}
        className={`mockup-lightbox-panel ${isMobile ? "is-mobile" : "is-desktop"}`}
        custom={direction}
        variants={lightboxPanelVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={lightboxStripTransition}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mockup-lightbox-header">
          <div>
            <p className="text-micro" style={{ color: "var(--fg-muted)" }}>{isMobile ? "Mobile" : "Desktop"}</p>
            <h3 className="text-body-xl font-light" style={{ color: "var(--fg-primary)" }}>{project.name}</h3>
          </div>
          <div className="mockup-lightbox-header-actions">
            {videoSrc && (
              <button type="button" className="mockup-lightbox-fullscreen" onClick={openFullscreen} aria-label="Open mockup video fullscreen">
                <IconFullscreen />
              </button>
            )}
            <button type="button" className="mockup-lightbox-close" onClick={onClose} aria-label="Close mockup preview">
              &times;
            </button>
          </div>
        </div>
        <div
          className="mockup-lightbox-stage"
          data-cursor-label="Click to close"
          data-cursor-variant="project"
          onClick={onClose}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onClose();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close mockup preview"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={previewKey}
              className="mockup-lightbox-strip-item"
              custom={direction}
              variants={lightboxStripVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={lightboxStripTransition}
            >
              {videoSrc ? (
                <video ref={videoRef} src={videoSrc} autoPlay muted loop playsInline controls className="h-full w-full object-cover" />
              ) : (
                <ProjectVisual project={project} priority compact={isMobile} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      </AnimatePresence>
      <button type="button" className="mockup-lightbox-nav is-next" onClick={(event) => { event.stopPropagation(); onNavigate(1); }} aria-label="Next mockup">
        <span aria-hidden="true">&rsaquo;</span>
      </button>
    </motion.div>
  );
};

export default function ProjectDetail({ project, projectIndex, prevProject, nextProject }) {
  const [activePreview, setActivePreview] = useState(null);
  const [previewDirection, setPreviewDirection] = useState(0);
  const { setCursorText, setCursorVariant, requestCursorRefresh } = useCursor();

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

  const setProjectCursor = (text) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setCursorText(text);
    setCursorVariant("project");
  };

  const clearProjectCursor = () => {
    setCursorText("");
    setCursorVariant("default");
  };

  const navigatePreview = (direction) => {
    setPreviewDirection(direction);
    setActivePreview((current) => {
      const currentIndex = current === "mobile" ? 0 : 1;
      return ["mobile", "desktop"][(currentIndex + direction + 2) % 2];
    });
    window.setTimeout(requestCursorRefresh, 0);
  };

  const openPreview = (variant) => {
    setPreviewDirection(0);
    setActivePreview(variant);
    window.setTimeout(requestCursorRefresh, 0);
  };

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
              <ProjectMediaPreview project={project} variant="mobile" priority onOpen={openPreview} onHover={setProjectCursor} onLeave={clearProjectCursor} />
            </div>
          </div>
        </section>

        <section className="section-container-wide pb-20">
          <ProjectMediaPreview project={project} variant="desktop" priority onOpen={openPreview} onHover={setProjectCursor} onLeave={clearProjectCursor} />
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

      <AnimatePresence
        onExitComplete={() => {
          clearProjectCursor();
          window.dispatchEvent(new CustomEvent("portfolio:cursor-clear"));
          requestCursorRefresh();
          window.setTimeout(requestCursorRefresh, 80);
        }}
      >
        {activePreview && (
          <ProjectMediaLightbox
            project={project}
            variant={activePreview}
            direction={previewDirection}
            onClose={() => {
              setActivePreview(null);
              clearProjectCursor();
              window.dispatchEvent(new CustomEvent("portfolio:cursor-clear"));
              window.setTimeout(requestCursorRefresh, 0);
            }}
            onNavigate={navigatePreview}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
