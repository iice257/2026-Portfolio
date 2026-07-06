# Portfolio Content Inventory

Use this as the copy deck for rewriting the `/projects` page, its project subpages, and the home-page Experience section.

## Projects Page Static Copy

- Browser title: Projects | Kingsley Afolabi Aremu
- Meta description: A structured project archive by Kingsley Afolabi Aremu, including featured work, major projects, and the complete GitHub project list.
- Meta keywords: Kingsley Aremu projects, iice257 projects, Kingsley Afolabi Aremu GitHub, React portfolio projects, Next.js portfolio projects, AI agent tooling projects, frontend engineering projects, Lagos software engineer projects
- Back link: Back home
- H1: Projects
- Intro: A clearer hierarchy of product work, agent tooling, experiments, and public repositories. The top four are the premium featured projects, followed by six major projects and a complete compact archive.
- Stat: 10 / Major projects
- Stat: 50 / GitHub repos covered
- Search eyebrow: Archive search
- Search label: Find a project by name, stack, status, or product theme.
- Search placeholder: Search AI, mobile, PWA, security...
- Search button: Search
- Clear button: Clear
- Search results count label: match / matches
- Search results copy: Showing portfolio entries matching "{query}".
- Empty search copy: No matching projects yet. Try a broader product area or technology.
- Featured eyebrow: Featured
- Featured heading: Premium project pages
- Featured intro: These four receive the richest treatment and have full writeups.
- Featured card kicker pattern: 01 / Featured
- Featured CTA: View project
- Highlight eyebrow: Highlight project
- Highlight heading: This site, as a system
- Highlight intro: Moved out of the archive because the portfolio itself carries the strongest technical story.
- Highlight status label: Active portfolio system
- Major eyebrow: Major
- Major heading: Six more substantial builds
- Major intro: These complete the top ten. Tap or click a card to flip it for tools, status, and notes.
- Archive eyebrow: Complete archive
- Archive heading: Remaining projects
- Archive intro: Everything else is sorted by perceived portfolio relevance first, with sparse forks and reference repos kept lower for completeness.
- Project action link: View on GitHub
- Project action link: View website
- Preview button: View mockup
- Preview labels: Desktop, Mobile, Desktop previews, Mobile previews
- Preview controls: Previous mockup, Next mockup, Open mockup fullscreen, Close mockup preview, Rotate to view desktop, View mobile
- Cursor labels: Click for more details, Click to expand, Click to collapse

## Project Detail/Subpage Shared Copy

- Detail pages exist for featured projects only: FormMate AI, PasteVault, AI Agent Skills, Restore AI.
- Back link: All projects
- Action links: View on GitHub, View website
- Media labels: Mobile, Desktop
- Sidebar eyebrow: Tools used
- Detail block: Concept / Product idea
- Detail block: Problem / What it solves
- Detail block: Solution / How it works
- Detail block: Developer notes / My read on it
- Bottom navigation labels: Previous, Next, Browse, All projects, Other projects
- Lightbox labels: Previous mockup, Next mockup, Open mockup fullscreen, Close mockup preview

## Featured Project Subpages / Premium Projects

### 1. FormMate AI
- Section: Featured / Premium project page
- Slug: formmate-ai
- Repo name: FormMate
- Category: AI productivity
- Subtitle: Controlled AI form completion
- Current status: Prototype direction with the core product model defined in the repo.
- Tags/tech: typescript, ai, voice, automation
- Tools used: TypeScript, Next.js, React, Vercel, AI-assisted workflows, Voice/text intake, Prompt design, Form parsing, Review-first UX, Validation flows, Browser automation patterns, Accessible form states
- Short description: An AI-assisted form companion for completing tedious web forms with reviewable voice or text guidance.
- Long description: FormMate AI helps users move through repetitive web forms faster by pasting a form URL, talking through the required information, and reviewing AI-suggested responses before anything is used. The product is framed around user control, not bulk submission or spam.
- Concept / Product idea: A calm form copilot that turns long forms into a guided conversation while keeping the user in the final decision loop.
- Problem / What it solves: Important forms are slow, repetitive, and easy to abandon, especially when users need to retype the same personal or professional context across many fields.
- Solution / How it works: The app scaffolds draft answers from a conversational intake, lets users regenerate or edit responses, and keeps automation bounded by review-first interactions.
- Notes / My read on it: I like FormMate because boring forms are one of the clearest places AI should save time without taking away control. The hard part is making it helpful without encouraging spammy bulk submission, so the product has to stay review-first and honest about what it can safely automate.
- GitHub/source URL: https://github.com/iice257/FormMate
- Live URL: https://form-mate-ai.vercel.app

