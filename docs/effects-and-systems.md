# Effects, Systems, and Interactivity Inventory

This inventory separates systems currently active on a rendered route from components that remain in the repository but are not currently mounted.

## Global Application Systems

1. **System-first theme initialization (custom):** inline pre-hydration script chooses a stored light/dark preference or the device preference, then the two-state theme control persists later choices.
2. **Page entrance and route transitions (Framer Motion):** initial opacity reveal plus short vertical cross-route transitions, disabled under reduced motion.
3. **Responsive capability detection (custom):** media-query listeners distinguish fine-pointer, mobile, and reduced-motion environments.
4. **Visibility-aware animation pausing (custom):** document visibility and intersection observers pause canvas/WebGL effects when hidden or offscreen.
5. **Snow mode (react-snowfall + custom control):** session-persisted snowfall with theme-aware color and separate mobile/desktop particle counts.
6. **Section URL synchronization (custom):** scroll position updates the canonical section URL; direct section URLs wait for dynamic sections, refresh ScrollTrigger, and land at the intended section.
7. **Accessible page shell (custom):** skip link, route-aware main target, inert locked content, reduced-motion fallbacks, and a dedicated portal root.

## Cursor System

1. **SVG cursor shape morph (custom + GSAP):** default arrow and clickable arrow interpolate between stable SVG paths.
2. **Cursor intent resolver (custom):** central target detection resolves default, clickable, label, preview-label, project, and menu states.
3. **Stationary-pointer refresh (custom):** stored coordinates plus elementFromPoint re-evaluate the target after scroll, resize, focus, transitions, animation, modal changes, and navigation.
4. **Card groups, button groups, and bridge zones (custom):** related dense targets preserve interaction intent across small internal gaps while real controls override labels with the clickable cursor.
5. **Theme-aware cursor labels (custom):** standard labels follow the theme; only Click to open/close use the inverse preview treatment.
6. **Loading cursor (custom + GSAP):** route loading uses the pulsing cursor state.
7. **Welcome tooltip (custom):** localStorage distinguishes first and returning visits for a five-second cursor greeting.
8. **Menu surface cursor (custom):** the menu uses Click, temporarily changes to Nice on its first non-control surface click, and retains clickable cursors over controls.

## Header and Navigation

1. **Progressive wordmark (custom):** KA expands to Kingsley Aremu after the page passes its threshold.
2. **Header progress line (custom):** requestAnimationFrame-driven page progress updates the bottom rule.
3. **Full-screen staggered menu (custom React Bits adaptation):** slide-in panel, staggered links, duplicate vertical text-roll hover, numbering, underlines, social links, Escape close, focus trap, and body scroll lock.
4. **Interactive menu dots (custom Canvas 2D):** animated dot field with theme colors and an enabled pointer trail inside the open menu.
5. **Theme control and snow control (custom):** icon controls with persistent state behavior.

## Hero

1. **TextPressure names (React Bits adaptation, custom optimized):** per-character variable-font weight follows pointer/touch position; mobile locked gestures dispatch a shared pointer event. KINGSLEY has a reduced ceiling, while AREMU reaches the font maximum and adds a subtle pressure-only stroke.
2. **Dark Galaxy backdrop (React Bits + OGL/WebGL):** shader-based star field with tuned density, glow, twinkle, frame rate, pixel budget, visibility pausing, and no mouse interaction.
3. **Light Waves backdrop (React Bits adaptation, Canvas 2D):** spring-grid waves with capped pixel ratio/frame rate, visibility pausing, and interaction only in the locked mobile hero.
4. **Cycling capability mask (custom):** measured-width phrase slot with vertically transitioning previous/current phrases.
5. **Mobile hero lock (custom):** locked immersive name/backdrop state, gesture interception, delayed unlock tooltip, unlock/relock control, and smooth content/header visibility transitions.
6. **Flagged camera-through scroll trial (custom + GSAP ScrollTrigger):** desktop-only pinned hero scales the name beyond the viewport, fades the hero surface, and lets Philosophy rise underneath before releasing to normal document flow. Disabled by the environment flag or reduced motion.
7. **Hero entrance sequence (GSAP):** short staggered name, subtitle, and scroll-cue reveal.
8. **Bottom feather (custom CSS):** light-mode transition strip prevents the Waves canvas from ending abruptly.

## Landing Sections

