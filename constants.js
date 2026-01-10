export const METADATA = {
  author: "Kingsley Afolabi Aremu",
  title: "Portfolio | Kingsley Afolabi Aremu",
  description:
    "Kingsley Afolabi Aremu is a Full-Stack Developer and Creative Engineer with 3+ years of experience building web and mobile solutions.",
  siteUrl: "https://kingsleyaremu.vercel.app/",
  twitterHandle: "",
  keywords: [
    "Kingsley Afolabi Aremu",
    "Full-Stack Developer",
    "React Native Developer",
    "Software Engineer",
    "Portfolio",
    "Lagos",
    "Nigeria",
  ].join(", "),
  image:
    "https://res.cloudinary.com/dywdhyojt/image/upload/v1721378510/social-preview.png",
  language: "English",
  themeColor: "#000000",
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
    ref: "work",
  },
  {
    name: "Contact",
    ref: "contact",
  },
];

export const TYPED_STRINGS = [
  "Full-Stack React (Native) Developer",
  "I build high-performance web & mobile apps",
  "Turning ideas into shipped products",
];

export const SOCIAL_LINKS = [
  {
    name: "mail",
    url: "mailto:kingsley.aremu@gmail.com",
  },
  {
    name: "linkedin",
    url: "https://linkedin.com/in/kingsley-aremu",
  },
  {
    name: "github",
    url: "https://github.com/kingsleyaremu",
  },
];

export const SKILLS = {
  languagesAndTools: [
    "html",
    "css",
    "javascript",
    "typescript",
    "sass",
    "nodejs",
    "vite",
    "python",
    "php",
  ],
  librariesAndFrameworks: [
    "react",
    "nextjs",
    "tailwindcss",
    "fastapi",
    "laravel",
  ],
  databases: ["mysql", "mongodb"],
  other: ["git", "docker"],
};

export const PROJECTS = [
  {
    name: "PowerGrid",
    image: "/projects/powergrid.png",
    blurImage: "/projects/blur/tesla-blur.webp",
    description: "Map-based electricity availability tracker ⚡",
    gradient: ["#142D46", "#2E4964"],
    url: "#",
    tech: ["react", "fastapi", "leaflet"],
  },
  {
    name: "StreakMate",
    image: "/projects/streakmate.png",
    blurImage: "/projects/blur/airbnb-blur.webp",
    description: "Universal streak reminder app 🔥",
    gradient: ["#F14658", "#DC2537"],
    url: "#",
    tech: ["react", "nodejs"],
  },
  {
    name: "ScoreLog",
    image: "/projects/scorelog.png",
    blurImage: "/projects/blur/tesla-blur.webp",
    description: "Game score tracking app 🎮",
    gradient: ["#000066", "#6699FF"],
    url: "#",
    tech: ["react", "nodejs"],
  },
  {
    name: "Unfollowr",
    image: "/projects/unfollowr.png",
    blurImage: "/projects/blur/medium-blur.webp",
    description: "Mass unfollower tool 📉",
    gradient: ["#FFA62E", "#EA4D2C"],
    url: "#",
    tech: ["react", "nodejs", "c"],
  },
];

export const WORK_CONTENTS = {
  W3PETS: [
    {
      title: "W3Pets",
      description:
        "Built responsive, user-friendly interfaces with modern frameworks. Collaborated with cross-functional teams to translate requirements into features, optimized performance and load times, and conducted QA testing.",
      content: (
        <div className="h-full w-full flex items-center justify-center text-white px-4">
          Frontend Developer
        </div>
      ),
    },
  ],
  NESTLE: [
    {
      title: "Nestlé",
      description:
        "Providing IT support, system maintenance, and infrastructure optimization. Reduced downtime through prompt issue resolution, assisted in deploying new technologies, and trained staff on software/IT best practices.",
      content: (
        <div className="h-full w-full flex items-center justify-center text-white px-4">
          IT Attendant
        </div>
      ),
    },
  ],
  ICE_DESIGN: [
    {
      title: "Ice Design Studio",
      description:
        "Delivered custom websites for multiple clients. Designed responsive, modern interfaces, managed multiple projects concurrently, and handled client communication, feedback, and revisions.",
      content: (
        <div className="h-full w-full flex items-center justify-center text-white px-4">
          Freelance Web Designer
        </div>
      ),
    },
  ],
};

export const GTAG = "G-5HCTL2TJ5W";
