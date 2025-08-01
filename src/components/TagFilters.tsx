import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  allTags: { tag: string; count: number }[];
  total: number;
  onChange(active: Set<string>): void;
};

export default function TagFilters({ allTags, total, onChange }: Props) {
  const [active, setActive] = useState<Set<string>>(new Set(['all']));

  useEffect(() => {
    onChange(new Set(active));
  }, [active, onChange]);

  const buttons = useMemo(
    () => [
      { tag: 'all', count: total, active: active.has('all') },
      ...allTags.map((t) => ({ tag: t.tag, count: t.count, active: active.has(t.tag) })),
    ],
    [allTags, total, active]
  );

  function toggle(tag: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (tag === 'all') return new Set(['all']);
      if (next.has('all')) next.delete('all');
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      if (next.size === 0) next.add('all');
      return next;
    });
  }

  return (
    <div className="tag-filters" role="group" aria-label="Filter poems by tag">
      <h2 className="site-nav__heading">Filter by Theme</h2>
      <div className="tag-buttons">
        {buttons.map((b) => (
          <button
            key={b.tag}
            className={'tag-button' + (b.active ? ' active' : '')}
            data-tag={b.tag}
            aria-pressed={b.active}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const closeAndSelect = (window as any).__selectPoemAndClose as undefined | ((fn?: () => void) => void);
              if (typeof closeAndSelect === 'function') {
                closeAndSelect(() => toggle(b.tag));
              } else {
                toggle(b.tag);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                const closeAndSelect = (window as any).__selectPoemAndClose as undefined | ((fn?: () => void) => void);
                if (typeof closeAndSelect === 'function') {
                  closeAndSelect(() => toggle(b.tag));
                } else {
                  toggle(b.tag);
                }
              }
            }}
          >
            {b.tag === 'all' ? `All (${b.count})` : `${b.tag} (${b.count})`}
          </button>
        ))}
      </div>
    </div>
  );
}