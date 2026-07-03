# Variant enhancement brief

Scope: keep only variants 02 (Living blueprint), 08 (Cartography), 09 (CRT boot), 17 (Isometric room). Delete the other 14 and update the launcher to list only these four. Each variant gets a full depth pass covering layout, exact content placement, interaction states, and animation choreography. The core motif of each stays fixed. This is depth and polish, not a redesign. 17 gets the most detail and should be treated as the priority build.

Use personalization.md as the only source of facts. No invented numbers, no lorem ipsum left anywhere in these four.

---

## 02 — Living blueprint

### Layout
- Full-bleed graph-paper background, fine grid at a small scale (e.g. 8px) with a slightly heavier grid line every 5th line, so it reads as real drafting paper, not a repeating texture.
- Hero: name and tagline set like a drawing title block (bottom-right corner of a technical drawing), with a real title-block border containing name, role, and a "rev" or "date" field for flavor.
- Sections are laid out as separate "sheets" or "drawing views" (About, Experience, OpenSight, Contact), each with its own border and a small drawing-number label (e.g. "SHEET 01/04").

### Content mapping
- About sheet: long bio from personalization.md, rendered like drawing notes, numbered callouts pointing to phrases.
- Experience sheet: Focara, VT NLP lab, Nomic AI as three stacked "components" of an assembly drawing, each with its own dimension line pulled out to the side stating the concrete metric (900ms to 500ms, 40%+ MAP, 250k+ MAU).
- OpenSight sheet: treated as the primary drawing. Full technical breakdown: stack (FastAPI, WebSockets, Gemini/Vertex AI, Deepgram, Google Cloud TTS), the top-10-of-2500 result, the sub-60-second metric, and the validation partners (Blind Institute of Technology, VA DBVI), each pulled out as its own dimension line with a leader line pointing at a labeled "part" of a simplified system diagram.
- Contact sheet: rendered as a small parts list / bill of materials table (Email, GitHub, LinkedIn as three rows).

### Interaction states
- Default: dimension lines are present but faint/collapsed to short stubs.
- Hover on a labeled part or callout: leader line draws out to full length (animated stroke-dasharray reveal, not an instant snap) and the metric label fades/slides in at the end of the line.
- Click on a sheet's title or a project block: sheet expands in place (accordion-style, not a modal) into the fuller technical breakdown described above. Only one sheet expanded at a time.
- Custom cursor: a small crosshair-plus-ruler-tick icon replaces the default cursor within the main canvas area, rotates slightly to track the nearest grid line as the mouse moves near a dimension line.

### Animation choreography
- Leader-line reveal: 300 to 500ms, ease-out, stroke drawn from origin to label point.
- Sheet expand/collapse: height auto-animate, 350ms ease-in-out, content fades in 100ms after the height animation starts.
- Idle: a very subtle "drafting pencil" cursor trail or a faint animated dashed line slowly traveling along one grid line in the background, low opacity, to keep the page from feeling static without being distracting.

### Details
- Every number in the content should visually look like a dimension (small tick marks or arrows on either side of the value), not styled like normal body text.
- Title block should include a fake but plausible drawing scale note (e.g. "SCALE: NOT TO SCALE") for motif commitment.

---

## 08 — Cartography

### Layout
- SVG-based stylized map, hand-drawn/topographic style (contour-line shading, not a literal Google Maps look). Five named regions: About, Experience, OpenSight, a secondary project, Contact.
- Regions are positioned like territories on the map with distinct shapes and a small compass rose and legend in a corner for motif commitment.
- A "You are here" marker sits at a starting region (About) on load.

### Content mapping
- About region: short + long bio, positioned as the "capital" region, largest on the map.
- Experience region: three sub-locations within the region (Focara, VT NLP lab, Nomic AI), each a small settlement/marker with its own metric label.
- OpenSight region: the largest secondary region, styled as a landmark (mountain, monument, or similar single large icon), holding the full project detail (validation partners, metrics, stack, link).
- Secondary project region: algae bloom or wildfire (pick one), smaller region, single paragraph plus its metric.
- Contact region: styled as a "port" or "border crossing," holding email, GitHub, LinkedIn.

