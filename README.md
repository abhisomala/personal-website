# Abhijit Somala · One Continuous Section

A personal portfolio about building ML systems around tasks people need to finish. Six project records share two views: an authored top-down plan and a linear reading column.

**Preview only:** Plan Table stage 4, with clearer room introductions and a quieter drawing sheet, is on `redesign/open-set` in [PR #3](https://github.com/abhisomala/personal-website/pull/3). It has not replaced the current production website. [Open the branch preview](https://abhijit-somala-git-redesign-open-set-abhisomalas-projects.vercel.app).

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

## Stage 4: air and clarity

Each project now reads **WHAT → MY PART → PROOF**: its full owner-approved introduction, the unchanged responsibility sentence in a labeled row, then the evidence. All six full introductions and plan tags are [quoted verbatim in the design document](docs/DESIGN.md#owner-approved-room-copy). They are approved site copy, not proposals.

The tighter header pairs a cutting-plane hairline with the drawing/scale meta row and a static ghost elevation strip. The strip shares the plan's horizontal coordinates; its heights are schematic, not measured building elevations. It is hidden below 900px and in print. The header A—A mark is removed, eyebrow navigation relocated; the separate foundation stamp remains.

Engine breathing room comes from CSS alone; the engine runtime is unchanged. The tool instructions step back until station hover/focus where `:has()` is supported, with full-weight fallback instructions elsewhere. A static grid, construction datums, ruler ticks, and corner crosses use at most 8% ink. One capability-gated, scroll-coupled ground drift adds subtle movement; reduced motion, no JavaScript, and unsupported browsers keep the ground static.

## The live key plan

The title-block corner is a true miniature of the authored plan, not six generic rectangles. Solid poché, real door gaps, and live route-position numerals retain each room's identity. Its wall, outline, and door-swing paths match the large plan path-for-path. Stage 4 removes the miniature evidence glyphs and reading bead; the big plan retains its evidence drawings.

- **Current:** a section cut-flag at the door and an inverted numeral chip identify the current room.
- **Visited:** the room inks in and stays latched for the open page. Unread rooms use dashed outlines with muted walls; without JavaScript, the map stays solid rather than inventing reading state.
- **Patched:** route numerals update and only changed circulation segments briefly flash oxide.
- **Hover or focus:** the matching large-plan figure cross-highlights and the corner shows its route number and name. The marks are real fragment links, enhanced to sheet controls on wide screens.
- **Correspondence:** the email link is a stamp-chip whose offset shadow registers flat on hover.

Once all six rooms have been visited, a **ROUTE AS VISITED** certificate appears once in the corner. Its room codes preserve actual first-visit order, not the current route order. Opening a sheet counts as a visit, including OpenSight when it arrives already lifted; in the column, the observer latches a visit at half visibility. Reloading clears the visit record.

IntersectionObserver tracks discrete room states without scroll, wheel, or touch listeners. The current-room flag carries position; no bead implies an exact between-room location. The map stays in flow, including on mobile, and print hides it.

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
- **Reduced motion:** respect `prefers-reduced-motion`, remove the sheet rise and oxide flash, keep the underlay static, and skip door morphs to their final state. The current-room flag remains available.
- **Pause:** provide a motion control without removing project content or route controls.
- **No JavaScript:** keep all six project records, evidence links, contact links, and native disclosures in the authored HTML. Direct project links replace the routing controls. Generated decorative marks need not appear.
- **Native scrolling:** do not take over wheel or touch scrolling. The compact OpenSight drawing scales to the available width without a separate panning surface.

These are implementation commitments, not a claim of verified accessibility conformance. **Rendered browser QA is still pending.** Abhi previews manually; that approval is not a browser test pass. Computed contrast, keyboard and touch interaction, focus retention during reordering, and frame timing still need validation. Safari, physical phones, and real screen-reader output are untested.

## Structure

```text
index.html                       Project records, authored plan, mini-map, metadata
assets/
  engine.js                      Selection, priorities, gap insertion, route state
  section.js                     Route, sheet, door, and live key-plan interactions
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

The approved Plan Table stage 4 source passed 53 static checks, 34 pure-Node plan checks, and six isolated route-projection checks. Root integration passed runtime parity, syntax, plan/route tests, five isolated certificate checks, verbatim approved copy, authored IDs/fragments, and HTTP 200 with exact body matches for all five runtime files on localhost. These checks do not establish rendering or native-input behavior.

The repository is deployed with Vercel. This stage is feature-branch/PR preview only. Do not merge or promote it to production without separate owner approval. Options A–D and D-plus remain private research artifacts and are not shipped. `engine-web-1` also remains a private experiment pending owner reaction.

Read the [design rationale](docs/DESIGN.md) and [changelog](docs/CHANGELOG.md).
