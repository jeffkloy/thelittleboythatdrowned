import React, { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __closeMobileMenu?: () => void;
    __selectPoemAndClose?: (fn?: () => void) => void;
  }
}

export type HeaderProps = {
  /**
   * Optional render function to inject mobile nav content (TagFilters + PoemList)
   * inside the drawer when open on small screens.
   */
  renderMobileNav?: (isOpen: boolean) => React.ReactNode;
};

/**
 * Header renders the brand, the mobile drawer toggle, and a drawer container used for
 * focus anchoring and outside-click closes. When renderMobileNav is provided, its content
 * is rendered inside the drawer on mobile when open.
 */
export default function Header({ renderMobileNav }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    // Keep aria-expanded in sync for diagnostics
    if (btnRef.current) {
      btnRef.current.setAttribute('aria-expanded', String(open));
    }
  }, [open]);

  // Focus management
  useEffect(() => {
    if (open) {
      const first = navRef.current?.querySelector<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
      first?.focus?.();
    } else {
      btnRef.current?.focus?.();
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Ensure clicks inside the drawer never bubble to the scrim
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;
    const stop = (e: Event) => e.stopPropagation();
    navEl.addEventListener('click', stop);
    navEl.addEventListener('mousedown', stop);
    navEl.addEventListener('touchstart', stop, { passive: true });
    return () => {
      navEl.removeEventListener('click', stop);
      navEl.removeEventListener('mousedown', stop);
      navEl.removeEventListener('touchstart', stop);
    };
  }, []);


  // Keyboard on toggle
  const onToggleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(v => !v);
    }
  }, []);

  // Global closer for mobile (used by Poem selection)
  useEffect(() => {
    window.__closeMobileMenu = () => setOpen(false);
    return () => { delete window.__closeMobileMenu; };
  }, []);

  // Expose a global that both closes the menu and refocuses the toggle (used by delegated handlers)
  useEffect(() => {
    (window as any).__selectPoemAndClose = (fn?: () => void) => {
      try { if (typeof fn === 'function') fn(); } finally {
        setOpen(false);
        // Return focus to the toggle for accessibility
        btnRef.current?.focus?.();
      }
    };
    return () => { delete (window as any).__selectPoemAndClose; };
  }, []);

  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <div className="brand">
          <h1 className="brand__title">The Little Boy That Drowned</h1>
          <p className="brand__subtitle">Intimate verses on love, loss, and the quiet spaces between</p>
        </div>

        <button
          ref={btnRef}
          className="nav-toggle"
          type="button"
          aria-controls="site-nav"
          aria-expanded={open}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen(v => !v)}
          onKeyDown={onToggleKeyDown}
        >
          <span className="visually-hidden">Menu</span>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Drawer container (used for focus and hit testing on mobile) */}
      <nav
        ref={navRef}
        id="site-nav"
        className={`site-nav ${open ? 'open' : ''}`}
        role="navigation"
        aria-label="Primary"
      >
        {/* Render mobile nav content when open, if provided */}
        {renderMobileNav ? renderMobileNav(open) : null}
      </nav>
      {/* Scrim must be below the toggle and drawer; CSS z-index ensures correct stacking */}
      <div className="menu-scrim" hidden={!open} onClick={() => { setOpen(false); setTimeout(() => btnRef.current?.focus?.(), 0); }} />
    </header>
  );
}