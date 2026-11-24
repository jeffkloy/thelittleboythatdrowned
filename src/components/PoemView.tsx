import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePoem } from '../hooks/usePoem';
import { cleanPoemTitle, TITULAR_FILENAME } from '../lib/urls';

const TIMELINE = [
  { year: '2007', text: 'The first lines, carried for years without being written down.' },
  { year: '2009', text: 'The first unrequited love begins.' },
  { year: '2020', text: 'The pandemic. The poems are finally written.' },
  { year: '2022', text: 'The first love ends.' },
  { year: '2023', text: 'A move across the country, from California to New York.' },
  { year: '2025', text: 'A second love, unrequited or mistaken. In August, this website opens.' },
  { year: '2026', text: 'The second love ends, and the collection is completed.' },
];

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
        <section className="prologue" aria-label="About this collection">
          <p className="label label--bare">
            <span className="num">✦</span>Prologue
          </p>
          <p>
            These poems began in 2020, in the long hush of the pandemic, when the world went quiet
            enough for old things to surface. Some had been waiting since 2007: lines carried for
            years and never set down until there was finally room to write them.
          </p>
          <p>
            This is the story of my autism and my Borderline Personality Disorder, and of how,
            together, they pulled me under, into major depression and then into addiction and a
            string of suicide attempts, while I lived through my first unrequited love. It lasted
            from 2009 until 2022, and in 2023, I moved across the country, from California to New
            York in search of new beginnings.
          </p>
          <p>
            Then the water rose again. The newer poems (the lighthouse, a partner's drinking, the
            futures planned, the fear of being abandoned, etc.) belong to a second love, unrequited
            or simply mistaken for cherishment, that lasted a year and a half, from 2025 into 2026.
          </p>
          <p className="prologue-coda">
            This is a story about a boy that almost fatally drowned. He went under more than once,
            but survived. The boy is still here, and these poems are what carried him back up.
          </p>
        </section>

        <aside className="content-note" aria-label="Content note and crisis resources">
          <p>
            <strong>A note before reading.</strong> These poems speak openly about suicide,
            self-harm, depression, and addiction. If you are struggling, you are not alone.
          </p>
          <ul>
            <li>
              <a href="tel:988">Call</a> or <a href="sms:988">text</a> <strong>988</strong>,
              the Suicide &amp; Crisis Lifeline
            </li>
            <li>
              Text <strong>HOME</strong> to <a href="sms:741741">741741</a>, the Crisis Text Line
            </li>
            <li>
              Call <a href="tel:18006624357">1-800-662-4357</a>, SAMHSA's free, confidential
              helpline for substance use
            </li>
            <li>
              In an emergency, call <a href="tel:911">911</a>, or <a href="tel:112">112</a> from any
              mobile phone
            </li>
          </ul>
        </aside>

        <section className="timeline" aria-labelledby="timeline-label">
          <p className="label" id="timeline-label">
            <span className="num">✦</span>Timeline
          </p>
          <ol>
            {TIMELINE.map((t) => (
              <li key={t.year}>
                <span className="year">{t.year}</span>
                <span className="event">{t.text}</span>
              </li>
            ))}
          </ol>
        </section>
        <p className="welcome-message">
          Select a poem from the list to begin your journey, or wander through the themes.
        </p>
        <p className="latest-poem-hint">
          Begin at the beginning ·{' '}
          <button
            type="button"
            className="latest-poem-link"
            onClick={() => onSelect(TITULAR_FILENAME)}
            aria-label={`Start from the beginning: ${cleanPoemTitle(TITULAR_FILENAME)}`}
          >
            {cleanPoemTitle(TITULAR_FILENAME)}
          </button>
        </p>
        {latestPoem && (
          <p className="latest-poem-hint">
            Or start with the resolution ·{' '}
            <button
              type="button"
              className="latest-poem-link"
              onClick={() => onSelect(latestPoem)}
              aria-label={`Read the resolution: ${cleanPoemTitle(latestPoem)}`}
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