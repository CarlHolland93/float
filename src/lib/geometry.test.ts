import { describe, expect, it } from 'vitest';
import { clampPosition, dockPosition } from './geometry';

const panel = { width: 480, height: 120 };
const viewport = { width: 1280, height: 800 };

describe('clampPosition', () => {
  it('keeps a drag inside the viewport unchanged', () => {
    expect(clampPosition({ x: 300, y: 450 }, panel, viewport)).toEqual({
      x: 300,
      y: 450,
    });
  });

  it('keeps the panel reachable when dragged beyond the top or left', () => {
    expect(clampPosition({ x: -80, y: -40 }, panel, viewport)).toEqual({
      x: 16,
      y: 16,
    });
  });

  it('keeps the entire panel visible beyond the bottom or right', () => {
    expect(clampPosition({ x: 1200, y: 900 }, panel, viewport)).toEqual({
      x: 784,
      y: 664,
    });
  });

  it('brings a previously valid position back into view after resize', () => {
    const position = { x: 700, y: 600 };
    expect(clampPosition(position, panel, viewport)).toEqual(position);
    expect(clampPosition(position, panel, { width: 800, height: 500 })).toEqual(
      { x: 304, y: 364 },
    );
  });

  it('anchors oversized panels at the margin instead of a negative coordinate', () => {
    expect(
      clampPosition({ x: 300, y: 450 }, { width: 1500, height: 900 }, viewport),
    ).toEqual({ x: 16, y: 16 });
  });

  it('clamps an oversized axis independently of a valid axis', () => {
    expect(
      clampPosition({ x: 300, y: 450 }, { width: 1500, height: 120 }, viewport),
    ).toEqual({ x: 16, y: 450 });
  });

  it('honors a caller-provided inset on all boundaries', () => {
    expect(clampPosition({ x: -80, y: 900 }, panel, viewport, 24)).toEqual({
      x: 24,
      y: 656,
    });
  });
});

describe('dockPosition', () => {
  it.each([
    ['left', 16],
    ['center', 400],
    ['right', 784],
  ] as const)('docks %s along the bottom edge', (side, x) => {
    expect(dockPosition(side, panel, viewport)).toEqual({ x, y: 664 });
  });

  it.each(['left', 'center', 'right'] as const)(
    'keeps an oversized panel reachable when docking %s',
    (side) => {
      expect(
        dockPosition(side, { width: 1500, height: 900 }, viewport),
      ).toEqual({ x: 16, y: 16 });
    },
  );

  it('respects the requested inset when docking', () => {
    expect(dockPosition('right', panel, viewport, 24)).toEqual({
      x: 776,
      y: 656,
    });
  });
});
