import { useCallback, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { METADATA } from "../../constants";
import {
  featuredProjects,
  githubProjectCount,
  majorProjectCount,
  majorProjects,
  remainingProjects,
} from "../../data/projects";
import Footer from "@/components/Footer/Footer";
import ProjectVisual from "@/components/Projects/ProjectVisual";
import ShuffleText from "@/components/ReactBits/ShuffleText";
import { useCursor } from "../../context/CursorContext";

const TagList = ({ tags = [] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span key={tag} className="tag">
        {tag}
      </span>
    ))}
  </div>
);

const MockupPair = ({ project }) => (
  <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.7fr] gap-6">
    <div className="mockup-shell aspect-[16/10] p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-micro" style={{ color: "var(--fg-muted)" }}>
          Desktop
        </span>
        <span className="h-2 w-2" style={{ backgroundColor: project.visual?.accent || "var(--fg-primary)" }} />
      </div>
      <div className="grid h-[calc(100%-2.5rem)] grid-cols-12 gap-3">
        <div className="col-span-4 border" style={{ borderColor: "var(--border)" }} />
        <div className="col-span-8 space-y-3">
          <div className="h-8 w-3/4" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.12 }} />
          <div className="h-3 w-full" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.1 }} />
          <div className="h-3 w-4/5" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.1 }} />
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="h-24 border" style={{ borderColor: "var(--border)" }} />
            <div className="h-24 border" style={{ borderColor: "var(--border)" }} />
          </div>
        </div>
      </div>
    </div>

    <div className="mockup-shell mx-auto aspect-[9/16] w-full max-w-[15rem] p-4">
      <div className="mb-4 h-2 w-16 mx-auto" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.12 }} />
      <div className="space-y-3">
        <div className="h-20 border" style={{ borderColor: "var(--border)" }} />
        <div className="h-3 w-full" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.12 }} />
        <div className="h-3 w-2/3" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.12 }} />
        <div className="grid grid-cols-2 gap-2 pt-4">
          <div className="h-16 border" style={{ borderColor: "var(--border)" }} />
          <div className="h-16 border" style={{ borderColor: "var(--border)" }} />
        </div>
      </div>
    </div>
  </div>
);

const flipTransition = {
  duration: 0.58,
  ease: [0.16, 1, 0.3, 1],
};

const ProjectActionLinks = ({ project, className = "" }) => {
  const actions = [
    project.url !== "#" ? { label: "View on GitHub", href: project.url } : null,
    project.liveUrl ? { label: "View website", href: project.liveUrl } : null,
  ].filter(Boolean);

  if (!actions.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="project-action-link"
          onClick={(event) => event.stopPropagation()}
        >
          <span>{action.label}</span>
        </a>
      ))}
    </div>
  );
};

const chunkProjects = (projects, size = 2) => {
  const rows = [];
  for (let index = 0; index < projects.length; index += size) {
    rows.push(projects.slice(index, index + size));
  }
  return rows;
};

const MajorProjectExpandedCard = ({ project, index, onFlip, onHover, onLeave }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onFlip();
    }
  };

  return (
    <motion.article
      key={`${project.slug}-expanded`}
      initial={{ opacity: 0, rotateY: -78, scale: 0.985 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      exit={{ opacity: 0, rotateY: 72, scale: 0.985 }}
      transition={flipTransition}
      role="button"
      tabIndex={0}
      aria-expanded="true"
      aria-label={`Collapse details for ${project.name}`}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover("Click to collapse")}
      onMouseLeave={onLeave}
      className="major-project-expanded cursor-none"
    >
      <div className="grid h-full grid-cols-1 xl:grid-cols-12 gap-8 p-6 md:p-8 lg:p-10">
        <div className="xl:col-span-4 flex flex-col justify-between gap-10">
          <div>
            <span className="text-micro mb-5 block" style={{ color: "var(--fg-muted)" }}>
              {String(index + 5).padStart(2, "0")} / Expanded
            </span>
            <h3 className="text-display-md font-light mb-5 whitespace-nowrap" style={{ color: "var(--fg-primary)" }}>
              <ShuffleText text={project.name} duration={0.45} shuffleTimes={3} textAlign="left" />
            </h3>
            <p className="text-body-lg mb-6" style={{ color: "var(--fg-secondary)" }}>
              {project.description}
            </p>
            <div className="space-y-4 text-body-sm" style={{ color: "var(--fg-muted)" }}>
              <p>{project.notes}</p>
              <p>
                <span style={{ color: "var(--fg-secondary)" }}>Status: </span>
                {project.status}
              </p>
            </div>
          </div>
          <div>
            <TagList tags={project.tech} />
            <ProjectActionLinks project={project} className="mt-4 justify-start" />
          </div>
        </div>
        <div className="xl:col-span-8">
          <MockupPair project={project} />
        </div>
      </div>
    </motion.article>
  );
};

