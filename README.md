# Float

**A little space to think.** An open-source playground for movable AI chat and contextual focus.

Float explores a simple idea: bring the conversation to the work. Drag a compact chat input anywhere on the screen, expand it into a conversation, and soften the surrounding canvas without losing your place.

![Float playground with a movable chat input and content outlines](docs/playground.png)

## Try it

Run the playground locally:

```bash
npm install
npm run dev
```

Requires Node.js 22.12+ and npm. Open the local URL printed by Vite.

## Interactions

- **Move:** drag the dotted handle, or the conversation header. The panel stays inside the visible viewport.
- **Expand:** use the expand button or send a message to open the conversation.
- **Focus:** choose Chat to soften the page, or Area to keep one outlined section sharp. Off restores the canvas.
- **Tune:** adjust the blur from 0 to 12px, or hide the content outlines.
- **Dock:** use the `+` menu to place chat at the bottom left, centre, or right.
- **Reset:** return to the initial canvas and clear the demo conversation.

### Keyboard

| Action                                 | Shortcut           |
| -------------------------------------- | ------------------ |
| Focus the chat input                   | `⌘ K` / `Ctrl K`   |
| Move the focused drag handle           | Arrow keys         |
| Move in larger increments              | Shift + arrow keys |
| Dock the focused handle                | Home               |
| Close the conversation and clear focus | Escape             |

## What this prototype does

This is an **interaction prototype**, with local, predefined replies. No AI provider is connected. Messages remain in React memory in the current tab; refreshing clears them. There is no analytics, remote message storage, account system, or API key field.

The page contains faint outlines instead of document content. Selecting an area associates its name with the conversation; it does not extract document text. The visual blur is an attention aid, not a privacy or redaction feature.

The three-column workspace was inspired by a Pocket interface reference. This implementation uses original Float branding, neutral outline shapes, and no reference screenshots, meeting content, or Pocket assets. It is not affiliated with Pocket.

## Development

```bash
npm test       # geometry and viewport boundary tests
npm run build # TypeScript validation and production bundle
npm run preview
npm run format:check # verify consistent formatting
```

Built with React, TypeScript, Vite, Tailwind CSS, and Lucide icons. Design tokens are declared in `src/styles.css`.

```text
src/
  App.tsx                 Workspace and focus state
  components/Canvas.tsx   Selectable content outlines
  components/Composer.tsx Floating chat and demo conversation
  components/Controls.tsx Shared controls
  hooks/useFloating.ts    Pointer, keyboard, resize, visual viewport
  lib/geometry.ts         Pure bounds and docking calculations
```

`App.tsx` owns the local reply handler. A future integration can replace that handler with a server-backed provider call. Keep API credentials on the server, and explain to users what selected content is being shared before sending it.

## Contributing

Interaction ideas, bug reports, and small pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2026 Charlie Holland.
