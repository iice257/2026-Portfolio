import { useEffect, useRef } from "react";
import { MENULINKS, PROJECTS } from "../../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

const Projects = ({ isDesktop }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const projects = sectionRef.current.querySelectorAll(".project-card");

      projects.forEach((project, i) => {
        const image = project.querySelector(".project-image");
        const content = project.querySelector(".project-content");

        // Parallax on image
        gsap.fromTo(
          image,
          { scale: 1.1 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );

        // Content reveal
        gsap.fromTo(
          content.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: project,
              start: "top 70%",
              end: "top 30%",
              scrub: 0.5,
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[2].ref}
      className="section-spacing"
    >
      <div className="section-container">
        {/* Section header */}
        <div className="mb-20 max-w-3xl">
          <p
            className="text-caption uppercase tracking-widest mb-4"
            style={{ color: 'var(--fg-muted)' }}
          >
            Selected Work
          </p>
          <h2
            className="text-display-md font-light"
            style={{ color: 'var(--fg-primary)' }}
          >
            Projects I&apos;ve built with care
          </h2>
        </div>
      </div>

      {/* Projects list */}
      <div className="space-y-32">
        {PROJECTS.map((project, index) => (
          <article
            key={project.name}
            className="project-card"
          >
            {/* Image container */}
            <div className="relative overflow-hidden aspect-[16/9] mb-8">
              <div className="project-image absolute inset-0">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Content */}
            <div className="section-container">
              <div className="project-content max-w-3xl">
                <span
                  className="text-caption uppercase tracking-widest mb-2 block"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  0{index + 1}
                </span>
                <h3
                  className="text-display-sm font-light mb-4"
                  style={{ color: 'var(--fg-primary)' }}
                >
                  {project.name}
                </h3>
                <p
                  className="text-body-lg mb-6"
                  style={{ color: 'var(--fg-secondary)' }}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="tag"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