const MajorProjectCard = ({ project, index, onFlip, onHover, onLeave, dimmed }) => {

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onFlip();
    }
  };

  return (
  <motion.article
    layout
    key={`${project.slug}-collapsed`}
    initial={{ opacity: 0, scale: 0.985 }}
    animate={{ opacity: dimmed ? 0.18 : 1, scale: 1 }}
    transition={flipTransition}
    className={`major-project-card group relative outline outline-1 outline-[var(--border)] cursor-none ${dimmed ? "is-dimmed" : ""}`}
    role="button"
    tabIndex={dimmed ? -1 : 0}
    aria-expanded="false"
    aria-label={`Expand details for ${project.name}`}
    onClick={dimmed ? undefined : onFlip}
    onKeyDown={dimmed ? undefined : handleKeyDown}
    onMouseEnter={dimmed ? undefined : () => onHover("Click to expand")}
    onMouseLeave={dimmed ? undefined : onLeave}
  >
    <div className="major-project-visual relative overflow-hidden">
      <ProjectVisual project={project} compact />
    </div>
    <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
      <div>
        <span className="text-micro mb-4 block" style={{ color: "var(--fg-muted)" }}>
          {String(index + 5).padStart(2, "0")} / Major
        </span>
        <h3 className="text-display-sm font-light mb-3 whitespace-nowrap" style={{ color: "var(--fg-primary)" }}>
          <ShuffleText text={project.name} duration={0.45} shuffleTimes={3} textAlign="left" />
        </h3>
        <p className="text-body-md" style={{ color: "var(--fg-secondary)" }}>
          {project.subtitle}
        </p>
      </div>
      <div className="mt-8">
        <TagList tags={project.tech} />
        <ProjectActionLinks project={project} className="mt-4 justify-start" />
      </div>
    </div>
  </motion.article>
  );
};

