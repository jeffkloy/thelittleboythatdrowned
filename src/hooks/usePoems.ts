import { useEffect, useMemo, useState } from 'react';

export type PoemMeta = { filename: string; tags: string[] };
export type PoemsJson = { poems: PoemMeta[] };

export function usePoems() {
  const [data, setData] = useState<PoemsJson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function run() {
      setLoading(true);
      try {
        const base = new URL(import.meta.env.BASE_URL, window.location.origin);
        const poemsUrl = new URL('poems/poems.json', base).toString();
        const res = await fetch(poemsUrl, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`Failed to fetch poems.json (${res.status})`);
        const json = (await res.json()) as PoemsJson;
        if (!Array.isArray(json.poems)) throw new Error('Invalid poems.json format');
        if (alive) { setData(json); setError(null); }
      } catch (e: any) {
        if (alive) setError(e?.message || 'Unknown error fetching poems.json');
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => { alive = false; };
  }, []);

  const poems = useMemo(() => data?.poems ?? [], [data]);

  const tags = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of poems) for (const t of (p.tags || [])) counts[t] = (counts[t] || 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [poems]);

  return { poems, tags, loading, error };
}