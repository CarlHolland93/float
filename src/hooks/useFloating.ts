import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import {
  clampPosition,
  dockPosition,
  type Point,
  type Size,
} from '../lib/geometry';

const viewport = () => ({
  width: window.visualViewport?.width ?? window.innerWidth,
  height: window.visualViewport?.height ?? window.innerHeight,
  x: window.visualViewport?.offsetLeft ?? 0,
  y: window.visualViewport?.offsetTop ?? 0,
});

const constrain = (point: Point, panel: Size) => {
  const view = viewport();
  const clamped = clampPosition(
    { x: point.x - view.x, y: point.y - view.y },
    panel,
    view,
  );
  return { x: clamped.x + view.x, y: clamped.y + view.y };
};

const dockInView = (side: 'left' | 'center' | 'right', panel: Size) => {
  const view = viewport();
  const point = dockPosition(side, panel, view, 24);
  return { x: point.x + view.x, y: Math.max(16, point.y - 24) + view.y };
};

export function useFloating() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(viewport().height);
  const drag = useRef<{ offset: Point; id: number } | null>(null);
  const previousSize = useRef<Size | null>(null);

  const size = useCallback((): Size => {
    const rect = panelRef.current?.getBoundingClientRect();
    return { width: rect?.width ?? 560, height: rect?.height ?? 76 };
  }, []);

  const dock = useCallback(
    (side: 'left' | 'center' | 'right') => {
      setPosition(dockInView(side, size()));
    },
    [size],
  );

  useLayoutEffect(() => {
    const element = panelRef.current;
    if (!element) return;
    const reconcile = () => {
      const next = size();
      const old = previousSize.current;
      setPosition((current) => {
        if (!old) {
          return dockInView('center', next);
        }
        // Keep the bottom edge steady when a conversation opens or closes.
        return constrain(
          { x: current.x, y: current.y + old.height - next.height },
          next,
        );
      });
      previousSize.current = next;
      setViewportHeight(viewport().height);
      setReady(true);
    };
    const observer = new ResizeObserver(reconcile);
    observer.observe(element);
    window.addEventListener('resize', reconcile);
    window.visualViewport?.addEventListener('resize', reconcile);
    window.visualViewport?.addEventListener('scroll', reconcile);
    reconcile();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', reconcile);
      window.visualViewport?.removeEventListener('resize', reconcile);
      window.visualViewport?.removeEventListener('scroll', reconcile);
    };
  }, [size]);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      offset: { x: event.clientX - position.x, y: event.clientY - position.y },
      id: event.pointerId,
    };
    setDragging(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    setPosition(
      constrain(
        {
          x: event.clientX - drag.current.offset.x,
          y: event.clientY - drag.current.offset.y,
        },
        size(),
      ),
    );
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 48 : 12;
    const delta: Record<string, Point> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    if (delta[event.key]) {
      event.preventDefault();
      setPosition((current) =>
        constrain(
          {
            x: current.x + delta[event.key].x,
            y: current.y + delta[event.key].y,
          },
          size(),
        ),
      );
    }
    if (event.key === 'Home') {
      event.preventDefault();
      dock('center');
    }
  };

  return {
    panelRef,
    position,
    dragging,
    ready,
    viewportHeight,
    dock,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
      onKeyDown,
    },
  };
}
