import { Check, Crosshair } from 'lucide-react';

export const regions = ['Overview', 'Notes', 'Connections'] as const;

export function Canvas({
  selected,
  picking,
  blurred,
  onSelect,
}: {
  selected: number | null;
  picking: boolean;
  blurred: boolean;
  onSelect: (region: number) => void;
}) {
  if (!picking && selected === null) return null;

  return (
    <div className={`document ${picking ? 'is-picking' : ''}`}>
      <div className="document-regions">
        {regions.map((name, index) => (
          <button
            type="button"
            key={name}
            aria-label={`Focus ${name.toLowerCase()} area`}
            aria-pressed={selected === index}
            onClick={() => onSelect(index)}
            className={`document-region ${selected === index ? 'is-selected' : ''} ${blurred && selected !== index ? 'is-blurred' : ''}`}
          >
            <div className="region-topline">
              <span className="region-action">
                {selected === index ? (
                  <Check size={13} />
                ) : (
                  <Crosshair size={13} />
                )}
                {selected === index ? 'In focus' : 'Focus area'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