### 2. PasteVault
- Section: Featured / Premium project page
- Slug: pastevault
- Repo name: PasteVault
- Category: Productivity utility
- Subtitle: Private installable clipboard
- Current status: Live installable utility with active GitHub updates.
- Tags/tech: javascript, pwa, productivity, clipboard
- Tools used: JavaScript, React, PWA manifest, Service worker patterns, IndexedDB/local storage patterns, Clipboard UX, Searchable snippet storage, Responsive product UI, Share workflows, JSON/text handling, Installable app states, Vercel
- Short description: A private, installable online clipboard for saving, searching, and sharing text, code, links, and JSON across devices.
- Long description: PasteVault is a private, installable online clipboard for saving, searching, and sharing text, code, links, and JSON across devices without messaging yourself. It turns scattered snippets into a lightweight personal vault that works across devices.
- Concept / Product idea: A daily-use clipboard vault for moving useful text, code, links, and structured snippets across devices without noisy workarounds.
- Problem / What it solves: People often message themselves or misuse notes apps just to move small pieces of reusable text between devices, which makes snippets hard to search, organize, or trust.
- Solution / How it works: PasteVault gives those fragments a dedicated installable surface with quick saving, search, and share-oriented retrieval.
- Notes / My read on it: PasteVault is one of those utilities I would actually keep open because it solves the tiny daily friction of sending text to yourself. The product challenge is trust: if it becomes a real cross-device vault, privacy, sync, and search quality need to feel dependable from day one.
- GitHub/source URL: https://github.com/iice257/PasteVault
- Live URL: https://pastevault-lime.vercel.app

### 3. AI Agent Skills
- Section: Featured / Premium project page
- Slug: ai-agent-skills
- Repo name: Skills-quickstarter
- Category: Agent tooling
- Subtitle: Reusable agent workflow system
- Current status: Active personal workflow toolkit.
- Tags/tech: python, codex, agents, automation
- Tools used: Python, Codex skills, Markdown workflow docs, Prompt engineering, Automation playbooks, Parser routing, Research workflows, CLI scripting, Reusable templates, GitHub publishing flows, Skill update utilities
- Short description: A collection of reusable AI-agent skills that speed up research, planning, parsing, publishing, and build workflows.
- Long description: AI Agent Skills is a practical tooling collection for extending AI agents with repeatable workflows. It sits alongside related repos for autoresearch, parser routing, idea launching, publishing, and skill updates, forming a small personal automation ecosystem.
- Concept / Product idea: A reusable library of small, specialized workflows that make agent work less ad hoc and more reliable.
- Problem / What it solves: AI-assisted work gets messy when each task starts from scratch and useful routines are not captured as reusable skills.
- Solution / How it works: The skill collection turns recurring workflows into documented, portable procedures for research, parsing, ideation, updating, and publishing.
- Notes / My read on it: This is personal infrastructure more than a single app, and that is why I keep coming back to it. The best skills make future work faster, but the maintenance risk is real: they need to stay small, current, and specific instead of turning into vague prompt folders.
- GitHub/source URL: https://github.com/iice257/Skills-quickstarter
- Live URL: https://skills-quickstarter.vercel.app

### 4. Restore AI
- Section: Featured / Premium project page
- Slug: restore-ai
- Repo name: RestoreAI
- Category: AI image tools
- Subtitle: Mobile image restoration app
- Current status: Concept/prototype repo.
- Tags/tech: mobile, ai image, restoration, ux
- Tools used: Mobile app patterns, AI image restoration concepts, Upscaling workflows, Recoloring UX, Before/after review, Gallery import flows, Image export states, Mobile-first product design, Accessibility pass, Product prototyping
- Short description: A mobile app concept for restoring, upscaling, resizing, and recoloring damaged or low-quality images.
- Long description: Restore AI is a mobile product for image repair workflows: restoration, upscaling, resizing, and recoloring. It is framed as a practical utility for turning damaged or low-quality images into usable personal or professional assets.
- Concept / Product idea: A focused mobile restoration studio for improving old, damaged, or low-resolution images.
- Problem / What it solves: Image repair tasks are often scattered across technical tools, making simple restoration workflows harder than they should be.
- Solution / How it works: Restore AI packages the most common repair actions into an approachable mobile workflow with clear before/after value.
- Notes / My read on it: Restore AI has obvious emotional value because old or damaged images matter to people. The part I cannot hand-wave is quality and cost: restoration has to be good enough to trust, private enough for personal photos, and efficient enough to run as a real product.
- GitHub/source URL: https://github.com/iice257/RestoreAI

