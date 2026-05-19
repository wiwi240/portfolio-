# Design System: William Mahi Portfolio

## 1. Visual Theme & Atmosphere
A restrained futuristic portfolio with studio-grade clarity, dark zinc surfaces, and asymmetric whitespace. The atmosphere should feel like a calm systems console rather than a gaming dashboard: precise, technical, and editorial. Density is balanced at `5/10`, variance is high at `8/10`, and motion stays controlled at `6/10`. The page should suggest active engineering work without relying on neon, noisy gradients, or sci-fi cliches.

## 2. Color Palette & Roles
- **Deep Dock** (`#06090F`) — Primary page background and darkest field.
- **Raised Hull** (`#0D141D`) — Elevated shells, navigation, and secondary framing surfaces.
- **Signal Glass** (`rgba(13, 19, 29, 0.72)`) — Frosted panels, cards, and UI containers.
- **Cold Paper** (`#F4F7FB`) — Primary text and high-contrast foreground.
- **Steel Mist** (`#A6B3C5`) — Body copy, descriptive text, and supporting interface copy.
- **Quiet Grid** (`rgba(196, 208, 224, 0.12)`) — Borders, dividers, and structural lines.
- **Copper Signal** (`#C67F56`) — Single accent for buttons, focus states, active pills, and key highlights.

## 3. Typography Rules
- **Display:** `Outfit` — tight tracking, compact line-height, used with segmented lines instead of long centered blocks.
- **Body:** `Outfit` — relaxed leading around `1.7–1.8`, max width around `36rem` to `42rem`.
- **Mono:** `JetBrains Mono` — labels, pills, metadata, status markers, and numeric signposts.
- **Banned:** `Inter`, generic serif fonts, and any default browser typography for hero or navigation.

## 4. Component Stylings
- **Buttons:** Pill geometry, tactile press feedback, warm copper fill for primary, smoked glass outline for secondary. No outer neon glow.
- **Panels:** Large radii (`1.7rem–2.4rem`), low-contrast borders, soft glass layering, shadow tinted to the background rather than black-only.
- **Cards:** Use only when hierarchy matters. Prefer section rhythm, rails, and contained surfaces over repeated equal cards.
- **Inputs:** Label above field, roomy field height, subtle frosted background, accent focus ring.
- **Loaders:** Match layout tone and material language. No generic white spinner on plain black.

## 5. Layout Principles
- Hero sections stay asymmetric and left-anchored.
- Use max-width containment around `1380px`.
- Avoid centered landing-page clichés. Let copy sit in a deliberate left column with a supporting technical rail.
- Replace repeated equal card grids with rails, wide carousels, split sections, and contained blocks.
- Maintain clean spatial separation. No overlapping text or decorative layers that compromise reading.

## 6. Motion & Interaction
- Motion is subtle and hardware-accelerated: `transform` and `opacity` only.
- DotField stays quiet when idle and only reacts on interaction.
- Hover states lift by `1–2px` at most.
- Buttons and nav items use premium spring-like easing via the shared cubic-bezier transition.
- Any perpetual motion should read as environmental, not decorative noise.

## 7. Anti-Patterns (Banned)
- No emojis.
- No Inter.
- No pure black (`#000000`).
- No neon purple / blue glow aesthetic.
- No oversized gradient headlines.
- No centered hero layout.
- No three equal feature cards as a default pattern.
- No AI copywriting cliches such as “next-gen”, “seamless”, or “elevate”.
- No overlapping hero layers that make the interface feel broken.
