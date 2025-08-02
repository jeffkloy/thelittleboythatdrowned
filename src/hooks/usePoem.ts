import { useEffect, useState } from 'react';
import { parsePoemMarkdown, parseAnalysisMarkdown } from '../lib/markdown';
import { isValidFilename, sanitizeFilename } from '../lib/validation';

export type Parsed = { title: string; content: string };

export function usePoem(filename: string | null) {
  const [poem, setPoem] = useState<Parsed | null>(null);
  const [analysis, setAnalysis] = useState<Parsed | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!filename) {
        setPoem(null);
        setAnalysis(null);
        return;
      }
      
      // Validate filename to prevent path traversal
      if (!isValidFilename(filename)) {
        setError('Invalid filename');
        setPoem(null);
        setAnalysis(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const base = new URL(import.meta.env.BASE_URL, window.location.origin);
        
        // Sanitize filename before use
        const safeFilename = sanitizeFilename(filename);

        // Load poem
        const poemUrl = new URL('poems/' + encodeURIComponent(safeFilename), base).toString();
        const poemRes = await fetch(poemUrl, { credentials: 'same-origin' });
        if (!poemRes.ok) throw new Error(`Failed to load poem (${poemRes.status})`);
        const poemText = await poemRes.text();
        const parsedPoem = parsePoemMarkdown(poemText);
        if (!alive) return;
        setPoem(parsedPoem);

        // Background-load analysis
        const name = safeFilename.replace(/\.md$/, '');
        const analysisUrl = new URL('analyses/' + encodeURIComponent(name) + ' - Analysis.md', base).toString();
        fetch(analysisUrl, { credentials: 'same-origin' })
          .then(async (r) => (r.ok ? r.text() : null))
          .then((text) => {
            if (!alive || !text) return;
            setAnalysis(parseAnalysisMarkdown(text));
          })
          .catch(() => void 0);
      } catch (e) {
        if (alive) setError((e instanceof Error ? e.message : String(e)) || 'Unknown error loading poem');
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [filename]);

  return { poem, analysis, loading, error };
}