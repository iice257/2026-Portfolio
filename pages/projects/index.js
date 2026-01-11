import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { PROJECTS, METADATA } from "../../constants";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function ProjectsIndex() {
  return (
    <>
      <Head>
        <title>Projects | {METADATA.author}</title>
        <meta name="description" content="Selected projects by Kingsley Afolabi Aremu - Full-Stack Developer" />
      </Head>

      <Header />

      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Hero */}
        <section className="section-container pt-40 pb-20">
          <Link
            href="/#projects"
            className="text-micro mb-8 inline-block link-underline"
            style={{ color: 'var(--fg-muted)' }}
          >
            ← BACK HOME
          </Link>
          <h1
            className="text-massive font-extralight mb-8"
            style={{ color: 'var(--fg-primary)' }}
          >
            Projects
          </h1>
          <p
            className="text-editorial font-light max-w-2xl"
            style={{ color: 'var(--fg-secondary)' }}
          >
            A collection of selected work — products I&apos;ve built to solve real problems
            and explore new technologies.
          </p>
        </section>

        {/* Projects Grid */}
        <section className="section-container pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {PROJECTS.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <article className="relative">
                  {/* Image */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden mb-6"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Number */}
                  <span
                    className="text-micro mb-3 block"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h2
                    className="text-display-sm font-light mb-2 group-hover:translate-x-2 transition-transform duration-300"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {project.name}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-body-md mb-4"
                    style={{ color: 'var(--fg-secondary)' }}
                  >
                    {project.description}
                  </p>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
