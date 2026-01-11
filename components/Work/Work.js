import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";

const Work = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Each work item reveals with different timing
      const items = sectionRef.current.querySelectorAll(".work-item");
      items.forEach((item, i) => {
        const line = item.querySelector(".work-line");
        const content = item.querySelector(".work-content");

        // Line grows from left
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );

        // Content fades up
        gsap.fromTo(
          content,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const experiences = [
    {
      company: "W3Pets",
      role: "Frontend Developer",
      period: "Jun 2025 — Present",
      description: "Building responsive, user-friendly interfaces with modern frameworks. Optimizing performance and collaborating with cross-functional teams."
    },
    {
      company: "Nestlé",
      role: "IT Attendant",
      period: "Feb 2025 — Present",
      description: "IT support, system maintenance, and infrastructure optimization. Training staff on software and IT best practices."
    },
    {
      company: "Ice Design Studio",
      role: "Freelance Web Designer",
      period: "Feb 2019 — Present",
      description: "Delivering custom websites for clients. Designing responsive, modern interfaces and managing multiple concurrent projects."
    }
  ];

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[3].ref}
      className="section-spacing"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container">
        {/* Section header */}
        <div className="mb-20 md:mb-28" ref={titleRef}>
          <p
            className="text-micro mb-6"
            style={{ color: 'var(--fg-muted)' }}
          >
            EXPERIENCE
          </p>
          <h2
            className="text-display-lg font-extralight"
            style={{ color: 'var(--fg-primary)' }}
          >
            Where I&apos;ve worked
          </h2>
        </div>

        {/* Experience list */}
        <div className="max-w-4xl">
          {experiences.map((exp, i) => (
            <article
              key={exp.company}
              className="work-item mb-16 last:mb-0"
            >
              {/* Top line */}
              <div
                className="work-line h-px w-full mb-8"
                style={{ backgroundColor: 'var(--border)' }}
              />

              <div className="work-content grid md:grid-cols-12 gap-6 md:gap-12">
                {/* Left - Period */}
                <div className="md:col-span-3">
                  <p
                    className="text-body-sm font-medium"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {exp.period}
                  </p>
                </div>

                {/* Right - Content */}
                <div className="md:col-span-9">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
                    <h3
                      className="text-body-xl font-medium"
                      style={{ color: 'var(--fg-primary)' }}
                    >
                      {exp.role}
                    </h3>
                    <span
                      className="text-body-md"
                      style={{ color: 'var(--fg-secondary)' }}
                    >
                      {exp.company}
                    </span>
                  </div>
                  <p
                    className="text-editorial font-light leading-relaxed"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {exp.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
