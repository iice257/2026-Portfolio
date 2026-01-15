import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MENULINKS, PROJECTS } from "../../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import { useCursor } from "../../context/CursorContext";
import ShuffleText from "../ReactBits/ShuffleText";

const Projects = ({ isDesktop }) => {
  const router = useRouter();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const projectsContainerRef = useRef(null);
  const { setCursorText, setCursorVariant } = useCursor();

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

  // Track mouse position ref for scroll detection
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Handle cursor update on scroll (check if mouse is still over a project)
  useEffect(() => {
    const handleScroll = () => {
      // Use elementFromPoint for robust detection during scroll without mouse movement
      const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
      if (!el) return;

      const panel = el.closest('.project-panel');

      if (panel) {
        setCursorText("Click for more details");
        setCursorVariant("project");
      } else {
        setCursorText("");
        setCursorVariant("default");
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setCursorText, setCursorVariant]);

  const handleMouseEnter = () => {
    setCursorText("Click for more details");
    setCursorVariant("project");
  };

  const handleMouseLeave = () => {
    setCursorText("");
    setCursorVariant("default");
  };

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
          PROJECTS
        </p>
        <h2
          ref={titleRef}
          className="text-massive font-extralight"
          style={{ color: 'var(--fg-primary)', whiteSpace: 'nowrap' }}
        >
          <ShuffleText text="What I've done" duration={0.6} shuffleTimes={4} />
        </h2>
      </div>

      {/* Fullscreen Project Panels */}
      <div ref={projectsContainerRef}>
        {PROJECTS.slice(0, 4).map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={project.name}
              className="project-panel min-h-screen grid grid-cols-1 lg:grid-cols-2 group cursor-none"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => router.push(`/projects/${project.slug}`)}
            >
              {/* Image Side - Full height image */}
              <div
                className={`relative min-h-[50vh] lg:min-h-screen ${isEven ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}`}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
              </div>

              {/* Info Side - Simple text details details - CENTERED SQUARE */}
              <div
                className={`relative min-h-[50vh] lg:min-h-screen flex items-center justify-center p-8 md:p-12 lg:p-16 ${isEven ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
                  }`}
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <div className="w-full max-w-lg flex flex-col items-center text-center">

                  {/* Project Number (top-right of content?) or keep at bottom? User said "bring them to the center into a square" */}
                  {/* I'll put project name on top, then desc, then tags. */}

                  <span
                    className="text-display-md font-light mb-8"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3
                    className="text-display-lg font-bold uppercase mb-6 leading-none"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {project.name}
                  </h3>
                  <p
                    className="text-editorial font-light mb-8 max-w-md mx-auto"
                    style={{ color: 'var(--fg-secondary)' }}
                  >
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
                    {project.tech.map((tech, i) => (
                      <span key={tech} className="inline-flex items-center">
                        <span
                          className="text-body-md font-bold uppercase tracking-wide"
                          style={{ color: 'var(--fg-primary)' }}
                        >
                          {tech}
                        </span>
                        {i < project.tech.length - 1 && (
                          <span className="ml-3" style={{ color: 'var(--fg-muted)' }}>•</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Projects - Full Screen Width Rectangle Button */}
      <Link
        href="/projects"
        className="block w-full mt-8 py-10 md:py-14 border-y border-[var(--border)] group relative overflow-hidden text-center cursor-none"
        style={{
          backgroundColor: 'var(--bg-primary)',
          textDecoration: 'none'
        }}
      >
        {/* Hover Background Fill */}
        <div className="absolute inset-0 bg-[var(--fg-primary)] transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0" />

        {/* Text Container - Ensure z-index is above background */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
          <span
            className="text-display-xl font-light uppercase tracking-tight transition-colors duration-500"
            style={{
              color: 'var(--fg-primary)'
            }}
          >
            <span className="group-hover:text-[var(--bg-primary)] transition-colors duration-500">View All Projects</span>
          </span>
          <span
            className="mt-2 text-body-sm tracking-widest uppercase transition-colors duration-500 opacity-60"
            style={{ color: 'var(--fg-muted)' }}
          >
            <span className="group-hover:text-[var(--bg-primary)] transition-colors duration-500">Explore Full Archive</span>
          </span>
        </div>
      </Link>
    </section>
  );
};

export default Projects;
