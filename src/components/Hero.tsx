import React from 'react';

type Props = {
  total: number;
  themeCount: number;
  lastUpdated?: string | null;
};

export default function Hero({ total, themeCount, lastUpdated }: Props) {
  return (
    <section className="hero" role="banner">
      <span className="hero-blob" aria-hidden="true"></span>
      <span className="hero-blob two" aria-hidden="true"></span>
      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="line" aria-hidden="true"></span>
          <span className="by">
            A collection by <strong>@jeffkloy</strong>
          </span>
          <span className="tag">— ongoing</span>
        </div>
        <h1>
          The Little Boy<br />That <span className="drowned">Drowned</span>
        </h1>
        <div className="hero-sub">
          <p className="lede">
            Intimate verses on love, loss, addiction, belonging, and the quiet spaces in between.
          </p>
          <div className="meta">
            {lastUpdated && (
              <div>
                Updated <strong>{lastUpdated}</strong>
              </div>
            )}
            <div style={{ marginTop: 6 }}>
              {total} poems · {themeCount} themes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
