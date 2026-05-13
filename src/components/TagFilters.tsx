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
      { tag: 'all', label: 'All', count: total, active: active.has('all') },
      ...allTags.map((t) => ({ tag: t.tag, label: t.tag, count: t.count, active: active.has(t.tag) })),
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
    <>
      <p className="label" id="themes">
        <span className="num">01</span>Filter by theme
      </p>
      <div className="chips" role="group" aria-label="Filter poems by theme">
        {buttons.map((b) => (
          <button
            key={b.tag}
            type="button"
            className="chip"
            data-theme={b.tag}
            aria-pressed={b.active}
            onClick={() => toggle(b.tag)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(b.tag);
              }
            }}
          >
            {b.label} <span className="count">{b.count}</span>
          </button>
        ))}
      </div>
    </>
  );
}
