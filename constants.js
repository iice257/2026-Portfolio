export const METADATA = {
  author: "Kingsley Afolabi Aremu",
  title: "Portfolio | Kingsley Afolabi Aremu",
  description:
    "Kingsley Afolabi Aremu is a Full-Stack Developer and Creative Engineer with 3+ years of experience building web and mobile solutions.",
  siteUrl: "https://kingsleyaremu.vercel.app/",
  twitterHandle: "",
  keywords: [
    "Kingsley Afolabi Aremu",
    "Kingsley Aremu",
    "Full-Stack Developer",
    "Creative Engineer",
    "React Native Developer",
    "AI Agent Tooling",
    "Frontend Engineer",
    "Software Engineer",
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
    url: "mailto:kingsley.aremu@gmail.com",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/kingsley-aremu",
  },
  {
    name: "github",
    label: "GitHub",
    url: "https://github.com/kingsleyaremu",
  },
  {
    name: "twitter",
    label: "X",
    url: "https://x.com/iice257",
  },
];

export const CONTACT_LINKS = SOCIAL_LINKS;

export const PROFILE_LINKS = SOCIAL_LINKS
  .filter((link) => link.url.startsWith("http"))
  .map((link) => link.url);

export const GTAG = "G-5HCTL2TJ5W";
