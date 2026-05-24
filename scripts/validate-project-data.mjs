import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const projectDataSource = fs
  .readFileSync(path.join(root, "data", "projects.js"), "utf8")
  .replaceAll("export const ", "const ");

const projectData = vm.runInNewContext(
  `${projectDataSource}
  ({ allProjects, featuredProjects, githubProjectCount, majorProjectCount });`,
  {},
  { filename: "data/projects.js" }
);

const {
  allProjects,
  featuredProjects,
  githubProjectCount,
  majorProjectCount,
} = projectData;
const errors = [];
const warnings = [];
const sitemap = fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8");

const requiredFields = ["name", "slug", "description", "tech", "url"];
const featuredRequiredFields = [
  "category",
  "subtitle",
  "longDescription",
  "toolsUsed",
  "concept",
  "problem",
  "solution",
];

const seenSlugs = new Set();

for (const project of allProjects) {
  for (const field of requiredFields) {
    if (!project[field] || (Array.isArray(project[field]) && project[field].length === 0)) {
      errors.push(`${project.name || "Unknown project"} is missing ${field}.`);
    }
  }

  if (!project.status && !project.currentStatus) {
    errors.push(`${project.name || "Unknown project"} is missing status or currentStatus.`);
  }

  if (seenSlugs.has(project.slug)) {
    errors.push(`Duplicate project slug found: ${project.slug}.`);
  }
  seenSlugs.add(project.slug);

  for (const assetField of ["image", "desktopVideo", "mobileVideo"]) {
    const assetPath = project[assetField];
    if (!assetPath || !assetPath.startsWith("/")) continue;

    const absoluteAssetPath = path.join(root, "public", assetPath);
    if (!fs.existsSync(absoluteAssetPath)) {
      errors.push(`${project.name} references missing ${assetField}: ${assetPath}.`);
    }
  }

  if (project.url !== "#" && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(project.url)) {
    warnings.push(`${project.name} has a non-standard repository URL: ${project.url}.`);
  }
}

for (const project of featuredProjects) {
  for (const field of featuredRequiredFields) {
    if (!project[field] || (Array.isArray(project[field]) && project[field].length === 0)) {
      errors.push(`Featured project ${project.name} is missing ${field}.`);
    }
  }

  if (!sitemap.includes(`/projects/${project.slug}`)) {
    errors.push(`Sitemap is missing featured project route: /projects/${project.slug}.`);
  }
}

if (majorProjectCount !== featuredProjects.length + 6) {
  errors.push("majorProjectCount should equal featured projects plus six major projects.");
}

if (githubProjectCount < allProjects.filter((project) => project.url !== "#").length) {
  errors.push("githubProjectCount is lower than the number of projects with repository URLs.");
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
  console.error("Project data validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Project data validation passed for ${allProjects.length} projects.`);
