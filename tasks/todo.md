# Float implementation

## Preserve the selected card during hover

- [x] Keep the selected card and hovered card clear together; blur only the remaining cards.
- [x] Remove the compact input placeholder while preserving its accessible label and controls.
- [x] Verify hover and pointer exit, and refresh the preview.

Browser-verified the selected Notes card stays clear while hovering Overview, with Connections blurred. Leaving Overview returns to Notes-only focus. The compact input has no placeholder and retains its Message accessible label. Production build and formatting checks pass.

## Hover focus

- [x] Keep the hovered card sharp and soften the surrounding cards using the current blur strength.
- [x] Restore the existing chat or selected-area focus on pointer exit; respect Off and avoid sticky hover on touch screens.
- [x] Verify hover, pointer exit, and selected-area behavior in the browser.

Browser-verified hover without selecting a card, moving between cards, return to a selected region on exit, and Off disabling hover blur. The production build passes. Hover styles apply only to devices reporting a fine pointer with hover; touch selection handlers are unchanged.

## Restore content blocks

- [x] Restore the faint overview, notes, and connection blocks with rounded focus regions.
- [x] Keep the current chat controls, panel icons, and 6px workspace frame.
- [x] Verify the visible blocks and focus behavior, and refresh the preview.

Production build and formatting checks passed. The overview, notes, and connection blocks are visible again on desktop and mobile. Selecting a block keeps it sharp while surrounding blocks blur.

## Empty workspace

- [x] Remove the page's placeholder text, tags, and connection diagram while keeping the input controls.
- [x] Show empty selection outlines only when using Area focus.
- [x] Check the empty workspace and area-selection flow on desktop/mobile, and refresh the preview.

Production build passed. Desktop and 390px mobile both show an empty workspace with the input controls intact. Choosing Area reveals selection outlines, selecting a region sets context, and Escape returns to the empty page.

## Collapsed workspace frame

- [x] Match Pocket's filled split-panel icons for the left and right toggles.
- [x] Preserve a slim 6px outer frame and rounded workspace corners when either panel is collapsed, including mobile.
- [x] Check panel toggles and responsive layouts.

Production build passed. Visually checked desktop with both panels collapsed and with one open, plus the frame at 390px mobile width. Panel toggles expose their expanded state and retain the same split-panel icon in either state.

## Pocket composer reference

- [x] Remove the Detailed, Concise, and Rewrite actions and their unused state; retain the clean input and conversation.

- [x] Match the 580px pill, 680px expanded panel, controls, type sizes, and blue/pastel shadow in the supplied references.
- [x] Preserve movement and area focus with unobtrusive drag targets, and use neutral local sample responses.
- [x] Verify compact/expanded layouts and mobile bounds.
- [x] Publish together with the rounded focus-area change. GitHub Pages deployment succeeded and the live interface was checked.

Verified compact edge dragging, keyboard docking, opening and closing the conversation, sending and resetting local messages, feedback, and the Pro selector. Both layouts fit a 390px viewport. TypeScript/production build and all 14 geometry tests pass. Removed the response-style actions from both layouts as requested.

## Rounded focus areas

- [x] Use the shared radius token on all four corners of every focus area; remove square top-corner overrides from Notes and Connections.
- [x] Production build and formatting checks pass; browser inspection confirms rounded upper and lower corners on Notes and Connections.

## Simplification pass

- [x] Remove branding, the Personal space block, peripheral copy, and the Context and Canvas control sections.
- [x] Reduce chat and document decoration to outlines and essential controls.
- [x] Check the simplified desktop/mobile interface and update the preview. Publish through the existing GitHub Pages workflow.

The central outlines and movable input are now the primary content. The right rail contains only focus mode and blur strength. Removed section numbers, taglines, welcome content, the outlines toggle, suggestion chips, and the branded favicon. Area selection remains available from the focus control and the input menu.

Verified the simplified layout at desktop and 390px mobile width; chat submission, expansion, keyboard movement, area selection, and Escape still work. Production build, formatting checks, and 14 geometry tests pass.

- [x] Review the reference and confirm faint content outlines.
- [x] Verify GitHub access and repository availability.
- [x] Build a neutral, responsive three-column shell with content outlines.
- [x] Implement a draggable, keyboard-accessible composer and expandable demo conversation.
- [x] Add chat and area focus, adjustable blur, docking, and reset.
- [x] Verify the build, interaction geometry, and browser flows at desktop and mobile sizes.
- [x] Prepare MIT license, contribution guidance, CI, and publish the public GitHub repository.

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
- Public source: https://github.com/CarlHolland93/float. GitHub Actions builds and publishes the static playground to GitHub Pages.
- npm audit reported zero vulnerabilities after updating the test runner.
