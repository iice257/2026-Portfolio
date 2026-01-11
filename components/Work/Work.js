import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS, WORK_CONTENTS } from "../../constants";

const Work = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll(".work-item");

      gsap.fromTo(
        items,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 0.5,
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Flatten work contents into a simple array
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
      className="section-spacing section-container"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p
            className="text-caption uppercase tracking-widest mb-4"
            style={{ color: 'var(--fg-muted)' }}
          >
            Experience
          </p>
          <h2
            className="text-display-md font-light"
            style={{ color: 'var(--fg-primary)' }}
          >
            Where I&apos;ve worked
          </h2>
        </div>

        {/* Experience list */}
        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <article
              key={exp.company}
              className="work-item grid md:grid-cols-3 gap-6 pb-12"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div>
                <p
                  className="text-body-sm"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {exp.period}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3
                  className="text-body-lg font-medium mb-1"
                  style={{ color: 'var(--fg-primary)' }}
                >
                  {exp.role}
                </h3>
                <p
                  className="text-body-md mb-4"
                  style={{ color: 'var(--fg-secondary)' }}
                >
                  {exp.company}
                </p>
                <p
                  className="text-body-md"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {exp.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
