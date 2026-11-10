import React, { useState, useRef, useCallback } from 'react';
import { usePatisserie } from '../context/PatisserieContext';
import { UI_TRANSLATIONS } from '../data/patisserieData';
import { Layers, Thermometer, Droplets, Clock, MoveHorizontal } from 'lucide-react';

export const LaminationComparer: React.FC = () => {
  const { language } = usePatisserie();
  const t = UI_TRANSLATIONS[language];

  // Split slider position (5 to 95%)
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSliderPos((p) => Math.max(5, p - 5));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSliderPos((p) => Math.min(95, p + 5));
    }
  };

  return (
    <section id="craft-lamination" className="py-16 sm:py-24 bg-stone-ivory select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter/40 border border-butter-gold/40 text-espresso-deep text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-terracotta" />
            <span>{t.craftHautePrecision}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-deep">
            {t.laminationTitle}
          </h2>
          <p className="text-sm sm:text-base text-patisserie-muted leading-relaxed">
            {t.laminationSubtitle}
          </p>
        </div>

        {/* Comparer Visual Canvas */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white cursor-ew-resize touch-none"
          >
            {/* Layer 2 (Bottom / Right): Baked Golden Honeycomb Alveoli */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80"
                alt="Feuilletage cuit doré et alvéoles croustillantes"
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Label Right */}
              <div className="absolute bottom-6 right-6 glass-dark px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-butter-light shadow-lg">
                🥐 {t.sliderAfter}
              </div>
            </div>

            {/* Layer 1 (Top / Left): Raw 27-Layer Tourage Dough, clipped cleanly using CSS clipPath */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
                alt="Pâte crue et tourage au beurre AOP d'Isigny"
                className="w-full h-full object-cover filter brightness-95"
                draggable={false}
              />
              {/* Label Left */}
              <div className="absolute bottom-6 left-6 glass-patisserie px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-espresso-deep shadow-lg">
                🧈 {t.sliderBefore}
              </div>
            </div>

            {/* Divider Line & Interactive Accessible Handle */}
            <div
              className="absolute inset-y-0 z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute inset-y-0 -ml-0.5 w-1 bg-white shadow-2xl" />
              <div
                role="slider"
                tabIndex={0}
                aria-valuenow={Math.round(sliderPos)}
                aria-valuemin={5}
                aria-valuemax={95}
                aria-label="Comparer pâte crue et feuilletage cuit"
                onKeyDown={handleKeyDown}
                className="pointer-events-auto absolute top-1/2 -mt-7 -ml-7 w-14 h-14 rounded-full bg-espresso-deep border-4 border-white text-butter shadow-xl flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-terracotta/40 transition-transform"
              >
                <MoveHorizontal className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            {/* Micro instruction pill */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-patisserie px-4 py-1.5 rounded-full text-[11px] font-semibold text-espresso-deep pointer-events-none shadow-sm flex items-center gap-1.5">
              <span>{t.dragToCompare}</span>
            </div>

          </div>

          {/* Artisan Deck Specifications Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-terracotta text-xs font-bold">
                <Clock className="w-4 h-4" />
                <span>{t.specFermentTitle}</span>
              </div>
              <p className="font-serif text-lg font-bold text-espresso-deep">36h – 48h</p>
              <p className="text-[11px] text-patisserie-muted">{t.specFermentDesc}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-terracotta text-xs font-bold">
                <Droplets className="w-4 h-4" />
                <span>{t.specHydrationTitle}</span>
              </div>
              <p className="font-serif text-lg font-bold text-espresso-deep">58% – 82%</p>
              <p className="text-[11px] text-patisserie-muted">{t.specHydrationDesc}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-terracotta text-xs font-bold">
                <Thermometer className="w-4 h-4" />
                <span>{t.specDeckTitle}</span>
              </div>
              <p className="font-serif text-lg font-bold text-espresso-deep">215°C – 240°C</p>
              <p className="text-[11px] text-patisserie-muted">{t.specDeckDesc}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-terracotta text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>{t.specButterTitle}</span>
              </div>
              <p className="font-serif text-lg font-bold text-espresso-deep">84% MG</p>
              <p className="text-[11px] text-patisserie-muted">{t.specButterDesc}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LaminationComparer;
