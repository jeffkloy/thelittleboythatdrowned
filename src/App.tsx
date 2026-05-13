import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import TagFilters from './components/TagFilters';
import PoemList from './components/PoemList';
import PoemView from './components/PoemView';
import { usePoems } from './hooks/usePoems';
import { addMdExtension, cleanPoemTitle } from './lib/urls';

type NavContentProps = {
  allTags: { tag: string; count: number }[];
  total: number;
  activeTags: Set<string>;
  setActiveTags: (s: Set<string>) => void;
  poems: { filename: string; tags: string[] }[];
  activeFilename: string | null;
  onSelect: (f: string) => void;
};

const TITULAR_FILENAME = 'How The Little Boy Drowned.md';

/** Shared nav content for both desktop sidebar and mobile drawer. */
export function NavContent({
  allTags,
  total,
  activeTags,
  setActiveTags,
  poems,
  activeFilename,
  onSelect,
}: NavContentProps) {
  return (
    <>
      <TagFilters allTags={allTags} total={total} onChange={setActiveTags} />

      <div className="intro" id="intro">
        <p className="label label--bare">
          <span className="num">✦</span>An introduction
        </p>
        <button
          type="button"
          className="intro-link"
          onClick={() => onSelect(TITULAR_FILENAME)}
          aria-label="Read the titular poem: How The Little Boy Drowned"
        >
          How The Little Boy Drowned
        </button>
        <p className="desc">Start here — the origin story of the collection.</p>
      </div>

      <PoemList
        poems={poems}
        activeTags={activeTags}
        activeFilename={activeFilename}
        onSelect={onSelect}
      />
    </>
  );
}

export default function App() {
  const { poems, tags, loading, error, lastUpdated, latestPoem } = usePoems();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set(['all']));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const poemParam = searchParams.get('poem');
  const analysisParam = searchParams.get('analysis');
  const activeParam = analysisParam || poemParam;
  const viewMode = analysisParam ? 'analysis' : 'poem';
  const selectedFilename = activeParam ? addMdExtension(activeParam) : null;

  useEffect(() => {
    if (activeParam && poems.length > 0) {
      const filenameWithMd = addMdExtension(activeParam);
      const poemExists = poems.some((p) => p.filename === filenameWithMd);
      if (!poemExists) {
        searchParams.delete('poem');
        searchParams.delete('analysis');
        setSearchParams(searchParams);
      }
    }
  }, [activeParam, poems, searchParams, setSearchParams]);

  function handleSelect(filename: string) {
    const cleanName = cleanPoemTitle(filename);
    setSearchParams({ poem: cleanName });
    setIsMenuOpen(false);
    const idx = poems.findIndex((p) => p.filename === filename);
    const next = idx >= 0 && idx + 1 < poems.length ? poems[idx + 1].filename : null;
    if (next) {
      const base = new URL(import.meta.env.BASE_URL, window.location.origin);
      const url = new URL('poems/' + encodeURIComponent(next), base).toString();
      fetch(url).catch(() => void 0);
    }
  }

  const total = useMemo(() => poems.length, [poems]);

  const selectedMeta = useMemo(() => {
    if (!selectedFilename) return null;
    const idx = poems.findIndex((p) => p.filename === selectedFilename);
    if (idx < 0) return null;
    return { position: idx + 1, tags: poems[idx].tags || [] };
  }, [poems, selectedFilename]);

  const navContent = (
    <NavContent
      allTags={tags}
      total={total}
      activeTags={activeTags}
      setActiveTags={setActiveTags}
      poems={poems}
      activeFilename={selectedFilename}
      onSelect={handleSelect}
    />
  );

  return (
    <div className="layout">
      <Header
        navContent={navContent}
        isMenuOpen={isMenuOpen}
        onMenuToggle={setIsMenuOpen}
      />

      <Hero total={total} themeCount={tags.length} lastUpdated={lastUpdated} />
      <Marquee />

      <main className="shell">
        <aside
          id="site-nav"
          className="sidebar"
          role="navigation"
          aria-label="Primary"
        >
          {navContent}
        </aside>

        <section className="reader" id="reader" role="main">
          {loading ? (
            <p className="loading">Loading poems</p>
          ) : error ? (
            <p className="error">No poems found. Please ensure poems/poems.json exists.</p>
          ) : (
            <PoemView
              filename={selectedFilename}
              initialView={viewMode}
              latestPoem={latestPoem}
              position={selectedMeta?.position ?? null}
              total={total}
              tags={selectedMeta?.tags}
              onSelect={handleSelect}
            />
          )}
        </section>
      </main>

      <footer className="site-footer" id="about">
        <div className="foot-grid">
          <div className="left">© {new Date().getFullYear()}</div>
          <div className="center">The Little Boy That Drowned</div>
          <div className="right">
            {lastUpdated ? `Last edit · ${lastUpdated}` : '@jeffkloy'}
          </div>
        </div>
      </footer>
    </div>
  );
}
