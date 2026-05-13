import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePoem } from '../hooks/usePoem';
import { cleanPoemTitle } from '../lib/urls';

type Props = {
  filename: string | null;
  initialView?: 'poem' | 'analysis';
  latestPoem?: string | null;
  position?: number | null;
  total?: number;
  tags?: string[];
  onSelect: (filename: string) => void;
};

export default function PoemView({
  filename,
  initialView = 'poem',
  latestPoem,
  position,
  total,
  tags,
  onSelect,
}: Props) {
  const { poem, analysis, loading, error } = usePoem(filename);
  const [view, setView] = useState<'poem' | 'analysis'>(initialView);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  useEffect(() => {
    const hasAnalysisParam = searchParams.has('analysis');
    setView(hasAnalysisParam ? 'analysis' : 'poem');
  }, [filename, searchParams]);

  const handleViewChange = useCallback(
    (newView: 'poem' | 'analysis') => {
      if (!filename) return;
      const cleanName = cleanPoemTitle(filename);
      if (newView === 'analysis') {
        setSearchParams({ analysis: cleanName });
      } else {
        setSearchParams({ poem: cleanName });
      }
      setView(newView);
    },
    [filename, setSearchParams]
  );

  const displayTitle = useMemo(() => {
    const raw = poem?.title ?? analysis?.title ?? (filename ? cleanPoemTitle(filename) : null);
    if (!raw) return null;
    return raw.replace(/^[“"”]+|[“"”]+$/g, '').trim();
  }, [poem, analysis, filename]);

  if (!filename) {
    return (
      <article id="poem-display" className="reader-empty" aria-live="polite">
        <p className="welcome-message">
          Select a poem from the list to begin your journey, or wander through the themes.
        </p>
        {latestPoem && (
          <p className="latest-poem-hint">
            Or start with the latest ·{' '}
            <button
              type="button"
              className="latest-poem-link"
              onClick={() => onSelect(latestPoem)}
              aria-label={`Read latest poem: ${cleanPoemTitle(latestPoem)}`}
            >
              {cleanPoemTitle(latestPoem)}
            </button>
          </p>
        )}
      </article>
    );
  }

  let bodyNode: React.ReactNode;
  if (loading) {
    bodyNode = <p className="loading">Loading poem</p>;
  } else if (error) {
    bodyNode = (
      <>
        <p className="error">Unable to load poem: {filename.replace('.md', '')}</p>
        <p className="error-detail">
          Please ensure you are viewing through a web server or on GitHub Pages.
        </p>
      </>
    );
  } else if (view === 'analysis' && analysis) {
    bodyNode = (
      <div
        className="analysis-body"
        dangerouslySetInnerHTML={{ __html: analysis.content }}
      />
    );
  } else if (poem) {
    bodyNode = (
      <div
        className="poem-body"
        dangerouslySetInnerHTML={{ __html: poem.content }}
      />
    );
  } else {
    bodyNode = (
      <div className="empty">
        This poem lives in the collection but its text isn't available yet.{' '}
        <strong>Try another title from the index.</strong>
      </div>
    );
  }

  const positionLabel =
    typeof position === 'number' && total
      ? `№ ${String(position).padStart(2, '0')} / ${total}`
      : null;

  return (
    <article id="poem-display" className="reader-article" aria-live="polite">
      <div className="reader-meta">
        <div className="left">
          {positionLabel && <span className="num">{positionLabel}</span>}
        </div>
        {tags && tags.length > 0 && (
          <div className="theme-tags">
            {tags.map((t) => (
              <span key={t} className="theme-tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {displayTitle && (
        <h2 className="poem-title">
          <span className="quote">“</span>
          {displayTitle}
          <span className="quote quote--right">”</span>
        </h2>
      )}

      <div className="title-divider" aria-hidden="true">
        <span className="bar"></span>
        <span className="bar butter"></span>
        <span className="meta">A poem · @jeffkloy</span>
      </div>

      <div className="tabs-wrap">
        <div className="tabs" role="tablist" aria-label="Poem view mode">
          <button
            type="button"
            role="tab"
            className="tab"
            data-tab="poem"
            aria-selected={view === 'poem'}
            onClick={() => handleViewChange('poem')}
          >
            Poem
          </button>
          <button
            type="button"
            role="tab"
            className="tab"
            data-tab="analysis"
            aria-selected={view === 'analysis'}
            onClick={() => handleViewChange('analysis')}
          >
            Analysis
          </button>
        </div>
      </div>

      {bodyNode}
    </article>
  );
}