## Highlight Project

### 5. 2026 Portfolio
- Section: Highlight project
- Slug: 2026-portfolio
- Repo name: 2026-Portfolio
- Status: Active portfolio system
- Tags/tech: next.js, performance, interaction design, ci
- Short description: The current portfolio website and the codebase powering this page.
- Notes / My read on it: Included because the portfolio itself shows the product and engineering direction behind the rest of the archive.
- Highlight title: This portfolio as a technical product
- Highlight summary: The portfolio is treated as a product surface: project data, media previews, cursor states, route handling, SEO, validation, and build recovery all live in the same system.
- Highlight note 1: Project records are data-driven, so the archive can change without rebuilding the page structure.
- Highlight note 2: Preview, cursor, route, and keyboard states are handled as part of the interface system.
- Highlight note 3: Validation, security headers, CI, and local build recovery are kept close to the actual portfolio code.
- GitHub/source URL: https://github.com/iice257/2026-Portfolio
- Live URL: https://kingsleyaremu.vercel.app

## Major Projects

### 1. Bountic
- Section: Major project
- Slug: bountic
- Repo name: bountic
- Subtitle: Autonomous USDC bounties
- Status: Exploratory product build
- Tags/tech: crypto, agents, open source
- Short description: A bounty board for funding agent-assisted open-source tasks with USDC.
- Notes / My read on it: The useful part is the incentive model: small tasks, clear payouts, and agent work that still needs human judgment.
- GitHub/source URL: https://github.com/iice257/bountic
- Live URL: https://bountic.vercel.app

### 2. Loop Monitor
- Section: Major project
- Slug: loop-monitor
- Repo name: loop-monitor
- Subtitle: Agent pipeline dashboard
- Status: Local dashboard
- Tags/tech: dashboard, agents, ops
- Short description: A local dashboard for tracking agent runs, bounty queues, and judge results.
- Notes / My read on it: A practical monitoring surface for agent work: what ran, what changed, and what still needs review.
- GitHub/source URL: https://github.com/iice257/loop-monitor

### 3. Rustchain
- Section: Major project
- Slug: rustchain
- Repo name: Rustchain
- Subtitle: Proof-of-Antiquity chain
- Status: Technical concept
- Tags/tech: blockchain, depin, hardware
- Short description: A DePIN concept where vintage hardware participates in a Proof-of-Antiquity network.
- Notes / My read on it: Mostly a systems idea, but the hardware constraint gives it a sharper story than a generic chain demo.
- GitHub/source URL: https://github.com/iice257/Rustchain
- Live URL: https://rustchain.org

### 4. Pages Forward
- Section: Major project
- Slug: pages-forward
- Repo name: Pages-forward-rebuild
- Subtitle: Modern bookstore rebuild
- Status: Second iteration
- Tags/tech: javascript, commerce, frontend, content
- Short description: A rebuilt bookstore surface with clearer browsing, product framing, and commerce intent.
- Notes / My read on it: Useful because it shows iteration: same idea, stronger structure, cleaner product surface.
- GitHub/source URL: https://github.com/iice257/Pages-forward-rebuild

### 5. SignalOps
- Section: Major project
- Slug: signalops
- Repo name: signalops
- Subtitle: Security triage cockpit
- Status: Product cockpit concept
- Tags/tech: typescript, security, ops
- Short description: A security and operations cockpit for triage, status, and action queues.
- Notes / My read on it: The dashboard direction is the point here: compact status, quick scanning, and action-heavy workflows.
- GitHub/source URL: https://github.com/iice257/signalops
- Live URL: https://signalops-orpin.vercel.app

