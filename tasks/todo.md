# Float implementation

- [x] Review the reference and confirm faint content outlines.
- [x] Verify GitHub access and repository availability.
- [x] Build a neutral, responsive three-column shell with content outlines.
- [x] Implement a draggable, keyboard-accessible composer and expandable demo conversation.
- [x] Add chat and area focus, adjustable blur, docking, and reset.
- [x] Verify the build, interaction geometry, and browser flows at desktop and mobile sizes.
- [ ] Prepare MIT license, contribution guidance, CI, and publish the public GitHub repository.

## Design decisions

- Retain the Pocket reference's layout proportions, soft surfaces, and floating composer; use original neutral branding and no source screenshot content.
- Show only outlines inside the page. Focus controls live in the contextual right rail.
- Keep the composer reachable and draggable with a pointer or keyboard. Escape clears focus and returns to the canvas.
- Use local demo replies. No backend, API key, or private data is required.
- Deliver a standalone React/TypeScript project named Float, with public GitHub source and MIT licensing.

## Verification

- TypeScript and production build passed.
- 14 geometry tests passed, including clamping, resize, oversized panels, and docking.
- Browser checked at 1280×720, 390×844, and 390×420: drag, keyboard movement, send/expand/minimise, selected context, mobile controls, menu placement, and panel bounds.
- Fixed options menu clipping near the top edge, mobile controls covering selection targets, keyboard focus outlines under blur, and mobile source-link naming.
- VisualViewport resize/scroll handling keeps the composer within the visible area; physical-device software keyboard testing remains separate from desktop viewport checks.
- No actual AI integration; replies are visibly marked local demos.