### Interaction states
- Default: map shows all five regions at low zoom with labels visible.
- Hover on a region: region highlights (border glow or fill shift), a tooltip preview shows a one-line summary.
- Click on a region: camera pans and zooms into that region (see animation section), revealing its full content inset. A visible "route line" draws itself from the previous region (or the "You are here" marker) to the newly selected one, like a travel path being plotted.
- A persistent small "back to map" control (styled as a compass or zoom-out icon) returns to the full-map view with a reverse zoom-out animation.

### Animation choreography
- Zoom/pan: CSS transform scale + translate on the SVG viewBox or a wrapping container, 500 to 700ms, ease-in-out. This must be a real pan-and-zoom, not a cut or opacity crossfade.
- Route line draw: stroke-dasharray reveal timed to roughly match the zoom duration, so the line "arrives" at the destination as the zoom completes.
- Idle: a very slow, subtle drift/parallax on background contour lines when the mouse moves, low amplitude.

### Details
- Legend should include real fake-cartography elements: a scale bar, a compass rose, maybe a border/coastline treatment, to keep the motif credible rather than decorative.
- Region shapes should feel intentional (mountains for the flagship project, a coastal/port shape for contact) rather than uniform blobs.

---

## 09 — CRT boot

### Layout
- Full CRT-styled canvas: monospace throughout, dark background, single accent color (green or amber, pick one and stay consistent).
- Boot sequence plays on load (skippable via keypress or click), followed by a terminal-style main view with a persistent command line at the bottom and scrollback content above.

### Content mapping
- Boot log lines should reference real facts as fake system-init messages, for example: "LOADING EXPERIENCE... [FOCARA, VT NLP LAB, NOMIC AI]", "MOUNTING PROJECT: OPENSIGHT", "CONTACT MODULE READY", ending on a prompt like "TYPE 'help' OR SELECT A COMMAND".
- Main terminal view supports commands/clickable equivalents: about, experience, projects, contact, help. Each prints its section content into the scrollback in terminal style (typed-out effect, not instant).
- about: long bio.
- experience: Focara, VT NLP lab, Nomic AI, each with its concrete metric.
- projects: OpenSight first with full detail (metrics, stack, validation partners, link), then the secondary project as a shorter entry.
- contact: email, GitHub, LinkedIn as a simple list.

### Interaction states
- Default: boot sequence auto-plays once per session (not on every scroll/reload within the same visit), skip available immediately.
- Command entry: user can type a command and press enter, or click a listed command word, both should work.
- Invalid command: prints a short "command not found. type help" style response, doesn't break anything.
- Scrollback persists as more commands are run, most recent output at the bottom, auto-scrolls into view.

### Animation choreography
- Boot lines: appear one at a time with a short delay between lines (staggered, not all at once), optional brief "loading bar" ASCII effect on one or two lines.
- Command output: typewriter reveal per line, fast enough to not annoy on repeat visits (target under 1 to 1.5s for a typical section, not a slow crawl).
- CRT effect layer: persistent scanlines plus a very subtle flicker/jitter that reacts slightly to activity (e.g. a slightly stronger flicker for a moment right when new text prints), rather than a static constant overlay.

### Details
- Cursor should blink at the command line at all times when idle.
- Consider a `whoami` or similar easter-command that prints just the tagline, small personality touch consistent with the terminal motif.

---

## 17 — Isometric room (priority build, most detail)

This is the flagship variant. Every element below should be treated as a real requirement, not optional flavor.

### Scene composition
- Single isometric room, consistent 2:1 isometric projection throughout (all objects share the same projection angle, no mismatched perspective between elements).
- Room contains, at minimum: a desk with a laptop, a monitor (secondary project), a bookshelf, a phone (or a wall-mounted item functioning as contact), a chair, a window, and one or two ambient decorative objects (a plant, a mug, a framed item on the wall) purely for scene richness, non-interactive.
- Lighting should read as a single consistent light source (e.g. window light), with soft shadows cast in the same direction from every object, not flat/shadowless shapes.
- Color palette should be limited and deliberate (3 to 5 core colors plus neutrals), not a rainbow of object colors, so it reads as one designed room rather than clip art assembled together.