### 6. Unfollowr
- Section: Major project
- Slug: unfollowr
- Repo name: Unfollowr
- Subtitle: Social account hygiene dashboard
- Status: Dashboard build
- Tags/tech: typescript, dashboard, social
- Short description: A dashboard for reviewing follow status, engagement, and cleanup actions.
- Notes / My read on it: A simple product surface around account cleanup: score what matters, queue the action, keep the user in control.
- GitHub/source URL: https://github.com/iice257/Unfollowr

## Remaining Projects / Complete Archive

### 11. Codexoors
- Section: Remaining archive
- Slug: codexoors
- Repo name: Codexoors
- Status: Brand/product page
- Tags/tech: css, waitlist, community
- Short description: Early-access/waitlist experience with original Codexoors branding, identity connection, community tasks, and invite unlocks.
- Notes / My read on it: Strong identity concept; kept near the top for polish potential.
- GitHub/source URL: https://github.com/iice257/Codexoors

### 12. PowergridApp
- Section: Remaining archive
- Slug: powergridapp
- Repo name: PowergridApp
- Status: Product concept
- Tags/tech: mobile, energy, utility
- Short description: Mobile app concept for navigating unreliable power supply in Nigeria with availability, usage, and management guidance.
- Notes / My read on it: Preserves the existing PowerGrid idea in the complete archive.
- GitHub/source URL: https://github.com/iice257/PowergridApp

### 13. DSTRKT
- Section: Remaining archive
- Slug: dstrkt
- Repo name: DSTRKT
- Status: Webstore build
- Tags/tech: html, commerce, brand
- Short description: An eCommerce webstore for the DSTRKT fashion brand.
- Notes / My read on it: Clear client-style commerce surface.
- GitHub/source URL: https://github.com/iice257/DSTRKT
- Live URL: https://dstrkt-site.vercel.app

### 14. Samabi Clinic
- Section: Remaining archive
- Slug: samabiclinic
- Repo name: samabiclinic
- Status: Clinic website
- Tags/tech: typescript, react, healthcare
- Short description: A modern, accessible React-based website for Samabi Functional Medicine Clinic in Port Harcourt.
- Notes / My read on it: Professional service-site work with real-world positioning.
- GitHub/source URL: https://github.com/iice257/samabiclinic

### 15. TikTok Lyric Video Pipeline
- Section: Remaining archive
- Slug: tiktok-lyric-video-pipeline
- Repo name: TikTok-Lyric-Video-Pipeline
- Status: Automation pipeline
- Tags/tech: python, automation, video
- Short description: A modular Python pipeline for producing TikTok-ready lyric videos from licensed audio, timed lyrics, and trend metadata.
- Notes / My read on it: Good systems thinking across intake, scoring, rendering, scheduling, and upload.
- GitHub/source URL: https://github.com/iice257/TikTok-Lyric-Video-Pipeline

### 16. Codex Handoff Plus
- Section: Remaining archive
- Slug: codex-handoff-plus
- Repo name: codex-handoff-plus
- Status: Personal tooling
- Tags/tech: typescript, codex, handoff
- Short description: A personal reliability layer for Codex iMessage handoff.
- Notes / My read on it: Part of the agent workflow ecosystem.
- GitHub/source URL: https://github.com/iice257/codex-handoff-plus

### 17. X Publisher
- Section: Remaining archive
- Slug: x-publisher
- Repo name: x-publisher
- Status: Reusable skill
- Tags/tech: python, skill, publishing
- Short description: A Codex skill for drafting, validating, threading, and opening X composer links.
- Notes / My read on it: Focused automation for social publishing workflows.
- GitHub/source URL: https://github.com/iice257/x-publisher

### 18. Idea Launcher
- Section: Remaining archive
- Slug: idea-launcher
- Repo name: idea-launcher
- Status: Reusable skill
- Tags/tech: python, codex, planning
- Short description: Codex skill that turns rough ideas into build-ready specs, tasks, deploy plans, and starter projects.
- Notes / My read on it: A useful ideation-to-build bridge.
- GitHub/source URL: https://github.com/iice257/idea-launcher

