import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
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

const TagList = ({ tags = [] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span key={tag} className="tag">
        {tag}
      </span>
    ))}
  </div>
);

const MajorProjectCard = ({ project, index, flipped, onFlip }) => (
  <article
    className="group relative min-h-[31rem] outline outline-1 outline-[var(--border)]"
    style={{ perspective: "1200px" }}
  >
    <button
      type="button"
      onClick={onFlip}
      className="absolute inset-0 w-full text-left"
      aria-pressed={flipped}
      aria-label={`${flipped ? "Hide" : "Show"} details for ${project.name}`}
    >
      <div
        className="relative h-full w-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 flex flex-col"
          style={{ backfaceVisibility: "hidden", backgroundColor: "var(--bg-primary)" }}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <ProjectVisual project={project} compact />
          </div>
          <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
            <div>
              <span className="text-micro mb-4 block" style={{ color: "var(--fg-muted)" }}>
                {String(index + 5).padStart(2, "0")} / Major
              </span>
              <h3 className="text-display-sm font-light mb-3" style={{ color: "var(--fg-primary)" }}>
                {project.name}
              </h3>
              <p className="text-body-md" style={{ color: "var(--fg-secondary)" }}>
                {project.subtitle}
              </p>
            </div>
            <TagList tags={project.tech} />
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col justify-between p-6 md:p-8"
          style={{
            backfaceVisibility: "hidden",
            backgroundColor: "var(--fg-primary)",
            color: "var(--bg-primary)",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            <span className="text-micro mb-5 block opacity-60">Details</span>
            <h3 className="text-display-sm font-light mb-5">{project.name}</h3>
            <p className="text-body-md leading-relaxed mb-6 opacity-80">{project.description}</p>
            <div className="space-y-4 text-body-sm">
              <p>
                <span className="opacity-50">Tools: </span>
                {project.tech.join(", ")}
              </p>
              <p>
                <span className="opacity-50">Status: </span>
                {project.status}
              </p>
              <p className="opacity-80">{project.notes}</p>
            </div>
          </div>
          <span className="text-micro opacity-60">Tap to flip back</span>
        </div>
      </div>
    </button>

    {project.url !== "#" && (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 right-6 z-10 text-micro link-underline"
        style={{ color: flipped ? "var(--bg-primary)" : "var(--fg-primary)" }}
        onClick={(event) => event.stopPropagation()}
      >
        Repo
      </a>
    )}
  </article>
);

export default function ProjectsIndex() {
  const [flippedCards, setFlippedCards] = useState({});
  const [openProject, setOpenProject] = useState(remainingProjects[0]?.slug);

  const toggleFlip = (slug) => {
    setFlippedCards((current) => ({ ...current, [slug]: !current[slug] }));
  };

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
            href="/#projects"
            className="text-micro mb-8 inline-block link-underline"
            style={{ color: "var(--fg-muted)" }}
          >
            Back home
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-massive font-extralight mb-8" style={{ color: "var(--fg-primary)" }}>
                Projects
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
              <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
                <article className="relative">
                  <div className="relative aspect-[16/11] overflow-hidden mb-6 outline outline-1 outline-[var(--border)]">
                    <ProjectVisual project={project} priority={index === 0} />
                  </div>
                  <span className="text-micro mb-3 block" style={{ color: "var(--fg-muted)" }}>
                    {String(index + 1).padStart(2, "0")} / Featured
                  </span>
                  <h3
                    className="text-display-md font-light mb-3 group-hover:translate-x-2 transition-transform duration-300"
                    style={{ color: "var(--fg-primary)" }}
                  >
                    {project.name}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {majorProjects.map((project, index) => (
              <MajorProjectCard
                key={project.slug}
                project={project}
                index={index}
                flipped={Boolean(flippedCards[project.slug])}
                onFlip={() => toggleFlip(project.slug)}
              />
            ))}
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
                    className="w-full py-6 grid grid-cols-1 md:grid-cols-12 gap-4 text-left group"
                    onClick={() => setOpenProject(isOpen ? null : project.slug)}
                    aria-expanded={isOpen}
                    aria-controls={`archive-${project.slug}`}
                  >
                    <span className="text-micro md:col-span-2" style={{ color: "var(--fg-muted)" }}>
                      {String(index + 11).padStart(2, "0")}
                    </span>
                    <span className="md:col-span-5 text-body-xl font-light" style={{ color: "var(--fg-primary)" }}>
                      {project.name}
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

                  {isOpen && (
                    <div id={`archive-${project.slug}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8">
                      <div className="hidden md:block md:col-span-2" />
                      <div className="md:col-span-10 max-w-4xl">
                        <p className="text-body-lg mb-5 leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
                          {project.description}
                        </p>
                        <TagList tags={project.tech} />
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm" style={{ color: "var(--fg-muted)" }}>
                          <p>{project.notes}</p>
                          {project.url !== "#" && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="link-underline md:text-right">
                              Open GitHub repo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
