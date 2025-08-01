import React, { useMemo, useState } from 'react';
import Particles from './components/Particles';
import Header from './components/Header';
import TagFilters from './components/TagFilters';
import PoemList from './components/PoemList';
import PoemView from './components/PoemView';
import { usePoems } from './hooks/usePoems';

/** Shared nav content for both desktop sidebar and mobile drawer */
export function NavContent(props: {
  allTags: { tag: string; count: number }[];
  total: number;
  activeTags: Set<string>;
  setActiveTags: (s: Set<string>) => void;
  poems: { filename: string; tags: string[] }[];
  onSelect: (f: string) => void;
}) {
  const { allTags, total, activeTags, setActiveTags, poems, onSelect } = props;
  return (
    <>
      <TagFilters allTags={allTags} total={total} onChange={setActiveTags} />
      <PoemList poems={poems} activeTags={activeTags} onSelect={onSelect} />
    </>
  );
}

export default function App() {
  const { poems, tags, loading, error } = usePoems();
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set(['all']));
  const [selected, setSelected] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prefetch next poem (safe enhancement) after selection
  function handleSelect(filename: string) {
    setSelected(filename);
    // Close menu on mobile when poem is selected
    setIsMenuOpen(false);
    const idx = poems.findIndex((p: { filename: string; tags: string[] }) => p.filename === filename);
    const next = idx >= 0 && idx + 1 < poems.length ? poems[idx + 1].filename : null;
    if (next) {
      const base = new URL(import.meta.env.BASE_URL, window.location.origin);
      const url = new URL('poems/' + encodeURIComponent(next), base).toString();
      fetch(url).catch(() => void 0);
    }
  }

  const total = useMemo(() => poems.length, [poems]);

  // Mobile navigation content for Header
  const mobileNavContent = (
    <NavContent
      allTags={tags}
      total={total}
      activeTags={activeTags}
      setActiveTags={setActiveTags}
      poems={poems}
      onSelect={handleSelect}
    />
  );

  return (
    <div className="layout">
      <Header 
        navContent={mobileNavContent}
        isMenuOpen={isMenuOpen}
        onMenuToggle={setIsMenuOpen}
      />
      <Particles />

      {/* Single column on mobile, two columns on desktop */}
      <div className="layout-columns">
        <aside id="site-nav" className="site-nav" role="navigation" aria-label="Primary">
          <NavContent
            allTags={tags}
            total={total}
            activeTags={activeTags}
            setActiveTags={setActiveTags}
            poems={poems}
            onSelect={handleSelect}
          />
        </aside>

        <main id="main" className="poem-content" role="main">
          {loading ? (
            <article className="poem-display">
              <p className="loading">Loading poems...</p>
            </article>
          ) : error ? (
            <article className="poem-display">
              <p className="error">No poems found. Please ensure poems/poems.json exists.</p>
            </article>
          ) : (
            <PoemView filename={selected} />
          )}
        </main>
      </div>

      <footer className="site-footer">
        <p className="site-footer__text">© {new Date().getFullYear()} The Little Boy That Drowned</p>
      </footer>
    </div>
  );
}
