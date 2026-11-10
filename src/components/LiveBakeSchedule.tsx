import React, { useState } from 'react';
import { usePatisserie } from '../context/PatisserieContext';
import { SIGNATURE_PASTRIES, UI_TRANSLATIONS, formatPrice, BAKE_WAVES } from '../data/patisserieData';
import { Category, BakeStatus } from '../types/patisserie';
import { ResponsiveImage } from './ResponsiveImage';
import { Flame, Clock, ShieldAlert, Check, ArrowRight } from 'lucide-react';

export const LiveBakeSchedule: React.FC = () => {
  const { language, currency, reservePastryQuick, activeAllergens } = usePatisserie();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [reservedAnimationId, setReservedAnimationId] = useState<string | null>(null);
  const [expandedPastryId, setExpandedPastryId] = useState<string | null>(null);
  const [reservedCounts, setReservedCounts] = useState<Record<string, number>>({});

  const t = UI_TRANSLATIONS[language];

  // Category filters
  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: t.allCategories },
    { id: 'viennoiserie', label: t.viennoiserie },
    { id: 'boulangerie', label: t.boulangerie },
    { id: 'patisserie', label: t.patisserie },
  ];

  // Filtered pastries
  const filteredPastries = SIGNATURE_PASTRIES.filter((pastry) => {
    // category check
    if (selectedCategory !== 'all' && pastry.category !== selectedCategory) {
      return false;
    }
    // active allergen filters check
    if (activeAllergens.length > 0) {
      const matchesAll = activeAllergens.every((tag) => pastry.allergens.includes(tag));
      if (!matchesAll) return false;
    }
    return true;
  });

  const handleReserve = (pastry: (typeof SIGNATURE_PASTRIES)[0]) => {
    setReservedAnimationId(pastry.id);
    setReservedCounts((prev) => ({
      ...prev,
      [pastry.id]: (prev[pastry.id] || 0) + 1,
    }));
    reservePastryQuick(pastry);
    setTimeout(() => {
      setReservedAnimationId(null);
    }, 1500);
  };

  const getStatusBadge = (status: BakeStatus, statusLabel: string) => {
    switch (status) {
      case 'just-out':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-terracotta/25 text-butter border border-terracotta/50 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-terracotta animate-pulse" />
            <span>{statusLabel}</span>
          </span>
        );
      case 'cooling':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-butter-gold border border-butter/30 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-butter" />
            <span>{statusLabel}</span>
          </span>
        );
      case 'in-deck':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-terracotta/20 text-terracotta border border-terracotta/40 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-terracotta" />
            <span>{statusLabel}</span>
          </span>
        );
      case 'limited':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/70 text-rose-300 border border-rose-500/40 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>{statusLabel}</span>
          </span>
        );
      case 'sold-out':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-espresso-deep/80 text-patisserie-muted border border-stone-700/50">
            <span>{statusLabel}</span>
          </span>
        );
    }
  };

  return (
    <section id="live-schedule" className="py-16 sm:py-24 bg-creme-surface/60 border-t border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter/40 border border-butter-gold/40 text-espresso-deep text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-terracotta" />
            <span>{t.directFromHearth}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-deep">
            {t.liveScheduleTitle}
          </h2>
          <p className="text-sm sm:text-base text-patisserie-muted leading-relaxed">
            {t.liveScheduleSubtitle}
          </p>
        </div>

        {/* Live Morning Bake Wave Timeline Tracker */}
        <div className="bg-white p-5 rounded-3xl shadow-tactile-subtle border border-stone-200 overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="flex items-center justify-between text-xs font-semibold text-patisserie-muted pb-3 mb-3 border-b border-stone-100">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.todayWaves}
              </span>
              <span className="text-[11px] text-terracotta font-bold">{t.updatedMinutesAgo}</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {BAKE_WAVES.map((wave, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs transition-all ${
                    wave.status === 'current'
                      ? 'bg-amber-50 border-butter-gold shadow-sm scale-[1.02]'
                      : wave.status === 'completed'
                      ? 'bg-stone-50 border-stone-200 opacity-80'
                      : 'bg-white border-dashed border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="font-serif text-sm text-espresso-deep">{wave.time}</span>
                    {wave.status === 'current' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-terracotta text-white">
                        {t.waveInProgress}
                      </span>
                    )}
                    {wave.status === 'completed' && (
                      <Check className="w-3 h-3 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-patisserie-muted leading-snug line-clamp-2">
                    {wave.name[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tactile Category Filter Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-espresso-deep text-butter-light shadow-md'
                  : 'bg-white text-espresso-deep hover:bg-stone-100 border border-stone-200 shadow-tactile-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pastries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPastries.map((pastry) => {
            const isSoldOut = pastry.status === 'sold-out';
            const isReservedRecently = reservedAnimationId === pastry.id;

            return (
              <div
                key={pastry.id}
                className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-tactile-subtle hover:shadow-tactile-hover transition-all duration-300 ${
                  isSoldOut ? 'opacity-70 grayscale-[20%]' : ''
                }`}
              >
                {/* Image Container with ResponsiveImage */}
                <div className="relative overflow-hidden">
                  <ResponsiveImage
                    src={pastry.image}
                    alt={pastry.imageAlt}
                    aspectRatio="4/3"
                    className="group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Badge top-left */}
                  {pastry.badge && (
                    <div className="absolute top-3 left-3 bg-espresso-deep/85 text-butter-light px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider backdrop-blur-sm shadow-sm">
                      {pastry.badge}
                    </div>
                  )}

                  {/* Price pill top-right - High-contrast luxury styling */}
                  <div className="absolute top-3 right-3 bg-espresso-deep/90 text-butter-light font-serif font-bold text-sm px-3 py-1 rounded-full shadow-md border border-butter/30 backdrop-blur-sm">
                    {formatPrice(pastry.priceEUR, currency)}
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Live Status indicator */}
                    <div>
                      {getStatusBadge(pastry.status, pastry.statusText[language])}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-espresso-deep group-hover:text-terracotta transition-colors leading-snug">
                      {pastry.name}
                    </h3>

                    <p className="text-xs text-patisserie-muted line-clamp-3 leading-relaxed">
                      {pastry.description[language]}
                    </p>
                  </div>

                  {/* Craft specifications mini-chips with interactive dossier expand */}
                  <div className="space-y-3 pt-2 border-t border-stone-200">
                    <div className="flex items-center justify-between gap-1.5 text-[10px] text-patisserie-muted font-medium">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-[#24160E] border border-butter/15 px-2 py-0.5 rounded-md text-butter-light">
                          {pastry.craftDetails.fermentationTime.split(' ')[0]} Ferment
                        </span>
                        <span className="bg-[#24160E] border border-butter/15 px-2 py-0.5 rounded-md text-butter-light">
                          {pastry.craftDetails.deckTemperature.split(' ')[0]}
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setExpandedPastryId(expandedPastryId === pastry.id ? null : pastry.id)}
                        className="text-[10px] font-bold text-terracotta hover:underline focus:outline-none"
                      >
                        {expandedPastryId === pastry.id ? 'Fermer' : 'Fiche Fournil +'}
                      </button>
                    </div>

                    {/* Interactive Expanded Craft Dossier */}
                    {expandedPastryId === pastry.id && (
                      <div className="p-3 rounded-2xl bg-creme-surface/90 border border-stone-200 text-[11px] space-y-1.5 text-stone-700">
                        <div className="flex justify-between">
                          <span className="text-patisserie-muted">Farine & Eau :</span>
                          <span className="font-semibold text-espresso-deep">{pastry.craftDetails.flourHydration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-patisserie-muted">Beurre :</span>
                          <span className="font-semibold text-espresso-deep">{pastry.craftDetails.butterOrigin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-patisserie-muted">Fermentation :</span>
                          <span className="font-semibold text-espresso-deep">{pastry.craftDetails.fermentationTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-patisserie-muted">Four à sol :</span>
                          <span className="font-semibold text-espresso-deep">{pastry.craftDetails.deckTemperature}</span>
                        </div>
                      </div>
                    )}

                    {/* Stock & Reserve Action Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] font-medium text-stone-600">
                        {isSoldOut || ((pastry.stockLeft ?? 0) - (reservedCounts[pastry.id] || 0) <= 0) ? (
                          <span className="text-stone-400 font-bold">{t.statusSoldOut}</span>
                        ) : (
                          <span>
                            {t.remainingStock}{' '}
                            <strong className="text-espresso-deep font-bold">
                              {Math.max(0, (pastry.stockLeft ?? 0) - (reservedCounts[pastry.id] || 0))} {t.piecesLeft}
                            </strong>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={isSoldOut || ((pastry.stockLeft ?? 0) - (reservedCounts[pastry.id] || 0) <= 0)}
                        onClick={() => handleReserve(pastry)}
                        className={`btn-magnetic px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSoldOut
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : isReservedRecently
                            ? 'bg-emerald-600 text-white'
                            : 'bg-terracotta hover:bg-terracotta-hover text-white shadow-sm'
                        }`}
                      >
                        {isReservedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.addedSuccess}</span>
                          </>
                        ) : (
                          <>
                            <span>{t.reserveBtn}</span>
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LiveBakeSchedule;
