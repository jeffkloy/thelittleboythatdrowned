import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePoem } from '../hooks/usePoem';
import { cleanPoemTitle } from '../lib/urls';

type Props = {
  filename: string | null;
  initialView?: 'poem' | 'analysis';
  latestPoem?: string | null;
  onSelect: (filename: string) => void;
};

export default function PoemView({ filename, initialView = 'poem', latestPoem, onSelect }: Props) {
  const { poem, analysis, loading, error } = usePoem(filename);
  const [view, setView] = useState<'poem' | 'analysis'>(initialView);
  const [searchParams, setSearchParams] = useSearchParams();

  // Update view state when initialView changes (URL change)
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Update view state when filename changes (different poem selected)
  useEffect(() => {
    // When switching poems, default back to poem view unless URL specifies analysis
    const hasAnalysisParam = searchParams.has('analysis');
    setView(hasAnalysisParam ? 'analysis' : 'poem');
  }, [filename, searchParams]);

  // Handle view toggle and update URL
  const handleViewChange = useCallback((newView: 'poem' | 'analysis') => {
    if (!filename) return;
    
    const cleanName = cleanPoemTitle(filename);
    if (newView === 'analysis') {
      setSearchParams({ analysis: cleanName });
    } else {
      setSearchParams({ poem: cleanName });
    }
    setView(newView);
  }, [filename, setSearchParams]);

  const content = useMemo(() => {
    if (loading) return <p className="loading">Loading poem</p>;
    if (error) {
      return (
        <>
          <p className="error">Unable to load poem: {filename?.replace('.md', '')}</p>
          <p className="error-detail">Please ensure you are viewing through a web server or on GitHub Pages.</p>
        </>
      );
    }
    if (view === 'analysis' && analysis) {
      return (
        <>
          <div className="content-header">
            <h2>{analysis.title}</h2>
            <div className="view-toggle">
              <button className="toggle-btn" data-view="poem" onClick={() => handleViewChange('poem')}>Poem</button>
              <button className="toggle-btn active" data-view="analysis" onClick={() => handleViewChange('analysis')}>Analysis</button>
            </div>
          </div>
          <div className="analysis-text" dangerouslySetInnerHTML={{ __html: analysis.content }} />
        </>
      );
    }
    if (poem) {
      return (
        <>
          <div className="content-header">
            <h2>{poem.title}</h2>
            <div className="view-toggle">
              <button className="toggle-btn active" data-view="poem" onClick={() => handleViewChange('poem')}>Poem</button>
              <button className="toggle-btn" data-view="analysis" onClick={() => handleViewChange('analysis')}>Analysis</button>
            </div>
          </div>
          <div className="poem-text" dangerouslySetInnerHTML={{ __html: poem.content }} />
        </>
      );
    }
    return (
      <>
        <p className="welcome-message">Select a poem from the list to begin your journey</p>
        {latestPoem && (
          <p className="latest-poem-hint">
            Or start with the latest:{' '}
            <button
              className="latest-poem-link"
              onClick={() => onSelect(latestPoem)}
              aria-label={`Read latest poem: ${latestPoem.replace('.md', '')}`}
            >
              {latestPoem.replace('.md', '')}
            </button>
          </p>
        )}
      </>
    );
  }, [loading, error, poem, analysis, view, filename, handleViewChange, latestPoem, onSelect]);

  return (
    <article id="poem-display" className="poem-display" aria-live="polite">
      {content}
    </article>
  );
}