### 19. Autoresearch
- Section: Remaining archive
- Slug: autoresearch
- Repo name: Autoresearch
- Status: Reusable skill
- Tags/tech: research, skill, automation
- Short description: A general-purpose autoresearch skill reusable across software projects.
- Notes / My read on it: Supports repeatable research workflows.
- GitHub/source URL: https://github.com/iice257/Autoresearch

### 20. Minimum Viable Parser
- Section: Remaining archive
- Slug: minimum-viable-parser
- Repo name: Minimum-Viable-Parser
- Status: Reusable skill
- Tags/tech: parser, skill, routing
- Short description: A routing skill that chooses the lightest acquisition/parsing method that can still meet accuracy needs.
- Notes / My read on it: Useful reliability layer for data extraction work.
- GitHub/source URL: https://github.com/iice257/Minimum-Viable-Parser

### 21. Skills Update
- Section: Remaining archive
- Slug: skills-update
- Repo name: Skills-update
- Status: Utility skill
- Tags/tech: python, skills, maintenance
- Short description: A Python utility for updating installed skills.
- Notes / My read on it: Small but relevant to the agent tooling cluster.
- GitHub/source URL: https://github.com/iice257/Skills-update

### 22. Codex iMessage Handoff
- Section: Remaining archive
- Slug: codex-imessage-handoff
- Repo name: codex-imessage-handoff
- Status: Experiment
- Tags/tech: typescript, imessage, codex
- Short description: Work-from-iMessage handoff experiment for Codex workflows.
- Notes / My read on it: Earlier version of the handoff tooling idea.
- GitHub/source URL: https://github.com/iice257/codex-imessage-handoff

### 23. Bounty Hunters
- Section: Remaining archive
- Slug: bounty-hunters
- Repo name: Bounty-Hunters
- Status: Repository
- Tags/tech: bounties, prototype
- Short description: Bounty-related project repository with limited public metadata.
- Notes / My read on it: Grouped near Bountic because of the related bounty theme.
- GitHub/source URL: https://github.com/iice257/Bounty-Hunters

### 24. ILBE Event Page Redesign
- Section: Remaining archive
- Slug: ilbe-event-page-redesign
- Repo name: ILBE-event-page-redesign
- Status: Redesign
- Tags/tech: css, event page, frontend
- Short description: Page redesign for the ILBE event in Ibadan.
- Notes / My read on it: A focused visual redesign exercise.
- GitHub/source URL: https://github.com/iice257/ILBE-event-page-redesign
- Live URL: https://ilbe-event-page-redesign.vercel.app

### 25. Pages Forward Original
- Section: Remaining archive
- Slug: pages-forward-original
- Repo name: Pages-Forward
- Status: Earlier version
- Tags/tech: html, bookstore, commerce
- Short description: The original lighter Pages Forward bookstore website for buying physical books or ebooks and reading in-browser.
- Notes / My read on it: Kept as lineage for the featured rebuild.
- GitHub/source URL: https://github.com/iice257/Pages-Forward
- Live URL: https://pages-forward.vercel.app

### 26. Tickets
- Section: Remaining archive
- Slug: tickets
- Repo name: Tickets
- Status: Frontend exercise
- Tags/tech: html, clone, mobile ui
- Short description: Frontend clone of the Ticketmaster mobile experience built in a single HTML file.
- Notes / My read on it: Useful interaction/UI replication practice.
- GitHub/source URL: https://github.com/iice257/Tickets
- Live URL: https://the-mayhem-tour.netlify.app

### 27. Solana dApp
- Section: Remaining archive
- Slug: solana-dapp
- Repo name: Solana-dApp
- Status: Experiment
- Tags/tech: typescript, solana, web3
- Short description: A light experiment building a Reddit-style dApp on Solana using Amazon Kiro IDE.
- Notes / My read on it: Functional scaffold, not production-ready.
- GitHub/source URL: https://github.com/iice257/Solana-dApp
- Live URL: https://solana-d-app-ten.vercel.app

### 28. Nothing To Watch
- Section: Remaining archive
- Slug: nothing-to-watch
- Repo name: nothing-to-watch
- Status: Visualization experiment
- Tags/tech: typescript, webgl, visualization
- Short description: Experimental WebGL gallery that visualizes tens of thousands of film posters as a Voronoi diagram.
- Notes / My read on it: Technically interesting visual exploration.
- GitHub/source URL: https://github.com/iice257/nothing-to-watch

