import React, { useState } from 'react';
import { usePatisserie } from '../context/PatisserieContext';
import { UI_TRANSLATIONS } from '../data/patisserieData';
import { ShoppingBag, Flame, Menu, X, ChevronDown } from 'lucide-react';
import { Language, Currency } from '../types/patisserie';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    cartItemCount,
    openDrawer,
  } = usePatisserie();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currDropdownOpen, setCurrDropdownOpen] = useState(false);

  const t = UI_TRANSLATIONS[language];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
    { code: 'CHF', symbol: 'CHF', label: 'CHF' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    setCurrDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeDropdowns = () => {
    setLangDropdownOpen(false);
    setCurrDropdownOpen(false);
  };

  return (
    <>
      {/* Outside click dismiss overlay for dropdowns */}
      {(langDropdownOpen || currDropdownOpen) && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={closeDropdowns}
        />
      )}

      <header className="sticky top-0 z-40 w-full glass-patisserie transition-all duration-300">
        {/* Pulsing oven broadcast ribbon — clickable to live schedule */}
        <button
          type="button"
          onClick={() => scrollTo('live-schedule')}
          className="w-full bg-espresso-deep text-butter-light text-xs font-medium py-1.5 px-4 text-center tracking-wider flex items-center justify-center gap-2 border-b border-espresso-warm/40 hover:bg-espresso-warm transition-colors focus:outline-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-butter"></span>
          </span>
          <Flame className="w-3.5 h-3.5 text-butter animate-pulse" />
          <span className="font-sans font-semibold tracking-wide">
            {t.ovenLiveBanner}
          </span>
          <span className="hidden md:inline text-white/50 text-[11px] ml-2">
            • Four à sol 215°C • Paris VIIe →
          </span>
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Identity */}
            <a
              href="#"
              className="group flex flex-col focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-espresso-deep group-hover:text-terracotta transition-colors">
                MAISON DORÉE
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.22em] text-patisserie-muted uppercase font-sans font-semibold -mt-1">
                {t.brandTagline}
              </span>
            </a>

            {/* Middle: Desktop Navigation links */}
            <nav className="hidden xl:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-espresso-deep/80">
              <button
                onClick={() => scrollTo('live-schedule')}
                className="hover:text-terracotta transition-colors py-2 focus:outline-none"
              >
                {t.allCategories}
              </button>
              <button
                onClick={() => scrollTo('box-calculator')}
                className="hover:text-terracotta transition-colors py-2 focus:outline-none text-terracotta flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
                {t.boxCalculatorTitle.split('&')[0]}
              </button>
              <button
                onClick={() => scrollTo('sensory-wheel')}
                className="hover:text-terracotta transition-colors py-2 focus:outline-none"
              >
                {t.radarTitle.split('&')[0]}
              </button>
              <button
                onClick={() => scrollTo('craft-lamination')}
                className="hover:text-terracotta transition-colors py-2 focus:outline-none"
              >
                {t.laminationTitle.split(':')[0]}
              </button>
              <button
                onClick={() => scrollTo('access-map')}
                className="hover:text-terracotta transition-colors py-2 focus:outline-none"
              >
                {t.mapHubTitle.split('—')[0]}
              </button>
            </nav>

            {/* Right: Currency, Language & Bag Drawer Trigger */}
            <div className="flex items-center space-x-2 sm:space-x-3 relative z-40">
              {/* Currency Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCurrDropdownOpen(!currDropdownOpen);
                    setLangDropdownOpen(false);
                  }}
                  className="tactile-chip px-2.5 py-1.5 rounded-full text-xs font-semibold text-espresso-deep flex items-center gap-1 border border-stone-300/40 hover:border-terracotta/40 transition-colors"
                  aria-label="Select Currency"
                >
                  <span>{currency}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>
                {currDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-28 bg-stone-ivory/98 backdrop-blur-md rounded-xl shadow-tactile-hover border border-stone-200 py-1.5 z-50 text-xs">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setCurrDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-creme-surface transition-colors ${
                          currency === c.code ? 'font-bold text-terracotta' : 'text-espresso-deep'
                        }`}
                      >
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setLangDropdownOpen(!langDropdownOpen);
                    setCurrDropdownOpen(false);
                  }}
                  className="tactile-chip px-2.5 py-1.5 rounded-full text-xs font-semibold text-espresso-deep flex items-center gap-1 border border-stone-300/40 hover:border-terracotta/40 transition-colors"
                  aria-label="Select Language"
                >
                  <span>{language}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-stone-ivory/98 backdrop-blur-md rounded-xl shadow-tactile-hover border border-stone-200 py-1.5 z-50 text-xs">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-creme-surface transition-colors ${
                          language === l.code ? 'font-bold text-terracotta' : 'text-espresso-deep'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bag Trigger Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="btn-magnetic relative flex items-center gap-2 bg-espresso-deep text-butter-light px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-tactile-subtle hover:bg-terracotta transition-all"
                aria-label={t.bagTitle}
              >
                <ShoppingBag className="w-4 h-4 text-butter" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                  {t.bagTitle.split(' ')[0]}
                </span>
                {cartItemCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-terracotta text-white rounded-full text-[11px] font-bold shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-espresso-deep rounded-lg hover:bg-creme-surface transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-stone-ivory/98 border-t border-stone-200/80 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <button
              onClick={() => scrollTo('live-schedule')}
              className="block w-full text-left py-2 text-sm font-semibold text-espresso-deep hover:text-terracotta"
            >
              {t.allCategories}
            </button>
            <button
              onClick={() => scrollTo('box-calculator')}
              className="block w-full text-left py-2 text-sm font-semibold text-terracotta"
            >
              {t.boxCalculatorTitle}
            </button>
            <button
              onClick={() => scrollTo('sensory-wheel')}
              className="block w-full text-left py-2 text-sm font-semibold text-espresso-deep hover:text-terracotta"
            >
              {t.radarTitle}
            </button>
            <button
              onClick={() => scrollTo('craft-lamination')}
              className="block w-full text-left py-2 text-sm font-semibold text-espresso-deep hover:text-terracotta"
            >
              {t.laminationTitle}
            </button>
            <button
              onClick={() => scrollTo('access-map')}
              className="block w-full text-left py-2 text-sm font-semibold text-espresso-deep hover:text-terracotta"
            >
              {t.mapHubTitle}
            </button>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