### Object-to-content mapping
- **Laptop screen** -> OpenSight. Click zooms the camera into the laptop screen itself, which displays the project detail: what it is, the top-10-of-2500 result, the sub-60-second metric, stack, validation partners, and the GitHub link, styled like an actual on-screen UI (not a plain popup box).
- **Monitor** -> secondary project (algae bloom or wildfire, pick one), same click-to-zoom-into-screen treatment, shorter content.
- **Bookshelf** -> experience. Click zooms toward the shelf, and books or folders on it become the three roles (Focara, VT NLP lab, Nomic AI) with metrics, e.g. each "book spine" is labeled and clicking a specific book opens that specific role's detail.
- **Whiteboard or notebook on the desk** -> About/bio. Click zooms in and reveals the long bio as if it's written/pinned there.
- **Phone or a wall-mounted card/frame** -> Contact. Click reveals email, GitHub, LinkedIn.
- Decorative objects (plant, mug, window, wall art) are not clickable and should not have hover states that imply they are, to avoid false affordances.

### Interaction states
- **Idle state (before any click):** the room should feel alive, not static. Include at least: a blinking cursor or subtly shifting glow on the laptop screen, a very slow ambient light drift (e.g. window light shifting brightness slightly over 10 to 20 seconds), and subtle parallax where the whole room shifts a few pixels opposite to mouse movement, reinforcing depth.
- **Hover on a clickable object:** the object should lift slightly (small translateY plus a soft glow or outline) and the cursor should change to indicate it's interactive. A small label (e.g. "OpenSight") can appear near the object on hover as a preview.
- **Click on an object:** camera performs a zoom/pan move toward that object (scale + translate the whole scene, keeping the isometric framing intact) until the object's content fills most of the viewport. This should feel like moving into the room, not like a modal popping open on top of it.
- **Returning:** a clear, consistent "back" control (could be a small arrow or a re-click on empty space) zooms back out to the full room view, reversing the same camera motion.
- Only one object's content should be open/zoomed at a time.

### Animation choreography
- Camera zoom-in: 500 to 800ms, ease-in-out, scale and translate together so the target object ends up centered and enlarged, not just a hard cut.
- Camera zoom-out: same duration, reverse easing, returning exactly to the original room framing.
- Hover lift: 150 to 200ms, small (a few px), consistent across all interactive objects so it reads as one interaction language.
- Idle ambient motion: slow, continuous, low-amplitude. Nothing should move fast or often in the idle state, the point is a living room, not a busy one.
- All camera and hover motion must degrade gracefully under prefers-reduced-motion: keep state changes (what content shows) but replace camera pans/zooms with instant or near-instant opacity transitions, and disable idle ambient motion entirely.

### Detail and polish requirements
- The laptop screen content, when zoomed into, should look like a believable on-screen interface (a simple browser-window or app-window chrome around the OpenSight content), not plain text floating over the laptop shape.
- The bookshelf books/folders should be visually distinct from each other (slightly different heights/colors) so it's clear there are three separate clickable items, not one shelf-shaped button.
- Add one small signature/personality touch to the scene that isn't tied to any content section, something that makes the room feel specifically like this person's desk rather than a generic stock isometric illustration (for example, a small desk object referencing OpenSight/accessibility work, or a nameplate on the desk). Keep it subtle and non-interactive.
- Mobile: since true camera pan/zoom on a small viewport can be disorienting, the mobile version can simplify the zoom-in transition to a straightforward scale-up-and-recenter rather than a long camera move, but the room, objects, and click-to-reveal structure must remain intact, not replaced with a plain list.

---

## Shared rules across all four
- Use personalization.md as the single source of content. No lorem ipsum should remain anywhere in these four variants.
- Every new animation must be motif-consistent (blueprint = precise/technical motion, cartography = travel/pan motion, CRT = boot/terminal motion, isometric room = ambient/spatial motion). No generic fade-ins bolted on for the sake of "more animation."
- Keep prefers-reduced-motion fallbacks working and correct for both old and new animations, including the new ones described above.
- Keep responsive behavior at 375px/768px/1280px after content and interactivity increase. Verify each new interaction (leader lines, map zoom, terminal commands, room camera) actually works on a 375px viewport, not just that it doesn't crash.
- No new console errors introduced by any of the above.