1. **Philosophy blur progression (custom + GSAP ScrollTrigger):** one staggered word timeline transitions opacity and blur; desktop uses sticky reading space while mobile stays in normal flow.
2. **ShuffleText headings (React Bits adaptation + GSAP):** scroll/hover/tap scrambling with preserved word groups, fixed original character metrics, and clipping constrained to the heading's original width and line count.
3. **Section title clip reveals (GSAP ScrollTrigger):** Skills, Projects, and Experience titles reveal through horizontal clip paths.
4. **Skills float-in and accordion (GSAP + Framer Motion):** each row becomes interactive only after its one-time entrance; panels animate height/opacity and plus rotates to an X.
5. **Experience float-in and accordion (GSAP + Framer Motion):** separator draw-on, one-time content entrance, delayed interaction enablement, hover/focus opening, and animated detail panels.
6. **Featured landing panels (GSAP ScrollTrigger):** alternating image/copy project panels float into view and expose project-detail cursor labels.
7. **View All Projects fill transition (custom CSS):** full-width archive entry uses a vertical inverse-color fill on hover.
8. **Contact reveal (GSAP ScrollTrigger):** heading, body, CTA, and links stagger upward into place.
9. **Contact Waves and cross-section feather (React Bits adaptation + custom CSS):** theme-aware visibility-paused Canvas effect fades in through a direct mask while a deep backdrop-blur feather overlaps the preceding section, preventing a visible horizontal split.
10. **Footer effects (theme split):** dark mode uses a non-interactive Galaxy; light mode uses the hamburger-menu dot field without mouse interaction.
11. **Footer ShuffleText and link underlines (custom/React Bits):** heading scramble and restrained navigation underline reveals.

## Projects Index

1. **Search/filter system (custom):** searches names, stacks, status, descriptions, and themes; returns internal detail links or external repository links with clear empty/reset states.
2. **Featured project rows (custom):** alternating large thumbnail/copy compositions, title shuffle, image scale, copy translation, and View project affordance.
3. **Highlight project preview (custom):** portfolio-system preview surface with mockup opening and project actions.
4. **Major-project card rearrangement (Framer Motion):** projects 5-10 swap a two-card row for one same-frame expanded card, preserving row height and isolating nested controls.
5. **Major mockup preview hover (custom CSS):** frame scale, border response, fullscreen icon movement, and full-surface open hit area.
6. **Expandable archive records (Framer Motion):** projects in the expandable tier open/close inline with height/opacity motion and card-group cursor labels.
7. **Quiet GitHub records (custom):** non-expandable rows link directly to GitHub, use title underline and weight morphs, and show GitHub plus SVG up-right indicators with a View GitHub repo cursor label.
8. **Mockup choice split control (custom):** View mockup expands into desktop/mobile choices and retains its split state while its project panel remains open.
9. **Project search and archive hierarchy (custom data system):** featured, highlighted, major, expandable, quiet, and hidden tiers derive from the shared project data source.

## Project Detail and Preview Systems

1. **Project-number hover reveal (custom CSS):** inactive 01-04 numbers reveal project names and push following numbers naturally; the active number remains fixed.
2. **Previous/next navigation (custom CSS):** arrows move outward and labels gain weight; first/last boundaries become All projects/Other projects list actions.
3. **PreviewSurface (custom):** full image/video/mockup hit area uses Click to open, hover scaling, and a moving fullscreen affordance.
4. **Video control cluster (custom):** Video controls expands into loop, play/pause, fullscreen, and black-and-white controls; active/hovered controls resize and fill without changing layout.
5. **Video behavior (native media APIs + custom state):** loop restarts playback, fullscreen uses vendor-compatible APIs, and grayscale toggles with state-specific icons.
6. **Mockup lightbox gallery (Framer Motion + custom):** opens from the selected item, cycles continuously across the gallery, moves the whole mockup as a directional strip, and preserves desktop/mobile galleries where required.
7. **Mobile lightbox variant flow (custom):** starts with Mobile previews, cycles within the active variant, and switches to landscape-style desktop previews via Rotate to view desktop / View mobile.
8. **Lightbox input/accessibility system (custom hooks):** arrow keys, Escape, swipe navigation, focus trap/restore, body scroll lock, backdrop close, explicit controls, and click propagation boundaries.
9. **Fullscreen preview (Fullscreen API):** all lightbox images, videos, and mockups expose the dedicated fullscreen action.

## Other Active Effects

1. **Scroll progress indicator (GSAP ScrollTrigger):** landing-page progress UI tracks document position.
2. **404 illustration motion (GSAP):** slow milk-spill scale, floating face, and repeating blink timeline.
3. **Image hover scaling and mockup grid visuals (custom CSS):** project imagery and generated fallback mockups use restrained scale, borders, grids, and accent indicators.
4. **Theme-aware focus and hover states (custom CSS):** buttons, links, controls, and navigation preserve keyboard focus and color contrast.

## Bundled but Currently Inactive

1. **MetallicPaint (React Bits WebGL2):** still available and referenced by ProjectVisual only when the unused metallic prop is true; no current route enables it.
2. **ASCIIText (Three.js/Canvas):** component exists but is not mounted.
3. **SplashCursor (WebGL fluid simulation):** component exists but is not mounted.
4. **BackgroundShapes (GSAP):** component exists but is not mounted.
5. **Collaboration scroll section (GSAP):** component exists but is not mounted.
6. **Loader component:** exists but is not mounted; route feedback currently uses the custom cursor and page transition instead.
7. **react-hot-toast dependency:** installed but no current UI imports it.
