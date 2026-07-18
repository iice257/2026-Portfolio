import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { METADATA } from "../../constants";
import {
  allProjects,
  expandableArchiveProjects,
  featuredProjects,
  githubProjectCount,
  highlightedProject,
  majorProjectCount,
  majorProjects,
  quietArchiveProjects,
} from "../../data/projects";
import Footer from "@/components/Footer/Footer";
import ProjectVisual from "@/components/Projects/ProjectVisual";
import LightboxVideo from "@/components/Projects/LightboxVideo";
import ShuffleText from "@/components/ReactBits/ShuffleText";
import { useCursor } from "../../context/CursorContext";
import { useBodyScrollLock } from "../../utils/useBodyScrollLock";
import { useDialogFocus } from "../../utils/useDialogFocus";
import { useSwipeNavigation } from "../../utils/useSwipeNavigation";
import { isPreviewWithinRenderWindow } from "../../utils/previewWindow";

const TagList = ({ tags = [] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span key={tag} className="tag">
        {tag}
      </span>
    ))}
  </div>
);

const IconDesktop = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M9 20h6M12 16v4" />
  </svg>
);

const IconPhone = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2.5" width="10" height="19" rx="2" />
    <path d="M11 18.5h2" />
  </svg>
);

const IconExpand = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
    <path d="M3 3l6 6M21 3l-6 6M21 21l-6-6M3 21l6-6" />
  </svg>
);

const IconFullscreen = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
  </svg>
);

const previewLabel = (variant) => (variant === "mobile" ? "Mobile" : "Desktop");

const getProjectPreview = (project, variant = "desktop") => {
  const video = variant === "desktop" ? project.desktopVideo : project.mobileVideo;
  if (video) return { type: "video", src: video };
  if (project.image) return { type: "image", src: project.image };
  return { type: "mockup" };
};

const ProjectMockupFrame = ({ project, variant = "desktop", className = "" }) => {
  const isMobile = variant === "mobile";

  return (
    <div className={`mockup-shell ${isMobile ? "is-mobile" : "is-desktop"} ${className}`}>
      {isMobile ? (
        <>
          <div className="mb-4 h-2 w-16 mx-auto" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.12 }} />
          <div className="space-y-3">
            <div className="h-20 border" style={{ borderColor: "var(--border)" }} />
            <div className="h-3 w-full" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.12 }} />
            <div className="h-3 w-2/3" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.12 }} />
            <div className="grid grid-cols-2 gap-2 pt-4">
              <div className="h-16 border" style={{ borderColor: "var(--border)" }} />
              <div className="h-16 border" style={{ borderColor: "var(--border)" }} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <span className="text-micro" style={{ color: "var(--fg-muted)" }}>
              Desktop
            </span>
            <span className="h-2 w-2" style={{ backgroundColor: project.visual?.accent || "var(--fg-primary)" }} />
          </div>
          <div className="grid h-[calc(100%-2.5rem)] grid-cols-12 gap-3">
            <div className="col-span-4 border" style={{ borderColor: "var(--border)" }} />
            <div className="col-span-8 space-y-3">
              <div className="h-8 w-3/4" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.12 }} />
              <div className="h-3 w-full" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.1 }} />
              <div className="h-3 w-4/5" style={{ backgroundColor: "var(--fg-primary)", opacity: 0.1 }} />
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="h-24 border" style={{ borderColor: "var(--border)" }} />
                <div className="h-24 border" style={{ borderColor: "var(--border)" }} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PreviewSurface = ({ project, variant = "desktop", onOpen, onHover, onLeave, children }) => (
  <button
    type="button"
    className="mockup-preview-trigger group"
    data-cursor-label="Click to open"
    data-cursor-variant="project"
    onClick={(event) => {
      event.stopPropagation();
      onOpen(project, variant);
    }}
    onMouseEnter={() => onHover("Click to open")}
    onMouseLeave={onLeave}
    aria-label={`Open ${previewLabel(variant).toLowerCase()} mockup for ${project.name}`}
  >
    {children}
    <span className="mockup-expand-icon" aria-hidden="true">
      <IconExpand />
    </span>
  </button>
);

const MockupPair = ({ project, onOpenPreview, onHover, onLeave, actions = null }) => (
  <div className="major-expanded-media grid grid-cols-1 lg:grid-cols-[1.5fr_0.7fr] gap-5">
    <div className="major-expanded-desktop-stack">
      <PreviewSurface project={project} variant="desktop" onOpen={onOpenPreview} onHover={onHover} onLeave={onLeave}>
        <ProjectMockupFrame project={project} variant="desktop" className="aspect-[16/10] p-5" />
      </PreviewSurface>
      {actions && (
        <div className="major-expanded-buttons" data-cursor-group="buttons" onClick={(event) => event.stopPropagation()}>
          {actions}
        </div>
      )}
    </div>
    <PreviewSurface project={project} variant="mobile" onOpen={onOpenPreview} onHover={onHover} onLeave={onLeave}>
      <ProjectMockupFrame project={project} variant="mobile" className="mx-auto aspect-[9/16] w-full max-w-[13rem] p-4" />
    </PreviewSurface>
  </div>
);

const flipTransition = {
  duration: 0.58,
  ease: [0.16, 1, 0.3, 1],
};

