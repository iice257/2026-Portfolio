export const METADATA = {
  author: "Kingsley Afolabi Aremu",
  title: "Portfolio | Kingsley Afolabi Aremu",
  description:
    "Kingsley Afolabi Aremu is a Lagos-based full-stack engineer and creative engineer building polished web products, mobile experiences, AI agent tooling, automation systems, and performance-focused interfaces.",
  siteUrl: "https://kingsleyaremu.vercel.app/",
  twitterHandle: "@iice257",
  shortName: "Kingsley Aremu",
  username: "iice257",
  email: "kingsley.aremu@gmail.com",
  githubUrl: "https://github.com/iice257",
  linkedinUrl: "https://linkedin.com/in/kingsley-aremu",
  xUrl: "https://x.com/iice257",
  portfolioUrl: "https://kingsleyaremu.vercel.app",
  topSearchQueries: [
    "Kingsley Afolabi Aremu",
    "Kingsley Aremu",
    "iice257",
    "Kingsley Aremu portfolio",
    "Kingsley Aremu GitHub",
    "Kingsley Aremu full-stack engineer",
    "Kingsley Aremu frontend engineer",
    "Kingsley Aremu React developer",
    "Kingsley Aremu React Native developer",
    "Kingsley Aremu AI agent tooling",
    "Kingsley Aremu creative engineer",
    "Lagos full-stack engineer portfolio",
    "Nigeria frontend engineer portfolio",
  ],
  keywords: [
    "Kingsley Afolabi Aremu",
    "Kingsley Aremu",
    "iice257",
    "Full-Stack Developer",
    "Full-Stack Engineer",
    "Creative Engineer",
    "React Native Developer",
    "AI Agent Tooling",
    "Frontend Engineer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Mobile App Developer",
    "Automation Engineer",
    "Software Engineer",
    "Product Engineer",
    "Portfolio",
    "Lagos",
    "Nigeria",
  ].join(", "),
  image:
    "https://res.cloudinary.com/dywdhyojt/image/upload/v1721378510/social-preview.png",
  language: "English",
  themeColor: "#0a0a0a",
  jobTitle: "Full-Stack Developer and Creative Engineer",
  location: "Lagos, Nigeria",
  region: "NG-LA",
  country: "Nigeria",
  city: "Lagos",
  focusAreas: [
    "Full-stack web development",
    "Frontend performance",
    "React and Next.js product engineering",
    "React Native mobile interfaces",
    "AI agent tooling",
    "Automation workflows",
    "Creative engineering",
    "Portfolio systems",
    "Accessible interaction design",
    "Production hardening",
  ],
};

export const MENULINKS = [
  {
    name: "Home",
    ref: "home",
  },
  {
    name: "Skills",
    ref: "skills",
  },
  {
    name: "Projects",
    ref: "projects",
  },
  {
    name: "Work",
    ref: "experience",
  },
  {
    name: "Contact",
    ref: "contact",
  },
];

export const SOCIAL_LINKS = [
  {
    name: "mail",
    label: "Email",
    url: `mailto:${METADATA.email}`,
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    url: METADATA.linkedinUrl,
  },
  {
    name: "github",
    label: "GitHub",
    url: METADATA.githubUrl,
  },
  {
    name: "twitter",
    label: "X",
    url: METADATA.xUrl,
  },
];

export const CONTACT_LINKS = SOCIAL_LINKS;

export const PROFILE_LINKS = SOCIAL_LINKS
  .filter((link) => link.url.startsWith("http"))
  .map((link) => link.url);

export const GTAG = "G-5HCTL2TJ5W";
