import { useEffect, useRef } from "react";
import { MENULINKS, PROJECTS } from "../../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

const Projects = ({ isDesktop }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title animation
      gsap.fromTo(
        titleRef.current,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 0.5,
          }
        }
      );

      const projects = sectionRef.current.querySelectorAll(".project-item");

      projects.forEach((project, i) => {
        const image = project.querySelector(".project-image-wrapper");
        const imageInner = project.querySelector(".project-image-inner");
        const content = project.querySelector(".project-content");
        const number = project.querySelector(".project-number");

        // Image reveal - slide in
        gsap.fromTo(
          image,
          {
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
          },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: project,
              start: "top 75%",
              end: "top 35%",
              scrub: 0.5,
            }
          }
        );

        // Image parallax zoom
        gsap.fromTo(
          imageInner,
          { scale: 1.2 },
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

        // Number reveal
        gsap.fromTo(
          number,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 0.1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 70%",
              toggleActions: "play none none reverse",
            }
          }
        );

        // Content stagger reveal
        const contentItems = content.querySelectorAll(".project-content-item");
        gsap.fromTo(
          contentItems,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
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
      });
    });

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[2].ref}
      className="section-spacing-lg"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Section header */}
      <div className="section-container mb-24 md:mb-32">
        <p
          className="text-micro mb-6"
          style={{ color: 'var(--fg-muted)' }}
        >
          SELECTED WORK
        </p>
        <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
          <a
            href="/projects"
            ref={titleRef}
            className="text-massive font-extralight link-underline inline-block"
            style={{
              color: 'var(--fg-primary)',
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              textUnderlineOffset: '8px',
            }}
          >
            Projects
          </a>
          <span
            className="text-micro"
            style={{ color: 'var(--fg-muted)' }}
          >
            → CLICK TO EXPAND
          </span>
        </div>
      </div>

      {/* Projects - refined layout */}
      <div className="space-y-40 md:space-y-56">
        {PROJECTS.map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <article
              key={project.name}
              className="project-item section-container"
            >
              <div className={`grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center`}>

                {/* Image - contained, cleaner */}
                <div
                  className={`
                    ${isEven ? 'md:col-span-6' : 'md:col-span-6 md:col-start-7'}
                    ${isEven ? '' : 'md:order-last'}
                  `}
                >
                  <div
                    className="project-image-wrapper relative aspect-[4/3] overflow-hidden"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="project-image-inner absolute inset-0">
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`
                    ${isEven ? 'md:col-span-6' : 'md:col-span-6 md:col-start-1 md:row-start-1'}
                    project-content
                  `}
                >
                  {/* Project number */}
                  <div
                    className="project-number text-display-2xl font-thin mb-4"
                    style={{ color: 'var(--fg-primary)', opacity: 0.1 }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Title */}
                  <a
                    href={`/projects/${project.slug}`}
                    className="project-content-item text-display-md font-light mb-4 block link-underline"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {project.name}
                  </a>

                  {/* Description */}
                  <p
                    className="project-content-item text-editorial font-light mb-6 max-w-lg"
                    style={{ color: 'var(--fg-secondary)' }}
                  >
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="project-content-item flex flex-wrap gap-2 mb-6">
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
                    <div className="project-content-item">
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
