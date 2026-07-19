import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const manifestPath = path.join(publicDir, "manifest.json");
const requiredFaviconAssets = [
  "favicon.svg",
  "favicons/favicon.ico",
  "favicons/favicon-16x16.png",
  "favicons/favicon-32x32.png",
  "favicons/apple-touch-icon.png",
];
const errors = [];

const pngDimensions = (filePath) => {
  const data = fs.readFileSync(filePath);
  const signature = "89504e470d0a1a0a";

  if (data.subarray(0, 8).toString("hex") !== signature) {
    throw new Error("is not a PNG file");
  }

  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
};

if (!fs.existsSync(manifestPath)) {
  errors.push("Missing public/manifest.json.");
} else {
  let manifest;

  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`public/manifest.json is not valid JSON: ${error.message}`);
  }

  if (manifest) {
    for (const field of ["id", "name", "short_name", "description", "start_url", "scope", "display", "theme_color", "background_color"]) {
      if (!manifest[field]) errors.push(`Manifest is missing ${field}.`);
    }

    if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
      errors.push("Manifest must declare at least one icon.");
    } else {
      for (const icon of manifest.icons) {
        const relativePath = String(icon.src || "").replace(/^\//, "");
        const assetPath = path.join(publicDir, relativePath);
        const [expectedWidth, expectedHeight] = String(icon.sizes || "").split("x").map(Number);

        if (!relativePath || !fs.existsSync(assetPath)) {
          errors.push(`Manifest icon is missing: ${icon.src || "unknown source"}.`);
          continue;
        }

        if (icon.type !== "image/png") {
          errors.push(`Manifest icon ${icon.src} must declare image/png.`);
          continue;
        }

        try {
          const { width, height } = pngDimensions(assetPath);
          if (width !== expectedWidth || height !== expectedHeight) {
            errors.push(`Manifest icon ${icon.src} declares ${icon.sizes} but is ${width}x${height}.`);
          }
        } catch (error) {
          errors.push(`Manifest icon ${icon.src} ${error.message}.`);
        }
      }
    }
  }
}

for (const relativePath of requiredFaviconAssets) {
  if (!fs.existsSync(path.join(publicDir, relativePath))) {
    errors.push(`Missing required favicon asset: /${relativePath}.`);
  }
}

if (errors.length > 0) {
  console.error("SEO asset validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SEO asset validation passed.");
