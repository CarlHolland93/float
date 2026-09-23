import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function PanelIcon({ side }: { side: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect
        x={side === 'left' ? 1.5 : 10}
        y="2.5"
        width="4.5"
        height="11"
        rx="0.5"
        fill="currentColor"
      />
      <rect
        x="1"
        y="2"
        width="14"
        height="12"
        rx="1.5"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  );
}

export function IconButton({
  label,
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </button>
  );
}
