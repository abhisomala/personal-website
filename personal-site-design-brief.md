# Personal Website — Design Concept Brief

## Goal
Build 18 standalone prototype variants of a personal website. Each variant commits to exactly one strong idea and one primary animation mechanic — no variant should combine multiple gimmicks. Each is a complete, working single-page site with these sections at minimum: Hero/Intro, About, Projects/Work, Contact. Content can use placeholder text (Lorem ipsum or generic role/project descriptions) — this pass is about structure, motif, and motion, not final copy.

## Stack
Default: HTML + Tailwind CSS + vanilla JS (or GSAP/Framer Motion CDN where animation requires it). Each variant is self-contained in its own folder so it can be opened independently in a browser.

## Output structure
```
/variants
  /01-terminal
  /02-blueprint
  /03-oscilloscope
  ...
  index.html   <- comparison launcher linking to all 18 variants
```

## Hard rules
- One motif per variant. If a concept description implies two ideas, pick the stronger one and cut the other.
- Animation must serve the motif, not decorate it. If the motif is "terminal," motion = typing/cursor blink, not confetti.
- Respect accessibility basics: contrast, focus states, reduced-motion fallback (`prefers-reduced-motion`).
- Mobile-responsive, even for experimental layouts.

---

## The 18 concepts

1. **Terminal persona** — Site behaves like a CLI shell. Typed commands (or clickable command suggestions) navigate sections. Blinking cursor, monospace only, black/green or black/amber palette.

2. **Living blueprint** — Technical drafting aesthetic. Grid/graph-paper background, sections rendered as annotated schematics of projects, hover reveals dimension lines and notes.

3. **Signal / oscilloscope** — Nav and section dividers rendered as animated waveforms. Scrolling shifts frequency/amplitude. Dark background, single accent trace color.

4. **Orbit system** — Canvas-based. You are the center node; projects are satellites orbiting at different speeds. Click/drag a satellite to open that project.

5. **Paper stack** — Projects are draggable "documents" on a desk, stacked with parallax shadows. Users flip/drag sheets aside to reveal ones underneath.

6. **Kinetic typography only** — No images anywhere. Huge type is the entire interface. Words scale/skew/blur based on scroll velocity and mouse position.

7. **Command palette site** — The whole site defaults to a near-blank screen with a single centered search bar (like VS Code Cmd+K). All content — About, Projects, Contact — is reached via fuzzy search/typed commands.

8. **Cartography** — Personal site as a map/atlas. Projects are "regions" on a stylized map; zooming into a region reveals that project's detail.

9. **CRT boot sequence** — Site "boots" like an old computer (POST screen, loading bars) before revealing content. Persistent subtle scanline/flicker overlay afterward.

10. **Data structure visualization** — The site literally is a tree or linked-list/graph structure representing experience/timeline. Animated traversal (nodes light up in sequence) as the user scrolls or clicks "next."

11. **Circuit board** — Thin animated PCB-trace lines connect sections. Hovering a nav item lights up the literal circuit path to that section.

12. **Raw brutalist, single accent color** — One color total, huge exposed borders/grid lines, deliberately "unstyled HTML" look. Hover states invert foreground/background.

13. **Tape deck / hardware player** — Retro cassette or media-player chrome as the navigation UI. Play/pause/skip controls scroll between sections; a "tape counter" shows scroll position.

14. **Glass depth stack** — Layered glassmorphism panels with real scroll-driven depth-of-field blur — background panels blur more as foreground content comes into focus.

15. **Notebook / marginalia** — Site looks like an annotated lab notebook. Handwritten-style annotations in margins, torn-page section transitions, subtle paper texture.

16. **Constellation** — Dark starfield background. Each project is a star; connecting lines draw themselves into constellations as the user scrolls. Subtle parallax on mouse move.

17. **Isometric room** — A single illustrated isometric room/desk. Clicking objects in the room opens content (laptop = projects, bookshelf = writing/notes, phone = contact).

18. **Weather system** — Background conditions (clear/storm/fog/sunset) shift gradually tied to scroll depth, used as a metaphor for progression through the page.

---

## Per-variant deliverable checklist
- [ ] Hero establishes the motif immediately (within first viewport)
- [ ] One animation mechanic, consistently applied
- [ ] About, Projects, Contact sections present
- [ ] Responsive at 375px, 768px, 1280px
- [ ] `prefers-reduced-motion` fallback
- [ ] No console errors