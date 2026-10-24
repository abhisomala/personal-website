# Architectural Section

## The idea

The portfolio is a drawing set, not a grid of interchangeable cards. An authored top-down plan offers spatial browsing; section sheets reveal the project records. The routing engine is the plant room; six project spaces form the building; the biography and contact area provide its foundation.

Drafting lines, cut hatching, restrained color, and project-specific drawings give the page a shared visual language. Each project gets a distinct drawing that explains something specific about the work. The architecture is a way to read the portfolio, not a literal diagram of a shared software system.

The headline stays direct: **“I build ML systems around tasks people need to finish.”**

### Current stage

The **Plan Table** is a two-view architecture. On JavaScript-capable screens at least 900px wide, six authored plan figures carry poché walls, door swings, and project-specific evidence geometry. The machine sits at the north edge as the plant room. A circulation line visits room doors in the chosen route and ends at the contact boundary. A title-block mini-map uses the same real plan coordinates.

Activating a figure lifts its existing article as a section sheet. OpenSight starts lifted without taking focus or scrolling. “List view” returns to the linear articles. The same column remains the mobile, no-JavaScript, print, and screen-reader foundation; the plan does not duplicate its project content.

Drawing-set chrome is honest about these views and the visitor's reading route. The drawings do not claim a shared software system, measured customer data, or relationships between otherwise separate projects.

This stage is feature-branch/PR preview only. It has not replaced the current production website. Options A–D and D-plus remain private research artifacts, not shipped interfaces.

**Four riders remain deferred:** shareable route URLs, view transitions, a designed print artifact, and a cover ritual. Existing print rules are a fallback, not the deferred print artifact.

### Stage 4: air, clarity, and underlay

Room sheets now lead with **WHAT → MY PART → PROOF**. The owner chose and approved the full introductions below; the existing responsibility sentences remain verbatim under the `MY PART — ` label. Short plan tags identify what each project is before its sheet opens.

The header is tighter, with a larger headline, a cutting-plane hairline and drawing/scale meta row, and a static ghost elevation strip. The strip aligns to the plan's real horizontal coordinates; its heights are schematic proportions of plan depths, not measured building elevations. It is decorative, hidden below 900px and in print. The header A—A mark is removed, eyebrow navigation relocated to `#engine`; the separate foundation stamp remains.

The engine gains breathing room through CSS only, including a viewport-relative world height and a tighter tool rail. Its runtime bytes and route geometry are unchanged. A capability-gated `:has()` rule mutes help until station hover/focus; browsers without that support retain full-weight instructions.

The sheet underlay uses a static grid, construction datums, ruler ticks, and registration crosses, all at or below 8% ink. One `scroll(root)` timeline translates the ground subtly with document progress. It is JavaScript-, capability-, and motion-preference-gated; fallback and reduced-motion states are static. There are no added scroll, wheel, or touch listeners. Datum positions approximate bay insets between breakpoints, so they are atmospheric scaffolding, not measurement evidence.

`engine-web-1` is a separate private experiment pending owner reaction. It is not part of this stage or its runtime.

## How it was built

