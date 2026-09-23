import { ArrowUpRight, Check, Crosshair } from 'lucide-react';

export const regions = ['Overview', 'Notes', 'Connections'] as const;

function Lines({ short = false }: { short?: boolean }) {
  return (
    <div
      className={`skeleton-lines ${short ? 'short' : ''}`}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
    </div>
  );
}

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
            className={`document-region region-${index} ${selected === index ? 'is-selected' : ''} ${blurred && selected !== index ? 'is-blurred' : ''}`}
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
            {index === 0 && (
              <div className="outline-content">
                <div className="skeleton-title" />
                <Lines />
                <div className="skeleton-tags">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
            {index === 1 && (
              <div className="outline-content">
                <div className="skeleton-subtitle" />
                <div className="outline-note">
                  <span />
                  <Lines short />
                </div>
                <div className="outline-note">
                  <span />
                  <Lines short />
                </div>
              </div>
            )}
            {index === 2 && (
              <div className="outline-content">
                <div className="skeleton-subtitle" />
                <div className="connection-map" aria-hidden="true">
                  <div className="map-node main-node">
                    <i />
                  </div>
                  <span className="map-line" />
                  <div className="map-branches">
                    <div className="map-node">
                      <i />
                    </div>
                    <div className="map-node">
                      <i />
                    </div>
                  </div>
                  <ArrowUpRight size={15} />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
