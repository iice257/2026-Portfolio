import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { PROJECTS, METADATA } from "../../constants";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export async function getStaticPaths() {
  const paths = PROJECTS.map((project) => ({
    params: { slug: project.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  const projectIndex = PROJECTS.findIndex((p) => p.slug === params.slug);

  return {
    props: {
      project,
      projectIndex,
      prevProject: projectIndex > 0 ? PROJECTS[projectIndex - 1] : null,
      nextProject: projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : null,
    },
  };
}

export default function ProjectDetail({ project, projectIndex, prevProject, nextProject }) {
  if (!project) return null;

  return (
    <>
      <Head>
        <title>{project.name} | {METADATA.author}</title>
        <meta name="description" content={project.longDescription} />
      </Head>

      <Header />

      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Hero Section */}
        <section className="section-container pt-40 pb-16">
          <Link
            href="/projects"
            className="text-micro mb-8 inline-block link-underline"
            style={{ color: 'var(--fg-muted)' }}
          >
            ← ALL PROJECTS
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <span
                className="text-display-2xl font-thin block mb-4"
                style={{ color: 'var(--fg-primary)', opacity: 0.1 }}
              >
                {String(projectIndex + 1).padStart(2, '0')}
              </span>
              <h1
                className="text-giant font-extralight mb-6"
                style={{ color: 'var(--fg-primary)' }}
              >
                {project.name}
              </h1>
              <p
                className="text-editorial font-light mb-8"
                style={{ color: 'var(--fg-secondary)' }}
              >
                {project.longDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Project Image */}
        <section className="section-container-wide pb-20">
          <div
            className="relative aspect-video overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        </section>

        {/* Content Sections */}
        <section className="section-container pb-24">
          <div className="max-w-3xl">
            {/* Building Process */}
            <article className="mb-16">
              <h2
                className="text-display-sm font-light mb-6 pb-4"
                style={{ color: 'var(--fg-primary)', borderBottom: '1px solid var(--border)' }}
              >
                Building Process
              </h2>
              <p
                className="text-editorial font-light leading-relaxed"
                style={{ color: 'var(--fg-secondary)' }}
              >
                {project.buildingProcess}
              </p>
            </article>

            {/* Problems & Solutions */}
            <article className="mb-16">
              <h2
                className="text-display-sm font-light mb-6 pb-4"
                style={{ color: 'var(--fg-primary)', borderBottom: '1px solid var(--border)' }}
              >
                Problems & Solutions
              </h2>
              <p
                className="text-editorial font-light leading-relaxed"
                style={{ color: 'var(--fg-secondary)' }}
              >
                {project.problemsAndSolutions}
              </p>
            </article>

            {/* Knowledge Gained */}
            <article className="mb-16">
              <h2
                className="text-display-sm font-light mb-6 pb-4"
                style={{ color: 'var(--fg-primary)', borderBottom: '1px solid var(--border)' }}
              >
                Knowledge Gained
              </h2>
              <p
                className="text-editorial font-light leading-relaxed"
                style={{ color: 'var(--fg-secondary)' }}
              >
                {project.knowledgeGained}
              </p>
            </article>
          </div>
        </section>

        {/* Navigation */}
        <section
          className="section-container py-16"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="flex justify-between items-center">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group"
              >
                <span
                  className="text-micro block mb-2"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  ← PREVIOUS
                </span>
                <span
                  className="text-body-xl font-light group-hover:translate-x-[-8px] transition-transform duration-300 inline-block"
                  style={{ color: 'var(--fg-primary)' }}
                >
                  {prevProject.name}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group text-right"
              >
                <span
                  className="text-micro block mb-2"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  NEXT →
                </span>
                <span
                  className="text-body-xl font-light group-hover:translate-x-2 transition-transform duration-300 inline-block"
                  style={{ color: 'var(--fg-primary)' }}
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
