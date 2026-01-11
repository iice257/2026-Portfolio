import Link from "next/link";
import Image from "next/image";
import { PROJECTS } from "../../constants";

const Projects = () => {
  return (
    <section id="work" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="mb-24">
        <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 dark:text-ash/40 mb-4">
          Selected Work
        </h2>
        <div className="h-px w-full bg-ink/10 dark:bg-white/10" />
      </div>

      <div className="flex flex-col gap-32">
        {PROJECTS.map((project, index) => (
          <div key={project.name} className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            {/* Text */}
            <div className={`md:col-span-5 flex flex-col gap-6 ${index % 2 === 1 ? 'md:order-last' : ''}`}>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-white group-hover:opacity-70 transition-opacity">
                {project.name}
              </h3>
              <p className="text-lg text-ink/60 dark:text-ash/60 leading-relaxed font-light">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs uppercase tracking-wider font-medium border border-ink/10 dark:border-white/10 rounded-full text-ink/50 dark:text-ash/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="pt-4">
                <Link href={project.url} className="inline-flex items-center text-sm font-medium uppercase tracking-widest border-b border-ink/20 dark:border-white/20 pb-1 hover:border-ink dark:hover:border-white transition-colors">
                  View Project
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-white/5 rounded-sm">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
