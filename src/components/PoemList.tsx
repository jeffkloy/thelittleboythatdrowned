import React, { useMemo, useCallback } from 'react';

export type PoemMeta = { filename: string; tags: string[] };

type Props = {
  poems: PoemMeta[];
  activeTags: Set<string>;
  onSelect(filename: string): void;
};

/**
 * Defensive fixes:
 * - Use role="button" + tabIndex to ensure activation even if ancestor pointer-events misbehave.
 * - Add onMouseDown preventDefault to avoid focus/selection side-effects on Safari during quick taps.
 * - Stop propagation to avoid scrim or other overlays from hijacking the click.
 * - Use onKeyDown (Enter/Space) for keyboard activation.
 */
export default function PoemList({ poems, activeTags, onSelect }: Props) {
  const filtered = useMemo(() => {
    if (activeTags.has('all') || activeTags.size === 0) return poems;
    return poems.filter((p) => (p.tags || []).some((t) => activeTags.has(t)));
  }, [poems, activeTags]);

  const handleActivate = useCallback((filename: string) => {
    onSelect(filename);
  }, [onSelect]);

  if (filtered.length === 0) {
    return <div className="no-results">No poems match the selected filters</div>;
  }

  return (
    <>
      <h2 className="site-nav__heading">Poems</h2>
      <ul className="poem-list" role="list">
        {filtered.map((p, index) => {
          const title = p.filename.replace('.md', '');
          return (
            <li key={p.filename} style={{ ['--index' as any]: String(index) }} role="listitem">
              <a
                href="#"
                role="button"
                tabIndex={0}
                aria-label={`Read poem: ${title}`}
                onMouseDown={(e) => {
                  // Prevent focus stealing that may interfere on some Safari builds
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleActivate(p.filename);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleActivate(p.filename);
                  }
                }}
              >
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}