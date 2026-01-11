import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS, SKILLS } from "../../constants";

const Skills = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll(".skill-item");

      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Combine all skills into categories
  const capabilities = {
    "Frontend": ["React", "React Native", "TypeScript", "Next.js", "Tailwind CSS"],
    "Backend": ["Node.js", "PHP / Laravel", "FastAPI", "Python"],
    "Data": ["MySQL", "MongoDB"],
    "Practices": ["Performance Optimization", "Responsive Design", "UI/UX Awareness", "System Maintenance"]
  };

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[1].ref}
      className="section-spacing section-container"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p
            className="text-caption uppercase tracking-widest mb-4 skill-item"
            style={{ color: 'var(--fg-muted)' }}
          >
            Capabilities
          </p>
          <h2
            className="text-display-md font-light skill-item"
            style={{ color: 'var(--fg-primary)' }}
          >
            Technologies & expertise
          </h2>
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {Object.entries(capabilities).map(([category, skills]) => (
            <div key={category} className="skill-item">
              <h3
                className="text-body-sm uppercase tracking-widest mb-6"
                style={{ color: 'var(--fg-muted)' }}
              >
                {category}
              </h3>
              <ul className="space-y-3">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-body-lg"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
