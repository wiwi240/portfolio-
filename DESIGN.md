# Design System: William Mahi Portfolio

## 1. Visual Theme & Atmosphere
A premium developer portfolio with studio-dark restraint, asymmetrical composition, and precise product-minded hierarchy. Density sits in the balanced range, but the layout variance is intentionally high: split hero, offset content blocks, and structured negative space. Motion stays quiet and engineering-led rather than flashy.

## 2. Color Palette & Roles
- **Obsidian Canvas** (`#0A0C10`) — Primary page background and deepest field color.
- **Engine Room** (`#12161E`) — Elevated surfaces and quiet section lifts.
- **Refraction Surface** (`rgba(18, 22, 30, 0.88)`) — Frosted glass cards, navbar fill, structured panels.
- **Paper Signal** (`#F4F7FB`) — Primary text, buttons, and high-priority labels.
- **Alloy Text** (`#B3BAC7`) — Secondary body copy and explanatory paragraphs.
- **Dim Telemetry** (`#8D96A7`) — Metadata, helper text, placeholders, low-priority labels.
- **Burnt Copper** (`#D4633D`) — Single accent for CTAs, section kickers, focus rings, and live highlights.

## 3. Typography Rules
- **Display:** `Outfit` — Tight tracking, high contrast through weight, never oversized for its own sake.
- **Body:** `Outfit` — Relaxed leading, 65ch reading width, neutral grey calibration.
- **Mono:** `JetBrains Mono` — Labels, numbering, metadata, and small technical callouts.
- **Banned:** `Inter`, generic serif fonts, pure black, large gradient headline text.

## 4. Component Stylings
- **Buttons:** Capsule geometry, tactile hover lift, active compression, no outer glow.
- **Cards:** Large rounded surfaces with subtle glass refraction, inner top border, tinted diffusion shadow.
- **Forms:** Labels above fields, helper text below, single accent focus halo, no floating labels.
- **Project Modules:** Abstract technical visuals built from bars, grids, and structural blocks instead of stock imagery.
- **Navigation:** Slim translucent top bar with restrained blur and monospace spacing rhythm.

## 5. Layout Principles
The hero must remain asymmetric and left-led, with supporting metrics on a separate surface. Section widths should stay contained around `1280px`, and multi-column regions must collapse aggressively to single-column below tablet width. Avoid equal three-column sameness in primary storytelling zones; let one project or one panel carry extra weight.

## 6. Motion & Interaction
Animate only `transform` and `opacity`. Entry animations should stagger upward with `cubic-bezier(0.22, 1, 0.36, 1)` timing. Interaction states should feel physical but quiet: `translateY(-1px)` on hover, `scale(0.985)` on active. Decorative atmospherics are allowed only as soft gradients and fixed-grid texture, never neon or parallax-heavy clutter.

## 7. Anti-Patterns (Banned)
- No emojis
- No `Inter`
- No pure black (`#000000`)
- No neon blue or purple glow language
- No centered hero
- No filler copy such as “scroll to explore”
- No equal-width generic three-card feature row
- No vague AI marketing verbs like “elevate” or “unleash”
- No overlapping content blocks
