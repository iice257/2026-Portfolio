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
    slug: "powergrid",
    image: "/projects/powergrid.png",
    blurImage: "/projects/blur/tesla-blur.webp",
    description: "Map-based electricity availability tracker ⚡",
    longDescription: "PowerGrid is a real-time electricity availability tracker that helps users in Nigeria visualize power outages and availability across different regions. Users can report their electricity status, helping create a crowd-sourced map of power distribution.",
    gradient: ["#142D46", "#2E4964"],
    url: "#",
    tech: ["react", "fastapi", "leaflet"],
    buildingProcess: "Started with user research to understand the pain points of unpredictable power supply. Built the frontend with React for its component-based architecture, integrated Leaflet for interactive mapping, and used FastAPI for a high-performance backend API.",
    problemsAndSolutions: "Challenge: Real-time data synchronization across thousands of concurrent users. Solution: Implemented WebSocket connections for live updates and Redis caching to reduce database load. Also optimized map rendering with clustering for dense areas.",
    knowledgeGained: "Learned advanced geospatial data handling, WebSocket implementation patterns, and the importance of progressive loading for map-heavy applications."
  },
  {
    name: "StreakMate",
    slug: "streakmate",
    image: "/projects/streakmate.png",
    blurImage: "/projects/blur/airbnb-blur.webp",
    description: "Universal streak reminder app 🔥",
    longDescription: "StreakMate is a cross-platform habit tracking app that helps users maintain daily streaks for any goal. Features smart reminders, streak statistics, and motivational insights to keep users engaged.",
    gradient: ["#F14658", "#DC2537"],
    url: "#",
    tech: ["react", "nodejs"],
    buildingProcess: "Designed with a mobile-first approach using React Native. Built a Node.js backend with scheduled jobs for notifications. Focused heavily on UX to make habit tracking feel rewarding rather than tedious.",
    problemsAndSolutions: "Challenge: Timezone handling for users across the globe. Solution: Stored all times in UTC and converted to local timezone on the client. Implemented a custom notification scheduler that accounts for user timezone and preferred reminder times.",
    knowledgeGained: "Deepened understanding of push notification systems, scheduling algorithms, and building engaging micro-interactions that encourage daily app usage."
  },
  {
    name: "ScoreLog",
    slug: "scorelog",
    image: "/projects/scorelog.png",
    blurImage: "/projects/blur/tesla-blur.webp",
    description: "Game score tracking app 🎮",
    longDescription: "ScoreLog is a versatile score tracking application for board games, card games, and any competitive activity. Features multiple scoring modes, player profiles, game history, and statistics visualization.",
    gradient: ["#000066", "#6699FF"],
    url: "#",
    tech: ["react", "nodejs"],
    buildingProcess: "Built with React Native for iOS and Android support. Implemented local-first architecture with SQLite for offline functionality, syncing to Node.js backend when online.",
    problemsAndSolutions: "Challenge: Supporting diverse scoring systems (points, rounds, time-based). Solution: Created a flexible scoring engine with configurable rules that adapts to different game types through a simple setup wizard.",
    knowledgeGained: "Learned local-first database patterns, conflict resolution in sync systems, and building flexible data models that accommodate varied use cases."
  },
  {
    name: "Unfollowr",
    slug: "unfollowr",
    image: "/projects/unfollowr.png",
    blurImage: "/projects/blur/medium-blur.webp",
    description: "Mass unfollower tool 📉",
    longDescription: "Unfollowr is a social media management tool that helps users clean up their following lists efficiently. Identify inactive accounts, non-followers, and batch unfollow with smart rate limiting to avoid account restrictions.",
    gradient: ["#FFA62E", "#EA4D2C"],
    url: "#",
    tech: ["react", "nodejs", "c"],
    buildingProcess: "Frontend built with React for the dashboard interface. Node.js handles API orchestration and queue management. C module provides high-performance data processing for analyzing large following lists quickly.",
    problemsAndSolutions: "Challenge: API rate limits from social platforms. Solution: Implemented intelligent rate limiting with exponential backoff, queue-based processing, and a C module for fast local data analysis to minimize API calls.",
    knowledgeGained: "Gained experience with API rate limiting strategies, building hybrid systems with C and JavaScript, and queue-based architecture for handling long-running operations."
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
