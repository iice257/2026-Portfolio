import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const MetallicPaint = dynamic(() => import("../ReactBits/MetallicPaint"), {
  ssr: false,
});

const escapeSvgText = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const createMetallicMask = ({ label, kicker }) => {
  const safeLabel = escapeSvgText(label);
  const safeKicker = escapeSvgText(kicker);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 920">
  <rect x="48" y="48" width="1104" height="824" rx="34" fill="#000"/>
  <rect x="88" y="88" width="1024" height="744" rx="18" fill="none" stroke="#000" stroke-width="24"/>
  <rect x="120" y="146" width="240" height="18" fill="#000"/>
  <rect x="120" y="618" width="880" height="160" rx="12" fill="#000"/>
  <rect x="156" y="660" width="520" height="22" fill="#000"/>
  <rect x="156" y="704" width="700" height="18" fill="#000"/>
  <rect x="156" y="744" width="420" height="18" fill="#000"/>
  <circle cx="1080" cy="132" r="16" fill="#000"/>
  <text x="116" y="218" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="5" fill="#000">${safeKicker}</text>
  <text x="112" y="852" font-family="Arial, Helvetica, sans-serif" font-size="124" font-weight="800" letter-spacing="-6" fill="#000">${safeLabel}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const metallicSeed = (value = "") =>
  Array.from(String(value)).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 11), 37);

const ProjectVisual = ({ project, priority = false, compact = false, metallic = false }) => {
  const visual = project.visual || {};
  const accent = visual.accent || project.gradient?.[0] || "#fafafa";
  const secondary = visual.secondary || project.gradient?.[1] || "#525252";
  const label = visual.label || project.name;
  const kicker = visual.kicker || project.category || "Project";
  const metallicMask = useMemo(
    () => (metallic ? createMetallicMask({ label, kicker }) : null),
    [kicker, label, metallic]
  );

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
      className={`relative h-full w-full overflow-hidden ${metallic ? "project-visual-metallic" : ""}`}
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
      <div className="absolute left-6 right-6 top-6 z-[2] md:left-8 md:right-8 md:top-8 flex items-center justify-between">
        <span className="text-micro" style={{ color: 'var(--fg-muted)' }}>
          {kicker}
        </span>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
      </div>
      {metallicMask && (
        <div className="project-metallic-layer" aria-hidden="true">
          <MetallicPaint
            imageSrc={metallicMask}
            seed={metallicSeed(project.slug || project.name)}
            scale={3.6}
            patternSharpness={1.1}
            noiseScale={0.58}
            speed={0.22}
            liquid={0.55}
            brightness={1.75}
            contrast={0.78}
            refraction={0.012}
            blur={0.012}
            chromaticSpread={1.55}
            fresnel={0.9}
            waveAmplitude={0.82}
            distortion={0.55}
            contour={0.18}
            lightColor="#ffffff"
            darkColor="#050505"
            tintColor={accent}
          />
        </div>
      )}
      <div className="absolute inset-x-6 bottom-6 z-[2] md:inset-x-8 md:bottom-8">
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
