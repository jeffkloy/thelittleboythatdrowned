import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPoemUrl, cleanPoemTitle } from '../lib/urls';

export type PoemMeta = { filename: string; tags: string[]; chapter?: number };

const CHAPTERS = [
  { n: 1, title: 'Chapter I', years: '2009–2022' },
  { n: 2, title: 'Chapter II', years: '2025–2026' },
];

type Props = {
  poems: PoemMeta[];
  activeTags: Set<string>;
  activeFilename?: string | null;
  onSelect(filename: string): void;
};

export default function PoemList({ poems, activeTags, activeFilename, onSelect }: Props) {
  const filtered = useMemo(() => {
    if (activeTags.has('all') || activeTags.size === 0) return poems;
    return poems.filter((p) => (p.tags || []).some((t) => activeTags.has(t)));
  }, [poems, activeTags]);

  if (filtered.length === 0) {
    return (
      <>
        <p className="label" id="poems">
          <span className="num">02</span>The poems
        </p>
        <div className="no-results">No poems match the selected filters.</div>
      </>
    );
  }

  return (
    <>
      <p className="label" id="poems">
        <span className="num">02</span>The poems
      </p>
      {CHAPTERS.map((ch) => {
        const items = filtered.filter((p) => (p.chapter === 2 ? 2 : 1) === ch.n);
        if (items.length === 0) return null;
        return (
          <section key={ch.n} className="chapter" aria-labelledby={`chapter-${ch.n}`}>
            <h3 className="chapter-label" id={`chapter-${ch.n}`}>
              {ch.title} <span className="years">{ch.years}</span>
            </h3>
            <div className="index-grid" role="list">
              {items.map((p) => {
                const index = filtered.indexOf(p);
                const title = cleanPoemTitle(p.filename);
                const num = String(index + 1).padStart(2, '0');
                const isActive = activeFilename === p.filename;
                return (
                  <Link
                    key={p.filename}
                    to={getPoemUrl(p.filename)}
                    className={'index-item' + (isActive ? ' is-active' : '')}
                    role="listitem"
                    data-poem={title}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Read poem ${index + 1}: ${title}`}
                    onClick={() => onSelect(p.filename)}
                  >
                    <span className="n">{num}</span>
                    <span className="t">{title}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