### 29. Qwen Chat iOS
- Section: Remaining archive
- Slug: qwen-chat-ios
- Repo name: qwen-chat-ios
- Status: Experiment
- Tags/tech: ios, chat, ai
- Short description: iOS chat experiment repository with limited public metadata.
- Notes / My read on it: Kept in the archive because the repo is public but sparse.
- GitHub/source URL: https://github.com/iice257/qwen-chat-ios

### 30. StickerSmash
- Section: Remaining archive
- Slug: stickersmash
- Repo name: StickerSmash
- Status: Learning project
- Tags/tech: typescript, expo, mobile
- Short description: Expo tutorial project completed as a quick hands-on mobile learning exercise.
- Notes / My read on it: Useful as documented learning progression.
- GitHub/source URL: https://github.com/iice257/StickerSmash

### 31. Hyperball Airdrop
- Section: Remaining archive
- Slug: hyperballairdrop
- Repo name: Hyperballairdrop
- Status: Landing page
- Tags/tech: html, airdrop, landing page
- Short description: Small airdrop page built for the Hyperball project.
- Notes / My read on it: Compact campaign-style build.
- GitHub/source URL: https://github.com/iice257/Hyperballairdrop
- Live URL: https://hyperballairdrop.netlify.app

### 32. Ambition Collection
- Section: Remaining archive
- Slug: ambition-collection
- Repo name: Ambition-Collection
- Status: Creative web page
- Tags/tech: html, visual essay, creative
- Short description: A visual essay on the human psyche.
- Notes / My read on it: Editorial/visual exploration.
- GitHub/source URL: https://github.com/iice257/Ambition-Collection
- Live URL: https://ambition-collection.vercel.app

### 33. MHC Architecture Analysis
- Section: Remaining archive
- Slug: mhc-architecture-analysis
- Repo name: Research---MHC-Architecture-Analysis
- Status: Research page
- Tags/tech: html, research, ai
- Short description: Research page about Manifold Constrained Hyperconnections and AI scaling architecture.
- Notes / My read on it: Technical writing and presentation artifact.
- GitHub/source URL: https://github.com/iice257/Research---MHC-Architecture-Analysis
- Live URL: https://mhc-interactive-article-by-ice-on-x.netlify.app

### 34. King's Portfolio
- Section: Remaining archive
- Slug: king-s-portfolio
- Repo name: king-s-portfolio
- Status: Previous portfolio
- Tags/tech: typescript, portfolio, react
- Short description: Previous portfolio website for Kingsley Aremu, showcasing projects and professional experience.
- Notes / My read on it: Useful as portfolio lineage.
- GitHub/source URL: https://github.com/iice257/king-s-portfolio
- Live URL: https://kingsleyaremu.vercel.app

### 35. Val Day Site
- Section: Remaining archive
- Slug: val-day-site
- Repo name: val-day-site
- Status: Small experiment
- Tags/tech: html, single page, creative
- Short description: A simple single-file Valentine's Day website with no framework or build tooling.
- Notes / My read on it: Lightweight creative build.
- GitHub/source URL: https://github.com/iice257/val-day-site
- Live URL: https://val-day-site.vercel.app

### 36. Heads Tails Game
- Section: Remaining archive
- Slug: heads-tails-game
- Repo name: Heads-Tails-Game
- Status: Mini game
- Tags/tech: game, landing page
- Short description: Heads-or-tails game section built as a mini landing-page interaction for BeraKols.
- Notes / My read on it: Small interactive UI piece.
- GitHub/source URL: https://github.com/iice257/Heads-Tails-Game

### 37. StreakMate
- Section: Remaining archive
- Slug: streakmate
- Repo name: Local portfolio data
- Status: Archived concept
- Tags/tech: react, nodejs
- Short description: Cross-platform habit tracking app for daily streaks, smart reminders, and motivational insights.
- Notes / My read on it: Preserved from the previous project data so existing portfolio details are not lost.
- GitHub/source URL: #

### 38. ScoreLog
- Section: Remaining archive
- Slug: scorelog
- Repo name: Local portfolio data
- Status: Archived concept
- Tags/tech: react, nodejs
- Short description: Versatile score tracking application for board games, card games, and competitive activities.
- Notes / My read on it: Preserved from the previous project data so existing portfolio details are not lost.
- GitHub/source URL: #

