
import React from 'react';

// Volver should scroll to top of the current page.
// If you later need navigation as well, pass a prop to enable it.
const TopNav = ({ logoSrc = '/saludcompartida logo WT.png', logoAlt = 'SaludCompartida', onBack }) => {
  // prefixed with underscore because it may be unused in some pages — keeps lint happy
  const _handleBack = () => {
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // If a caller provided an onBack callback (for example to change App state), call it.
    if (typeof onBack === 'function') {
      try {
        onBack();
      } catch (err) {
        // swallow errors from user-provided callbacks to avoid breaking the header
        console.error('TopNav onBack callback error:', err);
      }
    }
    // Intentionally do not navigate away by default so "Volver" always brings user to the top of the page.
    // If you still want to perform navigation after scrolling, call `onBack` from the caller directly.
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logoSrc} alt={logoAlt} className="h-12 object-contain" />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
