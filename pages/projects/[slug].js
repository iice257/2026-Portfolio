import Link from "next/link";
import Head from "next/head";
import { featuredProjects } from "../../data/projects";
import { METADATA } from "../../constants";
import Footer from "@/components/Footer/Footer";
import ProjectVisual from "@/components/Projects/ProjectVisual";

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

export default function ProjectDetail({ project, projectIndex, prevProject, nextProject }) {
  if (!project) return null;

  const canonicalUrl = `${METADATA.siteUrl.replace(/\/$/, "")}/projects/${project.slug}`;
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
          <Link
            href="/projects"
            className="project-action-link mb-8"
          >
            <span>All projects</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <span
                className="text-display-2xl font-thin block mb-4"
                style={{ color: "var(--fg-primary)", opacity: 0.1 }}
              >
                {String(projectIndex + 1).padStart(2, "0")}
              </span>
              <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
                {project.category}
              </p>
              <h1 className="text-giant font-extralight mb-6" style={{ color: "var(--fg-primary)" }}>
                {project.name}
              </h1>
              <p className="text-editorial font-light mb-8 max-w-3xl" style={{ color: "var(--fg-secondary)" }}>
                {project.longDescription}
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="border p-6" style={{ borderColor: "var(--border)" }}>
                <p className="text-micro mb-3" style={{ color: "var(--fg-muted)" }}>
                  Current status
                </p>
                <p className="text-body-lg mb-6" style={{ color: "var(--fg-primary)" }}>
                  {project.currentStatus}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-container-wide pb-20">
          <div className="relative aspect-[16/9] overflow-hidden outline outline-1 outline-[var(--border)]">
            <ProjectVisual project={project} priority />
          </div>
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
                <div className="mt-8 flex flex-col items-start gap-3">
                  {project.url !== "#" && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-link"
                    >
                      <span>View on GitHub</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-link"
                    >
                      <span>View website</span>
                    </a>
                  )}
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
              <DetailBlock label="Notes" title="Why it is featured">
                {project.notes}
              </DetailBlock>
            </div>
          </div>
        </section>

        <section className="section-container py-16" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex justify-between items-center gap-8">
            {prevProject ? (
              <Link href={`/projects/${prevProject.slug}`} className="group">
                <span className="text-micro block mb-2" style={{ color: "var(--fg-muted)" }}>
                  Previous
                </span>
                <span
                  className="text-body-xl font-light group-hover:translate-x-[-8px] transition-transform duration-300 inline-block"
                  style={{ color: "var(--fg-primary)" }}
                >
                  {prevProject.name}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link href={`/projects/${nextProject.slug}`} className="group text-right">
                <span className="text-micro block mb-2" style={{ color: "var(--fg-muted)" }}>
                  Next
                </span>
                <span
                  className="text-body-xl font-light group-hover:translate-x-2 transition-transform duration-300 inline-block"
                  style={{ color: "var(--fg-primary)" }}
                >
                  {nextProject.name}
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
