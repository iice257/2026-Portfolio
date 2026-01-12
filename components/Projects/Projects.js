import { useEffect, useRef, useState } from "react";
import { MENULINKS, PROJECTS } from "../../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

const Projects = ({ isDesktop }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const projectsContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal animation
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

      // Each project panel animation
      const panels = projectsContainerRef.current?.querySelectorAll('.project-panel');
      panels?.forEach((panel, i) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 85%",
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
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Section header */}
      <div className="section-container py-24 md:py-32">
        <p
          className="text-micro mb-6"
          style={{ color: 'var(--fg-muted)' }}
        >
          SELECTED WORK
        </p>
        <h2
          ref={titleRef}
          className="text-massive font-extralight"
          style={{ color: 'var(--fg-primary)', whiteSpace: 'nowrap' }}
        >
          Projects
        </h2>
      </div>

      {/* Fullscreen Project Panels */}
      <div ref={projectsContainerRef}>
        {PROJECTS.slice(0, 4).map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={project.name}
              className="project-panel min-h-screen grid grid-cols-1 lg:grid-cols-2"
            >
              {/* Image Side - Full height image */}
              <div
                className={`relative min-h-[50vh] lg:min-h-screen ${isEven ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}`}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>

              {/* Info Side - White/Black background with small preview */}
              <div
                className={`relative min-h-[50vh] lg:min-h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16 ${isEven ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
                  }`}
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                {/* Small preview image */}
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className="relative w-48 h-48 md:w-64 md:h-64"
                    style={{
                      background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
                      padding: '16px'
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={project.image}
                        alt={`${project.name} preview`}
                        fill
                        className="object-contain"
                        sizes="256px"
                      />
                    </div>
                    {/* OPEN label */}
                    <span
                      className="absolute -top-6 left-0 text-micro"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      OPEN
                    </span>
                  </div>
                </div>

                {/* Bottom row - Project name and number */}
                <div className="flex justify-between items-end pt-8">
                  <a
                    href={`/projects/${project.slug}`}
                    className="group"
                  >
                    <h3
                      className="text-display-md md:text-display-lg font-bold uppercase tracking-tight group-hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--fg-primary)' }}
                    >
                      {project.name}
                    </h3>
                  </a>
                  <span
                    className="text-display-md md:text-display-lg font-light"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Projects */}
      <div
        className="py-24 md:py-32"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="section-container">
          <a
            href="/projects"
            className="inline-flex items-center gap-4 text-display-sm font-light group"
            style={{ color: 'var(--fg-primary)' }}
          >
            <span className="group-hover:translate-x-2 transition-transform duration-300">
              View All Projects
            </span>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-2 transition-transform duration-300"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
