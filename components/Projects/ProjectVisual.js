import Image from "next/image";

const ProjectVisual = ({ project, priority = false, compact = false }) => {
  const visual = project.visual || {};
  const accent = visual.accent || project.gradient?.[0] || "#fafafa";
  const secondary = visual.secondary || project.gradient?.[1] || "#525252";
  const label = visual.label || project.name;

  if (project.image) {
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          priority={priority}
          className={visual.contain ? "object-contain p-6 transition-transform duration-700 group-hover:scale-105" : "object-cover transition-transform duration-700 group-hover:scale-105"}
          sizes={compact ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
        />
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          `radial-gradient(circle at 18% 18%, ${accent}55, transparent 34%), linear-gradient(135deg, ${accent}22, ${secondary}22), var(--bg-secondary)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
          backgroundSize: compact ? "22px 22px" : "32px 32px",
        }}
      />
      <div className="absolute inset-6 md:inset-8 border" style={{ borderColor: `${accent}66` }} />
      <div className="absolute left-6 right-6 top-6 md:left-8 md:right-8 md:top-8 flex items-center justify-between">
        <span className="text-micro" style={{ color: 'var(--fg-muted)' }}>
          {visual.kicker || project.category || "Project"}
        </span>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
      </div>
      <div className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8">
        <div
          className="mb-5 h-24 rounded-none border p-4 backdrop-blur-sm"
          style={{
            borderColor: `${accent}66`,
            backgroundColor: 'rgba(10,10,10,0.28)',
          }}
        >
          <div className="mb-3 h-2 w-3/5" style={{ backgroundColor: accent }} />
          <div className="mb-2 h-2 w-4/5" style={{ backgroundColor: `${secondary}88` }} />
          <div className="h-2 w-1/2" style={{ backgroundColor: `${accent}55` }} />
        </div>
        <p
          className={compact ? "text-display-sm font-light leading-none" : "text-display-lg font-light leading-none"}
          style={{ color: 'var(--fg-primary)' }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default ProjectVisual;
