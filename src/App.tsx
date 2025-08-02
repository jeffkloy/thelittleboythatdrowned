import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Particles from './components/Particles';
import Header from './components/Header';
import TagFilters from './components/TagFilters';
import PoemList from './components/PoemList';
import PoemView from './components/PoemView';
import { usePoems } from './hooks/usePoems';
import { addMdExtension, cleanPoemTitle } from './lib/urls';

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
  const { poems, tags, loading, error, lastUpdated } = usePoems();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set(['all']));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get selected poem from URL
  const poemParam = searchParams.get('poem');
  const analysisParam = searchParams.get('analysis');
  
  // Determine which parameter to use (analysis takes precedence if both are present)
  const activeParam = analysisParam || poemParam;
  const viewMode = analysisParam ? 'analysis' : 'poem';
  
  // Convert URL param to filename with .md extension
  const selectedFilename = activeParam ? addMdExtension(activeParam) : null;
  
  // Initialize selected poem from URL on mount
  useEffect(() => {
    if (activeParam && poems.length > 0) {
      // Validate that the poem exists (add .md extension for comparison)
      const filenameWithMd = addMdExtension(activeParam);
      const poemExists = poems.some(p => p.filename === filenameWithMd);
      if (!poemExists) {
        // Remove invalid poem/analysis from URL
        searchParams.delete('poem');
        searchParams.delete('analysis');
        setSearchParams(searchParams);
      }
    }
  }, [activeParam, poems, searchParams, setSearchParams]);

  // Prefetch next poem (safe enhancement) after selection
  function handleSelect(filename: string) {
    // Update URL with selected poem (remove .md extension)
    const cleanName = cleanPoemTitle(filename);
    setSearchParams({ poem: cleanName });
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
            <PoemView filename={selectedFilename} initialView={viewMode} />
          )}
        </main>
      </div>

      <footer className="site-footer">
        <p className="site-footer__text">
          © {new Date().getFullYear()} The Little Boy That Drowned
        </p>
        {lastUpdated && (
          <p className="site-footer__updated">
            Last updated: {lastUpdated}
          </p>
        )}
      </footer>
    </div>
  );
}
