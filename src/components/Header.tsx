import React, { useEffect, useRef } from 'react';

type Props = {
  navContent?: React.ReactNode;
  isMenuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
};

/**
 * Header with mobile hamburger menu positioned above the title
 */
export default function Header({ navContent, isMenuOpen = false, onMenuToggle }: Props) {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close menu
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isMenuOpen) {
        onMenuToggle?.(false);
        menuButtonRef.current?.focus();
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Lock body scroll when menu is open
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
      {/* Floating mobile menu button */}
      <button
        ref={menuButtonRef}
        className="menu-toggle menu-toggle--floating"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-nav"
      >
        <span className="menu-toggle__line"></span>
        <span className="menu-toggle__line"></span>
        <span className="menu-toggle__line"></span>
      </button>

      <header className="site-header" role="banner">
        <div className="site-header__inner">
          <div className="brand">
            <h1 className="brand__title">The Little Boy That Drowned</h1>
            <p className="brand__subtitle">Intimate verses on love, loss, addiction, belonging, and the quiet spaces in between: a collection of poems by @jeffkloy</p>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <div className={`mobile-nav-wrapper ${isMenuOpen ? 'is-open' : ''}`}>
        {/* Backdrop */}
        <div 
          className="mobile-nav-backdrop" 
          onClick={closeMenu}
          aria-hidden="true"
        />
        
        {/* Navigation drawer */}
        <nav 
          ref={menuRef}
          id="mobile-nav" 
          className="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <button
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