const ProjectActionLinks = ({ project, className = "" }) => {
  const actions = [
    project.url !== "#" ? { label: "View on GitHub", href: project.url } : null,
    project.liveUrl ? { label: "View website", href: project.liveUrl } : null,
  ].filter(Boolean);

  if (!actions.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`} data-cursor-group="buttons">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="project-action-link"
          data-clickable="true"
          onClick={(event) => event.stopPropagation()}
        >
          <span>{action.label}</span>
        </a>
      ))}
    </div>
  );
};

const chunkProjects = (projects, size = 2) => {
  const rows = [];
  for (let index = 0; index < projects.length; index += size) {
    rows.push(projects.slice(index, index + size));
  }
  return rows;
};

const normalizeSearchValue = (value = "") => value.toString().trim().toLowerCase();

const projectSearchText = (project) => [
  project.name,
  project.repoName,
  project.slug,
  project.category,
  project.subtitle,
  project.description,
  project.longDescription,
  project.status,
  project.currentStatus,
  project.notes,
  project.developerNotes,
  ...(project.tech || []),
  ...(project.toolsUsed || []),
].filter(Boolean).join(" ");

const projectArchiveHref = (project) => {
  if (featuredProjects.some((item) => item.slug === project.slug)) {
    return { href: `/projects/${project.slug}`, external: false };
  }

  const href = project.liveUrl || (project.url !== "#" ? project.url : "/projects");
  return { href, external: href.startsWith("http") };
};

const lightboxStripTransition = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1],
};

const lightboxPanelVariants = {
  enter: (direction) => (
    direction === 0
      ? { y: 24, scale: 0.98, opacity: 0 }
      : { x: direction >= 0 ? "11%" : "-11%", y: 0, scale: 0.985, opacity: 0.76 }
  ),
  center: {
    x: "0%",
    y: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction) => (
    direction === 0
      ? { y: 18, scale: 0.98, opacity: 0 }
      : { x: direction >= 0 ? "-11%" : "11%", y: 0, scale: 0.985, opacity: 0.76 }
  ),
};

const MockupPreviewModal = ({ active, activeIndex, items, direction = 0, isCompactPreview = false, onClose, onNavigate, onToggleVariant }) => {
  const fullscreenRef = useRef(null);
  const suppressStageClickRef = useRef(false);
  const dialogRef = useDialogFocus(Boolean(active));
  const swipeHandlers = useSwipeNavigation({
    enabled: Boolean(active) && items.length > 1,
    onNavigate,
    onSwipe: () => {
      // Some touch browsers dispatch a synthetic click after a completed swipe.
      suppressStageClickRef.current = true;
      window.setTimeout(() => {
        suppressStageClickRef.current = false;
      }, 0);
    },
  });
  useBodyScrollLock(Boolean(active));

  useEffect(() => {
    if (!active) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate(1);
      if (event.key === "ArrowLeft") onNavigate(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, onClose, onNavigate]);

  if (!active) return null;

  const isMobile = active.variant === "mobile";
  const activeKey = `${active.project.slug}-${active.variant}`;
  const safeActiveIndex = Math.max(0, activeIndex);

  const openFullscreen = (event) => {
    event.stopPropagation();
    const target = fullscreenRef.current;
    if (!target) return;

    const fullscreenTarget = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
    fullscreenTarget?.call(target)?.catch?.(() => {});
  };

  const handleStageClick = () => {
    if (suppressStageClickRef.current) {
      suppressStageClickRef.current = false;
      return;
    }

    onClose();
  };

  return (
    <motion.div
      ref={dialogRef}
      className="mockup-lightbox"
      data-cursor-label="Click to close"
      data-cursor-variant="project"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${isMobile ? "Mobile" : "Desktop"} mockup previews`}
      tabIndex={-1}
    >
      <button type="button" className="mockup-lightbox-nav is-prev" onClick={(event) => { event.stopPropagation(); onNavigate(-1); }} aria-label="Previous mockup">
        <span aria-hidden="true">&lsaquo;</span>
      </button>
      <motion.div
        className={`mockup-lightbox-panel ${isMobile ? "is-mobile" : "is-desktop"}`}
        custom={direction}
        variants={lightboxPanelVariants}
        initial={direction === 0 ? "enter" : false}
        animate="center"
        exit="exit"
        transition={lightboxStripTransition}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mockup-lightbox-header">
          <div>
            <p className="text-micro" style={{ color: "var(--fg-muted)" }}>{isMobile ? "Mobile previews" : "Desktop previews"}</p>
            <h3 className="text-body-xl font-light" style={{ color: "var(--fg-primary)" }}>{active.project.name}</h3>
          </div>
          <div className="mockup-lightbox-header-actions" data-cursor-group="buttons">
            <button type="button" className="mockup-lightbox-fullscreen" data-clickable="true" onClick={openFullscreen} aria-label="Open mockup fullscreen">
              <IconFullscreen />
            </button>
            <button type="button" className="mockup-lightbox-close" data-clickable="true" onClick={onClose} aria-label="Close mockup preview">
              &times;
            </button>
          </div>
        </div>

        <div
          className="mockup-lightbox-stage"
          data-cursor-label="Click to close"
          data-cursor-variant="project"
          onClick={handleStageClick}
          aria-label="Mockup preview"
          {...swipeHandlers}
        >
          <motion.div
            className="mockup-lightbox-track"
            animate={{ x: `${safeActiveIndex * -(100 / items.length)}%` }}
            transition={lightboxStripTransition}
            style={{ width: `${items.length * 100}%` }}
          >
            {items.map((item, itemIndex) => {
              const itemPreview = getProjectPreview(item.project, item.variant);
              const itemIsMobile = item.variant === "mobile";
              const shouldRenderPreview = isPreviewWithinRenderWindow(itemIndex, safeActiveIndex, items.length);
              const itemKey = `${item.project.slug}-${item.variant}`;

              return (
                <div
                  key={itemKey}
                  ref={itemKey === activeKey ? fullscreenRef : null}
                  className="mockup-lightbox-strip-item"
                  style={{ width: `${100 / items.length}%` }}
                >
                  {shouldRenderPreview && itemPreview.type === "video" && (
                    <LightboxVideo
                      src={itemPreview.src}
                      isActive={itemKey === activeKey}
                      muted
                      loop
                      playsInline
                      controls
                      onClick={(event) => event.stopPropagation()}
                      className="h-full w-full object-cover"
                      aria-label={`${item.project.name} ${previewLabel(item.variant)} preview video`}
                    />
                  )}
                  {shouldRenderPreview && itemPreview.type === "image" && (
                    <Image src={itemPreview.src} alt={`${item.project.name} ${previewLabel(item.variant)} mockup`} fill sizes="90vw" className="object-contain" />
                  )}
                  {shouldRenderPreview && itemPreview.type === "mockup" && (
                    <ProjectMockupFrame project={item.project} variant={item.variant} className={itemIsMobile ? "h-full w-full p-5" : "h-full w-full p-6"} />
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
        {isCompactPreview && (
          <button
            type="button"
            className="mockup-lightbox-rotate"
            data-clickable="true"
            onClick={(event) => {
              event.stopPropagation();
              onToggleVariant();
            }}
          >
            {isMobile ? "Rotate to view desktop" : "View mobile"}
          </button>
        )}
      </motion.div>
      <button type="button" className="mockup-lightbox-nav is-next" onClick={(event) => { event.stopPropagation(); onNavigate(1); }} aria-label="Next mockup">
        <span aria-hidden="true">&rsaquo;</span>
      </button>
    </motion.div>
  );
};

const MockupChoiceButton = ({ project, onOpenPreview, onHover, onLeave }) => {
  const [isChoosing, setIsChoosing] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("portfolio:cursor-refresh"));
    }, 0);
  }, [isChoosing]);

  return (
    <div
      className={`mockup-choice ${isChoosing ? "is-open" : ""}`}
      data-cursor-group="buttons"
      onMouseLeave={() => {
        onLeave?.();
      }}
    >
      <button
        type="button"
        className="project-action-link mockup-choice-main"
        data-clickable="true"
        onClick={(event) => {
          event.stopPropagation();
          const isCompact = typeof window !== "undefined"
            && window.matchMedia("(max-width: 1023px), (hover: none), (pointer: coarse)").matches;
          if (isCompact) {
            setIsChoosing(false);
            window.dispatchEvent(new CustomEvent("portfolio:cursor-clear"));
            onOpenPreview(project, "mobile");
            return;
          }
          setIsChoosing(true);
          window.dispatchEvent(new CustomEvent("portfolio:cursor-clear"));
        }}
        onBlur={(event) => {
          if (event.currentTarget.parentElement?.contains(event.relatedTarget)) return;
          setIsChoosing(false);
        }}
        onMouseEnter={() => onHover?.("")}
        aria-expanded={isChoosing}
      >
        <IconExpand />
        <span>View mockup</span>
      </button>
      <div className="mockup-choice-options" aria-hidden={!isChoosing}>
        {["desktop", "mobile"].map((variant) => (
          <button
            type="button"
            key={variant}
            className="project-action-link"
            data-clickable="true"
            tabIndex={isChoosing ? 0 : -1}
            onClick={(event) => {
              event.stopPropagation();
              setIsChoosing(false);
              window.dispatchEvent(new CustomEvent("portfolio:cursor-clear"));
              onOpenPreview(project, variant);
            }}
            onMouseEnter={() => onHover?.("")}
          >
            {variant === "mobile" ? <IconPhone /> : <IconDesktop />}
            <span>{variant}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const MajorProjectExpandedCard = ({ project, index, onFlip, onHover, onLeave, onOpenPreview }) => {
  const handleCollapse = (event) => {
    if (event.target.closest?.("a, button, [role='button'], [data-clickable='true']")) return;
    onFlip();
  };

  const handleCollapseKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onFlip();
  };

  return (
    <motion.article
      key={`${project.slug}-expanded`}
      initial={{ opacity: 0, rotateY: -78, scale: 0.985 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      exit={{ opacity: 0, rotateY: 72, scale: 0.985 }}
      transition={flipTransition}
      role="region"
      tabIndex={0}
      aria-label={`Expanded details for ${project.name}. Press Enter or Space to collapse.`}
      data-cursor-label="Click to collapse"
      data-cursor-variant="project"
      onClick={handleCollapse}
      onKeyDown={handleCollapseKeyDown}
      onMouseEnter={() => onHover("Click to collapse")}
      onMouseLeave={onLeave}
      className="major-project-expanded cursor-none"
    >
      <div className="grid h-full grid-cols-1 xl:grid-cols-12 gap-7 p-5 md:p-7 lg:p-8">
        <div className="xl:col-span-4 flex flex-col justify-between gap-6">
          <div>
            <span className="text-micro mb-4 block" style={{ color: "var(--fg-muted)" }}>
              {String(index + 5).padStart(2, "0")} / Expanded
            </span>
            <h3 className="text-display-md font-light mb-4 lg:whitespace-nowrap" style={{ color: "var(--fg-primary)" }}>
              <ShuffleText text={project.name} duration={0.45} shuffleTimes={3} textAlign="left" />
            </h3>
            <p className="text-body-lg mb-5" style={{ color: "var(--fg-secondary)" }}>
              {project.description}
            </p>
            <div className="space-y-4 text-body-sm" style={{ color: "var(--fg-muted)" }}>
              <p>{project.notes}</p>
              <p>
                <span style={{ color: "var(--fg-secondary)" }}>Status: </span>
                {project.status}
              </p>
            </div>
          </div>
          <div className="major-expanded-tags" onClick={(event) => event.stopPropagation()}>
            <TagList tags={project.tech} />
          </div>
        </div>
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="major-expanded-preview-stack">
            <MockupPair
              project={project}
              onOpenPreview={onOpenPreview}
              onHover={onHover}
              onLeave={onLeave}
              actions={<ProjectActionLinks project={project} />}
            />
          </div>
          <div className="major-expanded-mobile-actions" data-cursor-group="buttons" onClick={(event) => event.stopPropagation()}>
            <MockupChoiceButton project={project} onOpenPreview={onOpenPreview} onHover={onHover} onLeave={onLeave} />
            <ProjectActionLinks project={project} />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const MajorProjectCard = ({ project, index, onFlip, onHover, onLeave, dimmed }) => {

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onFlip();
    }
  };

  return (
  <motion.article
    layout
    key={`${project.slug}-collapsed`}
    initial={{ opacity: 0, scale: 0.985 }}
    animate={{ opacity: dimmed ? 0.18 : 1, scale: 1 }}
    transition={flipTransition}
    className={`major-project-card group relative outline outline-1 outline-[var(--border)] cursor-none ${dimmed ? "is-dimmed" : ""}`}
    role="button"
    tabIndex={dimmed ? -1 : 0}
    aria-expanded="false"
    aria-label={`Expand details for ${project.name}`}
    data-cursor-label={dimmed ? undefined : "Click to expand"}
    data-cursor-variant={dimmed ? undefined : "project"}
    onClick={dimmed ? undefined : onFlip}
    onKeyDown={dimmed ? undefined : handleKeyDown}
    onMouseEnter={dimmed ? undefined : () => onHover("Click to expand")}
    onMouseLeave={dimmed ? undefined : onLeave}
  >
    <div className="major-project-visual relative overflow-hidden">
      <ProjectVisual project={project} compact />
    </div>
    <div className="major-card-body">
      <div>
        <span className="text-micro mb-4 block" style={{ color: "var(--fg-muted)" }}>
          {String(index + 5).padStart(2, "0")}
        </span>
        <h3 className="text-display-sm font-light mb-3 lg:whitespace-nowrap" style={{ color: "var(--fg-primary)" }}>
          <ShuffleText text={project.name} duration={0.45} shuffleTimes={3} textAlign="left" />
        </h3>
      </div>
      <div className="major-card-meta">
        <p className="text-body-md major-card-subtitle" style={{ color: "var(--fg-secondary)" }}>
          {project.subtitle}
        </p>
        <div className="major-card-actions" onClick={(event) => event.stopPropagation()}>
          <TagList tags={project.tech} />
          <ProjectActionLinks project={project} />
        </div>
      </div>
    </div>
  </motion.article>
  );
};

export default function ProjectsIndex() {
  const router = useRouter();
  const [flippedCards, setFlippedCards] = useState({});
  const [openProject, setOpenProject] = useState(expandableArchiveProjects[0]?.slug);
  const [activePreview, setActivePreview] = useState(null);
  const [previewDirection, setPreviewDirection] = useState(0);
  const [isCompactPreview, setIsCompactPreview] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const { setCursorText, setCursorVariant, requestCursorRefresh } = useCursor();
  const expandedSlug = Object.keys(flippedCards).find((slug) => flippedCards[slug]);
  const majorProjectRows = useMemo(
    () => chunkProjects(majorProjects, isCompactPreview ? 1 : 2),
    [isCompactPreview]
  );
  const previewItems = useMemo(() => (
    [...featuredProjects, highlightedProject, ...majorProjects, ...expandableArchiveProjects].flatMap((project) => [
      { project, variant: "desktop" },
      { project, variant: "mobile" },
    ])
  ), []);
  const visiblePreviewItems = useMemo(() => (
    activePreview && isCompactPreview ? previewItems.filter((item) => item.variant === activePreview.variant) : previewItems
  ), [activePreview, isCompactPreview, previewItems]);
  const activePreviewIndex = activePreview
    ? visiblePreviewItems.findIndex((item) => item.project.slug === activePreview.project.slug && item.variant === activePreview.variant)
    : -1;
  const normalizedProjectSearch = normalizeSearchValue(projectSearch);
  const matchingProjects = useMemo(() => {
    if (!normalizedProjectSearch) return [];

    return allProjects.filter((project) => (
      normalizeSearchValue(projectSearchText(project)).includes(normalizedProjectSearch)
    ));
  }, [normalizedProjectSearch]);

  useEffect(() => {
    if (!router.isReady) return;
    const queryValue = Array.isArray(router.query.query) ? router.query.query[0] : router.query.query;
    setProjectSearch(queryValue || "");
  }, [router.isReady, router.query.query]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px), (hover: none), (pointer: coarse)");
    const sync = () => setIsCompactPreview(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const toggleFlip = (slug) => {
    setFlippedCards((current) => {
      const isOpen = Boolean(current[slug]);
      return isOpen ? {} : { [slug]: true };
    });
    window.setTimeout(requestCursorRefresh, 0);
    window.setTimeout(requestCursorRefresh, 620);
  };

  const setProjectCursor = useCallback((text) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setCursorText(text);
    setCursorVariant("project");
  }, [setCursorText, setCursorVariant]);

  const closeMajorProject = useCallback(() => {
    setFlippedCards({});
    setProjectCursor("Click to expand");
    window.setTimeout(requestCursorRefresh, 0);
    window.setTimeout(requestCursorRefresh, 620);
  }, [requestCursorRefresh, setProjectCursor]);

  const clearProjectCursor = useCallback(() => {
    setCursorText("");
    setCursorVariant("default");
  }, [setCursorText, setCursorVariant]);

  const openPreview = useCallback((project, variant = "desktop") => {
    setPreviewDirection(0);
    setActivePreview({ project, variant });
    window.setTimeout(requestCursorRefresh, 0);
  }, [requestCursorRefresh]);

  const navigatePreview = useCallback((direction) => {
    setPreviewDirection(direction);
    setActivePreview((current) => {
      if (!current) return current;
      const scopedItems = isCompactPreview ? previewItems.filter((item) => item.variant === current.variant) : previewItems;
      const currentIndex = scopedItems.findIndex((item) => item.project.slug === current.project.slug && item.variant === current.variant);
      const nextIndex = (currentIndex + direction + scopedItems.length) % scopedItems.length;
      return scopedItems[nextIndex];
    });
    window.setTimeout(requestCursorRefresh, 0);
  }, [isCompactPreview, previewItems, requestCursorRefresh]);

  const togglePreviewVariant = useCallback(() => {
    setPreviewDirection(0);
    setActivePreview((current) => (
      current ? { project: current.project, variant: current.variant === "mobile" ? "desktop" : "mobile" } : current
    ));
    window.setTimeout(requestCursorRefresh, 0);
  }, [requestCursorRefresh]);

  const closePreview = useCallback(() => {
    setActivePreview(null);
    clearProjectCursor();
    window.dispatchEvent(new CustomEvent("portfolio:cursor-clear"));
    window.setTimeout(requestCursorRefresh, 0);
  }, [clearProjectCursor, requestCursorRefresh]);

  const submitProjectSearch = useCallback((event) => {
    event.preventDefault();
    const query = projectSearch.trim();
    router.replace(
      {
        pathname: "/projects",
        query: query ? { query } : {},
      },
      undefined,
      { shallow: true, scroll: false }
    );
  }, [projectSearch, router]);

  const clearProjectSearch = useCallback(() => {
    setProjectSearch("");
    router.replace("/projects", undefined, { shallow: true, scroll: false });
  }, [router]);

  const canonicalUrl = `${METADATA.siteUrl.replace(/\/$/, "")}/projects`;
  const projectsJsonLd = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#collection`,
      url: canonicalUrl,
      name: `Projects | ${METADATA.author}`,
      description:
        "A structured project archive by Kingsley Afolabi Aremu covering featured product builds, AI-agent tooling, automation systems, frontend explorations, mobile products, and public GitHub repositories.",
      inLanguage: "en",
      isPartOf: {
        "@id": `${METADATA.siteUrl.replace(/\/$/, "")}/#website`,
      },
      about: {
        "@id": `${METADATA.siteUrl.replace(/\/$/, "")}/#person`,
      },
      mainEntity: {
        "@id": `${canonicalUrl}#project-list`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${canonicalUrl}#project-list`,
      name: "Portfolio projects by Kingsley Afolabi Aremu",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: allProjects.length,
      itemListElement: allProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: featuredProjects.some((item) => item.slug === project.slug)
          ? `${canonicalUrl}/${project.slug}`
          : canonicalUrl,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          description: project.longDescription || project.description,
          keywords: project.tech?.join(", "),
          genre: project.category || project.status || project.currentStatus,
          codeRepository: project.url !== "#" ? project.url : undefined,
          sameAs: [project.url, project.liveUrl].filter((url) => url && url !== "#"),
          creator: {
            "@id": `${METADATA.siteUrl.replace(/\/$/, "")}/#person`,
          },
        },
      })),
    },
  ]).replace(/</g, "\\u003c");

  return (
    <>
      <Head>
        <title>{`Projects | ${METADATA.author}`}</title>
        <meta
          name="description"
          content="A curated project archive by Kingsley Afolabi Aremu, including featured work, major projects, technical builds, and selected public repositories."
        />
        <meta name="keywords" content="Kingsley Aremu projects, iice257 projects, Kingsley Afolabi Aremu GitHub, React portfolio projects, Next.js portfolio projects, AI agent tooling projects, frontend engineering projects, Lagos software engineer projects" />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Projects | ${METADATA.author}`} />
        <meta property="og:description" content="A curated project archive by Kingsley Afolabi Aremu, including featured work, major projects, technical builds, and selected public repositories." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={METADATA.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: projectsJsonLd }}
        />
      </Head>

      <main id="main-content" className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
        <section className="section-container pt-40 pb-24">
          <Link
            href="/"
            className="project-action-link mb-8"
          >
            <span>Back home</span>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-massive font-extralight mb-8 leading-[1.14] pb-[0.18em]" style={{ color: "var(--fg-primary)" }}>
                <ShuffleText text="Projects" duration={0.48} shuffleTimes={3} textAlign="left" />
              </h1>
              <p className="text-editorial font-light max-w-3xl" style={{ color: "var(--fg-secondary)" }}>
                A structured view of product work, agent tooling, implementation studies, and public repositories. Selected work is followed by additional builds and a curated archive.
              </p>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 gap-6">
              <div>
                <span className="text-display-sm font-light block" style={{ color: "var(--fg-primary)" }}>
                  {majorProjectCount}
                </span>
                <span className="text-micro" style={{ color: "var(--fg-muted)" }}>
                  Major projects
                </span>
              </div>
              <div>
                <span className="text-display-sm font-light block" style={{ color: "var(--fg-primary)" }}>
                  {githubProjectCount}
                </span>
                <span className="text-micro" style={{ color: "var(--fg-muted)" }}>
                  Portfolio records
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-container pb-20">
          <form className="project-search-panel" role="search" onSubmit={submitProjectSearch}>
            <div className="project-search-copy">
              <p className="text-micro mb-3" style={{ color: "var(--fg-muted)" }}>
                Archive search
              </p>
              <label htmlFor="project-search" className="project-search-label">
                Find a project by name, stack, status, or product theme.
              </label>
            </div>
            <div className="project-search-controls">
              <input
                id="project-search"
                type="search"
                value={projectSearch}
                onChange={(event) => setProjectSearch(event.target.value)}
                placeholder="Search AI, mobile, PWA, security..."
                className="project-search-input"
                autoComplete="off"
              />
              <button type="submit" className="project-action-link project-search-submit" data-clickable="true">
                <span>Search</span>
              </button>
              {normalizedProjectSearch ? (
                <button
                  type="button"
                  className="project-action-link project-action-link-secondary project-search-clear"
                  data-clickable="true"
                  onClick={clearProjectSearch}
                >
                  <span>Clear</span>
                </button>
              ) : null}
            </div>
          </form>

          {normalizedProjectSearch ? (
            <div className="project-search-results" aria-live="polite">
              <div className="project-search-results-header">
                <p className="text-micro" style={{ color: "var(--fg-muted)" }}>
                  {matchingProjects.length} {matchingProjects.length === 1 ? "match" : "matches"}
                </p>
                <p className="text-body-sm" style={{ color: "var(--fg-secondary)" }}>
                  Showing portfolio entries matching &quot;{projectSearch.trim()}&quot;.
                </p>
              </div>

              {matchingProjects.length ? (
                <div className="project-search-result-list">
                  {matchingProjects.map((project) => {
                    const resultLink = projectArchiveHref(project);
                    const content = (
                      <>
                        <span className="project-search-result-kicker text-micro" style={{ color: "var(--fg-muted)" }}>
                          {project.status || project.currentStatus || project.category || "Project"}
                        </span>
                        <span className="project-search-result-title" style={{ color: "var(--fg-primary)" }}>
                          {project.name}
                        </span>
                        <span className="project-search-result-description" style={{ color: "var(--fg-secondary)" }}>
                          {project.description}
                        </span>
                        <span className="project-search-result-tags">
                          {(project.tech || []).slice(0, 4).map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </span>
                      </>
                    );

                    return resultLink.external ? (
                      <a
                        key={project.slug}
                        href={resultLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-search-result"
                        data-clickable="true"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        key={project.slug}
                        href={resultLink.href}
                        className="project-search-result"
                        data-clickable="true"
                      >
                        {content}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="project-search-empty" style={{ color: "var(--fg-secondary)" }}>
                  No matching projects yet. Try a broader product area or technology.
                </p>
              )}
            </div>
          ) : null}
        </section>

        <section className="section-container pb-32">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
                Featured
              </p>
              <h2 className="text-display-lg font-light" style={{ color: "var(--fg-primary)" }}>
                Premium project pages
              </h2>
            </div>
            <p className="text-body-md max-w-md" style={{ color: "var(--fg-secondary)" }}>
              These four receive the richest treatment and have full writeups.
            </p>
          </div>

          <div
            className="featured-project-grid grid grid-cols-1"
            data-cursor-group="cards"
            data-cursor-label="Click for more details"
            data-cursor-variant="project"
          >
            {featuredProjects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="featured-project-card group block cursor-none"
                data-cursor-label="Click for more details"
                data-cursor-variant="project"
                onMouseEnter={() => setProjectCursor("Click for more details")}
                onMouseLeave={clearProjectCursor}
                onClick={clearProjectCursor}
              >
                <article className={`featured-project-row relative ${index % 2 === 1 ? "is-reversed" : ""}`}>
                  <div className="featured-project-thumb relative overflow-hidden outline outline-1 outline-[var(--border)]">
                    <Image
                      src={project.image || "/project-bg.svg"}
                      alt={project.name}
                      fill
                      className="project-panel-visual object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={index === 0}
                    />
                    <span className="featured-metallic-artifact" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                  <div className="featured-project-copy">
                    <span className="featured-project-kicker text-micro block" style={{ color: "var(--fg-muted)" }}>
                      {String(index + 1).padStart(2, "0")} / Featured
                    </span>
                    <h3
                      className="featured-project-title font-light lg:whitespace-nowrap group-hover:translate-x-2 transition-transform duration-300"
                      style={{ color: "var(--fg-primary)" }}
                    >
                      <ShuffleText text={project.name} duration={0.45} shuffleTimes={3} textAlign="left" />
                    </h3>
                    <p className="featured-project-description max-w-3xl" style={{ color: "var(--fg-secondary)" }}>
                      {project.description}
                    </p>
                    <TagList tags={project.tech} />
                    <span className="project-action-link featured-project-cta" aria-hidden="true">
                      <span>View project</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-container pb-32">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
                Highlight project
              </p>
              <h2 className="text-display-lg font-light" style={{ color: "var(--fg-primary)" }}>
                This site, as a system
              </h2>
            </div>
            <p className="text-body-md max-w-md" style={{ color: "var(--fg-secondary)" }}>
              Moved out of the archive because the portfolio itself carries the strongest technical story.
            </p>
          </div>

          <article className="highlight-project-panel">
            <div className="highlight-project-visual">
              <PreviewSurface project={highlightedProject} variant="desktop" onOpen={openPreview} onHover={setProjectCursor} onLeave={clearProjectCursor}>
                <ProjectMockupFrame project={highlightedProject} variant="desktop" className="aspect-[16/10] p-5" />
              </PreviewSurface>
            </div>

            <div className="highlight-project-copy">
              <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
                Active portfolio system
              </p>
              <h3 className="text-display-md font-light mb-5" style={{ color: "var(--fg-primary)" }}>
                <ShuffleText text={highlightedProject.highlightTitle} duration={0.45} shuffleTimes={3} textAlign="left" />
              </h3>
              <p className="text-body-lg leading-relaxed mb-6" style={{ color: "var(--fg-secondary)" }}>
                {highlightedProject.highlightSummary}
              </p>
              <div className="highlight-project-notes">
                {highlightedProject.highlightNotes.map((note) => (
                  <p key={note} className="text-body-sm" style={{ color: "var(--fg-muted)" }}>
                    {note}
                  </p>
                ))}
              </div>
              <div className="highlight-project-actions">
                <TagList tags={highlightedProject.tech} />
                <ProjectActionLinks project={highlightedProject} />
              </div>
            </div>
          </article>
        </section>

        <section className="section-container pb-32">
          <div className="mb-12">
            <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
              Major
            </p>
            <h2 className="text-display-lg font-light mb-4" style={{ color: "var(--fg-primary)" }}>
              Six more substantial builds
            </h2>
            <p className="text-body-lg max-w-2xl" style={{ color: "var(--fg-secondary)" }}>
              These complete the top ten. Tap or click a card to flip it for tools, status, and notes.
            </p>
          </div>

          <div className="space-y-8" style={{ perspective: "1400px" }}>
            {majorProjectRows.map((rowProjects, rowIndex) => {
              const expandedProject = rowProjects.find((project) => project.slug === expandedSlug);

              return (
                <motion.div
                  key={rowProjects.map((project) => project.slug).join("-")}
                  layout
                className={`major-project-row ${expandedProject ? "is-expanded" : ""}`}
                data-cursor-group="cards"
                data-cursor-label={expandedProject ? "Click to collapse" : "Click to expand"}
                data-cursor-variant="project"
                  transition={flipTransition}
                >
                  {rowProjects.map((project, projectIndex) => {
                    const absoluteIndex = majorProjects.findIndex((item) => item.slug === project.slug);
                    const isExpandedRow = Boolean(expandedProject);

                    return (
                      <MajorProjectCard
                        key={project.slug}
                        project={project}
                        index={absoluteIndex}
                        dimmed={isExpandedRow}
                        onFlip={() => {
                          toggleFlip(project.slug);
                          setProjectCursor(flippedCards[project.slug] ? "Click to expand" : "Click to collapse");
                        }}
                        onHover={setProjectCursor}
                        onLeave={clearProjectCursor}
                      />
                    );
                  })}

                  <AnimatePresence initial={false}>
                    {expandedProject && (
                      <MajorProjectExpandedCard
                        key={expandedProject.slug}
                        project={expandedProject}
                        index={majorProjects.findIndex((project) => project.slug === expandedProject.slug)}
                        onFlip={closeMajorProject}
                        onHover={setProjectCursor}
                        onLeave={clearProjectCursor}
                        onOpenPreview={openPreview}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="section-container pb-32">
          <div className="mb-10">
            <p className="text-micro mb-4" style={{ color: "var(--fg-muted)" }}>
              Archive
            </p>
            <h2 className="text-display-lg font-light mb-4" style={{ color: "var(--fg-primary)" }}>
              Additional work
            </h2>
            <p className="text-body-lg max-w-2xl" style={{ color: "var(--fg-secondary)" }}>
              Expandable records lead with authored product and technical work. Smaller public builds follow as direct, compact links.
            </p>
          </div>

          <div className="border-t" style={{ borderColor: "var(--border)" }}>
            {expandableArchiveProjects.map((project) => {
              const isOpen = openProject === project.slug;

              return (
                <article
                  key={project.slug}
                  className="border-b"
                  style={{ borderColor: "var(--border)" }}
                  data-cursor-group="cards"
                  data-cursor-label={isOpen ? "Click to collapse" : "Click to expand"}
                  data-cursor-variant="project"
                >
                  <button
                    type="button"
                    className="archive-project-toggle relative w-full py-6 pr-12 grid grid-cols-1 md:grid-cols-12 gap-4 text-left group cursor-none"
                    data-cursor-label={isOpen ? "Click to collapse" : "Click to expand"}
                    data-cursor-variant="project"
                    onClick={() => {
                      setOpenProject(isOpen ? null : project.slug);
                      setProjectCursor(isOpen ? "Click to expand" : "Click to collapse");
                      window.setTimeout(requestCursorRefresh, 0);
                      window.setTimeout(requestCursorRefresh, 440);
                    }}
                    onMouseEnter={() => setProjectCursor(isOpen ? "Click to collapse" : "Click to expand")}
                    onMouseLeave={clearProjectCursor}
                    aria-expanded={isOpen}
                    aria-controls={`archive-${project.slug}`}
                  >
                    <span className="text-micro md:col-span-2" style={{ color: "var(--fg-muted)" }}>
                      {String(project.archiveNumber).padStart(2, "0")}
                    </span>
                    <span className="archive-project-title md:col-span-5 min-w-0 text-body-xl font-light md:whitespace-nowrap md:overflow-hidden md:text-ellipsis" style={{ color: "var(--fg-primary)" }}>
                      <ShuffleText text={project.name} duration={0.4} shuffleTimes={2} textAlign="left" />
                    </span>
                    <span className="md:col-span-4 text-body-md" style={{ color: "var(--fg-secondary)" }}>
                      {project.status}
                    </span>
                    <span
                      className={`archive-project-plus text-body-xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      style={{ color: "var(--fg-primary)" }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`archive-${project.slug}`}
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 cursor-none"
                          role="region"
                          data-cursor-label="Click to collapse"
                          data-cursor-variant="project"
                          onClick={() => {
                            setOpenProject(null);
                            setProjectCursor("Click to expand");
                            window.setTimeout(requestCursorRefresh, 0);
                            window.setTimeout(requestCursorRefresh, 440);
                          }}
                          onMouseEnter={() => setProjectCursor("Click to collapse")}
                          onMouseLeave={clearProjectCursor}
                        >
                          <div className="hidden md:block md:col-span-2" />
                          <div className="archive-project-expanded-content md:col-span-10 max-w-4xl">
                            <p className="text-body-lg mb-5 leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
                              {project.description}
                            </p>
                            <div className="archive-project-actions">
                              <TagList tags={project.tech} />
                              <div className="flex flex-wrap items-center gap-3" data-cursor-group="buttons" onClick={(event) => event.stopPropagation()}>
                                <ProjectActionLinks project={project} />
                                <MockupChoiceButton project={project} onOpenPreview={openPreview} onHover={setProjectCursor} onLeave={clearProjectCursor} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}

            {quietArchiveProjects.map((project) => {
              const href = project.liveUrl || project.url;

              return (
                <article key={project.slug} className="archive-project-quiet border-b" style={{ borderColor: "var(--border)" }}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="archive-project-quiet-link grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 py-5 text-left cursor-none"
                    aria-label={`Open ${project.name}`}
                  >
                    <span className="text-micro md:col-span-2" style={{ color: "var(--fg-muted)" }}>
                      {String(project.archiveNumber).padStart(2, "0")}
                    </span>
                    <span className="archive-project-quiet-title md:col-span-5 min-w-0 text-body-lg font-light" style={{ color: "var(--fg-primary)" }}>
                      {project.name}
                    </span>
                    <span className="md:col-span-4 text-body-sm" style={{ color: "var(--fg-muted)" }}>
                      {project.status}
                    </span>
                    <span className="archive-project-quiet-arrow" aria-hidden="true">&nearr;</span>
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <AnimatePresence
        onExitComplete={() => {
          clearProjectCursor();
          window.dispatchEvent(new CustomEvent("portfolio:cursor-clear"));
          requestCursorRefresh();
          window.setTimeout(requestCursorRefresh, 80);
        }}
      >
        {activePreview && (
          <MockupPreviewModal
            active={activePreview}
            activeIndex={activePreviewIndex}
            items={visiblePreviewItems}
            direction={previewDirection}
            isCompactPreview={isCompactPreview}
            onClose={closePreview}
            onNavigate={navigatePreview}
            onToggleVariant={togglePreviewVariant}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
