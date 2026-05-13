import React, { useEffect, useRef } from 'react';

type Props = {
  navContent?: React.ReactNode;
  isMenuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
};

/**
 * Floating mobile menu button + slide-in drawer.
 * The visual site identity lives in <Hero/>, not here.
 */
export default function Header({ navContent, isMenuOpen = false, onMenuToggle }: Props) {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isMenuOpen) {
        onMenuToggle?.(false);
        menuButtonRef.current?.focus();
      }
    }
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, onMenuToggle]);

  function toggleMenu() {
    onMenuToggle?.(!isMenuOpen);
  }
  function closeMenu() {
    onMenuToggle?.(false);
    menuButtonRef.current?.focus();
  }

  return (
    <>
      <button
        ref={menuButtonRef}
        className="menu-toggle menu-toggle--floating"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-nav"
        type="button"
      >
        <span className="menu-toggle__line"></span>
        <span className="menu-toggle__line"></span>
        <span className="menu-toggle__line"></span>
      </button>

      <div className={`mobile-nav-wrapper ${isMenuOpen ? 'is-open' : ''}`}>
        <div
          className="mobile-nav-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
        <nav
          ref={menuRef}
          id="mobile-nav"
          className="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            className="mobile-nav__close"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            ×
          </button>
          {navContent}
        </nav>
      </div>
    </>
  );
}
