import type { ButtonHTMLAttributes, ReactNode } from 'react';

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

export function FloatMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`float-mark ${small ? 'small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6 18V8a2 2 0 0 1 2-2h10M6 12h9M6 18h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
