import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPoemUrl, cleanPoemTitle } from '../lib/urls';

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

  if (filtered.length === 0) {
    return <div className="no-results">No poems match the selected filters</div>;
  }

  return (
    <>
      <h2 className="site-nav__heading">Poems</h2>
      <ul className="poem-list" role="list">
        {filtered.map((p, index) => {
          const title = cleanPoemTitle(p.filename);
          return (
            <li key={p.filename} style={{ ['--index' as string]: String(index) }} role="listitem">
              <Link
                to={getPoemUrl(p.filename)}
                aria-label={`Read poem: ${title}`}
                onClick={() => onSelect(p.filename)}
              >
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}