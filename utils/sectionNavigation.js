export const SECTION_IDS = ["skills", "experience", "contact"];

export const getSectionHref = (sectionId) => {
  if (!sectionId || sectionId === "home") return "/";
  return `/${sectionId}`;
};

export const getRequestedSection = () => {
  if (typeof window === "undefined") return null;

  const sectionId = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return SECTION_IDS.includes(sectionId) ? sectionId : null;
};

export const replaceSectionUrl = (sectionId) => {
  if (typeof window === "undefined") return;

  const nextUrl = sectionId && sectionId !== "home" ? getSectionHref(sectionId) : "/";
  const currentUrl = window.location.pathname;

  if (currentUrl !== nextUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
};

export const getSectionScrollTop = (element) => {
  if (typeof window === "undefined" || !element) return 0;

  const header = document.querySelector("header");
  const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

  return Math.max(0, element.getBoundingClientRect().top + window.scrollY - headerHeight);
};

export const scrollToSection = (sectionId, options = {}) => {
  if (typeof window === "undefined") return false;

  const { behavior = "smooth", updateUrl = true } = options;

  if (!sectionId || sectionId === "home") {
    if (updateUrl) replaceSectionUrl("home");
    window.scrollTo({ top: 0, behavior });
    return true;
  }

  const element = document.getElementById(sectionId);
  if (!element) return false;

  if (updateUrl) replaceSectionUrl(sectionId);
  window.scrollTo({ top: getSectionScrollTop(element), behavior });
  return true;
};