Abhi directed and approved the work through a [Factory](https://factory.ai) Mission. Multiple Droid agents developed design directions, built prototypes, implemented the chosen direction, reviewed the content and code, and ran source-level QA. Abhi chose Architectural Section and approved the public content and Factory credit.

This is a human-directed, multi-agent design and implementation process. Source review and automated checks are not substitutes for rendered browser, device, or assistive-technology testing.

## Interaction model

The routing engine lets the visitor author a reading order:

1. A priority changes the engine's arrangement and moves its lead project to the front of the current route.
2. Selecting a station inspects its contribution without inserting it elsewhere.
3. Patching removes the selected project from its old position and inserts it into an exact gap, including the beginning or end.
4. Actual article order and plan-figure link order follow that same route. The circulation line and mini-map re-plot from it; changed segments briefly flash oxide before returning to ink. The engine's internal route list remains hidden rather than appearing as another project index.
5. Restoring the route returns the original order and clears the edit count.

An insertion that would leave the order unchanged is a no-op, not a new edit. The route lives in the open page, with no saved cross-visit preference.

`assets/engine.js` owns selection and route state and is byte-identical to the approved previous stage. `assets/section.js` observes `data-route`, moves existing article elements and plan links, and re-plots circulation, the mini-map, and “Next on route” controls. Stable project IDs identify records. The shell attempts to preserve focus if moving an article dislodges it, but that behavior still needs real-browser verification.

Named plan links open or close the corresponding sheet. Escape closes a sheet and returns focus to its plan figure. The List-view toggle exposes all articles as a column without maintaining a second content tree. These are authored behaviors, not claims of verified screen-reader output.

Dragging is optional. The insertion selector and patch button offer a native alternative, including when motion is paused or reduced. Ordinary links provide a route into the work when JavaScript is unavailable.

## The key-plan instrument

The corner is a true miniature of the authored plan. Each room preserves the large plan's wall, outline, and door-swing paths, checked path-for-path. Stage 4 slims the instrument to solid poché, real door gaps, route-position numerals, and the route line, while keeping its live states, readout, and certificate. The miniature evidence glyphs and reading bead are removed; evidence geometry remains on the big plan.

The states describe the open-page visit, not a stored reading history:

- **Unread:** dashed outline and muted walls, gated on JavaScript so the no-JavaScript map remains solid.
- **Visited:** inked and latched after a sheet opens or its article reaches the observer's visibility threshold.
- **Current:** at most one room carries the section cut-flag at the door, inverted numeral chip, and `aria-current`.
- **Patched:** route-position numerals re-key and changed route segments flash oxide.

Hover and focus cross-highlight the corresponding real plan figure and register its route number and name in the corner. Every mark remains a named fragment link, progressively enhanced to sheet activation on wide screens. The correspondence link is a stamp-chip with a transform-only registration effect and pre-rendered shadow states.

When all six rooms have been visited, the corner reveals its **ROUTE AS VISITED** certificate once. Codes come from the visited Set's insertion order, so they retain actual first-visit order rather than masquerading as the current route. Sheet activation counts immediately, including OpenSight when presented already lifted. Column visits latch through the observer. The record is page-local and forgotten on reload; later route patches do not rewrite the certificate.

A shared IntersectionObserver tracks article ratios, latches visits at half visibility, and selects the highest-ratio room in the column. The discrete current flag carries position, including under reduced motion. No bead implies an exact between-room location, and no scroll, wheel, or touch listeners are added.

The instrument remains in the title-block flow rather than becoming a floating overlay. Mobile retains the real miniature and working anchors. Print hides the key plan.

## Project spaces

### Owner-approved room copy

These full introductions and plan tags are approved site copy, quoted verbatim from the manifest-verified stage 4 source:

| Room | Full introduction | Plan tag |
|---|---|---|
| OpenSight | “A voice-first assistant for blind and low-vision users: speak a request, it acts on the live web and speaks the result back.” | VOICE WEB TASKS |
| VT NLP Lab | “An applied NLP research system we built from zero — the first working version became the baseline for everything after.” | APPLIED RESEARCH |
| Nomic AI | “The infrastructure underneath embedding-visualization: the ETL pipelines and visualization systems that let people explore embedding data.” | EMBEDDING INFRASTRUCTURE |
| Production ML | “A live production ML system that surfaces time-sensitive course announcements.” | COURSE ANNOUNCEMENTS |
| Wildfire | “A deep-learning model for predicting wildfire spread, trained on 100K+ NASA VIIRS/MODIS datapoints and deployed on Kubernetes/Helm.” | SPREAD PREDICTION |
| Algal-bloom research | “Research toward detecting harmful algal blooms, using EPA-measured microcystin concentrations as ground truth rather than a proxy.” | BLOOM DETECTION |

### Evidence and its limits

- **OpenSight:** one compact scene places a retained omega-3 topic beside the new budget constraint. Its linked image is an existing public-demo thumbnail, explicitly labeled as such, not a fabricated screenshot or a claimed observed video frame.
- **VT NLP Lab:** exploded floor plates represent building and iterating. They are conceptual construction geometry, not a quantitative score plot.
- **Nomic AI:** an illustrative field sits over its supporting infrastructure. The points are not customer data or observed clusters.
- **Production ML:** two latency lengths share one scale, corresponding to 900 ms before and 500 ms after. Private company and implementation details stay private.
- **Wildfire:** the responsibility line states the confirmed data-pipeline, model-training, and Kubernetes/Helm deployment work. Terrain and satellite swaths illustrate input scope, not measured prediction quality.
- **Algal-bloom research:** a zero-to-one ruler locates the current cross-validation ROC-AUC range of 0.58–0.69. It is not a confidence interval or an operational-readiness claim.

Project records appear in the visitor's chosen order without separate passage preludes. Nomic's illustrative-data disclaimer appears once, next to its drawing.

Each plan figure adapts that room's existing evidence: OpenSight's research/shopping counters and handoff rail, VT's iteration plates, Nomic's illustrative field and supporting plane, Production ML's 900→500 bar ratio, Wildfire's terrain and swaths, and the algae ruler's fixed 0.58–0.69 band. The new plan tags use the approved project descriptions, not new performance claims.

## Motion principles

Motion should explain a change or clarify the reading path, not gate access to content.

- The engine's movement shows a change of priority or route.
- Project evidence drawings retain their complete static states. Only the decorative ground follows document scroll progress through a capability-gated CSS timeline; the key-plan bead is gone.
- A sheet rises for 250ms using only a transform, with a pre-rendered shadow rather than an animated shadow.
- Circulation re-plotting flashes only changed segments in oxide. The title-block mini-map mirrors the same coordinates and route.
- Matched-pair drawing morphs play for 600ms at the entered room's door. They transform a reading instrument, not project data or dependencies. OpenSight has no entry morph.
- Native scrolling remains intact, with no wheel or touch interception.
- Decorative engine animation is suspended when its region is offscreen or the document is hidden.
- Reduced motion removes the sheet rise and oxide flash, keeps the underlay static, and skips door morphs to their final state. The current-room flag remains available. The pause control stops decorative engine movement without removing project records or route controls.
- The no-JavaScript page retains the authored project records and real links even when generated decoration is absent.

Responsive layout and a compact, non-panned OpenSight drawing are authored in CSS. Their presence is not proof of containment, touch behavior, or smoothness on a physical phone.

## Content truth rules

Every public claim should keep its scope and limits close to the evidence:

- Distinguish Abhi's contribution from the wider team's system and credit collaborators where applicable.
- Keep the baseline, unit, and comparison attached to a metric. Relative MAP improvement over the team's own first working version is not an external benchmark.
- Do not turn a demonstrated workflow into a broad capability, evaluation result, or proof of a completed purchase.
- Do not turn input counts or audience reach into model-quality claims.
- Label illustrative drawings and sample fields; never present them as measured data.
- Keep ongoing research, modest results, and evaluation limits explicit.
- Preserve confidentiality rather than inventing an optimization explanation or implementation detail.
- Use real evidence destinations. When there is no public artifact, offer contact rather than a fabricated case study.

The route is a reading aid. Its wires do not assert dependencies, partnerships, or causal relationships between otherwise separate projects.

## Validation boundary

The approved stage 4 source passed 53 static checks, 34 pure-Node plan checks, and six isolated route-projection checks. Root integration passed runtime parity, syntax, plan/route tests, five isolated certificate checks, verbatim approved copy, and authored IDs/fragments. All five runtime files returned HTTP 200 with exact body matches on localhost.

**Rendered browser QA is still pending.** Abhi previews manually; owner approval does not stand in for a browser QA pass. Figure legibility, sheet-lift feel, door-morph staging, native drag and keyboard insertion, focus visibility and retention, status announcements, drawing descriptions, computed contrast, reduced-motion changes, and frame timing remain unverified. Safari, physical phones, and real screen readers are untested.

Do not describe those items as passing until they have actually been tested. No accessibility-conformance or cross-browser-performance claim follows from source checks alone.
