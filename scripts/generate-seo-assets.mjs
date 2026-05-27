import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const today = "2026-05-26";

const evalModule = (relativePath, expression) => {
  const source = fs
    .readFileSync(path.join(root, relativePath), "utf8")
    .replaceAll("export const ", "const ");

  return vm.runInNewContext(
    `${source}
    ${expression};`,
    {},
    { filename: relativePath },
  );
};

const {
  METADATA,
  PROFILE_LINKS,
} = evalModule(
  "constants.js",
  "({ METADATA, PROFILE_LINKS })",
);

const {
  allProjects,
  featuredProjects,
  highlightedProject,
  majorProjects,
  remainingProjects,
} = evalModule(
  path.join("data", "projects.js"),
  "({ allProjects, featuredProjects, highlightedProject, majorProjects, remainingProjects })",
);

const cleanUrl = METADATA.siteUrl.replace(/\/$/, "");
const xmlEscape = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const markdownList = (items) => items.map((item) => `- ${item}`).join("\n");
const projectLine = (project) => {
  const links = [
    project.url && project.url !== "#" ? `repo: ${project.url}` : null,
    project.liveUrl ? `live: ${project.liveUrl}` : null,
  ].filter(Boolean);

  return `- ${project.name}: ${project.longDescription || project.description} Tech/focus: ${(project.tech || []).join(", ")}. ${links.join(" | ")}`;
};

const sitemapUrls = [
  { loc: `${cleanUrl}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${cleanUrl}/projects`, priority: "0.95", changefreq: "weekly" },
  ...featuredProjects.map((project) => ({
    loc: `${cleanUrl}/projects/${project.slug}`,
    priority: "0.9",
    changefreq: "monthly",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const llms = `# ${METADATA.author}

> ${METADATA.description}

## Canonical Identity

- Full name: ${METADATA.author}
- Short name: ${METADATA.shortName}
- Username: ${METADATA.username}
- Location: ${METADATA.location}
- Role: ${METADATA.jobTitle}
- Homepage: ${cleanUrl}/
- Projects: ${cleanUrl}/projects
- GitHub: ${METADATA.githubUrl}
- LinkedIn: ${METADATA.linkedinUrl}
- X: ${METADATA.xUrl}
- Email: ${METADATA.email}

## Search and Retrieval Aliases

${markdownList(METADATA.topSearchQueries)}

## Focus Areas

${markdownList(METADATA.focusAreas)}

## Education and Learning Areas

${markdownList(METADATA.educationAreas)}

## Exa and Neural Search Retrieval Context

${METADATA.retrievalSummary}

${markdownList(METADATA.exaRetrievalHints)}

## Featured Work

${featuredProjects.map(projectLine).join("\n")}

## Highlighted Portfolio System

${projectLine(highlightedProject)}

## Major Project Signals

${majorProjects.map(projectLine).join("\n")}

## Complete Public Project Archive

This portfolio indexes ${allProjects.length} public or portfolio-tracked projects. The complete archive is visible at ${cleanUrl}/projects and is represented in machine-readable form at ${cleanUrl}/portfolio.json.

## Crawling Notes

- Canonical site: ${cleanUrl}/
- Canonical project archive: ${cleanUrl}/projects
- Canonical sitemap: ${cleanUrl}/sitemap.xml
- Machine-readable project corpus: ${cleanUrl}/portfolio.json
- Preferred GitHub identity: ${METADATA.githubUrl}
- This file is factual profile context for search engines, AI retrieval systems, and LLM crawlers. It intentionally avoids hidden text, keyword stuffing, fake claims, or doorway pages.
`;

const portfolioJson = {
  name: METADATA.author,
  shortName: METADATA.shortName,
  username: METADATA.username,
  role: METADATA.jobTitle,
  description: METADATA.description,
  location: METADATA.location,
  canonicalUrl: `${cleanUrl}/`,
  links: {
    homepage: `${cleanUrl}/`,
    projects: `${cleanUrl}/projects`,
    github: METADATA.githubUrl,
    linkedin: METADATA.linkedinUrl,
    x: METADATA.xUrl,
    email: `mailto:${METADATA.email}`,
  },
  sameAs: PROFILE_LINKS,
  focusAreas: METADATA.focusAreas,
  educationAreas: METADATA.educationAreas,
  retrievalSummary: METADATA.retrievalSummary,
  exaRetrievalHints: METADATA.exaRetrievalHints,
  searchAliases: METADATA.topSearchQueries,
  projectCounts: {
    all: allProjects.length,
    featured: featuredProjects.length,
    major: majorProjects.length,
    archive: remainingProjects.length,
  },
  featuredProjects,
  highlightedProject,
  majorProjects,
  remainingProjects,
  generatedAt: today,
};

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);
fs.writeFileSync(
  path.join(publicDir, "portfolio.json"),
  `${JSON.stringify(portfolioJson, null, 2)}\n`,
);

console.log("Generated public/sitemap.xml, public/llms.txt, and public/portfolio.json");