export default function ProjectsIndex() {
  const [flippedCards, setFlippedCards] = useState({});
  const [openProject, setOpenProject] = useState(remainingProjects[0]?.slug);
  const { setCursorText, setCursorVariant } = useCursor();
  const expandedSlug = Object.keys(flippedCards).find((slug) => flippedCards[slug]);
  const majorProjectRows = chunkProjects(majorProjects);

  const toggleFlip = (slug) => {
    setFlippedCards((current) => {
      const isOpen = Boolean(current[slug]);
      return isOpen ? {} : { [slug]: true };
    });
  };

  const setProjectCursor = useCallback((text) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setCursorText(text);
    setCursorVariant("project");
  }, [setCursorText, setCursorVariant]);

  const clearProjectCursor = useCallback(() => {
    setCursorText("");
    setCursorVariant("default");
  }, [setCursorText, setCursorVariant]);

  return (
    <>
      <Head>
        <title>{`Projects | ${METADATA.author}`}</title>
        <meta
          name="description"
          content="A structured project archive by Kingsley Afolabi Aremu, including featured work, major projects, and the complete GitHub project list."
        />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
        <link rel="canonical" href={`${METADATA.siteUrl.replace(/\/$/, "")}/projects`} />
        <meta property="og:title" content={`Projects | ${METADATA.author}`} />
        <meta property="og:description" content="A structured project archive by Kingsley Afolabi Aremu, including featured work, major projects, and the complete GitHub project list." />
        <meta property="og:url" content={`${METADATA.siteUrl.replace(/\/$/, "")}/projects`} />
        <meta property="og:image" content={METADATA.image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main id="main-content" className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
        <section className="section-container pt-40 pb-24">
          <Link
            href="/"
            className="project-action-link mb-8"
          >
            <span>Back home</span>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-massive font-extralight mb-8 leading-[1.14] pb-[0.18em]" style={{ color: "var(--fg-primary)" }}>
                <ShuffleText text="Projects" duration={0.48} shuffleTimes={3} textAlign="left" />
              </h1>
              <p className="text-editorial font-light max-w-3xl" style={{ color: "var(--fg-secondary)" }}>
                A clearer hierarchy of product work, agent tooling, experiments, and public repositories. The top four are the premium featured projects, followed by six major projects and a complete compact archive.
              </p>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 gap-6">
              <div>
                <span className="text-display-sm font-light block" style={{ color: "var(--fg-primary)" }}>
                  {majorProjectCount}
                </span>
                <span className="text-micro" style={{ color: "var(--fg-muted)" }}>
                  Major projects
                </span>
              </div>
              <div>
                <span className="text-display-sm font-light block" style={{ color: "var(--fg-primary)" }}>
                  {githubProjectCount}
                </span>
                <span className="text-micro" style={{ color: "var(--fg-muted)" }}>
                  GitHub repos covered
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-container pb-32">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
                Featured
              </p>
              <h2 className="text-display-lg font-light" style={{ color: "var(--fg-primary)" }}>
                Premium project pages
              </h2>
            </div>
            <p className="text-body-md max-w-md" style={{ color: "var(--fg-secondary)" }}>
              These four receive the richest treatment and have full writeups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {featuredProjects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group block cursor-none"
                onMouseEnter={() => setProjectCursor("Click for more details")}
                onMouseLeave={clearProjectCursor}
                onClick={clearProjectCursor}
              >
                <article className="relative">
                  <div className="relative aspect-[16/11] overflow-hidden mb-6 outline outline-1 outline-[var(--border)]">
                    <ProjectVisual project={project} priority={index === 0} />
                  </div>
                  <span className="text-micro mb-3 block" style={{ color: "var(--fg-muted)" }}>
                    {String(index + 1).padStart(2, "0")} / Featured
                  </span>
                  <h3
                    className="text-display-md font-light mb-3 whitespace-nowrap group-hover:translate-x-2 transition-transform duration-300"
                    style={{ color: "var(--fg-primary)" }}
                  >
                    <ShuffleText text={project.name} duration={0.45} shuffleTimes={3} textAlign="left" />
                  </h3>
                  <p className="text-body-lg mb-5 max-w-xl" style={{ color: "var(--fg-secondary)" }}>
                    {project.description}
                  </p>
                  <TagList tags={project.tech} />
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-container pb-32">
          <div className="mb-12">
            <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
              Major
            </p>
            <h2 className="text-display-lg font-light mb-4" style={{ color: "var(--fg-primary)" }}>
              Six more substantial builds
            </h2>
            <p className="text-body-lg max-w-2xl" style={{ color: "var(--fg-secondary)" }}>
              These complete the top ten. Tap or click a card to flip it for tools, status, and notes.
            </p>
          </div>

          <div className="space-y-8" style={{ perspective: "1400px" }}>
            {majorProjectRows.map((rowProjects, rowIndex) => {
              const expandedProject = rowProjects.find((project) => project.slug === expandedSlug);

              return (
                <motion.div
                  key={rowProjects.map((project) => project.slug).join("-")}
                  layout
                  className={`major-project-row ${expandedProject ? "is-expanded" : ""}`}
                  transition={flipTransition}
                >
                  {rowProjects.map((project, projectIndex) => {
                    const absoluteIndex = rowIndex * 2 + projectIndex;
                    const isExpandedRow = Boolean(expandedProject);

                    return (
                      <MajorProjectCard
                        key={project.slug}
                        project={project}
                        index={absoluteIndex}
                        dimmed={isExpandedRow}
                        onFlip={() => {
                          toggleFlip(project.slug);
                          setProjectCursor(flippedCards[project.slug] ? "Click to expand" : "Click to collapse");
                        }}
                        onHover={setProjectCursor}
                        onLeave={clearProjectCursor}
                      />
                    );
                  })}

                  <AnimatePresence initial={false}>
                    {expandedProject && (
                      <MajorProjectExpandedCard
                        key={expandedProject.slug}
                        project={expandedProject}
                        index={majorProjects.findIndex((project) => project.slug === expandedProject.slug)}
                        onFlip={() => {
                          toggleFlip(expandedProject.slug);
                          setProjectCursor("Click to expand");
                        }}
                        onHover={setProjectCursor}
                        onLeave={clearProjectCursor}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="section-container pb-32">
          <div className="mb-10">
            <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
              Complete archive
            </p>
            <h2 className="text-display-lg font-light mb-4" style={{ color: "var(--fg-primary)" }}>
              Remaining projects
            </h2>
            <p className="text-body-lg max-w-2xl" style={{ color: "var(--fg-secondary)" }}>
              Everything else is sorted by perceived portfolio relevance first, with sparse forks and reference repos kept lower for completeness.
            </p>
          </div>

          <div className="border-t" style={{ borderColor: "var(--border)" }}>
            {remainingProjects.map((project, index) => {
              const isOpen = openProject === project.slug;

              return (
                <article key={project.slug} className="border-b" style={{ borderColor: "var(--border)" }}>
                  <button
                    type="button"
                    className="w-full py-6 grid grid-cols-1 md:grid-cols-12 gap-4 text-left group cursor-none"
                    onClick={() => {
                      setOpenProject(isOpen ? null : project.slug);
                      setProjectCursor(isOpen ? "Click to expand" : "Click to collapse");
                    }}
                    onMouseEnter={() => setProjectCursor(isOpen ? "Click to collapse" : "Click to expand")}
                    onMouseLeave={clearProjectCursor}
                    aria-expanded={isOpen}
                    aria-controls={`archive-${project.slug}`}
                  >
                    <span className="text-micro md:col-span-2" style={{ color: "var(--fg-muted)" }}>
                      {String(index + 11).padStart(2, "0")}
                    </span>
                    <span className="md:col-span-5 min-w-0 text-body-xl font-light whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: "var(--fg-primary)" }}>
                      <ShuffleText text={project.name} duration={0.4} shuffleTimes={2} textAlign="left" />
                    </span>
                    <span className="md:col-span-4 text-body-md" style={{ color: "var(--fg-secondary)" }}>
                      {project.status}
                    </span>
                    <span
                      className={`md:col-span-1 text-right text-body-xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      style={{ color: "var(--fg-primary)" }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`archive-${project.slug}`}
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 cursor-none"
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setOpenProject(null);
                            setProjectCursor("Click to expand");
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setOpenProject(null);
                              setProjectCursor("Click to expand");
                            }
                          }}
                          onMouseEnter={() => setProjectCursor("Click to collapse")}
                          onMouseLeave={clearProjectCursor}
                        >
                          <div className="hidden md:block md:col-span-2" />
                          <div className="md:col-span-10 max-w-4xl">
                            <p className="text-body-lg mb-5 leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
                              {project.description}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <TagList tags={project.tech} />
                              <ProjectActionLinks project={project} />
                            </div>
                            <div className="mt-5 text-body-sm" style={{ color: "var(--fg-muted)" }}>
                              <p>{project.notes}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
