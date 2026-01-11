import { SKILLS } from "../../constants";

const Skills = () => {
  return (
    <section id="capabilities" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-ink/40 dark:text-ash/40 mb-6">
            Capabilities
          </h2>
        </div>

        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-ink dark:text-white">Languages & Tools</h3>
            <ul className="flex flex-col gap-3">
              {SKILLS.languagesAndTools.map((skill) => (
                <li key={skill} className="text-ink/60 dark:text-ash/60 font-light text-lg border-b border-ink/5 dark:border-white/5 pb-2">
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-ink dark:text-white">Frameworks & Libraries</h3>
            <ul className="flex flex-col gap-3">
              {SKILLS.librariesAndFrameworks.map((skill) => (
                <li key={skill} className="text-ink/60 dark:text-ash/60 font-light text-lg border-b border-ink/5 dark:border-white/5 pb-2">
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
