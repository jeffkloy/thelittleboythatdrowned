import React, { useEffect, useMemo, useState } from 'react';
import { usePoem } from '../hooks/usePoem';

type Props = { filename: string | null };

export default function PoemView({ filename }: Props) {
  const { poem, analysis, loading, error } = usePoem(filename);
  const [view, setView] = useState<'poem' | 'analysis'>('poem');

  useEffect(() => setView('poem'), [filename]);

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
              <button className="toggle-btn" data-view="poem" onClick={() => setView('poem')}>Poem</button>
              <button className="toggle-btn active" data-view="analysis" onClick={() => setView('analysis')}>Analysis</button>
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
              <button className="toggle-btn active" data-view="poem" onClick={() => setView('poem')}>Poem</button>
              <button className="toggle-btn" data-view="analysis" onClick={() => setView('analysis')}>Analysis</button>
            </div>
          </div>
          <div className="poem-text" dangerouslySetInnerHTML={{ __html: poem.content }} />
        </>
      );
    }
    return <p className="welcome-message">Select a poem from the list to begin your journey</p>;
  }, [loading, error, poem, analysis, view, filename]);

  return (
    <article id="poem-display" className="poem-display" aria-live="polite">
      {content}
    </article>
  );
}