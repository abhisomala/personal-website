# Abhijit Somala · One Continuous Section

A personal portfolio about building ML systems around tasks people need to finish. Six project records share two views: an authored top-down plan and a linear reading column.

**Preview only:** this Plan Table stage is on `redesign/open-set` in [PR #3](https://github.com/abhisomala/personal-website/pull/3). It has not replaced the current production website. [Open the branch preview](https://abhijit-somala-git-redesign-open-set-abhisomalas-projects.vercel.app).

## Built with Factory

Designed and built with [Factory](https://factory.ai) through a Factory Mission. Abhi directed the work, chose the Architectural Section direction, and approved the content and design decisions. Multiple Droid agents handled design exploration, prototyping, implementation, review, and source-level QA under his direction.

The site includes the same simple credit: “Built with Factory.”

## Explore the work

- **Choose a priority:** People, Agents, Planet, or Scale changes the routing engine's arrangement and brings its lead project to the front.
- **Read the plan:** on JavaScript-capable screens at least 900px wide, the machine becomes the plant room above six project plan figures. Poché walls, door swings, and project-specific evidence distinguish the rooms. OpenSight's section sheet starts lifted.
- **Open a sheet:** activate a plan figure or its title-block mini-map link. A 250ms transform-only lift reveals the existing project article; “Next on route” follows the current reading order. Escape closes the sheet and returns focus to its figure.
- **Inspect a station:** select it or press Enter, then follow the selected-work link to its project record.
- **Patch a gap:** drag a station onto a highlighted route gap, or use the native insertion selector and “Patch.” Shift+Enter on a station focuses that selector.
- **Read your route:** the project articles and plan-figure links follow the actual route order. The circulation line and mini-map re-plot from that same route, with a brief oxide flash on patched segments. The route is a reading order, not a claim that separate projects depend on one another.
- **Use the column:** “List view” reveals the linear articles on wide screens. The column remains the mobile, no-JavaScript, print, and screen-reader foundation, without a second copy of the project content.
- **Restore:** “Restore” returns to the original reading order. Changes last for the open page; they are not saved across reloads.

Ordinary scrolling, fragment links, evidence links, and native disclosures remain the core reading experience.

The drawing-set chrome describes the actual plan, section sheets, and reading route, not a fictional shared system. Project evidence drawings retain their complete static states; matched-pair drawing morphs play at the entered room's door, not through scroll choreography.

**Deferred:** shareable route URLs, view transitions, a designed print artifact, and a cover ritual. The current print fallback is not that future artifact.

## Run locally

No build step or package installation is required. From the repository root:

```sh
python3 -m http.server 8780 --bind 127.0.0.1
```

Open http://127.0.0.1:8780/. If that port already serves this checkout, use the existing server. Otherwise choose an unused local port.

The site is plain HTML, CSS, and JavaScript with local runtime assets and system fonts. External project and profile links open their respective destinations; no external JavaScript library or font service is required to read the portfolio.

## Accessibility and motion

The implementation includes a skip link, native buttons and insertion controls, visible-focus styles, a polite status region, real article headings, named plan links, and a List-view toggle. Changing the reading route moves the existing articles and plan links rather than maintaining a separate visual-only order.

The commitments are:

- **No drag-only actions:** native controls offer the same route insertion without dragging.
- **Reduced motion:** respect `prefers-reduced-motion`, remove the sheet rise and oxide flash, and skip door morphs to their final state.
- **Pause:** provide a motion control without removing project content or route controls.
- **No JavaScript:** keep all six project records, evidence links, contact links, and native disclosures in the authored HTML. Direct project links replace the routing controls. Generated decorative marks need not appear.
- **Native scrolling:** do not take over wheel or touch scrolling. The compact OpenSight drawing scales to the available width without a separate panning surface.

These are implementation commitments, not a claim of verified accessibility conformance. **Rendered browser QA is still pending.** Abhi previews manually; that approval is not a browser test pass. Computed contrast, keyboard and touch interaction, focus retention during reordering, and frame timing still need validation. Safari, physical phones, and real screen-reader output are untested.

## Structure

```text
index.html                       Project records, authored plan, mini-map, metadata
assets/
  engine.js                      Selection, priorities, gap insertion, route state
  section.js                     Article order, plan re-plot, sheet and door interactions
  section.css                    Two-view layout, drawings, responsive and motion rules
  opensight-demo-thumb.jpg        Existing public demo thumbnail
docs/
  DESIGN.md                      Concept, interaction, motion, and content principles
  CHANGELOG.md                   Public-facing design changes
```

`engine.js` owns the route and publishes it through `data-route`. The section shell reads that state; it does not maintain a competing route model. Project IDs remain stable as their displayed positions change. The engine and public demo thumbnail retain the approved previous-stage bytes.

## Checks and deployment

JavaScript syntax can be checked without a browser:

```sh
node --check assets/engine.js
node --check assets/section.js
```

The approved Plan Table stage passed 38 static checks, 21 pure-Node plan checks, and six isolated route-projection checks. Root integration passed runtime parity, syntax, plan/route tests, authored ID/fragment checks, and HTTP 200 with exact body matches for all five runtime files on the localhost preview. These checks do not establish rendering or native-input behavior.

The repository is deployed with Vercel. This stage is feature-branch/PR preview only. Do not merge or promote it to production without separate owner approval. Options A–D and D-plus remain private research artifacts and are not shipped.

Read the [design rationale](docs/DESIGN.md) and [changelog](docs/CHANGELOG.md).
