import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";

const Skills = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal with horizontal line animation
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
            end: "top 30%",
            scrub: 0.5,
          }
        }
      );

      // Stagger each capability category
      const categories = sectionRef.current.querySelectorAll(".capability-category");
      categories.forEach((cat) => {
        const items = cat.querySelectorAll(".capability-item");

        gsap.fromTo(
          items,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cat,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.3,
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const capabilities = {
    "Frontend": ["React", "React Native", "TypeScript", "Next.js", "Tailwind CSS"],
    "Backend": ["Node.js", "PHP / Laravel", "FastAPI", "Python", "Docker"],
    "Data": ["MySQL", "MongoDB"],
    "Practices": ["Performance Optimization", "Responsive Design", "UI/UX Awareness", "System Maintenance"]
  };

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[1].ref}
      className="section-spacing-lg"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container">
        {/* Large section title */}
        <div className="mb-24 md:mb-32">
          <p
            className="text-micro mb-6"
            style={{ color: 'var(--fg-muted)' }}
          >
            CAPABILITIES
          </p>
          <h2
            ref={titleRef}
            className="text-massive font-extralight"
            style={{ color: 'var(--fg-primary)' }}
          >
            What I do
          </h2>
        </div>

        {/* Enhanced grid layout with visual depth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left column - Primary skills */}
          <div className="lg:col-span-7 space-y-20">
            {Object.entries(capabilities).slice(0, 2).map(([category, skills], catIndex) => (
              <div key={category} className="capability-category relative">
                {/* Large background number */}
                <div
                  className="absolute -left-4 -top-8 text-display-2xl font-thin select-none pointer-events-none"
                  style={{ color: 'var(--fg-primary)', opacity: 0.05 }}
                >
                  {String(catIndex + 1).padStart(2, '0')}
                </div>

                {/* Category header */}
                <div
                  className="flex items-baseline justify-between mb-10 pb-4 relative"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <h3
                    className="text-display-sm font-light"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {category}
                  </h3>
                  <span
                    className="text-micro px-3 py-1"
                    style={{
                      color: 'var(--fg-muted)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {skills.length} SKILLS
                  </span>
                </div>

                {/* Skills list with enhanced hover */}
                <div className="space-y-5">
                  {skills.map((skill, i) => (
                    <div
                      key={skill}
                      className="capability-item flex items-center justify-between group cursor-default"
                    >
                      <div className="flex items-center gap-6">
                        <span
                          className="text-micro w-6 text-right"
                          style={{ color: 'var(--fg-muted)' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="text-body-xl font-light group-hover:translate-x-3 transition-transform duration-300"
                          style={{ color: 'var(--fg-primary)' }}
                        >
                          {skill}
                        </span>
                      </div>
                      <div
                        className="w-8 h-px opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-300"
                        style={{ backgroundColor: 'var(--fg-primary)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right column - Secondary skills, offset for asymmetry */}
          <div className="lg:col-span-5 lg:pt-32 space-y-20">
            {Object.entries(capabilities).slice(2).map(([category, skills], catIndex) => (
              <div key={category} className="capability-category relative">
                {/* Large background number */}
                <div
                  className="absolute -left-4 -top-6 text-display-xl font-thin select-none pointer-events-none"
                  style={{ color: 'var(--fg-primary)', opacity: 0.05 }}
                >
                  {String(catIndex + 3).padStart(2, '0')}
                </div>

                {/* Category header */}
                <div
                  className="flex items-baseline justify-between mb-8 pb-3 relative"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <h3
                    className="text-body-lg font-medium"
                    style={{ color: 'var(--fg-primary)' }}
                  >
                    {category}
                  </h3>
                  <span
                    className="text-micro"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {skills.length}
                  </span>
                </div>

                {/* Skills list */}
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="capability-item group"
                    >
                      <span
                        className="text-body-md font-light group-hover:translate-x-2 transition-transform duration-300 inline-block"
                        style={{ color: 'var(--fg-secondary)' }}
                      >
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
