# Abhijit Somala · One Continuous Section

A personal portfolio about building ML systems around tasks people need to finish. Six project records sit inside an architectural section: choose a way in, inspect the work, and change its reading order.

## Built with Factory

Designed and built with [Factory](https://factory.ai) through a Factory Mission. Abhi directed the work, chose the Architectural Section direction, and approved the content and design decisions. Multiple Droid agents handled design exploration, prototyping, implementation, review, and source-level QA under his direction.

The site includes the same simple credit: “Built with Factory.”

## Explore the work

- **Choose a priority:** People, Agents, Planet, or Scale changes the routing engine's arrangement and brings its lead project to the front.
- **Inspect a station:** select it or press Enter, then follow the selected-work link to its project record.
- **Patch a gap:** drag a station onto a highlighted route gap, or use the native insertion selector and “Patch.” Shift+Enter on a station focuses that selector.
- **Read your route:** the project articles follow the actual route order. The route is a reading order, not a claim that separate projects depend on one another.
- **Restore:** “Restore” returns to the original reading order. Changes last for the open page; they are not saved across reloads.

Ordinary scrolling, fragment links, evidence links, and native disclosures remain the core reading experience.

The current content/layout stage uses a compact OpenSight scene, one consolidated engine tool row, and quieter project records. **The scroll rework is still to come.** Project drawings are static in this stage; it does not ship between-project morphing or scroll choreography.

## Run locally

No build step or package installation is required. From the repository root:

```sh
python3 -m http.server 8780 --bind 127.0.0.1
```

Open http://127.0.0.1:8780/. If that port already serves this checkout, use the existing server. Otherwise choose an unused local port.

The site is plain HTML, CSS, and JavaScript with local runtime assets and system fonts. External project and profile links open their respective destinations; no external JavaScript library or font service is required to read the portfolio.

## Accessibility and motion

The implementation includes a skip link, native buttons and insertion controls, visible-focus styles, a polite status region, real article headings, and ordinary project links. Changing the reading route moves the existing articles rather than maintaining a separate visual-only order.

The commitments are:

- **No drag-only actions:** native controls offer the same route insertion without dragging.
- **Reduced motion:** respect `prefers-reduced-motion`, stop decorative travel, and show complete static drawing states.
- **Pause:** provide a motion control without removing project content or route controls.
- **No JavaScript:** keep all six project records, evidence links, contact links, and native disclosures in the authored HTML. Direct project links replace the routing controls. Generated decorative marks need not appear.
- **Native scrolling:** do not take over wheel or touch scrolling. The compact OpenSight drawing scales to the available width without a separate panning surface.

These are implementation commitments, not a claim of verified accessibility conformance. Rendered browser QA, computed contrast, keyboard and touch interaction, Safari, physical phones, real screen-reader output, focus retention during reordering, and frame timing still need validation.

## Structure

```text
index.html                       Project records, navigation, metadata, SVG drawings
assets/
  engine.js                      Selection, priorities, gap insertion, route state
  section.js                     Article ordering, selection label, static drawing setup
  section.css                    Layout, drawing styles, responsive and motion rules
  opensight-demo-thumb.jpg        Existing public demo thumbnail
docs/
  DESIGN.md                      Concept, interaction, motion, and content principles
  CHANGELOG.md                   Public-facing design changes
```

`engine.js` owns the route and publishes it through `data-route`. The section shell reads that state; it does not maintain a competing route model. Project IDs remain stable as their displayed positions change.

## Checks and deployment

JavaScript syntax can be checked without a browser:

```sh
node --check assets/engine.js
node --check assets/section.js
```

The current content/layout integration passed source-integrity checks, six isolated route-projection checks, authored ID/fragment checks, and HTTP checks for the page and all four local resources. These checks do not establish rendering or native-input behavior.

The repository is deployed with Vercel. Feature-branch pushes create preview deployments, not production releases. Review and production promotion are separate steps.

Read the [design rationale](docs/DESIGN.md) and [changelog](docs/CHANGELOG.md).
