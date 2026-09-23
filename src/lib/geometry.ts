export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

/** Keep the panel inside the viewport, or its leading edge reachable if oversized. */
export function clampPosition(
  point: Point,
  panel: Size,
  viewport: Size,
  margin = 16,
): Point {
  return {
    x: Math.max(
      margin,
      Math.min(point.x, viewport.width - panel.width - margin),
    ),
    y: Math.max(
      margin,
      Math.min(point.y, viewport.height - panel.height - margin),
    ),
  };
}

export function dockPosition(
  side: 'left' | 'center' | 'right',
  panel: Size,
  viewport: Size,
  margin = 16,
): Point {
  const x =
    side === 'left'
      ? margin
      : side === 'right'
        ? viewport.width - panel.width - margin
        : (viewport.width - panel.width) / 2;

  return clampPosition(
    { x, y: viewport.height - panel.height - margin },
    panel,
    viewport,
    margin,
  );
}