### 39. Sphinx Nav Fiber
- Section: Remaining archive
- Slug: sphinx-nav-fiber
- Repo name: sphinx-nav-fiber
- Status: Repository
- Tags/tech: experiment
- Short description: Repository with limited public metadata.
- Notes / My read on it: Kept for completeness.
- GitHub/source URL: https://github.com/iice257/sphinx-nav-fiber

### 40. Universe
- Section: Remaining archive
- Slug: universe
- Repo name: universe
- Status: Repository
- Tags/tech: experiment
- Short description: Repository with limited public metadata.
- Notes / My read on it: Kept for completeness.
- GitHub/source URL: https://github.com/iice257/universe

### 41. iice257 Profile
- Section: Remaining archive
- Slug: iice257-profile
- Repo name: iice257
- Status: Profile repo
- Tags/tech: github profile
- Short description: Profile repository for the iice257 GitHub account.
- Notes / My read on it: Included as a public repo, but intentionally low in hierarchy.
- GitHub/source URL: https://github.com/iice257/iice257

### 42. t3chn
- Section: Remaining archive
- Slug: t3chn
- Repo name: t3chn
- Status: Profile/config repo
- Tags/tech: profile, config
- Short description: Config files for a GitHub profile.
- Notes / My read on it: Low-priority repository kept for completeness.
- GitHub/source URL: https://github.com/iice257/t3chn

### 43. ComfyUI Frontend
- Section: Remaining archive
- Slug: comfyui-frontend
- Repo name: ComfyUI_frontend
- Status: Fork/reference
- Tags/tech: frontend, comfyui
- Short description: Official front-end implementation of ComfyUI.
- Notes / My read on it: Appears to be third-party or reference code, so it stays in the compact archive.
- GitHub/source URL: https://github.com/iice257/ComfyUI_frontend

### 44. BlockNote
- Section: Remaining archive
- Slug: blocknote
- Repo name: BlockNote
- Status: Fork/reference
- Tags/tech: react, editor, reference
- Short description: A block-based React rich text editor built on ProseMirror and Tiptap.
- Notes / My read on it: Reference repository rather than a primary portfolio project.
- GitHub/source URL: https://github.com/iice257/BlockNote

### 45. Microsoft Activation Scripts
- Section: Remaining archive
- Slug: microsoft-activation-scripts
- Repo name: Microsoft-Activation-Scripts
- Status: Fork/reference
- Tags/tech: scripts, reference
- Short description: Open-source Windows and Office activation scripts with troubleshooting.
- Notes / My read on it: Listed for completeness only; not promoted as portfolio work.
- GitHub/source URL: https://github.com/iice257/Microsoft-Activation-Scripts

### 46. Deep Learning With Python Notebooks
- Section: Remaining archive
- Slug: deep-learning-with-python-notebooks
- Repo name: deep-learning-with-python-notebooks
- Status: Learning/reference
- Tags/tech: jupyter, learning, reference
- Short description: Jupyter notebooks for code samples from Deep Learning with Python.
- Notes / My read on it: Kept as a learning resource.
- GitHub/source URL: https://github.com/iice257/deep-learning-with-python-notebooks

### 47. Advent of Code
- Section: Remaining archive
- Slug: advent-of-code
- Repo name: Advent-of-Code
- Status: Practice
- Tags/tech: html, javascript, practice
- Short description: Practice repository for Advent of Code JavaScript challenges.
- Notes / My read on it: Learning/practice archive.
- GitHub/source URL: https://github.com/iice257/Advent-of-Code

### 48. apps.apple.com
- Section: Remaining archive
- Slug: apps-apple-com
- Repo name: apps.apple.com
- Status: Reference
- Tags/tech: web clone, reference
- Short description: App Store web version repository.
- Notes / My read on it: Low-priority archive item.
- GitHub/source URL: https://github.com/iice257/apps.apple.com

### 49. Build Your Own X
- Section: Remaining archive
- Slug: build-your-own-x
- Repo name: build-your-own-x
- Status: Reference
- Tags/tech: learning, reference
- Short description: Reference repository for mastering programming by recreating technologies from scratch.
- Notes / My read on it: Included for completeness; not original portfolio work.
- GitHub/source URL: https://github.com/iice257/build-your-own-x

