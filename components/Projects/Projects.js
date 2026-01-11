import { useEffect, useRef } from "react";
import { MENULINKS, PROJECTS } from "../../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

const Projects = ({ isDesktop }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const projects = sectionRef.current.querySelectorAll(".project-item");

      projects.forEach((project, i) => {
        const image = project.querySelector(".project-image-wrapper");
        const title = project.querySelector(".project-title");
        const meta = project.querySelector(".project-meta");
        const desc = project.querySelector(".project-desc");

        // Pin project on scroll for dramatic reveal
        if (isDesktop) {
          ScrollTrigger.create({
            trigger: project,
            start: "top 20%",
            end: "bottom 80%",
            pin: false,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;

              // Parallax on image
              if (image) {
                gsap.set(image, {
                  y: progress * -100,
                  scale: 1 + (progress * 0.05),
                });
              }
            }
          });
        }

        // Title reveal with masking effect
        gsap.fromTo(
          title,
          {
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
            x: -50
          },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            x: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 70%",
              end: "top 30%",
              scrub: 0.5,
            }
          }
        );

        // Meta and description fade in
        gsap.fromTo(
          [meta, desc],
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: project,
              start: "top 60%",
              toggleActions: "play none none reverse",
            }
          }
        );

        // Image scale on scroll
        gsap.fromTo(
          image,
          { scale: 1.15 },
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
      });
    });

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[2].ref}
      className="section-spacing"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Section header - oversized */}
      <div className="section-container mb-section">
        <div className="max-w-4xl">
          <p
            className="text-micro mb-6"
            style={{ color: 'var(--fg-muted)' }}
          >
            SELECTED WORK
          </p>
          <h2
            className="text-massive font-extralight"
            style={{ color: 'var(--fg-primary)' }}
          >
            Projects
          </h2>
        </div>
      </div>

      {/* Projects - asymmetric gallery layout */}
      <div className="space-y-32 md:space-y-48">
        {PROJECTS.map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <article
              key={project.name}
              className="project-item relative"
            >
              {/* Asymmetric layout - alternating sides */}
              <div className={`grid grid-cols-1 ${isEven ? 'md:grid-cols-12' : 'md:grid-cols-12'} gap-12 md:gap-16 items-center`}>

                {/* Image - offset and layered */}
                <div
                  className={`
                    ${isEven ? 'md:col-span-7' : 'md:col-span-7 md:col-start-6'}
                    relative overflow-hidden
                    ${isEven ? 'md:offset-right' : 'md:offset-left'}
                  `}
                >
                  <div
                    className="project-image-wrapper relative aspect-[4/5] overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority={index === 0}
                    />
                  </div>

                  {/* Decorative border offset */}
                  <div
                    className="absolute -inset-4 border -z-10 hidden md:block"
                    style={{
                      borderColor: 'var(--border)',
                      transform: isEven ? 'translate(2rem, 2rem)' : 'translate(-2rem, 2rem)'
                    }}
                  />
                </div>

                {/* Content */}
                <div
                  className={`
                    ${isEven ? 'md:col-span-5' : 'md:col-span-5 md:col-start-1 md:row-start-1'}
                    space-y-6
                  `}
                >
                  {/* Project number - oversized */}
                  <div
                    className="project-meta text-huge font-thin opacity-10"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Title - large and bold */}
                  <h3
                    className="project-title text-display-lg font-light overflow-hidden"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="project-desc text-editorial font-light max-w-md"
                    style={{ color: 'var(--fg-secondary)' }}
                  >
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="tag"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* View project link */}
                  {project.url !== '#' && (
                    <div className="pt-4">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-body-sm font-medium"
                        style={{ color: 'var(--fg-primary)' }}
                      >
                        VIEW PROJECT
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
