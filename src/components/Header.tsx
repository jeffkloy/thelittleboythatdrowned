import React from 'react';

/**
 * Header renders the brand only. No mobile menu needed.
 */
export default function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <div className="brand">
          <h1 className="brand__title">The Little Boy That Drowned</h1>
          <p className="brand__subtitle">Intimate verses on love, loss, and the quiet spaces between</p>
        </div>
      </div>
    </header>
  );
}