### 50. Medusa Setup
- Section: Remaining archive
- Slug: yt-medusajs-setup
- Repo name: yt-medusajs-setup
- Status: Setup exercise
- Tags/tech: medusa, commerce, setup
- Short description: Setup of a Medusa app.
- Notes / My read on it: Small setup repository.
- GitHub/source URL: https://github.com/iice257/yt-medusajs-setup

### 51. Pix Plot
- Section: Remaining archive
- Slug: pix-plot
- Repo name: pix-plot
- Status: Reference
- Tags/tech: webgl, visualization, reference
- Short description: A WebGL viewer for UMAP or TSNE-clustered images.
- Notes / My read on it: Reference/visualization repo kept in the archive.
- GitHub/source URL: https://github.com/iice257/pix-plot

## Experience Section

- Section eyebrow: EXPERIENCE
- Section heading: Where I've worked

### 01. Frontend Developer
- Company: W3Pets
- Period: JUN 2025 - DEC 2025
- Summary: Built responsive frontend experiences for W3Pets, focusing on clean UI implementation, reusable components, polished user flows, and frontend performance.
- Detail 1: Developed frontend interfaces with attention to layout, responsiveness, and interaction quality.
- Detail 2: Translated product requirements into clean, reusable UI components.
- Detail 3: Improved visual consistency across pages, components, and user journeys.
- Detail 4: Worked across layout structure, state handling, styling, and frontend refinement.
- Stack/tags: React, JavaScript, CSS, Responsive UI, Component Systems

### 02. Freelance Web Designer
- Company: Ice Design Studio
- Period: FEB 2019 - PRESENT
- Summary: Designed and built custom websites for clients, from concept to delivery, with focus on modern interfaces, responsive layouts, and practical business websites.
- Detail 1: Built client websites across portfolio, business, landing page, and service-based use cases.
- Detail 2: Managed multiple concurrent projects, including design direction, revisions, and delivery.
- Detail 3: Created responsive interfaces optimized for mobile, desktop, clarity, and conversion.
- Detail 4: Helped clients turn rough ideas into structured, usable web experiences.
- Stack/tags: React, HTML, CSS, JavaScript, UI Design, Client Delivery

### 03. Web Developer
- Company: GamblePause
- Period: MAY 2024 - SEPT 2024
- Summary: Helped build and maintain the first version of the GamblePause website, supporting the early web presence and refining the frontend experience after launch.
- Detail 1: Contributed to the first public version of the website.
- Detail 2: Helped implement and refine key frontend pages and content sections.
- Detail 3: Maintained the site after launch with updates, fixes, and layout improvements.
- Detail 4: Balanced speed, clarity, and maintainability during early-stage delivery.
- Stack/tags: HTML, CSS, JavaScript, Responsive Design, Website Maintenance

### 04. IT Attendant
- Company: REDACTED
- Period: REDACTED - REDACTED
- Location: REDACTED
- Summary: Provided IT support in a disciplined operational environment, assisting with endpoint support, system access, troubleshooting, and day-to-day technical issue resolution.
- Detail 1: Supported users with technical issues across devices, access, and workplace systems.
- Detail 2: Assisted with hardware, software, and basic network-related troubleshooting.
- Detail 3: Worked in an operations-focused environment where reliability, documentation, and response time mattered.
- Detail 4: Built practical experience across support workflows, escalation, and IT service delivery.
- Stack/tags: IT Support, Troubleshooting, Hardware Management, User Onboarding, Operations

## Experience Practice Block

- Strip item: 5+ years building for the web
- Strip item: Multiple client websites shipped
- Strip item: Frontend, UI, and IT systems experience
- Strip item: Applied AI/ML learning in progress
- Eyebrow: AI & Machine Learning Practice
- Heading: Building AI fluency into product engineering.
- Body: Currently strengthening machine learning foundations through Deep Learning with Python, neural network fundamentals, and applied exploration of modern AI systems.
- Practice point 01: Understand how models learn, fail, and get evaluated.
- Practice point 02: Translate AI concepts into real product UX and reliable systems.
- Practice point 03: Keep the practice grounded in useful tools, not novelty for its own sake.
- Practice tags: Deep Learning, Neural Networks, LLMs, AI Agents, Model Evaluation, Product UX